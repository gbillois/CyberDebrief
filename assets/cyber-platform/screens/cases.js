/* Cyber AI Platform demo: Cases module.
   The case is the unit of work and the golden thread of the platform: from
   the trigger to the lessons, every agent step is traced, explained and
   linked to its decisions, messages, evidence and tasks.
   Routes: #/cases (queue) and #/cases/<id> (case workspace). */
(function () {
  'use strict';
  const CP = window.CP;
  const esc = CP.esc, ui = CP.ui, I = CP.icon;
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const st = () => CP.store;
  const RO = () => CP.currentRole === 'auditor';

  CP.css('cases', `
.cs-root{min-width:0}
.metrics.cs-metrics{grid-template-columns:repeat(5,minmax(0,1fr));margin-bottom:18px}
@media(max-width:1100px){.metrics.cs-metrics{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:760px){.metrics.cs-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.metrics.cs-metrics .metric:last-child{grid-column:1/-1}}
.cs-views{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 12px}
.cs-view{min-height:34px;font-size:12.5px;padding:.35rem .7rem;gap:8px}
.cs-view .n{font-family:var(--mono);font-size:11px;background:#eeebf7;color:#51406c;padding:1px 6px;font-weight:600}
.cs-view.active{background:var(--dark);border-color:var(--dark);color:#fff}
.cs-view.active .n{background:var(--green);color:#10291b}
.cs-view .w{background:#ffb648;color:#3d2600}
.cs-filters{display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:10px 12px;border:1px solid var(--line);border-bottom:0;background:#fbfafd}
.cs-search{display:flex;align-items:center;gap:8px;border:1px solid var(--line);background:#fff;height:34px;padding:0 10px;flex:1 1 220px;max-width:380px;color:var(--muted)}
.cs-search:focus-within{border-color:var(--indigo)}
.cs-search input{border:0;outline:0;width:100%;font-size:13px;background:transparent;padding:0}
.cs-filters select{height:34px;border:1px solid var(--line);background:#fff;font-size:12.5px;padding:0 8px;color:var(--ink);max-width:100%}
.cs-filters .cs-count{margin-left:auto;font-size:12.5px;color:var(--muted)}
.cs-tablewrap{border:1px solid var(--line);background:#fff;overflow:auto}
table.cs-t{border-collapse:collapse;width:100%;font-size:13px}
.cs-t th{text-align:left;font-size:11px;letter-spacing:.4px;color:var(--muted);font-weight:650;background:#f7f6fa;padding:9px 10px;border-bottom:1px solid var(--line);white-space:nowrap;text-transform:uppercase}
.cs-t td{padding:10px;border-bottom:1px solid var(--line-2);vertical-align:middle;line-height:1.4}
.cs-t tr.cs-tr{cursor:pointer}
.cs-t tr.cs-tr:hover td{background:#faf9fd}
.cs-t tr.cs-tr td:first-child{box-shadow:inset 4px 0 var(--sevc,#ccc)}
.cs-t tr.cs-closed td{color:#5d586f}
.cs-t tr.new td{animation:newrow 2.4s}
.cs-id{font-family:var(--mono);font-size:12px;color:var(--muted);white-space:nowrap}
.cs-title a{color:var(--ink);font-weight:600;text-decoration:none}
.cs-title a:hover{color:var(--indigo);text-decoration:underline}
.cs-sum{font-size:12px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:380px;margin-top:2px}
.cs-doms{display:flex;flex-wrap:wrap;gap:4px 10px}
.cs-phase{display:flex;gap:2px}
.cs-phase i{width:10px;height:6px;background:#e7e3f0;display:block}
.cs-phase i.on{background:var(--pc)}
.cs-sla{min-width:116px;font-size:12px}
.cs-sla b{font-variant-numeric:tabular-nums;font-weight:650}
.cs-sla .bar{height:4px;background:#eeebf4;margin-top:4px}
.cs-sla .bar span{display:block;height:100%;background:var(--green-ink)}
.cs-sla.warn b{color:#8a5a05}.cs-sla.warn .bar span{background:var(--amber)}
.cs-sla.bad b{color:var(--red-ink)}.cs-sla.bad .bar span{background:var(--red)}
.cs-sla.met b,.cs-sla.ok b{color:var(--green-ink)}
.cs-sla small{display:block;color:var(--muted);font-size:11px}
.cs-dec{display:inline-flex;align-items:center;gap:4px;background:#ffb648;color:#3d2600;font-weight:700;font-size:11.5px;padding:2px 7px;white-space:nowrap}
.cs-dec0{color:var(--muted);font-size:12px}
.cs-scn{font-family:var(--mono);font-size:11px;border:1px solid var(--line);padding:1px 6px;color:var(--indigo);white-space:nowrap;background:#fff}
.cs-cards{display:none;gap:10px}
.cs-card{background:#fff;border:1px solid var(--line);border-left:4px solid var(--sevc,#ccc);padding:12px 14px;display:grid;gap:6px;text-decoration:none;color:inherit}
.cs-card.new{animation:newrow 2.4s}
.cs-card .r{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.cs-card .t{font-weight:650;font-size:14.5px;line-height:1.3}
.cs-card .s{font-size:12.5px;color:var(--muted);line-height:1.45}
.cs-launch{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:14px;padding:12px 14px;border:1px dashed #d9d3e4;background:#fbfafc;font-size:13px;color:var(--muted)}
.cs-launch button{min-height:30px;font-size:12px;padding:.3rem .6rem}
.cs-ro{display:flex;gap:8px;align-items:center;padding:9px 12px;background:#f0edfc;border-left:3px solid var(--indigo);font-size:13px;margin-bottom:14px}
.cs-roview .decision .d-actions{display:none}
@media(max-width:1520px){.cs-hide-lg{display:none}}
@media(max-width:1100px){.cs-hide-md{display:none}}
@media(max-width:760px){.cs-views{flex-wrap:nowrap;overflow-x:auto;padding-bottom:4px}.cs-view{flex:none}.cs-tablewrap{display:none}.cs-cards{display:grid}.cs-filters .cs-count{margin-left:0;width:100%}.cs-search{max-width:none}}

/* Workspace header */
.cs-head.new{animation:flash 1.4s}
.cs-head{background:#fff;border:1px solid var(--line);border-top:3px solid var(--sevc,var(--indigo));padding:16px 22px 0;margin-bottom:18px}
.cs-crumb{font-size:12.5px;color:var(--muted);display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.cs-crumb a{color:var(--indigo);text-decoration:none;font-weight:600}
.cs-htop{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}
.cs-hmain{min-width:0;flex:1}
.cs-tags{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:10px}
.cs-h1{font-size:25px;letter-spacing:-.7px;margin:8px 0 6px;line-height:1.2}
.cs-lede{color:#4a4560;font-size:14px;line-height:1.55;margin:0;max-width:980px}
.cs-acts{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;max-width:470px}
.cs-acts button{min-height:34px;font-size:12.5px}
.cs-meta{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));border-top:1px solid var(--line);margin:14px -22px 0}
.cs-meta>div{padding:10px 14px;border-right:1px solid var(--line-2);min-width:0;font-size:13px}
.cs-meta>div:last-child{border-right:0}
.cs-meta .k{font-size:10.5px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);font-weight:700;margin-bottom:5px}
.cs-meta .v{display:flex;flex-wrap:wrap;gap:4px 8px;align-items:center;line-height:1.35}
.cs-meta a{color:var(--ink);text-decoration:none;border-bottom:1px dotted var(--muted)}
.cs-meta a:hover{color:var(--indigo)}
.cs-phasebar{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));border-top:1px solid var(--line);margin:0 -22px}
.cs-phasebar>div{padding:9px 10px 8px;font-size:11.5px;font-weight:600;color:#9a95aa;border-right:1px solid var(--line-2);display:flex;gap:6px;align-items:center;position:relative;min-width:0;white-space:nowrap}
.cs-phasebar>div:last-child{border-right:0}
.cs-phasebar>div.on{color:var(--ink)}
.cs-phasebar>div.on::before{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:var(--pc)}
.cs-phasebar>div.on .i{color:var(--pc)}
.cs-phasebar .n{font-family:var(--mono);font-size:10.5px;color:var(--muted);margin-left:auto}
.cs-banner{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:9px 22px;margin:0 -22px;border-top:1px solid var(--line);font-size:13px}
.cs-banner.live{background:#effff6}
.cs-banner.wait{background:#fff6e6}
.cs-banner.esc{background:#fff0f2}
.cs-banner .dot{width:9px;height:9px;background:var(--green-ink);display:inline-block;animation:blink 1.2s infinite}
.cs-banner.wait .dot{background:#ffb648}
.cs-banner button{min-height:28px;font-size:12px;padding:.25rem .6rem;margin-left:auto}
.cs-kpis{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));border-top:1px solid var(--line);margin:0 -22px;background:#fbfafd}
.cs-kpis>div{padding:9px 14px;border-right:1px solid var(--line-2);min-width:0}
.cs-kpis>div:last-child{border-right:0}
.cs-kpis b{display:block;font-size:19px;color:var(--indigo);letter-spacing:-.5px;font-variant-numeric:tabular-nums;line-height:1.15}
.cs-kpis span{font-size:11px;color:var(--muted)}

/* Split: golden thread + trace */
.cs-split{display:grid;grid-template-columns:minmax(0,1.04fr) minmax(0,1fr);gap:18px;margin-bottom:18px}
.cs-pane{background:#fff;border:1px solid var(--line);display:flex;flex-direction:column;min-width:0;height:calc(100vh - 128px);min-height:560px;max-height:980px}
.cs-pane.accent{border-top:3px solid var(--indigo)}
.cs-pane-h{padding:13px 16px;border-bottom:1px solid var(--line);display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.cs-pane-h h2{margin:0;font-size:16px;display:flex;gap:8px;align-items:center}
.cs-pane-h .sub{font-size:12px;color:var(--muted);margin-top:2px}
.cs-pane-b{overflow:auto;flex:1;min-height:0}
.cs-strip{overflow-x:auto;border-bottom:1px solid var(--line);background:#fbfafd}
.cs-strip svg{display:block;height:auto}
.cs-strip g[data-action]{cursor:pointer}
.cs-legend{display:flex;gap:10px;flex-wrap:wrap;padding:8px 16px;border-bottom:1px solid var(--line);font-size:11px;color:var(--muted)}
.cs-legend span{display:inline-flex;gap:5px;align-items:center}
.cs-legend i{width:9px;height:9px;display:inline-block;background:var(--pc)}
.cs-tl{list-style:none;margin:0;padding:6px 0 12px}
.cs-ev{position:relative}
.cs-ev-btn{display:grid;grid-template-columns:62px 22px minmax(0,1fr);width:100%;text-align:left;border:0;background:transparent;padding:8px 14px 6px 12px;font-weight:400;align-items:start;min-height:0;gap:0;line-height:1.3;color:var(--ink)}
.cs-ev-btn:hover{background:#faf9fd;border:0}
.cs-ev.sel .cs-ev-btn,.cs-ev.sel .cs-ev-prod{background:var(--indigo-50)}
.cs-ev.sel{box-shadow:inset 3px 0 var(--indigo)}
.cs-ev.new .cs-ev-btn,.cs-ev.new .cs-ev-prod{animation:newrow 2.4s}
.cs-ev-time{font-family:var(--mono);font-size:11.5px;padding-top:2px}
.cs-ev-time b{display:block;font-weight:600}
.cs-ev-time small{color:var(--muted);font-size:10.5px}
.cs-ev-dot{position:relative;align-self:stretch;min-height:36px}
.cs-ev-dot::before{content:'';position:absolute;left:5px;top:-8px;bottom:-14px;width:2px;background:#e5e1ef}
.cs-ev:first-child .cs-ev-dot::before{top:6px}
.cs-ev:last-child .cs-ev-dot::before{bottom:auto;height:10px}
.cs-ev-dot::after{content:'';position:absolute;left:1px;top:5px;width:10px;height:10px;background:var(--ec);box-shadow:0 0 0 3px #fff}
.cs-ev.gate .cs-ev-dot::after{transform:rotate(45deg);background:#ffb648;outline:1px solid #c8861a}
.cs-ev-meta{display:flex;gap:6px;flex-wrap:wrap;align-items:center;font-size:11.5px;color:var(--muted)}
.cs-ph{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;padding:1px 6px;color:#fff;background:var(--pc);white-space:nowrap}
.cs-ph.dk{color:#3d2600}
.cs-ev-title{font-weight:600;font-size:13.5px;margin-top:3px;display:block}
.cs-ev-text{font-size:12.5px;color:#4a4560;line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-top:2px}
.cs-ev-gate{font-size:12px;margin-top:4px;display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.cs-ev-prod{display:flex;gap:5px;flex-wrap:wrap;padding:0 14px 8px 96px}
.cs-chip{min-height:0;padding:2px 7px;font-size:11px;font-weight:600;border:1px solid var(--line);background:#fff;gap:5px;line-height:1.35}
.cs-chip b{font-family:var(--mono);font-weight:600}
.cs-chip .s{color:var(--muted);font-weight:500}
.cs-working{display:flex;gap:10px;align-items:center;padding:10px 14px 10px 96px;font-size:12.5px;color:var(--muted)}
.cs-working i{width:6px;height:6px;background:var(--indigo);display:inline-block;animation:blink 1s infinite}
.cs-working i:nth-child(2){animation-delay:.2s}.cs-working i:nth-child(3){animation-delay:.4s}

/* Trace panel */
.cs-tr-top{padding:14px 18px;border-bottom:1px solid var(--line-2)}
.cs-tr-top h3{font-size:17px;margin:8px 0 8px;letter-spacing:-.3px;line-height:1.3}
.cs-tr-top p{margin:8px 0 0;font-size:13.5px;line-height:1.55;color:#3b3550}
.cs-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-bottom:1px solid var(--line-2)}
.cs-stats>div{padding:10px 14px;border-right:1px solid var(--line-2);min-width:0}
.cs-stats>div:last-child{border-right:0}
.cs-stats .k{font-size:10.5px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);font-weight:700}
.cs-stats .v{font-size:16px;font-weight:650;color:var(--indigo);margin-top:3px;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cs-stats .s{font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cs-sec{padding:13px 18px;border-bottom:1px solid var(--line-2)}
.cs-sec:last-child{border-bottom:0}
.cs-sec h4{margin:0 0 9px;font-size:11px;text-transform:uppercase;letter-spacing:1.1px;color:var(--muted);display:flex;gap:6px;align-items:center}
.cs-sec h4 .r{margin-left:auto;text-transform:none;letter-spacing:0;font-weight:500}
.cs-calls{list-style:none;margin:0;padding:0;font-family:var(--mono);font-size:11.5px}
.cs-calls li{display:grid;grid-template-columns:22px minmax(0,1fr) auto;gap:8px;padding:6px 0;border-bottom:1px dashed var(--line-2);align-items:start}
.cs-calls li:last-child{border-bottom:0}
.cs-calls .no{color:var(--muted)}
.cs-calls .fn{color:var(--indigo);font-weight:600}
.cs-calls .ar{color:var(--muted);font-family:Inter,sans-serif;font-size:11.5px;display:block;margin-top:1px}
.cs-calls .ms{color:var(--muted);white-space:nowrap}
.cs-calls .ok{color:var(--green-ink)}
.cs-inputs{margin:0;padding-left:18px;font-size:12.5px;line-height:1.6}
.cs-pol{border:1px solid var(--line)}
.cs-pol-v{padding:9px 12px;font-weight:600;font-size:13px;display:flex;gap:8px;align-items:flex-start;line-height:1.4}
.cs-pol-v .i{margin-top:2px}
.cs-pol-v.ok{background:var(--green-50);color:#116539}
.cs-pol-v.gate{background:var(--amber-50);color:#7a5200}
.cs-pol-v.ko{background:var(--red-50);color:var(--red-ink)}
.cs-pol-v.na{background:#f7f6fb;color:var(--muted)}
.cs-pol .kv{padding:10px 12px;font-size:12.5px;border-top:1px solid var(--line-2)}
.cs-thr{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--line-2)}
.cs-thr div{padding:6px 12px;font-size:12px;display:flex;gap:6px;align-items:center;border-bottom:1px solid var(--line-2)}
.cs-thr div:nth-child(odd){border-right:1px solid var(--line-2)}
.cs-thr .ok{color:var(--green-ink)}.cs-thr .x{color:#a36a00;font-weight:600}
.cs-out ul{margin:0;padding-left:18px;font-size:12.5px;line-height:1.6}
.cs-out .code{max-height:300px;font-size:11.5px}
.cs-out .table-wrap{border:1px solid var(--line)}
.cs-metric{display:flex;gap:10px;align-items:baseline;background:var(--indigo-50);padding:9px 12px;margin-top:10px}
.cs-metric b{font-size:18px;color:var(--indigo);letter-spacing:-.4px}
.cs-metric span{font-size:12px;color:var(--muted)}
.cs-rb{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:8px 0;border-bottom:1px dashed var(--line-2);font-size:12.5px}
.cs-rb:last-child{border-bottom:0}
.cs-rb button{min-height:28px;font-size:12px;padding:.25rem .6rem}
.cs-audit{font-family:var(--mono);font-size:11px;color:var(--muted);word-break:break-all;line-height:1.5}
.cs-nav{display:flex;gap:4px}
.cs-nav button{min-height:30px;padding:.25rem .5rem}

/* Lower panels */
.cs-ctx svg{width:100%;max-width:470px;height:auto;display:block;margin:0 auto}
.cs-g3{display:grid;gap:18px;grid-template-columns:repeat(3,minmax(0,1fr))}
@media(max-width:1100px){.cs-g3{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:760px){.cs-g3{grid-template-columns:1fr}}
.cs-ctx a text{cursor:pointer}
.cs-ctx a:hover circle{stroke:var(--indigo);stroke-width:3}
.cs-ctx-legend{display:flex;gap:10px;flex-wrap:wrap;font-size:11.5px;color:var(--muted);margin-top:6px}
.cs-ctx-legend span{display:inline-flex;gap:5px;align-items:center}
.cs-ctx-legend i{width:9px;height:9px;border-radius:50%;display:inline-block;background:var(--c)}
.cs-br{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:12px}
.cs-br div{background:#f7f6fb;padding:8px 10px;font-size:11.5px;color:var(--muted)}
.cs-br b{display:block;font-size:18px;color:var(--ink);font-variant-numeric:tabular-nums}
.cs-decs{display:grid;gap:12px}
.cs-dfrom{font-size:12px;color:var(--muted);margin-top:6px}
.cs-dfrom button{min-height:0;padding:0;border:0;background:none;color:var(--indigo);font-size:12px;font-weight:600;text-decoration:underline}
.cs-qs{display:flex;flex-wrap:wrap;gap:6px}
.cs-q{min-height:30px;font-size:12px;padding:.3rem .6rem;border-color:#cfc5f3;color:var(--indigo);background:#f6f3ff;font-weight:600}
.cs-q:hover{background:#ece6ff}
.cs-chat{display:grid;gap:10px;max-height:470px;overflow:auto;margin-top:12px;align-content:start}
.cs-msg-q{justify-self:end;background:var(--indigo);color:#fff;padding:8px 12px;font-size:13px;max-width:88%}
.cs-msg-a{background:#f7f6fb;border:1px solid var(--line);border-left:3px solid var(--green-ink);padding:10px 12px;font-size:13px;line-height:1.55;min-width:0}
.cs-msg-a ul{margin:6px 0;padding-left:18px}
.cs-msg-a p{margin:0 0 6px;line-height:1.55}
.cs-msg-a .src{display:flex;gap:5px;flex-wrap:wrap;align-items:center;margin-top:8px;font-size:11px;color:var(--muted)}
.cs-msg-a .src button{min-height:0;padding:1px 6px;font-size:10.5px;font-family:var(--mono)}
.cs-msg-a pre{white-space:pre-wrap;font-family:Inter,sans-serif;font-size:12.5px;background:#fff;border:1px solid var(--line);padding:10px;margin:6px 0;line-height:1.55}
.cs-typing{display:flex;gap:4px;padding:10px 12px;background:#f7f6fb;border:1px solid var(--line);width:max-content}
.cs-typing i{width:6px;height:6px;background:var(--indigo);display:inline-block;animation:blink 1s infinite}
.cs-typing i:nth-child(2){animation-delay:.2s}.cs-typing i:nth-child(3){animation-delay:.4s}
.cs-askbar{display:flex;gap:6px;margin-top:12px}
.cs-askbar input{flex:1;min-width:0;border:1px solid var(--line);padding:0 10px;height:36px;font-size:13px}
.cs-askbar input:focus{outline:0;border-color:var(--indigo)}
.cs-tasks{display:grid}
.cs-task{display:grid;grid-template-columns:22px minmax(0,1fr) auto;gap:10px;padding:9px 0;border-bottom:1px solid var(--line-2);align-items:start;font-size:13px}
.cs-task:last-child{border-bottom:0}
.cs-task .cb{width:18px;height:18px;border:1.5px solid #b9b3c9;display:grid;place-items:center;padding:0;min-height:0;background:#fff;margin-top:1px}
.cs-task .cb.done{background:var(--green-ink);border-color:var(--green-ink);color:#fff}
.cs-task .cb.auto{cursor:default}
.cs-task.done .tt{color:var(--muted);text-decoration:line-through}
.cs-task .tw{font-size:11.5px;color:var(--muted);margin-top:3px;display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.cs-task .due{font-size:11.5px;color:var(--muted);white-space:nowrap}
.cs-ev-list{display:grid}
.cs-evd{display:grid;grid-template-columns:30px minmax(0,1fr) auto;gap:10px;padding:9px 4px;border-bottom:1px solid var(--line-2);align-items:start;text-align:left;width:100%;border-left:0;border-right:0;border-top:0;background:#fff;font-weight:400;min-height:0}
.cs-evd:hover{background:#faf9fd;border-color:var(--line-2)}
.cs-evd .ic{width:30px;height:30px;display:grid;place-items:center;background:#f1eefb;color:var(--indigo)}
.cs-evd .tt{display:block;font-weight:600;font-size:13px;line-height:1.35}
.cs-evd .ss{font-size:11.5px;color:var(--muted);margin-top:2px;line-height:1.4}
.cs-evd .hs{font-family:var(--mono);font-size:10.5px;color:var(--muted);white-space:nowrap}
.cs-cm{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px 10px;padding:10px 4px;border-bottom:1px solid var(--line-2);text-align:left;width:100%;border-left:0;border-right:0;border-top:0;background:#fff;font-weight:400;min-height:0;align-items:start}
.cs-cm:hover{background:#faf9fd;border-color:var(--line-2)}
.cs-cm .tt{font-weight:600;font-size:13px;line-height:1.35}
.cs-cm .ss{font-size:11.5px;color:var(--muted);margin-top:3px;line-height:1.4}
.cs-scroll{max-height:420px;overflow:auto}
.cs-lessons{background:var(--green-50);border-left:3px solid var(--green-ink);padding:10px 12px;font-size:13px;line-height:1.55;margin-top:12px}
.cs-form{display:grid;gap:12px}
.cs-form label{display:grid;gap:5px;font-size:12.5px;font-weight:600}
.cs-form select,.cs-form input,.cs-form textarea{border:1px solid var(--line);padding:8px 10px;font-size:13.5px;font-weight:400;background:#fff;color:var(--ink);width:100%}
.cs-form textarea{min-height:110px;line-height:1.5;resize:vertical}
.cs-form .hint{font-weight:400;color:var(--muted);font-size:12px}
.cs-form .chk{display:flex;gap:8px;align-items:center;font-weight:500}
.cs-form .chk input{width:auto}
.cs-radio{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
.cs-radio label{border:1px solid var(--line);padding:8px 10px;display:flex;gap:6px;align-items:center;font-weight:600;cursor:pointer}
.cs-radio input{width:auto}
.cs-empty-case{max-width:640px;margin:40px auto;text-align:center}
@media(max-width:1280px){.cs-meta{grid-template-columns:repeat(3,minmax(0,1fr))}.cs-meta>div:nth-child(3){border-right:0}.cs-meta>div:nth-child(-n+3){border-bottom:1px solid var(--line-2)}}
@media(max-width:1100px){.cs-split{grid-template-columns:1fr}.cs-pane{height:auto;max-height:none;min-height:0}.cs-pane-b{overflow:visible}.cs-htop{flex-direction:column}.cs-acts{justify-content:flex-start;max-width:none}.cs-kpis{grid-template-columns:repeat(3,minmax(0,1fr))}.cs-kpis>div:nth-child(-n+3){border-bottom:1px solid var(--line-2)}}
@media(max-width:760px){
  .cs-head{padding:14px 14px 0}
  .cs-meta,.cs-phasebar,.cs-banner,.cs-kpis{margin-left:-14px;margin-right:-14px}
  .cs-banner{padding:9px 14px}
  .cs-meta{grid-template-columns:repeat(2,minmax(0,1fr))}
  .cs-meta>div{border-bottom:1px solid var(--line-2)}
  .cs-meta>div:nth-child(3){border-right:1px solid var(--line-2)}
  .cs-meta>div:nth-child(even){border-right:0}
  .cs-phasebar{grid-template-columns:repeat(4,minmax(0,1fr))}
  .cs-phasebar>div:nth-child(-n+4){border-bottom:1px solid var(--line-2)}
  .cs-phasebar>div:nth-child(4){border-right:0}
  .cs-h1{font-size:21px}
  .cs-ev-btn{grid-template-columns:50px 20px minmax(0,1fr);padding-left:8px;padding-right:10px}
  .cs-ev-prod{padding-left:78px;padding-right:10px}
  .cs-working{padding-left:78px}
  .cs-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
  .cs-stats>div:nth-child(2){border-right:0}
  .cs-stats>div:nth-child(-n+2){border-bottom:1px solid var(--line-2)}
  .cs-thr{grid-template-columns:1fr}
  .cs-thr div:nth-child(odd){border-right:0}
  .cs-radio{grid-template-columns:repeat(2,minmax(0,1fr))}
  .cs-acts button{flex:1 1 auto}
}
`);

  /* ------------------------------------------------------------------
     Vocabulary
     ------------------------------------------------------------------ */
  const PHASES = [
    { id: 'trigger', label: 'Trigger', icon: 'zap', color: '#d8412f' },
    { id: 'context', label: 'Context', icon: 'network', color: '#2f7de1' },
    { id: 'plan', label: 'Plan', icon: 'workflow', color: '#451dc7' },
    { id: 'action', label: 'Action', icon: 'shield', color: '#c43d8a' },
    { id: 'decision', label: 'Decision', icon: 'users', color: '#ffb648', dark: true },
    { id: 'comms', label: 'Comms', icon: 'mail', color: '#1597a5' },
    { id: 'evidence', label: 'Evidence', icon: 'fingerprint', color: '#7a3ff2' },
    { id: 'lessons', label: 'Lessons', icon: 'book', color: '#088a42' }
  ];
  const PH = {}; PHASES.forEach((p) => { PH[p.id] = p; });
  /* Phase of each scenario step (the playbook stage it belongs to). */
  const STEP_PHASE = {
    'cti-1': 'trigger', 'cti-2': 'context', 'cti-3': 'plan', 'cti-4': 'action', 'cti-5': 'action', 'cti-6': 'evidence', 'cti-7': 'comms', 'cti-8': 'decision', 'cti-9': 'action', 'cti-10': 'action', 'cti-11': 'evidence', 'cti-12': 'lessons',
    'id-1': 'trigger', 'id-2': 'context', 'id-3': 'action', 'id-4': 'action', 'id-5': 'action', 'id-6': 'evidence', 'id-7': 'decision', 'id-8': 'comms', 'id-9': 'lessons', 'id-10': 'lessons', 'id-11': 'lessons',
    'rg-1': 'trigger', 'rg-2': 'plan', 'rg-3': 'evidence', 'rg-4': 'evidence', 'rg-5': 'comms', 'rg-6': 'lessons', 'rg-7': 'comms', 'rg-8': 'decision', 'rg-9': 'lessons',
    'dr-1': 'trigger', 'dr-2': 'evidence', 'dr-3': 'decision', 'dr-4': 'action', 'dr-5': 'evidence', 'dr-6': 'action', 'dr-7': 'decision', 'dr-8': 'action', 'dr-9': 'lessons'
  };
  const LANES = [
    { id: 'outside', label: 'Outside', color: '#c8861a' }, { id: 'systems', label: 'Systems', color: '#6d687e' },
    { id: 'orch', label: 'Orchestrator', color: '#451dc7' }, { id: 'agents', label: 'Agents', color: '#7a3ff2' },
    { id: 'human', label: 'Humans', color: '#088a42' }, { id: 'assure', label: 'Assurance', color: '#5a2be0' }
  ];
  const SEVC = { critical: '#d8412f', high: '#e0662b', medium: '#c8861a', low: '#9a95aa' };
  const SEVO = { critical: 0, high: 1, medium: 2, low: 3 };
  const STO = { open: 0, contained: 1, monitoring: 2, closed: 3 };
  const SLA_T = { critical: 4 * 3600, high: 24 * 3600, medium: 5 * 86400, low: 15 * 86400 };
  const SLA_L = { critical: '4 h', high: '24 h', medium: '5 d', low: '15 d' };
  const THRESH = ['Blast radius', 'Reversibility', 'Confidence', 'Exposure', 'Money', 'Novelty'];
  const CTX_T = { asset: ['Asset', '#2f7de1'], identity: ['Identity', '#c43d8a'], supplier: ['Supplier', '#c8861a'], service: ['Business service', '#088a42'], control: ['Control', '#451dc7'] };
  const COLL_L = { actions: 'Action', comms: 'Message', detections: 'Detection', wafRules: 'WAF rule', forensics: 'Forensic report', backlog: 'Backlog item', redteam: 'Red team', deviations: 'Deviation', releases: 'Release', evals: 'Eval', regulatory: 'Regulatory item', approvals: 'Decision' };
  const COLL_I = { actions: 'zap', comms: 'mail', detections: 'radar', wafRules: 'shield', forensics: 'fingerprint', backlog: 'list', redteam: 'sword', deviations: 'eye', releases: 'rocket', evals: 'flask', regulatory: 'gavel', approvals: 'users' };

  /* ------------------------------------------------------------------
     Case knowledge kept by the module: links to business services and
     suppliers, playbook, neighbourhood in the graph, tasks, lessons.
     ------------------------------------------------------------------ */
  const s = (ts, actor, domain, level, phase, title, text, flow, extra) => Object.assign({ ts, actor, domain, level, phase, title, text, flow: flow || [] }, extra || {});
  const T = (title, who, done, due, link) => ({ title, who, done: !!done, due: due || '', link: link || null });

  const INFO = {
    'C-2301': {
      lead: 'p-analyst', playbook: 'PB-CTI-07 · Exploited vulnerability on an exposed product (v3)', containStep: 'cti-4',
      services: ['Supplier file exchange', 'Card payments processing', 'Payroll'], suppliers: ['tp-paycore', 'tp-atlas', 'tp-claimsone'], moreSuppliers: 11,
      ctx: [['asset', 'mft-prd-01', 'internet-facing · critical', true], ['asset', 'mft-uat-02', 'internal · test data'], ['identity', 'svc-filebridge', 'service account'], ['service', 'Supplier file exchange', 'critical business service', true], ['service', 'Payroll', 'via Atlas Payroll'], ['supplier', 'PayCore Processing', 'critical · FileBridge 9.1', true], ['supplier', 'Atlas Payroll Services', 'critical · FileBridge 8.7', true], ['supplier', 'ClaimsOne', 'critical · FileBridge 9.0', true], ['supplier', '+11 suppliers', 'FileBridge users', false, 'FileBridge']],
      blast: [['2', 'servers'], ['14', 'suppliers'], ['3', 'critical services']],
      tasks: [T('Virtual patch on the WAF', 'ag-as-waf', 0, '', 'cti-4'), T('Detection rule in the SIEM', 'ag-soc-detect', 0, '', 'cti-5'), T('Quick forensic of mft-prd-01', 'ag-soc-forensic', 0, '', 'cti-6'), T('Validate the supplier questionnaire', 'p-marc', 0, 'Tue 09:00', 'AP-CTI-TPRM'), T('Decide on the emergency patch', 'p-elena', 0, 'Tue 09:15', 'AP-CTI-PATCH'), T('Install FileBridge 9.1.4 on mft-prd-01', 'ag-vuln', 0, '', 'cti-9'), T('Analyse supplier answers and chase the overdue ones', 'ag-grc-tprm', 0, '', 'cti-10'), T('Phone escalation to Atlas Payroll (still on 8.7)', 'p-marc', 0, 'Wed 12:45'), T('Review W-121 before it expires (defence in depth)', 'p-chloe', 0, 'Tue 20 Oct'), T('Lessons review with Payments IT', 'p-analyst', 0, 'Thu 10:00')],
      evidence: [['HTTP access logs · mft-prd-01 (30 days, 4.2 GB)', 'log', 'ctx-lake', 'ag-soc-forensic', 'Tue 08:56', 'cti-6'], ['EDR triage package · process tree, web directory, tasks', 'forensic', 'sys-edr', 'ag-soc-forensic', 'Tue 08:56', 'cti-6'], ['Sandbox replay report · 182,400 requests, 0 FP', 'report', 'or-sandbox', 'ag-as-waf', 'Tue 08:48', 'cti-4']],
      improve: ['Keep a software bill of materials for suppliers: 3 of the 14 FileBridge versions were unknown before the campaign.', 'Turn the zero-day supplier questionnaire into a standing approval for exploited critical CVEs.', 'Contract clause: 72 h patch commitment for critical CVEs on file-exchange products (Atlas Payroll needs 4 days).', 'Allow emergency patches of internet-facing MFT servers at L2 when the sandbox replay is clean.']
    },
    'C-2302': {
      lead: 'p-analyst', playbook: 'PB-IAM-03 · Compromised privileged business identity (v2)', containStep: 'id-7', containT: 420,
      services: ['Outgoing payments', 'SWIFT gateway'], suppliers: ['tp-swiftnet'],
      ctx: [['identity', 't.op-17', 'payment approver · up to €5 M', true], ['identity', '4 Treasury accounts', 'password spray, MFA re-registered'], ['asset', 'Payment hub', 'approver role', true], ['asset', 'SWIFT gateway', 'read & approve', true], ['asset', 'Treasury file share', '37 files downloaded'], ['service', 'Outgoing payments', 'critical business service', true], ['supplier', 'SwiftNet Bureau', 'SWIFT service bureau'], ['control', 'Phishing-resistant MFA', 'B-315 planned']],
      blast: [['5', 'identities'], ['€4.2 M', 'payments at stake'], ['1,200', 'records exposed']],
      tasks: [T('Revoke sessions and block the device', 'ag-iam-resp', 0, '', 'id-3'), T('Remove the hidden mailbox rule', 'ag-iam-resp', 0, '', 'id-4'), T('Hunt the password spray', 'ag-soc-hunt', 0, '', 'id-5'), T('Measure the data touched', 'ag-dt-dlp', 0, '', 'id-6'), T('Decide: suspend and hold 3 payments', 'p-hugo', 0, 'Wed 02:30', 'AP-ID-HOLD'), T('Draft the GDPR breach assessment', 'ag-grc-controls', 0, '', 'id-8'), T('Validate the notification to the data protection authority', 'p-sara', 0, 'Sat 02:13'), T('Call back the 3 beneficiaries before release', 'p-hugo', 0, 'Wed 10:00'), T('Supervised re-onboarding of the operator', 'p-analyst', 0, 'Wed 14:00'), T('Targeted micro-training for finance staff', 'p-leo', 0, '', 'id-10')],
      evidence: [['Identity provider sign-in log · 23 MFA pushes, new device', 'log', 'it-entra', 'ag-soc-triage', 'Wed 02:13', 'id-1'], ['Deleted inbox rule (copy kept as evidence)', 'config', 'it-m365', 'ag-iam-resp', 'Wed 02:15', 'id-4'], ['File-sharing audit · 37 files, 1,200 IBANs', 'log', 'it-m365', 'ag-dt-dlp', 'Wed 02:20', 'id-6']],
      improve: ['Phishing-resistant MFA for all 41 payment approvers (B-315).', 'Remove create and approve combinations on beneficiaries (27 cases under review in C-2284).', 'Number matching on push MFA for the 312 finance staff still on push.', 'Pre-authorise the payment hold on mobile for the Head of Treasury with a 10 minute response target.']
    },
    'C-2303': {
      lead: 'p-amira', playbook: 'PB-GRC-11 · Supervisory request (v1)', deadline: 'Mon 20 Oct', reg: 'R-DORA-REQ',
      services: ['DORA register of information', 'Regulatory reporting'], suppliers: ['tp-atlas', 'tp-claimsone', 'tp-ledger', 'tp-swiftnet'],
      ctx: [['service', 'DORA register', '1,240 arrangements', true], ['service', 'Incident notification', '2 late in 12 months'], ['asset', 'CMDB', 'source of the register'], ['asset', 'Contract repository', '31 chains missing'], ['supplier', 'Atlas Payroll Services', 'exit plan not tested', true], ['supplier', 'ClaimsOne', 'exit plan not tested', true], ['supplier', 'LedgerLine', 'exit plan not tested', true], ['supplier', 'SwiftNet Bureau', 'exit plan not tested', true], ['control', 'Register refresh', 'weekly today']],
      blast: [['23', 'evidence items'], ['96', 'critical arrangements'], ['3', 'gaps disclosed']],
      tasks: [T('Map the letter to 23 evidence items', 'ag-grc-controls', 0, '', 'rg-2'), T('Assemble the evidence from the data lake', 'ag-dt-evidence', 0, '', 'rg-3'), T('Find the gaps', 'ag-grc-controls', 0, '', 'rg-4'), T('Ask 12 providers to complete their chain', 'ag-grc-tprm', 0, '', 'rg-5'), T('Prepare the response pack', 'ag-grc-controls', 0, '', 'rg-7'), T('Decide the submission with disclosure', 'p-amira', 0, 'Wed 10:00', 'AP-RG-SUBMIT'), T('CISO co-signature of the cover letter', 'p-elena', 0, 'Wed 10:00', 'AP-RG-SUBMIT'), T('Independent re-sample of 10% of evidence', 'lod2', 0, '', 'rg-9'), T('Exit-plan tests with the 7 business owners', 'p-marc', 0, 'Q1 2027')],
      evidence: [['Supervisory letter (signed PDF)', 'document', 'out-reg', 'p-amira', 'Mon 09:00', 'rg-1'], ['Register of information · 1,240 rows (supervisor format)', 'report', 'ctx-lake', 'ag-dt-evidence', 'Mon 09:10', 'rg-3'], ['Major incident timelines · 4 incidents, 12 months', 'report', 'ctx-memory', 'ag-dt-evidence', 'Mon 09:10', 'rg-3']],
      improve: ['Daily refresh of the DORA register (B-316): the next request takes hours, not days.', 'Control monitor on the 4 h initial notification deadline (B-317).', 'Exit-plan tests for the 7 critical providers by Q1 2027.', 'Collect sub-contracting chains at onboarding, not at inspection time.']
    },
    'C-2304': {
      lead: 'p-jonas', playbook: 'PB-AI-02 · AI agent misbehaviour (v1)', containStep: 'dr-3',
      services: ['User-reported phishing triage'], suppliers: [],
      ctx: [['asset', 'SOC Triage Agent', 'v2.5.0 · auto-close +23 pts', true], ['asset', 'Phishing report queue', '412 closures replayed'], ['identity', '2 users', 'typed their password · reset', true], ['identity', 'Sender domain', 'hidden instructions'], ['service', 'Phishing triage', 'SOC service'], ['control', 'Kill-switch', 'L2 to L0'], ['control', 'Injection eval suite', '30 cases'], ['control', 'Deviation monitor', 'auto-close drift']],
      blast: [['412', 'closures replayed'], ['9', 'reopened'], ['2', 'users protected']],
      tasks: [T('Confirm by quality sampling', 'p-pierre', 0, '', 'dr-2'), T('Decide the kill-switch', 'p-chloe', 0, 'Thu 10:30', 'AP-DR-KILL'), T('Replay the 412 closures', 'orchestrator', 0, '', 'dr-4'), T('Reproduce and extend the injection', 'p-sam', 0, '', 'dr-5'), T('Build and evaluate v2.6', 'p-yuki', 0, '', 'dr-6'), T('Decide the 10% canary', 'p-ines', 0, 'Thu 14:30', 'AP-DR-CANARY'), T('Restore L2 after 72 h canary', 'orchestrator', 0, '', 'dr-8'), T('Update the AI Act register and agent file', 'p-jonas', 0, '', 'dr-8')],
      evidence: [['Deviation monitor series · auto-close rate 30 days', 'report', 'ai-eval', 'deviation', 'Thu 10:05', 'dr-1'], ['50 sampled closures with analyst verdicts', 'report', 'ctx-lake', 'p-pierre', 'Thu 10:20', 'dr-2'], ['Agent decision log · 412 closures (48 h)', 'log', 'or-audit', 'orchestrator', 'Thu 10:27', 'dr-4']],
      improve: ['Treat every external content as untrusted data in all agents that read emails or documents (spotlighting is now in the agent template).', 'Add the 30 injection cases to the release gate of every agent, not only SOC Triage.', 'Keep the deviation rule on auto-close rate per sender domain.', 'Two independent signals before any closure of a user report.']
    }
  };

  /* Baseline cases (no scenario): the module keeps their trail. */
  const BASE = {
    'C-2291': {
      lead: 'p-analyst', playbook: 'PB-SOC-02 · Phishing campaign (v5)', containedAfter: 180, services: ['HR self-service portal'], suppliers: [],
      steps: [
        s('Mon 16:20', 'mail', 'src', 'L3', 'trigger', 'Lookalike HR portal campaign detected', 'The mail gateway flags 212 emails from novalys-hr-portal.example, registered 2 days ago, asking staff to confirm their annual leave balance. The event reaches the SOC Triage Agent through the event bus.', [['sys-mail', 'int-bus'], ['int-bus', 'ag-soc-triage']], { artifact: { type: 'list', title: 'Campaign fingerprint', items: ['Sender domain: novalys-hr-portal.example (registered Sat 11 Oct)', '212 recipients on 14 sites, subject "Action required: leave balance 2026"', 'Landing page clones the HR portal login, hosted on a bulletproof provider', 'No attachment · link with a per-user tracking token'] } }),
        s('Mon 16:21', 'ag-soc-triage', 'soc', 'L3', 'context', 'Recipients and clicks mapped in the graph', 'The graph links each recipient to their role and access. 38 recipients work in Finance, 3 people clicked the link before the gateway rewrote it, and one of them holds a privileged role in the HR system.', [['ag-soc-triage', 'ctx-graph'], ['ctx-graph', 'ag-soc-triage'], ['ag-soc-triage', 'sys-mail']]),
        s('Mon 16:23', 'ag-soc-triage', 'soc', 'L3', 'action', '212 emails quarantined, domain blocked', 'Blocking a known-bad sender with confidence 0.97 is inside the L3 mandate: the agent pulls the 212 emails from the mailboxes and blocks the domain at the gateway and the proxy. Rollback point kept.', [['ag-soc-triage', 'int-exec'], ['int-exec', 'sys-mail'], ['int-exec', 'sys-proxy']]),
        s('Mon 16:26', 'ag-iam-resp', 'iam', 'L3', 'action', 'Passwords reset for the 3 users who clicked', 'The Identity Response Agent revokes sessions and forces a password and MFA reset for the 3 users who clicked. None had submitted credentials according to the proxy logs: the reset is precautionary.', [['or-plan', 'ag-iam-resp'], ['ag-iam-resp', 'int-exec'], ['int-exec', 'it-entra']]),
        s('Mon 16:41', 'ag-soc-hunt', 'soc', 'L2', 'evidence', 'Hunt: no sign-in from attacker infrastructure', '90 days of sign-in and proxy logs searched for the landing page infrastructure: no successful sign-in and no other campaign from the same hosting range. Verdict: contained.', [['or-plan', 'ag-soc-hunt'], ['ag-soc-hunt', 'ctx-lake'], ['ctx-lake', 'ag-soc-hunt']], { artifact: { type: 'code', lang: 'kql', title: 'Hunt queries (excerpt)', body: '# 90 days of sign-ins and proxy logs\nsignin_logs\n| where ip in (lookalike_infra)\n| summarize attempts=count(), success=countif(result=="success") by user\n# result: 0 rows\nproxy_logs\n| where url has "novalys-hr-portal"\n| summarize hits=count() by user, action\n# result: 3 users, action=rewritten, 0 credential POST' } }),
        s('Tue 08:05', 'ag-soc-triage', 'soc', 'L3', 'action', 'Second wave: 38 emails quarantined', 'A second wave from a sibling domain arrives at 08:04. The pattern learnt yesterday matches it and the agent quarantines 38 emails in 40 seconds.', [['sys-mail', 'ag-soc-triage'], ['ag-soc-triage', 'int-exec'], ['int-exec', 'sys-mail']], { produced: [['actions', 'A-9812']] })
      ],
      ctx: [['service', 'HR self-service portal', 'business service'], ['identity', 'HR privileged user', 'clicked · reset', true], ['identity', '2 other users', 'clicked · reset'], ['identity', '38 Finance recipients', 'targeted'], ['asset', 'Mail gateway', '250 emails quarantined'], ['control', 'Lookalike domain block', 'gateway and proxy'], ['control', 'D-409 forwarding rule', 'detection live']],
      blast: [['250', 'emails'], ['3', 'clicks'], ['0', 'credentials used']],
      decisions: [{ id: 'LD-2291', title: 'Request a takedown of the lookalike domain', summary: 'Registrar and hosting abuse request drafted with the evidence pack, sent on behalf of Novalys Group.', threshold: 'external communication on behalf of the group', impacts: ['Domain usually suspended within 24 to 48 h', 'Message signed by the group and kept in the case file'], recommendation: 'Send: the domain still resolves and a third wave is likely.', decider: 'p-amira', requestedBy: 'ag-soc-triage', autonomy: 'L1', approveLabel: 'Send takedown request', rejectLabel: 'Monitor only', createdAt: 'Mon 17:02' }],
      tasks: [T('Quarantine and block', 'ag-soc-triage', 1), T('Reset the 3 users who clicked', 'ag-iam-resp', 1), T('Hunt for sign-ins from attacker infrastructure', 'ag-soc-hunt', 1), T('Takedown request for the lookalike domain', 'p-amira', 0, 'Tue 12:00', 'LD-2291'), T('Phishing simulation on the HR portal theme (14 sites)', 'p-leo', 0, 'Fri'), T('Close after 48 h without a new wave', 'p-analyst', 0, 'Wed 16:20')],
      comms: [{ id: 'M-396', ts: 'Mon 17:10', partyLabel: 'Staff of the 14 targeted sites', channel: 'Intranet banner', subject: 'Fake HR portal emails: do not click, report with the button', status: 'sent', author: 'ag-grc-policy', validator: 'p-leo', body: 'Since 16:20 some of you received an email asking to confirm your leave balance on a fake HR portal.\n\nDo not click. If you did, your password has already been reset: you will be asked to sign in again.\n\nUse the Report button in your mailbox for any similar message.\n\nCyber Security, Novalys Group' }],
      evidence: [['Mail gateway export · 212 messages (EML)', 'log', 'sys-mail', 'ag-soc-triage', 'Mon 16:23'], ['Proxy logs · 3 rewritten clicks, 0 credential POST', 'log', 'sys-proxy', 'ag-soc-hunt', 'Mon 16:41']],
      residual: (c) => (localStatus('LD-2291') === 'approved' ? ['Takedown requested: the domain should be suspended within 48 h'] : ['The lookalike domain still resolves: takedown request awaiting validation by the Head of Engage']).concat(['A third wave with a new domain pattern would rely on the triage model alone']),
      improve: ['Register lookalike domains of the HR portal proactively (12 variants identified).', 'Phishing-resistant MFA for HR privileged users.', 'Add the HR portal theme to the Q4 awareness campaign.']
    },
    'C-2288': {
      lead: 'p-chloe', playbook: 'PB-VUL-04 · Certificate lifecycle (v2)', services: ['Broker policy submission'], suppliers: ['tp-broker'],
      steps: [
        s('Mon 11:05', 'ag-vuln', 'soc', 'L3', 'trigger', 'Certificate on the broker API expires tonight', 'The daily certificate scan finds that the TLS certificate of api.broker-gw.novalys.example expires on Tuesday 23:59. 1,140 brokers use this API to submit policies.', [['sys-vuln', 'int-bus'], ['int-bus', 'ag-vuln']], { artifact: { type: 'code', lang: 'json', title: 'Scanner finding', body: '{\n  "host": "api.broker-gw.novalys.example",\n  "port": 443,\n  "issuer": "Novalys Issuing CA 3",\n  "not_after": "2026-10-13T23:59:59Z",\n  "days_left": 1,\n  "key": "RSA 2048",\n  "in_cmdb_scope": false\n}' } }),
        s('Mon 11:06', 'ag-vuln', 'soc', 'L3', 'context', 'Owner, consumers and pinning found', 'The graph gives the owner (Insurance IT), the business service (broker policy submission, high) and the consumers: the BrokerLink platform plus 3 broker clients that pin the certificate and would break after renewal unless warned.', [['ag-vuln', 'ctx-graph'], ['ctx-graph', 'ag-vuln']]),
        s('Mon 11:12', 'ag-vuln', 'soc', 'L2', 'action', 'Standard renewal change raised', 'A standard change is raised for tonight 22:00 in the maintenance window: new certificate from the internal CA, key upgraded to RSA 3072, automatic rollback to the old certificate if the health check fails.', [['ag-vuln', 'int-exec'], ['int-exec', 'it-itsm']], { artifact: { type: 'code', lang: 'yaml', title: 'Change CHG-88390 (standard)', body: 'change: CHG-88390\ntype: standard\ntemplate: tls-renewal-v4\nci: api.broker-gw.novalys.example\nwindow: "Tue 22:00-22:30"\nsteps:\n  - issue: { ca: "Novalys Issuing CA 3", key: "RSA 3072" }\n  - deploy: { target: "broker-gw-lb", mode: "rolling" }\n  - healthcheck: { url: "/health", expect: 200 }\nrollback: previous certificate (kept 7 days)' } }),
        s('Mon 11:20', 'ag-as-waf', 'appsec', 'L3', 'evidence', 'Handshake replay: 3 pinned clients would fail', 'The WAF agent replays one day of handshakes in the sandbox with the new certificate: 3 broker clients fail because they pin the old public key. They need the new fingerprint before tonight.', [['ag-as-waf', 'or-sandbox'], ['or-sandbox', 'ag-as-waf']]),
        s('Mon 11:25', 'ag-grc-tprm', 'grc', 'L1', 'comms', 'Notice to BrokerLink drafted', 'The TPRM Agent drafts a notice to BrokerLink with the new fingerprint and the change window. It is an external communication: it waits for the third-party risk lead.', [['ag-grc-tprm', 'or-hitl'], ['or-hitl', 'hu-engage']], { gate: 'LD-2288' })
      ],
      ctx: [['asset', 'api.broker-gw', 'TLS expires Tue 23:59', true], ['asset', 'broker-gw-lb', 'load balancer'], ['service', 'Broker policy submission', 'high'], ['supplier', 'BrokerLink', '1,140 brokers'], ['identity', '3 pinned broker clients', 'need the new fingerprint'], ['control', 'CHG-88390', 'standard change tonight']],
      blast: [['1', 'API'], ['1,140', 'brokers'], ['3', 'clients at risk']],
      decisions: [{ id: 'LD-2288', title: 'Send the certificate notice to BrokerLink', summary: 'New fingerprint and change window (Tue 22:00) for the 3 broker clients that pin the certificate.', threshold: 'external communication on behalf of the group', impacts: ['3 broker clients update their pin before 22:00', 'Without notice: 3 clients unable to submit policies from 22:00'], recommendation: 'Send now: the window is tonight.', decider: 'p-marc', requestedBy: 'ag-grc-tprm', autonomy: 'L1', approveLabel: 'Validate and send', createdAt: 'Mon 11:25' }],
      tasks: [T('Raise the renewal change', 'ag-vuln', 1), T('Sandbox handshake replay', 'ag-as-waf', 1), T('Validate the notice to BrokerLink', 'p-marc', 0, 'Tue 12:00', 'LD-2288'), T('Execute the renewal in the window', 'ag-vuln', 0, 'Tue 22:30'), T('Post-change TLS check, then close', 'ag-vuln', 0, 'Tue 23:00')],
      comms: [{ id: 'M-399', ts: 'Mon 11:25', partyLabel: 'BrokerLink', channel: 'Supplier portal', subject: 'Certificate renewal on the broker API, Tue 22:00: new fingerprint inside', statusFrom: 'LD-2288', author: 'ag-grc-tprm', validator: 'p-marc', body: 'Dear BrokerLink operations team,\n\nThe TLS certificate of api.broker-gw.novalys.example will be renewed on Tuesday 13 October between 22:00 and 22:30 CET.\n\nThree of your broker clients pin the current public key. Please deploy the new fingerprint before 22:00:\nSHA-256 4F:9A:21:C7:...:0B:6E\n\nNo action is needed for clients that validate the certificate chain.\n\nThird-Party Security, Novalys Group' }],
      evidence: [['Certificate scan report (daily)', 'report', 'sys-vuln', 'ag-vuln', 'Mon 11:05']],
      residual: () => ['The certificate still expires tonight 23:59 if the change fails (automatic rollback keeps the old one until then)'].concat(localStatus('LD-2288') === 'approved' ? [] : ['3 broker clients are not warned yet: the notice awaits the third-party risk lead']),
      improve: ['Renew 30 days before expiry: the certificate was outside the CMDB scope, so the scan alerted late.', 'Ask BrokerLink to drop key pinning in favour of chain validation.']
    },
    'C-2284': {
      lead: 'p-lucas', playbook: 'PB-IAM-08 · Toxic access combination (v1)', services: ['Trade finance (letters of credit)'], suppliers: [],
      steps: [
        s('Sun 09:12', 'ag-iam-review', 'iam', 'L3', 'trigger', 'Segregation-of-duties rule violated', 'The weekly access review run flags rule SOD-TF-04: 11 users of Trade Finance can both create and approve letters of credit in the trade finance application.', [['it-apps', 'ag-iam-review'], ['ag-iam-review', 'ctx-graph']]),
        s('Sun 09:14', 'ag-iam-review', 'iam', 'L3', 'context', 'Who, since when, and what they did', 'The graph shows the 11 users came from the July reorganisation: their old approver role was never removed. 4 of them used both rights in the last 30 days, never on the same letter of credit.', [['ag-iam-review', 'ctx-graph'], ['ctx-graph', 'ag-iam-review'], ['ag-iam-review', 'it-hr']], { artifact: { type: 'table', title: 'Toxic combinations (pseudonymised)', cols: ['User', 'Create', 'Approve', 'Used both (30 d)'], rows: [['TF-user-03', 'yes', 'yes', 'yes · 6 LCs'], ['TF-user-07', 'yes', 'yes', 'yes · 2 LCs'], ['TF-user-11', 'yes', 'yes', 'yes · 1 LC'], ['TF-user-14', 'yes', 'yes', 'yes · 4 LCs'], ['7 other users', 'yes', 'yes', 'no']] } }),
        s('Sun 09:30', 'ag-grc-controls', 'grc', 'L2', 'evidence', 'Control failing since the July reorganisation', 'The Controls Agent links the finding to control SOD-TF-04 (quarterly certification): the June certification ran before the reorganisation. The control is marked failing in the NIS2 self-assessment.', [['ag-grc-controls', 'ctx-lake'], ['ag-grc-controls', 'ctx-graph']]),
        s('Mon 08:00', 'ag-iam-review', 'iam', 'L1', 'plan', 'Remediation prepared: remove the approve right', 'The agent prepares the removal of the approve right for the 11 users and keeps it for the 3 named approvers of the desk. Removing business rights changes how the desk works: the Business CISO decides.', [['ag-iam-review', 'or-policy'], ['or-policy', 'or-hitl'], ['or-hitl', 'hu-engage']], { gate: 'LD-2284' })
      ],
      ctx: [['identity', '11 Trade Finance users', 'create + approve', true], ['identity', '3 named approvers', 'keep approve'], ['asset', 'Trade finance app', 'letters of credit'], ['service', 'Trade finance', 'critical business service', true], ['control', 'SOD-TF-04', 'failing since July'], ['control', 'REL-76', 'toxic combination detection']],
      blast: [['11', 'users'], ['13', 'LCs to re-check'], ['1', 'critical service']],
      decisions: [{ id: 'LD-2284', title: 'Remove the approve right from 11 Trade Finance users', summary: 'Approval stays with the 3 named approvers of the desk. 4 users used both rights in 30 days, never on the same letter of credit.', threshold: 'change of business rights on a critical business service', impacts: ['Desk approvals go through 3 approvers (about +20 min)', 'Control SOD-TF-04 back to passing'], recommendation: 'Remove now: a single user can issue and approve a letter of credit today.', decider: 'p-lucas', requestedBy: 'ag-iam-review', autonomy: 'L1', approveLabel: 'Remove the right', rejectLabel: 'Accept the risk for 30 days', createdAt: 'Mon 08:00', onApprove: { status: 'contained', summary: 'Approve right removed for 11 users; managers recertify by Friday.' } }],
      tasks: [T('Identify toxic combinations', 'ag-iam-review', 1), T('Map the control failure', 'ag-grc-controls', 1), T('Decide on removing the approve right', 'p-lucas', 0, 'Tue 18:00', 'LD-2284'), T('Re-check the 13 letters of credit of the 4 users', 'p-analyst', 0, 'Wed'), T('Managers recertify the 11 users', 'p-lucas', 0, 'Fri')],
      comms: [],
      evidence: [['Entitlement export · trade finance application', 'log', 'it-apps', 'ag-iam-review', 'Sun 09:12'], ['Control test SOD-TF-04 (failing)', 'report', 'ctx-lake', 'ag-grc-controls', 'Sun 09:30']],
      residual: () => (localStatus('LD-2284') === 'approved' ? ['Approve right removed: 13 letters of credit still to re-check'] : ['11 users can still create and approve letters of credit until the Business CISO decides']).concat(st().find('traces', 'tr-id-9') ? ['Scope extended by C-2302: 27 combinations across Treasury and Trade Finance'] : []),
      improve: ['Trigger an access review on every reorganisation, not only quarterly.', 'Ship REL-76 (toxic combination detection) to production to catch this at assignment time.']
    },
    'C-2279': {
      lead: 'p-marc', playbook: 'PB-TPR-05 · Supplier rating drop (v2)', containedAfter: 'Tue 07:10', services: ['Litigation management'], suppliers: ['tp-lexis'],
      steps: [
        s('Fri 14:40', 'cti-feed', 'ext', 'L3', 'trigger', 'External rating of LexAdvisors drops 12 points', 'The external security rating feed lowers LexAdvisors (external legal counsel, medium criticality) from 70 to 58 after leaked credentials and an exposed remote desktop service.', [['out-cti', 'int-mcp'], ['int-mcp', 'ag-grc-tprm']]),
        s('Fri 14:42', 'ag-cti-collect', 'cti', 'L3', 'context', '14 credentials found on a paste site', 'The CTI Collector finds 14 credentials of lexadvisors.example in a paste dated Thursday. None match Novalys accounts; 2 belong to lawyers working on Novalys litigation files.', [['ag-cti-collect', 'ctx-lake'], ['ag-cti-collect', 'ctx-graph']]),
        s('Fri 15:05', 'ag-grc-tprm', 'grc', 'L3', 'context', 'What LexAdvisors can reach', 'The graph shows what is at stake: litigation files exchanged through FileBridge 9.1, no direct network access, 2 guest accounts in the collaboration suite. Exposure: medium.', [['ag-grc-tprm', 'ctx-graph'], ['ctx-graph', 'ag-grc-tprm']], { artifact: { type: 'list', title: 'Graph answer', items: ['Data shared: litigation files (confidential)', 'Channel: FileBridge 9.1, SFTP, 2 transfers per week', 'Guest accounts: 2 (collaboration suite), MFA enforced', 'Contract: security clause v2018, no breach notification deadline'] } }),
        s('Mon 17:30', 'ag-grc-tprm', 'grc', 'L1', 'comms', 'Questions sent to LexAdvisors', 'After validation by the third-party risk lead, the TPRM Agent asks LexAdvisors to reset the leaked passwords, confirm MFA and close the exposed remote desktop service.', [['ag-grc-tprm', 'or-hitl'], ['or-hitl', 'hu-engage'], ['ag-grc-tprm', 'int-mcp'], ['int-mcp', 'out-tp']], { produced: [['comms', 'M-401']], gate: 'LD-2279' }),
        s('Tue 07:10', 'ag-grc-tprm', 'grc', 'L2', 'evidence', 'Answer checked against evidence', 'LexAdvisors answered overnight: 14 passwords reset, MFA enforced, remote desktop closed. The agent checks the claim with an external scan (port closed) and keeps the supplier under watch for 30 days.', [['out-tp', 'int-mcp'], ['int-mcp', 'ag-grc-tprm'], ['ag-grc-tprm', 'ctx-graph']])
      ],
      ctx: [['supplier', 'LexAdvisors', 'rating 58 (-12)', true], ['identity', '2 guest accounts', 'MFA enforced'], ['identity', '14 leaked credentials', 'reset by supplier'], ['asset', 'FileBridge 9.1 flow', '2 transfers a week'], ['service', 'Litigation management', 'confidential files'], ['control', 'Contract clause v2018', 'no notification deadline']],
      blast: [['1', 'supplier'], ['2', 'guest accounts'], ['0', 'Novalys accounts']],
      decisions: [{ id: 'LD-2279', status: 'approved', decidedAt: 'Mon 17:25', decidedBy: 'p-marc', title: 'Send leaked-credential questions to LexAdvisors', summary: 'Reset the 14 passwords, confirm MFA, close the exposed remote desktop service; answer within 48 h.', threshold: 'external communication on behalf of the group', decider: 'p-marc', requestedBy: 'ag-grc-tprm', autonomy: 'L1', createdAt: 'Mon 17:02' }],
      tasks: [T('Send questions to LexAdvisors', 'ag-grc-tprm', 1), T('Verify the answer with an external scan', 'ag-grc-tprm', 1), T('Re-check the rating in 30 days', 'ag-grc-tprm', 0, 'Thu 12 Nov'), T('Update the contract security clause (24 h breach notice)', 'p-marc', 0, 'Q4')],
      comms: [],
      evidence: [['Paste site capture · 14 credentials (hashed)', 'document', 'out-cti', 'ag-cti-collect', 'Fri 14:42'], ['External scan · remote desktop port closed', 'report', 'out-tp', 'ag-grc-tprm', 'Tue 07:10']],
      residual: () => ['Rating still 58: expected back above 65 after the next external scan', 'The 2018 contract clause has no breach notification deadline'],
      improve: ['Standard clause: 24 h breach notification for suppliers holding confidential data.', 'Send questions at L2 for rating drops above 10 points (standing approval).']
    }
  };

  /* Closed cases of the last days, kept for the queue and the history. */
  const ARCHIVE = [
    { id: 'C-2289', title: 'Client data pasted into an unapproved AI tool', severity: 'medium', status: 'closed', domains: ['data', 'grc'], opened: 'Tue 07:12', closedAt: 'Tue 07:40', owner: 'ag-dt-dlp', summary: 'An adviser pasted 40 client records into a public AI chatbot; site blocked, DPO assessment: no notification required.' },
    { id: 'C-2287', title: 'Mass download by a leaver in Asset Management', severity: 'high', status: 'closed', domains: ['data', 'iam'], opened: 'Mon 14:02', closedAt: 'Mon 18:10', owner: 'ag-dt-dlp', summary: '1,900 files downloaded 3 days before departure; access cut, copies recovered, HR and Legal informed.' },
    { id: 'C-2286', title: 'Info-stealer on a branch workstation (Lyon)', severity: 'medium', status: 'closed', domains: ['soc'], opened: 'Mon 10:31', closedAt: 'Mon 15:30', owner: 'ag-soc-triage', summary: 'Malware from a USB key, host isolated in 2 minutes, reimaged; no stolen credential used.' },
    { id: 'C-2283', title: 'AI incident · Code Review Agent slows down after a model update', severity: 'low', status: 'closed', domains: ['trust', 'appsec'], opened: 'Thu 09:10', closedAt: 'Fri 16:00', owner: 'p-jonas', lastWeek: true, summary: 'Review time per PR +40% after a model update (DV-31); routing fixed, evals unchanged.' }
  ].map((c) => Object.assign(c, { _static: true }));
  Object.assign(BASE, {
    'C-2289': {
      lead: 'p-sara', playbook: 'PB-DAT-06 · Data leak to an AI service (v1)', containedAfter: 120, services: ['Retail advice'], suppliers: [],
      steps: [
        s('Tue 07:12', 'ag-dt-dlp', 'data', 'L3', 'trigger', 'Paste of 40 client records to a public AI site', 'Data loss prevention sees a Retail adviser paste a table with 40 client names, account numbers and balances into a public AI chatbot.', [['it-m365', 'ag-dt-dlp']]),
        s('Tue 07:14', 'ag-dt-dlp', 'data', 'L2', 'action', 'Site blocked for the user, coaching shown', 'The agent blocks the site for this user, shows a coaching page that points to the approved internal assistant and asks the AI provider for deletion through its privacy form.', [['ag-dt-dlp', 'int-exec'], ['int-exec', 'sys-proxy']]),
        s('Tue 07:30', 'p-sara', 'human', 'L1', 'decision', 'DPO assessment: low risk, no notification', 'The DPO reviews the agent assessment: 40 records, no special category data, provider deletion confirmed, no onward use. Low risk to the persons: logged, no notification.', [['ag-dt-dlp', 'or-hitl'], ['or-hitl', 'hu-ciso']]),
        s('Tue 07:40', 'orchestrator', 'orch', 'L3', 'lessons', 'Closed: internal assistant promoted to advisers', 'Case closed. Lesson: Retail advisers lack an approved assistant for client tables; Engage promotes the internal assistant to the 2,100 advisers.', [['or-audit', 'ctx-lake']])
      ],
      ctx: [['identity', 'Retail adviser', 'coached'], ['service', 'Retail advice', 'business service'], ['asset', 'Public AI site', 'blocked for user'], ['control', 'DLP rule AI-paste', 'live']],
      blast: [['40', 'records'], ['1', 'user'], ['0', 'notification']],
      decisions: [], tasks: [T('Block and coach', 'ag-dt-dlp', 1), T('DPO assessment', 'p-sara', 1), T('Promote the internal assistant to advisers', 'p-leo', 1)], comms: [], evidence: [['DLP event and redacted payload', 'log', 'it-m365', 'ag-dt-dlp', 'Tue 07:12']],
      residual: () => [], improve: ['Make the approved assistant the default in the adviser workstation.', 'Extend the DLP rule to the 4 other public AI sites seen this month.']
    },
    'C-2287': {
      lead: 'p-chloe', playbook: 'PB-DAT-03 · Insider data exfiltration (v2)', containedAfter: 900, services: ['Asset management research'], suppliers: [],
      steps: [
        s('Mon 14:02', 'siem', 'src', 'L3', 'trigger', 'Detection D-397: mass download by one user', 'The SIEM fires D-397: one user of Asset Management downloaded 1,900 files from the research share in 25 minutes.', [['sys-siem', 'int-bus'], ['int-bus', 'ag-soc-triage']]),
        s('Mon 14:04', 'ag-dt-dlp', 'data', 'L3', 'context', 'The user resigned and leaves on Friday', 'The graph links the account to an HR record: resignation accepted last week, last day Friday, joining a competitor. The files are research notes and model portfolios.', [['ag-dt-dlp', 'ctx-graph'], ['ag-dt-dlp', 'it-hr']]),
        s('Mon 14:17', 'p-chloe', 'human', 'L1', 'decision', 'Disable the account before the last day', 'Disabling a staff account before departure needs a human: the Head of Run approves with HR, and Legal places a hold on the mailbox.', [['or-hitl', 'hu-run']]),
        s('Mon 14:20', 'ag-iam-resp', 'iam', 'L2', 'action', 'Account disabled, sync to personal cloud cut', 'The Identity Response Agent disables the account and revokes the device. The personal cloud sync client is blocked; 1,900 files are recovered from the endpoint.', [['ag-iam-resp', 'int-exec'], ['int-exec', 'it-entra'], ['int-exec', 'sys-edr']]),
        s('Mon 18:10', 'orchestrator', 'orch', 'L3', 'lessons', 'Closed with HR and Legal', 'HR and Legal take over the follow-up. Lesson: leavers with access to research data get a download watch from the day of resignation.', [['or-audit', 'ctx-lake']])
      ],
      ctx: [['identity', 'Leaver (Asset Management)', 'disabled', true], ['asset', 'Research share', '1,900 files'], ['service', 'AM research', 'confidential'], ['control', 'D-397', 'detection live']],
      blast: [['1,900', 'files'], ['1', 'user'], ['0', 'files left the group']],
      decisions: [], tasks: [T('Disable the account', 'ag-iam-resp', 1), T('Recover files from the endpoint', 'ag-soc-forensic', 1), T('Legal hold on the mailbox', 'p-chloe', 1)], comms: [], evidence: [['Endpoint forensic image (hash only)', 'forensic', 'sys-edr', 'ag-soc-forensic', 'Mon 15:40']],
      residual: () => [], improve: ['Start a download watch at resignation for users with access to confidential research.']
    },
    'C-2286': {
      lead: 'p-analyst', playbook: 'PB-SOC-05 · Malware on an endpoint (v4)', containedAfter: 120, services: ['Retail branch network'], suppliers: [],
      steps: [
        s('Mon 10:31', 'edr', 'src', 'L3', 'trigger', 'Info-stealer detected on LYO-BR-0412', 'The EDR detects an info-stealer launched from a USB key on a branch workstation in Lyon.', [['sys-edr', 'int-bus'], ['int-bus', 'ag-soc-triage']]),
        s('Mon 10:33', 'ag-soc-triage', 'soc', 'L3', 'action', 'Host isolated in 2 minutes', 'A single branch workstation with no server role: isolation is inside the L3 mandate. The host is cut from the network, except the EDR channel.', [['ag-soc-triage', 'int-exec'], ['int-exec', 'sys-edr']]),
        s('Mon 11:02', 'ag-soc-forensic', 'soc', 'L2', 'evidence', 'Browser credentials stolen, none used', 'The forensic triage shows 6 saved browser passwords were read. None was used from outside: the Identity Response Agent resets them anyway.', [['ag-soc-forensic', 'sys-edr'], ['ag-soc-forensic', 'ctx-lake']]),
        s('Mon 15:30', 'orchestrator', 'orch', 'L3', 'lessons', 'Reimaged and closed', 'The workstation is reimaged by IT. Lesson: USB storage is still allowed in 31 branches; Build adds a policy check.', [['or-audit', 'ctx-lake']])
      ],
      ctx: [['asset', 'LYO-BR-0412', 'isolated, reimaged'], ['identity', 'Branch employee', '6 passwords reset'], ['service', 'Retail branch network', 'business service'], ['control', 'USB storage policy', '31 branches exempt']],
      blast: [['1', 'host'], ['6', 'passwords'], ['0', 'used']],
      decisions: [], tasks: [T('Isolate the host', 'ag-soc-triage', 1), T('Forensic triage', 'ag-soc-forensic', 1), T('Reimage', 'p-analyst', 1)], comms: [], evidence: [['EDR triage package · LYO-BR-0412', 'forensic', 'sys-edr', 'ag-soc-forensic', 'Mon 11:02']],
      residual: () => [], improve: ['Remove the USB storage exemption in the 31 remaining branches.']
    },
    'C-2283': {
      lead: 'p-jonas', playbook: 'PB-AI-01 · Agent performance deviation (v1)', containedAfter: 3600, services: ['Secure code review'], suppliers: [],
      steps: [
        s('Thu 09:10', 'deviation', 'trust', 'L3', 'trigger', 'Review time per PR +40% after a model update', 'The deviation monitor sees the Code Review Agent take 53 s per pull request instead of 38 s since the model gateway update.', [['ag-as-code', 'ai-eval'], ['ai-eval', 'hu-trust']]),
        s('Thu 10:15', 'p-jonas', 'trust', 'L0', 'evidence', 'Evals unchanged, latency from routing', 'The AI assurance lead re-runs the OWASP eval set: quality unchanged. The latency comes from a routing rule that sent large diffs to a slower model tier.', [['hu-trust', 'ai-eval'], ['ai-eval', 'ai-gw']]),
        s('Fri 11:00', 'p-yuki', 'human', 'L1', 'action', 'Routing rule fixed', 'The agent developer fixes the routing rule in the model gateway; review time back to 39 s.', [['hu-build', 'ai-gw']]),
        s('Fri 16:00', 'orchestrator', 'orch', 'L3', 'lessons', 'Closed: latency added to release gates', 'Lesson: latency per task is now a release gate for every model update, next to quality.', [['or-audit', 'ctx-lake']])
      ],
      ctx: [['asset', 'Code Review Agent', 'v3.0.1'], ['asset', 'Model gateway', 'routing rule fixed'], ['service', 'Secure code review', '318 PRs a day'], ['control', 'Deviation monitor', 'latency rule']],
      blast: [['318', 'PRs a day'], ['+15 s', 'per PR'], ['0', 'quality loss']],
      decisions: [], tasks: [T('Re-run evals', 'p-jonas', 1), T('Fix the routing rule', 'p-yuki', 1)], comms: [], evidence: [['Latency series · 14 days', 'report', 'ai-eval', 'deviation', 'Thu 09:10']],
      residual: () => [], improve: ['Latency per task as a release gate for every model update.']
    }
  });

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function sha(str) { let h = hash(str), out = ''; for (let i = 0; i < 8; i++) { h = Math.imul(h ^ (h >>> 13), 2654435761) >>> 0; h = (h + i * 40503) >>> 0; out += h.toString(16).padStart(8, '0'); } return out; }
  const rnd = (key, a, b) => a + (hash(key) % (b - a + 1));
  function aabs(label) {
    const m = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+(\d{1,2}):(\d{2})/.exec(label || '');
    if (!m) return null;
    let d = DAYS.indexOf(m[1]); if (d >= 4) d -= 7;
    return d * 86400 + (+m[2]) * 3600 + (+m[3]) * 60;
  }
  const wrapWeek = (d) => (d < 0 ? d + 7 * 86400 : d);
  function nowBase() { const base = aabs('Tue 08:30'); const c = aabs(CP.clock ? CP.clock.label() : ''); return c != null && c > base ? c : base; }
  function dur(sec) {
    sec = Math.max(0, Math.round(sec));
    if (sec < 60) return sec + ' s';
    const m = Math.floor(sec / 60); if (m < 60) return m + ' min';
    const h = Math.floor(m / 60); if (h < 24) return h + ' h ' + String(m % 60).padStart(2, '0');
    const d = Math.floor(h / 24); return d + ' d ' + (h % 24) + ' h';
  }
  const tplus = (t) => 'T+' + (t < 3600 ? Math.round(t / 60) + 'm' : t < 86400 ? Math.floor(t / 3600) + 'h' + String(Math.floor((t % 3600) / 60)).padStart(2, '0') : Math.floor(t / 86400) + 'd ' + Math.floor((t % 86400) / 3600) + 'h');
  const hhmm = (ts) => (ts || '').split(' ')[1] || ts || '';
  const day = (ts) => (ts || '').split(' ')[0] || '';
  function pname(id) { const a = CP.actor(id); return a.name; }
  function laneOf(actor) {
    if (CP.agent(actor)) return 'agents';
    if (actor === 'orchestrator') return 'orch';
    if (['deviation', 'redteam', 'lod2', 'evals'].indexOf(actor) >= 0) return 'assure';
    const p = CP.person(actor); if (p) return p.team === 'trust' ? 'assure' : 'human';
    if (['cti-feed', 'regulator', 'thirdparty'].indexOf(actor) >= 0) return 'outside';
    return 'systems';
  }
  function domHex(d) { const x = CP.domain(d); return x.hex || '#888'; }
  function phChip(id) { const p = PH[id] || PH.context; return '<span class="cs-ph' + (p.dark ? ' dk' : '') + '" style="--pc:' + p.color + '">' + esc(p.label) + '</span>'; }
  let NODE = null;
  function nodeLabel(id) {
    if (!NODE) { NODE = {}; try { CP.arch.fullLayout().nodes.forEach((n) => { NODE[n.id] = n.label; }); } catch (e) { /* architecture not loaded */ } }
    const ag = CP.agent(id); if (ag) return ag.name;
    return NODE[id] || id;
  }
  function scnOf(c) { if (!c) return null; return c.scenario ? CP.scenarioById(c.scenario) : (CP.scenarios || []).find((x) => x.caseId === c.id && st().get('traces').some((t) => t.case === c.id)); }
  function playerOn(sc) { const p = CP.player && CP.player.status(); return !!(sc && p && p.scenario && p.scenario.id === sc.id); }

  /* Items produced by each scenario step (from its effects and its gate). */
  const PRODUCE = {}; const ITEM_STEP = {};
  function buildProduce() {
    if (PRODUCE._built) return;
    (CP.scenarios || []).forEach((sc) => sc.steps.forEach((step) => {
      const out = [];
      const take = (effs) => (effs || []).forEach((e) => { if (e.op === 'add' && e.item && e.coll && ['cases', 'feed'].indexOf(e.coll) < 0) { out.push([e.coll, e.item.id]); ITEM_STEP[e.coll + ':' + e.item.id] = step; } });
      take(step.effects);
      if (step.gate) { out.push(['approvals', step.gate.approval.id]); ITEM_STEP['approvals:' + step.gate.approval.id] = step; take(step.gate.onApprove); }
      PRODUCE[step.id] = out;
    }));
    PRODUCE._built = true;
  }

  /* ------------------------------------------------------------------
     Case data
     ------------------------------------------------------------------ */
  function allCases() {
    const live = st().get('cases');
    return live.concat(ARCHIVE.filter((a) => !live.some((c) => c.id === a.id)));
  }
  const getCase = (id) => st().find('cases', id) || ARCHIVE.find((a) => a.id === id);
  const info = (c) => INFO[c.id] || BASE[c.id] || {};
  function localStatus(id) { const l = SCR.ui.localDec[id]; if (l) return l.status; const d = localDecisionDef(id); return d ? (d.status || 'pending') : null; }
  function localDecisionDef(id) { let f = null; Object.keys(BASE).forEach((k) => (BASE[k].decisions || []).forEach((d) => { if (d.id === id) f = d; })); return f; }

  /* The golden thread: ordered events of a case. */
  function thread(c) {
    buildProduce();
    const sc = scnOf(c);
    let evs = [];
    if (sc) {
      const ps = CP.player && CP.player.status();
      const cut = playerOn(sc) ? ps.index : Infinity; /* a replayed scenario must not show stale future steps */
      evs = st().get('traces').filter((t) => t.case === c.id && t.stepIndex <= cut).sort((a, b) => a.stepIndex - b.stepIndex).map((t) => ({
        id: t.id, stepId: t.id.replace(/^tr-/, ''), ts: t.ts, t: t.t, actor: t.actor, domain: t.domain, level: t.level,
        phase: STEP_PHASE[t.id.replace(/^tr-/, '')] || 'action', title: t.title, text: t.text, flow: t.flow || [], artifact: t.artifact,
        gate: t.gate, metric: t.metric, produced: (PRODUCE[t.id.replace(/^tr-/, '')] || []).slice(), item: t, scenario: sc.id
      }));
    }
    const B = BASE[c.id];
    if (B && B.steps) {
      const o = aabs(c.opened);
      evs = evs.concat(B.steps.map((x, i) => Object.assign({}, x, { id: 'st-' + c.id + '-' + i, stepId: c.id + '-' + i, t: Math.max(0, aabs(x.ts) - o), produced: (x.produced || []).slice(), item: null })));
      if (c.id === 'C-2284') {
        const tr = st().find('traces', 'tr-id-9');
        if (tr) evs.push({ id: 'st-C-2284-x', stepId: 'C-2284-x', ts: tr.ts, t: Math.max(0, aabs(tr.ts) - o), actor: 'ag-iam-review', domain: 'iam', level: 'L2', phase: 'context', title: 'Scope extended by case C-2302: 27 combinations', text: 'The root cause of the compromised payment approver (C-2302) is the same pattern: an operator who can create and approve a beneficiary. The Access Review Agent widens this case to 27 combinations across Treasury and Trade Finance.', flow: [['ag-iam-review', 'ctx-graph'], ['ctx-graph', 'ag-iam-review']], produced: [['backlog', 'B-315']], item: tr, link: 'C-2302' });
      }
      const ld = (B.decisions || []);
      ld.forEach((d) => { const l = SCR.ui.localDec[d.id]; if (l) evs.push({ id: 'st-' + d.id, stepId: d.id, ts: l.at, t: Math.max(0, aabs(l.at) - o), actor: d.decider, domain: 'human', level: 'L1', phase: 'decision', title: (l.status === 'approved' ? 'Approved: ' : 'Rejected: ') + d.title, text: 'Decision recorded in the case by ' + pname(d.decider) + '. ' + (l.status === 'approved' ? 'The prepared action is executed by the platform.' : 'The platform applies the fallback and keeps monitoring.'), flow: [['hu-engage', 'or-hitl'], ['or-hitl', 'int-exec']], produced: [], item: l }); });
    }
    if (c.manual) {
      const o = aabs(c.opened);
      evs.push({ id: 'st-' + c.id + '-0', stepId: c.id + '-0', ts: c.opened, t: 0, actor: c.lead || 'p-analyst', domain: 'human', level: 'L0', phase: 'trigger', title: 'Case opened manually', text: c.summary || 'Opened from the case queue.', flow: [['hu-run', 'or-plan']], produced: [], item: c });
      evs.push({ id: 'st-' + c.id + '-1', stepId: c.id + '-1', ts: c.opened, t: 30, actor: 'orchestrator', domain: 'orch', level: 'L3', phase: 'plan', title: 'Triage plan proposed', text: 'The orchestrator searched case memory for similar cases and proposes the ' + (CP.agent(c.owner) || { name: 'SOC Triage Agent' }).name + ' as owner, with an enrichment of the entities named in the description.', flow: [['or-plan', 'ctx-memory'], ['ctx-memory', 'or-plan'], ['or-plan', 'or-policy']], produced: [], item: c });
      void o;
    }
    (SCR.ui.notes[c.id] || []).forEach((n, i) => evs.push({ id: 'nt-' + c.id + '-' + i, stepId: 'note', ts: n.ts, t: Math.max(0, aabs(n.ts) - aabs(c.opened)), actor: n.by, domain: 'human', level: 'L0', phase: n.phase || 'lessons', title: n.title, text: n.text, flow: [], produced: [], item: n }));
    return evs.sort((a, b) => a.t - b.t);
  }

  function decisionsOf(c) {
    const sc = scnOf(c);
    const out = [];
    if (sc) st().get('approvals').filter((a) => a.scenario === sc.id).forEach((a) => out.push({ a, live: true }));
    const B = BASE[c.id];
    if (B) (B.decisions || []).forEach((d) => { const l = SCR.ui.localDec[d.id]; out.push({ a: Object.assign({}, d, l ? { status: l.status, decidedAt: l.at, decidedBy: d.decider } : { status: d.status || 'pending' }), local: true }); });
    return out;
  }
  const pendingOf = (c) => decisionsOf(c).filter((d) => d.a.status === 'pending').length;

  function phasesReached(c, evs) {
    const set = {}; evs.forEach((e) => { set[e.phase] = (set[e.phase] || 0) + 1; });
    if (c.status === 'closed' && !set.lessons) set.lessons = c.lessons ? 1 : 0;
    if (c.status === 'closed' && c.lessons) set.lessons = (set.lessons || 0) || 1;
    return set;
  }

  /* SLA: time to contain (incidents) or a regulatory deadline. */
  function sla(c, evs) {
    const inf = info(c); const sc = scnOf(c);
    if (inf.deadline) {
      const r = st().find('regulatory', inf.reg);
      if (r && r.status === 'submitted') return { cls: 'met', main: 'Submitted', sub: 'due ' + inf.deadline + ' · 3 days early', pct: 100 };
      if (c.status === 'closed') return { cls: 'met', main: 'Met', sub: 'due ' + inf.deadline, pct: 100 };
      const pct = r ? Math.round((r.collected / r.total) * 100) : 0;
      return { cls: 'warn', main: 'Due ' + inf.deadline, sub: (r ? r.collected + ' of ' + r.total + ' items' : 'regulatory deadline'), pct };
    }
    const target = SLA_T[c.severity] || SLA_T.medium;
    let age; let containedAt = null;
    if (sc) {
      const last = evs.length ? evs[evs.length - 1].t : 0;
      age = playerOn(sc) && c.status !== 'closed' ? CP.clock.t : last;
      if (inf.containStep) {
        const e = evs.find((x) => x.stepId === inf.containStep);
        if (e) { const ap = e.gate ? st().find('approvals', e.gate) : null; if (!ap || ap.status !== 'pending') containedAt = inf.containT != null ? inf.containT : e.t; }
      }
    } else {
      const o = aabs(c.opened);
      const end = c.status === 'closed' && c.closedAt ? aabs(c.closedAt) : nowBase();
      age = wrapWeek(end - o);
      const B = BASE[c.id] || {};
      if (B.containedAfter != null) containedAt = typeof B.containedAfter === 'number' ? B.containedAfter : wrapWeek(aabs(B.containedAfter) - o);
      else if (c.status !== 'open' && c.containedAt) containedAt = Math.max(0, aabs(c.containedAt) - o);
      else if (c.status !== 'open') containedAt = Math.min(age, target / 2);
    }
    if (containedAt != null && c.status !== 'open') {
      const ok = containedAt <= target;
      return { cls: ok ? 'met' : 'bad', main: ok ? 'Met · ' + dur(containedAt) : 'Breached · ' + dur(containedAt), sub: 'contain within ' + SLA_L[c.severity], pct: 100, age };
    }
    if (containedAt != null) return { cls: 'met', main: 'Contained · ' + dur(containedAt), sub: 'target ' + SLA_L[c.severity], pct: 100, age };
    const left = target - age; const pct = Math.min(100, Math.round((age / target) * 100));
    if (left < 0) return { cls: 'bad', main: 'Breached by ' + dur(-left), sub: 'contain within ' + SLA_L[c.severity], pct: 100, age };
    return { cls: pct > 70 ? 'warn' : 'ok', main: dur(left) + ' left', sub: 'contain within ' + SLA_L[c.severity], pct, age };
  }
  function ageOf(c, evs) {
    const sc = scnOf(c);
    if (sc) { const last = evs.length ? evs[evs.length - 1].t : 0; return playerOn(sc) && c.status !== 'closed' ? CP.clock.t : last; }
    const end = c.status === 'closed' && c.closedAt ? aabs(c.closedAt) : nowBase();
    return wrapWeek(end - aabs(c.opened));
  }

  /* Saved views of the queue. */
  const VIEWS = [
    { id: 'open', label: 'All open', icon: 'list', fn: (c) => c.status !== 'closed' },
    { id: 'mine', label: 'My open cases', icon: 'user', fn: (c) => c.status !== 'closed' && isMine(c) },
    { id: 'critical', label: 'Critical', icon: 'alert', fn: (c) => c.status !== 'closed' && (c.severity === 'critical' || c.severity === 'high') },
    { id: 'decision', label: 'Awaiting decision', icon: 'users', fn: (c) => pendingOf(c) > 0, warn: true },
    { id: 'closed', label: 'Closed this week', icon: 'checkCircle', fn: (c) => c.status === 'closed' && !c.lastWeek },
    { id: 'ai', label: 'AI incidents', icon: 'bot', fn: (c) => (c.domains || []).indexOf('trust') >= 0 || /^AI incident/.test(c.title) },
    { id: 'all', label: 'All cases', icon: 'layers', fn: () => true }
  ];
  const MINE_RULE = { ciso: 'critical, high or escalated to you', engage: 'GRC cases and cases escalated to Engage', build: 'AppSec cases and cases with platform work', run: 'cases owned by agents you supervise', trust: 'AI incidents and assurance cases', analyst: 'cases you lead and SOC / IAM cases', auditor: 'all cases in audit scope' };
  function isMine(c) {
    const r = CP.currentRole; const persona = (CP.role(r) || {}).persona; const lead = c.lead || info(c).lead; const d = c.domains || [];
    if (lead === persona) return true;
    if (c.escalated && c.escalated.role === r) return true;
    if (r === 'ciso') return c.severity === 'critical' || c.severity === 'high' || !!c.escalated;
    if (r === 'engage') return d.indexOf('grc') >= 0;
    if (r === 'build') return d.indexOf('appsec') >= 0;
    if (r === 'run') return !!CP.agent(c.owner) || c.owner === 'orchestrator';
    if (r === 'trust') return d.indexOf('trust') >= 0;
    if (r === 'analyst') return d.indexOf('soc') >= 0 || d.indexOf('iam') >= 0;
    return r === 'auditor';
  }

  /* ------------------------------------------------------------------
     Explainability: tool calls, inputs, policy, cost, rollback
     ------------------------------------------------------------------ */
  const EXEC = { 'sys-waf': 'waf.deploy_rule', 'sys-siem': 'siem.deploy_rule', 'sys-edr': 'edr.collect', 'sys-fw': 'firewall.update_policy', 'sys-proxy': 'proxy.block', 'sys-vuln': 'vuln.patch', 'sys-mail': 'mail.quarantine', 'sys-pam': 'pam.rotate', 'it-itsm': 'itsm.create_change', 'it-entra': 'idp.revoke_sessions', 'it-m365': 'mail.delete_rule', 'it-cmdb': 'cmdb.update', 'it-apps': 'app.update', 'it-hr': 'hr.read' };
  const READ = { 'it-m365': 'collab.audit.read', 'it-cmdb': 'cmdb.read', 'it-entra': 'idp.read', 'it-apps': 'app.entitlements.read', 'it-hr': 'hr.read', 'sys-edr': 'edr.query', 'sys-siem': 'siem.query', 'sys-mail': 'mail.query', 'sys-vuln': 'vuln.read', 'sys-proxy': 'proxy.logs', 'it-itsm': 'itsm.read' };
  function callOf(from, to, actor) {
    const L = nodeLabel;
    if (to === 'ctx-graph') return ['graph.query', 'exposure, owners and relationships'];
    if (from === 'ctx-graph') return ['graph.result', 'subgraph returned to ' + L(to)];
    if (to === 'ctx-lake') return from === 'or-audit' ? ['audit.archive', 'signed trail to long-term memory'] : actor === 'ag-soc-detect' ? ['lake.backtest', '30 days of logs'] : actor === 'ag-soc-forensic' ? ['lake.store', 'triage package with hashes'] : ['lake.search', 'logs and evidence'];
    if (from === 'ctx-lake') return ['lake.result', 'rows returned to ' + L(to)];
    if (to === 'ctx-memory') return ['memory.recall', 'similar past cases and playbooks'];
    if (from === 'ctx-memory') return ['memory.result', 'matches returned'];
    if (to === 'or-sandbox') return ['sandbox.replay', 'digital twin, recorded traffic'];
    if (from === 'or-sandbox') return [to === 'sys-siem' ? 'siem.observe' : 'sandbox.result', 'replay verdict to ' + L(to)];
    if (to === 'or-policy') return ['policy.check', 'decision rights L0 to L3, thresholds'];
    if (from === 'or-policy') return [to === 'or-hitl' ? 'policy.escalate' : 'policy.verdict', L(to)];
    if (to === 'or-hitl') return ['hitl.escalate', 'human decision requested'];
    if (from === 'or-hitl' && to.indexOf('hu-') === 0) return ['notify', 'decision holder: ' + L(to)];
    if (from === 'or-hitl') return ['hitl.release', 'approved action to ' + L(to)];
    if (to === 'or-plan') return ['orchestrator.report', 'findings to the planner'];
    if (from === 'or-plan' && CP.agent(to)) return ['task.assign', CP.agent(to).name];
    if (from === 'or-plan') return ['brief.send', L(to)];
    if (to === 'int-exec') return ['executor.submit', 'signed playbook, rollback point'];
    if (from === 'int-exec') return [EXEC[to] || 'execute', L(to)];
    if (to === 'or-kill') return ['killswitch.request', 'lower autonomy'];
    if (from === 'or-kill') return ['autonomy.set', L(to) + ' to L0'];
    if (to === 'or-audit') return ['journal.open', 'rollback journal'];
    if (from === 'or-audit') return [to === 'ctx-lake' ? 'audit.archive' : to.indexOf('hu-') === 0 ? 'report.send' : 'journal.replay', L(to)];
    if (to === 'ai-eval') return [CP.agent(from) ? 'telemetry.flag' : 'eval.run', L(from)];
    if (from === 'ai-eval') return ['eval.report', L(to)];
    if (to === 'ai-gw') return ['gateway.route', 'model routing rule'];
    if (to === 'int-mcp') return ['connector.ingest', L(from)];
    if (from === 'int-mcp' && to === 'int-bus') return ['bus.publish', 'normalised event'];
    if (from === 'int-mcp') return to.indexOf('out-') === 0 ? ['portal.send', L(to)] : ['connector.deliver', L(to)];
    if (to === 'int-bus') return ['bus.publish', L(from) + ' event'];
    if (from === 'int-bus') return ['event.deliver', L(to)];
    if (to.indexOf('hu-') === 0) return ['notify', L(to)];
    if (from.indexOf('hu-') === 0) return ['human.action', L(to)];
    if (CP.agent(from) && CP.agent(to)) return ['agent.handoff', CP.agent(to).name];
    if (to.indexOf('it-') === 0 || to.indexOf('sys-') === 0) return [READ[to] || 'system.read', L(to)];
    if (from.indexOf('sys-') === 0 || from.indexOf('it-') === 0) return ['event.emit', L(from)];
    if (from.indexOf('out-') === 0) return ['connector.ingest', L(from)];
    return ['call', L(to)];
  }
  function calls(ev) {
    return (ev.flow || []).map((f, i) => {
      const c = callOf(f[0], f[1], ev.actor); const k = ev.id + i;
      let ms = rnd(k, 40, 900);
      if (/deploy|patch|change|collect|revoke|quarantine|update_policy|block|delete/.test(c[0])) ms = rnd(k, 1100, 4800);
      if (c[0] === 'sandbox.replay' || c[0] === 'lake.backtest') ms = rnd(k, 18000, 96000);
      if (/^(notify|hitl|human)/.test(c[0])) ms = rnd(k, 60, 300);
      return { n: i + 1, fn: c[0], arg: c[1], from: nodeLabel(f[0]), to: nodeLabel(f[1]), ms };
    });
  }
  const fmtMs = (ms) => (ms >= 1000 ? (ms / 1000).toFixed(ms >= 10000 ? 0 : 1) + ' s' : ms + ' ms');
  function confidence(ev) {
    const m = /confidence (0\.\d+)/.exec(ev.text || ''); if (m) return +m[1];
    if (!CP.agent(ev.actor) && ev.actor !== 'orchestrator') return null;
    const base = { L3: 0.93, L2: 0.9, L1: 0.86, L0: 0.8 }[ev.level] || 0.9;
    return Math.min(0.99, base + rnd(ev.id, 0, 6) / 100);
  }
  const RATE = { 'Frontier-L (EU)': 0.014, 'Frontier-M (EU)': 0.006, 'Small-S (on-prem)': 0.0012 };
  function cost(ev) {
    const ag = CP.agent(ev.actor);
    if (ag) { const tok = rnd(ev.id + 'tk', 4, 46) * 1000 + rnd(ev.id, 0, 999); const eur = tok / 1000 * (RATE[ag.model] || 0.006) * 2.4; return { v: '€' + eur.toFixed(2), s: CP.fmt(tok / 1000, 1) + 'k tokens · ' + ag.model }; }
    if (ev.actor === 'orchestrator') { const tok = rnd(ev.id, 1200, 6200); return { v: '€' + (tok / 1000 * 0.006 * 2.4).toFixed(2), s: CP.fmt(tok / 1000, 1) + 'k tokens · planner' }; }
    if (laneOf(ev.actor) === 'human' || CP.person(ev.actor)) return { v: rnd(ev.id, 3, 18) + ' min', s: 'human time' };
    return { v: '€0.00', s: 'inbound event, no model call' };
  }
  function crossed(text) {
    const t = (text || '').toLowerCase();
    if (/payment|money|financial/.test(t)) return 'Money';
    if (/interruption|business service|blast|critical business/.test(t)) return 'Blast radius';
    if (/external|regulator|regulatory|client/.test(t)) return 'Exposure';
    if (/autonomy|version|never/.test(t)) return 'Novelty';
    if (/rollback|irreversible/.test(t)) return 'Reversibility';
    return 'Exposure';
  }
  function approvalFor(ev) {
    if (!ev.gate) return null;
    const a = st().find('approvals', ev.gate); if (a) return a;
    const d = localDecisionDef(ev.gate); if (!d) return null;
    const l = SCR.ui.localDec[d.id];
    return Object.assign({}, d, l ? { status: l.status, decidedAt: l.at, decidedBy: d.decider } : { status: d.status || 'pending' });
  }
  function producedItems(ev) {
    return (ev.produced || []).map((p) => ({ coll: p[0], id: p[1], item: st().find(p[0], p[1]) })).filter((x) => x.item && x.coll !== 'approvals');
  }

  /* ------------------------------------------------------------------
     Screen
     ------------------------------------------------------------------ */
  const SCR = CP.screen({
    id: 'cases', part: 2, label: 'Cases', icon: 'workflow',
    ui: { view: 'open', q: '', sev: '', status: '', dom: '', owner: '', sort: 'priority', sel: {}, follow: {}, recent: [], chat: {}, askDraft: {}, localDec: {}, taskDone: {}, tasks: {}, notes: {}, scroll: {} },

    render(route) {
      const id = route.sub;
      if (id && id !== this.ui.recent[0]) { this.ui.recent = [id].concat(this.ui.recent.filter((x) => x !== id)).slice(0, 3); }
      const openN = allCases().filter((c) => c.status !== 'closed').length;
      const tabs = [{ label: 'Queue', tabs: [{ id: '', label: 'All cases', icon: 'list', count: openN || '' }] }];
      const rec = this.ui.recent.filter((x) => getCase(x));
      if (rec.length) tabs.push({ label: 'Open workspaces', tabs: rec.map((x) => { const c = getCase(x); const p = pendingOf(c); return { id: x, label: x + ' · ' + c.title.replace(/^AI incident · /, '').slice(0, 16) + '…', icon: c.status === 'closed' ? 'checkCircle' : 'workflow', count: p || '', warn: true }; }) });
      const role = CP.role(CP.currentRole) || {};
      const right = ui.av(role.persona, 'sm') + '<span>' + esc(role.label || '') + ' · ' + allCases().filter((c) => c.status !== 'closed' && isMine(c)).length + ' open in my view</span>';
      const body = id ? workspace(id) : queue();
      return ui.tabbar('cases', tabs, id || '', right) + '<div class="cs-root' + (RO() ? ' cs-roview' : '') + '">' + body + '</div>';
    },

    mount(root, route) {
      const self = this;
      const q = CP.qs('#cs-q', root);
      if (q) q.addEventListener('input', () => { self.ui.q = q.value; const pos = q.selectionStart; CP.render(); const n = CP.qs('#cs-q'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } });
      const cid = route.sub;
      if (!cid) return;
      const ask = CP.qs('#cs-ask-in', root);
      if (ask) {
        ask.addEventListener('input', () => { self.ui.askDraft[cid] = ask.value; });
        ask.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); SCR.actions.askSend(ask, ev, route); } });
        if (self.ui._askFocus) { ask.focus(); self.ui._askFocus = false; }
      }
      /* Keep pane scroll positions across live re-renders; follow the newest step. */
      ['tl', 'tr', 'chat'].forEach((k) => {
        const el = CP.qs('[data-scroll="' + k + '"]', root); if (!el) return;
        const key = cid + ':' + k;
        if (self.ui.scroll[key] != null) el.scrollTop = self.ui.scroll[key];
        el.addEventListener('scroll', () => { self.ui.scroll[key] = el.scrollTop; }, { passive: true });
      });
      const chat = CP.qs('[data-scroll="chat"]', root);
      if (chat && self.ui._chatBottom) { chat.scrollTop = chat.scrollHeight; self.ui._chatBottom = false; }
      const tl = CP.qs('[data-scroll="tl"]', root);
      if (tl && (self.ui._scrollSel || (self.ui.follow[cid] !== false && CP.qs('.cs-ev.new', tl)))) {
        const sel = CP.qs('.cs-ev.sel', tl) || CP.qs('.cs-ev:last-child', tl);
        if (sel) { const top = sel.offsetTop - tl.clientHeight / 2 + 40; tl.scrollTop = Math.max(0, top); self.ui.scroll[cid + ':tl'] = tl.scrollTop; }
        self.ui._scrollSel = false;
      }
      if (self.ui._trTop) { const tr = CP.qs('[data-scroll="tr"]', root); if (tr) { tr.scrollTop = 0; self.ui.scroll[cid + ':tr'] = 0; } self.ui._trTop = false; }
    },

    actions: {
      view(el) { this.ui.view = el.dataset.v; CP.render(); },
      filt(el) { this.ui[el.dataset.k] = el.value; CP.render(); },
      clearFilters() { Object.assign(this.ui, { q: '', sev: '', status: '', dom: '', owner: '' }); CP.render(); },
      open(el) { CP.go('cases', el.dataset.id); },
      sel(el, ev, route) { CP.closeModal(); const cid = route.sub; this.ui.sel[cid] = el.dataset.id; this.ui.follow[cid] = false; this.ui._trTop = true; if (el.dataset.scroll) this.ui._scrollSel = true; CP.render(); },
      follow(el, ev, route) { const cid = route.sub; this.ui.follow[cid] = true; this.ui.sel[cid] = null; this.ui._scrollSel = true; this.ui._trTop = true; CP.render(); },
      scrollTo(el) { const t = document.querySelector('[data-tour="' + el.dataset.target + '"]'); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
      chip(el, ev, route) { chipOpen(el.dataset.coll, el.dataset.id, route.sub); },
      evidence(el, ev, route) { evidenceModal(route.sub, el.dataset.id); },
      comm(el, ev, route) { commModal(route.sub, el.dataset.id); },
      localDecide(el, ev, route) {
        if (RO()) return;
        const d = localDecisionDef(el.dataset.id); if (!d) return;
        const v = el.dataset.v === 'approve' ? 'approved' : 'rejected';
        this.ui.localDec[d.id] = { status: v, at: CP.clock.label(), by: d.decider };
        const c = getCase(route.sub);
        if (v === 'approved' && d.onApprove && c && !c._static) st().apply({ op: 'update', coll: 'cases', id: c.id, patch: d.onApprove });
        st().apply({ op: 'inc', path: 'kpis.humanDecisions', by: 1 });
        CP.feed({ actor: d.decider, domain: 'human', level: 'decision', text: (v === 'approved' ? 'Approved: ' : 'Rejected: ') + d.title + ' (' + route.sub + ')' });
        CP.toast((v === 'approved' ? 'Decision recorded: approved. ' : 'Decision recorded: rejected. ') + d.title, v === 'approved' ? '' : 'warn');
      },
      taskToggle(el, ev, route) {
        if (RO()) return;
        const k = el.dataset.id; const now = !this.ui.taskDone[k];
        this.ui.taskDone[k] = now;
        CP.feed({ actor: (CP.role(CP.currentRole) || {}).persona, domain: 'human', level: 'info', text: (now ? 'completed task: ' : 'reopened task: ') + el.dataset.title + ' (' + route.sub + ')' });
        CP.toast(now ? 'Task marked done.' : 'Task reopened.');
      },
      addTask(el, ev, route) {
        const ppl = CP.data.people.filter((p) => ['external', 'business'].indexOf(p.team) < 0);
        CP.modal('Add a task to ' + esc(route.sub), '<div class="cs-form"><label>Task<input id="cs-tk-t" placeholder="What needs to be done" autocomplete="off"></label><label>Owner<select id="cs-tk-w"><optgroup label="People">' + ppl.map((p) => '<option value="' + p.id + '">' + esc(p.name + ' · ' + p.title) + '</option>').join('') + '</optgroup><optgroup label="Agents">' + st().get('agents').map((a) => '<option value="' + a.id + '">' + esc(a.name) + '</option>').join('') + '</optgroup></select></label><label>Due<input id="cs-tk-d" placeholder="e.g. Wed 12:00" autocomplete="off"></label></div>',
          '<button data-close-modal>Cancel</button><button class="primary" data-action="addTaskSave">' + I('check') + ' Add task</button>');
        setTimeout(() => { const i = document.getElementById('cs-tk-t'); if (i) i.focus(); }, 30);
      },
      addTaskSave(el, ev, route) {
        const t = (document.getElementById('cs-tk-t') || {}).value || ''; if (!t.trim()) { CP.toast('Give the task a title.', 'warn'); return; }
        const who = document.getElementById('cs-tk-w').value; const due = document.getElementById('cs-tk-d').value;
        (this.ui.tasks[route.sub] = this.ui.tasks[route.sub] || []).push(T(t.trim(), who, 0, due.trim()));
        CP.closeModal(); CP.feed({ actor: (CP.role(CP.currentRole) || {}).persona, domain: 'human', level: 'info', text: 'assigned a task to ' + pname(who) + ' in ' + route.sub + ': ' + t.trim() });
        CP.toast('Task added and assigned to ' + pname(who) + '.');
      },
      ask(el, ev, route) { askCase(route.sub, el.dataset.q); },
      askSend(el, ev, route) {
        const cid = route.sub; const txt = (this.ui.askDraft[cid] || '').trim(); if (!txt) return;
        this.ui.askDraft[cid] = ''; this.ui._askFocus = true; askCase(cid, matchQ(txt), txt);
      },
      askClear(el, ev, route) { this.ui.chat[route.sub] = []; CP.render(); },
      copyAnswer(el) {
        const box = el.closest('.cs-msg-a'); const pre = box && box.querySelector('pre'); const txt = pre ? pre.textContent : (box ? box.textContent : '');
        try { navigator.clipboard.writeText(txt).then(() => CP.toast('Copied to the clipboard.'), () => CP.toast('Select the text to copy it.', 'warn')); } catch (e) { CP.toast('Select the text to copy it.', 'warn'); }
      },
      rollback(el) {
        if (RO()) return;
        const a = st().find('actions', el.dataset.id); if (!a) return;
        CP.modal('Roll back ' + esc(a.id) + '?', '<p style="margin-top:0">' + esc(a.action) + '</p><dl class="kv"><dt>System</dt><dd>' + esc(a.system) + '</dd><dt>Executed</dt><dd>' + esc(a.ts) + ' by ' + esc(pname(a.agent)) + ' at ' + esc(a.level) + '</dd><dt>Rollback</dt><dd>The executor restores the signed rollback point and re-runs the health checks.</dd><dt>Who is told</dt><dd>Agent supervisor, case lead, the agent itself (learns the outcome)</dd></dl><div class="notice" style="margin-top:12px">Rolling back removes the protection or change this action provided. The case keeps the trail of both.</div>',
          '<button data-close-modal>Cancel</button><a class="btn-demo" style="background:#fff;border:1px solid var(--line);color:var(--ink)" href="#/run/journal">' + I('list') + ' Open the journal</a><button class="danger" data-action="rollbackDo" data-id="' + esc(a.id) + '">' + I('rollback') + ' Roll back now</button>');
      },
      rollbackDo(el) {
        const a = st().find('actions', el.dataset.id); if (!a) return;
        st().apply({ op: 'update', coll: 'actions', id: a.id, patch: { status: 'rolled-back' } });
        CP.feed({ actor: (CP.role(CP.currentRole) || {}).persona, domain: 'human', level: 'action', text: 'rolled back ' + a.id + ': ' + a.action });
        CP.closeModal(); CP.toast('Rollback executed: ' + a.id + ' restored to its rollback point.', 'warn');
      },
      assign(el, ev, route) { assignModal(getCase(route.sub)); },
      assignSave(el, ev, route) {
        const c = getCase(route.sub); const owner = document.getElementById('cs-as-o').value; const lead = document.getElementById('cs-as-l').value;
        st().apply({ op: 'update', coll: 'cases', id: c.id, patch: { owner, lead } }); CP.closeModal();
        CP.feed({ actor: (CP.role(CP.currentRole) || {}).persona, domain: 'human', level: 'info', text: 'assigned ' + c.id + ' to ' + pname(owner) + ', lead ' + pname(lead) + '.' });
        CP.toast(c.id + ' assigned: owner ' + pname(owner) + ', lead ' + pname(lead) + '.');
      },
      severity(el, ev, route) { sevModal(getCase(route.sub)); },
      severitySave(el, ev, route) {
        const c = getCase(route.sub); const v = (document.querySelector('input[name="cs-sev"]:checked') || {}).value; const why = document.getElementById('cs-sev-r').value.trim();
        if (!v || v === c.severity) { CP.closeModal(); return; }
        const was = c.severity; st().apply({ op: 'update', coll: 'cases', id: c.id, patch: { severity: v } }); CP.closeModal();
        addNote(c.id, 'Severity changed from ' + was + ' to ' + v, why || 'Changed from the case header.', 'plan');
        CP.feed({ actor: (CP.role(CP.currentRole) || {}).persona, domain: 'human', level: 'info', text: 'changed the severity of ' + c.id + ' from ' + was + ' to ' + v + (why ? ': ' + why : '.') });
        CP.toast('Severity of ' + c.id + ' set to ' + v + '. SLA recalculated.');
      },
      escalate(el, ev, route) { escalateModal(getCase(route.sub)); },
      escalateSave(el, ev, route) {
        const c = getCase(route.sub); const to = document.getElementById('cs-es-to').value; const why = document.getElementById('cs-es-r').value.trim(); const raise = document.getElementById('cs-es-up').checked;
        const role = { 'p-tom': 'engage', 'p-elena': 'ciso', 'p-lucas': 'engage', 'p-sara': 'engage', 'p-chloe': 'run' }[to];
        const patch = { escalated: { to, role, at: CP.clock.label(), reason: why } };
        if (raise && SEVO[c.severity] > 1) patch.severity = 'high';
        st().apply({ op: 'update', coll: 'cases', id: c.id, patch }); CP.closeModal();
        addNote(c.id, 'Escalated to ' + pname(to), why || 'Escalated from the case workspace.', 'decision');
        CP.feed({ actor: (CP.role(CP.currentRole) || {}).persona, domain: 'human', level: 'decision', text: 'escalated ' + c.id + ' to ' + pname(to) + (why ? ': ' + why : '.') });
        CP.toast(c.id + ' escalated to ' + pname(to) + '. They are notified on their phone and in their inbox.', 'warn');
      },
      close(el, ev, route) { closeModal(getCase(route.sub)); },
      closeSave(el, ev, route) {
        const c = getCase(route.sub); const lessons = document.getElementById('cs-cl-l').value.trim(); const root = document.getElementById('cs-cl-r').value; const bl = document.getElementById('cs-cl-b').checked;
        if (!lessons) { CP.toast('Write at least one lesson before closing.', 'warn'); return; }
        const was = c.status;
        st().apply({ op: 'update', coll: 'cases', id: c.id, patch: { status: 'closed', lessons, rootCause: root, closedAt: CP.clock.label(), closedBy: (CP.role(CP.currentRole) || {}).persona } });
        if (was !== 'closed') st().apply({ op: 'inc', path: 'kpis.casesOpen', by: -1 });
        let bid = null;
        if (bl) {
          const n = st().get('backlog').reduce((m, b) => Math.max(m, +(b.id.replace(/\D/g, '')) || 0), 317) + 1; bid = 'B-' + n;
          st().apply({ op: 'add', coll: 'backlog', item: { id: bid, title: 'Lesson from ' + c.id + ': ' + lessons.split(/\n|\. /)[0].slice(0, 90), domain: (c.domains || ['soc'])[0] === 'trust' ? 'soc' : (c.domains || ['soc'])[0], type: 'feature', from: 'run', priority: SEVO[c.severity] <= 1 ? 'high' : 'medium', status: 'new', effort: 'S', case: c.id } });
        }
        addNote(c.id, 'Closed with lessons' + (bid ? ' (' + bid + ' raised)' : ''), 'Root cause: ' + root + '. ' + lessons, 'lessons');
        CP.closeModal();
        CP.feed({ actor: (CP.role(CP.currentRole) || {}).persona, domain: 'human', level: 'info', text: 'closed ' + c.id + ' with lessons' + (bid ? '; ' + bid + ' sent to the Build backlog.' : '.') });
        CP.toast(c.id + ' closed. Trail and lessons stored in case memory' + (bid ? '; ' + bid + ' added to the Build backlog.' : '.'));
      },
      reopen(el, ev, route) {
        const c = getCase(route.sub); if (!c || c._static) return;
        st().apply({ op: 'update', coll: 'cases', id: c.id, patch: { status: 'open', closedAt: null } }); st().apply({ op: 'inc', path: 'kpis.casesOpen', by: 1 });
        addNote(c.id, 'Case reopened', 'Reopened from the workspace.', 'plan');
        CP.feed({ actor: (CP.role(CP.currentRole) || {}).persona, domain: 'human', level: 'info', text: 'reopened ' + c.id + '.' });
        CP.toast(c.id + ' reopened.');
      },
      exportCase(el, ev, route) { exportModal(getCase(route.sub)); },
      exportDo(el, ev, route) { CP.closeModal(); CP.feed({ actor: (CP.role(CP.currentRole) || {}).persona, domain: 'human', level: 'info', text: 'exported the case file of ' + route.sub + ' (signed PDF and JSON trail).' }); CP.toast('Case file ' + route.sub + ' generated: signed PDF and JSON trail filed in the evidence room.'); },
      newCase() { newCaseModal(); },
      newCaseSave() {
        const t = document.getElementById('cs-nc-t').value.trim(); if (!t) { CP.toast('Give the case a title.', 'warn'); return; }
        const sev = (document.querySelector('input[name="cs-nc-s"]:checked') || {}).value || 'medium'; const dom = document.getElementById('cs-nc-d').value; const desc = document.getElementById('cs-nc-x').value.trim();
        const used = allCases().map((c) => +c.id.replace(/\D/g, '')).filter((n) => n);
        const nid = 'C-' + (Math.max(2304, Math.max.apply(null, used)) + 1);
        const owner = (st().get('agents').find((a) => a.domain === dom) || { id: 'ag-soc-triage' }).id;
        st().apply({ op: 'add', coll: 'cases', item: { id: nid, title: t, severity: sev, status: 'open', domains: [dom], opened: CP.clock.label(), owner, lead: (CP.role(CP.currentRole) || {}).persona, summary: desc || 'Opened manually, triage in progress.', manual: true } });
        st().apply({ op: 'inc', path: 'kpis.casesOpen', by: 1 });
        CP.feed({ actor: (CP.role(CP.currentRole) || {}).persona, domain: 'human', level: 'info', text: 'opened case ' + nid + ': ' + t });
        CP.closeModal(); CP.toast('Case ' + nid + ' opened. The orchestrator proposes ' + pname(owner) + ' as owner.'); CP.go('cases', nid);
      },
      exportQueue() { CP.toast('Queue exported: ' + filtered().length + ' cases (CSV) with SLA and decision status.'); }
    }
  });

  /* A demo reset also clears what this module keeps outside the store. */
  CP.bus.on('change', (reason) => { if (reason === 'reset') Object.assign(SCR.ui, { localDec: {}, taskDone: {}, tasks: {}, notes: {}, chat: {}, sel: {}, follow: {} }); });

  function addNote(cid, title, text, phase) {
    (SCR.ui.notes[cid] = SCR.ui.notes[cid] || []).push({ ts: CP.clock.label(), by: (CP.role(CP.currentRole) || {}).persona || 'p-analyst', title, text, phase });
  }

  /* ------------------------------------------------------------------
     Queue
     ------------------------------------------------------------------ */
  function filtered(viewOverride) {
    const u = SCR.ui; const V = VIEWS.find((v) => v.id === (viewOverride || u.view)) || VIEWS[0];
    const q = (u.q || '').toLowerCase().trim();
    return allCases().filter((c) => V.fn(c))
      .filter((c) => !u.sev || c.severity === u.sev)
      .filter((c) => !u.status || c.status === u.status)
      .filter((c) => !u.dom || (c.domains || []).indexOf(u.dom) >= 0)
      .filter((c) => !u.owner || (u.owner === 'agent' ? (CP.agent(c.owner) || c.owner === 'orchestrator') : CP.person(c.owner)))
      .filter((c) => !q || (c.id + ' ' + c.title + ' ' + (c.summary || '') + ' ' + (c.domains || []).join(' ') + ' ' + pname(c.owner)).toLowerCase().indexOf(q) >= 0);
  }
  function sorted(list) {
    const u = SCR.ui; const ev = {}; list.forEach((c) => { ev[c.id] = thread(c); });
    const k = {
      priority: (a, b) => (STO[a.status] - STO[b.status]) || (pendingOf(b) - pendingOf(a)) || (SEVO[a.severity] - SEVO[b.severity]) || (ageOf(a, ev[a.id]) - ageOf(b, ev[b.id])),
      newest: (a, b) => (b.id > a.id ? 1 : -1),
      sla: (a, b) => (sla(b, ev[b.id]).pct - sla(a, ev[a.id]).pct),
      severity: (a, b) => (SEVO[a.severity] - SEVO[b.severity]) || (STO[a.status] - STO[b.status])
    }[u.sort] || (() => 0);
    return list.slice().sort(k);
  }
  function phaseMini(c, evs) {
    const set = phasesReached(c, evs);
    return '<span class="cs-phase" title="Golden thread: ' + PHASES.filter((p) => set[p.id]).map((p) => p.label).join(', ') + '">' + PHASES.map((p) => '<i class="' + (set[p.id] ? 'on' : '') + '" style="--pc:' + p.color + '"></i>').join('') + '</span>';
  }
  function scnTag(c) { const sc = scnOf(c) || (CP.scenarios || []).find((x) => x.caseId === c.id); return sc ? '<span class="cs-scn" title="' + esc(sc.title) + '">' + esc(sc.n + ' · ' + sc.short) + '</span>' : ''; }
  function slaCell(c, evs) { const x = sla(c, evs); return '<div class="cs-sla ' + x.cls + '"><b>' + esc(x.main) + '</b><small>' + esc(x.sub) + '</small><div class="bar"><span style="width:' + x.pct + '%"></span></div></div>'; }
  function lastAct(c, evs) { const e = evs[evs.length - 1]; return e ? e.ts : c.opened; }

  function queue() {
    const u = SCR.ui;
    const all = allCases();
    const open = all.filter((c) => c.status !== 'closed');
    const crit = open.filter((c) => c.severity === 'critical' || c.severity === 'high');
    const pend = all.reduce((n, c) => n + pendingOf(c), 0);
    const closedWk = all.filter((c) => c.status === 'closed' && !c.lastWeek).length;
    const anyNew = all.some((c) => st().isNew(c));
    const head = ui.head('Work · Cases', 'Cases', 'Every incident, request and AI incident is a case: one golden thread from the trigger to the lessons, with each agent step explained and each human decision recorded.',
      '<button data-action="exportQueue">' + I('file') + ' Export</button>' + (RO() ? '' : '<button class="primary" data-action="newCase">' + I('workflow') + ' New case</button>'));
    const metrics = '<div class="metrics cs-metrics" data-tour="cases-metrics">' +
      ui.metric({ label: 'Open cases', icon: 'workflow', value: open.length, foot: open.filter((c) => c.status === 'open').length + ' active · ' + open.filter((c) => c.status !== 'open').length + ' contained or monitored', flash: anyNew }) +
      ui.metric({ label: 'Critical or high', icon: 'alert', value: crit.length, color: crit.length ? 'var(--red-ink)' : null, foot: crit.length ? esc(crit[0].id + ' · ' + crit[0].title.slice(0, 34)) + '…' : 'none open' }) +
      ui.metric({ label: 'Awaiting a human', icon: 'users', value: pend, color: pend ? '#8a5a05' : null, foot: pend ? 'decisions above threshold' : 'agents within guardrails' }) +
      ui.metric({ label: 'Mean time to contain', icon: 'clock', value: CP.fmt(st().state.kpis.mttcMinutes), unit: 'min', delta: '-71%', deltaDir: 'up', foot: 'vs 2025 · rolling 30 d' }) +
      ui.metric({ label: 'Closed this week', icon: 'checkCircle', value: closedWk, foot: 'all with lessons in case memory' }) + '</div>';
    const views = '<div class="cs-views" role="tablist" aria-label="Saved views">' + VIEWS.map((v) => {
      const n = v.id === 'decision' ? all.filter(v.fn).length : all.filter(v.fn).length;
      return '<button class="cs-view' + (u.view === v.id ? ' active' : '') + '" role="tab" aria-selected="' + (u.view === v.id) + '" data-action="view" data-v="' + v.id + '"' + (v.id === 'mine' ? ' title="' + esc(MINE_RULE[CP.currentRole] || '') + '"' : '') + '>' + I(v.icon) + esc(v.label) + '<span class="n' + (v.warn && n ? ' w' : '') + '">' + n + '</span></button>';
    }).join('') + '</div>';
    const doms = ['cti', 'grc', 'appsec', 'data', 'iam', 'soc', 'trust'];
    const sel = (k, label, opts) => '<label class="sr" for="cs-f-' + k + '">' + esc(label) + '</label><select id="cs-f-' + k + '" data-change="filt" data-k="' + k + '"><option value="">' + esc(label) + ': all</option>' + opts.map((o) => '<option value="' + o[0] + '"' + (u[k] === o[0] ? ' selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select>';
    const list = sorted(filtered());
    const active = u.q || u.sev || u.status || u.dom || u.owner;
    const filters = '<div class="cs-filters"><div class="cs-search">' + I('search') + '<label class="sr" for="cs-q">Search cases</label><input id="cs-q" placeholder="Search id, title, owner, domain…" value="' + esc(u.q) + '" autocomplete="off"></div>' +
      sel('sev', 'Severity', [['critical', 'Critical'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low']]) +
      sel('status', 'Status', [['open', 'Open'], ['contained', 'Contained'], ['monitoring', 'Monitoring'], ['closed', 'Closed']]) +
      sel('dom', 'Domain', doms.map((d) => [d, CP.domain(d).label])) +
      sel('owner', 'Owner', [['agent', 'Agents and orchestrator'], ['human', 'People']]) +
      '<label class="sr" for="cs-f-sort">Sort</label><select id="cs-f-sort" data-change="filt" data-k="sort">' + [['priority', 'Sort: priority'], ['severity', 'Sort: severity'], ['sla', 'Sort: SLA consumed'], ['newest', 'Sort: newest']].map((o) => '<option value="' + o[0] + '"' + (u.sort === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select>' +
      (active ? '<button class="small ghost" data-action="clearFilters">' + I('x') + ' Clear</button>' : '') +
      '<span class="cs-count">' + list.length + ' case' + (list.length === 1 ? '' : 's') + ' · ' + esc((VIEWS.find((v) => v.id === u.view) || {}).label || '') + (u.view === 'mine' ? ' (' + esc(MINE_RULE[CP.currentRole] || '') + ')' : '') + '</span></div>';
    const V = VIEWS.find((v) => v.id === u.view) || VIEWS[0];
    const emptyMsg = u.view === 'decision' ? 'No case is waiting for a human. Decisions appear here when an agent reaches its threshold: start a scenario to see one.' : u.view === 'ai' ? 'No AI incident. The deviation hunt opens one when an agent drifts (scenario S4).' : active ? 'No case matches these filters.' : 'No case in this view.';
    const rows = list.map((c) => {
      const evs = thread(c); const p = pendingOf(c);
      return '<tr class="cs-tr' + (c.status === 'closed' ? ' cs-closed' : '') + ui.newCls(c) + '" style="--sevc:' + SEVC[c.severity] + '" data-action="open" data-id="' + esc(c.id) + '">' +
        '<td>' + ui.sev(c.severity) + '</td>' +
        '<td><span class="cs-id">' + esc(c.id) + '</span></td>' +
        '<td style="min-width:230px"><div class="cs-title"><a href="#/cases/' + esc(c.id) + '">' + esc(c.title) + '</a></div><div class="cs-sum">' + esc(c.summary || '') + '</div></td>' +
        '<td>' + ui.status(c.status) + (c.escalated ? ' <span class="tag red" title="Escalated to ' + esc(pname(c.escalated.to)) + '">' + I('arrowRight') + ' Esc.</span>' : '') + '</td>' +
        '<td class="cs-hide-lg"><div class="cs-doms">' + (c.domains || []).map(ui.dom).join('') + '</div></td>' +
        '<td><span class="row" style="gap:7px;white-space:nowrap">' + ui.av(c.owner, 'sm') + '<span>' + esc(pname(c.owner)) + '</span></span></td>' +
        '<td class="cs-hide-md" style="white-space:nowrap"><span class="mono small-txt">' + esc(c.opened) + '</span></td>' +
        '<td>' + slaCell(c, evs) + '</td>' +
        '<td>' + (p ? '<span class="cs-dec">' + I('users') + ' ' + p + '</span>' : '<span class="cs-dec0">0</span>') + '</td>' +
        '<td class="cs-hide-md">' + phaseMini(c, evs) + '<div class="small-txt muted mono" style="margin-top:4px">' + esc(lastAct(c, evs)) + '</div></td>' +
        '<td class="cs-hide-lg">' + (scnTag(c) || '<span class="muted">·</span>') + '</td></tr>';
    }).join('');
    const table = '<div class="cs-tablewrap"><table class="cs-t"><thead><tr><th>Severity</th><th>ID</th><th>Case</th><th>Status</th><th class="cs-hide-lg">Domains</th><th>Owner</th><th class="cs-hide-md">Opened</th><th>SLA</th><th>Decisions</th><th class="cs-hide-md">Thread · last activity</th><th class="cs-hide-lg">Scenario</th></tr></thead><tbody>' +
      (rows || '<tr><td colspan="11"><div class="empty">' + esc(emptyMsg) + '</div></td></tr>') + '</tbody></table></div>';
    const cards = '<div class="cs-cards">' + (list.map((c) => {
      const evs = thread(c); const p = pendingOf(c); const x = sla(c, evs);
      return '<a class="cs-card' + ui.newCls(c) + '" style="--sevc:' + SEVC[c.severity] + '" href="#/cases/' + esc(c.id) + '"><div class="r"><span class="cs-id">' + esc(c.id) + '</span>' + ui.sev(c.severity) + ui.status(c.status) + (p ? '<span class="cs-dec">' + I('users') + ' ' + p + '</span>' : '') + scnTag(c) + '</div><div class="t">' + esc(c.title) + '</div><div class="s">' + esc(c.summary || '') + '</div><div class="r small-txt"><span class="muted">' + esc(pname(c.owner)) + ' · ' + esc(c.opened) + '</span><span class="cs-sla ' + x.cls + '" style="min-width:0"><b>' + esc(x.main) + '</b></span></div></a>';
    }).join('') || '<div class="empty">' + esc(emptyMsg) + '</div>') + '</div>';
    void V;
    const launch = RO() ? '' : '<div class="cs-launch">' + I('play') + '<span>Cases open by themselves when a trigger arrives. Start a scenario and watch its case fill up live:</span>' + CP.scenarios.map((x) => '<button data-scenario-start="' + x.id + '" data-goto="cases">' + esc(x.n + ' · ' + x.short) + '</button>').join('') + '</div>';
    const ro = RO() ? '<div class="cs-ro">' + I('lock') + '<span><b>Read-only · internal audit.</b> You see every case, trace and decision with its provenance; actions are disabled.</span></div>' : '';
    return head + ro + metrics + '<div data-tour="cases-list">' + views + filters + table + cards + '</div>' + launch;
  }

  /* ------------------------------------------------------------------
     Workspace
     ------------------------------------------------------------------ */
  function workspace(id) {
    const c = getCase(id);
    if (!c) {
      const sc = (CP.scenarios || []).find((x) => x.caseId === id);
      return '<div class="cs-empty-case card">' + '<div class="eyebrow">Case ' + esc(id) + '</div><h2>This case is not open yet</h2><p class="muted">' + (sc ? 'It is opened by scenario ' + esc(sc.n + ' · ' + sc.title) + '. Start it and the case fills up live, step by step.' : 'No case with this id in the queue.') + '</p><div class="row" style="justify-content:center">' + (sc && !RO() ? '<button class="primary" data-scenario-start="' + sc.id + '">' + I('play') + ' Start ' + esc(sc.n) + '</button>' : '') + '<a class="btn-demo" style="background:#fff;border:1px solid var(--line);color:var(--ink)" href="#/cases">' + I('chevronLeft') + ' Back to the queue</a></div></div>';
    }
    const evs = thread(c);
    const sc = scnOf(c);
    const u = SCR.ui;
    let selId = u.sel[id];
    if (!selId || !evs.some((e) => e.id === selId) || (u.follow[id] !== false && playerOn(sc))) selId = evs.length ? evs[evs.length - 1].id : null;
    if (u.follow[id] === false && !evs.some((e) => e.id === u.sel[id])) selId = evs.length ? evs[evs.length - 1].id : null;
    const sel = evs.find((e) => e.id === selId);
    const ro = RO() ? '<div class="cs-ro">' + I('lock') + '<span><b>Read-only · internal audit.</b> Every step below is signed in the audit trail; decisions and actions are disabled for your role.</span></div>' : '';
    return ro + header(c, evs, sc) +
      '<div class="cs-split">' + timelinePane(c, evs, selId, sc) + tracePane(c, evs, sel) + '</div>' +
      '<div class="cs-g3" style="margin-bottom:18px">' + decisionsCard(c, evs) + contextCard(c, evs) + askCard(c) + '</div>' +
      '<div class="cs-g3">' + tasksCard(c, evs) + commsCard(c, evs) + evidenceCard(c, evs) + '</div>';
  }

  function header(c, evs, sc) {
    const inf = info(c); const x = sla(c, evs); const p = pendingOf(c);
    const set = phasesReached(c, evs);
    const lead = c.lead || inf.lead;
    const tps = (inf.suppliers || []).map((tid) => st().find('thirdParties', tid)).filter(Boolean);
    const isStatic = !!c._static;
    const acts = (RO() || isStatic) ? '<button data-action="exportCase">' + I('file') + ' Case file</button>' :
      '<button data-action="assign">' + I('user') + ' Assign</button><button data-action="severity">' + I('alert') + ' Severity</button>' +
      (c.status !== 'closed' ? '<button data-action="escalate">' + I('arrowRight') + ' Escalate</button>' : '') +
      '<button data-action="exportCase">' + I('file') + ' Case file</button>' +
      (c.status !== 'closed' ? '<button class="primary" data-action="close">' + I('checkCircle') + ' Close with lessons</button>' : '<button data-action="reopen">' + I('restart') + ' Reopen</button>');
    const meta = [
      ['Owner', ui.who(c.owner)],
      ['Lead', lead ? ui.who(lead) : '<span class="muted">unassigned</span>'],
      ['SLA', '<div class="cs-sla ' + x.cls + '" style="min-width:0"><b>' + esc(x.main) + '</b><small>' + esc(x.sub) + ' · opened ' + esc(c.opened) + '</small><div class="bar"><span style="width:' + x.pct + '%"></span></div></div>'],
      ['Domains', '<div class="v">' + (c.domains || []).map(ui.dom).join('') + '</div>'],
      ['Business services', '<div class="v">' + ((inf.services || []).map((sv) => '<a href="#/graph-x?q=' + encodeURIComponent(sv) + '">' + esc(sv) + '</a>').join('<span class="muted">·</span>') || '<span class="muted">none linked</span>') + '</div>'],
      ['Suppliers', '<div class="v">' + (tps.map((t) => '<a href="#/graph-x?q=' + encodeURIComponent(t.name) + '" title="' + esc(t.criticality + ' · score ' + t.score) + '">' + esc(t.name) + '</a>').join('<span class="muted">·</span>') + (inf.moreSuppliers ? ' <span class="muted small-txt">+' + inf.moreSuppliers + '</span>' : '') || '<span class="muted">none</span>') + '</div>']
    ].map((m) => '<div><div class="k">' + m[0] + '</div><div>' + m[1] + '</div></div>').join('');
    const phasebar = '<div class="cs-phasebar" aria-label="Golden thread stages">' + PHASES.map((ph) => '<div class="' + (set[ph.id] ? 'on' : '') + '" style="--pc:' + ph.color + '">' + I(ph.icon) + esc(ph.label) + '<span class="n">' + (set[ph.id] || '') + '</span></div>').join('') + '</div>';
    let banner = '';
    const ps = CP.player && CP.player.status();
    if (sc && playerOn(sc) && ps.waiting) { const a = st().find('approvals', ps.waiting); banner = '<div class="cs-banner wait"><span class="dot"></span><b>Paused at a decision.</b> <span>' + esc(a ? a.title : '') + ' · waiting for ' + esc(a ? pname(a.decider) : 'a human') + '</span><button data-action="scrollTo" data-target="case-decisions">' + I('users') + ' Go to decision</button></div>'; }
    else if (sc && playerOn(sc) && !ps.done) banner = '<div class="cs-banner live"><span class="dot"></span><b>Live.</b> <span>The agents are working this case: step ' + (ps.index + 1) + ' of ' + ps.total + ' (' + esc(sc.n + ' · ' + sc.short) + '). New steps appear in the thread as they happen.</span></div>';
    else if (p) banner = '<div class="cs-banner wait"><span class="dot"></span><b>' + p + ' decision' + (p > 1 ? 's' : '') + ' waiting for a human.</b><button data-action="scrollTo" data-target="case-decisions">' + I('users') + ' Review</button></div>';
    if (c.escalated) banner += '<div class="cs-banner esc">' + I('arrowRight') + '<b>Escalated to ' + esc(pname(c.escalated.to)) + '</b><span class="muted">' + esc(c.escalated.at) + (c.escalated.reason ? ' · ' + esc(c.escalated.reason) : '') + '</span></div>';
    const agents = {}; evs.forEach((e) => { if (CP.agent(e.actor)) agents[e.actor] = 1; ((e.flow || (e.trace && e.trace.flow) || (e.tr && e.tr.flow) || [])).forEach((f) => f.forEach((n) => { if (CP.agent(n)) agents[n] = 1; })); });
    const autoN = evs.filter((e) => CP.agent(e.actor) && (e.level === 'L2' || e.level === 'L3')).length;
    const decN = decisionsOf(c).filter((d) => d.a.status !== 'pending').length;
    const costT = evs.reduce((sum, e) => { const v = cost(e).v; return sum + (v[0] === '€' ? +v.slice(1) : 0); }, 0);
    const kpis = '<div class="cs-kpis">' + [[evs.length, 'steps in the thread'], [Object.keys(agents).length, 'agents involved'], [autoN, 'autonomous actions (L2/L3)'], [decN + (p ? ' + ' + p : ''), 'human decisions' + (p ? ' (+ pending)' : '')], ['€' + costT.toFixed(2), 'AI cost of the case'], [dur(ageOf(c, evs)), c.status === 'closed' ? 'from trigger to closure' : 'case age']].map((k) => '<div><b>' + esc(String(k[0])) + '</b><span>' + esc(k[1]) + '</span></div>').join('') + '</div>';
    return '<section class="cs-head' + ui.newCls(c) + '" style="--sevc:' + SEVC[c.severity] + '" data-tour="case-header">' +
      '<div class="cs-htop"><div class="cs-hmain"><div class="cs-crumb"><a href="#/cases">' + I('chevronLeft') + ' Cases</a><span>/</span><span class="mono">' + esc(c.id) + '</span>' + (inf.playbook ? '<span>·</span><span>Playbook ' + esc(inf.playbook) + '</span>' : '') + '</div>' +
      '<div class="cs-tags">' + ui.sev(c.severity) + ui.status(c.status) + scnTag(c) + (isStatic ? '<span class="tag outline">Archived</span>' : '') + (c.manual ? '<span class="tag outline">Opened manually</span>' : '') + '</div>' +
      '<h1 class="cs-h1">' + esc(c.title) + '</h1><p class="cs-lede">' + esc(c.summary || '') + '</p></div>' +
      '<div class="cs-acts">' + acts + '</div></div>' +
      '<div class="cs-meta">' + meta + '</div>' + kpis + phasebar + banner +
      (c.lessons ? '<div class="cs-banner" style="background:var(--green-50)">' + I('book') + '<b>Lessons</b><span>' + esc(c.lessons) + (c.rootCause ? ' · root cause: ' + esc(c.rootCause) : '') + '</span></div>' : '') +
      '</section>';
  }

  function laneStrip(evs, selId) {
    const n = evs.length; if (!n) return '';
    const lw = 92, cw = Math.max(42, Math.min(84, Math.floor(560 / n))), rh = 21, top = 6;
    const W = lw + n * cw + 10, H = top + LANES.length * rh + 6;
    let g = '';
    LANES.forEach((l, i) => {
      const y = top + i * rh;
      g += '<rect x="0" y="' + y + '" width="' + W + '" height="' + rh + '" fill="' + (i % 2 ? '#fff' : '#f7f6fb') + '"/>' +
        '<rect x="0" y="' + y + '" width="3" height="' + rh + '" fill="' + l.color + '"/>' +
        '<text x="10" y="' + (y + 14) + '" font-size="10.5" font-weight="600" fill="#4a4560">' + esc(l.label) + '</text>';
    });
    const pts = evs.map((e, i) => [lw + i * cw + cw / 2, top + LANES.findIndex((l) => l.id === laneOf(e.actor)) * rh + rh / 2]);
    g += '<polyline points="' + pts.map((p) => p.join(',')).join(' ') + '" fill="none" stroke="#451dc7" stroke-width="2" stroke-linejoin="round" opacity=".55"/>';
    evs.forEach((e, i) => {
      const p = pts[i]; const col = e.gate ? '#ffb648' : domHex(e.domain); const on = e.id === selId;
      const shape = e.gate ? '<rect x="' + (p[0] - 6) + '" y="' + (p[1] - 6) + '" width="12" height="12" transform="rotate(45 ' + p[0] + ' ' + p[1] + ')" fill="' + col + '" stroke="' + (on ? '#211248' : '#c8861a') + '" stroke-width="' + (on ? 2.5 : 1) + '"/>' :
        '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (on ? 7.5 : 6) + '" fill="' + col + '" stroke="' + (on ? '#211248' : '#fff') + '" stroke-width="' + (on ? 2.5 : 1.5) + '"/>';
      g += '<g data-action="sel" data-id="' + esc(e.id) + '" data-scroll="1" role="button" aria-label="' + esc('Step ' + (i + 1) + ': ' + e.title) + '"><title>' + esc((i + 1) + ' · ' + hhmm(e.ts) + ' · ' + e.title) + '</title><rect x="' + (p[0] - cw / 2) + '" y="' + top + '" width="' + cw + '" height="' + (LANES.length * rh) + '" fill="transparent"/>' + shape +
        (store_isNew(e) ? '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="11" fill="none" stroke="#04f06a" stroke-width="2" class="halo"/>' : '') + '</g>';
    });
    return '<div class="cs-strip"><svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMinYMid meet" style="width:100%;height:' + H + 'px;min-width:' + Math.round(W * 0.85) + 'px" role="img" aria-label="Golden thread by actor lane">' + g + '</svg></div>';
  }
  function store_isNew(e) { return e.item && st().isNew(e.item, 3500); }

  function timelinePane(c, evs, selId, sc) {
    const ps = CP.player && CP.player.status();
    const live = sc && playerOn(sc) && !ps.done;
    const followOff = SCR.ui.follow[c.id] === false;
    const items = evs.map((e, i) => {
      const ap = approvalFor(e); const prod = producedItems(e);
      const gate = ap ? '<span class="cs-ev-gate">' + (ap.status === 'pending' ? '<span class="tag amber">' + I('users') + ' Waiting for ' + esc(pname(ap.decider)) + '</span>' : ap.status === 'approved' ? '<span class="tag green">' + I('check') + ' Approved by ' + esc(pname(ap.decidedBy || ap.decider)) + ' · ' + esc(hhmm(ap.decidedAt)) + '</span>' : '<span class="tag red">' + I('x') + ' Rejected · fallback applied</span>') + '</span>' : '';
      const showDay = i === 0 || day(e.ts) !== day(evs[i - 1].ts);
      return '<li class="cs-ev' + (e.id === selId ? ' sel' : '') + (e.gate ? ' gate' : '') + (store_isNew(e) ? ' new' : '') + '" style="--ec:' + domHex(e.domain) + '">' +
        '<button class="cs-ev-btn" data-action="sel" data-id="' + esc(e.id) + '" aria-pressed="' + (e.id === selId) + '">' +
        '<span class="cs-ev-time"><b>' + esc(hhmm(e.ts)) + '</b><small>' + (showDay ? esc(day(e.ts)) + ' · ' : '') + esc(tplus(e.t)) + '</small></span><span class="cs-ev-dot"></span>' +
        '<span><span class="cs-ev-meta">' + phChip(e.phase) + '<b style="color:' + domHex(e.domain) + '">' + esc(pname(e.actor)) + '</b>' + (e.level ? '<span class="lvl ' + esc(e.level) + '">' + esc(e.level) + '</span>' : '') + (e.link ? '<span class="cs-scn">from ' + esc(e.link) + '</span>' : '') + '</span>' +
        '<span class="cs-ev-title">' + esc(e.title) + '</span><span class="cs-ev-text">' + esc(e.text) + '</span>' + gate + '</span></button>' +
        (prod.length || e.artifact ? '<div class="cs-ev-prod">' + (e.artifact ? '<span class="cs-chip" style="border-style:dashed">' + I('file') + esc(e.artifact.type === 'code' ? 'Code' : e.artifact.type === 'email' ? 'Email draft' : e.artifact.type === 'table' ? 'Table' : 'List') + '</span>' : '') + prod.map((x) => chip(x)).join('') + '</div>' : '') + '</li>';
    }).join('');
    const work = live ? '<div class="cs-working"><i></i><i></i><i></i>' + (ps.waiting ? 'Paused: the orchestrator waits for a human decision before the next step.' : 'The orchestrator is working on the next step…') + '</div>' : '';
    const legend = '<div class="cs-legend">' + PHASES.map((p) => '<span><i style="--pc:' + p.color + '"></i>' + esc(p.label) + '</span>').join('') + '<span style="margin-left:auto">' + I('info') + ' Diamond: human decision</span></div>';
    return '<section class="cs-pane accent" data-tour="case-timeline"><div class="cs-pane-h"><div><h2>' + I('workflow') + ' Golden thread</h2><div class="sub">' + evs.length + ' steps from trigger to ' + (c.status === 'closed' ? 'lessons' : 'now') + ' · lanes by actor, colour by domain · select a step to see why</div></div>' +
      (live ? (followOff ? '<button class="small" data-action="follow">' + I('play') + ' Follow live</button>' : '<span class="tag neon">' + I('activity') + ' Following live</span>') : '') + '</div>' +
      laneStrip(evs, selId) + legend +
      '<div class="cs-pane-b" data-scroll="tl">' + (evs.length ? '<ol class="cs-tl">' + items + '</ol>' + work : '<div class="empty" style="margin:16px">No step yet. The thread fills up as agents and people work the case.</div>') + '</div></section>';
  }

  function chip(x) {
    const it = x.item; let s2 = it.status || '';
    if (x.coll === 'actions') s2 = it.status === 'rolled-back' ? 'rolled back' : it.rollback ? 'rollback ready' : it.status;
    if (x.coll === 'wafRules') s2 = it.mode + ' · ' + it.status;
    if (x.coll === 'detections') s2 = it.status;
    if (x.coll === 'forensics') s2 = (it.verdict || '').split(' (')[0];
    return '<button class="cs-chip" data-action="chip" data-coll="' + x.coll + '" data-id="' + esc(x.id) + '" title="' + esc(COLL_L[x.coll] + ' ' + x.id) + '">' + I(COLL_I[x.coll] || 'file') + '<b>' + esc(x.id) + '</b><span class="s">' + esc(COLL_L[x.coll]) + (s2 ? ' · ' + esc(s2) : '') + '</span></button>';
  }

  function renderArtifact(a) {
    if (!a) return '';
    if (a.type === 'code') return ui.code(a.body, a.lang);
    if (a.type === 'email') return ui.email(a);
    if (a.type === 'list') return '<ul>' + a.items.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>';
    if (a.type === 'table') return ui.table(a.cols.map((cl, i) => ({ label: cl, render: (r) => esc(r[i]) })), a.rows);
    return '';
  }

  function tracePane(c, evs, e) {
    if (!e) return '<section class="cs-pane" data-tour="case-trace"><div class="cs-pane-h"><h2>' + I('bot') + ' Agent trace</h2></div><div class="cs-pane-b"><div class="empty" style="margin:16px">Select a step in the thread to see who did it, why, with which tools, under which decision right, and how to undo it.</div></div></section>';
    const i = evs.indexOf(e); const prev = evs[i - 1], next = evs[i + 1];
    const ag = CP.agent(e.actor); const a = CP.actor(e.actor); const lane = laneOf(e.actor);
    const sub = ag ? CP.domain(ag.domain).label + ' agent · v' + ag.version + ' · ' + ag.model : e.actor === 'orchestrator' ? 'Planner, router and policy engine · v4.2' : a.sub;
    const conf = confidence(e); const cst = cost(e);
    const dt = next ? next.t - e.t : null;
    const ap = approvalFor(e);
    const cl = calls(e);
    const totalMs = cl.reduce((m, x) => m + x.ms, 0);
    /* Plan */
    const planStep = evs.find((x) => x.phase === 'plan' && x.t <= e.t && x !== e);
    const assigned = (e.flow || []).some((f) => f[0] === 'or-plan' && f[1] === e.actor);
    const planLine = assigned && planStep ? '<div class="small-txt" style="margin-bottom:8px">' + I('workflow') + ' Assigned by the orchestrator plan (<button class="cs-chip" data-action="sel" data-id="' + esc(planStep.id) + '">step ' + (evs.indexOf(planStep) + 1) + ' · ' + esc(planStep.title) + '</button>)</div>' : assigned ? '<div class="small-txt" style="margin-bottom:8px">' + I('workflow') + ' Assigned by the orchestrator plan</div>' : '';
    const callsHtml = cl.length ? '<ol class="cs-calls">' + cl.map((x) => '<li><span class="no">' + x.n + '</span><span><span class="fn">' + esc(x.fn) + '</span>(<span>' + esc(x.arg) + '</span>)<span class="ar">' + esc(x.from) + ' → ' + esc(x.to) + '</span></span><span class="ms">' + fmtMs(x.ms) + ' <span class="ok">' + I('check') + '</span></span></li>').join('') + '</ol>' : '<div class="small-txt muted">No tool call: human note recorded in the case.</div>';
    /* Inputs */
    const ins = ['Case ' + c.id + ' context: severity ' + c.severity + ', scope, ' + i + ' prior step' + (i === 1 ? '' : 's')];
    if (prev) ins.push('Output of step ' + i + ': ' + prev.title);
    const srcs = {}; (e.flow || []).forEach((f) => f.forEach((n) => { if (/^(ctx-|sys-|it-|out-)/.test(n)) srcs[n] = 1; }));
    Object.keys(srcs).forEach((n) => ins.push((n.indexOf('ctx-') === 0 ? 'Shared context: ' : n.indexOf('out-') === 0 ? 'External source: ' : 'System: ') + nodeLabel(n)));
    if (lane === 'outside' || lane === 'systems') ins.unshift('Raw event from ' + a.name);
    /* Policy */
    let verdict, vcls, holder, thr = null;
    if (ap) {
      thr = crossed(ap.threshold);
      vcls = ap.status === 'pending' ? 'gate' : ap.status === 'approved' ? 'ok' : 'ko';
      verdict = I('alert') + '<span>Threshold crossed: ' + esc(ap.threshold) + ' · ' + (ap.status === 'pending' ? 'waiting for the decision holder' : ap.status === 'approved' ? 'approved ' + esc(ap.decidedAt || '') : 'rejected, fallback applied') + '</span>';
      holder = ui.who(ap.decider);
    } else if (ag || e.actor === 'orchestrator') {
      vcls = 'ok'; verdict = I('shieldCheck') + '<span>Within guardrails: no threshold crossed</span>';
      holder = e.level === 'L3' ? '<span>Agent mandate (autonomous) · QA samples 5%</span>' : e.level === 'L2' ? '<span class="row" style="gap:6px">Act and notify · informed ' + ui.who(ag ? ag.supervisor : 'p-chloe') + '</span>' : '<span>Proposal only</span>';
    } else if (lane === 'human' || lane === 'assure') { vcls = 'na'; verdict = I('user') + '<span>Human or assurance action: recorded and signed, no agent policy applies</span>'; holder = ui.who(e.actor); }
    else { vcls = 'na'; verdict = I('info') + '<span>Inbound event: read-only, no policy check needed</span>'; holder = '<span class="muted">·</span>'; }
    const thrRows = (ag || e.actor === 'orchestrator' || ap) ? '<div class="cs-thr">' + THRESH.map((t) => { const x = t === thr; return '<div>' + (x ? '<span class="x">' + I('alert') + ' ' + esc(t) + ': crossed</span>' : '<span class="ok">' + I('check') + '</span> ' + esc(t)) + '</div>'; }).join('') + '</div>' : '';
    const policy = '<div class="cs-pol"><div class="cs-pol-v ' + vcls + '">' + verdict + '</div><dl class="kv"><dt>Autonomy used</dt><dd>' + (e.level ? ui.lvl(e.level) : '·') + '</dd>' + (ag ? '<dt>Agent mandate now</dt><dd>' + ui.lvl(ag.mode) + ' ' + ui.status(ag.status) + '</dd>' : '') + '<dt>Decision holder</dt><dd>' + holder + '</dd>' + (ap && ap.recommendation ? '<dt>Recommendation</dt><dd style="font-weight:400">' + esc(ap.recommendation) + '</dd>' : '') + '</dl>' + thrRows + '</div>';
    /* Output and produced items */
    const prod = producedItems(e);
    const out = (e.artifact ? '<div class="small-txt muted" style="margin-bottom:6px">' + esc(e.artifact.title || '') + '</div>' + renderArtifact(e.artifact) : '<div class="small-txt">' + esc((e.item && e.item.title) || e.title) + '</div>') +
      (e.metric ? '<div class="cs-metric"><b>' + esc(e.metric.value) + '</b><span>' + esc(e.metric.label) + '</span></div>' : '') +
      (prod.length ? '<div class="row wrap" style="gap:5px;margin-top:10px">' + prod.map(chip).join('') + '</div>' : '');
    /* Rollback */
    const acts = prod.filter((x) => x.coll === 'actions');
    const writes = (e.flow || []).some((f) => f[0] === 'int-exec' || f[1] === 'or-kill' || f[0] === 'or-kill') || prod.some((x) => x.coll === 'wafRules' || x.coll === 'detections');
    let rb = '';
    if (acts.length) rb = acts.map((x) => { const it = x.item; const isA = x.coll === 'actions'; const done = it.status === 'rolled-back';
      return '<div class="cs-rb">' + (done ? '<span class="tag amber">' + I('rollback') + ' Rolled back</span>' : '<span class="tag green">' + I('rollback') + ' Rollback point ready</span>') + '<span><b class="mono">' + esc(x.id) + '</b> ' + esc(isA ? it.action : it.name) + '</span>' +
        (isA && !done && !RO() && !c._static ? '<button class="danger" data-action="rollback" data-id="' + esc(x.id) + '">' + I('rollback') + ' Roll back</button>' : '') + '</div>'; }).join('');
    else if (writes) rb = '<div class="cs-rb"><span class="tag green">' + I('rollback') + ' Rollback point ready</span><span>Executor change signed with snapshot <span class="mono">rb-' + sha(e.id).slice(0, 8) + '</span></span></div>';
    else rb = '<div class="cs-rb"><span class="tag outline">Nothing to undo</span><span class="muted">Read-only step: no change was made in a system.</span></div>';
    rb += '<div class="small-txt" style="margin-top:8px"><a href="#/run/journal">' + I('list') + ' Open the action journal in Operate</a></div>';
    const auditH = sha(c.id + e.id + e.title);
    return '<section class="cs-pane" data-tour="case-trace"><div class="cs-pane-h"><div><h2>' + I('bot') + ' Agent trace</h2><div class="sub">Step ' + (i + 1) + ' of ' + evs.length + ' · why the platform did this</div></div><div class="cs-nav">' +
      '<button class="small" data-action="sel" data-id="' + esc(prev ? prev.id : '') + '" data-scroll="1"' + (prev ? '' : ' disabled') + ' aria-label="Previous step">' + I('chevronLeft') + '</button><button class="small" data-action="sel" data-id="' + esc(next ? next.id : '') + '" data-scroll="1"' + (next ? '' : ' disabled') + ' aria-label="Next step">' + I('chevronRight') + '</button></div></div>' +
      '<div class="cs-pane-b" data-scroll="tr">' +
      '<div class="cs-tr-top"><div class="row wrap" style="gap:6px">' + phChip(e.phase) + (e.level ? ui.lvl(e.level) : '') + '<span class="mono small-txt muted">' + esc(e.ts) + ' · ' + esc(tplus(e.t)) + '</span>' + (e.stepId && e.scenario ? '<span class="cs-scn">' + esc(e.stepId) + '</span>' : '') + '</div>' +
      '<h3>' + esc(e.title) + '</h3><div class="row" style="gap:8px">' + ui.av(e.actor) + '<span><b style="color:' + domHex(e.domain) + '">' + esc(a.name) + '</b><br><span class="small-txt muted">' + esc(sub || '') + '</span></span></div><p>' + esc(e.text) + '</p></div>' +
      '<div class="cs-stats"><div><div class="k">Confidence</div><div class="v">' + (conf != null ? CP.fmt(conf * 100) + '%' : 'n/a') + '</div><div class="s">' + (conf == null ? 'not a model output' : conf < 0.85 ? 'below 85%: human needed' : 'above the 85% floor') + '</div></div>' +
      '<div><div class="k">Cost</div><div class="v">' + esc(cst.v) + '</div><div class="s">' + esc(cst.s) + '</div></div>' +
      '<div><div class="k">Tool time</div><div class="v">' + (cl.length ? fmtMs(totalMs) : '·') + '</div><div class="s">' + cl.length + ' call' + (cl.length === 1 ? '' : 's') + '</div></div>' +
      '<div><div class="k">Until next step</div><div class="v">' + (dt != null ? dur(dt) : '·') + '</div><div class="s">' + (next ? 'step ' + (i + 2) : 'latest step') + '</div></div></div>' +
      '<div class="cs-sec"><h4>' + I('workflow') + ' Plan and tool calls<span class="r">derived from the signed flow</span></h4>' + planLine + callsHtml + '</div>' +
      '<div class="cs-sec"><h4>' + I('database') + ' Inputs</h4><ul class="cs-inputs">' + ins.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></div>' +
      '<div class="cs-sec"><h4>' + I('scale') + ' Policy check</h4>' + policy + '</div>' +
      '<div class="cs-sec cs-out"><h4>' + I('file') + ' Output</h4>' + out + '</div>' +
      '<div class="cs-sec"><h4>' + I('rollback') + ' Rollback</h4>' + rb + '</div>' +
      '<div class="cs-sec"><h4>' + I('fingerprint') + ' Audit trail</h4><div class="cs-audit">sha256:' + auditH + '<br>signed by or-audit · ' + esc(e.ts) + ' · retention 10 years</div></div>' +
      '</div></section>';
  }

  /* Decisions */
  function decisionsCard(c, evs) {
    const ds = decisionsOf(c);
    const order = { pending: 0, approved: 1, rejected: 1 };
    const body = ds.length ? '<div class="cs-decs">' + ds.slice().sort((x, y) => order[x.a.status] - order[y.a.status]).map((d) => {
      let h = ui.decision(d.a, { pulse: d.a.status === 'pending' });
      if (d.local) h = h.replace(/data-decide="([^"]+)" data-decision="(approve|reject)"/g, 'data-action="localDecide" data-id="$1" data-v="$2"');
      const ev = evs.find((e) => e.gate === d.a.id);
      const from = ev ? '<div class="cs-dfrom">Raised at step ' + (evs.indexOf(ev) + 1) + ' · ' + esc(hhmm(ev.ts)) + ' · <button data-action="sel" data-id="' + esc(ev.id) + '" data-scroll="1">see the trace</button></div>' : '';
      return '<div>' + h + from + '</div>';
    }).join('') + '</div>' : '<div class="empty">No decision above threshold in this case: every action stayed inside the agents’ guardrails. When an action crosses a threshold (money, exposure, blast radius), the decision lands here and in the decider’s inbox.</div>';
    const p = ds.filter((d) => d.a.status === 'pending').length;
    return ui.card(I('users') + ' Decisions', body, { tour: 'case-decisions', cls: p ? 'accent' : '', sub: p ? p + ' waiting · ' + (ds.length - p) + ' decided' : ds.length + ' decided · decision rights from Design', right: RO() ? '<span class="tag outline">' + I('lock') + ' read-only</span>' : '' });
  }

  /* Context: blast radius */
  function contextCard(c, evs) {
    const inf = info(c);
    let nodes = (inf.ctx || []).map((n) => ({ type: n[0], label: n[1], sub: n[2], crit: !!n[3], q: n[4] || n[1] }));
    const prods = []; evs.forEach((e) => producedItems(e).forEach((x) => { if (x.coll === 'wafRules' || x.coll === 'detections') prods.push(x); }));
    prods.slice(0, 3).forEach((x) => { if (!nodes.some((n) => n.label === x.id)) nodes.push({ type: 'control', label: x.id, sub: x.item.name, q: x.id }); });
    nodes = nodes.slice(0, 12);
    if (!nodes.length) {
      return ui.card(I('network') + ' Context · blast radius', '<div class="empty">No entity linked yet. Search the graph for the asset, identity or supplier involved and the case picks it up.<div style="margin-top:10px"><a href="#/graph-x?q=' + encodeURIComponent(c.title.split(' ').slice(0, 3).join(' ')) + '">' + I('search') + ' Search the graph</a></div></div>', { tour: 'case-context' });
    }
    const typesOrder = ['service', 'asset', 'identity', 'supplier', 'control'];
    nodes.sort((x, y) => typesOrder.indexOf(x.type) - typesOrder.indexOf(y.type));
    const half = Math.ceil(nodes.length / 2);
    const cols = [nodes.slice(0, half), nodes.slice(half)];
    const W = 400, gap = 46, H = Math.max(cols[0].length, cols[1].length) * gap + 16, cx = W / 2, cy = H / 2;
    let g = '';
    cols.forEach((col, side) => col.forEach((nd, i) => {
      nd.x = side ? cx + 62 : cx - 62; nd.y = cy + (i - (col.length - 1) / 2) * gap; nd.side = side;
      const sx = side ? cx + 40 : cx - 40;
      g += '<path d="M' + sx + ' ' + cy + ' C' + ((sx + nd.x) / 2) + ' ' + cy + ' ' + ((sx + nd.x) / 2) + ' ' + nd.y.toFixed(1) + ' ' + nd.x + ' ' + nd.y.toFixed(1) + '" fill="none" stroke="' + (nd.crit ? '#e7a1ab' : '#dcd7e8') + '" stroke-width="' + (nd.crit ? 2 : 1.4) + '"' + (nd.type === 'supplier' ? ' stroke-dasharray="4 3"' : '') + '/>';
    }));
    g += '<rect x="' + (cx - 40) + '" y="' + (cy - 21) + '" width="80" height="42" fill="#211248"/><text x="' + cx + '" y="' + (cy - 3) + '" text-anchor="middle" font-size="12.5" font-weight="700" fill="#fff" font-family="IBM Plex Mono, monospace">' + esc(c.id) + '</text><text x="' + cx + '" y="' + (cy + 12) + '" text-anchor="middle" font-size="9.5" fill="#04f06a" font-weight="700" letter-spacing=".6">' + esc(c.severity.toUpperCase()) + '</text>';
    nodes.forEach((nd) => {
      const col = (CTX_T[nd.type] || CTX_T.asset)[1];
      const anchor = nd.side ? 'start' : 'end'; const lx = nd.x + (nd.side ? 13 : -13);
      const lab = nd.label.length > 19 ? nd.label.slice(0, 18) + '…' : nd.label;
      const sb = (nd.sub || '').length > 23 ? nd.sub.slice(0, 22) + '…' : (nd.sub || '');
      g += '<a href="#/graph-x?q=' + encodeURIComponent(nd.q) + '"><title>' + esc((CTX_T[nd.type] || [''])[0] + ': ' + nd.label + (nd.sub ? ' · ' + nd.sub : '') + ' · open in the graph') + '</title>' +
        '<circle cx="' + nd.x + '" cy="' + nd.y.toFixed(1) + '" r="' + (nd.crit ? 8 : 7) + '" fill="' + col + '" stroke="' + (nd.crit ? '#d8412f' : '#fff') + '" stroke-width="' + (nd.crit ? 2.5 : 2) + '"/>' +
        '<text x="' + lx + '" y="' + (nd.y - 1).toFixed(1) + '" text-anchor="' + anchor + '" font-size="12" font-weight="600" fill="#201c30">' + esc(lab) + '</text>' +
        '<text x="' + lx + '" y="' + (nd.y + 12).toFixed(1) + '" text-anchor="' + anchor + '" font-size="10.5" fill="#6d687e">' + esc(sb) + '</text></a>';
    });
    const svg = '<svg viewBox="-12 0 ' + (W + 24) + ' ' + H + '" role="img" aria-label="Blast radius of the case">' + g + '</svg>';
    const legend = '<div class="cs-ctx-legend">' + Object.keys(CTX_T).filter((k) => nodes.some((nd) => nd.type === k)).map((k) => '<span><i style="--c:' + CTX_T[k][1] + '"></i>' + esc(CTX_T[k][0]) + '</span>').join('') + '<span><i style="--c:#fff;border:2px solid #d8412f"></i>critical</span></div>';
    const blast = inf.blast ? '<div class="cs-br">' + inf.blast.map((b) => '<div><b>' + esc(b[0]) + '</b>' + esc(b[1]) + '</div>').join('') + '</div>' : '';
    const main = nodes.find((nd) => nd.crit) || nodes[0];
    return ui.card(I('network') + ' Context · blast radius', '<div class="cs-ctx">' + svg + '</div>' + legend + blast, { tour: 'case-context', sub: 'Neighbourhood of the case in the security graph · click a node', right: '<a class="small-txt" href="#/graph-x?q=' + encodeURIComponent(main.q) + '">Open in Graph ' + I('arrowRight') + '</a>' });
  }

  /* Tasks */
  function tasksOf(c, evs) {
    const inf = info(c);
    const base = (inf.tasks || []).concat(SCR.ui.tasks[c.id] || []);
    const out = base.map((t, i) => {
      const key = c.id + ':' + (t.link || t.title);
      let done = t.done, auto = false, by = '';
      if (t.link) {
        auto = true;
        const ev = evs.find((e) => e.stepId === t.link);
        const ap = st().find('approvals', t.link);
        const ld = localDecisionDef(t.link);
        if (ap) { done = ap.status !== 'pending'; by = done ? ap.status + (ap.decidedAt ? ' ' + hhmm(ap.decidedAt) : '') : 'waiting for decision'; }
        else if (ld) { const ls = localStatus(t.link); done = ls !== 'pending'; by = done ? ls : 'waiting for decision'; }
        else if (ev) { done = true; by = 'done ' + hhmm(ev.ts); }
        else { done = false; by = /^AP-/.test(t.link) ? 'not raised yet' : 'planned'; }
      }
      if (!auto && SCR.ui.taskDone[key] != null) done = SCR.ui.taskDone[key];
      return { t, key, done, auto, by, i };
    });
    return out;
  }
  function tasksCard(c, evs) {
    const ts = tasksOf(c, evs);
    const open = ts.filter((x) => !x.done).length;
    const body = ts.length ? '<div class="cs-tasks cs-scroll">' + ts.sort((a, b) => (a.done - b.done) || (a.i - b.i)).map((x) => {
      const isAg = !!CP.agent(x.t.who) || x.t.who === 'orchestrator';
      const cb = x.auto || RO() || c._static ? '<span class="cb ' + (x.done ? 'done' : '') + ' auto" title="' + (x.auto ? 'Tracked automatically from the thread' : 'Read-only') + '">' + (x.done ? I('check') : '') + '</span>' :
        '<button class="cb ' + (x.done ? 'done' : '') + '" data-action="taskToggle" data-id="' + esc(x.key) + '" data-title="' + esc(x.t.title) + '" aria-label="' + (x.done ? 'Reopen' : 'Mark done') + ': ' + esc(x.t.title) + '">' + (x.done ? I('check') : '') + '</button>';
      return '<div class="cs-task' + (x.done ? ' done' : '') + '">' + cb + '<div><div class="tt">' + esc(x.t.title) + '</div><div class="tw">' + ui.av(x.t.who, 'sm') + '<span>' + esc(pname(x.t.who)) + '</span><span class="tag ' + (isAg ? 'dark' : 'outline') + '" style="font-size:10px">' + (isAg ? 'Agent' : 'Human') + '</span>' + (x.by ? '<span>· ' + esc(x.by) + '</span>' : '') + '</div></div><span class="due">' + (x.done ? '' : esc(x.t.due || '')) + '</span></div>';
    }).join('') + '</div>' : '<div class="empty">No task yet.</div>';
    return ui.card(I('check') + ' Tasks', body, { sub: open + ' open · ' + (ts.length - open) + ' done · agents and humans', right: RO() || c._static ? '' : '<button class="small" data-action="addTask">' + I('user') + ' Add task</button>' });
  }

  /* Communications */
  function commsOf(c) {
    const sc = scnOf(c); const B = BASE[c.id] || {};
    let list = sc ? st().get('comms').filter((m) => m.scenario === sc.id) : [];
    if (c.id === 'C-2279') list = list.concat(st().get('comms').filter((m) => m.party === 'tp-lexis'));
    list = list.concat((B.comms || []).map((m) => Object.assign({}, m, m.statusFrom ? { status: localStatus(m.statusFrom) === 'approved' ? 'sent' : localStatus(m.statusFrom) === 'rejected' ? 'draft' : 'awaiting' } : {})));
    return list;
  }
  function commBody(m) {
    buildProduce();
    const step = ITEM_STEP['comms:' + m.id];
    if (step && step.artifact && step.artifact.type === 'email') return step.artifact;
    const party = m.partyLabel || ((st().find('thirdParties', m.party) || {}).name) || m.party;
    return { from: (CP.agent(m.author) ? 'Novalys Cyber Security (drafted by ' + CP.agent(m.author).name + ')' : pname(m.author)), to: party, subject: m.subject, body: m.body && m.body.length > 40 ? m.body : 'Hello,\n\n' + m.subject + '.\n\nThe full context and the evidence are available in the shared space of the case.\n\nCyber Security, Novalys Group' };
  }
  function commsCard(c) {
    const list = commsOf(c);
    const body = list.length ? '<div class="cs-scroll">' + list.map((m) => '<button class="cs-cm' + ui.newCls(m) + '" data-action="comm" data-id="' + esc(m.id) + '"><div><div class="tt">' + esc(m.subject) + '</div><div class="ss">' + I('send') + ' ' + esc(m.channel) + ' · to ' + esc(m.partyLabel || (st().find('thirdParties', m.party) || {}).name || m.party) + '<br>Drafted by ' + esc(pname(m.author)) + ' · validated by ' + esc(pname(m.validator)) + ' · ' + esc(m.ts) + '</div></div>' + ui.status(m.status) + '</button>').join('') + '</div>' : '<div class="empty">No message left the group for this case. Anything sent to suppliers, clients, staff or regulators is drafted by an agent and validated by a human, then listed here.</div>';
    return ui.card(I('mail') + ' Communications', body, { sub: list.length + ' message' + (list.length === 1 ? '' : 's') + ' · every external message validated by a human' });
  }

  /* Evidence */
  function evidenceOf(c, evs) {
    const num = c.id.replace(/\D/g, '').slice(-2); let k = 0;
    const items = [];
    evs.forEach((e) => { if (e.artifact) items.push({ id: 'EV-' + num + '-' + String(++k).padStart(2, '0'), title: e.artifact.title || e.title, type: e.artifact.type === 'code' ? (e.artifact.lang || 'code').toUpperCase() + ' artifact' : e.artifact.type === 'email' ? 'Message draft' : e.artifact.type === 'table' ? 'Table' : 'Finding list', by: e.actor, ts: e.ts, src: (e.flow || []).map((f) => f[1]).filter((x) => /^(ctx-|sys-|it-|out-|or-)/.test(x)).slice(0, 2).map(nodeLabel).join(', ') || 'Case', ev: e, artifact: e.artifact, icon: 'file' }); });
    evs.forEach((e) => producedItems(e).forEach((x) => {
      if (x.coll === 'forensics') items.push({ id: 'EV-' + num + '-' + String(++k).padStart(2, '0'), title: 'Forensic report ' + x.id + ' · ' + x.item.host, type: 'Forensic', by: x.item.agent, ts: e.ts, src: 'EDR, data lake', ev: e, text: x.item.findings + ' Verdict: ' + x.item.verdict, icon: 'fingerprint' });
      if (x.coll === 'actions') items.push({ id: 'EV-' + num + '-' + String(++k).padStart(2, '0'), title: 'Executor receipt ' + x.id, type: 'Receipt', by: x.item.agent, ts: x.item.ts, src: x.item.system, ev: e, text: x.item.action + ' · level ' + x.item.level + ' · ' + (x.item.status === 'rolled-back' ? 'rolled back' : 'rollback point kept'), icon: 'zap' });
      if (x.coll === 'detections') items.push({ id: 'EV-' + num + '-' + String(++k).padStart(2, '0'), title: 'Backtest ' + x.id + ' · ' + x.item.name, type: 'Backtest', by: x.item.author, ts: e.ts, src: 'Data lake', ev: e, text: x.item.backtest + ' · MITRE ATT&CK ' + (x.item.mitre || []).join(', '), icon: 'radar' });
    }));
    (info(c).evidence || []).forEach((x) => { if (!evs.length) return; const ev = x[5] ? evs.find((e) => e.stepId === x[5]) : evs[0]; if (x[5] && !ev) return; items.push({ id: 'EV-' + num + '-' + String(++k).padStart(2, '0'), title: x[0], type: x[1][0].toUpperCase() + x[1].slice(1), by: x[3], ts: ev && x[5] ? ev.ts : x[4], src: nodeLabel(x[2]), ev, icon: x[1] === 'log' ? 'database' : x[1] === 'forensic' ? 'fingerprint' : 'file' }); });
    return items;
  }
  function evidenceCard(c, evs) {
    const items = evidenceOf(c, evs);
    const body = items.length ? '<div class="cs-ev-list cs-scroll">' + items.map((x) => '<button class="cs-evd" data-action="evidence" data-id="' + esc(x.id) + '"><span class="ic">' + I(x.icon) + '</span><span><span class="tt">' + esc(x.title) + '</span><span class="ss" style="display:block">' + esc(x.type) + ' · ' + esc(x.src) + ' · ' + esc(pname(x.by)) + ' · ' + esc(x.ts) + '</span></span><span class="hs">' + sha(x.id + x.title).slice(0, 8) + '</span></button>').join('') + '</div>' : '<div class="empty">No evidence collected yet.</div>';
    return ui.card(I('fingerprint') + ' Evidence', body, { sub: items.length + ' items · hashed, signed, with provenance · 10-year retention' });
  }

  /* Ask the case */
  const QS = [
    { id: 'what', q: 'What happened?' }, { id: 'exposed', q: 'What is still exposed?' }, { id: 'who', q: 'Who decided what?' },
    { id: 'ciso', q: 'Draft the CISO summary' }, { id: 'improve', q: 'What should we improve?' }, { id: 'agents', q: 'What did the agents do on their own?' }
  ];
  function matchQ(t) {
    t = t.toLowerCase();
    if (/ciso|brief|draft|board|summary for|email/.test(t)) return 'ciso';
    if (/expos|residual|risk|still|open|left/.test(t)) return 'exposed';
    if (/decid|approv|who|reject/.test(t)) return 'who';
    if (/improv|lesson|better|learn|next time/.test(t)) return 'improve';
    if (/agent|autonom|alone|automat/.test(t)) return 'agents';
    if (/happen|summary|timeline|what|why/.test(t)) return 'what';
    return 'none';
  }
  function residual(c, evs) {
    const out = []; const B = BASE[c.id];
    if (B && B.residual) return B.residual(c);
    if (c.id === 'C-2301') {
      const atlas = st().find('thirdParties', 'tp-atlas');
      const ap1 = st().find('approvals', 'AP-CTI-TPRM'); const ap2 = st().find('approvals', 'AP-CTI-PATCH');
      if (!evs.some((e) => e.stepId === 'cti-4')) out.push('mft-prd-01 faces the internet with a pre-authentication flaw and no virtual patch yet');
      if (!evs.some((e) => e.stepId === 'cti-9')) out.push('mft-prd-01 is not patched yet' + (evs.some((e) => e.stepId === 'cti-4') ? ': protected by WAF rule W-121 against known exploit paths only' : ''));
      if (ap2 && ap2.status === 'rejected') out.push('Patch postponed to tonight 22:00 by the CISO: W-121 and D-418 carry the risk until then');
      if (ap1 && ap1.status === 'pending') out.push('14 suppliers are not contacted yet: the questionnaire waits for the third-party risk lead');
      if (atlas && atlas.questionnaire && atlas.questionnaire.status === 'flagged') out.push('Atlas Payroll Services still runs FileBridge 8.7 (payroll data of 38k staff): SFTP flow quarantined, fix requested within 24 h');
      const od = st().get('thirdParties').filter((t) => t.questionnaire && t.questionnaire.status === 'overdue' && t.questionnaire.campaign === 'CVE-2026-41877');
      if (od.length) out.push(od.length + ' suppliers have not answered (' + od.map((t) => t.name).join(', ') + '): reminders sent');
      if (!evs.some((e) => e.stepId === 'cti-10') && evs.some((e) => e.stepId === 'cti-7')) out.push('Supplier exposure unknown until answers arrive (deadline 24 h for critical ones)');
    }
    if (c.id === 'C-2302') {
      const ap = st().find('approvals', 'AP-ID-HOLD');
      if (!evs.some((e) => e.stepId === 'id-3')) out.push('The attacker session on t.op-17 is still active');
      if (ap && ap.status === 'pending') out.push('3 payments (€4.2 M) approved by the compromised account are still in the cut-off queue');
      if (ap && ap.status === 'approved') out.push('3 payments held until 10:00 while Treasury calls the beneficiaries back');
      if (ap && ap.status === 'rejected') out.push('Payments released by Treasury decision: fraud monitoring on the 3 beneficiaries');
      if (evs.some((e) => e.stepId === 'id-6')) out.push('1,200 IBANs with names were downloaded: GDPR notification clock running (72 h, due Sat 02:13)');
      if (evs.some((e) => e.stepId === 'id-9')) out.push('27 toxic create-and-approve combinations still open (case C-2284)');
      out.push('312 finance staff still on push MFA until B-315 ships');
    }
    if (c.id === 'C-2303') {
      const r = st().find('regulatory', 'R-DORA-REQ');
      if (r && r.status !== 'submitted') out.push((r.total - r.collected) + ' of 23 evidence items still to assemble; deadline Mon 20 Oct');
      if (evs.some((e) => e.stepId === 'rg-4')) { out.push('31 arrangements without a complete sub-contracting chain (12 providers asked)'); out.push('7 critical providers without a tested exit plan, including Atlas Payroll, ClaimsOne, LedgerLine, SwiftNet'); out.push('Incident notifications: 2 of 4 were late in 12 months; no automated control yet (B-317)'); }
      if (r && r.status === 'submitted') out.push('Submitted: the supervisor may come back with questions within 30 days');
    }
    if (c.id === 'C-2304') {
      const ag = CP.agent('ag-soc-triage');
      const kill = st().find('approvals', 'AP-DR-KILL');
      if (kill && kill.status === 'pending' || (!kill && ag.mode === 'L2' && c.status !== 'closed')) out.push('The SOC Triage Agent is still at ' + ag.mode + ' and can auto-close injected phishing reports');
      if (ag.mode === 'L0') out.push('SOC Triage Agent at L0: about 120 extra alerts a day for analysts until v2.6 ships');
      if (ag.status === 'canary') out.push('v2.6 on a 10% canary at L1: automatic rollback if agreement with analysts drops below 97%');
      if (evs.some((e) => e.stepId === 'dr-5') && !evs.some((e) => e.stepId === 'dr-8')) out.push('3 more injection variants (alt text, calendar invite, PDF metadata) are covered only once v2.6 is in production');
    }
    if (c.manual) out.push('Scope not qualified yet: link the entities involved from the graph');
    return out;
  }
  function answer(c, qid) {
    const evs = thread(c); const inf = info(c); const ds = decisionsOf(c);
    const src = (list) => '<div class="src">Sources:' + list.slice(0, 6).map((e) => '<button class="small" data-action="sel" data-id="' + esc(e.id) + '" data-scroll="1">' + esc(hhmm(e.ts)) + ' ' + esc(e.title.slice(0, 22)) + (e.title.length > 22 ? '…' : '') + '</button>').join('') + '</div>';
    if (!evs.length) return '<p>Nothing recorded yet in this case.</p>';
    if (qid === 'what') {
      const key = evs.filter((e) => ['trigger', 'context', 'action', 'decision', 'lessons'].indexOf(e.phase) >= 0).slice(0, 7);
      return '<p><b>' + esc(c.id) + '</b> was opened ' + esc(c.opened) + ' after: ' + esc(evs[0].title.toLowerCase()) + '. ' + esc(c.summary || '') + '</p><ul>' + key.map((e) => '<li><b class="mono">' + esc(hhmm(e.ts)) + '</b> ' + esc(pname(e.actor)) + ': ' + esc(e.title) + '</li>').join('') + '</ul><p>Status now: <b>' + esc(c.status) + '</b>, ' + evs.length + ' steps in the thread.</p>' + src(key);
    }
    if (qid === 'exposed') {
      const r = residual(c, evs);
      return (r.length ? '<p>Residual exposure, from the case data and the live store:</p><ul>' + r.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '<p>No residual exposure recorded. The case is ' + esc(c.status) + '.</p>') + src(evs.slice(-3));
    }
    if (qid === 'who') {
      const gated = evs.filter((e) => e.gate);
      const auto = evs.filter((e) => CP.agent(e.actor) && (e.level === 'L2' || e.level === 'L3'));
      return (ds.length ? '<ul>' + ds.map((d) => '<li><b>' + esc(d.a.title) + '</b>: ' + (d.a.status === 'pending' ? 'waiting for ' + esc(pname(d.a.decider)) : esc(d.a.status) + ' by ' + esc(pname(d.a.decidedBy || d.a.decider)) + (d.a.decidedAt ? ' at ' + esc(hhmm(d.a.decidedAt)) : '')) + ' · threshold: ' + esc(d.a.threshold || '') + '</li>').join('') + '</ul>' : '<p>No human decision was needed.</p>') +
        '<p>' + auto.length + ' agent action' + (auto.length === 1 ? '' : 's') + ' ran inside their guardrails (L2 or L3) without a human, each with a policy check and a rollback point where something changed.</p>' + src(gated.concat(auto).slice(0, 6));
    }
    if (qid === 'agents') {
      const auto = evs.filter((e) => CP.agent(e.actor) && (e.level === 'L2' || e.level === 'L3'));
      return auto.length ? '<ul>' + auto.map((e) => '<li><b>' + esc(pname(e.actor)) + '</b> (' + esc(e.level) + '): ' + esc(e.title) + '</li>').join('') + '</ul><p>Supervisors were informed for L2 actions; L3 actions are sampled by QA.</p>' + src(auto) : '<p>No autonomous agent action in this case.</p>';
    }
    if (qid === 'improve') {
      const bl = st().get('backlog').filter((b) => (scnOf(c) && b.scenario === scnOf(c).id) || b.case === c.id);
      return '<ul>' + (inf.improve || ['Capture the lessons in case memory when closing.']).map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' + (bl.length ? '<p>Already in the Build backlog: ' + bl.map((b) => '<b class="mono">' + esc(b.id) + '</b> ' + esc(b.title)).join('; ') + '.</p>' : '') + src(evs.filter((e) => e.phase === 'lessons' || e.phase === 'evidence'));
    }
    if (qid === 'ciso') {
      const r = residual(c, evs);
      const acts = evs.filter((e) => e.phase === 'action').slice(0, 4);
      const txt = 'Subject: ' + c.id + ' · ' + c.title + ' · ' + c.status + '\n\n' +
        'What happened\n' + evs[0].title + ' (' + c.opened + '). ' + (c.summary || '') + '\n\n' +
        'What we did\n' + (acts.map((e) => '· ' + hhmm(e.ts) + ' ' + e.title + ' (' + pname(e.actor) + ', ' + e.level + ')').join('\n') || '· Analysis in progress') + '\n\n' +
        'Decisions\n' + (ds.map((d) => '· ' + d.a.title + ': ' + (d.a.status === 'pending' ? 'waiting for ' + pname(d.a.decider) : d.a.status + ' by ' + pname(d.a.decidedBy || d.a.decider))).join('\n') || '· None needed: all actions within guardrails') + '\n\n' +
        'Residual risk\n' + (r.map((x) => '· ' + x).join('\n') || '· None recorded') + '\n\n' +
        'Next\n' + ((inf.improve || [])[0] ? '· ' + inf.improve[0] : '· Close with lessons') + '\n\nCase lead: ' + pname(c.lead || inf.lead || c.owner) + ' · full trail in the case workspace.';
      return '<p>Draft ready, built only from the case data:</p><pre>' + esc(txt) + '</pre><div class="row wrap" style="gap:6px"><button class="small" data-action="copyAnswer">' + I('file') + ' Copy</button></div>' + src(evs.slice(0, 1).concat(acts));
    }
    return '<p>I answer from this case’s data only. Try one of the questions above, for example "What is still exposed?" or "Draft the CISO summary".</p>';
  }
  function askCase(cid, qid, text) {
    const c = getCase(cid); if (!c) return;
    const q = QS.find((x) => x.id === qid);
    const chat = (SCR.ui.chat[cid] = SCR.ui.chat[cid] || []);
    const m = { q: text || (q ? q.q : ''), a: null };
    chat.push(m); SCR.ui._chatBottom = true; CP.render();
    setTimeout(() => { m.a = answer(getCase(cid) || c, qid); SCR.ui._chatBottom = true; if (CP.route.id === 'cases') CP.render(); }, 650);
  }
  function askCard(c) {
    const chat = SCR.ui.chat[c.id] || [];
    const msgs = chat.map((m) => '<div class="cs-msg-q">' + esc(m.q) + '</div>' + (m.a == null ? '<div class="cs-typing" aria-label="Answering"><i></i><i></i><i></i></div>' : '<div class="cs-msg-a">' + m.a + '</div>')).join('');
    const body = '<div class="cs-qs">' + QS.map((q) => '<button class="cs-q" data-action="ask" data-q="' + q.id + '">' + esc(q.q) + '</button>').join('') + '</div>' +
      '<div class="cs-chat" data-scroll="chat" aria-live="polite">' + (msgs || '<div class="empty" style="padding:16px">Ask in plain language. Answers come only from this case: its thread, decisions, store items and evidence, with links to the steps used.</div>') + '</div>' +
      '<div class="cs-askbar"><label class="sr" for="cs-ask-in">Ask the case</label><input id="cs-ask-in" placeholder="Ask about this case…" value="' + esc(SCR.ui.askDraft[c.id] || '') + '" autocomplete="off"><button class="primary" data-action="askSend" aria-label="Send question">' + I('send') + '</button></div>';
    return ui.card(I('sparkles') + ' Ask the case', body, { tour: 'case-ask', sub: 'Scripted assistant grounded on the case data', right: chat.length ? '<button class="small ghost" data-action="askClear">Clear</button>' : '' });
  }

  /* ------------------------------------------------------------------
     Modals
     ------------------------------------------------------------------ */
  function chipOpen(coll, id, cid) {
    if (coll === 'comms') return commModal(cid, id);
    if (coll === 'backlog') return CP.go('build', 'backlog');
    if (coll === 'releases') return CP.go('build', 'pipeline');
    if (coll === 'redteam') return CP.go('trust', 'redteam');
    if (coll === 'deviations' || coll === 'evals') return CP.go('trust', 'deviation');
    if (coll === 'regulatory') return CP.go('engage', 'regulators');
    const it = st().find(coll, id); if (!it) return;
    const kv = Object.keys(it).filter((k) => k[0] !== '_' && typeof it[k] !== 'object').map((k) => '<dt>' + esc(k) + '</dt><dd>' + esc(it[k]) + '</dd>').join('');
    const rb = coll === 'actions' && it.rollback && it.status !== 'rolled-back' && !RO() ? '<button class="danger" data-action="rollback" data-id="' + esc(id) + '">' + I('rollback') + ' Roll back</button>' : '';
    CP.modal(esc(COLL_L[coll] + ' ' + id), '<dl class="kv">' + kv + '</dl>', '<a class="btn-demo" style="background:#fff;border:1px solid var(--line);color:var(--ink)" href="#/run/journal">' + I('list') + ' Action journal</a>' + rb + '<button data-close-modal>Close</button>');
  }
  function evidenceModal(cid, eid) {
    const c = getCase(cid); const evs = thread(c); const x = evidenceOf(c, evs).find((y) => y.id === eid); if (!x) return;
    const h = sha(x.id + x.title);
    const body = '<dl class="kv"><dt>Evidence</dt><dd>' + esc(x.id) + ' · ' + esc(x.type) + '</dd><dt>Collected by</dt><dd>' + ui.who(x.by) + '</dd><dt>When</dt><dd>' + esc(x.ts) + '</dd><dt>Source</dt><dd>' + esc(x.src) + '</dd><dt>SHA-256</dt><dd class="mono" style="word-break:break-all;font-size:12px">' + h + '</dd><dt>Chain of custody</dt><dd>collected → hashed → signed by audit trail → stored in the data lake (WORM, 10 years)</dd>' + (x.ev ? '<dt>Case step</dt><dd>' + esc(x.ev.title) + ' (' + esc(x.ev.ts) + ')</dd>' : '') + '</dl>' +
      (x.artifact ? '<hr class="sep"><div class="cs-out">' + renderArtifact(x.artifact) + '</div>' : x.text ? '<hr class="sep"><p style="margin:0">' + esc(x.text) + '</p>' : '');
    CP.modal(esc(x.title), body, '<button data-close-modal>Close</button>' + (x.ev ? '<button class="primary" data-action="sel" data-id="' + esc(x.ev.id) + '" data-scroll="1">' + I('bot') + ' See the trace</button>' : ''));
  }
  function commModal(cid, mid) {
    const c = getCase(cid); const m = commsOf(c).find((y) => y.id === mid) || st().find('comms', mid); if (!m) return;
    const e = commBody(m);
    CP.modal(esc(m.subject), '<div class="row wrap" style="margin-bottom:12px">' + ui.status(m.status) + '<span class="small-txt muted">' + esc(m.channel) + ' · ' + esc(m.ts) + '</span></div>' + ui.email(e) + '<dl class="kv" style="margin-top:14px"><dt>Drafted by</dt><dd>' + ui.who(m.author) + '</dd><dt>Validated by</dt><dd>' + ui.who(m.validator) + '</dd><dt>Decision right</dt><dd>Any message leaving the group needs a human (threshold: exposure)</dd></dl>', '<button data-close-modal>Close</button>');
  }
  function assignModal(c) {
    const ppl = CP.data.people.filter((p) => ['external', 'business', 'audit'].indexOf(p.team) < 0 || p.id === 'p-hugo');
    const lead = c.lead || info(c).lead;
    CP.modal('Assign ' + esc(c.id), '<div class="cs-form"><label>Agent owner<span class="hint">Works the case inside its autonomy level; the orchestrator re-plans if you change it.</span><select id="cs-as-o"><option value="orchestrator"' + (c.owner === 'orchestrator' ? ' selected' : '') + '>Orchestrator (multi-agent case)</option>' + st().get('agents').map((a) => '<option value="' + a.id + '"' + (c.owner === a.id ? ' selected' : '') + '>' + esc(a.name + ' · ' + CP.domain(a.domain).label + ' · ' + a.mode) + '</option>').join('') + '</select></label>' +
      '<label>Human lead<span class="hint">Accountable for the case, receives its decisions and the SLA alerts.</span><select id="cs-as-l">' + ppl.map((p) => '<option value="' + p.id + '"' + (lead === p.id ? ' selected' : '') + '>' + esc(p.name + ' · ' + p.title) + '</option>').join('') + '</select></label></div>',
    '<button data-close-modal>Cancel</button><button class="primary" data-action="assignSave">' + I('check') + ' Assign</button>');
  }
  function sevModal(c) {
    CP.modal('Change severity of ' + esc(c.id), '<div class="cs-form"><div class="cs-radio">' + ['critical', 'high', 'medium', 'low'].map((v) => '<label><input type="radio" name="cs-sev" value="' + v + '"' + (c.severity === v ? ' checked' : '') + '>' + ui.sev(v) + '</label>').join('') + '</div><div class="small-txt muted">SLA to contain: critical 4 h · high 24 h · medium 5 d · low 15 d. The change is traced in the thread.</div><label>Reason<input id="cs-sev-r" placeholder="Why the severity changes" autocomplete="off"></label></div>',
      '<button data-close-modal>Cancel</button><button class="primary" data-action="severitySave">' + I('check') + ' Apply</button>');
  }
  function escalateModal(c) {
    const opts = [['p-tom', 'Crisis manager · activate the crisis cell'], ['p-elena', 'CISO'], ['p-lucas', 'Business CISO · Payments & Treasury'], ['p-sara', 'DPO · personal data'], ['p-chloe', 'Head of Run · fleet supervision']];
    CP.modal('Escalate ' + esc(c.id), '<div class="cs-form"><label>Escalate to<select id="cs-es-to">' + opts.map((o) => '<option value="' + o[0] + '">' + esc(o[1]) + '</option>').join('') + '</select></label><label>Reason<textarea id="cs-es-r" placeholder="What the person needs to know and decide">' + esc('Severity ' + c.severity + ', ' + (c.summary || '')) + '</textarea></label><label class="chk"><input type="checkbox" id="cs-es-up"' + (SEVO[c.severity] > 1 ? ' checked' : '') + '> Raise severity to high if lower</label></div>',
      '<button data-close-modal>Cancel</button><button class="danger" data-action="escalateSave">' + I('arrowRight') + ' Escalate</button>');
  }
  function closeModal(c) {
    const evs = thread(c); const inf = info(c); const r = residual(c, evs); const p = pendingOf(c);
    const sug = (inf.improve || []).slice(0, 2).join('\n');
    CP.modal('Close ' + esc(c.id) + ' with lessons', (p ? '<div class="notice" style="margin-bottom:12px">' + p + ' decision' + (p > 1 ? 's are' : ' is') + ' still pending. Closing keeps them open in the decider’s inbox.</div>' : '') +
      (r.length ? '<div class="notice info" style="margin-bottom:12px"><b>Residual exposure accepted on closure:</b><ul style="margin:6px 0 0;padding-left:18px">' + r.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></div>' : '') +
      '<div class="cs-form"><label>Root cause<select id="cs-cl-r">' + ['Unpatched third-party product', 'Credential compromise', 'Access governance gap', 'Configuration or lifecycle gap', 'AI agent weakness', 'Human error', 'Supplier weakness', 'Other'].map((x) => '<option>' + esc(x) + '</option>').join('') + '</select></label>' +
      '<label>Lessons<span class="hint">Pre-filled by the platform from the thread. They go to case memory: agents use them on the next similar case.</span><textarea id="cs-cl-l">' + esc(sug) + '</textarea></label>' +
      '<label class="chk"><input type="checkbox" id="cs-cl-b" checked> Send the first lesson to the Build backlog as an improvement</label></div>',
    '<button data-close-modal>Cancel</button><button class="primary" data-action="closeSave">' + I('checkCircle') + ' Close the case</button>');
  }
  function exportModal(c) {
    const evs = thread(c);
    CP.modal('Case file · ' + esc(c.id), '<p style="margin-top:0" class="muted small-txt">Generated from the signed audit trail. Same content for the CISO, the auditor and the regulator.</p><dl class="kv"><dt>Case</dt><dd>' + esc(c.id + ' · ' + c.title) + '</dd><dt>Thread</dt><dd>' + evs.length + ' steps, ' + decisionsOf(c).length + ' decisions, ' + evidenceOf(c, evs).length + ' evidence items</dd><dt>Formats</dt><dd>Signed PDF (' + (8 + evs.length * 2) + ' pages) and JSON trail</dd><dt>Integrity</dt><dd class="mono" style="font-size:12px;word-break:break-all">sha256:' + sha(c.id + evs.length) + '</dd></dl>' +
      ui.code(JSON.stringify({ case: c.id, severity: c.severity, status: c.status, opened: c.opened, steps: evs.slice(0, 3).map((e) => ({ ts: e.ts, actor: e.actor, level: e.level, title: e.title })) }, null, 2) + '\n… ' + Math.max(0, evs.length - 3) + ' more steps', 'json'),
    '<button data-close-modal>Cancel</button><button class="primary" data-action="exportDo">' + I('file') + ' Generate the case file</button>');
  }
  function newCaseModal() {
    const doms = ['soc', 'iam', 'appsec', 'data', 'grc', 'cti'];
    CP.modal('New case', '<div class="cs-form"><label>Title<input id="cs-nc-t" placeholder="e.g. Suspicious OAuth consent on the claims app" autocomplete="off"></label><div><div class="small-txt" style="font-weight:600;margin-bottom:5px">Severity</div><div class="cs-radio">' + ['critical', 'high', 'medium', 'low'].map((v) => '<label><input type="radio" name="cs-nc-s" value="' + v + '"' + (v === 'medium' ? ' checked' : '') + '>' + ui.sev(v) + '</label>').join('') + '</div></div>' +
      '<label>Main domain<select id="cs-nc-d">' + doms.map((d) => '<option value="' + d + '">' + esc(CP.domain(d).label) + '</option>').join('') + '</select></label><label>What do you see?<textarea id="cs-nc-x" placeholder="Entities, times, what triggered your attention. The orchestrator uses it to pick the agent and enrich the case."></textarea></label></div>',
    '<button data-close-modal>Cancel</button><button class="primary" data-action="newCaseSave">' + I('workflow') + ' Open the case</button>');
    setTimeout(() => { const i = document.getElementById('cs-nc-t'); if (i) i.focus(); }, 30);
  }
})();
