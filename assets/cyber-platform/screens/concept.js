/* Cyber AI Platform demo: Part 1 pages (overview, how to build it,
   decision rights). The architecture views live in architecture.js. */
(function () {
  'use strict';
  const CP = window.CP; const esc = CP.esc; const ui = CP.ui;

  CP.css('concept', `
  .cx-hero{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:20px;margin-bottom:20px}
  .cx-hero .welcome{background:var(--dark);color:#fff;padding:34px 34px 30px;position:relative;overflow:hidden}
  .cx-hero .welcome h1{color:#fff;font-size:34px;max-width:620px;margin:6px 0 14px}
  .cx-hero .welcome p{color:#d7ceeb;font-size:15.5px;line-height:1.65;max-width:620px;margin:0 0 20px}
  .cx-hero .welcome .eyebrow{color:var(--green)}
  .cx-hero .welcome svg.arcs{position:absolute;right:-60px;bottom:-80px;width:360px;opacity:.5;pointer-events:none}
  .cx-ideas{display:grid;gap:0;background:#fff;border:1px solid var(--line)}
  .cx-idea{display:flex;gap:16px;padding:18px 20px;border-bottom:1px solid var(--line)}
  .cx-idea:last-child{border:0}
  .cx-idea .n{width:36px;height:36px;flex:none;display:grid;place-items:center;background:var(--indigo-50);border:1px solid #d8cfee;color:var(--indigo);font-weight:700}
  .cx-idea b{display:block;font-size:15px;margin-bottom:3px}
  .cx-idea span{font-size:13.5px;color:var(--muted);line-height:1.55}
  .cx-parts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin:20px 0}
  .cx-part{border:1px solid var(--line);background:#fff;padding:22px;display:flex;flex-direction:column;gap:10px;text-decoration:none;color:inherit;transition:transform .15s,box-shadow .15s,border-color .15s}
  .cx-part:hover{border-color:var(--indigo);box-shadow:4px 4px 0 var(--indigo);transform:translate(-2px,-2px)}
  .cx-part h2{margin:0;color:var(--indigo)}
  .cx-part p{margin:0;font-size:14px;color:var(--muted);line-height:1.6}
  .cx-part .chips{display:flex;flex-wrap:wrap;gap:6px}
  .cx-part .go-l{margin-top:auto;font-weight:650;color:var(--indigo);font-size:13.5px;display:flex;gap:6px;align-items:center}
  .cx-flow{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:0;border:1px solid var(--line);background:#fff}
  .cx-flow > div{padding:16px;border-right:1px solid var(--line);position:relative}
  .cx-flow > div:last-child{border-right:0}
  .cx-flow .k{font-family:var(--mono);font-size:11px;color:var(--muted)}
  .cx-flow b{display:block;margin:4px 0 4px;font-size:14px}
  .cx-flow span{font-size:12.5px;color:var(--muted);line-height:1.5;display:block}
  .cx-flow > div::after{content:'';position:absolute;right:-7px;top:24px;width:12px;height:12px;background:#fff;border-top:1px solid var(--line);border-right:1px solid var(--line);transform:rotate(45deg);z-index:1}
  .cx-flow > div:last-child::after{display:none}
  .cx-waves{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;border:1px solid var(--line);background:#fff}
  .cx-wave{padding:20px;border-right:1px solid var(--line);display:flex;flex-direction:column;gap:10px}
  .cx-wave:last-child{border-right:0}
  .cx-wave .wh{display:flex;justify-content:space-between;align-items:baseline}
  .cx-wave .wn{font-family:var(--mono);font-size:12px;color:var(--muted)}
  .cx-wave h3{margin:0;font-size:17px;color:var(--indigo)}
  .cx-wave .bar{height:6px;background:linear-gradient(90deg,var(--indigo) var(--p),#eeebf4 var(--p))}
  .cx-wave ul{margin:0;padding-left:17px;font-size:13px;line-height:1.6}
  .cx-wave .exit{font-size:12.5px;background:var(--green-50);color:#116539;padding:8px 10px}
  .cx-ladder{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
  .cx-step{border:1px solid var(--line);background:#fff;padding:16px;position:relative}
  .cx-step::before{content:'';position:absolute;left:0;right:0;bottom:0;height:calc(var(--h) * 1%);background:linear-gradient(0deg,#e9e4fb,transparent);z-index:0}
  .cx-step > *{position:relative;z-index:1}
  .cx-step h3{margin:8px 0 6px;font-size:16px}
  .cx-step p{margin:0;font-size:13px;color:var(--muted);line-height:1.55}
  .cx-step .ex{font-size:12.5px;margin-top:10px;color:#3b3550}
  .cx-sim{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:20px}
  .cx-sim label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600;margin-bottom:14px}
  .cx-sim select,.cx-sim input[type=range]{width:100%}
  .cx-sim select{border:1px solid #cbc6d9;padding:9px 10px;background:#fff;font-size:13.5px}
  .cx-sim .val{font-family:var(--mono);font-weight:500;color:var(--indigo)}
  .cx-out{background:var(--dark);color:#fff;padding:22px;display:flex;flex-direction:column;gap:12px}
  .cx-out .lv{font-size:44px;font-weight:700;letter-spacing:-1px;color:var(--green);line-height:1}
  .cx-out p{margin:0;color:#d7ceeb;font-size:14px;line-height:1.55}
  .cx-out ul{margin:0;padding-left:18px;color:#d7ceeb;font-size:13px;line-height:1.6}
  .raci td.c{text-align:center;font-weight:700}
  .raci .R{color:#fff;background:var(--indigo)}.raci .A{color:#10291b;background:var(--green)}.raci .C{background:#ede8fd;color:var(--indigo)}.raci .I{color:var(--muted)}
  @media(max-width:1100px){.cx-hero,.cx-sim{grid-template-columns:1fr}.cx-flow,.cx-waves,.cx-ladder{grid-template-columns:repeat(2,1fr)}.cx-flow > div::after{display:none}}
  @media(max-width:760px){.cx-parts,.cx-flow,.cx-waves,.cx-ladder{grid-template-columns:1fr}.cx-hero .welcome{padding:24px}.cx-hero .welcome h1{font-size:26px}.cx-wave,.cx-flow > div{border-right:0;border-bottom:1px solid var(--line)}}
  `);

  const arcs = '<svg class="arcs" viewBox="0 0 300 300" aria-hidden="true"><g fill="none" stroke-width="1.5"><circle cx="300" cy="300" r="120" stroke="#04f06a"/><circle cx="300" cy="300" r="170" stroke="#fff" stroke-opacity=".5"/><circle cx="300" cy="300" r="220" stroke="#fff" stroke-opacity=".3"/><circle cx="300" cy="300" r="270" stroke="#04f06a" stroke-opacity=".5"/></g></svg>';

  /* ---------------- Overview ---------------- */
  CP.screen({
    id: 'home', part: 1, label: 'Overview', icon: 'home', live: false,
    render() {
      const k = CP.store.state.kpis;
      return '<div class="cx-hero"><div class="welcome">' + arcs + '<div class="eyebrow">The concept</div><h1>One cyber platform, one context, many agents.</h1>' +
        '<p>Today every cyber domain has its own tools, data and people working in sequence. Tomorrow one platform hosts specialized AI agents per domain, gives them the same context, lets an orchestrator assign the work and enforce decision rights, and keeps humans in charge of what matters.</p>' +
        '<div class="row wrap"><a class="btn-demo" href="' + CP.href('arch-simple') + '" style="height:42px">' + CP.icon('play') + 'See how it works</a><a class="btn-demo btn-alt" href="' + CP.href('demo') + '" style="height:42px">' + CP.icon('compass') + 'Guided demo</a></div></div>' +
        '<div class="cx-ideas">' +
        idea(1, 'One shared context', 'A cyber security graph (assets, identities, suppliers, exposures, controls) and a cyber data lake as long-term memory, used by every agent.') +
        idea(2, 'Specialized agents, orchestrated', 'One or many agents per domain (GRC, SOC, CTI, AppSec, Data, IAM). The orchestrator plans, assigns and checks the decision rights of every action.') +
        idea(3, 'Humans decide above threshold', 'Below its threshold an agent acts and reports. Above it, the orchestrator stops and asks the person who holds the decision, with a ready option.') +
        idea(4, 'Safety and challenge by design', 'Sandbox before production, rollback for every action, kill-switch per agent, and an independent Trust & Challenge team that tests the agents.') + '</div></div>' +

        '<div class="cx-parts">' +
        '<a class="cx-part" href="' + CP.href('arch-simple') + '" data-tour="part1"><span class="eyebrow green">Part 1 · How it works</span><h2>The concept, animated</h2><p>A simple view (the target picture) and a detailed architecture. Four scenarios play step by step: blocks light up, flows travel, every decision is shown with its autonomy level.</p><div class="chips">' + ['Simple view', 'Detailed view', 'Build it', 'Decision rights'].map((x) => ui.tag(esc(x), 'outline')).join('') + '</div><span class="go-l">Open the simple view ' + CP.icon('arrowRight') + '</span></a>' +
        '<a class="cx-part" href="' + CP.href(CP.landing()) + '" data-tour="part2"><span class="eyebrow">Part 2 · The platform</span><h2>The product, as its users see it</h2><p>One product organised around the work: an inbox of what needs you, cases that carry the whole story, the security graph one search away, then the modules to design, build, operate, assure and steer the platform. Nine roles, from the CISO to the SOC analyst, the business risk owner on a phone, an external supplier and the internal auditor.</p><div class="chips">' + ['Inbox', 'Cases', 'Graph', 'Engage', 'Design', 'Build', 'Operate', 'Assurance', 'Steer'].map((x) => ui.tag(esc(x), 'outline')).join('') + '</div><span class="go-l">Open the platform ' + CP.icon('arrowRight') + '</span></a></div>' +

        '<div class="card-title"><div><div class="eyebrow">Four scenarios</div><h2 style="margin:0">From one trigger to the board</h2></div><span class="small-txt muted">Click to play it on the simple view</span></div>' +
        '<div class="scn-cards" data-tour="home-scenarios">' + CP.scenarios.map((s) => '<button class="scn-card" data-scenario-start="' + s.id + '" data-goto="arch-simple"><span class="sn">' + s.n + ' · ' + esc(s.short) + '</span><h3>' + esc(s.title) + '</h3><p>' + esc(s.pitch) + '</p><span class="row wrap" style="gap:6px">' + s.domains.map((d) => ui.dom(d)).join('') + '</span><span class="row between small-txt" style="padding-top:8px;border-top:1px solid var(--line)"><span class="muted">' + esc(s.value.manual) + '</span><b style="color:var(--indigo)">→ ' + esc(s.value.platform) + '</b></span></button>').join('') + '</div>' +

        '<div style="margin-top:24px" class="card-title"><div><div class="eyebrow">How a trigger travels</div><h2 style="margin:0">Five moves, every time</h2></div></div>' +
        '<div class="cx-flow">' +
        flow('1', 'Sense', 'Systems and the outside world emit events: alerts, advisories, answers, requests.') +
        flow('2', 'Understand', 'Agents query the shared graph and data lake: what is exposed, who owns it, what matters.') +
        flow('3', 'Plan & check', 'The orchestrator splits the work and checks decision rights for each action.') +
        flow('4', 'Act or escalate', 'Below threshold, agents act through deterministic executors. Above, a human decides.') +
        flow('5', 'Prove & learn', 'Every step is recorded; Trust & Challenge tests the result; memory is kept.') + '</div>' +

        '<div style="margin-top:24px" class="card-title"><div><div class="eyebrow">In the demo company</div><h2 style="margin:0">Novalys Group, a fictitious European bank and insurer</h2></div></div>' +
        '<div class="metrics">' +
        ui.metric({ label: 'Agents in production', value: '16', foot: '6 domains, 1 orchestrator', icon: 'bot' }) +
        ui.metric({ label: 'Actions today', value: CP.fmt(k.actionsToday), foot: k.autonomousShare + '% without a human, all sampled', icon: 'zap' }) +
        ui.metric({ label: 'Human decisions today', value: CP.fmt(k.humanDecisions), foot: 'only above threshold', icon: 'users' }) +
        ui.metric({ label: 'Hours saved this month', value: CP.fmt(k.hoursSaved), foot: 'vs the same work done manually', icon: 'clock' }) + '</div>';
    }
  });
  function idea(n, t, d) { return '<div class="cx-idea"><span class="n">' + n + '</span><div><b>' + esc(t) + '</b><span>' + esc(d) + '</span></div></div>'; }
  function flow(k, t, d) { return '<div><span class="k">' + k + '</span><b>' + esc(t) + '</b><span>' + esc(d) + '</span></div>'; }

  /* ---------------- Build it ---------------- */
  const WAVES = [
    { n: 'Wave 0', t: 'Foundations', when: 'Months 0 to 6', p: 25, items: ['Cyber security graph and data lake fed by the first 12 connectors (read-only)', 'Model gateway with EU hosting, guardrails and cost metering', 'Agent identities, secrets and audit trail', 'Platform team: platform manager, 2 data engineers, 1 architect'], exit: 'Exit: 80% of critical assets and identities in the graph, refreshed daily.' },
    { n: 'Wave 1', t: 'Assist', when: 'Months 6 to 12', p: 50, items: ['First agents at L0/L1 in 2 domains: SOC triage, GRC evidence', 'Evaluation harness and gold sets; QA sampling by Run', 'Run team started: 2 agent supervisors, quality manager', 'First value case to the ExCom'], exit: 'Exit: analysts agree with 95% of agent proposals on the gold set.' },
    { n: 'Wave 2', t: 'Act within guardrails', when: 'Months 12 to 24', p: 75, items: ['Orchestrator with decision-rights policy as code', 'Deterministic executors with rollback points; sandbox replay', 'L2 on reversible actions; 6 domains covered', 'Trust & Challenge in place: evals, deviation hunt, red team'], exit: 'Exit: 60% of actions autonomous, 0 unreversed incident caused by an agent.' },
    { n: 'Wave 3', t: 'Autonomous where proven', when: 'Months 24 to 36', p: 100, items: ['L3 on actions with a proven track record', 'Cross-domain scenarios (CTI → GRC, AppSec, SOC)', 'Standing approvals agreed with Engage and the business', 'Continuous LoD2 assurance and board metrics'], exit: 'Exit: 85% of actions autonomous, decisions only above threshold.' }
  ];
  const STACK = [
    ['Integration', 'MCP servers and vendor APIs per tool; event bus; deterministic executors (existing SOAR playbooks reused as executors)', 'Buy connectors, build executors'],
    ['Orchestrator', 'Agent framework and durable workflow engine; decision-rights policy as code; human-in-the-loop queue', 'Build on a framework'],
    ['Models', 'Model gateway routing to frontier and small models, EU or on-premises hosting, guardrails, prompt and cost observability', 'Buy gateway, choose models per task'],
    ['Shared context', 'Graph database for the cyber security graph; data lake (security data platform); vector index for case memory', 'Build the model, buy the engines'],
    ['Safety', 'Sandbox / digital twin of critical systems, kill-switch, rollback journal, signed audit ledger', 'Build'],
    ['Assurance', 'Evaluation harness, gold sets, drift monitors, red-team tooling for agentic threats', 'Build with Trust & Challenge']
  ];
  const RACI = [
    ['Connectors & integration', 'I', 'R', 'C', 'C', 'A'],
    ['Agents (per domain)', 'C', 'R', 'C', 'C', 'A'],
    ['Decision rights & thresholds', 'C', 'R', 'C', 'C', 'A'],
    ['Daily operations, rollback, kill-switch', 'I', 'C', 'R', 'I', 'A'],
    ['Quality sampling & cost', 'I', 'C', 'R', 'C', 'A'],
    ['Evals, deviation hunt, red team', 'I', 'C', 'C', 'R', 'A'],
    ['Communication with business, suppliers, regulators', 'R', 'I', 'C', 'I', 'A']
  ];
  CP.screen({
    id: 'build-it', part: 1, label: 'Build it', icon: 'rocket', live: false,
    render() {
      return ui.head('How it works · Build it', 'How to build the platform, in four waves', 'Start with the context, not the agents. Each wave earns the right to more autonomy, with exit criteria measured by Run and challenged by Trust & Challenge.') +
        '<div class="cx-waves" data-tour="waves">' + WAVES.map((w) => '<div class="cx-wave"><div class="wh"><span class="wn">' + w.n + '</span><span class="small-txt muted">' + w.when + '</span></div><h3>' + esc(w.t) + '</h3><div class="bar" style="--p:' + w.p + '%"></div><ul>' + w.items.map((i) => '<li>' + esc(i) + '</li>').join('') + '</ul><div class="exit">' + esc(w.exit) + '</div></div>').join('') + '</div>' +
        '<div class="grid g-3-2" style="margin-top:20px">' +
        ui.card('Reference stack, layer by layer', ui.table([{ label: 'Layer', key: 0, render: (r) => '<b>' + esc(r[0]) + '</b>' }, { label: 'What it takes', render: (r) => esc(r[1]) }, { label: 'Build or buy', render: (r) => ui.tag(esc(r[2]), 'outline') }], STACK), { cls: 'accent', sub: 'Technology categories, not products: choose per context.' }) +
        ui.card('Prerequisites you cannot skip', '<div class="list">' + [
          ['Data quality of the graph', 'Agents are as good as the context. Owners and criticality must be right for crown jewels first.'],
          ['An identity for every agent', 'Each agent has its own identity, scopes and secrets: no shared service account.'],
          ['Decision rights signed by the CISO', 'Who decides what, at which threshold. Written as policy, reviewed quarterly.'],
          ['Regulatory frame', 'AI Act documentation, DORA ICT risk and outsourcing rules, works council information.'],
          ['People before tools', 'Product owners and supervisors per domain are named before the first agent ships.']
        ].map((x) => '<div class="list-item"><span class="tag green">' + CP.icon('check') + '</span><div class="li-main"><div class="li-title">' + esc(x[0]) + '</div><div class="li-sub">' + esc(x[1]) + '</div></div></div>').join('') + '</div>', { cls: 'accent-green' }) + '</div>' +
        '<div class="grid g2" style="margin-top:20px">' +
        ui.card('Who owns what, once it runs', '<div class="table-wrap"><table class="t raci"><thead><tr><th>Activity</th><th>Engage</th><th>Build</th><th>Run</th><th>T&amp;C</th><th>CISO</th></tr></thead><tbody>' + RACI.map((r) => '<tr><td>' + esc(r[0]) + '</td>' + r.slice(1).map((c) => '<td class="c ' + c + '">' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table></div><p class="small-txt muted" style="margin:10px 0 0">R responsible · A accountable · C consulted · I informed. See each team at work in <a href="' + CP.href('ciso', 'org') + '">the organisation view</a>.</p>', { cls: 'accent' }) +
        ui.card('What to measure from day one', ui.hbars([
          { label: 'Graph coverage', value: 82, display: '82%', color: 'var(--indigo)' },
          { label: 'Autonomous share', value: 87, display: '87%', color: 'var(--indigo)' },
          { label: 'QA agreement', value: 96.4, display: '96.4%', color: 'var(--green-ink)' },
          { label: 'Time to contain', value: 40, display: '18 min', color: 'var(--teal)' },
          { label: 'Cost per case', value: 30, display: '€14', color: 'var(--teal)' }
        ], { max: 100 }) + '<p class="small-txt muted" style="margin:12px 0 0">Novalys values today. Run measures them daily, Trust & Challenge re-computes them independently each quarter.</p>', { cls: 'accent' }) + '</div>';
    }
  });

  /* ---------------- Decision rights ---------------- */
  const sim = { action: 'block', users: 1, rev: 1, conf: 95, ext: 'no', money: 'no', novel: 'no' };
  const ACTIONS = {
    read: ['Read, enrich, query the graph', 3], block: ['Block an IP / domain', 3], session: ['Revoke sessions of a user', 3],
    rule: ['Deploy a detection or WAF rule', 2], restrict: ['Restrict a supplier connection', 2], disable: ['Disable an account', 2],
    isolate: ['Isolate a server', 1], patch: ['Emergency patch', 1], message: ['Message to suppliers or regulators', 1], payments: ['Hold payments', 1]
  };
  function evaluate() {
    let lvl = ACTIONS[sim.action][1]; const why = [];
    if (sim.users > 50) { lvl = Math.min(lvl, 1); why.push('blast radius above 50 users'); } else if (sim.users > 5) { lvl = Math.min(lvl, 2); why.push('more than 5 users affected: act and notify'); }
    if (sim.rev > 5) { lvl = Math.min(lvl, 1); why.push('rollback takes more than 5 minutes'); }
    if (sim.conf < 85) { lvl = Math.min(lvl, 1); why.push('confidence under 85%'); } else if (sim.conf < 92) { lvl = Math.min(lvl, 2); why.push('confidence under 92%: act and notify'); }
    if (sim.ext === 'yes') { lvl = Math.min(lvl, 1); why.push('message leaves the group'); }
    if (sim.money === 'yes') { lvl = Math.min(lvl, 1); why.push('touches payments or more than €100k'); }
    if (sim.novel === 'yes') { lvl = Math.min(lvl, 1); why.push('never done before in production'); }
    const deciders = { message: 'p-marc', payments: 'p-hugo', isolate: 'p-elena', patch: 'p-elena', disable: 'p-chloe' };
    return { lvl: 'L' + lvl, why, decider: lvl <= 1 ? (deciders[sim.action] || 'p-chloe') : null };
  }
  CP.screen({
    id: 'rights', part: 1, label: 'Decision rights', icon: 'scale', live: false,
    render() {
      const r = evaluate(); const L = CP.data.autonomy.find((a) => a.id === r.lvl);
      return ui.head('How it works · Decision rights', 'Humans decide above threshold', 'Every action type has an autonomy level and a decision holder. The orchestrator checks them before each action, and thresholds can only lower an agent\'s autonomy, never raise it.') +
        '<div class="cx-ladder" data-tour="ladder">' + CP.data.autonomy.map((a, i) => '<div class="cx-step" style="--h:' + ((i + 1) * 25) + '">' + ui.lvl(a.id) + '<h3>' + esc(a.short) + '</h3><p>' + esc(a.desc) + '</p><div class="ex">' + esc(['Draft a regulatory answer', 'Send questions to suppliers', 'Deploy a tested WAF rule', 'Revoke a risky session'][i]) + '</div></div>').join('') + '</div>' +
        '<div class="card accent" style="margin-top:20px" data-tour="simulator"><div class="card-title"><div><h2>Threshold simulator</h2><div class="sub">Change the context of an action and see what the policy engine decides.</div></div></div><div class="cx-sim"><div>' +
        '<label>Action<select data-change="sim" data-k="action">' + Object.keys(ACTIONS).map((k) => '<option value="' + k + '"' + (sim.action === k ? ' selected' : '') + '>' + esc(ACTIONS[k][0]) + '</option>').join('') + '</select></label>' +
        '<div class="grid g2" style="gap:0 16px">' +
        range('Users affected', 'users', sim.users, 1, 500, '') + range('Time to roll back', 'rev', sim.rev, 0, 120, ' min') + range('Agent confidence', 'conf', sim.conf, 50, 100, '%') +
        '<label>Leaves the group?<select data-change="sim" data-k="ext"><option value="no"' + (sim.ext === 'no' ? ' selected' : '') + '>No</option><option value="yes"' + (sim.ext === 'yes' ? ' selected' : '') + '>Yes (supplier, client, regulator, press)</option></select></label>' +
        '<label>Money involved?<select data-change="sim" data-k="money"><option value="no"' + (sim.money === 'no' ? ' selected' : '') + '>No</option><option value="yes"' + (sim.money === 'yes' ? ' selected' : '') + '>Payments or more than €100k</option></select></label>' +
        '<label>First time in production?<select data-change="sim" data-k="novel"><option value="no"' + (sim.novel === 'no' ? ' selected' : '') + '>No</option><option value="yes"' + (sim.novel === 'yes' ? ' selected' : '') + '>Yes</option></select></label></div></div>' +
        '<div class="cx-out" aria-live="polite"><span class="small-txt" style="letter-spacing:1.2px;text-transform:uppercase;color:#bdb0dc;font-weight:700">Policy decision</span><div class="lv">' + esc(r.lvl) + '</div><b style="font-size:18px">' + esc(L.short) + '</b><p>' + esc(L.desc) + '</p>' +
        (r.decider ? '<p><b style="color:#fff">Decision holder:</b> ' + esc(CP.person(r.decider).name) + ' (' + esc(CP.person(r.decider).title) + ')</p>' : '<p><b style="color:#fff">No human in the loop</b>: the supervisor sees it in the journal and QA samples it.</p>') +
        (r.why.length ? '<ul>' + r.why.map((w) => '<li>' + esc(w) + '</li>').join('') + '</ul>' : '<p>No threshold crossed: the default level for this action applies.</p>') + '</div></div></div>' +
        '<div class="grid g-3-2" style="margin-top:20px">' +
        ui.card('Decision rights at Novalys', ui.table([
          { label: 'Action', render: (x) => esc(x.action) },
          { label: 'Level', render: (x) => ui.lvl(x.level) },
          { label: 'Decision holder', render: (x) => x.decider ? esc(CP.person(x.decider).name) : '<span class="muted">Agent (sampled)</span>' },
          { label: 'Why', render: (x) => '<span class="small-txt muted">' + esc(x.why) + '</span>' }
        ], CP.data.rights), { cls: 'accent', sub: 'Policy as code, written by Build, signed by the CISO, reviewed every quarter.' }) +
        '<div class="stack">' + ui.card('Thresholds that force a human', '<div class="kv">' + CP.data.thresholds.map((t) => '<dt>' + esc(t.k) + '</dt><dd>' + esc(t.v) + '</dd>').join('') + '</div>', { cls: 'accent-green' }) +
        ui.card('Standing approvals', '<p class="small-txt" style="margin:0 0 10px;line-height:1.6">A decision holder can approve a class of actions in advance, with limits and an expiry. Example from scenario S3: the supplier questionnaire template approved by Engage last quarter lets the TPRM agent send pre-filled data requests without asking each time.</p>' +
          '<div class="list">' + [['Supplier data requests (pre-approved template)', 'Third-party risk lead', 'until 31 Dec'], ['Block known-bad domains from 3 trusted feeds', 'Head of Run', 'permanent, reviewed monthly'], ['Reset credentials after confirmed phishing click', 'Head of Run', 'permanent']].map((x) => '<div class="list-item"><span class="tag indigo">' + CP.icon('key') + '</span><div class="li-main"><div class="li-title">' + esc(x[0]) + '</div><div class="li-sub">' + esc(x[1]) + ' · ' + esc(x[2]) + '</div></div></div>').join('') + '</div>') + '</div></div>';
    },
    actions: {
      sim(el) { const k = el.dataset.k; sim[k] = el.type === 'range' ? +el.value : el.value; CP.render(); }
    },
    mount(root) {
      CP.qsa('input[type=range][data-k]', root).forEach((inp) => inp.addEventListener('input', () => {
        const out = root.querySelector('[data-out="' + inp.dataset.k + '"]'); if (out) out.textContent = inp.value + (inp.dataset.unit || '');
      }));
    }
  });
  function range(label, k, v, min, max, unit) {
    return '<label>' + esc(label) + ' <span class="val" data-out="' + k + '">' + v + unit + '</span><input type="range" min="' + min + '" max="' + max + '" value="' + v + '" data-change="sim" data-k="' + k + '" data-unit="' + unit + '" aria-label="' + esc(label) + '"></label>';
  }
})();
