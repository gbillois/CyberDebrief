// ════════════════════════════════════════════════════════════════════════
// PART 1 · THE AGENTIC REEF · Cyber for AI (6 - 17 min)
// Region x 2600-6000, y 300-3700: the org isle (3700,1700), the reef waypoint
// (4500,2500). The benchmark is a line of soundings that runs onto a reef;
// then three passages through it (find, fence, name), uncharted waters, and
// the full chart (QR).
// ════════════════════════════════════════════════════════════════════════

// closed Catmull-Rom path through points
const p1Loop = pts => { const n = pts.length; let d = `M${pts[0][0]},${pts[0][1]}`; for (let i = 0; i < n; i++) { const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n]; d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]},${p2[1]}`; } return d + 'Z'; };

// ─── the reef and the line of soundings (benchmark) ─────────────────────
const P1_REEF = [[5330, 1930], [5560, 1880], [5800, 1960], [5930, 2230], [5870, 2560], [5920, 2840], [5740, 3000], [5470, 2970], [5320, 2760], [5360, 2480], [5270, 2210]];
const P1_X0 = 4600, P1_X1 = 5880, P1_DEEP = 4660, P1_SHAL = 5400;
// topic, [deep %, decimals, caption], [shallow %, caption]
const P1_SOUND = [
  { t: 1, y: 2040, deep: [72, 0, 'identify AI use in new procurement'], shal: [12, 'know the AI systems that run outside their platform'] },
  { t: 1, y: 2200, deep: [88, 0, 'adapted risk management to AI, with a group-level AI security lead'], shal: [33, 'cover agentic AI in their risk analyses'] },
  { t: 2, y: 2420, deep: [87.5, 1, 'generate logs in their AI applications'], shal: [8, 'send those logs to the SOC'] },
  { t: 2, y: 2580, deep: [50, 0, 'run dedicated AI red teaming'], shal: [11, 'have security beyond the native features'] },
  { t: 3, y: 2800, deep: [72, 0, 'built privacy compliance into the AI lifecycle'], shal: [15, 'have identity &amp; access management fit for AI agents'] },
];
const P1_TOPIC = [[1, 1935, 'AI discovery &amp; risk management'], [2, 2315, 'AI platform security'], [3, 2695, 'AI identity']];

LAYERS.push(() => {
  let s = `<defs><pattern id="p1-hatch" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><line x1="0" y1="0" x2="0" y2="26" stroke="var(--coral)" stroke-width="5" opacity=".42"/></pattern>
    <pattern id="p1-uns" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><line x1="0" y1="0" x2="0" y2="40" stroke="var(--indigo)" stroke-width="2" stroke-dasharray="6 10" opacity=".45"/></pattern></defs>`;
  // the reef: a shallow tint, a hatch, a dotted danger line, rocks
  const r = rng(101);
  s += `<g class="fl" data-flag="p1-reef">
    <path d="${p1Loop(P1_REEF.map(([x, y]) => [x + (x - 5600) * .18, y + (y - 2440) * .1]))}" fill="var(--sea2)" stroke="none"/>
    <path d="${p1Loop(P1_REEF)}" fill="url(#p1-hatch)" stroke="var(--coral)" stroke-width="6" stroke-dasharray="2 14" stroke-linecap="round"/>`;
  for (let i = 0; i < 26; i++) { const x = 5320 + r() * 560, y = 1950 + r() * 1000; s += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})" stroke="var(--coral)" stroke-width="4" opacity=".75"><path d="M-14,0H14M0,-14V14"/><circle r="3" fill="var(--coral)" stroke="none" cx="10" cy="-10"/></g>`; }
  s += `<text class="p1-reefname" transform="translate(6010 2440) rotate(90)">The agentic reef</text></g>`;
  // transects: one per pair, they draw themselves topic by topic
  P1_SOUND.forEach(o => {
    s += `<g class="fl" data-flag="p1-t${o.t}"><path class="draw" data-flag="p1-t${o.t}" pathLength="1" d="M${P1_X0},${o.y} L${P1_X1},${o.y}" stroke="var(--indigo)" stroke-width="3" stroke-dasharray="1" fill="none" opacity=".55"/>`;
    for (let x = P1_X0; x <= P1_X1; x += 80) s += `<line x1="${x}" y1="${o.y - 7}" x2="${x}" y2="${o.y + 7}" stroke="var(--indigo)" stroke-width="2" opacity=".35"/>`;
    s += `<circle cx="${P1_DEEP - 18}" cy="${o.y}" r="9" fill="var(--indigo)"/><circle cx="${P1_SHAL - 18}" cy="${o.y}" r="9" fill="var(--card)" stroke="var(--indigo)" stroke-width="4"/></g>`;
  });
  s += `<g class="fl" data-flag="p1-reef">${P1_SOUND.map(o => `<circle cx="${P1_SHAL - 18}" cy="${o.y}" r="9" fill="var(--coral)"/>`).join('')}</g>`;
  return s;
});

// a water name for the reef, before it is surveyed
LAYERS.push(() => `<g class="fl" data-flag="p1-name"><text class="p1-water" x="5500" y="2300">the agentic</text><text class="p1-water" x="5560" y="2400">reef</text></g>`);

const p1Sound = ([v, dec, cap], cls, f) => `<div class="p1-sd ${cls}"${fa(f)}><b>${odo(v, dec)}<small>%</small></b><span class="cap">${cap}</span></div>`;
const p1Board = () => P1_TOPIC.map(([t, y, name]) => pin(P1_X0 + 10, y, `<span class="p1-topic"><i>0${t}</i>${name}</span>`, 'l', t)).join('')
  + P1_SOUND.map(o => pin(P1_DEEP, o.y, p1Sound(o.deep, 'deep'), 'p1-at', o.t) + pin(P1_SHAL, o.y, p1Sound([o.shal[0], 0, o.shal[1]], 'shal'), 'p1-at', o.t)).join('');

SCENES.push(
// 1 · the waypoint card
{ ch: 'c1', type: 'reef', title: 'Waypoint 01 · The agentic reef', ref: 'Chapter 1: Cyber for AI', leg: 1, cam: { x: 4300, y: 2550, w: 4800 }, on: ['p1-name'],
  html: () => waypointCard({ n: '01', place: 'Waypoint 01 · The agentic reef', theme: '<em>Cyber for AI:</em> secure the ecosystem', line: 'Protecting models is no longer enough. Now you govern the <b>platforms</b>, the <b>agents</b>, and <b>what they do</b>.', photo: IMG.yacht1, cap: 'First sail set: cyber for AI.' }) },

// 2 · the benchmark as soundings
{ ch: 'c1', type: 'reef', title: 'The soundings', ref: '2026 AI Cyber Benchmark', leg: 1, cam: { x: 4900, y: 2420, w: 2400 },
  onF: { 1: ['p1-t1'], 2: ['p1-t2'], 3: ['p1-t3'], 4: ['p1-reef'] },
  html: () => `${p1Board()}
  <div class="cart at-l w-s p1-bench"><span class="tab">2026 AI Cyber Benchmark</span>
    <p class="kick">AI security maturity</p>
    <p class="p1-mat">${odo(31)}<small>%</small><i>→</i>${odo(45)}<small>%</small></p>
    <p class="p"><b>+14 points in one year.</b> The fundamentals are in place.</p>
    <p class="p1-aground"${fa(4)}>Then progress runs aground: <em>on agentic AI.</em></p>
    <div class="p1-legend"><b>Soundings in % of companies</b>
      <span><i class="d">72</i>deep water: practice in place</span>
      <span><i class="s">12</i>shallows: the agentic gap</span>
      <span${fa(4)}><i class="h"></i>the agentic reef</span>
      <small>Source: Wavestone, 2026 AI Cyber Benchmark</small></div></div>` },
);
