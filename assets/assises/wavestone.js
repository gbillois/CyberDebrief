// ─── Wavestone edition ───────────────────────────────────────────────────
// Inlined by tools/build-assises.py after deck.js, before the first scene is
// drawn. Content scenes go on the white ground (.lt), photo scenes on the
// indigo brand ground (.br); arcs are drawn on arrival, an indigo sweep
// carries the camera between grounds and onto chapter cards.
const WS_BRAND = ['title', 'press', 'question', 'shifts', 'chapter', 'waters', 'fund', 'crew', 'human', 'closing', 'end'];
const wsMode = s => (WS_BRAND.includes(s.type) ? 'br' : 'lt');
const WS_ARCS = `<svg class="ws-arcs" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true"><path class="a1" d="M-20 720 C 420 850, 980 840, 1620 540"/><path class="a2" d="M540 940 C 820 660, 1240 600, 1620 680"/></svg>`;
const WS_DECO = `<div class="lt-deco" aria-hidden="true"><svg viewBox="0 0 1600 900" preserveAspectRatio="none"><path d="M880 -40 C 1120 170, 1380 230, 1660 170"/><path class="g" d="M1080 -60 C 1240 130, 1440 300, 1680 330"/><path d="M-40 860 C 300 790, 620 830, 900 940"/></svg><i class="dots"></i></div>`;
const WS_YACHT = ['assets/assises/yacht-1.jpg', 'assets/assises/yacht-2.jpg', 'assets/assises/yacht-3.jpg'];

SCENES.forEach(s => {
  const html = s.html, m = wsMode(s);
  const arcs = ['title', 'question'].includes(s.type) ? WS_ARCS : '';
  // on the title, the wordmark sits on a white pill: the indigo logo, as on Wavestone covers
  const fix = h => (s.type === 'title' ? h.replace('assets/assises/wavestone.svg', 'assets/assises/wavestone-indigo.svg') : h);
  s.html = () => (m === 'lt' ? WS_DECO : '') + fix(html()) + arcs;
});

let wsPrev = null;
function wsDress(el) {
  const s = SCENES[idx], m = wsMode(s);
  el.classList.add(m);
  document.body.classList.toggle('lthud', m === 'lt');
  const lv = (s.title.match(/^Level (\d)/) || [])[1], meta = el.querySelector('.lvmeta');
  if (lv && meta && !meta.querySelector('.lvph')) {
    meta.innerHTML = `<div class="lvph"><img src="${WS_YACHT[lv - 1]}" alt=""></div><div class="lvcol">${meta.innerHTML}</div>`;
  }
  if (wsPrev && (wsPrev !== m || s.type === 'chapter')) {
    const w = document.getElementById('ws-wipe');
    w.classList.remove('go'); void w.offsetWidth; w.classList.add('go');
  }
  wsPrev = m;
}
if (!PRESENTER) {
  document.body.insertAdjacentHTML('beforeend', '<div id="ws-wipe" aria-hidden="true"></div>');
  new MutationObserver(ms => ms.forEach(r => r.addedNodes.forEach(n => { if (n.nodeType === 1 && n.classList.contains('scene')) wsDress(n); })))
    .observe(document.getElementById('stage'), { childList: true });
  // a slow parallax on the arcs, following the pointer
  document.addEventListener('mousemove', e => {
    document.body.style.setProperty('--mx', (e.clientX / innerWidth - .5).toFixed(3));
    document.body.style.setProperty('--my', (e.clientY / innerHeight - .5).toFixed(3));
  });
}
