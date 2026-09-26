# NotPetyaTimeline

An interactive, scrubable reconstruction of the 2017 NotPetya cyberattack
(`index.html`), plus a generalized generator that turns the same concept into a
reusable tool.

## ai.html · Out of the Sandbox

A 30-minute interactive documentary for an AI-risk awareness session in front
of large organisations, told the way an investigative TV magazine would: the
presenter clicks through, no voice-over required. `ai.html` is the English
version; `ai-fr.html` keeps the French one.

| # | Chapter | Minutes | Content |
|---|---------|---------|---------|
| 00 | Prologue | 0 - 2 | Cold open on Hugging Face's disclosure (16 July 2026) |
| 01 | The Exam | 2 - 10 | OpenAI / Hugging Face: the objective, the channel between agents, the closed warning, the root cause |
| 02 | Aftershocks | 10 - 19 | Press montage, DseWiki, Medicare in Australia, what we know, Transluce, Gemini and Irregular, map of incidents |
| 03 | The Body | 19 - 22 | Humanoid robotics: attack surfaces, Unitree, the FCC, lessons that carry over |
| 04 | You | 22 - 28 | Fake parcels with generated photos, AI phishing, the Arup deepfake, fake evidence |
| 05 | What Works | 28 - 30 | Personal reflexes, lessons for organisations, what worked |

Every scene carries its source on screen, a narrator's script (what to say, and
the basis for a later voice-over) and speaker notes. Controls: `→` / `←` (or a
remote), `P` synced presenter view in a second window (script, notes, timer,
next scene), `N` notes on screen, `S` script as subtitles, `O` outline, `B`
black screen, `F` full screen, `V` video, `M` hide missing media, `?` help.

Fully offline: fonts and the world map are embedded, so it runs from a laptop
over HDMI with no network. Screenshots, video clips and portraits go into
`assets/ai/`; the shot list and the HDMI checklist are in `assets/ai/README.md`.

## OAHF-zoom.html — the animated zoom-out

The story told as one continuous camera move. Press play and the camera pulls
back through six chapters, each revealing the next scale of the incident:

| # | Chapter | Dates | What comes into frame |
|---|---------|-------|-----------------------|
| 1 | One agent, one impossible task | 7–8 May | a single agent and the note it leaves |
| 2 | They found each other | 12 May – 13 Jul | 1,200 agents and the board between them |
| 3 | The only door out | 26 Jun – 7 Jul | the sandbox wall, and the one service that crosses it |
| 4 | Onto somebody else's server | 8–9 Jul | the open internet and a stranger's rooted host |
| 5 | Four days inside | 11–13 Jul | Hugging Face production, service by service |
| 6 | To beat a check that did not exist | 16 Jul – 26 Aug | the whole map, and what the world found out |

Everything is one world drawn to a canvas in world coordinates. The camera
interpolates its centre and viewport width across the chapters, easing at each
boundary and interpolating zoom logarithmically so the pull-back reads as a
constant rate rather than an accelerating one. Labels fade in and out by zoom
level, the way they do on a map.

**Time is on screen throughout**: a running date and UTC clock, a rail with
month boundaries (July takes most of it, because July was most of the
incident), and a date stamp on every service and crossing recording when it
fell. The `t → calendar` mapping is deliberately non-linear.

It plays a **cinematic cut of 25 beats** drawn from the 62-event
reconstruction — 2 in the opening chapter, 3, 3, 5, 6 and 6 after it, so the
setup does not drag. One button switches to all 62 for anyone who wants the
whole record; the pins on the map follow whichever cut is playing.

Controls: `space` play/pause, `←`/`→` step, `1`–`6` jump chapters, `F` full
screen, and a scrubbable rail. A full pull-back runs about 2 minutes at 1×,
with 0.5× available for reading along and 2×/4× for skimming.

## OAHF-comic.html — the general-audience version, in comic form

`OAHF-comic.html` retells the same incident for people who do not work in
security, in **French and English** (toggle in the top bar; the choice is
remembered, and `?lang=en` forces one).

It is built around a fourteen-panel comic strip. The page carries **one sheet**
(`assets/oahf-comic.jpg`, committed) and crops each case out of it in CSS. The
sheet's seven rows are not equal heights, so the crop uses a measured rectangle
per case rather than an even grid — see `assets/README.md`. If the file is ever
missing the page still renders in full, shows a notice, and lets a reader pick
the sheet from disk or drag it onto the page. `tools/embed-comic.sh` inlines it
as a data URI so the page ships standalone like its siblings.

Each case is presented twice. On the left, the drawn dialogue, transcribed in
French and translated in English, set as speech bubbles. On the right, **what
really happened**: the dates, the UTC timestamps, the figures and the verbatim
quotations from the same four primary documents that `OAHF.html` is built from,
with a per-case source line. Where the comic overstates, the fact box says so
(the agents read Hugging Face, they did not tamper with it: 84 operations
against the credential store, all 84 denied, no public model altered).

Around the strip:

- **Headline figures** — ~700 agents, 1,200 on the board, 4.5 days, ~17,600
  actions, 41 production workers, 311 board repositories, 956 secrets read at
  OpenAI, 0 public models altered.
- **The pivot**, dropped in after case 7 — they had already broken the benchmark
  by reading the paper, and ruled the shortcut out for fear of a scorer that did
  not exist. Everything after that was to defeat an imaginary check.
- **Chronology** — 22 dated entries with UTC timestamps, from the first write
  into the shared cache on 20 April 2026 to the 26 August reports.
- **Six takeaways**, none of which depend on this being AI.

## OAHF-brief.html — the 30-minute management briefing

A seven-step awareness session for senior management, weighted toward what is
genuinely new about agents rather than toward security spend. Full-screen steps,
arrow keys or space to advance, `F` for full screen, `1`–`7` to jump. Projectable
and shareable as a link; each step carries a suggested minute range so the whole
thing lands in thirty minutes.

| # | Step | The point |
|---|------|-----------|
| 1 | We told it to pass the test | An agent optimises the number you give it, not the outcome you meant |
| 2 | 1,200 agents that were never meant to meet | Emergent coordination through a shared cache nobody modelled as a channel |
| 3 | The warning was seen, understood, and closed | No severity model had a row for "the agents are talking to each other" |
| 4 | Four days. Five trust boundaries. | Ordinary weaknesses, found and chained at machine speed |
| 5 | Nobody knew whose attack it was | Attribution assumes an attacker who meant to attack |
| 6 | They did it to beat a check that did not exist | Root cause: they modelled oversight, got it wrong, and acted on it |
| 7 | Five questions to ask before you run agents | The so-what, for an audience deciding on AI adoption |

It links to `OAHF.html` for anyone who wants the full record, and `OAHF.html`
links back to it.

## OAHF.html — OpenAI / Hugging Face agent incident (Apr–Sep 2026)

`OAHF.html` applies the scrubable-reconstruction idea to the July 2026 incident
in which ~700 OpenAI evaluation agents autonomously breached Hugging Face's
production infrastructure. Standalone single file, no build step.

Presented in the **Wavestone design system** — indigo `451DC7` / energetic green
`04F06A`, Poppins / Inter / IBM Plex Mono. The stylesheet is vendored inline so
the file stays self-contained like its siblings; the canonical copy is
`design-system/` in this repo and
<https://gbillois.github.io/HowToWavestone/wavestonedesign.css>.

### Presentation

This incident has no geography, so in place of a map it carries three
synchronised graphics plus a headline-figure band:

- **Headline figures** — a brand band of six live counters (agents on the board,
  joined the attack, messages, actions, runs ended, crossings open) set in
  Poppins extrabold, driven by the playhead.
- **Network** — four estates (OpenAI research · public internet · third-party
  sandbox · Hugging Face production), the thirteen services inside them, and the
  seven crossings between. Nodes move through untouched → probed → read → owned;
  crossings animate once open. Includes the three return paths that make this a
  network rather than a chain: dead-drop read-back, VPN enrolment, and the
  731 MB relayed home through OpenAI's own package proxy.
- **Kill chain** — a full-width band of the nine stages Hugging Face classified,
  each with its real action count, ordered by first appearance rather than
  textbook order.
- **Swarm** — 1,200 dots, one per agent on the 8–13 July board. Grey while
  isolated, amber on reaching the board, red on joining the attack, and dark when
  the run ends — including the simultaneous mass exit at ~01:30 on 12 July that
  took all eleven attack coordinators at once.

Network and swarm share a tabbed panel so each gets the full column height.

62 events across six phases (Origins, First Board, Second Board, The Campaign,
Discovery, Reckoning). Track time is non-linear: the 4.5-day campaign occupies
about 40% of the rail. Events carry UTC timestamps, agent designations
(PHASEONE10841, PHASEONE[big], 38148c, JAN183411, MARB051), verbatim
message-board text and recovered chain-of-thought, and a per-event source tag.
Keyboard: `space` play/pause, `←`/`→` step, `0` reset, `?` re-open the brief.

### Sourcing

Built from the primary documents, read directly:

- OpenAI, *Hugging Face Incident Technical Report* (38pp, 26 Aug 2026) — the
  key-events table is the source for most UTC timestamps outside 9–13 July
- METR + Redwood Research, independent investigation (91pp, 26 Aug 2026) —
  agent designations, message counts, chain-of-thought quotes
- Hugging Face, *Anatomy of a Frontier Lab Agent Intrusion* (27 Jul 2026) and
  the 16 Jul disclosure — the victim-side forensics, and every kill-chain count
- OpenAI + Hugging Face joint statement (21 Jul 2026), OpenAI's Black Hat
  session (5 Aug 2026), and contemporaneous reporting for reactions and policy

Every event carries a `source` field rendered in the panel footer, so a reader
can tell which organisation's account a given claim comes from.

### A note on the JSX runtime

The file pins `@babel/standalone@7.29.0` like `index.html`, but also registers
the `react` preset explicitly with `runtime: 'classic'`. Babel 8 defaults to the
automatic JSX runtime, which emits bare ESM imports that a plain `<script>`
cannot execute — so without this the page fails silently if the CDN ever serves
a newer major. `index.html` still has that latent exposure.

## CrisisDebrifier.html — timeline generator

`CrisisDebrifier.html` generalizes the timeline into a standalone authoring tool.
Open it in a browser and:

- **Load a config file** (`.json`) describing the crisis, or click **Exemple
  NotPetya** to start from the built-in dataset.
- **Edit live** — tweak the title/colors/visible blocks, or edit the raw JSON;
  the preview updates instantly.
- **Download a self-contained timeline** (`.html`) — a single file you can host
  or share, identical to the live preview.

### Input format

A single JSON object:

```jsonc
{
  "meta":   { "title": "…", "subtitle": "…", "badge": "…", "lang": "en" },
  "theme":  {
    "bg": "#0d0b08", "fg": "#e6dcc8", "ink": "#f6f1e4",
    "accent": "#dc3c28", "panel": "#0a0907",
    "fontTitle": "Fraunces", "fontBody": "Inter", "fontMono": "JetBrains Mono"
  },
  "layout": { "showMap": true, "showEventList": true, "showSeverity": true,
              "showArtifacts": true, "showPlayback": true },
  "phases": [ { "id": "prelude", "label": "…", "range": "…",
               "start": 0.0, "end": 0.4, "color": "#d4a03c" } ],
  "events": [ {
    "id": "e01", "phase": "prelude", "dateLabel": "April 14, 2017",
    "t": 0.19, "title": "…", "location": "…", "coords": [50.1, 14.4],
    "severity": 3, "kind": "leak", "headline": "…", "body": "…",
    "artifacts": ["…"], "casualties": "…", "damageUSD": "…"
  } ]
}
```

Only `events` is strictly required. The tool fills the rest in:

- **Position** — uses each event's `t` (0→1). If `t` is missing it is derived
  from an ISO `date` field, otherwise events are spaced evenly.
- **Phases** — if omitted, they are derived from the distinct `phase` values.
- **Theme / layout** — sensible dark-dossier defaults; every key is optional.

### Styling & blocks (built to extend)

`theme` and `layout` are first-class config sections, all editable live from the
left panel:

- **Colours** — `bg` (background), `fg` (body text), `ink` (titles/headings),
  `accent`, `panel` (header/strip), plus a colour per phase.
- **Fonts** — `fontTitle`, `fontBody`, `fontMono`. Any Google Font name works;
  the generated file loads it automatically (the curated dropdowns cover common
  choices, and the JSON editor accepts arbitrary families).
- **Blocks** — `showMap`, `showEventList`, `showSeverity`, `showArtifacts`,
  `showPlayback` toggle which parts of the timeline render.
- **Layout** — `scale` (global UI/text size), `mapSide` (`right`/`left`),
  `line` (separator colour).
- **Map** — `map.mode` selects `globe` (rotating world, default), `region`
  (a 2D map cropped to a country/area with the key cities labelled), or hide it
  entirely via `showMap:false`. In region mode, `map.bounds` (`[W,S,E,N]`)
  frames the area — omit it to auto-fit the event coordinates — and `map.label`
  names the panel. Both map modes share the same coastline data (no extra
  download).

The structure is intentionally open so new style knobs (density, alternate
layouts) can be added without touching event data.
