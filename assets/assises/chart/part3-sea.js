// ════════════════════════════════════════════════════════════════════════
// PART 3 · OPEN SEA, MACHINE SPEED (26 - 36 min) · Cyber WITH AI
// The atoll is the chapter's map, read from the outside in:
//   sail 1 · the outer waters: use cases moored team by team, each in its own harbour
//   sail 2 · the ring: platforms on the land, joined by one road (shared context)
//   sail 3 · the lagoon: the cyber data lake, where the agents sail
// Region: x 7900 - 11900, y 200 - 4300. Lagoon waypoint (9300, 2400).
// ════════════════════════════════════════════════════════════════════════
const P3 = (() => {
  const C = [9300, 2400], rad = d => d * Math.PI / 180;
  const pt = (deg, r) => [C[0] + Math.cos(rad(deg)) * r, C[1] + Math.sin(rad(deg)) * r];
  // the same harmonics as the engine's blob(): radius of the atoll's coasts at any bearing
  const radial = (R, seed, amp) => { const r = rng(seed), H = [2, 3, 4, 5, 7, 9].map(k => [k, (r() * amp) / Math.sqrt(k), r() * 6.283]); return deg => { const a = rad(deg); let k = 1; H.forEach(([h, A, p]) => { k += A * Math.sin(h * a + p); }); return R * k; }; };
  const land = radial(980, 9, .12), lagoon = radial(600, 21, .1), mid = deg => (land(deg) + lagoon(deg)) / 2;
  const f = (n, d = 0) => n.toFixed(d);
  // the six CISO teams, at fixed bearings: west column top to bottom, then east column
  const TEAMS = [
    { k: 'grc', name: 'GRC', b: 226 }, { k: 'sbd', name: 'Sec by design', b: 180 }, { k: 'infra', name: 'Infra sec', b: 134 },
    { k: 'iam', name: 'IAM', b: 313 }, { k: 'def', name: 'Defense', b: 0 }, { k: 'res', name: 'Resilience', b: 47 }];
  const LX = { w: 7780, e: 10820 };            // where the team labels hang, west and east
  const side = t => (t.b > 90 && t.b < 270 ? 'w' : 'e');
  const LV = [[20, 'AI assists', 'Human does, AI assists'], [50, 'Human-agent teams', 'Human-agent teams'], [80, 'Human-led, agent-operated', 'Human-led, agent-operated']];
  return { C, pt, land, lagoon, mid, f, TEAMS, LX, side, LV };
})();

// ─── shared HTML: the three-sail gauge (the chapter's recurring instrument) ─
P3.sails = (lv, big) => {
  let s = `<svg class="p3-sv${big ? ' big' : ''}" viewBox="0 0 132 72" aria-hidden="true"><path class="hull" d="M4,57 L128,57 L118,68 L16,68Z"/>`;
  [34, 70, 106].forEach((x, i) => {
    const st = i < lv - 1 ? 'set' : i === lv - 1 ? 'now' : 'off';
    s += `<line class="mast" x1="${x}" y1="3" x2="${x}" y2="57"/><path class="sail ${st}" d="M${x - 2},7 L${x - 2},52 L${x - 30},52Z"/>`;
  });
  return s + '</svg>';
};
P3.gauge = lv => { const [p, , l] = P3.LV[lv - 1]; return `<div class="p3-gauge">${P3.sails(lv)}<div class="p3-gv"><b>AI ≈ ${p}%</b><span>${l}</span></div>
  <div class="p3-bar"><i style="width:${p}%"></i>${[20, 50, 80].map((v, i) => `<s style="left:${v}%" class="${i < lv ? 'on' : ''}"></s>`).join('')}</div></div>`; };
P3.head = (lv, kick, h, p, w = '33rem', wide = false, extra = '') => `<div class="cart at-tl p3-head${wide ? ' wide' : ''}" style="width:${w}"><span class="tab">Sail ${lv} of 3</span>${P3.gauge(lv)}
  <div class="p3-ht"><p class="kick">${kick}</p><h2 class="h s t">${h}</h2>${p ? `<p class="p">${p}</p>` : ''}${extra}</div></div>`;

// ════════════════════════════════════════════════════════════════════════
// CHART LAYERS
// ════════════════════════════════════════════════════════════════════════

// scene 1 · the three zones of the atoll, read from the outside in
LAYERS.push(() => {
  const { pt, f } = P3, B = 300, Z = [[1260, 'p3-z1'], [800, 'p3-z2'], [330, 'p3-z3']];
  let s = `<g class="fl" data-flag="p3-zones"><path d="M${pt(B, 1500).map(v => f(v))} L${pt(B, 200).map(v => f(v))}" stroke="var(--indigo)" stroke-width="5" stroke-dasharray="4 16" stroke-linecap="round" fill="none"/></g>`;
  Z.forEach(([r, fl], i) => { const [x, y] = pt(B, r); s += `<g class="fl" data-flag="${fl}"><circle cx="${f(x)}" cy="${f(y)}" r="62" fill="var(--green)" stroke="var(--ink)" stroke-width="5"/><text x="${f(x)}" y="${f(y + 20)}" text-anchor="middle" style="font:600 58px var(--f-sans);fill:#1E0D57">${i + 1}</text></g>`; });
  return s;
});

// scene 2 · sail 1: a harbour per team on the outer coast, pennants hoisted, no road between them
P3.UC = {
  grc: [['TPRM questionnaire review'], ['Awareness video &amp; text generation']],
  sbd: [['Secure-by-Design architecture reviewer', '30% time saved'], ['Risk analysis']],
  infra: [['Firewall rules review']],
  iam: [['Role mining reviews', '50 - 80% time saved'], ['Application onboarding analyzer']],
  def: [['Automated SOC L1 alert triage', '6 → 1 FTE + agents'], ['Red team acceleration &amp; report', '≈ 5h saved per pentest']],
  res: [['Cyber crisis stimuli generation']] };
LAYERS.push(() => {
  const { pt, land, f, TEAMS, LX, side } = P3;
  let s = '';
  TEAMS.forEach(t => {
    const [x, y] = pt(t.b, land(t.b) + 40), w = side(t) === 'w', dir = w ? -1 : 1, n = P3.UC[t.k].length;
    // leader from the harbour to its label
    s += `<g class="fl" data-flag="p3-ports"><path d="M${f(x)},${f(y)} L${w ? LX.w + 30 : LX.e - 30},${f(y)}" stroke="var(--ink)" stroke-width="3" stroke-dasharray="3 12" stroke-linecap="round" fill="none" opacity=".55"/>
      <circle cx="${f(x)}" cy="${f(y)}" r="34" fill="var(--card)" stroke="var(--ink)" stroke-width="6"/><circle cx="${f(x)}" cy="${f(y)}" r="12" fill="var(--ink)"/></g>`;
    // the mast and its pennants, one per use case (green when the ROI is measured)
    s += `<g class="fl" data-flag="p3-flags"><line x1="${f(x)}" y1="${f(y - 34)}" x2="${f(x)}" y2="${f(y - 250)}" stroke="var(--ink)" stroke-width="7"/>`;
    P3.UC[t.k].forEach((u, i) => { const yy = y - 246 + i * 74; s += `<path d="M${f(x)},${f(yy)} l${dir * 120},26 l${-dir * 120},26Z" fill="${u[1] ? 'var(--green)' : 'var(--indigo)'}" stroke="var(--ink)" stroke-width="3"/>`; });
    s += '</g>';
  });
  return s;
});

// scene 4 · sail 2: platforms on the ring, one road around the atoll, the office in the lagoon
LAYERS.push(() => {
  const { pt, mid, f, TEAMS, LX, side } = P3;
  const road = [...Array(180)].map((_, i) => pt(i * 2, mid(i * 2)));
  const d = 'M' + road.map(p => p.map(v => f(v)).join(',')).join(' L') + 'Z';
  let s = `<g class="fl" data-flag="p3-road"><path d="${d}" fill="none" stroke="var(--indigo)" stroke-width="22" opacity=".16"/><path d="${d}" fill="none" stroke="var(--indigo)" stroke-width="7" stroke-dasharray="30 30" class="flow"/></g>`;
  TEAMS.forEach(t => {
    const bs = t.k === 'def' ? [-9, 9] : [t.b], w = side(t) === 'w';
    bs.forEach((b, i) => {
      const [x, y] = pt(b, mid(b)), ly = pt(t.b, 0)[1] + (t.k === 'def' ? 0 : 0);
      s += `<g class="fl" data-flag="p3-plat"><path d="M${f(x)},${f(y)} L${w ? LX.w + 30 : LX.e - 30},${f(pt(t.b, P3.land(t.b) + 40)[1] + (bs.length > 1 ? 0 : 0))}" stroke="var(--indigo)" stroke-width="3" stroke-dasharray="3 12" stroke-linecap="round" fill="none" opacity=".6"/>
        <rect x="${f(x - 56)}" y="${f(y - 56)}" width="112" height="112" rx="10" fill="var(--indigo)" stroke="var(--card)" stroke-width="8" transform="rotate(45 ${f(x)} ${f(y)})"/><circle cx="${f(x)}" cy="${f(y)}" r="18" fill="var(--green)"/></g>`;
    });
  });
  // the Cyber Data & AI Office: a small light on an islet in the lagoon, ahead of the waypoint
  const [ox, oy] = [9300, 2120];
  s += `<g class="fl" data-flag="p3-office"><path d="${blob(ox, oy + 30, 90, 31, .1)}" fill="var(--land)" stroke="var(--coast)" stroke-width="4"/>
    <g transform="translate(${ox} ${oy + 10})"><path d="M0,0 L520,-130 A540,540 0 0,1 520,130Z" fill="var(--green)" opacity=".28" class="p3-sweep"/>
    <path d="M-26,40 L-16,-70 L16,-70 L26,40Z" fill="var(--ink)"/><rect x="-22" y="-100" width="44" height="30" fill="var(--green)" stroke="var(--ink)" stroke-width="5"/><path d="M-26,-100 L0,-126 L26,-100Z" fill="var(--ink)"/></g></g>`;
  return s;
});

// scene 3 · how to pick them: a channel with three locks, narrowing towards the open sea
P3.CH = { x0: 8650, x1: 11640, y: 640, locks: [9460, 10270, 11070] };
P3.chW = x => { const t = (x - P3.CH.x0) / (P3.CH.x1 - P3.CH.x0); return 300 - 220 * Math.pow(t, .8); };   // half width
LAYERS.push(() => {
  const { x0, x1, y, locks } = P3.CH, f = P3.f, W = P3.chW;
  const xs = [...Array(41)].map((_, i) => x0 + (x1 - x0) * i / 40), wob = x => Math.sin(x / 420) * 26;
  const top = xs.map(x => [x, y + wob(x) - W(x)]), bot = xs.map(x => [x, y + wob(x) + W(x)]).reverse();
  const bank = `M${top.map(p => p.map(v => f(v)).join(',')).join(' L')} L${bot.map(p => p.map(v => f(v)).join(',')).join(' L')}Z`;
  let s = `<g class="fl" data-flag="p3-chan">
    <path d="M${x0 - 600},${y - 900} L${x1 + 500},${y - 900} L${x1 + 500},${y + 900} L${x0 - 600},${y + 900}Z" fill="var(--land)" opacity="0"/>
    <path d="${bank}" fill="var(--sea2)" stroke="var(--coast)" stroke-width="5"/>
    <path d="M${x0},${y + wob(x0)} ${xs.map(x => `L${f(x)},${f(y + wob(x))}`).join(' ')}" fill="none" stroke="var(--indigo)" stroke-width="3" stroke-dasharray="10 16" opacity=".5"/>`;
  // banks, hatched like land
  top.forEach(([x, yy], i) => { if (i % 2) s += `<line x1="${f(x)}" y1="${f(yy)}" x2="${f(x - 30)}" y2="${f(yy - 46)}" stroke="var(--coast)" stroke-width="3" opacity=".5"/>`; });
  bot.forEach(([x, yy], i) => { if (i % 2) s += `<line x1="${f(x)}" y1="${f(yy)}" x2="${f(x - 30)}" y2="${f(yy + 46)}" stroke="var(--coast)" stroke-width="3" opacity=".5"/>`; });
  s += '</g>';
  // the two drivers: two streams feed the channel
  const yt = y + wob(x0);
  s += `<g class="fl" data-flag="p3-drivers">
    <path d="M${x0 - 460},${y - 470} C${x0 - 240},${y - 460} ${x0 - 140},${yt - 160} ${x0 + 60},${yt - 110}" fill="none" stroke="var(--indigo)" stroke-width="40" opacity=".16"/>
    <path d="M${x0 - 460},${y + 470} C${x0 - 240},${y + 460} ${x0 - 140},${yt + 160} ${x0 + 60},${yt + 110}" fill="none" stroke="var(--indigo)" stroke-width="40" opacity=".16"/>
    <path d="M${x0 - 460},${y - 470} C${x0 - 240},${y - 460} ${x0 - 140},${yt - 160} ${x0 + 60},${yt - 110}" fill="none" stroke="var(--indigo)" stroke-width="7" stroke-dasharray="26 22" class="flow"/>
    <path d="M${x0 - 460},${y + 470} C${x0 - 240},${y + 460} ${x0 - 140},${yt + 160} ${x0 + 60},${yt + 110}" fill="none" stroke="var(--indigo)" stroke-width="7" stroke-dasharray="26 22" class="flow"/></g>`;
  // locks: two gates and a chamber each
  locks.forEach((lx, i) => {
    const w = W(lx) + 46, yc = y + wob(lx);
    s += `<g class="fl" data-flag="p3-lock${i + 1}"><rect x="${lx - 90}" y="${f(yc - w)}" width="180" height="${f(2 * w)}" fill="var(--green)" opacity=".28"/>
      <line x1="${lx - 90}" y1="${f(yc - w - 30)}" x2="${lx - 90}" y2="${f(yc + w + 30)}" stroke="var(--ink)" stroke-width="16"/><line x1="${lx + 90}" y1="${f(yc - w - 30)}" x2="${lx + 90}" y2="${f(yc + w + 30)}" stroke="var(--ink)" stroke-width="16"/>
      <circle cx="${lx}" cy="${f(yc - w - 110)}" r="48" fill="var(--ink)"/><text x="${lx}" y="${f(yc - w - 92)}" text-anchor="middle" style="font:600 52px var(--f-sans);fill:var(--card)">${i + 1}</text></g>`;
  });
  // the ideas: many at the mouth, fewer after each lock, two sail out
  const R = rng(77), boat = (x, yy, c) => `<g transform="translate(${f(x)} ${f(yy)})"><path d="M-30,6 L30,6 L21,18 L-22,18Z" fill="var(--ink)"/><path d="M-3,3 L-3,-46 L22,3Z" fill="${c}"/></g>`;
  const pools = [[x0 + 120, locks[0] - 160, 9, 'p3-ideas0'], [locks[0] + 140, locks[1] - 150, 5, 'p3-ideas1'], [locks[1] + 140, locks[2] - 150, 3, 'p3-ideas2'], [locks[2] + 160, x1 + 260, 2, 'p3-ideas3']];
  pools.forEach(([a, b, n, fl], k) => {
    s += `<g class="fl" data-flag="${fl}">`;
    for (let i = 0; i < n; i++) { const x = a + (b - a) * (i + .5) / n, w = W(Math.min(x, x1)) * .55; s += boat(x, y + wob(x) + (R() - .5) * 2 * w + 10, k === 3 ? 'var(--green)' : k ? 'var(--lav)' : 'var(--mist)'); }
    s += '</g>';
  });
  // a scale bar in months under the channel, like a chart's scale of miles
  const sy = y + 470, seg = (x1 - x0) / 3;
  s += `<g class="fl" data-flag="p3-chan">${[0, 1, 2].map(i => `<rect x="${f(x0 + seg * i)}" y="${sy}" width="${f(seg)}" height="22" fill="${i % 2 ? 'var(--card)' : 'var(--ink)'}" stroke="var(--ink)" stroke-width="3"/>`).join('')}</g>`;
  return s;
});

// scene 5 · two voyages around the atoll, one objective
P3.VR = 1260;
P3.VA = [232, 270, 308];            // insurance, north about
P3.VB = [158, 118, 74, 34];         // automotive, south about
LAYERS.push(() => {
  const { pt, f } = P3, R = P3.VR;
  const arc = (a0, a1) => { const pts = []; const n = 60; for (let i = 0; i <= n; i++) pts.push(pt(a0 + (a1 - a0) * i / n, R)); return 'M' + pts.map(p => p.map(v => f(v)).join(',')).join(' L'); };
  const [sx, sy] = pt(180, R), [ex, ey] = pt(360, R);
  let s = `<g class="fl" data-flag="p3-voy"><circle cx="${f(sx)}" cy="${f(sy)}" r="44" fill="var(--card)" stroke="var(--ink)" stroke-width="8"/>
    <g transform="translate(${f(ex)} ${f(ey)})"><circle r="90" fill="none" stroke="var(--green-d)" stroke-width="6" class="pulse"/><path d="M0,-74 L18,-18 L74,0 L18,18 L0,74 L-18,18 L-74,0 L-18,-18Z" fill="var(--green)" stroke="var(--ink)" stroke-width="5"/></g></g>`;
  [['p3-va', arc(180, 360), P3.VA, 'var(--indigo)'], ['p3-vb', arc(180, 0), P3.VB, 'var(--green-x)']].forEach(([fl, d, steps, c]) => {
    s += `<g class="fl" data-flag="${fl}"><path class="draw" data-flag="${fl}" pathLength="1" d="${d}" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round"/>`;
    steps.forEach((b, i) => { const [x, y] = pt(b, R); s += `<circle cx="${f(x)}" cy="${f(y)}" r="46" fill="var(--card)" stroke="${c}" stroke-width="9"/><text x="${f(x)}" y="${f(y + 18)}" text-anchor="middle" style="font:600 48px var(--f-sans);fill:${c}">${i + 1}</text>`; });
    s += '</g>';
  });
  return s;
});

// scene 6 · sail 3: the lagoon is the cyber data lake; rivers in through APIs, out through MCP & APIs
P3.SRC = [['SOC / EDR', 2040], ['CTI / vulnerabilities', 2250], ['Assets / configs', 2460], ['GRC / TPRM / risks', 2670]];
P3.ACT = [['EDR / NDR / FW', 2130], ['Patching &amp; config', 2400], ['Access rights / DLP', 2670]];
LAYERS.push(() => {
  const f = P3.f, river = (d, c, fl) => `<path d="${d}" fill="none" stroke="var(--coast)" stroke-width="52" stroke-linecap="round"/><path d="${d}" fill="none" stroke="var(--sea)" stroke-width="44" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="7" stroke-dasharray="26 30" class="flow"/>`;
  let s = '<g class="fl" data-flag="p3-in">';
  P3.SRC.forEach(([, y], i) => { const ye = 2330 + i * 46; s += river(smoothPath([[7930, y], [8250, y + (ye - y) * .35], [8560, ye + (y - ye) * .1], [8760, ye]]), 'var(--indigo)'); s += `<circle cx="7930" cy="${y}" r="30" fill="var(--indigo)"/>`; });
  s += '</g><g class="fl" data-flag="p3-out">';
  P3.ACT.forEach(([, y], i) => { const ys = 2340 + i * 60; s += river(smoothPath([[9870, ys], [10080, ys + (y - ys) * .15], [10380, y - (y - ys) * .25], [10700, y]]), 'var(--green-d)'); s += `<circle cx="10700" cy="${y}" r="30" fill="var(--green-d)"/>`; });
  s += '</g>';
  // the lake itself: its name, and the platform written round its shore
  s += `<g class="fl" data-flag="p3-lake"><path d="${blob(9300, 2400, 600, 21, .1)}" fill="var(--green)" opacity=".14"/>
    <text class="c-water" x="9300" y="2232" style="font-size:66px;letter-spacing:6px;opacity:.9">Cyber Data Lake</text></g>`;
  s += `<g class="fl" data-flag="p3-agents"><path id="p3-shore" d="M${9300 - 470},2400 A470,470 0 1,1 ${9300 + 470},2400 A470,470 0 1,1 ${9300 - 470},2400" fill="none"/>
    <text style="font:500 34px var(--f-mono);letter-spacing:9px;fill:var(--green-x)"><textPath href="#p3-shore" startOffset="2%">AGENTIC AI PLATFORM · ON YOUR PROCESSES AND CONTROL MODELS ·</textPath></text>
    <g class="p3-orbit">${[0, 1, 2, 3, 4, 5].map(i => { const a = i * 60 + 20, [x, y] = P3.pt(a, 385); return `<g transform="translate(${f(x)} ${f(y)})"><g class="p3-upright"><path d="M-36,7 L36,7 L25,22 L-26,22Z" fill="var(--ink)"/><path d="M-4,4 L-4,-56 L26,4Z" fill="${i === 3 ? 'var(--green)' : 'var(--indigo)'}"/><path d="M-10,4 L-10,-40 L-32,4Z" fill="${i === 3 ? 'var(--green)' : 'var(--indigo)'}" opacity=".6"/></g></g>`; }).join('')}</g></g>`;
  return s;
});

// scene 7 · the star chart: the cyber graph as a constellation over the atoll
P3.STARS = [['Assets', 9330, 1080, 'b'], ['Identities', 9690, 600, 'p3-up'], ['Vulnerabilities', 10140, 1010, 'b'], ['Controls', 10530, 520, 'p3-up'], ['Third parties', 10960, 1060, 'b'], ['Data', 11330, 620, 'p3-up'], ['Business processes', 11640, 1160, 'b']];
P3.EDGES = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [1, 5], [0, 3]];
P3.CREW = [['GRC', 196], ['Sec by design', 225], ['Infra sec', 254], ['IAM', 286], ['Cyber defense', 315], ['Resilience', 344]];
LAYERS.push(() => {
  const { STARS: N, EDGES: E, f } = P3;
  const star = (x, y, r) => `<path d="M${x},${y - r} Q${x + r * .18},${y - r * .18} ${x + r},${y} Q${x + r * .18},${y + r * .18} ${x},${y + r} Q${x - r * .18},${y + r * .18} ${x - r},${y} Q${x - r * .18},${y - r * .18} ${x},${y - r}Z"/>`;
  let s = `<g class="fl p3-sky" data-flag="p3-graph">${[1500, 1800, 2100, 2400].map(r => `<circle cx="9300" cy="2400" r="${r}" class="grat"/>`).join('')}`;
  E.forEach(([a, b], i) => { s += `<line x1="${N[a][1]}" y1="${N[a][2]}" x2="${N[b][1]}" y2="${N[b][2]}" class="${i % 3 === 0 ? 'hot flow' : ''}"/>`; });
  N.forEach(([, x, y], i) => { s += `<circle cx="${x}" cy="${y}" r="70" class="halo"/><g class="st${i % 3 === 0 ? ' blink' : ''}">${star(x, y, 64)}</g>`; });
  // faint field stars
  const R = rng(5);
  for (let i = 0; i < 70; i++) { const x = 8500 + R() * 3400, y = 260 + R() * 1100; s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(3 + R() * 7)}" class="dust"/>`; }
  s += '</g>';
  // the agents, one per team, moored in the lagoon, each taking its bearing on the graph
  s += `<g class="fl" data-flag="p3-crew">`;
  P3.CREW.forEach(([, a], i) => { const [x, y] = P3.pt(a, 430); s += `<g transform="translate(${f(x)} ${f(y)}) scale(1.8)"><path d="M-30,6 L30,6 L21,18 L-22,18Z" fill="#fff"/><path d="M-3,3 L-3,-46 L22,3Z" fill="var(--green)"/></g>`; });
  s += '</g>';
  // data lake + graph: the lake mirrors the sky
  s += `<g class="fl" data-flag="p3-mirror"><path d="M9300,2140 L9300,1180" stroke="var(--green)" stroke-width="6" stroke-dasharray="6 16" class="flow"/><circle cx="9300" cy="2140" r="22" fill="var(--green)"/></g>`;
  return s;
});

// scene 8 · Trust & TokenOps: a current that circles the atoll, Build → Run → Check
P3.GR = 1560;
LAYERS.push(() => {
  const { pt, f } = P3, R = P3.GR;
  const arc = (a0, a1) => { const pts = []; for (let i = 0; i <= 40; i++) pts.push(pt(a0 + (a1 - a0) * i / 40, R)); return 'M' + pts.map(p => p.map(v => f(v)).join(',')).join(' L'); };
  let s = `<g class="fl" data-flag="p3-gyre">`;
  [[282, 28], [52, 128], [152, 258]].forEach(([a, b]) => {
    s += `<path d="${arc(a, b)}" fill="none" stroke="var(--indigo)" stroke-width="44" opacity=".1"/><path d="${arc(a, b)}" fill="none" stroke="var(--indigo)" stroke-width="10" stroke-dasharray="40 26" class="flow"/>`;
    const [x, y] = pt(b, R), [x0, y0] = pt(b - 4, R), ang = Math.atan2(y - y0, x - x0) * 180 / Math.PI;
    s += `<path transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})" d="M40,0 L-40,-44 L-24,0 L-40,44Z" fill="var(--indigo)"/>`;
  });
  return s + '</g>';
});

// ════════════════════════════════════════════════════════════════════════
// SCENES
// ════════════════════════════════════════════════════════════════════════
P3.port = (t, html, f) => { const w = P3.side(t) === 'w', y = P3.pt(t.b, P3.land(t.b) + 40)[1]; return pin(w ? P3.LX.w : P3.LX.e, y, `<div class="p3-port ${w ? 'w' : 'e'}"><i>${t.name}</i>${html}</div>`, w ? 'r' : 'l', f); };

SCENES.push(
// 1 · waypoint card
{ ch: 'c3', type: 'waypoint', title: 'Waypoint 03 · Open sea', ref: 'Chapter 3: Cyber with AI', leg: 3, cam: { x: 9457, y: 2452, w: 8400 },
  onF: { 1: ['p3-zones', 'p3-z1'], 2: ['p3-z2'], 3: ['p3-z3'] },
  html: () => `${waypointCard({ n: '03', place: 'Open sea', theme: 'Cyber <em>with</em> AI', line: 'Defend at machine speed. Three sails to set, one at a time, from the outer waters into the lagoon.' })}
  <figure class="polar p3-photo" style="--r:1.6deg"><img src="${IMG.yacht3}" alt="">
    ${[19, 42, 65].map((x, i) => `<b class="p3-sn" style="left:${x}%"${fa(i + 1)}>${i + 1}</b>`).join('')}
    <figcaption>${P3.LV.map(([p, l], i) => `<span${fa(i + 1)}><i>Sail ${i + 1} · AI ≈ ${p}%</i>${l}</span>`).join('')}</figcaption></figure>
  ${[[1260, 'The outer waters'], [800, 'The atoll'], [330, 'The lagoon']].map(([r, t], i) => { const [x, y] = P3.pt(300, r); return pin(x, y, `<span class="p3-zl"><i>Sail ${i + 1}</i>${t}</span>`, 'l', i + 1, 'margin-left:1.6rem'); }).join('')}` },

// 2 · sail 1: use cases in every team
{ ch: 'c3', type: 'sail1', title: 'Sail 1 · Assist', ref: 'Level 1: AI acculturation', leg: 3, cam: { x: 9300, y: 1700, w: 7400 },
  on: ['p3-ports'], onF: { 1: ['p3-flags'] },
  notesPlus: `Le top 10 de l'acculturation, équipe par équipe. Chaque équipe a son propre port : les cas d'usage sont construits localement, sans route entre eux (c'est ce que le niveau 2 va changer). Fanions verts = ROI mesuré.`,
  html: () => `${P3.head(1, 'Level 1 · AI acculturation · the top 10', 'Use cases land <em>in every team</em>', 'Mostly built locally, they make existing tasks faster and better, and prove value quickly.', '54rem', true)}
  ${P3.TEAMS.map(t => P3.port(t, `<ul>${P3.UC[t.k].map(([u, r]) => `<li${fa(1)}><span>${u}</span>${r ? `<em class="p3-roi"${fa(2)}>${r}</em>` : ''}</li>`).join('')}</ul>`)).join('')}` },

// 3 · how to pick them
{ ch: 'c3', type: 'locks', title: 'Three locks, three months', ref: 'Deep dive: the right use cases', leg: 3, cam: { x: 10000, y: 1000, w: 4300 },
  on: ['p3-chan', 'p3-ideas0'], onF: { 1: ['p3-drivers'], 2: ['p3-lock1', 'p3-ideas1'], 3: ['p3-lock2', 'p3-ideas2'], 4: ['p3-lock3', 'p3-ideas3'] },
  notesPlus: `Grille d'idéation (à citer si question) :
Valeur = bénéfices directs / nouvelles capacités ; coûts et efficacité ; bénéfices indirects (image, culture d'innovation) ; aide à la décision.
Complexité = données (existence, accès, qualité) ; maturité technologique ; coût et compétences du projet ; impact organisationnel et risques.
Matrice valeur × complexité : forte valeur / faible complexité = quick wins ; forte / forte = initiatives stratégiques ; faible / faible = test & learn ; faible / forte = abandonner ou reclasser.
À l'écran : le chenal se resserre à chaque écluse, de moins en moins de bateaux passent ; l'échelle en bas est en mois (trois mois).`,
  html: () => { const { x0, x1, y, locks } = P3.CH, W = P3.chW;
    const L = [['Ideation', 'Test realism at once', 'Workshops with an AI maker, scored value × complexity'], ['First implementation', 'Build first demonstrators', 'Prompting &amp; no-code, ROI measured from day one'], ['Roadmap', 'Scale to full application', 'Make, buy or make-to-buy, with training &amp; change management']];
    return `${L.map(([k, b, s], i) => pin(locks[i], y - 470, `<div class="p3-lock"><i>Lock ${i + 1} · ${k}</i><b>${b}</b></div>`, 'p3-up', i + 2) + pin(locks[i], y + 290, `<div class="p3-lockd">${s}</div>`, 'b', i + 2)).join('')}
  ${pin(x0 - 470, y - 500, `<div class="p3-drv"><i>Driver</i>New value-adding activities</div>`, 'l', 1, 'margin-top:-1.2rem')}
  ${pin(x0 - 470, y + 500, `<div class="p3-drv"><i>Driver</i>Pain-point fixes</div>`, 'l', 1, 'margin-top:1.4rem')}
  ${pin(x1, y + 240, `<div class="p3-out"><i>Open sea</i>A few, at scale</div>`, 'b', 4)}
  ${pin(x0, y + 530, '<span class="p3-sc">0</span>', 'b')}${pin(x1, y + 530, '<span class="p3-sc">3 months</span>', 'b')}
  <div class="cart at-br p3-mx"${fa(2)}><span class="tab">Lock 1 · the ideation grid</span>
    <div class="p3-grid"><span class="ay">Value</span><span class="ax">Complexity</span>
      <div class="q g"><b>Quick wins</b><i>high value, low complexity</i></div><div class="q"><b>Strategic initiatives</b><i>high value, high complexity</i></div>
      <div class="q"><b>Test &amp; learn</b><i>low value, low complexity</i></div><div class="q x"><b>Abandon or reclassify</b><i>low value, high complexity</i></div></div></div>
  <div class="cart at-bl p3-lockhead"><span class="tab">Deep dive · a 3-month engagement</span><p class="kick">Level 1 · picking the right use cases</p>
    <h2 class="h s t">Three locks, <em>three months</em></h2><p class="p">Ideas come in from existing or already identified use cases, the Wavestone catalog and market feedback. Each lock lets fewer through; those that pass reach open water with a measured return.</p></div>`; } },

// 4 · sail 2: platform renewal
{ ch: 'c3', type: 'sail2', title: 'Sail 2 · Team up', ref: 'Level 2: platform renewal', leg: 3, cam: { x: 9300, y: 1700, w: 7400 },
  on: ['p3-plat'], onF: { 1: ['p3-road'], 2: ['p3-office'] },
  notesPlus: `Même carte qu'au niveau 1 : les ports deviennent des plateformes posées sur l'anneau de l'atoll, et une seule route les relie (le contexte partagé). Une plateforme à la fois. Le phare au milieu du lagon : le Cyber Data & AI Office.`,
  html: () => { const P = {
      grc: [['AI-native GRC', 'Continuous controls, compliance, TPRM, vendor risk', 'UK bank']],
      sbd: [['App security', 'Posture management, code &amp; pipeline security', 'EU manufacturing']],
      infra: [['Data security', 'DLP, DSPM, classification, data risk', 'US insurance']],
      iam: [['IGA / PAM', 'Machine &amp; agent identities, access governance']],
      def: [['AI SOC', 'Detect, investigate, respond, hunt', 'Global manufacturing'], ['AI pentest', 'Continuous exposure discovery, validation &amp; remediation', 'Global insurance']],
      res: [['Business continuity', 'Dependencies, impact analysis, recovery orchestration']] };
    return `${P3.head(2, 'Level 2 · platform renewal, one at a time', 'One road <em>round the atoll</em>', 'Integrated platforms share context automatically: faster insights, consistent policies, action across functions.', '54rem', true, `<p class="p3-ostrip"${fa(2)}>Scaling AI across cyber needs one approach: <b>create a Cyber Data &amp; AI Office</b></p>`)}
  ${P3.TEAMS.map(t => P3.port(t, P[t.k].map(([n, d, r]) => `<div class="p3-pf"><b>${n}</b><span>${d}</span>${r ? `<em>${r}</em>` : ''}</div>`).join(''))).join('')}
  ${pin(9300, 2060, '<span class="p3-otag">Cyber Data &amp; AI Office</span>', 'l', 2, 'margin-left:1.6rem')}`; } },

// 5 · two voyages
{ ch: 'c3', type: 'voyages', title: 'Two voyages, one objective', ref: 'Deep dive: two approaches', leg: 3, cam: { x: 9775, y: 2400, w: 7600 },
  on: ['p3-voy'], onF: { 1: ['p3-va'], 2: ['p3-vb'] },
  notesPlus: `Deux routes autour du même atoll, même point de départ, même arrivée. Au nord, l'assureur (3 étapes) ; au sud, le constructeur automobile (4 étapes).
Retirés de l'écran car non confirmés dans la source : durée et budget du programme assurance (« XX-year », « $XXX »), « 50 AI agents deployed in the SOC », « XX tools consolidated ».`,
  html: () => { const A = ['Unify governance, processes &amp; technology', 'Strengthen data visibility &amp; control', 'Remediate risk at scale'];
    const B = ['Embed AI by design', 'Unify the platform', 'Upskill teams', 'Align staffing, ownership &amp; partners'];
    const lab = (b, t, i, f, up) => { const [x, y] = P3.pt(b, P3.VR + 110); return pin(x, y, `<div class="p3-leg ${up ? 'a' : 'b'}"><i>${i + 1}</i>${t}</div>`, up ? 'p3-up' : 'b', f); };
    return `<div class="cart at-tr w-s p3-logc"${fa(1)}><span class="tab">Log · north about</span><p class="kick">Insurance</p><h3>Enterprise data protection at scale</h3>
      <div class="p3-figs"><div><b>${odo(1500)}</b><span>applications in the data ecosystem</span></div><div><b>${odo(65000)}</b><span>collaboration sites</span></div><div><b>${odo(50000)}</b><span>file shares</span></div><div><b>${odo(40)}<small>PB</small></b><span>of data</span></div></div></div>
    <div class="cart at-br w-s p3-logc"${fa(2)}><span class="tab">Log · south about</span><p class="kick">Automotive</p><h3>An AI-first CISO operating model</h3>
      <div class="p3-figs"><div><b>${odo(21)}<small>months</small></b><span>programme</span></div><div><b>€${odo(3.6, 1)}<small>M</small></b><span>investment</span></div><div><b>${odo(10)}<small>FTEs</small></b><span>mobilized</span></div><div><b>${odo(40)}</b><span>AI workflows targeted by end-2026</span></div></div></div>
    ${A.map((t, i) => lab(P3.VA[i], t, i, 1, true)).join('')}${B.map((t, i) => lab(P3.VB[i], t, i, 2, false)).join('')}
    ${pin(...P3.pt(0, P3.VR), `<div class="p3-obj"><i>Level 2 · deep dive</i><b>Two approaches,<br><em>one objective</em></b></div>`, 'l', null, 'margin-left:2.6rem')}`; } },

// 6 · sail 3: the lagoon
{ ch: 'c3', type: 'sail3', title: 'Sail 3 · Machine speed', ref: 'Level 3: machine speed', leg: 3, cam: { x: 9300, y: 2240, w: 4700 },
  on: ['p3-lake'], onF: { 1: ['p3-in'], 2: ['p3-agents', 'p3-out'] },
  notesPlus: `Le lagon de l'atoll EST le Cyber Data Lake. Les rivières qui y entrent : les sources (SOC/EDR, CTI/vulnérabilités, actifs/configurations, GRC/TPRM/risques), via API. Les bateaux du lagon : les agents, sur une plateforme d'IA agentique. Les rivières qui en sortent : les actions, via MCP et API.`,
  html: () => `${P3.head(3, 'Level 3 · cyber at machine speed', 'The lagoon is <em>your data</em>', 'Machine speed needs one data foundation for agentic operations.', '29rem')}
  ${P3.SRC.map(([t, y]) => pin(7880, y, `<span class="p3-src">${t}</span>`, 'r', 1)).join('')}
  ${pin(8380, 2700, '<span class="p3-api">APIs in</span>', 'b', 1)}
  ${P3.ACT.map(([t, y]) => pin(10760, y, `<span class="p3-act">${t}</span>`, 'l', 2)).join('')}
  ${pin(10300, 2700, '<span class="p3-api g">MCP &amp; APIs out</span>', 'b', 2)}
  <div class="cart at-bl p3-step"${fa(1)}><span class="tab">Step 1</span><b>Build your <em>cyber data lake</em></b><span>Fragmented, slow cyber data becomes real-time context. Collect, enrich and normalize it through APIs.</span></div>
  <div class="cart at-br p3-step"${fa(2)}><span class="tab">Step 2</span><b>Use an <em>agentic AI platform</em></b><span>Built on your existing processes and control models. Delegate actions with the right level of human oversight.</span></div>
  <div class="cart at-tr p3-shift"${fa(3)}><span class="tab">The shift</span><div><s>Defensive</s><span>react to incidents, team by team</span></div><i>→</i><div><b>Proactive</b><span>anticipate drift in real time, act across teams</span></div></div>` },

// 7 · navigate by the graph (night)
{ ch: 'c3', type: 'stars', title: 'Navigate by the graph', ref: 'Level 3: golden rules & cyber graph', leg: 3, night: true, cam: { x: 9950, y: 1500, w: 4800 },
  onF: { 1: ['p3-crew'], 2: ['p3-graph'], 3: ['p3-mirror'] },
  notesPlus: `Carte du ciel : le graphe cyber (IT et OT) est la constellation sur laquelle tous les agents prennent leur relèvement. Un agent par équipe du RSSI, au mouillage dans le lagon (le data lake). Data lake + graphe. Côté OT, l'humain reste dans la boucle.
Contenu marqué « IN THE WORKS » dans la source : à valider.`,
  html: () => `<div class="cart at-tl w-s p3-rules"><span class="tab">Rules of the watch</span><p class="kick">Level 3 · golden rules</p><h2 class="h s t">Navigate <em>by the graph</em></h2>
    <ul class="log">
      <li><i>i.</i><span><b>Set decision rights.</b> Risk appetite set by the business, with escalation thresholds.</span></li>
      <li><i>ii.</i><span><b>Govern agents.</b> Identity, rights, traceability and audit for every one.</span></li>
      <li><i>iii.</i><span><b>Embed experts.</b> Cyber experts inside business, IT and OT teams.</span></li></ul></div>
  ${P3.CREW.map(([t, a]) => { const [x, y] = P3.pt(a, 430); return pin(x, y + 50, `<span class="p3-crew">${t}</span>`, 'b', 1); }).join('')}
  ${P3.STARS.map(([t, x, y, p]) => pin(x, y, `<span class="p3-star">${t}</span>`, p, 2, p === 'p3-up' ? 'margin-top:-1.6rem' : 'margin-top:1.6rem')).join('')}
  ${pin(10500, 300, '<span class="p3-const">The cyber graph · IT &amp; OT</span>', '', 2)}
  ${pin(9300, 1700, '<span class="p3-mir">data lake + graph</span>', 'l', 3, 'margin-left:1rem')}
  <div class="cart at-br w-s p3-ot"${fa(3)}><span class="tab">One sky for every agent</span><b>Data lake <em>+</em> graph</b><span>Every agent reads the same graph of the whole estate. In OT, a human stays in the loop.</span></div>` },

// 8 · keep the engine honest
{ ch: 'c3', type: 'tokenops', title: 'Keep the engine honest', ref: 'Trust & TokenOps', leg: 3, cam: { x: 10560, y: 2400, w: 8800 },
  on: ['p3-office'], onF: { 1: ['p3-gyre'] },
  html: () => { const { pt, GR } = P3;
    const D = [['eye', 'Observe', 'performance', 'Know what agents do, and how well', ['Quality &amp; evaluation', 'Reliability &amp; observability', 'Decision traceability'], 38],
      ['shield', 'Preserve', 'trust', 'Keep humans accountable for every delegated action', ['Human oversight', 'Ownership &amp; accountability'], 62],
      ['dollar', 'Control', 'cost over time', 'Keep the platform sustainable as usage scales', ['Cost management', 'Maintenance lifecycle', 'Change &amp; model governance'], 48]];
    const dial = v => { const a = Math.PI * (1 - v / 100); return `<svg viewBox="0 0 120 70" class="p3-dial"><path d="M10,62 A50,50 0 0,1 110,62" class="bg"/><path d="M10,62 A50,50 0 0,1 ${(60 + 50 * Math.cos(Math.PI * .35)).toFixed(1)},${(62 - 50 * Math.sin(Math.PI * .35)).toFixed(1)}" class="ok"/>${[0, .25, .5, .75, 1].map(t => { const b = Math.PI * (1 - t); return `<line x1="${(60 + 42 * Math.cos(b)).toFixed(1)}" y1="${(62 - 42 * Math.sin(b)).toFixed(1)}" x2="${(60 + 50 * Math.cos(b)).toFixed(1)}" y2="${(62 - 50 * Math.sin(b)).toFixed(1)}" class="tk"/>`; }).join('')}<line x1="60" y1="62" x2="${(60 + 40 * Math.cos(a)).toFixed(1)}" y2="${(62 - 40 * Math.sin(a)).toFixed(1)}" class="nd"/><circle cx="60" cy="62" r="5" class="hb"/></svg>`; };
    return `${pin(...pt(270, GR), `<div class="p3-loop c"><b>Build</b><span>Continuously adapt agents and data</span></div>`, 'p3-up', 1, 'margin-top:-1.4rem')}
  ${pin(...pt(40, GR), `<div class="p3-loop"><b>Run</b><span>Experts in the loop</span></div>`, 'l', 1, 'margin-left:1.4rem;margin-top:1.4rem')}
  ${pin(...pt(140, GR), `<div class="p3-loop r"><b>Check</b><span>Independent check of trust, efficiency and cost</span></div>`, 'r', 1, 'margin-left:-1.4rem;margin-top:1.4rem')}
  ${pin(9300, 2060, '<span class="p3-otag">Cyber Data &amp; AI Office</span>', 'l', null, 'margin-left:1.6rem')}
  <div class="cart at-r p3-panel"><span class="tab">Trust &amp; TokenOps</span><p class="kick">Run it for real</p><h2 class="h s t">Keep the engine <em>honest</em></h2>
    <p class="p">Agents that stay observable, trusted and affordable.</p>
    ${D.map(([ic, a, b, l, items, v], i) => `<div class="p3-inst"${fa(i + 2)}>${dial(v)}<div><b>${a} <em>${b}</em></b><span>${l}</span><p class="p3-items">${items.join(' · ')}</p></div></div>`).join('')}</div>`; } },
);
