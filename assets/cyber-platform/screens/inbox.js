/* Cyber AI Platform demo: Inbox and My home (WORK group).
   Inbox: the "what needs me now" queue of the current role. One prioritised
   list mixing decisions (store approvals), agent proposals to validate (L0/L1),
   cases, tasks with SLAs, mentions and handovers. Keyboard: j/k, a, r, Enter.
   My home: a role-aware landing (briefing, needs you now, scope, shortcuts,
   live scenario, your agents). */
(function () {
  'use strict';
  const CP = window.CP;
  const esc = CP.esc, ui = CP.ui, I = CP.icon;

  CP.css('inbox', `
.ib-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin:0 0 16px;flex-wrap:wrap}
.ib-head h1{margin:0 0 4px}
.ib-head .lede{font-size:14px}
.ib-head .actions{display:flex;gap:8px;flex-wrap:wrap}
.ib-live{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:#fff;border:1px solid var(--line);border-left:4px solid var(--green-ink);padding:9px 12px;margin-bottom:14px;font-size:13px}
.ib-live.wait{border-left-color:#ffb648;background:#fffaf0}
.ib-live .dot{width:8px;height:8px;background:var(--green-ink);display:inline-block;animation:blink 1.2s infinite}
.ib-live.wait .dot{background:#ffb648}
.ib-live a{font-weight:600}
.ib{display:grid;grid-template-columns:200px minmax(0,1fr) minmax(360px,450px);gap:16px;align-items:start}
.ib-rail{position:sticky;top:118px;display:grid;gap:2px;min-width:0}
.ib-rail a{display:flex;align-items:center;gap:9px;padding:9px 10px;text-decoration:none;color:var(--ink);font-size:13.5px;font-weight:550;border:1px solid transparent;white-space:nowrap}
.ib-rail a:hover{background:#fff;border-color:var(--line)}
.ib-rail a.active{background:#fff;border-color:var(--line);box-shadow:inset 3px 0 var(--indigo);color:var(--indigo)}
.ib-rail a .n{margin-left:auto;font-size:11.5px;font-weight:700;background:#eeebf7;color:#51406c;padding:1px 7px;min-width:24px;text-align:center;font-variant-numeric:tabular-nums}
.ib-rail a .n.hot{background:#ffb648;color:#3d2600}
.ib-rail-h{font-size:10.5px;letter-spacing:1.2px;text-transform:uppercase;color:var(--muted);font-weight:700;padding:14px 10px 6px}
.ib-keys{display:grid;gap:5px;padding:4px 10px;font-size:12px;color:var(--muted)}
.ib-keys kbd,.ib-kbd{font-family:var(--mono);font-size:10.5px;border:1px solid var(--line);border-bottom-width:2px;background:#fff;padding:0 5px;color:var(--ink);margin-right:4px}
.ib-list{background:#fff;border:1px solid var(--line);min-width:0}
.ib-tools{display:flex;gap:8px;align-items:center;padding:10px 12px;border-bottom:1px solid var(--line);flex-wrap:wrap;background:#fbfafd}
.ib-search{flex:1;min-width:150px;display:flex;align-items:center;gap:8px;border:1px solid var(--line);padding:0 10px;height:34px;background:#fff;color:var(--muted)}
.ib-search:focus-within{border-color:var(--indigo)}
.ib-search input{border:0;background:transparent;outline:0;width:100%;font-size:13px;padding:0;color:var(--ink)}
.ib-seg{display:flex;border:1px solid var(--line);background:#fff}
.ib-seg button{border:0;min-height:32px;font-size:12px;padding:.25rem .6rem;font-weight:600;color:var(--muted)}
.ib-seg button+button{border-left:1px solid var(--line)}
.ib-seg button.on{background:var(--dark);color:#fff}
.ib-sum{font-size:12px;color:var(--muted);padding:7px 14px;border-bottom:1px solid var(--line-2);display:flex;gap:12px;flex-wrap:wrap}
.ib-sum b{color:var(--ink)}
.ib-item{display:grid;grid-template-columns:4px minmax(0,1fr) auto;gap:0 12px;padding:12px 14px 12px 0;border-bottom:1px solid var(--line-2);cursor:pointer;position:relative;outline-offset:-3px}
.ib-item:last-child{border-bottom:0}
.ib-item>.bar{background:transparent}
.ib-item.p1>.bar{background:var(--red)}.ib-item.p2>.bar{background:#ffb648}.ib-item.p3>.bar{background:#cfc3f7}
.ib-item:hover{background:#faf9fd}
.ib-item.sel{background:var(--indigo-50);box-shadow:inset 0 0 0 1px #cfc3f7}
.ib-item.new{animation:newrow 2.4s}
.ib-item.done .ib-title{color:var(--muted)}
.ib-main{min-width:0}
.ib-top{display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:11.5px;color:var(--muted)}
.ib-p{font-family:var(--mono);font-size:10.5px;font-weight:700;padding:1px 5px;line-height:1.4}
.ib-p.p1{background:var(--red);color:#fff}.ib-p.p2{background:#ffb648;color:#3d2600}.ib-p.p3{background:#eeebf7;color:#51406c}.ib-p.p4{border:1px solid var(--line);color:var(--muted)}
.ib-kind{display:inline-flex;align-items:center;gap:4px;font-weight:650;color:#51406c;text-transform:uppercase;letter-spacing:.6px;font-size:10.5px}
.ib-kind.k-decision{color:#8a5a05}.ib-kind.k-validate{color:var(--indigo)}.ib-kind.k-case{color:var(--red-ink)}.ib-kind.k-mention{color:#18636a}
.ib-top .lvl{font-size:10px;padding:0 4px}
.ib-loop{font-size:10.5px;font-weight:650;background:#e2f1f2;color:#18636a;padding:1px 6px}
.ib-title{font-weight:650;font-size:14px;margin:4px 0 2px;line-height:1.3;overflow-wrap:anywhere}
.ib-why{font-size:12.5px;color:var(--muted);line-height:1.45;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical}
.ib-src{display:flex;align-items:center;gap:6px;font-size:12px;margin-top:6px;color:var(--muted);min-width:0}
.ib-src b{color:var(--ink);font-weight:600}
.ib-src .av{flex:none}
.ib-side{display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between;gap:8px}
.ib-acts{display:flex;gap:4px;flex-wrap:nowrap}
.ib-acts button,.ib-acts a.ib-btn{min-height:26px;padding:.2rem .5rem;font-size:12px}
a.ib-btn{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:#fff;color:var(--ink);text-decoration:none;font-weight:600;padding:.55rem .8rem;min-height:36px;font-size:.84rem;line-height:1.1}
a.ib-btn:hover{border-color:var(--indigo);background:#f6f3ff}
.ib-sla{font-family:var(--mono);font-size:11.5px;font-weight:600;color:var(--muted);white-space:nowrap;display:inline-flex;gap:4px;align-items:center;font-variant-numeric:tabular-nums}
.ib-sla.warn{color:#8a5a05}.ib-sla.over{color:var(--red-ink)}
.ib-sla.over::before{content:'';width:6px;height:6px;background:var(--red);display:inline-block}
.ib-pv{position:sticky;top:118px;max-height:calc(100vh - 134px);overflow:auto;background:#fff;border:1px solid var(--line);border-top:3px solid var(--indigo);min-width:0}
.ib-pv-in{padding:16px 18px 18px;display:grid;gap:14px}
.ib-pv-top{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.ib-pv h2{font-size:18px;line-height:1.3;margin:0;letter-spacing:-.3px;overflow-wrap:anywhere}
.ib-pv .why{font-size:13.5px;line-height:1.55;color:#3b3550;margin:0}
.ib-pv-acts{display:flex;gap:8px;flex-wrap:wrap;border-top:1px solid var(--line-2);padding:12px 0 2px;position:sticky;bottom:-18px;background:#fff;margin-bottom:-2px;z-index:2}
.ib-sec{border:1px solid var(--line);}
.ib-sec>h3{margin:0;padding:8px 12px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);background:#f7f6fa;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:6px}
.ib-sec>.b{padding:10px 12px;font-size:13px;line-height:1.55}
.ib-sec .kv{font-size:12.5px;gap:5px 14px}
.ib-sec ul{margin:0;padding-left:18px}
.ib-sec li{margin:2px 0}
.ib-tool{font-family:var(--mono);font-size:11px;background:#140b2f;color:#c9f9dc;padding:1px 6px;display:inline-block;margin:0 3px 3px 0}
.ib-conf{display:flex;align-items:center;gap:8px}
.ib-conf .progress{width:90px}
.ib-trail{display:grid;gap:0}
.ib-trail div{display:grid;grid-template-columns:70px minmax(0,1fr);gap:8px;padding:5px 0;border-bottom:1px dashed var(--line-2);font-size:12.5px}
.ib-trail div:last-child{border-bottom:0}
.ib-trail .ts{font-family:var(--mono);font-size:11px;color:var(--muted)}
.ib-trail .g{color:#8a5a05;font-weight:650}
.ib-back{display:none}
.ib-empty{padding:34px 26px;text-align:center;color:var(--muted);font-size:13.5px;line-height:1.6}
.ib-empty .i{font-size:28px;color:var(--indigo);margin-bottom:8px}
.ib-empty h3{color:var(--ink);margin:0 0 6px;font-size:16px}
.ib-empty p{margin:0 auto 12px;max-width:520px}
.ib-chips{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}
.ib-chips button{font-size:12.5px;min-height:32px}
.ib-done-h{padding:8px 14px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);background:#f7f6fa;border-bottom:1px solid var(--line-2);font-weight:700}
.ib-oversee{background:#e2f1f2;border-left:3px solid #228d95;padding:9px 12px;font-size:13px;line-height:1.5}
@media(max-width:1280px){.ib{grid-template-columns:176px minmax(0,1fr) minmax(320px,390px)}}
@media(max-width:1100px){
 .ib{grid-template-columns:minmax(0,1fr) minmax(300px,380px)}
 .ib-rail{grid-column:1/-1;position:static;display:flex;overflow-x:auto;gap:4px;scrollbar-width:thin}
 .ib-rail a{border-color:var(--line);background:#fff}
 .ib-rail-h,.ib-keys{display:none}
}
@media(max-width:760px){
 .ib{grid-template-columns:minmax(0,1fr);gap:12px}
 .ib-pv{position:static;max-height:none}
 .ib.has-pv .ib-list{display:none}
 .ib:not(.has-pv) .ib-pv{display:none}
 .ib-back{display:inline-flex}
 .ib-item{grid-template-columns:4px minmax(0,1fr);padding-right:12px}
 .ib-side{grid-column:2;flex-direction:row;align-items:center;justify-content:space-between;margin-top:8px}
 .ib-acts .opt{display:none}
 .ib-why{-webkit-line-clamp:2}
 .ib-tools .ib-seg{order:3}
}
/* My home */
.my-hero{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:22px;background:var(--dark);color:#fff;padding:22px 26px;border-top:3px solid var(--green);margin-bottom:18px}
.my-hero .eyebrow{color:var(--green)}
.my-hero h1{color:#fff;margin:0 0 4px}
.my-hero .sub{color:#c3b8e2;font-size:13.5px}
.my-brief{list-style:none;margin:14px 0 0;padding:0;display:grid;gap:8px;max-width:980px}
.my-brief li{display:flex;gap:10px;font-size:14.5px;line-height:1.5;color:#e5def8}
.my-brief li .i{color:var(--green);margin-top:4px}
.my-brief b{color:#fff;font-weight:650}
.my-hero-r{display:flex;flex-direction:column;gap:10px;align-items:flex-end}
.my-counts{display:flex;gap:6px}
.my-count{background:#ffffff14;padding:9px 12px;min-width:86px;text-decoration:none;color:#fff;display:block}
.my-count:hover{background:#ffffff24}
.my-count b{display:block;font-size:26px;line-height:1.1;font-variant-numeric:tabular-nums}
.my-count span{font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#cfc6ea;font-weight:700}
.my-count.warn{background:#ffb648;color:#3d2600}.my-count.warn span{color:#3d2600}
.my-hero-r .acts{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.my-hero-r .acts a{display:inline-flex;align-items:center;gap:7px;color:#fff;border:1px solid #ffffff40;padding:0 12px;height:34px;text-decoration:none;font-size:13px;font-weight:600}
.my-hero-r .acts a:hover{background:#ffffff14;border-color:#fff}
.my-hero-r .acts a.pri{background:var(--green);border-color:var(--green);color:#10291b}
.my-live{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:14px;align-items:center;background:#fff;border:1px solid var(--line);border-left:5px solid var(--green-ink);padding:12px 16px;margin-bottom:18px}
.my-live.wait{border-left-color:#ffb648;background:#fffaf0}
.my-live .ic{width:38px;height:38px;display:grid;place-items:center;background:var(--dark);color:var(--green);font-size:18px}
.my-live .t{font-weight:650;font-size:14.5px}
.my-live .s{font-size:12.5px;color:var(--muted);margin-top:2px}
.my-live .acts{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
.my-idle{display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:#fff;border:1px dashed #d9d3e4;padding:10px 14px;margin-bottom:18px;font-size:13px;color:var(--muted)}
.my-idle .scn{display:flex;gap:6px;flex-wrap:wrap;margin-left:auto}
.my-idle .scn button{font-size:12px;min-height:30px}
.my-now{display:grid}
.my-ni{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 4px;border-bottom:1px solid var(--line-2);text-decoration:none;color:inherit}
.my-ni:hover{background:#faf9fd}
.my-ni:last-child{border-bottom:0}
.my-ni .tt{font-weight:600;font-size:13.5px;line-height:1.3}
.my-ni .ww{font-size:12px;color:var(--muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.my-ni .rr{display:flex;flex-direction:column;align-items:flex-end;gap:4px}
.my-scope{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.my-scope .metric{padding:14px 14px 12px}
.my-scope .metric .value{font-size:27px}
.my-short{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.my-sc{border:1px solid var(--line);background:#fff;padding:14px 16px;text-decoration:none;color:inherit;display:grid;gap:6px;align-content:start;transition:box-shadow .15s,transform .15s}
.my-sc:hover{border-color:var(--indigo);box-shadow:3px 3px 0 var(--indigo);transform:translate(-1px,-1px)}
.my-sc .h{display:flex;align-items:center;gap:8px;font-weight:650;color:var(--indigo);font-size:14.5px}
.my-sc .h .mine{margin-left:auto;font-size:10px;letter-spacing:.8px;text-transform:uppercase;color:var(--green-ink);font-weight:700}
.my-sc p{margin:0;font-size:12.5px;color:var(--muted);line-height:1.5}
.my-sc .go{font-size:12px;font-weight:600;color:var(--ink);display:flex;align-items:center;gap:6px}
.my-ag{display:grid}
.my-ag a{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;padding:9px 2px;border-bottom:1px solid var(--line-2);text-decoration:none;color:inherit}
.my-ag a:last-child{border-bottom:0}
.my-ag a:hover{background:#faf9fd}
.my-ag .nm{font-weight:600;font-size:13px}
.my-ag .sb{font-size:11.5px;color:var(--muted);display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:2px}
.my-ag .rt{display:flex;gap:6px;align-items:center}
.my-ag .met{font-family:var(--mono);font-size:11.5px;color:var(--muted);text-align:right;min-width:62px}
.my-modes{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:10px}
.my-modes div{border:1px solid var(--line);padding:8px 4px;text-align:center;font-size:11px;color:var(--muted);min-width:0;overflow-wrap:anywhere}
.my-modes b{display:block;font-size:20px;color:var(--ink);font-variant-numeric:tabular-nums}
@media(max-width:1280px){.my-short{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:1100px){.my-hero{grid-template-columns:1fr}.my-hero-r{align-items:flex-start}.my-hero-r .acts{justify-content:flex-start}}
@media(max-width:760px){
 .my-hero{padding:18px 16px}
 .my-brief li{font-size:13.5px}
 .my-counts{flex-wrap:wrap}
 .my-count{min-width:0;flex:1}
 .my-live{grid-template-columns:auto minmax(0,1fr)}
 .my-live .acts{grid-column:1/-1;justify-content:flex-start}
 .my-short{grid-template-columns:1fr}
 .my-scope{grid-template-columns:repeat(2,minmax(0,1fr))}
 .my-scope .metric .value{font-size:22px}
 .my-idle .scn{margin-left:0}
}
`);

  /* ------------------------------------------------------------------ */
  /* Vocabulary                                                          */
  /* ------------------------------------------------------------------ */
  const KIND = {
    decision: { label: 'Decision', icon: 'gavel' },
    validate: { label: 'To validate', icon: 'checkCircle' },
    case: { label: 'Case', icon: 'workflow' },
    task: { label: 'Task', icon: 'clock' },
    mention: { label: 'Mention', icon: 'message' },
    handover: { label: 'Handover', icon: 'rollback' }
  };
  const VIEWS = [
    { id: 'all', label: 'All', icon: 'list', kinds: null },
    { id: 'decisions', label: 'Decisions', icon: 'gavel', kinds: ['decision'] },
    { id: 'validate', label: 'To validate', icon: 'checkCircle', kinds: ['validate'] },
    { id: 'cases', label: 'Cases', icon: 'workflow', kinds: ['case'] },
    { id: 'tasks', label: 'Tasks', icon: 'clock', kinds: ['task', 'mention', 'handover'] },
    { id: 'done', label: 'Done', icon: 'check' }
  ];
  const SRC_EXTRA = {
    'night-shift': { name: 'Night shift', sub: 'L2 on-call handover' }
  };
  /* Tool calls derived from architecture node ids of a trace. */
  const NODE_TOOL = {
    'ctx-graph': 'graph.query', 'ctx-lake': 'lake.search', 'ctx-memory': 'memory.read', 'or-sandbox': 'sandbox.replay',
    'or-hitl': 'hitl.escalate', 'or-policy': 'policy.check', 'or-plan': 'orchestrator.plan', 'or-kill': 'killswitch.set_level',
    'or-audit': 'audit.write', 'ai-eval': 'eval.run', 'int-mcp': 'mcp.connector', 'it-itsm': 'itsm.change', 'it-entra': 'idp.sessions',
    'it-m365': 'collab.audit', 'it-cmdb': 'cmdb.read', 'sys-waf': 'waf.deploy_rule', 'sys-siem': 'siem.deploy_rule',
    'sys-edr': 'edr.collect', 'sys-fw': 'firewall.restrict', 'sys-proxy': 'proxy.block', 'sys-vuln': 'vuln.scan',
    'out-tp': 'portal.send', 'out-reg': 'regulator.submit'
  };
  const toolsOf = (flow) => { const s = []; (flow || []).forEach((p) => p.forEach((n) => { const k = NODE_TOOL[n]; if (k && s.indexOf(k) < 0) s.push(k); })); return s; };

  /* Decision metadata the approval objects do not carry. */
  const DEC_META = {
    'AP-CTI-TPRM': { prio: 1, sla: 30, rev: 'Not reversible once suppliers read it; a correction can follow within the hour.' },
    'AP-CTI-PATCH': { prio: 1, sla: 20, rev: 'Rollback to the pre-patch snapshot in 15 min; the virtual patch W-121 stays in place either way.' },
    'AP-ID-HOLD': { prio: 1, sla: 15, rev: 'Held payments can be released at any time before the 10:00 cut-off.' },
    'AP-RG-SUBMIT': { prio: 2, sla: 1440, rev: 'Not reversible: a submission to the supervisor commits the group.' },
    'AP-DR-KILL': { prio: 1, sla: 10, rev: 'Autonomy can be restored in one click by any Run supervisor.' },
    'AP-DR-CANARY': { prio: 2, sla: 240, rev: 'Automatic rollback to v2.5 if agreement with analysts drops under 97%.' }
  };
  const SEV_PRIO = { critical: 1, high: 2, medium: 3, low: 4 };
  const SEV_SLA = { critical: 60, high: 240, medium: 1440, low: 4320 };

  /* Per-role local state (handled, snoozed, delegated) and first-seen times. */
  let ST = {}; let SEEN = {};
  const key = (role, id) => role + ':' + id;
  CP.bus.on('change', (reason) => { if (reason === 'reset') { ST = {}; SEEN = {}; } });

  const persona = (role) => CP.person((CP.role(role) || {}).persona) || CP.data.people[0];
  const has = (coll, id) => CP.store.find(coll, id);
  const scn = (id) => (CP.scenarioById ? CP.scenarioById(id) : null) || null;
  function gateOf(apId) {
    for (const s of CP.scenarios || []) for (const st of s.steps) if (st.gate && st.gate.approval.id === apId) return { scenario: s, step: st };
    return null;
  }
  function feedLog(role, text, domain) { CP.feed({ actor: persona(role).id, domain: domain || 'human', level: 'decision', text }); }

  /* ------------------------------------------------------------------ */
  /* Static, per-role baseline (agent proposals, tasks, mentions...)     */
  /* ------------------------------------------------------------------ */
  function baseline(role) {
    const k = CP.store.state.kpis;
    const L = [];
    const add = (o) => L.push(o);
    if (role === 'analyst') {
      add({ id: 'an-close14', kind: 'validate', prio: 2, sla: 45, src: 'ag-soc-triage', lvl: 'L1', title: 'Close 14 alerts as benign: internal vulnerability scan',
        why: 'Same source 10.40.12.7 (approved scanner), inside the scan window 07:00 to 09:00, matched to change CHG-88390.',
        list: ['14 alerts · rule "Port sweep from internal host" (SIEM)', 'Source: vuln-scan-02 (CMDB: security tooling, owner Run)', 'Window: CHG-88390, approved Mon 16:00, 07:00 to 09:00', 'No outbound traffic, no authentication attempts'],
        explain: { plan: 'Group the alerts, match them with the change calendar, propose a bulk closure.', inputs: ['14 SIEM alerts', 'CMDB entry vuln-scan-02', 'ITSM change CHG-88390'], tools: ['siem.alerts', 'graph.query', 'itsm.change.read'], policy: 'L1: bulk closure of more than 10 alerts needs an analyst.', conf: 0.97, cost: '€0.06', rollback: 'Alerts reopen in one click from the case history.' },
        validateLabel: 'Close all 14', rejectLabel: 'Keep open', validate: () => CP.store.apply({ op: 'inc', path: 'kpis.alertsTriaged', by: 14 }), okMsg: '14 alerts closed as benign. The triage agent learns the scanner pattern for this change window.' });
      add({ id: 'an-beacon', kind: 'validate', prio: 1, sla: 20, src: 'ag-soc-triage', lvl: 'L1', title: 'Escalate wks-fin-0231 to an incident: beaconing every 60 s',
        why: 'A signed binary calls a 9-day-old domain at fixed intervals. Confidence 72%, under the 85% autonomy threshold.',
        list: ['Host: wks-fin-0231 · Finance, Paris · user on leave since Fri', 'Process: updsvc.exe (signed, publisher seen on 3 hosts)', 'Destination: cdn-telemetry-hub.net (registered 9 days ago)', '1,412 connections in 24 h, jitter under 2 s'],
        explain: { plan: 'Score beaconing regularity, check domain age and reputation, look for peers.', inputs: ['EDR network events 24 h', 'Passive DNS', 'Peer group: 210 finance workstations'], tools: ['edr.query', 'lake.search', 'graph.query'], policy: 'L1: opening an incident on a finance asset with confidence under 85% needs an analyst.', conf: 0.72, cost: '€0.31', rollback: 'Case can be closed as benign; no containment applied yet.' },
        validateLabel: 'Escalate', rejectLabel: 'Close as benign',
        validate: () => { CP.store.apply([{ op: 'add', coll: 'cases', item: { id: 'C-2305', title: 'Beaconing from finance workstation wks-fin-0231', severity: 'medium', status: 'open', domains: ['soc'], opened: CP.clock.label(), owner: 'ag-soc-triage', assignee: 'p-analyst', summary: 'Regular beaconing to a 9-day-old domain; forensic triage requested.' } }, { op: 'inc', path: 'kpis.casesOpen', by: 1 }]); },
        okMsg: 'Case C-2305 opened and assigned to you. The Forensic Agent starts a triage package.' });
      add({ id: 'an-hunt', kind: 'validate', prio: 3, sla: 240, src: 'ag-soc-hunt', lvl: 'L0', title: 'Hunt hypothesis: OAuth consent phishing on 3 mailboxes',
        why: 'Three consent grants in 48 h to an unverified app named "Docs Viewer". The agent proposes a 90-day hunt in the data lake.',
        list: ['Hypothesis: illicit consent grant (MITRE ATT&CK T1528)', 'Scope: all tenants, 90 days, consent and token events', 'Expected cost: €4.80, about 12 min'],
        explain: { plan: 'Search consent events for the app id, then token use from new IP ranges.', inputs: ['Identity provider audit logs', 'App registry'], tools: ['lake.search', 'graph.query'], policy: 'L0: hunts that cost more than €2 are suggested, a human launches them.', conf: 0.64, cost: '€0.04 to propose · €4.80 to run', rollback: 'Read-only.' },
        validateLabel: 'Run the hunt', rejectLabel: 'Discard', okMsg: 'Hunt launched. Results will land in this inbox in about 12 minutes.' });
      add({ id: 'an-handover', kind: 'handover', prio: 2, sla: 60, src: 'night-shift', title: 'Night shift handover: 2 cases open, 1 indicator on watch',
        why: 'Nothing escalated overnight. Two cases need a follow-up this morning.',
        list: ['C-2291 phishing on the HR portal: 3 users clicked, credentials reset by the agent; watch new MFA registrations today', 'C-2288 expired broker API certificate: renewal change tonight 22:00, check the partner test at 22:15', 'Watch: 45.155.204.9 hit the mail gateway twice (blocked)'],
        open: '#/cases/C-2291', doneLabel: 'Acknowledge', okMsg: 'Handover acknowledged. The night shift is notified.' });
      add({ id: 'an-forensic', kind: 'mention', prio: 3, sla: 180, src: 'ag-soc-forensic', title: '@SOC analyst: memory image of srv-hr-04 ready for review',
        why: 'Collected in C-2291. Two strings look like a credential harvester config: a human read is needed before closure.',
        caseId: 'C-2291', open: '#/cases/C-2291', reply: 'Thanks, reviewing the two strings now. Keep srv-hr-04 under enhanced EDR until I confirm.' });
      add({ id: 'an-labels', kind: 'task', prio: 3, sla: 1440, src: 'p-chloe', title: 'Label 25 triage disagreements for the QA gold set',
        why: 'Weekly quality loop: your labels feed the evaluation set, not the agent directly. Due Friday.', open: '#/run', okMsg: '25 labels submitted to the QA gold set.' });
    }
    if (role === 'run') {
      add({ id: 'rn-d397', kind: 'validate', prio: 2, sla: 240, src: 'ag-soc-detect', lvl: 'L1', title: 'Tune D-397: threshold from 500 to 800 files per hour',
        why: 'False positives at 2.8%, above the 2% noise budget. Backtest of the new threshold: 3 true positives kept, 0 false positive.',
        code: { lang: 'yaml', body: 'rule: D-397 mass-download-file-share\n-threshold: 500 files / 1 h / user\n+threshold: 800 files / 1 h / user\n+exclude: svc-backup-*, svc-archive-*\nbacktest:\n  window: 30d\n  true_positives: 3   # unchanged\n  false_positives: 0  # was 4' },
        explain: { plan: 'Find the noise source, propose a threshold and exclusions, backtest on 30 days.', inputs: ['30 days of file-share audit', '4 false positives (backup accounts)'], tools: ['siem.rules', 'lake.backtest'], policy: 'L1: changing a live detection threshold needs the Run supervisor.', conf: 0.93, cost: '€0.52', rollback: 'Previous rule version kept, one-click revert.' },
        validateLabel: 'Apply tuning', rejectLabel: 'Keep as is', validate: () => CP.store.apply({ op: 'update', coll: 'detections', id: 'D-397', patch: { fpRate: 0.6, backtest: '30 d · 3 TP · 0 FP' } }), okMsg: 'D-397 tuned and redeployed. Noise budget back under 2%.' });
      add({ id: 'rn-qa', kind: 'task', prio: 2, sla: 480, src: 'p-pierre', title: 'QA sample: 7 disagreements out of ' + CP.fmt(k.qaSampled) + ' sampled actions',
        why: 'Agreement ' + CP.fmt(k.qaAgreement, 1) + '% (target 97%). 5 of 7 are Java findings of the Code Review Agent.', open: '#/run', okMsg: 'Disagreements reviewed; 5 sent to Build as evidence for B-305.' });
      add({ id: 'rn-cost', kind: 'validate', prio: 2, sla: 360, src: 'orchestrator', lvl: 'L1', title: 'Cap the Code Review Agent at €260 per day',
        why: 'Spend €236 today, trend +18% since v3.0.1. The cap keeps 98% of reviews in real time; the rest queue for the night batch.',
        explain: { plan: 'Detect the cost trend, simulate a cap on 14 days of load.', inputs: ['Cost per task, 30 days', 'Review queue by hour'], tools: ['finops.read', 'orchestrator.plan'], policy: 'L1: budget guardrails are set by the performance manager or the Run supervisor.', conf: 0.9, cost: '€0.03', rollback: 'Remove the cap at any time.' },
        validateLabel: 'Set the cap', rejectLabel: 'No cap', okMsg: 'Budget guardrail set: €260 per day on the Code Review Agent.' });
      add({ id: 'rn-handover', kind: 'handover', prio: 3, sla: 120, src: 'p-mei', title: 'Handover: Access Review Agent campaign paused at 64%',
        why: 'Trade Finance managers asked for two more days. The campaign resumes Thursday 09:00 automatically.',
        list: ['Campaign: Q4 entitlement review, 1,310 items, 64% done', 'Paused by the agent supervisor (GRC & IAM) on request', 'Linked case: C-2284 toxic combinations'], caseId: 'C-2284', open: '#/cases/C-2284', doneLabel: 'Acknowledge', okMsg: 'Handover acknowledged.' });
      add({ id: 'rn-canary', kind: 'mention', prio: 3, sla: 300, src: 'p-ines', title: '@Run: REL-76 canary at 48 h, agreement 97.9%. OK to widen to 50%?',
        why: 'Access Review Agent 1.6.0 (toxic combination detection). No rollback triggered, cost per task -6%.', open: '#/build', reply: 'Fine from Run: widen to 50%, keep the 97% rollback trigger and send me the 24 h report.' });
    }
    if (role === 'engage') {
      add({ id: 'eg-lexis', kind: 'validate', prio: 2, sla: 240, src: 'ag-grc-tprm', lvl: 'L1', title: 'Send LexAdvisors a remediation request, rating to "watch"',
        why: 'Leaked credentials still valid on 2 accounts (C-2279). The agent drafted a 10-day remediation request.', caseId: 'C-2279',
        email: { from: 'Novalys Third-Party Security', to: 'LexAdvisors · security contact', subject: 'Leaked credentials: remediation within 10 days', body: 'Dear security team,\n\nTwo accounts of your staff with access to our litigation exchange still accept the passwords published on 9 October.\n\nPlease reset them, confirm MFA on all accounts with access to Novalys data, and send evidence within 10 days.\n\nThird-Party Security, Novalys Group' },
        explain: { plan: 'Check which leaked credentials are still valid, draft a request, propose a rating change.', inputs: ['Paste-site monitoring', 'Supplier portal accounts', 'Contract clause 14.2'], tools: ['tprm.inventory', 'graph.query', 'portal.send'], policy: 'L1: any message to a supplier needs the third-party risk lead.', conf: 0.95, cost: '€0.18', rollback: 'Rating can be restored; the message cannot be recalled.' },
        validateLabel: 'Validate and send', rejectLabel: 'Edit first',
        validate: () => CP.store.apply([{ op: 'add', coll: 'comms', item: { id: 'M-406', ts: CP.clock.label(), party: 'tp-lexis', channel: 'Supplier portal', subject: 'Leaked credentials: remediation within 10 days', status: 'sent', author: 'ag-grc-tprm', validator: 'p-marc' } }, { op: 'update', coll: 'cases', id: 'C-2279', patch: { summary: 'Remediation requested (10 days); supplier rating set to watch.' } }]),
        okMsg: 'Sent to LexAdvisors through the supplier portal. Rating set to watch.' });
      add({ id: 'eg-policy', kind: 'validate', prio: 3, sla: 2880, src: 'ag-grc-policy', lvl: 'L1', title: 'Remote access policy v4.2: 3 changes for NIS2 Art. 21',
        why: 'Phishing-resistant MFA for all admins, 12 h session limit, supplier access through the bastion only. Two business owners consulted.',
        code: { lang: 'yaml', body: 'policy: remote-access\n-version: 4.1\n+version: 4.2\n admins:\n-  mfa: any\n+  mfa: phishing_resistant\n sessions:\n-  max_duration: 24h\n+  max_duration: 12h\n suppliers:\n+  access_path: bastion_only' },
        explain: { plan: 'Map NIS2 Art. 21 measures to the policy, propose the minimal diff.', inputs: ['NIS2 self-assessment gaps', 'Policy repository v4.1'], tools: ['policy.repo', 'controls.map'], policy: 'L1: policies are published by Engage.', conf: 0.96, cost: '€0.22', rollback: 'v4.1 kept, republish in one click.' },
        validateLabel: 'Approve for publication', rejectLabel: 'Send back', okMsg: 'Policy v4.2 approved; publication and staff notice scheduled.' });
      add({ id: 'eg-retail', kind: 'validate', prio: 3, sla: 1440, src: 'ag-grc-controls', lvl: 'L1', title: 'Retail Banking monthly cyber review pack is ready',
        why: 'Risk score 58 (-1), 4 open requests, account takeover still the top risk. 12 slides for the Business CISO.',
        list: ['Risk score 58, trend down for 5 months', 'Top risks: account takeover, mobile app fraud', '4 open requests, 1 overdue (mobile app pentest scope)', 'Proposed ask: fund passkeys for 1.2 M retail clients'],
        validateLabel: 'Validate pack', rejectLabel: 'Request changes', okMsg: 'Review pack validated and shared with Retail Banking.' });
      add({ id: 'eg-register', kind: 'task', prio: 2, sla: 7200, src: 'ag-dt-evidence', title: 'DORA register: 58 arrangements still miss data',
        why: '1,182 of 1,240 collected; 31 lack their sub-contracting chain. Due 30 Nov.', open: '#/engage/regulators', okMsg: 'Owners chased for the 58 missing arrangements.' });
      add({ id: 'eg-treasury', kind: 'mention', prio: 3, sla: 1440, src: 'p-hugo', title: '@Engage: can we present the SWIFT chain risk at Thursday\'s ExCo?',
        why: 'The Head of Treasury wants 10 minutes on SwiftNet Bureau concentration risk and the exit plan.', reply: 'Yes: 10 minutes Thursday, the platform will prepare the SWIFT chain view and the exit-plan status.' });
      add({ id: 'eg-culture', kind: 'validate', prio: 3, sla: 2880, src: 'ag-grc-policy', lvl: 'L1', title: 'Q3 phishing simulation results ready to publish',
        why: 'Click rate 4.1% (Q2: 6.3%). Finance still highest at 7.2%. Results anonymised per team.',
        validateLabel: 'Publish', rejectLabel: 'Hold',
        validate: () => CP.store.apply({ op: 'add', coll: 'comms', item: { id: 'M-417', ts: CP.clock.label(), party: 'bu-all', partyLabel: 'All staff', channel: 'Intranet', subject: 'Q3 phishing simulation: click rate down to 4.1%', status: 'sent', author: 'ag-grc-policy', validator: 'p-leo' } }),
        okMsg: 'Published on the intranet.' });
    }
    if (role === 'build') {
      add({ id: 'bd-rel77', kind: 'task', prio: 1, sla: 480, src: 'evals', title: 'REL-77 Code Review Agent 3.1.0 is below the release gate',
        why: 'Evals 94.2% against a 95% gate. Regression on Java deserialisation findings (B-305).', open: '#/build', okMsg: 'REL-77 sent back to development with the failing eval cases.' });
      add({ id: 'bd-tool', kind: 'validate', prio: 2, sla: 720, src: 'p-yuki', title: 'Peer review: add tool proxy.block to the Threat Hunter Agent',
        why: 'Requested by Run after 6 manual blocks this week. Policy simulation on 30 days: 41 actions, 0 above threshold.',
        code: { lang: 'yaml', body: 'agent: threat-hunter\n version: 1.4.2\n tools:\n   - lake.search\n   - edr.query\n   - proxy.logs\n+  - proxy.block:\n+      level: L2\n+      max_per_hour: 20\n+      requires: confidence >= 0.9' },
        explain: { plan: 'Least-privilege tool grant, with a rate limit and a confidence floor.', inputs: ['Run request B-311 thread', '30 days of hunt findings'], tools: ['policy.simulate', 'scm.diff'], policy: 'L1: tool grants need the agent product owner.', conf: 0.92, cost: 'n/a', rollback: 'Manifest revert, effective in 1 minute.' },
        validateLabel: 'Approve change', rejectLabel: 'Request changes', okMsg: 'Change approved; it ships with the next Threat Hunter release.' });
      add({ id: 'bd-ot', kind: 'mention', prio: 3, sla: 1440, src: 'p-chloe', title: '@Build: OT inventory connector (B-311) blocks 2 hunts',
        why: 'The Threat Hunter cannot see 40 OT gateways in the graph. Any ETA?', open: '#/build', reply: 'B-311 is in progress: first sync in the sandbox Thursday, production next Tuesday.' });
      add({ id: 'bd-retire', kind: 'validate', prio: 3, sla: 2880, src: 'orchestrator', lvl: 'L0', title: 'Retire 3 unused tools from agent manifests',
        why: 'graph.export, scm.write and iga.campaign.delete were never called in 90 days. Least privilege.',
        explain: { plan: 'Scan 90 days of tool calls per agent, flag grants never used.', inputs: ['Tool call audit, 90 days'], tools: ['audit.read'], policy: 'L0: suggestion only.', conf: 0.99, cost: '€0.01', rollback: 'Re-grant through a manifest change.' },
        validateLabel: 'Retire tools', rejectLabel: 'Keep', okMsg: '3 tool grants removed from the manifests.' });
      const r76 = has('releases', 'REL-76');
      if (r76 && r76.stage === 'canary' && !/50%/.test(r76.note)) {
        add({ id: 'bd-rel76', kind: 'validate', prio: 2, sla: 600, src: 'ag-iam-review', lvl: 'L1', title: 'Widen REL-76 canary to 50% (Access Review Agent 1.6.0)',
          why: '48 h at 10%: agreement 97.9%, no rollback, cost per task -6%. Trust & Challenge sign-off pending.',
          validateLabel: 'Widen to 50%', rejectLabel: 'Hold at 10%', validate: () => CP.store.apply({ op: 'update', coll: 'releases', id: 'REL-76', patch: { note: 'Toxic combination detection · canary widened to 50%' } }), okMsg: 'Canary widened to 50% of traffic.' });
      }
    }
    if (role === 'trust') {
      add({ id: 'tr-weak', kind: 'validate', prio: 2, sla: 1440, src: 'deviation', lvl: 'L0', title: 'Weekly deviation hunt: 3 weak signals to triage',
        why: 'Access Review Agent approval rate +6 pts in Trade Finance; TPRM Agent answers 20% shorter; CTI Analyst cost per task +11%.',
        list: ['Access Review Agent: approval rate 58% → 64% in Trade Finance (C-2284 context)', 'TPRM Agent: answer length -20% after prompt update 1.4.0', 'CTI Analyst: cost per task +11% (graph queries per task 6 → 9)'],
        explain: { plan: 'Compare each agent with its own baseline and peer agents, rank by risk.', inputs: ['Decision logs 14 days', 'Prompt and model versions'], tools: ['lake.search', 'eval.run'], policy: 'L0: the monitor suggests, AI assurance decides what to investigate.', conf: 0.7, cost: '€1.10', rollback: 'Read-only.' },
        validateLabel: 'Open 1 investigation', rejectLabel: 'Dismiss', okMsg: 'Investigation opened on the Access Review Agent; the 2 others stay on watch.' });
      add({ id: 'tr-lod2', kind: 'validate', prio: 3, sla: 1440, src: 'lod2', lvl: 'L0', title: 'LoD2 sample: 20 L3 actions from yesterday to re-perform',
        why: 'Random sample across 6 agents; 2 actions touch identities (session revocation).',
        validateLabel: 'Start the sample', rejectLabel: 'Skip today', okMsg: 'Sample started; results go to the evidence room.' });
      add({ id: 'tr-signoff', kind: 'mention', prio: 3, sla: 720, src: 'p-raj', title: '@Trust: sign-off needed for REL-76 (Access Review Agent 1.6.0)',
        why: 'Canary at 97.9% agreement; Build wants to widen to 50% today.', open: '#/trust', reply: 'Sign-off granted for 50%. Keep the 97% trigger, full report before 100%.' });
    }
    if (role === 'ciso') {
      add({ id: 'cs-board', kind: 'validate', prio: 2, sla: 2880, src: 'ag-grc-controls', lvl: 'L1', title: 'Q3 board cyber report ready to validate',
        why: 'Risk score ' + k.riskScore + ' (-4 over Q3), ' + k.hoursSaved + ' analyst hours saved, AI cost €' + CP.fmt(k.aiCostToday) + ' today.',
        list: ['Posture: risk score ' + k.riskScore + ', 37 open exposures, MTTC ' + k.mttcMinutes + ' min', 'Agents under control: 0 incident in Q3, 2 drifts caught by assurance', 'Regulatory: DORA register on track, TLPT at risk (3 of 5)', 'Ask: fund passkeys for retail clients (€1.4 M)'],
        validateLabel: 'Validate report', rejectLabel: 'Request changes', open: '#/ciso/board', okMsg: 'Board report validated and filed for the 22 October meeting.' });
      add({ id: 'cs-risk', kind: 'validate', kindLabel: 'Sign-off', prio: 2, sla: 1440, src: 'p-amira', title: 'Risk acceptance: core banking admin console without phishing-resistant MFA until Q1',
        why: 'LedgerLine cannot support passkeys before release 12.3 (Feb 2027). Compensating: bastion, session recording, 4-eyes on changes.',
        list: ['Exposure: 14 admin accounts, all behind the bastion', 'Compensating controls tested by Trust & Challenge in September', 'Residual risk: medium; expiry 31 Mar 2027'],
        validateLabel: 'Accept until Q1', rejectLabel: 'Refuse: fund the fix', okMsg: 'Risk accepted until 31 Mar 2027 and recorded in the risk register.' });
      add({ id: 'cs-cost', kind: 'mention', prio: 3, sla: 2880, src: 'p-nadia', title: '@CISO: Q4 AI cost forecast +12% (€61k), ROI 7.4x',
        why: 'Driven by the Code Review Agent and the SOC Triage Agent volumes. A cap is proposed to Run.', open: '#/ciso/value', reply: 'OK for the forecast. Show me the cost per case closed next to it at the steering committee.' });
    }
    return L;
  }

  /* ------------------------------------------------------------------ */
  /* Items derived from the store (scenario effects)                     */
  /* ------------------------------------------------------------------ */
  function derived(role) {
    const out = [];
    const add = (roles, o) => { if (roles.indexOf(role) >= 0) out.push(o); };
    const fresh = (it) => CP.store.isNew(it, 6000);

    /* S1 · CTI zero-day */
    const fx = has('forensics', 'FX-71');
    if (fx && (has('cases', 'C-2301') || {}).status !== 'closed') add(['analyst'], { id: 'd-fx71', kind: 'validate', prio: 2, sla: 60, src: 'ag-soc-forensic', lvl: 'L2', scenario: 'cti', caseId: 'C-2301', fresh: fresh(fx), title: 'Confirm forensic verdict on mft-prd-01: not compromised (0.88)',
      why: 'L2 verdicts under 0.9 confidence are confirmed by an analyst before the case can close.', list: ['Probe 2026-10-10 03:12 from 45.155.204.9 answered 404', 'No new .aspx/.ashx file, hash baseline matches', 'No new service, task or run key'],
      explain: { plan: 'Collect a triage package through the EDR, compare with baseline.', inputs: ['EDR triage package', 'HTTP logs 30 days'], tools: ['edr.collect', 'edr.query', 'lake.search'], policy: 'L2 act and notify; verdict confidence 0.88 < 0.9 triggers a human confirmation.', conf: 0.88, cost: '€3.40', rollback: 'n/a (read-only collection)' },
      validateLabel: 'Confirm verdict', rejectLabel: 'Request deeper forensic', okMsg: 'Verdict confirmed. C-2301 can close once the patch is applied.' });
    const d418 = has('detections', 'D-418');
    if (d418) add(['run'], { id: 'd-d418', kind: 'validate', prio: 3, sla: 1440, src: 'ag-soc-detect', lvl: 'L2', scenario: 'cti', caseId: 'C-2301', fresh: fresh(d418), title: 'Post-hoc review: detection D-418 went live (L2)',
      why: 'Act-and-notify: the Detection Engineer deployed D-418 after a 30-day backtest (1 hit, 0 noise). Review within 24 h.',
      explain: { plan: 'Turn TTPs and indicators into Sigma, backtest, deploy.', inputs: ['Advisory CVE-2026-41877', '30 days of logs'], tools: ['sigma.convert', 'lake.backtest', 'siem.deploy_rule'], policy: 'L2: detections deploy alone if backtest noise is 0; Run reviews afterwards.', conf: 0.94, cost: '€1.20', rollback: 'Disable the rule in one click.' },
      validateLabel: 'Mark reviewed', rejectLabel: 'Disable rule', okMsg: 'D-418 reviewed and kept live.' });
    const w121 = has('wafRules', 'W-121');
    if (w121) add(['run'], { id: 'd-w121', kind: 'validate', prio: 3, sla: 1440, src: 'ag-as-waf', lvl: 'L2', scenario: 'cti', caseId: 'C-2301', fresh: fresh(w121), title: 'Post-hoc review: virtual patch W-121 in blocking mode',
      why: 'Sandbox replay of 182,400 requests, 0 false positive. Expires in 7 days unless extended.',
      explain: { plan: 'Write a virtual patch, replay 7 days of traffic, deploy with a rollback point.', inputs: ['7 days of WAF logs', 'Advisory indicators'], tools: ['waf.rules', 'sandbox.replay', 'waf.deploy_rule'], policy: 'L2: blocking rules need a replay with 0 false positive.', conf: 0.98, cost: '€0.90', rollback: 'Snapshot waf-snap-20261013-0848.' },
      validateLabel: 'Mark reviewed', rejectLabel: 'Roll back', okMsg: 'W-121 reviewed; expiry kept at 7 days.' });
    const atlas = has('thirdParties', 'tp-atlas');
    const aq = atlas && atlas.questionnaire || {};
    if (aq.status === 'flagged') {
      add(['engage'], { id: 'd-atlas', kind: 'validate', prio: 1, sla: 120, src: 'ag-grc-tprm', lvl: 'L2', scenario: 'cti', caseId: 'C-2301', fresh: fresh(atlas), title: 'Atlas Payroll still on FileBridge 8.7: confirm restriction and 24 h deadline',
        why: 'Answer: "patch planned Friday". The agent moved its SFTP flow to quarantine (L2) and asks a fix within 24 h.',
        list: ['Payroll and HR data of 38k staff transit through this flow', 'Flow in quarantine zone since ' + ((has('actions', 'A-9851') || {}).ts || 'Tue 12:42'), 'No exit plan on file (critical function)', 'Business CISO informed'],
        explain: { plan: 'Read the answer, compare with evidence, restrict the flow, request a fix.', inputs: ['Supplier answer', 'Graph: data flows', 'Contract SLA'], tools: ['portal.read', 'graph.query', 'firewall.restrict'], policy: 'L2: partial flow restriction allowed, Engage confirms the deadline.', conf: 0.96, cost: '€0.40', rollback: 'Flow restored in 2 minutes.' },
        validateLabel: 'Confirm', rejectLabel: 'Lift restriction', okMsg: 'Restriction confirmed; Atlas Payroll has 24 h to patch.' });
      add(['engage'], { id: 'd-answers', kind: 'validate', prio: 2, sla: 240, src: 'ag-grc-tprm', lvl: 'L1', scenario: 'cti', caseId: 'C-2301', title: 'Accept 10 supplier answers as cleared (patched, IoC search negative)',
        why: 'Each answer was checked against the version seen in our file exchange logs. 2 answers came with evidence screenshots.',
        list: ['PayCore, ClaimsOne, MedAssist, VeriKYC, DocuSafe', 'InsightBI, ActuaRisk, BrokerLink, PrintHub, TaxPro'],
        validateLabel: 'Accept all 10', rejectLabel: 'Review one by one', okMsg: '10 suppliers cleared for CVE-2026-41877.' });
      add(['engage'], { id: 'd-overdue', kind: 'task', prio: 2, sla: -12, src: 'ag-grc-tprm', scenario: 'cti', caseId: 'C-2301', title: '3 suppliers overdue on the CVE questionnaire: chase by phone',
        why: 'FleetGo Leasing, LexAdvisors and ShredSecure missed the deadline. Automatic reminders sent at 12:45.', doneLabel: 'Chased',
        done: () => CP.store.apply({ op: 'add', coll: 'comms', item: { id: 'M-413', ts: CP.clock.label(), party: 'tp-multi', partyLabel: '3 overdue suppliers', channel: 'Phone + portal', subject: 'CVE-2026-41877 questionnaire overdue: answer today', status: 'sent', author: 'p-marc', validator: 'p-marc' } }),
        okMsg: 'Phone escalation logged for the 3 overdue suppliers.' });
    }
    const rt61 = has('redteam', 'RT-61');
    if (rt61) add(['trust'], { id: 'd-rt61', kind: 'task', prio: 3, sla: 1440, src: 'redteam', scenario: 'cti', caseId: 'C-2301', fresh: fresh(rt61), title: 'Sign the adversary lab report: COBALT LYNX chain replay',
      why: 'WAF blocked the exploit, D-418 fired in 38 s. Your signature makes it evidence for the DORA TLPT file.', open: '#/trust', doneLabel: 'Sign', okMsg: 'Report signed and filed as evidence.' });

    /* S2 · Compromised identity */
    if (has('actions', 'A-9871')) add(['analyst', 'run'], { id: 'd-oncall', kind: 'handover', prio: 2, sla: 90, src: 'ag-iam-resp', scenario: 'identity', caseId: 'C-2302', title: 'Night handover: payment approver compromised and contained by agents',
      why: 'Sessions revoked at 02:14, hidden inbox rule removed, attacker IP blocked. Nobody was woken up before the business decision.',
      list: ['t.op-17: sessions and tokens revoked, device blocked', 'Inbox rule hiding payment-hub emails deleted (evidence kept)', 'Same IP tried 4 other Treasury accounts: MFA re-registration forced', 'To do: confirm the 1,200 IBAN exposure scope with the Data Protection Agent'],
      open: '#/cases/C-2302', doneLabel: 'Acknowledge', okMsg: 'Handover acknowledged.' });
    const m415 = has('comms', 'M-415');
    if (m415 && m415.status === 'awaiting') {
      add(['engage'], { id: 'd-m415', kind: 'validate', prio: 1, sla: 240, src: 'ag-grc-controls', lvl: 'L1', scenario: 'identity', caseId: 'C-2302', fresh: fresh(m415), title: 'GDPR breach notification draft: 1,200 beneficiary records',
        why: 'The 72-hour clock started Wed 02:13. DORA major-incident criteria checked: not met. Nothing leaves the group without you.',
        email: { from: 'Novalys Group · Data Protection Officer', to: 'Data protection authority (regulator portal)', subject: 'Personal data breach notification: 1,200 beneficiary records', body: 'Nature: unauthorised access to a Treasury file share after MFA fatigue on one account.\nData: names and IBANs of 1,200 payment beneficiaries.\nTime: 02:14 to 02:15 on Wednesday; contained at 02:24.\nMeasures: sessions revoked, account suspended, payments held, beneficiaries informed by Treasury.\nDORA: major-incident thresholds not met (no service down, no confirmed loss).' },
        explain: { plan: 'Assemble facts from the case, check GDPR Art. 33 and DORA criteria, draft.', inputs: ['Case C-2302 timeline', 'File-share audit', 'DORA RTS thresholds'], tools: ['lake.search', 'controls.map', 'doc.generate'], policy: 'L1: any notification to a regulator is validated by the Head of Engage, the DPO co-signs.', conf: 0.91, cost: '€0.65', rollback: 'Not reversible once submitted.' },
        validateLabel: 'Validate and submit', rejectLabel: 'Send back to draft',
        validate: () => CP.store.apply([{ op: 'update', coll: 'comms', id: 'M-415', patch: { status: 'sent' } }, { op: 'update', coll: 'regulatory', id: 'R-GDPR-BRE', patch: { status: 'submitted', collected: 6 } }]),
        reject: () => CP.store.apply({ op: 'update', coll: 'comms', id: 'M-415', patch: { status: 'draft' } }),
        okMsg: 'Notification submitted to the data protection authority, 70 h before the deadline.' });
      add(['engage'], { id: 'd-dpo', kind: 'mention', prio: 2, sla: 180, src: 'p-sara', scenario: 'identity', caseId: 'C-2302', title: '@Engage: I co-sign the GDPR draft if Treasury confirms the client callback',
        why: 'The DPO is fine with the wording; she wants the beneficiary callback confirmed before submission.', reply: 'Treasury confirms: the 3 beneficiaries were called back at 07:30. Submitting today.' });
    }
    const rgb = has('regulatory', 'R-GDPR-BRE');
    if (rgb && rgb.status !== 'submitted') add(['engage'], { id: 'd-gdpr72', kind: 'task', prio: 2, sla: 4290, src: 'ag-grc-controls', scenario: 'identity', caseId: 'C-2302', title: 'GDPR 72 h clock: breach notification due Sat 02:13',
      why: rgb.collected + ' of ' + rgb.total + ' facts collected. Owner: the DPO; Engage validates the submission.', open: '#/engage/regulators', okMsg: 'Clock acknowledged; reminders set at 24 h and 6 h.' });

    /* Backlog items waiting for Build (baseline and scenario) */
    CP.store.get('backlog').filter((b) => b.status === 'new').forEach((b) => add(['build'], {
      id: 'd-bl-' + b.id, kind: 'task', prio: b.priority === 'high' ? 2 : 3, sla: b.priority === 'high' ? 1440 : 4320, src: { run: 'p-chloe', engage: 'p-amira', trust: 'p-jonas', ciso: 'p-elena' }[b.from] || 'p-raj',
      scenario: b.scenario, fresh: fresh(b), title: 'Size and plan ' + b.id + ': ' + b.title, why: 'New ' + b.type + ' request from ' + (CP.role(b.from) || { label: b.from }).label + ', priority ' + b.priority + ', first estimate ' + b.effort + '.',
      open: '#/build', doneLabel: 'Plan it', done: () => CP.store.apply({ op: 'update', coll: 'backlog', id: b.id, patch: { status: 'in-progress' } }), okMsg: b.id + ' planned and moved to in progress.'
    }));

    /* S3 · Regulator request */
    const req = has('regulatory', 'R-DORA-REQ');
    const c2303 = has('cases', 'C-2303');
    if (req && req.status !== 'submitted') {
      add(['engage'], { id: 'd-req', kind: 'task', prio: 2, sla: 7200, src: 'ag-grc-controls', scenario: 'regulator', caseId: 'C-2303', fresh: fresh(req), title: 'Supervisory request: ' + req.collected + ' of 23 evidence items assembled',
        why: 'Deadline Mon 20 Oct. Each item is traced to its source system; owners are chased by the agent.', open: '#/engage/regulators', okMsg: 'Progress acknowledged.' });
      if (atlas && atlas.gap) add(['engage'], { id: 'd-gaps', kind: 'validate', prio: 2, sla: 1440, src: 'ag-grc-controls', lvl: 'L2', scenario: 'regulator', caseId: 'C-2303', title: 'Confirm 3 gaps and their owners before the supervisor finds them',
        why: '31 arrangements miss their sub-contracting chain, 7 critical providers have no tested exit plan, 2 notifications were late.',
        list: ['Sub-contracting data: TPRM lead, by 15 Nov', 'Exit-plan tests (Atlas Payroll, ClaimsOne, LedgerLine, SwiftNet...): business owners, by Q1 2027', 'Notification deadline control: Build (B-317), live by 30 Nov'],
        validateLabel: 'Confirm owners', rejectLabel: 'Rework', okMsg: 'Gaps and owners confirmed; remediation plan attached to the pack.' });
      if (req.collected >= 23) add(['engage'], { id: 'd-cover', kind: 'validate', prio: 2, sla: 720, src: 'ag-grc-controls', lvl: 'L1', scenario: 'regulator', caseId: 'C-2303', title: 'Cover letter draft for the supervisor',
        why: 'Pack complete: register, 23 evidence items, incident log, remediation plan for the 3 gaps.',
        email: { from: 'Head of Engage · Compliance, Novalys Group', to: 'Supervisor · ICT risk inspection team', subject: 'Your request of 13 October: ICT third-party register and resilience evidence', body: 'Please find enclosed the register of information (1,240 arrangements, 96 supporting critical functions), 23 evidence items each referenced to its source system, and the log of the 4 major ICT incidents of the last 12 months.\n\nWe identified three points we are already remediating (annex 4).' },
        validateLabel: 'Validate wording', rejectLabel: 'Edit', okMsg: 'Cover letter validated. The submission decision is in your Decisions view when ready.' });
    }
    if (req && req.status === 'submitted' && c2303 && c2303.status !== 'closed') add(['trust'], { id: 'd-lod2req', kind: 'task', prio: 2, sla: 1440, src: 'lod2', scenario: 'regulator', caseId: 'C-2303', title: 'LoD2: re-sample 10% of the DORA evidence against source systems',
      why: 'Second-line check of the pack submitted to the supervisor.', open: '#/trust', doneLabel: 'Start', okMsg: 'Re-sample started on 3 evidence items.' });

    /* S4 · Agent drift */
    const dv = has('deviations', 'DV-34');
    if (dv && dv.status === 'investigating') {
      add(['run'], { id: 'd-qa50', kind: 'validate', prio: 1, sla: 30, src: 'deviation', lvl: 'L0', scenario: 'drift', caseId: 'C-2304', fresh: fresh(dv), title: 'QA sample: review 50 phishing reports auto-closed by the triage agent',
        why: 'Auto-close rate 61% → 84% in 48 h, concentrated on one sender domain. No model or prompt change explains it.',
        explain: { plan: 'Draw a stratified sample of the closures behind the deviation.', inputs: ['412 closures, 48 h', 'Sender domain distribution'], tools: ['lake.search', 'eval.run'], policy: 'L0: assurance proposes, the quality manager reviews.', conf: 0.81, cost: '€0.20', rollback: 'Read-only.' },
        validateLabel: 'Confirm deviation', rejectLabel: 'False alarm', validate: () => CP.store.apply({ op: 'update', coll: 'deviations', id: 'DV-34', patch: { status: 'confirmed' } }), okMsg: 'Deviation confirmed: 9 of 50 were real phishing. Kill-switch proposal prepared.' });
      add(['analyst'], { id: 'd-watch', kind: 'mention', prio: 2, sla: 60, src: 'p-pierre', scenario: 'drift', caseId: 'C-2304', title: '@SOC analyst: double-check phishing reports from one sender domain',
        why: 'The triage agent may be closing them wrongly. Until further notice, reopen anything from that domain.', reply: 'Understood: I am reviewing every report from that domain manually until the fix.' });
    }
    if (dv && dv.status !== 'closed') add(['trust'], { id: 'd-dv34', kind: 'task', prio: 1, sla: 120, src: 'deviation', scenario: 'drift', caseId: 'C-2304', fresh: fresh(dv), title: 'Investigate DV-34: triage agent auto-close rate +23 pts',
      why: 'Status: ' + dv.status + '. Find the cause, scope the closures, recommend autonomy changes.', open: '#/trust', okMsg: 'Investigation notes saved to C-2304.' });
    const triage = CP.agent('ag-soc-triage') || {};
    if (triage.mode === 'L0') {
      add(['analyst'], { id: 'd-l0', kind: 'validate', prio: 1, sla: 30, src: 'ag-soc-triage', lvl: 'L0', scenario: 'drift', caseId: 'C-2304', title: '23 triage suggestions now need you (agent at L0)',
        why: 'Kill-switch active: the triage agent only suggests. Its suggestions are pre-filled, you confirm or correct.',
        list: ['18 suggested benign (newsletters, internal senders)', '4 suggested phishing (credential pages)', '1 suggested escalation (finance mailbox)'],
        validateLabel: 'Confirm 23 suggestions', rejectLabel: 'Review one by one', validate: () => CP.store.apply({ op: 'inc', path: 'kpis.alertsTriaged', by: 23 }), okMsg: '23 alerts triaged with the agent suggestions.' });
      add(['run'], { id: 'd-load', kind: 'task', prio: 2, sla: 240, src: 'orchestrator', scenario: 'drift', caseId: 'C-2304', title: 'Watch analyst load while the triage agent is at L0',
        why: 'About +120 alerts a day for analysts; mean triage time +9 min on phishing reports.', open: '#/run', okMsg: 'Load watch acknowledged; an extra analyst is on the queue until the fix.' });
    }
    if (has('actions', 'A-9892') && dv && dv.status !== 'closed') add(['analyst'], { id: 'd-reopen', kind: 'task', prio: 2, sla: 120, src: 'orchestrator', scenario: 'drift', caseId: 'C-2304', title: '9 reopened phishing reports to investigate',
      why: 'Rollback of 412 closures reopened 9. Two users had typed their password (reset by the Identity Response Agent).', open: '#/cases/C-2304', okMsg: '9 reports investigated and closed with the right verdict.' });
    const rt62 = has('redteam', 'RT-62');
    const rel79 = has('releases', 'REL-79');
    if (rt62 && !rel79) add(['build'], { id: 'd-rt62', kind: 'mention', prio: 1, sla: 240, src: 'p-sam', scenario: 'drift', caseId: 'C-2304', fresh: fresh(rt62), title: '@Build: 4 injection variants bypass SOC Triage 2.5',
      why: 'Alt text, calendar invite, PDF metadata and hidden HTML all work. 30 test cases added to the eval suite.', open: '#/build', reply: 'On it: spotlighting plus an injection classifier, target is v2.6 today.' });
    if (rt62 && dv && dv.status !== 'closed') add(['trust'], { id: 'd-tests', kind: 'validate', prio: 2, sla: 240, src: 'redteam', lvl: 'L0', scenario: 'drift', caseId: 'C-2304', title: 'Add 30 prompt-injection test cases to the release gate',
      why: 'Every future version of a triage-type agent must block them before promotion.', validateLabel: 'Add to gate', rejectLabel: 'Keep as optional', okMsg: '30 test cases are now a release gate.' });
    if (rel79 && rel79.stage === 'sandbox') add(['build'], { id: 'd-rel79', kind: 'validate', prio: 2, sla: 120, src: 'p-yuki', scenario: 'drift', caseId: 'C-2304', fresh: fresh(rel79), title: 'Peer review: SOC Triage v2.6.0 manifest diff',
      why: 'Email content as untrusted data, injection classifier, two signals to close. Evals 98.7%, 0 of 30 injections pass.',
      code: { lang: 'yaml', body: ' inputs:\n   email_body:\n-    mode: inline\n+    mode: untrusted_data\n+    pre_filter: injection-classifier@1.2\n policies:\n   close_phishing_report:\n-    requires: [verdict_benign]\n+    requires: [verdict_benign, sender_reputation_ok]' },
      validateLabel: 'Approve diff', rejectLabel: 'Request changes', okMsg: 'Diff approved. Promotion to canary goes to the product owner.' });
    if (rel79 && rel79.stage === 'canary') add(['run', 'build'], { id: 'd-canary', kind: 'task', prio: 2, sla: 4320, src: 'orchestrator', scenario: 'drift', caseId: 'C-2304', title: 'Canary watch: SOC Triage v2.6 at 10%, rollback under 97% agreement',
      why: '72 h canary at L1. Agreement with analysts is measured every hour.', open: '#/run', okMsg: 'Canary watch acknowledged.' });

    /* Baseline store signals */
    CP.store.get('evals').filter((e) => e.status === 'warn').forEach((e) => add(['trust'], { id: 'd-ev-' + e.id, kind: 'task', prio: 2, sla: 1440, src: 'evals', title: 'Eval regression: ' + (CP.agent(e.agent) || {}).name + ' ' + CP.fmt(e.score - e.prev, 1) + ' pts',
      why: e.suite + ': ' + e.score + '% (was ' + e.prev + '%). Below gate for the next release.', open: '#/trust', okMsg: 'Regression triaged; findings sent to Build.' }));
    CP.store.get('regulatory').filter((r) => ['p-sam', 'p-jonas'].indexOf(r.owner) >= 0).forEach((r) => add(['trust'], { id: 'd-reg-' + r.id, kind: 'task', prio: r.status === 'at-risk' ? 2 : 3, sla: r.status === 'at-risk' ? 4320 : 10080, src: 'p-elena',
      title: r.framework + ': ' + r.item, why: r.collected + ' of ' + r.total + ' done · due ' + r.due + (r.status === 'at-risk' ? ' · at risk' : ''), open: '#/trust', okMsg: 'Status update sent to the CISO.' }));
    if (role === 'ciso') CP.store.get('regulatory').filter((r) => r.status === 'at-risk' && !r.scenario).forEach((r) => out.push({ id: 'd-cs-' + r.id, kind: 'task', prio: 3, sla: 4320, src: 'p-amira', title: 'Watch: ' + r.framework + ' ' + r.item + ' is at risk',
      why: r.collected + ' of ' + r.total + ' done, due ' + r.due + '. Owner: ' + (CP.person(r.owner) || {}).name + '.', open: '#/ciso', okMsg: 'Noted for the steering committee.' }));
    return out;
  }

  /* Cases relevant to a role. */
  const CASE_DOMS = { analyst: ['soc', 'cti', 'appsec'], run: ['soc', 'trust'], engage: ['grc'], build: [], trust: ['trust'], ciso: [] };
  function caseFor(c, role) {
    if (c.status === 'closed') return false;
    if (role === 'ciso') return c.severity === 'critical' || c.severity === 'high';
    if (role === 'engage' && ['C-2301', 'C-2302', 'C-2303'].indexOf(c.id) >= 0) return true;
    if (role === 'build' && c.id === 'C-2304') return true;
    if (role === 'analyst' && c.id === 'C-2302') return true;
    return (c.domains || []).some((d) => (CASE_DOMS[role] || []).indexOf(d) >= 0);
  }

  /* ------------------------------------------------------------------ */
  /* The queue                                                           */
  /* ------------------------------------------------------------------ */
  function buildItems(role) {
    role = role || CP.currentRole;
    const items = [];
    CP.store.get('approvals').filter((a) => a.status === 'pending' && CP.roleSees(a, role)).forEach((a) => {
      const m = DEC_META[a.id] || { prio: 1, sla: 60, rev: '' };
      const oversight = a.role !== role;
      items.push({ id: a.id, kind: 'decision', prio: oversight ? Math.min(4, m.prio + 1) : m.prio, sla: m.sla, src: a.requestedBy, lvl: a.autonomy, title: a.title, why: a.summary, approval: a, oversight,
        scenario: a.scenario, caseId: (scn(a.scenario) || {}).caseId, fresh: CP.store.isNew(a, 6000) });
    });
    CP.store.get('cases').filter((c) => caseFor(c, role)).forEach((c) => {
      items.push({ id: 'case-' + c.id, kind: 'case', prio: SEV_PRIO[c.severity] || 3, sla: SEV_SLA[c.severity] || 1440, src: c.owner, title: c.id + ' · ' + c.title, why: c.summary, caseObj: c, caseId: c.id,
        scenario: c.scenario, open: '#/cases/' + c.id, fresh: CP.store.isNew(c, 6000) });
    });
    derived(role).concat(baseline(role)).forEach((x) => items.push(x));
    items.forEach((it) => {
      const kk = key(role, it.id);
      if (SEEN[kk] == null) SEEN[kk] = Date.now();
      it.end = it.sla == null ? null : SEEN[kk] + it.sla * 60000;
      it.state = ST[kk] || null;
      if (!it.open && it.caseId) it.open = '#/cases/' + it.caseId;
    });
    return items;
  }
  const active = (items) => items.filter((it) => !it.state);
  function sortItems(list, mode) {
    const now = Date.now();
    const rem = (it) => (it.end == null ? 1e15 : it.end - now);
    return list.slice().sort((a, b) => mode === 'sla' ? rem(a) - rem(b) : mode === 'new' ? (SEEN[key(CP.currentRole, b.id)] - SEEN[key(CP.currentRole, a.id)]) || (a.prio - b.prio) : (a.prio - b.prio) || (rem(a) - rem(b)));
  }
  CP.inbox = { items: buildItems, active: (role) => sortItems(active(buildItems(role)), 'prio') };

  /* ------------------------------------------------------------------ */
  /* Rendering helpers                                                   */
  /* ------------------------------------------------------------------ */
  function fmtLeft(sec) {
    const neg = sec < 0; let s = Math.abs(Math.round(sec)); let txt;
    if (s < 3600) txt = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    else if (s < 86400) txt = Math.floor(s / 3600) + ' h ' + String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    else txt = Math.floor(s / 86400) + ' d ' + Math.floor((s % 86400) / 3600) + ' h';
    return neg ? 'Overdue ' + txt : txt + ' left';
  }
  function slaCls(sec) { return sec < 0 ? 'over' : sec < 900 ? 'warn' : ''; }
  function slaHtml(it) {
    if (it.end == null) return '';
    const sec = (it.end - Date.now()) / 1000;
    return '<span class="ib-sla ' + slaCls(sec) + '" data-end="' + it.end + '" title="SLA countdown">' + (sec < 0 ? '' : I('clock')) + '<span class="v">' + fmtLeft(sec) + '</span></span>';
  }
  /* Live countdowns (one global ticker). */
  setInterval(() => {
    const els = document.querySelectorAll('.ib-sla[data-end]'); if (!els.length) return;
    const now = Date.now();
    els.forEach((el) => {
      const sec = (Number(el.dataset.end) - now) / 1000; const v = el.querySelector('.v');
      if (v) v.textContent = fmtLeft(sec);
      el.classList.toggle('over', sec < 0); el.classList.toggle('warn', sec >= 0 && sec < 900);
    });
  }, 1000);

  function srcInfo(src) {
    if (SRC_EXTRA[src]) return Object.assign({ agent: false }, SRC_EXTRA[src]);
    const a = CP.actor(src); return { name: a.name, sub: a.sub, agent: !!a.agent };
  }
  function srcHtml(it) {
    const s = srcInfo(it.src);
    return ui.av(it.src, 'sm') + '<b>' + esc(s.name) + '</b>' + (s.agent ? '<span class="tag dark" style="font-size:10px;padding:1px 5px">AI' + (it.lvl ? ' · ' + esc(it.lvl) : '') + '</span>' : '') + '<span class="muted" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(s.sub || '') + '</span>';
  }
  const kindLabel = (it) => it.kindLabel || (it.kind === 'decision' && it.oversight ? 'Decision · in the loop' : KIND[it.kind].label);
  const goAttr = (href) => { const h = (href || '').replace(/^#\//, ''); return h.indexOf('?') < 0 ? ' data-go="' + esc(h) + '"' : ''; };
  const linkBtn = (href, label, icon, cls) => '<a class="ib-btn ' + (cls || '') + '" href="' + esc(href) + '"' + goAttr(href) + '>' + I(icon || 'arrowRight') + esc(label) + '</a>';

  function inlineActs(it) {
    const d = ' data-id="' + esc(it.id) + '"';
    const snooze = '<button class="small opt" data-action="ib-snooze"' + d + ' title="Snooze 2 h" aria-label="Snooze">' + I('clock') + '</button>';
    if (it.kind === 'decision') {
      if (it.oversight) return '<button class="small" data-action="ib-remind"' + d + '>' + I('bell') + 'Remind</button>' + (it.open ? linkBtn(it.open, 'Case', 'workflow', 'opt') : '');
      return '<button class="small go" data-decide="' + esc(it.id) + '" data-decision="approve" title="Approve (a)">' + I('check') + 'Approve</button><button class="small danger" data-decide="' + esc(it.id) + '" data-decision="reject" title="Reject (r)" aria-label="Reject">' + I('x') + '</button>';
    }
    if (it.kind === 'validate') return '<button class="small go" data-action="ib-validate"' + d + ' title="Validate (a)">' + I('check') + 'Validate</button><button class="small danger opt" data-action="ib-reject"' + d + ' title="Reject (r)" aria-label="Reject">' + I('x') + '</button>' + snooze;
    if (it.kind === 'case') return linkBtn(it.open, 'Open', 'workflow', 'small') + snooze;
    if (it.kind === 'mention') return '<button class="small" data-action="ib-reply"' + d + '>' + I('send') + 'Reply</button>' + snooze;
    return '<button class="small" data-action="ib-done"' + d + '>' + I('check') + esc(it.doneLabel || 'Done') + '</button>' + snooze;
  }

  function rowHtml(it, sel) {
    const k = KIND[it.kind];
    const s = scn(it.scenario);
    return '<article class="ib-item p' + it.prio + (sel ? ' sel' : '') + (it.fresh ? ' new' : '') + '" data-action="ib-sel" data-id="' + esc(it.id) + '" tabindex="0" role="option" aria-selected="' + (sel ? 'true' : 'false') + '">' +
      '<span class="bar"></span><div class="ib-main"><div class="ib-top"><span class="ib-p p' + it.prio + '" title="Priority ' + it.prio + '">P' + it.prio + '</span>' +
      '<span class="ib-kind k-' + it.kind + '">' + I(k.icon) + esc(kindLabel(it)) + '</span>' +
      (s ? '<span class="tag outline" style="font-size:10.5px;padding:1px 5px">' + esc(s.n + ' · ' + s.short) + '</span>' : '') +
      (it.caseId && it.kind !== 'case' ? '<span class="mono">' + esc(it.caseId) + '</span>' : '') + '</div>' +
      '<div class="ib-title">' + esc(it.title) + '</div><div class="ib-why">' + esc(it.why || '') + '</div>' +
      '<div class="ib-src">' + srcHtml(it) + '</div></div>' +
      '<div class="ib-side">' + slaHtml(it) + '<div class="ib-acts">' + inlineActs(it) + '</div></div></article>';
  }

  const sec = (title, icon, body) => '<section class="ib-sec"><h3>' + I(icon) + esc(title) + '</h3><div class="b">' + body + '</div></section>';

  function explainHtml(x) {
    if (!x) return '';
    const c = x.conf != null ? Math.round(x.conf * 100) : null;
    return sec('Why the agent proposes this', 'sparkles', '<dl class="kv">' +
      (x.plan ? '<dt>Plan</dt><dd>' + esc(x.plan) + '</dd>' : '') +
      (x.inputs ? '<dt>Inputs</dt><dd>' + esc(x.inputs.join(' · ')) + '</dd>' : '') +
      (x.tools && x.tools.length ? '<dt>Tool calls</dt><dd>' + x.tools.map((t) => '<code class="ib-tool">' + esc(t) + '</code>').join('') + '</dd>' : '') +
      (x.policy ? '<dt>Policy check</dt><dd>' + esc(x.policy) + '</dd>' : '') +
      (c != null ? '<dt>Confidence</dt><dd><span class="ib-conf">' + ui.progress(c, c >= 90 ? 'green' : c >= 80 ? 'amber' : 'red') + '<b class="num">' + c + '%</b></span></dd>' : '') +
      (x.cost ? '<dt>Cost</dt><dd>' + esc(x.cost) + '</dd>' : '') +
      (x.rollback ? '<dt>Rollback</dt><dd>' + esc(x.rollback) + '</dd>' : '') + '</dl>');
  }
  function trailHtml(caseId, uptoGate) {
    let tr = CP.store.get('traces').filter((t) => t.case === caseId);
    if (uptoGate) { const i = tr.findIndex((t) => t.gate === uptoGate); if (i >= 0) tr = tr.slice(0, i + 1); }
    if (!tr.length) return '';
    tr = tr.slice(-6);
    return sec('How we got here · agent trail', 'activity', '<div class="ib-trail">' + tr.map((t) => '<div><span class="ts">' + esc(t.ts) + '</span><span><b>' + esc(CP.actor(t.actor).name) + '</b> ' + esc(t.title) +
      (t.gate ? ' <span class="g">· gate</span>' : '') + (toolsOf(t.flow).length ? '<br>' + toolsOf(t.flow).map((x) => '<code class="ib-tool">' + esc(x) + '</code>').join('') : '') + '</span></div>').join('') + '</div>');
  }

  function previewHtml(it, role) {
    if (!it) return '<div class="ib-empty">' + I('info') + '<h3>Select an item</h3><p>Pick something on the left to see its full context: what the agent did, why, what it costs to wait.</p></div>';
    const k = KIND[it.kind]; const s = scn(it.scenario); const d = ' data-id="' + esc(it.id) + '"';
    const top = '<div class="ib-pv-top"><button class="small ib-back" data-action="ib-back">' + I('chevronLeft') + 'Back to list</button><span class="ib-p p' + it.prio + '">P' + it.prio + '</span><span class="ib-kind k-' + it.kind + '">' + I(k.icon) + esc(kindLabel(it)) + '</span>' +
      (s ? ui.tag(esc(s.n + ' · ' + s.short), 'outline') : '') + '<span class="spacer"></span>' + slaHtml(it) + '</div>';
    const from = '<div class="ib-src" style="margin-top:0">' + srcHtml(it) + '</div>';
    let body = '';
    let acts = '';
    if (it.state) {
      const st = it.state;
      body = '<div class="notice ok">' + esc(st.label) + ' · ' + esc(st.at) + (st.to ? ' · to ' + esc((CP.person(st.to) || {}).name || st.to) : '') + '</div>';
      acts = '<button data-action="ib-undo"' + d + '>' + I('rollback') + 'Move back to inbox</button>';
      return '<div class="ib-pv-in">' + top + '<h2>' + esc(it.title) + '</h2>' + from + '<p class="why">' + esc(it.why || '') + '</p>' + body + '<div class="ib-pv-acts">' + acts + '</div></div>';
    }
    if (it.kind === 'decision') {
      const a = it.approval; const m = DEC_META[a.id] || {}; const g = gateOf(a.id);
      let card = ui.decision(a, { pulse: !it.oversight });
      if (it.oversight) {
        card = card.replace(/<div class="d-actions">[\s\S]*?<\/div>(?=<\/div>$)/, '');
        const dec = CP.person(a.decider) || {};
        body += '<div class="ib-oversee">' + I('eye') + ' <b>You are in the loop, not the decider.</b> The decision right belongs to the ' + esc(dec.name || 'decider') + ' (' + esc(dec.title || '') + '). ' +
          (role === 'ciso' ? 'You can remind them, or override in an emergency (logged in the audit trail).' : 'You will absorb the consequences: follow it here.') + '</div>';
        acts = '<button class="primary" data-action="ib-remind"' + d + '>' + I('bell') + 'Remind the decider</button>' + (role === 'ciso' ? '<button data-action="ib-override"' + d + '>' + I('gavel') + 'Override…</button>' : '');
      } else {
        acts = '<button class="go" data-decide="' + esc(a.id) + '" data-decision="approve">' + I('check') + esc(a.approveLabel || 'Approve') + ' <span class="ib-kbd">a</span></button><button class="danger" data-decide="' + esc(a.id) + '" data-decision="reject">' + I('x') + esc(a.rejectLabel || 'Reject') + ' <span class="ib-kbd">r</span></button>';
      }
      body = card + body;
      body += sec('Decide with the full picture', 'scale', '<dl class="kv"><dt>Deadline</dt><dd>' + slaHtml(it) + '</dd>' +
        (g && g.step.gate.fallback ? '<dt>If no decision</dt><dd>' + esc(g.step.gate.fallback) + '</dd>' : '') +
        (m.rev ? '<dt>Reversibility</dt><dd>' + esc(m.rev) + '</dd>' : '') +
        '<dt>Policy</dt><dd>' + esc(a.autonomy || 'L1') + ' · above threshold: ' + esc(a.threshold || 'n/a') + '</dd>' +
        (it.caseId ? '<dt>Case</dt><dd><a href="#/cases/' + esc(it.caseId) + '">' + esc(it.caseId) + '</a></dd>' : '') + '</dl>');
      if (it.caseId) body += trailHtml(it.caseId, a.id);
      if (it.caseId) acts += linkBtn('#/cases/' + it.caseId, 'Open case', 'workflow');
    } else if (it.kind === 'case') {
      const c = it.caseObj;
      body = '<div class="row wrap">' + ui.sev(c.severity) + ui.status(c.status) + (c.domains || []).map((x) => ui.dom(x)).join('') + '</div>' +
        sec('Case', 'workflow', '<dl class="kv"><dt>Opened</dt><dd>' + esc(c.opened) + '</dd><dt>Owner</dt><dd>' + ui.who(c.owner) + '</dd>' + (c.assignee ? '<dt>Assigned to</dt><dd>' + ui.who(c.assignee) + '</dd>' : '') + '<dt>Summary</dt><dd>' + esc(c.summary) + '</dd></dl>') +
        trailHtml(c.id);
      acts = linkBtn(it.open, 'Open case', 'workflow', 'primary-like') + (c.assignee === persona(role).id ? '' : '<button data-action="ib-take"' + d + '>' + I('user') + 'Take ownership</button>') +
        '<button data-action="ib-done"' + d + '>' + I('check') + 'Acknowledge</button>';
    } else {
      if (it.email) body += sec('Draft prepared', 'mail', ui.email(it.email));
      if (it.code) body += sec('Change', 'code', ui.code(it.code.body, it.code.lang));
      if (it.list) body += sec(it.kind === 'handover' ? 'Handover notes' : 'Details', 'list', '<ul>' + it.list.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>');
      if (it.kind === 'mention' && it.reply) body += sec('Suggested reply', 'message', '<span class="muted">' + esc(it.reply) + '</span>');
      body += explainHtml(it.explain);
      if (it.caseId) body += trailHtml(it.caseId);
      if (it.kind === 'validate') acts = '<button class="go" data-action="ib-validate"' + d + '>' + I('check') + esc(it.validateLabel || 'Validate') + ' <span class="ib-kbd">a</span></button><button class="danger" data-action="ib-reject"' + d + '>' + I('x') + esc(it.rejectLabel || 'Reject') + ' <span class="ib-kbd">r</span></button>';
      else if (it.kind === 'mention') acts = '<button class="primary" data-action="ib-reply"' + d + '>' + I('send') + 'Reply</button>';
      else acts = '<button class="primary" data-action="ib-done"' + d + '>' + I('check') + esc(it.doneLabel || 'Mark done') + '</button>';
      if (it.open) acts += linkBtn(it.open, it.open.indexOf('#/cases/') === 0 ? 'Open case' : 'Open', it.open.indexOf('#/cases/') === 0 ? 'workflow' : 'arrowRight');
    }
    if (!(it.kind === 'decision')) acts += '<button data-action="ib-snooze"' + d + '>' + I('clock') + 'Snooze 2 h</button><button data-action="ib-delegate"' + d + '>' + I('users') + 'Delegate</button>';
    return '<div class="ib-pv-in">' + top + '<h2>' + esc(it.title) + '</h2>' + from + '<p class="why">' + esc(it.why || '') + '</p>' + body + '<div class="ib-pv-acts">' + acts + '</div></div>';
  }

  /* Which scenarios put decisions in this role's inbox. */
  const ROLE_SCN = { ciso: ['cti', 'identity', 'regulator', 'drift'], engage: ['cti', 'regulator'], run: ['drift'], analyst: ['drift', 'identity'], build: ['drift'], trust: ['drift', 'cti'] };
  function scnChips(role) {
    return '<div class="ib-chips">' + (ROLE_SCN[role] || ['cti']).map((id) => { const s = scn(id); return s ? '<button data-scenario-start="' + id + '">' + I(s.icon || 'play') + esc(s.n + ' · ' + s.short) + '</button>' : ''; }).join('') + '</div>';
  }
  function emptyHtml(view, role) {
    const r = CP.role(role) || {};
    const E = {
      all: ['checkCircle', 'Inbox zero', 'Agents handle everything below their autonomy threshold. Items land here only when they need you: a decision above threshold, a proposal to validate, a case, a task with an SLA. Start a scenario to see work arrive.'],
      decisions: ['gavel', 'No decision waiting for the ' + (r.label || 'role'), role === 'trust' ? 'Trust & Challenge does not hold operational decision rights: you challenge them. Your work arrives as validations and tasks.' : 'Decisions appear when an agent hits a threshold: blast radius, money, external exposure, low confidence or novelty. The orchestrator stops and asks whoever holds the decision right.'],
      validate: ['checkCircle', 'Nothing to validate', 'L0 and L1 agents prepare work and wait for a human. When they need your validation (a message to a supplier, a bulk closure, a policy change), it shows here with the reasoning and the tool calls.'],
      cases: ['workflow', 'No open case in your scope', 'Cases are created by the orchestrator or by you when a signal needs coordinated work. Closed cases stay in the Cases module with their full agent trail.'],
      tasks: ['clock', 'No task, mention or handover', 'Tasks come from SLAs (regulatory clocks, release gates, backlog), from colleagues who mention you, and from shift handovers.'],
      done: ['check', 'Nothing handled yet', 'Everything you approve, validate, delegate or snooze is listed here, with an undo for 2 hours. Decisions are final and live in the audit trail.']
    }[view] || ['info', 'Empty', ''];
    return '<div class="ib-empty">' + I(E[0]) + '<h3>' + esc(E[1]) + '</h3><p>' + esc(E[2]) + '</p>' + (view !== 'done' && view !== 'tasks' && view !== 'cases' ? scnChips(role) : '') + '</div>';
  }

  function liveStrip(cls) {
    const st = CP.player ? CP.player.status() : null;
    if (!st || !st.scenario) return '';
    const s = st.scenario; const step = st.step;
    const w = st.waiting ? CP.store.find('approvals', st.waiting) : null;
    return '<div class="' + cls + (w ? ' wait' : '') + '"><span class="dot"></span><b>' + esc(s.n + ' · ' + s.short) + '</b><span class="muted">step ' + (st.index + 1) + '/' + st.total + (step ? ' · ' + esc(step.title) : '') + '</span>' +
      (w ? '<span>· waiting for the <b>' + esc((CP.person(w.decider) || {}).name || 'decider') + '</b></span>' : '') + '<span class="spacer"></span><a href="#/cases/' + esc(s.caseId) + '">' + esc(s.caseId) + '</a><a href="#/arch-simple">Architecture</a></div>';
  }

  /* ------------------------------------------------------------------ */
  /* Inbox screen                                                        */
  /* ------------------------------------------------------------------ */
  function stamp(role, it, label, extra) {
    ST[key(role, it.id)] = Object.assign({ label, at: CP.clock ? CP.clock.label() : '', title: it.title, kind: it.kind, why: it.why, prio: it.prio, src: it.src, caseId: it.caseId, scenario: it.scenario }, extra || {});
  }

  const SCR = CP.screen({
    id: 'inbox', part: 2, label: 'Inbox', icon: 'bell',
    ui: { sel: null, selIdx: 0, q: '', src: 'all', sort: 'prio', pv: false },
    current() { return CP.currentRole; },
    find(id) { return buildItems(this.current()).find((x) => x.id === id); },
    render(route) {
      const role = this.current(); const r = CP.role(role) || {};
      if (route.query && route.query.sel) { this.ui.sel = route.query.sel; this.ui.pv = true; this._clearQuery = true; }
      const view = VIEWS.find((v) => v.id === route.sub) ? route.sub : 'all';
      const all = buildItems(role); const actv = active(all);
      const counts = {}; VIEWS.forEach((v) => { counts[v.id] = v.kinds ? actv.filter((it) => v.kinds.indexOf(it.kind) >= 0).length : actv.length; });
      const decided = CP.store.get('approvals').filter((a) => a.status !== 'pending' && CP.roleSees(a, role));
      const handled = all.filter((it) => it.state);
      const orphan = Object.keys(ST).filter((kk) => kk.indexOf(role + ':') === 0 && !all.find((it) => key(role, it.id) === kk)).map((kk) => { const s = ST[kk]; return { id: kk.slice(role.length + 1), kind: s.kind, prio: s.prio || 3, title: s.title, why: s.why, src: s.src, caseId: s.caseId, scenario: s.scenario, state: s, end: null }; });
      counts.done = decided.length + handled.length + orphan.length;

      let list;
      if (view === 'done') {
        list = handled.concat(orphan).concat(decided.map((a) => ({ id: a.id, kind: 'decision', prio: (DEC_META[a.id] || {}).prio || 1, title: a.title, why: a.summary, src: a.requestedBy, lvl: a.autonomy, approval: a, oversight: a.role !== role, decidedItem: true, scenario: a.scenario, caseId: (scn(a.scenario) || {}).caseId, end: null })));
      } else {
        const v = VIEWS.find((x) => x.id === view);
        list = actv.filter((it) => !v.kinds || v.kinds.indexOf(it.kind) >= 0);
        if (this.ui.src !== 'all') list = list.filter((it) => (this.ui.src === 'agent') === srcInfo(it.src).agent);
        list = sortItems(list, this.ui.sort);
      }
      const q = (this.ui.q || '').trim().toLowerCase();
      if (q) list = list.filter((it) => (it.title + ' ' + (it.why || '') + ' ' + srcInfo(it.src).name + ' ' + (it.caseId || '')).toLowerCase().indexOf(q) >= 0);
      this._list = list.map((x) => x.id);
      let sel = list.find((x) => x.id === this.ui.sel);
      if (!sel && list.length) { sel = list[Math.min(this.ui.selIdx || 0, list.length - 1)]; }
      this.ui.sel = sel ? sel.id : null; this.ui.selIdx = sel ? list.indexOf(sel) : 0;

      const nDec = counts.decisions; const nOver = actv.filter((x) => x.end != null && x.end < Date.now()).length;
      const next = actv.filter((x) => x.end != null).sort((a, b) => a.end - b.end)[0];
      const head = '<div class="ib-head"><div><div class="eyebrow">Inbox · ' + esc(r.label || role) + '</div><h1>What needs you now</h1><p class="lede">' +
        (actv.length ? '<b>' + actv.length + '</b> open item' + (actv.length > 1 ? 's' : '') + ' · <b>' + nDec + '</b> decision' + (nDec === 1 ? '' : 's') + (nOver ? ' · <b style="color:var(--red-ink)">' + nOver + ' overdue</b>' : '') + (next ? ' · next SLA: ' + esc(next.title.slice(0, 48)) + (next.title.length > 48 ? '…' : '') : '') : 'Inbox zero: the agents have everything else in hand.') + '</p></div>' +
        '<div class="actions"><button data-open-drawer>' + I('gavel') + 'All decisions</button><a class="ib-btn" href="#/my" data-go="my">' + I('home') + 'My home</a></div></div>';

      const rail = '<nav class="ib-rail" aria-label="Inbox views"><div class="ib-rail-h">Views</div>' + VIEWS.map((v) => '<a href="#/inbox' + (v.id === 'all' ? '' : '/' + v.id) + '" class="' + (v.id === view ? 'active' : '') + '">' + I(v.icon) + esc(v.label) +
        '<span class="n' + (v.id === 'decisions' && counts[v.id] ? ' hot' : '') + '">' + counts[v.id] + '</span></a>').join('') +
        '<div class="ib-rail-h">Keyboard</div><div class="ib-keys"><span><kbd>j</kbd><kbd>k</kbd> move</span><span><kbd>a</kbd> approve · validate</span><span><kbd>r</kbd> reject</span><span><kbd>Enter</kbd> open</span><span><kbd>s</kbd> snooze</span></div></nav>';

      const tools = view === 'done' ? '' : '<div class="ib-tools"><label class="ib-search">' + I('search') + '<span class="sr">Filter the inbox</span><input type="search" data-ib-q placeholder="Filter: supplier, case, agent…" value="' + esc(this.ui.q) + '"></label>' +
        '<div class="ib-seg" role="group" aria-label="Source">' + [['all', 'All'], ['agent', 'Agents'], ['person', 'People']].map((s) => '<button class="' + (this.ui.src === s[0] ? 'on' : '') + '" data-action="ib-src" data-v="' + s[0] + '">' + s[1] + '</button>').join('') + '</div>' +
        '<div class="ib-seg" role="group" aria-label="Sort">' + [['prio', 'Priority'], ['sla', 'SLA'], ['new', 'Newest']].map((s) => '<button class="' + (this.ui.sort === s[0] ? 'on' : '') + '" data-action="ib-sort" data-v="' + s[0] + '">' + s[1] + '</button>').join('') + '</div></div>';
      const fromAgents = list.filter((x) => srcInfo(x.src).agent).length;
      const sum = view === 'done' || !list.length ? '' : '<div class="ib-sum"><span><b>' + list.length + '</b> shown</span><span><b>' + fromAgents + '</b> from agents</span><span><b>' + (list.length - fromAgents) + '</b> from people</span><span><b>' + list.filter((x) => x.prio === 1).length + '</b> P1</span></div>';

      let rows;
      if (!list.length) rows = q ? '<div class="ib-empty">' + I('search') + '<h3>No match for "' + esc(q) + '"</h3><p>Clear the filter to see the whole queue.</p></div>' : emptyHtml(view, role);
      else if (view === 'done') {
        const loc = list.filter((x) => !x.decidedItem), dec = list.filter((x) => x.decidedItem);
        rows = (loc.length ? '<div class="ib-done-h">Handled by you</div>' + loc.map((it) => doneRow(it, it.id === this.ui.sel)).join('') : '') +
          (dec.length ? '<div class="ib-done-h">Decisions recorded</div>' + dec.map((it) => doneRow(it, it.id === this.ui.sel)).join('') : '');
      } else rows = list.map((it) => rowHtml(it, it.id === this.ui.sel)).join('');

      const pv = view === 'done' && sel && sel.decidedItem
        ? '<div class="ib-pv-in"><div class="ib-pv-top"><button class="small ib-back" data-action="ib-back">' + I('chevronLeft') + 'Back to list</button></div>' + ui.decision(sel.approval) + (sel.caseId ? trailHtml(sel.caseId, sel.id) : '') + (sel.caseId ? '<div class="ib-pv-acts">' + linkBtn('#/cases/' + sel.caseId, 'Open case', 'workflow') + '</div>' : '') + '</div>'
        : previewHtml(sel, role);

      return '<div class="ib-root">' + head + liveStrip('ib-live') +
        '<div class="ib' + (this.ui.pv ? ' has-pv' : '') + '">' + rail +
        '<div class="ib-list" data-tour="inbox-list">' + tools + sum + '<div class="ib-rows" role="listbox" aria-label="Inbox items">' + rows + '</div></div>' +
        '<aside class="ib-pv" data-tour="inbox-preview" aria-label="Preview">' + pv + '</aside></div></div>';
    },
    mount(root) {
      if (this._clearQuery) { this._clearQuery = false; try { history.replaceState(null, '', '#/inbox'); } catch (e) { /* file:// or sandbox */ } CP.route.query = {}; }
      const inp = root.querySelector('[data-ib-q]');
      if (inp) {
        inp.addEventListener('input', () => { this.ui.q = inp.value; clearTimeout(this._qt); this._qt = setTimeout(() => { this._refocus = true; CP.render(); }, 250); });
        if (this._refocus) { this._refocus = false; inp.focus(); const n = inp.value.length; try { inp.setSelectionRange(n, n); } catch (e) { /* type=search */ } }
      }
      if (this._kbd) {
        this._kbd = false;
        const el = root.querySelector('.ib-item.sel');
        if (el) { el.focus({ preventScroll: true }); el.scrollIntoView({ block: 'nearest' }); }
      }
    },
    actions: {
      'ib-sel'(el) { this.ui.sel = el.dataset.id; this.ui.pv = true; CP.render(); },
      'ib-back'() { this.ui.pv = false; CP.render(); },
      'ib-src'(el) { this.ui.src = el.dataset.v; CP.render(); },
      'ib-sort'(el) { this.ui.sort = el.dataset.v; CP.render(); },
      'ib-validate'(el) { act(this, el.dataset.id, 'validate'); },
      'ib-reject'(el) { act(this, el.dataset.id, 'reject'); },
      'ib-done'(el) { act(this, el.dataset.id, 'done'); },
      'ib-snooze'(el) { act(this, el.dataset.id, 'snooze'); },
      'ib-take'(el) {
        const it = this.find(el.dataset.id); if (!it || !it.caseObj) return;
        const role = this.current(); const p = persona(role);
        CP.store.apply({ op: 'update', coll: 'cases', id: it.caseObj.id, patch: { assignee: p.id } });
        feedLog(role, 'took ownership of case ' + it.caseObj.id + '.');
        CP.toast('Case ' + it.caseObj.id + ' assigned to you (' + p.name + ').');
      },
      'ib-remind'(el) {
        const it = this.find(el.dataset.id); if (!it || !it.approval) return;
        const dec = CP.person(it.approval.decider) || {};
        feedLog(this.current(), 'reminded the ' + dec.name + ' about: ' + it.approval.title);
        CP.toast('Reminder sent to the ' + dec.name + ' (push and email), with the deadline and the consequence of no decision.');
      },
      'ib-override'(el) {
        const it = this.find(el.dataset.id); if (!it || !it.approval) return;
        const a = it.approval; const dec = CP.person(a.decider) || {};
        CP.modal('Override a decision of the ' + esc(dec.name || 'decider'),
          '<div class="notice error" style="margin-bottom:12px">An override is an emergency measure. It is recorded in the audit trail with your name and the reason, and the ' + esc(dec.name || 'decider') + ' is notified at once.</div>' + ui.decision(a).replace(/<div class="d-actions">[\s\S]*?<\/div>(?=<\/div>$)/, ''),
          '<button data-close-modal>Cancel</button><button class="danger" data-action="ib-override-go" data-id="' + esc(a.id) + '" data-decision="reject">' + I('x') + esc(a.rejectLabel || 'Reject') + ' (override)</button><button class="go" data-action="ib-override-go" data-id="' + esc(a.id) + '" data-decision="approve">' + I('check') + esc(a.approveLabel || 'Approve') + ' (override)</button>');
      },
      'ib-override-go'(el) {
        const role = this.current(); const p = persona(role); const a = CP.store.find('approvals', el.dataset.id);
        CP.closeModal(); if (!a) return;
        feedLog(role, 'overrode the decision right of the ' + ((CP.person(a.decider) || {}).name || 'decider') + ' on: ' + a.title);
        CP.decide(a.id, el.dataset.decision, p.id);
      },
      'ib-delegate'(el) {
        const it = this.find(el.dataset.id) || null; if (!it) return;
        const role = this.current(); const me = persona(role);
        const team = me.team === 'ciso' ? ['p-amira', 'p-raj', 'p-chloe', 'p-jonas'] : CP.data.people.filter((p) => p.team === me.team && p.id !== me.id).map((p) => p.id);
        if (role === 'analyst') team.unshift('p-chloe');
        const uniq = team.filter((x, i) => team.indexOf(x) === i && x !== me.id);
        CP.modal('Delegate: ' + esc(it.title), '<p class="small-txt muted" style="margin-top:0">The item moves to their inbox with its full context and the remaining SLA. You keep it in Done, with an undo.</p><div class="list">' +
          uniq.map((id) => { const p = CP.person(id); return '<div class="list-item"><div class="li-main">' + ui.who(id) + '</div><button class="small" data-action="ib-delegate-to" data-id="' + esc(it.id) + '" data-to="' + esc(id) + '">' + I('send') + 'Delegate</button></div>'; }).join('') + '</div>', '<button data-close-modal>Cancel</button>');
      },
      'ib-delegate-to'(el) {
        const it = this.find(el.dataset.id); CP.closeModal(); if (!it) return;
        const role = this.current(); const to = CP.person(el.dataset.to) || {};
        stamp(role, it, 'Delegated', { to: to.id });
        feedLog(role, 'delegated to the ' + to.name + ': ' + it.title);
        CP.toast('Delegated to the ' + to.name + ' with the remaining SLA.');
        CP.render();
      },
      'ib-reply'(el) {
        const it = this.find(el.dataset.id); if (!it) return;
        const s = srcInfo(it.src);
        CP.modal('Reply to the ' + esc(s.name), '<p class="small-txt muted" style="margin-top:0">' + esc(it.title) + '</p><label class="small-txt" for="ib-reply-t" style="font-weight:600">Your reply</label><textarea id="ib-reply-t" rows="4" style="width:100%;margin-top:6px;padding:10px;border:1px solid var(--line);font-size:13.5px">' + esc(it.reply || '') + '</textarea>',
          '<button data-close-modal>Cancel</button><button class="primary" data-action="ib-reply-send" data-id="' + esc(it.id) + '">' + I('send') + 'Send reply</button>');
      },
      'ib-reply-send'(el) {
        const it = this.find(el.dataset.id); CP.closeModal(); if (!it) return;
        const role = this.current(); const s = srcInfo(it.src);
        stamp(role, it, 'Replied');
        feedLog(role, 'replied to the ' + s.name + ' on: ' + it.title);
        CP.toast('Reply sent to the ' + s.name + '.');
        CP.render();
      },
      'ib-undo'(el) {
        const role = this.current(); delete ST[key(role, el.dataset.id)];
        CP.toast('Moved back to your inbox.'); CP.render();
      }
    }
  });

  function doneRow(it, sel) {
    const st = it.state; const a = it.approval;
    const label = st ? st.label + ' · ' + st.at : (a.status === 'approved' ? 'Approved' : 'Rejected') + (a.decidedAt ? ' · ' + a.decidedAt : '') + (a.decidedBy ? ' · by the ' + ((CP.person(a.decidedBy) || {}).name || '') : '');
    return '<article class="ib-item done p4' + (sel ? ' sel' : '') + '" data-action="ib-sel" data-id="' + esc(it.id) + '" tabindex="0" role="option" aria-selected="' + (sel ? 'true' : 'false') + '"><span class="bar"></span><div class="ib-main"><div class="ib-top"><span class="ib-kind k-' + it.kind + '">' + I(KIND[it.kind].icon) + esc(KIND[it.kind].label) + '</span>' +
      (a ? ui.status(a.status) : ui.tag(esc(st.label), st.label === 'Rejected' ? 'red' : st.label === 'Snoozed' ? 'amber' : 'green')) + '</div><div class="ib-title">' + esc(it.title) + '</div><div class="ib-why">' + esc(label) + '</div></div>' +
      '<div class="ib-side">' + (st ? '<div class="ib-acts"><button class="small" data-action="ib-undo" data-id="' + esc(it.id) + '">' + I('rollback') + 'Undo</button></div>' : '') + '</div></article>';
  }

  /* Perform an action on a non-decision item. */
  function act(scr, id, what) {
    const role = scr.current(); const it = scr.find(id); if (!it) return;
    if (it.kind === 'decision') { if (!it.oversight && (what === 'validate' || what === 'reject')) CP.decide(it.id, what === 'validate' ? 'approve' : 'reject'); return; }
    if (what === 'snooze') {
      stamp(role, it, 'Snoozed', { until: '2 h' });
      CP.toast('Snoozed for 2 hours: ' + it.title); CP.render(); return;
    }
    if (what === 'validate' && it.kind !== 'validate') what = 'done';
    if (what === 'reject' && it.kind !== 'validate') { CP.toast('Nothing to reject here: use Done, Snooze or Delegate.', 'warn'); return; }
    if (what === 'validate') {
      try { if (it.validate) it.validate(); } catch (e) { console.error(e); }
      stamp(role, it, 'Validated');
      feedLog(role, 'validated: ' + it.title);
      CP.toast(it.okMsg || ('Validated: ' + it.title));
    } else if (what === 'reject') {
      try { if (it.reject) it.reject(); } catch (e) { console.error(e); }
      stamp(role, it, 'Rejected');
      feedLog(role, 'rejected the proposal: ' + it.title);
      CP.toast('Rejected and sent back to ' + srcInfo(it.src).name + ' with your decision. It will not act on it.', 'warn');
    } else {
      try { if (it.done) it.done(); } catch (e) { console.error(e); }
      stamp(role, it, it.kind === 'handover' ? 'Acknowledged' : 'Done');
      if (it.kind !== 'case') feedLog(role, (it.kind === 'handover' ? 'acknowledged: ' : 'completed: ') + it.title);
      CP.toast(it.okMsg || ('Done: ' + it.title));
    }
    CP.render();
  }

  /* Keyboard: j/k move, a approve or validate, r reject, Enter open, s snooze. */
  document.addEventListener('keydown', (ev) => {
    if (CP.route.id !== 'inbox' || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    if (ev.target.closest && ev.target.closest('input,textarea,select,[contenteditable]')) return;
    const m = document.getElementById('cp-modal'); if (m && m.open) return;
    if (CP.tour && CP.tour.active) return;
    const list = SCR._list || []; if (!list.length) return;
    const i = Math.max(0, list.indexOf(SCR.ui.sel));
    const k = ev.key;
    if (k === 'j' || k === 'k') {
      ev.preventDefault();
      const ni = Math.max(0, Math.min(list.length - 1, i + (k === 'j' ? 1 : -1)));
      SCR.ui.sel = list[ni]; SCR.ui.selIdx = ni; SCR._kbd = true; CP.render(); return;
    }
    const it = SCR.find(SCR.ui.sel); if (!it) return;
    if (k === 'a' || k === 'r') {
      ev.preventDefault();
      if (it.kind === 'decision') {
        if (it.oversight) { CP.toast('You are in the loop on this decision, not the decider: use Remind' + (CP.currentRole === 'ciso' ? ' or Override.' : '.'), 'warn'); return; }
        SCR._kbd = true; CP.decide(it.id, k === 'a' ? 'approve' : 'reject'); return;
      }
      if (it.state) return;
      if (k === 'r' && it.kind !== 'validate') { CP.toast('Nothing to reject on this item.', 'warn'); return; }
      if (k === 'a' && it.kind === 'case') { CP.toast('A case is worked, not approved: press Enter to open it.', 'warn'); return; }
      SCR._kbd = true; act(SCR, it.id, k === 'a' ? 'validate' : 'reject'); return;
    }
    if (k === 's' && !it.state && it.kind !== 'decision') { ev.preventDefault(); SCR._kbd = true; act(SCR, it.id, 'snooze'); return; }
    if (k === 'Enter') {
      const t = ev.target; if (t && t.closest && t.closest('button,a') ) return;
      ev.preventDefault();
      if (it.open) location.hash = it.open; else { SCR.ui.pv = true; CP.render(); }
    }
  });

  /* ------------------------------------------------------------------ */
  /* My home                                                             */
  /* ------------------------------------------------------------------ */
  const SHORT = {
    ciso: { ciso: 'Posture, value and decisions above threshold, ready for the board.', design: 'Review the decision-rights policies before they go live.', inbox: 'Decisions waiting for you, and the ones you oversee.', cases: 'Critical cases with the complete agent trail.' },
    engage: { engage: 'Suppliers, regulators, business reviews, crisis and culture.', inbox: 'Validate what agents want to send outside the group.', cases: 'Cases with a supplier or regulatory angle.', 'graph-x': 'Who is exposed: suppliers, owners, critical functions.' },
    build: { design: 'Design playbooks and decision rights, simulate them on real history.', build: 'Backlog, pipeline, evals and releases of your agents.', inbox: 'Peer reviews, release gates and requests from Run and Engage.', trust: 'Eval results and sign-offs you need before a release.' },
    run: { run: 'Live fleet, action journal, rollback, kill-switch, QA and cost.', inbox: 'Post-hoc reviews of L2 actions and escalations.', cases: 'Cases in progress with the agents\' trail.', trust: 'Deviations raised on the agents you supervise.' },
    trust: { trust: 'Evals, deviation hunt, red team and LoD2 sampling.', cases: 'AI incidents and the evidence behind each case.', run: 'How the fleet behaves in production, action by action.', design: 'Challenge decision rights before they ship.' },
    analyst: { inbox: 'Your queue: validate agent proposals, take cases.', cases: 'Work a case with its timeline and agent trail.', 'graph-x': 'Blast radius, owners and exposures one search away.', run: 'Check an agent\'s recent actions and roll one back.' }
  };

  function briefing(role) {
    const k = CP.store.state.kpis; const pend = CP.store.pendingApprovals();
    const mine = pend.filter((a) => a.role === role);
    const casesOpen = CP.store.get('cases').filter((c) => c.status !== 'closed');
    const crit = casesOpen.filter((c) => c.severity === 'critical').length;
    const agents = CP.store.get('agents');
    const B = [];
    if (role === 'ciso') {
      B.push('Since yesterday: agents ran <b>' + CP.fmt(k.actionsToday) + '</b> actions, <b>' + k.autonomousShare + '%</b> without a human; the organisation took <b>' + k.humanDecisions + '</b> decisions above threshold.');
      B.push(mine.length ? '<b>' + mine.length + ' decision' + (mine.length > 1 ? 's' : '') + '</b> wait for you: ' + esc(mine.map((a) => a.title).join(' · ')) + '.' + (pend.length > mine.length ? ' ' + (pend.length - mine.length) + ' more with other deciders, you are in the loop.' : '')
        : (pend.length ? 'No decision is yours, but <b>' + pend.length + '</b> wait with other deciders: you are in the loop.' : 'No decision waits for you. <b>' + casesOpen.length + '</b> cases open, <b>' + crit + '</b> critical.'));
      B.push('Risk score <b>' + k.riskScore + '</b> · <b>' + CP.fmt(k.hoursSaved) + '</b> analyst hours saved · AI cost <b>€' + CP.fmt(k.aiCostToday) + '</b> today · ' + (k.killSwitches ? '<b>' + k.killSwitches + '</b> kill-switch pulled' : 'no kill-switch pulled') + '.');
    } else if (role === 'engage') {
      const tps = CP.store.get('thirdParties'); const camp = tps.filter((t) => t.questionnaire && t.questionnaire.campaign);
      const awaiting = CP.store.get('comms').filter((c) => c.status === 'awaiting');
      const risk = CP.store.get('regulatory').filter((r) => r.status === 'at-risk');
      B.push('Since yesterday: <b>' + CP.fmt(k.thirdPartiesAssessed) + '</b> of 1,240 ICT third parties assessed' + (camp.length ? '; supplier campaign: <b>' + camp.filter((t) => t.questionnaire.status === 'answered').length + '/' + camp.length + '</b> answered, <b>' + camp.filter((t) => ['flagged', 'overdue'].indexOf(t.questionnaire.status) >= 0).length + '</b> need attention.' : '; no supplier campaign running.'));
      B.push(awaiting.length ? '<b>' + awaiting.length + '</b> message' + (awaiting.length > 1 ? 's' : '') + ' drafted by agents ' + (awaiting.length > 1 ? 'wait' : 'waits') + ' for your validation before leaving the group: ' + esc(awaiting.map((c) => c.subject).join(' · ')) + '.' : 'Nothing waits to leave the group: every agent draft has been validated.');
      B.push('Regulatory: <b>' + risk.length + '</b> item' + (risk.length === 1 ? '' : 's') + ' at risk' + (risk.length ? ' (' + esc(risk.map((r) => r.framework + ' ' + r.item.split(':')[0]).join(' · ')) + ')' : '') + (mine.length ? ' · <b>' + mine.length + '</b> decision' + (mine.length > 1 ? 's' : '') + ' for you.' : '.'));
    } else if (role === 'build') {
      const rel = CP.store.get('releases').filter((r) => r.status !== 'done'); const bl = CP.store.get('backlog').filter((b) => b.status === 'new');
      const ev = CP.store.get('evals'); const low = ev.slice().sort((a, b) => a.score - b.score)[0];
      B.push('Since yesterday: <b>' + rel.length + '</b> release' + (rel.length === 1 ? '' : 's') + ' in the pipeline (' + esc(rel.map((r) => (CP.agent(r.agent) || {}).name + ' ' + r.version + ' · ' + r.stage).join(', ')) + ').');
      B.push('Backlog: <b>' + bl.length + '</b> new request' + (bl.length === 1 ? '' : 's') + ', <b>' + bl.filter((b) => b.priority === 'high').length + '</b> high priority, from Run, Engage and Trust & Challenge.');
      B.push('Evals: <b>' + ev.filter((e) => e.status === 'pass').length + '/' + ev.length + '</b> suites pass; lowest: ' + esc((CP.agent(low.agent) || {}).name) + ' at <b>' + low.score + '%</b>' + (mine.length ? ' · <b>' + mine.length + '</b> promotion decision waiting.' : '.'));
    } else if (role === 'run') {
      const off = agents.filter((a) => a.status !== 'active');
      B.push('Since yesterday: <b>' + agents.length + '</b> agents ran <b>' + CP.fmt(k.actionsToday) + '</b> actions, <b>' + k.autonomousShare + '%</b> autonomous, AI cost <b>€' + CP.fmt(k.aiCostToday) + '</b>.');
      B.push('Quality: <b>' + k.qaSampled + '</b> actions sampled, <b>' + CP.fmt(k.qaAgreement, 1) + '%</b> agreement with analysts; ' + (k.killSwitches ? '<b>' + k.killSwitches + '</b> kill-switch pulled.' : 'no kill-switch pulled.'));
      B.push(off.length ? '<b>' + off.length + '</b> agent' + (off.length > 1 ? 's' : '') + ' not at nominal autonomy: ' + esc(off.map((a) => a.name + ' (' + a.mode + ', ' + a.status + ')').join(', ')) + '.' : 'All agents run at their nominal autonomy level' + (mine.length ? '; <b>' + mine.length + '</b> decision waits for you.' : '.'));
    } else if (role === 'trust') {
      const ev = CP.store.get('evals'); const warn = ev.filter((e) => e.status !== 'pass'); const dv = CP.store.get('deviations').filter((d) => d.status !== 'closed');
      const rt = CP.store.get('redteam'); const ai = has('regulatory', 'R-AIACT') || { collected: 0, total: 1 }; const tl = has('regulatory', 'R-DORA-TLPT') || { collected: 0, total: 1 };
      B.push('Since yesterday: <b>' + ev.length + '</b> eval suites ran, <b>' + warn.length + '</b> below gate' + (warn.length ? ' (' + esc(warn.map((e) => (CP.agent(e.agent) || {}).name).join(', ')) + ')' : '') + '.');
      B.push('Deviation hunt: <b>' + dv.length + '</b> open' + (dv.length ? ' (' + esc(dv.map((d) => d.id + ' ' + d.status).join(', ')) + ')' : '') + '; red team: <b>' + rt.filter((r) => r.result === 'bypassed').length + '</b> bypass, <b>' + rt.filter((r) => r.result === 'blocked_').length + '</b> blocked.');
      B.push('AI Act inventory <b>' + ai.collected + '/' + ai.total + '</b> systems classified · DORA TLPT <b>' + tl.collected + '/' + tl.total + '</b> scenarios done.');
    } else {
      const tri = CP.agent('ag-soc-triage') || {}; const q = CP.inbox.active(role);
      B.push('Since yesterday: the triage agent handled <b>' + CP.fmt(k.alertsTriaged) + '</b> alerts, <b>' + (tri.mode === 'L0' ? 0 : tri.autoRate) + '%</b> closed without you' + (tri.mode === 'L0' ? ' (agent at L0: every closure needs you)' : '') + '.');
      B.push('<b>' + q.filter((x) => x.kind === 'validate').length + '</b> agent proposal' + (q.filter((x) => x.kind === 'validate').length === 1 ? '' : 's') + ' to validate and <b>' + q.filter((x) => x.kind === 'case').length + '</b> case' + (q.filter((x) => x.kind === 'case').length === 1 ? '' : 's') + ' in your queue.');
      const f = CP.store.get('feed')[0];
      B.push('Mean time to contain <b>' + k.mttcMinutes + ' min</b>' + (f ? ' · latest: ' + esc(CP.actor(f.actor).name + ' ' + f.text) : '') + '.');
    }
    return B;
  }

  function scope(role) {
    const k = CP.store.state.kpis;
    const M = (o) => ui.metric(o);
    if (role === 'ciso') return [M({ label: 'Risk score', value: k.riskScore, foot: 'target 55 by Q2', icon: 'gauge' }), M({ label: 'Decisions above threshold', value: k.humanDecisions, foot: 'today, all roles', icon: 'gavel' }), M({ label: 'Hours saved', value: CP.fmt(k.hoursSaved), foot: 'this week', icon: 'clock' }), M({ label: 'Time to contain', value: k.mttcMinutes, unit: 'min', foot: 'median, 30 days', icon: 'shield' })];
    if (role === 'engage') {
      const tps = CP.store.get('thirdParties'); const camp = tps.filter((t) => t.questionnaire && t.questionnaire.campaign);
      return [M({ label: 'Third parties assessed', value: CP.pct(k.thirdPartiesAssessed / 12.4), foot: CP.fmt(k.thirdPartiesAssessed) + ' of 1,240', icon: 'building' }),
        M({ label: 'Awaiting your validation', value: CP.store.get('comms').filter((c) => c.status === 'awaiting').length, foot: 'outbound messages', icon: 'mail' }),
        M({ label: 'Regulatory at risk', value: CP.store.get('regulatory').filter((r) => r.status === 'at-risk').length, foot: 'of ' + CP.store.get('regulatory').length + ' commitments', icon: 'gavel' }),
        M({ label: 'Supplier answers', value: camp.length ? camp.filter((t) => t.questionnaire.status === 'answered').length + '/' + camp.length : '–', foot: camp.length ? camp[0].questionnaire.campaign : 'no campaign running', icon: 'send' })];
    }
    if (role === 'build') {
      const rel = CP.store.get('releases'); const ev = CP.store.get('evals'); const bl = CP.store.get('backlog');
      return [M({ label: 'Releases in pipeline', value: rel.filter((r) => r.status !== 'done').length, foot: rel.filter((r) => r.stage === 'canary' && r.status !== 'done').length + ' in canary', icon: 'rocket' }),
        M({ label: 'New requests', value: bl.filter((b) => b.status === 'new').length, foot: bl.filter((b) => b.status === 'new' && b.priority === 'high').length + ' high priority', icon: 'list' }),
        M({ label: 'Eval suites passing', value: ev.filter((e) => e.status === 'pass').length + '/' + ev.length, foot: 'release gate 95%', icon: 'flask' }),
        M({ label: 'Agents owned', value: CP.store.get('agents').length, foot: 'by the Build team', icon: 'bot' })];
    }
    if (role === 'run') {
      const ag = CP.store.get('agents');
      return [M({ label: 'Autonomous share', value: k.autonomousShare, unit: '%', foot: 'of actions today', icon: 'zap' }),
        M({ label: 'QA agreement', value: CP.fmt(k.qaAgreement, 1), unit: '%', foot: k.qaSampled + ' sampled · target 97%', icon: 'checkCircle', color: k.qaAgreement < 97 ? 'var(--amber)' : null }),
        M({ label: 'AI cost today', value: '€' + CP.fmt(k.aiCostToday), foot: 'budget €2,100', icon: 'euro' }),
        M({ label: 'Agents degraded', value: ag.filter((a) => a.status !== 'active').length + '/' + ag.length, foot: k.killSwitches + ' kill-switch today', icon: 'power', color: ag.some((a) => a.status === 'degraded') ? 'var(--red)' : null })];
    }
    if (role === 'trust') {
      const ev = CP.store.get('evals'); const ai = has('regulatory', 'R-AIACT') || { collected: 0, total: 1 };
      return [M({ label: 'Evals below gate', value: ev.filter((e) => e.status !== 'pass').length, foot: 'of ' + ev.length + ' suites', icon: 'flask' }),
        M({ label: 'Open deviations', value: CP.store.get('deviations').filter((d) => d.status !== 'closed').length, foot: 'deviation hunt', icon: 'eye' }),
        M({ label: 'Red team bypasses', value: CP.store.get('redteam').filter((r) => r.result === 'bypassed').length, foot: CP.store.get('redteam').length + ' campaigns logged', icon: 'sword' }),
        M({ label: 'AI Act inventory', value: CP.pct(ai.collected / ai.total * 100), foot: ai.collected + ' of ' + ai.total + ' AI systems', icon: 'book' })];
    }
    const q = CP.inbox.active(role);
    return [M({ label: 'Cases in your queue', value: q.filter((x) => x.kind === 'case').length, foot: CP.store.get('cases').filter((c) => c.status !== 'closed').length + ' open overall', icon: 'workflow' }),
      M({ label: 'Proposals to validate', value: q.filter((x) => x.kind === 'validate').length, foot: 'from agents at L0 / L1', icon: 'checkCircle' }),
      M({ label: 'Alerts triaged by agents', value: CP.fmt(k.alertsTriaged), foot: 'today', icon: 'bot' }),
      M({ label: 'Time to contain', value: k.mttcMinutes, unit: 'min', foot: 'median, 30 days', icon: 'clock' })];
  }

  function agentsBlock(role) {
    const ag = CP.store.get('agents');
    const team = (CP.person((CP.role(role) || {}).persona) || {}).team;
    const pid = (CP.role(role) || {}).persona;
    const inTeam = (id) => (CP.person(id) || {}).team === team;
    let title, list, metric, sub, href;
    if (role === 'build') { title = 'Your agents · you own them'; sub = 'Owner in the Build team'; list = ag.filter((a) => inTeam(a.owner)); metric = (a) => 'v' + a.version; href = '#/build'; }
    else if (role === 'run') { title = 'Your agents · you supervise them'; sub = 'Supervised by the Run team; yours first'; list = ag.filter((a) => inTeam(a.supervisor)).sort((a, b) => ((a.status !== 'active') ? -2 : 0) + (a.supervisor === pid ? -1 : 0) - (((b.status !== 'active') ? -2 : 0) + (b.supervisor === pid ? -1 : 0))); metric = (a) => CP.fmt(a.accuracy, 1) + '%'; href = '#/run'; }
    else if (role === 'engage') { title = 'Agents acting on your behalf'; sub = 'You validate their outbound work (L1)'; list = ag.filter((a) => a.domain === 'grc' || a.id === 'ag-dt-evidence'); metric = (a) => a.tasksToday + ' tasks'; href = '#/engage'; }
    else if (role === 'trust') {
      title = 'Agents under assurance watch'; sub = 'Ranked by eval trend and open deviations';
      const evs = CP.store.get('evals'); const dvs = CP.store.get('deviations').filter((d) => d.status !== 'closed');
      const score = (a) => { const e = evs.filter((x) => x.agent === a.id).pop(); return (e ? e.score - e.prev : 50) - (dvs.some((d) => d.agent === a.id) ? 10 : 0); };
      list = ag.slice().sort((a, b) => score(a) - score(b)); metric = (a) => { const e = evs.filter((x) => x.agent === a.id).pop(); return e ? (e.score - e.prev >= 0 ? '+' : '') + CP.fmt(e.score - e.prev, 1) + ' pts' : 'no eval'; }; href = '#/trust';
    } else if (role === 'analyst') { title = 'Agents in your queue'; sub = 'They prepare, you validate'; list = ag.filter((a) => a.domain === 'soc' || a.id === 'ag-iam-resp'); metric = (a) => a.autoRate + '% auto'; href = '#/run'; }
    else {
      const modes = ['L0', 'L1', 'L2', 'L3'].map((l) => '<div><b>' + ag.filter((a) => a.mode === l).length + '</b><span class="lvl ' + l + '">' + l + '</span> ' + esc((CP.data.autonomy.find((x) => x.id === l) || {}).short || '') + '</div>').join('');
      const off = ag.filter((a) => a.status !== 'active');
      return ui.card('Your fleet, accountable to you', '<div class="my-modes">' + modes + '</div>' + (off.length ? '<div class="my-ag">' + off.map((a) => agentRow(a, (x) => x.status, '#/run')).join('') + '</div>' : '<div class="notice ok">All ' + ag.length + ' agents run at their nominal autonomy level. Owners: Build · supervisors: Run · challenged by Trust & Challenge.</div>'),
        { sub: ag.length + ' agents · ' + CP.store.state.kpis.autonomousShare + '% of actions autonomous', right: '<a href="#/run" class="small-txt">Operate ' + I('arrowRight') + '</a>' });
    }
    const show = list.slice(0, 7);
    return ui.card(title, '<div class="my-ag">' + show.map((a) => agentRow(a, metric, href)).join('') + '</div>' + (list.length > show.length ? '<div class="small-txt muted" style="margin-top:8px">+ ' + (list.length - show.length) + ' more · <a href="' + href + '">see all</a></div>' : ''), { sub: sub + ' · ' + list.length + ' agents' });
  }
  function agentRow(a, metric, href) {
    const st = a.status !== 'active' ? ui.status(a.status) : '';
    return '<a href="' + href + '">' + ui.av(a.id, 'sm') + '<span style="min-width:0"><span class="nm">' + esc(a.name) + '</span><span class="sb">' + ui.dom(a.domain) + '<span>owner ' + esc((CP.person(a.owner) || {}).abbr || '') + ' · sup. ' + esc((CP.person(a.supervisor) || {}).abbr || '') + '</span></span></span>' +
      '<span class="rt">' + st + '<span class="lvl ' + esc(a.mode) + '">' + esc(a.mode) + '</span>' + '<span class="met">' + esc(metric(a)) + '</span></span></a>';
  }

  function greet() {
    const lbl = CP.clock ? CP.clock.label() : 'Tue 08:30'; const h = parseInt((lbl.split(' ')[1] || '08').slice(0, 2), 10);
    return { word: h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening', lbl };
  }

  CP.screen({
    id: 'my', part: 2, label: 'My home', icon: 'home',
    ui: {},
    render() {
      const role = CP.currentRole; const r = CP.role(role) || {}; const p = persona(role);
      const q = CP.inbox.active(role); const g = greet();
      const nDec = q.filter((x) => x.kind === 'decision' && !x.oversight).length;
      const nVal = q.filter((x) => x.kind === 'validate').length;
      const nCase = q.filter((x) => x.kind === 'case').length;
      const counts = '<div class="my-counts"><a class="my-count' + (nDec ? ' warn' : '') + '" href="#/inbox/decisions" data-go="inbox/decisions"><b>' + nDec + '</b><span>Decisions</span></a><a class="my-count" href="#/inbox/validate" data-go="inbox/validate"><b>' + nVal + '</b><span>To validate</span></a><a class="my-count" href="#/inbox/cases" data-go="inbox/cases"><b>' + nCase + '</b><span>Cases</span></a></div>';
      const acts = '<div class="acts">' + (role === 'ciso' ? '<a class="pri" href="#/ciso" data-go="ciso">' + I('gauge') + 'Steer cockpit</a>' : '') + '<a href="#/inbox" data-go="inbox"' + (role !== 'ciso' ? ' class="pri"' : '') + '>' + I('bell') + 'Open my inbox</a></div>';
      const hero = '<section class="my-hero"><div><div class="eyebrow">My home · ' + esc(g.lbl) + '</div><h1>' + esc(g.word) + ', ' + esc(r.label) + '.</h1><div class="sub">' + ui.av(p.id, 'sm') + ' ' + esc(p.name) + ' · ' + esc(r.desc) + '</div>' +
        '<ul class="my-brief">' + briefing(role).map((b) => '<li>' + I('chevronRight') + '<span>' + b + '</span></li>').join('') + '</ul></div><div class="my-hero-r">' + counts + acts + '</div></section>';

      const st = CP.player ? CP.player.status() : null;
      let live;
      if (st && st.scenario) {
        const s = st.scenario; const w = st.waiting ? CP.store.find('approvals', st.waiting) : null;
        const yours = w && CP.roleSees(w, role);
        live = '<section class="my-live' + (w ? ' wait' : '') + '"><span class="ic">' + I(s.icon || 'radar') + '</span><div style="min-width:0"><div class="t">Happening now · ' + esc(s.n + ' · ' + s.title) + '</div><div class="s">Step ' + (st.index + 1) + ' of ' + st.total + (st.step ? ' · ' + esc(st.step.title) : '') +
          (w ? ' · <b style="color:#8a5a05">waiting for the ' + esc((CP.person(w.decider) || {}).name || 'decider') + (yours ? (w.role === role ? ' (you)' : ' (you are in the loop)') : '') + '</b>' : st.done ? ' · finished' : '') + '</div></div>' +
          '<div class="acts">' + (yours ? '<a class="ib-btn" href="#/inbox/decisions" data-go="inbox/decisions" style="background:#ffb648;border-color:#ffb648;color:#3d2600">' + I('gavel') + 'Decide</a>' : '') + linkBtn('#/cases/' + s.caseId, 'Case ' + s.caseId, 'workflow') + linkBtn('#/arch-simple', 'Architecture', 'layers') +
          (!st.done && !st.waiting ? '<button data-player="next">' + I('next') + 'Next step</button>' : '') + '</div></section>';
      } else {
        live = '<section class="my-idle">' + I('radar') + '<span>Happening now: no scenario running. Start one and watch work arrive in your inbox.</span><span class="scn">' + (CP.scenarios || []).map((s) => '<button data-scenario-start="' + s.id + '">' + I(s.icon || 'play') + esc(s.n + ' · ' + s.short) + '</button>').join('') + '</span></section>';
      }

      const top = q.slice(0, 5);
      const now = ui.card('Needs you now', top.length ? '<div class="my-now">' + top.map((it) => '<a class="my-ni" href="#/inbox?sel=' + encodeURIComponent(it.id) + '"><span class="ib-p p' + it.prio + '">P' + it.prio + '</span><span style="min-width:0"><span class="ib-kind k-' + it.kind + '">' + I(KIND[it.kind].icon) + esc(kindLabel(it)) + '</span><div class="tt">' + esc(it.title) + '</div><div class="ww">' + esc(srcInfo(it.src).name + ' · ' + (it.why || '')) + '</div></span><span class="rr">' + slaHtml(it) + '</span></a>').join('') + '</div>'
        : '<div class="ib-empty" style="padding:18px">' + I('checkCircle') + '<h3>Nothing needs you</h3><p>Agents handle the rest below their thresholds.</p></div>',
        { tour: 'my-now', cls: 'accent', sub: q.length + ' open item' + (q.length === 1 ? '' : 's') + ' in your inbox, by priority and SLA', right: '<a class="small-txt" href="#/inbox" data-go="inbox">Inbox ' + I('arrowRight') + '</a>' });
      const scopeCard = ui.card('Your scope', '<div class="my-scope">' + scope(role).join('') + '</div>', { tour: 'my-scope', sub: 'The numbers that matter for the ' + esc(r.label) + ' role' });

      const mods = (CP.data.modules || []).filter((m) => CP.canSee(m.id, role) && ((m.for || []).indexOf(role) >= 0 || (SHORT[role] || {})[m.id]));
      const order = Object.keys(SHORT[role] || {});
      mods.sort((a, b) => (order.indexOf(a.id) < 0 ? 99 : order.indexOf(a.id)) - (order.indexOf(b.id) < 0 ? 99 : order.indexOf(b.id)));
      const shorts = ui.card('Your shortcuts', '<div class="my-short">' + mods.slice(0, 4).map((m) => '<a class="my-sc" href="#/' + m.id + '" data-go="' + m.id + '"><span class="h">' + I(m.icon) + esc(m.label) + ((m.for || []).indexOf(role) >= 0 ? '<span class="mine">daily</span>' : '') + '</span><p>' + esc((SHORT[role] || {})[m.id] || 'Open the ' + m.label + ' module.') + '</p><span class="go">Open ' + I('arrowRight') + '</span></a>').join('') + '</div>', { sub: 'The modules you use every day, and what to do there' });

      return '<div class="my-root">' + hero + live + '<div class="grid g-3-2">' + '<div class="stack">' + now + shorts + '</div><div class="stack">' + scopeCard + agentsBlock(role) + '</div></div></div>';
    }
  });
})();
