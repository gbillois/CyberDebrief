// ════════════════════════════════════════════════════════════════════════
// LEAD THE SHIFT · Les Assises 2026
// Built into assises.html by tools/build-assises.py, from the PowerPoint
// "Atelier_Assises 2026_V.07 light 2.pptx" (first converted with the
// DeckSeeder PPTX import engine, see Assises-deckseeder.html).
// One idea per screen. What the speakers say is in `vo` (presenter view, P;
// subtitles, S); facts, sources and open points are in `notes` (N).
// ════════════════════════════════════════════════════════════════════════

const CH = {
  p:  { n: '00', title: 'Opening',            mins: [0, 6] },
  c1: { n: '01', title: 'Cyber for AI',       mins: [6, 17] },
  c2: { n: '02', title: 'Cyber against AI',   mins: [17, 26] },
  c3: { n: '03', title: 'Cyber with AI',      mins: [26, 36] },
  c4: { n: '04', title: 'The crew',           mins: [36, 40] },
  e:  { n: '05', title: 'Lead the shift',     mins: [40, 40] },
};

// ─── icons (24px, stroke) ───────────────────────────────────────────────
const ICONS = {
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  search: '<circle cx="11" cy="11" r="7.5"/><path d="M21 21l-4.6-4.6"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  cloud: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3L21 2M16 7l3 3M18.5 4.5l2 2"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  refresh: '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  layers: '<path d="M12 2L2 7l10 5 10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>',
  db: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
  zap: '<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>',
  pulse: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  ban: '<circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/>',
  tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  down: '<path d="M23 18l-9.5-9.5-5 5L1 6"/><path d="M17 18h6v-6"/>',
  up: '<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
  radar: '<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14"/>',
  chat: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 12.5 3h.5a8.5 8.5 0 0 1 8 8z"/>',
  cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>',
  gov: '<path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l9 5H3z"/>',
  bug: '<rect x="8" y="6" width="8" height="14" rx="4"/><path d="M19 7l-3 2M5 7l3 2M19 19l-3-2M5 19l3-2M20 13h-4M4 13h4M10 4l1 2M14 4l-1 2"/>',
  virus: '<circle cx="12" cy="12" r="5"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5M4.9 4.9l3.5 3.5M15.6 15.6l3.5 3.5M4.9 19.1l3.5-3.5M15.6 8.4l3.5-3.5"/>',
  clip: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 13l2 2 4-4"/>',
  award: '<circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>',
  buoy: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M4.93 19.07l4.24-4.24"/>',
  server: '<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  org: '<rect x="9" y="2" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><path d="M12 7v5M5 17v-5h14v5"/>',
  ucheck: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M17 11l2 2 4-4"/>',
  dollar: '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  helm: '<circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><path d="M12 1.5v4.5M12 18v4.5M1.5 12H6M18 12h4.5M4.6 4.6l3.2 3.2M16.2 16.2l3.2 3.2M4.6 19.4l3.2-3.2M16.2 7.8l3.2-3.2"/>',
  robot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4"/><circle cx="12" cy="3" r="1"/><circle cx="9" cy="14" r="1.2"/><circle cx="15" cy="14" r="1.2"/><path d="M2 13v3M22 13v3"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
  box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>',
  filter: '<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>',
  sandbox: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
  anchor: '<circle cx="12" cy="5" r="3"/><path d="M12 22V8M5 12H2a10 10 0 0 0 20 0h-3"/>',
  lighthouse: '<path d="M9.5 8h5l1.6 14H7.9z"/><path d="M9 8l3-4 3 4"/><path d="M8.6 15h6.8M9.1 11.5h5.8"/><path d="M3 5l4.5 2M21 5l-4.5 2"/>',
  map: '<path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4z"/><path d="M8 2v16M16 6v16"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 6-6"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  send: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  fingerprint: '<path d="M12 11c0 3.5-1 6.5-3 9M8 11a4 4 0 0 1 8 0c0 2-.3 4-1 6M4.5 13A8 8 0 0 1 12 4a8 8 0 0 1 8 8c0 1.5-.2 3-.6 4.3M15.5 19.5c.4-.8.7-1.6.9-2.5"/>',
  hourglass: '<path d="M6 2h12M6 22h12M6 2c0 6 6 6 6 10s-6 4-6 10M18 2c0 6-6 6-6 10s6 4 6 10"/>',
};
const ICON = (n, attrs = '') => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ${attrs}>${ICONS[n] || ''}</svg>`;
const fa = f => (f == null ? '' : ` data-f="${f}"`);
const cnt = (v, dec = 0) => `<span class="count" data-to="${v}" data-dec="${dec}">0</span>`;

// ─── shared pieces ──────────────────────────────────────────────────────
const photo = (src, mode = '', pos = '50% 50%') => `<div class="pbg ${mode}"><img src="${src}" alt="" style="object-position:${pos}"></div>`;
const SAILS = [
  { n: '01', a: 'Cyber', b: 'for AI', s: 'Secure the ecosystem' },
  { n: '02', a: 'Cyber', b: 'against AI', s: 'Reset the defensive baseline' },
  { n: '03', a: 'Cyber', b: 'with AI', s: 'Defend at machine speed' },
];
const YACHT = ['assets/assises/yacht-0.jpg', 'assets/assises/yacht-1.jpg', 'assets/assises/yacht-2.jpg', 'assets/assises/yacht-3.jpg'];
// the yacht: `up` sails are set; with `hoist`, the last one is raised live
function yacht({ up = 0, hoist = false, cur = 0, deep = false, labels = true } = {}) {
  const base = hoist ? YACHT[up - 1] : YACHT[up];
  const sails = labels ? SAILS.slice(0, up).map((s, i) => `<div class="sail s${i + 1} ${i + 1 === cur ? 'cur' : 'past'}"><b>${s.n}</b><strong>${s.a.toUpperCase()}<br>${s.b.toUpperCase()}</strong><em>${s.s}</em></div>`).join('') : '';
  return `<div class="yframe${deep ? ' deep' : ''}"><img class="base" src="${base}" alt="">${hoist ? `<img class="hoist" src="${YACHT[up]}" alt="">` : ''}${sails}</div>`;
}
const RAIL = ['Cyber for AI', 'Cyber against AI', 'Cyber with AI', 'The crew'];
const chrail = cur => `<div class="chrail">${RAIL.map((t, i) => `<span class="${i + 1 === cur ? 'cur' : i + 1 < cur ? 'done' : ''}">0${i + 1} · ${t}</span>`).join('')}</div>`;
const wake = (top, f) => `<svg class="wake" style="top:${top}" viewBox="0 0 1600 120" preserveAspectRatio="none"${fa(f)}><path class="w1" d="M0 40 C 300 0, 520 110, 820 60 S 1300 20, 1600 80"/><path class="w2" d="M0 70 C 260 40, 560 120, 860 80 S 1320 30, 1600 50"/></svg>`;
const btw = cur => `<div class="btw">${['AI discovery & risk management', 'AI platform security', 'AI identity'].map((t, i) => `<span class="${i + 1 === cur ? 'cur' : i + 1 < cur ? 'done' : ''}">0${i + 1} · ${t}</span>`).join('')}</div>`;
const lvhead = (n, t, sub, ai) => `<div class="lvh"><div><div class="k">Cyber with AI · Level ${n} of 3</div><h2 class="h"><b>Level ${n}</b> <i class="sep">|</i> ${t}</h2><p class="sub">${sub}</p></div>
  <div class="lvmeta"><div class="lvl">${[1, 2, 3].map(i => `<span class="${i <= n ? 'on' : ''}"></span>`).join('')}</div>
  <div class="aih" style="--ai:${ai}%"><div><b>AI ≈ ${ai}%</b><span>Human ≈ ${100 - ai}%</span></div><p><i></i></p></div></div></div>`;
const dd = (t = 'Deep dive') => `<span class="dd"><i>DD</i>${t}</span>`;

// ════════════════════════════════════════════════════════════════════════
// THE TALK
// ════════════════════════════════════════════════════════════════════════
const SCENES = [

// ─── OPENING ──────────────────────────────────────────────────────────
{ ch: 'p', type: 'title', title: 'Lead the Shift', brand: true,
  html: () => `${photo('assets/assises/regatta.jpg', 'soft', '50% 60%')}
  <div class="ttl">
    <div class="k">Les Assises 2026 · Workshop</div>
    <h1>Lead the <em>Shift</em></h1>
    <h2 class="sub-t">How CISOs must lead the AI transformation</h2>
    <div class="spk">
      <div><img src="assets/assises/claire.png" alt=""><p style="margin:0"><b>Claire Carré</b><span>Partner</span></p></div>
      <div><img src="assets/assises/gerome.png" alt=""><p style="margin:0"><b>Gérôme Billois</b><span>Partner</span></p></div>
    </div>
  </div>
  <div class="ttl-logos"><img class="ass" src="assets/assises/les-assises.jpg" alt="Les Assises"><img class="ws" src="assets/assises/wavestone.svg" alt="Wavestone"></div>`,
  vo: `Bonjour à toutes et à tous. Quarante minutes pour une question simple : comment, en tant que RSSI, prendre la barre de la transformation IA plutôt que la subir. Claire Carré, Gérôme Billois, Wavestone.`,
  notes: `Version source : la mention DRAFT de la slide 1 est retirée de l'écran.
Se présenter en une phrase chacun, puis passer directement à Wavestone.` },

{ ch: 'p', type: 'about', title: 'About us',
  html: () => `<div class="k">About us</div>
  <h2 class="h">Wavestone, helping you <g>lead cyber transformation</g> in an AI-driven world</h2>
  <div class="ab">
    <div class="ab-k">
      <div><b>${cnt(1000)}+</b><span><strong>cyber consultants</strong><br>700+ trained in <strong>AI security</strong><br>150+ trained in <strong>AI engineering</strong></span></div>
      <div><b>${cnt(11)}<small>countries</small></b><span><strong>Global reach, local insight</strong> through strong ties with communities and regulators</span></div>
      <div><b>${cnt(4000)}+</b><span><strong>tier-1 clients</strong>, trusted for <strong>20+ years</strong> across public and private sectors</span></div>
      <div><b>360°<small>expertise</small></b><span>The full spectrum of <strong>CSO &amp; CISO</strong> priorities for IT, OT and products. Recognized by peers at Black Hat, RSAC, DEF CON…</span></div>
    </div>
    <div class="ab-r">
      <div class="ab-c glass"${fa(1)}><div><h3><b>Human-led</b>, AI-accelerated</h3><p>Combining <b>human judgement</b>, <b>deep expertise</b> and our own AI platforms to <b>accelerate delivery</b> and <b>deepen analysis</b>.</p></div>
        <div class="props"><figure><div><img src="assets/assises/agents/cyber-by-design.png" alt=""></div><figcaption>In-house AI platforms</figcaption></figure><figure><div><img src="assets/assises/agents/console.png" alt=""></div><figcaption>Benchmark · pentest · IAM · crisis</figcaption></figure></div></div>
      <div class="ab-c glass"${fa(2)}><div><h3>From <b>strategy</b> to <b>forward-deployed engineering</b></h3><p>We ensure the <b>successful delivery</b> of all your <b>transformation programs</b>, bringing <b>adoption</b> and <b>value at scale</b>.</p></div>
        <div class="props"><figure><div><img src="assets/assises/agents/top30.png" alt=""></div><figcaption>Strategic vision: Top 30 for 2030</figcaption></figure><figure><div><img src="assets/assises/agents/bench-2.png" alt=""></div><figcaption>Cyber &amp; AI benchmarks</figcaption></figure><figure><div class="fit"><img src="assets/assises/partners-iam.png" alt=""></div><figcaption>Technology vendor collaborations</figcaption></figure></div></div>
      <div class="ab-c glass"${fa(3)}><div><h3><b>Independent</b> &amp; makers</h3><p>An unbiased approach to ensure the best choice for you, drawing on our <b>hands-on experience with leading solutions</b> and <b>in-house building capabilities</b>.</p></div>
        <div class="props"><figure><div><img src="assets/assises/agents/ai4cyber.png" alt=""></div><figcaption>AI4Cyber</figcaption></figure><figure><div><img src="assets/assises/agents/dataprot.png" alt=""></div><figcaption>Modern data protection</figcaption></figure><figure><div><img src="assets/assises/agents/lab.png" alt=""></div><figcaption>Cyber &amp; AI Lab</figcaption></figure></div></div>
    </div>
  </div>`,
  vo: `Wavestone en quelques chiffres : plus de mille consultants cyber, dont sept cents formés à la sécurité de l'IA et cent cinquante à l'ingénierie IA. Trois convictions : des équipes humaines accélérées par l'IA, de la stratégie jusqu'à l'ingénierie sur le terrain, et une indépendance totale vis-à-vis des éditeurs, avec la capacité de construire nous-mêmes.`,
  notes: `Clics : les trois piliers, un par un.
Chiffres confirmés dans les notes de la source : 1000+ consultants cyber, 700+ formés sécurité IA, 150+ formés ingénierie IA, 11 pays, 4000+ clients tier-1, 20+ ans, 30+ agents construits ou déployés.
Modèle : indépendance, pas de revente de produits, pas de services managés cyber standard. L'engagement de livraison va jusqu'au premier go-live réussi avec accompagnement à l'adoption (pas de maintenance continue).
Note de relecture source : « Manque plus de Committed to your success from strategy to execution… » à arbitrer.` },

{ ch: 'p', type: 'agents', title: 'Homemade AI agents',
  html: () => {
    const hx = [
      ['Cyber-By-Design Agent', 'Architecture review and improvement accelerator', 0, 0],
      ['Auto Cyber Benchmark', 'Interview and analysis insight amplifier', 1, 0],
      ['IdentiVEX', 'Role mining advisor', 2, 0],
      ['CrisisMaker', 'Crisis exercise stimuli creation studio', -.5, 1],
      ['Web Recon Accelerator', 'Deterministic assistant for pentesters', .5, 1],
      ['Smart Identity Analyzer', 'IAM data quality improver', 1.5, 1],
      ['Booster RM', 'Risk analysis accelerator', 0, 2],
    ];
    const W = 12.9, H = 10.9;
    return `<div class="k">About us</div>
  <h2 class="h" style="max-width:none;font-size:2.5rem">Homemade AI agents to <g>accelerate and add value</g> to our engagements</h2>
  <div class="ag">
    <div class="hive"><div class="hive-g">
      <div class="shots">
        <img src="assets/assises/agents/cyber-by-design-2.png" style="left:-4.5rem;top:1rem;--r2:-3deg;transform:rotate(-5deg)" alt="">
        <img src="assets/assises/agents/identivex.png" style="right:-3.5rem;top:15rem;--r2:4deg;transform:rotate(3deg);animation-delay:-3s" alt="">
        <img src="assets/assises/agents/crisismaker.png" style="left:-5.5rem;bottom:2rem;--r2:2deg;transform:rotate(4deg);animation-delay:-5s" alt="">
        <img src="assets/assises/agents/identity-analyzer.png" style="right:-2rem;bottom:-1rem;--r2:-4deg;transform:rotate(-3deg);animation-delay:-2s" alt="">
        <img src="assets/assises/agents/auto-benchmark.png" style="right:-3rem;top:-1.5rem;width:9rem;transform:rotate(-2deg);animation-delay:-6s" alt="">
      </div>
      ${hx.map(([t, s, x, y], i) => `<div class="hx${i === 6 ? ' hot' : ''}" style="left:${2 + (x + .5) * W}rem;top:${.6 + y * H}rem"${fa(i < 3 ? null : 1)}><div><i>AGENT 0${i + 1}</i><b>${t}</b><span>${s}</span></div></div>`).join('')}
    </div></div>
    <div class="ag-r">
      <p class="tag">That can be used in <b>all environments</b>, ours and yours!</p>
      <div class="pr glass"${fa(2)}><i>01</i><b>Decoupled from infrastructure</b><span>Autonomous agents that do not depend on any client stack, using standalone HTML pages</span></div>
      <div class="pr glass"${fa(3)}><i>02</i><b>Decoupled from LLMs</b><span>API calls to the client's AI, or even a local model depending on the context</span></div>
      <div class="pr glass"${fa(4)}><i>03</i><b>Governed by usage</b><span>One API key per engagement, tied to a predefined budget</span></div>
    </div>
  </div>`; },
  vo: `Et nous appliquons à nous-mêmes ce que nous allons vous recommander. Nous avons construit nos propres agents : revue d'architecture, benchmark, analyse de rôles, création de stimuli de crise, assistance aux pentesteurs, qualité des données IAM, analyse de risques. Trois principes : ils ne dépendent d'aucune infrastructure, d'aucun modèle, et chaque usage est gouverné par un budget.`,
  notes: `Clics : les quatre derniers agents, puis les trois principes.
Sept agents montrés (sur 30+ construits ou déployés). Pages HTML autonomes, appels API vers l'IA du client ou un modèle local, une clé API par mission avec budget.` },

{ ch: 'p', type: 'press', title: 'AI has changed the game',
  html: () => {
    const ids = [
      'assets/assises/press/p51.jpg',
      'assets/assises/press/p53.jpg',
      'assets/assises/press/p54.jpg',
      'assets/assises/press/p55.jpg',
      'assets/assises/press/p56.jpg',
      'assets/assises/press/p57.jpg',
      'assets/assises/press/p58.jpg',
      'assets/assises/press/p59.jpg',
      'assets/assises/press/p60.jpg',
      'assets/assises/press/p61.jpg',
      'assets/assises/press/p62.jpg',
      'assets/assises/press/p63.jpg',
      'assets/assises/press/p64.jpg',
      'assets/assises/press/p65.jpg',
      'assets/assises/press/p66.jpg',
      'assets/assises/press/p67.jpg',
      'assets/assises/press/p68.jpg',
      'assets/assises/press/p69.jpg',
      'assets/assises/press/p52.jpg'];
    const cols = [[], [], [], [], []];
    ids.forEach((id, i) => cols[i % 5].push(id));
    const colH = c => c.concat(c).map(id => `<img src="${id}" alt="">`).join('');
    return `<div class="wall">${cols.map(c => `<div class="col">${colH(c)}</div>`).join('')}</div><div class="wall-tint"></div>
  <div class="press-band"${fa(1)}><h2>AI has changed the game…</h2><p>And the need to navigate its challenges has never been stronger</p></div>`; },
  vo: `Il suffit de regarder la presse de ces derniers mois. Des agents d'IA qui s'organisent pour attaquer, des deepfakes à vingt-cinq millions, des attaques automatisées de bout en bout. L'IA a changé la donne. Et le besoin de naviguer dans ces défis n'a jamais été aussi fort.`,
  notes: `Laisser la revue de presse défiler quelques secondes en silence, puis cliquer : le bandeau apparaît.
Coupures visibles : WSJ (hackers chinois et Claude), Arup (deepfake 20 M£), CNN (25 M$ en visio), Hugging Face / OpenAI, Euronews, Mistral (souveraineté), NYT…` },

{ ch: 'p', type: 'question', title: 'The question',
  html: () => `${yacht({ up: 0, labels: false })}${wake('70%')}
  <h2 class="qq">How do you embrace the full potential of AI and <b>lead the shift</b>?</h2>`,
  vo: `Alors la question de ce matin : comment saisir tout le potentiel de l'IA, et prendre la barre de ce changement ?`,
  notes: `Le voilier sert de fil rouge : une voile se hisse à chaque chapitre. Laisser l'image respirer.` },

{ ch: 'p', type: 'shifts', title: 'Three shifts, one timeline',
  html: () => {
    const X = { 2023: 14, 2025: 40, 2026: 59, 2030: 82 };
    const lanes = [['Cyber for AI', 'Secure the ecosystem', 2023, 6.5], ['Cyber against AI', 'Reset the defensive baseline', 2025, 13.5], ['Cyber with AI', 'Defend at machine speed', 2026, 20.5]];
    return `${yacht({ up: 0, labels: false, deep: true })}
  <div class="k">The race has changed</div>
  <h2 class="h"><g>Three shifts have emerged</g> on a single timeline…</h2>
  <div class="lanes">
    ${Object.entries(X).map(([y, x]) => `<div class="yr" style="left:${x}%">${y === '2030' ? '2030…' : y}</div>`).join('')}
    ${lanes.map(([a, b, y, top], i) => `<div class="lane" style="top:${top + 4}rem;--x:${X[y]}%"${fa(i + 1)}><i></i><span class="dot"></span><div class="lbl"><b>${a.toUpperCase()}</b><span>${b}</span></div></div>`).join('')}
  </div>
  <p class="shift-end"${fa(4)}>…requiring a <b>common orientation</b> to win the AI race</p>`; },
  vo: `Trois bascules se sont succédé sur une seule ligne de temps. 2023 : sécuriser l'IA que l'entreprise adopte. 2025 : faire face à des attaquants qui utilisent l'IA. 2026 : utiliser l'IA pour défendre à la vitesse machine. Les trois courent en même temps, et jusqu'en 2030. Il faut donc un cap commun pour gagner la course.`,
  notes: `Clics : 2023 Cyber for AI, 2025 Cyber against AI, 2026 Cyber with AI, puis le cap commun.
Ce sont les trois chapitres de la session, plus un quatrième sur l'organisation.` },

// ─── CHAPTER 1 · CYBER FOR AI ────────────────────────────────────────
{ ch: 'c1', type: 'chapter', title: 'Chapter 1: Cyber for AI',
  html: () => `${yacht({ up: 1, hoist: true, cur: 1 })}${chrail(1)}
  <div class="band"><small>Chapter 01 · Cyber for AI</small><p>From protecting models to <b>controlling platforms, agents and actions</b></p></div>`,
  vo: `Première voile : Cyber for AI. Sécuriser l'écosystème. On ne parle plus seulement de protéger des modèles, mais de contrôler des plateformes, des agents, et les actions qu'ils réalisent.`,
  notes: `Laisser la voile se hisser (3 secondes) avant de parler.` },

{ ch: 'c1', type: 'bench', title: '2026 AI Cyber Benchmark',
  html: () => {
    const st = (v, t, lo, dec) => `<div class="st glass${lo ? ' lo' : ''}"><b>${cnt(v, dec)}<small>%</small></b><span>${t}</span></div>`;
    return `<div class="k">2026 AI Cyber Benchmark</div>
  <h2 class="h">Breaking the <g>agentic wall</g></h2>
  <div class="bm-top">
    <div class="mat"><div>${cnt(31)}<small>%</small></div>${ICON('arrow')}<div>${cnt(45)}<small>%</small></div></div>
    <p><b class="pts">+14 points</b>of maturity in one year, but progress stops at agentic AI. Three topics to break through:</p>
  </div>
  <div class="bm" data-focus>
    <div class="bm-col" data-col="1"><h4><i>01</i>AI discovery &amp; risk management</h4>
      <div class="bm-row" style="--n:2">${st(72, '<strong>identify AI use</strong> during new procurement processes')}${st(88, 'have adapted their <strong>risk management processes</strong> to AI and appointed a <strong>group-level AI security lead</strong>')}</div>
      <div class="bm-row" style="--n:2">${st(12, '<strong>know AI systems</strong> or components external to their platform', 1)}${st(33, 'cover <strong>agentic AI in their risk analyses</strong>', 1)}</div></div>
    <div class="bm-col" data-col="2"><h4><i>02</i>AI platform security</h4>
      <div class="bm-row" style="--n:2">${st(87.5, 'generate <strong>logs in their AI applications</strong>', 0, 1)}${st(50, 'run <strong>dedicated AI security testing</strong> (AI red team)')}</div>
      <div class="bm-row" style="--n:2">${st(8, 'send those <strong>logs to the SOC</strong> for analysis and response', 1)}${st(11, 'implement <strong>security capabilities beyond native solutions</strong>', 1)}</div></div>
    <div class="bm-col" data-col="3"><h4><i>03</i>AI identity</h4>
      <div class="bm-row" style="--n:1">${st(72, 'have built <strong>data privacy compliance</strong> into the AI development lifecycle')}</div>
      <div class="bm-row" style="--n:1">${st(15, 'have <strong>identity and access management</strong> fit for AI agents', 1)}</div></div>
    <div class="wallline"${fa(4)}><span>The agentic wall</span></div>
  </div>
  <span data-f="1" hidden></span><span data-f="2" hidden></span><span data-f="3" hidden></span>`; },
  mount: el => { el._onFrag = k => { const bm = el.querySelector('.bm'); bm.classList.toggle('focus', k >= 1 && k <= 3); el.querySelectorAll('.bm-col').forEach(c => c.classList.toggle('hl', +c.dataset.col === k)); }; },
  vo: `Notre benchmark 2026. Bonne nouvelle : la maturité IA progresse de quatorze points en un an, de 31 à 45 %. Mais la progression s'arrête net à l'IA agentique. En gouvernance, les fondamentaux sont là : 72 % identifient l'IA dans leurs achats, 88 % ont adapté leur gestion des risques. Mais seulement 12 % connaissent les systèmes d'IA hors de leur plateforme, et un tiers couvre l'agentique dans ses analyses de risques. Côté plateformes : on génère des logs, mais 8 % seulement les envoient au SOC. Et 15 % seulement ont une gestion des identités adaptée aux agents. C'est le mur agentique.`,
  notes: `Clics : 1 découverte et risques, 2 sécurité des plateformes, 3 identité, 4 le « mur agentique » (ligne rouge entre ce qui est fait et ce qui manque).
Lecture : rangée du haut = acquis ; rangée du bas = les manques liés à l'agentique.
Source : Wavestone, 2026 AI Cyber Benchmark. « We're moving from governance to operations ».` },

{ ch: 'c1', type: 'disc', title: 'Break the wall 1/3: discovery',
  html: () => {
    const B = (cls, t, l, tp, s) => `<div class="bub ${cls}" style="left:${l}%;top:${tp}%;width:${s}rem;height:${s}rem">${t}</div>`;
    return `<div class="k">Break the wall 1/3</div>
  <h2 class="h">Find every agent and <g>register it</g></h2>
  ${btw(1)}
  <div class="disc">
    <div class="peri">
      <div class="perim" style="width:27rem;height:27rem;left:0"><span>Organization perimeter</span>
        ${B('ent', 'Enterprise agentic platform', 10, 22, 8.6)}${B('ent', 'Enterprise agentic platform', 46, 18, 8.6)}
        ${B('cit', 'Citizen AI', 70, 46, 6.2)}${B('saas', 'SaaS app', 14, 58, 6)}${B('saas', 'SaaS app', 36, 70, 6)}${B('saas', 'SaaS app', 56, 64, 6)}
      </div>
      ${B('out', 'Personal AI', 64, 4, 6.4)}${B('out', 'BYOAI', 72, 36, 6.4)}${B('out', 'BYOA', 70, 68, 6.4)}
    </div>
    <div class="wtl"${fa(1)}><h3>Where to look</h3>
      <div class="wl glass" style="--tone:#8B6DFF">${ICON('file')}<div><b>Enterprise AI</b><ul><li>Review platforms &amp; contracts</li><li>Scan repos: AI keys, models &amp; libraries</li></ul></div></div>
      <div class="wl glass" style="--tone:#B6A6FF">${ICON('cloud')}<div><b>SaaS applications</b><ul><li>Identify AI apps via web gateway</li><li>Use categories &amp; risk scores</li></ul></div></div>
      <div class="wl glass" style="--tone:#FFB547">${ICON('users')}<div><b>Citizen AI &amp; BYOAI</b><ul><li>Audit mail &amp; file permissions</li><li>Monitor direct AI API calls</li><li>Detect local AI tools &amp; MCP configs</li><li>Review AI subscriptions &amp; expenses</li></ul></div></div>
    </div>
  </div>
  <div class="steps3"${fa(2)}>
    <div class="step glass"><i>1</i><b>Set up governance</b><span>Align IT and AI teams on one agent policy and owners</span></div>
    <div class="step glass"><i>2</i><b>Track and authorize</b><span>Run discovery continuously and reconcile it with the registry</span></div>
    <div class="step glass"><i>3</i><b>Invest in a discovery tool</b><span>Tooling that discovers agents and feeds the registry automatically</span></div>
  </div>`; },
  vo: `Premier pan du mur : la découverte. On ne protège pas ce qu'on ne voit pas. Dans votre périmètre, il y a les plateformes agentiques de l'entreprise, les applications SaaS qui embarquent de l'IA, l'IA citoyenne. Et au-delà : l'IA personnelle, les collaborateurs qui apportent leur propre IA, voire leurs propres agents. Où chercher ? Dans les contrats et les dépôts de code, dans la passerelle web, dans les droits de messagerie, les appels API directs, les configurations MCP locales, et même les notes de frais. Trois actions : une gouvernance commune, un suivi continu réconcilié avec un registre, et un outil de découverte.`,
  notes: `Clics : où chercher, puis les trois actions.
BYOAI : Bring Your Own AI. BYOA : Bring Your Own Agent. MCP : Model Context Protocol (configurations locales des outils d'IA).` },

{ ch: 'c1', type: 'plat', title: 'Break the wall 2/3: platforms',
  html: () => {
    const bd = (n, pos) => `<span class="badge" data-hl="${n}" style="${pos}">${n}</span>`;
    const C = [['Guardrails', 'filter prompts and outputs'], ['Model protection', 'secure the AI supply chain'], ['Data &amp; RAG security', 'control agent retrieval'], ['Sandboxing', 'isolate code and tool execution'], ['Posture management', 'find exposed AI services'], ['Detection &amp; response', 'send AI logs to the SOC']];
    return `<div class="k">Break the wall 2/3</div>
  <h2 class="h">Secure the platforms <g>agents run on</g></h2>
  ${btw(2)}
  <div class="plat">
    <div><div class="k nobar" style="color:var(--muted);margin-bottom:.8rem">Example of an agentic AI architecture</div>
    <div class="arch">
      <div class="blk"><small>Inputs &amp; execution</small>
        <div class="nd">Knowledge / RAG${bd(3, 'left:-.95rem;top:-.7rem')}</div>
        <div class="nd">Tools &amp; external systems${bd(4, 'left:-.95rem;top:-.7rem')}</div>
        <div class="nd">LLMs / models${bd(2, 'left:-.95rem;top:-.7rem')}</div></div>
      <div style="display:flex;flex-direction:column;justify-content:center;gap:1rem">
        <div class="nd orc">Orchestrator / Harness</div>
        <div class="nd agt">Agents<small>skills, memory</small>${bd(4, 'right:-.95rem;top:-.7rem')}</div></div>
      <div class="blk"><small>User interface</small>
        <div class="nd">Application frontend${bd(1, 'left:-.95rem;top:-.7rem')}</div>
        <div style="text-align:center;color:var(--indigo-l);margin:.3rem 0">⇅</div>
        <div class="nd">End users / Systems</div></div>
      <div class="bar infra">Build / runtime infrastructure${bd(5, 'right:.8rem;top:.45rem')}</div>
      <div class="bar mon">Monitoring &amp; observability${bd(6, 'right:.8rem;top:.45rem')}</div>
    </div></div>
    <ul class="ctl">${C.map(([a, b], i) => `<li data-hl="${i + 1}"><i>${i + 1}</i><span><b>${a}</b> ${b}</span></li>`).join('')}</ul>
  </div>
  <div class="steps3"${fa(7)}>
    <div class="step glass"><i>${ICON('clip')}</i><b>Evaluate your platforms</b><span>Map the security functions of your current platforms and usage</span></div>
    <div class="step glass"><i>${ICON('filter')}</i><b>Select an AI security platform</b><span>Linked to an AI gateway, so every AI flow goes through it</span></div>
    <div class="step glass"><i>${ICON('search')}</i><b>Test its strength</b><span>AI red teaming, from the dev environment to internet-facing functions</span></div>
  </div>`; },
  vo: `Deuxième pan : les plateformes sur lesquelles tournent les agents. Prenons une architecture agentique type, et voyons ce qu'une plateforme de sécurité IA doit couvrir. Un : des garde-fous sur les prompts et les réponses. Deux : la protection des modèles et de leur chaîne d'approvisionnement. Trois : la sécurité des données et du RAG. Quatre : l'isolation de l'exécution du code et des outils. Cinq : la gestion de posture, pour trouver les services IA exposés. Six : la détection et la réponse, en envoyant enfin les logs IA au SOC. Concrètement : évaluez vos plateformes, choisissez une plateforme de sécurité IA reliée à une passerelle IA, et testez-la en red team.`,
  notes: `Clics 1 à 6 : chaque fonction s'allume dans le schéma et dans la liste. Clic 7 : les trois actions.
Note source : filtrer ce qui entre et sort en amont, cartographier les flux de données et d'actions, contrôler l'egress, sandbox, puis contractualiser.` },

{ ch: 'c1', type: 'idm', title: 'Break the wall 3/3: identity',
  html: () => {
    const cols = [['Who is the agent?', 'Discovery &amp; registry', 'mature', 'search'], ['On behalf of whom?', 'Delegation', 'emerging', 'user'], ['What can it do?', 'Authorization', 'emerging', 'key'], ['What is its intent?', 'Intent validation', 'early', 'fingerprint'], ['Allow this action now?', 'Runtime enforcement', 'emerging', 'hourglass'], ['What did it do?', 'Audit &amp; governance', 'mature', 'clip']];
    const rows = [['AI / agent governance', ['must', '', 'must', '', '', 'must']], ['AI / agent access', ['', 'must', 'help', 'will', 'must', 'help']], ['AI / agent protect', ['help', '', 'help', 'will', 'must', '']]];
    return `<div class="k">Break the wall 3/3 · Who, what, where, why and how!</div>
  <h2 class="h">Master the <g>agentic identities</g></h2>
  ${btw(3)}
  <div class="idm">
    <div class="idm-g">
      <div></div>${cols.map(([q, t, m, ic]) => `<div class="qh">${ICON(ic)}<em>${q}</em><b>${t}</b><span class="pill ${m}">${m}</span></div>`).join('')}
      ${rows.map(([r, d], ri) => `<div class="rh">${r}</div>${d.map((v, i) => `<div class="cell${i === 5 ? ' last' : ''}">${v ? `<span class="dt ${v}" data-f="1"></span>` : ''}</div>`).join('')}`).join('')}
    </div>
    <div class="legend"${fa(1)}><span><i class="dt must"></i>Must do</span><span><i class="dt help"></i>Helps</span><span><i class="dt will"></i>Will do</span></div>
  </div>
  <div class="steps3"${fa(2)}>
    <div class="step glass"><i>1</i><b>Assess platform capabilities &amp; design patterns</b><span>Map what identity providers, agentic platforms, security gateways and xDR can enforce, then identify gaps and compensating tools</span></div>
    <div class="step glass"><i>2</i><b>Define &amp; promote identity guidelines</b><span>Minimum requirements for every agent: unique identity, human sponsor, delegation, least privilege, short-lived credentials, traceability</span></div>
    <div class="step glass"><i>3</i><b>Run an enforcement POC</b><span>Test on a real agent, end to end: identity → human delegation → scoped access → runtime decision → action-level logging</span></div>
  </div>`; },
  vo: `Troisième pan, le plus difficile : l'identité des agents. Six questions. Qui est l'agent ? Pour le compte de qui agit-il ? Que peut-il faire ? Quelle est son intention ? Faut-il autoriser cette action, maintenant ? Et qu'a-t-il fait ? Le marché est mature sur la découverte et l'audit, émergent sur la délégation, l'autorisation et le contrôle à l'exécution, et encore précoce sur la validation d'intention. Trois actions pour démarrer : évaluer ce que vos briques savent déjà faire, fixer des exigences minimales pour chaque agent, et lancer un POC de bout en bout sur un vrai agent.`,
  notes: `Clics : 1 la matrice (qui doit faire quoi entre gouvernance, accès et protection), 2 les trois actions.
Source : slides 13 et 17 fusionnées (la slide 13 portait par erreur le titre de la 1/3). Commentaire de relecture source : « Enlever lignes + màj la partie du dessous, mettre comme en haut » : appliqué.
Lecture de la matrice : point vert = doit le faire, violet = y contribue, cercle = le fera.` },

{ ch: 'c1', type: 'split', title: 'Other emerging challenges',
  html: () => `<div class="split-ph"><img src="assets/assises/lighthouse.jpg" alt=""><h2 class="h">Securing the AI ecosystem: <g>the other emerging challenges</g> to master</h2></div>
  <div class="split-tx">
    <div class="chev"${fa(1)}><h3>${ICON('buoy')}Mastering resilience</h3><ul><li>Ability to <b>switch / rebuild models</b></li><li><b>Recover datasets</b> and knowledge bases</li><li>Validate <b>integrity</b>, ensuring <b>confidence</b> in AI decisions</li></ul></div>
    <div class="chev"${fa(2)}><h3>${ICON('box')}Mastering open-weight models</h3><ul><li>Assess <b>model security pre-adoption</b></li><li>Validate <b>fine-tuning integrity</b></li><li><b>Monitor modifications</b></li><li><b>Secure the AI supply chain</b>: model security, governance and lifecycle management</li></ul></div>
  </div>`,
  vo: `Deux autres défis émergent. La résilience : être capable de changer ou de reconstruire un modèle, de restaurer des bases de connaissances, et de prouver l'intégrité des décisions de l'IA. Et les modèles open-weight : évaluer leur sécurité avant adoption, vérifier l'intégrité du fine-tuning, surveiller les modifications. Bref, sécuriser toute la chaîne d'approvisionnement de l'IA.`,
  notes: `Clics : résilience, puis modèles open-weight.` },

{ ch: 'c1', type: 'cta', title: 'Discover the benchmark',
  html: () => `<div class="cta glass">
    <div><div class="k">2026 AI Cyber Benchmark</div><h2 class="h l">Discover more of our <b>AI cyber benchmark</b></h2>
    <p>Access the full presentation and contact our experts to know where you stand!</p>
    <div class="qr"><img src="assets/assises/qr-benchmark.png" alt="QR code"><span>Scan to access<br>the full benchmark<br><br>wavestone.com/en</span></div></div>
    <div class="mtn"><img src="assets/assises/mountain.jpg" alt=""></div>
  </div>`,
  vo: `Tous les résultats du benchmark sont accessibles avec ce QR code. Et nos équipes peuvent vous dire où vous vous situez par rapport à vos pairs.`,
  notes: `Laisser le temps de scanner (5 secondes). Peut aussi être remontrée en fin de session.` },

// ─── CHAPTER 2 · CYBER AGAINST AI ────────────────────────────────────
{ ch: 'c2', type: 'chapter', title: 'Chapter 2: Cyber against AI',
  html: () => `${yacht({ up: 2, hoist: true, cur: 2 })}${chrail(2)}
  <div class="band"><small>Chapter 02 · Cyber against AI</small><p>AI does not make every threat new. It challenges the <b>old defensive tempo</b></p></div>`,
  vo: `Deuxième voile : Cyber against AI. Remettre à niveau la ligne de défense. L'IA ne rend pas toutes les menaces nouvelles. Elle remet en cause notre ancien tempo défensif.`,
  notes: `Laisser la voile se hisser.` },

{ ch: 'c2', type: 'waters', title: 'Faster waters',
  html: () => {
    const cs = [
      ['assets/assises/threat-phishing.png', '5x', 'more efficient AI-powered phishing, compared to human-crafted attempts', 'AI-enabled social engineering', 'dn'],
      ['assets/assises/threat-mythos.png', '10,000+', 'vulnerabilities autonomously discovered, chained and exploited in one month', 'Mythos', 'up'],
      ['assets/assises/threat-ransomware.png', '&lt; 30 min', 'to deploy adaptive ransomware end to end, testing dozens of attack paths in minutes', 'JadePuffer', 'dn'],
      ['assets/assises/threat-swarm.png', '700', 'self-organizing agents executing a 5-phase covert attack, breaching 3 organizations', 'Hugging Face / OpenAI', 'up'],
      ['assets/assises/threat-gov.png', '1 agent', 'breached government files, bypassing existing access controls', 'Australian Government / OpenAI', 'dn'],
    ];
    return `${photo('assets/assises/sea-top.jpg', 'deep')}
  <div class="k">Cyber against AI</div>
  <h2 class="h">The threat has entered <g>faster waters</g>…</h2>
  <div class="cur-w"><div class="cur-line"></div>
    ${cs.map(([ic, v, t, s, d], i) => `<div class="case ${d}" style="--x:${12 + i * 19}%"${fa(i + 1)}><div class="orb"><img src="${ic}" alt=""></div><div class="crd glass"><b>${v}</b><p>${t}</p><small>${s}</small></div></div>`).join('')}
  </div>
  <div class="real"${fa(6)} style="top:4.6rem;bottom:auto"><p>And AI will be in<br>the <b>real world</b>…</p><img src="assets/assises/robot.png" alt=""></div>
  <p class="catch" style="position:relative;bottom:auto;margin:0"${fa(7)}>Defenders need to <b>catch up!</b></p>`; },
  vo: `La menace est entrée dans des eaux plus rapides. Le phishing généré par IA est cinq fois plus efficace que celui écrit par un humain. Mythos : plus de dix mille vulnérabilités découvertes, chaînées et exploitées en un mois, de façon autonome. JadePuffer : moins de trente minutes pour déployer un rançongiciel adaptatif. Sept cents agents qui s'auto-organisent pour une attaque en cinq phases, trois organisations touchées. Un agent qui accède à des fichiers gouvernementaux en contournant les contrôles d'accès. Et demain, l'IA sera dans le monde physique. Les défenseurs doivent rattraper leur retard.`,
  notes: `Clics : un cas par clic (5), puis le robot, puis la conclusion.
Note de relecture source : « rajouter un encadré pour mettre en avant les exemples et merger les deux infos par événement » : appliqué (chiffre + fait + nom du cas dans une même carte).
Sources : voir la session « Out of the Sandbox » (ai-talk.html) pour Hugging Face / OpenAI et l'Australie.` },

{ ch: 'c2', type: 'fund', title: 'It changed the speed',
  html: () => `${photo('assets/assises/wave.jpg', 'left', '70% 50%')}
  <div class="fund"><h2 class="h">AI did not change the fundamentals…</h2>
    <div class="fl2"${fa(1)}>
      <div><i>${ICON('shield')}</i><p><b>Zero trust</b> remains the right model</p></div>
      <div><i>${ICON('gear')}</i><p>Proven <b>security approaches</b> still apply</p></div>
    </div></div>
  <p class="speed"${fa(2)}><span>›</span>… it changed the <b>speed</b></p>`,
  vo: `Soyons clairs : l'IA n'a pas changé les fondamentaux. Le zero trust reste le bon modèle. Les approches de sécurité éprouvées s'appliquent toujours. Ce qui a changé, c'est la vitesse.`,
  notes: `Clics : les deux fondamentaux, puis « the speed ». Marquer un temps avant le dernier clic.` },

{ ch: 'c2', type: 'baseline', title: 'A new defensive baseline',
  html: () => {
    const C = [
      ['radar', 'Detect', '&lt; 24h', 'to <b>detect and assign</b> every new Internet-facing asset', ['Continuous external <b>attack-surface scanning</b>', '<b>Automatic reconciliation</b> with the CMDB', 'Owner and criticality assigned within 24h']],
      ['ban', 'Contain', '&lt; 3h', 'to <b>contain a critical exposure</b> without business validation', ['Pre-approved isolation scenarios', 'Cyber <b>emergency authority</b>', 'Network and application <b>kill-switches tested quarterly</b>']],
      ['tool', 'Remediate', '&lt; 24h', 'to <b>patch or keep protected</b> any exploited exposed asset', ['Exposure-first remediation queue', '<b>24/7</b> Cyber, IT and application-owner task force', 'Three predefined options: <b>patch, virtual patch or isolate</b>']],
      ['refresh', 'Rebuild', '&lt; 2 days', 'to <b>rebuild any critical system</b> from a trusted baseline', ['Hardened golden images', 'Infrastructure and configuration as code', '<b>Quarterly real-life rebuild test</b>']],
      ['down', 'Reduce', '&lt; 5%', 'of <b>obsolete critical assets</b>, and kept there', ['<b>Inventory infrastructure</b>, installed software and application libraries', 'Named owner and exit date for every exception', '<b>Monthly backlog</b> reduction reviewed at executive level']],
    ];
    return `<div class="k">Cyber against AI</div>
  <h2 class="h" style="max-width:none"><g>A new defensive baseline</g>, with the authority to act without waiting for business approval</h2>
  <div class="bl">${C.map(([ic, n, t, s, l], i) => `<div class="blc"${fa(i + 1)}><h4>${ICON(ic)}${n}</h4><div class="tg">${t}</div><div class="ts">${s}</div><ul>${l.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>
  <p class="bl-end"${fa(6)}>Technical projects to speed things up, but only <b>with IT and cyber governance, and the budget</b> to sustain efforts</p>`; },
  vo: `Il faut donc une nouvelle ligne de base défensive, avec l'autorité d'agir sans attendre la validation des métiers. Détecter en moins de 24 heures tout nouvel actif exposé. Contenir une exposition critique en moins de trois heures, sans validation métier. Corriger ou protéger en moins de 24 heures tout actif exposé exploité. Reconstruire tout système critique en moins de deux jours. Et réduire l'obsolescence critique sous les 5 %. Des projets techniques, oui, mais uniquement avec une gouvernance IT et cyber, et le budget pour tenir dans la durée.`,
  notes: `Clics : Detect, Contain, Remediate, Rebuild, Reduce, puis la condition de gouvernance.
Message clé pour les RSSI : l'autorité d'agir (kill-switch, isolation pré-approuvée) se négocie avant la crise, pas pendant.` },

{ ch: 'c2', type: 'vulnops', title: 'Deep dive: vulnerability operations',
  html: () => {
    const L = [['globe', 'Edge / Internet', 'WAF, CDN, reverse proxy, API gateway'], ['share', 'Network', 'Firewall rules, IPS, NDR, micro-segmentation'], ['cpu', 'Endpoint / workload', 'EDR, XDR, application control'], ['zap', 'Runtime / application', 'RASP, feature flags, configuration changes'], ['cloud', 'Cloud / containers', 'Network policies, CNAPP, admission controllers, service mesh'], ['layers', 'Virtualization', 'VM isolation, NSX policies, hypervisor controls'], ['key', 'Identity &amp; access', 'Conditional access, PAM, MFA enforcement, privilege restrictions'], ['eye', 'Detection &amp; response', 'SIEM, SOAR, threat hunting, automated containment']];
    return `<div class="head-row"><div><div class="k">Cyber against AI · Remediate</div><h2 class="h">Using <g>Vulnerability Operations</g> to ensure patching</h2></div>${dd()}</div>
  <div class="vo">
    <div class="vo-c"><div class="vo-h glass"><b>Identify the patching that needs to be done</b><span>Assess the vulnerability risk</span></div><div class="vo-img"><img src="assets/assises/vulnops.jpg" alt="Vulnerability decision tree: on the KEV? automatable? technical impact, then SLA"></div></div>
    <div class="amp">&amp;</div>
    <div class="vo-c"${fa(1)}><div class="vo-h glass"><b>Identify the tools that will allow you to do it</b><span>Virtual patching control stack</span></div>
      <div class="vps glass"><table><tr><th>Layer</th><th>Typical controls</th></tr>${L.map(([ic, a, b]) => `<tr><td>${ICON(ic)}${a}</td><td>${b}</td></tr>`).join('')}</table></div></div>
  </div>`; },
  vo: `Un zoom sur la remédiation. D'abord, savoir quoi corriger et en combien de temps : la vulnérabilité est-elle dans le catalogue KEV, est-elle automatisable, quel est son impact technique ? On en déduit un délai, de trois jours avec analyse forensique jusqu'à la prochaine montée de version. Ensuite, savoir avec quoi protéger en attendant le correctif : le patch virtuel, couche par couche, du WAF jusqu'au SOAR.`,
  notes: `Clic : la pile de patch virtuel.
KEV : Known Exploited Vulnerabilities (catalogue CISA).` },

{ ch: 'c2', type: 'tempos', title: 'Three tempos',
  html: () => {
    const T = [['', 20, 'Trying to keep up', 'Create remediation task forces', ['<b>Regain control of the obsolescence program</b>: decommission unsupported or legacy software versions and close all MFA gaps', '<b>Rework patch industrialization</b> to meet SLAs on internet-facing systems', '<b>Clear the backlogs</b>: close critical exploitable gaps and re-assess underperforming tools (e.g. CMDB / EDR refresh)']],
      ['mid', 40, 'Building the new base', 'Run a transformation program', ['<b>Agentify and automate</b> cyber operations', '<b>Rethink platforms and processes</b>, including patch management practices', '<b>Deploy</b> new tools, <b>refresh</b> legacy ones, and <b>introduce</b> deceptive security']],
      ['top', 5, 'Ready to accelerate', 'Industrialize actions', ['<b>Operate cyber as a modern IT function</b>: infrastructure as code, CI/CD, SDLC', 'Operate a <b>transformed RUN</b>', 'Look for <b>AI accelerators</b>']]];
    return `<div class="k">Market view</div>
  <h2 class="h">Three tempos in the race to accelerate</h2>
  <p class="sub" style="color:var(--green)">Investment is heavy, but market visions are still very uneven…</p>
  <div class="tp">${T.map(([c, v, h, h5, l], i) => `<div class="tpc glass ${c}"${fa(i + 1)}><div class="ring" style="--d:${(v / 100 * 302).toFixed(1)}"><svg viewBox="0 0 110 110"><circle class="bgc" cx="55" cy="55" r="48"/><circle class="fg" cx="55" cy="55" r="48"/></svg><b>${cnt(v)}<small>%</small></b></div><h4>${h}</h4><h5>${h5}</h5><ul>${l.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>
  <p class="endband"${fa(4)}>Identified actions require organizations to <b>move at AI speed</b>…</p>`; },
  vo: `Où en est le marché ? Trois tempos. Environ 20 % essaient de suivre : ils montent des task forces de remédiation, reprennent l'obsolescence, vident les backlogs. 40 % construisent la nouvelle base, avec un vrai programme de transformation. Et seulement 5 % sont prêts à accélérer : ils opèrent la cyber comme une fonction IT moderne, en tant que code. Les actions sont connues. Ce qui manque, c'est la vitesse.`,
  notes: `Clics : les trois tempos, puis la conclusion.
Les pourcentages ne totalisent pas 100 % : le reste du marché n'a pas encore engagé de démarche structurée (à confirmer avant la session).` },

// ─── CHAPTER 3 · CYBER WITH AI ───────────────────────────────────────
{ ch: 'c3', type: 'chapter', title: 'Chapter 3: Cyber with AI',
  html: () => `${yacht({ up: 3, hoist: true, cur: 3 })}${chrail(3)}
  <div class="band"><small>Chapter 03 · Cyber with AI · three levels</small><p>Human does, AI assists <b>›</b> Human-agent teams <b>›</b> <b>Human-led, agent-operated</b></p></div>`,
  vo: `Troisième voile : Cyber with AI. Défendre à la vitesse machine. Et on y va en trois niveaux : l'IA qui assiste, les équipes humains-agents, puis une cyber pilotée par l'humain et opérée par des agents.`,
  notes: `Laisser la troisième voile se hisser.` },

{ ch: 'c3', type: 'level', title: 'Level 1: AI acculturation',
  html: () => {
    const T = [['award', 'GRC', [['TPRM', 'questionnaire review'], ['Awareness', 'video and text generation']]],
      ['lock', 'Sec by design', [['Secure-by-Design', 'architecture reviewer', 'ROI: 30% time saved'], ['Risk analysis', '']]],
      ['cloud', 'Infra sec', [['Firewall rules', 'review']]],
      ['user', 'IAM', [['Role mining', 'reviews', 'ROI: 50-80% time saved'], ['Application onboarding', 'analyzer']]],
      ['search', 'Defense', [['Automated SOC L1', 'alert triage', 'ROI: 6 → 1 FTE + agents'], ['Redteam acceleration', '&amp; report', 'ROI: ≈ 5h saved / pentest']]],
      ['buoy', 'Resilience', [['Cyber crisis', 'stimuli generation']]]];
    return `${lvhead(1, 'AI acculturation: the TOP 10', 'Human does, AI assists', 20)}
  <p class="lede"><b>Use cases land in every CISO team.</b> Mostly built locally, they help teams <g>perform existing tasks faster and better</g>, while quickly <g>proving value</g>.</p>
  <div class="org"><div class="ciso"><div><b>CISO</b>Chief Information Security Officer</div></div><div class="tree"></div>
    <div class="teams">${T.map(([ic, t, u]) => `<div class="team"><h4><i>${ICON(ic)}</i>${t}</h4>${u.map(([a, b, r]) => `<div class="uc"${fa(1)}><b>${a}</b>${b}</div>${r ? `<div class="roi"${fa(2)}>${r}</div>` : ''}`).join('')}</div>`).join('')}</div></div>`; },
  vo: `Niveau un : l'acculturation. L'humain fait, l'IA assiste, à peu près 20 % d'IA. Les cas d'usage arrivent dans toutes les équipes du RSSI, souvent construits localement. Le top 10 : revue de questionnaires tiers, sensibilisation, revue d'architecture, analyse de risques, revue de règles firewall, revue de rôles, onboarding applicatif, tri des alertes de niveau 1 au SOC, accélération du red team, stimuli de crise. Et les gains sont mesurables : 30 % de temps gagné en revue d'architecture, 50 à 80 % sur les revues de rôles, de six ETP à un plus des agents sur le tri SOC.`,
  notes: `Clics : 1 les dix cas d'usage, 2 les ROI mesurés.
Points ouverts dans la source (non affichés) : ROI de TPRM, Awareness, Risk analysis et Firewall rules review (« ? ») ; « Relancer Nicolas » (Application onboarding analyzer) ; « Hugo » (crise).
Note source INFRA SEC : agents de détection de vulnérabilité, validation de l'exploitation, proposition et validation du correctif ; questions sur l'état de configuration cloud ; traduction schémas cloud ↔ Terraform ; analyse de logs pour comprendre des incidents ; chatbot en front des outils d'orchestration ; documentation automatique.` },

{ ch: 'c3', type: 'funnel', title: 'Deep dive: the right use cases',
  html: () => `<div class="head-row"><div><div class="k">Cyber with AI · Level 1</div><h2 class="h">How to identify the <g>right use cases</g>?</h2></div>${dd('Deep dive · a 3-month engagement')}</div>
  <div class="fn">
    <div class="fn-l">
      <div class="fn-in"><div>${ICON('list')}Existing or already identified use cases</div><div>${ICON('chart')}Wavestone use case catalog + market feedback</div></div>
      <div class="fn-ph"><img src="assets/assises/funnel.jpg" alt="">
        <div class="ph" style="top:26%"${fa(2)}><b>IDEATION PHASE</b><span>Challenge value &amp; realism</span></div>
        <div class="ph" style="top:50%"${fa(3)}><b>FIRST IMPLEMENTATION</b><span>To validate the concept</span></div>
        <div class="ph" style="top:72%"${fa(4)}><b>ROADMAP</b><span>Make or buy, make-to-buy, and change</span></div></div>
    </div>
    <div class="fn-r">
      <div class="fs glass"${fa(1)}><i>${ICON('search')}</i><div><small>Start</small><b>Identify <em>two drivers</em></b><span>New value-adding activities, or pain-point fixes</span></div></div>
      <div class="fs glass"${fa(2)}><i>${ICON('target')}</i><div><small>Ideation</small><b>Assess <em>realism</em> immediately</b><span>Workshops with an AI maker: value × complexity</span></div></div>
      <div class="fs glass"${fa(3)}><i>${ICON('gear')}</i><div><small>First implementation</small><b>Build <em>first demonstrators</em></b><span>Prompting and no-code, ROI measured from day one</span></div></div>
      <div class="fs glass"${fa(4)}><i>${ICON('send')}</i><div><small>Roadmap</small><b><em>Scale</em> to full application</b><span>Build or buy, with training and change management</span></div></div>
    </div>
  </div>`,
  vo: `Comment trouver les bons cas d'usage ? En trois mois. On part de deux moteurs : de nouvelles activités à valeur, ou la correction de points de douleur. On confronte immédiatement chaque idée à sa faisabilité, avec un « AI maker » dans la pièce : valeur fois complexité. On construit des démonstrateurs rapides, en prompt et en no-code, en mesurant le ROI dès le premier jour. Puis on passe à l'échelle, en faisant ou en achetant, avec formation et conduite du changement.`,
  notes: `Clics : les quatre étapes, l'entonnoir s'éclaire en parallèle.
Valeur : bénéfices directs / nouvelles capacités, coûts et efficacité, bénéfices indirects (image, culture d'innovation), aide à la décision.
Complexité : données (existence, accès, qualité), technologie (maturité), projet (coûts, compétences), impact organisationnel et risques (confiance, cyber, RH, conformité, réputation).
Matrice : forte valeur / faible complexité → quick wins ; forte / forte → initiatives stratégiques ; faible / faible → test & learn ; faible / forte → abandonner ou reclasser.
« Don't ask teams to adopt AI. Give them the foundations to solve their problems with it. »` },

{ ch: 'c3', type: 'level', title: 'Level 2: platform renewal',
  html: () => {
    const T = [['award', 'GRC', [['AI-native GRC', 'Continuous controls, compliance, TPRM and vendor risk', 'UK Bank']]],
      ['lock', 'Sec by design', [['App security', 'App security posture management, code &amp; pipeline security', 'EU manufacturing']]],
      ['cloud', 'Infra sec', [['Data security', 'DLP, DSPM, classification, data risk', 'US Insurance']]],
      ['user', 'IAM', [['IGA / PAM', 'IGA, PAM, machine &amp; agent identities, access governance']]],
      ['search', 'Defense', [['AI SOC', 'Detect, investigation, response, threat hunting', 'Global Manuf.'], ['AI pentest', 'Continuous exposure discovery, validation &amp; remediation', 'Global Insurance']]],
      ['buoy', 'Resilience', [['Business continuity', 'Dependencies, impact analysis, recovery orchestration']]]];
    return `${lvhead(2, 'Platform renewal, one step at a time', 'Human-agent teams', 50)}
  <p class="lede"><b>AI adoption accelerates as platform renewal unlocks cyber ROI at scale.</b> Integrated platforms enable automated <g>context sharing</g>, <g>faster insights</g>, <g>consistent policies</g> and <g>cross-function action</g>.</p>
  <div class="org"><div class="ciso"><div><b>CISO</b>Chief Information Security Officer</div><span class="dash"></span><div class="office" data-hl="2">Data &amp; AI Office</div></div><div class="tree"></div>
    <div class="teams">${T.map(([ic, t, u]) => `<div class="team"><h4><i>${ICON(ic)}</i>${t}</h4>${u.map(([a, b, r]) => `<div class="uc"${fa(1)}><b>${a}</b>${b}${r ? `<span class="ref">${r}</span>` : ''}</div>`).join('')}</div>`).join('')}</div></div>
  <p class="callout glass"${fa(2)}>Scaling AI across cyber requires a common approach: <b>create a Cyber Data &amp; AI Office</b></p>`; },
  vo: `Niveau deux : le renouvellement des plateformes, une plateforme à la fois. Des équipes mixtes humains-agents, autour de 50 % d'IA. C'est ce qui se passe aujourd'hui chez nos clients : les grandes plateformes créent des ponts automatiques, partage de contexte, analyses plus rapides, politiques cohérentes, actions transverses. GRC native IA dans une banque britannique, sécurité applicative chez un industriel européen, sécurité des données chez un assureur américain, SOC IA, pentest IA. Et pour passer à l'échelle, une condition : créer un Cyber Data & AI Office.`,
  notes: `Clics : 1 les plateformes et leurs références clients, 2 le Data & AI Office.
Note source : « Here are some ideas and examples of platforms that we have developed… »` },

{ ch: 'c3', type: 'duo', title: 'Deep dive: two approaches',
  html: () => `<div class="diag"></div>${photo('assets/assises/sea-top.jpg', 'deep')}
  <div class="head-row"><div><div class="k">Level 2 · Platform renewal</div><h2 class="h">Two approaches, <g>one objective</g></h2></div>${dd()}</div>
  <div class="duo">
    <div class="dc glass"${fa(1)}><h3>Enterprise data protection at scale</h3><small>Insurance experience</small>
      <div class="figs"><div><b>${cnt(1500)}</b><span>applications in the data ecosystem</span></div><div><b>${cnt(65000)}</b><span>collaboration sites</span></div><div><b>${cnt(50000)}</b><span>file shares</span></div><div><b>${cnt(40)} PB</b><span>of data, structured and unstructured</span></div></div>
      <div class="how"><small>How?</small><div class="chain"><span>Unify governance, processes &amp; technology</span><i>›</i><span>Strengthen data visibility &amp; control</span><i>›</i><span>Remediate risk at scale</span></div></div></div>
    <div class="dc glass"${fa(2)}><h3>AI-first CISO operating model</h3><small>Automotive experience</small>
      <div class="figs"><div><b>${cnt(21)}-month</b><span>program</span></div><div><b>€${cnt(3.6, 1)}M</b><span>investment</span></div><div><b>${cnt(10)} FTEs</b><span>mobilized</span></div><div><b>${cnt(40)}</b><span>AI workflows targeted by end-2026</span></div></div>
      <div class="how"><small>How?</small><div class="chain"><span>Embed AI by design</span><i>›</i><span>Unify platform</span><i>›</i><span>Upskill teams</span><i>›</i><span>Align staffing, ownership &amp; partners</span></div></div></div>
  </div>`,
  vo: `Deux exemples concrets. Un assureur, qui protège ses données à grande échelle : mille cinq cents applications, soixante-cinq mille sites collaboratifs, cinquante mille partages de fichiers, quarante pétaoctets. Et un constructeur automobile, qui bâtit un modèle opérationnel RSSI « AI-first » : vingt-et-un mois, 3,6 millions d'euros, dix ETP, quarante workflows IA visés d'ici fin 2026. Deux approches, un même objectif.`,
  notes: `Clics : l'assureur, puis l'automobile.
Valeurs encore à confirmer dans la source, retirées de l'écran : durée et budget du programme assurance (« XX-year », « $XXX »), « 50 AI agents deployed in the SOC », « XX tools consolidated ».
Référence publique assurance : wavestone.com/en/clients-story/data-protection-insurance/` },

{ ch: 'c3', type: 'l3', title: 'Level 3: machine speed',
  html: () => {
    const src = ['SOC / EDR', 'CTI / Vuln.', 'Assets / Configs', 'GRC / TPRM / Risks', '…'];
    const act = ['EDR / NDR / FW', 'Patching &amp; config.', 'Access rights / DLP', '…'];
    const ag = [[455, 120], [535, 120], [615, 120], [455, 205], [535, 205], [615, 205]];
    return `${lvhead(3, 'Cyber at machine speed', 'Human-led, agent-operated', 80)}
  <p class="lede">To operate at machine speed, cyber needs a <g>unified data foundation</g> for agentic operations.</p>
  <div class="l3">
    <div class="l3s">
      <div class="glass"${fa(1)}><i>1</i><b>Build your <em>Cyber Data Lake</em></b><ul><li>Turn fragmented, slow-moving cyber data into real-time context</li><li>Collect, enrich and normalize data through APIs</li></ul></div>
      <div class="glass"${fa(2)}><i>2</i><b>Use an <em>agentic AI platform</em></b><ul><li>Built on existing processes and control models</li><li>Delegate actions with the appropriate level of human oversight</li></ul></div>
    </div>
    <svg class="flow" viewBox="0 0 900 330">
      <defs><linearGradient id="lk" x1="0" x2="1"><stop offset="0" stop-color="#5FD4DA" stop-opacity=".2"/><stop offset="1" stop-color="#5FD4DA" stop-opacity=".9"/></linearGradient>
      <radialGradient id="lakeg"><stop offset="0" stop-color="#7AB8FF" stop-opacity=".55"/><stop offset="1" stop-color="#3A6BD8" stop-opacity=".25"/></radialGradient></defs>
      <rect x="250" y="20" width="420" height="290" rx="34" fill="rgba(122,92,255,.12)" stroke="rgba(182,166,255,.55)"/>
      <text x="470" y="55" text-anchor="middle" font-weight="800" font-size="19" fill="#04F06A" letter-spacing="1">AGENTIC AI PLATFORM</text>
      ${src.map((s, i) => `<g${fa(1)}><rect x="0" y="${62 + i * 44}" width="150" height="36" rx="6" fill="rgba(95,212,218,${.28 - i * .04})" stroke="rgba(95,212,218,.5)"/><text x="12" y="${85 + i * 44}" font-size="13" font-weight="600">${s}</text><path d="M150 ${80 + i * 44} C 200 ${80 + i * 44}, 210 170, 262 170" stroke="url(#lk)" stroke-width="2" fill="none"/></g>`).join('')}
      <text class="lbl" x="205" y="250" text-anchor="middle">APIs</text>
      <g${fa(1)}><ellipse cx="320" cy="170" rx="58" ry="96" fill="url(#lakeg)" stroke="rgba(160,200,255,.7)"/><text x="320" y="156" text-anchor="middle" font-weight="700" font-size="16">Cyber</text><text x="320" y="176" text-anchor="middle" font-weight="700" font-size="16">Data</text><text x="320" y="196" text-anchor="middle" font-weight="700" font-size="16">Lake</text></g>
      <g${fa(2)}>${ag.map(([x, y], i) => `<g transform="translate(${x} ${y})"><circle r="27" fill="#1A0E44" stroke="${i === 4 ? '#04F06A' : 'rgba(182,166,255,.7)'}" stroke-width="2.5" stroke-dasharray="5 3"><animateTransform attributeName="transform" type="rotate" from="0" to="${i % 2 ? -360 : 360}" dur="${8 + i}s" repeatCount="indefinite"/></circle><g transform="translate(-11 -11) scale(.92)" stroke="${i === 4 ? '#04F06A' : '#B6A6FF'}" fill="none" stroke-width="1.7" stroke-linecap="round">${ICONS.robot}</g></g>`).join('')}
        <text x="535" y="275" text-anchor="middle" font-weight="700" font-size="15">Cyber agents</text>
        ${act.map((s, i) => `<g><path d="M672 170 C 720 170, 715 ${80 + i * 50}, 752 ${80 + i * 50}" stroke="rgba(4,240,106,.7)" stroke-width="2" fill="none"/><rect x="752" y="${62 + i * 50}" width="148" height="36" rx="6" fill="rgba(4,240,106,${.22 - i * .04})" stroke="rgba(4,240,106,.5)"/><text x="764" y="${85 + i * 50}" font-size="13" font-weight="600">${s}</text></g>`).join('')}
        <text class="lbl" x="712" y="285" text-anchor="middle">MCP &amp; APIs</text></g>
      ${[0, 1, 2, 3].map(i => `<circle class="pt" r="3.5"><animateMotion dur="${2.4 + i * .5}s" begin="${i * .6}s" repeatCount="indefinite" path="M150 ${80 + i * 44} C 200 ${80 + i * 44}, 210 170, 262 170 L 380 170"/></circle>`).join('')}
      ${[0, 1, 2].map(i => `<circle class="pt" r="3.5"${fa(2)}><animateMotion dur="${2.2 + i * .4}s" begin="${i * .7}s" repeatCount="indefinite" path="M650 170 L672 170 C 720 170, 715 ${80 + i * 50}, 752 ${80 + i * 50} L 800 ${80 + i * 50}"/></circle>`).join('')}
    </svg>
  </div>
  <div class="dp"${fa(3)}><div class="def"><b>DEFENSIVE</b><span>React to incidents, team by team</span></div><div class="arr"></div><div class="pro"><b>PROACTIVE</b><span>Anticipate drift in real time, act across teams</span></div></div>`; },
  vo: `Niveau trois : la cyber à la vitesse machine. Pilotée par l'humain, opérée par les agents, 80 % d'IA. Pour y arriver, il faut une fondation de données unifiée. D'abord un Cyber Data Lake, qui transforme des données cyber fragmentées et lentes en contexte temps réel, collectées et normalisées par API. Ensuite une plateforme d'IA agentique, construite sur vos processus et vos modèles de contrôle existants, qui agit sur vos outils avec le bon niveau de supervision humaine. On passe d'une posture défensive, équipe par équipe, à une posture proactive, qui anticipe les dérives en temps réel.`,
  notes: `Clics : 1 le data lake, 2 la plateforme agentique et ses actions, 3 défensif → proactif.
Texte source « Use the big to create your CYBER DATA LAKE » reformulé en « Build your Cyber Data Lake ».` },

{ ch: 'c3', type: 'graph', title: 'Level 3: golden rules & cyber graph',
  html: () => {
    const N = [['Assets', 70, 120], ['Identities', 210, 60], ['Vulnerabilities', 360, 130], ['Controls', 500, 60], ['Third parties', 640, 130], ['Data', 790, 60], ['Business processes', 930, 120]];
    const E = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [1, 5], [0, 3]];
    const AG = [['award', 'GRC agent'], ['lock', 'Sec-by-design agent'], ['cloud', 'Infra sec agent'], ['user', 'IAM agent'], ['search', 'Cyber defense agent'], ['buoy', 'Resilience agent']];
    return `${lvhead(3, 'Cyber at machine speed', 'Human-led, agent-operated', 80)}
  <p class="lede">Switch from a defensive to a proactive security position, in real time, using the following <b>golden rules</b> &amp; <b>cyber graph</b>.</p>
  <div class="gr"${fa(1)}>
    <div class="glass">${ICON('target')}<b>Set decision rights</b><span>Risk appetite set by the business, escalation thresholds</span></div>
    <div class="glass">${ICON('shield')}<b>Govern agents</b><span>Identity, rights, traceability and audit of every agent</span></div>
    <div class="glass">${ICON('users')}<b>Embed experts</b><span>Cyber experts inside business, IT and OT teams</span></div>
  </div>
  <div class="agents6"${fa(2)}>${AG.map(([ic, t]) => `<div>${ICON(ic)}${t}</div>`).join('')}</div>
  <div class="cg"${fa(3)}><small><b>Cyber graph (OT / IT)</b> | Data lake + graph · OT stays human-in-the-loop</small>
    <div class="cg-in"><svg viewBox="0 0 100 100" preserveAspectRatio="none">
      ${E.map(([a, b], i) => `<line x1="${N[a][1] / 10}" y1="${N[a][2] / 1.9}" x2="${N[b][1] / 10}" y2="${N[b][2] / 1.9}" class="${i % 3 === 0 ? 'hot' : ''}" vector-effect="non-scaling-stroke"/>`).join('')}
    </svg>${N.map(([t, x, y]) => `<span class="gn" style="left:${x / 10}%;top:${y / 1.9}%">${t}</span>`).join('')}</div></div>
  <div class="dp"${fa(4)} style="margin-top:.8rem"><div class="def"><b>DEFENSIVE</b><span>React to incidents, team by team</span></div><div class="arr"></div><div class="pro"><b>PROACTIVE</b><span>Anticipate drift in real time, act across teams</span></div></div>`; },
  vo: `Concrètement, trois règles d'or. Des droits de décision fixés par les métiers : l'appétence au risque et les seuils d'escalade. Des agents gouvernés : identité, droits, traçabilité, audit. Et des experts cyber intégrés dans les équipes métier, IT et OT. Chaque équipe du RSSI a son agent, et tous s'appuient sur un même graphe cyber, IT et OT : actifs, identités, vulnérabilités, contrôles, tiers, données, processus métier. Côté OT, l'humain reste dans la boucle.`,
  notes: `Clics : 1 règles d'or, 2 agents, 3 graphe cyber, 4 défensif → proactif.
Slide marquée « IN THE WORKS » dans la source : contenu à valider.` },

{ ch: 'c3', type: 'trust', title: 'Trust & TokenOps',
  html: () => `<div class="k">Cyber with AI · Run it for real</div>
  <h2 class="h">Trust &amp; TokenOps: keep agents <g>observable, trusted and affordable</g></h2>
  <div class="tk">
    <div class="loop"${fa(1)}><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44"/></svg>
      <div class="lp" style="left:50%;top:0%"><b>Build</b><span>Continuously adapt agents and data</span></div>
      <div class="lp" style="left:96%;top:76%"><b>Run</b><span>Experts in the loop</span></div>
      <div class="lp" style="left:4%;top:76%"><b>Check</b><span>Independent check of trust, efficiency and costs</span></div>
      <div class="core">Cyber Data<br>&amp; AI Office</div></div>
    <div class="pill3">
      <div class="pl glass"${fa(2)}>${ICON('eye')}<h4><b>Observe</b> performance</h4><p>Know what agents do and how well they perform</p><ul><li>Quality and evaluation</li><li>Reliability and observability</li><li>Decision traceability</li></ul></div>
      <div class="pl glass"${fa(3)}>${ICON('shield')}<h4>Preserve <b>trust</b></h4><p>Keep humans accountable for delegated actions</p><ul><li>Human oversight</li><li>Ownership and accountability</li></ul></div>
      <div class="pl glass"${fa(4)}>${ICON('dollar')}<h4>Control <b>cost</b> over time</h4><p>Keep the platform sustainable as usage scales</p><ul><li>Cost management</li><li>Maintenance lifecycle</li><li>Change and model governance</li></ul></div>
    </div>
  </div>`,
  vo: `Et une fois en production, il faut tenir dans la durée. Un cycle : construire en continu, opérer avec des experts dans la boucle, et vérifier de façon indépendante la confiance, l'efficacité et les coûts. Trois piliers : observer la performance des agents, préserver la confiance avec un humain responsable de chaque action déléguée, et maîtriser les coûts, les fameux tokens, à mesure que l'usage monte.`,
  notes: `Clics : le cycle Build / Run / Check, puis les trois piliers.
Slide marquée « IN THE WORKS » dans la source ; le cycle reprend la « Good version » notée par les relecteurs.
Note source : dans l'industrie, deux agents par personne, un qui aide, un qui collecte la connaissance et la partage. Transversalisation : catalogue ServiceNow et agents.` },

// ─── CHAPTER 4 · THE CREW ────────────────────────────────────────────
{ ch: 'c4', type: 'chapter', title: 'Chapter 4: Transform your organization',
  html: () => `${yacht({ up: 3, cur: 0 })}${chrail(4)}
  <div class="band"><small>Chapter 04 · The crew</small><p>› Go beyond technical changes: <b>transform your organization</b></p></div>`,
  vo: `Trois voiles hissées. Mais un voilier ne va nulle part sans équipage. Dernier chapitre : aller au-delà de la technique, et transformer l'organisation.`,
  notes: `Les trois voiles sont en place : pas d'animation, on change de registre.` },

{ ch: 'c4', type: 'crew', title: 'Bet on your teams',
  html: () => `${photo('assets/assises/sea-top.jpg', 'left', '75% 50%')}
  <div class="k">The crew</div>
  <h2 class="h"><g>Bet on your teams!</g></h2>
  <p class="sub" style="font-style:italic">Empower the crew to navigate the transformation</p>
  <div class="crew">
    <div class="cr-rows">
      <div class="cr"${fa(1)}><i>${ICON('compass')}</i><div><h4>SET THE AMBITION<span>Choose where AI should genuinely transform the model</span></h4><ul><li>Identify the <b>workflows</b> where speed or outcomes must change radically</li><li>Define the <b>target</b> level of transformation</li><li>Align <b>Cyber, IT and business leadership</b> on the ambition</li></ul></div></div>
      <div class="cr"${fa(2)}><i><img src="assets/assises/lighthouse-icon.png" alt=""></i><div><h4>BUILD A LIGHTHOUSE<span>Use one workflow to demonstrate the new model</span></h4><ul><li>Select an <b>end-to-end workflow</b> with visible operational value</li><li><b>Redesign the workflow</b>, rather than automating isolated tasks</li><li>Use the first results to <b>prepare the next transformations</b></li></ul></div></div>
      <div class="cr"${fa(3)}><i>${ICON('helm')}</i><div><h4>REORGANIZE THE FLEET<span>Break silos to scale the transformation</span></h4><ul><li>Bring together <b>Cyber, IT, Data, AI and operational teams</b></li><li>Clear ownership: <b>one executive sponsor</b> and <b>one transformation lead</b></li><li>Give the team <b>clear decision rights and authority to act</b></li><li><b>Redesign roles and responsibilities</b> as AI reshapes how work gets done</li></ul></div></div>
    </div>
    <div class="oc"><svg viewBox="0 0 30 300" preserveAspectRatio="none"><path d="M20 30 C 0 90, 30 140, 10 160 S 0 240, 20 270"/></svg>
      <div class="glass"${fa(1)}>A focused transformation <b>ambition</b></div>
      <div class="glass"${fa(2)}>A <b>lighthouse transformation</b> that creates momentum</div>
      <div class="glass"${fa(3)}>A <b>transversal team</b> with authority to act</div>
    </div>
  </div>
  <p class="expand"${fa(4)}>Start focused, demonstrate the shift, then <b>EXPAND</b></p>`,
  vo: `Pariez sur vos équipes. Fixez le cap : où l'IA doit-elle vraiment transformer le modèle, et à quel niveau ? Allumez un phare : un workflow de bout en bout, à valeur visible, que l'on repense au lieu d'automatiser des tâches isolées. Puis réorganisez la flotte : cyber, IT, data, IA et opérations ensemble, un sponsor exécutif, un responsable de la transformation, et une vraie autorité pour agir. Commencez petit, démontrez, puis étendez.`,
  notes: `Clics : les trois rangées (chaque résultat apparaît à droite), puis la conclusion.
Slide marquée « IN THE WORKS » dans la source.` },

{ ch: 'c4', type: 'human', title: 'Lead the human shift',
  html: () => {
    const C = [['refresh', 'Managing change', ['<b>Show the way:</b> leaders use AI in their own daily work first', '<b>Say early</b> which tasks move to agents and which roles grow']],
      ['book', 'Training', ['<b>AI security basics</b> for every cyber role: prompt injection, agents, data leaks', '<b>Hands-on labs:</b> build and red-team an agent in a sandbox']],
      ['org', 'New org chart', ['<b>New roles:</b> AI security architect, agent identity owner, AI red teamer', '<b>Rebuild junior paths</b> as L1 tasks shift to agents']],
      ['ucheck', 'New accountability', ['<b>A named human owner</b> for every agent and its actions', '<b>Shared AI risk</b> with IT, data and business teams (RACI)']]];
    return `${photo('assets/assises/storm-boat-2.jpg', 'deep')}
  <div class="k">The crew</div>
  <h2 class="h">Lead the human shift: <g>cyber teams that secure AI and use it</g></h2>
  <p class="sub">Two goals for every CISO team: secure the company's AI, and put AI to work inside cyber</p>
  <div class="daio glass"${fa(1)}><div class="tag"><small>A new team</small><b>Cyber Data &amp; AI Office</b></div>
    <ul><li>With your own data scientists and AI engineers</li><li>Build and maintain the Cyber Data Lake &amp; AI agents</li><li>Upskill and empower all cyber teams through AI literacy</li></ul></div>
  <div class="cards4">${C.map(([ic, t, l], i) => `<div class="c4 glass"${fa(2)}><div class="top"><i>${ICON(ic)}</i><span>0${i + 1}</span></div><h4>${t}</h4><ul>${l.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>`; },
  vo: `Enfin, l'humain. Deux objectifs pour chaque équipe du RSSI : sécuriser l'IA de l'entreprise, et mettre l'IA au travail dans la cyber. Une nouvelle équipe, le Cyber Data & AI Office, avec vos propres data scientists et ingénieurs IA. Et quatre chantiers : montrer l'exemple et annoncer tôt ce qui change, former tous les rôles cyber, créer de nouveaux rôles et reconstruire les parcours juniors, et nommer un humain responsable de chaque agent.`,
  notes: `Clics : 1 le Cyber Data & AI Office, 2 les quatre chantiers.
Commentaires source : « Reprendre commentaires de GBI lors de la présentation », « @pauline » : à traiter avant la session.` },

// ─── CLOSING ─────────────────────────────────────────────────────────
{ ch: 'e', type: 'closing', title: 'How do you lead the shift?',
  html: () => `${photo('assets/assises/yacht-crew.jpg', '', '50% 40%')}
  <div class="k">Takeaways</div>
  <h2 class="h l">How do you <g>lead the shift</g> to AI?</h2>
  <div class="cl">
    <div class="clc glass"${fa(1)}><small>01</small><h4>Cyber for AI</h4><p>Secure the ecosystem</p><ul><li><b>Discover and manage</b> your agents</li><li><b>Protect</b> your AI platform</li><li><b>Manage</b> agent identities</li><li><b>Secure</b> emerging risks: resilience &amp; open-weight models</li></ul></div>
    <div class="clc glass"${fa(2)}><small>02</small><h4>Cyber against AI</h4><p>Reset the defensive baseline</p><ul><li><b>Enforce</b> the new cyber baseline</li><li><b>Take ownership</b> of defensive actions</li></ul></div>
    <div class="clc glass"${fa(3)}><small>03</small><h4>Cyber with AI</h4><p>Defend at machine speed</p><ul><li><b>Accelerate</b> cyber teams</li><li><b>Renew</b> major platforms</li><li><b>Build your cyber graph</b> to go at machine speed</li></ul></div>
  </div>
  <div class="bet glass"${fa(4)}><div><b><em>Bet on your teams:</em> empower them to lead the shift</b><p>Upskill teams, give them ownership and break silos to scale</p></div>
    <div class="qr"><img src="assets/assises/qr-benchmark.png" alt="QR code"><span>2026 AI Cyber Benchmark</span></div></div>`,
  vo: `Pour conclure. Cyber for AI : découvrez vos agents, protégez vos plateformes, maîtrisez leurs identités. Cyber against AI : imposez la nouvelle ligne de base et prenez la main sur les actions défensives. Cyber with AI : accélérez vos équipes, renouvelez vos plateformes, construisez votre graphe cyber. Et surtout, pariez sur vos équipes. Merci.`,
  notes: `Clics : les trois voiles, puis l'équipage. Laisser cet écran pendant les questions.
Corrections appliquées : « Dicover an dmange » → « Discover and manage », « platfomrs » → « platforms », « open weight= » → « open-weight models ».
La source mentionnait « Enforce the new cyber baseline 24 / 48 / 72 », incohérent avec les cibles de la slide baseline (< 24h, < 3h, < 24h, < 2 jours) : chiffres retirés, à arbitrer.
Le QR code « QR Code » de la source était un emplacement vide : celui du benchmark est réutilisé, à remplacer si un autre lien est prévu.
Note source : « Corréler les 3 sujets ».` },

{ ch: 'e', type: 'end', title: 'Thank you', brand: true,
  html: () => `<div class="brandbg"></div>
  <svg class="curves" viewBox="0 0 1600 900" preserveAspectRatio="none"><path d="M0 640 C 400 760, 900 760, 1600 450" stroke="#04F06A"/><path class="c2" d="M520 900 C 760 640, 1200 560, 1600 630" stroke="#fff"/></svg>
  <div class="end" style="position:relative;z-index:2"><img class="end-logo" src="assets/assises/wavestone.svg" alt="Wavestone">
    <h2>Thank you. Now, <b>lead the shift.</b></h2>
    <p>Claire Carré · Gérôme Billois · Les Assises 2026</p></div>`,
  vo: `Merci à toutes et à tous. Place à vos questions.`,
  notes: `Revenir à l'écran précédent (←) pour les questions si besoin.` },
];

// ════════════════════════════════════════════════════════════════════════
// ENGINE: scenes, fragments, HUD, presenter view
// ════════════════════════════════════════════════════════════════════════
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const stage = $('#stage');
let idx = 0, frag = 0, cur = null;
const chan = 'BroadcastChannel' in window ? new BroadcastChannel('lead-the-shift') : null;
const PRESENTER = location.hash.startsWith('#presenter');

function maxF(el) { return $$('[data-f],[data-hl]', el).reduce((m, n) => Math.max(m, +(n.dataset.f || n.dataset.hl)), 0); }
function countUp(n) {
  if (n.dataset.done) return; n.dataset.done = 1;
  const to = +n.dataset.to, dec = +n.dataset.dec, t0 = performance.now(), ms = 1400;
  const fmt = v => v.toLocaleString('en-GB', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const tick = now => { const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3); n.textContent = fmt(to * e); if (k < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
function applyFrag(el, k) {
  $$('[data-f]', el).forEach(n => n.classList.toggle('on', +n.dataset.f <= k));
  $$('[data-hl]', el).forEach(n => n.classList.toggle('hl', +n.dataset.hl <= k));
  $$('.count', el).forEach(n => { const host = n.closest('[data-f]'); if (!host || host.classList.contains('on')) countUp(n); });
  el._onFrag && el._onFrag(k);
}

// words that rise into focus
const WORDS = '.h, .qq, .ttl h2, .press-band h2, .band p, .fund .h, .end h2';
function split(el) {
  if (el.dataset.w) return; el.dataset.w = 1;
  let i = 0;
  const walk = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const parts = n.textContent.split(/(\s+)/);
      if (parts.every(p => !p.trim())) return;
      const fr = document.createDocumentFragment();
      parts.forEach(p => { if (!p) return; if (!p.trim()) { fr.appendChild(document.createTextNode(p)); return; } const w = document.createElement('span'); w.className = 'w'; w.style.setProperty('--i', i++); w.textContent = p; fr.appendChild(w); });
      n.replaceWith(fr);
    } else if (n.nodeType === 1 && !/^(svg|br|img)$/i.test(n.tagName) && !n.classList.contains('count')) walk(n);
  });
  walk(el);
}

function render(i, k) {
  const s = SCENES[i];
  const el = document.createElement('section');
  el.className = `scene t-${s.type}`;
  document.body.classList.toggle('brand', !!s.brand);
  el.innerHTML = s.html();
  $$(WORDS, el).forEach(split);
  el._max = maxF(el);
  stage.appendChild(el);
  s.mount && s.mount(el);
  const old = cur; cur = el;
  if (old) { old.classList.remove('live'); old.classList.add('leaving'); setTimeout(() => old.remove(), 900); }
  frag = Math.max(0, Math.min(k === 'end' ? el._max : k, el._max));
  requestAnimationFrame(() => { applyFrag(el, frag); requestAnimationFrame(() => el.classList.add('live')); });
}
function go(i, k = 0) {
  i = Math.max(0, Math.min(SCENES.length - 1, i));
  if (i !== idx || !cur) { idx = i; render(i, k); }
  else { frag = Math.max(0, Math.min(k === 'end' ? cur._max : k, cur._max)); applyFrag(cur, frag); }
  sync();
}
function next() { if (cur && frag < cur._max) { frag++; applyFrag(cur, frag); sync(); } else if (idx < SCENES.length - 1) go(idx + 1, 0); }
function prev() { if (frag > 0) { frag--; applyFrag(cur, frag); sync(); } else if (idx > 0) go(idx - 1, 'end'); }
function sync() {
  history.replaceState(null, '', `#${idx + 1}${frag ? '.' + frag : ''}`);
  const s = SCENES[idx], c = CH[s.ch];
  $('#hud-ch').textContent = `${c.n} · ${c.title}`;
  $('#hud-ct').textContent = `${idx + 1} / ${SCENES.length}`;
  $$('#prog div').forEach(d => { const [a, b] = d.dataset.r.split('-').map(Number); const p = idx > b ? 100 : idx < a ? 0 : ((idx - a + (cur && cur._max ? frag / (cur._max + 1) : 1)) / (b - a + 1)) * 100; d.firstChild.style.width = p + '%'; });
  if ($('#notes').classList.contains('open')) showNotes();
  $('#subs').textContent = s.vo || '';
  chan && chan.postMessage({ type: 'state', idx, frag, max: cur ? cur._max : 0 });
}
const groups = () => { const g = {}; SCENES.forEach((s, i) => (g[s.ch] = g[s.ch] || []).push(i)); return g; };
function buildProgress() {
  $('#prog').innerHTML = Object.entries(groups()).map(([ch, l]) => `<div style="flex:${l.length}" data-r="${l[0]}-${l[l.length - 1]}" title="${CH[ch].n} · ${CH[ch].title}"><i></i></div>`).join('');
  $$('#prog div').forEach(d => d.addEventListener('click', e => { e.stopPropagation(); go(+d.dataset.r.split('-')[0]); }));
}
function buildOverview() {
  $('#ov').innerHTML = `<h2>Outline</h2>` + Object.entries(groups()).map(([ch, l]) => `<div class="ov-ch"><h3>${CH[ch].n} · ${CH[ch].title}<span>${CH[ch].mins[0]} - ${CH[ch].mins[1]} min</span></h3><div class="ov-g">${l.map(i => `<button data-i="${i}" class="${i === idx ? 'cur' : ''}"><small>${i + 1} · ${SCENES[i].type}</small>${SCENES[i].title}</button>`).join('')}</div></div>`).join('');
  $$('#ov button').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); $('#ov').classList.remove('open'); go(+b.dataset.i); }));
}
function showNotes() {
  const s = SCENES[idx];
  $('#notes').innerHTML = `<h4>Say · ${s.title}</h4><p style="font-family:var(--f-serif);font-size:1.15rem;color:var(--text);margin:0 0 1rem">${s.vo || ''}</p><h4>Notes</h4><div style="white-space:pre-line">${s.notes || ''}</div>`;
}

function presenter() {
  document.body.className = 'pres';
  document.body.innerHTML = `<div class="pv"><div>
      <div class="k2" id="pv-ch"></div><h1 id="pv-t"></h1><div class="fr" id="pv-fr"></div>
      <div class="k2" style="margin-bottom:.4rem">À dire</div><p class="say" id="pv-s"></p>
      <div class="k2" style="margin-bottom:.4rem">Notes</div><div class="nt" id="pv-n"></div></div>
    <div><div class="box"><div class="k2">Temps écoulé</div><div class="clock" id="pv-c">00:00</div><div class="muted" id="pv-tg"></div>
        <div class="btns" style="margin-top:.8rem"><button id="pv-st">Démarrer</button><button id="pv-rs">Remise à zéro</button></div></div>
      <div class="box"><div class="k2">Écran suivant</div><div id="pv-nx" style="font-size:18px;margin-top:.4rem"></div></div>
      <div class="btns"><button id="pv-p">← Retour</button><button id="pv-x" class="pri">Suivant →</button></div>
      <p class="muted" style="margin-top:1.2rem">Les flèches et les télécommandes de présentation fonctionnent aussi dans cette fenêtre. B : écran noir.</p></div></div>`;
  let st = null, acc = 0, state = { idx: 0, frag: 0, max: 0 };
  const cmd = c => chan && chan.postMessage({ type: 'cmd', cmd: c });
  const draw = () => {
    const s = SCENES[state.idx], c = CH[s.ch], n = SCENES[state.idx + 1];
    $('#pv-ch').textContent = `${c.n} · ${c.title} · écran ${state.idx + 1} / ${SCENES.length}`;
    $('#pv-t').textContent = s.title;
    $('#pv-fr').innerHTML = [...Array(state.max + 1)].map((_, i) => `<i class="${i <= state.frag ? 'on' : ''}"></i>`).join('');
    $('#pv-n').textContent = s.notes || '';
    $('#pv-s').textContent = s.vo || '(silence)';
    $('#pv-nx').textContent = n ? n.title : 'Fin';
    $('#pv-tg').textContent = `Cible du chapitre : ${c.mins[0]} - ${c.mins[1]} min`;
  };
  const clock = () => {
    const ms = acc + (st ? Date.now() - st : 0), m = Math.floor(ms / 60000), sec = Math.floor(ms / 1000) % 60;
    const el = $('#pv-c'); el.textContent = `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    el.classList.toggle('late', m >= CH[SCENES[state.idx].ch].mins[1] && CH[SCENES[state.idx].ch].mins[1] > 0);
  };
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
  buildProgress();
  const m = location.hash.match(/^#(\d+)(?:\.(\d+))?/);
  idx = -1; go(m ? +m[1] - 1 : 0, m && m[2] ? +m[2] : 0);
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
    else if (k === 'o' || k === 'O') { const o = $('#ov'); const op = !o.classList.contains('open'); closeAll(); if (op) { buildOverview(); o.classList.add('open'); } }
    else if (k === '?') { const h = $('#help'); const op = !h.classList.contains('open'); closeAll(); if (op) h.classList.add('open'); }
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
  setTimeout(() => { const h = $('#hint'); if (h) h.style.opacity = 0; }, 6000);
}
