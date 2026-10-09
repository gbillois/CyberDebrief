/* CISO cockpit: the Group CISO's single pane of glass on the Cyber AI Platform
   and on the new CISO organisation. Posture, decisions above threshold,
   agents under control, regulatory status, value delivered, board brief. */
(function () {
  'use strict';
  const CP = window.CP;
  const esc = CP.esc, ui = CP.ui;

  CP.css('ciso', [
    /* hero */
    '.cc-hero{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:20px;align-items:center;background:#fff;border:1px solid var(--line);border-left:4px solid var(--indigo);padding:18px 22px;margin-bottom:16px}',
    '.cc-hero .av.cc-xl{width:54px;height:54px;font-size:19px}',
    '.cc-hero h1{font-size:25px;margin:0 0 2px}',
    '.cc-hero .cc-date{font-size:12.5px;color:var(--muted);display:flex;gap:10px;flex-wrap:wrap;align-items:center}',
    '.cc-brief{margin-top:10px;background:var(--indigo-50);border-left:3px solid var(--indigo);padding:9px 13px;font-size:13.5px;line-height:1.55;color:#2c2545}',
    '.cc-brief b.cc-ai{font-size:10.5px;letter-spacing:1.2px;text-transform:uppercase;color:var(--indigo);margin-right:6px;display:inline-flex;gap:5px;align-items:center}',
    '.cc-hero .cc-hacts{display:flex;flex-direction:column;gap:8px}',
    /* live scenario strip */
    '.cc-live{display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:var(--dark);color:#fff;padding:10px 16px;margin-bottom:16px;font-size:13px;border-left:4px solid var(--green)}',
    '.cc-live.wait{border-left-color:#ffb648}',
    '.cc-live .dot{width:9px;height:9px;background:var(--green);display:inline-block;animation:blink 1.2s infinite}',
    '.cc-live.wait .dot{background:#ffb648}',
    '.cc-live .muted{color:#c3b8e2}',
    '.cc-live a{color:#fff;font-weight:600}',
    /* kpis */
    '.cc-kpis{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;margin-bottom:18px}',
    '.cc-kpis .metric{padding:14px 14px 12px}',
    '.cc-kpis .metric .value{font-size:28px}',
    '.cc-kpis .metric .foot{flex-wrap:wrap;line-height:1.35}',
    '.cc-kpis .metric .foot svg{flex:none}',
    /* decisions */
    '.cc-dec{display:grid;gap:12px}',
    '.cc-empty{border:1px dashed #b9e8cb;background:#f4fff8;padding:16px 18px;display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:start}',
    '.cc-empty .cc-ok{width:36px;height:36px;background:var(--green);color:#10291b;display:grid;place-items:center;font-size:18px}',
    '.cc-empty p{margin:2px 0 0;font-size:13px;color:#2f4a3a;line-height:1.55}',
    '.cc-others{border-top:1px solid var(--line-2);margin-top:4px;padding-top:10px}',
    '.cc-others .list-item{padding:8px 0}',
    /* health */
    '.cc-ctl{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center;padding:12px 14px;border:1px solid;margin-bottom:14px}',
    '.cc-ctl .cc-light{width:40px;height:40px;display:grid;place-items:center;font-size:19px}',
    '.cc-ctl b{font-size:15px;display:block}',
    '.cc-ctl span{font-size:12.5px;line-height:1.45}',
    '.cc-ctl.green{background:#f1fff7;border-color:#a8e6c1}.cc-ctl.green .cc-light{background:var(--green);color:#10291b}',
    '.cc-ctl.amber{background:#fff8eb;border-color:#f1c27a}.cc-ctl.amber .cc-light{background:#ffb648;color:#3d2600}',
    '.cc-ctl.red{background:#fff1f3;border-color:#f0b9c3;animation:pulseb 1.6s infinite}.cc-ctl.red .cc-light{background:var(--red);color:#fff}',
    '.cc-hstats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:14px}',
    '.cc-hstats div{background:#f7f6fa;padding:8px 10px}',
    '.cc-hstats b{display:block;font-size:19px;color:var(--indigo);font-variant-numeric:tabular-nums;letter-spacing:-.4px}',
    '.cc-hstats span{font-size:11px;color:var(--muted)}',
    '.cc-dgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}',
    '.cc-dblock{border:1px solid var(--line);border-top:3px solid var(--dc)}',
    '.cc-dblock h4{margin:0;font-size:11.5px;letter-spacing:.8px;text-transform:uppercase;padding:7px 10px;display:flex;justify-content:space-between;align-items:center;background:#fbfafd}',
    '.cc-dblock h4 small{font-weight:600;color:var(--muted);letter-spacing:0;text-transform:none}',
    '.cc-ag{display:flex;width:100%;align-items:center;gap:8px;border:0;border-top:1px solid var(--line-2);background:#fff;padding:6px 10px;min-height:0;font-weight:500;font-size:12.5px;text-align:left}',
    '.cc-ag:hover{background:var(--indigo-50)}',
    '.cc-ag .nm{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.cc-sq{width:8px;height:8px;display:inline-block;flex:none}',
    '.cc-sq.active{background:var(--green-ink)}.cc-sq.degraded,.cc-sq.paused{background:#ffb648}.cc-sq.canary{background:var(--indigo)}.cc-sq.suspended{background:var(--red)}',
    '.cc-ag.new{animation:newrow 2.4s}',
    /* regulatory, third parties */
    '.cc-reg{display:grid;gap:12px}',
    '.cc-reg-i{display:grid;gap:5px;padding-bottom:12px;border-bottom:1px solid var(--line-2)}',
    '.cc-reg-i:last-child{border-bottom:0;padding-bottom:0}',
    '.cc-reg-i .t1{font-size:13px;font-weight:600;line-height:1.35}',
    '.cc-reg-i .t2{display:flex;gap:8px;align-items:center;font-size:12px;color:var(--muted)}',
    '.cc-reg-i .t2 .progress{flex:1}',
    '.cc-reg-i.new{animation:newrow 2.4s}',
    '.cc-stack{display:flex;height:14px;background:#eeebf4;margin:8px 0}',
    '.cc-stack span{display:block;height:100%}',
    '.cc-legend{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:12px;color:var(--muted)}',
    '.cc-legend i{display:inline-block;width:9px;height:9px;margin-right:5px;vertical-align:-1px}',
    '.cc-tpnums{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:12px}',
    '.cc-tpnums div{background:#f7f6fa;padding:8px 10px}',
    '.cc-tpnums b{display:block;font-size:19px;color:var(--indigo);letter-spacing:-.4px;font-variant-numeric:tabular-nums}',
    '.cc-tpnums span{font-size:11px;color:var(--muted)}',
    '.cc-score{font-family:var(--mono);font-weight:700;font-size:12.5px}',
    '.cc-score.lo{color:var(--red-ink)}.cc-score.mid{color:#8a5a05}.cc-score.hi{color:var(--green-ink)}',
    /* decisions tab */
    '.cc-filters{display:flex;gap:16px;flex-wrap:wrap;align-items:center;margin-bottom:14px}',
    '.cc-filters .lbl{font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);font-weight:700;margin-right:4px}',
    '.cc-holders{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:14px}',
    '.cc-holder{border:1px solid var(--line);padding:10px 12px;display:grid;gap:4px;font-size:12px}',
    '.cc-holder.me{border-color:var(--indigo);background:var(--indigo-50)}',
    '.cc-holder b.n{font-size:22px;color:var(--indigo);letter-spacing:-.5px;line-height:1}',
    '.t tr.cc-mine td{background:#f6f3ff}',
    '.t tr.cc-mine td:first-child{box-shadow:inset 3px 0 var(--indigo)}',
    '.cc-thr{display:grid;gap:8px}',
    '.cc-thr div{display:grid;grid-template-columns:110px 1fr;gap:10px;font-size:12.5px;padding:7px 0;border-bottom:1px solid var(--line-2);line-height:1.45}',
    '.cc-thr div:last-child{border-bottom:0}',
    '.cc-thr b{color:var(--indigo)}',
    /* value tab */
    '.cc-scn{border:1px solid var(--line);padding:14px;display:grid;gap:8px;align-content:start;background:#fff}',
    '.cc-scn h3{margin:0;font-size:14.5px;color:var(--indigo);line-height:1.3}',
    '.cc-scn .vb-row{grid-template-columns:62px 1fr 52px}',
    '.cc-scn .cmp{display:grid;grid-template-columns:1fr 1fr;gap:6px}',
    '.cc-scn .cmp div{background:#f7f6fa;padding:6px 8px;font-size:11.5px;color:var(--muted)}',
    '.cc-scn .cmp b{display:block;font-size:14px;color:var(--ink)}',
    '.cc-scn .cmp div.p{background:var(--green-50)}.cc-scn .cmp div.p b{color:#116539}',
    '.cc-chart svg{max-height:300px;display:block;margin:0 auto}',
    '.cc-roi{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:12px}',
    '.cc-roi div{border:1px solid var(--line);padding:8px 10px;font-size:11.5px;color:var(--muted)}',
    '.cc-roi b{display:block;font-size:17px;color:var(--ink);font-variant-numeric:tabular-nums}',
    /* org chart */
    '.cc-orgwrap{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:18px;align-items:start}',
    '.cc-org{background:#fff;border:1px solid var(--line);padding:18px}',
    '.cc-org-top{display:flex;justify-content:center;position:relative;padding-bottom:22px}',
    '.cc-org-top::after{content:"";position:absolute;left:50%;bottom:0;height:22px;border-left:2px solid #cfc8e3}',
    '.cc-org-top .cc-ou{max-width:330px}',
    '.cc-branches{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.55fr) minmax(0,1fr);gap:12px;position:relative;padding-top:18px}',
    '.cc-branches::before{content:"";position:absolute;top:0;left:14.1%;right:14.1%;border-top:2px solid #cfc8e3}',
    '.cc-br{position:relative;border:1px solid var(--line);background:#fbfafd;display:flex;flex-direction:column}',
    '.cc-br::before{content:"";position:absolute;top:-19px;left:50%;height:18px;border-left:2px solid #cfc8e3}',
    '.cc-br-body{padding:8px;display:grid;gap:6px;align-content:start}',
    '.cc-sub2{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
    '.cc-sublbl{font-size:10.5px;letter-spacing:1px;text-transform:uppercase;font-weight:700;color:var(--muted);padding:2px 2px 0}',
    'button.cc-ou{display:block;width:100%;text-align:left;background:#fff;border:1px solid var(--line);padding:8px 10px;min-height:0;font-weight:400;font-size:12.5px;line-height:1.35;color:var(--ink)}',
    'button.cc-ou:hover{border-color:var(--indigo);background:#fff}',
    'button.cc-ou.sel{border-color:var(--indigo);box-shadow:inset 3px 0 var(--indigo),0 0 0 1px var(--indigo);background:#f8f6ff}',
    'button.cc-ou .on{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}',
    'button.cc-ou .on b{font-weight:650;font-size:12.5px}',
    'button.cc-ou .hc{font-family:var(--mono);font-size:11px;font-weight:700;color:var(--indigo);white-space:nowrap}',
    'button.cc-ou .ow{display:block;color:var(--muted);font-size:11.5px;margin-top:3px}',
    'button.cc-ou .avs{display:flex;gap:3px;margin-top:5px}',
    'button.cc-ou.head{background:var(--bc,var(--indigo));color:#fff;border-color:var(--bc,var(--indigo))}',
    'button.cc-ou.head .hc{color:#fff;opacity:.9}',
    'button.cc-ou.head .ow{color:#ffffffcc}',
    'button.cc-ou.head.sel{box-shadow:0 0 0 3px #ffb648}',
    'button.cc-ou.ciso{background:var(--dark);color:#fff;border-color:var(--dark);padding:12px 14px}',
    'button.cc-ou.ciso .hc{color:var(--green)}button.cc-ou.ciso .ow{color:#c3b8e2}',
    'button.cc-ou.ciso.sel{box-shadow:0 0 0 3px #ffb648}',
    'button.cc-ou.lod2{border-style:dashed;background:#f6f3ff}',
    '.cc-plat{margin-top:16px;background:var(--dark);color:#fff;padding:12px;position:relative}',
    '.cc-plat-h{display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px;font-size:12px;color:#cfc6ea}',
    '.cc-plat-h b{color:#fff;font-size:13px;letter-spacing:.3px}',
    '.cc-plat-doms{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px}',
    'button.cc-pd{display:block;text-align:left;background:#ffffff10;border:1px solid #ffffff26;border-top:3px solid var(--dc);color:#fff;padding:7px 8px;min-height:0;font-size:12px;font-weight:600;width:100%}',
    'button.cc-pd:hover{background:#ffffff1c;border-color:#ffffff60;border-top-color:var(--dc)}',
    'button.cc-pd.sel{background:#fff;color:var(--dark)}',
    'button.cc-pd small{display:block;font-weight:400;font-size:11px;opacity:.8;margin-top:2px}',
    '.cc-plat-ctx{margin-top:6px;display:grid;grid-template-columns:2fr 1fr 1fr;gap:6px;font-size:11.5px}',
    '.cc-plat-ctx div{background:#ffffff14;padding:7px 9px;color:#e5def8;display:flex;gap:6px;align-items:center}',
    '.cc-plat-ctx div.ctx{background:var(--green);color:#10291b;font-weight:650}',
    '.cc-od{position:sticky;top:132px}',
    '.cc-od .kv{font-size:12.5px}',
    '.cc-od ul{margin:6px 0 0;padding-left:18px;font-size:12.5px;line-height:1.55}',
    '.cc-hcbar{display:flex;height:22px;margin:4px 0 8px}',
    '.cc-hcbar span{display:flex;align-items:center;justify-content:center;color:#fff;font-size:10.5px;font-weight:700;overflow:hidden;white-space:nowrap}',
    /* board brief */
    '.cc-paper{background:#fff;border:1px solid var(--line);box-shadow:0 10px 30px #26115414;padding:30px 34px;max-width:900px}',
    '.cc-paper.in-modal{box-shadow:none;border:0;padding:0}',
    '.bb{font-size:12.8px;line-height:1.5;color:#201c30}',
    '.bb-head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #451dc7;padding-bottom:10px;margin-bottom:14px;gap:16px}',
    '.bb-head .bb-eb{font-size:10.5px;letter-spacing:1.4px;text-transform:uppercase;color:#451dc7;font-weight:700}',
    '.bb-head h2{font-size:20px;margin:4px 0 0;letter-spacing:-.4px}',
    '.bb-head .bb-meta{text-align:right;font-size:11.5px;color:#6d687e;line-height:1.5}',
    '.bb h3{font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:#451dc7;margin:16px 0 6px;font-weight:700}',
    '.bb ul{margin:0;padding-left:18px}',
    '.bb li{margin:3px 0}',
    '.bb table{width:100%;border-collapse:collapse;font-size:12px}',
    '.bb th{text-align:left;font-size:10.5px;color:#6d687e;font-weight:650;border-bottom:1px solid #dedbe8;padding:5px 6px}',
    '.bb td{border-bottom:1px solid #eeecf3;padding:5px 6px;vertical-align:middle}',
    '.bb-2{display:grid;grid-template-columns:1fr 1fr;gap:18px}',
    '.bb-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:4px 0 2px}',
    '.bb-kpis div{border:1px solid #dedbe8;padding:7px 9px;font-size:10.5px;color:#6d687e}',
    '.bb-kpis b{display:block;font-size:18px;color:#451dc7;letter-spacing:-.4px}',
    '.bb-light{display:inline-block;padding:2px 8px;font-weight:700;font-size:11px}',
    '.bb-light.green{background:#e1fded;color:#116539}.bb-light.amber{background:#fff2d8;color:#8a5a05}.bb-light.red{background:#ffe9ed;color:#a4233a}',
    '.bb-foot{margin-top:16px;border-top:1px solid #dedbe8;padding-top:8px;font-size:10.5px;color:#6d687e}',
    '.cc-chk{display:grid;gap:6px;font-size:13px}',
    '.cc-chk label{display:flex;gap:8px;align-items:center;cursor:pointer}',
    /* responsive */
    '@media(max-width:1360px){.cc-holders{grid-template-columns:repeat(2,minmax(0,1fr))}}',
    '@media(max-width:1180px){.cc-kpis{grid-template-columns:repeat(3,minmax(0,1fr))}.cc-orgwrap{grid-template-columns:1fr}.cc-od{position:static}}',
    '@media(max-width:1100px){.cc-board{grid-template-columns:minmax(0,1fr)}.cc-hero{grid-template-columns:auto minmax(0,1fr)}.cc-hero .cc-hacts{grid-column:1/-1;flex-direction:row;flex-wrap:wrap}.cc-branches{grid-template-columns:1fr}.cc-branches::before,.cc-br::before{display:none}.cc-plat-doms{grid-template-columns:repeat(3,minmax(0,1fr))}.cc-plat-ctx{grid-template-columns:1fr}.bb-2{grid-template-columns:1fr}}',
    '@media(max-width:760px){.cc-root .table-wrap table.t{min-width:640px}.cc-root .card{padding:16px}.cc-kpis{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.cc-kpis .metric .value{font-size:24px}.cc-hero{grid-template-columns:1fr;padding:14px}.cc-hero .av.cc-xl{display:none}.cc-hero h1{font-size:21px}.cc-hero .cc-hacts button{flex:1;min-height:44px;justify-content:center}.cc-dgrid,.cc-roi{grid-template-columns:1fr}.cc-hstats{grid-template-columns:1fr 1fr}.cc-sub2{grid-template-columns:1fr}.bb-kpis{grid-template-columns:1fr 1fr}.cc-paper{padding:16px}.cc-holders{grid-template-columns:1fr 1fr}.cc-plat-doms{grid-template-columns:1fr 1fr}.cc-thr div{grid-template-columns:1fr;gap:2px}.cc-ag{min-height:40px}button.cc-ou{padding:10px 12px}.cc-filters{gap:10px}.cc-filters .pill-tabs{flex-wrap:nowrap;overflow-x:auto;max-width:100%;padding-bottom:2px}.cc-filters .pill-tabs button{white-space:nowrap;min-height:38px}.cc-live{font-size:12px}.bb-head{flex-direction:column;align-items:flex-start}.bb-head .bb-meta{text-align:left}.bb table{display:block;overflow-x:auto}.cc-scn .vb-row{grid-template-columns:62px 1fr 52px}}'
  ].join('\n'));

  /* ---------------- Static, console-only data ---------------- */
  const DOMS = ['cti', 'grc', 'appsec', 'data', 'iam', 'soc'];
  const DAYDATE = { Mon: 'Monday 12', Tue: 'Tuesday 13', Wed: 'Wednesday 14', Thu: 'Thursday 15', Fri: 'Friday 16', Sat: 'Saturday 17', Sun: 'Sunday 18' };
  const WEEKS = ['W31', 'W32', 'W33', 'W34', 'W35', 'W36', 'W37', 'W38', 'W39', 'W40', 'W41', 'W42'];
  const MTTC_HIST = [41, 38, 36, 33, 31, 29, 27, 25, 23, 21, 19];
  const AUTO_HIST = [71, 73, 74, 76, 77, 79, 80, 82, 83, 85, 86];
  const RISK_HIST = [71, 70, 69, 68, 67, 66, 65, 64, 63, 63, 62];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const VALUE_K = [18, 24, 31, 39, 74, 82, 88, 86, 107];   /* k€ value delivered per month */
  const COST_K = [22, 27, 31, 34, 36, 38, 39, 37, 41];     /* k€ AI run cost per month */
  const DOM_SHARE = { soc: 0.41, grc: 0.24, iam: 0.15, cti: 0.09, appsec: 0.07, data: 0.04 };
  const RATE = 95;                 /* € loaded cost of an analyst hour */
  const AVOIDED_MTD = 17600;       /* MSSP L1 triage contract ended in May 2026, prorated to 13 Oct */
  const AI_COST_PREV_DAYS = 15060; /* AI run cost from 1 to 12 October */
  const BIZ_DAYS_ELAPSED = 9, BIZ_DAYS_MONTH = 22, FTE_HOURS = 151;
  const RISK_Q_START = 68;

  /* Decision history of the week (before today's scenarios). */
  const HIST = [
    { id: 'AP-2614', role: 'engage', decider: 'p-marc', decidedBy: 'p-marc', requestedBy: 'ag-grc-tprm', autonomy: 'L1', status: 'approved', title: 'Send the rating-drop notice to LexAdvisors', summary: 'External rating down 12 points and leaked credentials on a paste site. Message asks for password reset evidence within 5 days.', threshold: 'external communication on behalf of the group', recommendation: 'Send: credentials are recent and the supplier holds litigation files.', createdAt: 'Mon 17:22', decidedAt: 'Mon 17:28', mins: 6 },
    { id: 'AP-2611', role: 'ciso', decider: 'p-elena', decidedBy: 'p-elena', requestedBy: 'ag-soc-forensic', autonomy: 'L1', status: 'approved', title: 'Isolate srv-pay-api-03 (cryptominer on a payment API node)', summary: 'Miner process found by the EDR; the node is one of 6 behind the payment API load balancer. Isolation removes 1/6 of capacity.', threshold: 'blast radius: 1 production server on a critical business service', recommendation: 'Isolate: capacity headroom is 40% and the miner reaches an external pool.', createdAt: 'Mon 15:04', decidedAt: 'Mon 15:12', mins: 8 },
    { id: 'AP-2608', role: 'run', decider: 'p-chloe', decidedBy: 'p-chloe', requestedBy: 'ag-iam-review', autonomy: 'L1', status: 'approved', title: 'Disable the admin account of a departing DBA', summary: 'Contract ends tonight; the account holds database administrator rights on core banking.', threshold: 'privileged account', recommendation: 'Disable at 18:00, after the hand-over call.', createdAt: 'Mon 11:31', decidedAt: 'Mon 11:40', mins: 9 },
    { id: 'AP-2605', role: 'engage', decider: 'p-lucas', decidedBy: 'p-lucas', requestedBy: 'ag-grc-tprm', autonomy: 'L2', status: 'approved', title: 'Restrict PrintHub SFTP to allow-listed IPs', summary: 'Two new source IPs seen on the PrintHub flow, not declared by the supplier.', threshold: 'partial cut of a business flow', recommendation: 'Restrict now, re-open once PrintHub confirms the IPs.', createdAt: 'Mon 09:02', decidedAt: 'Mon 09:15', mins: 13 },
    { id: 'AP-2601', role: 'build', decider: 'p-ines', decidedBy: 'p-ines', requestedBy: 'p-yuki', autonomy: 'L1', status: 'approved', title: 'Promote Access Review Agent 1.6.0 to a 10% canary', summary: 'Toxic combination detection; evals 96.1%, Trust & Challenge sign-off by the AI assurance lead.', threshold: 'new agent version in production', recommendation: 'Promote: all gates green.', createdAt: 'Sun 17:40', decidedAt: 'Sun 18:02', mins: 22 },
    { id: 'AP-2597', role: 'ciso', decider: 'p-elena', decidedBy: 'p-elena', requestedBy: 'ag-vuln', autonomy: 'L1', status: 'rejected', title: 'Patch the broker portal outside the change window', summary: 'CVSS 8.1 in the portal framework, not exploited in the wild, WAF rule already blocking.', threshold: 'service interruption on a critical business service', recommendation: 'Patch now (40 min downtime).', createdAt: 'Fri 16:20', decidedAt: 'Fri 16:45', mins: 25, note: 'Rescheduled to the Saturday 06:00 window: not exploited, virtual patch in place.' },
    { id: 'AP-2594', role: 'ciso', decider: 'p-hugo', decidedBy: 'p-hugo', requestedBy: 'ag-iam-resp', autonomy: 'L1', status: 'approved', title: 'Hold an outgoing payment of €310k to a new beneficiary', summary: 'Beneficiary created 2 hours earlier from a session flagged by the identity provider.', threshold: 'action on payments', recommendation: 'Hold and call back the client.', createdAt: 'Fri 10:08', decidedAt: 'Fri 10:20', mins: 12 },
    { id: 'AP-2590', role: 'engage', decider: 'p-amira', decidedBy: 'p-amira', requestedBy: 'ag-grc-controls', autonomy: 'L1', status: 'approved', title: 'Submit NIS2 quarterly incident statistics', summary: '41 incidents classified, 0 significant. Evidence pack generated from the case history.', threshold: 'regulatory commitment of the group', recommendation: 'Submit: figures reconciled with the SIEM and ITSM.', createdAt: 'Thu 13:30', decidedAt: 'Thu 14:00', mins: 30 },
    { id: 'AP-2588', role: 'run', decider: 'p-chloe', decidedBy: 'p-chloe', requestedBy: 'p-jonas', autonomy: 'L1', status: 'approved', title: 'Lower the Code Review Agent to L1 after a latency deviation', summary: 'Review time per pull request +40% after a model update (DV-31).', threshold: "change of an agent's autonomy level", recommendation: 'Lower for 48 h while Build rolls back the model.', createdAt: 'Thu 09:20', decidedAt: 'Thu 09:31', mins: 11 },
    { id: 'AP-2584', role: 'engage', decider: 'p-leo', decidedBy: 'p-leo', requestedBy: 'ag-grc-policy', autonomy: 'L1', status: 'approved', title: 'Launch a phishing simulation for 4,200 staff', summary: 'Scenario built from the HR portal phishing wave (C-2291), targeted at the 3 most clicked departments.', threshold: 'message to staff on behalf of the group', recommendation: 'Launch Wednesday 10:00.', createdAt: 'Wed 12:40', decidedAt: 'Wed 13:10', mins: 30 }
  ];

  /* The new organisation (headcount 140). */
  const ORG = {
    ciso: { name: 'Group CISO', hc: 3, people: ['p-elena'], console: ['ciso', null], color: '#211248', mission: 'Sets the risk appetite, the decision rights and the thresholds; decides above threshold; reports to the board.', owns: ['Decision-rights policy and thresholds', 'Emergency patch and production isolation decisions (L1)', 'Board reporting and the value story'], short: 'Office: CISO, chief of staff, budget & risk' },
    'br-engage': { name: 'Engage', hc: 46, people: ['p-amira'], console: ['engage', null], color: '#1597a5', mission: 'Speaks for cyber outside the CISO organisation: business lines, suppliers, regulators, crises and staff.', owns: ['Every message that leaves the group (suppliers, regulators, staff)', 'Business decisions above threshold, with the BISOs', 'Demand for new agents coming from the business'], short: 'Speak for cyber outside the CISO org' },
    'eng-strategy': { name: 'Strategy, anticipation & policy', hc: 6, people: [], console: ['engage', null], color: '#1597a5', mission: 'Cyber strategy, threat anticipation, policies and the decision-rights matrix.', owns: ['Policy Agent outputs (policy drafts)', 'Annual review of thresholds with the CISO'], short: 'Policy Agent, thresholds review' },
    'eng-biso': { name: 'Business CISOs (BISOs)', hc: 9, people: ['p-lucas'], console: ['engage', null], color: '#1597a5', mission: 'One BISO per business line: translates cyber risk into business decisions.', owns: ['L2 decider: restrict a third-party connection', 'Monthly risk review per business unit'], short: '6 business units covered' },
    'eng-crisis': { name: 'Crisis & incident management', hc: 8, people: ['p-tom'], console: ['engage', null], color: '#1597a5', mission: 'Major incident command, crisis cells, DORA and NIS2 incident notifications.', owns: ['Crisis playbooks on the platform', 'Incident notification clock (4 h)'], short: 'Major incidents, notifications' },
    'eng-comp': { name: 'Compliance & regulators', hc: 15, people: ['p-amira', 'p-marc'], console: ['engage', 'regulators'], color: '#1597a5', mission: 'TPRM, NIS2, DORA, AI Act: owns the relationship with supervisors and third parties.', owns: ['L1 decider: messages to suppliers and regulators', 'TPRM Agent and Controls & Evidence Agent outputs', 'DORA register of information'], short: 'TPRM · NIS2 · DORA · AI Act' },
    'eng-culture': { name: 'Culture & engagement', hc: 8, people: ['p-leo'], console: ['engage', 'culture'], color: '#1597a5', mission: 'Awareness and training where the risk is, built from real (anonymised) cases.', owns: ['Targeted micro-training', 'Phishing simulations'], short: 'Awareness, training' },
    'br-ops': { name: 'Platform Operations', hc: 66, people: ['p-raj', 'p-chloe'], console: ['build', null], color: '#e0662b', mission: 'Builds and runs the Cyber AI Platform: the agents, the shared context and the safety layer.', owns: ['The 16 agents end to end', 'Shared context: security graph and data lake', 'Orchestrator, sandbox, kill-switch, rollback'], short: 'Build 34 · Run 32' },
    'br-build': { name: 'Build', hc: 34, people: ['p-raj'], console: ['build', null], color: '#e0662b', mission: 'Designs, develops and evaluates agents with Trust & Challenge, ships them through the pipeline.', owns: ['Agent backlog and roadmap', 'Prompts, tools, connectors and manifests', 'Release pipeline (eval, sandbox, canary, prod)'], short: 'Agent products, studio, pipeline' },
    'b-po': { name: 'Agent product owners', hc: 7, people: ['p-ines'], console: ['build', 'backlog'], color: '#e0662b', mission: 'One product owner per domain, accountable for what each agent does and how well.', owns: ['L1 decider: promote a new agent version', 'Backlog priorities from Run, Engage and T&C'], short: 'One per domain' },
    'b-dev': { name: 'Agent developers', hc: 22, people: ['p-yuki'], console: ['build', 'pipeline'], color: '#e0662b', mission: 'Build agents per domain: prompts, tools, guardrails, eval suites.', owns: ['Agent code, prompts and tool permissions', 'Fixes from deviations and red team findings'], short: 'Per domain' },
    'b-pm': { name: 'Program & platform manager', hc: 5, people: ['p-raj'], console: ['build', null], color: '#e0662b', mission: 'Platform roadmap, shared context, connector catalogue, budget.', owns: ['Security graph and data lake roadmap', 'Connector catalogue (MCP)'], short: 'Roadmap, context, connectors' },
    'br-run': { name: 'Run', hc: 32, people: ['p-chloe'], console: ['run', null], color: '#2f7de1', mission: 'Operates the agents in production 24/7: supervision, quality, cost.', owns: ['Autonomy levels in production', 'Kill-switch and rollback', 'Quality sampling and AI cost'], short: 'Live operations, supervision, quality, cost' },
    'r-sup': { name: 'Agent supervisors', hc: 18, people: ['p-chloe', 'p-mei'], console: ['run', 'ops'], color: '#2f7de1', mission: 'Supervise agents per domain, receive L2 notifications, take the decisions delegated to Run.', owns: ['L1 decider: kill-switch, privileged accounts', 'L2 notifications and rollback points'], short: 'Per domain, 24/7' },
    'r-qa': { name: 'Platform quality manager', hc: 8, people: ['p-pierre'], console: ['run', null], color: '#2f7de1', mission: 'QA sampling of agent actions, advanced investigation, platform security.', owns: ['Quality sampling of autonomous actions', 'Advanced investigation', 'Platform security'], short: 'QA, investigation, platform security' },
    'r-perf': { name: 'Performance manager', hc: 6, people: ['p-nadia'], console: ['run', null], color: '#2f7de1', mission: 'AI costs, efficiency and ROI of every agent.', owns: ['AI cost per agent and per action', 'Efficiency and ROI reporting to the CISO'], short: 'AI costs, efficiency, ROI' },
    'br-tc': { name: 'Trust & Challenge', hc: 25, people: ['p-jonas', 'p-sam'], console: ['trust', null], color: '#5a2be0', mission: 'Constantly checks that the platform deserves trust and stays efficient. Independent from Build and Run.', owns: ['Release sign-off of every agent version', 'Deviation hunt on 16 agents', 'Red team of agents and of the IS'], short: 'AI assurance · Offensive' },
    't-eval': { name: 'AI assurance · model evals', hc: 6, people: ['p-jonas'], console: ['trust', null], color: '#5a2be0', mission: 'Data scientists running the eval harness and gold sets.', owns: ['Eval suites and gold sets', 'Sign-off before promotion'], short: 'Eval harness, gold sets' },
    't-dev': { name: 'AI assurance · deviation hunt', hc: 5, people: [], console: ['trust', 'deviation'], color: '#5a2be0', mission: 'Monitors agent behaviour in production and hunts for drift.', owns: ['Behaviour baselines of 16 agents', 'Drift alerts to Run'], short: 'Behaviour monitoring, drift' },
    't-red': { name: 'Offensive · red team', hc: 9, people: ['p-sam'], console: ['trust', 'redteam'], color: '#5a2be0', mission: 'Red team of the IS and of the agents (prompt injection, tool abuse, memory poisoning).', owns: ['DORA TLPT', 'Red team campaigns against agents'], short: 'TLPT, attacks on agents' },
    't-lab': { name: 'Offensive · adversary lab', hc: 5, people: [], console: ['trust', 'lab'], color: '#5a2be0', mission: 'Replays real threat actor chains against digital twins to prove detections.', owns: ['Adversary emulation library', 'Proof that detections fire'], short: 'Threat actor replays on twins' },
    lod2: { name: 'Cyber assurance / LoD2 platform', hc: 0, people: [], console: ['trust', null], color: '#5a2be0', mission: 'Second line of defence: independent read access to the data lake to re-sample evidence and test controls.', owns: ['Independent evidence re-sampling', 'Control testing for audit and regulators'], short: 'Separate access, independent re-sampling' }
  };
  const BR_ENGAGE = ['eng-strategy', 'eng-biso', 'eng-crisis', 'eng-comp', 'eng-culture'];
  const BR_BUILD = ['b-po', 'b-dev', 'b-pm'];
  const BR_RUN = ['r-sup', 'r-qa', 'r-perf'];

  const OWNERSHIP = [
    ['Agent backlog, roadmap, version promotion', 'Build · product owners', 'b-po'],
    ['Agent prompts, tools, connectors, guardrails', 'Build · developers', 'b-dev'],
    ['Shared context: security graph and data lake', 'Build · platform manager', 'b-pm'],
    ['Autonomy levels in production, kill-switch, rollback', 'Run · supervisors', 'r-sup'],
    ['Quality sampling, advanced investigation, platform security', 'Run · quality', 'r-qa'],
    ['AI cost, efficiency, ROI', 'Run · performance', 'r-perf'],
    ['Evals, release sign-off, deviation hunt', 'Trust & Challenge · AI assurance', 't-eval'],
    ['Red team of agents, adversary lab', 'Trust & Challenge · Offensive', 't-red'],
    ['Messages to suppliers, regulators and staff', 'Engage · compliance, culture', 'eng-comp'],
    ['Business decisions above threshold', 'Engage · BISOs with business owners', 'eng-biso'],
    ['Decision rights and thresholds', 'CISO, with Engage strategy', 'ciso']
  ];

  /* ---------------- Helpers ---------------- */
  const K = () => CP.store.state.kpis;
  const plural = (n, w, ws) => n + ' ' + (n === 1 ? w : (ws || w + 's'));
  const pname = (id) => { const a = CP.actor(id); return a ? a.name : id; };
  const roleLabel = (id) => (CP.role(id) || { label: id }).label;
  const lvlS = (l) => { const L = (CP.data.autonomy || []).find((x) => x.id === l); return '<span class="lvl ' + esc(l) + '" title="' + esc(L ? L.label + ': ' + L.desc : l) + '">' + esc(l) + '</span>'; };
  const RSL = { 'on-track': 'On track', 'at-risk': 'At risk', submitted: 'Submitted', done: 'Done' };
  const SEV = { critical: 0, high: 1, medium: 2, low: 3 };
  const STO = { open: 0, contained: 1, monitoring: 2, closed: 3 };
  function clockInfo() {
    const lbl = CP.clock ? CP.clock.label() : 'Tue 08:30';
    const parts = lbl.split(' '); const h = +(parts[1] || '08:30').split(':')[0];
    return { day: parts[0], hm: parts[1], h, date: (DAYDATE[parts[0]] || 'Tuesday 13') + ' October 2026' };
  }
  function fmtMin(m) { if (m >= 60) { const h = Math.floor(m / 60), r = Math.round(m % 60); return h + ' h' + (r ? ' ' + String(r).padStart(2, '0') : ''); } return m + ' min'; }
  function minsBetween(a, b) {
    if (!a || !b) return null;
    const p = (s) => { const x = s.split(' '); const d = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(x[0]); const hm = (x[1] || '0:0').split(':'); return d * 1440 + (+hm[0]) * 60 + (+hm[1]); };
    const v = p(b) - p(a); return v >= 0 ? v : null;
  }
  function liveCases() {
    return CP.store.get('cases').slice().sort((a, b) => (STO[a.status] - STO[b.status]) || (SEV[a.severity] - SEV[b.severity]));
  }
  function evalAvg() { const e = CP.store.get('evals'); return e.length ? e.reduce((s, x) => s + x.score, 0) / e.length : 0; }
  function scoreCls(v) { return v < 60 ? 'lo' : v < 75 ? 'mid' : 'hi'; }
  function value() {
    const k = K();
    const hours = k.hoursSaved;
    const aiMTD = AI_COST_PREV_DAYS + k.aiCostToday;
    const valMTD = hours * RATE + AVOIDED_MTD;
    return { hours, aiMTD, valMTD, avoided: AVOIDED_MTD, fte: hours / BIZ_DAYS_ELAPSED * BIZ_DAYS_MONTH / FTE_HOURS, roi: valMTD / aiMTD, perAction: k.aiCostToday / Math.max(1, k.actionsToday) };
  }
  function autoByDomain() {
    return DOMS.map((d) => {
      const ags = CP.store.get('agents').filter((a) => a.domain === d);
      const t = ags.reduce((s, a) => s + a.tasksToday, 0);
      const au = ags.reduce((s, a) => s + a.tasksToday * a.autoRate / 100, 0);
      return { d, tasks: t, share: t ? au / t * 100 : 0, agents: ags };
    });
  }

  /* Are the agents under control? Derived from deviations and agent statuses. */
  function control() {
    const agents = CP.store.get('agents');
    const devs = CP.store.get('deviations');
    const open = devs.filter((d) => d.status !== 'closed');
    const notActive = agents.filter((a) => a.status !== 'active');
    const ks = K().killSwitches || 0;
    const nm = (id) => (CP.agent(id) || {}).name || id;
    const hot = open.filter((d) => d.status === 'confirmed' && agents.some((a) => a.id === d.agent && a.status === 'active'));
    if (hot.length) return { lvl: 'red', icon: 'alert', label: 'Drift confirmed, not yet contained', short: 'one agent drift is confirmed and not yet contained', why: nm(hot[0].agent) + ': ' + hot[0].signal + ' (' + hot[0].id + '). Kill-switch proposed to Run.' };
    const inv = open.find((d) => d.status === 'investigating');
    if (inv && !notActive.length) return { lvl: 'amber', icon: 'eye', label: 'Deviation under investigation', short: 'one agent deviation is under investigation', why: nm(inv.agent) + ': ' + inv.signal + ' (' + inv.id + '). Quality sampling in progress.' };
    if (open.length || notActive.length) {
      const a = notActive[0];
      return { lvl: 'amber', icon: 'shield', label: 'Contained, autonomy reduced', short: 'one agent runs at reduced autonomy while its fix is proven', why: a ? nm(a.id) + ' at ' + a.mode + ' (' + (a.status === 'canary' ? 'canary of v' + a.version : a.status) + ') after ' + plural(ks, 'kill-switch', 'kill-switches') + '. Other ' + (agents.length - 1) + ' agents unchanged.' : 'Open deviation being fixed.' };
    }
    const closedLive = devs.filter((d) => d.status === 'closed' && d.scenario);
    return { lvl: 'green', icon: 'shieldCheck', label: 'Agents under control', short: 'all ' + agents.length + ' agents are under control', why: agents.length + ' agents within guardrails, no open deviation' + (ks ? '. ' + plural(ks, 'kill-switch', 'kill-switches') + ' pulled this week' + (closedLive.length ? ': drift ' + closedLive[0].id + ' detected, contained, fixed and proven' : '') : ', no kill-switch needed') + '.' };
  }

  function briefingText() {
    const k = K();
    const cases = liveCases().filter((c) => c.status !== 'closed');
    const crit = cases.filter((c) => c.severity === 'critical');
    const pend = CP.store.pendingApprovals('ciso');
    const others = CP.store.pendingApprovals().filter((a) => a.role !== 'ciso');
    const ctl = control();
    const l1 = 'Since last night the agents ran ' + CP.fmt(k.actionsToday) + ' actions, ' + k.autonomousShare + '% of them alone inside guardrails, and triaged ' + CP.fmt(k.alertsTriaged) + ' alerts. ' +
      plural(cases.length, 'live case') + (crit.length ? ', ' + crit.length + ' critical: ' + crit[0].title + '.' : ', none critical.');
    const l2 = (pend.length ? plural(pend.length, 'decision') + ' above threshold ' + (pend.length === 1 ? 'waits' : 'wait') + ' for you: ' + pend[0].title + '.' : 'Nothing needs your decision right now.') +
      (others.length ? ' ' + others.length + ' more ' + (others.length === 1 ? 'sits' : 'sit') + ' with other decision holders.' : '') + ' Platform: ' + ctl.short + '.';
    return [l1, l2];
  }

  /* ---------------- Overview ---------------- */
  function kpiRow(scr) {
    const k = K(); const v = value();
    const st = scr.ui; st.kprev = st.kprev || {}; st.kchg = st.kchg || {};
    Object.keys(k).forEach((key) => { if (st.kprev[key] !== undefined && st.kprev[key] !== k[key]) st.kchg[key] = Date.now(); st.kprev[key] = k[key]; });
    const fl = (key) => st.kchg[key] && Date.now() - st.kchg[key] < 3000;
    const sp = (vals, c) => ui.spark(vals, { w: 64, h: 20, color: c });
    return '<div class="cc-kpis" data-tour="ciso-kpis">' +
      ui.metric({ icon: 'gauge', label: 'Cyber risk score', value: k.riskScore, unit: '/100', flash: fl('riskScore'), delta: '-' + (RISK_Q_START - k.riskScore) + ' pts', deltaDir: 'up', foot: 'this quarter ' + sp(RISK_HIST.concat([k.riskScore]), '#088a42') }) +
      ui.metric({ icon: 'target', label: 'Open exposures', value: k.exposureOpen, flash: fl('exposureOpen'), foot: 'internet-facing and supplier, SLA tracked' }) +
      ui.metric({ icon: 'clock', label: 'Mean time to contain', value: k.mttcMinutes, unit: 'min', flash: fl('mttcMinutes'), delta: 'was 5 h 40', deltaDir: 'up', foot: sp(MTTC_HIST.concat([k.mttcMinutes]), '#451dc7') }) +
      ui.metric({ icon: 'zap', label: 'Actions today', value: CP.fmt(k.actionsToday), flash: fl('actionsToday'), foot: '<b style="color:var(--green-ink)">' + k.autonomousShare + '% autonomous</b> · ' + plural(k.humanDecisions, 'human decision') }) +
      ui.metric({ icon: 'hourglass', label: 'Hours saved this month', value: CP.fmt(k.hoursSaved), unit: 'h', flash: fl('hoursSaved'), foot: '≈ ' + CP.fmt(v.fte, 1) + ' FTE run-rate · ' + CP.eur(Math.round(k.hoursSaved * RATE / 100) * 100) }) +
      ui.metric({ icon: 'euro', label: 'AI cost today', value: CP.eur(k.aiCostToday), flash: fl('aiCostToday'), foot: '€' + CP.fmt(v.perAction, 2) + ' per action · budget €2,400' }) +
      '</div>';
  }

  function liveStrip() {
    const st = CP.player && CP.player.status();
    if (!st || !st.scenario) return '';
    const s = st.scenario;
    const ap = st.waiting ? CP.store.find('approvals', st.waiting) : null;
    let extra = '';
    if (ap) extra = ap.role === 'ciso' ? '<b style="color:#ffcf7a">' + CP.icon('bell') + ' Your decision is needed below</b>' : '<span class="muted">Waiting for ' + esc(pname(ap.decider)) + ' (' + esc(roleLabel(ap.role)) + ')</span>';
    else if (st.done) extra = '<span class="muted">Scenario complete · effects visible across the cockpit</span>';
    return '<div class="cc-live' + (ap ? ' wait' : '') + '" role="status"><span class="dot"></span><b>Live · ' + esc(s.n + ' ' + s.short) + '</b><span class="muted">step ' + (st.index + 1) + '/' + st.total + '</span>' +
      (st.step ? '<span>' + esc(st.step.title) + '</span>' : '') + '<span class="spacer"></span>' + extra + '</div>';
  }

  function decisionsBlock() {
    const pend = CP.store.pendingApprovals('ciso');
    const others = CP.store.pendingApprovals().filter((a) => a.role !== 'ciso');
    const k = K();
    const mineDone = CP.store.get('approvals').filter((a) => a.role === 'ciso' && a.status !== 'pending');
    let body = '<div class="cc-dec">';
    if (pend.length) body += pend.map((a) => ui.decision(a, { pulse: true })).join('');
    else body += '<div class="cc-empty"><span class="cc-ok">' + CP.icon('check') + '</span><div><b>Nothing needs you right now.</b><p>Below threshold the agents act alone: ' + CP.fmt(k.actionsToday) + ' actions today, ' + k.autonomousShare + '% without a human, each with a rollback point and quality sampling. The orchestrator calls you only when blast radius, money, exposure, reversibility, confidence or novelty cross the thresholds you signed.</p>' +
      '<div class="row wrap" style="margin-top:8px"><a href="' + CP.href('ciso', 'decisions') + '">' + CP.icon('scale') + ' Review the decision rights</a></div></div></div>';
    if (mineDone.length) body += '<div class="small-txt muted">Decided by you today: ' + mineDone.map((a) => '<b>' + esc(a.title) + '</b> (' + esc(a.status) + (a.decidedAt ? ', ' + esc(a.decidedAt) : '') + ')').join(' · ') + '</div>';
    if (others.length) {
      body += '<div class="cc-others"><div class="small-txt muted" style="margin-bottom:4px">' + CP.icon('eye') + ' Oversight: ' + plural(others.length, 'decision') + ' held by others</div><div class="list">' +
        others.map((a) => { const r = CP.role(a.role) || {}; return '<div class="list-item">' + ui.av(a.decider, 'sm') + '<div class="li-main"><div class="li-title" style="font-size:13px">' + esc(a.title) + '</div><div class="li-sub">' + esc(pname(a.decider)) + ' · ' + esc(r.label || a.role) + (a.createdAt ? ' · raised ' + esc(a.createdAt) : '') + '</div></div>' +
          '<a class="small-txt" href="' + CP.href(r.screen || a.role) + '">Open ' + esc(r.label || '') + '</a></div>'; }).join('') + '</div></div>';
    }
    body += '</div>';
    return ui.card(CP.icon('users') + ' Decisions waiting for you', body, { cls: 'accent', tour: 'ciso-decisions', sub: 'Only what is above threshold reaches you, with the platform recommendation', right: pend.length ? ui.tag(plural(pend.length, 'pending'), 'amber') : ui.tag('Inbox zero', 'green') });
  }

  function casesBlock() {
    const cs = liveCases();
    const live = cs.filter((c) => c.status !== 'closed').length;
    const tbl = ui.table([
      { label: 'Case', w: '74px', render: (c) => '<span class="mono small-txt">' + esc(c.id) + '</span>' },
      { label: 'Title', render: (c) => '<b style="font-weight:600">' + esc(c.title) + '</b><div class="small-txt muted" style="margin-top:2px">' + esc(c.summary || '') + '</div>' },
      { label: 'Severity', render: (c) => ui.sev(c.severity) },
      { label: 'Status', render: (c) => ui.status(c.status) },
      { label: 'Domains', render: (c) => '<div class="row wrap" style="gap:4px 8px">' + (c.domains || []).map(ui.dom).join('') + '</div>' },
      { label: 'Owner', render: (c) => ui.who(c.owner) }
    ], cs, { rowClass: () => 'clickable', rowAttrs: (c) => 'data-action="openCase" data-id="' + esc(c.id) + '" title="Open case ' + esc(c.id) + '"', empty: 'No live case.' });
    return ui.card(CP.icon('activity') + ' Live cases', tbl, { sub: plural(live, 'live case') + ' · ' + CP.fmt(K().alertsTriaged) + ' alerts triaged today, most closed by agents', right: '<a class="small-txt" href="' + CP.href('run', 'ops') + '">Run console ' + CP.icon('arrowRight') + '</a>' });
  }

  function healthBlock() {
    const agents = CP.store.get('agents');
    const ctl = control();
    const k = K();
    const devOpen = CP.store.get('deviations').filter((d) => d.status !== 'closed').length;
    const modes = ['L0', 'L1', 'L2', 'L3'].map((l) => agents.filter((a) => a.mode === l).length);
    let h = '<div class="cc-ctl ' + ctl.lvl + '" role="status"><span class="cc-light">' + CP.icon(ctl.icon) + '</span><div><b>' + esc(ctl.label) + '</b><span>' + esc(ctl.why) + '</span></div></div>';
    h += '<div class="cc-hstats">' +
      '<div><b>' + agents.filter((a) => a.status === 'active').length + '/' + agents.length + '</b><span>agents active</span></div>' +
      '<div><b style="color:' + (k.killSwitches ? 'var(--red-ink)' : 'var(--indigo)') + '">' + k.killSwitches + '</b><span>kill-switches today</span></div>' +
      '<div><b>' + CP.fmt(evalAvg(), 1) + '%</b><span>eval average</span></div>' +
      '<div><b>' + CP.fmt(k.qaAgreement, 1) + '%</b><span>QA agreement · ' + k.qaSampled + ' sampled</span></div></div>';
    h += '<div class="row wrap small-txt" style="gap:6px;margin-bottom:10px"><span class="muted">Autonomy mix</span>' + ['L0', 'L1', 'L2', 'L3'].map((l, i) => lvlS(l) + ' <b class="num">' + modes[i] + '</b>').join(' ') + '<span class="spacer"></span><span class="muted">' + plural(devOpen, 'open deviation') + '</span></div>';
    h += '<div class="cc-dgrid">' + DOMS.map((d) => {
      const D = CP.domain(d); const ags = agents.filter((a) => a.domain === d);
      return '<div class="cc-dblock" style="--dc:' + D.color + '"><h4><span>' + esc(D.label) + '</span><small>' + ags.length + ' · ' + CP.fmt(ags.reduce((s, a) => s + a.tasksToday, 0)) + ' tasks</small></h4>' +
        ags.map((a) => '<button class="cc-ag' + ui.newCls(a) + '" data-action="openAgent" data-id="' + esc(a.id) + '" title="' + esc(a.name + ' · ' + a.status + ' · v' + a.version) + '"><span class="cc-sq ' + esc(a.status) + '" aria-label="' + esc(a.status) + '"></span><span class="nm">' + esc(a.name) + '</span>' + lvlS(a.mode) + '</button>').join('') + '</div>';
    }).join('') + '</div>';
    return ui.card(CP.icon('cpu') + ' Platform health', h, { tour: 'ciso-health', sub: '16 agents, one shared context, one orchestrator', right: '<a class="small-txt" href="' + CP.href('trust') + '">Trust &amp; Challenge ' + CP.icon('arrowRight') + '</a>' });
  }

  function regBlock() {
    const regs = CP.store.get('regulatory').slice().sort((a, b) => (a.status === 'at-risk' ? 0 : 1) - (b.status === 'at-risk' ? 0 : 1));
    const atRisk = regs.filter((r) => r.status === 'at-risk').length;
    const body = '<div class="cc-reg">' + regs.map((r) => {
      const pc = r.total ? r.collected / r.total * 100 : 0;
      return '<div class="cc-reg-i' + ui.newCls(r) + '"><div class="row" style="gap:6px">' + ui.tag(esc(r.framework), 'dark') + ui.status(r.status) + '<span class="spacer"></span><span class="small-txt muted">' + CP.icon('clock') + ' ' + esc(r.due) + '</span></div>' +
        '<div class="t1">' + esc(r.item) + '</div><div class="t2">' + ui.progress(pc, r.status === 'at-risk' ? 'amber' : r.status === 'submitted' || r.status === 'done' ? 'green' : '') + '<span class="num">' + CP.fmt(r.collected) + '/' + CP.fmt(r.total) + '</span>' + ui.av(r.owner, 'sm') + '</div></div>';
    }).join('') + '</div>';
    return ui.card(CP.icon('gavel') + ' Regulatory status', body, { sub: regs.length + ' commitments · ' + atRisk + ' at risk', right: '<a class="small-txt" href="' + CP.href('engage', 'regulators') + '">Engage ' + CP.icon('arrowRight') + '</a>' });
  }

  function tpBlock() {
    const tps = CP.store.get('thirdParties'); const k = K();
    const crit = tps.filter((t) => t.criticality === 'critical');
    const inCamp = tps.filter((t) => t.questionnaire && t.questionnaire.campaign);
    const STQ = [['answered', '#088a42', 'Answered'], ['sent', '#451dc7', 'Sent'], ['draft', '#b9b3c9', 'Draft'], ['overdue', '#c8861a', 'Overdue'], ['flagged', '#d8412f', 'Flagged']];
    let b = '<div class="cc-tpnums"><div><b>' + CP.fmt(CP.data.company.thirdParties) + '</b><span>ICT third parties</span></div><div><b>96</b><span>support critical functions</span></div><div><b>' + Math.round(k.thirdPartiesAssessed / CP.data.company.thirdParties * 100) + '%</b><span>assessed (' + CP.fmt(k.thirdPartiesAssessed) + ')</span></div></div>';
    if (inCamp.length) {
      const camp = inCamp[0].questionnaire.campaign;
      const counts = STQ.map((s) => inCamp.filter((t) => t.questionnaire.status === s[0]).length);
      b += '<div class="row small-txt"><b>Campaign ' + esc(camp) + '</b><span class="spacer"></span><span class="muted">' + inCamp.length + ' suppliers</span></div>' +
        '<div class="cc-stack" role="img" aria-label="Questionnaire statuses">' + STQ.map((s, i) => counts[i] ? '<span style="width:' + (counts[i] / inCamp.length * 100) + '%;background:' + s[1] + '" title="' + s[2] + ': ' + counts[i] + '"></span>' : '').join('') + '</div>' +
        '<div class="cc-legend">' + STQ.map((s, i) => counts[i] ? '<span><i style="background:' + s[1] + '"></i>' + s[2] + ' <b class="num" style="color:var(--ink)">' + counts[i] + '</b></span>' : '').join('') + '</div>';
    } else {
      b += '<div class="small-txt muted">No questionnaire campaign running. Last campaign: Q3 annual review, closed 30 Sep (1,182 answers analysed by the TPRM Agent).</div>';
    }
    b += '<div class="list" style="margin-top:8px">' + crit.map((t) => {
      const q = t.questionnaire || {};
      return '<div class="list-item' + ui.newCls(t) + '" style="padding:7px 0"><span class="cc-score ' + scoreCls(t.score) + '" title="External security score">' + t.score + '</span><div class="li-main"><div class="li-title" style="font-size:13px">' + esc(t.name) + '</div><div class="li-sub">' + esc(t.service) + (t.exitPlan ? '' : ' · no tested exit plan') + (t.fileBridge ? ' · FileBridge' : '') + '</div></div>' +
        (q.status && q.status !== 'none' ? ui.status(q.status) : (t.gap ? ui.tag('Gap', 'amber') : '')) + '</div>';
    }).join('') + '</div>';
    return ui.card(CP.icon('building') + ' Third-party exposure', b, { sub: crit.length + ' critical suppliers monitored live', right: '<a class="small-txt" href="' + CP.href('engage', 'thirdparties') + '">Engage ' + CP.icon('arrowRight') + '</a>' });
  }

  function feedBlock(scr) {
    const f = scr.ui.feedF || 'all';
    let items = CP.store.get('feed');
    if (f === 'agents') items = items.filter((x) => CP.agent(x.actor) || x.actor === 'orchestrator');
    if (f === 'humans') items = items.filter((x) => CP.person(x.actor));
    if (f === 'decisions') items = items.filter((x) => x.level === 'decision');
    const pills = '<div class="pill-tabs" style="margin-bottom:8px">' + [['all', 'All'], ['agents', 'Agents'], ['humans', 'Humans'], ['decisions', 'Decisions']].map((p) => '<button class="' + (f === p[0] ? 'active' : '') + '" data-action="feedFilter" data-f="' + p[0] + '" aria-pressed="' + (f === p[0]) + '">' + p[1] + '</button>').join('') + '</div>';
    return ui.card(CP.icon('list') + ' Live activity', pills + (items.length ? ui.feed(items, 14) : '<div class="empty">No activity for this filter yet.</div>'), { tour: 'ciso-feed', sub: CP.store.get('feed').length + ' events today' });
  }

  function overview(scr) {
    const ci = clockInfo();
    const greet = ci.h < 5 ? 'Good night' : ci.h < 12 ? 'Good morning' : ci.h < 18 ? 'Good afternoon' : 'Good evening';
    const br = briefingText();
    const hero = '<div class="cc-hero">' + ui.av('p-elena', 'cc-xl') + '<div style="min-width:0"><h1>' + greet + ', ' + esc(pname('p-elena')) + '</h1>' +
      '<div class="cc-date"><span>' + esc(ci.date) + ' · ' + esc(ci.hm) + '</span><span>Group CISO · ' + esc(CP.data.company.name) + '</span><span>' + CP.data.company.regs.map((r) => ui.tag(r, 'outline')).join(' ') + '</span></div>' +
      '<div class="cc-brief"><b class="cc-ai">' + CP.icon('sparkles') + ' AI briefing</b>' + esc(br[0]) + '<br>' + esc(br[1]) + '</div></div>' +
      '<div class="cc-hacts"><button class="primary" data-go="ciso/board">' + CP.icon('file') + ' Board brief</button><button data-action="askBrief">' + CP.icon('sparkles') + ' Explain the night</button></div></div>';
    return liveStrip() + hero + kpiRow(scr) +
      '<div class="grid g-3-2" style="margin-bottom:18px"><div class="stack">' + decisionsBlock() + casesBlock() + '</div><div class="stack">' + healthBlock() + '</div></div>' +
      '<div class="grid g3">' + regBlock() + tpBlock() + feedBlock(scr) + '</div>';
  }

  /* ---------------- Decisions ---------------- */
  function allDecisions() {
    return CP.store.get('approvals').map((a) => Object.assign({ live: true }, a)).concat(HIST);
  }
  function decisionsTab(scr) {
    const u = scr.ui; const rf = u.decRole || 'all', sf = u.decStatus || 'all';
    const all = allDecisions();
    const k = K();
    const rows = all.filter((a) => (rf === 'all' || a.role === rf) && (sf === 'all' || a.status === sf));
    const pend = all.filter((a) => a.status === 'pending');
    const decided = all.filter((a) => a.status !== 'pending');
    const times = decided.map((a) => a.mins != null ? a.mins : minsBetween(a.createdAt, a.decidedAt)).filter((x) => x != null).sort((a, b) => a - b);
    const med = times.length ? times[Math.floor(times.length / 2)] : 0;
    const roles = ['all'].concat(CP.data.roles.map((r) => r.id));

    let h = ui.head('CISO oversight', 'Decisions across the organisation', 'Every action above threshold stops at a named human. You see all of them, who decided, how fast, and which decision rights you have delegated.', '<button data-action="exportDecisions">' + CP.icon('file') + ' Export audit trail</button>');
    h += '<div class="metrics" style="margin-bottom:18px">' +
      ui.metric({ icon: 'bell', label: 'Pending now (all roles)', value: pend.length, color: pend.length ? 'var(--red-ink)' : null, foot: CP.store.pendingApprovals('ciso').length + ' for you' }) +
      ui.metric({ icon: 'users', label: 'Decisions this week', value: decided.length, foot: decided.filter((a) => a.status === 'rejected').length + ' rejected · ' + k.humanDecisions + ' today' }) +
      ui.metric({ icon: 'clock', label: 'Median time to decide', value: med, unit: 'min', foot: 'from escalation to decision' }) +
      ui.metric({ icon: 'zap', label: 'Actions without a human', value: k.autonomousShare, unit: '%', foot: CP.fmt(Math.round(k.actionsToday * k.autonomousShare / 100)) + ' of ' + CP.fmt(k.actionsToday) + ' today' }) + '</div>';

    if (pend.length) h += ui.card(CP.icon('bell') + ' Pending across the organisation', '<div class="grid g2">' + pend.map((a) => ui.decision(a, { pulse: true })).join('') + '</div>', { cls: 'accent', style: 'margin-bottom:18px' });

    const filt = '<div class="cc-filters"><div class="pill-tabs" role="group" aria-label="Filter by role"><span class="lbl">Role</span>' + roles.map((r) => { const n = all.filter((a) => r === 'all' || a.role === r).length; return '<button class="' + (rf === r ? 'active' : '') + '" data-action="decRole" data-v="' + r + '" aria-pressed="' + (rf === r) + '">' + esc(r === 'all' ? 'All roles' : roleLabel(r)) + ' <span class="muted">' + n + '</span></button>'; }).join('') + '</div>' +
      '<div class="pill-tabs" role="group" aria-label="Filter by status"><span class="lbl">Status</span>' + [['all', 'All'], ['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected']].map((s) => '<button class="' + (sf === s[0] ? 'active' : '') + '" data-action="decStatus" data-v="' + s[0] + '" aria-pressed="' + (sf === s[0]) + '">' + s[1] + '</button>').join('') + '</div></div>';
    const tbl = ui.table([
      { label: 'Decision', render: (a) => '<b style="font-weight:600">' + esc(a.title) + '</b>' + (a.threshold ? '<div class="small-txt muted">Above threshold: ' + esc(a.threshold) + '</div>' : '') },
      { label: 'Held by', render: (a) => ui.tag(esc(roleLabel(a.role)), a.role === 'ciso' ? 'indigo' : '') },
      { label: 'Decider', render: (a) => ui.who(a.decider) },
      { label: 'Requested by', render: (a) => ui.who(a.requestedBy) },
      { label: 'Level', render: (a) => a.autonomy ? lvlS(a.autonomy) : '' },
      { label: 'Status', render: (a) => ui.status(a.status) },
      { label: 'Raised', render: (a) => '<span class="mono small-txt">' + esc(a.createdAt || '') + '</span>' },
      { label: 'Decided', render: (a) => a.status === 'pending' ? '<span class="muted small-txt">waiting</span>' : '<span class="mono small-txt">' + esc(a.decidedAt || '') + '</span>' + (a.decidedBy ? '<div class="small-txt muted">' + esc(pname(a.decidedBy)) + '</div>' : '') },
      { label: 'Context', render: (a) => a.scenario ? ui.tag(esc((CP.scenarioById(a.scenario) || {}).n + ' ' + ((CP.scenarioById(a.scenario) || {}).short || '')), 'teal') : '<span class="small-txt muted">Business as usual</span>' }
    ], rows, { rowClass: () => 'clickable', rowAttrs: (a) => 'data-action="openDecision" data-id="' + esc(a.id) + '"', empty: 'No decision matches these filters.' });
    h += ui.card(CP.icon('list') + ' Decision history', filt + tbl, { sub: 'Live decisions from today plus this week. Click a row for the full record.', style: 'margin-bottom:18px' });

    /* Decision rights */
    const rights = CP.data.rights;
    const groups = {};
    rights.forEach((r) => { const key = r.decider || 'agent'; (groups[key] = groups[key] || []).push(r); });
    const order = Object.keys(groups).sort((a, b) => (a === 'agent' ? -1 : b === 'agent' ? 1 : groups[b].length - groups[a].length));
    const holders = '<div class="cc-holders">' + order.map((key) => {
      const list = groups[key];
      const nm = key === 'agent' ? 'Agents alone' : pname(key);
      const sub = key === 'agent' ? 'L3 · act, sampled afterwards' : (CP.person(key) || {}).title || '';
      return '<div class="cc-holder' + (key === 'p-elena' ? ' me' : '') + '" title="' + esc(list.map((r) => r.action).join(' · ')) + '"><div class="row" style="gap:8px">' + (key === 'agent' ? '<span class="av agent sm">AI</span>' : ui.av(key, 'sm')) + '<b class="n">' + list.length + '</b></div><b style="font-size:12.5px">' + esc(nm) + (key === 'p-elena' ? ' (you)' : '') + '</b><span class="muted">' + esc(sub) + '</span></div>';
    }).join('') + '</div>';
    const rtbl = ui.table([
      { label: 'Action', render: (r) => '<b style="font-weight:600">' + esc(r.action) + '</b>' },
      { label: 'Domain', render: (r) => r.domain === 'all' ? ui.tag('All', 'outline') : ui.dom(r.domain) },
      { label: 'Level', render: (r) => ui.lvl(r.level) },
      { label: 'Decision holder', render: (r) => r.decider ? ui.who(r.decider) : ui.tag(CP.icon('bot') + ' Agent alone', 'green') },
      { label: 'Why', render: (r) => '<span class="small-txt muted">' + esc(r.why) + '</span>' }
    ], rights, { rowClass: (r) => r.decider === 'p-elena' ? 'cc-mine' : '' });
    const thr = '<div class="cc-thr">' + CP.data.thresholds.map((t) => '<div><b>' + esc(t.k) + '</b><span>' + esc(t.v) + '</span></div>').join('') + '</div>';

    const dd = autoByDomain();
    const deleg = ui.hbars(dd.map((x) => ({ label: CP.domain(x.d).label, value: Math.round(x.share), color: CP.domain(x.d).hex })), { max: 100, unit: '%' });
    const byHolder = {}; decided.forEach((a) => { byHolder[a.decidedBy || a.decider] = (byHolder[a.decidedBy || a.decider] || 0) + 1; });
    const holderBars = ui.hbars(Object.keys(byHolder).sort((a, b) => byHolder[b] - byHolder[a]).map((p) => ({ label: (CP.person(p) || { name: p }).name, value: byHolder[p], color: p === 'p-elena' ? '#451dc7' : '#9d8fc4' })), {});

    h += '<div class="grid g-2-1" style="margin-bottom:18px">' +
      ui.card(CP.icon('scale') + ' Decision-rights matrix', holders + rtbl, { sub: 'Who holds which decision. Your rows are highlighted. Version 3, signed 2 Sep 2026.', right: '<a class="small-txt" href="' + CP.href('rights') + '">Concept view ' + CP.icon('arrowRight') + '</a>' }) +
      '<div class="stack">' + ui.card(CP.icon('alert') + ' Thresholds you signed', thr, { sub: 'Crossing any one of them stops the agent and calls a human' }) +
      ui.card(CP.icon('zap') + ' Delegation by domain', deleg + '<p class="small-txt muted" style="margin:10px 0 0">Share of today\'s agent tasks executed without waiting for a human, weighted by volume.</p>', { sub: 'Autonomous share of tasks today' }) +
      ui.card(CP.icon('users') + ' Who decided this week', holderBars, { sub: plural(decided.length, 'decision') + ' recorded' }) + '</div></div>';
    return h;
  }

  /* ---------------- Value & ROI ---------------- */
  function valueTab() {
    const k = K(); const v = value();
    let h = ui.head('Value & ROI', 'What the platform delivers', 'Hours given back to the teams, faster containment, and the AI bill next to the value it creates. Live figures for October, history since the platform went live in January 2026.', '<button data-action="valueMethod">' + CP.icon('info') + ' Method</button><button class="primary" data-go="ciso/board">' + CP.icon('file') + ' Put it in the board brief</button>');
    h += '<div class="metrics" style="margin-bottom:18px">' +
      ui.metric({ icon: 'hourglass', label: 'Hours saved · month to date', value: CP.fmt(v.hours), unit: 'h', foot: CP.fmt(BIZ_DAYS_ELAPSED) + ' business days · scenarios add live' }) +
      ui.metric({ icon: 'users', label: 'FTE equivalent (run-rate)', value: CP.fmt(v.fte, 1), unit: 'FTE', foot: 'capacity redeployed to supervision, assurance and Engage' }) +
      ui.metric({ icon: 'euro', label: 'Value vs AI cost · MTD', value: CP.fmt(v.roi, 1), unit: 'x', color: 'var(--green-ink)', foot: CP.eur(Math.round(v.valMTD / 100) * 100) + ' value · ' + CP.eur(v.aiMTD) + ' AI run cost' }) +
      ui.metric({ icon: 'clock', label: 'Mean time to contain', value: k.mttcMinutes, unit: 'min', delta: '-' + Math.round((1 - k.mttcMinutes / 340) * 100) + '%', deltaDir: 'up', foot: 'vs 5 h 40 in 2025' }) + '</div>';

    const costVal = ui.line([{ label: 'Value', color: '#088a42', values: VALUE_K }, { label: 'AI cost', color: '#c8861a', values: COST_K, dash: true }], MONTHS, { h: 210, min: 0, max: 120, unit: 'k', marker: 3, markerLabel: 'break-even', label: 'Value delivered and AI run cost per month, thousands of euros' });
    const roi = '<div class="cc-roi"><div><b>' + CP.eur(v.hours * RATE) + '</b>analyst hours (€' + RATE + '/h)</div><div><b>' + CP.eur(v.avoided) + '</b>MSSP L1 contract avoided</div><div><b>' + CP.eur(v.aiMTD) + '</b>AI run cost (models, compute)</div></div>';
    const mttc = ui.line([{ label: 'MTTC', color: '#451dc7', values: MTTC_HIST.concat([k.mttcMinutes]) }], WEEKS, { w: 440, h: 290, min: 0, max: 48, unit: ' min', label: 'Mean time to contain over 12 weeks, minutes' });
    const auto = ui.line([{ label: 'Share', color: '#088a42', values: AUTO_HIST.concat([k.autonomousShare]) }], WEEKS, { w: 420, h: 230, min: 60, max: 100, unit: '%', label: 'Autonomous share of actions over 12 weeks, percent' });
    h += '<div class="grid g-3-2" style="margin-bottom:18px">' +
      ui.card(CP.icon('euro') + ' Value delivered vs AI run cost', costVal + roi, { sub: 'Thousands of euros per month, same unit on one axis. October month to date below.' }) +
      ui.card(CP.icon('clock') + ' Mean time to contain', '<div class="cc-chart">' + mttc + '</div>' + '<div class="cc-roi"><div><b>' + k.mttcMinutes + ' min</b>this week (live)</div><div><b>1 h 05</b>90th percentile</div><div><b>7 min</b>best night case (S2)</div></div>', { sub: 'Last 12 weeks' }) + '</div>';

    const hoursDom = DOMS.map((d) => ({ d, v: Math.round(v.hours * DOM_SHARE[d]) })).sort((a, b) => b.v - a.v);
    const costDom = DOMS.map((d) => ({ label: CP.domain(d).label, value: CP.store.get('agents').filter((a) => a.domain === d).reduce((s, a) => s + a.costToday, 0), color: CP.domain(d).hex }));
    const orchCost = Math.max(0, k.aiCostToday - costDom.reduce((s, x) => s + x.value, 0));
    if (orchCost) costDom.push({ label: 'Orchestrator & context', value: orchCost, color: '#451dc7' });
    h += '<div class="grid g3" style="margin-bottom:18px">' +
      ui.card(CP.icon('zap') + ' Autonomous share of actions', '<div class="cc-chart">' + auto + '</div>', { sub: 'Last 12 weeks, percent' }) +
      ui.card(CP.icon('layers') + ' Hours saved by domain', ui.hbars(hoursDom.map((x) => ({ label: CP.domain(x.d).label, value: x.v, color: CP.domain(x.d).hex })), { unit: ' h' }) + '<p class="small-txt muted" style="margin:10px 0 0">Month to date. SOC triage and GRC evidence work carry most of the gain.</p>', { sub: 'October, month to date' }) +
      ui.card(CP.icon('euro') + ' AI cost by domain today', ui.donut(costDom, { size: 132, center: CP.eur(k.aiCostToday), centerSub: 'today' }), { sub: '€' + CP.fmt(v.perAction, 2) + ' per action' }) + '</div>';

    h += ui.card(CP.icon('play') + ' The four scenarios: manual vs platform', '<div class="grid g4">' + CP.scenarios.map((s) => {
      const V = s.value;
      const bars = V.manualHours ? ui.hbars([{ label: 'Manual', value: V.manualHours, color: '#b9b3c9' }, { label: 'Platform', value: V.platformHours, color: '#451dc7' }], { unit: ' h' }) : '<div class="notice" style="font-size:12px">No manual equivalent: without an assurance function, a drifting agent keeps acting until a breach reveals it.</div>';
      return '<div class="cc-scn"><div class="row" style="gap:6px"><span class="mono small-txt muted">' + esc(s.n) + '</span>' + CP.icon(s.icon) + '<span class="spacer"></span>' + ui.tag(plural(V.decisions, 'human decision'), 'amber') + '</div><h3>' + esc(s.title) + '</h3>' +
        '<div class="cmp"><div><b>' + esc(V.manual) + '</b>manual</div><div class="p"><b>' + esc(V.platform) + '</b>with the platform</div></div>' +
        '<div class="small-txt muted">Human hours</div>' + bars + (V.manualHours ? '<div class="small-txt muted" style="line-height:1.45">' + esc(V.note) + '</div>' : '') +
        '<button class="small" data-scenario-start="' + esc(s.id) + '" data-goto="ciso">' + CP.icon('play') + ' Replay live</button></div>';
    }).join('') + '</div>', { sub: 'Same incident, two ways of working. Human hours include analysts, managers and decision holders.', style: 'margin-bottom:18px' });

    const tpPct = Math.round(k.thirdPartiesAssessed / 1240 * 100);
    const triageAgent = CP.agent('ag-soc-triage') || { costToday: 412, tasksToday: 3420 };
    const BA = [
      ['Mean time to contain', '5 h 40', fmtMin(k.mttcMinutes), '-' + Math.round((1 - k.mttcMinutes / 340) * 100) + '%'],
      ['Alerts triaged with business context', '35% (sampling)', '100% · ' + CP.fmt(k.alertsTriaged) + ' today', 'full coverage'],
      ['Zero-day: advisory to protection', '3 to 5 days', '6 min (virtual patch, sandbox-tested)', 'hours to minutes'],
      ['Critical supplier questionnaire turnaround', '3 weeks', '4 h (11 of 14 answered in S1)', '-99%'],
      ['DORA supervisory evidence pack', '3 weeks · 6 people', '2 days, gaps found first', '-90% effort'],
      ['New detection rule, idea to production', '12 days', '9 min, backtested on 30 days', 'continuous'],
      ['ICT third parties assessed', '420 of 1,240 (34%)', CP.fmt(k.thirdPartiesAssessed) + ' of 1,240 (' + tpPct + '%)', '+' + (tpPct - 34) + ' pts'],
      ['Cost per triaged alert', '€6.10 (MSSP L1)', '€' + CP.fmt(triageAgent.costToday / Math.max(1, triageAgent.tasksToday), 2), '-98%'],
      ['Analysts on L1 triage', '22', '6 (16 moved to supervision, assurance, Engage)', 'redeployed'],
      ['Escalations reaching the CISO per week', 'about 40, by email', 'about 3, above threshold, with a recommendation', 'signal, not noise'],
      ['Who watches automation', 'nobody', 'Trust & Challenge: evals, deviation hunt, red team', 'new control']
    ];
    h += ui.card(CP.icon('trending') + ' What changed since the platform', ui.table([
      { label: 'What', render: (r) => '<b style="font-weight:600">' + esc(r[0]) + '</b>' },
      { label: 'Before the platform (2025)', render: (r) => '<span class="muted">' + esc(r[1]) + '</span>' },
      { label: 'Now (live)', render: (r) => '<b style="color:var(--indigo)">' + esc(r[2]) + '</b>' },
      { label: 'Effect', render: (r) => ui.tag(esc(r[3]), 'green') }
    ], BA), { sub: '2025 baseline measured by the performance manager before go-live' });
    return '<div data-tour="ciso-value">' + h + '</div>';
  }

  /* ---------------- Organisation ---------------- */
  function unitBtn(id, sel, cls) {
    const u = ORG[id];
    return '<button class="cc-ou ' + (cls || '') + (sel === id ? ' sel' : '') + '" data-action="orgSel" data-u="' + id + '" aria-pressed="' + (sel === id) + '"' + (cls === 'head' ? ' style="--bc:' + u.color + '"' : '') + '>' +
      '<span class="on"><b>' + esc(u.name) + '</b>' + (u.hc ? '<span class="hc">' + u.hc + '</span>' : '<span class="hc">' + CP.icon('database') + '</span>') + '</span>' +
      '<span class="ow">' + esc(u.short) + '</span>' +
      (u.people.length && cls !== 'head' && cls !== 'ciso' ? '<span class="avs">' + u.people.map((p) => ui.av(p, 'sm')).join('') + '</span>' : '') + '</button>';
  }
  function liveFor(id) {
    const k = K(); const S = CP.store;
    const pend = (r) => S.pendingApprovals(r).length;
    const M = {
      ciso: [['Decisions pending for you', pend('ciso')], ['Human decisions today', k.humanDecisions], ['Cyber risk score', k.riskScore + '/100']],
      'br-engage': [['Decisions pending', pend('engage')], ['Messages awaiting validation', S.get('comms').filter((c) => c.status === 'awaiting').length], ['Regulatory items at risk', S.get('regulatory').filter((r) => r.status === 'at-risk').length]],
      'eng-strategy': [['Decision rights in force', CP.data.rights.length], ['Thresholds', CP.data.thresholds.length]],
      'eng-biso': [['Business units', S.get('businessUnits').length], ['Open business requests', S.get('businessUnits').reduce((s, b) => s + b.openRequests, 0)]],
      'eng-crisis': [['Live cases', S.get('cases').filter((c) => c.status !== 'closed').length], ['Critical or high', S.get('cases').filter((c) => c.status !== 'closed' && (c.severity === 'critical' || c.severity === 'high')).length]],
      'eng-comp': [['Decisions pending', pend('engage')], ['Messages awaiting validation', S.get('comms').filter((c) => c.status === 'awaiting').length], ['Third parties assessed', CP.fmt(k.thirdPartiesAssessed)]],
      'eng-culture': [['Targeted modules this month', 7], ['Staff reached', '6,840']],
      'br-ops': [['Agents in production', S.get('agents').length], ['Actions today', CP.fmt(k.actionsToday)], ['AI cost today', CP.eur(k.aiCostToday)]],
      'br-build': [['Decisions pending', pend('build')], ['Releases in progress', S.get('releases').filter((r) => r.status === 'in-progress').length], ['Backlog items open', S.get('backlog').filter((b) => b.status !== 'done').length]],
      'b-po': [['Decisions pending', pend('build')], ['New backlog requests', S.get('backlog').filter((b) => b.status === 'new').length]],
      'b-dev': [['Items in progress', S.get('backlog').filter((b) => b.status === 'in-progress').length], ['Evals in warning', S.get('evals').filter((e) => e.status === 'warn').length]],
      'b-pm': [['Connectors in delivery', S.get('backlog').filter((b) => b.type === 'connector' && b.status !== 'done').length], ['Identities in the graph', CP.fmt(CP.data.company.identities)]],
      'br-run': [['Decisions pending', pend('run')], ['Agents active', S.get('agents').filter((a) => a.status === 'active').length + '/' + S.get('agents').length], ['Kill-switches today', k.killSwitches]],
      'r-sup': [['Actions today', CP.fmt(k.actionsToday)], ['Kill-switches today', k.killSwitches], ['Decisions pending', pend('run')]],
      'r-qa': [['Actions sampled today', k.qaSampled], ['Agreement with humans', CP.fmt(k.qaAgreement, 1) + '%']],
      'r-perf': [['AI cost today', CP.eur(k.aiCostToday)], ['Cost per action', '€' + CP.fmt(value().perAction, 2)], ['Value vs AI cost (MTD)', CP.fmt(value().roi, 1) + 'x']],
      'br-tc': [['Decisions pending', pend('trust')], ['Eval average', CP.fmt(evalAvg(), 1) + '%'], ['Open deviations', S.get('deviations').filter((d) => d.status !== 'closed').length]],
      't-eval': [['Eval suites run this week', S.get('evals').length], ['Eval average', CP.fmt(evalAvg(), 1) + '%']],
      't-dev': [['Open deviations', S.get('deviations').filter((d) => d.status !== 'closed').length], ['Agents baselined', S.get('agents').length]],
      't-red': [['Campaigns on record', S.get('redteam').length], ['Bypassed (to fix)', S.get('redteam').filter((r) => r.result === 'bypassed').length]],
      't-lab': [['Adversary emulations', S.get('redteam').filter((r) => r.technique === 'Adversary emulation').length], ['Last result', (S.get('redteam').find((r) => r.technique === 'Adversary emulation') || {}).result === 'blocked_' ? 'Blocked' : 'Detected']],
      lod2: [['Evidence re-sampled this year', '1,920 items'], ['Discrepancies found', '3']]
    };
    return M[id] || [];
  }
  function orgDetail(sel) {
    if (sel && sel.indexOf('dom-') === 0) {
      const d = sel.slice(4); const D = CP.domain(d);
      const ags = CP.store.get('agents').filter((a) => a.domain === d);
      const pos = Array.from(new Set(ags.map((a) => a.owner))), sups = Array.from(new Set(ags.map((a) => a.supervisor)));
      return ui.card('<span class="dom"><i style="background:' + D.color + '"></i></span> ' + esc(D.label) + ' agents', '<p class="small-txt muted" style="margin:0 0 10px">One domain of the shared platform. Built by Build, supervised by Run, challenged by Trust &amp; Challenge.</p>' +
        '<div class="list">' + ags.map((a) => '<div class="list-item" style="padding:7px 0"><span class="cc-sq ' + esc(a.status) + '" style="margin-top:6px"></span><div class="li-main"><div class="li-title" style="font-size:13px">' + esc(a.name) + ' <span class="muted small-txt mono">v' + esc(a.version) + '</span></div><div class="li-sub">' + CP.fmt(a.tasksToday) + ' tasks today · ' + a.autoRate + '% autonomous · ' + CP.eur(a.costToday) + '</div></div>' + lvlS(a.mode) + '</div>').join('') + '</div>' +
        '<h3 style="margin:12px 0 6px;font-size:13px">Owned by</h3><div class="row wrap">' + pos.map((p) => ui.who(p)).join('') + '</div><h3 style="margin:12px 0 6px;font-size:13px">Supervised by</h3><div class="row wrap">' + sups.map((p) => ui.who(p)).join('') + '</div>' +
        '<div class="row wrap" style="margin-top:14px"><a href="' + CP.href('run', 'ops') + '">' + CP.icon('external') + ' Run console</a><a href="' + CP.href('build') + '">' + CP.icon('external') + ' Build console</a></div>', { cls: 'accent cc-od' });
    }
    const u = ORG[sel] || ORG.ciso;
    const live = liveFor(sel);
    const con = u.console;
    return ui.card(esc(u.name), '<div class="row wrap" style="gap:6px;margin:-6px 0 10px">' + (u.hc ? ui.tag(u.hc + ' people', 'indigo') : ui.tag('Platform, no headcount', 'outline')) + ui.tag(esc(u.short), 'outline') + '</div>' +
      '<p class="small-txt" style="margin:0 0 10px;line-height:1.55">' + esc(u.mission) + '</p>' +
      (u.people.length ? '<div class="stack" style="gap:6px;margin-bottom:10px">' + u.people.map((p) => ui.who(p)).join('') + '</div>' : '') +
      '<h3 style="margin:10px 0 2px;font-size:13px">Owns on the platform</h3><ul>' + u.owns.map((o) => '<li>' + esc(o) + '</li>').join('') + '</ul>' +
      (live.length ? '<h3 style="margin:12px 0 6px;font-size:13px">Live now</h3><dl class="kv">' + live.map((x) => '<dt>' + esc(x[0]) + '</dt><dd class="num">' + esc(x[1]) + '</dd>').join('') + '</dl>' : '') +
      '<div style="margin-top:14px"><a class="row small-txt" style="gap:6px;font-weight:600;font-size:13.5px" href="' + CP.href(con[0], con[1]) + '">' + CP.icon('external') + ' Open the ' + esc((CP.role(con[0]) || { label: 'CISO' }).label) + ' console</a></div>', { cls: 'accent cc-od' });
  }
  function orgTab(scr) {
    const sel = scr.ui.orgSel || 'ciso';
    const agents = CP.store.get('agents');
    const hcBar = [['CISO office', 3, '#211248'], ['Engage', 46, '#1597a5'], ['Build', 34, '#e0662b'], ['Run', 32, '#2f7de1'], ['Trust & Challenge', 25, '#5a2be0']];
    let h = ui.head('Organisation', 'The new CISO organisation', '140 people around one Cyber AI Platform. Engage speaks for cyber outside, Platform Operations builds and runs the agents, Trust & Challenge keeps checking that they deserve trust. Click any unit.', '<button data-action="orgSel" data-u="ciso">' + CP.icon('restart') + ' Reset view</button>');
    h += '<div class="card" style="padding:14px 18px;margin-bottom:18px"><div class="row between small-txt"><b>Headcount · 140</b><span class="muted">Before the platform: 152 FTE in 9 siloed teams, 22 of them on L1 triage</span></div>' +
      '<div class="cc-hcbar" role="img" aria-label="Headcount by team">' + hcBar.map((x) => '<span style="width:' + (x[1] / 140 * 100) + '%;background:' + x[2] + '" title="' + esc(x[0]) + ': ' + x[1] + '">' + (x[1] > 20 ? esc(x[0]) + ' ' + x[1] : x[1]) + '</span>').join('') + '</div></div>';
    const org = '<div class="cc-org" role="tree" aria-label="Organisation chart">' +
      '<div class="cc-org-top">' + unitBtn('ciso', sel, 'ciso') + '</div>' +
      '<div class="cc-branches">' +
        '<div class="cc-br">' + unitBtn('br-engage', sel, 'head') + '<div class="cc-br-body">' + BR_ENGAGE.map((id) => unitBtn(id, sel)).join('') + '</div></div>' +
        '<div class="cc-br">' + unitBtn('br-ops', sel, 'head') + '<div class="cc-br-body"><div class="cc-sub2"><div class="stack" style="gap:6px">' + unitBtn('br-build', sel, 'head') + BR_BUILD.map((id) => unitBtn(id, sel)).join('') + '</div>' +
          '<div class="stack" style="gap:6px">' + unitBtn('br-run', sel, 'head') + BR_RUN.map((id) => unitBtn(id, sel)).join('') + '</div></div></div></div>' +
        '<div class="cc-br">' + unitBtn('br-tc', sel, 'head') + '<div class="cc-br-body"><div class="cc-sublbl">AI assurance</div>' + unitBtn('t-eval', sel) + unitBtn('t-dev', sel) + '<div class="cc-sublbl">Offensive</div>' + unitBtn('t-red', sel) + unitBtn('t-lab', sel) + unitBtn('lod2', sel, 'lod2') + '</div></div>' +
      '</div>' +
      '<div class="cc-plat"><div class="cc-plat-h"><b>' + CP.icon('layers') + ' CYBER AI PLATFORM</b><span>Build builds it · Run operates it · Trust &amp; Challenge challenges it · Engage speaks for it</span></div>' +
        '<div class="cc-plat-doms">' + DOMS.map((d) => { const D = CP.domain(d); const ags = agents.filter((a) => a.domain === d); const deg = ags.some((a) => a.status !== 'active'); return '<button class="cc-pd' + (sel === 'dom-' + d ? ' sel' : '') + '" style="--dc:' + D.color + '" data-action="orgSel" data-u="dom-' + d + '" aria-pressed="' + (sel === 'dom-' + d) + '">' + esc(D.label) + '<small>' + plural(ags.length, 'agent') + (deg ? ' · reduced' : '') + '</small></button>'; }).join('') + '</div>' +
        '<div class="cc-plat-ctx"><div class="ctx">' + CP.icon('database') + ' One shared context: cyber security graph + cyber data lake</div><div>' + CP.icon('workflow') + ' AI orchestrator · decision rights</div><div>' + CP.icon('power') + ' Sandbox · kill-switch · rollback</div></div></div>' +
      '</div>';
    h += '<div class="cc-orgwrap" data-tour="ciso-org">' + org + orgDetail(sel) + '</div>';
    h += ui.card(CP.icon('list') + ' Who owns what on the platform', ui.table([
      { label: 'Platform responsibility', render: (r) => '<b style="font-weight:600">' + esc(r[0]) + '</b>' },
      { label: 'Owner', render: (r) => esc(r[1]) },
      { label: 'People', render: (r) => '<div class="row" style="gap:4px">' + (ORG[r[2]].people.length ? ORG[r[2]].people.map((p) => ui.av(p, 'sm')).join('') : '<span class="muted small-txt">' + ORG[r[2]].hc + ' people</span>') + '</div>' },
      { label: '', render: (r) => '<button class="small" data-action="orgSel" data-u="' + r[2] + '">View unit</button>' }
    ], OWNERSHIP), { style: 'margin-top:18px', sub: 'Separation of duties: those who build an agent never sign off its evaluation' });
    return h;
  }

  /* ---------------- Board brief ---------------- */
  function briefData(scr) {
    const k = K(); const v = value(); const ctl = control();
    const bus = CP.store.get('businessUnits');
    const regs = CP.store.get('regulatory');
    const onTrack = regs.filter((r) => r.status !== 'at-risk');
    const atRisk = regs.filter((r) => r.status === 'at-risk');
    const cases = CP.store.get('cases');
    const rt = CP.store.get('redteam');
    const devs = CP.store.get('deviations');
    const aud = scr.ui.aud || 'Board of Directors';
    const allDown = bus.every((b) => b.trend[b.trend.length - 1] < b.trend[0]);
    const msgs = [
      'Cyber risk score ' + k.riskScore + '/100, down ' + (RISK_Q_START - k.riskScore) + ' points over the quarter' + (allDown ? '; all ' + bus.length + ' business units improving.' : '.'),
      k.autonomousShare + '% of the ' + CP.fmt(k.actionsToday) + ' security actions of the day ran autonomously inside guardrails; every action above threshold went to a named decision holder (' + k.humanDecisions + ' decisions today).',
      (ctl.lvl === 'green' ? 'Agents under control: ' : ctl.lvl === 'amber' ? 'Agents under control, with one restriction: ' : 'Attention on the agents: ') + ctl.why
    ];
    cases.filter((c) => c.scenario && (c.severity === 'critical' || c.severity === 'high')).forEach((c) => msgs.push(c.title + ': ' + c.summary));
    msgs.push(onTrack.length + ' of ' + regs.length + ' regulatory commitments on track' + (atRisk.length ? '; at risk: ' + atRisk.map((r) => r.framework + ' ' + r.item.split(/[,(:]/)[0].trim()).join('; ') : '') + '.');
    msgs.push(CP.fmt(v.hours) + ' analyst hours saved this month (' + CP.fmt(v.fte, 1) + ' FTE run-rate); value ' + CP.fmt(v.valMTD / 1000, 0) + 'k€ for ' + CP.fmt(v.aiMTD / 1000, 1) + 'k€ of AI run cost (' + CP.fmt(v.roi, 1) + 'x).');

    const risks = [];
    const c1 = CP.store.find('cases', 'C-2301'); const atlas = CP.store.find('thirdParties', 'tp-atlas');
    if (c1) risks.push({ t: 'Supplier exposure to FileBridge MFT (CVE-2026-41877)', lvl: atlas && atlas.questionnaire && atlas.questionnaire.status === 'flagged' ? 'High' : 'Medium', trend: c1.status === 'closed' ? 'Falling' : 'Rising', owner: 'p-amira', treat: c1.summary });
    const c2 = CP.store.find('cases', 'C-2302');
    if (c2) risks.push({ t: 'Identity compromise of payment approvers', lvl: 'High', trend: 'Stable', owner: 'p-lucas', treat: c2.summary + ' Phishing-resistant MFA for all approvers in the Build backlog.' });
    const dv = devs.find((d) => d.scenario);
    if (dv) risks.push({ t: 'Manipulation of AI agents (prompt injection)', lvl: dv.status === 'closed' ? 'Medium' : 'High', trend: dv.status === 'closed' ? 'Falling' : 'Rising', owner: 'p-jonas', treat: 'Drift ' + dv.id + ' on ' + pname(dv.agent) + ': ' + (dv.status === 'closed' ? 'detected by our own assurance, contained, fixed and proven; 30 injection tests added to the eval suite.' : dv.status + '.') });
    risks.push({ t: 'Ransomware on the payment chain', lvl: 'High', trend: 'Falling', owner: 'p-lucas', treat: 'Virtual patching in minutes, ' + CP.fmt(k.detectionsLive) + ' live detections, DORA TLPT 2026 at 3 of 5 scenarios.' });
    const noExit = CP.store.get('thirdParties').filter((t) => t.criticality === 'critical' && !t.exitPlan).length;
    risks.push({ t: 'Concentration on critical ICT suppliers', lvl: 'High', trend: 'Stable', owner: 'p-amira', treat: noExit + ' critical suppliers without a tested exit plan; tests scheduled with business owners by Q1 2027.' });
    const c3 = CP.store.find('cases', 'C-2284');
    risks.push({ t: 'Toxic access combinations in finance', lvl: 'Medium', trend: 'Falling', owner: 'p-mei', treat: c3 ? c3.summary : 'Continuous access review by the Access Review Agent.' });

    return {
      aud, title: 'Cyber risk & platform brief · Q3 2026', meta: [aud + ' · 22 October 2026', 'Prepared ' + clockInfo().date + ' by the Group CISO', 'Computed from live platform data'],
      kpis: [['Risk score', k.riskScore + '/100'], ['Time to contain', fmtMin(k.mttcMinutes)], ['Autonomous actions', k.autonomousShare + '%'], ['Value vs AI cost', CP.fmt(v.roi, 1) + 'x']],
      msgs, bus, risks: risks.slice(0, 3), regs, ctl,
      agents: { n: CP.store.get('agents').length, ks: k.killSwitches, evals: evalAvg(), qa: k.qaAgreement, devQ: devs.length, blocked: rt.filter((r) => r.result === 'blocked_').length, detected: rt.filter((r) => r.result === 'detected').length, bypassed: rt.filter((r) => r.result === 'bypassed').length },
      value: v,
      asks: ['Note the decision-rights policy v3: ' + CP.data.rights.filter((r) => r.level === 'L3').length + ' action types fully delegated to agents, ' + CP.data.rights.filter((r) => r.decider === 'p-elena').length + ' held by the CISO.', 'Approve the 2027 budget line for exit-plan tests of critical ICT suppliers (€380k).', 'Endorse "agents under control" as a standing board indicator, reported quarterly by Trust & Challenge.']
    };
  }
  function briefHtml(scr) {
    const b = briefData(scr); const sec = scr.ui.sec;
    const sp = (vals) => ui.spark(vals, { w: 70, h: 18, color: '#451dc7' });
    let h = '<div class="bb"><div class="bb-head"><div><div class="bb-eb">Novalys Group · Group CISO · Confidential</div><h2>' + esc(b.title) + '</h2></div><div class="bb-meta">' + b.meta.map(esc).join('<br>') + '</div></div>';
    h += '<div class="bb-kpis">' + b.kpis.map((x) => '<div><b>' + esc(x[1]) + '</b>' + esc(x[0]) + '</div>').join('') + '</div>';
    if (sec.messages) h += '<h3>Key messages</h3><ul>' + b.msgs.map((m) => '<li>' + esc(m) + '</li>').join('') + '</ul>';
    if (sec.bu) h += '<h3>Risk trend by business unit (6 months)</h3><table><thead><tr><th>Business unit</th><th>Score</th><th>Trend</th><th>Change</th><th>Top risk</th></tr></thead><tbody>' +
      b.bus.map((u) => '<tr><td><b>' + esc(u.name) + '</b></td><td>' + u.riskScore + '</td><td>' + sp(u.trend) + '</td><td>' + (u.trend[u.trend.length - 1] - u.trend[0]) + ' pts</td><td>' + esc(u.topRisks[0]) + '</td></tr>').join('') + '</tbody></table>';
    if (sec.risks) h += '<h3>Top 3 risks</h3><table><thead><tr><th>Risk</th><th>Level</th><th>Trend</th><th>Owner</th><th>Treatment and status</th></tr></thead><tbody>' +
      b.risks.map((r) => '<tr><td><b>' + esc(r.t) + '</b></td><td>' + esc(r.lvl) + '</td><td>' + esc(r.trend) + '</td><td>' + esc(pname(r.owner)) + '</td><td>' + esc(r.treat) + '</td></tr>').join('') + '</tbody></table>';
    if (sec.reg || sec.agents) {
      h += '<div class="bb-2">';
      if (sec.reg) h += '<div><h3>Regulatory</h3><table><thead><tr><th>Item</th><th>Due</th><th>Progress</th><th>Status</th></tr></thead><tbody>' + b.regs.map((r) => '<tr><td><b>' + esc(r.framework) + '</b> ' + esc(r.item) + '</td><td>' + esc(r.due) + '</td><td>' + Math.round(r.collected / Math.max(1, r.total) * 100) + '%</td><td>' + esc(RSL[r.status] || r.status) + '</td></tr>').join('') + '</tbody></table></div>';
      if (sec.agents) h += '<div><h3>Agents under control</h3><p style="margin:0 0 6px"><span class="bb-light ' + b.ctl.lvl + '">' + esc(b.ctl.label) + '</span></p><p style="margin:0 0 6px">' + esc(b.ctl.why) + '</p><table><tbody>' +
        '<tr><td>Agents in production</td><td><b>' + b.agents.n + '</b></td></tr><tr><td>Kill-switches pulled (week)</td><td><b>' + b.agents.ks + '</b></td></tr><tr><td>Eval average · QA agreement</td><td><b>' + CP.fmt(b.agents.evals, 1) + '% · ' + CP.fmt(b.agents.qa, 1) + '%</b></td></tr>' +
        '<tr><td>Red team campaigns: blocked · detected · bypassed</td><td><b>' + b.agents.blocked + ' · ' + b.agents.detected + ' · ' + b.agents.bypassed + '</b></td></tr></tbody></table></div>';
      h += '</div>';
    }
    if (sec.value) h += '<h3>Value delivered</h3><p style="margin:0">' + CP.fmt(b.value.hours) + ' analyst hours saved this month (' + CP.fmt(b.value.fte, 1) + ' FTE run-rate, redeployed to supervision, assurance and Engage). Value ' + CP.eur(Math.round(b.value.valMTD / 100) * 100) + ' month to date against ' + CP.eur(b.value.aiMTD) + ' of AI run cost (' + CP.fmt(b.value.roi, 1) + 'x). Break-even reached in April 2026; time to contain down from 5 h 40 to ' + fmtMin(K().mttcMinutes) + '.</p>';
    if (sec.asks) h += '<h3>What we ask of the ' + esc(b.aud === 'Board of Directors' ? 'board' : b.aud.toLowerCase()) + '</h3><ul>' + b.asks.map((a) => '<li>' + esc(a) + '</li>').join('') + '</ul>';
    h += '<div class="bb-foot">Generated by the Cyber AI Platform from the security graph, the data lake and the decision log. Every figure links to its source in the platform. Fictitious company, demo data.</div></div>';
    return h;
  }
  function briefText(scr) {
    const b = briefData(scr); const sec = scr.ui.sec; const L = [];
    L.push(b.title.toUpperCase()); L.push(b.meta.join(' | ')); L.push('');
    L.push(b.kpis.map((x) => x[0] + ': ' + x[1]).join(' | ')); L.push('');
    if (sec.messages) { L.push('KEY MESSAGES'); b.msgs.forEach((m) => L.push('- ' + m)); L.push(''); }
    if (sec.bu) { L.push('RISK TREND BY BUSINESS UNIT'); b.bus.forEach((u) => L.push('- ' + u.name + ': ' + u.riskScore + ' (' + (u.trend[u.trend.length - 1] - u.trend[0]) + ' pts in 6 months), top risk: ' + u.topRisks[0])); L.push(''); }
    if (sec.risks) { L.push('TOP 3 RISKS'); b.risks.forEach((r, i) => L.push((i + 1) + '. ' + r.t + ' [' + r.lvl + ', ' + r.trend + ', owner ' + pname(r.owner) + ']: ' + r.treat)); L.push(''); }
    if (sec.reg) { L.push('REGULATORY'); b.regs.forEach((r) => L.push('- ' + r.framework + ' · ' + r.item + ' · due ' + r.due + ' · ' + Math.round(r.collected / Math.max(1, r.total) * 100) + '% · ' + (RSL[r.status] || r.status))); L.push(''); }
    if (sec.agents) { L.push('AGENTS UNDER CONTROL: ' + b.ctl.label.toUpperCase()); L.push(b.ctl.why); L.push('Agents ' + b.agents.n + ' · kill-switches ' + b.agents.ks + ' · evals ' + CP.fmt(b.agents.evals, 1) + '% · QA ' + CP.fmt(b.agents.qa, 1) + '%'); L.push(''); }
    if (sec.value) { L.push('VALUE'); L.push(CP.fmt(b.value.hours) + ' h saved this month (' + CP.fmt(b.value.fte, 1) + ' FTE), value ' + CP.eur(Math.round(b.value.valMTD / 100) * 100) + ' vs AI cost ' + CP.eur(b.value.aiMTD) + ' (' + CP.fmt(b.value.roi, 1) + 'x).'); L.push(''); }
    if (sec.asks) { L.push('ASKS'); b.asks.forEach((a) => L.push('- ' + a)); }
    return L.join('\n');
  }
  function boardTab(scr) {
    const u = scr.ui;
    u.sec = u.sec || { messages: true, bu: true, risks: true, reg: true, agents: true, value: true, asks: true };
    const aud = u.aud || 'Board of Directors';
    const SECS = [['messages', 'Key messages'], ['bu', 'Risk trend by business unit'], ['risks', 'Top 3 risks'], ['reg', 'Regulatory'], ['agents', 'Agents under control'], ['value', 'Value delivered'], ['asks', 'Asks of the board']];
    const S = CP.store;
    let h = ui.head('Board brief', 'Quarterly board brief, computed live', 'One page for the board, built from the same data the agents use: no spreadsheet, no week of consolidation. Run a scenario and watch the brief change.', '<button data-action="copyBrief">' + CP.icon('file') + ' Copy</button><button class="primary" data-action="genBrief">' + CP.icon('sparkles') + ' Generate board brief</button>');
    const settings = ui.card(CP.icon('filter') + ' Brief settings',
      '<div class="small-txt muted" style="margin-bottom:6px">Audience</div><div class="pill-tabs" style="margin-bottom:14px">' + ['Board of Directors', 'Risk committee', 'Executive committee'].map((a) => '<button class="' + (aud === a ? 'active' : '') + '" data-action="briefAud" data-v="' + esc(a) + '" aria-pressed="' + (aud === a) + '">' + esc(a) + '</button>').join('') + '</div>' +
      '<div class="small-txt muted" style="margin-bottom:6px">Sections</div><div class="cc-chk">' + SECS.map((s) => '<label><input type="checkbox" data-change="briefSec" data-k="' + s[0] + '"' + (u.sec[s[0]] ? ' checked' : '') + '> ' + esc(s[1]) + '</label>').join('') + '</div>');
    const sources = ui.card(CP.icon('database') + ' Sources, live', '<dl class="kv">' +
      [['Business units', S.get('businessUnits').length], ['Cases', S.get('cases').length], ['Regulatory items', S.get('regulatory').length], ['Decisions logged', allDecisions().length], ['Agents', S.get('agents').length], ['Red team campaigns', S.get('redteam').length], ['Deviations', S.get('deviations').length]].map((x) => '<dt>' + esc(x[0]) + '</dt><dd class="num">' + x[1] + '</dd>').join('') +
      '</dl><p class="small-txt muted" style="margin:10px 0 0">Last board brief (Q2) took 6 people 7 days. This one: seconds, on demand, always current. Request B-298 delivered by Build.</p>');
    h += '<div class="grid g-1-2 cc-board"><div class="stack">' + settings + sources + '</div><div class="cc-paper" aria-label="Board brief preview">' + briefHtml(scr) + '</div></div>';
    return h;
  }

  /* ---------------- Modals ---------------- */
  function caseModal(c) {
    const acts = c.scenario ? CP.store.get('actions').filter((a) => a.scenario === c.scenario) : [];
    const aps = c.scenario ? CP.store.get('approvals').filter((a) => a.scenario === c.scenario) : [];
    const body = '<div class="row wrap" style="gap:6px;margin-bottom:12px">' + ui.sev(c.severity) + ui.status(c.status) + (c.domains || []).map(ui.dom).join(' ') + '</div>' +
      '<dl class="kv" style="margin-bottom:14px"><dt>Opened</dt><dd>' + esc(c.opened) + '</dd><dt>Owner</dt><dd>' + ui.who(c.owner) + '</dd><dt>Summary</dt><dd>' + esc(c.summary) + '</dd></dl>' +
      (acts.length ? '<h3>Actions on this case</h3>' + ui.table([{ label: 'Time', render: (a) => '<span class="mono small-txt">' + esc(a.ts) + '</span>' }, { label: 'Agent', render: (a) => ui.who(a.agent) }, { label: 'Action', key: 'action' }, { label: 'Level', render: (a) => lvlS(a.level) }, { label: 'Rollback', render: (a) => a.rollback ? ui.tag('ready', 'green') : '' }], acts) : '<div class="notice info">Handled by agents within guardrails. Full trail in the Run action journal.</div>') +
      (aps.length ? '<h3 style="margin-top:14px">Human decisions</h3><div class="stack" style="gap:10px">' + aps.map((a) => ui.decision(a, { pulse: a.status === 'pending' })).join('') + '</div>' : '');
    CP.modal('Case ' + esc(c.id) + ' · ' + esc(c.title), body, '<button data-action="goClose" data-to="run/journal">' + CP.icon('external') + ' Action journal</button><button class="primary" data-close-modal>Close</button>');
  }
  function agentModal(a) {
    const D = CP.domain(a.domain);
    const ev = CP.store.get('evals').filter((e) => e.agent === a.id);
    const dv = CP.store.get('deviations').filter((d) => d.agent === a.id);
    const body = '<div class="row wrap" style="gap:6px;margin-bottom:12px">' + ui.dom(a.domain) + ui.lvl(a.mode) + ui.status(a.status) + ui.tag('v' + esc(a.version), 'outline') + '</div>' +
      '<div class="grid g2"><dl class="kv"><dt>Product owner</dt><dd>' + ui.who(a.owner) + '</dd><dt>Supervisor</dt><dd>' + ui.who(a.supervisor) + '</dd><dt>Model</dt><dd>' + esc(a.model) + '</dd><dt>Tools</dt><dd class="mono small-txt">' + a.tools.map(esc).join(', ') + '</dd></dl>' +
      '<dl class="kv"><dt>Tasks today</dt><dd class="num">' + CP.fmt(a.tasksToday) + '</dd><dt>Autonomous</dt><dd class="num">' + a.autoRate + '%</dd><dt>Accuracy (QA)</dt><dd class="num">' + CP.fmt(a.accuracy, 1) + '%</dd><dt>Cost today</dt><dd class="num">' + CP.eur(a.costToday) + '</dd></dl></div>' +
      (ev.length ? '<h3 style="margin-top:14px">Evaluations</h3>' + ui.table([{ label: 'Suite', key: 'suite' }, { label: 'Score', render: (e) => CP.fmt(e.score, 1) + '%' }, { label: 'Previous', render: (e) => e.prev ? CP.fmt(e.prev, 1) + '%' : 'new' }, { label: 'Status', render: (e) => ui.status(e.status) }], ev) : '') +
      (dv.length ? '<h3 style="margin-top:14px">Deviations</h3>' + ui.table([{ label: 'ID', key: 'id' }, { label: 'Signal', key: 'signal' }, { label: 'Status', render: (d) => ui.status(d.status) }], dv) : '');
    CP.modal(CP.icon('bot') + ' ' + esc(a.name) + ' <span class="muted small-txt" style="font-weight:500">' + esc(D.label) + '</span>', body, '<button data-action="goClose" data-to="run/safety">' + CP.icon('power') + ' Safety controls in Run</button><button class="primary" data-close-modal>Close</button>');
  }

  /* Close a decision modal once the decision is taken anywhere. */
  CP.bus.on('decision', (p) => {
    const d = document.getElementById('cp-modal');
    if (d && d.open && d.querySelector('[data-decide="' + p.id + '"]') && CP.route.id === 'ciso') setTimeout(() => CP.closeModal(), 350);
  });

  function copyText(txt) {
    const done = () => CP.toast('Board brief copied to the clipboard.');
    const fallback = () => { const ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) { CP.toast('Copy blocked by the browser.', 'warn'); } ta.remove(); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, fallback); else fallback();
  }

  /* ---------------- Screen ---------------- */
  CP.screen({
    id: 'ciso', part: 2, role: 'ciso', label: 'CISO cockpit', icon: 'gauge',
    ui: { feedF: 'all', decRole: 'all', decStatus: 'all', orgSel: 'ciso', aud: 'Board of Directors' },
    render(route) {
      const sub = ['overview', 'decisions', 'value', 'org', 'board'].indexOf(route.sub) >= 0 ? route.sub : 'overview';
      const pc = CP.store.pendingApprovals('ciso').length, pa = CP.store.pendingApprovals().length;
      const tabs = ui.tabbar('ciso', [
        { label: 'COCKPIT', tabs: [{ id: 'overview', label: 'Overview', icon: 'gauge', count: pc || '', warn: true }, { id: 'decisions', label: 'Decisions', icon: 'scale', count: pa || '', warn: true }] },
        { label: 'STEER', tabs: [{ id: 'value', label: 'Value & ROI', icon: 'trending' }, { id: 'org', label: 'Organisation', icon: 'network' }, { id: 'board', label: 'Board brief', icon: 'file' }] }
      ], sub, ui.av('p-elena', 'sm') + '<span><b style="color:#fff">' + esc(pname('p-elena')) + '</b> · ' + esc((CP.person('p-elena') || {}).title || '') + '</span>');
      if (!this.ui.sec) this.ui.sec = { messages: true, bu: true, risks: true, reg: true, agents: true, value: true, asks: true };
      let body;
      if (sub === 'decisions') body = decisionsTab(this);
      else if (sub === 'value') body = valueTab(this);
      else if (sub === 'org') body = orgTab(this);
      else if (sub === 'board') body = boardTab(this);
      else body = overview(this);
      return tabs + '<div class="cc-root">' + body + '</div>';
    },
    actions: {
      feedFilter(el) { this.ui.feedF = el.dataset.f; CP.render(); },
      decRole(el) { this.ui.decRole = el.dataset.v; CP.render(); },
      decStatus(el) { this.ui.decStatus = el.dataset.v; CP.render(); },
      orgSel(el) { this.ui.orgSel = el.dataset.u; CP.render(); if (window.innerWidth <= 1180 && el.closest('.cc-org,.t')) { const od = document.querySelector('.cc-od'); if (od) od.scrollIntoView({ behavior: 'smooth', block: 'start' }); } },
      briefAud(el) { this.ui.aud = el.dataset.v; CP.render(); },
      briefSec(el) { this.ui.sec[el.dataset.k] = el.checked; CP.render(); },
      openCase(el) { CP.go('cases', el.dataset.id); },
      openAgent(el) { const a = CP.agent(el.dataset.id); if (a) agentModal(a); },
      openDecision(el) {
        const a = allDecisions().find((x) => x.id === el.dataset.id); if (!a) return;
        CP.modal('Decision record · ' + esc(a.id), ui.decision(a, { pulse: a.status === 'pending' }) + (a.note ? '<div class="notice" style="margin-top:12px">' + esc(a.note) + '</div>' : '') +
          '<dl class="kv" style="margin-top:14px"><dt>Held by</dt><dd>' + esc(roleLabel(a.role)) + '</dd><dt>Raised</dt><dd>' + esc(a.createdAt || '') + '</dd><dt>Decided</dt><dd>' + esc(a.decidedAt || 'pending') + '</dd><dt>Trail</dt><dd>Stored in the cyber data lake, immutable, linked to the case</dd></dl>',
          '<button class="primary" data-close-modal>Close</button>');
      },
      goClose(el) { CP.closeModal(); const p = el.dataset.to.split('/'); CP.go(p[0], p[1]); },
      askBrief() {
        const k = K(); const acts = CP.store.get('actions').slice(0, 6);
        CP.modal(CP.icon('sparkles') + ' What happened since last night', '<div class="cc-brief" style="margin:0 0 14px">' + briefingText().map(esc).join('<br>') + '</div>' +
          '<h3>Notable autonomous actions</h3>' + ui.table([{ label: 'Time', render: (a) => '<span class="mono small-txt">' + esc(a.ts) + '</span>' }, { label: 'Agent', render: (a) => ui.who(a.agent) }, { label: 'Action', key: 'action' }, { label: 'Level', render: (a) => lvlS(a.level) }], acts) +
          '<p class="small-txt muted" style="margin:12px 0 0">Every action has a rollback point. ' + k.qaSampled + ' actions were sampled by platform quality today, ' + CP.fmt(k.qaAgreement, 1) + '% agreement with human reviewers.</p>',
          '<button data-action="goClose" data-to="run/journal">Full action journal</button><button class="primary" data-close-modal>Close</button>');
      },
      exportDecisions() {
        const rows = allDecisions().map((a) => [a.id, a.title, roleLabel(a.role), pname(a.decider), a.status, a.createdAt || '', a.decidedAt || '', a.decidedBy ? pname(a.decidedBy) : ''].join(' | '));
        CP.modal('Decision audit trail', CP.ui.code('id | decision | held by | decider | status | raised | decided | by\n' + rows.join('\n')), '<button class="primary" data-close-modal>Close</button>');
        CP.toast('Audit trail exported: ' + rows.length + ' decisions.');
      },
      valueMethod() {
        CP.modal('How value is measured', '<dl class="kv"><dt>Hours saved</dt><dd>Time per task measured in 2025 (manual baseline) minus human time still spent, per agent task type. Sampled monthly by the performance manager.</dd>' +
          '<dt>Hour value</dt><dd>€' + RATE + ' loaded cost of a security analyst hour.</dd><dt>Avoided spend</dt><dd>MSSP L1 triage contract (€42k per month) ended in May 2026.</dd>' +
          '<dt>AI run cost</dt><dd>Model tokens, compute and data lake queries billed to each agent; platform team salaries are reported separately.</dd><dt>FTE</dt><dd>' + FTE_HOURS + ' productive hours per month; run-rate over ' + BIZ_DAYS_MONTH + ' business days.</dd><dt>Not counted</dt><dd>Avoided losses (fraud held, breaches prevented): reported qualitatively to the board.</dd></dl>',
          '<button class="primary" data-close-modal>Close</button>');
      },
      genBrief() {
        CP.modal('Board brief · Q3 2026', '<div class="cc-paper in-modal">' + briefHtml(this) + '</div>', '<button data-action="copyBrief">' + CP.icon('file') + ' Copy</button><button data-action="printBrief">' + CP.icon('external') + ' Print or save as PDF</button><button class="primary" data-close-modal>Close</button>');
        CP.toast('Board brief generated from live platform data.');
      },
      copyBrief() { copyText(briefText(this)); },
      printBrief() {
        const w = window.open('', '_blank');
        if (!w) { CP.toast('Pop-up blocked: allow pop-ups to print the brief.', 'warn'); return; }
        const css = (document.getElementById('css-ciso') || {}).textContent || '';
        w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Board brief Q3 2026 · Novalys Group</title><style>body{font-family:Inter,Arial,sans-serif;margin:28px;color:#201c30}svg.i{display:none}' + css + '</style></head><body>' + briefHtml(this) + '</body></html>');
        w.document.close(); w.focus(); setTimeout(() => { try { w.print(); } catch (e) { /* print unavailable */ } }, 300);
      }
    }
  });
})();
