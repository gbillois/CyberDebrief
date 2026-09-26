# Media for `ai-talk.html` and `ai.html` (Out of the Sandbox)

`ai-talk.html` (visual talk), `ai.html` (English) and `ai-fr.html` (French) are self-contained: fonts, map and
code are inside the file. They run with no network, for instance from a laptop
over HDMI. The only external items are the media below, dropped **next to the
file**, in this `assets/ai/` folder; both language versions use the same files.
Each empty slot shows as a dashed frame describing the shot it expects; the `M`
key hides them during a rehearsal.

To take the presentation with you: copy `ai.html` (or `ai-fr.html`) together
with the `assets/ai/` folder (USB key, local disk). Nothing else is needed.

## Video clips (included, prepared 26 September 2026)

The six MP4s and their JPG posters are included. They play locally, including
from `file://` with the network disabled. Press `V` to play or pause.
The corrected online fallbacks in `ai-talk.html` use the same source intervals,
rounded outward to whole seconds for YouTube. Local files already start at
the cut: do not seek them to the source timecode again.

Scene numbers below refer to **`ai-talk.html`**, not the documentary variants.

| Talk scene | File | Source interval | Length | Selection and source |
|---|---|---|---|---|
| 19 · Black Hat (optional) | `blackhat-briefing.mp4` | 00:28.50–00:57.00 | 28.50 s | Eric Wallace describes the autonomous attack and OpenAI's responsibility. [Official Black Hat recording](https://www.youtube.com/watch?v=87DyyMV0kCY&t=28) |
| 31 · Press conference | `albanese-presser.mp4` | 01:18.35–01:47.80 | 29.45 s | Albanese calls the incident unacceptable and criticises the notification delay. [ABC News full press conference](https://www.youtube.com/watch?v=fbdIerD4lT8&t=78) |
| 33 · Security Council (optional) | `un-security-council.mp4` | 19:04.35–19:41.05 | 36.70 s | Dario Amodei explains global risks and ends on the warning about humanity. [Sky News](https://www.youtube.com/watch?v=eBEYrOk42Rg&t=1144) |
| 55 · Robot games | `robot-games.mp4` | 00:28.40–00:53.20 | 24.80 s | Scale of the games, boxing, jumping, dancing and progress; ends before the failures. [CTV News](https://www.youtube.com/watch?v=BWE-vXYt0HA&t=28) |
| 57 · The crash | `robot-crash.mp4` | 00:00.00–00:24.80 | 24.80 s | Sprint, collision and fire, before the studio banter. [KHOU 11](https://www.youtube.com/watch?v=zratOmQozBs) |
| 68 · Arup (optional) | `arup-report.mp4` | 01:03.70–01:35.20 | 31.50 s | Joe Tidy explains the Arup call and the $25 million fraud. News illustrations, not footage of the actual fraudulent call. [BBC World Service](https://www.youtube.com/watch?v=lH608DfrAxU&t=63) |

All files: 1920 × 1080, 30 fps, H.264 / YUV420p, AAC stereo at 48 kHz,
MP4 fast-start. Actual duration can differ by one video frame at the cut.
The six clips total about 2 min 56 s and 52 MiB. Sources, precise cuts,
checksums and encoding settings are recorded in `clips.json`.

Source corrections made during preparation:

- `JmklCcqSwz8` was a third-party commentary, replaced by the official Black Hat recording.
- `YH690PgNFdM` was an ABC correspondent's report, replaced by footage of Albanese himself.
- `iGJnHHOMwuI` was a third-party narration, replaced by BBC World Service reporting.
- The UN excerpt features Amodei; the caption now identifies the actual speaker.
- The ABC upload is dated 23 September in New York, corresponding to 24 September in Australia.
- KHOU reports a later 8.84 s sprint; the earlier 9.39 s figure in the talk refers to the 22 August result.

The existing `ai.html` and `ai-fr.html` references also load these same local
MP4 filenames. Their older YouTube fallback metadata has not been updated.
Only these six curated MP4s are excepted from the repository's general video
ignore rule; full source downloads and temporary files remain outside the repo.

## Screenshots and portraits

| Scene | File | Expected content | Where to find it |
|---|---|---|---|
| 10 · The call | `hf-disclosure.jpg` | Screenshot of Hugging Face's 16 July 2026 post, with "used LLM still not known" visible | huggingface.co/blog/security-incident-july-2026 |
| French version only · DseWiki | `dsewiki.jpg` | Screenshot of the Nightingale Collective analysis | collusion.wiki |
| 56 · Fake evidence | `refund-fraud.jpg` | A published example of an AI-generated or AI-altered "damaged product" photo | South China Morning Post (2025), Modern Retail (2026) |
| Portraits (included) | `people/*.jpg` | 480 px square crops, see the table below | Wikimedia Commons |

### Portraits (included, openly licensed)

The credit is shown automatically in the source line of every scene that uses
the portrait, and in the Sources scene.

| File | Person | Credit and licence | Original |
|---|---|---|---|
| `people/wolf.jpg` | Thomas Wolf, co-founder, Hugging Face | Slush, CC BY 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Thomas_Wolf_at_Slush_2024.jpg) |
| `people/delangue.jpg` | Clément Delangue, CEO, Hugging Face | SiliconANGLE theCUBE, CC BY 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Cl%C3%A9ment_Delangue_on_SiliconANGLE_theCUBE.jpg) |
| `people/albanese.jpg` | Anthony Albanese, Prime Minister of Australia | Australian Government, CC BY 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Anthony_Albanese_portrait_(re-crop).jpg) |
| `people/amodei.jpg` | Dario Amodei, CEO, Anthropic | TechCrunch, CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Dario_Amodei_at_TechCrunch_Disrupt_2023_01_(cropped).jpg) |
| `people/altman.jpg` | Sam Altman, CEO, OpenAI | Office of the Prime Minister of Japan, CC BY 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Meeting_with_Masayoshi_Son_and_Sam_Altman_(February_3,_2025)_(3x4_cropped_on_Altman).jpg) |
| `people/vigna.jpg` | Benedetto Vigna, CEO, Ferrari (whose voice was cloned) | Rossini TV, CC BY 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Benedetto_Vigna_-_Universit%C3%A0_Urbino.jpg) |

### Press screenshots (included)

`press/*.jpg`: screenshots of the articles shown in the two press montages
(July and September 2026), captured on 26 September 2026 and cropped to the
masthead and headline. Each card falls back to the headline and a verbatim
excerpt if its file is missing. The full list with links is in the Sources
scene: The Hacker News, TechCrunch, Scientific American, BBC News, Wired, The
Guardian (July); SecurityWeek, BNN Bloomberg, CBS News, The Guardian,
TechCrunch, ABC News Australia (September). Short screenshots of news
articles, credited on screen, for an internal awareness session; re-check
before any public online release. The Thomas Wolf quote comes from The
Wall Street Journal (24 July 2026) and the Clément Delangue quote from Axios
(23 July 2026).

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
