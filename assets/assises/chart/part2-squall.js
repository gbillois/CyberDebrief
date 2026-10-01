// ════════════════════════════════════════════════════════════════════════
// PART 2 · THE SQUALL (17 - 26 min) · Cyber against AI · a night chart
// Region x 5600-8700, y 3300-6900. Waypoint 02 at (7000,4700).
// Five storm cells on a squall line, the wind field, the new watch (a
// 48-hour dial), the hull section of virtual patching, a regatta of tempos.
// ════════════════════════════════════════════════════════════════════════

// ─── helpers ────────────────────────────────────────────────────────────
// sample a Catmull-Rom curve through pts, every ~step units
function p2Sample(pts, step = 12) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const n = Math.max(2, Math.round(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step));
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => .5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}
// a weather front: the line, with triangles on its right-hand side, every gap units
function p2Front(pts, gap = 190, size = 62) {
  const S = p2Sample(pts, 8); let acc = 0, next = gap * .5, tri = '';
  for (let i = 1; i < S.length; i++) {
    const [ax, ay] = S[i - 1], [bx, by] = S[i], L = Math.hypot(bx - ax, by - ay); acc += L;
    if (acc >= next) {
      next += gap; const ux = (bx - ax) / L, uy = (by - ay) / L, nx = -uy, ny = ux;
      tri += `M${(bx - ux * size * .6).toFixed(1)},${(by - uy * size * .6).toFixed(1)} L${(bx + nx * size).toFixed(1)},${(by + ny * size).toFixed(1)} L${(bx + ux * size * .6).toFixed(1)},${(by + uy * size * .6).toFixed(1)}Z`;
    }
  }
  return `<path class="p2-front-l draw" pathLength="1" d="${smoothPath(pts)}"/><path class="p2-front-t" d="${tri}"/>`;
}
// an arc on a dial: from 12 o'clock, clockwise, deg degrees
function p2Arc(cx, cy, r, deg) {
  const pt = a => [(cx + r * Math.sin(a * Math.PI / 180)).toFixed(1), (cy - r * Math.cos(a * Math.PI / 180)).toFixed(1)];
  if (deg >= 359.9) return `M${pt(0)} A${r},${r} 0 1 1 ${pt(180)} A${r},${r} 0 1 1 ${pt(359.9)}`;
  return `M${pt(0)} A${r},${r} 0 ${deg > 180 ? 1 : 0} 1 ${pt(deg)}`;
}
// a small sailing boat, bow to the east
const p2Boat = (x, y, s, sail = 'var(--lav)', wake = true) => `<g transform="translate(${x} ${y}) scale(${s})">${wake ? `<path d="M-46,18 L-150,10 M-46,22 L-130,30" stroke="var(--lav)" stroke-width="3" opacity=".5" fill="none"/>` : ''}<path d="M-40,8 L40,8 L28,24 L-30,24Z" fill="#fff"/><path d="M-4,4 L-4,-62 L30,4Z" fill="${sail}"/><path d="M-10,4 L-10,-48 L-34,4Z" fill="${sail}" opacity=".6"/></g>`;

// ─── the five squalls ───────────────────────────────────────────────────
// cells along a squall line north of waypoint 02; one per case
const P2C = [
  { x: 5880, y: 4400, R: 230, seed: 31, img: 'phishing', n: '5×', t: 'AI-powered phishing, more efficient than human-crafted', c: 'AI-enabled social engineering' },
  { x: 6470, y: 4250, R: 255, seed: 37, img: 'mythos', n: () => `${odo(10000)}+`, t: 'vulnerabilities found, chained and exploited autonomously, in one month', c: 'Mythos' },
  { x: 7350, y: 4220, R: 245, seed: 41, img: 'ransomware', n: '&lt; 30 min', t: 'to deploy adaptive ransomware end to end, testing dozens of attack paths', c: 'JadePuffer' },
  { x: 8000, y: 4300, R: 255, seed: 43, img: 'swarm', n: () => odo(700), t: 'self-organizing agents, one 5&#8209;phase covert attack, 3 organizations breached', c: 'Hugging Face / OpenAI' },
  { x: 8540, y: 4460, R: 220, seed: 47, img: 'gov', n: '1 agent', t: 'breached government files, bypassing existing access controls', c: 'Australian government / OpenAI' },
];
const P2_FRONT = [[5560, 4560], [5880, 4400], [6470, 4250], [6930, 4200], [7350, 4220], [8000, 4300], [8540, 4460], [8760, 4600]];
const P2_ISLET = [8100, 6100];
function p2Cell(c, i) {
  const { x, y, R, seed } = c, ri = R * .5, id = `p2c${i}`;
  let s = `<g class="fl" data-flag="p2-c${i + 1}">`;
  // rain: slanted hatching, clipped to the cell
  s += `<clipPath id="${id}r"><path d="${blob(x, y, R * 1.02, seed, .2)}"/></clipPath><g clip-path="url(#${id}r)" class="p2-rain">`;
  for (let k = -R * 1.6; k < R * 1.6; k += 30) s += `<line x1="${(x + k + R * .35).toFixed(0)}" y1="${y - R * 1.1}" x2="${(x + k - R * .35).toFixed(0)}" y2="${y + R * 1.1}"/>`;
  s += `</g>`;
  // isobars, churning slowly
  s += `<g class="p2-churn" style="animation-duration:${50 + i * 9}s">${[1.18, 1, .82, .64].map((f, j) => `<path class="p2-iso${j === 0 ? ' out' : ''}" d="${blob(x, y, R * f, seed + j * 5, .13 - j * .015)}"/>`).join('')}</g>`;
  // the wind, turning anticlockwise around the low
  for (let k = 0; k < 4; k++) {
    const a0 = k / 4 * 6.283 + seed, a1 = a0 - .6, r = R * 1.36;
    s += `<path class="p2-gyre" d="M${(x + Math.cos(a0) * r).toFixed(1)},${(y + Math.sin(a0) * r).toFixed(1)} A${r},${r} 0 0 0 ${(x + Math.cos(a1) * r).toFixed(1)},${(y + Math.sin(a1) * r).toFixed(1)}" marker-end="url(#p2-ah)"/>`;
  }
  // the threat, at the eye
  s += `<circle cx="${x}" cy="${y}" r="${ri + 14}" class="p2-eye"/><clipPath id="${id}i"><circle cx="${x}" cy="${y}" r="${ri}"/></clipPath><image href="${IMG[c.img]}" x="${x - ri}" y="${y - ri}" width="${ri * 2}" height="${ri * 2}" clip-path="url(#${id}i)"/>`;
  return s + `</g>`;
}
LAYERS.push(() => {
  let s = `<defs><marker id="p2-ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10z" fill="var(--coral)"/></marker>
    <marker id="p2-ahw" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L10,5 L0,10z" fill="var(--lav)"/></marker>
    <marker id="p2-ahg" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3.4" markerHeight="3.4" orient="auto"><path d="M0,0 L10,5 L0,10z" fill="var(--coral)"/></marker></defs>`;
  s += `<radialGradient id="p2-hz"><stop offset="0" style="stop-color:var(--coral);stop-opacity:.22"/><stop offset="1" style="stop-color:var(--coral);stop-opacity:0"/></radialGradient>
    <g class="fl" data-flag="p2-haze">${[[5900, 4050, 700, 420], [6700, 3880, 900, 480], [7600, 3900, 800, 460], [8400, 4100, 700, 420]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#p2-hz)"/>`).join('')}</g>`;
  s += `<g class="fl" data-flag="p2-front">${p2Front(P2_FRONT).replace('class="p2-front-l draw"', 'class="p2-front-l draw" data-flag="p2-front"')}<text class="p2-wname" x="6935" y="3870">the squall line</text></g>`;
  s += P2C.map(p2Cell).join('');
  // landfall: the robot on the islet
  const [ix, iy] = P2_ISLET;
  s += `<g class="fl" data-flag="p2-robot"><circle cx="${ix}" cy="${iy - 90}" r="230" class="p2-land-ring"/><circle cx="${ix}" cy="${iy - 90}" r="240" class="p2-land-ring pulse"/>
    <clipPath id="p2ri"><circle cx="${ix}" cy="${iy - 150}" r="120"/></clipPath><circle cx="${ix}" cy="${iy - 150}" r="134" class="p2-eye"/><image href="${IMG.robot}" x="${ix - 120}" y="${iy - 270}" width="240" height="240" clip-path="url(#p2ri)"/>
    <path class="p2-landfall draw" data-flag="p2-robot" pathLength="1" d="M8800,4600 C8950,5100 8650,5560 8290,5760" marker-end="url(#p2-ah)"/></g>`;
  return s;
});

// ─── the wind field: same sea, faster wind ───────────────────────────────
LAYERS.push(() => {
  const r = rng(77); let calm = '', gust = '';
  for (let x = 5300; x <= 8900; x += 360) for (let y = 3900; y <= 6100; y += 320) {
    const jx = x + (r() - .5) * 140 + ((y / 320) % 2) * 180, jy = y + (r() - .5) * 100;
    if (Math.hypot(jx - 7000, jy - 4700) < 220 || Math.hypot(jx - P2_ISLET[0], jy - P2_ISLET[1]) < 340) continue;
    const a = -.32 + (r() - .5) * .35, c = Math.cos(a), sn = Math.sin(a);
    calm += `<path d="M${(jx - c * 50).toFixed(0)},${(jy - sn * 50).toFixed(0)} L${(jx + c * 50).toFixed(0)},${(jy + sn * 50).toFixed(0)}" marker-end="url(#p2-ahw)"/>`;
    const L = 170 + r() * 60;
    gust += `<path d="M${(jx - c * L).toFixed(0)},${(jy - sn * L).toFixed(0)} L${(jx + c * L).toFixed(0)},${(jy + sn * L).toFixed(0)}" marker-end="url(#p2-ahg)" style="animation-delay:-${(r() * .7).toFixed(2)}s"/>`;
  }
  return `<g class="fl p2-calm" data-flag="p2-wind">${calm}</g><g class="fl p2-gust" data-flag="p2-gust">${gust}</g>`;
});

// ─── the new watch: a 48-hour dial ──────────────────────────────────────
const P2D = { x: 6900, y: 5800, R: 640 };
const P2W = [
  { k: 'Detect', h: 24, r: 560, t: '&lt; 24h' },
  { k: 'Contain', h: 3, r: 482, t: '&lt; 3h', hot: true },
  { k: 'Remediate', h: 24, r: 404, t: '&lt; 24h' },
  { k: 'Rebuild', h: 48, r: 326, t: '&lt; 2 days' },
];
LAYERS.push(() => {
  const { x, y, R } = P2D;
  let s = `<g class="fl" data-flag="p2-dial"><circle cx="${x}" cy="${y}" r="${R + 110}" class="p2-bezel"/><circle cx="${x}" cy="${y}" r="${R}" class="p2-face"/>`;
  for (let h = 0; h < 48; h++) {
    const a = h * 7.5 * Math.PI / 180, l = h % 6 ? 22 : 48, sx = Math.sin(a), cy = Math.cos(a);
    s += `<line x1="${(x + sx * R).toFixed(1)}" y1="${(y - cy * R).toFixed(1)}" x2="${(x + sx * (R - l)).toFixed(1)}" y2="${(y - cy * (R - l)).toFixed(1)}" class="p2-tick${h % 6 ? '' : ' maj'}"/>`;
    if (!(h % 6)) s += `<text class="p2-hr" x="${(x + sx * (R + 58)).toFixed(1)}" y="${(y - cy * (R + 58) + 12).toFixed(1)}">${h ? h + 'h' : '0 · 48h'}</text>`;
  }
  // tracks
  P2W.forEach(w => { s += `<circle cx="${x}" cy="${y}" r="${w.r}" class="p2-track"/>`; });
  s += `<circle cx="${x}" cy="${y}" r="232" class="p2-hub"/>`;
  s += `<line x1="${x}" y1="${y - R}" x2="${x}" y2="${y - 232}" class="p2-zero"/></g>`;
  // the four clocks, drawn one per click
  P2W.forEach((w, i) => {
    s += `<g class="fl" data-flag="p2-w${i + 1}"><path class="p2-arc draw${w.hot ? ' hot' : ''}" data-flag="p2-w${i + 1}" pathLength="1" d="${p2Arc(x, y, w.r, w.h / 48 * 360)}"/>
      <text class="p2-ring-l" x="${x - 26}" y="${y - w.r + 11}">${w.k}</text></g>`;
  });
  // the hub: obsolete critical assets, kept under 5%
  const wedge = 18 * Math.PI / 180, hr = 200;
  s += `<g class="fl" data-flag="p2-w5"><circle cx="${x}" cy="${y}" r="${hr}" class="p2-pie"/><path class="p2-wedge" d="M${x},${y} L${x},${y - hr} A${hr},${hr} 0 0 1 ${(x + hr * Math.sin(wedge)).toFixed(1)},${(y - hr * Math.cos(wedge)).toFixed(1)}Z"/></g>`;
  return s;
});

// ─── patch at sea: the hull section, eight decks of virtual patching ─────
const P2H = { x: 7350, top: 4930, bot: 5830, w: 350 };
const P2L = [['Edge / internet', 'WAF, CDN, reverse proxy, API gateway'], ['Network', 'Firewall rules, IPS, NDR, micro-segmentation'], ['Endpoint / workload', 'EDR, XDR, application control'], ['Runtime / application', 'RASP, feature flags, configuration changes'], ['Cloud / containers', 'Network policies, CNAPP, admission controllers, service mesh'], ['Virtualization', 'VM isolation, NSX policies, hypervisor controls'], ['Identity &amp; access', 'Conditional access, PAM, MFA enforcement, privilege restrictions'], ['Detection &amp; response', 'SIEM, SOAR, threat hunting, automated containment']];
const p2DeckY = i => P2H.top + (P2H.bot - P2H.top) * (i + .5) / 8;
// the starboard side of the hull, as a list of points (top to keel)
function p2Side() {
  const { x, top, bot, w } = P2H, h = bot - top, pts = [[x + w, top], [x + w, top + h * .38]];
  const P = [[x + w, top + h * .38], [x + w, top + h * .9], [x + w * .72, bot], [x + w * .2, bot]];
  for (let k = 1; k <= 24; k++) { const t = k / 24, u = 1 - t; pts.push([0, 1].map(j => u * u * u * P[0][j] + 3 * u * u * t * P[1][j] + 3 * u * t * t * P[2][j] + t * t * t * P[3][j])); }
  return pts;
}
const p2EdgeX = y => { const S = p2Side(); for (let i = 1; i < S.length; i++) if (S[i][1] >= y) { const [ax, ay] = S[i - 1], [bx, by] = S[i]; return ax + (bx - ax) * (y - ay) / ((by - ay) || 1); } return P2H.x; };
LAYERS.push(() => {
  const { x, top, bot, w } = P2H, h = bot - top, S = p2Side();
  const right = S.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`), left = S.slice().reverse().map(([a, b]) => `${(2 * x - a).toFixed(1)},${b.toFixed(1)}`);
  const hull = `M${right.join(' L')} L${x + w * .07},${bot + 70} L${x - w * .07},${bot + 70} L${left.join(' L')}Z`;
  let s = `<g class="fl" data-flag="p2-hull"><clipPath id="p2hc"><path d="${hull}"/></clipPath>`;
  s += `<path d="${hull}" class="p2-hullbg"/><g clip-path="url(#p2hc)">`;
  for (let i = 0; i < 8; i++) {
    const y0 = top + h * i / 8;
    s += `<rect x="${x - w - 10}" y="${y0}" width="${w * 2 + 20}" height="${(i === 7 ? h / 8 + 80 : h / 8).toFixed(1)}" class="p2-deck fl" data-flag="p2-decks" style="transition-delay:${(i * .16).toFixed(2)}s;--o:${(.5 - i * .045).toFixed(2)}"/>`;
    if (i) s += `<line x1="${x - w - 10}" y1="${y0}" x2="${x + w + 10}" y2="${y0}" class="p2-deckline"/>`;
    s += `<text class="p2-deckn" x="${x}" y="${(y0 + h / 16 + 11).toFixed(1)}">${String(i + 1).padStart(2, '0')}</text>`;
  }
  s += `</g><path d="${hull}" class="p2-hull"/>`;
  // the waterline, the mast stub and the section mark
  const wl = top + h / 8;
  s += `<line x1="${x - w - 300}" y1="${wl}" x2="${x + w + 60}" y2="${wl}" class="p2-wl"/>
    <line x1="${x - w - 40}" y1="${top}" x2="${x + w + 40}" y2="${top}" class="p2-hull" style="stroke-width:10"/>
    <line x1="${x}" y1="${top}" x2="${x}" y2="${top - 110}" class="p2-hull" style="stroke-width:10"/>
    <text class="p2-sec" x="${x}" y="${bot + 150}">Section A · A</text>`;
  // decks' leader lines towards the labels
  for (let i = 0; i < 8; i++) { const y = p2DeckY(i), ex = p2EdgeX(y) - 34, d = `transition-delay:${(i * .16).toFixed(2)}s`; s += `<line x1="${ex}" y1="${y}" x2="${x + w + 110}" y2="${y}" class="p2-lead fl" data-flag="p2-decks" style="${d}"/><circle cx="${ex}" cy="${y}" r="8" class="p2-dot fl" data-flag="p2-decks" style="${d}"/>`; }
  return s + `</g>`;
});

// ─── three crews in the race ────────────────────────────────────────────
// one boat = 5% of the market
const P2R = { start: [[5860, 5880], [5860, 6240]], mark: P2_ISLET };
const P2F = [
  { flag: 'p2-crA', at: [6260, 6070], boats: [[0, 0], [-120, -90], [-150, 90], [100, 70]] },
  { flag: 'p2-crB', at: [7060, 6050], boats: [[0, 0], [-140, -90], [-160, 90], [120, -85], [-300, 0], [140, 95], [-20, 125], [-270, -100]] },
  { flag: 'p2-crC', at: [7760, 6000], boats: [[0, 0]] },
];
LAYERS.push(() => {
  const [[sx, sy0], [, sy1]] = P2R.start, [mx, my] = P2R.mark, sm = (sy0 + sy1) / 2;
  let s = `<g class="fl" data-flag="p2-course"><line x1="${sx}" y1="${sy0}" x2="${sx}" y2="${sy1}" class="p2-startline"/>
    <circle cx="${sx}" cy="${sy0}" r="24" class="p2-buoy"/><circle cx="${sx}" cy="${sy1}" r="24" class="p2-buoy"/>
    <text class="p2-cl" x="${sx}" y="${sy1 + 80}">Start</text>
    <path d="M${sx + 40},${sm} C${sx + 900},${sm + 20} ${mx - 900},${my - 140} ${mx - 300},${my - 160}" class="p2-rhumb"/>
    <path d="M${mx - 300},${my - 160} A280,280 0 1 1 ${mx - 230},${my + 170}" class="p2-round" marker-end="url(#p2-ahm)"/>
    <marker id="p2-ahm" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L10,5 L0,10z" fill="var(--green)"/></marker>
    <text class="p2-cl g" x="${mx + 300}" y="${my - 260}">AI speed</text></g>`;
  P2F.forEach((f, i) => {
    s += `<g class="fl" data-flag="${f.flag}">${f.boats.map(([dx, dy]) => p2Boat(f.at[0] + dx, f.at[1] + dy, 1.05, i === 2 ? 'var(--green)' : 'var(--lav)')).join('')}</g>`;
  });
  return s;
});

// ════════════════════════════════════════════════════════════════════════
SCENES.push(
{ ch: 'c2', type: 'p2-wp', title: 'Waypoint 02 · The squall', ref: 'Chapter 2: Cyber against AI', leg: 2, night: true,
  cam: { x: 6950, y: 4560, w: 3600 }, on: ['p2-front', 'p2-haze'],
  html: () => waypointCard({ n: '02', place: 'The squall', theme: 'Cyber <em>against</em> AI', line: 'Reset the defensive baseline. AI did not invent new threats: <b>it changed their tempo.</b>', photo: IMG.yacht2, cap: 'Second sail set. Weather building.' }),
  vo: `Deuxième voile, deuxième waypoint : le grain. Cyber against AI : remettre à niveau la ligne de défense. L'IA n'a pas inventé de nouvelles menaces. Elle a changé leur tempo.`,
  notesPlus: `La nuit tombe à l'arrivée sur le waypoint : tout le chapitre se joue sur la carte de nuit. La ligne de grain apparaît au nord du bateau.` },

{ ch: 'c2', type: 'p2-squalls', title: 'Five squalls', ref: 'Faster waters', leg: 2, night: true,
  cam: { x: 7200, y: 4890, w: 4600 }, on: ['p2-front', 'p2-haze'],
  onF: { 1: ['p2-c1'], 2: ['p2-c2'], 3: ['p2-c3'], 4: ['p2-c4'], 5: ['p2-c5'], 6: ['p2-robot'] },
  html: () => `${P2C.map((c, i) => pin(c.x, c.y + c.R * 1.3, `<div class="p2-case"><b>${typeof c.n === 'function' ? c.n() : c.n}</b><p>${c.t}</p><small>${c.c}</small></div>`, 'b', i + 1)).join('')}
  ${pin(P2_ISLET[0] - 290, P2_ISLET[1] - 150, `<div class="p2-case r"><small>Next, landfall</small><p class="p2-land">AI is coming to the <em>physical world</em></p></div>`, 'r', 6)}
  <div class="cart at-bl w-m"><span class="tab">Cyber against AI</span><p class="kick">Five squalls, one season</p>
    <h2 class="h s t">The threat has entered <em>faster waters</em></h2>
    <p class="p2-catch"${fa(7)}>Defenders need to <b>catch up.</b></p></div>`,
  notesPlus: `Une cellule de grain par clic (5), puis l'IA touche terre (le robot sur l'îlot : le monde physique), puis la conclusion.
Les images de menace sont au centre de chaque cellule. Les cinq cas : phishing IA 5× plus efficace que l'humain ; Mythos, 10 000+ vulnérabilités découvertes, chaînées et exploitées en un mois ; JadePuffer, rançongiciel adaptatif déployé de bout en bout en moins de 30 minutes ; 700 agents auto-organisés, attaque furtive en 5 phases, 3 organisations touchées ; 1 agent qui accède à des fichiers gouvernementaux en contournant les contrôles d'accès.` },

{ ch: 'c2', type: 'p2-speed', title: 'Same sea, faster wind', ref: 'It changed the speed', leg: 2, night: true,
  cam: { x: 7000, y: 5000, w: 3400 }, on: ['p2-wind'], onF: { 3: ['p2-gust'] },
  html: () => `<div class="cart at-tl w-m"><span class="tab">The chart has not changed</span><p class="kick">Same sea</p>
    <h2 class="h s t">AI did not change <em>the fundamentals</em></h2>
    <ul class="log p2-grow">
      <li${fa(1)}><i>i.</i><span><b>Zero trust</b> remains the right model.</span></li>
      <li${fa(2)}><i>ii.</i><span><b>Proven security approaches</b> still apply.</span></li></ul></div>
  <div class="p2-beaufort at-tr"><p class="mono">Wind force · Beaufort</p><div class="p2-bf">${[...Array(13)].map((_, i) => `<i style="--i:${i}"></i>`).join('')}</div>
    <div class="p2-bf-l"><span class="calm">Force 4 · moderate breeze</span><span class="hard"${fa(3)}>Force 11 · violent storm</span></div></div>
  <div class="statement p2-speed"${fa(3)}><p class="big">It changed <em>the speed.</em></p></div>`,
  notesPlus: `Clics : zero trust, puis les approches éprouvées. Marquer un temps. Dernier clic : le vent passe de force 4 à force 11 sur toute la carte, « it changed the speed ».` },

{ ch: 'c2', type: 'p2-watch', title: 'The new watch', ref: 'A new defensive baseline', leg: 2, night: true,
  cam: { x: 7640, y: 5800, w: 3600 }, on: ['p2-dial'], onF: { 1: ['p2-w1'], 2: ['p2-w2'], 3: ['p2-w3'], 4: ['p2-w4'], 5: ['p2-w5'] },
  html: () => `${pin(P2D.x, P2D.y, `<div class="p2-hubl"><b>&lt;5%</b><span>obsolete</span></div>`, '', 5)}
  <div class="cart p2-watch"><span class="tab">The new watch</span><p class="kick">A new defensive baseline</p>
    <h2 class="h s t">Five targets, and the authority to act <em>without waiting for business approval</em></h2>
    <ol class="p2-rows">
      <li${fa(1)}><i>01</i><div><b>Detect</b><em>&lt; 24h</em><p>Every new internet-facing asset detected, and assigned.</p><small>Continuous external attack-surface scanning · automatic CMDB reconciliation · owner and criticality within 24h</small></div></li>
      <li${fa(2)} class="hot"><i>02</i><div><b>Contain</b><em>&lt; 3h</em><p>A critical exposure contained, <span class="p2-nosign">no business sign-off</span></p><small>Pre-approved isolation scenarios · a cyber emergency authority · network and application kill-switches tested quarterly</small></div></li>
      <li${fa(3)}><i>03</i><div><b>Remediate</b><em>&lt; 24h</em><p>Exploited exposed assets: patched, or kept protected.</p><small>Exposure-first queue · 24/7 cyber, IT and app-owner task force · three options: patch, virtual patch or isolate</small></div></li>
      <li${fa(4)}><i>04</i><div><b>Rebuild</b><em>&lt; 2 days</em><p>Any critical system, from a trusted baseline.</p><small>Hardened golden images · infrastructure and configuration as code · a real-life rebuild test every quarter</small></div></li>
      <li${fa(5)}><i>05</i><div><b>Reduce</b><em>&lt; 5%</em><p>Obsolete critical assets, kept below the line.</p><small>Inventory infrastructure, installed software and libraries · a named owner and exit date per exception · monthly backlog review at executive level</small></div></li></ol>
    <p class="p2-cond"${fa(6)}>Technical projects to go faster, yes. But only with <b>IT and cyber governance</b>, and <b>the budget</b> to sustain them.</p></div>`,
  vo: `Il faut donc une nouvelle ligne de base défensive : un nouveau quart, avec l'autorité d'agir sans attendre la validation des métiers. Détecter en moins de 24 heures tout nouvel actif exposé sur Internet, et lui attribuer un propriétaire. Contenir une exposition critique en moins de trois heures, sans validation métier. Corriger ou protéger en moins de 24 heures tout actif exposé exploité. Reconstruire tout système critique en moins de deux jours. Et garder l'obsolescence critique sous les 5 %. Des projets techniques, oui, mais uniquement avec une gouvernance IT et cyber, et le budget pour tenir dans la durée.`,
  notesPlus: `Le cadran couvre 48 heures : chaque anneau est un objectif de temps (Detect, Contain, Remediate, Rebuild), le moyeu est l'objectif d'obsolescence (moins de 5 %).
Ne pas citer « 24 / 48 / 72 » (diapo de clôture source incohérente avec ces cibles).` },

{ ch: 'c2', type: 'p2-patch', title: 'Patch at sea', ref: 'Deep dive: vulnerability operations', leg: 2, night: true,
  cam: { x: 7200, y: 5350, w: 3200 }, on: ['p2-hull'], onF: { 1: ['p2-decks'] },
  html: () => `<div class="p2-tree"><p class="kick">Deep dive · remediate</p><h2 class="h s t">Which patch, <em>how fast</em></h2>
    <div class="p2-paper"><img src="${IMG.vulnops}" alt="Decision tree: published exploit? on the KEV? automatable? technical impact, then the SLA"></div>
    <p class="p2-sla"><span class="r">3 days + forensic triage</span><span class="o">14 days</span><span class="g">60 days</span><span class="s">next system upgrade</span></p></div>
  <div class="p2-stack-h"${fa(1)}><p class="kick">Until the patch lands</p><h2 class="h s">Virtual patching, <em>deck by deck</em></h2></div>
  ${P2L.map(([a, b], i) => pin(P2H.x + P2H.w + 130, p2DeckY(i), `<div class="p2-deck-l"><b>${a}</b><span>${b}</span></div>`, 'l', 1, `transition-delay:${(.2 + i * .16).toFixed(2)}s`)).join('')}`,
  notesPlus: `À gauche : savoir quoi corriger et en combien de temps. Exploit publié ? Dans le catalogue KEV (Known Exploited Vulnerabilities, CISA) ? Automatisable ? Impact technique total ou partiel ? On en déduit le délai : 3 jours avec analyse forensique, 14 jours, 60 jours, ou correction à la prochaine montée de version.
Clic : à droite, la coupe de coque : huit ponts de patch virtuel pour tenir en attendant le correctif, de la bordure Internet (au-dessus de la ligne de flottaison) jusqu'à la détection et réponse (les pompes de cale).` },

{ ch: 'c2', type: 'p2-race', title: 'Three crews in the race', ref: 'Three tempos', leg: 2, night: true,
  cam: { x: 7180, y: 5640, w: 3200 }, on: ['p2-course'], onF: { 1: ['p2-crA'], 2: ['p2-crB'], 3: ['p2-crC'] },
  html: () => {
    const C = [
      [P2F[0], '~20%', 'Trying to keep up', 'Create remediation task forces', ['<b>Regain control of obsolescence:</b> retire unsupported versions, close every MFA gap', '<b>Rework patch industrialization</b> to meet SLAs on internet-facing systems', '<b>Clear the backlogs:</b> close critical exploitable gaps, re-assess underperforming tools (CMDB, EDR)']],
      [P2F[1], '~40%', 'Building the new base', 'Run a transformation program', ['<b>Agentify and automate</b> cyber operations', '<b>Rethink platforms and processes</b>, patch management included', '<b>Deploy</b> new tools, <b>refresh</b> legacy ones, <b>introduce</b> deception']],
      [P2F[2], '~5%', 'Ready to accelerate', 'Industrialize', ['<b>Operate cyber as a modern IT function:</b> IaC, CI/CD, SDLC', 'Operate a <b>transformed RUN</b>', 'Look for <b>AI accelerators</b>']]];
    return `${C.map(([f, v, h, s, l], i) => pin(f.at[0] - (i === 1 ? 70 : 0), 5850, `<div class="p2-crew${i === 2 ? ' lead' : ''}"><b class="v">${v}</b><h4>${h}</h4><h5>${s}</h5><ul>${l.map(x => `<li>${x}</li>`).join('')}</ul></div>`, 't', i + 1)).join('')}
    <div class="cart at-tl p2-race-h"><span class="tab">Market view · three tempos</span>
      <h2 class="h s t">Investment is heavy. <em>Visions are uneven.</em></h2>
      <p class="p2-key"><svg viewBox="-40 -64 80 92"><path d="M-40,8 L40,8 L28,24 L-30,24Z" fill="#fff"/><path d="M-4,4 L-4,-62 L30,4Z" fill="var(--lav)"/></svg>one boat = 5% of the market</p></div>
    <div class="p2-race-end at-tr"${fa(4)}>The actions are known.<b>Now, move at AI speed.</b></div>`; },
  vo: `Où en est le marché ? Trois équipages, trois tempos. Environ 20 % essaient de suivre : ils montent des task forces de remédiation, reprennent l'obsolescence, vident les backlogs. 40 % construisent la nouvelle base, avec un vrai programme de transformation. Et seulement 5 % sont prêts à accélérer : ils opèrent la cyber comme une fonction IT moderne, en tant que code. L'investissement est lourd, mais les visions restent inégales. Les actions sont connues : il faut maintenant avancer à la vitesse de l'IA.`,
  notesPlus: `Chaque bateau représente 5 % du marché : 4 bateaux (20 %), 8 bateaux (40 %), 1 bateau (5 %). Les parts ne totalisent pas 100 % : le reste du marché n'a pas encore de démarche structurée (à confirmer avant la session, donc non dessiné).` },
);
