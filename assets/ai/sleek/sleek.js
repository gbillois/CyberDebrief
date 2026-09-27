// Sleek edition: extra photos, and the motion layer (words that rise into
// focus, a giant numeral on chapter cards). Inlined by tools/build-talk-sleek.py
// after the photo set, before the first scene is drawn.

// a few more screens get a photo on the dark stage
const SLEEKSET = {
  '16 July 2026': { bg: PH('racks', 'dark') },
  'No attacker': { bg: PH('servers', 'dark') },
  'Two kinds of risk': { bg: PH('keyboard', 'dark', '50% 30%') },
};
SCENES.forEach(s => { const p = SLEEKSET[s.title]; if (p && p.bg && !s.bg) s.bg = p.bg; });

const SK_WORDS = '.h, .chap-q, .rc-a, .fin-a, .ug-h, .cl-a, .doc-title, .wd-t, .ask-q, .cr2-h, .dt-sub';
function skSplit(el) {
  if (el.dataset.skw) return; el.dataset.skw = 1;
  let i = 0;
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const parts = n.textContent.split(/(\s+)/);
        if (parts.every(p => !p.trim())) return;
        const frag = document.createDocumentFragment();
        parts.forEach(p => {
          if (!p) return;
          if (!p.trim()) { frag.appendChild(document.createTextNode(p)); return; }
          const w = document.createElement('span'); w.className = 'sk-w'; w.style.setProperty('--i', i++); w.textContent = p; frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !/^(svg|sup|br)$/i.test(n.tagName) && !n.classList.contains('count')) walk(n);
    });
  };
  walk(el);
}
function skDress(scene) {
  scene.querySelectorAll(SK_WORDS).forEach(skSplit);
  const k = scene.querySelector('.chap-k'), c = scene.querySelector('.chap2');
  if (k && c && !c.querySelector('.sk-num')) {
    const m = k.textContent.match(/Part\s+(\d+)/);
    if (m) c.insertAdjacentHTML('afterbegin', `<div class="sk-num" aria-hidden="true">${String(m[1]).padStart(2, '0')}</div>`);
  }
}
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1 && n.classList.contains('scene')) skDress(n); })))
  .observe(document.getElementById('stage'), { childList: true });

// ─── Opening: credits and a 20-second score ─────────────────────────────
// Optional, from a button on the title screen (or the I key): the score,
// synthesised live with Web Audio (no file, works offline), and the credits:
// a log typed at 03:12, the title slammed in on the impact, then the stage
// fades up on the title screen. Any key skips the credits (the music plays on
// and fades when the title is left), Esc skips both, A mutes the music.
const SK_INTRO = [
  ['16.07.2026 · 03:12 UTC', 0.7],
  ['hf-prod · unusual outbound traffic', 1.9],
  ['source · a model under evaluation', 3.1],
  ['status · <b>outside its sandbox</b>', 4.3],
];
const SK_T = { glitch: 5.9, pres: 6.4, letters: 8.9, hit: 11.6, sub: 12.6, out: 16.2 };
let skAudio = null, skMuted = false;

function skScore() {
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
  const ac = new AC(), t0 = ac.currentTime + 0.05;
  const master = ac.createGain(); master.gain.value = skMuted ? 0 : 0.8;
  const comp = ac.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
  master.connect(comp); comp.connect(ac.destination);
  // a long dark hall
  const verb = ac.createConvolver(), len = ac.sampleRate * 4.5, ir = ac.createBuffer(2, len, ac.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
  verb.buffer = ir; const wet = ac.createGain(); wet.gain.value = 0.55; verb.connect(wet); wet.connect(master);
  const bus = (dry = 1, send = 0.5) => { const g = ac.createGain(); const d = ac.createGain(); d.gain.value = dry; const s = ac.createGain(); s.gain.value = send; g.connect(d); d.connect(master); g.connect(s); s.connect(verb); return g; };
  const env = (g, pts) => { g.gain.setValueAtTime(0, t0); pts.forEach(([t, v, lin]) => lin ? g.gain.linearRampToValueAtTime(v, t0 + t) : g.gain.setTargetAtTime(v, t0 + t, 0.35)); };
  const noise = sec => { const b = ac.createBuffer(1, ac.sampleRate * sec, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const n = ac.createBufferSource(); n.buffer = b; return n; };
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);

  // 1. the drone: A1, two detuned saws under a slowly opening filter
  const dr = bus(0.8, 0.4), lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 6;
  lp.frequency.setValueAtTime(140, t0); lp.frequency.exponentialRampToValueAtTime(900, t0 + SK_T.hit); lp.frequency.exponentialRampToValueAtTime(260, t0 + 20);
  lp.connect(dr); env(dr, [[2.5, 0.2, 1], [SK_T.hit, 0.28, 1], [17, 0.001, 1], [21, 0, 1]]);
  [-7, 7].forEach(cents => { const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 55; o.detune.value = cents; o.connect(lp); o.start(t0); o.stop(t0 + 21.5); });
  const sub = ac.createOscillator(); sub.frequency.value = 55; sub.connect(lp); sub.start(t0); sub.stop(t0 + 21.5);

  // 2. the pad: A minor (add 9), then F major 7 under the letters, Am again on the hit
  const chord = (notes, a, b, peak) => notes.forEach(m => {
    const g = bus(0.35, 0.9), f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1800; f.connect(g);
    [-5, 5].forEach(dt => { const o = ac.createOscillator(); o.type = 'triangle'; o.frequency.value = hz(m); o.detune.value = dt; o.connect(f); o.start(t0 + a); o.stop(t0 + b + 3); });
    g.gain.setValueAtTime(0, t0 + a); g.gain.linearRampToValueAtTime(peak, t0 + a + 1.8); g.gain.setValueAtTime(peak, t0 + b - 0.4); g.gain.linearRampToValueAtTime(0, t0 + b + 2.5);
  });
  chord([57, 64, 71, 72], 1.2, SK_T.letters, 0.05);
  chord([53, 60, 64, 69], SK_T.letters - 0.3, SK_T.hit, 0.055);
  chord([45, 57, 64, 71, 76], SK_T.hit, 18.5, 0.06);

  // 3. the pulse: a heartbeat that quickens towards the hit
  let t = 1.4, beat = 0.86;
  while (t < SK_T.hit - 0.1) {
    [0, 0.2].forEach((off, j) => {
      const at = t0 + t + off, o = ac.createOscillator(), g = bus(1, 0.15);
      o.frequency.setValueAtTime(95, at); o.frequency.exponentialRampToValueAtTime(38, at + 0.18);
      const v = (0.25 + 0.5 * t / SK_T.hit) * (j ? 0.55 : 1);
      g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(v, at + 0.008); g.gain.exponentialRampToValueAtTime(0.001, at + 0.3);
      o.connect(g); o.start(at); o.stop(at + 0.35);
    });
    t += beat; beat = Math.max(0.42, beat * (t > SK_T.letters ? 0.86 : 0.985));
  }

  // 4. keystrokes under the typed log
  SK_INTRO.forEach(([line, at]) => {
    const n = line.replace(/<[^>]+>/g, '').length;
    for (let i = 0; i < n; i += 2) {
      const s = noise(0.03), f = ac.createBiquadFilter(), g = bus(0.5, 0.2), when = t0 + at + i * 0.028;
      f.type = 'bandpass'; f.frequency.value = 3200 + Math.random() * 2200; f.Q.value = 3; s.connect(f); f.connect(g);
      g.gain.setValueAtTime(0.09, when); g.gain.exponentialRampToValueAtTime(0.001, when + 0.025); s.start(when);
    }
  });

  // 5. the riser, then the impact
  const rs = noise(SK_T.hit - SK_T.letters + 0.2), bp = ac.createBiquadFilter(), rg = bus(0.6, 0.6);
  bp.type = 'bandpass'; bp.Q.value = 2.5; bp.frequency.setValueAtTime(300, t0 + SK_T.letters); bp.frequency.exponentialRampToValueAtTime(7000, t0 + SK_T.hit);
  rs.connect(bp); bp.connect(rg); rg.gain.setValueAtTime(0, t0 + SK_T.letters); rg.gain.exponentialRampToValueAtTime(0.28, t0 + SK_T.hit - 0.05); rg.gain.linearRampToValueAtTime(0, t0 + SK_T.hit);
  rs.start(t0 + SK_T.letters);
  const hit = t0 + SK_T.hit, boom = ac.createOscillator(), bg = bus(1, 0.8);
  boom.frequency.setValueAtTime(110, hit); boom.frequency.exponentialRampToValueAtTime(28, hit + 1.6);
  bg.gain.setValueAtTime(0, hit); bg.gain.linearRampToValueAtTime(0.95, hit + 0.01); bg.gain.exponentialRampToValueAtTime(0.001, hit + 3.2);
  boom.connect(bg); boom.start(hit); boom.stop(hit + 3.4);
  const crack = noise(1.5), cf = ac.createBiquadFilter(), cg = bus(0.7, 1.2); cf.type = 'lowpass'; cf.frequency.value = 2400;
  crack.connect(cf); cf.connect(cg); cg.gain.setValueAtTime(0.5, hit); cg.gain.exponentialRampToValueAtTime(0.001, hit + 1.4); crack.start(hit);

  // 6. a high bell on the subtitle, the last thing to ring out
  [[SK_T.sub, 88], [SK_T.sub + 1.6, 83]].forEach(([at, m]) => {
    const o = ac.createOscillator(), g = bus(0.25, 1.4); o.type = 'sine'; o.frequency.value = hz(m);
    g.gain.setValueAtTime(0, t0 + at); g.gain.linearRampToValueAtTime(0.07, t0 + at + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t0 + at + 3.5);
    o.connect(g); o.start(t0 + at); o.stop(t0 + at + 3.6);
  });

  const stopAt = setTimeout(() => ac.close().catch(() => {}), 24000);
  return {
    ac, master,
    mute(on) { master.gain.setTargetAtTime(on ? 0 : 0.8, ac.currentTime, 0.08); },
    fade(sec = 1.6) { clearTimeout(stopAt); master.gain.cancelScheduledValues(ac.currentTime); master.gain.setValueAtTime(master.gain.value, ac.currentTime); master.gain.linearRampToValueAtTime(0, ac.currentTime + sec); setTimeout(() => ac.close().catch(() => {}), sec * 1000 + 200); skAudio = null; },
  };
}

function skIntro() {
  if (PRESENTER) return;
  go(0);
  document.getElementById('sk-intro')?.remove();
  const box = document.createElement('div'); box.id = 'sk-intro';
  const title = 'OUT OF THE SANDBOX'.split(' ').map(w => `<span class="w">${w.split('').map(c => `<i style="--d:${(Math.random() * (SK_T.hit - SK_T.letters - 0.5)).toFixed(2)}s">${c}</i>`).join('')}</span>`).join(' ');
  box.innerHTML = `<div class="ski-scan"></div>
    <div class="ski-log">${SK_INTRO.map(([l, at]) => `<p style="--at:${at}s;--n:${l.replace(/<[^>]+>/g, '').length}"><span>${l}</span></p>`).join('')}</div>
    <div class="ski-pres"><span>Wavestone</span><em>presents</em><small>a cyber awareness session</small></div>
    <h1 class="ski-t">${title}</h1>
    <p class="ski-sub">One real case. What changes with AI. What you can do.</p>
    <div class="ski-flash"></div>`;
  document.body.appendChild(box);
  const timers = [];
  const end = (quick) => {
    if (!box.isConnected || box.classList.contains('out')) return;
    timers.forEach(clearTimeout); box.classList.add('out'); if (quick) box.classList.add('quick');
    if (idx === 0) render(0, 0);
    setTimeout(() => box.remove(), quick ? 500 : 1500);
  };
  const start = () => {
    box.classList.add('run');
    if (skAudio) skAudio.fade(0.3);
    try { skAudio = skScore(); skAudio && skAudio.ac.resume(); } catch (e) { skAudio = null; }
    timers.push(setTimeout(() => box.classList.add('s-glitch'), SK_T.glitch * 1000));
    timers.push(setTimeout(() => box.classList.add('s-pres'), SK_T.pres * 1000));
    timers.push(setTimeout(() => box.classList.add('s-letters'), SK_T.letters * 1000));
    timers.push(setTimeout(() => box.classList.add('s-hit'), SK_T.hit * 1000));
    timers.push(setTimeout(() => box.classList.add('s-sub'), SK_T.sub * 1000));
    timers.push(setTimeout(() => end(false), SK_T.out * 1000));
  };
  // the intro takes the gestures while it is on screen
  const gesture = e => {
    if (!box.isConnected || box.classList.contains('out')) return;
    const k = e.type === 'keydown' ? e.key : null;
    if (k && (e.metaKey || e.ctrlKey || e.altKey || k === 'Shift')) return;
    if (k === 'f' || k === 'F' || k === 'a' || k === 'A') return;
    e.stopImmediatePropagation(); e.preventDefault();
    if (k === 'Escape') { if (skAudio) skAudio.fade(0.4); end(true); return; }
    end(true);
  };
  box.addEventListener('click', gesture);
  document.addEventListener('keydown', gesture, true);
  chan && chan.addEventListener('message', e => {
    if (!box.isConnected || box.classList.contains('out') || !e.data || e.data.type !== 'cmd' || e.data.cmd !== 'next') return;
    e.stopImmediatePropagation(); end(true);
  });
  start();
}

// ─── Narrated version ───────────────────────────────────────────────────
// Optional, from the title screen (or the R key): each scene's script is read
// by recorded voices (NARR, assets/ai/voice/, see tools/build-talk-voice.py),
// its steps turn on the sentences, and the next scene follows on its own.
// The arrows still work, K pauses, R or Esc stops. Without the recordings the
// browser's own English voice reads instead.
const skN = { on: false, paused: false, audio: null, timers: [], holds: [], resume: null };
const skHold = (fn, ms) => { skN.resume = fn; skN.holds.push(setTimeout(fn, ms)); };
const skNarrClear = () => { skN.timers.forEach(t => { clearTimeout(t); clearInterval(t); }); skN.holds.forEach(clearTimeout); skN.timers = []; skN.holds = []; if (skN.audio) { skN.audio.onended = skN.audio.onerror = null; skN.audio.pause(); skN.audio = null; } if (window.speechSynthesis) speechSynthesis.cancel(); skN.resume = null; };
function skNarrUI() {
  document.body.classList.toggle('sk-narr', skN.on); document.body.classList.toggle('sk-narr-paused', skN.on && skN.paused);
  document.querySelectorAll('[data-sk="narr"]').forEach(b => { b.setAttribute('aria-pressed', skN.on); b.querySelector('em').textContent = skN.on ? 'Stop the narration' : 'Narrated version'; });
  let np = document.getElementById('sk-np');
  if (!np) { np = document.createElement('div'); np.id = 'sk-np'; np.innerHTML = '<i></i><span></span><button data-sk="pause"></button><button data-sk="stop">Stop</button>'; document.body.appendChild(np); }
  np.querySelector('span').textContent = skN.paused ? 'Narration paused' : 'Narrated';
  np.querySelector('[data-sk="pause"]').textContent = skN.paused ? 'Resume (K)' : 'Pause (K)';
}
function skNarrStop() { skN.on = skN.paused = false; skNarrClear(); skNarrUI(); }
function skNarrStart() { if (skAudio) skAudio.fade(1); skN.on = true; skN.paused = false; skNarrUI(); skNarrScene(); }
function skNarrPause() {
  if (!skN.on) return; skN.paused = !skN.paused; skNarrUI();
  if (skN.paused) { skN.holds.forEach(clearTimeout); skN.holds = []; if (skN.audio) skN.audio.pause(); if (window.speechSynthesis) speechSynthesis.pause(); }
  else if (skN.resume) skN.resume();
}
// when step k (1..max) comes, in seconds: on a sentence start if there are
// enough sentences, else evenly through the recording
function skNarrTimes(max, d, starts) {
  const S = starts.length, t = [];
  for (let k = 1; k <= max; k++) t.push(S >= max + 1 ? starts[Math.round(k * S / (max + 1))] : d * k / (max + 1));
  return t;
}
function skNarrScene() {
  skNarrClear(); if (!skN.on || !cur) return;
  const el = cur, s = SCENES[idx], n = typeof NARR !== 'undefined' ? NARR[s.title] : null, max = el._max;
  el.querySelectorAll('video').forEach(v => { v.muted = true; });
  const alive = () => skN.on && cur === el;
  const step = k => { if (alive() && frag < k && k <= el._max) { frag = k - 1; next(); } };
  const move = () => { if (!alive() || skN.paused) return; if (frag < el._max) next(); if (idx < SCENES.length - 1) go(idx + 1, 0); else skNarrStop(); };
  const after = () => { skN.resume = after; if (!skN.paused && alive()) skHold(move, 1500); };
  if (!say(s)) {
    // a silent screen: walk its steps, then move on
    let k = frag; const tick = () => { if (!alive() || skN.paused) return; if (k < max) { step(++k); skHold(tick, 1800); } else after(); };
    skHold(tick, 2600); return;
  }
  const speak = () => {
    // fallback: the browser reads, sentence by sentence
    if (!window.speechSynthesis) { after(); return; }
    const vs = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
    const pick = vs.find(v => /natural|neural|premium|enhanced/i.test(v.name)) || vs.find(v => /Google UK English Female|Google US English|Samantha|Serena|Daniel|Aria|Jenny|Libby/i.test(v.name)) || vs[0];
    const parts = say(s).split(/(?<=[.!?][”"]?)\s+(?=[A-Z0-9“"])/), when = skNarrTimes(max, parts.length, parts.map((_, i) => i));
    parts.forEach((p, i) => {
      const u = new SpeechSynthesisUtterance(p.replace(/[“”"]/g, '')); if (pick) u.voice = pick; u.lang = pick ? pick.lang : 'en-GB'; u.rate = 0.98;
      u.onstart = () => when.forEach((w, j) => { if (w <= i) step(j + 1); });
      if (i === parts.length - 1) u.onend = after;
      speechSynthesis.speak(u);
    });
    skN.resume = () => speechSynthesis.resume();
  };
  if (!n) { speak(); return; }
  const a = new Audio(n.f), when = skNarrTimes(max, n.d, n.b);
  skN.audio = a; a.preload = 'auto';
  a.onended = after; a.onerror = () => { if (skN.audio === a) { skN.audio = null; speak(); } };
  skN.resume = () => a.play().catch(() => {});
  skN.timers.push(setInterval(() => { if (!alive()) return; when.forEach((w, j) => { if (a.currentTime >= w) step(j + 1); }); }, 120));
  a.play().catch(() => { if (skN.audio === a) { skN.audio = null; speak(); } });
}

// the two buttons on the title screen
function skOptions(scene) {
  const tt = scene.classList.contains('t-title') && scene.querySelector('.tt');
  if (!tt || tt.querySelector('.sk-opts')) return;
  tt.insertAdjacentHTML('beforeend', `<div class="sk-opts">
    <button data-sk="intro"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z"/></svg><span><em>Opening credits</em><small>with music · 16 seconds</small></span></button>
    <button data-sk="narr" aria-pressed="${skN.on}"><svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg><span><em>${skN.on ? 'Stop the narration' : 'Narrated version'}</em><small>two voices · plays on its own</small></span></button>
  </div>`);
}

if (!PRESENTER) {
  // a new scene: the score fades once the title is left, the narration reads it
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
    if (n.nodeType !== 1 || !n.classList.contains('scene')) return;
    skOptions(n);
    if (skAudio && idx !== 0) skAudio.fade(1.8);
    if (skN.on) { skNarrClear(); const t = setTimeout(() => { if (cur === n) skNarrScene(); }, 650); skN.timers.push(t); }
  }))).observe(document.getElementById('stage'), { childList: true });
  if (cur) skOptions(cur);
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-sk]'); if (!b) return;
    e.stopPropagation(); b.blur();
    const k = b.dataset.sk;
    if (k === 'intro') { if (skN.on) skNarrStop(); skIntro(); }
    else if (k === 'narr') skN.on ? skNarrStop() : skNarrStart();
    else if (k === 'pause') skNarrPause();
    else if (k === 'stop') skNarrStop();
  }, true);
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey || document.querySelector('.ov.open')) return;
    const k = e.key.toLowerCase();
    if (k === 'a') { skMuted = !skMuted; skAudio && skAudio.mute(skMuted); document.body.classList.toggle('sk-muted', skMuted); }
    else if (k === 'i' && !document.getElementById('sk-intro')) { if (skN.on) skNarrStop(); skIntro(); }
    else if (k === 'r') skN.on ? skNarrStop() : skNarrStart();
    else if (k === 'k') skNarrPause();
    else if (e.key === 'Escape' && skN.on) skNarrStop();
  });
  const keys = document.querySelector('#help .keys');
  if (keys) keys.insertAdjacentHTML('beforeend', '<kbd>I</kbd><span>Opening credits, with music (A: music on / off)</span><kbd>R</kbd><span>Narrated version on / off (K: pause)</span>');
}
