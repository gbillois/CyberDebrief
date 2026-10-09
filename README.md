# CyberDebrief

An interactive, scrubable reconstruction of the 2017 NotPetya cyberattack
(`notpetya.html`), plus a generalized generator that turns the same concept into a
reusable tool.

## index.html · debrief collection

The root page links to the Cyber AI Platform demo (`cyber-ai-platform.html`) and four debriefs: **NotPetya** (`notpetya.html`),
**OpenAI × Hugging Face** (`OAHF.html`), and **AI risks / Out of the Sandbox**
(`ai-threat-landscape-202609.html`), plus **Lead the Shift / Les Assises 2026**
(`assises-chart.html`, the latest workshop). Alternative formats
are available under each card. The menu follows the public CyberSecWatch home: white background, indigo headings, green accents. The case directory uses a full-width grid of four cards, with local fonts and a single column on mobile. The old `Support_PBR.html` URL redirects permanently to `ai-threat-landscape-202609.html`.

`ai-threat-landscape-202609.html` has two versions, picked with the **Short / Long** switch on its title screen (Short by default; also `?v=short` or `?v=long` in the URL, remembered in the browser). In `SCENES`, `only: 'long'` or `only: 'short'` keeps a scene in one version, and `long: { … }` / `short: { … }` fields override the shared ones. The short version merges the release timeline and the exam, keeps only headlines and key figures on the zoom scenes (the rest goes to the speaker notes), skips Zoom 7, and shows the incident and attacker maps without the per-case close-ups.

## ai-cyber-largeorg.html · AI-cyber-largeorg (French)

A 45-minute talk in French for CISOs, risk managers and CIOs of large
organisations, on the threat and the market around frontier models. It runs
on the same engine and dark stage as `ai-threat-landscape-202609.html` (one
version only, the long one), with the interface, the zoom world and the
presenter view translated, and French typography (non-breaking spaces before
`: ; ! ?` and inside « »). Five parts, one question each:

| # | Part | Minutes | Content |
|---|------|---------|---------|
| 00 | Ouverture | 0 - 2 | 16 July 2026, Hugging Face, no human attacker |
| 01 | L'examen | 2 - 11 | The OpenAI / Hugging Face case as in the long threat landscape (release timeline, ExploitGym, zooms 1 to 7, Black Hat), then a control and assurance reading of the incident |
| 02 | Les débordements | 11 - 18 | The map of overflows, every lab affected (Anthropic, Meta, RubyGems, second pause, 100+ organisations), the erased traces on 55 sites (FT, 1 Oct 2026), why it derails, prompt injection |
| 03 | Les modèles frontière | 18 - 27 | Mythos, the capability curve (ExploitBench), the market and access modes, the verification programmes, the access asymmetry, the AI-assisted attacks on seven South Korean banks and lenders, the patching bottleneck, supervisors' reactions |
| 04 | Réagir | 27 - 36 | Simplified part 2 of Lead the Shift: fundamentals and new CISO powers, rebuilding the foundations, the new cyber baseline (24 h / 3 h / 24 h / 2 days / 5 %), maturity, proving it across the three lines |
| 05 | La cyber augmentée | 36 - 45 | Part 3 of Lead the Shift: three stages (80 / 30 / 5 %), use cases, one platform per domain, the cyber AAA, the unified platform, the new organisation with Trust & Challenge, synthesis, questions, sources |

"Assurance" is used in its English sense throughout (justified confidence,
from independent verification, that controls work). The deck does not name
its audience. Scenes specific to this talk (`lessons`, `powers`, `found`,
`baseline`, `lod`, `market`, `tiers`, `asym`, `stages`, `gains`, `domains`,
`platform`, `org`, `synth`) are defined in the block marked AI-CYBER-LARGEORG,
with their styles in the last `<style>` of the head. No narration recordings.

## cyber-ai-platform.html · Cyber AI Platform (interactive demo)

An interactive demo to show a CISO how a centralized cyber AI platform would
work, look and pay off: one platform, one shared context (cyber security
graph and cyber data lake), specialized agents per domain, an orchestrator
that enforces decision rights, humans who decide above threshold, and a
safety layer (sandbox, kill-switch, rollback). The company, Novalys Group (a
European bank and insurer), and every figure are fictitious. Personas are
named by role only, and no real product or vendor is named. English UI; the
hub card is in French.

The shell follows CrisisMaker: a white top ribbon with the Wavestone logo,
two buttons, **How it works** (Part 1) and **The platform** (Part 2, whose
dropdown is the role picker), graph search, the Decisions drawer, the Guided
demo, and a dark ribbon underneath. Cards, metrics and tables follow EBIOS RM.

**Part 1 · How it works** (the concept): Overview, Platform tour (13 stops
on the target diagram, from the components to "perimeter by perimeter" and
"never frozen"), Simple view and Detailed view (animated architecture with
the scenario control band, flows, a swimlane timeline with a NOW line, the
event log and the value of the scenario), Build it (four waves, stack, RACI),
Decision rights (autonomy ladder L0 to L3, threshold simulator, matrix).

**Part 2 · The platform** (the product) is designed around the work, not the
org chart: one product with modules grouped by function, and a role picker
that sets the landing page, the inbox and the visible modules (role-based
access).

| Group | Modules |
|-------|---------|
| Work | My home (per role), Inbox (what needs me now, with SLAs and agent proposals), Cases (queue and case workspace: golden thread, agent trace with policy check, blast radius, decisions, evidence, ask the case), Graph (search, saved questions, entity 360 with provenance, blast radius) |
| Engage | Third parties with Party 360, business units, regulators, crisis, culture, outbox |
| Platform | Design (playbook designer, decision-rights policy with 30-day backtest, standing approvals, tool catalogue), Build (agent catalog, studio, pipeline, connectors, graph model, backlog, roadmap), Operate (live ops, action journal with rollback, kill-switch, quality, cost, supervision) |
| Assurance | Model evals, deviation hunt, red team, adversary lab, LoD2 assurance, AI register |
| Steer | CISO cockpit, decisions, value and ROI, organisation, board brief |
| Outside roles | Risk owner app (phone, business framing), Supplier portal (external view), Evidence room (internal audit, read-only) |

Roles: CISO, Engage, Platform Ops Build, Platform Ops Run, Trust & Challenge,
SOC analyst, Risk owner (business), Supplier (external), Internal auditor.

Four scenarios run on a global engine (`engine.js`), so a scenario keeps
running while you browse the platform and its effects appear live there:
S1 CTI zero-day (WAF virtual patch, SIEM rule, quick forensic, supplier
questionnaire), S2 compromised identity (MFA fatigue on a payment approver,
the payment hold decided on the risk owner's phone), S3 regulator request
(DORA evidence in 5 days), S4 agent drift (prompt injection caught by Trust &
Challenge, kill-switch, fix, canary). Each scenario has its case (C-2301 to
C-2304) and stores an agent trace per step. Steps above threshold create a
decision that pauses the scenario until someone approves or rejects it. The
**Guided demo** tells the full S1 story across Part 1 and the modules,
switching roles on the way (supplier, analyst, risk owner, Build, Trust &
Challenge), plus one short tour per scenario. Keys: `Space` play or pause,
`→` next step; in the guided demo `→` / `←` / `Esc`.

Sources in `assets/cyber-platform/`: `core.js` (store, router, shell, role
access, UI kit, charts), `data.js` (the world: roles, modules, people,
agents, suppliers, baseline state), `scenarios.js`, `engine.js`,
`architecture.js`, `tour.js`, `platform.css` and one file per screen or
module in `screens/`. Plain scripts, no build step: the page also runs from
`file://`. `cyber-ai-platform-standalone.html` is the same demo in one file
(styles, scripts and fonts inlined), generated by
`python3 tools/build-cyber-platform.py`: never edit it by hand. Works on
phones (390 px).

## Deployment

Public URL: <https://debrief.cybersecwatcher.com>.
Cloudflare Pages project: `cyberdebrief`; production branch: `main`.

`.github/workflows/cloudflare-pages.yml` deploys on every push to `main`,
and can also be triggered manually. It requires the GitHub repository secret
`CLOUDFLARE_API_TOKEN` (Cloudflare Pages: Edit for the hosting account), and
repository variable `CLOUDFLARE_ACCOUNT_ID`.

Run `python3 tools/build-site.py` to prepare `dist/`. The staging script copies
public HTML pages, assets and design-system files; it excludes development
tools, Git metadata, local configuration and source presentation documents.
Preview with `python3 -m http.server --directory dist 8765`.

## assises.html · Lead the Shift (Les Assises 2026)

The 40-minute Wavestone workshop for CISOs at Les Assises 2026 ("How CISOs
must lead the AI transformation", Claire Carré and Gérôme Billois), rebuilt
from `Atelier_Assises 2026_V.07 light 2.pptx` in two steps:

1. `Assises-deckseeder.html`: the PowerPoint converted to HTML by the
   DeckSeeder PPTX import engine (deterministic import, PPTX style kept, then
   DeckSeeder's standalone HTML export). Its images are stored in
   `assets/assises/deckseeder/` instead of inline base64 (77 MB to 1 MB).
2. `assises.html`: the same talk in the logic of `ai-talk-photo-sleek.html`:
   a dark cinematic stage in Wavestone indigo and green, glass panels, film
   grain, camera-like transitions, titles that rise word by word, numbers
   that count up, and one click per idea. The deck's yacht is the thread: on
   each chapter card a new sail is hoisted live (Cyber for AI, Cyber against
   AI, Cyber with AI), then the crew. 32 scenes in 4 chapters plus the
   opening and the close.

`assises-wavestone.html` is a brighter Wavestone edition of the same 32
scenes (`assets/assises/wavestone.css` and `wavestone.js` layered on top):
content scenes on white and lavender with indigo type and a neon-green
highlighter swept under the key words, photo scenes on the indigo brand
gradient instead of black, the signature arcs drawn live, an indigo sweep
between grounds and on chapter cards, a yacht thumbnail that gains a sail on
each of the three AI levels, and a slow parallax on the decoration.

`assises-horizon.html` reinvents the form completely (same content, same
script and notes, read from `deck.js` at build time). One living sea of dots
runs under the whole talk and becomes the content: it rises into the
benchmark bars and lines up as the agentic wall, draws the seven agents as
hexagons, the organization perimeter and the shadow AI around it, turns
stormy when the threat speeds up and into speed lines on "it changed the
speed", fills the waffle charts, the funnel and the data lake, orbits as
agents, and writes "Lead the Shift." on the last screen. Around it: two
grounds that crossfade (paper, Wavestone indigo), editorial type (Poppins
with Newsreader italics), words that rise through masks, digits that roll,
photos that open through a horizon slit, and chapters as split screens where
the next sail is hoisted live. Sources: `assets/assises/horizon.src.html`,
`horizon.css`, `horizon.js`.

`assises-chart.html` (The Chart) rewrites the content and reinvents the form:
the talk is one nautical chart, and a camera flies over it from waypoint to
waypoint, with the route drawn as the talk advances. Same facts, new words
and a new order: Port Wavestone and its seven agents moored at a jetty, the
three shifts as ocean currents, the benchmark as depth soundings running onto
an agentic reef, discovery as a radar picture, platform controls as buoys,
agent identity as a ship's papers; the threats as five squalls on a night
chart, the new baseline as a 48-hour watch dial, virtual patching as a hull
cross-section, the market as a regatta; the three AI levels read from the
atoll's outer waters to its lagoon, which is the cyber data lake; the cyber
graph as a star chart; the crew as a heading, a lighthouse and a fleet; and
an arrival that pulls back over the whole voyage. Sources in
`assets/assises/chart/` (engine.js, one part file per chapter, boot.js).

`assises-standalone.html`, `assises-wavestone-standalone.html` `assises-horizon-standalone.html` and `assises-chart-standalone.html` are the same files with every image inlined, to copy
on a USB stick and run with no network. Both are generated, never edited by
hand: edit `assets/assises/` (`deck.src.html`, `deck.css`, `deck.js`, the
photos) and run `python3 tools/build-assises.py`.

Controls as in the other talks: `→` / `←` (or a remote), `P` synced presenter
view (script in French, notes, timer, next scene), `N` notes, `S` script as
subtitles, `O` outline, `B` black screen, `F` full screen, `?` help. The
notes list what was changed from the source deck (typos, merged slides 13 and
17, placeholders such as "XX tools consolidated" removed from screen) and the
open points still to settle before the session.

## ai-menu.html · front page

All the AI-risk pages (`ai-menu.html`, `ai-talk.html`, `ai.html`, `ai-fr.html`)
use the Wavestone design system on a white ground: indigo `451DC7` headings,
green `04F06A` accents, Poppins / Inter / IBM Plex Mono, and the indigo brand
surface for title, chapter and closing cards. Tokens are inlined from
<https://gbillois.github.io/HowToWavestone/wavestonedesign.css> so the files
stay offline.

The entry point for the AI-risk session: links to the visual talk
(`ai-talk.html`, recommended on stage), its photo edition
(`ai-talk-photos.html`), the full documentary (`ai.html`), the
first French iteration (`ai-fr.html`) and the OpenAI / Hugging Face deep dives
(`OAHF*.html`). Offline like the rest.

## ai-talk.html · Out of the Sandbox, the talk

`ai-talk-photos.html` is the same talk with full-screen photography (chapter
openers, recaps, places on the maps). It is generated, never edited by hand:
run `python3 tools/build-talk-photos.py` after changing `ai-talk.html` or
`assets/ai/photos/photoset.js`.

`ai-talk-photo-sleek.html` is the cinematic edition of the same talk: a dark
stage in Wavestone colours, glass panels, film grain, camera-like transitions,
titles that rise word by word and cinema bars on chapter cards. It is generated
too: run `python3 tools/build-talk-sleek.py` after changing `ai-talk.html`, the
photo set or `assets/ai/sleek/` (sleek.css, sleek.js).

The page opens in silence. On the title screen, A or the note button starts a
looping theme, synthesised live in the browser, and the score of the opening
(press again to turn the music off). One button, **Narration** (key R, K
to pause), plays a 16-second animated opening, goes straight to
the date and lets the talk play on its own: each scene's script is read by
recorded voices, its steps turn with the sentences and the next scene follows.
I plays the opening alone. The narration follows its own dramatised script,
`assets/ai/voice/narration-script.md`: a narrator and a cast of voices (the
engineers, the testers, the agents' messages, the scammers), with `>>` where
each click happens; real people only say their own public words, verbatim.
The voices are recorded offline with Kokoro-82M (Apache 2.0) into
`assets/ai/voice/` (about 18 minutes, under 20 with the pauses and the credits). Run
`python3 tools/build-talk-voice.py <kokoro folder>` after editing the script
(only the changed scenes are recorded again), then rebuild the sleek
edition. Without the recordings, the browser's own English voice reads instead.

The same 40-minute story told like a TED talk. It opens on its question,
"How is the threat changing with AI, and what can we do?", then on the date
and on Hugging Face realising this is not a normal attacker. There is no
agenda slide: it is built around eight questions, one per chapter; each
chapter card shows the question, a progress rail and the previous chapter's
answer, and each chapter ends on its answer in one sentence; the last screen,
left up during the questions, shows all eight questions and answers. The flow:
the Hugging Face case, the wave of similar cases, why an AI derails (prompt
injection included), the debate on AI rules, then the other half of the
problem, attackers using AI: against companies, on a world map with a key
figure per case, from one fake video call (Arup) to swarms of AI agents, then
against each of us (phishing,
fake parcels, cloned voices of loved ones), robots in
between, and what works.
Chapter 1 tells the Hugging Face case the way `OAHF-zoom.html` does: one
world, one camera that keeps stepping back (one agent, the chat room, the test
box, the internet, Hugging Face, the whole picture), in plain words, with the
key dates of each step and the referee that never existed, then zooms back in
on Hugging Face's investigation. It is preceded by how often OpenAI ships and
tests new models, and the exam itself.
Consecutive zoom slides fly from one framing to the next, so the step back
reads as one movement. Their labels keep their size on screen (they follow the
page's type size) and the world leaves them room at every step: no label
crosses a box, a line, a dot or another label, from 1024 × 768 to 2560 × 1440.
The press montages show real screenshots of the
articles (`assets/ai/press/`).
One idea per screen: big words
and numbers, pictograms, flow diagrams, maps and video clips. Long text stays
only where it is needed (quotes, the advice). Everything the presenter says
is in the presenter view (`P`), with facts and sources for questions in the
notes; `S` shows it as subtitles. Same chapters, media files and controls as
`ai.html`.

## ai.html · Out of the Sandbox

A 40-minute interactive documentary for an AI-risk awareness session in front
of large organisations, told the way an investigative TV magazine would: the
presenter clicks through, no voice-over required. It opens on one case
(OpenAI / Hugging Face) and ends with what each person can do. `ai.html` is the
English version; `ai-fr.html` keeps the first French iteration.

| # | Chapter | Minutes | Content |
|---|---------|---------|---------|
| 00 | Prologue | 0 - 2 | Cold open on Hugging Face's disclosure (16 July 2026) |
| 01 | The Exam | 2 - 10 | OpenAI / Hugging Face in plain language: the goal, agents talking to each other, the warning nobody acted on, the imaginary referee |
| 02 | The Wave | 10 - 14 | Press montage, the numbers behind it, a world map, the mechanism (an ordinary task, a break-in), Google, then Australia and the 84-day delay |
| 03 | Why It Derails | 14 - 20 | How an AI learns and what alignment is; derailing on its own vs. prompt injection, with a hidden-instruction email; why AIs seem to lie, cheat and organise; what researchers had already seen in the lab |
| 04 | The Attackers Level Up | 20 - 26 | Classic attackers using AI: a spying campaign run mostly by AI, one extortionist and 17 victims, fake employees, the Ferrari deepfake stopped by one question, malware that asks an AI, the new pace of attacks |
| 05 | The Body | 26 - 31 | The 2026 robot games (impressive clips, then the crash), the robot as a computer that walks, the Unitree Go2 takeover and its app store, warning signs, what security leaders should do now |
| 06 | You | 31 - 35 | Fake parcels with generated photos, AI-written scam emails, the Arup deepfake, fake evidence |
| 07 | What Works | 35 - 40 | When in doubt (take your time, check another way, ask what only they know as at Ferrari, use AI, speak up); everyday basics (updates, password manager, strong authentication); lock email, money and health first; AI on your side; three questions for leaders; what worked |

Written for a general audience: plain language on screen, technical detail in
the speaker notes for questions.

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

## OAHF-techdetails.html — the technical teardown

A scroll-driven, animated deep dive into how the escape actually worked,
mechanism by mechanism. It walks the eight-move chain from the eval sandbox to
cluster-admin inside Hugging Face: each stage shows the primitive at play (SSRF,
auth bypass, server-side RCE, covert channel, local priv-esc, cloud IMDS, K8s
RBAC, arbitrary file read, template injection, token theft, network pivot), an
expandable "Technical detail" panel with the numbered micro-sequence of actions,
and a green "Unlocks Stage N" line that makes the chaining explicit. Count-up
stats, a stylised swarm message-board visual and a dated timeline round it out.
Conceptual and educational: no operational exploit code. Standalone and offline
like the rest, built from the same public sources (METR, Hugging Face, OpenAI,
swarmtraces.org, collusion.wiki).

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

The file pins `@babel/standalone@7.29.0` like `notpetya.html`, but also registers
the `react` preset explicitly with `runtime: 'classic'`. Babel 8 defaults to the
automatic JSX runtime, which emits bare ESM imports that a plain `<script>`
cannot execute — so without this the page fails silently if the CDN ever serves
a newer major. `notpetya.html` still has that latent exposure.

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
