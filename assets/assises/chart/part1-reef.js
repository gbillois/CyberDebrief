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
const P1_REEF = [[5270, 1930], [5500, 1880], [5740, 1960], [5870, 2230], [5810, 2560], [5860, 2840], [5680, 3000], [5410, 2970], [5260, 2760], [5300, 2480], [5210, 2210]];
const P1_X0 = 4600, P1_X1 = 5830, P1_DEEP = 4660, P1_SHAL = 5340;
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
  // the survey sheet: a clean patch of water under the board, so only our soundings read
  s += `<filter id="p1-feather" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="30"/></filter>
    <g class="fl" data-flag="p1-t1 p1-t2 p1-t3 p1-reef"><rect x="4560" y="1880" width="1420" height="1050" rx="60" fill="var(--sea)" filter="url(#p1-feather)"/></g>`;
  s += `<g class="fl" data-flag="p1-reef">
    <path d="${p1Loop(P1_REEF.map(([x, y]) => [x + (x - 5540) * .08, y + (y - 2440) * .05]))}" fill="var(--sea2)" stroke="none"/>
    <path d="${p1Loop(P1_REEF)}" fill="url(#p1-hatch)" stroke="var(--coral)" stroke-width="6" stroke-dasharray="2 14" stroke-linecap="round"/>`;
  for (let i = 0; i < 60; i++) { const x = 5280 + r() * 540, y = 1950 + r() * 1000; if (P1_SOUND.some(o => y > o.y - 110 && y < o.y + 70)) continue; s += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})" stroke="var(--coral)" stroke-width="4" opacity=".75"><path d="M-14,0H14M0,-14V14"/><circle r="3" fill="var(--coral)" stroke="none" cx="10" cy="-10"/></g>`; }
  s += `<text class="p1-reefname" transform="translate(5935 2440) rotate(90)">The agentic reef</text></g>`;
  // transects: one per pair, they draw themselves topic by topic
  P1_SOUND.forEach(o => {
    s += `<g class="fl" data-flag="p1-t${o.t}"><path class="draw" data-flag="p1-t${o.t}" pathLength="1" d="M${P1_X0},${o.y} L${P1_X1},${o.y}" stroke="var(--indigo)" stroke-width="3" stroke-dasharray="1" fill="none" opacity=".55"/>`;
    for (let x = P1_X0; x <= P1_X1; x += 80) s += `<line x1="${x}" y1="${o.y - 7}" x2="${x}" y2="${o.y + 7}" stroke="var(--indigo)" stroke-width="2" opacity=".35"/>`;
    s += `<circle cx="${P1_DEEP - 18}" cy="${o.y}" r="9" fill="var(--indigo)"/><circle cx="${P1_SHAL - 18}" cy="${o.y}" r="9" fill="var(--card)" stroke="var(--indigo)" stroke-width="4"/></g>`;
  });
  // the same soundings as small chart figures, for the zoomed-out view
  s += `<g class="fl" data-flag="p1-sv">${P1_SOUND.map(o => `<text class="p1-svd" x="${P1_DEEP}" y="${o.y - 26}">${o.deep[0]}</text><text class="p1-svd s" x="${P1_SHAL}" y="${o.y - 26}">${o.shal[0]}</text>`).join('')}</g>`;
  s += `<g class="fl" data-flag="p1-reef">${P1_SOUND.map(o => `<circle cx="${P1_SHAL - 18}" cy="${o.y}" r="9" fill="var(--coral)"/>`).join('')}</g>`;
  return s;
});

// a water name for the reef, before it is surveyed
LAYERS.push(() => `<g class="fl" data-flag="p1-name"><text class="p1-water" x="5500" y="2300">the agentic</text><text class="p1-water" x="5560" y="2400">reef</text></g>`);

// ─── passage 1 · FIND: the org isle as a radar picture ─────────────────
const P1_C = [3700, 1700];
const P1_HB = [ // harbours inside the perimeter: x, y, kind, label
  [3270, 1420, 'ent', 'Enterprise agentic platform'], [3830, 1180, 'ent', 'Enterprise agentic platform'],
  [4130, 1700, 'cit', 'Citizen AI'],
  [3260, 1960, 'saas', 'SaaS app'], [3680, 2200, 'saas', 'SaaS app'], [4050, 2080, 'saas', 'SaaS app']];
const P1_OUT = [[4960, 980, 'Personal AI'], [5130, 1640, 'BYOAI'], [4920, 2330, 'BYOA']];
LAYERS.push(() => {
  const [cx, cy] = P1_C;
  let s = `<g class="fl" data-flag="p1-find">
    <path id="p1-perim" d="${blob(cx, cy, 880, 5, .18, 1.15, 1)}" fill="none" stroke="var(--ink)" stroke-width="5" stroke-dasharray="26 14"/>
    <text class="p1-perimt"><textPath href="#p1-perim" startOffset="59%">ORGANIZATION PERIMETER</textPath></text>`;
  [520, 1040, 1560].forEach(r => { s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--green-d)" stroke-width="2.5" stroke-dasharray="4 12" opacity=".7"/>`; });
  s += `<g class="spin p1-sweep"><circle cx="${cx}" cy="${cy}" r="1560" fill="none" stroke="none"/>`;
  for (let i = 0; i < 14; i++) { const a0 = (-i * 3.2 - 3.2) * Math.PI / 180, a1 = (-i * 3.2) * Math.PI / 180; s += `<path d="M${cx},${cy} L${cx + Math.cos(a0) * 1560},${cy + Math.sin(a0) * 1560} A1560,1560 0 0 1 ${cx + Math.cos(a1) * 1560},${cy + Math.sin(a1) * 1560}Z" fill="var(--green)" opacity="${(.3 * (1 - i / 14)).toFixed(3)}"/>`; }
  s += `<line x1="${cx}" y1="${cy}" x2="${cx + 1560}" y2="${cy}" stroke="var(--green-d)" stroke-width="5"/></g>
    <circle cx="${cx}" cy="${cy}" r="14" fill="var(--green-d)"/>`;
  P1_HB.forEach(([x, y, k]) => {
    if (k === 'ent') s += `<g transform="translate(${x} ${y})"><circle r="58" fill="var(--indigo)"/><circle r="80" fill="none" stroke="var(--indigo)" stroke-width="4"/><path d="M0,-30V30M-22,8a22,22 0 0 0 44,0M-14,-18H14" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;
    if (k === 'saas') s += `<g transform="translate(${x} ${y})"><rect x="-36" y="-36" width="72" height="72" rx="10" fill="var(--card)" stroke="var(--indigo)" stroke-width="7"/><circle r="11" fill="var(--indigo)"/></g>`;
    if (k === 'cit') s += `<g transform="translate(${x} ${y})"><circle r="40" fill="var(--card)" stroke="var(--amber)" stroke-width="8"/><circle r="14" fill="var(--amber)"/></g>`;
  });
  s += `</g><g class="fl" data-flag="p1-out">`;
  P1_OUT.forEach(([x, y]) => { s += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="var(--coral)" stroke-width="3" stroke-dasharray="10 12" opacity=".7"/><g transform="translate(${x} ${y})"><circle r="70" fill="none" stroke="var(--coral)" stroke-width="4" class="pulse"/><circle r="30" fill="var(--coral)" class="blink"/></g>`; });
  return s + `</g>`;
});

// ─── passage 2 · FENCE: the plan of an agentic platform, inset on the isle ─
const P1_PL = { x: 2990, y: 1040, w: 1420, h: 1010 };
const P1_BK = { // blocks of the plan: x, y, w, h, label, sub
  rag: [3060, 1230, 400, 130, 'Knowledge / RAG'], tools: [3060, 1395, 400, 130, 'Tools &amp; external systems'], llm: [3060, 1560, 400, 130, 'LLMs / models'],
  orc: [3580, 1250, 300, 120, 'Orchestrator / harness'],
  fe: [4000, 1250, 340, 130, 'Application frontend'], users: [4000, 1560, 340, 130, 'End users / systems'],
  infra: [3060, 1790, 1280, 100, 'Build / runtime infrastructure'], mon: [3060, 1915, 1280, 100, 'Monitoring &amp; observability'] };
// buoys: n, x, y, control, what it does
const P1_BUOY = [[1, 3940, 1315, 'Guardrails', 'filter prompts and outputs'], [2, 3505, 1625, 'Model protection', 'secure the AI supply chain'], [3, 3505, 1295, 'Data &amp; RAG security', 'control what agents retrieve'],
  [4, 3505, 1460, 'Sandboxing', 'isolate code and tool execution'], [5, 4270, 1840, 'Posture management', 'find exposed AI services'], [6, 4270, 1965, 'Detection &amp; response', 'send AI logs to the SOC']];
LAYERS.push(() => {
  const { x, y, w, h } = P1_PL, B = P1_BK;
  const rect = ([bx, by, bw, bh], cls = '') => `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" class="p1-blk ${cls}"/>`;
  let s = `<g class="fl" data-flag="p1-plan">
    <rect x="${x - 18}" y="${y - 18}" width="${w + 36}" height="${h + 36}" fill="var(--card)" stroke="var(--ink)" stroke-width="2"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--card)" stroke="var(--ink)" stroke-width="5"/>
    <line x1="${x}" y1="${y + 120}" x2="${x + w}" y2="${y + 120}" stroke="var(--paperline)" stroke-width="3"/>
    <rect x="3540" y="1205" width="380" height="490" rx="28" fill="var(--sea2)" stroke="var(--coast)" stroke-width="4"/>`;
  // the channels: AI flows between blocks
  const fl = (x1, y1, x2, y2) => `<path d="M${x1},${y1} L${x2},${y2}" class="p1-flow flow"/>`;
  s += fl(3460, 1295, 3580, 1295) + fl(3460, 1460, 3640, 1460) + fl(3460, 1625, 3560, 1625) + fl(3880, 1315, 4000, 1315) + fl(4170, 1380, 4170, 1560) + fl(3730, 1370, 3730, 1480);
  s += Object.entries(B).map(([k, b]) => rect(b, k)).join('');
  // agents: three boats moored in the basin
  [3640, 3730, 3820].forEach(bx => { s += `<g transform="translate(${bx} 1545)"><path d="M-34,6 L34,6 L24,20 L-26,20Z" fill="var(--ink)"/><path d="M-4,2 L-4,-52 L26,2Z" fill="var(--indigo)"/></g>`; });
  s += `</g>`;
  // the gateway: one lock that every AI flow passes
  s += `<g class="fl" data-flag="p1-gw"><rect x="3500" y="1170" width="460" height="560" rx="44" fill="none" stroke="var(--green-d)" stroke-width="12" stroke-dasharray="40 16" class="flow"/></g>`;
  P1_BUOY.forEach(([n, bx, by]) => {
    s += `<g class="fl" data-flag="p1-plan"><g transform="translate(${bx} ${by})"><circle r="36" class="p1-buoy"/><text class="p1-buoyn" y="13">${n}</text></g></g>
      <g class="fl" data-flag="p1-b${n}"><g transform="translate(${bx} ${by})"><circle r="54" fill="var(--green)" opacity=".25"/><circle r="36" fill="var(--green)" stroke="var(--green-x)" stroke-width="5"/><text class="p1-buoyn" y="13" style="fill:#1E0D57">${n}</text></g></g>`;
  });
  return s;
});

// ─── passage 3 · NAME: agents as AIS targets, each must show its papers ─
const P1_AIS = [[4230, 2930, 52, 1], [3900, 2690, 18, 0], [4700, 3230, -28, 0], [4020, 3270, 75, 0], [4820, 2860, 120, 0]];
const P1_PAPERS = [ // field, question, capability, market, [governance, access, protect]
  ['Name', 'Who is the agent?', 'Discovery &amp; registry', 'mature', ['must', '', 'help']],
  ['Flag', 'On behalf of whom?', 'Delegation', 'emerging', ['', 'must', '']],
  ['Permits', 'What can it do?', 'Authorization', 'emerging', ['must', 'help', 'help']],
  ['Destination', 'What is its intent?', 'Intent validation', 'early', ['', 'will', 'will']],
  ['Clearance', 'May it act, now?', 'Runtime enforcement', 'emerging', ['', 'must', 'must']],
  ['Logbook', 'What did it do?', 'Audit &amp; governance', 'mature', ['must', 'help', '']]];
LAYERS.push(() => {
  let s = `<g class="fl" data-flag="p1-ais">`;
  P1_AIS.forEach(([x, y, hd, sel]) => {
    const a = hd * Math.PI / 180, dx = Math.sin(a), dy = -Math.cos(a);
    s += `<path d="M${x - dx * 260},${y - dy * 260} L${x},${y}" stroke="var(--indigo)" stroke-width="3" stroke-dasharray="4 14" fill="none" opacity=".6"/>
      <path d="M${x + dx * 46},${y + dy * 46} L${x + dx * 190},${y + dy * 190}" stroke="var(--ink)" stroke-width="4"/>
      <g transform="translate(${x} ${y}) rotate(${hd})"><path d="M0,-46 L28,30 L-28,30Z" fill="${sel ? 'var(--green)' : 'var(--card)'}" stroke="var(--ink)" stroke-width="5" stroke-linejoin="round"/></g>`;
    if (sel) s += `<g transform="translate(${x} ${y})" stroke="var(--ink)" stroke-width="6" fill="none">${[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => `<path d="M${u * 95},${v * 55} L${u * 95},${v * 95} L${u * 55},${v * 95}"/>`).join('')}</g>
      <circle cx="${x}" cy="${y}" r="150" fill="none" stroke="var(--green-d)" stroke-width="4" class="pulse"/>`;
  });
  return s + `</g>`;
});

// ─── uncharted waters: reported dangers, not yet surveyed ──────────────
const P1_UNS = [[4700, 560], [5150, 390], [5700, 430], [5950, 720], [5900, 1160], [5600, 1400], [5100, 1420], [4760, 1170], [4620, 850]];
const P1_DGR = [[4980, 760, 1], [5500, 1090, 2]];
LAYERS.push(() => {
  let s = `<g class="fl" data-flag="p1-uns">
    <path d="${p1Loop(P1_UNS)}" fill="var(--sea)" filter="url(#p1-feather)"/>
    <path d="${p1Loop(P1_UNS)}" fill="url(#p1-uns)" stroke="var(--ink)" stroke-width="5" stroke-dasharray="40 14 6 14"/>
    <text class="p1-unst" x="5300" y="560">UNSURVEYED</text></g>`;
  P1_DGR.forEach(([x, y, n]) => {
    s += `<g class="fl" data-flag="p1-u${n}"><circle cx="${x}" cy="${y}" r="120" fill="var(--card)" fill-opacity=".6" stroke="var(--coral)" stroke-width="6" stroke-dasharray="2 14" stroke-linecap="round"/>
      <path d="M${x - 30},${y}H${x + 30}M${x},${y - 30}V${y + 30}" stroke="var(--coral)" stroke-width="7"/><circle cx="${x + 22}" cy="${y - 22}" r="6" fill="var(--coral)"/><circle cx="${x - 22}" cy="${y + 22}" r="6" fill="var(--coral)"/></g>`;
  });
  return s;
});

const p1Sound = ([v, dec, cap], cls, f) => `<div class="p1-sd ${cls}"${fa(f)}><b>${odo(v, dec)}<small>%</small></b><span class="cap">${cap}</span></div>`;
const p1Board = () => P1_TOPIC.map(([t, y, name]) => pin(P1_X0 + 10, y, `<span class="p1-topic"><i>0${t}</i>${name}</span>`, 'l', t)).join('')
  + P1_SOUND.map(o => pin(P1_DEEP, o.y, p1Sound(o.deep, 'deep'), 'p1-at', o.t) + pin(P1_SHAL, o.y, p1Sound([o.shal[0], 0, o.shal[1]], 'shal'), 'p1-at', o.t)).join('');

SCENES.push(
// 1 · the waypoint card
{ ch: 'c1', type: 'reef', title: 'Waypoint 01 · The agentic reef', ref: 'Chapter 1: Cyber for AI', leg: 1, cam: { x: 4300, y: 2550, w: 4800 }, on: ['p1-name'],
  html: () => waypointCard({ n: '01', place: 'The agentic reef', theme: '<em>Cyber for AI:</em> secure the ecosystem', line: 'Protecting models is no longer enough. Now you govern the <b>platforms</b>, the <b>agents</b>, and <b>what they do</b>.', photo: IMG.yacht1, cap: 'First sail set: cyber for AI.' }) },

// 2 · the benchmark as soundings
{ ch: 'c1', type: 'reef', title: 'The soundings', ref: '2026 AI Cyber Benchmark', leg: 1, cam: { x: 4900, y: 2420, w: 2400 },
  onF: { 1: ['p1-t1'], 2: ['p1-t2'], 3: ['p1-t3'], 4: ['p1-reef'] },
  html: () => `${p1Board()}
  <div class="cart at-l w-s p1-bench p1-grow"><span class="tab">2026 AI Cyber Benchmark</span>
    <p class="kick">AI security maturity</p>
    <p class="p1-mat">${odo(31)}<small>%</small><i>→</i>${odo(45)}<small>%</small></p>
    <p class="p"><b>+14 points in one year.</b> The fundamentals are in place.</p>
    <p class="p1-aground"${fa(4)}>Then progress runs aground: <em>on agentic AI.</em></p>
    <div class="p1-legend"><b>Soundings in % of companies</b>
      <span><i class="d">72</i>deep water: practice in place</span>
      <span><i class="s">12</i>shallows: the agentic gap</span>
      <span${fa(4)}><i class="h"></i>the agentic reef</span>
      <small>Source: Wavestone, 2026 AI Cyber Benchmark</small></div></div>` },
// 3 · passage 1: find
{ ch: 'c1', type: 'reef', title: 'Passage 1 · Find', ref: 'Break the wall 1/3: discovery', leg: 1, cam: { x: 4620, y: 1700, w: 4000 },
  on: ['p1-find'], onF: { 1: ['p1-out'] },
  html: () => `${P1_HB.map(([x, y, k, l]) => pin(x, y + (k === 'ent' ? 105 : 70), `<span class="p1-hb ${k}">${l}</span>`, 'b')).join('')}
  ${P1_OUT.map(([x, y, l]) => pin(x, y + 90, `<span class="p1-blip">${l}<i>unknown contact</i></span>`, 'b', 1)).join('')}
  <div class="cart at-tr w-s p1-find p1-grow"><span class="tab">Passage 1 · Find</span>
    <p class="kick">Discovery</p><h2 class="h s t">You cannot secure an agent <em>you cannot see</em></h2>
    <div class="p1-look"${fa(2)}><b class="p1-lbl">Where to look</b>
      <div><i class="k ent"></i><p><b>Enterprise AI</b>review platforms &amp; contracts · scan repos for AI keys, models &amp; libraries</p></div>
      <div><i class="k saas"></i><p><b>SaaS</b>spot AI apps through the web gateway · use categories &amp; risk scores</p></div>
      <div><i class="k cit"></i><p><b>Citizen AI &amp; BYOAI</b>audit mail &amp; file permissions · watch direct AI API calls · detect local AI tools &amp; MCP configs · review AI subscriptions &amp; expenses</p></div></div>
    <div class="p1-mv"${fa(3)}><b class="p1-lbl">Three moves</b>${moves([['One policy, named owners', 'IT and AI teams share one agent policy'], ['Continuous discovery', 'reconciled with the agent registry'], ['A discovery tool', 'that feeds the registry automatically']])}</div></div>` },
// 4 · passage 2: fence
{ ch: 'c1', type: 'reef', title: 'Passage 2 · Fence', ref: 'Break the wall 2/3: platforms', leg: 1, cam: { x: 4400, y: 1560, w: 3200 },
  on: ['p1-plan'], onF: { 1: ['p1-b1'], 2: ['p1-b2'], 3: ['p1-b3'], 4: ['p1-b4'], 5: ['p1-b5'], 6: ['p1-b6'], 7: ['p1-gw'] },
  html: () => `${pin(P1_PL.x + 40, P1_PL.y + 60, `<span class="p1-plt">Plan · an agentic AI platform<i>example architecture</i></span>`, 'l')}
  ${pin(3060, 1200, '<span class="p1-colh">Inputs &amp; execution</span>', 'l')}${pin(4000, 1220, '<span class="p1-colh">User interface</span>', 'l')}
  ${Object.entries(P1_BK).map(([k, [bx, by, bw, bh, l]]) => pin(bx + bw / 2, by + bh / 2, `<span class="p1-bl ${k}">${l}</span>`)).join('')}
  ${pin(3730, 1640, '<span class="p1-bl ag">Agents<i>skills, memory</i></span>')}
  ${pin(3730, 1760, '<span class="p1-gwl">AI gateway · every AI flow goes through it</span>', '', 7)}
  <div class="cart at-tr p1-fence p1-grow"><span class="tab">Passage 2 · Fence</span>
    <p class="kick">Platforms</p><h2 class="h s t">Secure the platforms <em>agents run on</em></h2>
    <ol class="p1-ctl">${P1_BUOY.map(([n, , , a, b]) => `<li${fa(n)}><i>${n}</i><span><b>${a}</b>${b}</span></li>`).join('')}</ol>
    <div class="p1-mv"${fa(7)}><b class="p1-lbl">Three moves</b>${moves([['Map what you have', 'the security functions of your current platforms'], ['One AI security platform', 'linked to an AI gateway: every AI flow goes through it'], ['Red-team it', 'from the dev environment to internet-facing functions']])}</div></div>` },
// 5 · passage 3: name
{ ch: 'c1', type: 'reef', title: 'Passage 3 · Name', ref: 'Break the wall 3/3: identity', leg: 1, cam: { x: 5150, y: 2850, w: 3000 }, on: ['p1-ais'],
  html: () => `${P1_AIS.map(([x, y, , sel]) => sel ? pin(x - 125, y + 40, `<span class="p1-ais sel">Agent<i>papers, please</i></span>`, 'r') : pin(x + 60, y + 75, `<span class="p1-ais">agent</span>`, 'l')).join('')}
  <div class="cart at-tr p1-papers p1-grow"><span class="tab">Passage 3 · Name</span>
    <p class="kick">Agent identity</p><h2 class="h s t">Every agent must <em>show its papers</em></h2>
    <table class="p1-tab"><thead><tr><th colspan="2">Six questions</th><th>The capability</th><th>Market</th><th class="d"${fa(1)}>Gov.</th><th class="d"${fa(1)}>Access</th><th class="d"${fa(1)}>Protect</th></tr></thead>
    <tbody>${P1_PAPERS.map(([f, q, c, m, d]) => `<tr><td class="f">${f}</td><td class="q">${q}</td><td class="c">${c}</td><td><span class="p1-m ${m}">${m}</span></td>${d.map(v => `<td class="d">${v ? `<i class="p1-dt ${v}"${fa(1)}></i>` : ''}</td>`).join('')}</tr>`).join('')}</tbody></table>
    <p class="p1-key"${fa(1)}><em>Who handles it: AI / agent <b>governance</b>, <b>access</b>, <b>protect</b></em><span><i class="p1-dt must"></i>must do</span><span><i class="p1-dt help"></i>helps</span><span><i class="p1-dt will"></i>will do</span></p>
    <div class="p1-mv3"${fa(2)}>${moves([['Assess what you can enforce', 'identity providers, agentic platforms, gateways, xDR: find the gaps and the compensating tools'], ['Minimum rules for every agent', 'unique identity, human sponsor, delegation, least privilege, short-lived credentials, traceability'], ['An enforcement POC', 'on a real agent, end to end: identity → human delegation → scoped access → runtime decision → action-level logging']])}</div></div>` },
// 6 · uncharted waters: the other emerging challenges
{ ch: 'c1', type: 'reef', title: 'Uncharted waters', ref: 'Other emerging challenges', leg: 1, cam: { x: 4900, y: 980, w: 3200 },
  on: ['p1-uns'], onF: { 1: ['p1-u1'], 2: ['p1-u2'] },
  html: () => `${pin(4980, 900, `<span class="p1-dgl">Resilience<i>reported · position approximate</i></span>`, 'b', 1)}
  ${pin(5500, 1230, `<span class="p1-dgl">Open-weight models<i>reported · position approximate</i></span>`, 'b', 2)}
  <div class="cart at-tl w-s p1-grow"><span class="tab">Beyond the reef</span>
    <p class="kick">Other emerging challenges</p><h2 class="h s t">Uncharted <em>waters</em></h2>
    <p class="p">Two more dangers are reported, not yet surveyed. Chart them before you sail there.</p>
    <div class="p1-dg"${fa(1)}><b>Resilience</b><ul><li>switch or rebuild your models</li><li>recover datasets and knowledge bases</li><li>validate integrity, so AI decisions stay trustworthy</li></ul></div>
    <div class="p1-dg"${fa(2)}><b>Open-weight models</b><ul><li>assess model security before adoption</li><li>validate fine-tuning integrity</li><li>monitor modifications</li><li>secure the AI supply chain: model security, governance, lifecycle</li></ul></div></div>` },

// 7 · the full chart: QR to the benchmark
{ ch: 'c1', type: 'reef', title: 'Take the full chart', ref: 'Discover the benchmark', leg: 1, cam: { x: 4250, y: 1700, w: 5800 },
  on: ['p1-reef', 'p1-t1', 'p1-t2', 'p1-t3', 'p1-sv', 'p1-uns', 'p1-u1', 'p1-u2'],
  html: () => `<div class="cart at-l p1-cta"><span class="tab">2026 AI Cyber Benchmark</span>
    <div class="p1-ctag"><div><p class="kick">Take the full chart</p><h2 class="h s t">Every sounding, <em>every topic</em></h2>
      <p class="p">Access the full benchmark, and see where you stand against your peers.</p>
      <div class="p1-qr"><img src="${IMG.qr}" alt="QR code to the 2026 AI Cyber Benchmark"><span>Scan to access<br>the full benchmark<b>wavestone.com/en</b></span></div></div>
      <figure><img src="${IMG.mountain}" alt=""></figure></div></div>` },
);
