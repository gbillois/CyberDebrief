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
      if (inConsole) hl = screen === 'owner' ? 'owner-phone' : step.gate ? 'decision-' + step.gate.approval.id : (HOOKS[screen + '/' + (sub || '')] || 'tab-' + screen + '-' + sub);
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
      const steps = scenarioStops(s);
      const keepRun = () => { const st = CP.player.status(); if (st.waiting) CP.decide(st.waiting, 'approve'); };
      const ptour = { kicker: 'Guided demo · the components', title: 'A tour of the platform', text: 'Before the scenario, the building blocks: the systems around the platform, the orchestrator, the specialized agents, the shared graph and data lake, the humans who decide and the safety layer. The full tour is in Part 1 (13 stops); here is the big picture.', screen: 'platform-tour', hl: 'ptour-stage' };
      const graph = { kicker: 'S1 · the same answer, for humans', title: 'Context one search away', text: 'The agent asked the graph who runs FileBridge. Any analyst gets the same answer in the Graph explorer: the exposed server, its business service, the 14 suppliers, with the source and freshness of every attribute.', screen: 'graph-x', query: { q: 'FileBridge' }, hl: 'graph-canvas', run: keepRun };
      const supplier = { kicker: 'S1 · the other side', title: 'What the supplier sees', text: 'Switching role to an external supplier, Atlas Payroll: the questionnaire arrives pre-filled with what Novalys already knows. The supplier confirms or corrects, uploads evidence, and sees how to lift the restriction on its file flow. Nothing internal leaks.', screen: 'supplier', role: 'supplier', hl: 'supplier-requests', run: keepRun };
      const caseWs = { kicker: 'S1 · the golden thread', title: 'The whole case in one place', text: 'Every step, agent, tool call, policy check, decision, message and piece of evidence of the case, from the advisory to the lessons. Select any step to see why the platform did it. This is what an analyst, the CISO or an auditor opens.', screen: 'cases', sub: 'C-2301', role: 'ciso', hl: 'case-timeline', run: keepRun };
      /* Insert the graph stop after step 2, the supplier stop after step 10. */
      const story = steps.slice(0, 2).concat([graph]).concat(steps.slice(2, 10)).concat([supplier]).concat(steps.slice(10)).concat([caseWs]);
      return [intro, ptour].concat(story).concat([
        { kicker: 'Value', title: 'What the CISO gets', text: 'A case that used to take 3 to 5 days and 46 hours of expert effort was handled in about 4 hours, with 5 human hours and two decisions. The CISO sees the value, the decisions taken and the residual risk in one place.', screen: 'ciso', sub: 'value', role: 'ciso', hl: 'ciso-value', run: keepRun },
        { kicker: 'One product, nine roles', title: 'Everyone works on the same platform', text: 'The role picker on "The platform" shows the product through each user: the SOC analyst starts from an inbox, the Head of Treasury decides on a phone, a supplier answers in its portal, the internal auditor samples the signed trail. Same data, role-based access.', screen: 'inbox', role: 'analyst', hl: 'mode-platform' },
        { kicker: 'The business decides', title: 'A decision framed for the decider', text: 'In scenario S2, the Head of Treasury receives at 2 a.m. a decision written in business terms: what happened, what is at stake in euros, the options, what happens without an answer, and whether it can be undone.', screen: 'owner', role: 'owner', hl: 'owner-phone' },
        { kicker: 'Design time', title: 'Playbooks and decision rights are designed, then run', text: 'The response you watched is a playbook: designed in lanes, validated, simulated on the digital twin and versioned. Decision rights are policy as code, backtested on 30 days of actions before the CISO signs.', screen: 'design', role: 'build', hl: 'design-playbooks' },
        { kicker: 'Who watches the agents?', title: 'Trust & Challenge does not take agents at their word', text: 'Evals, deviation hunt, red team and adversary lab. Scenario S4 shows an agent fooled by hidden instructions, caught, switched off, fixed and restored step by step.', screen: 'trust', role: 'trust', hl: 'trust-evals' },
        { kicker: 'End of the guided demo', title: 'Explore freely', text: 'Play the other scenarios on the simple or detailed view, switch role with the dropdown on "The platform", and use the Decisions button to act as the humans who decide.', screen: 'demo', role: 'ciso', hl: null, run: keepRun }
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
    /* Switch role when the stop needs a module the current role cannot open. */
    const mod = CP.module(stop.screen);
    if (stop.role && stop.role !== CP.currentRole) CP.setRole(stop.role, true);
    else if (mod && !CP.canSee(stop.screen)) CP.setRole(mod.roles.indexOf('ciso') >= 0 ? 'ciso' : mod.roles[0], true);
    const target = stop.screen + (stop.sub ? '/' + stop.sub : '') + (stop.query ? '?' + Object.keys(stop.query).map((k) => k + '=' + encodeURIComponent(stop.query[k])).join('&') : '');
    const cur = CP.route.id + (CP.route.sub ? '/' + CP.route.sub : '') + (location.hash.indexOf('?') >= 0 ? '?' + location.hash.split('?')[1] : '');
    const after = () => {
      if (stop.run) stop.run();
      setTimeout(() => { applyHl(stop); panel(); }, 120);
    };
    if (target !== cur) { CP.go(stop.screen, stop.sub, stop.query); setTimeout(after, 80); } else after();
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
        '<div class="dm-grid"><div class="dm-main" data-tour="demo-main"><span class="eyebrow" style="color:var(--green)">Recommended · 15 minutes</span><h2>The full story: one CTI alert, every role</h2><p>A zero-day hits a file-transfer product used by 14 suppliers. Follow it from the advisory to the board: the components, the architecture, the graph, Engage, the supplier portal, Run, the CISO, the case workspace, then the other roles: SOC analyst, business risk owner, Design and Trust & Challenge.</p>' +
        '<ol><li>The concept and the trigger</li><li>12 steps, each on the architecture or in the module where it lands, plus the graph and the supplier\'s view</li><li>Two live decisions: suppliers (Engage), emergency patch (CISO)</li><li>Value, organisation and how agents are kept under control</li></ol>' +
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
