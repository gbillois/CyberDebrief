// ─── start-up and controls ───────────────────────────────────────────────
if (PRESENTER) presenter();
else {
  const start = () => {
    buildChart();
    const m = location.hash.match(/^#(\d+)(?:\.(\d+))?/);
    idx = -1; go(m ? +m[1] - 1 : 0, m && m[2] ? +m[2] : 0);
    cam = { ...camFor(SCENES[idx], frag) }; fly = null;
    requestAnimationFrame(frame);
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
  document.addEventListener('click', e => { if (e.target.closest('a,button,.ov,#c-prog')) return; next(); });
  addEventListener('resize', () => { setView(cam); placePins(); });
  chan && chan.addEventListener('message', e => {
    if (e.data.type !== 'cmd') return;
    if (e.data.cmd === 'next') next(); else if (e.data.cmd === 'prev') prev();
    else if (e.data.cmd === 'black') document.body.classList.toggle('black');
    else if (e.data.cmd === 'hello') sync();
  });
  let t; const wake = () => { document.body.classList.remove('idle'); clearTimeout(t); t = setTimeout(() => document.body.classList.add('idle'), 3500); };
  document.addEventListener('mousemove', wake); wake();
}
