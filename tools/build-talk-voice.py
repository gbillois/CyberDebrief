#!/usr/bin/env python3
"""Record the narration of the talk: one MP3 per scene, from the `vo` lines of ai-talk.html.

Two voices, both from Kokoro-82M (Apache 2.0, runs offline on a laptop):
the narrator (af_heart), and a second voice (bm_george) for the words quoted
in the script (the scam text, what the agents wrote). Writes
assets/ai/voice/*.mp3 and assets/ai/voice/narration.js (file, length and the
start of each sentence, so the sleek edition can turn its steps in time).
Files are named after a hash of their text: run it again after editing the
script and only the scenes that changed are recorded again.

    pip install kokoro-onnx soundfile
    # kokoro-v1.0.onnx and voices-v1.0.bin, from huggingface.co/fastrtc/kokoro-onnx
    python3 tools/build-talk-voice.py path/to/kokoro-folder
"""
import hashlib, json, re, sys
from pathlib import Path
import numpy as np
import soundfile as sf

root = Path(__file__).resolve().parent.parent
out = root / 'assets/ai/voice'
NARRATOR, QUOTE, SPEED = ('af_heart', 'en-us'), ('bm_george', 'en-gb'), 0.96
GAP_WORD, GAP_SENT, GAP_VOICE = 0.14, 0.34, 0.22

# how a few words should sound (the screen keeps its spelling)
SAY = [(r'OH MY GOD', 'Oh my God'), (r'GPT-(\d)', r'GPT \1'), (r'GLM-(\d)', r'GLM \1'), (r'\bGo2\b', 'Go two'), (r'’', "'")]

def scenes():
    src = (root / 'ai-talk.html').read_text(encoding='utf-8')
    body = src[src.index('const SCENES = ['):]
    for chunk in re.split(r'\n\{ ch: ', body)[1:]:
        t, v = re.search(r"title: '((?:[^'\\]|\\.)*)'", chunk), re.search(r'\n  vo: `([^`]*)`', chunk)
        if t and v: yield t.group(1).replace("\\'", "'"), v.group(1).strip()

def chunks(text):
    """(voice, text, starts a sentence) in reading order"""
    segs = []
    for i, part in enumerate(re.split(r'([“"][^”"]*[”"])', text)):
        if not part.strip(): continue
        if i % 2 == 1 and len(part.split()) >= 5: segs.append([QUOTE, part[1:-1].strip()]); continue
        if i % 2 == 1: part = part[1:-1]            # a short quote stays in the narrator's sentence
        if segs and segs[-1][0] == NARRATOR: segs[-1][1] += part
        else: segs.append([NARRATOR, part])
    res, new = [], True
    for voice, part in segs:
        for s in re.split(r'(?<=[.!?])\s+(?=[A-Z0-9“"])', part.strip()):
            if not re.search(r'\w', s): new = new or bool(re.search(r'[.!?]', s)); continue
            res.append((voice, s.strip(' ,') if voice == QUOTE else s.strip(), new))
            new = bool(re.search(r'[.!?][”"]?$', s.strip()))
    return res

def main(model_dir):
    from kokoro_onnx import Kokoro
    k = Kokoro(str(Path(model_dir) / 'kokoro-v1.0.onnx'), str(Path(model_dir) / 'voices-v1.0.bin'))
    out.mkdir(parents=True, exist_ok=True)
    manifest, keep = {}, set()
    old = {}
    if (out / 'narration.json').exists(): old = json.loads((out / 'narration.json').read_text())
    for title, vo in scenes():
        h = hashlib.sha1(json.dumps([vo, NARRATOR, QUOTE, SPEED, SAY]).encode()).hexdigest()[:10]
        name = f'v-{h}.mp3'; keep.add(name)
        if (out / name).exists() and old.get(title, {}).get('f', '').endswith(name):
            manifest[title] = old[title]; continue
        pcm, starts, t, sr, prev = [], [], 0.0, 24000, None
        for voice, text, new in chunks(vo):
            for a, b in SAY: text = re.sub(a, b, text)
            gap = 0 if prev is None else (GAP_SENT if new else GAP_WORD) + (GAP_VOICE if voice != prev else 0)
            pcm.append(np.zeros(int(gap * sr), dtype=np.float32)); t += gap
            if new: starts.append(round(t, 2))
            a, sr = k.create(text, voice=voice[0], speed=SPEED, lang=voice[1])
            pcm.append(a.astype(np.float32)); t += len(a) / sr; prev = voice
        pcm.append(np.zeros(int(.25 * sr), dtype=np.float32))
        sf.write(out / name, np.concatenate(pcm), sr, format='MP3')
        manifest[title] = {'f': f'assets/ai/voice/{name}', 'd': round(t, 2), 'b': starts}
        print(f'{t:6.1f}s  {title}')
    for f in out.glob('v-*.mp3'):
        if f.name not in keep: f.unlink()
    (out / 'narration.json').write_text(json.dumps(manifest, indent=1, ensure_ascii=False))
    js = ('// Narration of the talk, recorded by tools/build-talk-voice.py (Kokoro-82M voices).\n'
          '// Per scene: the MP3, its length and the start of each sentence, in seconds.\n'
          f'const NARR = {json.dumps(manifest, ensure_ascii=False)};\n')
    (out / 'narration.js').write_text(js, encoding='utf-8')
    print(f'{len(manifest)} scenes, {sum(m["d"] for m in manifest.values()) / 60:.1f} min')

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '.')
