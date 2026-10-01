// ════════════════════════════════════════════════════════════════════════
// LEAD THE SHIFT · The Chart edition · engine
// Built into assises-chart.html by tools/build-assises.py, followed by the
// part files (part0-open.js … part5-arrival.js) and boot.js. SCRIPT (what to
// say and the notes, per old scene title) is injected first from deck.js.
//
// The talk is one nautical chart, WORLD.W × WORLD.H units. A scene is:
//   { ch, title, ref,            ref = deck.js title whose script/notes apply
//     cam: {x, y, w},            camera centre and visible width, in units
//     camF: {2: {x, y, w}},      camera per click (optional)
//     night: true,               indigo night chart (optional)
//     leg: 2,                    the boat has reached waypoint 2 (route drawn)
//     on: ['reef'], onF: {1: ['reef-hatch']},   chart flags (data-flag) to show
//     chrome: false,             hide the frame (title cards)
//     html: () => '...' }        overlay: cartouches, pins, text
// Chart drawings are pushed to LAYERS (SVG strings in world units); elements
// with class "fl" and data-flag="a b" appear when one of their flags is on,
// class "draw" (with pathLength="1") draws itself when on.
// Overlay elements with data-at="x,y" stay pinned to that chart point.
// ════════════════════════════════════════════════════════════════════════

const IMG = {
  yacht0: 'assets/assises/yacht-0.jpg', yacht1: 'assets/assises/yacht-1.jpg', yacht2: 'assets/assises/yacht-2.jpg', yacht3: 'assets/assises/yacht-3.jpg',
  crew: 'assets/assises/yacht-crew.jpg', regatta: 'assets/assises/regatta.jpg', lighthouse: 'assets/assises/lighthouse.jpg', mountain: 'assets/assises/mountain.jpg',
  seaTop: 'assets/assises/sea-top.jpg', wave: 'assets/assises/wave.jpg', storm: 'assets/assises/storm-boat-2.jpg',
  claire: 'assets/assises/claire.png', gerome: 'assets/assises/gerome.png', assises: 'assets/assises/les-assises.jpg',
  ws: 'assets/assises/wavestone.svg', wsI: 'assets/assises/wavestone-indigo.svg', markW: 'assets/assises/w-mark.svg', markI: 'assets/assises/w-mark-indigo.svg',
  qr: 'assets/assises/qr-benchmark.png', robot: 'assets/assises/robot.png', vulnops: 'assets/assises/vulnops.jpg', lhIcon: 'assets/assises/lighthouse-icon.png',
  phishing: 'assets/assises/threat-phishing.png', mythos: 'assets/assises/threat-mythos.png', ransomware: 'assets/assises/threat-ransomware.png', swarm: 'assets/assises/threat-swarm.png', gov: 'assets/assises/threat-gov.png',
  cbd: 'assets/assises/agents/cyber-by-design.png', cbd2: 'assets/assises/agents/cyber-by-design-2.png', identivex: 'assets/assises/agents/identivex.png', crisis: 'assets/assises/agents/crisismaker.png',
  idAnalyzer: 'assets/assises/agents/identity-analyzer.png', autoBench: 'assets/assises/agents/auto-benchmark.png',
  press: ['assets/assises/press/p51.jpg', 'assets/assises/press/p53.jpg', 'assets/assises/press/p54.jpg', 'assets/assises/press/p56.jpg', 'assets/assises/press/p57.jpg', 'assets/assises/press/p59.jpg', 'assets/assises/press/p60.jpg', 'assets/assises/press/p62.jpg', 'assets/assises/press/p63.jpg', 'assets/assises/press/p65.jpg', 'assets/assises/press/p68.jpg', 'assets/assises/press/p55.jpg'],
};

const WORLD = { W: 12000, H: 7000,
  WP: { harbour: [1500, 5300], reef: [4500, 2500], squall: [7000, 4700], lagoon: [9300, 2400], cape: [10700, 5200] } };
const ROUTE = ['harbour', 'reef', 'squall', 'lagoon', 'cape'];
const CH = {
  p:  { n: '00', title: 'Casting off', mins: [0, 6] },
  c1: { n: '01', title: 'The agentic reef', mins: [6, 17] },
  c2: { n: '02', title: 'The squall', mins: [17, 26] },
  c3: { n: '03', title: 'Open sea, machine speed', mins: [26, 36] },
  c4: { n: '04', title: 'The crew', mins: [36, 40] },
  e:  { n: '05', title: 'Heading for Monday', mins: [40, 40] },
};
const LAYERS = [];
const SCENES = [];

// ─── helpers for part files ─────────────────────────────────────────────
const ICONS = {
  search: '<circle cx="11" cy="11" r="7.5"/><path d="M21 21l-4.6-4.6"/>', user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  cloud: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>', file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', dollar: '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  radar: '<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>', anchor: '<circle cx="12" cy="5" r="3"/><path d="M12 22V8M5 12H2a10 10 0 0 0 20 0h-3"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z"/>', key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3L21 2M16 7l3 3"/>',
};
const ICON = n => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ''}</svg>`;
const fa = f => (f == null ? '' : ` data-f="${f}"`);
const fmtN = (v, dec) => v.toLocaleString('en-GB', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const odo = (v, dec = 0) => `<span class="odo">${[...fmtN(v, dec)].map(ch => /\d/.test(ch) ? `<span class="dg" data-d="${ch}"><span class="col">${'0123456789'.split('').map(d => `<span>${d}</span>`).join('')}</span></span>` : `<span class="sym">${ch}</span>`).join('')}</span>`;
// a label pinned to a chart point; cls: '' centre, 'l' left-anchored, 'r', 't' above, 'b' below
const pin = (x, y, html, cls = '', f = null, style = '') => `<div class="pin ${cls}" data-at="${x},${y}"${fa(f)}${style ? ` style="${style}"` : ''}>${html}</div>`;
// seeded noise, organic closed shapes, isobaths
const rng = seed => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
function blob(cx, cy, R, seed, amp = .14, sx = 1, sy = 1, n = 72) {
  const r = rng(seed), H = [2, 3, 4, 5, 7, 9].map(k => [k, (r() * amp) / Math.sqrt(k), r() * 6.283]);
  const pts = [];
  for (let i = 0; i < n; i++) { const a = i / n * 6.283; let k = 1; H.forEach(([h, A, p]) => { k += A * Math.sin(h * a + p); }); pts.push([cx + Math.cos(a) * R * k * sx, cy + Math.sin(a) * R * k * sy]); }
  // closed Catmull-Rom → cubic Bézier
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) { const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`; }
  return d + 'Z';
}
// an island with its isobaths; o: {seed, amp, sx, sy, rings, step, label}
function island(cx, cy, R, o = {}) {
  const seed = o.seed || 7, rings = o.rings ?? 4, step = o.step || R * .16;
  let s = `<path class="c-shoal" d="${blob(cx, cy, R + step * 1.4, seed, o.amp, o.sx, o.sy)}"/>`;
  for (let i = rings; i >= 1; i--) s += `<path class="c-iso${i === 1 ? ' solid' : ''}" d="${blob(cx, cy, R + step * i, seed + i * 3, (o.amp || .14) * (1 - i * .08), o.sx, o.sy)}" style="opacity:${1 - i * .16}"/>`;
  return s + `<path class="c-land" d="${blob(cx, cy, R, seed, o.amp, o.sx, o.sy)}"/>`;
}
const smoothPath = pts => { let d = `M${pts[0][0]},${pts[0][1]}`; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2; d += `C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`; } return d; };
function rose(x, y, r) {
  let s = `<g class="c-rose" transform="translate(${x} ${y})"><circle r="${r}" stroke-width="3"/><circle r="${r * .82}" stroke-width="1.5"/>`;
  for (let i = 0; i < 32; i++) { const a = i / 32 * 6.283, l = i % 8 === 0 ? .62 : i % 4 === 0 ? .74 : .9; s += `<line x1="${Math.cos(a) * r * l}" y1="${Math.sin(a) * r * l}" x2="${Math.cos(a) * r}" y2="${Math.sin(a) * r}" stroke-width="1.5"/>`; }
  for (let i = 0; i < 4; i++) { const a = i * 90; s += `<path transform="rotate(${a})" d="M0,${-r * .78} L${r * .09},0 L0,${r * .09} L${-r * .09},0Z"/>`; }
  return s + `<text y="${-r - 24}">N</text></g>`;
}

// ─── the base chart ─────────────────────────────────────────────────────
function baseChart() {
  const { W, H } = WORLD, r = rng(11);
  let s = `<rect class="c-sea" x="-4000" y="-4000" width="${W + 8000}" height="${H + 8000}"/>`;
  for (let x = 0; x <= W; x += 1000) s += `<line class="c-grid" x1="${x}" y1="-4000" x2="${x}" y2="${H + 4000}"/>`;
  for (let y = 0; y <= H; y += 1000) s += `<line class="c-grid" x1="-4000" y1="${y}" x2="${W + 4000}" y2="${y}"/>`;
  for (let x = 1000; x < W; x += 2000) for (let y = 1000; y < H; y += 2000) s += `<text class="c-gridl" x="${x + 14}" y="${y - 14}">${String(47 - y / 1000).padStart(2, '0')}°${String(x / 200).padStart(2, '0')}′</text>`;
  // soundings, kept clear of land
  const land = [[1050, 5900, 900], [3700, 1700, 1100], [9300, 2400, 1350], [11400, 6500, 1300], [6200, 1500, 360], [8100, 6100, 300], [2500, 3000, 260]];
  for (let i = 0; i < 520; i++) {
    const x = r() * W, y = r() * H;
    if (land.some(([lx, ly, lr]) => (x - lx) ** 2 + (y - ly) ** 2 < lr * lr)) continue;
    s += `<text class="c-snd" x="${x.toFixed(0)}" y="${y.toFixed(0)}">${Math.floor(8 + r() * 90)}</text>`;
  }
  s += island(1050, 5900, 560, { seed: 3, amp: .2 });
  s += island(3700, 1700, 760, { seed: 5, amp: .18, sx: 1.15 });
  s += island(9300, 2400, 980, { seed: 9, amp: .12, rings: 3 }) + `<path class="c-sea" d="${blob(9300, 2400, 600, 21, .1)}" style="stroke:var(--coast);stroke-width:3"/>`;
  s += island(11400, 6500, 1000, { seed: 13, amp: .16, sx: 1.2 });
  s += island(6200, 1500, 200, { seed: 17, rings: 2 }) + island(8100, 6100, 170, { seed: 19, rings: 2 }) + island(2500, 3000, 150, { seed: 23, rings: 2 });
  s += rose(2300, 4300, 260) + rose(8000, 900, 200);
  s += `<text class="c-water" x="6000" y="3550" style="font-size:150px;letter-spacing:60px;opacity:.18">THE AI OCEAN</text>`;
  return s;
}
function routeLayer() {
  const P = ROUTE.map(k => WORLD.WP[k]);
  const ctrl = [[2700, 4500], [3300, 2900], [5500, 3300], [6200, 4600], [8000, 4500], [8400, 3000], [9900, 3700], [10200, 4700]];
  let s = `<path class="c-route-ghost" d="${smoothPath([P[0], ctrl[0], ctrl[1], P[1], ctrl[2], ctrl[3], P[2], ctrl[4], ctrl[5], P[3], ctrl[6], ctrl[7], P[4]])}"/>`;
  const legs = [[P[0], ctrl[0], ctrl[1], P[1]], [P[1], ctrl[2], ctrl[3], P[2]], [P[2], ctrl[4], ctrl[5], P[3]], [P[3], ctrl[6], ctrl[7], P[4]]];
  legs.forEach((l, i) => { s += `<path class="c-route c-leg" id="leg${i + 1}" data-leg="${i + 1}" d="${smoothPath(l)}"/>`; });
  ROUTE.forEach((k, i) => { const [x, y] = WORLD.WP[k]; s += `<g class="c-wp" data-wp="${i}" transform="translate(${x} ${y})"><circle r="26"/><text x="44" y="10">${String(i).padStart(2, '0')}</text></g>`; });
  s += `<g id="boat"><circle r="60" class="pulse"/><path class="hull" d="M-40,8 L40,8 L28,24 L-30,24Z"/><path class="sail" d="M-4,4 L-4,-62 L30,4Z"/><path class="sail" d="M-10,4 L-10,-48 L-34,4Z" style="opacity:.6"/></g>`;
  return s;
}

// ════════════════════════════════════════════════════════════════════════
// CAMERA AND SCENES
// ════════════════════════════════════════════════════════════════════════
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const svg = () => $('#chart');
let cam = { x: WORLD.W / 2, y: WORLD.H / 2, w: WORLD.W }, fly = null, idx = 0, frag = 0, cur = null, boat = { leg: 0, t: 1 }, legLen = [];
const chan = 'BroadcastChannel' in window ? new BroadcastChannel('lead-the-shift-chart') : null;
const PRESENTER = location.hash.startsWith('#presenter');
const ref = s => s.ref || s.title;
const say = s => s.vo || (SCRIPT[ref(s)] || {}).vo || '';
const notes = s => [s.notesPlus, (SCRIPT[ref(s)] || {}).notes].filter(Boolean).join('\n\n');

// smooth zoom, after van Wijk & Nuij (the same path d3.interpolateZoom draws)
function zoomPath(a, b) {
  const rho = 1.25, r2 = rho * rho, r4 = r2 * r2, dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy, d1 = Math.sqrt(d2);
  if (d1 < 1e-3) { const S = Math.log(b.w / a.w) / rho; return { S: Math.abs(S), at: t => ({ x: a.x + dx * t, y: a.y + dy * t, w: a.w * Math.exp(rho * t * S) }) }; }
  const b0 = (b.w * b.w - a.w * a.w + r4 * d2) / (2 * a.w * r2 * d1), b1 = (b.w * b.w - a.w * a.w - r4 * d2) / (2 * b.w * r2 * d1);
  const q0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), q1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1), S = (q1 - q0) / rho;
  const ch = Math.cosh(q0), sh = Math.sinh(q0);
  return { S, at: t => { const s = t * S, u = a.w / (r2 * d1) * (ch * Math.tanh(rho * s + q0) - sh); return { x: a.x + u * dx, y: a.y + u * dy, w: a.w * ch / Math.cosh(rho * s + q0) }; } };
}
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
function flyTo(target) {
  const from = { ...cam }, path = zoomPath(from, target);
  const ms = Math.max(1100, Math.min(3400, 900 + Math.abs(path.S) * 900));
  fly = { path, t0: performance.now(), ms, target };
}
function setView(c) {
  const W = innerWidth, H = innerHeight, h = c.w * H / W;
  svg().setAttribute('viewBox', `${(c.x - c.w / 2).toFixed(2)} ${(c.y - h / 2).toFixed(2)} ${c.w.toFixed(2)} ${h.toFixed(2)}`);
}
const toScreen = (x, y) => { const W = innerWidth, H = innerHeight, h = cam.w * H / W; return [(x - cam.x + cam.w / 2) / cam.w * W, (y - cam.y + h / 2) / h * H]; };
function placePins() { $$('#ov-layer [data-at]').forEach(el => { const [x, y] = el.dataset.at.split(',').map(Number), [sx, sy] = toScreen(x, y); el.style.left = sx + 'px'; el.style.top = sy + 'px'; }); }
function placeBoat(t) {
  const b = $('#boat'); if (!b) return;
  let x, y, ang = 0;
  if (boat.leg === 0) { [x, y] = WORLD.WP.harbour; }
  else { const p = $(`#leg${boat.leg}`), L = legLen[boat.leg], at = p.getPointAtLength(L * boat.t), a2 = p.getPointAtLength(Math.min(L, L * boat.t + 8)); x = at.x; y = at.y; ang = Math.atan2(a2.y - at.y, a2.x - at.x); }
  const flip = Math.cos(ang) < 0 ? -1 : 1;
  b.setAttribute('transform', `translate(${x} ${y + Math.sin(t / 700) * 6}) scale(${flip} 1) scale(${Math.max(1, cam.w / 3600)})`);
}
function frame(t) {
  requestAnimationFrame(frame);
  if (fly) {
    const k = Math.min(1, (t - fly.t0) / fly.ms);
    cam = fly.path.at(ease(k));
    if (boat.moving) boat.t = ease(k);
    if (k >= 1) { cam = { ...fly.target }; fly = null; boat.moving = false; boat.t = 1; }
  }
  // the camera breathes a little when at rest
  const drift = fly ? { x: 0, y: 0 } : { x: Math.sin(t / 5200) * cam.w * .003, y: Math.cos(t / 6100) * cam.w * .002 };
  const real = cam; cam = { x: real.x + drift.x, y: real.y + drift.y, w: real.w };
  setView(cam); placePins(); placeBoat(t);
  cam = real;
}

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
    const host = o.closest('[data-f]'), on = el.classList.contains('live') && (!host || host.classList.contains('on')), dg = $$('.dg', o);
    dg.forEach((g, i) => { const c = g.firstChild, d = on ? +g.dataset.d : 0, delay = on ? `${.4 + (dg.length - i) * .09}s` : '0s'; c.style.transitionDelay = delay; g.style.transitionDelay = delay; c.style.transform = `translateY(-${d}em)`; g.style.width = c.children[d].getBoundingClientRect().width + 'px'; });
  });
}
const maxF = (s, el) => Math.max(0, ...$$('[data-f]', el).map(n => +n.dataset.f), ...Object.keys(s.camF || {}).map(Number), ...Object.keys(s.onF || {}).map(Number));
function flagsFor(s, k) { const on = new Set(s.on || []); Object.entries(s.onF || {}).forEach(([f, l]) => { if (k >= +f) l.forEach(x => on.add(x)); }); return on; }
function camFor(s, k) { let c = s.cam; Object.entries(s.camF || {}).sort((a, b) => a[0] - b[0]).forEach(([f, v]) => { if (k >= +f) c = { ...c, ...v }; }); return c; }
function applyFrag(el, k, first) {
  const s = SCENES[idx];
  $$('[data-f]', el).forEach(n => n.classList.toggle('on', +n.dataset.f <= k));
  rollOdos(el); setTimeout(() => { if (cur === el) rollOdos(el); }, 700);
  const on = flagsFor(s, k);
  $$('#chart [data-flag]').forEach(n => n.classList.toggle('on', n.dataset.flag.split(' ').some(f => on.has(f))));
  const c = camFor(s, k);
  if (first || Math.abs(c.x - cam.x) + Math.abs(c.y - cam.y) + Math.abs(c.w - cam.w) > 1) flyTo(c);
}
function render(i, k) {
  const s = SCENES[i];
  document.body.classList.toggle('night', !!s.night);
  document.body.classList.toggle('hide-chrome', s.chrome === false);
  // the route: legs up to s.leg are drawn, the boat sails the newest one
  const leg = s.leg ?? 0;
  if (leg !== boat.leg) { boat.moving = leg === boat.leg + 1; boat.leg = leg; boat.t = boat.moving ? 0 : 1; }
  $$('#chart .c-leg').forEach(p => { const n = +p.dataset.leg; p.style.transition = n === leg && boat.moving ? 'stroke-dashoffset 2.6s cubic-bezier(.6,0,.2,1)' : 'none'; p.style.strokeDasharray = n <= leg ? '22 16' : `0 ${legLen[n] + 10}`; });
  $$('#chart .c-wp').forEach(g => g.classList.toggle('done', +g.dataset.wp <= leg));
  const el = document.createElement('section');
  el.className = `scene t-${s.type || 'x'}`;
  el.innerHTML = s.html ? s.html() : '';
  $$('.t:not(.pin)', el).forEach(splitWords);
  el._max = maxF(s, el);
  $('#ov-layer').appendChild(el);
  const old = cur; cur = el;
  if (old) { old.classList.remove('live'); old.classList.add('leaving'); setTimeout(() => old.remove(), 700); }
  frag = Math.max(0, Math.min(k === 'end' ? el._max : k, el._max));
  placePins();
  requestAnimationFrame(() => { el.classList.add('live'); applyFrag(el, frag, true); });
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
  $('#c-pos').innerHTML = `<b>${c.n}</b> · ${c.title}`;
  $('#c-count').textContent = `${String(idx + 1).padStart(2, '0')} / ${SCENES.length}`;
  $$('#c-prog div').forEach(d => { const [a, b] = d.dataset.r.split('-').map(Number); const p = idx > b ? 100 : idx < a ? 0 : ((idx - a + (cur && cur._max ? frag / (cur._max + 1) : 1)) / (b - a + 1)) * 100; d.firstChild.style.width = p + '%'; });
  if ($('#notes').classList.contains('open')) showNotes();
  $('#subs').textContent = say(s);
  chan && chan.postMessage({ type: 'state', idx, frag, max: cur ? cur._max : 0 });
}
function buildChart() {
  svg().innerHTML = `<g id="w-base">${baseChart()}</g><g id="w-layers">${LAYERS.map(l => typeof l === 'function' ? l() : l).join('')}</g><g id="w-route">${routeLayer()}</g>`;
  $$('#chart .c-leg').forEach(p => { legLen[+p.dataset.leg] = p.getTotalLength(); p.style.strokeDasharray = `0 ${legLen[+p.dataset.leg] + 10}`; });
  $('#c-brand').innerHTML = `<img class="mk-i" src="${IMG.markI}" alt=""><img class="mk-w" src="${IMG.markW}" alt="">Lead the Shift · Les Assises 2026`;
  $('#c-prog').innerHTML = Object.entries(groups()).map(([ch, l]) => `<div style="flex:${l.length}" data-r="${l[0]}-${l[l.length - 1]}" title="${CH[ch].n} · ${CH[ch].title}"><i></i></div>`).join('');
  $$('#c-prog div').forEach(d => d.addEventListener('click', e => { e.stopPropagation(); go(+d.dataset.r.split('-')[0]); }));
}
function buildOverview() {
  $('#ov').innerHTML = `<h2>The route</h2>` + Object.entries(groups()).map(([ch, l]) => `<div class="ov-ch"><h3>${CH[ch].n} · ${CH[ch].title}<span>${CH[ch].mins[0]} - ${CH[ch].mins[1]} min</span></h3><div class="ov-g">${l.map(i => `<button data-i="${i}" class="${i === idx ? 'cur' : ''}"><small>${i + 1}</small>${SCENES[i].title}</button>`).join('')}</div></div>`).join('');
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

// ─── shared patterns ────────────────────────────────────────────────────
// a waypoint card: n '01', place 'The agentic reef', a/em/b the theme, line, photo
function waypointCard({ n, place, theme, line, photo, cap }) {
  return `<div class="cart at-l w-m chap"><span class="tab">Waypoint ${n}</span>
    <div class="num">${n}</div><p class="kick">${place}</p><h2 class="h xl t">${theme}</h2><p class="p">${line}</p></div>
  ${photo ? `<figure class="polar" style="right:7rem;bottom:6rem;width:30rem;height:19rem;--r:2.5deg"><img src="${photo}" alt=""><figcaption>${cap || ''}</figcaption></figure>` : ''}`;
}
// "moves": the three things to do, as a row under a cartouche
const moves = (list, f) => `<div class="moves"${fa(f)}>${list.map(([b, s], i) => `<div class="move"><b><i>${['i.', 'ii.', 'iii.'][i]}</i>${b}</b><span>${s}</span></div>`).join('')}</div>`;
