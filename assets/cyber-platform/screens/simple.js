/* Cyber AI Platform demo: the Simple version of The platform.
   Four essential screens per internal role (Overview, Decisions, Cases,
   Agents): one status sentence, a few big numbers, decisions with big
   buttons, cases as a story with four stages, agents as traffic lights.
   Every screen links to its detail in the Complete version. */
(function () {
  'use strict';
  const CP = window.CP; const esc = CP.esc; const ui = CP.ui; const I = CP.icon;
  const S = () => CP.store;

  CP.css('simple', `
  .sm{max-width:1280px;margin:0 auto}
  .sm-hero{display:flex;align-items:center;gap:22px;padding:26px 28px;border:1px solid var(--line);background:#fff;margin-bottom:20px;position:relative;overflow:hidden}
  .sm-hero::before{content:'';position:absolute;left:0;top:0;bottom:0;width:6px;background:var(--hc)}
  .sm-hero .ic{width:64px;height:64px;display:grid;place-items:center;font-size:30px;flex:none;color:#fff;background:var(--hc)}
  .sm-hero .tx{flex:1;min-width:0}
  .sm-hero .k{font-size:11.5px;letter-spacing:1.4px;text-transform:uppercase;font-weight:700;color:var(--hc)}
  .sm-hero h1{font-size:30px;margin:4px 0 6px;letter-spacing:-.8px}
  .sm-hero p{margin:0;font-size:15px;color:var(--muted);max-width:760px}
  .sm-hero .act{display:flex;gap:8px;flex-wrap:wrap}
  .sm-hero .act button,.sm-hero .act a{min-height:46px;padding:0 18px;font-size:14.5px}
  .sm-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-bottom:24px}
  .sm-kpi{background:#fff;border:1px solid var(--line);padding:20px 22px}
  .sm-kpi .v{font-size:44px;font-weight:700;letter-spacing:-1.6px;line-height:1;color:var(--indigo);font-variant-numeric:tabular-nums}
  .sm-kpi .v small{font-size:18px;font-weight:600;letter-spacing:-.3px;margin-left:3px}
  .sm-kpi .l{font-size:14px;font-weight:600;margin-top:10px}
  .sm-kpi .s{font-size:12.5px;color:var(--muted);margin-top:3px}
  .sm-kpi.good .v{color:var(--green-ink)}.sm-kpi.warn .v{color:#b8770f}.sm-kpi.bad .v{color:var(--red)}
  .sm-sec{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin:6px 0 12px}
  .sm-sec h2{font-size:19px;margin:0}
  .sm-sec a{font-size:13px;font-weight:600}
  .sm-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:20px;align-items:start}
  .sm-dec{border:1px solid #f1c27a;border-left:5px solid #ffb648;background:#fffaf0;padding:18px 20px;margin-bottom:12px}
  .sm-dec .who{font-size:12.5px;color:#8a5a05;font-weight:600;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .sm-dec h3{font-size:18px;margin:8px 0 6px;line-height:1.3}
  .sm-dec p{margin:0 0 12px;font-size:14px;color:#3b3550;line-height:1.55}
  .sm-dec .row{gap:10px}
  .sm-dec .row button{min-height:46px;padding:0 20px;font-size:14.5px}
  .sm-dec.done{border-color:var(--line);border-left-color:var(--green-ink);background:#fff}
  .sm-dec.ro{border-left-color:#b9b3c9;background:#fff}
  .sm-case{background:#fff;border:1px solid var(--line);border-left:5px solid var(--sc);padding:16px 18px;margin-bottom:12px}
  .sm-case .top{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:12.5px;color:var(--muted)}
  .sm-case h3{font-size:16.5px;margin:6px 0 4px;line-height:1.3}
  .sm-case p{margin:0;font-size:13.5px;color:var(--muted);line-height:1.5}
  .sm-stages{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin:12px 0 4px}
  .sm-stages div{font-size:11.5px;font-weight:600;color:var(--muted);text-align:center;padding-top:8px;border-top:5px solid #e5e1ef}
  .sm-stages div.on{color:var(--ink);border-top-color:var(--green-ink)}
  .sm-stages div.cur{color:var(--ink);border-top-color:#ffb648}
  .sm-case .acts{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
  .sm-story{margin:12px 0 0;padding:0;list-style:none;border-top:1px solid var(--line)}
  .sm-story li{display:grid;grid-template-columns:58px 1fr;gap:10px;padding:9px 0;border-bottom:1px solid var(--line);font-size:13.5px;line-height:1.45}
  .sm-story .t{font-family:var(--mono);font-size:11.5px;color:var(--muted);padding-top:2px}
  .sm-story b{font-weight:600}
  .sm-today{background:#fff;border:1px solid var(--line);padding:18px 20px}
  .sm-today li{font-size:14.5px;line-height:1.5;margin:0 0 10px}
  .sm-today ul{margin:0;padding-left:20px}
  .sm-empty{display:flex;gap:16px;align-items:center;background:#fff;border:1px solid var(--line);padding:22px}
  .sm-empty .ok{width:48px;height:48px;display:grid;place-items:center;background:var(--green-ink);color:#fff;font-size:24px;flex:none}
  .sm-empty b{display:block;font-size:16.5px;margin-bottom:3px}
  .sm-empty span{font-size:13.5px;color:var(--muted)}
  .sm-agents{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
  .sm-agent{background:#fff;border:1px solid var(--line);padding:14px 16px;display:flex;gap:12px;align-items:flex-start}
  .sm-light{width:14px;height:14px;border-radius:50%;flex:none;margin-top:4px;background:var(--lc);box-shadow:0 0 0 4px color-mix(in srgb,var(--lc) 18%,transparent)}
  .sm-agent b{display:block;font-size:14.5px}
  .sm-agent .d{font-size:12px;color:var(--muted);margin-top:2px}
  .sm-agent .m{font-size:13px;margin-top:8px;font-weight:600}
  .sm-agent .n{font-size:12px;color:var(--muted)}
  .sm-dom{font-size:11.5px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;color:var(--muted);margin:18px 0 8px;display:flex;gap:8px;align-items:center}
  .sm-dom i{width:10px;height:10px;display:inline-block}
  .sm-more{margin-top:26px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 20px;border:1px dashed var(--line);flex-wrap:wrap}
  .sm-more span{font-size:13.5px;color:var(--muted)}
  @media(max-width:1100px){.sm-kpis,.sm-agents{grid-template-columns:repeat(2,minmax(0,1fr))}.sm-grid{grid-template-columns:1fr}}
  @media(max-width:760px){.sm-hero{flex-direction:column;align-items:flex-start;padding:20px}.sm-hero h1{font-size:23px}.sm-kpis{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.sm-kpi{padding:14px}.sm-kpi .v{font-size:32px}.sm-agents{grid-template-columns:1fr}.sm-dec .row button{flex:1}}
  :root[data-theme="console"] .sm-hero,:root[data-theme="console"] .sm-kpi,:root[data-theme="console"] .sm-case,:root[data-theme="console"] .sm-today,:root[data-theme="console"] .sm-empty,:root[data-theme="console"] .sm-agent{border-radius:12px}
  :root[data-theme="console"] .sm-hero .ic,:root[data-theme="console"] .sm-empty .ok{border-radius:12px}
  :root[data-theme="console"] .sm-kpi .v{color:#fff}
  :root[data-theme="console"] .sm-kpi.good .v{color:#5cf0b0}:root[data-theme="console"] .sm-kpi.warn .v{color:#ffc078}:root[data-theme="console"] .sm-kpi.bad .v{color:#ff8fa3}
  :root[data-theme="console"] .sm-dec{border-radius:12px;background:linear-gradient(90deg,rgba(255,159,67,.1),rgba(255,159,67,.02));border-color:rgba(255,159,67,.35)}
  :root[data-theme="console"] .sm-dec h3{color:#fff}
  :root[data-theme="console"] .sm-dec p{color:var(--c-ink-2)}
  :root[data-theme="console"] .sm-dec .who{color:#ffc078}
  :root[data-theme="console"] .sm-dec.done,:root[data-theme="console"] .sm-dec.ro{background:var(--c-panel);border-color:var(--c-line)}
  :root[data-theme="console"] .sm-stages div{border-top-color:#2a3142}
  :root[data-theme="console"] .sm-stages div.on{border-top-color:#3ddc97}
  :root[data-theme="console"] .sm-stages div.cur{border-top-color:#ffb648}
  :root[data-theme="console"] .sm-more{border-color:var(--c-line-strong);border-radius:12px}
  `);

  const AUTONOMY_WORDS = { L0: 'Suggests only', L1: 'Asks first', L2: 'Acts and notifies', L3: 'Acts alone' };
  const SEV = { critical: ['var(--red)', 'Critical'], high: ['#e0662b', 'High'], medium: ['#c8861a', 'Medium'], low: ['#2f7de1', 'Low'] };
  const role = () => CP.currentRole;
  const roleObj = () => CP.role(role()) || CP.data.roles[0];
  const K = () => S().state.kpis;

  function pending() { return S().pendingApprovals().filter((a) => CP.roleSees(a)); }
  function mine() { return S().pendingApprovals().filter((a) => a.role === role()); }
  function openCases() { return S().get('cases').filter((c) => c.status !== 'closed').sort((a, b) => sevRank(a) - sevRank(b)); }
  function sevRank(c) { return ['critical', 'high', 'medium', 'low'].indexOf(c.severity); }
  function agentsState() {
    const A = S().get('agents');
    const bad = A.filter((a) => a.status === 'suspended' || a.status === 'paused');
    const warn = A.filter((a) => a.status === 'degraded' || a.status === 'canary');
    const devs = S().get('deviations').filter((d) => d.status !== 'closed');
    return { A, bad, warn, devs, ok: !bad.length && !warn.length && !devs.length };
  }

  /* ---------------- Status hero ---------------- */
  function hero() {
    const m = mine(); const p = pending(); const oc = openCases(); const ag = agentsState();
    const crit = oc.filter((c) => c.severity === 'critical');
    const st = CP.player.status();
    let c, icon, k, title, sub, act;
    if (m.length) {
      c = '#ffb648'; icon = 'users'; k = 'Your decision is needed';
      title = m.length === 1 ? 'One decision is waiting for you' : m.length + ' decisions are waiting for you';
      sub = m[0].title + '. The platform has prepared everything; it acts as soon as you decide.';
      act = '<button class="go" data-go="s-decisions">' + I('arrowRight') + ' Decide now</button>';
    } else if (crit.length) {
      c = 'var(--red)'; icon = 'alert'; k = 'Critical case in progress';
      title = crit[0].title;
      sub = crit[0].summary + ' The agents are handling it; you will be called if a decision crosses your threshold.';
      act = '<button class="primary" data-go="s-cases">' + I('workflow') + ' Follow the case</button>';
    } else if (!ag.ok) {
      c = '#ffb648'; icon = 'eye'; k = 'An agent needs attention';
      title = ag.devs.length ? 'An agent is behaving unusually' : 'An agent runs with reduced autonomy';
      sub = ag.devs.length ? ag.devs[0].signal + '.' : (ag.warn.concat(ag.bad)[0] || {}).name + ' is ' + (ag.warn.concat(ag.bad)[0] || {}).status + ' while Trust & Challenge and Run check it.';
      act = '<button class="primary" data-go="s-agents">' + I('bot') + ' See the agents</button>';
    } else {
      c = 'var(--green-ink)'; icon = 'shieldCheck'; k = 'All under control';
      title = 'Nothing needs you right now';
      sub = CP.fmt(K().actionsToday) + ' actions today, ' + K().autonomousShare + '% handled by the agents alone. ' + (oc.length ? oc.length + ' cases in progress, none critical.' : 'No open case.');
      act = st.scenario ? '' : '<button class="primary" data-scenario-start="cti">' + I('play') + ' Show me a real case</button>';
    }
    if (p.length && !m.length && c === 'var(--green-ink)') sub += ' ' + p.length + ' decision' + (p.length > 1 ? 's' : '') + ' waiting for another role.';
    return '<section class="sm-hero" style="--hc:' + c + '" data-tour="simple-status"><span class="ic">' + I(icon) + '</span><div class="tx"><div class="k">' + esc(k) + '</div><h1>' + esc(title) + '</h1><p>' + esc(sub) + '</p></div><div class="act">' + act + '</div></section>';
  }

  /* ---------------- KPIs per role ---------------- */
  function kpis() {
    const k = K(); const r = role(); const ag = agentsState(); const tp = S().get('thirdParties');
    const comms = S().get('comms').filter((m) => m.status === 'awaiting').length;
    const rel = S().get('releases').filter((x) => x.status !== 'done').length;
    const back = S().get('backlog').filter((x) => x.status === 'new').length;
    const evAvg = S().get('evals').reduce((a, e) => a + e.score, 0) / Math.max(1, S().get('evals').length);
    const regs = S().get('regulatory').filter((x) => x.status === 'at-risk').length;
    const L = {
      ciso: [[k.riskScore, '/100', 'Cyber risk score', '-6 points this quarter', 'good'], [k.mttcMinutes, 'min', 'Time to contain', 'was 5 h 40 before the platform', 'good'], [k.hoursSaved, 'h', 'Hours saved this month', '≈ ' + CP.fmt(k.hoursSaved / 61, 1) + ' people freed', 'good'], [k.humanDecisions, '', 'Decisions taken by humans today', 'everything else stayed inside guardrails', '']],
      engage: [[tp.filter((t) => ['overdue', 'flagged'].indexOf(t.questionnaire.status) >= 0).length, '', 'Suppliers to chase', 'late or flagged answers', 'warn'], [regs, '', 'Regulatory deadlines at risk', 'of ' + S().get('regulatory').length + ' tracked', regs ? 'warn' : 'good'], [comms, '', 'Messages to validate', 'drafted by the agents', comms ? 'warn' : ''], [tp.filter((t) => t.criticality === 'critical').length, '', 'Critical suppliers', 'followed continuously', '']],
      build: [[rel, '', 'Releases in the pipeline', 'evals, red team, canary', ''], [back, '', 'New requests in the backlog', 'from Engage, Run, Trust', back ? 'warn' : ''], [CP.fmt(evAvg, 1), '%', 'Average eval score', 'across all agents', 'good'], [S().get('agents').filter((a) => a.status === 'canary').length, '', 'Agents in canary', 'new versions under watch', '']],
      run: [[ag.A.length - ag.bad.length - ag.warn.length, '/' + ag.A.length, 'Agents healthy', ag.ok ? 'all within guardrails' : 'some under watch', ag.ok ? 'good' : 'warn'], [CP.fmt(k.actionsToday), '', 'Actions today', k.autonomousShare + '% without a human', ''], [S().pendingApprovals('run').length, '', 'Waiting for Run', 'kill-switch, rollback, autonomy', S().pendingApprovals('run').length ? 'warn' : 'good'], [CP.eur(k.aiCostToday), '', 'AI cost today', 'budget €2,100 a day', '']],
      trust: [[ag.devs.length, '', 'Open deviations', 'agents behaving unusually', ag.devs.length ? 'bad' : 'good'], [S().get('redteam').filter((x) => x.result === 'bypassed').length, '', 'Red-team bypasses open', 'attacks that got through', S().get('redteam').some((x) => x.result === 'bypassed') ? 'bad' : 'good'], [CP.fmt(evAvg, 1), '%', 'Average eval score', 'on gold sets', 'good'], [ag.ok ? 'Yes' : 'Watch', '', 'Agents under control', ag.ok ? 'no open issue' : 'see Agents', ag.ok ? 'good' : 'warn']],
      analyst: [[openCases().length, '', 'Cases in progress', 'agents work them with you', ''], [pending().length, '', 'Decisions to follow', 'yours or in the loop', pending().length ? 'warn' : 'good'], [CP.fmt(k.alertsTriaged), '', 'Alerts triaged by agents', 'today, sampled by QA', ''], [k.mttcMinutes, 'min', 'Time to contain', 'mean, last 30 days', 'good']]
    };
    return '<div class="sm-kpis" data-tour="simple-kpis">' + (L[r] || L.ciso).map((x) => '<div class="sm-kpi ' + x[4] + '"><div class="v">' + esc(String(x[0])) + (x[1] ? '<small>' + esc(x[1]) + '</small>' : '') + '</div><div class="l">' + esc(x[2]) + '</div><div class="s">' + esc(x[3]) + '</div></div>').join('') + '</div>';
  }

  /* ---------------- Decisions ---------------- */
  function decisionCard(a) {
    const can = a.role === role();
    const dec = CP.person(a.decider);
    if (a.status !== 'pending') {
      return '<div class="sm-dec done"><div class="who">' + ui.status(a.status) + ' ' + esc(a.decidedAt || '') + (a.decidedBy ? ' · ' + esc((CP.person(a.decidedBy) || {}).name || '') : '') + '</div><h3>' + esc(a.title) + '</h3></div>';
    }
    return '<div class="sm-dec' + (can ? '' : ' ro') + '" data-tour="decision-' + esc(a.id) + '"><div class="who">' + I('users') + ' ' + (can ? 'You decide' : esc(dec ? dec.name : '') + ' decides') + ' · ' + esc(a.threshold ? 'above threshold: ' + a.threshold : 'above threshold') + '</div>' +
      '<h3>' + esc(a.title) + '</h3><p>' + esc(a.summary || '') + (a.recommendation ? ' <b>Recommendation:</b> ' + esc(a.recommendation) : '') + '</p>' +
      (can ? '<div class="row wrap"><button class="go" data-decide="' + esc(a.id) + '" data-decision="approve">' + I('check') + ' ' + esc(a.approveLabel || 'Approve') + '</button><button class="danger" data-decide="' + esc(a.id) + '" data-decision="reject">' + I('x') + ' ' + esc(a.rejectLabel || 'Reject') + '</button><button class="ghost" data-go="inbox">Details</button></div>'
        : '<div class="small-txt muted">You are kept in the loop; the decision belongs to ' + esc(dec ? dec.name : 'another role') + '.</div>') + '</div>';
  }
  function noDecision(text) {
    return '<div class="sm-empty"><span class="ok">' + I('check') + '</span><div><b>Nothing to decide</b><span>' + esc(text || 'Below their thresholds the agents act alone. You are called only when blast radius, money, a message leaving the group, low confidence or a first time require a human.') + '</span></div></div>';
  }

  /* ---------------- Cases ---------------- */
  function stages(c) {
    const scn = (CP.scenarios || []).find((s) => s.caseId === c.id);
    const tr = S().get('traces').filter((t) => t.case === c.id);
    const acted = c.status !== 'open' || S().get('actions').some((a) => scn && a.scenario === scn.id) || tr.some((t) => t.level === 'L2' || t.level === 'L3');
    const aps = S().get('approvals').filter((a) => scn && a.scenario === scn.id);
    const decided = c.status === 'closed' || (aps.length && aps.every((a) => a.status !== 'pending'));
    const closed = c.status === 'closed';
    const list = [['Detected', true], ['Protected', acted], ['Decided', !!decided], ['Closed', closed]];
    const cur = list.findIndex((x) => !x[1]);
    return '<div class="sm-stages">' + list.map((x, i) => '<div class="' + (x[1] ? 'on' : i === cur ? 'cur' : '') + '">' + esc(x[0]) + '</div>').join('') + '</div>';
  }
  function story(c) {
    const tr = S().get('traces').filter((t) => t.case === c.id);
    if (!tr.length) return '<ul class="sm-story"><li><span class="t">' + esc(c.opened) + '</span><span>' + esc(c.summary) + '</span></li></ul>';
    return '<ul class="sm-story">' + tr.map((t) => '<li><span class="t">' + esc(t.ts.slice(4)) + '</span><span><b>' + esc(CP.actor(t.actor).name) + '</b>: ' + esc(t.title) + (t.metric ? ' · ' + esc(t.metric.value) : '') + '</span></li>').join('') + '</ul>';
  }
  function caseCard(c, open) {
    const s = SEV[c.severity] || SEV.low;
    const scn = (CP.scenarios || []).find((x) => x.caseId === c.id);
    return '<article class="sm-case" style="--sc:' + s[0] + '"><div class="top">' + ui.sev(c.severity) + ui.status(c.status) + '<span>' + esc(c.id) + ' · opened ' + esc(c.opened) + '</span></div>' +
      '<h3>' + esc(c.title) + '</h3><p>' + esc(c.summary) + '</p>' + stages(c) +
      (open ? story(c) : '') +
      '<div class="acts"><button class="small" data-action="smStory" data-id="' + esc(c.id) + '">' + I(open ? 'chevronDown' : 'list') + ' ' + (open ? 'Hide the story' : 'See the story') + '</button><button class="small" data-go="cases/' + esc(c.id) + '">' + I('external') + ' Full case</button>' + (scn && !S().get('traces').some((t) => t.case === c.id) ? '<button class="small" data-scenario-start="' + scn.id + '">' + I('play') + ' Play it</button>' : '') + '</div></article>';
  }

  /* ---------------- Agents ---------------- */
  function light(a) {
    if (a.status === 'suspended' || a.status === 'paused') return ['var(--red)', 'Stopped'];
    if (a.status === 'degraded') return ['#ffb648', 'Under watch'];
    if (a.status === 'canary') return ['#8b7cff', 'New version on trial'];
    return ['var(--green-ink)', 'Working normally'];
  }
  function agentTile(a) {
    const l = light(a); const d = CP.domain(a.domain);
    return '<div class="sm-agent"><span class="sm-light" style="--lc:' + l[0] + '"></span><div><b>' + esc(a.name) + '</b><div class="d">' + esc(d.label) + ' · ' + esc(l[1]) + '</div><div class="m">' + esc(AUTONOMY_WORDS[a.mode] || a.mode) + '</div><div class="n">' + CP.fmt(a.tasksToday) + ' tasks today</div></div></div>';
  }

  function more(target, label) {
    return '<div class="sm-more"><span>' + I('layers') + ' The Complete version shows every module, filter and detail.</span><button data-action="smComplete" data-to="' + esc(target) + '">' + esc(label) + ' ' + I('arrowRight') + '</button></div>';
  }
  function live() {
    const st = CP.player.status(); if (!st.scenario) return '';
    return '<div class="notice info" style="margin:-6px 0 18px">' + I('activity') + ' <b>' + esc(st.scenario.n + ' · ' + st.scenario.short) + '</b> is running: step ' + (st.index + 1) + ' of ' + st.total + (st.step ? ': ' + esc(st.step.title) : '') + '. Everything on this page updates live.</div>';
  }

  /* ---------------- Screens ---------------- */
  const base = { part: 2, ui: { open: {} } };
  const actions = {
    smStory(el) { const id = el.dataset.id; CP.screens['s-cases'].ui.open[id] = !CP.screens['s-cases'].ui.open[id]; CP.render(); },
    smComplete(el) { CP.setMode('complete', false); CP.go(el.dataset.to); }
  };

  CP.screen(Object.assign({}, base, {
    id: 's-home', label: 'Overview', icon: 'home', actions,
    render() {
      const r = roleObj(); const oc = openCases().slice(0, 3); const m = pending().slice(0, 3);
      const A = S().get('agents'); const top = A.slice().sort((a, b) => b.tasksToday - a.tasksToday)[0];
      const rb = S().get('actions').filter((a) => a.status === 'rolled-back').length;
      return '<div class="sm">' + '<div class="eyebrow">' + esc(r.label) + ' · Simple view</div>' + live() + hero() + kpis() +
        '<div class="sm-grid"><div><div class="sm-sec"><h2>Needs you</h2><a href="' + CP.href('s-decisions') + '">All decisions</a></div>' + (m.length ? m.map(decisionCard).join('') : noDecision()) + '</div>' +
        '<div><div class="sm-sec"><h2>Happening now</h2><a href="' + CP.href('s-cases') + '">All cases</a></div>' + (oc.length ? oc.map((c) => caseCard(c, false)).join('') : noDecision('No case in progress.')) +
        '<div class="sm-sec" style="margin-top:18px"><h2>Today, the agents</h2><a href="' + CP.href('s-agents') + '">All agents</a></div><div class="sm-today"><ul>' +
        '<li><b>' + CP.fmt(K().actionsToday) + ' actions</b>, ' + K().autonomousShare + '% of them alone, inside their guardrails.</li>' +
        '<li><b>' + CP.fmt(K().humanDecisions) + ' decisions</b> asked a human, only above threshold.</li>' +
        '<li>Busiest: <b>' + esc(top.name) + '</b>, ' + CP.fmt(top.tasksToday) + ' tasks.</li>' +
        '<li>' + (rb ? '<b>' + rb + ' action' + (rb > 1 ? 's' : '') + ' rolled back</b> by Run.' : 'No action had to be rolled back.') + '</li></ul></div></div></div>' +
        more(CP.role(role()).screen === 'ciso' ? 'ciso' : 'my', 'Open the complete console') + '</div>';
    }
  }));

  CP.screen(Object.assign({}, base, {
    id: 's-decisions', label: 'Decisions', icon: 'users', actions,
    render() {
      const p = pending(); const done = S().get('approvals').filter((a) => a.status !== 'pending' && CP.roleSees(a)).slice(0, 5);
      return '<div class="sm"><div class="eyebrow">' + esc(roleObj().label) + ' · Simple view</div>' + CP.ui.head('', 'Decisions', 'Only what crosses a threshold reaches a human. Each decision comes ready to execute, with the platform\'s recommendation.') + live() +
        (p.length ? p.map(decisionCard).join('') : noDecision()) +
        (done.length ? '<div class="sm-sec" style="margin-top:22px"><h2>Already decided</h2></div>' + done.map(decisionCard).join('') : '') +
        more('inbox', 'Open the full inbox') + '</div>';
    }
  }));

  CP.screen(Object.assign({}, base, {
    id: 's-cases', label: 'Cases', icon: 'workflow', actions,
    render() {
      const all = S().get('cases'); const oc = openCases(); const closed = all.filter((c) => c.status === 'closed');
      const open = this.ui.open;
      return '<div class="sm"><div class="eyebrow">' + esc(roleObj().label) + ' · Simple view</div>' + CP.ui.head('', 'Cases', 'Every case follows four stages: detected, protected, decided, closed. Open the story to read what the agents did, in plain words.') + live() +
        '<div class="sm-sec"><h2>In progress · ' + oc.length + '</h2></div>' + (oc.length ? oc.map((c) => caseCard(c, !!open[c.id])).join('') : noDecision('No case in progress.')) +
        (closed.length ? '<div class="sm-sec" style="margin-top:22px"><h2>Closed · ' + closed.length + '</h2></div>' + closed.map((c) => caseCard(c, !!open[c.id])).join('') : '') +
        '<div class="sm-sec" style="margin-top:22px"><h2>Play a scenario</h2></div><div class="row wrap">' + CP.scenarios.map((s) => '<button data-scenario-start="' + s.id + '">' + I('play') + ' ' + esc(s.n + ' · ' + s.short) + '</button>').join('') + '</div>' +
        more('cases', 'Open the case queue') + '</div>';
    }
  }));

  CP.screen(Object.assign({}, base, {
    id: 's-agents', label: 'Agents', icon: 'bot', actions,
    render() {
      const ag = agentsState();
      const head = ag.ok ? 'All ' + ag.A.length + ' agents are working normally' : (ag.bad.length + ag.warn.length) + ' agent' + (ag.bad.length + ag.warn.length > 1 ? 's' : '') + ' under watch, ' + (ag.A.length - ag.bad.length - ag.warn.length) + ' working normally';
      const doms = ['soc', 'cti', 'appsec', 'grc', 'iam', 'data'];
      return '<div class="sm"><div class="eyebrow">' + esc(roleObj().label) + ' · Simple view</div>' + CP.ui.head('', 'Agents', 'Green: working normally. Amber: under watch or new version on trial. Red: stopped by the kill-switch. Under each agent, what it is allowed to do.') + live() +
        '<section class="sm-hero" style="--hc:' + (ag.ok ? 'var(--green-ink)' : '#ffb648') + '"><span class="ic">' + I(ag.ok ? 'shieldCheck' : 'eye') + '</span><div class="tx"><div class="k">' + (ag.ok ? 'Agents under control' : 'Attention') + '</div><h1>' + esc(head) + '</h1><p>' + esc(ag.devs.length ? 'Open deviation: ' + ag.devs[0].signal + '.' : 'Kill-switches pulled this week: ' + K().killSwitches + '. Every action keeps a rollback point.') + '</p></div></section>' +
        doms.map((d) => { const list = ag.A.filter((a) => a.domain === d); if (!list.length) return ''; const D = CP.domain(d); return '<div class="sm-dom"><i style="background:' + D.color + '"></i>' + esc(D.label) + '</div><div class="sm-agents">' + list.map(agentTile).join('') + '</div>'; }).join('') +
        more('run', 'Open live operations') + '</div>';
    }
  }));
})();
