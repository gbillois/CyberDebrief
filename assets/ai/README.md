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
| 14 · Black Hat (optional) | `blackhat-briefing.mp4` | Session on the OpenAI / Hugging Face incident, Black Hat USA, August 2026 | [YouTube JmklCcqSwz8](https://www.youtube.com/watch?v=JmklCcqSwz8) (check the channel) |
| 23 · Press conference | `albanese-presser.mp4` | Anthony Albanese announces the intrusion, New York, 24 September 2026 | [ABC News, YH690PgNFdM](https://www.youtube.com/watch?v=YH690PgNFdM) · full version [fbdIerD4lT8](https://www.youtube.com/watch?v=fbdIerD4lT8) |
| 25 · Security Council (optional) | `un-security-council.mp4` | Sam Altman, Dario Amodei, Clément Delangue before the Security Council, 23 September 2026 | [YouTube eBEYrOk42Rg](https://www.youtube.com/watch?v=eBEYrOk42Rg), or UN Web TV |
| 42 · Robot games | `robot-games.mp4` | Highlights of the World Humanoid Robot Games, Beijing, 22-26 August 2026 (sprints, football, handling tasks) | [YouTube BWE-vXYt0HA](https://www.youtube.com/watch?v=BWE-vXYt0HA) (check the channel) |
| 44 · The crash | `robot-crash.mp4` | Record-setting sprinter crashing into a wall, or falls and fires at the 2026 Games | [YouTube zratOmQozBs](https://www.youtube.com/watch?v=zratOmQozBs) · alternatives [XgnBN8BLc-o](https://www.youtube.com/watch?v=XgnBN8BLc-o), [Fy298Uz2CRs](https://www.youtube.com/watch?v=Fy298Uz2CRs) |
| 55 · Arup (optional) | `arup-report.mp4` | News report on the Arup deepfake fraud (2024) | [YouTube iGJnHHOMwuI](https://www.youtube.com/watch?v=iGJnHHOMwuI) (check the channel) |

Recommended format: MP4 (H.264 + AAC), 1080p, a clip of 20 to 40 seconds already
trimmed. Obtain the files from a source that allows downloading (the
broadcaster's press office, UN Web TV, a request to the channel); the YouTube
IDs are there to locate the right footage.

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

### Press excerpts

The two press montages (July and September 2026) reproduce real headlines and
short verbatim excerpts, each checked against the original article; the full
list with links is in the Sources scene. The Thomas Wolf quote comes from The
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
