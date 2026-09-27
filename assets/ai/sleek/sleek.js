// Sleek edition: extra photos, and the motion layer (words that rise into
// focus, a giant numeral on chapter cards). Inlined by tools/build-talk-sleek.py
// after the photo set, before the first scene is drawn.

// a few more screens get a photo on the dark stage
const SLEEKSET = {
  '16 July 2026': { bg: PH('racks', 'dark') },
  'No attacker': { bg: PH('servers', 'dark') },
  'Two kinds of risk': { bg: PH('keyboard', 'dark', '50% 30%') },
};
SCENES.forEach(s => { const p = SLEEKSET[s.title]; if (p && p.bg && !s.bg) s.bg = p.bg; });

const SK_WORDS = '.h, .chap-q, .rc-a, .fin-a, .ug-h, .cl-a, .doc-title, .wd-t, .ask-q, .cr2-h, .dt-sub';
function skSplit(el) {
  if (el.dataset.skw) return; el.dataset.skw = 1;
  let i = 0;
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const parts = n.textContent.split(/(\s+)/);
        if (parts.every(p => !p.trim())) return;
        const frag = document.createDocumentFragment();
        parts.forEach(p => {
          if (!p) return;
          if (!p.trim()) { frag.appendChild(document.createTextNode(p)); return; }
          const w = document.createElement('span'); w.className = 'sk-w'; w.style.setProperty('--i', i++); w.textContent = p; frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !/^(svg|sup|br)$/i.test(n.tagName) && !n.classList.contains('count')) walk(n);
    });
  };
  walk(el);
}
function skDress(scene) {
  scene.querySelectorAll(SK_WORDS).forEach(skSplit);
  const k = scene.querySelector('.chap-k'), c = scene.querySelector('.chap2');
  if (k && c && !c.querySelector('.sk-num')) {
    const m = k.textContent.match(/Part\s+(\d+)/);
    if (m) c.insertAdjacentHTML('afterbegin', `<div class="sk-num" aria-hidden="true">${String(m[1]).padStart(2, '0')}</div>`);
  }
}
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1 && n.classList.contains('scene')) skDress(n); })))
  .observe(document.getElementById('stage'), { childList: true });
