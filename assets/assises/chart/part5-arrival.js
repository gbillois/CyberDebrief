// ════════════════════════════════════════════════════════════════════════
// PART 5 · ARRIVAL (40 min) · the whole voyage, then the last words
// ════════════════════════════════════════════════════════════════════════
const TAKE = [
  ['reef', 'Waypoint 01 · Cyber for AI', 'Secure the ecosystem', 'Find your agents, fence their platforms, name every one. Prepare for resilience and open-weight models.', 'b', 'margin-top:2rem'],
  ['squall', 'Waypoint 02 · Cyber against AI', 'Reset the defensive baseline', 'Hold the new watch. Take ownership of the defensive moves, before the next squall.', 'b', 'margin-top:2rem'],
  ['lagoon', 'Waypoint 03 · Cyber with AI', 'Defend at machine speed', 'Accelerate your teams, renew the major platforms, build your cyber graph.', 't', 'margin-top:-2rem'],
  ['cape', 'Waypoint 04 · The crew', 'Bet on your teams', 'Upskill them, give them ownership, break the silos to scale.', 'b', 'margin-top:2rem'],
];
SCENES.push(
{ ch: 'e', type: 'arrival', title: 'Your heading for Monday', ref: 'How do you lead the shift?', leg: 4, cam: { x: 6400, y: 3700, w: 13400 }, onF: { 1: [], 2: [], 3: [], 4: [] },
  html: () => `<div class="cart at-tl w-m" style="top:5.6rem"><span class="tab">Arrival</span><p class="kick">40 minutes, four waypoints</p><h2 class="h t">Your heading <em>for Monday</em></h2></div>
  ${TAKE.map(([wp, k, b, s, cls, st], i) => { const [x, y] = WORLD.WP[wp]; return pin(x, y, `<div class="take"><i>${k}</i><b>${b}</b><span>${s}</span></div>`, cls, i + 1, st); }).join('')}
  <div class="cart at-bl" style="display:flex;align-items:center;gap:1.2rem;padding:1rem 1.2rem"${fa(4)}><img src="${IMG.qr}" alt="QR code" style="width:6rem;height:6rem"><span class="mono" style="color:var(--mute);line-height:1.8">The full 2026<br>AI Cyber Benchmark</span></div>` },

{ ch: 'e', type: 'end', title: 'Thank you', ref: 'Thank you', leg: 4, night: true, chrome: false, cam: { x: 6400, y: 3600, w: 17000 },
  html: () => `<div class="endline"><p class="kick" style="justify-content:center;color:var(--green)">Les Assises 2026</p><div class="big t" style="margin-top:1.2rem">Lead the <em>Shift.</em></div>
    <p class="sub"><img src="${IMG.ws}" alt="Wavestone">Thank you · Claire Carré · Gérôme Billois</p></div>` },
);
