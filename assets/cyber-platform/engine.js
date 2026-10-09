/* Cyber AI Platform demo: simulated clock and scenario engine.
   The engine is global: a scenario keeps running while you browse the
   consoles, and its effects land in the store as they happen. */
(function () {
  'use strict';
  const CP = window.CP;
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const pad = (n) => String(n).padStart(2, '0');

  /* ---------------- Clock ---------------- */
  CP.clock = {
    day: 'Tue', start: 8 * 3600 + 30 * 60, t: 0,
    set(day, start, t) { this.day = day; this.start = start; this.t = t || 0; },
    abs() { return this.start + this.t; },
    label(t) {
      const a = this.start + (t == null ? this.t : t);
      const d = Math.floor(a / 86400), s = a % 86400;
      const day = DAYS[(DAYS.indexOf(this.day) + d) % 7];
      return day + ' ' + pad(Math.floor(s / 3600)) + ':' + pad(Math.floor((s % 3600) / 60));
    },
    elapsed(t) {
      const v = t == null ? this.t : t;
      const d = Math.floor(v / 86400), r = v % 86400;
      return 'T+' + (d ? d + 'd ' : '') + pad(Math.floor(r / 3600)) + ':' + pad(Math.floor((r % 3600) / 60)) + ':' + pad(r % 60);
    }
  };

  /* ---------------- Player ---------------- */
  let S = null;            // current scenario
  let idx = -1;            // index of the last executed step
  let playing = false, waiting = null, timer = null;
  let speed = 1;
  const log = [];          // event log of the current run

  function addLog(ts, actor, text, cls) {
    log.push({ ts, actor, text, cls: cls || '' });
    CP.bus.emit('player:log', log[log.length - 1]);
  }

  function dwell(step) {
    const hops = (step.flow || []).length;
    return (1800 + hops * 700 + (step.text || '').length * 26) / speed;
  }

  function clearTimer() { if (timer) { clearTimeout(timer); timer = null; } }

  function schedule(ms) {
    clearTimer();
    if (!playing || waiting || !S) return;
    timer = setTimeout(() => { timer = null; if (playing && !waiting) runNext(); }, ms);
  }

  /* Execute step i. instant=true when fast-forwarding (no gate wait, no toasts). */
  function exec(i, instant) {
    const step = S.steps[i];
    idx = i;
    CP.clock.t = step.t;
    const ts = CP.clock.label();
    if (step.effects) CP.store.apply(step.effects.map((e) => withScn(e)), true);
    CP.store.apply({ op: 'add', coll: 'feed', item: { id: 'f-' + step.id + '-' + Date.now(), ts, actor: step.actor, domain: step.domain, level: step.gate ? 'decision' : 'action', text: step.log || step.title, scenario: S.id } }, true);
    CP.store.apply({ op: 'inc', path: 'kpis.actionsToday', by: (step.flow || []).length }, true);
    addLog(ts, step.actor, step.log || step.title, step.gate ? 'dec' : '');
    /* Agent trace kept in the store, so the case workspace can show it later. */
    CP.store.apply({ op: 'add', coll: 'traces', append: true, item: { id: 'tr-' + step.id, scenario: S.id, case: S.caseId, stepIndex: i, t: step.t, ts, actor: step.actor, domain: step.domain, level: step.level, title: step.title, text: step.text, flow: step.flow || [], artifact: step.artifact || null, gate: step.gate ? step.gate.approval.id : null, metric: step.metric || null } }, true);
    if (step.gate) {
      const ap = Object.assign({}, step.gate.approval, { scenario: S.id, status: 'pending', createdAt: ts });
      CP.store.apply({ op: 'add', coll: 'approvals', item: ap }, true);
      if (instant) {
        resolveGate(step, 'approve', true);
      } else {
        waiting = ap.id;
        const p = CP.person(ap.decider);
        CP.toast('Decision needed from ' + (p ? p.name : 'a human') + ': ' + ap.title, 'warn');
      }
    }
    CP.store.changed('step');
    CP.bus.emit('player:step', { scenario: S, step, index: i, instant: !!instant });
    emitState();
  }

  function withScn(e) { if (e.op === 'add' && e.item && !e.item.scenario) { e = Object.assign({}, e, { item: Object.assign({}, e.item, { scenario: S.id }) }); } return e; }

  function resolveGate(step, decision, instant) {
    const g = step.gate;
    if (instant) {
      CP.store.apply({ op: 'update', coll: 'approvals', id: g.approval.id, patch: { status: 'approved', decidedAt: CP.clock.label(), decidedBy: g.approval.decider } }, true);
    }
    const eff = decision === 'approve' ? g.onApprove : g.onReject;
    if (eff && eff.length) CP.store.apply(eff.map(withScn), true);
    const p = CP.person(g.approval.decider);
    addLog(CP.clock.label(), g.approval.decider, (decision === 'approve' ? 'approved: ' : 'rejected: ') + g.approval.title + (decision !== 'approve' && g.fallback ? ' Fallback: ' + g.fallback : ''), decision === 'approve' ? 'ok' : 'dec');
    if (!instant && decision !== 'approve' && g.fallback) CP.toast('Fallback applied: ' + g.fallback, 'warn');
    CP.store.changed('gate');
    if (p) { /* keeps lint quiet when people are unknown */ }
  }

  CP.bus.on('decision', ({ id, decision }) => {
    if (!S || !waiting || waiting !== id) return;
    const step = S.steps[idx];
    waiting = null;
    resolveGate(step, decision, false);
    emitState();
    CP.bus.emit('player:gate', { scenario: S, step, decision });
    if (playing) schedule(1600 / speed);
  });

  function runNext() {
    if (!S) return;
    if (waiting) return;
    if (idx >= S.steps.length - 1) { playing = false; emitState(); CP.bus.emit('player:done', S); return; }
    exec(idx + 1, false);
    const step = S.steps[idx];
    if (idx >= S.steps.length - 1 && !waiting) { playing = false; emitState(); CP.bus.emit('player:done', S); return; }
    schedule(dwell(step));
  }

  function emitState() { CP.bus.emit('player:state', CP.player.status()); if (CP.renderTop) CP.renderTop(); }

  CP.player = {
    log,
    status() {
      return {
        scenario: S, index: idx, total: S ? S.steps.length : 0, playing, waiting,
        step: S && idx >= 0 ? S.steps[idx] : null,
        next: S && idx < S.steps.length - 1 ? S.steps[idx + 1] : null,
        done: !!S && idx >= S.steps.length - 1 && !waiting, speed
      };
    },
    load(id, opts) {
      opts = opts || {};
      clearTimer();
      S = CP.scenarioById(id); idx = -1; waiting = null; playing = false; log.length = 0;
      if (!S) return;
      CP.clock.set(S.clock.day, S.clock.start, 0);
      addLog(CP.clock.label(), 'orchestrator', 'scenario loaded: ' + S.title, 'ok');
      emitState();
      CP.bus.emit('player:load', S);
      if (opts.autoplay) CP.player.play();
    },
    play() {
      if (!S) { CP.player.load(CP.scenarios[0].id); }
      if (CP.player.status().done) return;
      playing = true; emitState();
      if (!waiting) { if (idx < 0) runNext(); else schedule(400); }
    },
    pause() { playing = false; clearTimer(); emitState(); },
    toggle() { if (playing) CP.player.pause(); else CP.player.play(); },
    next() {
      if (!S) { CP.player.load(CP.scenarios[0].id); }
      if (waiting) { CP.toast('A human decision is pending: approve or reject it to continue.', 'warn'); CP.bus.emit('player:needs-decision', waiting); return; }
      clearTimer();
      runNext();
    },
    /* Fast-forward or rewind to step i (inclusive). Rewinding resets the store. */
    jump(i) {
      if (!S) return;
      clearTimer();
      const wasPlaying = playing; playing = false;
      if (i <= idx) { CP.store.reset(); const s = S.id; CP.player.load(s); }
      if (waiting && i > idx) { const g = S.steps[idx]; waiting = null; resolveGate(g, 'approve', true); }
      while (idx < i && idx < S.steps.length - 1) { waiting = null; exec(idx + 1, true); }
      waiting = null;
      CP.store.changed('jump');
      emitState();
      if (wasPlaying) CP.player.play();
    },
    restart() { if (!S) return; const s = S.id; CP.store.reset(); CP.player.load(s); },
    stop() { clearTimer(); S = null; idx = -1; waiting = null; playing = false; log.length = 0; emitState(); CP.bus.emit('player:load', null); },
    setSpeed(v) { speed = v; emitState(); if (playing && !waiting) schedule(1200 / speed); },
    /* Run until step index i (inclusive) in real time, used by the guided demo. */
    runUntil(i) {
      CP.player._until = i;
    }
  };

  /* Stop autoplay at the guided-demo bookmark. */
  CP.bus.on('player:step', ({ index }) => {
    if (CP.player._until != null && index >= CP.player._until) { CP.player._until = null; CP.player.pause(); CP.bus.emit('player:until', index); }
  });
})();
