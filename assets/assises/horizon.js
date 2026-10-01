// ════════════════════════════════════════════════════════════════════════
// LEAD THE SHIFT · Horizon edition
// Built into assises-horizon.html by tools/build-assises.py, which also
// injects SCRIPT (what to say and the notes, per scene, read from deck.js so
// the three editions share one script). One living sea of dots runs under the
// talk: every element with data-dots borrows dots from the sea and gives
// them back when it leaves.
// ════════════════════════════════════════════════════════════════════════

// every image is named once, so the standalone copy inlines each only once
const IMG = {
  yacht0: 'assets/assises/yacht-0.jpg', yacht1: 'assets/assises/yacht-1.jpg', yacht2: 'assets/assises/yacht-2.jpg', yacht3: 'assets/assises/yacht-3.jpg',
  crew: 'assets/assises/yacht-crew.jpg', regatta: 'assets/assises/regatta.jpg', lighthouse: 'assets/assises/lighthouse.jpg', mountain: 'assets/assises/mountain.jpg',
  claire: 'assets/assises/claire.png', gerome: 'assets/assises/gerome.png', assises: 'assets/assises/les-assises.jpg',
  ws: 'assets/assises/wavestone.svg', markW: 'assets/assises/w-mark.svg', markI: 'assets/assises/w-mark-indigo.svg',
  qr: 'assets/assises/qr-benchmark.png', robot: 'assets/assises/robot.png', vulnops: 'assets/assises/vulnops.jpg',
  phishing: 'assets/assises/threat-phishing.png', mythos: 'assets/assises/threat-mythos.png', ransomware: 'assets/assises/threat-ransomware.png', swarm: 'assets/assises/threat-swarm.png', gov: 'assets/assises/threat-gov.png',
  cbd: 'assets/assises/agents/cyber-by-design.png', console: 'assets/assises/agents/console.png', top30: 'assets/assises/agents/top30.png', bench2: 'assets/assises/agents/bench-2.png',
  partners: 'assets/assises/partners-iam.png', ai4cyber: 'assets/assises/agents/ai4cyber.png', dataprot: 'assets/assises/agents/dataprot.png', lab: 'assets/assises/agents/lab.png',
  press: ['assets/assises/press/p51.jpg', 'assets/assises/press/p53.jpg', 'assets/assises/press/p54.jpg', 'assets/assises/press/p55.jpg', 'assets/assises/press/p56.jpg', 'assets/assises/press/p57.jpg', 'assets/assises/press/p58.jpg',
    'assets/assises/press/p59.jpg', 'assets/assises/press/p60.jpg', 'assets/assises/press/p61.jpg', 'assets/assises/press/p62.jpg', 'assets/assises/press/p63.jpg', 'assets/assises/press/p65.jpg', 'assets/assises/press/p68.jpg'],
};

const CH = {
  p:  { n: '00', title: 'Opening', mins: [0, 6] },
  c1: { n: '01', title: 'Cyber for AI', mins: [6, 17] },
  c2: { n: '02', title: 'Cyber against AI', mins: [17, 26] },
  c3: { n: '03', title: 'Cyber with AI', mins: [26, 36] },
  c4: { n: '04', title: 'The crew', mins: [36, 40] },
  e:  { n: '05', title: 'Lead the shift', mins: [40, 40] },
};

const ICONS = {
  search: '<circle cx="11" cy="11" r="7.5"/><path d="M21 21l-4.6-4.6"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  cloud: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  dollar: '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  radar: '<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14"/>',
  ban: '<circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/>',
  tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  refresh: '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  down: '<path d="M23 18l-9.5-9.5-5 5L1 6"/><path d="M17 18h6v-6"/>',
  award: '<circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>',
  buoy: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M4.93 19.07l4.24-4.24"/>',
};
const ICON = n => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ''}</svg>`;
const fa = f => (f == null ? '' : ` data-f="${f}"`);
const fmtN = (v, dec) => v.toLocaleString('en-GB', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const odo = (v, dec = 0) => `<span class="odo">${[...fmtN(v, dec)].map(ch => /\d/.test(ch) ? `<span class="dg" data-d="${ch}"><span class="col">${'0123456789'.split('').map(d => `<span>${d}</span>`).join('')}</span></span>` : `<span class="sym">${ch}</span>`).join('')}</span>`;
const ph = (src, pos = '50% 50%', extra = '') => `<div class="ph"><img src="${src}" alt="" style="object-position:${pos}">${extra}<div class="shade"></div></div>`;
const dots = (kind, o = {}) => ` data-dots="${kind}"` + Object.entries(o).map(([k, v]) => ` data-${k}="${v}"`).join('');
const steps = (list, f = 2) => `<div class="steps">${list.map(([b, s], i) => `<div class="step"${fa(f)}><i>${i + 1}</i><b>${b}</b><span>${s}</span></div>`).join('')}</div>`;
const btw = cur => `<div class="btw">${['AI discovery &amp; risk', 'AI platform security', 'AI identity'].map((t, i) => `<span class="${i + 1 === cur ? 'cur' : ''}">0${i + 1} · ${t}</span>`).join('')}</div>`;

const CHAPS = ['Cyber for AI', 'Cyber against AI', 'Cyber with AI', 'The crew'];
function chapter({ n, a, em, b = '', tag, line, up, sail }) {
  const hoist = up ? `<img class="hoist" src="${[IMG.yacht1, IMG.yacht2, IMG.yacht3][up - 1]}" alt="">` : '';
  const base = up ? [IMG.yacht0, IMG.yacht1, IMG.yacht2][up - 1] : IMG.yacht3;
  return `<div class="ch-l"><div class="ch-n">${n}</div>
    <p class="eyebrow">Chapter ${n}</p>
    <h2 class="display t">${a} <em>${em}</em>${b ? ' ' + b : ''}</h2>
    <p class="tagl">${tag}</p><p class="line">${line}</p>
    <ol class="ch-idx">${CHAPS.map((c, i) => `<li class="${i + 1 === +n ? 'cur' : i + 1 < +n ? 'done' : ''}">0${i + 1} · ${c}</li>`).join('')}</ol></div>
  <div class="ch-r">${ph(base, '50% 50%', hoist)}</div>`;
}
function levelHead(n, t, sub, ai) {
  return `<div class="lvh"><div><p class="eyebrow">Cyber with AI · Level ${n} of 3</p><h2 class="h t"><span class="n">Level ${n}</span>${t}</h2><p class="sub2">${sub}</p></div>
  <div class="meter"><div class="lvsteps">${[1, 2, 3].map(i => `<span class="${i === n ? 'on' : ''}">L${i}</span>`).join('')}</div>
  <div class="dots"${dots('split', { v: ai, c: 'greend', c2: 'mist', gap: .42 })}></div><div class="lg"><b>AI ≈ ${ai}%</b><span>Human ≈ ${100 - ai}%</span></div></div></div>`;
}

// ════════════════════════════════════════════════════════════════════════
// THE TALK
// ground: paper | indigo | photo. sea: the dots' resting state (seaF per
// click). Everything said is in SCRIPT, keyed by the scene's title.
// ════════════════════════════════════════════════════════════════════════
const SCENES = [

// ─── OPENING ──────────────────────────────────────────────────────────
{ ch: 'p', type: 'title', title: 'Lead the Shift', ground: 'indigo', chrome: false, sea: { hz: .66, amp: 1.5, speed: .3, a: .95 },
  html: () => `<div style="margin-top:-6rem">
    <p class="eyebrow">Les Assises 2026 · A workshop for CISOs</p>
    <h1 class="display t" style="margin-top:1.6rem">Lead the <em>Shift<svg class="swash" viewBox="0 0 300 30" preserveAspectRatio="none"><path d="M4 22 C 80 8, 190 6, 296 16"/></svg></em></h1>
    <p class="sub">How CISOs must lead the AI transformation</p>
    <div class="spk"><div><img src="${IMG.claire}" alt=""><p style="margin:0"><b>Claire Carré</b><span>Partner</span></p></div><div><img src="${IMG.gerome}" alt=""><p style="margin:0"><b>Gérôme Billois</b><span>Partner</span></p></div></div></div>
  <div class="logos"><img class="ass" src="${IMG.assises}" alt="Les Assises"><i></i><img class="ws" src="${IMG.ws}" alt="Wavestone"></div>` },

{ ch: 'p', type: 'about', title: 'About us', ground: 'paper',
  html: () => `<p class="eyebrow">About us</p>
  <h2 class="h t">Wavestone, helping you lead cyber transformation in an <em>AI-driven</em> world</h2>
  <div class="figs4">
    <div><b>${odo(1000)}<sup>+</sup></b><p><strong>cyber consultants</strong>, 700+ trained in AI security, 150+ in AI engineering</p></div>
    <div><b>${odo(11)}</b><p><strong>countries</strong>: global reach, local insight, strong ties with communities and regulators</p></div>
    <div><b>${odo(4000)}<sup>+</sup></b><p><strong>tier-1 clients</strong>, trusted for 20+ years across public and private sectors</p></div>
    <div><b>${odo(360)}<sup>°</sup></b><p><strong>expertise</strong> across CSO &amp; CISO priorities for IT, OT and products. Recognized at Black Hat, RSAC, DEF CON…</p></div>
  </div>
  <div class="pillars">
    <div class="pil"${fa(1)}><i>i.</i><h3>Human-led, AI-accelerated</h3><p>Combining <b>human judgement</b>, <b>deep expertise</b> and our own AI platforms to <b>accelerate delivery</b> and <b>deepen analysis</b>.</p><div class="thumbs"><img src="${IMG.cbd}" alt=""><img src="${IMG.console}" alt=""></div></div>
    <div class="pil"${fa(2)}><i>ii.</i><h3>From strategy to forward-deployed engineering</h3><p>We ensure the <b>successful delivery</b> of your transformation programs, bringing <b>adoption</b> and <b>value at scale</b>.</p><div class="thumbs"><img src="${IMG.top30}" alt=""><img src="${IMG.bench2}" alt=""><img class="fit" src="${IMG.partners}" alt=""></div></div>
    <div class="pil"${fa(3)}><i>iii.</i><h3>Independent &amp; makers</h3><p>An unbiased choice, drawing on <b>hands-on experience with leading solutions</b> and <b>in-house building capabilities</b>.</p><div class="thumbs"><img src="${IMG.ai4cyber}" alt=""><img src="${IMG.dataprot}" alt=""><img src="${IMG.lab}" alt=""></div></div>
  </div>` },

{ ch: 'p', type: 'agents', title: 'Homemade AI agents', ground: 'paper',
  html: () => {
    const A = [['Cyber-By-Design Agent', 'Architecture review and improvement accelerator', 1, 0], ['Auto Cyber Benchmark', 'Interview and analysis insight amplifier', 2, 0], ['IdentiVEX', 'Role mining advisor', 3, 0],
      ['CrisisMaker', 'Crisis exercise stimuli creation studio', .5, 1], ['Web Recon Accelerator', 'Deterministic assistant for pentesters', 1.5, 1], ['Smart Identity Analyzer', 'IAM data quality improver', 2.5, 1], ['Booster RM', 'Risk analysis accelerator', 1, 2]];
    return `<p class="eyebrow">About us · 30+ agents built or deployed</p>
  <h2 class="h t">Homemade AI agents to <em>accelerate</em> and add value to our engagements</h2>
  <div class="ag"><div class="hive">${A.map(([t, s, x, y], i) => `<div class="hx${i === 6 ? ' hot' : ''}" style="left:${(x - .5) * 12 + 3}rem;top:${y * 10.2 + .2}rem;width:11.6rem;height:13.4rem"${fa(i < 3 ? null : 1)}${dots('hexring', { c: i === 6 ? 'greend' : 'indigo', gap: .36, delay: i * 70 })}><small>AGENT 0${i + 1}</small><b>${t}</b><span>${s}</span></div>`).join('')}</div>
    <div class="ag-r"><p class="q">That can be used in all environments, ours <em>and yours</em>.</p>
      <div class="pr"${fa(2)}><i>01</i><b>Decoupled from infrastructure</b><span>Autonomous agents that do not depend on any client stack, using standalone HTML pages</span></div>
      <div class="pr"${fa(3)}><i>02</i><b>Decoupled from LLMs</b><span>API calls to the client's AI, or even a local model depending on the context</span></div>
      <div class="pr"${fa(4)}><i>03</i><b>Governed by usage</b><span>One API key per engagement, tied to a predefined budget</span></div></div></div>`; } },

{ ch: 'p', type: 'press', title: 'AI has changed the game', ground: 'indigo', sea: { show: .35, hz: .92 },
  html: () => `<div class="cyl"><div class="ring">${IMG.press.map((src, i, l) => `<img src="${src}" alt="" style="transform:rotateY(${(i * 360 / l.length).toFixed(2)}deg) translateZ(56rem)">`).join('')}</div></div><div class="veil"></div>
  <div class="press-h"${fa(1)}><h2 class="display t">AI has changed the <em>game</em>…</h2><p class="lead">And the need to navigate its challenges has never been stronger</p></div>` },

{ ch: 'p', type: 'question', title: 'The question', ground: 'photo', chrome: false,
  html: () => `${ph(IMG.yacht0, '50% 55%')}<div class="qwrap"><p class="eyebrow">The question</p><h2 class="q t" style="margin-top:1.2rem">How do you embrace the full potential of AI, and <em>lead the shift</em>?</h2></div>` },

{ ch: 'p', type: 'shifts', title: 'Three shifts, one timeline', ground: 'indigo', sea: { hz: .93, a: .4 },
  html: () => {
    const X = { 2023: 12, 2025: 40, 2026: 58, 2030: 86 };
    const L = [['Cyber for AI', 'Secure the ecosystem', 2023, 30, 'lav'], ['Cyber against AI', 'Reset the defensive baseline', 2025, 49, 'white'], ['Cyber with AI', 'Defend at machine speed', 2026, 68, 'green']];
    return `<p class="eyebrow">The race has changed</p><h2 class="h t">Three shifts have emerged on a <em>single timeline</em>…</h2>
    <div class="tl"><div class="hz"></div>${Object.entries(X).map(([y, x]) => `<div class="yr" style="left:${x}%">${y}${y === '2030' ? '…' : ''}</div>`).join('')}
    ${L.map(([a, b, y, top, c], i) => `<div class="lane" style="left:${X[y]}%;top:${top}%"${fa(i + 1)}${dots('fill', { c, gap: .42, motion: 'flow', sp: 70 + i * 40, a: .95 })}></div><span class="lane-dot" style="left:${X[y]}%;top:calc(${top}% + .65rem)"${fa(i + 1)}></span><div class="lane-l${i === 2 ? ' g' : ''}" style="left:${X[y]}%;top:${top}%"${fa(i + 1)}><b>${a}</b><span>${b}</span></div>`).join('')}</div>
    <p class="orient"${fa(4)}>…requiring a <b>common orientation</b> to win the AI race</p>`; } },

// ─── CHAPTER 1 · CYBER FOR AI ────────────────────────────────────────
{ ch: 'c1', type: 'chapter', title: 'Chapter 1: Cyber for AI', ground: 'indigo', chrome: false, sea: { show: 0 },
  html: () => chapter({ n: '01', a: 'Cyber', em: 'for', b: 'AI', tag: 'Secure the ecosystem', line: 'From protecting models to controlling platforms, agents and actions.', up: 1, sail: 70 }) },

{ ch: 'c1', type: 'bench', title: '2026 AI Cyber Benchmark', ground: 'paper', sea: { hz: .97, a: .25 },
  html: () => {
    const B = [[1, 72, 0, 'identify <strong>AI use</strong> during new procurement processes'], [1, 12, 1, '<strong>know AI systems</strong> or components external to their platform'],
      [1, 88, 0, 'adapted <strong>risk management</strong> to AI, with a group-level AI security lead'], [1, 33, 1, 'cover <strong>agentic AI</strong> in their risk analyses'],
      [2, 87.5, 0, 'generate <strong>logs</strong> in their AI applications'], [2, 8, 1, 'send those <strong>logs to the SOC</strong> for analysis and response'],
      [2, 50, 0, 'run dedicated <strong>AI security testing</strong> (AI red team)'], [2, 11, 1, 'implement <strong>security beyond native</strong> solutions'],
      [3, 72, 0, 'built <strong>data privacy compliance</strong> into the AI lifecycle'], [3, 15, 1, 'have <strong>IAM fit for AI agents</strong>']];
    return `<div class="bm-head"><div><p class="eyebrow">2026 AI Cyber Benchmark</p><h2 class="h l t">Breaking the <em>agentic wall</em></h2></div>
    <div class="mat"><div class="row"><span class="from">${odo(31)}%</span><span class="arr">to</span><span class="to">${odo(45)}%</span></div><p><b>+14 points of maturity in one year</b>, but progress stops at agentic AI.</p></div></div>
    <div class="chart">
      <h4 style="grid-column:1/5"><i>01</i>AI discovery &amp; risk management</h4><h4 style="grid-column:5/9"><i>02</i>AI platform security</h4><h4 style="grid-column:9/11"><i>03</i>AI identity</h4>
      <div class="base"></div>
      ${B.map(([g, v, lo, t], i) => `<div class="slot" style="grid-column:${i + 1}"${dots('bar', { v, c: lo ? 'coral' : 'indigo', gap: .4, from: lo ? 2 : 1, delay: (i % 2 ? 0 : i * 40) })}></div><div class="lbl${lo ? ' lo' : ''}" style="grid-column:${i + 1}"${fa(lo ? 2 : 1)}><b>${odo(v, v % 1 ? 1 : 0)}%</b><span>${t}</span></div>`).join('')}
      <div class="wall"${fa(3)}><span>The agentic wall</span></div>
    </div>`; } },

{ ch: 'c1', type: 'disc', title: 'Break the wall 1/3: discovery', ground: 'paper', sea: { hz: .97, a: .2 },
  html: () => {
    const D = (x, y, d, c, t, cls = '', f = null, mo = '') => `<div class="blob ${cls}" style="left:${x - d / 2}rem;top:${y - d / 2}rem;width:${d}rem;height:${d}rem"${fa(f)}${dots('disc', { c, gap: .36, ...(mo ? { motion: mo } : {}) })}><b>${t}</b></div>`;
    return `<p class="eyebrow">Break the wall 1/3</p><h2 class="h t">Find every agent and <em>register it</em></h2>${btw(1)}
  <div class="disc"><div class="peri"><div style="position:absolute;left:0;top:50%;width:44rem;height:28rem;transform:translateY(-50%)">
      <div class="perim" style="left:1rem;top:1rem;width:26rem;height:26rem"${dots('ring', { c: 'indigo', gap: .34 })}></div><div class="sweep" style="left:1rem;top:1rem;width:26rem;height:26rem"></div>
      <span class="perim-l" style="left:14rem;top:1rem">Organization perimeter</span>
      ${D(9, 10, 5.6, 'indigo', 'Enterprise agentic platform')}${D(18, 8.6, 5.6, 'indigo', 'Enterprise agentic platform')}${D(21.5, 15.5, 3.8, 'violet', 'Citizen AI')}
      ${D(8, 18.5, 4.2, 'lav', 'SaaS app')}${D(13.6, 21.4, 4.2, 'lav', 'SaaS app')}${D(19, 21, 4.2, 'lav', 'SaaS app')}
      ${D(33, 5, 4.4, 'amber', 'Personal AI', 'out', null, 'swarm')}${D(37, 13.8, 4.4, 'amber', 'BYOAI', 'out', null, 'swarm')}${D(33, 22.5, 4.4, 'amber', 'BYOA', 'out', null, 'swarm')}
    </div></div>
    <div class="where"${fa(1)}><h3>Where to look</h3>
      <div class="wl">${ICON('file')}<div><b>Enterprise AI</b><ul><li>Review platforms &amp; contracts</li><li>Scan repos: AI keys, models &amp; libraries</li></ul></div></div>
      <div class="wl">${ICON('cloud')}<div><b>SaaS applications</b><ul><li>Identify AI apps via the web gateway</li><li>Use categories &amp; risk scores</li></ul></div></div>
      <div class="wl">${ICON('users')}<div><b>Citizen AI &amp; BYOAI</b><ul><li>Audit mail &amp; file permissions · Monitor direct AI API calls</li><li>Detect local AI tools &amp; MCP configs · Review AI subscriptions</li></ul></div></div></div></div>
  ${steps([['Set up governance', 'Align IT and AI teams on one agent policy and owners'], ['Track and authorize', 'Run discovery continuously and reconcile it with the registry'], ['Invest in a discovery tool', 'Tooling that discovers agents and feeds the registry automatically']])}`; } },

{ ch: 'c1', type: 'plat', title: 'Break the wall 2/3: platforms', ground: 'paper', sea: { hz: .97, a: .2 },
  html: () => {
    const bd = (n, pos) => `<span class="bdg" data-hl="${n}" style="${pos}">${n}</span>`;
    const C = [['Guardrails', 'filter prompts and outputs'], ['Model protection', 'secure the AI supply chain'], ['Data &amp; RAG security', 'control agent retrieval'], ['Sandboxing', 'isolate code and tool execution'], ['Posture management', 'find exposed AI services'], ['Detection &amp; response', 'send AI logs to the SOC']];
    return `<p class="eyebrow">Break the wall 2/3</p><h2 class="h t">Secure the platforms <em>agents run on</em></h2>${btw(2)}
  <div class="plat"><div class="arch">
      <div class="col"><small>Inputs &amp; execution</small><div class="nd">Knowledge / RAG${bd(3, 'left:-.85rem;top:-.85rem')}</div><div class="nd">Tools &amp; external systems${bd(4, 'left:-.85rem;top:-.85rem')}</div><div class="nd">LLMs / models${bd(2, 'left:-.85rem;top:-.85rem')}</div></div>
      <div class="col"><small>&nbsp;</small><div class="nd orc">Orchestrator / harness</div><div class="nd agt">Agents<small>skills, memory</small>${bd(4, 'right:-.85rem;top:-.85rem')}</div></div>
      <div class="col"><small>User interface</small><div class="nd">Application frontend${bd(1, 'left:-.85rem;top:-.85rem')}</div><div class="nd">End users / systems</div></div>
      <div class="bar infra">Build / runtime infrastructure${bd(5, 'right:.8rem;top:.55rem')}</div>
      <div class="bar mon">Monitoring &amp; observability${bd(6, 'right:.8rem;top:.55rem')}</div></div>
    <ul class="ctl">${C.map(([a, b], i) => `<li data-hl="${i + 1}"><i>${i + 1}</i><span><b>${a}</b> ${b}</span></li>`).join('')}</ul></div>
  ${steps([['Evaluate your platforms', 'Map the security functions of your current platforms and usage'], ['Select an AI security platform', 'Linked to an AI gateway, so every AI flow goes through it'], ['Test its strength', 'AI red teaming, from the dev environment to internet-facing functions']], 7)}`; } },

{ ch: 'c1', type: 'idm', title: 'Break the wall 3/3: identity', ground: 'paper', sea: { hz: .97, a: .2 },
  html: () => {
    const cols = [['Who is the agent?', 'Discovery &amp; registry', 'mature'], ['On behalf of whom?', 'Delegation', 'emerging'], ['What can it do?', 'Authorization', 'emerging'], ['What is its intent?', 'Intent validation', 'early'], ['Allow this action now?', 'Runtime enforcement', 'emerging'], ['What did it do?', 'Audit &amp; governance', 'mature']];
    const rows = [['AI / agent governance', ['m', '', 'm', '', '', 'm']], ['AI / agent access', ['', 'm', 'h', 'w', 'm', 'h']], ['AI / agent protect', ['h', '', 'h', 'w', 'm', '']]];
    const mk = v => v === 'm' ? dots('disc', { c: 'indigo', gap: .3 }) : v === 'h' ? dots('disc', { c: 'lav', gap: .3 }) : dots('ring', { c: 'ink', gap: .28 });
    return `<p class="eyebrow">Break the wall 3/3 · Who, what, where, why and how</p><h2 class="h t">Master the <em>agentic identities</em></h2>${btw(3)}
  <div class="idm"><div class="idm-g"><div></div>${cols.map(([q, t, m]) => `<div class="qh"><em>${q}</em><b>${t}</b><span class="pill ${m}">${m}</span></div>`).join('')}
    ${rows.map(([r, d]) => `<div class="rh">${r}</div>${d.map((v, i) => `<div class="cell">${v ? `<i${fa(1)}${mk(v)} data-delay="${i * 90}"></i>` : ''}</div>`).join('')}`).join('')}</div>
    <div class="legend"${fa(1)}><span style="--c:var(--indigo)">Must do</span><span style="--c:var(--lav)">Helps</span><span class="lg-ring">Will do</span></div></div>
  ${steps([['Assess platform capabilities &amp; design patterns', 'Map what identity providers, agentic platforms, gateways and xDR can enforce; find gaps and compensating tools'], ['Define &amp; promote identity guidelines', 'Every agent: unique identity, human sponsor, delegation, least privilege, short-lived credentials, traceability'], ['Run an enforcement POC', 'On a real agent: identity → human delegation → scoped access → runtime decision → action-level logging']])}`; } },

{ ch: 'c1', type: 'split', title: 'Other emerging challenges', ground: 'paper', sea: { show: 0 },
  html: () => `<div class="split-l">${ph(IMG.lighthouse, '50% 40%')}<div class="cap"><p class="eyebrow">Securing the AI ecosystem</p><h2 class="h t">The other emerging challenges <em>to master</em></h2></div></div>
  <div class="split-r">
    <div class="chal"${fa(1)}><i>i.</i><div><h3>Mastering resilience</h3><ul><li>Ability to <b>switch or rebuild models</b></li><li><b>Recover datasets</b> and knowledge bases</li><li>Validate <b>integrity</b>, ensuring <b>confidence</b> in AI decisions</li></ul></div></div>
    <div class="chal"${fa(2)}><i>ii.</i><div><h3>Mastering open-weight models</h3><ul><li>Assess <b>model security pre-adoption</b></li><li>Validate <b>fine-tuning integrity</b> and <b>monitor modifications</b></li><li><b>Secure the AI supply chain</b>: model security, governance and lifecycle</li></ul></div></div>
  </div>` },

{ ch: 'c1', type: 'cta', title: 'Discover the benchmark', ground: 'paper',
  html: () => `<div class="cta"><div><p class="eyebrow">2026 AI Cyber Benchmark</p><h2 class="h t">Discover more of our <em>AI cyber benchmark</em></h2>
    <p class="lead">Access the full presentation and contact our experts to know where you stand.</p>
    <div class="qr"><img src="${IMG.qr}" alt="QR code"><span>Scan to access<br>the full benchmark<br>wavestone.com/en</span></div></div>
    <div class="cta-ph">${ph(IMG.mountain)}</div></div>` },

// ─── CHAPTER 2 · CYBER AGAINST AI ────────────────────────────────────
{ ch: 'c2', type: 'chapter', title: 'Chapter 2: Cyber against AI', ground: 'indigo', chrome: false, sea: { show: 0 },
  html: () => chapter({ n: '02', a: 'Cyber', em: 'against', b: 'AI', tag: 'Reset the defensive baseline', line: 'AI does not make every threat new. It challenges the old defensive tempo.', up: 2, sail: 37 }) },

{ ch: 'c2', type: 'waters', title: 'Faster waters', ground: 'indigo', sea: { hz: .6, amp: 2, speed: 1, storm: .7, a: .85 }, seaF: { 7: { storm: 1.5, speed: 1.6, amp: 2.8, hz: .55 } },
  html: () => {
    const C = [[IMG.phishing, '5×', 'more efficient AI-powered phishing, compared to human-crafted attempts', 'AI-enabled social engineering'],
      [IMG.mythos, '10,000+', 'vulnerabilities autonomously discovered, chained and exploited in one month', 'Mythos'],
      [IMG.ransomware, '&lt; 30 min', 'to deploy adaptive ransomware end to end, testing dozens of attack paths', 'JadePuffer'],
      [IMG.swarm, '700', 'self-organizing agents in a 5-phase covert attack, breaching 3 organizations', 'Hugging Face / OpenAI'],
      [IMG.gov, '1 agent', 'breached government files, bypassing existing access controls', 'Australian Government / OpenAI']];
    return `<p class="eyebrow">Cyber against AI</p><h2 class="h t">The threat has entered <em>faster waters</em>…</h2>
  <div class="cases">${C.map(([img, v, t, s], i) => `<div class="case" style="left:${i * 19.6}%;top:${[0, 18, 4, 20, 6][i]}%"${fa(i + 1)}><img src="${img}" alt=""><b>${v}</b><p>${t}</p><small>${s}</small></div>`).join('')}</div>
  <div class="real"${fa(6)}><p>And AI will be<br>in the <em style="color:var(--green)">real world</em>…</p><img src="${IMG.robot}" alt=""></div>
  <p class="catch"${fa(7)}>Defenders need to <em>catch up.</em></p>`; } },

{ ch: 'c2', type: 'fund', title: 'It changed the speed', ground: 'indigo', sea: { hz: .78, amp: .5, speed: .25, a: .5 }, seaF: { 2: { stream: 1, amp: .2, a: .75, hz: .62 } },
  html: () => `<div class="fund"><p class="eyebrow">Cyber against AI</p><h2 class="h t">AI did not change the fundamentals…</h2>
    <div class="fl2"${fa(1)}><p><i>i.</i><span><b>Zero trust</b> remains the right model</span></p><p><i>ii.</i><span>Proven <b>security approaches</b> still apply</span></p></div></div>
  <p class="speed"${fa(2)}>…it changed<em>the speed.</em></p>` },

{ ch: 'c2', type: 'baseline', title: 'A new defensive baseline', ground: 'paper',
  html: () => {
    const C = [['radar', 'Detect', '24', 'h', 'to <b>detect and assign</b> every new Internet-facing asset', ['Continuous external <b>attack-surface scanning</b>', '<b>Automatic reconciliation</b> with the CMDB', 'Owner and criticality assigned within 24h']],
      ['ban', 'Contain', '3', 'h', 'to <b>contain a critical exposure</b> without business validation', ['Pre-approved isolation scenarios', 'A cyber <b>emergency authority</b>', '<b>Kill-switches tested quarterly</b>']],
      ['tool', 'Remediate', '24', 'h', 'to <b>patch or keep protected</b> any exploited exposed asset', ['Exposure-first remediation queue', '<b>24/7</b> cyber, IT and app-owner task force', '<b>Patch, virtual patch or isolate</b>']],
      ['refresh', 'Rebuild', '2', ' days', 'to <b>rebuild any critical system</b> from a trusted baseline', ['Hardened golden images', 'Infrastructure and configuration as code', '<b>Quarterly real-life rebuild test</b>']],
      ['down', 'Reduce', '5', '%', 'of <b>obsolete critical assets</b>, and kept there', ['<b>Inventory</b> infrastructure, software and libraries', 'Named owner and exit date per exception', '<b>Monthly backlog</b> review at executive level']]];
    return `<p class="eyebrow">Cyber against AI</p><h2 class="h t" style="max-width:none">A new defensive baseline, with the <em>authority to act</em> without waiting for business approval</h2>
  <div class="bl">${C.map(([ic, n, v, u, s, l], i) => `<div class="blc"${fa(i + 1)}><h4>${ICON(ic)}${n}</h4><div class="tg"><i>&lt;</i>${odo(+v)}<span style="font-size:.5em;letter-spacing:-.02em">${u}</span></div><p class="ts">${s}</p><ul>${l.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>
  <p class="bl-end"${fa(6)}>Technical projects to speed things up, but only <b>with IT and cyber governance, and the budget</b> to sustain efforts.</p>`; } },

{ ch: 'c2', type: 'vulnops', title: 'Deep dive: vulnerability operations', ground: 'paper', sea: { hz: .98, a: .18 },
  html: () => {
    const L = [['Edge / Internet', 'WAF, CDN, reverse proxy, API gateway'], ['Network', 'Firewall rules, IPS, NDR, micro-segmentation'], ['Endpoint / workload', 'EDR, XDR, application control'], ['Runtime / application', 'RASP, feature flags, configuration changes'], ['Cloud / containers', 'Network policies, CNAPP, admission controllers, service mesh'], ['Virtualization', 'VM isolation, NSX policies, hypervisor controls'], ['Identity &amp; access', 'Conditional access, PAM, MFA, privilege restrictions'], ['Detection &amp; response', 'SIEM, SOAR, threat hunting, automated containment']];
    return `<span class="tag-dd">Deep dive</span><p class="eyebrow">Cyber against AI · Remediate</p><h2 class="h t">Using <em>vulnerability operations</em> to ensure patching</h2>
  <div class="vo"><div class="vo-c"><h3>Identify the patching that needs to be done</h3><p>Assess the vulnerability risk</p><div class="vo-img"><img src="${IMG.vulnops}" alt="Decision tree: on the KEV? automatable? technical impact, then SLA"></div></div>
    <div class="vo-c"${fa(1)}><h3>Identify the tools that will allow you to do it</h3><p>Virtual patching control stack</p><table class="vps"><tr><th>Layer</th><th>Typical controls</th></tr>${L.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</table></div></div>`; } },

{ ch: 'c2', type: 'tempos', title: 'Three tempos', ground: 'paper', sea: { hz: .98, a: .18 },
  html: () => {
    const T = [[20, 'var(--coral)', 'coral', 'Trying to keep up', 'Create remediation task forces', ['<b>Regain control of obsolescence</b>: decommission unsupported versions, close all MFA gaps', '<b>Rework patch industrialization</b> to meet SLAs on internet-facing systems', '<b>Clear the backlogs</b> and re-assess underperforming tools (CMDB, EDR)']],
      [40, 'var(--indigo)', 'indigo', 'Building the new base', 'Run a transformation program', ['<b>Agentify and automate</b> cyber operations', '<b>Rethink platforms and processes</b>, including patch management', '<b>Deploy</b> new tools, <b>refresh</b> legacy ones, <b>introduce</b> deception']],
      [5, 'var(--green-x)', 'greend', 'Ready to accelerate', 'Industrialize actions', ['<b>Operate cyber as a modern IT function</b>: infrastructure as code, CI/CD, SDLC', 'Operate a <b>transformed RUN</b>', 'Look for <b>AI accelerators</b>']]];
    return `<p class="eyebrow">Market view</p><h2 class="h t">Three tempos in the race to <em>accelerate</em></h2><p class="lead" style="margin-top:.6rem">Investment is heavy, but market visions are still very uneven.</p>
  <div class="tp">${T.map(([v, col, c, h, h5, l], i) => `<div class="tpc" style="--tc:${col}"${fa(i + 1)}><div class="wrow"><div class="waf"${dots('waffle', { v, c, c2: 'mist' })}></div><span class="pc">${odo(v)}<small>%</small></span></div><h4>${h}</h4><h5>${h5}</h5><ul>${l.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>
  <p class="endq"${fa(4)}>Identified actions require organizations to <b>move at AI speed</b>.</p>`; } },

// ─── CHAPTER 3 · CYBER WITH AI ───────────────────────────────────────
{ ch: 'c3', type: 'chapter', title: 'Chapter 3: Cyber with AI', ground: 'indigo', chrome: false, sea: { show: 0 },
  html: () => chapter({ n: '03', a: 'Cyber', em: 'with', b: 'AI', tag: 'Defend at machine speed', line: 'Three levels: AI assists, human-agent teams, then human-led and agent-operated.', up: 3, sail: 14 }) },

{ ch: 'c3', type: 'level', title: 'Level 1: AI acculturation', ground: 'paper', sea: { hz: .98, a: .18 },
  html: () => {
    const T = [['award', 'GRC', [['TPRM', 'questionnaire review'], ['Awareness', 'video and text generation']]], ['lock', 'Sec by design', [['Secure-by-Design', 'architecture reviewer', 'ROI · 30% time saved'], ['Risk analysis', '']]],
      ['cloud', 'Infra sec', [['Firewall rules', 'review']]], ['user', 'IAM', [['Role mining', 'reviews', 'ROI · 50-80% time saved'], ['Application onboarding', 'analyzer']]],
      ['search', 'Defense', [['Automated SOC L1', 'alert triage', 'ROI · 6 → 1 FTE + agents'], ['Redteam acceleration', '&amp; report', 'ROI · ≈ 5h saved per pentest']]], ['buoy', 'Resilience', [['Cyber crisis', 'stimuli generation']]]];
    return `${levelHead(1, 'AI acculturation: the top 10', 'Human does, AI assists', 20)}
  <p class="lead" style="margin-top:.8rem"><b>Use cases land in every CISO team.</b> Mostly built locally, they help teams perform existing tasks faster and better, while quickly proving value.</p>
  <div class="teams" style="margin-top:4.4rem"><div class="ciso"><b>CISO</b>Chief Information Security Officer</div>${T.map(([ic, t, u]) => `<div class="team"><h4>${ICON(ic)}${t}</h4>${u.map(([a, b, r]) => `<div class="uc"${fa(1)}><b>${a}</b><span class="d">${b}</span>${r ? `<span class="roi"${fa(2)}>${r}</span>` : ''}</div>`).join('')}</div>`).join('')}</div>`; } },

{ ch: 'c3', type: 'funnel', title: 'Deep dive: the right use cases', ground: 'paper', sea: { show: .4, hz: .98, a: .18 },
  html: () => `<span class="tag-dd">Deep dive · a 3-month engagement</span><p class="eyebrow">Cyber with AI · Level 1</p><h2 class="h t">How to identify the <em>right use cases</em>?</h2>
  <div class="fn"><div class="fn-l"><div class="fn-in"><span>Existing or already identified use cases</span><span>Wavestone catalog + market feedback</span></div>
      <div class="fnshape"${dots('funnel', { c: 'indigo', gap: .5, motion: 'fall', sp: 26 })}></div>
      <div class="fph" style="top:32%"${fa(2)}><b>IDEATION</b><span>Value &amp; realism</span></div><div class="fph" style="top:58%"${fa(3)}><b>FIRST IMPLEMENTATION</b><span>Validate the concept</span></div><div class="fph" style="top:84%"${fa(4)}><b>ROADMAP</b><span>Make, buy, change</span></div></div>
    <div class="fn-r">
      <div class="fs"${fa(1)}><i>i.</i><div><small>Start</small><b>Identify two drivers</b><span>New value-adding activities, or pain-point fixes</span></div></div>
      <div class="fs"${fa(2)}><i>ii.</i><div><small>Ideation</small><b>Assess realism immediately</b><span>Workshops with an AI maker: value × complexity</span></div></div>
      <div class="fs"${fa(3)}><i>iii.</i><div><small>First implementation</small><b>Build first demonstrators</b><span>Prompting and no-code, ROI measured from day one</span></div></div>
      <div class="fs"${fa(4)}><i>iv.</i><div><small>Roadmap</small><b>Scale to full application</b><span>Build or buy, with training and change management</span></div></div></div></div>` },

{ ch: 'c3', type: 'level', title: 'Level 2: platform renewal', ground: 'paper', sea: { hz: .98, a: .18 },
  html: () => {
    const T = [['award', 'GRC', [['AI-native GRC', 'Continuous controls, compliance, TPRM and vendor risk', 'UK bank']]], ['lock', 'Sec by design', [['App security', 'Posture management, code &amp; pipeline security', 'EU manufacturing']]],
      ['cloud', 'Infra sec', [['Data security', 'DLP, DSPM, classification, data risk', 'US insurance']]], ['user', 'IAM', [['IGA / PAM', 'Machine &amp; agent identities, access governance']]],
      ['search', 'Defense', [['AI SOC', 'Detect, investigate, respond, hunt', 'Global manufacturing'], ['AI pentest', 'Continuous exposure discovery, validation &amp; remediation', 'Global insurance']]], ['buoy', 'Resilience', [['Business continuity', 'Dependencies, impact analysis, recovery orchestration']]]];
    return `${levelHead(2, 'Platform renewal, one step at a time', 'Human-agent teams', 50)}
  <p class="lead" style="margin-top:.8rem"><b>AI adoption accelerates as platform renewal unlocks cyber ROI at scale.</b> Integrated platforms share context automatically, give faster insights, consistent policies and cross-function action.</p>
  <div class="teams" style="margin-top:4.4rem"><div class="ciso"><b>CISO</b>Chief Information Security Officer<span class="office" data-hl="2">Cyber Data &amp; AI Office</span></div>${T.map(([ic, t, u]) => `<div class="team"><h4>${ICON(ic)}${t}</h4>${u.map(([a, b, r]) => `<div class="uc"${fa(1)}><b>${a}</b><span class="d">${b}</span>${r ? `<span class="ref">${r}</span>` : ''}</div>`).join('')}</div>`).join('')}</div>
  <p class="callout"${fa(2)}>Scaling AI across cyber requires a common approach: <b>create a Cyber Data &amp; AI Office</b>.</p>`; } },

{ ch: 'c3', type: 'duo', title: 'Deep dive: two approaches', ground: 'paper', sea: { hz: .98, a: .18 },
  html: () => `<span class="tag-dd">Deep dive</span><p class="eyebrow">Level 2 · Platform renewal</p><h2 class="h t">Two approaches, <em>one objective</em></h2>
  <div class="duo"><div class="dc"${fa(1)}><h3>Enterprise data protection at scale</h3><small>Insurance experience</small>
      <div class="figs"><div><b>${odo(1500)}</b><span>applications in the data ecosystem</span></div><div><b>${odo(65000)}</b><span>collaboration sites</span></div><div><b>${odo(50000)}</b><span>file shares</span></div><div><b>${odo(40)}<small>PB</small></b><span>of data, structured and unstructured</span></div></div>
      <div class="how"><small>How</small><div class="chain">Unify governance, processes &amp; technology <i>then</i> strengthen data visibility &amp; control <i>then</i> remediate risk at scale</div></div></div>
    <hr>
    <div class="dc"${fa(2)}><h3>AI-first CISO operating model</h3><small>Automotive experience</small>
      <div class="figs"><div><b>${odo(21)}<small>months</small></b><span>program</span></div><div><b>€${odo(3.6, 1)}<small>M</small></b><span>investment</span></div><div><b>${odo(10)}<small>FTEs</small></b><span>mobilized</span></div><div><b>${odo(40)}</b><span>AI workflows targeted by end-2026</span></div></div>
      <div class="how"><small>How</small><div class="chain">Embed AI by design <i>then</i> unify the platform <i>then</i> upskill teams <i>then</i> align staffing, ownership &amp; partners</div></div></div></div>` },

{ ch: 'c3', type: 'lake', title: 'Level 3: machine speed', ground: 'indigo', sea: { hz: .97, a: .3 },
  html: () => {
    const S = ['SOC / EDR', 'CTI / vulnerabilities', 'Assets / configs', 'GRC / TPRM / risks', 'Business context'];
    const A = ['EDR / NDR / FW', 'Patching &amp; config', 'Access rights / DLP', 'Tickets &amp; owners'];
    const ys = [14, 28, 42, 56, 70], ya = [20, 36, 52, 68];
    const ag = [[54, 26], [62, 26], [70, 26], [54, 48], [62, 48], [70, 48]];
    return `${levelHead(3, 'Cyber at machine speed', 'Human-led, agent-operated', 80)}
  <div class="lake">
    ${S.map((s, i) => `<span class="src-l" style="left:0;top:${ys[i]}%"${fa(1)}>${s}</span><div style="position:absolute;left:13rem;width:calc(31% - 13rem);top:calc(${ys[i]}% - .3rem);height:.6rem"${fa(1)}${dots('fill', { c: 'lav', gap: .36, motion: 'flow', sp: 60 + i * 10 })}></div>`).join('')}
    <span class="pipe-l" style="left:13rem;top:78%"${fa(1)}>APIs</span>
    <div style="position:absolute;left:31%;top:6%;width:13%;height:72%"${fa(1)}${dots('ellipse', { c: 'white', gap: .36, motion: 'drift', a: .9 })}></div>
    <span class="lake-l" style="left:37.5%;top:42%"${fa(1)}>Cyber<br>data lake</span>
    <div class="plat-box" style="left:47%;top:4%;width:30%;height:76%"${fa(2)}><small>Agentic AI platform</small></div>
    ${ag.map(([x, y], i) => `<div style="position:absolute;left:calc(${x}% - 1.6rem);top:calc(${y}% - 1.6rem + 4rem);width:3.2rem;height:3.2rem"${fa(2)}${dots('ring', { c: i === 4 ? 'green' : 'white', gap: .32, motion: 'orbit', sp: i % 2 ? -.6 : .6, delay: i * 60 })}></div>`).join('')}
    <span class="ag-l" style="left:62%;top:66%"${fa(2)}>Cyber agents</span>
    ${A.map((s, i) => `<div style="position:absolute;left:77%;width:9%;top:calc(${ya[i]}% - .3rem);height:.6rem"${fa(2)}${dots('fill', { c: 'green', gap: .36, motion: 'flow', sp: 80 })}></div><span class="act-l" style="left:87.5%;top:${ya[i]}%"${fa(2)}>${s}</span>`).join('')}
    <span class="pipe-l" style="left:77%;top:78%"${fa(2)}>MCP &amp; APIs</span>
    <div class="l3s"><div${fa(1)}><b><i>1</i>Build your cyber data lake</b><span>Turn fragmented, slow-moving cyber data into real-time context, collected and normalized through APIs</span></div>
      <div${fa(2)}><b><i>2</i>Use an agentic AI platform</b><span>Built on existing processes and control models; delegate actions with the right level of human oversight</span></div></div>
    <div class="dp"${fa(3)}><div class="def"><b>DEFENSIVE</b><span>React to incidents, team by team</span></div><span class="arr">to</span><div class="pro"><b>PROACTIVE</b><span>Anticipate drift in real time, act across teams</span></div></div>
  </div>`; } },

{ ch: 'c3', type: 'graph', title: 'Level 3: golden rules & cyber graph', ground: 'indigo', sea: { hz: .98, a: .25 },
  html: () => {
    const N = [['Assets', 7, 62], ['Identities', 21, 30], ['Vulnerabilities', 36, 70], ['Controls', 50, 32], ['Third parties', 64, 72], ['Data', 78, 34], ['Business processes', 92, 64]];
    const E = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [1, 5], [0, 3]];
    const AG = ['GRC', 'Sec-by-design', 'Infra sec', 'IAM', 'Cyber defense', 'Resilience'];
    return `<p class="eyebrow">Cyber with AI · Level 3</p><h2 class="h t">Golden rules and a <em>cyber graph</em>, to move from defensive to proactive</h2>
  <div class="gr"${fa(1)}><div><b>Set decision rights</b><span>Risk appetite set by the business, escalation thresholds</span></div><div><b>Govern agents</b><span>Identity, rights, traceability and audit of every agent</span></div><div><b>Embed experts</b><span>Cyber experts inside business, IT and OT teams</span></div></div>
  <div class="agents6"${fa(2)}>${AG.map((t, i) => `<div><i${dots('ring', { c: i === 4 ? 'green' : 'white', gap: .3, motion: 'orbit', sp: .5, delay: i * 80 })}></i>${t} agent</div>`).join('')}</div>
  <div class="graph"${fa(3)}><small><b>Cyber graph (OT / IT)</b> · data lake + graph · OT stays human-in-the-loop</small>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none">${E.map(([a, b], i) => `<line x1="${N[a][1]}" y1="${N[a][2]}" x2="${N[b][1]}" y2="${N[b][2]}" class="${i % 3 === 0 ? 'hot' : ''}" vector-effect="non-scaling-stroke"/>`).join('')}</svg>
    ${N.map(([t, x, y], i) => `<div class="gn" style="left:${x}%;top:${y}%"${dots('disc', { c: i % 2 ? 'green' : 'white', gap: .27, motion: 'drift', delay: i * 60 })}></div><span class="gn-l" style="left:${x}%;top:${y}%">${t}</span>`).join('')}</div>`; } },

{ ch: 'c3', type: 'trust', title: 'Trust & TokenOps', ground: 'paper', sea: { hz: .98, a: .18 },
  html: () => `<p class="eyebrow">Cyber with AI · Run it for real</p><h2 class="h t">Trust &amp; TokenOps: keep agents <em>observable, trusted and affordable</em></h2>
  <div class="tk"><div class="loop"${fa(1)}><div class="orb"${dots('ring', { c: 'indigo', gap: .55, motion: 'orbit', sp: .12 })}></div>
      <div class="lp" style="left:50%;top:-16%"><b>Build</b><span>Continuously adapt agents and data</span></div>
      <div class="lp" style="left:112%;top:88%"><b>Run</b><span>Experts in the loop</span></div>
      <div class="lp" style="left:-12%;top:88%"><b>Check</b><span>Independent check of trust, efficiency and cost</span></div>
      <div class="core">Cyber Data<br>&amp; AI Office</div></div>
    <div class="pill3"><div class="pl"${fa(2)}>${ICON('eye')}<h4>Observe <em>performance</em></h4><p>Know what agents do and how well they perform</p><ul><li>Quality and evaluation</li><li>Reliability and observability</li><li>Decision traceability</li></ul></div>
      <div class="pl"${fa(3)}>${ICON('shield')}<h4>Preserve <em>trust</em></h4><p>Keep humans accountable for delegated actions</p><ul><li>Human oversight</li><li>Ownership and accountability</li></ul></div>
      <div class="pl"${fa(4)}>${ICON('dollar')}<h4>Control <em>cost</em> over time</h4><p>Keep the platform sustainable as usage scales</p><ul><li>Cost management</li><li>Maintenance lifecycle</li><li>Change and model governance</li></ul></div></div></div>` },

// ─── CHAPTER 4 · THE CREW ────────────────────────────────────────────
{ ch: 'c4', type: 'chapter', title: 'Chapter 4: Transform your organization', ground: 'indigo', chrome: false, sea: { show: 0 },
  html: () => chapter({ n: '04', a: 'The', em: 'crew', tag: 'Go beyond technical changes', line: 'Three sails are up. A yacht still goes nowhere without its crew: transform your organization.', up: 0 }) },

{ ch: 'c4', type: 'crew', title: 'Bet on your teams', ground: 'paper', sea: { hz: .98, a: .18 },
  html: () => `<p class="eyebrow">The crew</p><h2 class="h t" style="max-width:none">Bet on your teams: <em>empower the crew</em></h2>
  <div class="crew"><div>
      <div class="cr"${fa(1)}><i>i.</i><div><h4>Set the ambition<span>Choose where AI should genuinely transform the model</span></h4><ul><li>Identify the <b>workflows</b> where speed or outcomes must change radically</li><li>Define the <b>target</b> level of transformation</li><li>Align <b>Cyber, IT and business leadership</b> on the ambition</li></ul></div></div>
      <div class="cr"${fa(2)}><i>ii.</i><div><h4>Build a lighthouse<span>Use one workflow to demonstrate the new model</span></h4><ul><li>Select an <b>end-to-end workflow</b> with visible operational value</li><li><b>Redesign the workflow</b>, rather than automating isolated tasks</li><li>Use the first results to <b>prepare the next transformations</b></li></ul></div></div>
      <div class="cr"${fa(3)}><i>iii.</i><div><h4>Reorganize the fleet<span>Break silos to scale the transformation</span></h4><ul><li>Bring together <b>Cyber, IT, Data, AI and operations</b></li><li><b>One executive sponsor</b>, <b>one transformation lead</b></li><li>Give the team <b>decision rights and authority to act</b></li><li><b>Redesign roles</b> as AI reshapes how work gets done</li></ul></div></div></div>
    <div class="oc"><p${fa(1)}>A focused transformation <b>ambition</b></p><p${fa(2)}>A <b>lighthouse transformation</b> that creates momentum</p><p${fa(3)}>A <b>transversal team</b> with authority to act</p></div></div>
  <p class="expand"${fa(4)}>Start focused, demonstrate <em>the shift</em>, then <b>expand</b>.</p>` },

{ ch: 'c4', type: 'human', title: 'Lead the human shift', ground: 'paper', sea: { hz: .98, a: .18 },
  html: () => {
    const C = [['Managing change', ['<b>Show the way:</b> leaders use AI in their own daily work first', '<b>Say early</b> which tasks move to agents and which roles grow']], ['Training', ['<b>AI security basics</b> for every cyber role: prompt injection, agents, data leaks', '<b>Hands-on labs:</b> build and red-team an agent in a sandbox']],
      ['New org chart', ['<b>New roles:</b> AI security architect, agent identity owner, AI red teamer', '<b>Rebuild junior paths</b> as L1 tasks shift to agents']], ['New accountability', ['<b>A named human owner</b> for every agent and its actions', '<b>Shared AI risk</b> with IT, data and business teams (RACI)']]];
    return `<p class="eyebrow">The crew</p><h2 class="h t">Lead the human shift: cyber teams that <em>secure AI and use it</em></h2>
  <p class="lead" style="margin-top:.6rem">Two goals for every CISO team: secure the company's AI, and put AI to work inside cyber.</p>
  <div class="office"${fa(1)}><div class="tag"><small>A new team</small><b>Cyber Data &amp; AI Office</b></div><ul><li>With your own data scientists and AI engineers</li><li>Build and maintain the cyber data lake &amp; AI agents</li><li>Upskill and empower all cyber teams through AI literacy</li></ul></div>
  <div class="cards4">${C.map(([t, l], i) => `<div class="c4"${fa(2)}><i>0${i + 1}</i><h4>${t}</h4><ul>${l.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>`; } },

// ─── CLOSE ───────────────────────────────────────────────────────────
{ ch: 'e', type: 'closing', title: 'How do you lead the shift?', ground: 'indigo', sea: { hz: .97, a: .3 },
  html: () => `<p class="eyebrow">Takeaways</p><h2 class="h l t">How do you <em>lead the shift</em> to AI?</h2>
  <div class="cl"><div class="clc"${fa(1)}><small>i.</small><h4>Cyber for AI</h4><p>Secure the ecosystem</p><ul><li><b>Discover and manage</b> your agents</li><li><b>Protect</b> your AI platform</li><li><b>Manage</b> agent identities</li><li><b>Secure</b> emerging risks: resilience &amp; open-weight models</li></ul></div>
    <div class="clc"${fa(2)}><small>ii.</small><h4>Cyber against AI</h4><p>Reset the defensive baseline</p><ul><li><b>Enforce</b> the new cyber baseline</li><li><b>Take ownership</b> of defensive actions</li></ul></div>
    <div class="clc"${fa(3)}><small>iii.</small><h4>Cyber with AI</h4><p>Defend at machine speed</p><ul><li><b>Accelerate</b> cyber teams</li><li><b>Renew</b> major platforms</li><li><b>Build your cyber graph</b> to go at machine speed</li></ul></div></div>
  <div class="bet"${fa(4)}><div><b>Bet on your teams: <em>empower them to lead the shift</em></b><p>Upskill teams, give them ownership and break silos to scale.</p></div><div class="qr"><img src="${IMG.qr}" alt="QR code"><span>2026 AI Cyber<br>Benchmark</span></div></div>` },

{ ch: 'e', type: 'end', title: 'Thank you', ground: 'indigo', chrome: false, sea: { hz: .78, amp: .9, speed: .3, a: .7 },
  html: () => `<div class="endtxt"${dots('text', { text: 'Lead the Shift.', c: 'white', c2: 'green', gap: .3, s: .2 })}></div>
  <div class="end-sub"><img src="${IMG.ws}" alt="Wavestone"><i></i><span>Thank you · Claire Carré · Gérôme Billois · Les Assises 2026</span></div>` },
];

// ════════════════════════════════════════════════════════════════════════
// THE SEA OF DOTS
// ════════════════════════════════════════════════════════════════════════
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const SEA = (() => {
  const cv = $('#sea'), g = cv && cv.getContext('2d');
  const COL = { ink: [30, 13, 87], indigo: [69, 29, 199], violet: [90, 43, 224], lav: [182, 166, 255], mist: [209, 202, 242], white: [255, 255, 255], green: [4, 240, 106], greend: [6, 184, 84], coral: [232, 56, 79], amber: [217, 138, 0] };
  const DEF = { paper: { hz: .9, amp: .55, speed: .3, a: .32, c: 'ink', storm: 0, stream: 0, show: 1 }, indigo: { hz: .88, amp: .7, speed: .35, a: .62, c: 'white', storm: 0, stream: 0, show: 1 }, photo: { hz: .9, amp: .5, speed: .3, a: 0, c: 'white', storm: 0, stream: 0, show: 0 } };
  const COLS = 128, ROWS = 46;
  let W = 0, H = 0, R = 1, REM = 16, P = [], want = { ...DEF.paper }, cur = { ...DEF.paper }, active = new Map(), running = false, last = 0;
  const now = () => performance.now();

  function resize() {
    if (!cv) return;
    R = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight;
    cv.width = W * R; cv.height = H * R; cv.style.width = W + 'px'; cv.style.height = H + 'px';
    g.setTransform(R, 0, 0, R, 0, 0);
    REM = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  }
  function init() {
    if (!cv) return;
    resize();
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const p = { u: (c + Math.random() * .8) / COLS, v: r / (ROWS - 1), ph: Math.random() * 6.283, sd: Math.random(), x: 0, y: 0, a: 0, s: 1, c: [...COL.ink], el: null, pt: null, go: 0, k: .06 };
      const [x, y] = seaXY(p, 0); p.x = x; p.y = y; P.push(p);
    }
    addEventListener('resize', () => { resize(); refresh(); });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) last = now(); });
    running = true; requestAnimationFrame(frame);
  }
  function seaXY(p, t) {
    const pers = 1 / (1 + p.v * 7), pf = 1 / 8, f = (pers - pf) / (1 - pf);
    let u = p.u;
    if (cur.stream > .01) u = (u + t * cur.stream * (.05 + .25 * f) + 10) % 1;
    const x = -.04 * W + u * W * 1.08;
    const k = t * cur.speed;
    let h = Math.sin(p.u * 13 + k * 1.1 + p.v * 3) + .6 * Math.sin(p.u * 5 - k * .7 + p.v * 9) + .3 * Math.sin(p.u * 31 + p.v * 17 + k * 2.2 + p.ph);
    if (cur.storm > .01) h += cur.storm * (.9 * Math.sin(p.u * 42 + k * 3.2 + p.ph * 2) + .6 * Math.sin(p.v * 28 - k * 2.6 + p.u * 6));
    const hy = cur.hz * H;
    return [x, hy + (H * 1.02 - hy) * f - h * cur.amp * H * .016 * (.25 + f), f];
  }
  function setGround(ground, over) { want = { ...DEF[ground] || DEF.paper, ...(over || {}) }; }

  // ── shapes: the points an element asks for ─────────────────────────────
  function points(el) {
    const r = el.getBoundingClientRect(), d = el.dataset, gap = (+d.gap || .42) * REM;
    const C = COL[d.c] || COL.indigo, C2 = COL[d.c2] || COL.mist, out = [], base = +d.delay || 0;
    const push = (x, y, c = C, extra = 0) => out.push({ x, y, c, d: base + extra });
    const grid = test => { for (let y = r.top + gap / 2; y < r.bottom; y += gap) for (let x = r.left + gap / 2; x < r.right; x += gap) if (test(x, y)) push(x, y, C, (x - r.left) * .6); };
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    switch (d.dots) {
      case 'fill': grid(() => true); break;
      case 'bar': {
        const h = r.height * (+d.v || 0) / 100, cols = Math.max(1, Math.floor(r.width / gap)), x0 = cx - (cols - 1) * gap / 2;
        for (let i = 0, y = r.bottom - gap / 2; y > r.bottom - h; y -= gap, i++) for (let c = 0; c < cols; c++) push(x0 + c * gap, y, C, i * 16);
        break; }
      case 'disc': { const rr = Math.min(r.width, r.height) / 2; grid((x, y) => (x - cx) ** 2 + (y - cy) ** 2 <= rr * rr); break; }
      case 'ellipse': grid((x, y) => ((x - cx) / (r.width / 2)) ** 2 + ((y - cy) / (r.height / 2)) ** 2 <= 1); break;
      case 'ring': { const rr = Math.min(r.width, r.height) / 2, n = Math.max(8, Math.round(2 * Math.PI * rr / gap)); for (let i = 0; i < n; i++) { const a = i / n * 2 * Math.PI; push(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, C, i * 4); } break; }
      case 'hexring': { const rr = r.height / 2; const V = [...Array(6)].map((_, i) => { const a = -Math.PI / 2 + i * Math.PI / 3; return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]; });
        for (let i = 0; i < 6; i++) { const [ax, ay] = V[i], [bx, by] = V[(i + 1) % 6], L = Math.hypot(bx - ax, by - ay), n = Math.round(L / gap); for (let j = 0; j < n; j++) push(ax + (bx - ax) * j / n, ay + (by - ay) * j / n, C, (i * n + j) * 3); }
        break; }
      case 'funnel': grid((x, y) => { const k = (y - r.top) / r.height, half = r.width / 2 * (1 - .82 * k); return Math.abs(x - cx) <= half; }); break;
      case 'waffle': { const n = 10, cell = Math.min(r.width, r.height) / n, v = Math.round(+d.v || 0);
        for (let i = 0; i < 100; i++) { const row = 9 - Math.floor(i / n), col = i % n; push(r.left + (col + .5) * cell, r.top + (row + .5) * cell, i < v ? C : C2, i * 9); }
        break; }
      case 'split': { const v = +d.v || 0; grid(() => true); out.forEach(p => { p.c = (p.x - r.left) / r.width * 100 < v ? C : C2; }); break; }
      case 'text': {
        const oc = document.createElement('canvas'), ox = oc.getContext('2d'), w = Math.ceil(r.width), h = Math.ceil(r.height);
        oc.width = w; oc.height = h;
        let fs = h * .82; ox.font = `700 ${fs}px Poppins`;
        const tw = ox.measureText(d.text).width; if (tw > w * .96) { fs *= w * .96 / tw; ox.font = `700 ${fs}px Poppins`; }
        ox.textAlign = 'center'; ox.textBaseline = 'middle'; ox.fillStyle = '#000'; ox.fillText(d.text, w / 2, h / 2);
        const img = ox.getImageData(0, 0, w, h).data, lastWord = d.text.lastIndexOf(' ');
        const splitX = w / 2 - ox.measureText(d.text).width / 2 + ox.measureText(d.text.slice(0, lastWord + 1)).width;
        for (let y = gap / 2; y < h; y += gap) for (let x = gap / 2; x < w; x += gap) if (img[(Math.floor(y) * w + Math.floor(x)) * 4 + 3] > 128) push(r.left + x, r.top + y, x > splitX ? C2 : C, x * .9);
        break; }
    }
    const a = d.a ? +d.a : 1, s = (+d.s || .17) * REM * (d.dots === 'waffle' ? 2.2 : 1);
    out.forEach(p => { p.a = a; p.s = s; });
    el._geo = { left: r.left, top: r.top, w: r.width, h: r.height, cx, cy };
    return out;
  }
  const isOn = el => !el.closest('[data-f]:not(.on)') && !(el.dataset.from && +el.dataset.from > (el.closest('.scene') || {})._frag);
  function release(el) { (active.get(el) || []).forEach(p => { p.el = null; p.pt = null; p.k = .045 + p.sd * .03; }); active.delete(el); }
  function acquire(n, cx) {
    const pool = P.filter(p => !p.el && p.y > -50 && p.y < H + 50);
    pool.sort((a, b) => Math.abs(a.x - cx) - Math.abs(b.x - cx));
    return pool.slice(0, n);
  }
  function assign(el) {
    const pts = points(el), t = now();
    let pp = active.get(el) || [];
    if (pp.length > pts.length) { pp.slice(pts.length).forEach(p => { p.el = null; p.pt = null; }); pp = pp.slice(0, pts.length); }
    if (pp.length < pts.length) { const fresh = acquire(pts.length - pp.length, el._geo.cx); fresh.forEach(p => { p.el = el; }); pp = pp.concat(fresh); }
    const n = Math.min(pp.length, pts.length);
    pts.length = n;
    pp.sort((a, b) => a.x - b.x || a.y - b.y);
    const order = pts.map((p, i) => i).sort((i, j) => pts[i].x - pts[j].x || pts[i].y - pts[j].y);
    const fresh = !active.has(el);
    order.forEach((pi, k) => { const p = pp[k], q = pts[pi]; p.el = el; p.pt = q; if (fresh) p.go = t + q.d; p.k = .075 + p.sd * .05; });
    active.set(el, pp);
  }
  let scene = null;
  function update(root) {
    scene = root || scene; if (!cv || !scene) return;
    const els = $$('[data-dots]', scene).filter(isOn);
    [...active.keys()].forEach(el => { if (!els.includes(el)) release(el); });
    els.forEach(assign);
  }
  function refresh() { if (scene) [...active.keys()].forEach(assign); }

  // ── the frame ─────────────────────────────────────────────────────────
  function frame(t) {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    const T = t / 1000;
    for (const k in want) cur[k] += (want[k] - cur[k]) * (k === 'show' || k === 'a' ? .04 : .025);
    g.clearRect(0, 0, W, H);
    const SC = COL[cur.c] || COL.white, sw = REM / 16;
    for (let i = 0; i < P.length; i++) {
      const p = P[i];
      let tx, ty, ta, ts, tc, k = p.k;
      if (p.el && p.pt && t >= p.go) {
        const q = p.pt, G = p.el._geo, mo = p.el.dataset.motion;
        tx = q.x; ty = q.y; ta = q.a; ts = q.s; tc = q.c;
        if (mo === 'flow') { const sp = +p.el.dataset.sp || 60; tx = G.left + ((q.x - G.left + T * sp * sw) % G.w); if (Math.abs(tx - p.x) > G.w * .5 && Math.abs(ty - p.y) < 4) p.x = tx; }
        else if (mo === 'fall') { const sp = +p.el.dataset.sp || 30, ny = G.top + ((q.y - G.top + T * sp * sw) % G.h), kk = (ny - G.top) / G.h, k0 = (q.y - G.top) / G.h; tx = G.cx + (q.x - G.cx) * (1 - .82 * kk) / (1 - .82 * k0); if (Math.abs(ny - p.y) > G.h * .5 && Math.abs(tx - p.x) < G.w) { p.y = ny; p.x = tx; } ty = ny; }
        else if (mo === 'orbit') { const a = T * (+p.el.dataset.sp || .5), dx = q.x - G.cx, dy = q.y - G.cy; tx = G.cx + dx * Math.cos(a) - dy * Math.sin(a); ty = G.cy + dx * Math.sin(a) + dy * Math.cos(a); k = Math.max(k, .2); }
        else if (mo === 'drift') { tx += Math.sin(T * .9 + p.ph) * 1.6 * sw; ty += Math.cos(T * .8 + p.ph) * 1.6 * sw; }
        else if (mo === 'swarm') { tx += Math.sin(T * 1.7 + p.ph) * 4 * sw; ty += Math.cos(T * 1.3 + p.ph * 2) * 4 * sw; ta *= .65 + .35 * Math.sin(T * 3 + p.ph); }
      } else {
        const [x, y, f] = seaXY(p, T);
        tx = x; ty = y; tc = SC; ts = (.55 + 1.9 * f) * sw;
        ta = cur.a * cur.show * (.1 + .9 * f) * (f < .04 ? f / .04 : 1);
        if (!p.el && Math.abs(p.x - tx) < 2 && Math.abs(p.y - ty) < 2) k = .5; else if (!p.el) k = Math.max(k, .05);
      }
      p.x += (tx - p.x) * k; p.y += (ty - p.y) * k;
      p.a += (ta - p.a) * .08; p.s += (ts - p.s) * .1;
      p.c[0] += (tc[0] - p.c[0]) * .08; p.c[1] += (tc[1] - p.c[1]) * .08; p.c[2] += (tc[2] - p.c[2]) * .08;
      if (p.a < .01 || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) continue;
      g.globalAlpha = Math.min(1, p.a);
      g.fillStyle = `rgb(${p.c[0] | 0},${p.c[1] | 0},${p.c[2] | 0})`;
      const s = p.s;
      if (!p.el && cur.stream > .05) { g.fillRect(p.x - s * 7 * cur.stream, p.y - s / 3, s * 14 * cur.stream, Math.max(.8, s * .66)); continue; }
      if (s < 2.2) g.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      else { g.beginPath(); g.arc(p.x, p.y, s / 2, 0, 6.283); g.fill(); }
    }
    g.globalAlpha = 1;
  }
  return { init, setGround, update, refresh };
})();

// ════════════════════════════════════════════════════════════════════════
// ENGINE: scenes, clicks, chrome, presenter view
// ════════════════════════════════════════════════════════════════════════
const stage = $('#stage');
let idx = 0, frag = 0, cur = null;
const chan = 'BroadcastChannel' in window ? new BroadcastChannel('lead-the-shift-horizon') : null;
const PRESENTER = location.hash.startsWith('#presenter');
const say = s => (SCRIPT[s.title] || {}).vo || '';
const notes = s => (SCRIPT[s.title] || {}).notes || '';
const maxF = el => $$('[data-f],[data-hl]', el).reduce((m, n) => Math.max(m, +(n.dataset.f || n.dataset.hl)), 0);

function splitWords(el) {
  let i = 0;
  const walk = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const parts = n.textContent.split(/(\s+)/); if (parts.every(p => !p.trim())) return;
      const fr = document.createDocumentFragment();
      parts.forEach(p => { if (!p) return; if (!p.trim()) { fr.appendChild(document.createTextNode(p)); return; } const m = document.createElement('span'); m.className = 'wm'; const w = document.createElement('span'); w.className = 'wi'; w.style.setProperty('--i', i++); w.textContent = p; m.appendChild(w); fr.appendChild(m); });
      n.replaceWith(fr);
    } else if (n.nodeType === 1 && !/^(svg|br|img)$/i.test(n.tagName) && !n.classList.contains('odo')) walk(n);
  });
  walk(el);
}
function rollOdos(el) {
  $$('.odo', el).forEach(o => {
    const host = o.closest('[data-f]'), on = el.classList.contains('live') && (!host || host.classList.contains('on'));
    const dg = $$('.dg', o);
    dg.forEach((g, i) => { const c = g.firstChild, d = on ? +g.dataset.d : 0, delay = on ? `${.15 + (dg.length - i) * .09}s` : '0s'; c.style.transitionDelay = delay; g.style.transitionDelay = delay; c.style.transform = `translateY(-${d}em)`; g.style.width = c.children[d].getBoundingClientRect().width + 'px'; });
  });
}
function seaFor(s, k) {
  const o = { ...(s.sea || {}) };
  Object.entries(s.seaF || {}).forEach(([f, v]) => { if (k >= +f) Object.assign(o, v); });
  return o;
}
function applyFrag(el, k) {
  el._frag = k;
  $$('[data-f]', el).forEach(n => n.classList.toggle('on', +n.dataset.f <= k));
  $$('[data-hl]', el).forEach(n => n.classList.toggle('hl', +n.dataset.hl <= k));
  rollOdos(el);
  const s = SCENES[idx];
  SEA.setGround(s.ground, seaFor(s, k));
  SEA.update(el);
  clearTimeout(el._re); el._re = setTimeout(() => { if (cur === el) SEA.refresh(); }, 1000);
}
function render(i, k) {
  const s = SCENES[i];
  const el = document.createElement('section');
  el.className = `scene t-${s.type} on-${s.ground}`;
  el.innerHTML = s.html();
  $$('.t', el).forEach(splitWords);
  el._max = maxF(el);
  document.body.dataset.ground = s.ground;
  document.body.classList.toggle('hide-chrome', s.chrome === false);
  stage.appendChild(el);
  const old = cur; cur = el;
  if (old) { old.classList.remove('live'); old.classList.add('leaving'); setTimeout(() => old.remove(), 900); }
  frag = Math.max(0, Math.min(k === 'end' ? el._max : k, el._max));
  requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.add('live'); applyFrag(el, frag); }));
}
function go(i, k = 0) {
  i = Math.max(0, Math.min(SCENES.length - 1, i));
  if (i !== idx || !cur) { idx = i; render(i, k); }
  else { frag = Math.max(0, Math.min(k === 'end' ? cur._max : k, cur._max)); applyFrag(cur, frag); }
  sync();
}
function next() { if (cur && frag < cur._max) { frag++; applyFrag(cur, frag); sync(); } else if (idx < SCENES.length - 1) go(idx + 1, 0); }
function prev() { if (frag > 0) { frag--; applyFrag(cur, frag); sync(); } else if (idx > 0) go(idx - 1, 'end'); }
const groups = () => { const g = {}; SCENES.forEach((s, i) => (g[s.ch] = g[s.ch] || []).push(i)); return g; };
function sync() {
  history.replaceState(null, '', `#${idx + 1}${frag ? '.' + frag : ''}`);
  const s = SCENES[idx], c = CH[s.ch];
  $('#c-chap').innerHTML = `<b>${c.n}</b> · ${c.title}`;
  $('#c-count').textContent = `${String(idx + 1).padStart(2, '0')} / ${SCENES.length}`;
  $$('#c-prog div').forEach(d => { const [a, b] = d.dataset.r.split('-').map(Number); const p = idx > b ? 100 : idx < a ? 0 : ((idx - a + (cur && cur._max ? frag / (cur._max + 1) : 1)) / (b - a + 1)) * 100; d.firstChild.style.width = p + '%'; });
  if ($('#notes').classList.contains('open')) showNotes();
  $('#subs').textContent = say(s);
  chan && chan.postMessage({ type: 'state', idx, frag, max: cur ? cur._max : 0 });
}
function buildChrome() {
  $('#c-brand').innerHTML = `<img class="mk-i" src="${IMG.markI}" alt=""><img class="mk-w" src="${IMG.markW}" alt="">Lead the Shift · Les Assises 2026`;
  $('#c-prog').innerHTML = Object.entries(groups()).map(([ch, l]) => `<div style="flex:${l.length}" data-r="${l[0]}-${l[l.length - 1]}" title="${CH[ch].n} · ${CH[ch].title}"><i></i></div>`).join('');
  $$('#c-prog div').forEach(d => d.addEventListener('click', e => { e.stopPropagation(); go(+d.dataset.r.split('-')[0]); }));
}
function buildOverview() {
  $('#ov').innerHTML = `<h2>Outline</h2>` + Object.entries(groups()).map(([ch, l]) => `<div class="ov-ch"><h3>${CH[ch].n} · ${CH[ch].title}<span>${CH[ch].mins[0]} - ${CH[ch].mins[1]} min</span></h3><div class="ov-g">${l.map(i => `<button data-i="${i}" class="${i === idx ? 'cur' : ''}"><small>${i + 1}</small>${SCENES[i].title}</button>`).join('')}</div></div>`).join('');
  $$('#ov button').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); $('#ov').classList.remove('open'); go(+b.dataset.i); }));
}
function showNotes() { const s = SCENES[idx]; $('#notes').innerHTML = `<h4>Say · ${s.title}</h4><p style="font-family:var(--f-serif);font-size:1.15rem;color:#fff;margin:0 0 1rem">${say(s)}</p><h4>Notes</h4><div style="white-space:pre-line">${notes(s)}</div>`; }

function presenter() {
  document.body.className = 'pres';
  document.body.innerHTML = `<div class="pv"><div><div class="k2" id="pv-ch"></div><h1 id="pv-t"></h1><div class="fr" id="pv-fr"></div>
      <div class="k2" style="margin-bottom:.4rem">À dire</div><p class="say" id="pv-s"></p><div class="k2" style="margin-bottom:.4rem">Notes</div><div class="nt" id="pv-n"></div></div>
    <div><div class="box"><div class="k2">Temps écoulé</div><div class="clock" id="pv-c">00:00</div><div class="muted" id="pv-tg"></div>
        <div class="btns" style="margin-top:.8rem"><button id="pv-st">Démarrer</button><button id="pv-rs">Remise à zéro</button></div></div>
      <div class="box"><div class="k2">Écran suivant</div><div id="pv-nx" style="font-size:18px;margin-top:.4rem"></div></div>
      <div class="btns"><button id="pv-p">← Retour</button><button id="pv-x" class="pri">Suivant →</button></div>
      <p class="muted" style="margin-top:1.2rem">Flèches et télécommandes fonctionnent aussi ici. B : écran noir.</p></div></div>`;
  let st = null, acc = 0, state = { idx: 0, frag: 0, max: 0 };
  const cmd = c => chan && chan.postMessage({ type: 'cmd', cmd: c });
  const draw = () => {
    const s = SCENES[state.idx], c = CH[s.ch], n = SCENES[state.idx + 1];
    $('#pv-ch').textContent = `${c.n} · ${c.title} · écran ${state.idx + 1} / ${SCENES.length}`;
    $('#pv-t').textContent = s.title;
    $('#pv-fr').innerHTML = [...Array(state.max + 1)].map((_, i) => `<i class="${i <= state.frag ? 'on' : ''}"></i>`).join('');
    $('#pv-n').textContent = notes(s); $('#pv-s').textContent = say(s) || '(silence)';
    $('#pv-nx').textContent = n ? n.title : 'Fin'; $('#pv-tg').textContent = `Cible du chapitre : ${c.mins[0]} - ${c.mins[1]} min`;
  };
  const clock = () => { const ms = acc + (st ? Date.now() - st : 0), m = Math.floor(ms / 60000), sec = Math.floor(ms / 1000) % 60, el = $('#pv-c'); el.textContent = `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`; const c = CH[SCENES[state.idx].ch]; el.classList.toggle('late', c.mins[1] > 0 && m >= c.mins[1]); };
  setInterval(clock, 500);
  $('#pv-st').onclick = () => { if (st) { acc += Date.now() - st; st = null; $('#pv-st').textContent = 'Reprendre'; } else { st = Date.now(); $('#pv-st').textContent = 'Pause'; } };
  $('#pv-rs').onclick = () => { acc = 0; st = st ? Date.now() : null; clock(); };
  $('#pv-p').onclick = () => cmd('prev'); $('#pv-x').onclick = () => { if (!st && !acc) $('#pv-st').click(); cmd('next'); };
  document.addEventListener('keydown', e => {
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); if (!st && !acc) $('#pv-st').click(); cmd('next'); }
    if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); cmd('prev'); }
    if (e.key === 'b' || e.key === 'B' || e.key === '.') cmd('black');
  });
  chan && chan.addEventListener('message', e => { if (e.data.type === 'state') { state = e.data; draw(); } });
  cmd('hello'); draw();
}

if (PRESENTER) presenter();
else {
  buildChrome();
  const start = () => {
    SEA.init();
    const m = location.hash.match(/^#(\d+)(?:\.(\d+))?/);
    idx = -1; go(m ? +m[1] - 1 : 0, m && m[2] ? +m[2] : 0);
  };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(start);
  const closeAll = () => $$('.ov').forEach(o => o.classList.remove('open'));
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); closeAll(); next(); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); closeAll(); prev(); }
    else if (k === 'Home') go(0); else if (k === 'End') go(SCENES.length - 1);
    else if (k === 'b' || k === 'B' || k === '.') document.body.classList.toggle('black');
    else if (k === 'f' || k === 'F') { if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {}); else document.exitFullscreen(); }
    else if (k === 'n' || k === 'N') { $('#notes').classList.toggle('open'); showNotes(); }
    else if (k === 's' || k === 'S') document.body.classList.toggle('subs');
    else if (k === 'o' || k === 'O') { const o = $('#ov'), op = !o.classList.contains('open'); closeAll(); if (op) { buildOverview(); o.classList.add('open'); } }
    else if (k === '?') { const h = $('#help'), op = !h.classList.contains('open'); closeAll(); if (op) h.classList.add('open'); }
    else if (k === 'p' || k === 'P') window.open(location.pathname + '#presenter', 'presenter', 'width=1280,height=800');
    else if (k === 'Escape') { closeAll(); $('#notes').classList.remove('open'); document.body.classList.remove('black'); }
  });
  stage.addEventListener('click', e => { if (e.target.closest('a,button')) return; next(); });
  $$('.ov').forEach(o => o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); }));
  chan && chan.addEventListener('message', e => {
    if (e.data.type !== 'cmd') return;
    if (e.data.cmd === 'next') next(); else if (e.data.cmd === 'prev') prev();
    else if (e.data.cmd === 'black') document.body.classList.toggle('black');
    else if (e.data.cmd === 'hello') sync();
  });
  let t; const wake = () => { document.body.classList.remove('idle'); clearTimeout(t); t = setTimeout(() => document.body.classList.add('idle'), 3500); };
  document.addEventListener('mousemove', wake); wake();
}
