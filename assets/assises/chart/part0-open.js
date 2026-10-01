// ════════════════════════════════════════════════════════════════════════
// PART 0 · CASTING OFF (0 - 6 min) · harbour, press, the question, currents
// ════════════════════════════════════════════════════════════════════════

// the harbour: a jetty with seven berths, one per agent
const BERTHS = [['Cyber-By-Design', 'reviews architectures'], ['Auto Cyber Benchmark', 'amplifies interviews'], ['IdentiVEX', 'mines roles'], ['CrisisMaker', 'writes crisis stimuli'], ['Web Recon', 'assists pentesters'], ['Smart Identity Analyzer', 'cleans IAM data'], ['Booster RM', 'speeds up risk analysis']];
const JETTY = [[1170, 5390], [2050, 4980]];
const berthAt = i => { const t = (i + 1) / 8, x = JETTY[0][0] + (JETTY[1][0] - JETTY[0][0]) * t, y = JETTY[0][1] + (JETTY[1][1] - JETTY[0][1]) * t, side = i % 2 ? 1 : -1; return [x + side * 40, y + side * 90]; };
LAYERS.push(() => {
  let s = `<g class="fl" data-flag="harbour"><path d="M${JETTY[0]} L${JETTY[1]}" stroke="var(--ink)" stroke-width="14" stroke-linecap="round"/>`;
  BERTHS.forEach((b, i) => { const [x, y] = berthAt(i); s += `<g transform="translate(${x} ${y}) rotate(-25)"><path d="M-30,0 L30,0 L22,12 L-24,12Z" fill="${i === 6 ? 'var(--green-d)' : 'var(--indigo)'}"/><path d="M-2,-2 L-2,-44 L20,-2Z" fill="${i === 6 ? 'var(--green)' : 'var(--lav)'}"/></g>`; });
  return s + `<text class="c-place" x="1050" y="5960">Port Wavestone</text></g>`;
});

// the press, pinned on the chart like clippings on a table
LAYERS.push(() => `<g class="fl" data-flag="press">${IMG.press.map((src, i) => {
  const r = rng(40 + i), x = 1700 + (i % 4) * 520 + r() * 120, y = 3500 + Math.floor(i / 4) * 420 + r() * 80, a = (r() - .5) * 12;
  return `<g transform="translate(${x} ${y}) rotate(${a.toFixed(1)})"><rect x="-8" y="-8" width="476" height="296" fill="#fff" style="filter:drop-shadow(0 18px 24px rgba(30,13,87,.25))"/><image href="${src}" width="460" height="280" preserveAspectRatio="xMidYMin slice"/></g>`;
}).join('')}</g>`);

// three currents: on this chart the west is 2023 and the east is 2030
const CURRENTS = [[1500, 1250, 'lav'], [5000, 3350, 'indigo'], [7000, 6250, 'green-d']];
LAYERS.push(() => {
  let s = '';
  CURRENTS.forEach(([x0, y, c], i) => {
    const d = smoothPath([[x0, y], [x0 + 900, y - 160], [x0 + 2200, y + 140], [x0 + 3600, y - 120], [11900, y + 60]]);
    s += `<g class="fl" data-flag="cur${i + 1} currents">`;
    for (let k = -1; k <= 1; k++) s += `<path d="${d}" transform="translate(0 ${k * 70})" fill="none" stroke="var(--${c})" stroke-width="${k ? 14 : 34}" stroke-dasharray="120 80" class="flow" style="opacity:${k ? .45 : .9}"/>`;
    s += `<circle cx="${x0}" cy="${y}" r="70" fill="var(--${c})"/><circle cx="${x0}" cy="${y}" r="70" fill="none" stroke="var(--${c})" stroke-width="10" class="pulse"/></g>`;
  });
  [[1500, '2023'], [5000, '2025'], [7000, '2026'], [11000, '2030 …']].forEach(([x, t]) => { s += `<g class="fl" data-flag="years"><line x1="${x}" y1="560" x2="${x}" y2="6800" stroke="var(--line2)" stroke-width="8" stroke-dasharray="16 40"/><text class="c-place" x="${x}" y="480" style="font-size:120px;letter-spacing:14px">${t}</text></g>`; });
  return s;
});

SCENES.push(
{ ch: 'p', type: 'title', title: 'Lead the Shift', ref: 'Lead the Shift', chrome: false, cam: { x: 6900, y: 3500, w: 13200 },
  html: () => `<div class="cart title-block"><span class="tab">Chart nº 2026 · Les Assises</span>
    <p class="kick">A workshop for CISOs · 40 minutes</p>
    <h1 class="big t" style="margin-top:1rem">Lead the <em>Shift</em></h1>
    <p class="sub">A CISO's chart for the AI transformation</p>
    <div class="scale"><i></i><i></i><i></i><i></i><i></i><span>4 waypoints · 40 minutes</span></div>
    <div class="credit"><div class="who"><div><img class="ph" src="${IMG.claire}" alt=""><div><b>Claire Carré</b><small>Partner</small></div></div><div><img class="ph" src="${IMG.gerome}" alt=""><div><b>Gérôme Billois</b><small>Partner</small></div></div></div>
      <div class="logos"><img src="${IMG.assises}" alt="Les Assises"><img class="ws" src="${IMG.wsI}" alt="Wavestone"></div></div></div>` },

{ ch: 'p', type: 'port', title: 'Port Wavestone', ref: 'About us', cam: { x: 1900, y: 5550, w: 3600 }, on: ['harbour'],
  html: () => `<div class="cart at-r w-l"><span class="tab">Port of registry</span>
    <p class="kick">Who is on the bridge</p><h2 class="h t">Wavestone: cyber transformation, <em>led by people, accelerated by AI</em></h2>
    <div class="figs"><div><b>${odo(1000)}<sup>+</sup></b><span>cyber consultants, 700+ trained in AI security, 150+ in AI engineering</span></div>
      <div><b>${odo(4000)}<sup>+</sup></b><span>tier-1 clients, for more than 20 years, public and private</span></div>
      <div><b>${odo(11)}</b><span>countries, with close ties to communities and regulators</span></div>
      <div><b>${odo(360)}<sup>°</sup></b><span>the whole CSO &amp; CISO agenda: IT, OT, products. Heard at Black Hat, RSAC, DEF CON</span></div></div>
    <ul class="log">
      <li${fa(1)}><i>i.</i><span><b>Human judgement, AI speed.</b> Our experts work with our own AI platforms: faster delivery, deeper analysis.</span></li>
      <li${fa(2)}><i>ii.</i><span><b>From the strategy room to the engine room.</b> We stay until the programme runs, adopted, at scale.</span></li>
      <li${fa(3)}><i>iii.</i><span><b>Independent, and makers.</b> Nothing to resell; hands-on with the leading solutions, and we build our own.</span></li></ul></div>` },

{ ch: 'p', type: 'fleet', title: 'Our own fleet', ref: 'Homemade AI agents', cam: { x: 1800, y: 5150, w: 2300 }, on: ['harbour'],
  html: () => `${BERTHS.map((b, i) => { const [x, y] = berthAt(i), side = i % 2 ? 1 : -1; return pin(x + side * 30, y + side * 120, `<div class="berth${i === 6 ? ' hot' : ''}"><b>${b[0]}</b><span>${b[1]}</span></div>`, side > 0 ? 'b' : 't', i < 3 ? null : 1); }).join('')}
  <div class="cart at-tr w-m"><span class="tab">30+ agents built</span>
    <p class="kick">Our own fleet</p><h2 class="h s t">Seven agents we built, and <em>sail with</em> on every engagement</h2>
    <ul class="log">
      <li${fa(2)}><i>i.</i><span><b>Runs anywhere.</b> Standalone HTML pages: no dependency on your stack.</span></li>
      <li${fa(3)}><i>ii.</i><span><b>Any model.</b> It calls your AI, or a local model when the context requires it.</span></li>
      <li${fa(4)}><i>iii.</i><span><b>One key, one budget.</b> Each engagement gets its own API key and spending limit.</span></li></ul></div>` },

{ ch: 'p', type: 'press', title: 'The water changed', ref: 'AI has changed the game', cam: { x: 2900, y: 4250, w: 3700 }, on: ['press'],
  html: () => `<div class="statement"${fa(1)}><div class="cart plain" style="position:relative;display:inline-block;padding:2rem 2.4rem"><p class="kick">Press review, 2026</p><p class="big t" style="font-size:5.6rem;margin-top:.8rem">The game <em>changed.</em></p><p class="p" style="font-size:1.3rem;max-width:40rem">Navigating its risks, and its promise, has never mattered more.</p></div></div>` },

{ ch: 'p', type: 'question', title: 'The question', ref: 'The question', cam: { x: 3300, y: 4700, w: 1800 }, chrome: false,
  html: () => `<figure class="polar" style="right:7rem;top:7rem;width:38rem;height:23rem;--r:2deg"><img src="${IMG.yacht0}" alt=""><figcaption>Three masts. No sail set yet.</figcaption></figure>
  <div class="statement"><p class="kick">The question for the next 40 minutes</p><p class="big t" style="margin-top:1rem">How do you take <em>all</em> of AI, and stay at the helm?</p></div>` },

{ ch: 'p', type: 'currents', title: 'Three currents', ref: 'Three shifts, one timeline', cam: { x: 6200, y: 3600, w: 12600 }, on: ['years'], onF: { 1: ['cur1'], 2: ['cur2'], 3: ['cur3'] },
  html: () => `${pin(1500, 1250, `<div class="cur-l"><i>Since 2023</i><b>Cyber for AI</b><span>secure the ecosystem</span></div>`, 'b', 1, 'margin-top:2.2rem')}
  ${pin(5000, 3350, `<div class="cur-l"><i>Since 2025</i><b>Cyber against AI</b><span>reset the defensive baseline</span></div>`, 'b', 2, 'margin-top:2.2rem')}
  ${pin(7000, 6250, `<div class="cur-l"><i>Since 2026</i><b>Cyber with AI</b><span>defend at machine speed</span></div>`, 't', 3, 'margin-top:-2.2rem')}
  <div class="cart at-bl w-m"${fa(4)}><span class="tab">The race changed</span><h2 class="h s t">Three currents, <em>one heading</em></h2>
    <p class="p">They started one after the other and all three run to 2030 and beyond. You cannot pick one: winning the AI race takes a heading that holds in all three.</p></div>` },
);
