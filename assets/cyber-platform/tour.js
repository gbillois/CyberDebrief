/* Cyber AI Platform demo: guided demo (story mode).
   A tour is a list of stops. Each stop opens a screen, brings the scenario
   to a given step, highlights an element and narrates. Steps that have a
   console link (step.see) are shown in that console, the others on the
   architecture view, so the audience sees both the concept and the product. */
(function () {
  'use strict';
  const CP = window.CP; const esc = CP.esc; const ui = CP.ui;

  /* Highlight target for a console stop. */
  const HOOKS = {
    'run/journal': 'run-journal', 'run/ops': 'run-ops', 'run/safety': 'run-safety', 'run/quality': 'run-quality',
    'engage/thirdparties': 'engage-campaign', 'engage/regulators': 'engage-regulators', 'engage/culture': 'tab-engage-culture', 'engage/comms': 'engage-outbox',
    'trust/lab': 'trust-lab', 'trust/deviation': 'trust-deviation', 'trust/redteam': 'trust-redteam',
    'build/backlog': 'build-backlog', 'build/pipeline': 'build-pipeline', 'ciso/': 'ciso-feed'
  };

  /* Bring scenario sid to step index i: earlier steps run instantly (gates
     approved), step i runs live so it animates and its gate stays pending. */
  function reach(sid, i) {
    let st = CP.player.status();
    if (!st.scenario || st.scenario.id !== sid || st.index > i) { CP.store.reset(); CP.player.load(sid); }
    st = CP.player.status();
    if (st.waiting) CP.decide(st.waiting, 'approve', null);
    st = CP.player.status();
    if (st.index < i - 1) CP.player.jump(i - 1);
    st = CP.player.status();
    if (st.waiting) CP.decide(st.waiting, 'approve');
    st = CP.player.status();
    if (st.index < i) CP.player.next();
  }

  function scenarioStops(s, opts) {
    opts = opts || {};
    const stops = [];
    s.steps.forEach((step, i) => {
      const inConsole = step.see && (step.gate || opts.consoles !== false);
      const screen = inConsole ? step.see[0] : (i % 3 === 2 ? 'arch-full' : 'arch-simple');
      const sub = inConsole ? step.see[1] : null;
      let hl = null;
      if (inConsole) hl = step.gate ? 'decision-' + step.gate.approval.id : (HOOKS[screen + '/' + (sub || '')] || 'tab-' + screen + '-' + sub);
      else hl = step.gate ? 'arch-caption' : 'arch-stage';
      stops.push({
        kicker: s.n + ' · Step ' + (i + 1) + ' of ' + s.steps.length + (inConsole ? ' · seen in ' + (CP.screens[screen] || {}).label : ' · ' + (screen === 'arch-full' ? 'detailed view' : 'simple view')),
        title: step.title, text: step.text, screen, sub, hl, gate: step.gate ? step.gate.approval.id : null,
        run: () => reach(s.id, i)
      });
    });
    return stops;
  }

  function buildTour(id) {
    const intro = { kicker: 'Guided demo', title: 'One platform, one context, many agents', text: 'You will follow one real-world trigger through the platform. On the architecture you see how the concept works; in the consoles you see what each role of the new organisation sees and decides. Use Next (or →), and approve decisions yourself when a human is needed.', screen: 'home', hl: 'part1', run: () => { CP.player.stop(); CP.store.reset(); } };
    if (id === 'full') {
      const s = CP.scenarioById('cti');
      return [intro].concat(scenarioStops(s)).concat([
        { kicker: 'Value', title: 'What the CISO gets', text: 'A case that used to take 3 to 5 days and 46 hours of expert effort was handled in about 4 hours, with 5 human hours and two decisions. The CISO sees the value, the decisions taken and the residual risk in one place.', screen: 'ciso', sub: 'value', hl: 'ciso-value', run: () => { const st = CP.player.status(); if (st.waiting) CP.decide(st.waiting, 'approve'); } },
        { kicker: 'Organisation', title: 'The teams behind the platform', text: 'Engage speaks to the outside, Build codes and evolves the agents, Run supervises and controls costs, Trust & Challenge tests everything. Each has its console: switch role with the dropdown on "The platform".', screen: 'ciso', sub: 'org', hl: 'ciso-org' },
        { kicker: 'Who watches the agents?', title: 'Build evolves, Trust & Challenge checks', text: 'Agents are products: versioned, evaluated, red-teamed, released through gates. Scenario S4 shows an agent fooled by hidden instructions, caught by deviation hunt, switched off, fixed and restored. Play it from the Showcase page.', screen: 'build', sub: 'studio', hl: 'build-studio' },
        { kicker: 'End of the guided demo', title: 'Explore freely', text: 'Play the other scenarios on the simple or detailed view, open any console with the role picker, and use the Decisions button to act as the humans who decide.', screen: 'demo', hl: null, run: () => { const st = CP.player.status(); if (st.waiting) CP.decide(st.waiting, 'approve'); } }
      ]);
    }
    const s = CP.scenarioById(id);
    return [Object.assign({}, intro, { title: s.title, text: s.pitch, screen: 'arch-simple', hl: 'control', run: () => { CP.store.reset(); CP.player.load(s.id); } })].concat(scenarioStops(s)).concat([
      { kicker: 'Value', title: s.value.manual + ' → ' + s.value.platform, text: s.value.note + ' With the platform: ' + s.value.decisions + ' human decision' + (s.value.decisions > 1 ? 's' : '') + ', everything else handled by agents within their decision rights.', screen: 'ciso', sub: 'value', hl: 'ciso-value' }
    ]);
  }

  /* ---------------- Tour engine ---------------- */
  const T = CP.tour = { active: false, stops: [], i: 0, id: null };

  function clearHl() { CP.qsa('.tour-hl').forEach((e) => e.classList.remove('tour-hl')); }
  function applyHl(stop) {
    clearHl();
    if (!stop || !stop.hl) return;
    const el = document.querySelector('[data-tour="' + stop.hl + '"]');
    if (el) { el.classList.add('tour-hl'); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }

  function panel() {
    const box = document.getElementById('tour'); if (!box) return;
    if (!T.active) { box.classList.remove('open'); box.innerHTML = ''; return; }
    const stop = T.stops[T.i];
    const ap = stop.gate ? CP.store.find('approvals', stop.gate) : null;
    const pending = ap && ap.status === 'pending';
    box.classList.add('open');
    box.innerHTML = '<div class="tr-head"><span>' + CP.icon('compass') + ' ' + esc(stop.kicker) + '</span><button class="on-dark small" data-tour-act="exit" aria-label="Exit the guided demo">' + CP.icon('x') + '</button></div>' +
      '<div class="tr-body"><h3>' + esc(stop.title) + '</h3><p>' + esc(stop.text) + '</p>' +
      (pending ? '<div class="notice" style="margin-top:10px">' + CP.icon('users') + ' <b>' + esc(CP.person(ap.decider).name) + '</b> must decide. Approve or reject on the highlighted card, or let the demo approve when you press Next.</div>' : '') + '</div>' +
      '<div class="tr-foot"><button class="small" data-tour-act="prev"' + (T.i === 0 ? ' disabled' : '') + '>Back</button><div class="tr-dots">' + T.stops.map((s, k) => '<i class="' + (k <= T.i ? 'on' : '') + '"></i>').join('') + '</div>' +
      (T.i < T.stops.length - 1 ? '<button class="primary small" data-tour-act="next">' + (pending ? 'Approve and continue' : 'Next') + ' ' + CP.icon('arrowRight') + '</button>' : '<button class="go small" data-tour-act="exit">Finish</button>') + '</div>';
  }

  function show(i) {
    T.i = Math.max(0, Math.min(T.stops.length - 1, i));
    const stop = T.stops[T.i];
    const target = stop.screen + (stop.sub ? '/' + stop.sub : '');
    const cur = CP.route.id + (CP.route.sub ? '/' + CP.route.sub : '');
    const after = () => {
      if (stop.run) stop.run();
      setTimeout(() => { applyHl(stop); panel(); }, 120);
    };
    if (target !== cur) { CP.go(stop.screen, stop.sub); setTimeout(after, 80); } else after();
  }

  T.start = function (id) {
    T.id = id; T.stops = buildTour(id); T.active = true;
    CP.player.pause();
    show(0);
  };
  T.next = function () {
    const stop = T.stops[T.i];
    const ap = stop.gate ? CP.store.find('approvals', stop.gate) : null;
    if (ap && ap.status === 'pending') CP.decide(ap.id, 'approve');
    if (T.i < T.stops.length - 1) show(T.i + 1); else T.exit();
  };
  T.prev = function () { if (T.i > 0) show(T.i - 1); };
  T.exit = function () { T.active = false; clearHl(); panel(); };

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tour-act]'); if (!b) return;
    T[b.dataset.tourAct]();
  });
  document.addEventListener('keydown', (e) => {
    if (!T.active || e.target.closest('input,textarea,select')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); T.next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); T.prev(); }
    if (e.key === 'Escape') T.exit();
  });
  /* Keep the highlight and panel in sync after re-renders and decisions. */
  CP.bus.on('rendered', () => { if (T.active) setTimeout(() => { applyHlSilent(T.stops[T.i]); panel(); }, 30); });
  CP.bus.on('decision', () => { if (T.active) panel(); });
  function applyHlSilent(stop) {
    if (!stop || !stop.hl) return;
    const el = document.querySelector('[data-tour="' + stop.hl + '"]');
    if (el && !el.classList.contains('tour-hl')) { clearHl(); el.classList.add('tour-hl'); }
  }

  /* ---------------- Showcase screen ---------------- */
  CP.css('tour', `
  .dm-grid{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:20px}
  .dm-main{background:var(--dark);color:#fff;padding:30px;display:flex;flex-direction:column;gap:14px}
  .dm-main h2{color:#fff;font-size:26px;margin:0}
  .dm-main p{color:#d7ceeb;margin:0;font-size:15px;line-height:1.6}
  .dm-main ol{margin:0;padding-left:20px;color:#d7ceeb;font-size:14px;line-height:1.8}
  .dm-tips{display:grid;gap:10px}
  .dm-tip{background:#fff;border:1px solid var(--line);padding:14px 16px;display:flex;gap:12px;font-size:13.5px;line-height:1.5}
  .dm-tip kbd{font-family:var(--mono);font-size:12px;border:1px solid var(--line);padding:1px 6px;background:#f7f6fb}
  @media(max-width:1100px){.dm-grid{grid-template-columns:1fr}}
  `);
  CP.screen({
    id: 'demo', part: 0, label: 'Guided demo', icon: 'compass', live: false,
    render() {
      return ui.head('Showcase', 'Guided demo', 'A narrated walk through the concept and the consoles. It drives the scenario engine for you and stops whenever a human must decide, so you can approve live in front of the audience.') +
        '<div class="dm-grid"><div class="dm-main" data-tour="demo-main"><span class="eyebrow" style="color:var(--green)">Recommended · 12 minutes</span><h2>The full story: one CTI alert, every role</h2><p>A zero-day hits a file-transfer product used by 14 suppliers. Follow it from the advisory to the board: architecture, Engage, Run, the CISO cockpit, the adversary lab, Build and the organisation.</p>' +
        '<ol><li>The concept and the trigger</li><li>12 steps, each on the architecture or in the console where it lands</li><li>Two live decisions: suppliers (Engage), emergency patch (CISO)</li><li>Value, organisation and how agents are kept under control</li></ol>' +
        '<div><button class="go" data-action="startTour" data-id="full" style="min-height:46px;padding:0 20px;font-size:15px">' + CP.icon('play') + ' Start the full story</button></div></div>' +
        '<div class="dm-tips"><div class="dm-tip">' + CP.icon('info') + '<div><b>Presenter keys</b><br><kbd>→</kbd> next stop · <kbd>←</kbd> back · <kbd>Esc</kbd> exit. Outside the tour: <kbd>Space</kbd> play or pause a scenario, <kbd>→</kbd> next step.</div></div>' +
        '<div class="dm-tip">' + CP.icon('users') + '<div><b>Act as the humans</b><br>When a decision is pending, approve or reject it on the card, in the Decisions drawer or in the role\'s console. Rejecting applies the fallback.</div></div>' +
        '<div class="dm-tip">' + CP.icon('monitor') + '<div><b>Switch role anytime</b><br>"The platform" dropdown opens the console of each role. Data is shared: what a scenario does appears everywhere.</div></div>' +
        '<div class="dm-tip">' + CP.icon('restart') + '<div><b>Reset</b><br><button class="small" data-action="resetDemo">' + CP.icon('restart') + ' Reset the demo data</button></div></div></div></div>' +
        '<div class="card-title" style="margin-top:26px"><div><div class="eyebrow">Short tours</div><h2 style="margin:0">One scenario, step by step</h2></div></div>' +
        '<div class="scn-cards">' + CP.scenarios.map((s) => '<button class="scn-card" data-action="startTour" data-id="' + s.id + '"><span class="sn">' + s.n + ' · ' + s.steps.length + ' steps · ' + esc(s.short) + '</span><h3>' + esc(s.title) + '</h3><p>' + esc(s.pitch) + '</p><span class="row wrap" style="gap:6px">' + s.domains.map((d) => ui.dom(d)).join('') + '</span><span class="row small-txt" style="padding-top:8px;border-top:1px solid var(--line);color:var(--indigo);font-weight:650">' + CP.icon('play') + ' Start this tour</span></button>').join('') + '</div>';
    },
    actions: { startTour(el) { T.start(el.dataset.id); } }
  });
})();
