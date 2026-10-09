/* Cyber AI Platform demo: core (namespace, store, router, shell, UI kit).
   Plain script, no modules, so the page also runs from file://. */
(function () {
  'use strict';
  const CP = window.CP = window.CP || {};

  /* ---------------- Utilities ---------------- */
  const esc = CP.esc = (v) => String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  CP.clone = (o) => JSON.parse(JSON.stringify(o));
  CP.uid = (p) => (p || 'id') + '-' + Math.random().toString(36).slice(2, 8);
  CP.fmt = (n, d) => (n == null || isNaN(n)) ? '–' : Number(n).toLocaleString('en-GB', { maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: d || 0 });
  CP.eur = (n) => '€' + CP.fmt(n);
  CP.pct = (n, d) => CP.fmt(n, d || 0) + '%';
  CP.qs = (sel, root) => (root || document).querySelector(sel);
  CP.qsa = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  /* Join an array of HTML strings. */
  CP.map = (arr, fn) => (arr || []).map(fn).join('');

  /* ---------------- Icons (Lucide-style line icons) ---------------- */
  const IC = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
    network: '<rect x="9" y="2" width="6" height="5"/><rect x="2" y="17" width="6" height="5"/><rect x="16" y="17" width="6" height="5"/><path d="M12 7v5M5 17v-3h14v3"/>',
    map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>',
    scale: '<path d="M12 3v18M5 7h14M7 21h10"/><path d="m5 7-3 7a3 3 0 0 0 6 0L5 7ZM19 7l-3 7a3 3 0 0 0 6 0l-3-7Z"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/>',
    shieldCheck: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
    activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2Z"/><path d="M10 21h4"/>',
    play: '<path d="M7 4v16l13-8L7 4Z"/>',
    pause: '<path d="M8 4v16M16 4v16"/>',
    next: '<path d="M5 4v16l10-8L5 4ZM19 4v16"/>',
    restart: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronRight: '<path d="m9 6 6 6-6 6"/>',
    chevronLeft: '<path d="m15 6-6 6 6 6"/>',
    alert: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17v.5"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    sword: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2"/>',
    flask: '<path d="M9 3h6M10 3v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4A1.5 1.5 0 0 0 20 19l-6-10V3"/><path d="M7 15h10"/>',
    gauge: '<path d="M4 18a9 9 0 1 1 16 0"/><path d="m12 13 4-5"/>',
    cpu: '<rect x="6" y="6" width="12" height="12"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/><rect x="10" y="10" width="4" height="4"/>',
    bot: '<rect x="4" y="8" width="16" height="12"/><path d="M12 8V4M8 13v1M16 13v1M9 17h6"/><circle cx="12" cy="3.5" r="1"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    branch: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="8" r="2"/><path d="M6 7v10M18 10c0 5-6 4-12 7"/>',
    plug: '<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0V7ZM12 17v5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    file: '<path d="M14 3H6v18h12V7l-4-4Z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
    mail: '<rect x="3" y="5" width="18" height="14"/><path d="m3 7 9 6 9-6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/>',
    building: '<path d="M4 21V4h11v17M15 9h5v12M2 21h20M8 8h3M8 12h3M8 16h3"/>',
    lock: '<rect x="4" y="11" width="16" height="10"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.3-9.3M16 7l3 3M14 9l2 2"/>',
    zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    sparkles: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/>',
    trending: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    euro: '<path d="M18 6a7 7 0 1 0 0 12M4 10h10M4 14h10"/>',
    power: '<path d="M12 2v10"/><path d="M6.3 6.3a8 8 0 1 0 11.4 0"/>',
    rollback: '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
    box: '<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Z"/><path d="m3 7 9 5 9-5M12 12v10"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    book: '<path d="M4 4h6a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H4V4ZM20 4h-6a3 3 0 0 0-3 3"/><path d="M20 4v15h-7"/>',
    flag: '<path d="M5 21V4h11l-2 4 2 4H5"/>',
    radar: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12 19 5"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
    message: '<path d="M4 4h16v12H8l-4 4V4Z"/>',
    send: '<path d="m3 11 18-8-8 18-2-8-8-2Z"/>',
    workflow: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><path d="M6.5 10v4a3 3 0 0 0 3 3H14"/>',
    rocket: '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 15l-3-3c1-4 5-9 13-9 0 8-5 12-9 13l-1-1Z"/><circle cx="15" cy="9" r="1.5"/>',
    fingerprint: '<path d="M12 11v3c0 3-1 5-2 7M8 9a4 4 0 0 1 8 0v4c0 2-.3 4-1 6M5 12V9a7 7 0 0 1 11-5.7M19 9v3c0 1.5-.2 3-.5 4.5"/>',
    bug: '<rect x="7" y="7" width="10" height="13" rx="5"/><path d="M12 11v9M3 13h4M17 13h4M4 7l3 2M20 7l-3 2M4 19l3-2M20 19l-3-2M9 4l1.5 2M15 4l-1.5 2"/>',
    gavel: '<path d="m14 13-8 8-3-3 8-8M12 4l8 8M9 7l6-6 8 8-6 6"/>',
    megaphone: '<path d="M3 10v4h4l9 5V5L7 10H3ZM19 9a4 4 0 0 1 0 6"/>',
    graduation: '<path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6"/>',
    terminal: '<rect x="3" y="4" width="18" height="16"/><path d="m7 9 3 3-3 3M13 15h4"/>',
    filter: '<path d="M3 4h18l-7 9v6l-4 2v-8L3 4Z"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3A4 4 0 0 0 13 5.3l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"/>',
    monitor: '<rect x="2" y="4" width="20" height="13"/><path d="M8 21h8M12 17v4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    hourglass: '<path d="M6 2h12M6 22h12M7 2c0 5 10 5 10 10S7 17 7 22M17 2c0 5-10 5-10 10s10 5 10 10"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>'
  };
  CP.icon = (name, cls) => '<svg class="i ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (IC[name] || IC.info) + '</svg>';
  CP.icons = IC;

  /* ---------------- Event bus ---------------- */
  const listeners = {};
  CP.bus = {
    on(type, fn) { (listeners[type] = listeners[type] || []).push(fn); return () => CP.bus.off(type, fn); },
    off(type, fn) { listeners[type] = (listeners[type] || []).filter((f) => f !== fn); },
    emit(type, payload) { (listeners[type] || []).slice().forEach((fn) => { try { fn(payload); } catch (e) { console.error(e); } }); }
  };

  /* ---------------- Store ----------------
     state = clone of CP.data.seed (collections + kpis). Scenario steps carry
     "effects", applied with CP.store.apply(effect):
       {op:'add',    coll, item}            push (or replace by id) an item
       {op:'update', coll, id, patch}       shallow-merge a patch into an item
       {op:'remove', coll, id}
       {op:'set',    path:'kpis.x', value}
       {op:'inc',    path:'kpis.x', by}
     New / updated items get `_new: <timestamp>` so screens can flash them. */
  const store = CP.store = {
    state: null,
    reset() {
      store.state = CP.clone(CP.data.seed);
      store.changed('reset');
    },
    get(coll) { return store.state[coll] || []; },
    find(coll, id) { return (store.state[coll] || []).find((x) => x.id === id); },
    path(p) { return p.split('.').reduce((o, k) => (o == null ? o : o[k]), store.state); },
    setPath(p, v) {
      const ks = p.split('.'); const last = ks.pop();
      const o = ks.reduce((acc, k) => (acc[k] = acc[k] || {}), store.state);
      o[last] = v;
    },
    apply(e, silent) {
      if (!e) return;
      if (Array.isArray(e)) { e.forEach((x) => store.apply(x, true)); if (!silent) store.changed('effects'); return; }
      const now = Date.now();
      const list = e.coll ? (store.state[e.coll] = store.state[e.coll] || []) : null;
      switch (e.op) {
        case 'add': {
          const item = Object.assign(CP.clone(e.item), { _new: now });
          const i = list.findIndex((x) => x.id === item.id);
          if (i >= 0) list[i] = item; else if (e.append) list.push(item); else list.unshift(item);
          break;
        }
        case 'update': {
          const it = list.find((x) => x.id === e.id);
          if (it) Object.assign(it, CP.clone(e.patch), { _new: now });
          break;
        }
        case 'remove': {
          const i = list.findIndex((x) => x.id === e.id); if (i >= 0) list.splice(i, 1); break;
        }
        case 'set': store.setPath(e.path, CP.clone(e.value)); break;
        case 'inc': store.setPath(e.path, Math.round(((store.path(e.path) || 0) + (e.by || 1)) * 100) / 100); break;
        default: console.warn('Unknown effect', e);
      }
      if (!silent) store.changed(e.op);
    },
    changed(reason) {
      if (store._raf) return;
      store._raf = requestAnimationFrame(() => { store._raf = null; CP.bus.emit('change', reason); });
    },
    isNew(item, ms) { return item && item._new && Date.now() - item._new < (ms || 4000); },
    pendingApprovals(role) {
      return store.get('approvals').filter((a) => a.status === 'pending' && (!role || a.role === role));
    }
  };

  /* Decide on a pending approval from anywhere (drawer, consoles, player). */
  CP.decide = function (id, decision, by) {
    const a = store.find('approvals', id);
    if (!a || a.status !== 'pending') return;
    const person = CP.person(by || a.decider);
    store.apply({ op: 'update', coll: 'approvals', id, patch: { status: decision === 'approve' ? 'approved' : 'rejected', decidedAt: CP.clock ? CP.clock.label() : '', decidedBy: person ? person.id : '' } });
    store.apply({ op: 'inc', path: 'kpis.humanDecisions', by: 1 });
    CP.feed({ actor: person ? person.id : 'human', domain: 'human', level: 'decision', text: (decision === 'approve' ? 'Approved: ' : 'Rejected: ') + a.title });
    CP.toast((decision === 'approve' ? 'Decision recorded: approved. ' : 'Decision recorded: rejected. ') + a.title, decision === 'approve' ? '' : 'warn');
    CP.bus.emit('decision', { id, decision, approval: a });
  };

  /* Append to the global activity feed. */
  CP.feed = function (o) {
    store.apply({ op: 'add', coll: 'feed', item: Object.assign({ id: CP.uid('f'), ts: CP.clock ? CP.clock.label() : '', level: 'info' }, o) });
  };

  /* ---------------- Directory helpers ---------------- */
  CP.person = (id) => (CP.data.people || []).find((p) => p.id === id);
  CP.agent = (id) => store.find('agents', id) || (CP.data.seed.agents || []).find((a) => a.id === id);
  CP.domain = (id) => (CP.data.domains || []).find((d) => d.id === id) || { id, label: id, color: '#888' };
  CP.role = (id) => (CP.data.roles || []).find((r) => r.id === id);
  CP.initials = (name) => (name || '?').split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  /* Who did it: agent, person, system, orchestrator. Returns {name, sub, color, html}. */
  CP.actor = function (id) {
    if (!id) return { name: 'Platform', sub: '', color: 'var(--d-orch)' };
    const ag = CP.agent(id);
    if (ag) { const d = CP.domain(ag.domain); return { name: ag.name, sub: d.label + ' agent', color: d.color, agent: true }; }
    const p = CP.person(id);
    if (p) return { name: p.name, sub: p.title, color: 'var(--d-human)', person: true };
    const sys = (CP.data.actors || {})[id];
    if (sys) return sys;
    return { name: id, sub: '', color: 'var(--d-src)' };
  };

  /* ---------------- UI kit ---------------- */
  const ui = CP.ui = {};
  ui.av = (id, size) => {
    const p = CP.person(id);
    if (p) return '<span class="av ' + (size || '') + '" style="background:' + (p.color || 'var(--indigo)') + '" title="' + esc(p.name + ' · ' + p.title) + '">' + esc(p.abbr || CP.initials(p.name)) + '</span>';
    const a = CP.agent(id);
    if (a) return '<span class="av agent ' + (size || '') + '" style="color:' + CP.domain(a.domain).color + '" title="' + esc(a.name) + '">AI</span>';
    return '<span class="av ' + (size || '') + '">' + esc(CP.initials(id)) + '</span>';
  };
  ui.who = (id) => {
    const a = CP.actor(id);
    return '<span class="row" style="gap:8px">' + ui.av(id, 'sm') + '<span><b style="font-weight:600">' + esc(a.name) + '</b>' + (a.sub ? ' <span class="muted small-txt">' + esc(a.sub) + '</span>' : '') + '</span></span>';
  };
  ui.tag = (txt, cls) => '<span class="tag ' + (cls || '') + '">' + txt + '</span>';
  ui.dom = (id) => { const d = CP.domain(id); return '<span class="dom"><i style="background:' + d.color + '"></i>' + esc(d.label) + '</span>'; };
  ui.lvl = (l) => {
    const L = (CP.data.autonomy || []).find((x) => x.id === l);
    return '<span class="lvl ' + esc(l) + '" title="' + esc(L ? L.label + ': ' + L.desc : '') + '">' + esc(l) + (L ? ' · ' + esc(L.short) : '') + '</span>';
  };
  const STATUS = {
    pending: ['amber', 'Awaiting decision'], approved: ['green', 'Approved'], rejected: ['red', 'Rejected'],
    open: ['red', 'Open'], contained: ['amber', 'Contained'], closed: ['green', 'Closed'], monitoring: ['amber', 'Monitoring'],
    draft: ['outline', 'Draft'], awaiting: ['amber', 'Awaiting validation'], sent: ['indigo', 'Sent'], answered: ['green', 'Answered'], overdue: ['red', 'Overdue'], none: ['outline', 'No campaign'], flagged: ['red', 'Flagged'],
    live: ['green', 'Live'], testing: ['amber', 'Testing'], retired: ['outline', 'Retired'],
    active: ['green', 'Active'], degraded: ['amber', 'Degraded'], suspended: ['red', 'Suspended'], canary: ['indigo', 'Canary'], paused: ['amber', 'Paused'],
    'on-track': ['green', 'On track'], 'at-risk': ['amber', 'At risk'], submitted: ['indigo', 'Submitted'], done: ['green', 'Done'],
    new: ['indigo', 'New'], 'in-progress': ['amber', 'In progress'], blocked: ['red', 'Blocked'],
    pass: ['green', 'Pass'], fail: ['red', 'Fail'], warn: ['amber', 'Warning'],
    blocked_: ['green', 'Blocked'], detected: ['amber', 'Detected'], bypassed: ['red', 'Bypassed'],
    investigating: ['amber', 'Investigating'], confirmed: ['red', 'Confirmed'], 'rolled-back': ['amber', 'Rolled back'],
    healthy: ['green', 'Healthy'], critical: ['red', 'Critical'], high: ['amber', 'High'], medium: ['outline', 'Medium'], low: ['outline', 'Low']
  };
  ui.status = (s, label) => { const v = STATUS[s] || ['outline', s]; return '<span class="tag ' + v[0] + '">' + esc(label || v[1]) + '</span>'; };
  ui.sev = (s) => ui.status(s, s ? s[0].toUpperCase() + s.slice(1) : '');
  ui.newCls = (item) => (store.isNew(item) ? ' new' : '');

  ui.metric = (o) => '<div class="metric' + (o.flash ? ' flash' : '') + '"' + (o.tour ? ' data-tour="' + esc(o.tour) + '"' : '') + '>' +
    '<div class="label">' + (o.icon ? CP.icon(o.icon) : '') + esc(o.label) + '</div>' +
    '<div class="value"' + (o.color ? ' style="color:' + o.color + '"' : '') + '>' + o.value + (o.unit ? '<small>' + esc(o.unit) + '</small>' : '') + '</div>' +
    '<div class="foot">' + (o.delta ? '<span class="delta ' + (o.deltaDir || 'up') + '">' + esc(o.delta) + '</span>' : '') + (o.foot ? '<span>' + o.foot + '</span>' : '') + '</div>' +
    (o.spark ? '<span class="spark">' + ui.spark(o.spark, { w: 80, h: 26, color: o.sparkColor }) + '</span>' : '') + '</div>';

  ui.progress = (v, cls) => '<div class="progress ' + (cls || '') + '"><span style="width:' + Math.max(0, Math.min(100, v)) + '%"></span></div>';

  ui.table = (cols, rows, opts) => {
    opts = opts || {};
    return '<div class="table-wrap"' + (opts.max ? ' style="max-height:' + opts.max + 'px"' : '') + '><table class="t"><thead><tr>' +
      cols.map((c) => '<th' + (c.w ? ' style="width:' + c.w + '"' : '') + '>' + esc(c.label) + '</th>').join('') + '</tr></thead><tbody>' +
      (rows.length ? rows.map((r) => {
        const attrs = opts.rowAttrs ? opts.rowAttrs(r) : '';
        return '<tr class="' + (opts.rowClass ? opts.rowClass(r) : '') + ui.newCls(r) + '" ' + attrs + '>' + cols.map((c) => '<td>' + (c.render ? c.render(r) : esc(r[c.key])) + '</td>').join('') + '</tr>';
      }).join('') : '<tr><td colspan="' + cols.length + '"><div class="empty">' + esc(opts.empty || 'Nothing yet.') + '</div></td></tr>') +
      '</tbody></table></div>';
  };

  ui.card = (title, body, o) => {
    o = o || {};
    return '<section class="card ' + (o.cls || '') + '"' + (o.tour ? ' data-tour="' + esc(o.tour) + '"' : '') + (o.style ? ' style="' + o.style + '"' : '') + '>' +
      (title ? '<div class="card-title"><div><h2>' + title + '</h2>' + (o.sub ? '<div class="sub">' + o.sub + '</div>' : '') + '</div>' + (o.right || '') + '</div>' : '') + body + '</section>';
  };

  ui.code = (body, lang) => {
    let h = esc(body);
    if (lang === 'yaml' || lang === 'kql' || lang === 'sigma' || lang === 'json') {
      h = h.replace(/(^|\n)(\s*#[^\n]*)/g, '$1<span class="c">$2</span>')
        .replace(/(^|\n)(\s*-?\s*)([A-Za-z_][\w.-]*)(:)/g, '$1$2<span class="k">$3</span>$4')
        .replace(/(&quot;[^&\n]*&quot;|'[^'\n]*')/g, '<span class="s">$1</span>');
    }
    return '<pre class="code">' + h + '</pre>';
  };

  ui.email = (m) => '<div class="email"><div class="e-h"><div><span>From</span> ' + esc(m.from) + '</div><div><span>To</span> ' + esc(m.to) + '</div><div><b>' + esc(m.subject) + '</b></div></div><div class="e-b">' + esc(m.body) + '</div></div>';

  /* A decision card for an approval item. */
  ui.decision = (a, opts) => {
    opts = opts || {};
    const p = CP.person(a.decider);
    const cls = a.status === 'approved' ? 'done-ok' : a.status === 'rejected' ? 'done-ko' : (opts.pulse ? 'pulse' : '');
    return '<div class="decision ' + cls + '" data-tour="decision-' + esc(a.id) + '">' +
      '<div class="d-head">' + ui.tag(CP.icon('users') + ' Humans decide', 'amber') + (a.autonomy ? ui.lvl(a.autonomy) : '') + ui.status(a.status) +
      (a.scenario ? '<span class="muted small-txt">' + esc((CP.scenarioById && CP.scenarioById(a.scenario) || {}).short || '') + '</span>' : '') + '</div>' +
      '<div class="d-title">' + esc(a.title) + '</div>' +
      (a.summary ? '<div class="small-txt" style="line-height:1.55">' + esc(a.summary) + '</div>' : '') +
      (a.threshold ? '<div class="d-why">' + CP.icon('alert') + ' Above threshold: ' + esc(a.threshold) + '</div>' : '') +
      (a.impacts && a.impacts.length ? '<ul>' + a.impacts.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') +
      (a.recommendation ? '<div class="d-rec"><b>' + CP.icon('bot') + ' Platform recommendation:</b> ' + esc(a.recommendation) + '</div>' : '') +
      '<div class="row wrap" style="margin-top:10px;font-size:12.5px">' +
      '<span class="muted">Requested by</span> ' + ui.who(a.requestedBy) + '<span class="muted">· Decider</span> ' + ui.who(a.decider) + '</div>' +
      (a.status === 'pending' ? '<div class="d-actions"><button class="go" data-decide="' + esc(a.id) + '" data-decision="approve">' + CP.icon('check') + ' ' + esc(a.approveLabel || 'Approve') + '</button>' +
        '<button class="danger" data-decide="' + esc(a.id) + '" data-decision="reject">' + CP.icon('x') + ' ' + esc(a.rejectLabel || 'Reject') + '</button></div>'
        : '<div class="small-txt muted" style="margin-top:8px">Decided ' + esc(a.decidedAt || '') + (a.decidedBy ? ' by ' + esc((CP.person(a.decidedBy) || {}).name || '') : '') + '</div>') +
      '</div>';
  };

  ui.feed = (items, max) => '<div class="feed">' + (items || []).slice(0, max || 12).map((f) => {
    const a = CP.actor(f.actor);
    return '<div class="feed-item' + ui.newCls(f) + '"><span class="ts">' + esc(f.ts) + '</span>' + ui.av(f.actor, 'sm') +
      '<span class="txt"><b style="color:' + (a.color || 'inherit') + '">' + esc(a.name) + '</b> ' + esc(f.text) + '</span></div>';
  }).join('') + '</div>';

  /* CrisisMaker-style dark tab bar for a console.
     groups: [{label, tabs:[{id, label, icon, count, warn}]}]; active = current sub id. */
  ui.tabbar = (screenId, groups, active, right) => '<nav class="subnav" aria-label="Module sections">' +
    groups.map((g) => '<div class="sg">' + (g.label ? '<span class="sg-label">' + esc(g.label) + '</span>' : '') +
      g.tabs.map((t) => '<a href="' + CP.href(screenId, t.id) + '" class="' + (t.id === active ? 'active' : '') + '" data-tour="tab-' + esc(screenId + '-' + t.id) + '">' + (t.icon ? CP.icon(t.icon) : '') + esc(t.label) +
        (t.count ? '<span class="count' + (t.warn ? ' warn' : '') + '">' + esc(t.count) + '</span>' : '') + '</a>').join('') + '</div>').join('') +
    (right ? '<span class="persona">' + right + '</span>' : '') + '</nav>';

  /* Page head used by every screen. */
  ui.head = (eyebrow, title, lede, actions) => '<div class="page-head"><div><div class="eyebrow">' + eyebrow + '</div><h1>' + title + '</h1>' + (lede ? '<p class="lede">' + lede + '</p>' : '') + '</div>' + (actions ? '<div class="actions">' + actions + '</div>' : '') + '</div>';

  /* ---------------- Charts (hand-rolled SVG) ---------------- */
  ui.spark = (vals, o) => {
    o = o || {}; const w = o.w || 120, h = o.h || 32, c = o.color || 'var(--indigo)';
    if (!vals || vals.length < 2) return '';
    const mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), r = mx - mn || 1;
    const pts = vals.map((v, i) => [(i / (vals.length - 1)) * (w - 4) + 2, h - 3 - ((v - mn) / r) * (h - 6)]);
    const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const last = pts[pts.length - 1];
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true"><path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="2" stroke-linejoin="round"/><circle cx="' + last[0] + '" cy="' + last[1] + '" r="3" fill="' + c + '"/></svg>';
  };

  /* Line chart: series [{label, color, values:[..]}], labels on x. One y axis. */
  ui.line = (series, labels, o) => {
    o = o || {}; const W = o.w || 600, H = o.h || 200, pl = 36, pr = 60, pt = 12, pb = 24;
    const all = series.reduce((a, s) => a.concat(s.values), []);
    const mn = o.min != null ? o.min : Math.min.apply(null, all), mx = o.max != null ? o.max : Math.max.apply(null, all);
    const r = mx - mn || 1, n = labels.length;
    const x = (i) => pl + (i / (n - 1)) * (W - pl - pr), y = (v) => pt + (1 - (v - mn) / r) * (H - pt - pb);
    let g = '';
    for (let k = 0; k <= 4; k++) { const v = mn + (r * k) / 4, yy = y(v); g += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + yy + '" y2="' + yy + '" stroke="#eeecf3"/><text x="' + (pl - 6) + '" y="' + (yy + 4) + '" text-anchor="end" font-size="10" fill="#6d687e">' + CP.fmt(v, o.dec || 0) + (o.unit || '') + '</text>'; }
    labels.forEach((l, i) => { if (i % Math.ceil(n / 8) === 0 || i === n - 1) g += '<text x="' + x(i) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="10" fill="#6d687e">' + esc(l) + '</text>'; });
    if (o.marker != null) { const xm = x(o.marker); g += '<line x1="' + xm + '" x2="' + xm + '" y1="' + pt + '" y2="' + (H - pb) + '" stroke="#d8412f" stroke-dasharray="4 3"/>' + (o.markerLabel ? '<text x="' + (xm + 4) + '" y="' + (pt + 10) + '" font-size="10" fill="#a4233a">' + esc(o.markerLabel) + '</text>' : ''); }
    series.forEach((s) => {
      const d = s.values.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ');
      g += '<path d="' + d + '" fill="none" stroke="' + s.color + '" stroke-width="2" stroke-linejoin="round"' + (s.dash ? ' stroke-dasharray="5 4"' : '') + '/>';
      const lv = s.values[s.values.length - 1];
      g += '<circle cx="' + x(n - 1) + '" cy="' + y(lv) + '" r="4" fill="' + s.color + '" stroke="#fff" stroke-width="2"/><text x="' + (x(n - 1) + 8) + '" y="' + (y(lv) + 4) + '" font-size="11" fill="#201c30" font-weight="600">' + esc(s.label) + '</text>';
      s.values.forEach((v, i) => { g += '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="9" fill="transparent"><title>' + esc(s.label + ' · ' + labels[i] + ': ' + CP.fmt(v, o.dec || 0) + (o.unit || '')) + '</title></circle>'; });
    });
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto" role="img" aria-label="' + esc(o.label || 'chart') + '">' + g + '</svg>';
  };

  /* Horizontal bars: [{label, value, color, note}] */
  ui.hbars = (rows, o) => {
    o = o || {}; const mx = o.max || Math.max.apply(null, rows.map((r) => r.value)) || 1;
    return '<div class="value-bars">' + rows.map((r) => '<div class="vb-row" title="' + esc(r.label + ': ' + CP.fmt(r.value, o.dec) + (o.unit || '')) + '"><span>' + esc(r.label) + '</span><div class="vb-bar"><span style="width:' + (r.value / mx * 100).toFixed(1) + '%;--c:' + (r.color || 'var(--indigo)') + '"></span></div><b>' + (r.display || CP.fmt(r.value, o.dec) + (o.unit || '')) + '</b></div>').join('') + '</div>';
  };

  /* Vertical columns, optionally stacked: data [{label, parts:[{v,color,name}]}] */
  ui.columns = (data, o) => {
    o = o || {}; const W = o.w || 600, H = o.h || 180, pb = 22, pt = 10, pl = 30;
    const tot = data.map((d) => d.parts.reduce((a, p) => a + p.v, 0));
    const mx = o.max || Math.max.apply(null, tot) || 1; const bw = (W - pl) / data.length;
    let g = '';
    for (let k = 0; k <= 3; k++) { const yy = pt + (H - pt - pb) * (1 - k / 3); g += '<line x1="' + pl + '" x2="' + W + '" y1="' + yy + '" y2="' + yy + '" stroke="#eeecf3"/><text x="' + (pl - 5) + '" y="' + (yy + 3) + '" font-size="9.5" text-anchor="end" fill="#6d687e">' + CP.fmt(mx * k / 3) + '</text>'; }
    data.forEach((d, i) => {
      let y0 = H - pb; const x = pl + i * bw + bw * 0.18, w = bw * 0.64;
      d.parts.forEach((p) => {
        const hh = (p.v / mx) * (H - pt - pb); y0 -= hh;
        g += '<rect x="' + x.toFixed(1) + '" y="' + y0.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + Math.max(0, hh - 1).toFixed(1) + '" fill="' + p.color + '"><title>' + esc(d.label + ' · ' + (p.name || '') + ': ' + CP.fmt(p.v)) + '</title></rect>';
      });
      if (i % Math.ceil(data.length / 12) === 0) g += '<text x="' + (x + w / 2) + '" y="' + (H - 6) + '" font-size="9.5" text-anchor="middle" fill="#6d687e">' + esc(d.label) + '</text>';
    });
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto" role="img" aria-label="' + esc(o.label || 'chart') + '">' + g + '</svg>';
  };

  /* Donut: [{label, value, color}] */
  ui.donut = (parts, o) => {
    o = o || {}; const s = o.size || 140, r = s / 2 - 10, c = 2 * Math.PI * r; const tot = parts.reduce((a, p) => a + p.value, 0) || 1;
    let off = 0, g = '';
    parts.forEach((p) => { const len = (p.value / tot) * c; g += '<circle cx="' + s / 2 + '" cy="' + s / 2 + '" r="' + r + '" fill="none" stroke="' + p.color + '" stroke-width="16" stroke-dasharray="' + Math.max(0, len - 2) + ' ' + (c - len + 2) + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 ' + s / 2 + ' ' + s / 2 + ')"><title>' + esc(p.label + ': ' + CP.fmt(p.value)) + '</title></circle>'; off += len; });
    const center = o.center ? '<text x="' + s / 2 + '" y="' + (s / 2 + 2) + '" text-anchor="middle" font-size="22" font-weight="700" fill="#451dc7">' + esc(o.center) + '</text><text x="' + s / 2 + '" y="' + (s / 2 + 18) + '" text-anchor="middle" font-size="10" fill="#6d687e">' + esc(o.centerSub || '') + '</text>' : '';
    return '<div class="row" style="gap:16px;align-items:center"><svg width="' + s + '" height="' + s + '" viewBox="0 0 ' + s + ' ' + s + '">' + g + center + '</svg><div style="display:grid;gap:6px;font-size:12.5px">' +
      parts.map((p) => '<span class="row" style="gap:8px"><i style="width:10px;height:10px;background:' + p.color + ';display:inline-block"></i>' + esc(p.label) + ' <b class="num">' + CP.fmt(p.value) + (o.unit || '') + '</b></span>').join('') + '</div></div>';
  };

  /* Semi-circular gauge 0..100 */
  ui.gauge = (v, o) => {
    o = o || {}; const W = o.w || 160, r = W / 2 - 12, cx = W / 2, cy = W / 2;
    const a = Math.PI * (1 - Math.max(0, Math.min(100, v)) / 100);
    const x = cx + r * Math.cos(a), y = cy - r * Math.sin(a);
    return '<svg viewBox="0 0 ' + W + ' ' + (W / 2 + 22) + '" width="' + W + '"><path d="M' + (cx - r) + ' ' + cy + ' A' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy + '" fill="none" stroke="#eeebf4" stroke-width="14"/>' +
      '<path d="M' + (cx - r) + ' ' + cy + ' A' + r + ' ' + r + ' 0 0 1 ' + x.toFixed(1) + ' ' + y.toFixed(1) + '" fill="none" stroke="' + (o.color || 'var(--indigo)') + '" stroke-width="14"/>' +
      '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="26" font-weight="700" fill="#201c30">' + esc(o.label || CP.fmt(v)) + '</text>' +
      '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" font-size="10.5" fill="#6d687e">' + esc(o.sub || '') + '</text></svg>';
  };

  /* Screen-specific CSS, injected once: CP.css('engage', '.x{...}') */
  CP.css = function (id, text) {
    if (document.getElementById('css-' + id)) return;
    const st = document.createElement('style'); st.id = 'css-' + id; st.textContent = text; document.head.appendChild(st);
  };

  /* ---------------- Toasts & modal ---------------- */
  CP.toast = function (msg, kind) {
    const box = document.getElementById('toasts'); if (!box) return;
    const t = document.createElement('div'); t.className = 'toast ' + (kind || ''); t.textContent = msg; box.appendChild(t);
    setTimeout(() => t.remove(), 4200);
  };
  CP.modal = function (title, body, foot) {
    let d = document.getElementById('cp-modal');
    if (!d) { d = document.createElement('dialog'); d.id = 'cp-modal'; d.className = 'modal'; document.body.appendChild(d); }
    d.innerHTML = '<div class="modal-head"><h2>' + title + '</h2><button class="ghost" data-close-modal aria-label="Close">' + CP.icon('x') + '</button></div><div class="modal-body">' + body + '</div>' + (foot ? '<div class="modal-foot">' + foot + '</div>' : '');
    if (!d.open) d.showModal();
    return d;
  };
  CP.closeModal = () => { const d = document.getElementById('cp-modal'); if (d && d.open) d.close(); };

  /* ---------------- Screens & router ----------------
     CP.screen({ id, group, label, icon, num, role, title,
                 render(params) -> html string,
                 mount?(rootEl, params)  called after each render,
                 actions?: { name(el, event, params) },   for [data-action="name"]
                 live?: true  re-render on store change (default true) })
     Routes: #/<id>[/<sub>][?k=v]. params = {sub, query}.
     Screens keep their own UI state in `this.ui` (persists across renders). */
  CP.screens = {};
  CP.screenOrder = [];
  CP.screen = function (def) {
    def.ui = def.ui || {};
    if (def.live == null) def.live = true;
    CP.screens[def.id] = def;
    if (CP.screenOrder.indexOf(def.id) < 0) CP.screenOrder.push(def.id);
    return def;
  };
  CP.route = { id: null, sub: null, query: {} };
  function parseHash() {
    const h = (location.hash || '').replace(/^#\/?/, '');
    const [path, q] = h.split('?');
    const parts = (path || '').split('/').filter(Boolean);
    const query = {};
    (q || '').split('&').filter(Boolean).forEach((kv) => { const [k, v] = kv.split('='); query[decodeURIComponent(k)] = decodeURIComponent(v || ''); });
    return { id: parts[0] || CP.data.home, sub: parts[1] || null, query };
  }
  CP.go = function (id, sub, query) {
    const q = query ? '?' + Object.keys(query).map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(query[k])).join('&') : '';
    const h = '#/' + id + (sub ? '/' + sub : '') + q;
    if (location.hash === h) CP.render(true); else location.hash = h;
  };
  CP.href = (id, sub) => '#/' + id + (sub ? '/' + sub : '');

  /* Cross-linking: any known case id shown in a screen becomes a link to its workspace. */
  function linkCases(root) {
    const ids = {}; store.get('cases').forEach((c) => { ids[c.id] = 1; });
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!/\bC-\d{4}\b/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        return n.parentElement.closest('a,button,pre,textarea,select,option,svg,.code,[data-nolink]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => {
      const html = esc(n.nodeValue).replace(/\bC-\d{4}\b/g, (m) => ids[m] ? '<a class="case-link" href="#/cases/' + m + '">' + m + '</a>' : m);
      if (html === esc(n.nodeValue)) return;
      const span = document.createElement('span'); span.innerHTML = html; n.parentNode.replaceChild(span, n);
    });
  }
  let lastId = null;
  CP.render = function (scrollTop) {
    const r = parseHash();
    const scr = CP.screens[r.id] || CP.screens[CP.data.home];
    if (!scr) return;
    CP.route = { id: scr.id, sub: r.sub, query: r.query };
    const root = document.getElementById('view');
    const changedScreen = lastId !== scr.id + '/' + r.sub;
    const y = window.scrollY;
    root.className = 'view' + (scr.flush ? ' flush' : '');
    try {
      if (scr.part === 2 && !CP.canSee(scr.id)) root.innerHTML = moduleRibbon(scr.id) + lockedHtml(scr);
      else root.innerHTML = (scr.part === 2 ? moduleRibbon(scr.id) : conceptRibbon(scr.id)) + scr.render.call(scr, CP.route);
      if (scr.mount) scr.mount.call(scr, root, CP.route);
      if (scr.id !== 'cases') linkCases(root);
    } catch (e) {
      console.error(e);
      root.innerHTML = '<div class="notice error">This screen failed to render: ' + esc(e.message) + '</div>';
    }
    if (changedScreen || scrollTop === true) window.scrollTo(0, 0); else window.scrollTo(0, y);
    lastId = scr.id + '/' + r.sub;
    renderNav();
    renderTop();
    CP.bus.emit('rendered', CP.route);
  };
  /* Re-render the current screen when the store changes (live screens only). */
  CP.bus.on('change', () => {
    const scr = CP.screens[CP.route.id];
    if (scr && scr.live && !CP._suspendRender) CP.render();
    else { renderNav(); renderTop(); }
  });

  /* ---------------- Shell: nav, top bar, role picker, drawer ---------------- */
  CP.currentRole = 'ciso';
  function setRole(id, silent) {
    CP.currentRole = id;
    try { localStorage.setItem('cp-role', id); } catch (e) { /* storage blocked */ }
    if (!silent) { const r = CP.role(id); if (r && r.screen) CP.go(r.screen); }
    renderTop();
  }
  CP.setRole = setRole;

  /* Role-based access to platform modules. */
  CP.module = (id) => (CP.data.modules || []).find((m) => m.id === id);
  CP.canSee = (id, role) => { const m = CP.module(id); return !m || m.roles.indexOf(role || CP.currentRole) >= 0; };
  function moduleRibbon(active) {
    const role = CP.currentRole; const groups = [];
    CP.data.modules.filter((m) => m.roles.indexOf(role) >= 0).forEach((m) => {
      let g = groups.find((x) => x.label === m.group); if (!g) { g = { label: m.group, items: [] }; groups.push(g); }
      g.items.push(m);
    });
    return '<nav class="tabbar" aria-label="Platform modules">' + groups.map((g) => '<div class="tg"><span class="tg-label">' + esc(g.label) + '</span>' +
      g.items.map((m) => {
        let count = '';
        if (m.id === 'inbox') { const n = store.pendingApprovals().filter((a) => CP.roleSees(a)).length; if (n) count = '<span class="count warn">' + n + '</span>'; }
        const mine = m.for && m.for.indexOf(role) >= 0;
        return '<a href="' + CP.href(m.id) + '" class="' + (active === m.id ? 'active' : '') + '" data-tour="mod-' + m.id + '">' + CP.icon(m.icon) + esc(m.label) + (mine ? '<span class="mine" title="Your daily work"></span>' : '') + count + '</a>';
      }).join('') + '</div>').join('') + '</nav>';
  }
  /* Which approvals a role should act on (its own, plus all for the CISO). */
  CP.roleSees = (a, role) => { role = role || CP.currentRole; return a.role === role || role === 'ciso' || (role === 'analyst' && a.role === 'run'); };
  function lockedHtml(scr) {
    const m = CP.module(scr.id) || {}; const role = CP.role(CP.currentRole);
    const who = CP.data.roles.filter((r) => m.roles && m.roles.indexOf(r.id) >= 0).map((r) => r.label);
    return '<div class="empty" style="margin-top:40px;padding:48px">' + CP.icon('lock') + '<h2 style="margin:10px 0 6px">' + esc(m.label || scr.label) + ' is not available for the ' + esc(role.label) + ' role</h2><p style="margin:0 0 16px">Role-based access: this module is open to ' + esc(who.join(', ')) + '.</p><a class="btn-demo" href="' + CP.href(role.screen) + '" style="display:inline-flex">Go to my home ' + CP.icon('arrowRight') + '</a></div>';
  }

  /* Dark ribbon for Part 1 pages and the guided demo (consoles draw their own). */
  function conceptRibbon(active) {
    const groups = CP.data.navGroups.filter((g) => g.part !== 2);
    return '<nav class="tabbar" aria-label="How it works">' + groups.map((g) => '<div class="tg"><span class="tg-label">' + esc(g.label) + '</span>' +
      g.items.map((id) => { const s = CP.screens[id]; if (!s) return ''; return '<a href="' + CP.href(id) + '" class="' + (active === id ? 'active' : '') + '" data-tour="nav-' + id + '">' + CP.icon(s.icon || 'info') + esc(s.label) + '</a>'; }).join('') + '</div>').join('') + '</nav>';
  }
  function renderNav() { /* kept for API compatibility: the ribbon is drawn with each screen */ }

  function renderTop() {
    const top = document.getElementById('top-right'); if (!top) return;
    const ms = document.getElementById('mode-switch');
    const scr = CP.screens[CP.route.id] || {};
    const pend = store.pendingApprovals();
    const p = CP.player;
    const st = p ? p.status() : null;
    const role = CP.role(CP.currentRole) || CP.data.roles[0];
    const persona = CP.person(role.persona);
    const menuOpen = !!(document.getElementById('role-menu') || {}).classList && document.getElementById('role-menu').classList.contains('open');
    if (ms) {
      ms.innerHTML = '<a href="' + CP.href('home') + '" class="' + (scr.part !== 2 ? 'on' : '') + '" data-tour="mode-how">' + CP.icon('layers') + '<span class="long">How it works</span><span class="short">Concept</span></a>' +
        '<div class="mode-pf role-picker"><button class="' + (scr.part === 2 ? 'on' : '') + '" data-role-toggle aria-haspopup="true" aria-expanded="' + menuOpen + '" data-tour="mode-platform">' + CP.icon('monitor') + '<span class="long">The platform</span><span class="short">Platform</span>' +
        '<span class="pf-role">' + ui.av(persona.id) + '<span class="lbl">' + esc(role.label) + '</span>' + CP.icon('chevronDown') + '</span></button>' +
        '<div class="role-menu' + (menuOpen ? ' open' : '') + '" id="role-menu" role="menu">' +
        CP.data.roles.map((r, k) => {
          const head = (k === 0 || CP.data.roles[k - 1].group !== r.group) ? '<div class="rm-head">' + esc(r.group) + '</div>' : '';
          const pp = CP.person(r.persona); const n = store.pendingApprovals(r.id).length;
          return head + '<button class="role-opt' + (r.id === CP.currentRole && scr.part === 2 ? ' active' : '') + '" role="menuitem" data-role="' + esc(r.id) + '">' + ui.av(pp.id) +
            '<span class="ro-txt"><b>' + esc(r.label) + '</b><small>' + esc(r.desc) + '</small></span>' + (n ? '<span class="count" title="Decisions awaiting">' + n + '</span>' : '') + '</button>';
        }).join('') + '</div></div>';
    }
    const sim = st && st.scenario
      ? '<div class="sim-pill ' + (st.waiting ? 'wait' : st.playing ? 'live' : '') + '" title="Scenario engine"><span class="dot"></span><b>' + esc(st.scenario.n + ' · ' + st.scenario.short) + '</b> · ' + (st.index + 1) + '/' + st.total + (st.waiting ? ' · <b style="color:#8a5a05">decision</b>' : '') + '</div>' +
        '<div class="mini-player">' + (st.playing ? '<button class="small" data-player="pause" title="Pause (space)" aria-label="Pause">' + CP.icon('pause') + '</button>' : '<button class="small" data-player="play" title="Play (space)" aria-label="Play"' + (st.done ? ' disabled' : '') + '>' + CP.icon('play') + '</button>') +
        '<button class="small" data-player="next" title="Next step (→)" aria-label="Next step"' + (st.done ? ' disabled' : '') + '>' + CP.icon('next') + '</button></div>'
      : '<div class="sim-pill"><span class="dot"></span>Simulated · <b>' + esc(CP.clock ? CP.clock.label() : '') + '</b></div>';
    const canSearch = CP.canSee('graph-x');
    top.innerHTML = (canSearch ? '<form class="gsearch" data-gsearch role="search"><label class="sr" for="gs-in">Search the security graph</label>' + CP.icon('search') + '<input id="gs-in" name="q" placeholder="Search assets, identities, suppliers, CVEs…" autocomplete="off" value="' + esc(CP.route.id === 'graph-x' ? (CP.route.query.q || '') : '') + '"></form>' : '') + sim +
      '<button class="bell' + (pend.length ? ' has' : '') + '" data-open-drawer title="Decisions awaiting a human">' + CP.icon('bell') + '<span class="lbl">Decisions</span>' + (pend.length ? '<span class="badge-n">' + pend.length + '</span>' : '') + '</button>' +
      '<a class="btn-demo" href="' + CP.href('demo') + '" title="Guided demo">' + CP.icon('play') + '<span class="lbl">Guided demo</span></a>';
  }
  CP.renderTop = renderTop;

  function renderDrawer() {
    const body = document.getElementById('drawer-body'); if (!body) return;
    const showAll = CP._drawerAll !== false;
    const all = store.get('approvals');
    const pend = all.filter((a) => a.status === 'pending' && (showAll || a.role === CP.currentRole));
    const done = all.filter((a) => a.status !== 'pending').slice(0, 6);
    body.innerHTML = '<div class="pill-tabs"><button class="' + (showAll ? 'active' : '') + '" data-drawer-filter="all">All roles</button><button class="' + (!showAll ? 'active' : '') + '" data-drawer-filter="mine">' + esc((CP.role(CP.currentRole) || {}).label || '') + ' only</button></div>' +
      '<p class="small-txt muted" style="margin:0">Agents act alone below their autonomy threshold. Above it, the orchestrator stops and asks the human who holds the decision right.</p>' +
      (pend.length ? pend.map((a) => ui.decision(a, { pulse: true })).join('') : '<div class="empty">No decision waiting. Start a scenario to see the orchestrator escalate.</div>') +
      (done.length ? '<h3 style="margin:10px 0 0">Recent decisions</h3>' + done.map((a) => ui.decision(a)).join('') : '');
  }
  CP.openDrawer = function () { renderDrawer(); document.getElementById('drawer').classList.add('open'); document.getElementById('scrim').classList.add('open'); };
  CP.closeDrawer = function () { document.getElementById('drawer').classList.remove('open'); document.getElementById('scrim').classList.remove('open'); };
  CP.bus.on('change', () => { if (document.getElementById('drawer').classList.contains('open')) renderDrawer(); });

  /* ---------------- Global delegated events ---------------- */
  document.addEventListener('click', (ev) => {
    const t = ev.target.closest('[data-decide],[data-player],[data-open-drawer],[data-close-drawer],[data-role-toggle],[data-role],[data-drawer-filter],[data-close-modal],[data-go],[data-action],[data-scenario-start]');
    const menu = document.getElementById('role-menu');
    if (menu && menu.classList.contains('open') && (!t || !t.closest('.role-picker'))) menu.classList.remove('open');
    if (!t) return;
    if (t.dataset.decide) { CP.decide(t.dataset.decide, t.dataset.decision); return; }
    if (t.dataset.player && CP.player) { CP.player[t.dataset.player](); return; }
    if (t.hasAttribute('data-open-drawer')) { CP.openDrawer(); return; }
    if (t.hasAttribute('data-close-drawer')) { CP.closeDrawer(); return; }
    if (t.hasAttribute('data-role-toggle')) { menu.classList.toggle('open'); t.setAttribute('aria-expanded', menu.classList.contains('open')); return; }
    if (t.dataset.role) { menu.classList.remove('open'); setRole(t.dataset.role); return; }
    if (t.dataset.drawerFilter) { CP._drawerAll = t.dataset.drawerFilter === 'all'; renderDrawer(); return; }
    if (t.hasAttribute('data-close-modal')) { CP.closeModal(); return; }
    if (t.dataset.scenarioStart && CP.player) { CP.player.load(t.dataset.scenarioStart, { autoplay: true }); if (t.dataset.goto) CP.go(t.dataset.goto); return; }
    if (t.dataset.go) { ev.preventDefault(); const [id, sub] = t.dataset.go.split('/'); CP.go(id, sub); return; }
    if (t.dataset.action) {
      const scr = CP.screens[CP.route.id];
      const fn = scr && scr.actions && scr.actions[t.dataset.action];
      if (fn) { ev.preventDefault(); fn.call(scr, t, ev, CP.route); }
      else if (CP.globalActions[t.dataset.action]) { ev.preventDefault(); CP.globalActions[t.dataset.action](t, ev); }
    }
  });
  document.addEventListener('submit', (ev) => {
    const f = ev.target.closest('[data-gsearch]'); if (!f) return;
    ev.preventDefault(); const q = f.querySelector('input').value.trim(); CP.go('graph-x', null, q ? { q } : null);
  });
  document.addEventListener('change', (ev) => {
    const t = ev.target.closest('[data-change]'); if (!t) return;
    const scr = CP.screens[CP.route.id];
    const fn = scr && scr.actions && scr.actions[t.dataset.change];
    if (fn) fn.call(scr, t, ev, CP.route);
    else if (CP.globalActions[t.dataset.change]) CP.globalActions[t.dataset.change](t, ev);
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.target.closest('input,textarea,select,[contenteditable]')) return;
    if (ev.key === 'Escape') { CP.closeDrawer(); const m = document.getElementById('role-menu'); if (m) m.classList.remove('open'); }
    if (!CP.player) return;
    const cur = CP.screens[CP.route.id];
    if (cur && cur.ownKeys) return;
    if (ev.key === ' ' && CP.player.status().scenario) { ev.preventDefault(); CP.player.toggle(); }
    if (ev.key === 'ArrowRight' && CP.player.status().scenario && !(CP.tour && CP.tour.active)) { ev.preventDefault(); CP.player.next(); }
  });
  CP.globalActions = {
    resetDemo() { if (CP.player) CP.player.stop(); store.reset(); CP.toast('Demo reset: baseline data restored.'); }
  };

  window.addEventListener('hashchange', () => CP.render());
  CP.boot = function () {
    try { const r = localStorage.getItem('cp-role'); if (r && CP.role(r)) CP.currentRole = r; } catch (e) { /* storage blocked */ }
    store.reset();
    CP.bus.emit('boot');
    CP.render(true);
  };
  document.addEventListener('DOMContentLoaded', () => CP.boot());
})();
