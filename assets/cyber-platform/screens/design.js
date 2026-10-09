/* Cyber AI Platform demo: Design module (design time of the platform).
   Build, with the CISO and the domain owners, designs how the platform
   behaves before it runs: response playbooks (flow designer, lint, dry run on
   the digital twin, versions), decision-rights policies (matrix, thresholds,
   30-day backtest, approval workflow), standing approvals, and the catalogue
   of tools and actions the agents may call. */
(function () {
  'use strict';
  const CP = window.CP;
  const esc = CP.esc;
  const U = CP.ui;
  const I = (n) => CP.icon(n);
  const pname = (id) => (CP.person(id) || {}).name || id;
  /* Role name inside a sentence: lower case, except acronyms and proper nouns (DPO, CISO, Engage...). */
  const KEEP = ['Engage', 'Run', 'Treasury', 'Build', 'Business', 'CISO'];
  const lc = (name) => String(name).split(' ').map((w) => (/^[A-Z0-9]{2,}$/.test(w) || KEEP.indexOf(w) >= 0 ? w : w.toLowerCase())).join(' ');

  /* ================================================================
     Styles (prefixed .dz-)
     ================================================================ */
  CP.css('design', `
.dz-chip{font-family:var(--mono);font-size:11px;padding:1px 6px;background:#f1eefb;color:#3c2a7a;border:1px solid #e1dbf6;white-space:nowrap;display:inline-block;line-height:1.5}
.dz-chip.w{background:#fff2d8;color:#8a5a05;border-color:#f3dcae}
.dz-chip.x{background:#ffe9ed;color:#a4233a;border-color:#f6c6cf}
.dz-mini{font-size:11.5px;color:var(--muted);line-height:1.45}
.dz-id{font-family:var(--mono);font-size:11px;color:var(--muted)}
.dz-name{font-weight:650}
.dz-doms{display:flex;gap:4px;flex-wrap:wrap}
.dz-doms i{width:8px;height:8px;display:inline-block}
.dz-dm{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;color:#3b3550;white-space:nowrap}
.dz-prof{display:flex;height:8px;width:96px;background:#eeebf4}
.dz-prof i{display:block;height:100%}
.dz-ok{color:var(--green-ink);font-weight:650;font-size:12.5px;display:inline-flex;gap:5px;align-items:center}
.dz-tr.clickable td{cursor:pointer}
.dz-callout{display:flex;gap:12px;align-items:flex-start;border:1px solid #d9d0f7;background:#f6f3ff;padding:12px 14px;font-size:13px;line-height:1.55;margin-bottom:16px}
.dz-callout svg.i{color:var(--indigo);font-size:18px;margin-top:2px}
/* Designer */
.dz-dcard{background:#fff;border:1px solid var(--line);border-top:3px solid var(--indigo);margin-top:18px;min-width:0}
.dz-dhead{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:14px 16px;border-bottom:1px solid var(--line)}
.dz-dhead h2{margin:0;font-size:17px}
.dz-dbtns{margin-left:auto;display:flex;gap:6px;flex-wrap:wrap}
.dz-meta{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;border-bottom:1px solid var(--line);background:#fbfafd}
.dz-meta>div{padding:10px 16px;border-right:1px solid var(--line-2);min-width:0;font-size:12.5px;line-height:1.45}
.dz-meta>div:last-child{border-right:0}
.dz-meta b{display:block;font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:3px}
.dz-design{display:grid;grid-template-columns:minmax(0,1fr) 350px;min-width:0}
.dz-flowwrap{min-width:0;border-right:1px solid var(--line);display:flex;flex-direction:column}
.dz-flowbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:8px 12px;border-bottom:1px solid var(--line-2);font-size:12px;color:var(--muted)}
.dz-flowbar .lg{display:inline-flex;align-items:center;gap:5px}
.dz-flow{position:relative;overflow:auto;max-height:620px;min-width:0;background:#fff;overscroll-behavior:contain}
.dz-canvas{position:relative}
.dz-axis{position:absolute;left:0;right:0;top:0;height:26px;border-bottom:1px solid var(--line);background:#fbfafd;font-family:var(--mono);font-size:10.5px;color:var(--muted)}
.dz-axis span{position:absolute;top:6px;white-space:nowrap}
.dz-axis .dz-ll{background:#ede9f8;color:var(--indigo);font-family:Inter,sans-serif;font-size:10px;letter-spacing:1.1px;font-weight:700;text-transform:uppercase;box-shadow:none;justify-content:center}
.dz-lane{position:absolute;left:0;right:0;border-bottom:1px solid var(--line-2)}
.dz-lane.alt{background:#fcfbfe}
.dz-ll{position:sticky;left:0;height:100%;background:#f7f6fb;border-right:1px solid var(--line);box-shadow:inset 3px 0 var(--lc,#ccc);padding:6px 8px 6px 11px;font-size:12px;font-weight:650;z-index:4;display:flex;flex-direction:column;justify-content:center;line-height:1.25}
.dz-ll small{font-weight:500;color:var(--muted);font-size:10.5px}
.dz-edges{position:absolute;left:0;top:0;pointer-events:none;z-index:1}
.dz-edges path{fill:none;stroke:#b3adc5;stroke-width:1.6}
.dz-edges path.yes{stroke:#3fae6f}
.dz-edges path.done{stroke:var(--green-ink);stroke-width:2.4}
.dz-edges text{font-size:9.5px;fill:#116539;font-weight:700;font-family:Inter,sans-serif}
button.dz-node{position:absolute;z-index:2;display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;gap:2px;text-align:left;padding:5px 8px 5px 9px;border:1px solid var(--line);border-left:4px solid var(--nc,#999);background:#fff;font-weight:500;min-height:0;line-height:1.25;transition:box-shadow .2s,background .3s}
button.dz-node:hover{border-color:var(--indigo);border-left-color:var(--nc,#999);background:#fff;box-shadow:0 6px 18px #2611541a;z-index:5}
.dz-nh{display:flex;align-items:center;gap:5px;font-size:10.5px;color:var(--muted);min-width:0}
.dz-nh .who{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.dz-nt{font-size:11.8px;font-weight:650;color:var(--ink);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.dz-nf{display:flex;align-items:center;gap:6px;font-size:10.5px;color:var(--muted);margin-top:auto;white-space:nowrap;overflow:hidden}
.dz-l{font-family:var(--mono);font-size:10px;font-weight:700;padding:0 4px;border:1px solid currentColor;flex:none}
.dz-l.L0{color:#6d687e}.dz-l.L1{color:#a4233a}.dz-l.L2{color:#8a5a05}.dz-l.L3{color:#116539}
button.dz-node.gate{border:1px solid #f1c27a;border-left:1px solid #f1c27a;background:#fffaf0;padding-left:46px}
button.dz-node.gate:hover{border-color:#d99c33;background:#fffaf0}
.dz-node.gate .dz-dia{position:absolute;left:9px;top:50%;width:26px;height:26px;margin-top:-13px;transform:rotate(45deg);background:#ffb648;border:2px solid #c8861a}
.dz-node.gate .dz-dia+span{position:absolute;left:13px;top:50%;margin-top:-8px;width:18px;text-align:center;font-size:10px;font-weight:800;color:#3d2600;font-family:var(--mono)}
.dz-node .dz-else{color:var(--red-ink);font-weight:600}
.dz-node .dz-else.ok{color:#8a5a05;font-weight:500}
button.dz-node.sel{box-shadow:0 0 0 3px var(--indigo);z-index:6}
button.dz-node.orphan{border-style:dashed;border-color:var(--red);background:#fff7f8}
.dz-iss{position:absolute;top:-8px;right:-8px;min-width:18px;height:18px;padding:0 4px;background:var(--red);color:#fff;font-size:10.5px;font-weight:700;display:grid;place-items:center;font-family:var(--mono)}
.dz-iss.w{background:#ffb648;color:#3d2600}
button.dz-node.sim-done{background:#effff5}
button.dz-node.gate.sim-done{background:#f3fff0}
button.dz-node.sim-run{box-shadow:0 0 0 3px #04f06aaa;animation:dzpulse 1s infinite;z-index:6}
button.dz-node.gate.sim-run{box-shadow:0 0 0 3px #ffb648cc}
button.dz-node.sim-skip{opacity:.45}
@keyframes dzpulse{50%{box-shadow:0 0 0 6px #04f06a44}}
.dz-simbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:8px 12px;background:var(--dark);color:#e5def8;font-size:12.5px}
.dz-simbar b{color:#fff;font-variant-numeric:tabular-nums}
.dz-simbar .clock{font-family:var(--mono);font-size:15px;color:var(--green);font-weight:700}
.dz-simbar .progress{flex:1;min-width:80px;background:#ffffff22}
.dz-simbar .progress span{background:var(--green)}
/* Inspector */
.dz-insp{padding:14px 16px 18px;display:grid;gap:12px;align-content:start;max-height:680px;overflow:auto;min-width:0}
.dz-insp h3{margin:0;font-size:15px;line-height:1.3}
.dz-f{display:grid;gap:5px;font-size:12px;font-weight:650;color:var(--muted)}
.dz-f select,.dz-f input,.dz-f textarea,.dz-in{border:1px solid var(--line);padding:.42rem .55rem;font-size:13px;min-height:34px;background:#fff;color:var(--ink);font-weight:500;width:100%}
.dz-f input[type=checkbox],.dz-tools input,.dz-deps input{width:auto;min-height:0;padding:0;margin:0;flex:none}
.dz-wide{grid-template-columns:minmax(0,1.7fr) minmax(320px,1fr)}
.dz-f textarea{min-height:64px;line-height:1.45;resize:vertical}
.dz-f select:disabled{background:#f7f6fa;color:var(--muted)}
.dz-seg{display:flex;border:1px solid var(--line)}
.dz-seg button{flex:1;border:0;border-right:1px solid var(--line);min-height:32px;padding:.3rem .2rem;justify-content:center;font-family:var(--mono);font-size:12px}
.dz-seg button:last-child{border-right:0}
.dz-seg button.on{background:var(--dark);color:#fff}
.dz-seg button.over{color:var(--red-ink)}
.dz-seg button.on.over{background:var(--red);color:#fff}
.dz-tools{display:flex;flex-wrap:wrap;gap:4px 6px;max-height:150px;overflow:auto;border:1px solid var(--line-2);padding:6px}
.dz-tools label,.dz-deps label{display:inline-flex;align-items:center;gap:5px;font-family:var(--mono);font-size:11.5px;color:var(--ink);font-weight:500;padding:2px 4px;cursor:pointer}
.dz-tools label.w{color:#8a5a05}
.dz-deps{display:grid;gap:2px;max-height:130px;overflow:auto;border:1px solid var(--line-2);padding:6px}
.dz-deps label{font-family:Inter,sans-serif;font-size:12px}
.dz-pol{border:1px solid #d9d0f7;background:#f8f6ff;padding:10px 12px;font-size:12.5px;line-height:1.5;display:grid;gap:6px}
.dz-pol .ttl{font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--indigo);font-weight:700;display:flex;gap:6px;align-items:center}
.dz-eff{display:flex;gap:8px;align-items:center;background:var(--dark);color:#fff;padding:8px 10px;font-size:12.5px;line-height:1.4}
.dz-eff .lvl{background:#fff}
.dz-issue{display:flex;gap:10px;align-items:flex-start;padding:9px 10px;border:1px solid var(--line-2);border-left:3px solid var(--red);background:#fff;font-size:12.5px;line-height:1.45;text-align:left;width:100%;font-weight:450;min-height:0}
.dz-issue.warn{border-left-color:#ffb648}
.dz-issue.info{border-left-color:var(--indigo)}
.dz-issue:hover{background:#faf9fd}
.dz-issue svg.i{margin-top:2px;flex:none}
.dz-issue b{font-weight:650}
.dz-res{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);border-top:1px solid var(--line)}
.dz-res>section{padding:14px 16px;min-width:0}
.dz-res>section+section{border-left:1px solid var(--line)}
.dz-res h3{font-size:13px;letter-spacing:.8px;text-transform:uppercase;color:var(--muted);margin:0 0 10px;display:flex;align-items:center;gap:8px}
.dz-simlog{font-family:var(--mono);font-size:11.5px;line-height:1.55;background:#140b2f;color:#d8d0f5;padding:10px 12px;max-height:260px;overflow:auto}
.dz-simlog .l{display:grid;grid-template-columns:62px minmax(0,1fr) auto;gap:8px}
.dz-simlog .t{color:#8f84b8}
.dz-simlog .g{color:#ffcf7a}
.dz-simlog .d{color:#8f84b8}
.dz-sum{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:10px}
.dz-sum div{background:var(--indigo-50);padding:8px 10px}
.dz-sum b{display:block;font-size:18px;color:var(--indigo);letter-spacing:-.4px}
.dz-sum span{font-size:11.5px;color:var(--muted)}
.dz-vlist .list-item{padding:9px 0}
/* Policies */
.dz-steps{display:flex;align-items:stretch;gap:0;flex-wrap:wrap;border:1px solid var(--line);background:#fff}
.dz-step{flex:1;min-width:150px;padding:12px 14px;border-right:1px solid var(--line-2);position:relative}
.dz-step:last-child{border-right:0}
.dz-step .n{font-family:var(--mono);font-size:10.5px;color:var(--muted)}
.dz-step b{display:block;font-size:13.5px;margin:2px 0}
.dz-step.done{background:#f3fff8;box-shadow:inset 0 3px var(--green-ink)}
.dz-step.cur{background:#fffaf0;box-shadow:inset 0 3px #ffb648}
.dz-wf{display:flex;gap:16px;align-items:center;flex-wrap:wrap;padding:12px 14px;border:1px solid var(--line);border-top:0;background:#fbfafd}
.dz-mx{font-size:12.5px}
.dz-mx th.dm{text-align:center;min-width:64px}
.dz-mx td.c{text-align:center;padding:6px 4px}
.dz-mx td.act{min-width:220px}
.dz-mx td{padding:7px 10px}
.dz-lv{font-family:var(--mono);font-size:12px;font-weight:700;padding:3px 4px;border:1px solid currentColor;background:#fff;min-height:28px;cursor:pointer}
.dz-lv.L0{color:#6d687e}.dz-lv.L1{color:#a4233a}.dz-lv.L2{color:#8a5a05}.dz-lv.L3{color:#116539}
.dz-lv.chg{background:#fff2d8;outline:2px solid #ffb648;outline-offset:1px}
.dz-lv:disabled{cursor:not-allowed;opacity:.75}
.dz-dec{border:1px solid var(--line);padding:3px 4px;font-size:12px;min-height:28px;max-width:190px;background:#fff}
.dz-dec.chg{background:#fff2d8;outline:2px solid #ffb648}
.dz-na{color:#c9c4d6}
.dz-thr{display:grid;gap:10px}
.dz-thr .r{display:grid;grid-template-columns:120px minmax(0,1fr);gap:10px;align-items:center;font-size:13px;padding-bottom:10px;border-bottom:1px solid var(--line-2)}
.dz-thr .r:last-child{border-bottom:0;padding-bottom:0}
.dz-thr .r>b{font-size:12.5px}
.dz-thr .ctl{display:flex;gap:6px;align-items:center;flex-wrap:wrap;color:var(--muted);font-size:12.5px}
.dz-thr input,.dz-thr select{border:1px solid var(--line);padding:.3rem .45rem;font-size:13px;min-height:30px;background:#fff;width:78px;font-weight:600;color:var(--ink)}
.dz-thr select{width:auto}
.dz-thr .chg{background:#fff2d8;outline:2px solid #ffb648}
.dz-diff{display:grid;gap:6px;font-size:12.5px}
.dz-diff .d{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;padding:7px 9px;border:1px solid var(--line-2);background:#fff}
.dz-diff .arrow{font-family:var(--mono);font-weight:700;white-space:nowrap}
.dz-bt .vs{display:grid;grid-template-columns:150px minmax(0,1fr) 92px;gap:8px;align-items:center;font-size:12.5px;padding:5px 0}
.dz-bt .bars{display:grid;gap:3px}
.dz-bt .bars i{display:block;height:8px;background:#cfc9dc}
.dz-bt .bars i.d{background:var(--indigo)}
.dz-bt .vs b{text-align:right;font-variant-numeric:tabular-nums}
.dz-delta{font-weight:700;font-variant-numeric:tabular-nums}
.dz-delta.up{color:var(--red-ink)}.dz-delta.down{color:var(--green-ink)}.dz-delta.flat{color:var(--muted)}
.dz-presets{display:flex;gap:6px;flex-wrap:wrap}
/* Approvals and catalogue */
.dz-filters{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px}
.dz-filters select,.dz-filters input{border:1px solid var(--line);padding:.4rem .55rem;font-size:13px;min-height:34px;background:#fff;color:var(--ink)}
.dz-filters input{min-width:220px;flex:1;max-width:340px}
.dz-panel{position:sticky;top:110px}
.dz-lim{margin:0;padding-left:18px;font-size:12.5px;line-height:1.6}
.dz-risk{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:650;white-space:nowrap}
.dz-risk i{width:8px;height:8px;display:inline-block}
@media(max-width:1280px){.dz-design{grid-template-columns:minmax(0,1fr) 310px}.dz-meta{grid-template-columns:repeat(2,minmax(0,1fr))}.dz-meta>div:nth-child(2){border-right:0}.dz-meta>div:nth-child(-n+2){border-bottom:1px solid var(--line-2)}}
@media(max-width:1100px){.dz-wide{grid-template-columns:1fr}.dz-design{grid-template-columns:1fr}.dz-flowwrap{border-right:0;border-bottom:1px solid var(--line)}.dz-flow{max-height:520px}.dz-insp{max-height:none}.dz-res{grid-template-columns:1fr}.dz-res>section+section{border-left:0;border-top:1px solid var(--line)}.dz-panel{position:static}}
@media(max-width:760px){.dz-meta{grid-template-columns:1fr}.dz-meta>div{border-right:0;border-bottom:1px solid var(--line-2)}.dz-dbtns{margin-left:0;width:100%}.dz-dbtns button{flex:1 1 auto;justify-content:center}.dz-flow{max-height:460px}.dz-sum{grid-template-columns:repeat(2,minmax(0,1fr))}.dz-bt .vs{grid-template-columns:96px minmax(0,1fr) 70px}.dz-thr .r{grid-template-columns:1fr}.dz-step{min-width:50%;border-bottom:1px solid var(--line-2)}.dz-filters input{min-width:0;max-width:none;width:100%}.dz-simlog .l{grid-template-columns:52px minmax(0,1fr)}.dz-simlog .l .d{display:none}}
`);

  /* ================================================================
     Static design-time data (coherent with data.js and scenarios.js)
     ================================================================ */
  const LVN = { L0: 0, L1: 1, L2: 2, L3: 3 };
  const LVC = { L3: '#116539', L2: '#c8861a', L1: '#a4233a', L0: '#9b95ab' };
  const AGENT_DOMS = ['cti', 'grc', 'appsec', 'data', 'iam', 'soc'];
  const MX_DOMS = AGENT_DOMS.concat(['orch']);
  const LANES = ['ext', 'orch', 'cti', 'grc', 'appsec', 'data', 'iam', 'soc', 'trust', 'human'];
  const TIMEOUTS = ['1 min', '2 min', '5 min', '10 min', '15 min', '20 min', '30 min', '1 h', '4 h', '24 h'];
  const DECIDERS = ['p-elena', 'p-chloe', 'p-mei', 'p-marc', 'p-lucas', 'p-amira', 'p-ines', 'p-hugo', 'p-sara', 'p-tom', 'p-jonas'];
  /* Median decision time of each decision holder over 90 days (minutes, business hours). */
  const P50 = { 'p-elena': 9, 'p-chloe': 4, 'p-mei': 6, 'p-marc': 12, 'p-lucas': 18, 'p-amira': 45, 'p-ines': 60, 'p-hugo': 12, 'p-sara': 30, 'p-tom': 10, 'p-jonas': 40 };
  const GATE_TO = { 'p-elena': '20 min', 'p-chloe': '10 min', 'p-mei': '15 min', 'p-marc': '1 h', 'p-lucas': '30 min', 'p-amira': '4 h', 'p-ines': '4 h', 'p-hugo': '15 min', 'p-sara': '4 h', 'p-tom': '15 min', 'p-jonas': '1 h' };
  /* Highest autonomy level an agent's manifest allows (Build). Operate can lower it live. */
  const CEIL = { 'ag-cti-analyst': 'L3', 'ag-soc-triage': 'L3', 'ag-iam-resp': 'L3', 'ag-grc-tprm': 'L2', 'ag-vuln': 'L3' };
  /* Platform services every agent can call: not checked against agent manifests. */
  const NATIVE = ['graph', 'lake', 'orchestrator', 'policy', 'sandbox', 'case', 'audit', 'eval', 'doc'];
  const THR_LABEL = { blast: 'Blast radius', reversibility: 'Reversibility', confidence: 'Confidence', exposure: 'Exposure', money: 'Money', novelty: 'Novelty' };

  /* Tool & action catalogue: generic names, no product names. */
  const T = (id, dom, mode, risk, rev, rb, lvl, exec, conn, calls, pol, d, guard) => ({ id, dom, mode, risk, rev, rb, lvl, exec, conn, calls, pol, d, guard: guard || [] });
  const TOOLS = [
    T('graph.query', 'orch', 'read', 'low', 'n/a', 'Read only', 'L3', 'Agent (read scope)', 'Security graph', 186400, 0, 'Query assets, identities, suppliers, exposures and owners in the cyber security graph.', ['Row-level access by agent domain', 'Max 5,000 nodes per answer']),
    T('lake.search', 'orch', 'read', 'low', 'n/a', 'Read only', 'L3', 'Agent (read scope)', 'Cyber data lake', 74210, 0, 'Search logs, past cases and evidence in the cyber data lake (90 days hot, 2 years cold).', ['PII masked unless the case has a legal basis', 'Max 30 days per query for L3 agents']),
    T('lake.backtest', 'soc', 'read', 'low', 'n/a', 'Read only', 'L3', 'Agent (read scope)', 'Cyber data lake', 1820, 0, 'Replay a detection rule on 30 days of logs and report hits and noise.', ['Noise budget: 5 alerts per day per rule']),
    T('cti.feeds.read', 'cti', 'read', 'low', 'n/a', 'Read only', 'L3', 'Agent (read scope)', 'CTI feeds (MCP)', 41200, 0, 'Read national CERT, ISAC and commercial threat feeds, normalised to STIX.', []),
    T('cmdb.read', 'data', 'read', 'low', 'n/a', 'Read only', 'L3', 'Agent (read scope)', 'CMDB (API)', 9310, 0, 'Read configuration items, owners and business services.', []),
    T('collab.audit', 'data', 'read', 'low', 'n/a', 'Read only', 'L3', 'Agent (read scope)', 'Collaboration suite (API)', 6120, 0, 'Read sharing and download audit events on the collaboration suite.', ['File content never leaves the tenant']),
    T('edr.query', 'soc', 'read', 'low', 'n/a', 'Read only', 'L3', 'Agent (read scope)', 'EDR (API)', 22870, 0, 'Query endpoint telemetry: processes, network, files.', []),
    T('vuln.scan', 'soc', 'read', 'medium', 'n/a', 'Read only', 'L3', 'Secure executor', 'Vulnerability scanner (API)', 1140, 0, 'Run an authenticated scan on named assets.', ['No scan of payment hosts during cut-off windows']),
    T('orchestrator.plan', 'orch', 'read', 'low', 'n/a', 'Read only', 'L3', 'Orchestrator', 'Orchestrator control plane', 2410, 0, 'Split a case into tasks and assign them to agents.', []),
    T('policy.check', 'orch', 'read', 'low', 'n/a', 'Read only', 'L3', 'Orchestrator', 'Policy engine', 9870, 0, 'Evaluate decision rights and thresholds for a proposed action.', ['Fail closed: no answer means escalate']),
    T('sandbox.replay', 'orch', 'read', 'low', 'n/a', 'Read only', 'L3', 'Orchestrator', 'Digital twin sandbox', 1290, 0, 'Replay real traffic or an attack chain against a twin before touching production.', []),
    T('eval.run', 'trust', 'read', 'low', 'n/a', 'Read only', 'L3', 'Orchestrator', 'Eval harness', 860, 0, 'Run an evaluation suite against an agent version.', []),
    T('case.open', 'orch', 'write', 'low', 'instant', 'Merge or close the case', 'L3', 'Orchestrator', 'Case management', 3120, 0, 'Open a case and attach the triggering evidence.', []),
    T('case.update', 'orch', 'write', 'low', 'instant', 'Previous state kept in history', 'L3', 'Orchestrator', 'Case management', 28400, 0, 'Update status, severity, summary or owner of a case.', []),
    T('audit.write', 'orch', 'write', 'low', 'none', 'Append-only by design', 'L3', 'Orchestrator', 'Audit trail (append-only)', 41800, 0, 'File decisions, actions and evidence in the immutable audit trail.', ['Hash-chained, 10-year retention']),
    T('doc.generate', 'grc', 'write', 'low', 'instant', 'Draft only, never sent', 'L3', 'Agent (write scope)', 'Document service', 2340, 0, 'Draft a report, letter or evidence pack (stays a draft).', []),
    T('orchestrator.escalate', 'orch', 'write', 'low', 'instant', 'Withdraw the request', 'L3', 'Orchestrator', 'Human-in-the-loop service', 412, 0, 'Ask the decision holder through inbox, mobile push or phone, with deadline and fallback.', ['Phone call if no answer at half the timeout']),
    T('proxy.block', 'soc', 'write', 'low', 'instant', 'Unblock in one call', 'L3', 'Secure executor', 'Proxy (API)', 1860, 1, 'Block an IP address or a domain at the web proxy.', ['Never block shared hosting or CDN ranges (graph check)', 'Auto-expiry after 30 days']),
    T('mail.quarantine', 'soc', 'write', 'low', 'instant', 'Release from quarantine (30 days)', 'L3', 'Secure executor', 'Mail gateway (API)', 2210, 1, 'Quarantine messages of a campaign in every mailbox.', ['Up to 5,000 messages per call']),
    T('idp.sessions.revoke', 'iam', 'write', 'low', 'instant', 'User signs in again', 'L3', 'Secure executor', 'Identity provider (MCP)', 940, 2, 'Revoke sessions and refresh tokens and force re-authentication.', ['50 users per call', 'Executives: notify their Business CISO']),
    T('idp.device.block', 'iam', 'write', 'low', 'instant', 'Unblock the device', 'L3', 'Secure executor', 'Identity provider (MCP)', 310, 2, 'Block a device from signing in.', []),
    T('idp.mfa.reregister', 'iam', 'write', 'medium', 'minutes', 'Helpdesk restores the factor', 'L2', 'Secure executor', 'Identity provider (MCP)', 128, 2, 'Force a user to register MFA again (phishing-resistant method).', []),
    T('mail.rules.delete', 'iam', 'write', 'medium', 'minutes', 'Restore from the evidence copy', 'L2', 'Secure executor', 'Mail system (API)', 64, 2, 'Delete a malicious inbox or forwarding rule, keeping a copy as evidence.', []),
    T('idp.account.disable', 'iam', 'write', 'high', 'minutes', 'Re-enable (business continuity check)', 'L1', 'Secure executor', 'Identity provider (MCP)', 14, 7, 'Disable a privileged or executive account.', ['Never the last break-glass account']),
    T('vault.secret.rotate', 'iam', 'write', 'high', 'manual', 'Dependent apps must be redeployed', 'L1', 'Secure executor', 'Secrets vault (API)', 22, 7, 'Rotate a credential, key or certificate shared with a third party.', ['Dependency map checked in the graph first']),
    T('iga.review.open', 'iam', 'write', 'low', 'instant', 'Cancel the campaign', 'L3', 'Agent (write scope)', 'IGA (API)', 41, 0, 'Open an access review campaign for a set of entitlements.', []),
    T('iga.access.remove', 'iam', 'write', 'medium', 'minutes', 'Re-grant the entitlement', 'L1', 'Secure executor', 'IGA (API)', 1310, 7, 'Remove an entitlement after the manager confirms.', []),
    T('payments.hold', 'iam', 'write', 'critical', 'minutes', 'Release the held payments', 'L1', 'Secure executor + dual control', 'Payment hub (API)', 2, 10, 'Hold outgoing payments in the cut-off queue.', ['Dual control with Treasury', 'Never cancels a payment, only holds it']),
    T('siem.rule.deploy', 'soc', 'write', 'medium', 'minutes', 'Disable the rule', 'L2', 'Secure executor', 'SIEM (API)', 118, 3, 'Deploy a detection rule after a 30-day backtest.', ['Backtest mandatory', 'Noise budget enforced']),
    T('edr.collect_triage', 'soc', 'read', 'medium', 'n/a', 'Read only (touches a production host)', 'L2', 'Secure executor', 'EDR (API)', 42, 0, 'Collect a forensic triage package from a host.', ['CPU cap 10% on production hosts']),
    T('edr.kill_process', 'soc', 'write', 'medium', 'instant', 'Process can be restarted', 'L2', 'Secure executor', 'EDR (API)', 87, 1, 'Kill a process and block its hash fleet-wide.', ['Never on signed system binaries']),
    T('edr.isolate_host', 'soc', 'write', 'critical', 'minutes', 'Release isolation', 'L1', 'Secure executor', 'EDR (API)', 6, 9, 'Isolate a host from the network (EDR channel kept).', ['Production servers: decision of the CISO']),
    T('waf.deploy_rule', 'appsec', 'write', 'high', 'minutes', 'Rollback point taken before deploy', 'L2', 'Secure executor', 'WAF (API)', 46, 4, 'Deploy a virtual patch on the WAF, in detect or block mode.', ['Sandbox replay of 7 days with 0 false positive for block mode', 'Expiry 7 to 14 days']),
    T('waf.tune_rule', 'appsec', 'write', 'medium', 'minutes', 'Rollback point taken before deploy', 'L2', 'Secure executor', 'WAF (API)', 212, 4, 'Tune an existing WAF rule to reduce false positives.', []),
    T('fw.restrict_flow', 'grc', 'write', 'high', 'minutes', 'Restore the previous rule set', 'L2', 'Secure executor', 'Firewall manager (API)', 9, 5, 'Move a third-party flow to a quarantine zone or restrict it.', ['Business CISO informed in real time']),
    T('itsm.change.create', 'soc', 'write', 'low', 'instant', 'Cancel the change', 'L3', 'Agent (write scope)', 'ITSM (API)', 642, 0, 'Raise a standard or emergency change.', []),
    T('vuln.patch.apply', 'soc', 'write', 'critical', 'manual', 'Uninstall the patch (manual)', 'L1', 'Secure executor', 'Patch management (API)', 11, 8, 'Apply a vendor patch outside the change window.', ['Tested in the sandbox first', 'Partners warned 10 min before']),
    T('collab.sharing.revoke', 'data', 'write', 'medium', 'instant', 'Re-share the link', 'L2', 'Secure executor', 'Collaboration suite (API)', 318, 1, 'Revoke public or external sharing links on files.', ['Owner notified with the reason']),
    T('tprm.questionnaire.update', 'grc', 'write', 'low', 'instant', 'Previous version kept', 'L3', 'Agent (write scope)', 'TPRM platform (API)', 96, 0, 'Add or change questions of a supplier questionnaire.', []),
    T('portal.send', 'grc', 'external', 'high', 'none', 'Cannot be unsent: correction message only', 'L1', 'Secure executor', 'Supplier portal', 212, 6, 'Send a message or questionnaire to third parties on behalf of the group.', ['Validated template or human validation', 'Max 25 recipients per batch']),
    T('learning.assign', 'grc', 'external', 'low', 'instant', 'Withdraw the module', 'L2', 'Agent (write scope)', 'Learning platform (API)', 31, 0, 'Assign a micro-training module to a cohort of staff.', ['500 staff maximum', 'Anonymised case only']),
    T('regulator.submit', 'grc', 'external', 'critical', 'none', 'Cannot be withdrawn: amendment only', 'L0', 'Human only (agent prepares)', 'Supervisor portal (manual upload)', 5, 11, 'Submit evidence or a notification to a supervisor.', ['Human uploads; the agent never holds portal credentials']),
    T('agent.set_level', 'orch', 'write', 'high', 'instant', 'Restore the previous level', 'L1', 'Orchestrator', 'Orchestrator control plane', 3, 12, 'Change the autonomy level of an agent (kill-switch).', ['Any Run supervisor, immediate in emergency']),
    T('agent.promote', 'orch', 'write', 'high', 'minutes', 'Automatic rollback to the previous version', 'L1', 'Orchestrator', 'Orchestrator control plane', 19, 13, 'Promote an agent version to canary or production.', ['Evals and Trust & Challenge sign-off attached'])
  ];
  const tool = (id) => TOOLS.find((t) => t.id === id);
  const RISK_C = { low: '#116539', medium: '#c8861a', high: '#e0662b', critical: '#a4233a' };

  /* Playbook catalogue. Four are recorded as scenarios, four are designed statically. */
  const PBS = [
    { id: 'pb-cti', name: 'CTI advisory on a supplier product', scenario: 'cti', trigger: 'CTI advisory: exploited CVE on a product present in the graph (internal assets or third parties)', domains: ['cti', 'appsec', 'soc', 'grc'], runs: 23, median: '4 h 10', dpr: 1.9, edit: ['Thu 8 Oct', 'p-ines'], version: '3.2', status: 'live', owner: 'p-ines', slo: 'Protected in under 1 h, suppliers cleared in under 24 h',
      versions: [['3.2', 'Thu 8 Oct', 'p-ines', 'Phone escalation for critical suppliers after 12 h without answer'], ['3.1', 'Tue 15 Sep', 'p-ines', 'Quick forensic added when the backtest finds a historical hit'], ['3.0', 'Mon 3 Aug', 'p-raj', 'Virtual patch moved from L1 to L2 after 60 days of 0 false positive']],
      lastRuns: [['C-2244', 'Thu 24 Sep', '3 h 52', 2, 'closed'], ['C-2219', 'Fri 11 Sep', '5 h 06', 2, 'closed'], ['C-2190', 'Tue 25 Aug', '2 h 41', 1, 'closed']] },
    { id: 'pb-identity', name: 'Identity compromise of a privileged user', scenario: 'identity', trigger: 'Identity provider: high-risk sign-in on a privileged or payment identity (MFA fatigue, token theft, impossible travel)', domains: ['iam', 'soc', 'data', 'grc'], runs: 61, median: '7 min', dpr: 0.8, edit: ['Mon 5 Oct', 'p-ines'], version: '4.0', status: 'live', owner: 'p-ines', slo: 'Contained in under 15 min, day or night',
      versions: [['4.0', 'Mon 5 Oct', 'p-ines', 'Payment hold decided by the Head of Treasury, CISO in the loop'], ['3.4', 'Wed 9 Sep', 'p-mei', 'Data touched before containment measured automatically (GDPR clock)'], ['3.3', 'Thu 20 Aug', 'p-ines', 'Session revocation raised to L3 after a 60-day canary']],
      lastRuns: [['C-2286', 'Mon 12 Oct', '6 min', 0, 'closed'], ['C-2271', 'Fri 9 Oct', '9 min', 1, 'closed'], ['C-2258', 'Tue 6 Oct', '5 min', 0, 'closed']] },
    { id: 'pb-regulator', name: 'Supervisory request', scenario: 'regulator', trigger: 'Letter from a supervisor uploaded by Engage or received on the regulator portal', domains: ['grc', 'data'], runs: 4, median: '2 d', dpr: 1, edit: ['Wed 30 Sep', 'p-raj'], version: '1.3', status: 'live', owner: 'p-raj', slo: 'Pack ready 3 business days before the deadline',
      versions: [['1.3', 'Wed 30 Sep', 'p-raj', 'Supplier data requests covered by standing approval SA-07'], ['1.2', 'Mon 6 Jul', 'p-raj', 'Gap analysis before submission'], ['1.0', 'Tue 12 May', 'p-raj', 'First version from the 2025 inspection']],
      lastRuns: [['C-2201', 'Mon 31 Aug', '2 d 3 h', 1, 'closed'], ['C-2133', 'Wed 15 Jul', '1 d 6 h', 1, 'closed']] },
    { id: 'pb-drift', name: 'Agent deviation', scenario: 'drift', trigger: 'Deviation hunt: an agent KPI leaves its baseline band (auto-close rate, latency, tool mix) without a release explaining it', domains: ['soc', 'trust'], runs: 7, median: '20 min', dpr: 2, edit: ['Fri 9 Oct', 'p-jonas'], version: '2.1', status: 'live', owner: 'p-jonas', slo: 'Contained in under 30 min, fix proven before autonomy is restored',
      versions: [['2.1', 'Fri 9 Oct', 'p-jonas', 'Rollback journal replays the last 48 h of decisions of the agent'], ['2.0', 'Thu 17 Sep', 'p-jonas', 'Autonomy restored step by step through a canary']],
      lastRuns: [['C-2263', 'Thu 8 Oct', '1 h 12', 1, 'closed'], ['DV-31', 'Thu 1 Oct', '35 min', 1, 'closed']] },
    { id: 'pb-ransom', name: 'Ransomware precursor', trigger: 'EDR: shadow copy deletion, credential dumping or known pre-ransomware tooling on a server', domains: ['soc', 'iam', 'grc'], runs: 9, median: '11 min', dpr: 1.3, edit: ['Fri 2 Oct', 'p-ines'], version: '2.4', status: 'live', owner: 'p-ines', slo: 'Precursor contained before encryption, under 15 min',
      versions: [['2.4', 'Fri 2 Oct', 'p-ines', 'Backups snapshotted offline before isolation'], ['2.3', 'Mon 7 Sep', 'p-yuki', 'Lateral movement hunt widened to 7 days']],
      lastRuns: [['C-2277', 'Sat 10 Oct', '13 min', 1, 'closed'], ['C-2240', 'Tue 22 Sep', '9 min', 2, 'closed']] },
    { id: 'pb-saas', name: 'Data leak on a SaaS', trigger: 'DLP: public link or mass external sharing of classified files on a collaboration SaaS', domains: ['data', 'iam', 'grc'], runs: 0, shadow: 5, median: 'n/a', dpr: 0, edit: ['Tue 13 Oct', 'p-raj'], version: '0.4', status: 'draft', owner: 'p-raj', slo: 'Public exposure closed in under 10 min, DPO decision in under 24 h',
      versions: [['0.4', 'Tue 13 Oct', 'p-raj', 'Draft: DPO gate added, legacy mailbox step not yet removed'], ['0.3', 'Thu 1 Oct', 'p-raj', 'Shadow runs on 5 real events (no action taken)']],
      lastRuns: [['SH-05', 'Mon 12 Oct', 'shadow', 1, 'monitoring'], ['SH-04', 'Wed 7 Oct', 'shadow', 1, 'monitoring']] },
    { id: 'pb-vuln', name: 'New critical vulnerability on internet-facing assets', trigger: 'Scanner or CTI: CVSS 9.0 or more, or listed as exploited, on an internet-facing asset', domains: ['cti', 'soc', 'appsec'], runs: 37, median: '2 h 40', dpr: 0.6, edit: ['Tue 29 Sep', 'p-yuki'], version: '5.1', status: 'live', owner: 'p-yuki', slo: 'Virtual patch in under 2 h, patched in under 72 h',
      versions: [['5.1', 'Tue 29 Sep', 'p-yuki', 'Standard change raised in parallel with the virtual patch'], ['5.0', 'Wed 2 Sep', 'p-yuki', 'Emergency patch only when exploited in the wild']],
      lastRuns: [['C-2282', 'Mon 12 Oct', '2 h 05', 0, 'closed'], ['C-2266', 'Wed 7 Oct', '3 h 18', 1, 'closed'], ['C-2251', 'Thu 1 Oct', '1 h 54', 0, 'closed']] },
    { id: 'pb-supplier', name: 'Supplier breach notification', trigger: 'A third party notifies a security incident (portal, email) or CTI reports one', domains: ['grc', 'cti', 'iam'], runs: 6, median: '1 d 4 h', dpr: 2.3, edit: ['Wed 7 Oct', 'p-raj'], version: '1.7', status: 'testing', owner: 'p-raj', slo: 'Exposure known in under 2 h, credentials rotated in under 4 h',
      versions: [['1.7', 'Wed 7 Oct', 'p-raj', 'Shadow mode: credential rotation added'], ['1.6', 'Mon 14 Sep', 'p-marc', 'Incident questionnaire template v2']],
      lastRuns: [['C-2279', 'Fri 9 Oct', '1 d 2 h', 2, 'monitoring'], ['C-2230', 'Mon 21 Sep', '1 d 9 h', 3, 'closed']] }
  ];

  /* Wiring of the recorded scenarios into a flow (parallel branches).
     A dependency on a step that has a gate means "after the gate". */
  const WIRING = {
    cti: { 'cti-4': ['cti-3'], 'cti-5': ['cti-3'], 'cti-6': ['cti-5'], 'cti-7': ['cti-3'], 'cti-8': ['cti-3'], 'cti-9': ['cti-8'], 'cti-10': ['cti-7'], 'cti-11': ['cti-4', 'cti-6'], 'cti-12': ['cti-9', 'cti-10', 'cti-11'] },
    identity: { 'id-4': ['id-3'], 'id-5': ['id-2'], 'id-6': ['id-3'], 'id-7': ['id-3', 'id-6'], 'id-8': ['id-6'], 'id-9': ['id-7'], 'id-10': ['id-9'], 'id-11': ['id-4', 'id-5', 'id-8', 'id-10'] },
    regulator: { 'rg-5': ['rg-4'], 'rg-6': ['rg-4'], 'rg-7': ['rg-3', 'rg-5'], 'rg-8': ['rg-7'], 'rg-9': ['rg-8'] },
    drift: { 'dr-4': ['dr-3'], 'dr-5': ['dr-2'], 'dr-6': ['dr-5'], 'dr-7': ['dr-6'], 'dr-8': ['dr-7'], 'dr-9': ['dr-8', 'dr-4'] }
  };
  /* Decision-rights row (CP.data.rights index) that governs each step. */
  const POLICY = {
    'cti-1': 0, 'cti-2': 0, 'cti-3': 0, 'cti-4': 4, 'cti-5': 3, 'cti-6': 0, 'cti-7': 6, 'cti-8': 8, 'cti-9': 8, 'cti-10': 5, 'cti-11': 0, 'cti-12': 0,
    'id-1': 0, 'id-2': 0, 'id-3': 2, 'id-4': 2, 'id-5': 1, 'id-6': 0, 'id-7': 10, 'id-8': 11, 'id-9': 0, 'id-11': 0,
    'rg-1': 0, 'rg-2': 0, 'rg-3': 0, 'rg-4': 0, 'rg-5': 6, 'rg-6': 0, 'rg-7': 11, 'rg-8': 11, 'rg-9': 0,
    'dr-1': 0, 'dr-3': 12, 'dr-4': 2, 'dr-7': 13, 'dr-8': 13, 'dr-9': 0
  };
  /* Thresholds that put a human in the loop at each gate. */
  const THR = { 'cti-7': ['exposure'], 'cti-8': ['blast', 'reversibility'], 'id-7': ['money', 'blast'], 'id-8': ['exposure'], 'rg-8': ['exposure'], 'dr-7': ['novelty'], 'rg-5': ['exposure'] };
  /* Tools per step: derived from the architecture flow, refined where the flow is too coarse. */
  const FLOW_TOOL = { 'ctx-graph': 'graph.query', 'ctx-lake': 'lake.search', 'or-sandbox': 'sandbox.replay', 'or-hitl': 'orchestrator.escalate', 'sys-waf': 'waf.deploy_rule', 'sys-siem': 'siem.rule.deploy', 'sys-edr': 'edr.collect_triage', 'it-itsm': 'itsm.change.create', 'sys-vuln': 'vuln.patch.apply', 'it-entra': 'idp.sessions.revoke', 'it-m365': 'mail.rules.delete', 'sys-proxy': 'proxy.block', 'sys-fw': 'fw.restrict_flow', 'out-tp': 'portal.send', 'it-cmdb': 'cmdb.read', 'out-cti': 'cti.feeds.read', 'or-kill': 'agent.set_level', 'ai-eval': 'eval.run', 'or-plan': 'orchestrator.plan', 'or-policy': 'policy.check' };
  const TOOLS_OVR = {
    'cti-1': ['cti.feeds.read', 'case.open'], 'cti-3': ['orchestrator.plan', 'policy.check'], 'cti-5': ['lake.backtest', 'siem.rule.deploy'], 'cti-7': ['tprm.questionnaire.update', 'graph.query', 'portal.send'], 'cti-8': ['sandbox.replay', 'vuln.patch.apply'], 'cti-9': ['itsm.change.create', 'vuln.patch.apply'], 'cti-11': ['sandbox.replay'], 'cti-12': ['audit.write', 'case.update'],
    'id-1': ['case.open'], 'id-3': ['idp.sessions.revoke', 'idp.device.block'], 'id-5': ['lake.search', 'proxy.block', 'idp.mfa.reregister'], 'id-6': ['collab.audit', 'graph.query'], 'id-7': ['idp.account.disable', 'payments.hold'], 'id-8': ['lake.search', 'doc.generate'], 'id-9': ['graph.query', 'iga.review.open'], 'id-10': ['learning.assign'], 'id-11': ['audit.write', 'case.update'],
    'rg-1': ['case.open'], 'rg-2': ['graph.query', 'doc.generate'], 'rg-5': ['portal.send'], 'rg-6': ['case.update'], 'rg-7': ['doc.generate', 'lake.search'], 'rg-8': ['regulator.submit'], 'rg-9': ['lake.search'],
    'dr-1': ['eval.run'], 'dr-2': ['lake.search'], 'dr-3': ['agent.set_level'], 'dr-4': ['case.update', 'idp.sessions.revoke'], 'dr-5': ['sandbox.replay', 'eval.run'], 'dr-6': ['eval.run', 'sandbox.replay'], 'dr-7': ['agent.promote'], 'dr-8': ['agent.promote', 'agent.set_level'], 'dr-9': ['audit.write']
  };

  /* Statically designed playbooks. */
  const N = (id, lane, who, title, level, dur, after, o) => Object.assign({ id, lane, who, title, level, dur, after, tools: [], policy: 0, thr: [] }, o || {});
  const G = (id, decider, title, after, policy, fallback, o) => Object.assign({ id, kind: 'gate', lane: 'human', who: decider, decider, title, level: 'L1', after, policy, fallback, dur: P50[decider] * 60, thr: [], tools: ['orchestrator.escalate'] }, o || {});
  const STATIC = {
    'pb-ransom': [
      N('r1', 'ext', 'edr', 'EDR alert: shadow copy deletion on a file server', 'L3', 0, [], { tools: ['case.open'] }),
      N('r2', 'soc', 'ag-soc-triage', 'Triage with graph context (host role, users, backups)', 'L3', 40, ['r1'], { tools: ['graph.query', 'edr.query'] }),
      N('r3', 'orch', 'orchestrator', 'Plan containment, check decision rights', 'L3', 20, ['r2'], { tools: ['orchestrator.plan', 'policy.check'] }),
      N('r4', 'soc', 'ag-soc-forensic', 'Kill the process, block its hash fleet-wide', 'L2', 60, ['r3'], { tools: ['edr.kill_process'], policy: 1 }),
      N('r5', 'iam', 'ag-iam-resp', 'Revoke sessions of the account used, rotate it', 'L3', 45, ['r3'], { tools: ['idp.sessions.revoke'], policy: 2 }),
      N('r6', 'soc', 'ag-soc-hunt', 'Hunt lateral movement on 7 days of logs', 'L2', 300, ['r3'], { tools: ['lake.search', 'edr.query'] }),
      N('r7', 'soc', 'ag-soc-forensic', 'Prepare host isolation (1,900 users on the share)', 'L1', 30, ['r4'], { tools: ['edr.isolate_host'], policy: 9, thr: ['blast'] }),
      G('g-r7', 'p-elena', 'Isolate the file server now?', ['r7'], 9, 'Keep the host online with process blocking, snapshot backups offline, SOC on a 15-minute watch.', { thr: ['blast'] }),
      N('r8', 'soc', 'ag-soc-forensic', 'Isolate the host, snapshot backups offline', 'L2', 90, ['g-r7'], { tools: ['edr.isolate_host'], policy: 9 }),
      N('r9', 'grc', 'ag-grc-controls', 'Check DORA major-incident criteria', 'L1', 240, ['r6'], { tools: ['lake.search', 'doc.generate'], policy: 11 }),
      N('r10', 'human', 'p-tom', 'Crisis manager briefed (crisis cell if more than 1 host)', 'L0', 300, ['r9'], { tools: [] }),
      N('r11', 'orch', 'orchestrator', 'Close or escalate to the crisis cell', 'L3', 30, ['r8', 'r5', 'r10'], { tools: ['case.update', 'audit.write'] })
    ],
    'pb-saas': [
      N('s1', 'ext', 'dlp', 'DLP event: 214 classified files shared by public link', 'L3', 0, [], { wl: 'DLP signal', tools: ['case.open'] }),
      N('s2', 'data', 'ag-dt-dlp', 'Classify the files and identify data subjects', 'L2', 120, ['s1'], { tools: ['collab.audit', 'graph.query'] }),
      N('s3', 'data', 'ag-dt-dlp', 'Revoke public links on the 214 files', 'L3', 30, ['s2'], { tools: ['collab.sharing.revoke'], policy: null }),
      N('s4', 'iam', 'ag-iam-resp', "Check the owner's account for compromise", 'L3', 60, ['s1'], { tools: ['graph.query', 'lake.search'] }),
      N('s5', 'data', 'ag-dt-dlp', 'Count external downloads per file', 'L2', 90, ['s3'], { tools: ['collab.audit'] }),
      G('g-s5', 'p-sara', 'Notify the data protection authority?', ['s5'], 11, '', { thr: ['exposure'] }),
      N('s6', 'grc', 'ag-grc-controls', 'Draft the breach notification (72 h clock)', 'L1', 900, ['g-s5'], { tools: ['doc.generate', 'regulator.submit'], policy: 11 }),
      N('s7', 'human', 'p-lucas', 'Inform the data owner and the manager', 'L0', 600, ['s3'], { tools: [] }),
      N('s8', 'grc', 'ag-grc-policy', 'Legacy step: email the DPO mailbox', 'L1', 60, [], { tools: ['doc.generate'], col: 3 })
    ],
    'pb-vuln': [
      N('v1', 'ext', 'cti-feed', 'Critical CVE published, listed as exploited', 'L3', 0, [], { tools: ['cti.feeds.read'] }),
      N('v2', 'cti', 'ag-cti-analyst', 'Match product versions in the graph', 'L3', 30, ['v1'], { tools: ['graph.query'] }),
      N('v3', 'soc', 'ag-vuln', 'Confirm with an authenticated scan', 'L3', 1200, ['v2'], { tools: ['vuln.scan'] }),
      N('v4', 'orch', 'orchestrator', 'Plan: virtual patch, detection, patch', 'L3', 20, ['v3'], { tools: ['orchestrator.plan', 'policy.check'] }),
      N('v5', 'appsec', 'ag-as-waf', 'Virtual patch after a sandbox replay', 'L2', 600, ['v4'], { tools: ['sandbox.replay', 'waf.deploy_rule'], policy: 4 }),
      N('v6', 'soc', 'ag-soc-detect', 'Detection for exploit attempts', 'L2', 900, ['v4'], { tools: ['lake.backtest', 'siem.rule.deploy'], policy: 3 }),
      N('v7', 'soc', 'ag-vuln', 'Standard change in the next window', 'L3', 120, ['v4'], { tools: ['itsm.change.create'] }),
      N('v8', 'soc', 'ag-vuln', 'Emergency patch prepared (if exploited in the wild)', 'L1', 1800, ['v4'], { tools: ['sandbox.replay', 'vuln.patch.apply'], policy: 8, thr: ['blast', 'reversibility'] }),
      G('g-v8', 'p-elena', 'Patch outside the change window?', ['v8'], 8, 'Patch in the next change window; the virtual patch stays in block mode.', { thr: ['blast', 'reversibility'] }),
      N('v9', 'soc', 'ag-vuln', 'Patch applied, rescan clean', 'L2', 1500, ['g-v8', 'v7'], { tools: ['vuln.patch.apply', 'vuln.scan'], policy: 8 }),
      N('v10', 'orch', 'orchestrator', 'Close the case, exposure KPI updated', 'L3', 30, ['v9', 'v5', 'v6'], { tools: ['case.update', 'audit.write'] })
    ],
    'pb-supplier': [
      N('t1', 'ext', 'thirdparty', 'Supplier notifies a security incident', 'L3', 0, [], { tools: ['case.open'] }),
      N('t2', 'grc', 'ag-grc-tprm', 'Identify contracts, data shared, critical functions', 'L2', 300, ['t1'], { tools: ['graph.query'] }),
      N('t3', 'cti', 'ag-cti-analyst', 'Search CTI and leak sites for the supplier', 'L3', 600, ['t1'], { tools: ['cti.feeds.read', 'lake.search'] }),
      N('t4', 'iam', 'ag-iam-resp', 'Rotate credentials and keys shared with the supplier', 'L2', 1800, ['t2'], { tools: ['vault.secret.rotate'], policy: 7 }),
      N('t5', 'grc', 'ag-grc-tprm', "Prepare restriction of the supplier's flows", 'L1', 120, ['t2'], { tools: ['fw.restrict_flow'], policy: 5, thr: ['blast'] }),
      G('g-t5', 'p-lucas', "Restrict the supplier's flows?", ['t5'], 5, "Flows stay open with enhanced monitoring on the supplier's accounts and files.", { thr: ['blast'] }),
      N('t6', 'grc', 'ag-grc-tprm', 'Move flows to the quarantine zone', 'L2', 120, ['g-t5'], { tools: ['fw.restrict_flow'], policy: 5 }),
      N('t7', 'grc', 'ag-grc-tprm', 'Incident questionnaire to the supplier', 'L1', 600, ['t2'], { tools: ['tprm.questionnaire.update', 'portal.send'], policy: 6, thr: ['exposure'] }),
      G('g-t7', 'p-marc', 'Send the incident questionnaire?', ['t7'], 6, 'The TPRM lead edits the draft; reminder to the agent in 1 hour.', { thr: ['exposure'] }),
      N('t8', 'grc', 'ag-grc-controls', 'Assess DORA register impact and notification duty', 'L1', 3600, ['t2'], { tools: ['lake.search', 'doc.generate'], policy: 11 }),
      N('t9', 'orch', 'orchestrator', 'Track remediation, lift restriction on evidence', 'L3', 86400, ['t6', 'g-t7', 't8', 't3', 't4'], { tools: ['case.update', 'audit.write'] })
    ]
  };

  /* Standing approvals: pre-approved classes of actions. */
  const SA_SEED = [
    { id: 'SA-07', title: 'Supplier data requests from the DORA register template', agent: 'ag-grc-tprm', tool: 'portal.send', pol: 6, holder: 'p-marc', scope: 'Pre-filled requests to ICT providers to complete register data (sub-contracting chain, locations, exit-plan contacts) through the supplier portal.', limits: ['Template TPL-DORA-ROI v3 only, no free text', 'Up to 25 providers per batch', 'Deadline of 10 business days or more', 'No attachment, no contractual statement'], granted: 'Mon 6 Jul 2026', expDays: 79, uses: 41, last: 'Mon 21 Sep 09:12', status: 'active', scn: 'regulator', review: 'Quarterly by Trust & Challenge' },
    { id: 'SA-04', title: 'Block indicators from the national CERT feed at the proxy', agent: 'ag-soc-triage', tool: 'proxy.block', pol: 1, holder: 'p-chloe', scope: 'Block IP addresses and domains published by the national CERT or the financial ISAC.', limits: ['Confidence 90% or more', 'No shared hosting or CDN range (graph check)', 'Block expires after 30 days'], granted: 'Mon 2 Mar 2026', expDays: 140, uses: 1214, last: 'Tue 06:48', status: 'active', review: 'Monthly sample of 5% by Run quality' },
    { id: 'SA-09', title: 'Revoke sessions for up to 50 users in one action', agent: 'ag-iam-resp', tool: 'idp.sessions.revoke', pol: 2, holder: 'p-mei', scope: 'Bulk session revocation when a campaign compromises several accounts.', limits: ['50 users maximum per action', 'Executives and payment approvers: their Business CISO is notified', 'No account disablement under this approval'], granted: 'Thu 2 Jul 2026', expDays: 48, uses: 63, last: 'Tue 03:14', status: 'active', review: 'Quarterly by Trust & Challenge' },
    { id: 'SA-11', title: 'Quarantine a confirmed phishing campaign in every mailbox', agent: 'ag-soc-triage', tool: 'mail.quarantine', pol: 1, holder: 'p-chloe', scope: 'Pull every copy of a confirmed phishing message from all mailboxes.', limits: ['Campaign confirmed by 2 independent signals', 'Up to 5,000 messages', 'Release possible for 30 days'], granted: 'Wed 15 Jul 2026', expDays: 94, uses: 88, last: 'Tue 08:05', status: 'active', review: 'Monthly sample by Run quality' },
    { id: 'SA-12', title: 'WAF virtual patch in block mode after a 0 false-positive replay', agent: 'ag-as-waf', tool: 'waf.deploy_rule', pol: 4, holder: 'p-chloe', scope: 'Virtual patches on web applications other than payment initiation.', limits: ['Sandbox replay of 7 days with 0 false positive', 'Not on payment initiation apps', 'Rule expires after 14 days unless renewed'], granted: 'Sun 19 Apr 2026', expDays: 5, uses: 17, last: 'Mon 22:10', status: 'active', review: 'Each rule reviewed by AppSec within 48 h' },
    { id: 'SA-02', title: 'Emergency patch of internet-facing non-critical servers', agent: 'ag-vuln', tool: 'vuln.patch.apply', pol: 8, holder: 'p-elena', scope: 'Emergency vendor patches outside the change window when the flaw is exploited in the wild.', limits: ['CVSS 9.0 or more and listed as exploited', 'Server not linked to a critical business service', 'Partners warned 10 min before'], granted: 'Wed 22 Jul 2026', expDays: 8, uses: 5, last: 'Thu 1 Oct', status: 'active', review: 'Each use reported to the CISO weekly' },
    { id: 'SA-05', title: 'Micro-training to a targeted cohort after a real case', agent: 'ag-grc-policy', tool: 'learning.assign', pol: null, holder: 'p-leo', scope: 'Send a short anonymised module to the staff exposed to the technique of a real case.', limits: ['500 staff maximum', 'Anonymised case only', 'No HR consequence attached'], granted: 'Mon 30 Mar 2026', expDays: 169, uses: 12, last: 'Fri 9 Oct', status: 'active', review: 'Culture lead, monthly' },
    { id: 'SA-08', title: 'Auto-close user-reported phishing from allow-listed newsletters', agent: 'ag-soc-triage', tool: 'case.update', pol: null, holder: 'p-chloe', scope: 'Close reports on messages from senders on the newsletter allow-list.', limits: ['Sender on the newsletter allow-list', 'Verdict benign with confidence 95% or more'], granted: 'Mon 1 Jun 2026', expDays: 79, uses: 2140, last: 'Thu 10:01', status: 'active', drift: true, review: 'Deviation hunt monitors the auto-close rate' }
  ];

  /* 30-day action history (synthetic, deterministic) for the policy backtest. */
  const INC_N = 380;
  const PROFILE = [
    { n: 34000, doms: { cti: 0.24, grc: 0.1, appsec: 0.12, data: 0.16, iam: 0.12, soc: 0.26 }, read: true },
    { n: 1860, doms: { soc: 0.72, cti: 0.28 }, users: (r) => (r() < 0.03 ? 60 + Math.floor(r() * 340) : 0), rb: () => 1, harm: 3000, contain: true, novel: 0.002 },
    { n: 940, doms: { iam: 0.82, soc: 0.18 }, users: (r) => { const x = r(); return x < 0.92 ? 1 : x < 0.98 ? 2 + Math.floor(r() * 18) : 60 + Math.floor(r() * 240); }, rb: () => 1, harm: 1500, contain: true, novel: 0.001 },
    { n: 118, doms: { soc: 1 }, rb: () => 2, harm: 8000, novel: 0.06 },
    { n: 46, doms: { appsec: 1 }, users: (r) => Math.floor(r() * 40), crit: 0.2, rb: () => 2, harm: 40000, contain: true, novel: 0.04 },
    { n: 9, doms: { grc: 0.7, soc: 0.3 }, crit: 0.55, rb: () => 3, harm: 60000, contain: true },
    { n: 212, doms: { grc: 1 }, rb: () => 9999, ext: 'supplier', harm: 25000 },
    { n: 14, doms: { iam: 1 }, users: () => 1, crit: 0.3, rb: () => 2, harm: 15000, contain: true },
    { n: 11, doms: { soc: 0.8, appsec: 0.2 }, crit: 0.85, rb: (r) => 30 + r() * 90, money: (r) => 20000 + r() * 130000, harm: 50000, contain: true },
    { n: 6, doms: { soc: 1 }, users: (r) => 100 + Math.floor(r() * 1900), crit: 0.7, rb: () => 10, money: (r) => 50000 + r() * 250000, harm: 120000, contain: true },
    { n: 2, doms: { iam: 1 }, pay: true, money: (r) => 1e6 + r() * 4e6, rb: () => 5, harm: 400000, contain: true },
    { n: 5, doms: { grc: 0.8, data: 0.2 }, rb: () => 9999, ext: 'regulator', harm: 200000 },
    { n: 3, doms: { orch: 1 }, rb: () => 1, harm: 20000, contain: true },
    { n: 19, doms: { orch: 1 }, rb: () => 15, harm: 30000, novel: 0.3 }
  ];
  const ESC_DEFAULT = { soc: 'p-chloe', cti: 'p-chloe', appsec: 'p-chloe', iam: 'p-mei', grc: 'p-mei', data: 'p-mei', orch: 'p-chloe' };
  function rng(seed) { let a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  let HIST = null;
  function history() {
    if (HIST) return HIST;
    const r = rng(20261013); const list = [];
    const pick = (o) => { const x = r(); let acc = 0; const ks = Object.keys(o); for (let k = 0; k < ks.length; k++) { acc += o[ks[k]]; if (x <= acc) return ks[k]; } return ks[ks.length - 1]; };
    PROFILE.forEach((p, idx) => {
      for (let k = 0; k < p.n; k++) {
        const a = { i: idx, d: pick(p.doms) };
        if (!p.read) {
          a.users = p.users ? p.users(r) : 0; a.crit = p.crit ? r() < p.crit : false; a.rb = p.rb ? p.rb(r) : 1;
          a.conf = Math.min(0.995, 0.78 + Math.pow(r(), 0.35) * 0.22); a.ext = p.ext || null; a.money = p.money ? p.money(r) : 0; a.pay = !!p.pay;
          a.novel = r() < (p.novel || 0); a.bad = r() < (1 - a.conf) * 0.35; a.harm = p.harm || 0; a.night = r() < 0.32;
          if (p.contain) a.inc = Math.floor(r() * INC_N);
        }
        list.push(a);
      }
    });
    const base = []; for (let k = 0; k < INC_N; k++) base.push(5 + 26 * Math.pow(r(), 1.5));
    HIST = { list, base };
    return HIST;
  }
  function polLv(P, i, d) { return P.cells[i + '|' + d] || CP.data.rights[i].level; }
  function needs(a, P) {
    const lv = polLv(P, a.i, a.d);
    if (lv === 'L0' || lv === 'L1') return 'level';
    if (a.users == null) return null;
    const t = P.thr;
    if (a.users > t.users || (a.crit && t.crit)) return 'blast';
    if (a.rb > t.rollback) return 'reversibility';
    if (a.conf * 100 < t.conf) return 'confidence';
    if (a.ext && (t.exposure === 'any' || a.ext === 'regulator')) return 'exposure';
    if (a.pay || a.money > t.money * 1000) return 'money';
    if (a.novel && t.novelty) return 'novelty';
    return null;
  }
  function deciderFor(a, why, P) {
    if (why === 'money' && a.pay) return 'p-hugo';
    return P.dec[a.i] || ESC_DEFAULT[a.d] || 'p-chloe';
  }
  function backtest(P) {
    const H = history();
    const res = { total: H.list.length, human: 0, byRole: {}, reasons: { level: 0, blast: 0, reversibility: 0, confidence: 0, exposure: 0, money: 0, novelty: 0 }, byCell: {}, risk: 0, bad: 0, caught: 0 };
    const wait = new Array(INC_N).fill(0);
    H.list.forEach((a) => {
      const why = needs(a, P);
      if (!why) { if (a.bad) { res.risk += a.harm; res.bad++; } return; }
      res.human++; res.reasons[why]++;
      const k = a.i + '|' + a.d; res.byCell[k] = (res.byCell[k] || 0) + 1;
      const dec = deciderFor(a, why, P); res.byRole[dec] = (res.byRole[dec] || 0) + 1;
      if (a.bad) { res.risk += a.harm * 0.15; res.caught++; }
      if (a.inc != null) { const w = (P50[dec] || 10) * (a.night ? 2.5 : 1); if (w > wait[a.inc]) wait[a.inc] = w; }
    });
    const ttc = H.base.map((b, k) => b + wait[k]).sort((x, y) => x - y);
    res.ttcMed = ttc[Math.floor(ttc.length / 2)]; res.ttcP90 = ttc[Math.floor(ttc.length * 0.9)];
    return res;
  }

  /* ================================================================
     Helpers
     ================================================================ */
  function fmtDur(s) {
    s = Math.round(s || 0);
    if (s < 60) return s + ' s';
    if (s < 3600) return Math.round(s / 60) + ' min';
    if (s < 86400) { const h = Math.floor(s / 3600), m = Math.round((s % 3600) / 60); return h + ' h' + (m ? ' ' + String(m).padStart(2, '0') : ''); }
    const d = Math.floor(s / 86400), h = Math.round((s % 86400) / 3600); return d + ' d' + (h ? ' ' + h + ' h' : '');
  }
  function tplus(s) { s = Math.round(s || 0); if (s < 60) return 'T+' + s + 's'; const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60); return 'T+' + (d ? d + 'd ' : '') + h + ':' + String(m).padStart(2, '0'); }
  const TODAY = new Date(2026, 9, 13);
  function dateAfter(days) { const d = new Date(TODAY.getTime() + days * 86400000); return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).replace(/,/g, ''); }
  function lvOpts(sel) { return ['L0', 'L1', 'L2', 'L3'].map((l) => '<option value="' + l + '"' + (l === sel ? ' selected' : '') + '>' + l + '</option>').join(''); }
  function decOpts(sel, allowNone) { return (allowNone ? '<option value=""' + (!sel ? ' selected' : '') + '>No human (agent alone)</option>' : '') + DECIDERS.map((p) => '<option value="' + p + '"' + (p === sel ? ' selected' : '') + '>' + esc(pname(p)) + '</option>').join(''); }
  function actorName(n) {
    if (n.wl) return n.wl;
    const ag = CP.agent(n.who); if (ag) return ag.name.replace(/ Agent$/, '');
    return CP.actor(n.who).name;
  }
  function domsHtml(ds) { return '<span class="dz-doms">' + ds.map((d) => '<span class="dz-dm"><i style="background:' + CP.domain(d).color + '"></i>' + esc(CP.domain(d).label) + '</span>').join('') + '</span>'; }
  function rightsRow(i) { return i == null ? null : CP.data.rights[i]; }
  function shortAct(i) { const t = CP.data.rights[i].action; return t.length > 46 ? t.slice(0, 44).replace(/[ ,]+\S*$/, '') + '…' : t; }
  function ceiling(agentId) {
    const a = CP.agent(agentId); if (!a) return null;
    if (['degraded', 'suspended', 'canary', 'paused'].indexOf(a.status) >= 0) return { lv: a.mode, live: true, status: a.status };
    const c = CEIL[agentId] || a.mode;
    return { lv: LVN[c] >= LVN[a.mode] ? c : a.mode, live: false };
  }
  function vbump(v) { const p = String(v).split('.'); return p[0] + '.' + (+(p[1] || 0) + 1); }

  /* ---------- Policy model ---------- */
  function applies(i) { return Object.keys(PROFILE[i].doms); }
  function initialPolicy() {
    const P = { cells: {}, dec: {}, thr: { users: 50, crit: true, rollback: 5, conf: 85, exposure: 'any', money: 100, novelty: true } };
    CP.data.rights.forEach((r, i) => { applies(i).forEach((d) => { P.cells[i + '|' + d] = r.level; }); P.dec[i] = r.decider || ''; });
    return P;
  }
  function policyDiff(A, B) {
    const out = [];
    CP.data.rights.forEach((r, i) => {
      applies(i).forEach((d) => { const a = polLv(A, i, d), b = polLv(B, i, d); if (a !== b) out.push({ kind: 'cell', i, d, from: a, to: b, dir: LVN[b] > LVN[a] ? 'looser' : 'stricter' }); });
      if ((A.dec[i] || '') !== (B.dec[i] || '')) out.push({ kind: 'dec', i, from: A.dec[i], to: B.dec[i] });
    });
    const TL = { users: ['Blast radius', 'users', 1], crit: ['Critical business service counts', '', 0], rollback: ['Reversibility', 'min', -1], conf: ['Confidence floor', '%', -1], exposure: ['Exposure', '', 0], money: ['Money', 'k€', 1], novelty: ['Novelty rule', '', 0] };
    Object.keys(A.thr).forEach((k) => {
      if (A.thr[k] !== B.thr[k]) {
        let dir = '';
        if (k === 'users' || k === 'money' || k === 'rollback') dir = B.thr[k] > A.thr[k] ? 'looser' : 'stricter';
        else if (k === 'conf') dir = B.thr[k] < A.thr[k] ? 'looser' : 'stricter';
        else if (k === 'crit' || k === 'novelty') dir = B.thr[k] ? 'stricter' : 'looser';
        else if (k === 'exposure') dir = B.thr[k] === 'any' ? 'stricter' : 'looser';
        out.push({ kind: 'thr', k, label: TL[k][0], unit: TL[k][1], from: A.thr[k], to: B.thr[k], dir });
      }
    });
    return out;
  }
  function thrVal(v) { return v === true ? 'on' : v === false ? 'off' : v === 'any' ? 'any external message' : v === 'regulators' ? 'regulators only' : String(v); }

  /* ================================================================
     Flow model
     ================================================================ */
  function pbList(S) { return PBS.concat(S.custom || []); }
  function pbById(S, id) { return pbList(S).find((p) => p.id === id) || PBS[0]; }

  const BASE = {};
  function baseFlow(pb) {
    const key = pb.flowFrom || pb.id;
    if (BASE[key]) return BASE[key];
    const src = PBS.find((p) => p.id === key);
    let nodes;
    if (src.scenario) {
      const s = CP.scenarioById(src.scenario); const W = WIRING[s.id] || {};
      const stepById = {}; s.steps.forEach((st) => { stepById[st.id] = st; });
      const hasGate = (id) => !!(stepById[id] && stepById[id].gate);
      const ref = (id) => (hasGate(id) ? 'g-' + id : id);
      nodes = [];
      s.steps.forEach((st, i) => {
        const deps = W[st.id] || (i ? [s.steps[i - 1].id] : []);
        const depT = deps.length ? Math.max.apply(null, deps.map((d) => stepById[d].t + (hasGate(d) ? P50[stepById[d].gate.approval.decider] * 60 : 0))) : 0;
        const ag = CP.agent(st.actor);
        let tools = TOOLS_OVR[st.id];
        if (!tools) { tools = []; (st.flow || []).forEach((p) => p.forEach((x) => { const t = FLOW_TOOL[x]; if (t && tools.indexOf(t) < 0) tools.push(t); })); }
        const lane = st.domain === 'src' ? 'ext' : st.domain;
        nodes.push({ id: st.id, lane, who: st.actor, agent: ag ? st.actor : null, title: st.title, level: st.level, dur: Math.max(5, st.t - depT), after: deps.map(ref), tools: tools.slice(), policy: POLICY[st.id] != null ? POLICY[st.id] : null, thr: (THR[st.id] || []).slice(), text: st.text, step: st.id });
        if (st.gate) {
          const ap = st.gate.approval;
          nodes.push({ id: 'g-' + st.id, kind: 'gate', lane: 'human', who: ap.decider, decider: ap.decider, title: ap.title, level: 'L1', after: [st.id], policy: POLICY[st.id] != null ? POLICY[st.id] : null, thr: (THR[st.id] || []).slice(), fallback: st.gate.fallback || '', dur: P50[ap.decider] * 60, tools: ['orchestrator.escalate'], threshold: ap.threshold, approveLabel: ap.approveLabel || 'Approve', rejectLabel: ap.rejectLabel || 'Reject', recommendation: ap.recommendation, step: st.id });
        }
      });
    } else {
      nodes = CP.clone(STATIC[key]);
    }
    nodes.forEach((n) => {
      if (!n.kind) n.kind = 'step';
      n.agent = n.agent || (CP.agent(n.who) ? n.who : null);
      if (!n.timeout) n.timeout = n.kind === 'gate' ? (GATE_TO[n.decider] || '30 min') : ({ L3: '2 min', L2: '15 min', L1: '30 min', L0: '4 h' }[n.level] || '15 min');
      if (n.kind !== 'gate' && n.fallback == null) {
        const ag = CP.agent(n.agent);
        n.fallback = ag ? 'Retry once, then hand over to the ' + lc(pname(ag.supervisor)) + ' with the full context.' : n.lane === 'human' ? 'Reminder at half the timeout, then the deputy is called.' : 'Escalate to the Run supervisor on duty.';
      }
    });
    BASE[key] = nodes;
    return nodes;
  }

  /* Flow of a playbook with the designer's local edits applied, laid out and timed. */
  function flow(S, pb) {
    const ed = (S.edits[pb.id] || {});
    const nodes = baseFlow(pb).map((n) => Object.assign({}, n, ed[n.id] || {}, { after: (ed[n.id] && ed[n.id].after) ? ed[n.id].after.slice() : n.after.slice() }));
    const byId = {}; nodes.forEach((n) => { byId[n.id] = n; });
    /* reachability from the start node (first node) */
    const reach = {}; const start = nodes[0];
    const succ = {}; nodes.forEach((n) => n.after.forEach((p) => { (succ[p] = succ[p] || []).push(n.id); }));
    const q = [start.id]; reach[start.id] = true;
    while (q.length) { const id = q.shift(); (succ[id] || []).forEach((s) => { if (!reach[s]) { reach[s] = true; q.push(s); } }); }
    /* depth = column */
    const depth = {};
    const dfs = (id, seen) => {
      if (depth[id] != null) return depth[id];
      const n = byId[id]; if (!n || seen[id]) return 0; seen[id] = true;
      const ps = n.after.filter((p) => byId[p]);
      depth[id] = n.col != null && !ps.length ? n.col : ps.length ? Math.max.apply(null, ps.map((p) => dfs(p, seen))) + 1 : 0;
      return depth[id];
    };
    nodes.forEach((n) => dfs(n.id, {}));
    /* timing: finish = max(finish of predecessors) + duration */
    const fin = {}, st = {};
    const tdfs = (id, seen) => {
      if (fin[id] != null) return fin[id];
      const n = byId[id]; if (seen[id]) return 0; seen[id] = true;
      const ps = n.after.filter((p) => byId[p] && reach[p]);
      st[id] = ps.length ? Math.max.apply(null, ps.map((p) => tdfs(p, seen))) : 0;
      fin[id] = st[id] + (n.dur || 0);
      return fin[id];
    };
    nodes.forEach((n) => { if (reach[n.id]) tdfs(n.id, {}); });
    nodes.forEach((n) => { n._col = depth[n.id]; n._reach = !!reach[n.id]; n._start = st[n.id]; n._fin = fin[n.id]; });
    return { pb, nodes, byId, succ, start };
  }

  function layout(F) {
    const mobile = window.innerWidth < 760;
    const LW = mobile ? 92 : 128, COL = mobile ? 178 : 190, NW = mobile ? 158 : 166, NH = 74, SH = 88, AX = 26;
    const lanes = LANES.filter((l) => F.nodes.some((n) => n.lane === l));
    const slots = {};
    F.nodes.forEach((n) => { const k = n.lane + '|' + n._col; n._slot = slots[k] || 0; slots[k] = n._slot + 1; });
    const laneY = {}, laneH = {}; let y = AX;
    lanes.forEach((l) => { let m = 1; Object.keys(slots).forEach((k) => { if (k.split('|')[0] === l) m = Math.max(m, slots[k]); }); laneH[l] = m * SH + 4; laneY[l] = y; y += laneH[l]; });
    const maxCol = Math.max.apply(null, F.nodes.map((n) => n._col));
    F.nodes.forEach((n) => { n._x = LW + 16 + n._col * COL; n._y = laneY[n.lane] + 8 + n._slot * SH; });
    return { LW, COL, NW, NH, AX, lanes, laneY, laneH, W: LW + 16 + (maxCol + 1) * COL + 8, H: y, maxCol };
  }

  /* ---------- Lint ---------- */
  function lint(S, F) {
    const out = [];
    const P = S.pol.current;
    const sas = saList(S);
    F.nodes.forEach((n) => {
      const nm = '"' + n.title + '"';
      if (!n._reach) out.push({ sev: 'error', node: n.id, msg: 'Unreachable step: ' + nm + ' has no path from the trigger.', fix: n.after.length ? 'Its predecessors are unreachable too: reconnect the branch.' : 'Set "Runs after" in the inspector, or delete the step.' });
      if (n.kind === 'gate') {
        if (!String(n.fallback || '').trim()) out.push({ sev: 'error', node: n.id, msg: 'Gate ' + nm + ' has no fallback: if the ' + lc(pname(n.decider)) + ' rejects or does not answer in ' + n.timeout + ', the playbook stalls.', fix: 'Write what the platform does on reject or timeout.' });
        if (!n.decider) out.push({ sev: 'error', node: n.id, msg: 'Gate ' + nm + ' has no decision holder.', fix: 'Pick the role that holds the decision right.' });
        const pd = n.policy != null ? P.dec[n.policy] : '';
        if (pd && n.decider && pd !== n.decider) out.push({ sev: 'warn', node: n.id, msg: 'Gate ' + nm + ' asks the ' + lc(pname(n.decider)) + ', but the policy gives this decision to the ' + lc(pname(pd)) + '.', fix: 'Align the gate with the decision-rights policy, or change the policy.' });
        return;
      }
      if (n.agent) {
        const c = ceiling(n.agent);
        if (c && LVN[n.level] > LVN[c.lv]) out.push({ sev: 'error', node: n.id, msg: nm + ' runs at ' + n.level + ', above the ceiling of the ' + CP.agent(n.agent).name + ' (' + c.lv + (c.live ? ', lowered live by Operate: agent ' + c.status : ', manifest') + ').', fix: c.live ? 'Lower the step to ' + c.lv + ' until the agent is restored, or add a gate.' : 'Lower the level, or ask Build to raise the ceiling (requires evals and Trust & Challenge sign-off).' });
        const ag = CP.agent(n.agent);
        (n.tools || []).forEach((t) => {
          const fam = t.split('.')[0];
          if (NATIVE.indexOf(fam) >= 0) return;
          if (!(ag.tools || []).some((x) => x.split('.')[0] === fam)) out.push({ sev: 'info', node: n.id, msg: 'Tool ' + t + ' is outside the manifest of the ' + ag.name + '.', fix: 'Add it in Build (agent studio) or hand this action to an agent that holds it.' });
        });
      }
      if (n.policy != null && n.lane !== 'human') {
        const r = rightsRow(n.policy);
        const dom = applies(n.policy).indexOf(n.lane) >= 0 ? n.lane : (r.domain === 'all' ? 'soc' : r.domain);
        const pl = polLv(P, n.policy, dom);
        if (LVN[n.level] > LVN[pl]) {
          const viaGate = n.after.some((p) => { const g = F.byId[p]; return g && g.kind === 'gate' && g.policy === n.policy; });
          const sa = sas.find((x) => x.pol === n.policy && x.agent === n.agent && (x.status === 'active' || x.status === 'expiring'));
          if (viaGate) { /* executes a human decision: authorised */ } else if (sa) out.push({ sev: 'info', node: n.id, msg: nm + ' runs at ' + n.level + ' under standing approval ' + sa.id + ' (policy says ' + pl + ').', fix: 'Holder: ' + pname(sa.holder) + ', expires ' + dateAfter(sa.expDays) + '.' });
          else out.push({ sev: 'warn', node: n.id, msg: nm + ' runs at ' + n.level + ' but the policy allows ' + pl + ' for "' + shortAct(n.policy) + '". At run time the orchestrator will stop and ask the ' + lc(pname(P.dec[n.policy] || r.decider || 'p-chloe')) + '.', fix: 'Add a gate, lower the level, or create a standing approval.' });
        }
      }
    });
    const rank = { error: 0, warn: 1, info: 2 };
    return out.sort((a, b) => rank[a.sev] - rank[b.sev]);
  }

  /* ---------- Standing approvals state ---------- */
  function saList(S) {
    const dv = CP.store.find('deviations', 'DV-34');
    const m420 = CP.store.find('comms', 'M-420');
    return S.sa.map((x) => {
      const o = Object.assign({}, x);
      if (o.id === 'SA-07' && m420) { o.uses = x.uses + 1; o.last = 'Mon 09:40 (C-2303)'; o.fresh = CP.store.isNew(m420, 8000); }
      if (o.drift && dv && dv.status !== 'closed' && o.status === 'active' && !x.manual) { o.status = 'suspended'; o.why = 'Suspended automatically by deviation ' + dv.id + ': hidden instructions in phishing emails.'; }
      if (o.status === 'active' && o.expDays <= 14) o.status = 'expiring';
      return o;
    });
  }

  /* ================================================================
     Screen
     ================================================================ */
  CP.screen({
    id: 'design', part: 2, label: 'Design', icon: 'branch',
    ui: { pb: 'pb-cti', sel: {}, edits: {}, lintShown: {}, sim: null, custom: [], fs: {}, catQ: '', catRisk: 'all', catMode: 'all', catDom: 'all', tool: 'waf.deploy_rule', saSel: 'SA-07', pol: null, sa: null },

    init() {
      const S = this.ui;
      if (!S.sa) S.sa = CP.clone(SA_SEED);
      if (!S.pol) {
        const cur = initialPolicy();
        S.pol = { ver: 14, current: cur, draft: CP.clone(cur), stage: 'draft', note: '', history: [
          { v: 14, name: 'DR-2026.4', when: 'Wed 2 Sep 2026', by: 'p-elena', note: 'Session revocation raised to L3 after a 60-day canary; WAF block mode at L2 with 0-FP replay' },
          { v: 13, name: 'DR-2026.3', when: 'Mon 6 Jul 2026', by: 'p-elena', note: 'Standing approvals introduced (SA-07 supplier template)' },
          { v: 12, name: 'DR-2026.2', when: 'Thu 26 Mar 2026', by: 'p-elena', note: 'Money threshold set at €100k; payments always human' }
        ] };
      }
    },

    render(route) {
      this.init();
      const S = this.ui;
      const subs = ['playbooks', 'policies', 'approvals', 'catalogue'];
      const sub = subs.indexOf(route.sub) >= 0 ? route.sub : 'playbooks';
      const q = route.query || {};
      if (q.pb && q.pb !== S._qpb) { S._qpb = q.pb; if (pbList(S).some((p) => p.id === q.pb)) S.pb = q.pb; }
      const pendDiff = policyDiff(S.pol.current, S.pol.draft).length;
      const sas = saList(S);
      const expiring = sas.filter((x) => x.status === 'expiring' || x.status === 'suspended').length;
      const errs = pbList(S).reduce((a, p) => a + lint(S, flow(S, p)).filter((x) => x.sev === 'error').length, 0);
      const groups = [
        { label: 'Design', tabs: [
          { id: 'playbooks', label: 'Playbooks', icon: 'workflow', count: errs ? errs : pbList(S).length, warn: !!errs },
          { id: 'policies', label: 'Decision rights', icon: 'scale', count: pendDiff ? pendDiff : '', warn: S.pol.stage !== 'draft' }
        ] },
        { label: 'Grant', tabs: [{ id: 'approvals', label: 'Standing approvals', icon: 'key', count: expiring || '', warn: true }] },
        { label: 'Reference', tabs: [{ id: 'catalogue', label: 'Tools & actions', icon: 'box', count: TOOLS.length }] }
      ];
      const right = U.av('p-raj', 'sm') + '<span>Designed by Build · policies signed by the CISO</span>';
      return U.tabbar('design', groups, sub, right) + this['r_' + sub](route);
    },

    mount(root) {
      const S = this.ui;
      const fl = root.querySelector('.dz-flow');
      if (fl) {
        const sc = S.fs[S.pb]; if (sc) { fl.scrollLeft = sc[0]; fl.scrollTop = sc[1]; }
        fl.addEventListener('scroll', () => { S.fs[S.pb] = [fl.scrollLeft, fl.scrollTop]; }, { passive: true });
        if (S._scrollTo) {
          const n = fl.querySelector('[data-id="' + S._scrollTo + '"]'); S._scrollTo = null;
          if (n) { const l = n.offsetLeft - 140, t = n.offsetTop - 40; if (l < fl.scrollLeft || l > fl.scrollLeft + fl.clientWidth - 200) fl.scrollLeft = Math.max(0, l); if (t < fl.scrollTop || t > fl.scrollTop + fl.clientHeight - 90) fl.scrollTop = Math.max(0, t); S.fs[S.pb] = [fl.scrollLeft, fl.scrollTop]; }
        }
      }
      root.querySelectorAll('#dz-cat-q,#dz-fb').forEach((el) => {
        el.addEventListener('focus', () => { S._focus = { id: el.id, s: el.selectionStart || 0, e: el.selectionEnd || 0 }; });
        el.addEventListener('blur', () => { setTimeout(() => { if (el.isConnected && S._focus && S._focus.id === el.id) S._focus = null; }, 0); });
        el.addEventListener('input', () => { try { S._focus = { id: el.id, s: el.selectionStart, e: el.selectionEnd }; } catch (e) { S._focus = { id: el.id }; } });
      });
      const fb = root.querySelector('#dz-fb');
      if (fb) fb.addEventListener('input', () => { this.setEdit(fb.dataset.node, { fallback: fb.value }); });
      const cq = root.querySelector('#dz-cat-q');
      if (cq) cq.addEventListener('input', () => { S.catQ = cq.value; clearTimeout(S._qt); S._qt = setTimeout(() => CP.render(), 160); });
      if (S._focus) {
        const el = root.querySelector('#' + S._focus.id);
        if (el && document.activeElement !== el) { el.focus({ preventScroll: true }); try { if (S._focus.s != null) el.setSelectionRange(S._focus.s, S._focus.e); } catch (e) { /* number inputs */ } }
      }
      root.querySelectorAll('tr[data-key-action]').forEach((tr) => tr.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); const fn = this.actions[tr.dataset.keyAction]; if (fn) fn.call(this, tr, ev, CP.route); }
      }));
    },

    setEdit(pbId, patch, nodeId) {
      const S = this.ui; const nid = nodeId || S.sel[pbId];
      if (!nid) return;
      S.edits[pbId] = S.edits[pbId] || {};
      S.edits[pbId][nid] = Object.assign({}, S.edits[pbId][nid] || {}, patch);
    },

    /* ================= Playbooks ================= */
    r_playbooks() {
      const S = this.ui;
      const list = pbList(S);
      const pb = pbById(S, S.pb);
      const flows = list.map((p) => ({ p, F: flow(S, p) }));
      const live = list.filter((p) => p.status === 'live').length;
      const runs = list.reduce((a, p) => a + (p.runs || 0), 0);
      const gates = flows.reduce((a, x) => a + x.F.nodes.filter((n) => n.kind === 'gate').length, 0);
      const allIssues = flows.map((x) => ({ id: x.p.id, iss: lint(S, x.F) }));
      const errN = allIssues.reduce((a, x) => a + x.iss.filter((i) => i.sev === 'error').length, 0);
      const warnN = allIssues.reduce((a, x) => a + x.iss.filter((i) => i.sev === 'warn').length, 0);
      const dprAvg = list.filter((p) => p.runs).reduce((a, p) => a + p.dpr * p.runs, 0) / Math.max(1, runs);

      const rows = flows.map((x) => {
        const p = x.p, F = x.F, iss = allIssues.find((a) => a.id === p.id).iss;
        const acts = F.nodes.filter((n) => n.kind !== 'gate' && n.lane !== 'human' && n.lane !== 'ext');
        const cnt = { L3: 0, L2: 0, L1: 0, L0: 0 }; acts.forEach((n) => { cnt[n.level]++; });
        const g = F.nodes.filter((n) => n.kind === 'gate').length;
        const e = iss.filter((i) => i.sev === 'error').length, w = iss.filter((i) => i.sev === 'warn').length;
        const ver = currentVersion(p);
        const dirty = Object.keys(S.edits[p.id] || {}).length;
        return { p, F, cnt, g, e, w, acts: acts.length, ver, dirty, id: p.id };
      });
      const cols = [
        { label: 'Playbook', render: (r) => '<div class="dz-name">' + esc(r.p.name) + (r.p.scenario ? ' <span class="tag outline" title="Recorded scenario: can be run as a drill">' + esc(CP.scenarioById(r.p.scenario).n) + '</span>' : '') + '</div><div class="dz-mini" style="max-width:380px">' + esc(r.p.trigger) + '</div>' },
        { label: 'Domains', render: (r) => domsHtml(r.p.domains) },
        { label: 'Steps', render: (r) => '<span class="num">' + r.F.nodes.length + '</span><div class="dz-mini">' + r.g + ' gate' + (r.g > 1 ? 's' : '') + '</div>' },
        { label: 'Autonomy profile', render: (r) => '<div class="dz-prof" title="' + ['L3', 'L2', 'L1', 'L0'].map((l) => l + ': ' + r.cnt[l]).join(' · ') + '">' + ['L3', 'L2', 'L1', 'L0'].map((l) => '<i style="width:' + (r.cnt[l] / Math.max(1, r.acts) * 100) + '%;background:' + LVC[l] + '"></i>').join('') + '</div><div class="dz-mini" style="margin-top:4px">' + ['L3', 'L2', 'L1'].map((l) => l + ' ' + r.cnt[l]).join(' · ') + '</div>' },
        { label: 'Runs 90 d', render: (r) => '<span class="num">' + (r.p.runs || 0) + '</span>' + (r.p.shadow ? '<div class="dz-mini">' + r.p.shadow + ' shadow</div>' : '') },
        { label: 'Median time', render: (r) => '<span class="num">' + esc(r.p.median) + '</span>' },
        { label: 'Decisions / run', render: (r) => '<span class="num">' + (r.p.runs ? CP.fmt(r.p.dpr, 1) : 'n/a') + '</span>' },
        { label: 'Lint', render: (r) => r.e ? '<span class="tag red">' + r.e + ' blocking</span>' + (r.w ? ' <span class="tag amber">' + r.w + '</span>' : '') : r.w ? '<span class="tag amber">' + r.w + ' warning' + (r.w > 1 ? 's' : '') + '</span>' : '<span class="dz-ok">' + I('checkCircle') + ' Clean</span>' },
        { label: 'Version', render: (r) => '<span class="mono" style="font-weight:700">v' + esc(r.ver.v) + '</span> ' + U.status(r.p.status === 'testing' ? 'canary' : r.p.status, r.p.status === 'testing' ? 'Shadow' : null) + (r.dirty ? ' <span class="tag amber" title="Unpublished edits">edited</span>' : '') + '<div class="dz-mini">' + esc(r.ver.when) + ' · ' + esc(pname(r.ver.by)) + '</div>' }
      ];
      const table = U.table(cols, rows, { rowAttrs: (r) => 'data-action="selPb" data-key-action="selPb" data-id="' + r.id + '" tabindex="0" aria-label="Open ' + esc(r.p.name) + ' in the designer"', rowClass: (r) => 'clickable dz-tr' + (r.id === pb.id ? ' sel' : '') });

      return U.head('Design · Playbooks', 'Design the response before the incident',
        'A playbook is an orchestration: what triggers it, which agent does what at which autonomy level, where a human decides and what happens if nobody answers. It is linted against the decision-rights policy and the agents\' ceilings, dry-run on the digital twin, then published as a version that Operate runs.',
        '<button data-go="design/policies">' + I('scale') + ' Decision rights</button>') +
        '<div class="metrics" style="margin-bottom:18px">' +
        U.metric({ label: 'Playbooks live', icon: 'workflow', value: live, unit: '/ ' + list.length, foot: list.filter((p) => p.status === 'testing').length + ' in shadow mode · ' + list.filter((p) => p.status === 'draft').length + ' draft' }) +
        U.metric({ label: 'Runs in 90 days', icon: 'activity', value: CP.fmt(runs), foot: CP.fmt(dprAvg, 1) + ' human decisions per run on average' }) +
        U.metric({ label: 'Human gates designed', icon: 'users', value: gates, foot: 'each with a decision holder, a timeout and a fallback' }) +
        U.metric({ label: 'Lint across the catalogue', icon: 'alert', value: errN, unit: 'blocking', color: errN ? 'var(--red-ink)' : 'var(--green-ink)', foot: warnN + ' warnings · agent ceilings read live from Operate', flash: errN > 0 }) +
        '</div>' +
        U.card('Playbook catalogue', table, { tour: 'design-playbooks', sub: 'Select a playbook to open it in the designer', right: '<span class="dz-mini">Runs, median time and decisions over the last 90 days</span>', style: 'padding:16px' }) +
        this.designer(pb);
    },

    designer(pb) {
      const S = this.ui;
      const F = flow(S, pb);
      const L = layout(F);
      const iss = lint(S, F);
      const issBy = {}; iss.forEach((x) => { (issBy[x.node] = issBy[x.node] || []).push(x); });
      if (!S.sel[pb.id] || !F.byId[S.sel[pb.id]]) { const g = F.nodes.find((n) => n.kind === 'gate'); S.sel[pb.id] = (g || F.nodes[1] || F.nodes[0]).id; }
      const sel = F.byId[S.sel[pb.id]];
      const sim = S.sim && S.sim.pb === pb.id ? S.sim : null;
      const simState = {};
      if (sim) sim.order.forEach((o, k) => { simState[o.id] = k < sim.i ? 'done' : k === sim.i ? (sim.running ? 'run' : 'done') : ''; });
      const ver = currentVersion(pb);
      const dirtyN = Object.keys(S.edits[pb.id] || {}).length;
      const errs = iss.filter((x) => x.sev === 'error').length;
      const sc = pb.scenario ? CP.scenarioById(pb.scenario) : null;
      const endFin = Math.max.apply(null, F.nodes.filter((n) => n._reach).map((n) => n._fin));

      /* axis: earliest expected finish per column */
      let axis = '<div class="dz-axis" style="width:' + L.W + 'px"><span class="dz-ll" style="width:' + L.LW + 'px;top:0;height:26px;display:flex;align-items:center">Lanes</span>';
      for (let c = 0; c <= L.maxCol; c++) {
        const fs = F.nodes.filter((n) => n._col === c && n._reach).map((n) => n._fin);
        axis += '<span style="left:' + (L.LW + 16 + c * L.COL) + 'px">' + (fs.length ? 'done by ' + tplus(Math.min.apply(null, fs)) : 'not reached') + '</span>';
      }
      axis += '</div>';
      const lanes = L.lanes.map((l, k) => {
        const m = l === 'ext' ? ['Outside & signals', 'feeds, systems, suppliers', 'var(--d-ext)'] : l === 'orch' ? ['Orchestrator', 'plans, checks rights', 'var(--d-orch)'] : l === 'trust' ? ['Trust & Challenge', 'assurance, adversary lab', '#5a2be0'] : l === 'human' ? ['Humans', 'decision holders', 'var(--d-human)'] : [CP.domain(l).label + ' agents', CP.store.get('agents').filter((a) => a.domain === l).length + ' agents in the fleet', CP.domain(l).color];
        return '<div class="dz-lane' + (k % 2 ? ' alt' : '') + '" style="top:' + L.laneY[l] + 'px;height:' + L.laneH[l] + 'px;width:' + L.W + 'px"><div class="dz-ll" style="width:' + L.LW + 'px;--lc:' + m[2] + '">' + esc(m[0]) + '<small>' + esc(m[1]) + '</small></div></div>';
      }).join('');
      /* edges */
      let edges = '<svg class="dz-edges" width="' + L.W + '" height="' + L.H + '" viewBox="0 0 ' + L.W + ' ' + L.H + '" aria-hidden="true"><defs>' +
        '<marker id="dz-ar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 8 4 0 8Z" fill="#b3adc5"/></marker>' +
        '<marker id="dz-arg" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 8 4 0 8Z" fill="#088a42"/></marker></defs>';
      F.nodes.forEach((n) => n.after.forEach((pid) => {
        const p = F.byId[pid]; if (!p) return;
        const x1 = p._x + L.NW, y1 = p._y + L.NH / 2, x2 = n._x - 2, y2 = n._y + L.NH / 2;
        const dx = Math.max(30, (x2 - x1) / 2);
        const done = sim && simState[n.id] && simState[pid] === 'done';
        const cls = done ? 'done' : p.kind === 'gate' ? 'yes' : '';
        edges += '<path class="' + cls + '" d="M' + x1 + ' ' + y1 + ' C' + (x1 + dx) + ' ' + y1 + ',' + (x2 - dx) + ' ' + y2 + ',' + x2 + ' ' + y2 + '" marker-end="url(#' + (done || p.kind === 'gate' ? 'dz-arg' : 'dz-ar') + ')"/>';
        if (p.kind === 'gate') edges += '<text x="' + (x1 + 6) + '" y="' + (y1 - 5) + '">' + esc((p.approveLabel || 'yes').toLowerCase().slice(0, 18)) + '</text>';
      }));
      edges += '</svg>';
      /* nodes */
      const nodesHtml = F.nodes.map((n) => {
        const ni = issBy[n.id] || []; const e = ni.filter((x) => x.sev === 'error').length, w = ni.filter((x) => x.sev === 'warn').length;
        const st = simState[n.id];
        const cls = 'dz-node' + (n.kind === 'gate' ? ' gate' : '') + (n.id === sel.id ? ' sel' : '') + (!n._reach ? ' orphan' : '') + (st === 'done' ? ' sim-done' : st === 'run' ? ' sim-run' : '') + (sim && !n._reach ? ' sim-skip' : '');
        const color = n.lane === 'ext' ? 'var(--d-ext)' : n.lane === 'orch' ? 'var(--d-orch)' : n.lane === 'human' ? 'var(--d-human)' : n.lane === 'trust' ? '#5a2be0' : CP.domain(n.lane).color;
        const mark = e ? '<span class="dz-iss" title="' + e + ' blocking issue(s)">' + e + '</span>' : w ? '<span class="dz-iss w" title="' + w + ' warning(s)">' + w + '</span>' : '';
        const style = 'left:' + n._x + 'px;top:' + n._y + 'px;width:' + L.NW + 'px;height:' + L.NH + 'px;--nc:' + color;
        if (n.kind === 'gate') {
          return '<button class="' + cls + '" style="' + style + '" data-action="selNode" data-id="' + esc(n.id) + '" aria-label="Gate: ' + esc(n.title) + ', decided by ' + esc(pname(n.decider)) + '"><span class="dz-dia"></span><span>' + (st === 'done' ? '✓' : '?') + '</span>' +
            '<span class="dz-nh"><b style="color:#8a5a05;font-size:10px;letter-spacing:.8px">GATE</b><span class="who">' + esc(pname(n.decider)) + '</span></span>' +
            '<span class="dz-nt">' + esc(n.title) + '</span>' +
            '<span class="dz-nf">' + I('clock') + esc(n.timeout) + ' · <span class="dz-else' + (String(n.fallback || '').trim() ? ' ok' : '') + '">' + (String(n.fallback || '').trim() ? 'else fallback' : 'no fallback') + '</span></span>' + mark + '</button>';
        }
        return '<button class="' + cls + '" style="' + style + '" data-action="selNode" data-id="' + esc(n.id) + '" aria-label="Step: ' + esc(n.title) + ', ' + esc(actorName(n)) + ', level ' + n.level + '">' +
          '<span class="dz-nh"><span class="dz-l ' + n.level + '">' + n.level + '</span><span class="who">' + esc(actorName(n)) + '</span></span>' +
          '<span class="dz-nt">' + esc(n.title) + '</span>' +
          '<span class="dz-nf">' + I('clock') + fmtDur(n.dur) + ((n.tools || []).length ? ' · ' + n.tools.length + ' tool' + (n.tools.length > 1 ? 's' : '') : '') + (n._reach ? '' : ' · <span class="dz-else">unreachable</span>') + '</span>' + mark + '</button>';
      }).join('');

      const simBar = sim ? '<div class="dz-simbar" role="status">' + I('sparkles') + '<span>Dry run on the digital twin</span><span class="clock">' + tplus(sim.i >= 0 && sim.order[Math.min(sim.i, sim.order.length - 1)] ? sim.order[Math.min(sim.i, sim.order.length - 1)].fin : 0) + '</span><span><b>' + Math.min(sim.i + 1, sim.order.length) + '</b> / ' + sim.order.length + ' steps</span>' + U.progress((Math.min(sim.i + 1, sim.order.length)) / sim.order.length * 100) + (sim.running ? '<button class="small on-dark" data-action="simStop">' + I('pause') + ' Stop</button>' : '<button class="small on-dark" data-action="simClear">' + I('x') + ' Clear</button>') + '</div>' : '';

      const head = '<div class="dz-dhead"><div><div class="eyebrow" style="margin:0 0 2px">Playbook designer</div><h2>' + esc(pb.name) + '</h2></div>' +
        '<span class="mono" style="font-weight:700">v' + esc(ver.v) + '</span>' + U.status(pb.status === 'testing' ? 'canary' : pb.status, pb.status === 'testing' ? 'Shadow mode' : null) +
        (dirtyN ? '<span class="tag amber">' + dirtyN + ' unpublished change' + (dirtyN > 1 ? 's' : '') + '</span>' : '') +
        (sc ? '<span class="tag outline" title="This playbook has a recorded run">' + I('play') + ' Recorded as ' + esc(sc.n) + '</span>' : '') +
        '<div class="dz-dbtns">' +
        '<button data-action="validate">' + I('checkCircle') + ' Validate</button>' +
        (sim && sim.running ? '<button data-action="simStop">' + I('pause') + ' Stop dry run</button>' : '<button data-action="simulate">' + I('sparkles') + ' Simulate</button>') +
        '<button class="primary" data-action="publish"' + (errs ? ' title="' + errs + ' blocking issue(s): Validate to see them"' : '') + '>' + I('rocket') + ' Publish v' + esc(vbump(ver.v)) + '</button>' +
        (sc ? '<button class="go" data-action="drill">' + I('play') + ' Run it now as a drill</button>' : '<button class="go" disabled title="No recorded scenario for this playbook: use Simulate">' + I('play') + ' Run as a drill</button>') +
        '<button class="ghost" data-action="duplicate" title="Duplicate as a new draft">' + I('file') + ' Duplicate</button>' +
        '</div></div>';
      const meta = '<div class="dz-meta"><div><b>Trigger</b>' + esc(pb.trigger) + '</div><div><b>Objective</b>' + esc(pb.slo) + '</div><div><b>Owner</b>' + U.who(pb.owner) + '</div><div><b>Designed critical path</b><span class="num" style="font-weight:650">' + fmtDur(endFin) + '</span> · ' + F.nodes.filter((n) => n.kind === 'gate').length + ' human gate(s) · median observed ' + esc(pb.median) + '</div></div>';

      const flowBar = '<div class="dz-flowbar"><span class="lg"><span class="dz-l L3">L3</span>autonomous</span><span class="lg"><span class="dz-l L2">L2</span>act & notify</span><span class="lg"><span class="dz-l L1">L1</span>on approval</span><span class="lg"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 0 12 6 6 12 0 6Z" fill="#ffb648" stroke="#c8861a"/></svg>gate (decision holder)</span><span class="spacer"></span><span>Columns run in parallel · ' + (window.innerWidth < 1100 ? 'scroll inside the canvas' : 'click a step to edit it') + '</span></div>';
      const canvas = '<div class="dz-flowwrap">' + flowBar + simBar + '<div class="dz-flow" tabindex="0" aria-label="Flow of the playbook (scrollable)"><div class="dz-canvas" style="width:' + L.W + 'px;height:' + L.H + 'px">' + axis + lanes + edges + nodesHtml + '</div></div></div>';

      const results = this.resultsHtml(pb, F, iss, sim);
      return '<section class="dz-dcard" data-tour="design-flow">' + head + meta + '<div class="dz-design">' + canvas + this.inspector(pb, F, sel, issBy[sel.id] || []) + '</div>' + results + '</section>' +
        '<div class="grid g2" style="margin-top:18px">' + this.versionsCard(pb) + this.runsCard(pb) + '</div>';
    },

    inspector(pb, F, n, iss) {
      const S = this.ui;
      const P = S.pol.current;
      const edited = !!((S.edits[pb.id] || {})[n.id]);
      const r = rightsRow(n.policy);
      let h = '<div class="dz-insp" aria-label="Step inspector"><div><div class="row" style="gap:6px;margin-bottom:6px;flex-wrap:wrap">' +
        (n.kind === 'gate' ? '<span class="tag amber">' + I('users') + ' Human gate</span>' : U.lvl(n.level)) +
        '<span class="dz-id">' + esc(n.id) + '</span>' + (edited ? '<span class="tag amber">edited</span>' : '') + '</div><h3>' + esc(n.title) + '</h3>' +
        (n.text ? '<div class="dz-mini" style="margin-top:4px">' + esc(n.text.length > 220 ? n.text.slice(0, 218).replace(/\s+\S*$/, '') + '…' : n.text) + '</div>' : '') + '</div>';
      if (iss.length) h += '<div style="display:grid;gap:6px">' + iss.map((x) => '<div class="dz-issue ' + x.sev + '">' + I(x.sev === 'info' ? 'info' : 'alert') + '<span><b>' + esc(x.msg) + '</b><br><span class="muted">' + esc(x.fix) + '</span></span></div>').join('') + '</div>';

      if (n.kind === 'gate') {
        h += '<label class="dz-f">Decision holder<select data-change="nodeField" data-f="decider">' + decOpts(n.decider) + '</select></label>' +
          '<div class="dz-f">Decision timeout<select data-change="nodeField" data-f="timeout" aria-label="Decision timeout">' + TIMEOUTS.map((t) => '<option' + (t === n.timeout ? ' selected' : '') + '>' + t + '</option>').join('') + '</select><span class="dz-mini" style="font-weight:400">Median decision time of this holder: ' + (P50[n.decider] || 10) + ' min. Phone call at half the timeout.</span></div>' +
          '<label class="dz-f">Fallback on reject or timeout<textarea id="dz-fb" data-node="' + esc(pb.id) + '" data-change="nodeCommit" placeholder="What the platform does if the holder rejects or does not answer">' + esc(n.fallback || '') + '</textarea></label>';
        if (n.recommendation) h += '<div class="dz-mini"><b style="color:var(--ink)">Recommendation template:</b> ' + esc(n.recommendation) + '</div>';
      } else {
        const isAgentLane = AGENT_DOMS.indexOf(n.lane) >= 0;
        const agents = CP.store.get('agents');
        const c = n.agent ? ceiling(n.agent) : null;
        h += '<label class="dz-f">Performed by' + (isAgentLane ? '<select data-change="nodeField" data-f="agent">' + agents.filter((a) => a.domain === n.lane || a.id === n.agent).map((a) => '<option value="' + a.id + '"' + (a.id === n.agent ? ' selected' : '') + '>' + esc(a.name) + ' · v' + esc(a.version) + ' · ' + esc(a.mode) + '</option>').join('') + '</select>' : '<select disabled><option>' + esc(actorName(n)) + '</option></select>') + '</label>';
        h += '<div class="dz-f">Autonomy level' + (c ? ' <span class="dz-mini" style="font-weight:400">· agent ceiling ' + c.lv + (c.live ? ' (lowered live: ' + esc(c.status) + ')' : '') + '</span>' : '') +
          '<div class="dz-seg" role="group" aria-label="Autonomy level">' + ['L0', 'L1', 'L2', 'L3'].map((l) => '<button class="' + (l === n.level ? 'on' : '') + (c && LVN[l] > LVN[c.lv] ? ' over' : '') + '" data-action="nodeLevel" data-l="' + l + '" title="' + esc((CP.data.autonomy.find((a) => a.id === l) || {}).desc || '') + (c && LVN[l] > LVN[c.lv] ? ' Above the agent ceiling.' : '') + '"' + (n.lane === 'human' || n.lane === 'ext' ? ' disabled' : '') + '>' + l + '</button>').join('') + '</div></div>';
        const domTools = TOOLS.filter((t) => t.dom === n.lane || t.dom === 'orch' || (n.tools || []).indexOf(t.id) >= 0);
        const ag = CP.agent(n.agent);
        h += '<div class="dz-f">Tools the step may call <span class="dz-mini" style="font-weight:400">(amber: outside the agent manifest)</span><div class="dz-tools">' + (n.lane === 'human' ? '<span class="dz-mini">Human step: no tool, the platform prepares the context.</span>' : domTools.map((t) => {
          const off = ag && NATIVE.indexOf(t.id.split('.')[0]) < 0 && !(ag.tools || []).some((x) => x.split('.')[0] === t.id.split('.')[0]);
          return '<label class="' + (off ? 'w' : '') + '" title="' + esc(t.d + ' Risk ' + t.risk + ', default ' + t.lvl) + '"><input type="checkbox" data-change="nodeTool" data-tool="' + t.id + '"' + ((n.tools || []).indexOf(t.id) >= 0 ? ' checked' : '') + '>' + esc(t.id) + '</label>';
        }).join('')) + '</div></div>';
        h += '<div class="grid g2" style="gap:10px"><label class="dz-f">Timeout<select data-change="nodeField" data-f="timeout">' + TIMEOUTS.map((t) => '<option' + (t === n.timeout ? ' selected' : '') + '>' + t + '</option>').join('') + '</select></label>' +
          '<div class="dz-f">Expected duration<div class="dz-in" style="background:#f7f6fa">' + fmtDur(n.dur) + '</div></div></div>';
        h += '<label class="dz-f">Fallback if the step fails or times out<textarea id="dz-fb" data-node="' + esc(pb.id) + '" data-change="nodeCommit">' + esc(n.fallback || '') + '</textarea></label>';
      }
      /* Runs after (dependencies) */
      const desc = {}; const mark = (id) => { (F.succ[id] || []).forEach((s) => { if (!desc[s]) { desc[s] = true; mark(s); } }); }; mark(n.id);
      const cands = F.nodes.filter((x) => x.id !== n.id && !desc[x.id]);
      if (n.id !== F.start.id) h += '<div class="dz-f">Runs after<div class="dz-deps">' + cands.map((x) => '<label><input type="checkbox" data-change="nodeAfter" data-dep="' + esc(x.id) + '"' + (n.after.indexOf(x.id) >= 0 ? ' checked' : '') + '>' + (x.kind === 'gate' ? '◆ ' : '') + esc(x.title) + '</label>').join('') + '</div></div>';
      else h += '<div class="dz-mini">' + I('zap') + ' Trigger of the playbook: every other step derives from it.</div>';

      /* Policy that applies */
      if (r) {
        const dom = applies(n.policy).indexOf(n.lane) >= 0 ? n.lane : (r.domain === 'all' ? 'soc' : r.domain);
        const pl = polLv(P, n.policy, dom);
        const dec = P.dec[n.policy] || r.decider;
        const sa = saList(S).find((x) => x.pol === n.policy && x.agent === n.agent && x.status !== 'revoked');
        const c = n.agent ? ceiling(n.agent) : null;
        const eff = n.kind === 'gate' ? 'L1' : ['L0', 'L1', 'L2', 'L3'][Math.min(LVN[n.level], c ? LVN[c.lv] : 3)];
        const gated = n.kind !== 'gate' && LVN[eff] > LVN[pl] && !n.after.some((p) => { const g = F.byId[p]; return g && g.kind === 'gate' && g.policy === n.policy; }) && !(sa && sa.status !== 'suspended');
        h += '<div class="dz-pol"><div class="ttl">' + I('scale') + ' Policy that applies · DR-2026 v' + S.pol.ver + '</div>' +
          '<div><b>' + esc(r.action) + '</b></div>' +
          '<div class="row wrap" style="gap:6px">' + U.lvl(pl) + U.dom(dom === 'orch' ? 'orch' : dom) + (dec ? '<span class="small-txt">decision holder: <b>' + esc(pname(dec)) + '</b></span>' : '<span class="small-txt">agent alone below thresholds</span>') + '</div>' +
          '<div class="dz-mini">' + esc(r.why) + '</div>' +
          ((n.thr || []).length ? '<div class="dz-mini"><b style="color:var(--ink)">Thresholds that bring a human in:</b> ' + n.thr.map((k) => esc(THR_LABEL[k]) + ' (' + esc(((CP.data.thresholds || []).find((t) => t.k === THR_LABEL[k]) || {}).v || '') + ')').join('; ') + '</div>' : '') +
          (sa ? '<div class="dz-mini">' + I('key') + ' Standing approval <a href="#/design/approvals" data-action="openSa" data-id="' + sa.id + '">' + esc(sa.id) + '</a> (' + esc(sa.status) + ') covers this agent and action.</div>' : '') +
          '</div>' +
          (n.kind !== 'gate' && n.lane !== 'human' && n.lane !== 'ext' ? '<div class="dz-eff">' + I('shieldCheck') + '<span>At run time: ' + (gated ? 'the orchestrator <b>stops and asks the ' + esc(lc(pname(dec || 'p-chloe'))) + '</b> (policy ' + pl + ')' : 'executes at <b>' + eff + '</b> · ' + esc(((CP.data.autonomy || []).find((a) => a.id === eff) || {}).short || '')) + ', rollback point and trace kept.</span></div>' : '');
      } else if (n.kind !== 'gate' && n.lane !== 'human') {
        h += '<div class="dz-pol"><div class="ttl">' + I('scale') + ' Policy that applies</div><div class="dz-mini">No action on the information system: read, analysis or human work. Logged in the trace.</div></div>';
      }
      if (edited) h += '<button class="small" data-action="nodeReset">' + I('rollback') + ' Reset this step to v' + esc(currentVersion(pb).v) + '</button>';
      return h + '</div>';
    },

    resultsHtml(pb, F, iss, sim) {
      const S = this.ui;
      const shown = S.lintShown[pb.id];
      if (!shown && !sim) return '';
      let lintH = '';
      if (shown) {
        const e = iss.filter((x) => x.sev === 'error').length, w = iss.filter((x) => x.sev === 'warn').length, inf = iss.length - e - w;
        lintH = '<section><h3>' + I('checkCircle') + ' Validation · ' + esc(shown) + '</h3>' +
          '<div class="row wrap" style="gap:6px;margin-bottom:10px">' + (e ? '<span class="tag red">' + e + ' blocking</span>' : '<span class="tag green">0 blocking</span>') + '<span class="tag amber">' + w + ' warning' + (w !== 1 ? 's' : '') + '</span><span class="tag">' + inf + ' info</span><span class="dz-mini">Checks: reachability, gate fallbacks and holders, agent ceilings (live), policy levels, standing approvals, tool manifests</span></div>' +
          (iss.length ? '<div style="display:grid;gap:6px;max-height:300px;overflow:auto">' + iss.map((x) => '<button class="dz-issue ' + x.sev + '" data-action="selNode" data-id="' + esc(x.node) + '">' + I(x.sev === 'info' ? 'info' : 'alert') + '<span><b>' + esc(x.msg) + '</b><br><span class="muted">' + esc(x.fix) + '</span></span></button>').join('') + '</div>' : '<div class="notice ok">' + I('checkCircle') + ' Every step is reachable, every gate has a holder and a fallback, no level exceeds an agent ceiling or the policy.</div>') + '</section>';
      }
      let simH = '';
      if (sim) {
        const rows = sim.order.slice(0, sim.i + 1).map((o) => {
          const n = F.byId[o.id]; if (!n) return '';
          return '<div class="l"><span class="t">' + tplus(o.fin) + '</span><span class="' + (n.kind === 'gate' ? 'g' : '') + '">' + (n.kind === 'gate' ? '◆ ' + esc(pname(n.decider)) + ' decides: ' + esc(n.title) + ' (approve, expected ' + (P50[n.decider] || 10) + ' min)' : esc(actorName(n)) + ' · ' + esc(n.title) + ' · ' + n.level) + '</span><span class="d">' + fmtDur(n.dur) + '</span></div>';
        }).join('');
        let sum = '';
        if (!sim.running) {
          const gates = F.nodes.filter((n) => n.kind === 'gate' && n._reach);
          const writes = F.nodes.filter((n) => n._reach && (n.tools || []).some((t) => { const x = tool(t); return x && x.mode !== 'read'; })).length;
          const unreached = F.nodes.filter((n) => !n._reach).length;
          const e = iss.filter((x) => x.sev === 'error').length;
          sum = '<div class="dz-sum"><div><b>' + fmtDur(sim.total) + '</b><span>expected critical path</span></div><div><b>' + gates.length + '</b><span>human decisions: ' + esc(gates.map((g) => pname(g.decider)).join(', ') || 'none') + '</span></div><div><b>' + writes + '</b><span>steps that write, each with a rollback point</span></div><div><b style="color:' + (e || unreached ? 'var(--red-ink)' : 'var(--green-ink)') + '">' + (e + (unreached && !e ? unreached : 0)) + '</b><span>' + (unreached ? unreached + ' step(s) never reached' : 'policy violations on the twin') + '</span></div></div>';
        }
        simH = '<section><h3>' + I('sparkles') + ' Dry run on the digital twin ' + (sim.running ? '<span class="tag amber">running</span>' : '<span class="tag green">done</span>') + '</h3><div class="dz-simlog" aria-live="polite">' + (rows || '<div class="d">Starting the twin…</div>') + '</div>' + sum + '</section>';
      }
      return '<div class="dz-res"' + (lintH && simH ? '' : ' style="grid-template-columns:1fr"') + '>' + (lintH || '') + (simH || '') + '</div>';
    },

    versionsCard(pb) {
      const S = this.ui;
      const pubs = CP.store.get('playbookVersions').filter((x) => x.pb === pb.id);
      const items = pubs.map((x) => ({ v: x.version, when: x.ts, by: x.by, note: x.note, fresh: CP.store.isNew(x, 6000) })).concat((pb.versions || []).map((v) => ({ v: v[0], when: v[1], by: v[2], note: v[3] })));
      return U.card('Versions', '<div class="list dz-vlist">' + items.map((x, k) => '<div class="list-item' + (x.fresh ? ' new' : '') + '"><span class="mono" style="font-weight:700;min-width:42px">v' + esc(x.v) + '</span><div class="li-main"><div class="li-title" style="font-size:13px">' + esc(x.note) + '</div><div class="li-sub">' + esc(x.when) + ' · ' + esc(pname(x.by)) + '</div></div>' + (k === 0 ? U.status(pb.status === 'draft' ? 'draft' : 'live', pb.status === 'draft' ? 'Draft' : 'Current') : '') + '</div>').join('') + '</div>',
        { sub: 'Published versions run in shadow mode for 7 days before going live', style: 'padding:16px' });
    },

    runsCard(pb) {
      const live = pb.scenario ? CP.store.find('cases', CP.scenarioById(pb.scenario).caseId) : null;
      const rows = (live ? [[live.id, live.opened, live.status === 'closed' ? 'done' : 'running', '', live.status, true]] : []).concat(pb.lastRuns || []);
      return U.card('Last runs', rows.length ? '<div class="list dz-vlist">' + rows.map((r) => '<div class="list-item' + (r[5] ? ' new' : '') + '"><a class="mono" style="font-weight:700;min-width:62px" href="#/cases/' + esc(r[0]) + '">' + esc(r[0]) + '</a><div class="li-main"><div class="li-title" style="font-size:13px">' + esc(r[1]) + (r[2] ? ' · ' + esc(r[2]) : '') + (r[5] ? ' · live run' : '') + '</div><div class="li-sub">' + (r[3] !== '' ? r[3] + ' human decision' + (r[3] !== 1 ? 's' : '') : 'in progress') + '</div></div>' + U.status(r[4]) + '</div>').join('') + '</div>' : '<div class="empty">No run yet. Simulate it on the twin, then publish to shadow mode.</div>',
        { sub: 'Each run keeps its trace: steps, tools, decisions', style: 'padding:16px' });
    },

    /* ================= Policies ================= */
    r_policies() {
      const S = this.ui; const pol = S.pol;
      const cur = pol.current, dr = pol.draft;
      const diff = policyDiff(cur, dr);
      const locked = pol.stage !== 'draft';
      const dk = (i, d) => i + '|' + d;
      const stageIdx = { draft: 0, review: 1, sign: 2 }[pol.stage];
      const step = (k, title, who, txt) => '<div class="dz-step ' + (k < stageIdx ? 'done' : k === stageIdx ? 'cur' : '') + '"><span class="n">' + (k + 1) + ' / 4</span><b>' + esc(title) + '</b><div class="row" style="gap:6px">' + U.av(who, 'sm') + '<span class="dz-mini">' + esc(txt) + '</span></div></div>';
      let wfBtns = '';
      if (pol.stage === 'draft') wfBtns = '<button class="primary" data-action="polSubmit"' + (diff.length ? '' : ' disabled title="No change in the draft"') + '>' + I('send') + ' Submit to Trust & Challenge review</button><button data-action="polDiscard"' + (diff.length ? '' : ' disabled') + '>' + I('rollback') + ' Discard draft</button>';
      else if (pol.stage === 'review') wfBtns = '<button class="go" data-action="polReview">' + I('check') + ' Approve review (AI assurance lead)</button><button data-action="polChanges">' + I('message') + ' Request changes</button>';
      else wfBtns = '<button class="go" data-action="polSign">' + I('gavel') + ' Sign as CISO and activate</button><button data-action="polChanges">' + I('rollback') + ' Send back to draft</button>';
      const workflow = '<div class="dz-steps">' + step(0, 'Draft v' + (pol.ver + 1), 'p-raj', 'Platform manager edits, backtest attached') + step(1, 'Trust & Challenge review', 'p-jonas', 'AI assurance checks the backtest and evals') + step(2, 'CISO signature', 'p-elena', 'Signed policy becomes binding') + '<div class="dz-step"><span class="n">4 / 4</span><b>Active</b><div class="row" style="gap:6px">' + U.av('orchestrator', 'sm') + '<span class="dz-mini">Policy engine enforces it at the next decision</span></div></div></div>' +
        '<div class="dz-wf"><span class="small-txt"><b>Current: DR-2026 v' + pol.ver + '</b> · signed ' + esc(pol.history[0].when) + ' by the ' + esc(pname(pol.history[0].by)) + '</span><span class="small-txt">' + (diff.length ? '<b>' + diff.length + '</b> change' + (diff.length > 1 ? 's' : '') + ' in the draft' : 'Draft identical to current') + (locked ? ' · <span class="tag amber">locked during ' + (pol.stage === 'review' ? 'review' : 'signature') + '</span>' : '') + '</span>' + (pol.note ? '<span class="small-txt muted">' + esc(pol.note) + '</span>' : '') + '<span class="spacer"></span><span class="row wrap" style="gap:6px">' + wfBtns + '</span></div>';

      /* Matrix */
      const mx = '<div class="table-wrap"><table class="t dz-mx"><thead><tr><th>Action type</th>' + MX_DOMS.map((d) => '<th class="dm"><span class="dz-dm" style="justify-content:center"><i style="background:' + CP.domain(d).color + '"></i>' + esc(d === 'orch' ? 'Platform' : CP.domain(d).label.replace(' / VulnOps', '')) + '</span></th>').join('') + '<th>Decision holder</th><th>Why</th></tr></thead><tbody>' +
        CP.data.rights.map((r, i) => '<tr><td class="act"><b style="font-weight:600">' + esc(r.action) + '</b><div class="dz-mini">' + CP.fmt(PROFILE[i].n) + ' actions in 30 days</div></td>' +
          MX_DOMS.map((d) => {
            if (applies(i).indexOf(d) < 0) return '<td class="c"><span class="dz-na" aria-label="not applicable">·</span></td>';
            const v = polLv(dr, i, d), c = polLv(cur, i, d);
            return '<td class="c"><select class="dz-lv ' + v + (v !== c ? ' chg' : '') + '" data-change="polCell" data-k="' + dk(i, d) + '" aria-label="' + esc(r.action + ' · ' + CP.domain(d).label) + '"' + (locked ? ' disabled' : '') + ' title="' + (v !== c ? 'Current: ' + c : esc((CP.data.autonomy.find((a) => a.id === v) || {}).label || '')) + '">' + lvOpts(v) + '</select></td>';
          }).join('') +
          '<td><select class="dz-dec' + ((dr.dec[i] || '') !== (cur.dec[i] || '') ? ' chg' : '') + '" data-change="polDec" data-i="' + i + '" aria-label="Decision holder for ' + esc(r.action) + '"' + (locked ? ' disabled' : '') + '>' + decOpts(dr.dec[i], true) + '</select></td><td class="dz-mini" style="min-width:180px">' + esc(r.why) + '</td></tr>').join('') +
        '</tbody></table></div>';
      const matrix = U.card('Decision-rights matrix', mx, { sub: 'Action type × domain: autonomy level (L0 suggest · L1 on approval · L2 act and notify · L3 autonomous) and who decides when a human is needed. Amber: changed in the draft.', right: '<div class="dz-presets"><button class="small" data-action="polPreset" data-p="soc"' + (locked ? ' disabled' : '') + '>' + I('zap') + ' Preset: more SOC autonomy</button><button class="small" data-action="polPreset" data-p="tight"' + (locked ? ' disabled' : '') + '>' + I('lock') + ' Preset: tighten after S2</button></div>', style: 'padding:16px' });

      /* Thresholds */
      const t = dr.thr, tc = cur.thr;
      const ch = (k) => (t[k] !== tc[k] ? ' chg' : '');
      const dis = locked ? ' disabled' : '';
      const thr = '<div class="dz-thr">' +
        '<div class="r"><b>Blast radius</b><div class="ctl">More than <input id="dz-thr-users" type="number" min="1" max="10000" class="' + ch('users') + '" value="' + t.users + '" data-change="polThr" data-k="users" aria-label="Users"' + dis + '> users, <select class="' + ch('crit') + '" data-change="polThr" data-k="crit" aria-label="Critical business service"' + dis + '><option value="1"' + (t.crit ? ' selected' : '') + '>or 1 critical business service</option><option value="0"' + (!t.crit ? ' selected' : '') + '>critical services not counted</option></select></div></div>' +
        '<div class="r"><b>Reversibility</b><div class="ctl">No rollback in under <input id="dz-thr-rb" type="number" min="1" max="240" class="' + ch('rollback') + '" value="' + t.rollback + '" data-change="polThr" data-k="rollback" aria-label="Rollback minutes"' + dis + '> minutes</div></div>' +
        '<div class="r"><b>Confidence</b><div class="ctl">Agent confidence under <input id="dz-thr-conf" type="number" min="50" max="99" class="' + ch('conf') + '" value="' + t.conf + '" data-change="polThr" data-k="conf" aria-label="Confidence percent"' + dis + '> %, or two agents disagree</div></div>' +
        '<div class="r"><b>Exposure</b><div class="ctl"><select class="' + ch('exposure') + '" data-change="polThr" data-k="exposure" aria-label="Exposure"' + dis + '><option value="any"' + (t.exposure === 'any' ? ' selected' : '') + '>Any message leaving the group</option><option value="regulators"' + (t.exposure !== 'any' ? ' selected' : '') + '>Regulators and press only</option></select></div></div>' +
        '<div class="r"><b>Money</b><div class="ctl">Any action on payments, or an impact above €<input id="dz-thr-money" type="number" min="1" max="10000" class="' + ch('money') + '" value="' + t.money + '" data-change="polThr" data-k="money" aria-label="Money threshold in thousands"' + dis + '>k</div></div>' +
        '<div class="r"><b>Novelty</b><div class="ctl"><select class="' + ch('novelty') + '" data-change="polThr" data-k="novelty" aria-label="Novelty"' + dis + '><option value="1"' + (t.novelty ? ' selected' : '') + '>An action the agent never performed in production needs a human</option><option value="0"' + (!t.novelty ? ' selected' : '') + '>Not applied</option></select></div></div></div>';
      const diffH = diff.length ? '<div class="dz-diff">' + diff.map((d) => '<div class="d"><span>' + (d.kind === 'cell' ? esc(shortAct(d.i)) + ' · <b>' + esc(CP.domain(d.d).label) + '</b>' : d.kind === 'dec' ? esc(shortAct(d.i)) + ' · <b>decision holder</b>' : '<b>' + esc(d.label) + '</b> threshold') + '</span><span class="row" style="gap:6px"><span class="arrow">' + (d.kind === 'dec' ? esc(d.from ? pname(d.from) : 'agent alone') + ' → ' + esc(d.to ? pname(d.to) : 'agent alone') : d.kind === 'cell' ? d.from + ' → ' + d.to : esc(thrVal(d.from)) + ' → ' + esc(thrVal(d.to)) + (d.unit && typeof d.from === 'number' ? ' ' + esc(d.unit) : '')) + '</span>' + (d.dir ? '<span class="tag ' + (d.dir === 'looser' ? 'amber' : 'teal') + '">' + d.dir + '</span>' : '') + '</span></div>').join('') + '</div>'
        : '<div class="empty">Draft identical to the signed policy. Change a level, a decision holder or a threshold, or start from a preset: the backtest below updates at once.</div>';

      return U.head('Design · Decision rights', 'Who may act, at which level, above which threshold',
        'The decision-rights policy is what the orchestrator enforces before every action. Change it as a draft, see what it would have done over the last 30 days, have Trust & Challenge review it and the CISO sign it.',
        '<span class="tag outline">' + I('scale') + ' DR-2026 v' + pol.ver + ' active</span>') +
        workflow +
        '<div style="margin-top:18px">' + matrix + '</div>' +
        '<div class="grid g2" style="margin-top:18px">' + U.card('Thresholds', thr, { sub: 'Above any of these, an agent at L2 or L3 stops and asks the decision holder', style: 'padding:16px' }) +
        U.card('Draft vs current', diffH, { sub: 'Every change is versioned with its backtest', style: 'padding:16px' }) + '</div>' +
        this.backtestCard(cur, dr, diff) +
        U.card('Policy history', '<div class="list dz-vlist">' + pol.history.map((h, k) => '<div class="list-item' + (h.fresh && CP.store.isNew({ _new: h.fresh }, 6000) ? ' new' : '') + '"><span class="mono" style="font-weight:700;min-width:46px">v' + h.v + '</span><div class="li-main"><div class="li-title" style="font-size:13px">' + esc(h.name) + ' · ' + esc(h.note) + '</div><div class="li-sub">Signed ' + esc(h.when) + ' by the ' + esc(pname(h.by)) + (h.reviewer ? ' · reviewed by the ' + esc(pname(h.reviewer)) : ' · reviewed by Trust & Challenge') + '</div></div>' + (k === 0 ? U.status('active') : U.status('retired', 'Superseded')) + '</div>').join('') + '</div>', { style: 'padding:16px;margin-top:18px' });
    },

    backtestCard(cur, dr, diff) {
      const a = backtest(cur), b = backtest(dr);
      const dl = (x, y, fmt, goodDown) => {
        const d = y - x; if (Math.abs(d) < 0.05) return '<span class="dz-delta flat">no change</span>';
        const up = d > 0; return '<span class="dz-delta ' + ((up === goodDown) ? 'up' : 'down') + '">' + (up ? '+' : '−') + fmt(Math.abs(d)) + '</span>';
      };
      const perDay = (n) => n / 30;
      const roles = Array.from(new Set(Object.keys(a.byRole).concat(Object.keys(b.byRole)))).sort((x, y) => (b.byRole[y] || 0) - (b.byRole[x] || 0));
      const mxR = Math.max.apply(null, roles.map((r) => Math.max(a.byRole[r] || 0, b.byRole[r] || 0)).concat([1]));
      const roleRows = roles.map((r) => {
        const ca = perDay(a.byRole[r] || 0), cb = perDay(b.byRole[r] || 0);
        return '<div class="vs"><span>' + U.av(r, 'sm') + ' ' + esc(pname(r)) + '</span><div class="bars" title="Current ' + CP.fmt(ca, 1) + ' / day · draft ' + CP.fmt(cb, 1) + ' / day"><i style="width:' + ((a.byRole[r] || 0) / mxR * 100).toFixed(1) + '%"></i><i class="d" style="width:' + ((b.byRole[r] || 0) / mxR * 100).toFixed(1) + '%"></i></div><b>' + CP.fmt(cb, 1) + '<span class="dz-mini"> /d</span></b></div>';
      }).join('');
      const reasons = Object.keys(b.reasons).filter((k) => a.reasons[k] || b.reasons[k]).map((k) => ({ label: k === 'level' ? 'Level L0/L1' : THR_LABEL[k], value: b.reasons[k], display: CP.fmt(b.reasons[k]) + (b.reasons[k] !== a.reasons[k] ? ' (' + (b.reasons[k] > a.reasons[k] ? '+' : '−') + CP.fmt(Math.abs(b.reasons[k] - a.reasons[k])) + ')' : ''), color: k === 'level' ? 'var(--indigo)' : '#c8861a' }));
      const cells = Array.from(new Set(Object.keys(a.byCell).concat(Object.keys(b.byCell)))).map((k) => ({ k, i: +k.split('|')[0], d: k.split('|')[1], a: a.byCell[k] || 0, b: b.byCell[k] || 0 })).filter((x) => x.a !== x.b).sort((x, y) => Math.abs(y.b - y.a) - Math.abs(x.b - x.a)).slice(0, 6);
      const eur = (v) => '€' + (v >= 1e6 ? CP.fmt(v / 1e6, 2) + ' M' : CP.fmt(v / 1000) + 'k');
      const riskD = a.risk - b.risk;
      const body = (diff.length ? '' : '<div class="notice info" style="margin-bottom:14px">' + I('info') + ' The draft equals the signed policy, so both columns match. Change the matrix or a threshold, or click a preset, and the replay runs again over the same 30 days.</div>') +
        '<div class="metrics" style="margin-bottom:16px">' +
        U.metric({ label: 'Actions that would need a human', icon: 'users', value: CP.fmt(b.human), foot: dl(a.human, b.human, (v) => CP.fmt(v), true) + ' vs current ' + CP.fmt(a.human) + ' · of ' + CP.fmt(b.total) }) +
        U.metric({ label: 'Decision load per day', icon: 'clock', value: CP.fmt(perDay(b.human), 1), foot: dl(perDay(a.human), perDay(b.human), (v) => CP.fmt(v, 1), true) + ' per day across all decision holders' }) +
        U.metric({ label: 'Median time to contain', icon: 'hourglass', value: CP.fmt(b.ttcMed, 0), unit: 'min', foot: dl(a.ttcMed, b.ttcMed, (v) => CP.fmt(v, 1) + ' min', true) + ' · p90 ' + CP.fmt(b.ttcP90) + ' min (' + INC_N + ' incidents)' }) +
        U.metric({ label: 'Risk from wrong autonomous actions', icon: 'shield', value: eur(b.risk), foot: (Math.abs(riskD) < 500 ? '<span class="dz-delta flat">no change</span>' : riskD > 0 ? '<span class="dz-delta down">' + eur(riskD) + ' avoided</span>' : '<span class="dz-delta up">' + eur(-riskD) + ' accepted</span>') + ' · ' + b.bad + ' wrong actions unattended' }) +
        '</div>' +
        '<div class="grid g-3-2">' +
        '<div class="dz-bt"><h3 style="font-size:14px;margin-bottom:6px">Extra decision load per role and per day</h3><div class="dz-mini" style="margin-bottom:6px"><span style="display:inline-block;width:10px;height:8px;background:#cfc9dc"></span> current <span style="display:inline-block;width:10px;height:8px;background:var(--indigo);margin-left:8px"></span> draft</div>' + roleRows + '</div>' +
        '<div><h3 style="font-size:14px;margin-bottom:8px">Why a human is pulled in (draft, 30 days)</h3>' + U.hbars(reasons) +
        '<h3 style="font-size:14px;margin:16px 0 8px">Biggest changes</h3>' + (cells.length ? '<div class="dz-diff">' + cells.map((x) => '<div class="d"><span>' + esc(shortAct(x.i)) + ' · <b>' + esc(CP.domain(x.d).label) + '</b></span><span class="arrow">' + CP.fmt(x.a) + ' → ' + CP.fmt(x.b) + '</span></div>').join('') + '</div>' : '<div class="dz-mini">No action class changes with this draft.</div>') + '</div>' +
        '</div>' +
        '<div class="dz-mini" style="margin-top:12px">Replay of ' + CP.fmt(b.total) + ' agent actions recorded from 13 Sep to 12 Oct 2026 (action, domain, blast radius, rollback time, confidence, exposure, money, novelty). Wait times use each holder\'s median decision time, ×2.5 at night. Risk counts the harm of actions later found wrong by quality sampling; humans are assumed to catch 85% of the wrong actions they see.</div>';
      return U.card('Impact simulation · if this draft had applied over the last 30 days', body, { tour: 'design-policy-sim', sub: 'Backtest of the draft against the signed policy, on the real action history', style: 'padding:16px;margin-top:18px', cls: 'accent' });
    },

    /* ================= Standing approvals ================= */
    r_approvals() {
      const S = this.ui;
      const list = saList(S);
      const sel = list.find((x) => x.id === S.saSel) || list[0];
      const active = list.filter((x) => x.status === 'active' || x.status === 'expiring');
      const uses = active.reduce((a, x) => a + x.uses, 0);
      const cols = [
        { label: 'Standing approval', render: (x) => '<div class="dz-name">' + esc(x.title) + '</div><div class="dz-mini"><span class="dz-id">' + esc(x.id) + '</span> · ' + esc((CP.agent(x.agent) || {}).name || '') + ' · <span class="mono">' + esc(x.tool) + '</span></div>' },
        { label: 'Holder', render: (x) => '<span class="row" style="gap:6px;white-space:nowrap">' + U.av(x.holder, 'sm') + '<span class="small-txt" style="font-weight:600">' + esc(pname(x.holder)) + '</span></span>' },
        { label: 'Expiry', render: (x) => '<span class="num" style="white-space:nowrap">' + esc(dateAfter(x.expDays).replace(/^\w+ /, '')) + '</span><div class="dz-mini">' + (x.status === 'revoked' ? 'revoked' : 'in ' + x.expDays + ' days') + '</div>' },
        { label: 'Uses', render: (x) => '<span class="num" style="font-weight:650">' + CP.fmt(x.uses) + '</span>' },
        { label: 'Last used', render: (x) => '<span class="small-txt">' + esc(x.last) + '</span>' + (x.fresh ? ' <span class="tag neon">just now</span>' : '') },
        { label: 'Status', render: (x) => x.status === 'expiring' ? U.status('at-risk', 'Expiring') : x.status === 'suspended' ? U.status('suspended') : x.status === 'revoked' ? U.status('rejected', 'Revoked') : U.status('active') }
      ];
      const table = U.table(cols, list, { rowAttrs: (x) => 'data-action="selSa" data-key-action="selSa" data-id="' + x.id + '" tabindex="0"', rowClass: (x) => 'clickable dz-tr' + (x.id === sel.id ? ' sel' : '') + (x.fresh ? ' new' : '') });
      const spark = []; { const r = rng(sel.id.charCodeAt(3) * 97 + sel.uses); for (let k = 0; k < 12; k++) spark.push(Math.max(0, Math.round(sel.uses / 26 * (0.5 + r())))); }
      const r = rightsRow(sel.pol);
      const usedIn = pbList(S).filter((p) => flow(S, p).nodes.some((n) => n.agent === sel.agent && (n.tools || []).indexOf(sel.tool) >= 0));
      const detail = '<section class="card dz-panel" style="padding:16px"><div class="row wrap" style="gap:6px;margin-bottom:6px"><span class="dz-id">' + esc(sel.id) + '</span>' + (sel.status === 'expiring' ? U.status('at-risk', 'Expiring in ' + sel.expDays + ' days') : U.status(sel.status === 'revoked' ? 'rejected' : sel.status, sel.status === 'revoked' ? 'Revoked' : null)) + (sel.scn ? '<span class="tag outline">Used by S3</span>' : '') + '</div>' +
        '<h2 style="font-size:17px;margin-bottom:8px">' + esc(sel.title) + '</h2>' +
        (sel.why ? '<div class="notice error" style="margin-bottom:10px">' + esc(sel.why) + '</div>' : '') +
        '<p class="small-txt" style="margin:0 0 10px">' + esc(sel.scope) + '</p>' +
        '<dl class="kv" style="margin:0 0 12px"><dt>Agent</dt><dd>' + esc((CP.agent(sel.agent) || {}).name || '') + '</dd><dt>Tool</dt><dd class="mono">' + esc(sel.tool) + '</dd><dt>Holder</dt><dd>' + esc(pname(sel.holder)) + '</dd><dt>Granted</dt><dd>' + esc(sel.granted) + '</dd><dt>Expires</dt><dd>' + esc(dateAfter(sel.expDays)) + '</dd><dt>Review</dt><dd>' + esc(sel.review || 'Quarterly') + '</dd>' + (r ? '<dt>Overrides</dt><dd>' + esc(r.action) + ' (policy ' + esc(r.level) + ')</dd>' : '') + '</dl>' +
        '<div class="eyebrow" style="margin-bottom:4px">Limits enforced by the policy engine</div><ul class="dz-lim">' + sel.limits.map((l) => '<li>' + esc(l) + '</li>').join('') + '</ul>' +
        '<div class="row between" style="margin:14px 0 4px"><span class="eyebrow" style="margin:0">Uses, last 12 weeks</span><span class="num" style="font-weight:650">' + CP.fmt(sel.uses) + ' decisions not asked</span></div>' + U.spark(spark, { w: 300, h: 40 }) +
        '<div class="dz-mini" style="margin-top:8px">Playbooks relying on it: ' + (usedIn.length ? usedIn.map((p) => '<a href="#/design/playbooks?pb=' + p.id + '">' + esc(p.name) + '</a>').join(', ') : 'none') + '</div>' +
        '<div class="row wrap" style="gap:6px;margin-top:14px">' + (sel.status !== 'revoked' ? '<button class="primary" data-action="saRenew" data-id="' + sel.id + '">' + I('restart') + ' Renew 90 days</button>' + (sel.status === 'suspended' ? '<button data-action="saResume" data-id="' + sel.id + '">' + I('play') + ' Resume after fix</button>' : '') + '<button class="danger" data-action="saRevoke" data-id="' + sel.id + '">' + I('x') + ' Revoke</button>' : '<button data-action="saRenew" data-id="' + sel.id + '">' + I('restart') + ' Re-grant for 90 days</button>') + '</div></section>';

      return U.head('Design · Standing approvals', 'Decide once for a class of actions, not every time',
        'A standing approval is a decision right granted in advance by its holder, for one agent, one action and strict limits, with an expiry. The policy engine checks the limits at every use; Trust & Challenge reviews the uses. This is how S3\'s supplier requests left at once.',
        '<button class="primary" data-action="saNew">' + I('key') + ' New standing approval</button>') +
        '<div class="metrics" style="margin-bottom:18px">' +
        U.metric({ label: 'Active standing approvals', icon: 'key', value: active.length, foot: list.length + ' in the register' }) +
        U.metric({ label: 'Decisions not asked (lifetime)', icon: 'users', value: CP.fmt(uses), foot: 'each use traced and sampled' }) +
        U.metric({ label: 'Expiring within 14 days', icon: 'hourglass', value: list.filter((x) => x.status === 'expiring').length, color: 'var(--amber)', foot: 'renew or let lapse: the default is lapse' }) +
        U.metric({ label: 'Suspended or revoked', icon: 'power', value: list.filter((x) => x.status === 'suspended' || x.status === 'revoked').length, color: list.some((x) => x.status === 'suspended') ? 'var(--red-ink)' : null, foot: 'deviation hunt can suspend automatically' }) +
        '</div>' +
        '<div class="grid dz-wide"><div>' + U.card('Register', table, { style: 'padding:16px' }) + '</div>' + detail + '</div>';
    },

    /* ================= Catalogue ================= */
    r_catalogue() {
      const S = this.ui;
      const q = (S.catQ || '').toLowerCase();
      const RK = { critical: 0, high: 1, medium: 2, low: 3 };
      const list = TOOLS.slice().sort((a, b) => RK[a.risk] - RK[b.risk] || (a.mode === 'read') - (b.mode === 'read') || a.id.localeCompare(b.id)).filter((t) => (S.catRisk === 'all' || t.risk === S.catRisk) && (S.catMode === 'all' || t.mode === S.catMode) && (S.catDom === 'all' || t.dom === S.catDom) && (!q || (t.id + ' ' + t.d + ' ' + t.conn).toLowerCase().indexOf(q) >= 0));
      const sel = tool(S.tool) || TOOLS[0];
      const agentsUsing = (t) => CP.store.get('agents').filter((a) => (a.tools || []).some((x) => x.split('.')[0] === t.id.split('.')[0]) || NATIVE.indexOf(t.id.split('.')[0]) >= 0 && (a.tools || []).some((x) => x === t.id));
      const pbsUsing = (t) => pbList(S).filter((p) => flow(S, p).nodes.some((n) => (n.tools || []).indexOf(t.id) >= 0));
      const cols = [
        { label: 'Tool / action', render: (t) => '<div class="mono" style="font-weight:700;font-size:12.5px">' + esc(t.id) + '</div><div class="dz-mini" style="max-width:300px">' + esc(t.conn) + '</div>' },
        { label: 'Mode', render: (t) => '<span class="dz-chip' + (t.mode === 'external' ? ' x' : t.mode === 'write' ? ' w' : '') + '">' + esc(t.mode) + '</span>' },
        { label: 'Risk class', render: (t) => '<span class="dz-risk"><i style="background:' + RISK_C[t.risk] + '"></i>' + esc(t.risk[0].toUpperCase() + t.risk.slice(1)) + '</span>' },
        { label: 'Reversibility', render: (t) => '<span class="small-txt">' + esc(t.rev === 'n/a' ? 'read only' : t.rev) + '</span>' },
        { label: 'Default', render: (t) => '<span class="dz-l ' + t.lvl + '" title="' + esc((CP.data.autonomy.find((a) => a.id === t.lvl) || {}).label || '') + '">' + t.lvl + '</span>' },
        { label: 'Executor', render: (t) => '<span class="small-txt">' + esc(t.exec) + '</span>' },
        { label: 'Calls 30 d', render: (t) => '<span class="num">' + CP.fmt(t.calls) + '</span>' }
      ];
      const table = U.table(cols, list, { rowAttrs: (t) => 'data-action="selTool" data-key-action="selTool" data-id="' + t.id + '" tabindex="0"', rowClass: (t) => 'clickable dz-tr' + (t.id === sel.id ? ' sel' : ''), empty: 'No tool matches these filters.', max: 720 });
      const r = rightsRow(sel.pol);
      const ags = agentsUsing(sel), pbs = pbsUsing(sel);
      const manifest = 'tool: ' + sel.id + '\nconnector: "' + sel.conn + '"\nmode: ' + sel.mode + '\nrisk_class: ' + sel.risk + '\ndefault_level: ' + sel.lvl + '\nexecutor: "' + sel.exec + '"\nreversibility: ' + sel.rev + '\nrollback: "' + sel.rb + '"\n' + (r ? 'policy_row: "' + r.action + '"\n' : '') + 'guardrails:\n' + (sel.guard.length ? sel.guard.map((g) => '  - "' + g + '"').join('\n') : '  - "Scoped token, least privilege"') + '\nlogging: full trace (inputs, outputs, decision, rollback point)';
      const detail = '<section class="card dz-panel" style="padding:16px"><div class="row wrap" style="gap:6px;margin-bottom:6px"><span class="dz-risk"><i style="background:' + RISK_C[sel.risk] + '"></i>' + esc(sel.risk) + ' risk</span>' + U.lvl(sel.lvl) + '<span class="dz-chip' + (sel.mode === 'external' ? ' x' : sel.mode === 'write' ? ' w' : '') + '">' + esc(sel.mode) + '</span></div>' +
        '<h2 class="mono" style="font-size:16px;margin-bottom:6px">' + esc(sel.id) + '</h2><p class="small-txt" style="margin:0 0 12px">' + esc(sel.d) + '</p>' +
        U.code(manifest, 'yaml') +
        '<div class="eyebrow" style="margin:14px 0 6px">Agents holding it (' + ags.length + ')</div><div class="row wrap" style="gap:6px">' + (ags.length ? ags.map((a) => '<a class="dz-chip" href="#/build/catalog" title="' + esc(a.name) + '">' + esc(a.name) + '</a>').join('') : '<span class="dz-mini">Orchestrator only</span>') + '</div>' +
        '<div class="eyebrow" style="margin:14px 0 6px">Playbooks calling it (' + pbs.length + ')</div><div class="dz-mini">' + (pbs.length ? pbs.map((p) => '<a href="#/design/playbooks?pb=' + p.id + '">' + esc(p.name) + '</a>').join(' · ') : 'Not used in a playbook yet') + '</div>' +
        (r ? '<div class="dz-pol" style="margin-top:14px"><div class="ttl">' + I('scale') + ' Decision right</div><div><b>' + esc(r.action) + '</b></div><div class="row wrap" style="gap:6px">' + U.lvl(polLv(S.pol.current, sel.pol, applies(sel.pol)[0])) + (r.decider ? '<span class="small-txt">holder: <b>' + esc(pname(S.pol.current.dec[sel.pol] || r.decider)) + '</b></span>' : '') + '</div><a class="small-txt" href="#/design/policies">Edit in Decision rights</a></div>' : '') +
        '</section>';
      const doms = ['orch'].concat(AGENT_DOMS).concat(['trust']);
      const filters = '<div class="dz-filters"><label class="sr" for="dz-cat-q">Search tools</label><input id="dz-cat-q" type="search" placeholder="Search tools, connectors…" value="' + esc(S.catQ) + '">' +
        '<select data-change="catF" data-k="catMode" aria-label="Mode"><option value="all">All modes</option>' + ['read', 'write', 'external'].map((m) => '<option' + (S.catMode === m ? ' selected' : '') + '>' + m + '</option>').join('') + '</select>' +
        '<select data-change="catF" data-k="catRisk" aria-label="Risk class"><option value="all">All risk classes</option>' + ['low', 'medium', 'high', 'critical'].map((m) => '<option' + (S.catRisk === m ? ' selected' : '') + '>' + m + '</option>').join('') + '</select>' +
        '<select data-change="catF" data-k="catDom" aria-label="Domain"><option value="all">All domains</option>' + doms.map((d) => '<option value="' + d + '"' + (S.catDom === d ? ' selected' : '') + '>' + esc(d === 'orch' ? 'Platform' : CP.domain(d).label) + '</option>').join('') + '</select>' +
        '<span class="dz-mini">' + list.length + ' of ' + TOOLS.length + '</span></div>';
      const counts = { read: TOOLS.filter((t) => t.mode === 'read').length, write: TOOLS.filter((t) => t.mode === 'write').length, ext: TOOLS.filter((t) => t.mode === 'external').length, crit: TOOLS.filter((t) => t.risk === 'critical' || t.risk === 'high').length };
      return U.head('Design · Tools & actions', 'Everything an agent can do, and how risky it is',
        'Agents never touch a system directly: they call catalogued tools through connectors, and every write goes through the secure executor with a rollback point. Each tool carries a risk class, its reversibility and a default autonomy level that the decision-rights policy can only lower.',
        '<button data-action="toolRequest">' + I('plug') + ' Request a new tool</button>') +
        '<div class="metrics" style="margin-bottom:18px">' +
        U.metric({ label: 'Read tools', icon: 'search', value: counts.read, foot: 'L3 by default, scoped by domain' }) +
        U.metric({ label: 'Write tools', icon: 'zap', value: counts.write, foot: 'through the secure executor' }) +
        U.metric({ label: 'External communication', icon: 'send', value: counts.ext, foot: 'cannot be unsent: human or template' }) +
        U.metric({ label: 'High or critical risk', icon: 'alert', value: counts.crit, color: 'var(--red-ink)', foot: 'L1 or L2 by default' }) +
        '</div>' +
        '<div class="grid dz-wide"><div>' + U.card('Catalogue', filters + table, { style: 'padding:16px' }) + '</div>' + detail + '</div>';
    },

    /* ================================================================
       Actions
       ================================================================ */
    actions: {
      selPb(el) {
        const S = this.ui; S.pb = el.dataset.id; S._qpb = el.dataset.id;
        if (S.sim && S.sim.pb !== S.pb && S.sim.running) this.actions.simStop.call(this);
        CP.go('design', 'playbooks', { pb: S.pb });
        setTimeout(() => { const d = document.querySelector('[data-tour="design-flow"]'); if (d && d.getBoundingClientRect().top > window.innerHeight * 0.55) d.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 40);
      },
      selNode(el) {
        const S = this.ui; S.sel[S.pb] = el.dataset.id;
        if (el.classList.contains('dz-issue')) S._scrollTo = el.dataset.id;
        CP.render();
        if (window.innerWidth < 1100 && el.classList.contains('dz-node')) setTimeout(() => { const ins = document.querySelector('.dz-insp'); if (ins) ins.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 30);
      },
      nodeField(el) { const S = this.ui; this.setEdit(S.pb, { [el.dataset.f]: el.value }, S.sel[S.pb]); CP.render(); },
      nodeLevel(el) { const S = this.ui; this.setEdit(S.pb, { level: el.dataset.l }, S.sel[S.pb]); CP.render(); },
      nodeCommit(el) { const S = this.ui; this.setEdit(S.pb, { fallback: el.value }, S.sel[S.pb]); S._focus = null; CP.render(); },
      nodeTool(el) {
        const S = this.ui; const F = flow(S, pbById(S, S.pb)); const n = F.byId[S.sel[S.pb]];
        const tools = (n.tools || []).slice(); const t = el.dataset.tool; const i = tools.indexOf(t);
        if (el.checked && i < 0) tools.push(t); if (!el.checked && i >= 0) tools.splice(i, 1);
        this.setEdit(S.pb, { tools }, n.id); CP.render();
      },
      nodeAfter(el) {
        const S = this.ui; const F = flow(S, pbById(S, S.pb)); const n = F.byId[S.sel[S.pb]];
        const after = n.after.slice(); const d = el.dataset.dep; const i = after.indexOf(d);
        if (el.checked && i < 0) after.push(d); if (!el.checked && i >= 0) after.splice(i, 1);
        this.setEdit(S.pb, { after }, n.id);
        if (!after.length) CP.toast('This step no longer runs after anything: it is unreachable. Validate will block publishing.', 'warn');
        CP.render();
      },
      nodeReset() { const S = this.ui; const ed = S.edits[S.pb]; if (ed) { delete ed[S.sel[S.pb]]; if (!Object.keys(ed).length) delete S.edits[S.pb]; } CP.toast('Step reset to the published version.'); CP.render(); },
      validate() {
        const S = this.ui; const pb = pbById(S, S.pb); const iss = lint(S, flow(S, pb));
        S.lintShown[pb.id] = 'checked ' + (CP.clock ? CP.clock.label() : '');
        const e = iss.filter((x) => x.sev === 'error').length, w = iss.filter((x) => x.sev === 'warn').length;
        CP.toast(e ? 'Validation: ' + e + ' blocking issue(s), ' + w + ' warning(s). Click an issue to jump to the step.' : 'Validation passed: 0 blocking, ' + w + ' warning(s).', e ? 'err' : '');
        CP.render();
        setTimeout(() => { const r = document.querySelector('.dz-res'); if (r) r.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 40);
      },
      simulate() {
        const S = this.ui; const pb = pbById(S, S.pb); const F = flow(S, pb);
        const order = F.nodes.filter((n) => n._reach).map((n) => ({ id: n.id, fin: n._fin, st: n._start })).sort((a, b) => a.fin - b.fin || a.st - b.st);
        if (S._simT) clearTimeout(S._simT);
        S.sim = { pb: pb.id, order, i: -1, running: true, total: Math.max.apply(null, order.map((o) => o.fin)) };
        const tick = () => {
          const sim = S.sim; if (!sim || !sim.running) return;
          if (CP.route.id !== 'design') { sim.running = false; return; }
          sim.i++;
          if (sim.i >= sim.order.length) { sim.i = sim.order.length - 1; sim.running = false; CP.render(); const gs = F.nodes.filter((n) => n.kind === 'gate' && n._reach).length; CP.toast('Dry run complete: critical path ' + fmtDur(sim.total) + ', ' + gs + ' human decision(s), no action left the twin.'); return; }
          const n = F.byId[sim.order[sim.i].id];
          if (n) S._scrollTo = n.id;
          CP.render();
          S._simT = setTimeout(tick, n && n.kind === 'gate' ? 1100 : Math.max(320, Math.min(650, 7000 / sim.order.length)));
        };
        CP.toast('Dry run started on the digital twin: no action reaches production.');
        tick();
      },
      simStop() { const S = this.ui; if (S._simT) clearTimeout(S._simT); if (S.sim) S.sim.running = false; CP.render(); },
      simClear() { const S = this.ui; if (S._simT) clearTimeout(S._simT); S.sim = null; CP.render(); },
      publish() {
        const S = this.ui; const pb = pbById(S, S.pb); const iss = lint(S, flow(S, pb));
        const e = iss.filter((x) => x.sev === 'error');
        if (e.length) { S.lintShown[pb.id] = 'checked ' + (CP.clock ? CP.clock.label() : ''); CP.toast('Publish blocked: ' + e.length + ' blocking issue(s). Fix them first (see Validation).', 'err'); CP.render(); return; }
        const ver = currentVersion(pb); const nv = vbump(ver.v);
        const ed = S.edits[pb.id] || {}; const changed = Object.keys(ed);
        const F = flow(S, pb);
        const autoChange = changed.some((id) => ed[id].level);
        const w = iss.filter((x) => x.sev === 'warn').length;
        CP.modal(I('rocket') + ' Publish ' + esc(pb.name) + ' v' + esc(nv),
          '<dl class="kv" style="margin-bottom:12px"><dt>From</dt><dd>v' + esc(ver.v) + '</dd><dt>Changes</dt><dd>' + (changed.length ? changed.map((id) => esc((F.byId[id] || {}).title || id) + ' (' + Object.keys(ed[id]).join(', ') + ')').join('<br>') : 'No step changed: republish with the current policy') + '</dd><dt>Lint</dt><dd>0 blocking · ' + w + ' warning(s)</dd><dt>Rollout</dt><dd>Shadow mode for 7 days (the playbook runs on real triggers but its actions stay on the twin), then live</dd><dt>Sign-off</dt><dd>' + (autoChange ? 'Autonomy changed: product owner and Trust & Challenge sign-off required' : 'Product owner') + '</dd></dl>' +
          '<div class="notice info">' + I('info') + ' A shadow-run item is added to the Build backlog and the version is kept in the playbook history with its validation report.</div>',
          '<button data-close-modal>Cancel</button><button class="primary" data-action="publishConfirm">' + I('rocket') + ' Publish v' + esc(nv) + '</button>');
      },
      publishConfirm() {
        const S = this.ui; const pb = pbById(S, S.pb); const ver = currentVersion(pb); const nv = vbump(ver.v);
        const ed = S.edits[pb.id] || {}; const n = Object.keys(ed).length;
        const bl = CP.store.get('backlog'); let mx = 329; bl.forEach((b) => { const m = String(b.id).match(/^B-(\d+)$/); if (m) mx = Math.max(mx, +m[1]); });
        const bid = 'B-' + (mx + 1);
        CP.store.apply([
          { op: 'add', coll: 'playbookVersions', item: { id: 'PV-' + pb.id + '-' + nv, pb: pb.id, version: nv, by: 'p-raj', ts: CP.clock ? CP.clock.label() : 'Tue', note: n ? n + ' step change(s) published, shadow mode 7 days' : 'Republished against DR-2026 v' + S.pol.ver } },
          { op: 'add', coll: 'backlog', item: { id: bid, title: 'Shadow run: playbook "' + pb.name + '" v' + nv + ' (7 days, then live)', domain: pb.domains[0], type: 'playbook', from: 'build', priority: 'medium', status: 'in-progress', effort: 'S' } }
        ]);
        CP.feed({ actor: 'p-raj', domain: 'human', level: 'info', text: 'published playbook "' + pb.name + '" v' + nv + ' to shadow mode (' + bid + ').' });
        delete S.edits[pb.id];
        CP.closeModal();
        CP.toast('Published v' + nv + ': shadow mode for 7 days. ' + bid + ' added to the Build backlog.');
      },
      drill() {
        const S = this.ui; const pb = pbById(S, S.pb); const id = pb.scenario || (PBS.find((p) => p.id === pb.flowFrom) || {}).scenario;
        if (!id || !CP.player) return;
        if (S._simT) clearTimeout(S._simT); if (S.sim) S.sim.running = false;
        CP.player.load(id, { autoplay: true });
        CP.toast('Drill started: ' + pb.name + ' runs as ' + CP.scenarioById(id).n + ' on the architecture view.');
        CP.go('arch-simple');
      },
      duplicate() {
        const S = this.ui; const pb = pbById(S, S.pb);
        const id = 'pb-copy-' + (S.custom.length + 1);
        const base = PBS.find((p) => p.id === (pb.flowFrom || pb.id));
        const copy = Object.assign({}, base, { id, flowFrom: base.id, name: pb.name + ' (copy)', status: 'draft', version: '0.1', runs: 0, shadow: 0, median: 'n/a', dpr: 0, edit: ['Tue 13 Oct', 'p-raj'], owner: 'p-raj', versions: [['0.1', 'Tue 13 Oct', 'p-raj', 'Duplicated from ' + pb.name + ' v' + currentVersion(pb).v]], lastRuns: [], scenario: base.scenario });
        S.custom.push(copy);
        if (S.edits[pb.id]) S.edits[id] = CP.clone(S.edits[pb.id]);
        S.pb = id; S._qpb = id;
        CP.toast('Draft created: ' + copy.name + '. Edit it, validate it, then publish to shadow mode.');
        CP.go('design', 'playbooks', { pb: id });
      },
      openSa(el) { this.ui.saSel = el.dataset.id; CP.go('design', 'approvals'); },

      /* policies */
      polCell(el) { const S = this.ui; S.pol.draft.cells[el.dataset.k] = el.value; CP.render(); },
      polDec(el) { const S = this.ui; S.pol.draft.dec[+el.dataset.i] = el.value; CP.render(); },
      polThr(el) {
        const S = this.ui; const k = el.dataset.k; let v = el.value;
        if (k === 'crit' || k === 'novelty') v = v === '1';
        else if (k !== 'exposure') { v = Math.round(+v); if (!isFinite(v) || v <= 0) { CP.toast('Enter a positive number.', 'warn'); CP.render(); return; } }
        S.pol.draft.thr[k] = v; CP.render();
      },
      polPreset(el) {
        const S = this.ui; const d = S.pol.draft;
        if (el.dataset.p === 'soc') {
          d.cells['9|soc'] = 'L2'; d.cells['8|soc'] = 'L2'; d.cells['3|soc'] = 'L3'; d.thr.conf = 80;
          CP.toast('Preset applied: production isolation and emergency patch at L2 for SOC, detection rules at L3, confidence floor 80%.');
        } else {
          d.thr.users = 20; d.thr.conf = 90; d.thr.money = 50; d.cells['4|appsec'] = 'L1';
          CP.toast('Preset applied: blast radius 20 users, confidence floor 90%, money €50k, WAF virtual patches back to L1.');
        }
        CP.render();
      },
      polDiscard() { const S = this.ui; S.pol.draft = CP.clone(S.pol.current); S.pol.note = ''; CP.toast('Draft discarded: identical to the signed policy again.'); CP.render(); },
      polSubmit() {
        const S = this.ui; const n = policyDiff(S.pol.current, S.pol.draft).length; if (!n) return;
        const a = backtest(S.pol.current), b = backtest(S.pol.draft);
        S.pol.stage = 'review'; S.pol.note = 'Backtest attached: ' + (b.human - a.human >= 0 ? '+' : '') + CP.fmt(b.human - a.human) + ' human decisions over 30 days, median time to contain ' + CP.fmt(b.ttcMed, 0) + ' min.';
        CP.feed({ actor: 'p-raj', domain: 'human', level: 'info', text: 'submitted decision-rights draft v' + (S.pol.ver + 1) + ' (' + n + ' changes) to Trust & Challenge review.' });
        CP.toast('Draft v' + (S.pol.ver + 1) + ' sent to the AI assurance lead with its backtest.');
        CP.render();
      },
      polReview() {
        const S = this.ui; S.pol.stage = 'sign'; S.pol.reviewer = 'p-jonas';
        CP.feed({ actor: 'p-jonas', domain: 'trust', level: 'info', text: 'approved the review of decision-rights draft v' + (S.pol.ver + 1) + ': backtest and evals consistent.' });
        CP.toast('Review approved by Trust & Challenge. Waiting for the CISO signature.');
        CP.render();
      },
      polChanges() { const S = this.ui; S.pol.stage = 'draft'; S.pol.note = 'Changes requested: tighten the rationale of each looser cell.'; CP.toast('Draft sent back for changes; editing unlocked.', 'warn'); CP.render(); },
      polSign() {
        const S = this.ui; const pol = S.pol; const n = policyDiff(pol.current, pol.draft).length;
        pol.ver++; pol.current = CP.clone(pol.draft); pol.stage = 'draft';
        pol.history.unshift({ v: pol.ver, name: 'DR-2026.' + (pol.ver - 9), when: 'Tue 13 Oct 2026', by: 'p-elena', reviewer: pol.reviewer || 'p-jonas', note: n + ' change(s) signed with a 30-day backtest', fresh: Date.now() });
        pol.note = '';
        CP.feed({ actor: 'p-elena', domain: 'human', level: 'decision', text: 'signed decision-rights policy DR-2026 v' + pol.ver + ': enforced by the orchestrator from now on.' });
        CP.toast('Policy v' + pol.ver + ' signed and active. Playbook lint now checks against it.');
        CP.render();
      },

      /* standing approvals */
      selSa(el) { this.ui.saSel = el.dataset.id; CP.render(); },
      saRenew(el) {
        const S = this.ui; const x = S.sa.find((s) => s.id === el.dataset.id); if (!x) return;
        const wasRevoked = x.status === 'revoked';
        x.expDays = (wasRevoked ? 0 : Math.max(0, x.expDays)) + 90; x.status = 'active'; x.manual = x.manual || false;
        CP.feed({ actor: x.holder, domain: 'human', level: 'decision', text: (wasRevoked ? 're-granted' : 'renewed') + ' standing approval ' + x.id + ' until ' + dateAfter(x.expDays) + '.' });
        CP.toast(x.id + ' ' + (wasRevoked ? 're-granted' : 'renewed') + ' until ' + dateAfter(x.expDays) + ' (signed by the ' + lc(pname(x.holder)) + ').');
        CP.render();
      },
      saResume(el) {
        const S = this.ui; const x = S.sa.find((s) => s.id === el.dataset.id); if (!x) return;
        x.manual = true; x.status = 'active';
        CP.toast(x.id + ' resumed by the ' + lc(pname(x.holder)) + ' after the fix.');
        CP.render();
      },
      saRevoke(el) {
        const x = this.ui.sa.find((s) => s.id === el.dataset.id); if (!x) return;
        CP.modal(I('alert') + ' Revoke ' + esc(x.id) + '?', '<p style="margin-top:0">' + esc(x.title) + '</p><p class="small-txt">From now on every use goes back to the decision holder (' + esc(pname(x.holder)) + '): about <b>' + Math.max(1, Math.round(x.uses / 26)) + '</b> extra decisions per week at the current pace. Playbooks relying on it will show a lint warning.</p>',
          '<button data-close-modal>Cancel</button><button class="danger" data-action="saRevokeConfirm" data-id="' + esc(x.id) + '">' + I('x') + ' Revoke now</button>');
      },
      saRevokeConfirm(el) {
        const S = this.ui; const x = S.sa.find((s) => s.id === el.dataset.id); if (!x) return;
        x.status = 'revoked'; x.manual = true;
        CP.feed({ actor: x.holder, domain: 'human', level: 'decision', text: 'revoked standing approval ' + x.id + ': ' + x.title + '.' });
        CP.closeModal(); CP.toast(x.id + ' revoked. Each use now needs the ' + lc(pname(x.holder)) + '.', 'warn'); CP.render();
      },
      saNew() {
        const agents = CP.store.get('agents');
        const writes = TOOLS.filter((t) => t.mode !== 'read');
        CP.modal(I('key') + ' New standing approval',
          '<div class="grid g2" style="gap:12px"><label class="dz-f" style="grid-column:1/-1">Title<input id="dz-sa-title" placeholder="e.g. Block phishing domains reported by 3 or more users"></label>' +
          '<label class="dz-f">Agent<select id="dz-sa-agent">' + agents.map((a) => '<option value="' + a.id + '">' + esc(a.name) + '</option>').join('') + '</select></label>' +
          '<label class="dz-f">Action (tool)<select id="dz-sa-tool">' + writes.map((t) => '<option value="' + t.id + '">' + esc(t.id) + ' · ' + t.risk + '</option>').join('') + '</select></label>' +
          '<label class="dz-f">Holder (signs it)<select id="dz-sa-holder">' + decOpts('p-chloe') + '</select></label>' +
          '<label class="dz-f">Expiry<select id="dz-sa-exp"><option value="30">30 days</option><option value="90" selected>90 days</option><option value="180">180 days (maximum)</option></select></label>' +
          '<label class="dz-f" style="grid-column:1/-1">Limits (one per line, enforced by the policy engine)<textarea id="dz-sa-lim" style="min-height:90px">Confidence 95% or more\nUp to 20 targets per action\nNot on assets linked to a critical business service</textarea></label></div>' +
          '<div class="notice info" style="margin-top:12px">' + I('info') + ' High and critical risk tools need the CISO as holder. Every use is traced, sampled by Trust & Challenge, and the deviation hunt can suspend the approval automatically.</div>',
          '<button data-close-modal>Cancel</button><button class="primary" data-action="saCreate">' + I('key') + ' Grant (holder signs)</button>');
      },
      saCreate() {
        const S = this.ui; const v = (id) => (document.getElementById(id) || {}).value || '';
        const title = v('dz-sa-title').trim();
        if (!title) { CP.toast('Give the standing approval a title.', 'warn'); return; }
        const t = tool(v('dz-sa-tool')); const holder = v('dz-sa-holder');
        if (t && (t.risk === 'critical' || t.risk === 'high') && holder !== 'p-elena') { CP.toast('A ' + t.risk + '-risk action needs the CISO as holder.', 'err'); return; }
        const n = S.sa.reduce((m, x) => Math.max(m, +x.id.slice(3)), 12) + 1;
        const id = 'SA-' + n;
        S.sa.unshift({ id, title, agent: v('dz-sa-agent'), tool: t.id, pol: t.pol || null, holder, scope: title + '.', limits: v('dz-sa-lim').split('\n').map((s) => s.trim()).filter(Boolean), granted: 'Tue 13 Oct 2026', expDays: +v('dz-sa-exp') || 90, uses: 0, last: 'never', status: 'active', review: 'Quarterly by Trust & Challenge', manual: true });
        S.saSel = id;
        CP.feed({ actor: holder, domain: 'human', level: 'decision', text: 'granted standing approval ' + id + ': ' + title + '.' });
        CP.closeModal(); CP.toast(id + ' granted by the ' + lc(pname(holder)) + ', valid until ' + dateAfter(+v('dz-sa-exp') || 90) + '.'); CP.render();
      },

      /* catalogue */
      selTool(el) { this.ui.tool = el.dataset.id; CP.render(); },
      catF(el) { this.ui[el.dataset.k] = el.value; CP.render(); },
      toolRequest() {
        CP.modal(I('plug') + ' Request a new tool',
          '<div class="grid g2" style="gap:12px"><label class="dz-f">Tool name<input id="dz-tr-name" placeholder="e.g. dns.sinkhole_domain"></label><label class="dz-f">Mode<select id="dz-tr-mode"><option>read</option><option>write</option><option>external</option></select></label>' +
          '<label class="dz-f" style="grid-column:1/-1">Why the agents need it<textarea id="dz-tr-why">Sinkhole malicious domains at the internal DNS when the proxy is bypassed (seen in C-2277).</textarea></label></div>' +
          '<div class="notice info" style="margin-top:12px">' + I('info') + ' Build designs the connector, the risk class and the rollback; Trust & Challenge red-teams it before it enters the catalogue at L1.</div>',
          '<button data-close-modal>Cancel</button><button class="primary" data-action="toolRequestSubmit">' + I('send') + ' Send to the Build backlog</button>');
      },
      toolRequestSubmit() {
        const name = ((document.getElementById('dz-tr-name') || {}).value || '').trim() || 'dns.sinkhole_domain';
        const mode = (document.getElementById('dz-tr-mode') || {}).value || 'write';
        const bl = CP.store.get('backlog'); let mx = 329; bl.forEach((b) => { const m = String(b.id).match(/^B-(\d+)$/); if (m) mx = Math.max(mx, +m[1]); });
        const id = 'B-' + (mx + 1);
        CP.store.apply({ op: 'add', coll: 'backlog', item: { id, title: 'New tool: ' + name + ' (' + mode + ', red team before catalogue)', domain: 'soc', type: 'connector', from: 'build', priority: 'medium', status: 'new', effort: mode === 'read' ? 'S' : 'M' } });
        CP.closeModal(); CP.toast(id + ' added to the Build backlog: ' + name + '.');
      }
    }
  });

  function currentVersion(pb) {
    const pubs = CP.store.get('playbookVersions').filter((x) => x.pb === pb.id);
    if (pubs.length) return { v: pubs[0].version, when: pubs[0].ts, by: pubs[0].by };
    return { v: pb.version, when: pb.edit[0], by: pb.edit[1] };
  }
})();
