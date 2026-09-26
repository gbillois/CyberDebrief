# Media for `ai.html` (Out of the Sandbox)

`ai.html` (English) and `ai-fr.html` (French) are self-contained: fonts, map and
code are inside the file. They run with no network, for instance from a laptop
over HDMI. The only external items are the media below, dropped **next to the
file**, in this `assets/ai/` folder; both language versions use the same files.
Each empty slot shows as a dashed frame describing the shot it expects; the `M`
key hides them during a rehearsal.

To take the presentation with you: copy `ai.html` (or `ai-fr.html`) together
with the `assets/ai/` folder (USB key, local disk). Nothing else is needed.

## Video clips (local MP4 files)

Scene numbers refer to the English version (`ai.html`).

With no network, only local videos play. If the computer is online and a file is
missing, the page offers the matching YouTube clip, loaded on click: that is a
fallback, not the version to use in the room.

| Scene | File to add | Content | Identified source |
|---|---|---|---|
| 13 · Black Hat (optional) | `blackhat-briefing.mp4` | Session on the OpenAI / Hugging Face incident, Black Hat USA, August 2026 | [YouTube JmklCcqSwz8](https://www.youtube.com/watch?v=JmklCcqSwz8) (check the channel) |
| 23 · Press conference | `albanese-presser.mp4` | Anthony Albanese announces the intrusion, New York, 24 September 2026 | [ABC News, YH690PgNFdM](https://www.youtube.com/watch?v=YH690PgNFdM) · full version [fbdIerD4lT8](https://www.youtube.com/watch?v=fbdIerD4lT8) |
| 24 · Security Council (optional) | `un-security-council.mp4` | Sam Altman, Dario Amodei, Clément Delangue before the Security Council, 23 September 2026 | [YouTube eBEYrOk42Rg](https://www.youtube.com/watch?v=eBEYrOk42Rg), or UN Web TV |
| 35 · UniPwn (optional) | `unipwn-demo.mp4` | Demonstration of a Unitree robot takeover | [YouTube ALIHl4-nVAg](https://www.youtube.com/watch?v=ALIHl4-nVAg) (check the channel) |
| 41 · Arup (optional) | `arup-report.mp4` | News report on the Arup deepfake fraud (2024) | [YouTube iGJnHHOMwuI](https://www.youtube.com/watch?v=iGJnHHOMwuI) (check the channel) |

Recommended format: MP4 (H.264 + AAC), 1080p, a clip of 20 to 40 seconds already
trimmed. Obtain the files from a source that allows downloading (the
broadcaster's press office, UN Web TV, a request to the channel); the YouTube
IDs are there to locate the right footage.

## Screenshots and portraits

| Scene | File | Expected content | Where to find it |
|---|---|---|---|
| 10 · The call | `hf-disclosure.jpg` | Screenshot of Hugging Face's 16 July 2026 post, with "used LLM still not known" visible | huggingface.co/blog/security-incident-july-2026 |
| French version only · DseWiki | `dsewiki.jpg` | Screenshot of the Nightingale Collective analysis | collusion.wiki |
| 42 · Fake evidence | `refund-fraud.jpg` | A published example of an AI-generated or AI-altered "damaged product" photo | South China Morning Post (2025), Modern Retail (2026) |
| 4, 9 · Portraits | `people/delangue.jpg`, `people/wolf.jpg` | Square portraits of Clément Delangue and Thomas Wolf | Hugging Face press photos |

Screenshots as PNG or JPG, 1920 px wide at most. Without a portrait, the page
shows initials.

## In the room, over HDMI

1. Connect the laptop to the projector as an **extended display** (not mirrored).
2. Open `ai.html` in Chrome, Edge or Firefox.
3. Press `P`: the presenter view (script, notes, timer, next scene) opens in a
   second window. Keep it on the laptop screen.
4. Drag the main window onto the projector, then press `F` for full screen.
5. Advance with `→`, `Space` or a presentation remote, from either window. `B`
   blacks out the projector.

Rehearse once beforehand with Wi-Fi turned off.

## Adding a shot

Each `visual` or `media` object in the `SCENES` array accepts:

```js
{ kind: 'media', type: 'image', src: 'assets/ai/file.jpg', caption: '…', credit: '…', todo: '…', href: '…' }
{ type: 'video', src: 'assets/ai/clip.mp4', poster: 'assets/ai/clip.jpg', yt: 'VIDEO_ID', start: 42, end: 75 }
```

For any later public release (with a voice-over), re-check the rights to every
clip.
