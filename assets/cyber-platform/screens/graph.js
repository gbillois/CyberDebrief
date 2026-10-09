/* Cyber AI Platform demo: Graph explorer (module "Graph", id graph-x).
   The shared context of the platform made usable by humans: search with
   typed suggestions, saved questions that run readable graph queries, an
   entity 360 with provenance per attribute, an interactive neighbourhood /
   blast-radius canvas (deterministic radial layout, plain SVG), live overlays
   from the scenarios and a data-quality loop into the Build backlog.
   All entities are fictitious and consistent with data.js and scenarios.js. */
(function () {
  'use strict';
  const CP = window.CP;
  const esc = CP.esc, ui = CP.ui, I = CP.icon;

  CP.css('graph-x', `
.gx{min-width:0}
.gx-ro{display:flex;gap:10px;align-items:center;padding:9px 14px;background:#f2f1f6;border:1px solid var(--line);border-left:3px solid #514c63;font-size:13px;margin-bottom:14px}
.gx-dq{display:grid;grid-template-columns:repeat(4,minmax(0,1fr)) minmax(0,1.6fr);border:1px solid var(--line);background:#fff;margin-bottom:14px}
.gx-dq>div{padding:10px 14px;border-right:1px solid var(--line-2);min-width:0}
.gx-dq>div:last-child{border-right:0;display:flex;flex-direction:column;justify-content:center;gap:6px;background:#fbfafd}
.gx-dq .k{font-size:10.5px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);font-weight:700;display:flex;gap:6px;align-items:center}
.gx-dq .v{font-size:21px;font-weight:650;color:var(--indigo);letter-spacing:-.6px;font-variant-numeric:tabular-nums;line-height:1.25}
.gx-dq .v.warn{color:#8a5a05}
.gx-dq .s{font-size:11.5px;color:var(--muted);line-height:1.35}
.gx-dq .iss{font-size:12.5px;line-height:1.4}
.gx-dq .iss b{font-weight:600}
.gx-search{background:#fff;border:1px solid var(--line);border-top:3px solid var(--indigo);padding:16px 18px;margin-bottom:14px}
.gx-sbox{position:relative}
.gx-sfield{display:flex;align-items:center;border:2px solid var(--indigo);background:#fff;height:48px;padding-left:12px;gap:8px}
.gx-sfield>svg{color:var(--indigo);font-size:18px}
.gx-sfield input{flex:1;border:0;outline:0;font-size:15px;height:100%;min-width:0;background:transparent;color:var(--ink)}
.gx-sfield button{height:100%;min-height:0;border:0;border-left:1px solid var(--line);padding:0 16px}
.gx-sfield kbd{font-family:var(--mono);font-size:11px;border:1px solid var(--line);padding:1px 5px;color:var(--muted)}
.gx-sug{position:absolute;left:0;right:0;top:calc(100% + 2px);background:#fff;border:1px solid var(--line);box-shadow:var(--shadow);z-index:25;max-height:420px;overflow:auto;display:none}
.gx-sug.open{display:block}
.gx-sug .gh{font-size:10.5px;letter-spacing:1.1px;text-transform:uppercase;color:var(--muted);font-weight:700;padding:9px 12px 4px;background:#fbfafd;border-top:1px solid var(--line-2)}
.gx-sug .gh:first-child{border-top:0}
.gx-sug button{display:flex;width:100%;border:0;justify-content:flex-start;text-align:left;font-weight:500;gap:10px;padding:8px 12px;min-height:38px;background:#fff}
.gx-sug button:hover,.gx-sug button.on{background:var(--indigo-50)}
.gx-sug button .sx{display:flex;flex-direction:column;min-width:0;flex:1}
.gx-sug button .sx b{font-weight:600;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gx-sug button .sx small{font-size:11.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gx-sug .ask{color:var(--indigo)}
.gx-ti{width:24px;height:24px;display:inline-grid;place-items:center;flex:none;color:#fff;font-size:13px}
.gx-ti.o{background:#fff!important;border:1.5px solid currentColor}
.gx-filters{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;align-items:center}
.gx-filters .lbl{font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);font-weight:700;margin-right:4px}
.gx-chip{min-height:28px;padding:.25rem .6rem;font-size:12px;font-weight:550;gap:6px}
.gx-chip.on{background:var(--dark);border-color:var(--dark);color:#fff}
.gx-chip i{width:8px;height:8px;display:inline-block}
.gx-saved{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;align-items:center}
.gx-saved .lbl{font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);font-weight:700;margin-right:4px;display:flex;gap:6px;align-items:center}
.gx-q{min-height:30px;padding:.3rem .7rem;font-size:12.5px;font-weight:550;background:var(--indigo-50);border-color:#d9d0f7;color:#2f1590}
.gx-q:hover{background:#e6defd}
.gx-q.on{background:var(--indigo);border-color:var(--indigo);color:#fff}
.gx-q .n{font-family:var(--mono);font-size:10.5px;background:#fff;color:var(--indigo);padding:0 4px;margin-left:2px}
.gx-q.on .n{background:#ffffff26;color:#fff}
.gx-res{background:#fff;border:1px solid var(--line);margin-bottom:14px;display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr)}
.gx-res-q{background:#140b2f;color:#e7e1ff;padding:14px 16px;min-width:0;display:flex;flex-direction:column;gap:10px}
.gx-res-q .h{display:flex;align-items:center;gap:8px;font-size:10.5px;letter-spacing:1.2px;text-transform:uppercase;color:#bdb0dc;font-weight:700}
.gx-res-q .title{font-size:16px;font-weight:650;color:#fff;letter-spacing:-.2px;line-height:1.3}
.gx-res-q pre{margin:0;font-family:var(--mono);font-size:11.5px;line-height:1.65;white-space:pre-wrap;word-break:break-word;color:#e7e1ff}
.gx-res-q pre .k{color:#04f06a;font-weight:600}.gx-res-q pre .s{color:#ffcf7a}.gx-res-q pre .c{color:#8f84b8}.gx-res-q pre .l{color:#9cc3ff}
.gx-res-q .meta{display:flex;gap:6px;flex-wrap:wrap;margin-top:auto}
.gx-res-q .meta span{font-size:11px;font-family:var(--mono);background:#ffffff14;padding:2px 6px;color:#d6cfea}
.gx-res-q .acts{display:flex;gap:6px;flex-wrap:wrap}
.gx-res-r{min-width:0;display:flex;flex-direction:column}
.gx-res-r .rh{display:flex;align-items:center;gap:10px;justify-content:space-between;padding:10px 14px;border-bottom:1px solid var(--line);flex-wrap:wrap}
.gx-res-r .rh b{font-size:14px}
.gx-res-r .note{padding:9px 14px;font-size:12.5px;line-height:1.5;background:#fbfafd;border-bottom:1px solid var(--line-2);color:#3b3550}
.gx-res-r .table-wrap{max-height:300px}
.gx-res-r .t td{padding:8px 12px;font-size:13px}
.gx-res-r .t tr.gx-off td{opacity:.55}
.gx-res-r .empty{margin:14px}
.gx-main{display:grid;grid-template-columns:minmax(0,1fr) 410px;gap:14px;align-items:start}
.gx-cv{background:#fff;border:1px solid var(--line);min-width:0}
.gx-cv-h{display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid var(--line);flex-wrap:wrap}
.gx-cv-h h2{font-size:15px;margin:0;display:flex;align-items:center;gap:8px}
.gx-trail{display:flex;gap:4px;align-items:center;flex-wrap:wrap;font-size:12px;color:var(--muted);min-width:0}
.gx-trail button{min-height:24px;padding:.15rem .45rem;font-size:11.5px;font-weight:550}
.gx-trail button.cur{background:var(--indigo-50);border-color:#cfc3f7;color:var(--indigo)}
.gx-tools{display:flex;gap:8px 14px;flex-wrap:wrap;align-items:center;padding:8px 12px;border-bottom:1px solid var(--line);background:#fbfafd}
.gx-tools .grp{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.gx-tools .lbl{font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);font-weight:700}
.gx-seg{display:inline-flex;border:1px solid var(--line);background:#fff}
.gx-seg button{border:0;min-height:28px;padding:.2rem .6rem;font-size:12px;border-right:1px solid var(--line)}
.gx-seg button:last-child{border-right:0}
.gx-seg button.on{background:var(--dark);color:#fff}
.gx-ef{min-height:26px;padding:.15rem .5rem;font-size:11.5px;font-weight:550;gap:5px;color:var(--muted)}
.gx-ef i{width:14px;height:3px;display:inline-block}
.gx-ef.on{color:var(--ink);background:#fff;border-color:#b8b1cc}
.gx-ef:not(.on) i{opacity:.35}
.gx-tools select{font-size:12.5px;padding:4px 6px;border:1px solid var(--line);background:#fff;max-width:260px;min-height:28px}
.gx-stage{height:600px;overflow:auto;position:relative;background:linear-gradient(#f4f3f8 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,#f4f3f8 1px,transparent 1px) 0 0/24px 24px,#fff;cursor:grab;overscroll-behavior:contain}
.gx-stage.drag{cursor:grabbing}
.gx-stage svg{display:block;user-select:none;-webkit-user-select:none}
.gx-zoom{position:absolute;right:12px;bottom:12px;display:flex;flex-direction:column;border:1px solid var(--line);background:#fff;z-index:3;box-shadow:0 4px 14px #26115418}
.gx-zoom button{border:0;border-bottom:1px solid var(--line);min-height:32px;width:34px;justify-content:center;padding:0;font-size:15px}
.gx-zoom button:last-child{border-bottom:0}
.gx-stage-wrap{position:relative}
.gx-hint{position:absolute;left:12px;bottom:12px;font-size:11px;color:var(--muted);background:#ffffffd9;padding:3px 7px;z-index:3;border:1px solid var(--line-2)}
.gx-n{cursor:pointer;outline:none}
.gx-n .bx{fill:#fff;stroke:var(--c);stroke-width:1.7}
.gx-n .ic{fill:none;stroke:var(--c);stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.gx-n:hover .bx,.gx-n:focus-visible .bx{stroke-width:3.4}
.gx-n:focus-visible .bx{stroke:#9173fa}
.gx-n.center .bx{fill:var(--c)}
.gx-n.center .ic{stroke:#fff}
.gx-n .halo{fill:none;stroke:var(--c);stroke-width:1;opacity:.45;stroke-dasharray:3 3}
.gx-n .lb{font-size:11px;font-weight:600;fill:#201c30;text-anchor:middle;paint-order:stroke;stroke:#fff;stroke-width:3.5px;stroke-linejoin:round}
.gx-n.center .lb{font-size:13px;font-weight:700}
.gx-n .sb{font-size:9.5px;fill:#6d687e;text-anchor:middle;paint-order:stroke;stroke:#fff;stroke-width:3px;pointer-events:none;letter-spacing:.3px;text-transform:uppercase}
.gx-n .bd{stroke:#fff;stroke-width:1.5}
.gx-n .bd.red{fill:#d8412f}.gx-n .bd.amber{fill:#e09a1f}.gx-n .bd.green{fill:#088a42}.gx-n .bd.grey{fill:#8d879d}.gx-n .bd.indigo{fill:#451dc7}.gx-n .bd.dark{fill:#211248}
.gx-n .bdt{font-size:9px;font-weight:800;fill:#fff;text-anchor:middle;pointer-events:none}
.gx-n.red .bd.red{animation:gxBlink 1.4s infinite}
@keyframes gxBlink{50%{opacity:.35}}
.gx-n.fresh .bx{animation:gxFresh 2.4s 2}
@keyframes gxFresh{0%,100%{stroke-width:1.7}50%{stroke-width:6;stroke:#04f06a}}
.gx-n.more .bx{stroke-dasharray:4 3}
.gx-n.dim{opacity:.26}
.gx-e{fill:none;stroke-width:1.5;stroke-linecap:round}
.gx-e.cross{opacity:.32}
.gx-e.st-remediated{opacity:.55}
.gx-e.st-blocked,.gx-e.st-restricted{stroke-dasharray:2 4}
.gx-e.dim{opacity:.12}
.gx-e.path{stroke-width:4;opacity:1;stroke-dasharray:9 6;animation:gxDash .9s linear infinite}
.gx-e.hit{stroke:transparent;stroke-width:12;opacity:1}
@keyframes gxDash{to{stroke-dashoffset:-30}}
.gx-pl{font-size:10px;font-weight:700;fill:#2f1590;text-anchor:middle;paint-order:stroke;stroke:#fff;stroke-width:4px;pointer-events:none}
.gx-legend{display:flex;gap:6px 14px;flex-wrap:wrap;padding:8px 12px;border-top:1px solid var(--line);font-size:11.5px;color:var(--muted);align-items:center}
.gx-legend span{display:inline-flex;align-items:center;gap:5px}
.gx-legend i{width:10px;height:10px;display:inline-block;border:1.5px solid}
.gx-legend em{font-style:normal;display:inline-block;width:9px;height:9px}
.gx-pathbar{display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:8px 12px;background:#f4f1ff;border-bottom:1px solid #d9d0f7;font-size:12.5px}
.gx-pathbar .hop{display:inline-flex;align-items:center;gap:5px;font-weight:600;background:#fff;border:1px solid #d9d0f7;padding:2px 7px}
.gx-pathbar .ar{color:var(--indigo)}
.gx-360{background:#fff;border:1px solid var(--line);border-top:3px solid var(--indigo);min-width:0;max-height:calc(600px + 140px);overflow:auto}
.gx-360-h{padding:14px 16px 12px;border-bottom:1px solid var(--line);position:sticky;top:0;background:#fff;z-index:2}
.gx-360-h .ey{font-size:10.5px;letter-spacing:1.2px;text-transform:uppercase;color:var(--indigo);font-weight:700;display:flex;gap:6px;align-items:center}
.gx-360-h h2{margin:6px 0 2px;font-size:19px;display:flex;align-items:center;gap:10px;word-break:break-word}
.gx-360-h .sub{font-size:12.5px;color:var(--muted);line-height:1.45}
.gx-360-h .tags{display:flex;gap:5px;flex-wrap:wrap;margin-top:8px}
.gx-360-h .acts{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
.gx-sec{padding:12px 16px;border-bottom:1px solid var(--line-2)}
.gx-sec:last-child{border-bottom:0}
.gx-sec h3{font-size:11px;letter-spacing:1.1px;text-transform:uppercase;color:var(--muted);margin:0 0 8px;display:flex;align-items:center;gap:6px;justify-content:space-between}
.gx-sec h3 .c{font-family:var(--mono);background:#eeebf7;color:#51406c;padding:0 5px;font-size:10.5px;letter-spacing:0}
.gx-attr{display:grid;grid-template-columns:minmax(92px,.8fr) minmax(0,1.3fr);gap:2px 10px;padding:6px 0;border-bottom:1px dashed var(--line-2);font-size:12.5px;align-items:start}
.gx-attr:last-child{border-bottom:0}
.gx-attr .ak{color:var(--muted)}
.gx-attr .av2{font-weight:600;line-height:1.4;word-break:break-word}
.gx-attr .pv{grid-column:2;font-size:11px;color:var(--muted);display:flex;gap:5px;align-items:center;flex-wrap:wrap}
.gx-attr .pv .fr{width:7px;height:7px;display:inline-block;background:#088a42}
.gx-attr .pv .fr.ok{background:#8fb8a0}.gx-attr .pv .fr.stale{background:#e09a1f}.gx-attr .pv .fr.live{background:#04f06a;box-shadow:0 0 0 2px #04f06a40}
.gx-attr.live{background:linear-gradient(90deg,#e9fff1,transparent)}
.gx-attr.conf{background:#fffaf0}
.gx-attr .cf{grid-column:1/-1;font-size:11.5px;background:#fff;border:1px solid #f1c27a;padding:6px 8px;margin-top:4px;line-height:1.45}
.gx-attr .cf .row{margin-top:5px}
.gx-rel{display:flex;flex-direction:column;gap:4px}
.gx-rel button{display:flex;width:100%;justify-content:flex-start;text-align:left;gap:8px;font-weight:500;min-height:34px;padding:5px 8px;border-color:var(--line-2)}
.gx-rel button .rx{display:flex;flex-direction:column;min-width:0;flex:1}
.gx-rel button .rx b{font-weight:600;font-size:12.5px;line-height:1.3}
.gx-rel button .rx small{font-size:11px;color:var(--muted);line-height:1.3}
.gx-rel .tag{flex:none}
.gx-act{display:grid;grid-template-columns:auto minmax(0,1fr);gap:8px;padding:7px 0;border-bottom:1px dashed var(--line-2);font-size:12.5px}
.gx-act:last-child{border-bottom:0}
.gx-act .ts{font-family:var(--mono);font-size:11px;color:var(--muted);white-space:nowrap}
.gx-act .m{line-height:1.4}
.gx-act .m small{display:flex;gap:6px;align-items:center;flex-wrap:wrap;color:var(--muted);font-size:11px;margin-top:3px}
.gx-low{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;margin-top:14px}
.gx-log{display:grid}
.gx-log-i{display:grid;grid-template-columns:76px 10px minmax(0,1fr);gap:10px;padding:8px 0;border-bottom:1px solid var(--line-2);font-size:13px;align-items:start}
.gx-log-i:last-child{border-bottom:0}
.gx-log-i .ts{font-family:var(--mono);font-size:11.5px;color:var(--muted);padding-top:1px}
.gx-log-i .d{width:9px;height:9px;margin-top:4px}
.gx-log-i .tx{line-height:1.45}
.gx-log-i .tx small{display:block;color:var(--muted);font-size:11.5px;margin-top:2px}
.gx-log-i.new{animation:newrow 2.4s}
.gx-link{background:none;border:0;padding:0;min-height:0;text-align:left;color:var(--indigo);font-weight:600;text-decoration:underline;text-underline-offset:2px;font-size:inherit;display:inline;cursor:pointer}
.gx-link:hover{background:none}
.gx-qcards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.gx-qc{border:1px solid var(--line);background:#fff;padding:14px 16px;display:flex;flex-direction:column;gap:8px}
.gx-qc .g{font-size:10.5px;letter-spacing:1.1px;text-transform:uppercase;color:var(--muted);font-weight:700;display:flex;justify-content:space-between;gap:8px}
.gx-qc h3{margin:0;font-size:15px;color:var(--indigo);line-height:1.3}
.gx-qc p{margin:0;font-size:12.5px;color:#3b3550;line-height:1.5}
.gx-qc .f{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:auto;padding-top:6px;font-size:12px;color:var(--muted)}
.gx-qc .f .big{font-size:20px;font-weight:650;color:var(--indigo);font-variant-numeric:tabular-nums}
.gx-qc .f .big.red{color:var(--red-ink)}
.gx-qlog .t td{font-size:12.5px;padding:8px 10px;vertical-align:top}
.gx-qlog code{font-family:var(--mono);font-size:11px;color:#3b3550;background:#f7f6fb;padding:2px 5px;display:inline-block;max-width:420px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:middle}
.gx-fresh{display:inline-flex;align-items:center;gap:5px;font-size:12px;white-space:nowrap}
.gx-fresh i{width:8px;height:8px;display:inline-block}
.gx-src{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:600;background:#f1eefb;color:#3a2a86;padding:2px 6px;white-space:nowrap}
.gx-cov{display:grid;gap:9px}
.gx-cov-r{display:grid;grid-template-columns:150px minmax(0,1fr) 54px;gap:10px;align-items:center;font-size:12.5px}
.gx-cov-r .bar{height:12px;background:#eeebf4;position:relative}
.gx-cov-r .bar span{position:absolute;inset:0 auto 0 0;background:var(--c,#451dc7)}
.gx-cov-r .bar em{position:absolute;top:-3px;bottom:-3px;width:2px;background:#201c30}
.gx-cov-r b{text-align:right;font-variant-numeric:tabular-nums}
.gx-types{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.gx-type{border:1px solid var(--line);padding:12px;display:flex;gap:10px;align-items:flex-start;background:#fff}
.gx-type b{display:block;font-size:13.5px}
.gx-type .num{font-size:20px;font-weight:650;color:var(--indigo);letter-spacing:-.4px}
.gx-type small{display:block;color:var(--muted);font-size:11.5px;line-height:1.4;margin-top:2px}
@media(max-width:1280px){.gx-main{grid-template-columns:minmax(0,1fr) 360px}.gx-dq{grid-template-columns:repeat(4,minmax(0,1fr))}.gx-dq>div:last-child{grid-column:1/-1;border-top:1px solid var(--line-2);flex-direction:row;align-items:center;flex-wrap:wrap}.gx-types{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:1100px){.gx-main,.gx-low,.gx-res{grid-template-columns:1fr}.gx-360{max-height:none}.gx-qcards{grid-template-columns:1fr}}
@media(max-width:760px){.gx-dq{grid-template-columns:repeat(2,minmax(0,1fr))}.gx-dq>div:nth-child(2){border-right:0}.gx-dq>div:nth-child(1),.gx-dq>div:nth-child(2){border-bottom:1px solid var(--line-2)}.gx-stage{height:440px}.gx-search{padding:12px}.gx-sfield{height:44px}.gx-sfield kbd{display:none}.gx-sfield button{padding:0 10px}.gx-tools{gap:8px}.gx-tools select{max-width:100%;flex:1}.gx-types{grid-template-columns:1fr}.gx-cov-r{grid-template-columns:100px minmax(0,1fr) 46px}.gx-hint{display:none}.gx-log-i{grid-template-columns:62px 10px minmax(0,1fr)}.gx-res-r .table-wrap{max-height:none}}
`);

  /* ======================================================================
     1. Graph model: entity types, relationship types, sources
     ====================================================================== */
  const T = {
    asset: { label: 'Asset', icon: 'cpu', color: '#2f7de1', g: 'asset' },
    device: { label: 'Device', icon: 'monitor', color: '#5b6b86', g: 'asset' },
    data: { label: 'Data store', icon: 'database', color: '#7a3ff2', g: 'asset' },
    zone: { label: 'Network zone', icon: 'globe', color: '#6d687e', g: 'asset' },
    app: { label: 'Application', icon: 'box', color: '#451dc7', g: 'app' },
    service: { label: 'Business service', icon: 'layers', color: '#088a42', g: 'service' },
    bu: { label: 'Business unit', icon: 'building', color: '#3a3550', g: 'service' },
    supplier: { label: 'Supplier', icon: 'link', color: '#b8770f', g: 'supplier' },
    identity: { label: 'Identity', icon: 'user', color: '#c43d8a', g: 'identity' },
    vuln: { label: 'Vulnerability', icon: 'bug', color: '#d8412f', g: 'vuln' },
    threat: { label: 'Threat actor', icon: 'target', color: '#a4233a', g: 'vuln' },
    ip: { label: 'IP address', icon: 'radar', color: '#a4233a', g: 'vuln' },
    control: { label: 'Control', icon: 'shieldCheck', color: '#1597a5', g: 'control' },
    more: { label: 'Collapsed', icon: 'list', color: '#8d879d', g: 'x' }
  };
  const TYPE_ORDER = ['zone', 'asset', 'device', 'app', 'data', 'service', 'bu', 'supplier', 'identity', 'vuln', 'threat', 'ip', 'control', 'more'];
  const GROUPS = [['all', 'All'], ['asset', 'Assets'], ['identity', 'Identities'], ['app', 'Applications'], ['service', 'Business services'], ['supplier', 'Suppliers'], ['vuln', 'Vulnerabilities'], ['control', 'Controls']];
  const E = {
    net: { label: 'Network path', color: '#6d687e' },
    runs: { label: 'Runs / hosts', color: '#2f7de1' },
    supports: { label: 'Supports / flows', color: '#088a42' },
    access: { label: 'Access', color: '#c43d8a' },
    supplier: { label: 'Supplier link', color: '#b8770f', dash: '6 4' },
    data: { label: 'Data', color: '#7a3ff2' },
    exposure: { label: 'Exposure & threat', color: '#d8412f', dash: '4 3' },
    control: { label: 'Controls', color: '#1597a5', dash: '1 4' }
  };
  const SRC = {
    cmdb: 'CMDB', scan: 'Vulnerability scanner', easm: 'Attack surface scan', edr: 'EDR', idp: 'Identity provider',
    iga: 'Access governance', hr: 'HR system', tprm: 'TPRM inventory', contract: 'Contract repository', waf: 'WAF',
    siem: 'SIEM', fw: 'Firewall config', bia: 'Business impact analysis', cloud: 'Cloud inventory', cti: 'CTI feeds',
    dlp: 'DLP scanner', itsm: 'ITSM', backup: 'Backup console', rating: 'External rating feed', portal: 'Supplier portal',
    pam: 'Privileged access vault', registry: 'Agent registry', agent: 'Agent finding', mail: 'Mail system'
  };
  const CRIT = { critical: 0, high: 1, medium: 2, low: 3 };
  const critTag = (c) => c ? ui.sev(c) : '';

  const A = (k, v, src, age, o) => Object.assign({ k, v, src, age }, o || {});
  const N = (id, type, label, sub, o) => Object.assign({ id, type, label, sub, attrs: [], aliases: '', cases: [], flags: [] }, o || {});
  const L = (s, t, type, label, rel, o) => Object.assign({ s, t, type, label, rel: rel || '' }, o || {});

  /* ---------------- Static entities (baseline of the graph) ---------------- */
  const NODES = [
    N('z-internet', 'zone', 'Internet', 'Untrusted zone', { aliases: 'internet external public' }),
    N('z-quar', 'zone', 'Partner quarantine zone', 'Restricted SFTP segment · inspection on', { aliases: 'quarantine' }),
    N('waf-edge-01', 'asset', 'waf-edge-01', 'WAF cluster · internet edge', { owner: ['Network security', 'cmdb', '3 h'], crit: ['high', 'bia', '12 d'], bu: 'bu-it', aliases: 'waf web application firewall edge',
      attrs: [A('Mode', 'Blocking on 3 published apps', 'waf', '4 min'), A('Throughput', '1,240 req/s (peak 3,900)', 'waf', '4 min'), A('Location', 'Paris DC2 · Frankfurt DC1 (active/active)', 'cmdb', '3 h')], match: 'WAF' }),
    N('fw-partner-01', 'asset', 'fw-partner-01', 'Partner firewall · SFTP flows', { owner: ['Network security', 'cmdb', '3 h'], crit: ['high', 'bia', '12 d'], bu: 'bu-it', aliases: 'firewall sftp partner',
      attrs: [A('Partner flows', '23 SFTP flows, 14 to FileBridge', 'fw', '1 h'), A('Change control', 'All rule changes through ITSM', 'itsm', '1 d')], match: 'Firewall' }),
    N('mft-prd-01', 'asset', 'mft-prd-01', 'Windows server · FileBridge MFT (production)', { owner: ['Payments IT · MFT platform team', 'cmdb', '3 h'], crit: ['critical', 'bia', '12 d'], bu: 'bu-pay', aliases: 'mft filebridge server production prd', match: 'mft-prd-01', cases: ['C-2301'],
      attrs: [
        A('Environment', 'Production', 'cmdb', '3 h'),
        A('Internet-facing', 'Yes · HTTPS 443 published through waf-edge-01', 'easm', '2 h'),
        A('IP address', '10.42.8.21 (DMZ-PARTNER)', 'cmdb', '3 h'),
        A('Operating system', 'Windows Server 2019 · build 17763.6414', 'edr', '6 min'),
        A('FileBridge version', '9.1.3', 'scan', '2 h', { conflict: { v: '9.0.2', src: 'cmdb', age: '41 d', rule: 'Software version: the scanner wins over the CMDB when fresher (precedence rule PR-04)', dq: 'dq-1' } }),
        A('EDR agent', 'Healthy · prevent mode', 'edr', '6 min'),
        A('Backup', 'Daily, immutable copy · last restore test 12 Sep', 'backup', '1 d'),
        A('Last patch', 'September cumulative update (16 Sep)', 'itsm', '27 d')
      ] }),
    N('mft-uat-02', 'asset', 'mft-uat-02', 'Windows server · FileBridge MFT (UAT)', { owner: ['Payments IT · MFT platform team', 'cmdb', '3 h'], crit: ['medium', 'bia', '12 d'], bu: 'bu-pay', aliases: 'mft filebridge uat test', match: 'mft-uat-02', cases: ['C-2301'],
      attrs: [
        A('Environment', 'User acceptance testing', 'cmdb', '3 h'),
        A('Internet-facing', 'No · internal VLAN only', 'easm', '2 h'),
        A('FileBridge version', '9.1.3', 'scan', '2 h'),
        A('Data classification', 'Test data only', 'cmdb', '96 d', { conflict: { v: 'Real data: 1,312 IBANs with names found in /inbound/archive', src: 'dlp', age: '4 d', rule: 'Classification: the most restrictive observed value wins (PR-07)', dq: 'dq-2' } }),
        A('EDR agent', 'Healthy · detect mode', 'edr', '11 min')
      ] }),
    N('payhub-app-01', 'asset', 'payhub-app-01', 'Linux server · Payment hub (production)', { owner: ['Treasury IT', 'cmdb', '3 h'], crit: ['critical', 'bia', '12 d'], bu: 'bu-pay', aliases: 'payment hub server',
      attrs: [A('Environment', 'Production', 'cmdb', '3 h'), A('Operating system', 'Enterprise Linux 9.4', 'edr', '8 min'), A('Internet-facing', 'No', 'easm', '2 h')] }),
    N('swift-gw-01', 'asset', 'swift-gw-01', 'Hardened server · SWIFT gateway', { owner: ['Payments IT', 'cmdb', '3 h'], crit: ['critical', 'bia', '12 d'], bu: 'bu-pay', aliases: 'swift gateway interbank',
      attrs: [A('Environment', 'Production · secure zone', 'cmdb', '3 h'), A('Internet-facing', 'No', 'fw', '1 h', { conflict: { v: 'TCP 443 answered with a banner from 2 external probes', src: 'easm', age: '20 h', rule: 'Exposure: the attack surface scan wins over the firewall config until disproved (PR-02)', dq: 'dq-5' } }), A('Security programme', 'Customer security controls attested (2026)', 'contract', '61 d')] }),
    N('fs-trs-01', 'asset', 'fs-trs-01', 'File server · Treasury share', { owner: ['Workplace IT', 'cmdb', '3 h'], crit: ['high', 'bia', '12 d'], bu: 'bu-pay', aliases: 'file server treasury',
      attrs: [A('Environment', 'Production', 'cmdb', '3 h'), A('Audit logging', 'File access audit on', 'siem', '5 min')] }),
    N('fs-legacy-07', 'asset', 'fs-legacy-07', 'Windows file server · legacy replica', { owner: [null, 'cmdb', '210 d'], crit: ['high', 'agent', '2 d'], bu: 'bu-it', aliases: 'legacy file server',
      attrs: [A('Owner suggestion', 'Group IT · Storage team (71%: change history, subnet)', 'agent', '2 d'), A('Last seen', 'Tue 06:40 · still replicating Treasury share', 'edr', '2 h'), A('Operating system', 'Windows Server 2012 R2 (out of support)', 'edr', '2 h')] }),
    N('srv-bi-114', 'asset', 'srv-bi-114', 'Linux server · BI extracts', { owner: [null, 'cmdb', '140 d'], crit: ['medium', 'agent', '2 d'], bu: 'bu-ins', aliases: 'bi server extracts',
      attrs: [A('Owner suggestion', 'Insurance data office (64%: service accounts, job names)', 'agent', '2 d'), A('Last seen', 'Tue 07:58', 'edr', '1 h')] }),
    N('vm-temp-3321', 'asset', 'vm-temp-3321', 'Cloud VM · public IP', { owner: [null, 'cloud', '1 h'], crit: ['medium', 'agent', '1 d'], bu: 'bu-retail', aliases: 'cloud vm temp rdp',
      attrs: [A('Internet-facing', 'Yes · RDP 3389 open to the internet', 'easm', '3 h'), A('Owner suggestion', 'Digital channels (58%: creator tag, cost centre)', 'agent', '1 d'), A('Created', '41 days ago, tag "temp-test"', 'cloud', '1 h')] }),

    N('app-filebridge', 'app', 'FileBridge MFT', 'Managed file transfer · vendor software', { owner: ['Payments IT · MFT platform team', 'cmdb', '3 h'], crit: ['critical', 'bia', '12 d'], bu: 'bu-pay', aliases: 'filebridge mft managed file transfer fb', match: 'FileBridge|mft-prd-01|W-121', cases: ['C-2301'],
      attrs: [A('Software', 'FileBridge MFT (vendor)', 'cmdb', '3 h'), A('Internal instances', '2 (mft-prd-01, mft-uat-02)', 'scan', '2 h'), A('Supplier instances', '14 suppliers run it to exchange files with us', 'tprm', '1 d'), A('Daily transfers', '3,400 files · 61 GB', 'siem', '15 min')] }),
    N('app-payhub', 'app', 'Payment hub', 'Payment orchestration · in-house', { owner: ['Treasury IT', 'cmdb', '3 h'], crit: ['critical', 'bia', '12 d'], bu: 'bu-pay', aliases: 'payment hub payments', match: 'Payment hub|payments', cases: ['C-2302'],
      attrs: [A('Daily volume', '€2.1 bn · 18,400 payments', 'siem', '15 min'), A('Approval model', '4-eyes above €250k', 'iga', '1 d'), A('Users', '64 (41 operators, 9 approvers, 14 read-only)', 'iga', '1 d')] }),
    N('app-swift', 'app', 'SWIFT gateway', 'Interbank messaging', { owner: ['Payments IT', 'cmdb', '3 h'], crit: ['critical', 'bia', '12 d'], bu: 'bu-pay', aliases: 'swift gateway interbank messaging', match: 'SWIFT',
      attrs: [A('Messages per day', '9,300', 'siem', '15 min'), A('Service bureau', 'SwiftNet Bureau', 'contract', '12 d')] }),
    N('app-trs-share', 'app', 'Treasury file share', 'Collaboration · file sharing', { owner: ['Treasury desk', 'cmdb', '3 h'], crit: ['high', 'bia', '12 d'], bu: 'bu-pay', aliases: 'treasury share file', match: 'Treasury',
      attrs: [A('Folders', '212 · 3 hold personal data', 'dlp', '4 h'), A('External sharing', 'Disabled', 'dlp', '4 h')] }),
    N('app-mail', 'app', 'Mail & calendar', 'Collaboration suite', { owner: ['Workplace IT', 'cmdb', '3 h'], crit: ['high', 'bia', '12 d'], bu: 'bu-it', aliases: 'mail email mailbox calendar', match: 'Mail|mailbox|inbox|emails', cases: ['C-2291'],
      attrs: [A('Mailboxes', '38,600', 'mail', '1 h'), A('Inbox rules to external', '0 allowed (blocked by policy)', 'mail', '1 h')] }),
    N('app-cash', 'app', 'Cash management SaaS', 'SaaS · liquidity', { owner: ['Treasury desk', 'cmdb', '3 h'], crit: ['high', 'bia', '12 d'], bu: 'bu-pay', aliases: 'cash management saas liquidity' }),
    N('app-fxdeal', 'app', 'FX dealing SaaS', 'SaaS · foreign exchange', { owner: ['Treasury desk', 'cmdb', '3 h'], crit: ['high', 'bia', '12 d'], bu: 'bu-pay', aliases: 'fx dealing saas' }),
    N('app-bankportal', 'app', 'Bank connectivity portal', 'SaaS · correspondent banks', { owner: ['Treasury IT', 'cmdb', '3 h'], crit: ['high', 'bia', '12 d'], bu: 'bu-pay', aliases: 'bank portal connectivity' }),
    N('app-payroll', 'app', 'Payroll interface', 'Outbound HR and payroll files', { owner: ['HR IT', 'cmdb', '3 h'], crit: ['critical', 'bia', '12 d'], bu: 'bu-it', aliases: 'payroll interface hr' }),
    N('app-claims', 'app', 'Claims platform', 'Insurance claims', { owner: ['Insurance IT', 'cmdb', '3 h', { conflict: { v: 'Claims digital squad (94% of changes in 90 days)', src: 'itsm', age: '1 d', rule: 'Owner: the CMDB is authoritative; ITSM evidence opens a review (PR-01)', dq: 'dq-6' } }], crit: ['critical', 'bia', '12 d'], bu: 'bu-ins', aliases: 'claims platform insurance' }),
    N('app-cards', 'app', 'Card processing', 'Card issuing & authorisation', { owner: ['Retail IT', 'cmdb', '3 h'], crit: ['critical', 'bia', '12 d'], bu: 'bu-retail', aliases: 'cards card processing' }),
    N('app-core', 'app', 'Core banking', 'Accounts & balances (vendor core)', { owner: ['Core banking IT', 'cmdb', '3 h'], crit: ['critical', 'bia', '12 d'], bu: 'bu-retail', aliases: 'core banking ledger' }),
    N('app-broker', 'app', 'Broker portal', 'Web portal for insurance brokers', { owner: ['Insurance IT', 'cmdb', '3 h'], crit: ['high', 'bia', '12 d'], bu: 'bu-ins', aliases: 'broker portal api', match: 'broker portal|Broker portal', cases: ['C-2288'] }),
    N('app-mobile', 'app', 'Mobile banking API', 'Digital channel backend', { owner: ['Digital channels', 'cmdb', '3 h'], crit: ['critical', 'bia', '12 d'], bu: 'bu-retail', aliases: 'mobile banking api app', match: 'Mobile' }),
    N('app-lc', 'app', 'Trade finance', 'Letters of credit', { owner: ['CIB IT', 'cmdb', '3 h'], crit: ['high', 'bia', '12 d'], bu: 'bu-cib', aliases: 'trade finance letters of credit lc', cases: ['C-2284'] }),
    N('app-siem', 'app', 'SIEM', 'Security analytics', { owner: ['SOC', 'cmdb', '3 h'], crit: ['high', 'bia', '12 d'], bu: 'bu-it', aliases: 'siem security analytics' }),
    N('app-edr', 'app', 'EDR console', 'Endpoint detection & response', { owner: ['SOC', 'cmdb', '3 h'], crit: ['high', 'bia', '12 d'], bu: 'bu-it', aliases: 'edr endpoint' }),

    N('data-benef', 'data', 'Treasury · Beneficiaries', 'Folder · 1,200 IBANs with names', { owner: ['Treasury desk', 'dlp', '4 h'], crit: ['high', 'dlp', '4 h'], bu: 'bu-pay', aliases: 'beneficiaries iban treasury personal data', cases: ['C-2302'],
      attrs: [A('Personal data', 'Yes · names and IBANs (GDPR)', 'dlp', '4 h'), A('Records', '1,200', 'dlp', '4 h')] }),
    N('data-payroll', 'data', 'Payroll files', 'Payroll & HR data of 38k staff', { owner: ['HR', 'dlp', '6 h'], crit: ['critical', 'dlp', '6 h'], bu: 'bu-it', aliases: 'payroll data hr staff', attrs: [A('Personal data', 'Yes · salaries, bank details, national IDs', 'dlp', '6 h')] }),
    N('data-cardtx', 'data', 'Card transactions', 'Daily settlement files', { owner: ['Retail IT', 'dlp', '6 h'], crit: ['critical', 'dlp', '6 h'], bu: 'bu-retail', aliases: 'card transactions settlement', attrs: [A('Regulated data', 'Card data (tokenised PAN)', 'dlp', '6 h')] }),
    N('data-mftstore', 'data', 'MFT transfer store', 'Files in transit · 7-day retention', { owner: ['Payments IT · MFT platform team', 'cmdb', '3 h'], crit: ['high', 'dlp', '6 h'], bu: 'bu-pay', aliases: 'mft store transfer', attrs: [A('Volume', '61 GB/day, 7-day retention', 'siem', '15 min')] }),

    N('svc-sfx', 'service', 'Supplier file exchange', 'Business service · files with 14 suppliers', { owner: ['Payments & Treasury (COO)', 'bia', '12 d'], crit: ['critical', 'bia', '12 d'], bu: 'bu-pay', aliases: 'supplier file exchange sfx', cases: ['C-2301'],
      attrs: [A('DORA critical function', 'Supports card payments and payroll', 'bia', '12 d'), A('RTO / RPO', '4 h / 1 h', 'bia', '12 d'), A('Daily transfers', '3,400 files', 'siem', '15 min')] }),
    N('svc-payments', 'service', 'Outgoing payments', 'Business service · €2.1 bn a day', { owner: ['Head of Treasury', 'bia', '12 d'], crit: ['critical', 'bia', '12 d'], bu: 'bu-pay', aliases: 'outgoing payments', attrs: [A('DORA critical function', 'Yes', 'bia', '12 d'), A('RTO / RPO', '2 h / 0', 'bia', '12 d')] }),
    N('svc-cards', 'service', 'Card payments', 'Business service · 4.8 M cards', { owner: ['Retail Banking (COO)', 'bia', '12 d'], crit: ['critical', 'bia', '12 d'], bu: 'bu-retail', aliases: 'card payments', attrs: [A('DORA critical function', 'Yes', 'bia', '12 d')] }),
    N('svc-payroll', 'service', 'Staff payroll', 'Business service · 38k staff', { owner: ['Group HR', 'bia', '12 d'], crit: ['critical', 'bia', '12 d'], bu: 'bu-it', aliases: 'staff payroll', attrs: [A('DORA critical function', 'No (internal) · high impact', 'bia', '12 d')] }),
    N('svc-claims', 'service', 'Claims handling', 'Business service · 2,300 claims a day', { owner: ['Insurance (COO)', 'bia', '12 d'], crit: ['critical', 'bia', '12 d'], bu: 'bu-ins', aliases: 'claims handling' }),
    N('svc-cash', 'service', 'Treasury & liquidity', 'Business service', { owner: ['Head of Treasury', 'bia', '12 d'], crit: ['critical', 'bia', '12 d'], bu: 'bu-pay', aliases: 'treasury liquidity cash' }),
    N('svc-tradefin', 'service', 'Trade finance', 'Business service', { owner: ['CIB (COO)', 'bia', '12 d'], crit: ['high', 'bia', '12 d'], bu: 'bu-cib', aliases: 'trade finance service' }),
    N('svc-broker', 'service', 'Broker distribution', 'Business service', { owner: ['Insurance (COO)', 'bia', '12 d'], crit: ['high', 'bia', '12 d'], bu: 'bu-ins', aliases: 'broker distribution' }),
    N('svc-mobile', 'service', 'Mobile banking', 'Business service · 2.9 M users', { owner: ['Retail Banking (COO)', 'bia', '12 d'], crit: ['critical', 'bia', '12 d'], bu: 'bu-retail', aliases: 'mobile banking' }),
    N('svc-statements', 'service', 'Client statements & archiving', 'Business service', { owner: ['Retail Banking (COO)', 'bia', '12 d'], crit: ['high', 'bia', '12 d'], bu: 'bu-retail', aliases: 'statements archiving' }),

    N('id-top17', 'identity', 't.op-17', 'Human · Treasury operator, payment approver', { kind: 'human', owner: ['Treasury desk (manager: Head of Treasury)', 'hr', '1 d'], crit: ['critical', 'iga', '1 d'], bu: 'bu-pay', aliases: 't.op-17 top17 treasury operator approver account', match: 't\\.op-17|payment approver', cases: ['C-2302', 'C-2284'],
      attrs: [
        A('Account type', 'Human · employee', 'hr', '1 d'),
        A('Role', 'Payment approver (up to €5 M), Payment hub', 'iga', '1 d'),
        A('Entitlements', 'beneficiary.create · payment.approve · swift.approve', 'iga', '1 d'),
        A('MFA method', 'Push notification, no number matching', 'idp', '14 min'),
        A('Manager', 'Treasury desk lead', 'hr', '1 d', { conflict: { v: 'Payments operations manager', src: 'idp', age: '9 d', rule: 'Manager: the HR system is authoritative (PR-03)', dq: 'dq-3' } }),
        A('Peer group', '41 Treasury operators', 'iga', '1 d'),
        A('Last sign-in', 'Tue 18:02 · Paris · compliant laptop', 'idp', '9 h'),
        A('Account status', 'Active', 'idp', '14 min')
      ] }),
    N('id-top04', 'identity', 't.op-04', 'Human · Treasury operator', { kind: 'human', owner: ['Treasury desk', 'hr', '1 d'], crit: ['high', 'iga', '1 d'], bu: 'bu-pay', aliases: 't.op-04', attrs: [A('Entitlements', 'beneficiary.create · payment.approve', 'iga', '1 d')] }),
    N('id-top22', 'identity', 't.op-22', 'Human · Treasury operator', { kind: 'human', owner: ['Treasury desk', 'hr', '1 d'], crit: ['high', 'iga', '1 d'], bu: 'bu-pay', aliases: 't.op-22', attrs: [A('Entitlements', 'beneficiary.create · payment.approve', 'iga', '1 d')] }),
    N('id-tsup02', 'identity', 't.sup-02', 'Human · Treasury supervisor', { kind: 'human', owner: ['Treasury desk', 'hr', '1 d'], crit: ['high', 'iga', '1 d'], bu: 'bu-pay', aliases: 't.sup-02', attrs: [A('Entitlements', 'beneficiary.approve · payment.release', 'iga', '1 d')] }),
    N('id-top31', 'identity', 't.op-31', 'Human · Treasury operator', { kind: 'human', owner: ['Treasury desk', 'hr', '1 d'], crit: ['high', 'iga', '1 d'], bu: 'bu-pay', aliases: 't.op-31', attrs: [A('Entitlements', 'beneficiary.create · payment.approve', 'iga', '1 d')] }),
    N('id-tctl05', 'identity', 't.ctl-05', 'Human · Treasury controller', { kind: 'human', owner: ['Treasury control', 'hr', '1 d'], crit: ['high', 'iga', '1 d'], bu: 'bu-pay', aliases: 't.ctl-05', attrs: [A('Entitlements', 'payment.approve · reconciliation.override', 'iga', '1 d')] }),
    N('id-svc-mft', 'identity', 'svc-filebridge', 'Non-human · service account', { kind: 'service', owner: ['Payments IT · MFT platform team', 'iga', '1 d'], crit: ['high', 'iga', '1 d'], bu: 'bu-pay', aliases: 'svc-filebridge service account',
      attrs: [A('Account type', 'Service account · password vaulted, rotated 30 d', 'pam', '2 h'), A('Privilege', 'Local administrator on mft-prd-01', 'iga', '1 d'), A('Interactive logon', 'Denied by policy', 'idp', '14 min')] }),
    N('id-adm-mft', 'identity', 'MFT administrators', 'Privileged group · 4 members', { kind: 'group', owner: ['Payments IT · MFT platform team', 'iga', '1 d'], crit: ['critical', 'iga', '1 d'], bu: 'bu-pay', aliases: 'mft administrators admin group',
      attrs: [A('Members', '4 administrators (all with phishing-resistant MFA)', 'iga', '1 d'), A('Access path', 'Through the privileged access vault only', 'pam', '2 h')] }),
    N('id-ag-triage', 'identity', 'SOC Triage Agent', 'Non-human · AI agent identity', { kind: 'agent', agent: 'ag-soc-triage', owner: ['Agent product owner (Build · SOC)', 'registry', '1 h'], crit: ['high', 'registry', '1 h'], bu: 'bu-it', aliases: 'soc triage agent ai', match: 'SOC Triage|closures|benign', cases: ['C-2304'] }),
    N('id-ag-waf', 'identity', 'WAF Tuning Agent', 'Non-human · AI agent identity', { kind: 'agent', agent: 'ag-as-waf', owner: ['Agent developer (Build · AppSec)', 'registry', '1 h'], crit: ['high', 'registry', '1 h'], bu: 'bu-it', aliases: 'waf tuning agent ai', match: 'WAF' }),
    N('id-ag-vuln', 'identity', 'VulnOps Agent', 'Non-human · AI agent identity', { kind: 'agent', agent: 'ag-vuln', owner: ['Agent developer (Build · SOC)', 'registry', '1 h'], crit: ['high', 'registry', '1 h'], bu: 'bu-it', aliases: 'vulnops agent ai patch', match: 'patch|CHG' }),
    N('id-ag-iam', 'identity', 'Identity Response Agent', 'Non-human · AI agent identity', { kind: 'agent', agent: 'ag-iam-resp', owner: ['Agent product owner (Build · SOC)', 'registry', '1 h'], crit: ['high', 'registry', '1 h'], bu: 'bu-it', aliases: 'identity response agent ai', match: 'Revoked|Suspended|inbox rule|credentials' }),

    N('cve-31120', 'vuln', 'CVE-2026-31120', 'XML library in Payment hub · CVSS 6.5', { crit: ['medium', 'scan', '2 h'], aliases: 'cve-2026-31120',
      attrs: [A('CVSS', '6.5 · not exploited in the wild', 'cti', '1 d'), A('Remediation', 'Fix in release 4.12, change window Sat 17 Oct', 'itsm', '1 d')] }),
    N('cve-29204', 'vuln', 'CVE-2026-29204', 'TLS library in Broker portal · CVSS 7.4', { crit: ['high', 'scan', '2 h'], aliases: 'cve-2026-29204',
      attrs: [A('CVSS', '7.4 · proof of concept public, no exploitation seen', 'cti', '1 d'), A('Remediation', 'Library upgrade in progress (sprint 41)', 'itsm', '1 d')] }),

    N('ctl-edr', 'control', 'EDR prevent mode', 'Endpoint protection on servers', { owner: ['SOC', 'cmdb', '3 h'], crit: ['high', 'bia', '30 d'], aliases: 'edr control', attrs: [A('Coverage', '98.7% of Windows and Linux servers', 'edr', '6 min'), A('Last test', 'RT-55 adversary emulation: detected', 'agent', '3 w')] }),
    N('ctl-pam', 'control', 'Privileged access vault', 'Session brokering for admins', { owner: ['IAM', 'cmdb', '3 h'], crit: ['high', 'bia', '30 d'], aliases: 'pam vault privileged', attrs: [A('Coverage', '1,812 privileged accounts vaulted', 'pam', '2 h')] }),
    N('ctl-mfa', 'control', 'Conditional access · MFA', 'Push MFA for staff, phishing-resistant for admins', { owner: ['IAM', 'cmdb', '3 h'], crit: ['high', 'bia', '30 d'], aliases: 'mfa conditional access', attrs: [A('Gap', '312 finance staff still on push MFA', 'idp', '1 h')] }),
    N('ctl-sod', 'control', 'Segregation of duties · payments', 'Create and approve must be split', { owner: ['Treasury control', 'iga', '1 d'], crit: ['high', 'bia', '30 d'], aliases: 'sod segregation duties toxic', cases: ['C-2284'], attrs: [A('Test result', 'Failing · 6 Treasury identities combine create and approve', 'iga', '1 d')] }),
    N('ctl-backup', 'control', 'Immutable backup', 'Daily immutable copies', { owner: ['Group IT · Storage team', 'cmdb', '3 h'], crit: ['high', 'bia', '30 d'], aliases: 'backup immutable', attrs: [A('Restore test', 'Passed 12 Sep (RTO 3 h 10)', 'backup', '27 d')] }),
    N('ctl-dlp', 'control', 'DLP · personal data', 'Labels and blocks external sharing', { owner: ['Data protection', 'cmdb', '3 h'], crit: ['high', 'bia', '30 d'], aliases: 'dlp data loss', attrs: [A('Coverage', 'Collaboration suite and file shares', 'dlp', '4 h')] })
  ];

  const EDGES = [
    L('z-internet', 'waf-edge-01', 'net', 'routes HTTPS to', 'ROUTES_TO'),
    L('waf-edge-01', 'mft-prd-01', 'net', 'publishes (HTTPS 443)', 'ROUTES_TO'),
    L('waf-edge-01', 'app-broker', 'net', 'publishes', 'ROUTES_TO'),
    L('waf-edge-01', 'app-mobile', 'net', 'publishes', 'ROUTES_TO'),
    L('z-internet', 'fw-partner-01', 'net', 'SFTP from partner IPs', 'ROUTES_TO'),
    L('fw-partner-01', 'mft-prd-01', 'net', 'SFTP 22', 'ROUTES_TO'),
    L('fw-partner-01', 'z-quar', 'net', 'segments', 'ROUTES_TO'),
    L('z-internet', 'vm-temp-3321', 'net', 'public IP · RDP 3389', 'ROUTES_TO'),
    L('mft-prd-01', 'app-filebridge', 'runs', 'runs FileBridge (prod)', 'RUNS'),
    L('mft-uat-02', 'app-filebridge', 'runs', 'runs FileBridge (test)', 'RUNS'),
    L('payhub-app-01', 'app-payhub', 'runs', 'hosts', 'RUNS'),
    L('swift-gw-01', 'app-swift', 'runs', 'hosts', 'RUNS'),
    L('fs-trs-01', 'app-trs-share', 'runs', 'hosts', 'RUNS'),
    L('fs-legacy-07', 'app-trs-share', 'runs', 'legacy replica of', 'RUNS'),
    L('mft-prd-01', 'svc-sfx', 'supports', 'delivers', 'SUPPORTS'),
    L('app-filebridge', 'svc-sfx', 'supports', 'supports', 'SUPPORTS'),
    L('app-payhub', 'svc-payments', 'supports', 'supports', 'SUPPORTS'),
    L('app-swift', 'svc-payments', 'supports', 'supports', 'SUPPORTS'),
    L('app-payhub', 'app-swift', 'supports', 'sends payment messages to', 'FLOWS_TO'),
    L('app-cash', 'svc-cash', 'supports', 'supports', 'SUPPORTS'),
    L('app-fxdeal', 'svc-cash', 'supports', 'supports', 'SUPPORTS'),
    L('app-bankportal', 'svc-cash', 'supports', 'supports', 'SUPPORTS'),
    L('app-trs-share', 'svc-cash', 'supports', 'supports', 'SUPPORTS'),
    L('app-payroll', 'svc-payroll', 'supports', 'supports', 'SUPPORTS'),
    L('app-claims', 'svc-claims', 'supports', 'supports', 'SUPPORTS'),
    L('app-cards', 'svc-cards', 'supports', 'supports', 'SUPPORTS'),
    L('app-core', 'svc-mobile', 'supports', 'supports', 'SUPPORTS'),
    L('app-mobile', 'svc-mobile', 'supports', 'supports', 'SUPPORTS'),
    L('app-broker', 'svc-broker', 'supports', 'supports', 'SUPPORTS'),
    L('app-lc', 'svc-tradefin', 'supports', 'supports', 'SUPPORTS'),
    L('app-payroll', 'app-filebridge', 'supports', 'sends payroll files through', 'FLOWS_TO'),
    L('app-cards', 'app-filebridge', 'supports', 'sends settlement files through', 'FLOWS_TO'),
    L('app-claims', 'app-filebridge', 'supports', 'exchanges claims files through', 'FLOWS_TO'),
    L('srv-bi-114', 'app-claims', 'supports', 'extracts from', 'FLOWS_TO'),
    L('svc-sfx', 'bu-pay', 'supports', 'belongs to', 'BELONGS_TO'), L('svc-payments', 'bu-pay', 'supports', 'belongs to', 'BELONGS_TO'),
    L('svc-cash', 'bu-pay', 'supports', 'belongs to', 'BELONGS_TO'), L('svc-cards', 'bu-retail', 'supports', 'belongs to', 'BELONGS_TO'),
    L('svc-mobile', 'bu-retail', 'supports', 'belongs to', 'BELONGS_TO'), L('svc-statements', 'bu-retail', 'supports', 'belongs to', 'BELONGS_TO'),
    L('svc-payroll', 'bu-it', 'supports', 'belongs to', 'BELONGS_TO'), L('svc-claims', 'bu-ins', 'supports', 'belongs to', 'BELONGS_TO'),
    L('svc-broker', 'bu-ins', 'supports', 'belongs to', 'BELONGS_TO'), L('svc-tradefin', 'bu-cib', 'supports', 'belongs to', 'BELONGS_TO'),
    L('mft-prd-01', 'data-mftstore', 'data', 'stores', 'STORES'),
    L('app-trs-share', 'data-benef', 'data', 'stores', 'STORES'),
    L('app-payroll', 'data-payroll', 'data', 'produces', 'STORES'),
    L('app-cards', 'data-cardtx', 'data', 'produces', 'STORES'),
    L('id-top17', 'app-payhub', 'access', 'approver (≤ €5 M) · creates beneficiaries', 'HAS_ACCESS', { priv: 'approve' }),
    L('id-top17', 'app-swift', 'access', 'read & approve', 'HAS_ACCESS', { priv: 'approve' }),
    L('id-top17', 'app-trs-share', 'access', 'read / write', 'HAS_ACCESS', { priv: 'write' }),
    L('id-top17', 'app-mail', 'access', 'mailbox (payment confirmations)', 'HAS_ACCESS', { priv: 'owner' }),
    L('id-top17', 'app-cash', 'access', 'user', 'HAS_ACCESS', { priv: 'user' }),
    L('id-top17', 'app-fxdeal', 'access', 'user', 'HAS_ACCESS', { priv: 'user' }),
    L('id-top17', 'app-bankportal', 'access', 'user', 'HAS_ACCESS', { priv: 'user' }),
    L('id-top04', 'app-payhub', 'access', 'creates and approves beneficiaries', 'HAS_ACCESS', { priv: 'approve' }),
    L('id-top22', 'app-payhub', 'access', 'creates and approves beneficiaries', 'HAS_ACCESS', { priv: 'approve' }),
    L('id-tsup02', 'app-payhub', 'access', 'approves beneficiaries, releases payments', 'HAS_ACCESS', { priv: 'approve' }),
    L('id-top31', 'app-payhub', 'access', 'creates and approves beneficiaries', 'HAS_ACCESS', { priv: 'approve' }),
    L('id-tctl05', 'app-payhub', 'access', 'approves, overrides reconciliation', 'HAS_ACCESS', { priv: 'approve' }),
    L('id-svc-mft', 'mft-prd-01', 'access', 'service account · local admin', 'HAS_ACCESS', { priv: 'admin' }),
    L('id-adm-mft', 'mft-prd-01', 'access', 'administrators', 'HAS_ACCESS', { priv: 'admin' }),
    L('id-adm-mft', 'mft-uat-02', 'access', 'administrators', 'HAS_ACCESS', { priv: 'admin' }),
    L('id-ag-triage', 'app-siem', 'access', 'reads alerts, updates cases', 'HAS_ACCESS', { priv: 'write' }),
    L('id-ag-triage', 'app-mail', 'access', 'reads reported phishing, quarantines', 'HAS_ACCESS', { priv: 'write' }),
    L('id-ag-triage', 'app-edr', 'access', 'queries endpoints', 'HAS_ACCESS', { priv: 'read' }),
    L('id-ag-waf', 'waf-edge-01', 'access', 'writes rules (L2, sandbox replay first)', 'HAS_ACCESS', { priv: 'write' }),
    L('id-ag-vuln', 'mft-prd-01', 'access', 'patches through ITSM change (L1)', 'HAS_ACCESS', { priv: 'change' }),
    L('id-ag-vuln', 'payhub-app-01', 'access', 'patches through ITSM change (L1)', 'HAS_ACCESS', { priv: 'change' }),
    L('id-ag-iam', 'app-mail', 'access', 'manages inbox rules (L2)', 'HAS_ACCESS', { priv: 'write' }),
    L('cve-31120', 'app-payhub', 'exposure', 'affects (patch Sat)', 'AFFECTED_BY'),
    L('cve-29204', 'app-broker', 'exposure', 'affects (upgrade in progress)', 'AFFECTED_BY'),
    L('mft-prd-01', 'ctl-edr', 'control', 'protected by', 'PROTECTED_BY'),
    L('mft-uat-02', 'ctl-edr', 'control', 'protected by', 'PROTECTED_BY'),
    L('payhub-app-01', 'ctl-edr', 'control', 'protected by', 'PROTECTED_BY'),
    L('swift-gw-01', 'ctl-edr', 'control', 'protected by', 'PROTECTED_BY'),
    L('mft-prd-01', 'ctl-backup', 'control', 'backed up by', 'PROTECTED_BY'),
    L('id-adm-mft', 'ctl-pam', 'control', 'brokered by', 'PROTECTED_BY'),
    L('id-svc-mft', 'ctl-pam', 'control', 'vaulted in', 'PROTECTED_BY'),
    L('id-top17', 'ctl-mfa', 'control', 'push MFA', 'PROTECTED_BY'),
    L('app-payhub', 'ctl-sod', 'control', 'SoD rule (failing)', 'PROTECTED_BY'),
    L('data-benef', 'ctl-dlp', 'control', 'labelled by', 'PROTECTED_BY'),
    L('data-payroll', 'ctl-dlp', 'control', 'labelled by', 'PROTECTED_BY')
  ];

  /* Supplier links to services (by store id). */
  const SUP_LINKS = {
    'tp-paycore': [['svc-cards', 'processes card payments for'], ['svc-payments', 'clears payments for'], ['data-cardtx', 'receives']],
    'tp-atlas': [['svc-payroll', 'runs payroll for'], ['data-payroll', 'processes']],
    'tp-claimsone': [['svc-claims', 'hosts claims SaaS for']],
    'tp-ledger': [['app-core', 'vendor of']],
    'tp-nimbus': [['app-core', 'hosts'], ['app-mobile', 'hosts']],
    'tp-swiftnet': [['app-swift', 'service bureau for']],
    'tp-medassist': [['svc-claims', 'health assistance for']],
    'tp-kyc': [['svc-mobile', 'verifies identities for']],
    'tp-docusafe': [['svc-statements', 'archives for']],
    'tp-insight': [['bu-ins', 'analytics for'], ['srv-bi-114', 'receives extracts from']],
    'tp-actuary': [['bu-ins', 'actuarial models for']],
    'tp-broker': [['svc-broker', 'platform for']],
    'tp-callwave': [['svc-mobile', 'contact centre for']],
    'tp-hrcloud': [['svc-payroll', 'HR records for']],
    'tp-printhub': [['svc-statements', 'prints for']],
    'tp-fleet': [['bu-it', 'leasing for']],
    'tp-lexis': [['bu-cib', 'legal counsel for']],
    'tp-taxpro': [['bu-am', 'tax reporting for']],
    'tp-mailo': [['bu-retail', 'marketing email for']],
    'tp-shred': [['bu-it', 'secure destruction for']]
  };
  const SUP_CASES = { 'tp-lexis': ['C-2279'] };

  /* Detections / WAF rules from the store mapped to graph targets. */
  const CTL_TARGETS = {
    'D-412': ['id-top17', 'id-adm-mft'], 'D-409': ['app-mail'], 'D-401': ['payhub-app-01', 'swift-gw-01'], 'D-397': ['app-trs-share'],
    'D-418': ['mft-prd-01', 'mft-uat-02'], 'W-118': ['app-broker'], 'W-112': ['app-mobile'], 'W-121': ['mft-prd-01']
  };

  /* ======================================================================
     2. Live state read from the store (scenarios S1 to S4)
     ====================================================================== */
  function liveState() {
    const f = (c, id) => CP.store.find(c, id);
    const tr = (id) => CP.store.find('traces', 'tr-' + id);
    const hold = f('approvals', 'AP-ID-HOLD');
    return {
      s1: f('cases', 'C-2301'), w121: f('wafRules', 'W-121'), d418: f('detections', 'D-418'), fx: f('forensics', 'FX-71'),
      patched: f('actions', 'A-9836'), answers: tr('cti-10'), atlasQ: f('actions', 'A-9851'), lab: f('redteam', 'RT-61'),
      s2: f('cases', 'C-2302'), revoked: f('actions', 'A-9870'), rule: f('actions', 'A-9871'), spray: f('actions', 'A-9874'),
      data: tr('id-6'), suspended: f('actions', 'A-9877'), released: hold && hold.status === 'rejected', toxic: f('backlog', 'B-315'),
      gaps: CP.store.get('thirdParties').filter((t) => t.gap), s3: f('cases', 'C-2303'),
      dv: f('deviations', 'DV-34'), kill: f('actions', 'A-9890'), rel: f('releases', 'REL-79'), triage: CP.agent('ag-soc-triage'),
      tr
    };
  }
  const tsOf = (st, item, stepId, fb) => (item && item.ts) || ((st.tr(stepId) || {}).ts) || fb || '';

  /* ======================================================================
     3. Build the graph (static baseline + store + live overlays)
     ====================================================================== */
  function build() {
    const st = liveState();
    const nodes = {}; const edges = [];
    const add = (n) => { nodes[n.id] = n; return n; };
    const link = (s, t, type, label, rel, o) => edges.push(L(s, t, type, label, rel, o));
    const flag = (id, cls, text) => { const n = nodes[id]; if (n) n.flags.push({ cls, text }); };
    const setA = (id, k, v, src, ts, o) => {
      const n = nodes[id]; if (!n) return;
      const a = Object.assign({ k, v, src, age: ts, live: true }, o || {});
      const i = n.attrs.findIndex((x) => x.k === k);
      if (i >= 0) n.attrs[i] = a; else n.attrs.push(a);
    };

    NODES.forEach((n) => {
      const c = Object.assign({}, n, { flags: [], cases: n.cases.slice() });
      const pre = [];
      if (n.owner) pre.push(A('Owner', n.owner[0] || 'Unknown', n.owner[1], n.owner[2], Object.assign({ unknown: !n.owner[0] }, n.owner[3] || {})));
      if (n.crit) pre.push(A('Criticality', n.crit[0][0].toUpperCase() + n.crit[0].slice(1), n.crit[1], n.crit[2]));
      c.attrs = pre.concat(n.attrs.map((a) => Object.assign({}, a)));
      c.critLevel = n.crit ? n.crit[0] : null;
      c.ownerName = n.owner ? n.owner[0] : null;
      add(c);
      if (n.owner && !n.owner[0]) c.flags.push({ cls: 'grey', text: 'No accountable owner' });
    });
    EDGES.forEach((e) => edges.push(Object.assign({}, e)));

    /* Business units */
    CP.store.get('businessUnits').forEach((b) => {
      add(N(b.id, 'bu', b.name, 'Business unit · ' + CP.fmt(b.apps) + ' applications', {
        aliases: b.name.toLowerCase() + ' business unit', critLevel: null, ownerName: 'Business CISO',
        attrs: [A('Business CISO', (CP.person(b.biso) || {}).name || 'Business CISO', 'hr', '1 d'), A('Risk score', String(b.riskScore) + ' / 100', 'agent', '1 d'), A('Top risks', b.topRisks.join(' · '), 'agent', '1 d'), A('Applications', CP.fmt(b.apps), 'cmdb', '3 h')]
      }));
      nodes[b.id].flags = []; nodes[b.id].cases = [];
    });

    /* Suppliers (live from the store) */
    const tps = CP.store.get('thirdParties');
    tps.forEach((t) => {
      const fb = (t.products || []).map((p) => (p.match(/FileBridge MFT ([\d.]+)/) || [])[1]).filter(Boolean)[0];
      const q = t.questionnaire || {};
      const bu = { 'tp-paycore': 'bu-pay', 'tp-atlas': 'bu-it', 'tp-claimsone': 'bu-ins', 'tp-medassist': 'bu-ins', 'tp-insight': 'bu-ins', 'tp-actuary': 'bu-ins', 'tp-broker': 'bu-ins', 'tp-swiftnet': 'bu-pay', 'tp-lexis': 'bu-cib', 'tp-taxpro': 'bu-am' }[t.id] || (t.id === 'tp-ledger' || t.id === 'tp-kyc' || t.id === 'tp-callwave' || t.id === 'tp-printhub' || t.id === 'tp-docusafe' || t.id === 'tp-mailo' ? 'bu-retail' : 'bu-it');
      const buName = (CP.store.find('businessUnits', bu) || {}).name || '';
      const n = add(N(t.id, 'supplier', t.name, t.service + ' · ' + t.country, {
        aliases: t.name.toLowerCase() + ' ' + t.service.toLowerCase() + ' supplier third party ' + (t.products || []).join(' ').toLowerCase(),
        critLevel: t.criticality, ownerName: buName + ' (business owner)', bu, supplier: t, match: t.name.split(' ')[0], cases: (SUP_CASES[t.id] || []).slice(), flags: [],
        attrs: [
          A('Owner', buName + ' (business owner) · TPRM: third-party risk lead', 'contract', '12 d'),
          A('Criticality', t.criticality[0].toUpperCase() + t.criticality.slice(1) + (t.critFunction ? ' · supports a critical function (DORA)' : ''), 'tprm', '1 d'),
          A('Data shared', t.dataShared || 'n/a', 'contract', '12 d'),
          A('Security score', String(t.score) + ' / 100', 'rating', '6 h', t.score < 65 ? { cls: 'warn' } : null),
          A('Exit plan', t.gap ? 'Exists, not tested (gap)' : (t.exitPlan ? 'Documented and tested (2026)' : 'None documented'), t.gap ? 'agent' : 'contract', t.gap ? tsOf(st, null, 'rg-4', 'Mon 09:25') : '12 d', t.gap ? { live: true, cls: 'warn' } : (!t.exitPlan && t.criticality === 'critical' ? { cls: 'warn' } : null)),
          A('Sub-contractors', String(t.subcontractors) + ' declared', 'tprm', '1 d'),
          A('Last assessment', t.lastAssessment, 'tprm', '1 d')
        ]
      }));
      if (fb) {
        let ver = fb, src = 'tprm', age = '1 d', live = false;
        if (q.status === 'answered') { ver = '9.1.4 (patched, IoC search negative)'; src = 'portal'; age = tsOf(st, null, 'cti-10', 'Tue 12:42'); live = true; }
        if (q.status === 'flagged') { ver = fb + ' (still vulnerable, patch planned Friday)'; src = 'portal'; age = tsOf(st, null, 'cti-10', 'Tue 12:42'); live = true; }
        n.attrs.splice(3, 0, A('FileBridge version', ver, src, age, Object.assign({ live }, t.id === 'tp-atlas' && !live ? { conflict: { v: '9.0 (contract annex, 2025)', src: 'contract', age: '210 d', rule: 'Supplier software: latest TPRM attestation wins over contract annexes (PR-05)', dq: 'dq-4' } } : {})));
        n.fb = fb;
        const restricted = t.id === 'tp-atlas' && st.atlasQ;
        link(t.id, 'app-filebridge', 'supplier', 'runs FileBridge ' + fb + ' (supplier side)', 'RUNS', restricted ? { state: 'restricted' } : null);
        link('svc-sfx', t.id, 'supplier', restricted ? 'file exchange restricted (quarantine)' : 'file exchange partner', 'EXCHANGES_WITH', restricted ? { state: 'restricted' } : null);
      }
      if (q.status && q.status !== 'none') {
        const lab = { draft: 'Questionnaire drafted', sent: 'Questionnaire sent ' + (q.sentAt || ''), answered: 'Answered: ' + (q.answer || ''), flagged: 'Flagged: ' + (q.answer || ''), overdue: 'No answer (overdue)', awaiting: 'Awaiting validation' }[q.status] || q.status;
        n.attrs.push(A('Questionnaire', (q.campaign ? q.campaign + ' · ' : '') + lab, 'portal', q.status === 'draft' ? tsOf(st, null, 'cti-7', 'Tue 08:57') : tsOf(st, null, q.status === 'sent' ? 'cti-7' : 'cti-10', ''), { live: true }));
        if (q.status === 'flagged') flag(t.id, 'red', 'Still vulnerable (FileBridge ' + fb + ')');
        else if (q.status === 'overdue') flag(t.id, 'amber', 'No answer to CVE questionnaire');
        else if (q.status === 'answered') flag(t.id, 'green', 'Patched, confirmed by the supplier');
        else if (q.status === 'sent' || q.status === 'draft') flag(t.id, 'indigo', 'CVE questionnaire ' + q.status);
        if (q.campaign) n.cases.push('C-2301');
      }
      if (t.gap) { flag(t.id, 'amber', 'Exit plan not tested'); n.cases.push('C-2303'); }
      else if (!t.exitPlan && t.criticality === 'critical') n.noExit = true;
      if (t.id === 'tp-atlas' && st.atlasQ) { link('tp-atlas', 'z-quar', 'net', 'SFTP flow moved here (' + st.atlasQ.ts + ')', 'ROUTES_TO', { state: 'restricted' }); setA('tp-atlas', 'Network flow', 'SFTP flow restricted to the quarantine zone (A-9851)', 'agent', st.atlasQ.ts, { cls: 'warn' }); }
      (SUP_LINKS[t.id] || []).forEach((l) => link(t.id, l[0], 'supplier', l[1], 'PROVIDES'));
    });

    /* Controls from the store */
    const ctl = (item, kind) => {
      const tg = CTL_TARGETS[item.id]; if (!tg) return;
      const id = 'ctl-' + item.id;
      const n = add(N(id, 'control', item.id + ' · ' + (kind === 'waf' ? 'WAF rule' : 'Detection'), item.name, {
        aliases: item.id.toLowerCase() + ' ' + item.name.toLowerCase() + (kind === 'waf' ? ' waf rule virtual patch' : ' detection rule siem'), critLevel: null, ownerName: 'SOC', flags: [], cases: item.scenario === 'cti' ? ['C-2301'] : [],
        attrs: kind === 'waf'
          ? [A('Rule', item.name, 'waf', '4 min'), A('Mode', item.mode === 'block' ? 'Blocking' : item.mode, 'waf', '4 min'), A('False positives', item.fp, 'waf', '4 min'), A('Author', CP.actor(item.author).name, 'registry', '1 h')]
          : [A('Detection', item.name, 'siem', '5 min'), A('Platform', item.platform, 'siem', '5 min'), A('Backtest', item.backtest, 'siem', '5 min'), A('MITRE ATT&CK', (item.mitre || []).join(', '), 'siem', '5 min'), A('Author', CP.actor(item.author).name, 'registry', '1 h')]
      }));
      if (item.scenario) { n.attrs.forEach((a) => { a.live = true; a.age = kind === 'waf' ? tsOf(st, st.w121 && CP.store.find('actions', 'A-9830'), 'cti-4', 'Tue 08:48') : tsOf(st, null, 'cti-5', 'Tue 08:51'); }); n.fresh = CP.store.isNew(item, 6000); }
      tg.forEach((t) => link(t, id, 'control', kind === 'waf' ? 'virtual patch / rule' : 'monitored by', kind === 'waf' ? 'PROTECTED_BY' : 'MONITORED_BY'));
      if (kind === 'waf') link('waf-edge-01', id, 'control', 'enforces', 'ENFORCES');
    };
    CP.store.get('wafRules').forEach((w) => ctl(w, 'waf'));
    CP.store.get('detections').forEach((d) => ctl(d, 'det'));

    /* Agent identities: state from the agent registry */
    ['id-ag-triage', 'id-ag-waf', 'id-ag-vuln', 'id-ag-iam'].forEach((id) => {
      const n = nodes[id]; const ag = CP.agent(n.agent); if (!ag) return;
      n.attrs.push(A('Autonomy level', ag.mode + ' · ' + ((CP.data.autonomy.find((x) => x.id === ag.mode) || {}).short || ''), 'registry', '1 h'), A('Version', ag.version + ' · ' + ag.model, 'registry', '1 h'), A('Status', ag.status, 'registry', '1 h'), A('Tools granted', (ag.tools || []).join(', '), 'registry', '1 h'), A('Supervisor', (CP.person(ag.supervisor) || {}).name || '', 'registry', '1 h'));
    });

    /* ----- S1 overlay: CVE-2026-41877 on FileBridge ----- */
    if (st.s1) {
      const t0 = st.s1.opened || 'Tue 08:42';
      add(N('cve-41877', 'vuln', 'CVE-2026-41877', 'FileBridge MFT < 9.1.4 · pre-auth upload · CVSS 9.8', {
        critLevel: 'critical', aliases: 'cve-2026-41877 41877 filebridge zero-day', cases: ['C-2301'], flags: [], fresh: CP.store.isNew(st.s1, 6000), match: 'CVE-2026-41877|W-121|D-418',
        attrs: [A('CVSS', '9.8 · pre-authentication', 'cti', t0, { live: true }), A('Exploited in the wild', 'Yes · COBALT LYNX (ransomware)', 'cti', t0, { live: true, cls: 'warn' }), A('Fixed in', 'FileBridge 9.1.4', 'cti', t0, { live: true }), A('Advisory', 'National CERT + financial ISAC', 'cti', t0, { live: true }), A('ATT&CK', 'T1190 · T1505.003 · T1567.002', 'cti', t0, { live: true })]
      }));
      add(N('th-lynx', 'threat', 'COBALT LYNX', 'Ransomware group · targets EU banks and insurers', {
        critLevel: 'critical', aliases: 'cobalt lynx ransomware threat actor', cases: ['C-2301'], flags: [{ cls: 'red', text: 'Active campaign' }],
        attrs: [A('Motivation', 'Extortion (data theft, then encryption)', 'cti', t0, { live: true }), A('Known IoCs', '3 IPs, 2 domains, 1 web shell hash', 'cti', t0, { live: true })]
      }));
      link('th-lynx', 'cve-41877', 'exposure', 'exploits', 'EXPLOITS');
      const open = !st.patched;
      link('mft-prd-01', 'cve-41877', 'exposure', open ? (st.w121 ? 'vulnerable 9.1.3 · mitigated by W-121' : 'vulnerable 9.1.3 · internet-facing') : 'remediated (9.1.4)', 'AFFECTED_BY', open ? null : { state: 'remediated' });
      link('mft-uat-02', 'cve-41877', 'exposure', 'vulnerable 9.1.3 · internal only', 'AFFECTED_BY');
      link('app-filebridge', 'cve-41877', 'exposure', 'versions < 9.1.4 affected', 'AFFECTED_BY');
      tps.filter((t) => t.fileBridge).forEach((t) => {
        const q = (t.questionnaire || {}).status;
        link(t.id, 'cve-41877', 'exposure', q === 'answered' ? 'remediated (supplier answer)' : q === 'flagged' ? 'still vulnerable' : q === 'overdue' ? 'unconfirmed (no answer)' : 'presumed vulnerable', 'AFFECTED_BY', q === 'answered' ? { state: 'remediated' } : null);
      });
      if (st.patched) {
        flag('mft-prd-01', 'green', 'Patched: FileBridge 9.1.4');
        setA('mft-prd-01', 'FileBridge version', '9.1.4 (emergency change CHG-88412)', 'itsm', st.patched.ts, { conflict: null });
        setA('mft-prd-01', 'Exposure', 'CVE-2026-41877 remediated; W-121 kept 7 days as defence in depth', 'agent', st.patched.ts, { cls: 'ok' });
      } else if (st.w121) {
        flag('mft-prd-01', 'amber', 'Mitigated: virtual patch W-121');
        setA('mft-prd-01', 'Exposure', 'Exploited CVE, internet-facing · mitigated by W-121 (blocking)', 'agent', tsOf(st, CP.store.find('actions', 'A-9830'), 'cti-4', 'Tue 08:48'), { cls: 'warn' });
      } else {
        flag('mft-prd-01', 'red', 'Exposed: exploited CVE, internet-facing');
        setA('mft-prd-01', 'Exposure', 'CVE-2026-41877 exploited in the wild · reachable from the internet', 'agent', tsOf(st, null, 'cti-2', 'Tue 08:43'), { cls: 'warn' });
      }
      flag('mft-uat-02', 'amber', 'Vulnerable 9.1.3 (internal only)');
      flag('cve-41877', st.patched ? 'amber' : 'red', st.patched ? 'Open on mft-uat-02 and suppliers' : 'Exploited · ' + (st.w121 ? 'mitigated' : 'exposed'));
      flag('app-filebridge', st.patched ? 'amber' : 'red', st.patched ? 'Production patched, test pending' : 'Exploited CVE');
      if (st.fx) setA('mft-prd-01', 'Forensic verdict', st.fx.verdict + ' · ' + st.fx.findings, 'agent', tsOf(st, null, 'cti-6', 'Tue 08:56'), { by: 'ag-soc-forensic' });
      if (st.lab) setA('mft-prd-01', 'Adversary lab', 'COBALT LYNX chain replayed: WAF blocked, D-418 fired in 38 s', 'agent', st.lab.date);
      if (st.d418) {
        add(N('ip-probe', 'ip', '45.155.204.9', 'COBALT LYNX indicator · probe on 10 Oct 03:12', { critLevel: 'high', aliases: '45.155.204.9 ip indicator probe', cases: ['C-2301'], flags: [{ cls: 'red', text: 'Known indicator' }],
          attrs: [A('Seen', '2026-10-10 03:12 · POST /api/v2/transfer/upload → HTTP 404', 'siem', tsOf(st, null, 'cti-5', 'Tue 08:51'), { live: true }), A('Blocked', st.w121 ? 'Yes, by W-121 source list' : 'No', 'waf', tsOf(st, null, 'cti-5', 'Tue 08:51'), { live: true })] }));
        link('ip-probe', 'mft-prd-01', 'exposure', 'probed 10 Oct 03:12 (HTTP 404)', 'PROBED');
        link('th-lynx', 'ip-probe', 'exposure', 'operates', 'USES');
      }
    }

    /* ----- S2 overlay: t.op-17 compromised ----- */
    if (st.s2) {
      const t0 = st.s2.opened || 'Wed 02:13';
      add(N('dev-s2', 'device', 'Unknown device', 'Not enrolled · first seen Wed 02:12', { critLevel: 'high', aliases: 'unknown device attacker', cases: ['C-2302'], flags: [st.revoked ? { cls: 'grey', text: 'Blocked' } : { cls: 'red', text: 'Attacker device' }],
        attrs: [A('Compliance', 'Not compliant · not enrolled', 'idp', t0, { live: true }), A('Location', 'Country never seen for this account', 'idp', t0, { live: true }), A('Status', st.revoked ? 'Blocked (' + st.revoked.ts + ')' : 'Signed in', 'idp', st.revoked ? st.revoked.ts : t0, { live: true })] }));
      add(N('ip-s2', 'ip', '198.51.100.23', 'Hosting provider · password spray source', { critLevel: 'high', aliases: '198.51.100.23 ip attacker spray', cases: ['C-2302'], flags: [st.spray ? { cls: 'grey', text: 'Blocked' } : { cls: 'red', text: 'Malicious IP' }],
        attrs: [A('Reputation', 'Hosting provider, 2 abuse reports', 'cti', t0, { live: true }), A('Status', st.spray ? 'Blocked at proxy and identity provider (' + st.spray.ts + ')' : 'Active', 'agent', st.spray ? st.spray.ts : t0, { live: true })] }));
      link('id-top17', 'dev-s2', 'exposure', 'signed in from (23 MFA pushes, 1 approved)', 'SIGNED_IN_FROM', st.revoked ? { state: 'blocked' } : null);
      link('dev-s2', 'ip-s2', 'net', 'connected from', 'CONNECTED_FROM', st.spray ? { state: 'blocked' } : null);
      if (st.spray) ['id-top04', 'id-top22', 'id-tsup02', 'id-top31'].forEach((id) => { link('ip-s2', id, 'exposure', 'password spray (failed)', 'ATTEMPTED', { state: 'blocked' }); flag(id, 'amber', 'MFA re-registration forced'); nodes[id].cases.push('C-2302'); });
      if (st.data) {
        link('id-top17', 'data-benef', 'data', 'downloaded 37 files (02:14 to 02:15)', 'ACCESSED');
        flag('data-benef', 'red', '37 files downloaded before revocation');
        setA('data-benef', 'Exposure', '37 files downloaded by t.op-17 between 02:14 and 02:15 (1,200 IBANs) · GDPR 72 h clock', 'agent', st.data.ts, { by: 'ag-dt-dlp', cls: 'warn' });
      }
      if (st.suspended) {
        flag('id-top17', 'dark', 'Suspended · payments held');
        setA('id-top17', 'Account status', 'Suspended until supervised re-onboarding; 3 payments held (€4.2 M)', 'agent', st.suspended.ts, { by: 'ag-iam-resp' });
        setA('app-payhub', 'Held payments', '3 payments (€4.2 M) held by Treasury decision', 'agent', st.suspended.ts);
      } else if (st.revoked) {
        flag('id-top17', 'amber', st.released ? 'Sessions revoked · payments released' : 'Sessions revoked');
        setA('id-top17', 'Account status', 'Sessions and tokens revoked, re-authentication forced', 'agent', st.revoked.ts, { by: 'ag-iam-resp' });
      } else {
        flag('id-top17', 'red', 'High-risk sign-in (MFA fatigue)');
        setA('id-top17', 'Account status', 'Active · high-risk sign-in under triage', 'idp', t0);
      }
      setA('id-top17', 'Last sign-in', 'Wed 02:12 · unknown device, new country', 'idp', t0, { cls: 'warn' });
      if (st.rule) setA('id-top17', 'Inbox rules', 'Rule hiding payment-hub emails deleted (evidence kept)', 'agent', st.rule.ts, { by: 'ag-iam-resp' });
    }
    if (st.toxic) setA('ctl-sod', 'Review', '27 create-and-approve combinations under review (Treasury and Trade Finance)', 'agent', tsOf(st, null, 'id-9', 'Wed 03:13'), { by: 'ag-iam-review' });

    /* ----- S4 overlay: SOC Triage Agent ----- */
    if (st.triage) {
      const ag = st.triage;
      if (st.dv && st.dv.status !== 'closed' && ag.mode === 'L2') flag('id-ag-triage', 'red', 'Deviation: auto-close +23 pts');
      else if (ag.mode === 'L0') flag('id-ag-triage', 'amber', 'Kill-switch: suggest-only (L0)');
      else if (ag.status === 'canary') flag('id-ag-triage', 'indigo', 'Canary v' + ag.version + ' at ' + ag.mode);
      else if (st.dv && st.dv.status === 'closed') flag('id-ag-triage', 'green', 'Restored to L2 after canary');
      if (st.dv) setA('id-ag-triage', 'Deviation', st.dv.signal + ' (' + st.dv.status + ')', 'agent', st.dv.detected, { by: 'deviation' });
      if (st.kill) setA('id-ag-triage', 'Kill-switch', 'Lowered from L2 to L0 by the Run supervisor', 'registry', st.kill.ts);
    }
    flag('ctl-sod', 'amber', 'Failing: 6 combinations');

    /* Adjacency (undirected) */
    const adj = {};
    edges.forEach((e, i) => {
      e.i = i;
      if (!nodes[e.s] || !nodes[e.t]) return;
      (adj[e.s] = adj[e.s] || []).push({ to: e.t, e });
      (adj[e.t] = adj[e.t] || []).push({ to: e.s, e });
    });
    return { nodes, edges, adj, st };
  }

  /* ======================================================================
     4. Helpers: severity of a node, search, paths
     ====================================================================== */
  const SEV = { red: 0, dark: 1, amber: 2, indigo: 3, grey: 4, green: 5 };
  const topFlag = (n) => (n.flags || []).slice().sort((a, b) => SEV[a.cls] - SEV[b.cls])[0];
  const rankNode = (n) => TYPE_ORDER.indexOf(n.type) * 10 + (CRIT[n.critLevel] != null ? CRIT[n.critLevel] : 5);
  const tIcon = (n) => n.type === 'identity' ? (n.kind === 'agent' ? 'bot' : n.kind === 'group' ? 'users' : n.kind === 'service' ? 'key' : 'user') : T[n.type].icon;
  const tLabel = (n) => n.type === 'identity' ? (n.kind === 'agent' ? 'Agent identity' : n.kind === 'service' ? 'Service account' : n.kind === 'group' ? 'Privileged group' : 'Human identity') : T[n.type].label;
  const tBadge = (n, o) => '<span class="gx-ti' + (o ? ' o' : '') + '" style="' + (o ? 'color:' : 'background:') + T[n.type].color + '" aria-hidden="true">' + I(tIcon(n)) + '</span>';

  function search(G, text, group) {
    const q = String(text || '').trim().toLowerCase();
    if (!q) return [];
    const words = q.split(/\s+/).filter(Boolean);
    const out = [];
    Object.keys(G.nodes).forEach((id) => {
      const n = G.nodes[id];
      if (group && group !== 'all' && T[n.type].g !== group) return;
      const lab = n.label.toLowerCase(), hay = (n.label + ' ' + n.sub + ' ' + (n.aliases || '') + ' ' + id).toLowerCase();
      let s = 0;
      if (lab === q || id === q) s = 100; else if (lab.indexOf(q) === 0) s = 80; else if (lab.indexOf(q) >= 0) s = 64; else if ((n.aliases || '').indexOf(q) >= 0) s = 52;
      else if (words.every((w) => hay.indexOf(w) >= 0)) s = 36; else if (words.some((w) => w.length > 3 && hay.indexOf(w) >= 0)) s = 14;
      if (s) out.push({ n, s: s - rankNode(n) / 100 + (n.type === 'more' ? -50 : 0) });
    });
    return out.sort((a, b) => b.s - a.s).map((x) => x.n);
  }

  function shortestPath(G, from, to, skip) {
    if (!G.nodes[from] || !G.nodes[to]) return null;
    const prev = {}; prev[from] = null; const q = [from];
    while (q.length) {
      const u = q.shift(); if (u === to) break;
      (G.adj[u] || []).forEach((x) => { if (skip && skip.indexOf(x.e.type) >= 0) return; if (!(x.to in prev)) { prev[x.to] = u; q.push(x.to); } });
    }
    if (!(to in prev)) return null;
    const p = []; let c = to; while (c != null) { p.unshift(c); c = prev[c]; }
    return p;
  }
  const edgeBetween = (G, a, b) => (G.adj[a] || []).find((x) => x.to === b);

  /* Preset paths (only offered when all their nodes exist). */
  const PATHS = [
    { id: 'p-inet-paycore', label: 'Internet → WAF → mft-prd-01 → supplier file exchange → PayCore', center: 'mft-prd-01', nodes: ['z-internet', 'waf-edge-01', 'mft-prd-01', 'svc-sfx', 'tp-paycore'] },
    { id: 'p-lynx-cards', label: 'COBALT LYNX → CVE → mft-prd-01 → PayCore → card payments', center: 'mft-prd-01', nodes: ['th-lynx', 'cve-41877', 'mft-prd-01', 'svc-sfx', 'tp-paycore', 'svc-cards'] },
    { id: 'p-inet-payroll', label: 'Internet → partner firewall → mft-prd-01 → FileBridge → Atlas Payroll → payroll files', center: 'mft-prd-01', nodes: ['z-internet', 'fw-partner-01', 'mft-prd-01', 'app-filebridge', 'tp-atlas', 'data-payroll'] },
    { id: 'p-top17-swift', label: 't.op-17 → Payment hub → SWIFT gateway → outgoing payments', center: 'id-top17', nodes: ['id-top17', 'app-payhub', 'app-swift', 'svc-payments'] },
    { id: 'p-dev-benef', label: 'Attacker IP → device → t.op-17 → Treasury · Beneficiaries', center: 'id-top17', nodes: ['ip-s2', 'dev-s2', 'id-top17', 'data-benef'] },
    { id: 'p-agent-mail', label: 'SOC Triage Agent → mail → t.op-17 mailbox', center: 'id-ag-triage', nodes: ['id-ag-triage', 'app-mail', 'id-top17'] }
  ];
  const JEWELS = ['svc-payments', 'svc-cards', 'svc-payroll', 'svc-claims', 'svc-sfx', 'svc-cash', 'svc-mobile', 'data-benef', 'data-payroll', 'data-cardtx', 'app-swift', 'tp-paycore'];

  function pathFor(G, key, center) {
    if (!key) return null;
    if (key.indexOf('to:') === 0) {
      const to = key.slice(3);
      const p = shortestPath(G, center, to, ['control']);
      return p && p.length > 1 ? { id: key, label: G.nodes[center].label + ' → ' + G.nodes[to].label, nodes: p, center } : null;
    }
    const pr = PATHS.find((x) => x.id === key);
    if (!pr || !pr.nodes.every((id) => G.nodes[id])) return null;
    for (let i = 1; i < pr.nodes.length; i++) if (!edgeBetween(G, pr.nodes[i - 1], pr.nodes[i])) return null;
    return pr;
  }

  /* ======================================================================
     5. Saved questions and query templates
     ====================================================================== */
  const QS = [
    { id: 'q-runs-fb', text: 'Who runs FileBridge?', group: 'Exposure', desc: 'Every server and supplier running the file-transfer product, with owners and versions. The first question asked when an advisory names a product.', tpl: 'runs', arg: 'app-filebridge', keys: ['who runs filebridge', 'filebridge users'] },
    { id: 'q-reach-top17', text: 'What can account t.op-17 reach?', group: 'Identity', desc: 'Applications, data and business services an identity can reach in 3 hops, with privilege. Turns an identity alert into business impact.', tpl: 'reach', arg: 'id-top17', keys: ['what can t.op-17 reach', 't.op-17 reach'] },
    { id: 'q-exit', text: 'Critical suppliers without a tested exit plan', group: 'Third parties', desc: 'DORA Art. 28: critical ICT providers whose exit plan is missing or untested, with the services they support.', tpl: 'exit', keys: ['exit plan', 'without exit'] },
    { id: 'q-inet', text: 'Internet-facing servers with exploited CVEs', group: 'Exposure', desc: 'Servers reachable from the internet with a vulnerability exploited in the wild, the exposure path and the controls in front.', tpl: 'inet', keys: ['internet-facing', 'internet facing', 'exploited cve'] },
    { id: 'q-toxic', text: 'Toxic access combinations in Treasury', group: 'Identity', desc: 'Identities that can both create a beneficiary and approve a payment in the Payment hub: the root cause of a payment fraud.', tpl: 'toxic', keys: ['toxic', 'segregation'] },
    { id: 'q-blast', text: 'Blast radius of mft-prd-01', group: 'Exposure', desc: 'Everything within 3 hops of the server: business services, suppliers, data and identities that would be hit if it were compromised.', tpl: 'blast', arg: 'mft-prd-01', keys: ['blast radius of mft-prd-01'] },
    { id: 'q-agent', text: 'What can the SOC Triage Agent touch?', group: 'Agents', desc: 'Agents are identities in the graph too: what a non-human identity can read or change, at which autonomy level.', tpl: 'reach', arg: 'id-ag-triage', keys: ['soc triage agent touch', 'agent touch'] },
    { id: 'q-noowner', text: 'Assets without a known owner', group: 'Data quality', desc: 'Assets with no accountable owner, with the owner the platform suggests and the evidence behind it.', tpl: 'noowner', keys: ['without owner', 'no owner', 'unknown owner'] }
  ];
  const qById = (id) => QS.find((q) => q.id === id);

  const lnk = (G, id, txt) => G.nodes[id] ? '<button class="gx-link" data-action="pick" data-id="' + esc(id) + '">' + esc(txt || G.nodes[id].label) + '</button>' : esc(txt || id);
  const caseLinks = (ids) => (ids || []).filter((id) => CP.store.find('cases', id)).filter((v, i, a) => a.indexOf(v) === i).map((id) => '<a class="case-link" href="#/cases/' + esc(id) + '">' + esc(id) + '</a>').join(' ');
  const flagTag = (f) => f ? ui.tag(esc(f.text), { red: 'red', dark: 'dark', amber: 'amber', indigo: 'indigo', grey: 'outline', green: 'green' }[f.cls]) : '';

  function runTemplate(G, tpl, arg) {
    const n = arg && G.nodes[arg];
    const st = G.st;
    if (tpl === 'runs') {
      const rows = (G.adj[arg] || []).filter((x) => x.e.rel === 'RUNS' || (x.e.type === 'access' && x.e.priv === 'admin')).map((x) => {
        const m = G.nodes[x.to];
        return { id: m.id, cells: [lnk(G, m.id), esc(tLabel(m)), esc(x.e.label), esc(m.ownerName || 'Unknown'), critTag(m.critLevel), flagTag(topFlag(m)) || '<span class="muted small-txt">No open exposure</span>'], csv: [m.label, tLabel(m), x.e.label, m.ownerName || '', m.critLevel || '', (topFlag(m) || {}).text || ''], rank: rankNode(m) };
      }).sort((a, b) => a.rank - b.rank);
      const hosts = rows.filter((r) => G.nodes[r.id].type === 'asset').length, sups = rows.filter((r) => G.nodes[r.id].type === 'supplier').length;
      const crit = rows.filter((r) => G.nodes[r.id].type === 'supplier' && G.nodes[r.id].critLevel === 'critical').length;
      return {
        title: 'Who runs ' + n.label + '?', center: arg, depth: 1,
        gql: 'MATCH (sw:Application {name: "' + n.label + '"})\nMATCH (x)-[r:RUNS]->(sw)\nOPTIONAL MATCH (x)<-[:HAS_ACCESS {privilege: "admin"}]-(adm:Identity)\nRETURN x.name, labels(x) AS type, r.version,\n       x.owner, x.criticality, x.exposure, collect(adm.name)\nORDER BY x.criticality',
        cols: ['Entity', 'Type', 'Relation', 'Owner', 'Criticality', 'Status now'], rows,
        note: rows.length ? hosts + ' internal server' + (hosts === 1 ? '' : 's') + ' and ' + sups + ' supplier' + (sups === 1 ? '' : 's') + ' (' + crit + ' critical) run it.' + (st.s1 ? ' CVE-2026-41877 overlay is live: statuses come from the scenario.' : ' This is the answer the CTI Analyst gets in 4 seconds when an advisory names the product.') : 'Nothing runs this entity.'
      };
    }
    if (tpl === 'reach') {
      const seen = {}; seen[arg] = true; const rows = []; let frontier = [{ id: arg, via: [], priv: '' }];
      for (let d = 1; d <= 3; d++) {
        const next = [];
        frontier.forEach((f) => (G.adj[f.id] || []).forEach((x) => {
          const m = G.nodes[x.to]; if (seen[m.id]) return;
          const ok = d === 1 ? (x.e.type === 'access' || x.e.type === 'data') && x.e.s === f.id : ['supports', 'data', 'runs'].indexOf(x.e.type) >= 0 && ['app', 'data', 'service', 'asset'].indexOf(m.type) >= 0;
          if (!ok || m.type === 'bu') return;
          seen[m.id] = true;
          const r = { id: m.id, via: f.via.concat([m.label]), priv: d === 1 ? x.e.label : f.priv, hops: d };
          rows.push(r); next.push(r);
        }));
        frontier = next;
      }
      const ag = n.kind === 'agent' ? CP.agent(n.agent) : null;
      const blocked = n.id === 'id-top17' && (st.suspended || st.revoked);
      const out = rows.map((r) => {
        const m = G.nodes[r.id];
        return { id: m.id, cells: [lnk(G, m.id), esc(tLabel(m)), '<span class="num">' + r.hops + '</span>', esc(r.priv), critTag(m.critLevel), blocked ? ui.tag(st.suspended ? 'Suspended' : 'Sessions revoked', st.suspended ? 'dark' : 'amber') : (ag ? ui.lvl(ag.mode) : ui.tag('Active', 'green'))], csv: [m.label, tLabel(m), r.hops, r.priv, m.critLevel || '', blocked ? 'blocked' : 'active'], rank: r.hops * 100 + rankNode(m) };
      }).sort((a, b) => a.rank - b.rank);
      const svc = rows.filter((r) => G.nodes[r.id].type === 'service');
      return {
        title: 'What can ' + n.label + ' reach?', center: arg, depth: 2,
        gql: 'MATCH p = (i:Identity {name: "' + n.label + '"})-[:HAS_ACCESS|ACCESSED]->(t1)\n            (-[:SUPPORTS|FLOWS_TO|STORES|RUNS]-(t)){0,2}\nWHERE t:Application OR t:Data OR t:BusinessService\nRETURN t.name, labels(t), min(length(p)) AS hops,\n       first(relationships(p)).privilege, t.criticality',
        cols: ['Reachable', 'Type', 'Hops', 'Through', 'Criticality', 'Status now'], rows: out,
        note: out.length + ' reachable entities, ' + svc.length + ' business service' + (svc.length === 1 ? '' : 's') + ' (' + svc.filter((r) => G.nodes[r.id].critLevel === 'critical').map((r) => G.nodes[r.id].label).join(', ') + ').' + (ag ? ' Agent at ' + ag.mode + ': every write goes through the orchestrator policy check.' : '') + (blocked ? ' Access is currently ' + (st.suspended ? 'suspended' : 'revoked') + ' by the Identity Response Agent.' : '')
      };
    }
    if (tpl === 'blast') {
      const types = ['net', 'runs', 'supports', 'data', 'supplier', 'access'];
      const seen = {}; seen[arg] = 0; const prev = {}; const q = [arg];
      while (q.length) {
        const u = q.shift(); if (seen[u] >= 3) continue;
        const un = G.nodes[u];
        if (u !== arg && ['zone', 'bu', 'identity', 'ip', 'threat'].indexOf(un.type) >= 0) continue;
        (G.adj[u] || []).forEach((x) => { if (types.indexOf(x.e.type) < 0 || x.e.state === 'remediated' || x.to in seen) return; seen[x.to] = seen[u] + 1; prev[x.to] = u; q.push(x.to); });
      }
      const ids = Object.keys(seen).filter((id) => id !== arg && G.nodes[id].type !== 'zone');
      const ordr = ['service', 'supplier', 'data', 'app', 'asset', 'identity', 'bu'];
      const rows = ids.map((id) => {
        const m = G.nodes[id]; const via = []; let c = prev[id]; while (c && c !== arg) { via.unshift(G.nodes[c].label); c = prev[c]; }
        return { id, cells: [lnk(G, id), esc(tLabel(m)), '<span class="num">' + seen[id] + '</span>', esc(via.join(' → ') || 'direct'), critTag(m.critLevel)], csv: [m.label, tLabel(m), seen[id], via.join(' > '), m.critLevel || ''], rank: (ordr.indexOf(m.type) < 0 ? 9 : ordr.indexOf(m.type)) * 100 + (CRIT[m.critLevel] != null ? CRIT[m.critLevel] : 5) * 10 + seen[id] };
      }).sort((a, b) => a.rank - b.rank);
      const cnt = (t) => ids.filter((id) => G.nodes[id].type === t).length;
      const critSvc = ids.filter((id) => G.nodes[id].type === 'service' && G.nodes[id].critLevel === 'critical').length;
      return {
        title: 'Blast radius of ' + n.label, center: arg, depth: 3, path: arg === 'mft-prd-01' ? 'p-inet-paycore' : null,
        gql: 'MATCH p = (h {name: "' + n.label + '"})-[:RUNS|SUPPORTS|STORES|EXCHANGES_WITH|PROVIDES|HAS_ACCESS*1..3]-(x)\nWHERE x:BusinessService OR x:Supplier OR x:Data OR x:Identity OR x:Application\nRETURN labels(x), x.name, min(length(p)) AS hops, x.criticality\n// and how an attacker gets there\nMATCH ANY SHORTEST path = (:Zone {name: "Internet"})-[*]-(h)\nRETURN path',
        cols: ['Impacted', 'Type', 'Hops', 'Via', 'Criticality'], rows,
        note: critSvc + ' critical business service' + (critSvc === 1 ? '' : 's') + ', ' + cnt('service') + ' services, ' + cnt('supplier') + ' suppliers, ' + cnt('data') + ' data stores, ' + cnt('app') + ' applications and ' + cnt('identity') + ' identities within 3 hops. Above the decision-rights threshold "1 critical business service": isolating it needs the CISO.'
      };
    }
    if (tpl === 'exit') {
      const list = CP.store.get('thirdParties').filter((t) => t.criticality === 'critical' && (!t.exitPlan || t.gap));
      const rows = list.map((t) => {
        const svcs = (G.adj[t.id] || []).filter((x) => x.e.rel === 'PROVIDES').map((x) => G.nodes[x.to].label);
        return { id: t.id, cells: [lnk(G, t.id), esc(t.country), esc(svcs.join(', ') || t.service), t.gap ? ui.tag('Exists, not tested', 'amber') : ui.tag('None documented', 'red'), '<span class="gx-src">' + esc(SRC[t.gap ? 'agent' : 'contract']) + '</span>', caseLinks(t.gap ? ['C-2303'] : []) || '<span class="muted small-txt">none</span>'], csv: [t.name, t.country, svcs.join(' / '), t.gap ? 'not tested' : 'none', t.gap ? 'agent finding' : 'contract repository'] };
      });
      const all = CP.store.get('thirdParties').filter((t) => t.criticality === 'critical').length;
      return {
        title: 'Critical suppliers without a tested exit plan', center: list[0] ? list[0].id : 'svc-payments', depth: 2,
        gql: 'MATCH (s:Supplier)-[:PROVIDES]->(f)\nWHERE s.criticality = "critical"\n  AND (s.exit_plan IS NULL OR s.exit_plan.tested = false)\nRETURN s.name, s.country, collect(f.name) AS supports,\n       s.exit_plan, source(s.exit_plan), s.cases',
        cols: ['Supplier', 'Country', 'Supports', 'Exit plan', 'Source', 'Case'], rows,
        note: list.length + ' of ' + all + ' critical suppliers in this view. ' + (G.st.gaps.length ? 'Gap confirmed by the Controls & Evidence Agent during the DORA request (C-2303): 7 critical providers register-wide, remediation by Q1 2027.' : 'Register-wide: 96 arrangements support critical functions; exit-plan tests are tracked by the Build backlog item B-309.')
      };
    }
    if (tpl === 'inet') {
      const exposedHosts = ['mft-prd-01'].filter(() => G.nodes['cve-41877']);
      const rows = exposedHosts.map((h) => {
        const status = st.patched ? ui.tag('Remediated · 9.1.4', 'green') : st.w121 ? ui.tag('Mitigated · W-121 blocking', 'amber') : ui.tag('Exposed', 'red');
        return { id: h, off: !!st.patched, cells: [lnk(G, h), lnk(G, 'cve-41877'), '<span class="num">9.8</span>', 'Internet → waf-edge-01 → mft-prd-01', esc(['W-121', 'D-418', 'EDR'].filter((x) => x === 'EDR' || (x === 'W-121' ? st.w121 : st.d418)).join(' · ')), status, caseLinks(['C-2301'])], csv: [h, 'CVE-2026-41877', '9.8', 'Internet > waf-edge-01 > mft-prd-01', '', st.patched ? 'remediated' : st.w121 ? 'mitigated' : 'exposed'] };
      });
      return {
        title: 'Internet-facing servers with exploited CVEs', center: rows.length ? 'mft-prd-01' : 'z-internet', depth: rows.length ? 2 : 2, path: rows.length ? 'p-inet-paycore' : null,
        gql: 'MATCH (:Zone {name: "Internet"})-[:ROUTES_TO*1..2]->(h:Asset)\nMATCH (h)-[a:AFFECTED_BY]->(v:Vulnerability)\nWHERE v.exploited_in_wild = true\nRETURN h.name, v.id, v.cvss, path_names(h) AS exposure_path,\n       [(h)-[:PROTECTED_BY|MONITORED_BY]->(c) | c.name] AS controls,\n       a.status',
        cols: ['Server', 'CVE', 'CVSS', 'Exposure path', 'Controls', 'Status', 'Case'], rows,
        note: rows.length ? (st.patched ? '0 open · 1 remediated today (patched 30 min after the advisory).' : '1 internet-facing server with an exploited CVE.' + (st.w121 ? ' Virtual patch in blocking mode while the vendor patch waits for a decision.' : ' No compensating control yet: the orchestrator is planning the response.')) : '212 internet-facing servers checked, none with a vulnerability exploited in the wild. Last match closed 2 Sep. Note: vm-temp-3321 exposes RDP to the internet without an owner (see Data quality).',
        empty: 'No internet-facing server with an exploited CVE right now.'
      };
    }
    if (tpl === 'toxic') {
      const ids = ['id-top17', 'id-top04', 'id-top22', 'id-tsup02', 'id-top31', 'id-tctl05'];
      const combo = { 'id-top17': 'beneficiary.create + payment.approve', 'id-top04': 'beneficiary.create + beneficiary.approve', 'id-top22': 'beneficiary.create + payment.approve', 'id-tsup02': 'beneficiary.approve + payment.release', 'id-top31': 'beneficiary.create + payment.approve', 'id-tctl05': 'payment.approve + reconciliation.override' };
      const used = { 'id-top17': 'Wed 01:58', 'id-top04': 'Mon 16:20', 'id-top22': 'Tue 11:04', 'id-tsup02': 'Tue 17:45', 'id-top31': 'Fri 10:12', 'id-tctl05': 'Tue 09:30' };
      if (!st.s2) used['id-top17'] = 'Tue 17:52';
      const rows = ids.map((id) => {
        const m = G.nodes[id]; const f = topFlag(m);
        return { id, cells: [lnk(G, id), esc(m.sub.replace('Human · ', '')), '<code class="mono small-txt">' + esc(combo[id]) + '</code>', esc(used[id]), f ? flagTag(f) : ui.tag('Active', 'outline')], csv: [m.label, m.sub, combo[id], used[id], f ? f.text : 'active'] };
      });
      return {
        title: 'Toxic access combinations in Treasury', center: 'app-payhub', depth: 1,
        gql: 'MATCH (i:Identity)-[r1:HAS_ACCESS]->(a:Application {name: "Payment hub"})\nMATCH (i)-[r2:HAS_ACCESS]->(a)\nWHERE i.business_unit = "Payments & Treasury"\n  AND toxic_pair(r1.right, r2.right)   // SoD matrix TRS-04\nRETURN i.account, i.role, r1.right + " + " + r2.right,\n       i.last_used, i.status',
        cols: ['Identity', 'Role', 'Combination', 'Last used', 'Status now'], rows,
        note: '6 identities in Treasury break the segregation-of-duties matrix. ' + (st.toxic ? 'Root cause of the t.op-17 fraud attempt: the Access Review Agent opened a review of 27 combinations across Treasury and Trade Finance (C-2284).' : 'Trade Finance has 11 more (case C-2284). Release 1.6 of the Access Review Agent (canary) detects them continuously.')
      };
    }
    if (tpl === 'noowner') {
      const ids = Object.keys(G.nodes).filter((id) => G.nodes[id].ownerName === null && ['asset', 'app', 'data'].indexOf(G.nodes[id].type) >= 0);
      const rows = ids.map((id) => {
        const m = G.nodes[id]; const sug = m.attrs.find((a) => a.k === 'Owner suggestion');
        return { id, cells: [lnk(G, id), esc(m.sub), esc(sug ? sug.v : 'n/a'), esc((m.attrs.find((a) => a.k === 'Last seen' || a.k === 'Created') || {}).v || ''), critTag(m.critLevel)], csv: [m.label, m.sub, sug ? sug.v : '', '', m.critLevel || ''] };
      });
      return {
        title: 'Assets without a known owner', center: ids[0] || 'z-internet', depth: 2,
        gql: 'MATCH (h:Asset)\nWHERE h.owner IS NULL OR h.owner.confidence < 0.6\nRETURN h.name, h.kind, suggest_owner(h) AS suggestion,\n       h.last_seen, h.criticality\nORDER BY h.criticality',
        cols: ['Asset', 'Kind', 'Platform suggestion', 'Last seen', 'Criticality'], rows,
        note: rows.length + ' shown here · 312 assets in the graph (1.7%) have no accountable owner. Suggestions come from change history, subnets and cost centres; a human confirms.'
      };
    }
    return null;
  }

  function runQuestion(G, id) {
    const q = qById(id); if (!q) return null;
    const r = runTemplate(G, q.tpl, q.arg);
    if (r) { r.title = q.text; r.qid = q.id; }
    return r;
  }

  /* Natural language: saved questions first, then a few generic patterns. */
  function parseAsk(G, text) {
    const t = String(text || '').trim().toLowerCase().replace(/[?!.]+$/, '');
    if (!t) return null;
    const exact = QS.find((q) => q.text.toLowerCase().replace(/[?]+$/, '') === t || q.keys.some((k) => t === k));
    if (exact) return { kind: 'q', id: exact.id };
    let m = t.match(/^(?:show (?:the )?)?blast radius (?:of|for) (.+)$/);
    if (m) { const e = search(G, m[1])[0]; if (e) return { kind: 't', tpl: 'blast', arg: e.id }; }
    m = t.match(/^who (?:runs|uses|owns|administers) (.+)$/);
    if (m) { const e = search(G, m[1])[0]; if (e) return { kind: 't', tpl: 'runs', arg: e.id }; }
    m = t.match(/^what can (?:account |identity |the )?(.+?) (?:reach|touch|access)$/);
    if (m) { const e = search(G, m[1], 'identity')[0] || search(G, m[1])[0]; if (e && e.type === 'identity') return { kind: 't', tpl: 'reach', arg: e.id }; }
    const loose = QS.find((q) => q.keys.some((k) => t.indexOf(k) >= 0));
    if (loose && t.split(' ').length > 2) return { kind: 'q', id: loose.id };
    return null;
  }

  /* ======================================================================
     6. Data quality: conflicts, unknown owners, connectors
     ====================================================================== */
  const DQ = [
    { id: 'dq-1', bl: 'B-341', entity: 'mft-prd-01', attr: 'FileBridge version', a: ['cmdb', '9.0.2', '41 d'], b: ['scan', '9.1.3', '2 h'], fix: 'CMDB software discovery stale on MFT hosts since 2 Sep', kind: 'connector', pr: 'high' },
    { id: 'dq-2', bl: 'B-342', entity: 'mft-uat-02', attr: 'Data classification', a: ['cmdb', 'Test data only', '96 d'], b: ['dlp', '1,312 real IBANs in /inbound/archive', '4 d'], fix: 'Real payment data on a UAT server: purge and reclassify', kind: 'fix', pr: 'high' },
    { id: 'dq-3', bl: 'B-343', entity: 'id-top17', attr: 'Manager', a: ['hr', 'Treasury desk lead', '1 d'], b: ['idp', 'Payments operations manager', '9 d'], fix: 'HR to identity provider manager sync failing for 212 Treasury and Payments staff', kind: 'connector', pr: 'medium' },
    { id: 'dq-4', bl: 'B-344', entity: 'tp-atlas', attr: 'FileBridge version', a: ['tprm', '8.7', '1 d'], b: ['contract', '9.0 (annex 2025)', '210 d'], fix: 'Contract annexes not re-read after supplier attestations', kind: 'fix', pr: 'medium' },
    { id: 'dq-5', bl: 'B-345', entity: 'swift-gw-01', attr: 'Internet-facing', a: ['fw', 'No', '1 h'], b: ['easm', 'TCP 443 answered from 2 external probes', '20 h'], fix: 'Exposure mismatch on SWIFT gateway: verify NAT rule and close or document', kind: 'fix', pr: 'high' },
    { id: 'dq-6', bl: 'B-346', entity: 'app-claims', attr: 'Owner', a: ['cmdb', 'Insurance IT', '3 h'], b: ['itsm', 'Claims digital squad (94% of changes)', '1 d'], fix: 'Ownership drift: CMDB owner no longer makes the changes', kind: 'fix', pr: 'low' },
    { id: 'dq-7', bl: 'B-347', entity: 'vm-temp-3321', attr: 'Owner', a: ['cloud', 'none (tag temp-test)', '1 h'], b: ['agent', 'Digital channels (58%)', '1 d'], fix: 'Unowned cloud VM with RDP open to the internet', kind: 'fix', pr: 'high', unknown: true },
    { id: 'dq-8', bl: 'B-348', entity: 'fs-legacy-07', attr: 'Owner', a: ['cmdb', 'none', '210 d'], b: ['agent', 'Group IT · Storage team (71%)', '2 d'], fix: 'Out-of-support legacy server replicating Treasury data, no owner', kind: 'fix', pr: 'medium', unknown: true },
    { id: 'dq-9', bl: 'B-349', entity: 'srv-bi-114', attr: 'Owner', a: ['cmdb', 'none', '140 d'], b: ['agent', 'Insurance data office (64%)', '2 d'], fix: 'BI server sending extracts to InsightBI, no owner', kind: 'fix', pr: 'low', unknown: true }
  ];
  const CONNECTORS = [
    ['cmdb', '18,420 assets · 2,150 apps', '3 h', '6 h', 'ok'], ['idp', '61,000 identities', '14 min', '1 h', 'ok'], ['iga', 'Entitlements · 1.9 M', '1 d', '24 h', 'ok'],
    ['hr', '38,000 staff', '1 d', '24 h', 'ok'], ['scan', '9,812 open findings', '2 h', '24 h', 'ok'], ['edr', '21,300 endpoints', '6 min', '15 min', 'ok'],
    ['easm', '212 internet-facing hosts', '2 h', '24 h', 'ok'], ['fw', '4,120 rules', '1 h', '6 h', 'ok'], ['cloud', '3,410 workloads', '1 h', '1 h', 'ok'],
    ['tprm', '1,240 arrangements', '1 d', '24 h', 'ok'], ['contract', '1,240 contracts', '3 d', '24 h', 'warn'], ['bia', '184 business services', '12 d', '90 d', 'ok'],
    ['cti', '3,912 indicators today', '4 min', '15 min', 'ok'], ['siem', 'Alerts & logs', '5 min', '15 min', 'ok'], ['dlp', 'Labels on 4.2 M files', '4 h', '24 h', 'ok'],
    ['registry', '16 agents', '1 h', '1 h', 'ok'], ['ot', 'OT asset inventory', 'not connected', '', 'off']
  ];
  const ageMin = (age) => { const m = String(age || '').match(/(\d+)\s*(min|h|d|w)/); if (!m) return null; return +m[1] * { min: 1, h: 60, d: 1440, w: 10080 }[m[2]]; };
  const freshCls = (a) => { if (a.live) return 'live'; const m = ageMin(a.age); if (m == null) return 'ok'; return m <= 60 ? '' : m <= 1440 ? 'ok' : m >= 7 * 1440 ? 'stale' : 'ok'; };
  const freshTxt = (a) => a.live ? (a.age ? 'live · ' + a.age : 'live') : (ageMin(a.age) != null ? a.age + ' ago' : (a.age || ''));
  const blFor = (dq) => CP.store.find('backlog', dq.bl);
  const RO = () => CP.currentRole === 'auditor';

  /* ======================================================================
     7. Layout: radial tree around the centre (deterministic)
     ====================================================================== */
  function layout(G, center, depth, edgeOn, path) {
    const dist = {}; const parent = {}; const kids = {};
    dist[center] = 0; kids[center] = [];
    const q = [center];
    const allowed = (e) => edgeOn[e.type] !== false;
    while (q.length) {
      const u = q.shift();
      if (dist[u] >= depth) continue;
      if (u !== center && G.nodes[u].type === 'zone' && dist[u] >= 1 && depth < 3) continue;
      const nb = (G.adj[u] || []).filter((x) => allowed(x.e) && !(x.to in dist)).map((x) => x.to)
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort((a, b) => rankNode(G.nodes[a]) - rankNode(G.nodes[b]) || (G.nodes[a].label < G.nodes[b].label ? -1 : 1));
      nb.forEach((v) => { dist[v] = dist[u] + 1; parent[v] = u; kids[v] = []; kids[u].push(v); q.push(v); });
    }
    /* Path nodes are always shown, attached along the path. */
    if (path) {
      const pn = path.nodes;
      for (let k = 0; k < 2; k++) {
        pn.forEach((id, i) => {
          if (id in dist) return;
          const nb = [pn[i - 1], pn[i + 1]].filter((x) => x && x in dist && G.nodes[x])[0];
          if (nb) { dist[id] = dist[nb] + 1; parent[id] = nb; kids[id] = []; kids[nb].push(id); }
        });
      }
    }
    /* Collapse large fan-outs. */
    const removed = {};
    const drop = (id) => { removed[id] = true; (kids[id] || []).forEach(drop); };
    Object.keys(kids).forEach((u) => {
      const cap = u === center ? 22 : 14;
      if (kids[u].length > cap) {
        const keep = kids[u].filter((v) => path && path.nodes.indexOf(v) >= 0);
        const rest = kids[u].filter((v) => keep.indexOf(v) < 0);
        const kept = keep.concat(rest.slice(0, cap - 1 - keep.length));
        const gone = kids[u].filter((v) => kept.indexOf(v) < 0);
        gone.forEach(drop);
        const mid = 'more:' + u;
        kids[u] = kept.concat([mid]); kids[mid] = []; dist[mid] = dist[u] + 1; parent[mid] = u;
        G.nodes[mid] = { id: mid, type: 'more', label: '+' + gone.length + ' more', sub: 'Collapsed · recentre on ' + G.nodes[u].label + ' to see all', attrs: [], flags: [], cases: [], parentId: u, hidden: gone };
      }
    });
    const vis = Object.keys(dist).filter((id) => !removed[id]);
    /* Rings: depth 1 evenly spaced (type order), deeper rings start at their
       parent's angle and are spread apart with a minimum arc. Deterministic. */
    const byD = {}; vis.forEach((id) => { (byD[dist[id]] = byD[dist[id]] || []).push(id); });
    const maxD = Math.max.apply(null, Object.keys(byD).map(Number));
    const SP = 78; const R = [0]; const ang = {}; const pos = { [center]: { x: 0, y: 0, a: 0 } };
    const TAU = 2 * Math.PI;
    for (let d = 1; d <= maxD; d++) {
      const ring = byD[d] || []; const n = ring.length;
      R[d] = Math.max(R[d - 1] + (d === 1 ? 175 : 165), n * SP / TAU);
      if (d === 1) {
        const ord = (kids[center] || []).filter((v) => !removed[v]);
        ord.forEach((id, i) => { ang[id] = -Math.PI / 2 + (i + 0.5) * TAU / Math.max(1, ord.length) - (ord.length === 1 ? 0.5 * TAU : 0); });
      } else {
        const want = [];
        ring.forEach((id) => {
          const sib = (kids[parent[id]] || []).filter((v) => !removed[v]); const k = sib.indexOf(id);
          const spread = Math.min(TAU / 3, (sib.length - 1) * (SP * 0.9) / R[d]);
          want.push({ id, a: ang[parent[id]] + (sib.length > 1 ? -spread / 2 + spread * k / (sib.length - 1) : 0) });
        });
        want.sort((a, b) => a.a - b.a);
        const g = Math.min(SP / R[d], TAU / Math.max(1, n));
        const a = want.map((w) => w.a);
        for (let it = 0; it < 80; it++) {
          let moved = false;
          for (let i = 0; i < n; i++) {
            const j = (i + 1) % n; let diff = (j === 0 ? a[j] + TAU : a[j]) - a[i];
            if (n > 1 && diff < g) { const push = (g - diff) / 2 + 1e-4; a[i] -= push; a[j] += push; moved = true; }
          }
          if (!moved) break;
        }
        want.forEach((w, i) => { ang[w.id] = a[i]; });
      }
      ring.forEach((id) => { pos[id] = { x: R[d] * Math.cos(ang[id]), y: R[d] * Math.sin(ang[id]), a: ang[id] }; });
    }
    let x0 = 0, y0 = 0, x1 = 0, y1 = 0;
    vis.forEach((id) => { const p = pos[id]; x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); });
    const mx = 150, my = 70;
    return { vis, dist, parent, pos, bounds: { x: x0 - mx, y: y0 - my, w: x1 - x0 + 2 * mx, h: y1 - y0 + 2 * my } };
  }

  /* Label beside the node, on the outer side (left / right / above / below). */
  function labelSvg(c, p, lab, sub) {
    if (c) return '<text class="lb" y="42">' + esc(lab) + '</text>' + (sub ? '<text class="sb" y="55">' + esc(sub) + '</text>' : '');
    const cx = Math.cos(p.a), cy = Math.sin(p.a);
    let x = 0, y = 31, anc = 'middle', y2 = 43;
    if (cx > 0.45) { x = 23; y = sub ? 0 : 4; anc = 'start'; y2 = 12; }
    else if (cx < -0.45) { x = -23; y = sub ? 0 : 4; anc = 'end'; y2 = 12; }
    else if (cy < 0) { y = sub ? -36 : -25; y2 = -25; }
    return '<text class="lb" x="' + x + '" y="' + y + '" style="text-anchor:' + anc + '">' + esc(lab) + '</text>' + (sub ? '<text class="sb" x="' + x + '" y="' + y2 + '" style="text-anchor:' + anc + '">' + esc(sub) + '</text>' : '');
  }

  function canvasSvg(G, L2, center, edgeOn, path) {
    const vis = {}; L2.vis.forEach((id) => { vis[id] = true; });
    const pset = {}; const pedge = {};
    if (path) { path.nodes.forEach((id, i) => { pset[id] = true; if (i) { const x = edgeBetween(G, path.nodes[i - 1], id); if (x) pedge[x.e.i] = true; } }); }
    let eh = '', ph = '', hits = '';
    const drawn = {};
    G.edges.forEach((e) => {
      if (!vis[e.s] || !vis[e.t] || e.s.indexOf('more:') === 0 || e.t.indexOf('more:') === 0) return;
      const onP = pedge[e.i];
      if (!onP && edgeOn[e.type] === false) return;
      const key = [e.s, e.t].sort().join('|') + e.type; if (drawn[key] && !onP) return; drawn[key] = true;
      const a = L2.pos[e.s], b = L2.pos[e.t];
      const tree = L2.parent[e.t] === e.s || L2.parent[e.s] === e.t;
      const st = E[e.type];
      const cls = 'gx-e' + (tree ? '' : ' cross') + (onP ? ' path' : '') + (e.state ? ' st-' + e.state : '') + (path && !onP ? ' dim' : '');
      const col = onP ? '#451dc7' : e.state === 'remediated' ? '#088a42' : (e.state === 'blocked' ? '#b9b3c9' : e.state === 'restricted' ? '#c8861a' : st.color);
      const line = '<line x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) + '" x2="' + b.x.toFixed(1) + '" y2="' + b.y.toFixed(1) + '"';
      const ttl = '<title>' + esc(G.nodes[e.s].label + ' · ' + e.label + ' · ' + G.nodes[e.t].label + (e.state ? ' (' + e.state + ')' : '') + ' · ' + st.label) + '</title>';
      const svgL = line + ' class="' + cls + '" stroke="' + col + '"' + (st.dash && !onP ? ' stroke-dasharray="' + st.dash + '"' : '') + '/>';
      if (onP) { ph += svgL; ph += '<text class="gx-pl" x="' + ((a.x + b.x) / 2).toFixed(1) + '" y="' + ((a.y + b.y) / 2 - 5).toFixed(1) + '">' + esc(e.label.length > 34 ? e.label.slice(0, 32) + '…' : e.label) + '</text>'; } else eh += svgL;
      hits += line + ' class="gx-e hit">' + ttl + '</line>';
    });
    /* Edges to collapsed nodes */
    L2.vis.filter((id) => id.indexOf('more:') === 0).forEach((id) => {
      const a = L2.pos[L2.parent[id]], b = L2.pos[id];
      eh += '<line x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) + '" x2="' + b.x.toFixed(1) + '" y2="' + b.y.toFixed(1) + '" class="gx-e" stroke="#b9b3c9" stroke-dasharray="3 3"/>';
    });
    let nh = '';
    const order = L2.vis.slice().sort((a, b) => (a === center) - (b === center));
    order.forEach((id) => {
      const n = G.nodes[id]; const p = L2.pos[id]; const t = T[n.type];
      const c = id === center; const f = topFlag(n);
      const s = c ? 1.3 : 1;
      const lab = !c && n.label.length > 21 ? n.label.slice(0, 19) + '…' : n.label;
      const cls = 'gx-n' + (c ? ' center' : '') + (n.type === 'more' ? ' more' : '') + (f ? ' ' + f.cls : '') + (n.fresh ? ' fresh' : '') + (path && !pset[id] ? ' dim' : '');
      nh += '<g class="' + cls + '" transform="translate(' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ')" style="--c:' + t.color + '" data-action="node" data-id="' + esc(id) + '" tabindex="0" role="button" aria-label="' + esc(tLabel(n) + ': ' + n.label + (f ? ', ' + f.text : '') + '. Recentre the graph') + '">' +
        '<title>' + esc(n.label + ' · ' + tLabel(n) + (n.sub ? ' · ' + n.sub : '') + (f ? ' · ' + f.text : '')) + '</title>' +
        '<g transform="scale(' + s + ')">' + (c ? '<rect class="halo" x="-27" y="-27" width="54" height="54"/>' : '') +
        '<rect class="bx" x="-17" y="-17" width="34" height="34"/>' +
        '<g class="ic" transform="translate(-9,-9) scale(.75)">' + (CP.icons[tIcon(n)] || CP.icons.info) + '</g>' +
        (f ? '<rect class="bd ' + f.cls + '" x="9" y="-23" width="13" height="13"/><text class="bdt" x="15.5" y="-13.5">' + ({ red: '!', dark: '×', amber: '!', indigo: '•', grey: '?', green: '✓' }[f.cls]) + '</text>' : '') + '</g>' +
        labelSvg(c, p, lab, (c || L2.dist[id] === 1) ? tLabel(n) : '') + '</g>';
    });
    const b = L2.bounds;
    return '<svg role="img" aria-label="Neighbourhood of ' + esc(G.nodes[center].label) + ': ' + L2.vis.length + ' entities" data-vb="' + [b.x, b.y, b.w, b.h].map((v) => v.toFixed(1)).join(' ') + '" viewBox="' + [b.x, b.y, b.w, b.h].map((v) => v.toFixed(1)).join(' ') + '" width="' + Math.round(b.w) + '" height="' + Math.round(b.h) + '">' +
      '<g>' + eh + '</g><g>' + ph + '</g><g>' + hits + '</g><g>' + nh + '</g></svg>';
  }

  /* ======================================================================
     8. Entity 360
     ====================================================================== */
  function related(G, id) {
    const n = G.nodes[id];
    const one = (G.adj[id] || []);
    const two = (types1, types2, filt) => {
      const out = {};
      one.forEach((x) => {
        if (types1.indexOf(x.e.type) < 0) return;
        const m = G.nodes[x.to]; if (filt(m)) out[m.id] = out[m.id] || { id: m.id, via: x.e.label };
        (G.adj[x.to] || []).forEach((y) => { if (y.to === id || types2.indexOf(y.e.type) < 0) return; const k = G.nodes[y.to]; if (filt(k) && !out[k.id]) out[k.id] = { id: k.id, via: 'via ' + m.label }; });
      });
      return Object.keys(out).map((k) => out[k]);
    };
    const isT = (ts) => (m) => ts.indexOf(m.type) >= 0;
    const svc = n.type === 'service' ? one.filter((x) => G.nodes[x.to].type === 'bu').map((x) => ({ id: x.to, via: 'belongs to' }))
      : two(['runs', 'supports', 'access', 'data', 'supplier'], ['supports', 'supplier'], isT(['service']));
    const exp = one.filter((x) => x.e.type === 'exposure').map((x) => ({ id: x.to, via: x.e.label, state: x.e.state }));
    const ctl = two(['control', 'runs'], ['control'], isT(['control'])).filter((r) => r.id !== id);
    const sup = n.type === 'supplier' ? one.filter((x) => x.e.type === 'supplier').map((x) => ({ id: x.to, via: x.e.label, state: x.e.state })) : two(['supplier', 'runs', 'supports'], ['supplier'], isT(['supplier']));
    const ids = two(['access', 'runs', 'exposure'], ['access'], isT(['identity'])).filter((r) => r.id !== id);
    const other = one.filter((x) => ['service', 'supplier', 'identity', 'control', 'vuln', 'threat', 'ip'].indexOf(G.nodes[x.to].type) < 0 && x.e.type !== 'exposure').map((x) => ({ id: x.to, via: x.e.label, state: x.e.state }));
    return { svc, exp, ctl, sup, ids, other };
  }

  function relList(G, list, max, empty) {
    if (!list.length) return '<div class="small-txt muted">' + esc(empty) + '</div>';
    return '<div class="gx-rel">' + list.slice(0, max || 8).map((r) => {
      const m = G.nodes[r.id]; const f = topFlag(m);
      return '<button data-action="pick" data-id="' + esc(m.id) + '">' + tBadge(m, true) + '<span class="rx"><b>' + esc(m.label) + '</b><small>' + esc(r.via || m.sub) + (r.state ? ' · ' + r.state : '') + '</small></span>' + (f ? flagTag(f) : (m.critLevel ? critTag(m.critLevel) : '')) + '</button>';
    }).join('') + (list.length > (max || 8) ? '<div class="small-txt muted" style="padding:4px 2px">+' + (list.length - (max || 8)) + ' more · recentre the canvas to see them all</div>' : '') + '</div>';
  }

  function attrRow(a) {
    const cf = a.conflict;
    const dq = cf && DQ.find((d) => d.id === cf.dq);
    const bl = dq && blFor(dq);
    return '<div class="gx-attr' + (a.live ? ' live' : '') + (cf ? ' conf' : '') + '"><span class="ak">' + esc(a.k) + '</span><span class="av2"' + (a.cls === 'warn' ? ' style="color:#8a5a05"' : a.unknown ? ' style="color:var(--red-ink)"' : '') + '>' + esc(a.v) + '</span>' +
      '<span class="pv"><i class="fr ' + freshCls(a) + '"></i>' + esc(SRC[a.src] || a.src) + ' · ' + esc(freshTxt(a)) + (a.by ? ' · ' + esc(CP.actor(a.by).name) : '') + (cf ? ' · ' + ui.tag('2 sources disagree', 'amber') : '') + '</span>' +
      (cf ? '<div class="cf"><b>' + esc(SRC[cf.src]) + '</b> says <b>' + esc(cf.v) + '</b> (' + esc(cf.age) + ' ago).<br><span class="muted">' + esc(cf.rule) + '</span>' +
        (dq ? '<div class="row wrap">' + (bl ? ui.tag(CP.icon('check') + ' In Build backlog ' + esc(bl.id), 'green') : (RO() ? '<span class="muted small-txt">Read-only: auditors cannot raise backlog items</span>' : '<button class="small" data-action="dq-send" data-dq="' + esc(dq.id) + '">' + I('send') + ' Send to Build backlog</button>')) + '</div>' : '') + '</div>' : '') + '</div>';
  }

  function panel360(G, id) {
    const n = G.nodes[id];
    if (!n) return '<div class="gx-360" data-tour="graph-360"><div class="empty" style="margin:16px">Select an entity.</div></div>';
    if (n.type === 'more') {
      return '<div class="gx-360" data-tour="graph-360"><div class="gx-360-h"><div class="ey">' + I('list') + ' Collapsed group</div><h2>' + esc(n.label) + '</h2><div class="sub">' + esc(n.sub) + '</div><div class="acts"><button class="primary small" data-action="pick" data-id="' + esc(n.parentId) + '">' + I('target') + ' Recentre on ' + esc(G.nodes[n.parentId].label) + '</button></div></div>' +
        '<div class="gx-sec"><h3>Hidden entities <span class="c">' + n.hidden.length + '</span></h3>' + relList(G, n.hidden.map((h) => ({ id: h, via: G.nodes[h].sub })), 30, '') + '</div></div>';
    }
    const R = related(G, id);
    const f = topFlag(n);
    const cases = (n.cases || []).concat(R.exp.reduce((a, r) => a.concat(G.nodes[r.id].cases || []), []));
    const caseItems = cases.filter((c, i, a) => a.indexOf(c) === i).map((c) => CP.store.find('cases', c)).filter(Boolean);
    const rx = n.match ? new RegExp(n.match, 'i') : new RegExp(n.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const acts = CP.store.get('actions').filter((a) => rx.test(a.action + ' ' + a.system)).slice(0, 6);
    const ag = n.kind === 'agent' ? CP.agent(n.agent) : null;
    const conflicts = n.attrs.filter((a) => a.conflict).length;
    const lastLive = n.attrs.filter((a) => a.live).map((a) => a.age).filter(Boolean).pop();
    const head = '<div class="gx-360-h"><div class="ey">' + I('target') + ' Entity 360 · ' + esc(tLabel(n)) + '</div>' +
      '<h2>' + tBadge(n) + '<span>' + esc(n.label) + '</span></h2><div class="sub">' + esc(n.sub) + '</div>' +
      '<div class="tags">' + (n.critLevel ? critTag(n.critLevel) : '') + (n.flags || []).map(flagTag).join('') + (ag ? ui.lvl(ag.mode) + ui.dom(ag.domain) : '') + (conflicts ? ui.tag(conflicts + ' conflicting attribute' + (conflicts > 1 ? 's' : ''), 'amber') : '') + '</div>' +
      '<div class="acts"><button class="small" data-action="blast" data-id="' + esc(id) + '">' + I('radar') + ' Blast radius</button>' +
      (n.type === 'identity' ? '<button class="small" data-action="reach" data-id="' + esc(id) + '">' + I('key') + ' What can it reach?</button>' : '') +
      (n.type === 'app' ? '<button class="small" data-action="runs" data-id="' + esc(id) + '">' + I('cpu') + ' Who runs it?</button>' : '') +
      (n.type === 'supplier' ? '<a class="small" style="display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;text-decoration:none;border:1px solid var(--line);padding:4px 9px" href="#/engage/thirdparties">' + I('external') + ' Party 360 in Engage</a>' : '') +
      (ag ? '<a class="small" style="display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;text-decoration:none;border:1px solid var(--line);padding:4px 9px" href="#/run">' + I('activity') + ' Supervise in Operate</a>' : '') +
      '<button class="small ghost" data-action="share" data-id="' + esc(id) + '" title="Copy a link to this entity">' + I('link') + ' Copy link</button></div></div>';
    const sec = (title, count, body) => '<div class="gx-sec"><h3><span>' + title + '</span>' + (count != null ? '<span class="c">' + count + '</span>' : '') + '</h3>' + body + '</div>';
    const exposures = R.exp.filter((r) => ['vuln', 'threat', 'ip', 'device', 'identity'].indexOf(G.nodes[r.id].type) >= 0);
    const expAttrs = n.attrs.filter((a) => a.k === 'Exposure' || (a.k === 'Internet-facing' && /^Yes/.test(a.v)));
    return '<div class="gx-360" data-tour="graph-360">' + head +
      sec('Attributes · source and freshness', n.attrs.length, n.attrs.length ? n.attrs.map(attrRow).join('') + '<div class="small-txt muted" style="margin-top:8px;display:flex;gap:10px;flex-wrap:wrap"><span><i class="fr" style="display:inline-block;width:7px;height:7px;background:#04f06a"></i> live</span><span><i style="display:inline-block;width:7px;height:7px;background:#088a42"></i> &lt; 1 h</span><span><i style="display:inline-block;width:7px;height:7px;background:#8fb8a0"></i> &lt; 7 d</span><span><i style="display:inline-block;width:7px;height:7px;background:#e09a1f"></i> stale</span>' + (lastLive ? '<span>Last change: ' + esc(lastLive) + '</span>' : '') + '</div>' : '<div class="small-txt muted">No attribute.</div>') +
      sec('Business services supported', R.svc.length, relList(G, R.svc, 6, n.type === 'service' ? 'No business unit linked.' : 'Supports no business service directly (within 2 hops).')) +
      sec('Exposures', exposures.length + expAttrs.length, (expAttrs.length ? expAttrs.map((a) => '<div class="notice' + (a.cls === 'ok' ? ' ok' : '') + '" style="margin-bottom:6px;font-size:12.5px">' + esc(a.v) + '</div>').join('') : '') + relList(G, exposures, 6, expAttrs.length ? '' : 'No known exposure on this entity.')) +
      sec('Controls in place', R.ctl.length, relList(G, R.ctl, 6, 'No control linked: a gap the Controls & Evidence Agent tracks.')) +
      sec('Related cases', caseItems.length, caseItems.length ? '<div class="gx-rel">' + caseItems.map((c) => '<a href="#/cases/' + esc(c.id) + '" style="display:flex;gap:8px;align-items:center;border:1px solid var(--line-2);padding:6px 8px;text-decoration:none;color:inherit"><b class="mono" style="color:var(--indigo);font-size:12px">' + esc(c.id) + '</b><span style="flex:1;font-size:12.5px;line-height:1.35">' + esc(c.title) + '</span>' + ui.status(c.status) + '</a>').join('') + '</div>' : '<div class="small-txt muted">No case references this entity.</div>') +
      sec('Suppliers', R.sup.length, relList(G, R.sup, 6, 'No supplier within 2 hops.')) +
      sec('Identities with access', R.ids.length, relList(G, R.ids, 6, 'No identity linked.')) +
      (R.other.length ? sec('Other relationships', R.other.length, relList(G, R.other, 8, '')) : '') +
      sec('Recent agent actions', acts.length, acts.length ? acts.map((a) => '<div class="gx-act' + ui.newCls(a) + '"><span class="ts">' + esc(a.ts) + '</span><span class="m">' + esc(a.action) + '<small>' + ui.av(a.agent, 'sm') + esc(CP.actor(a.agent).name) + ' · ' + ui.lvl(a.level) + (a.rollback ? ' · ' + I('rollback') + ' rollback ready' : '') + '</small></span></div>').join('') : '<div class="small-txt muted">No agent action on this entity today.</div>') +
      '</div>';
  }

  /* ======================================================================
     9. Graph change log (live) and query log
     ====================================================================== */
  function changeLog(G) {
    const st = G.st; const out = [];
    const push = (ts, color, text, id, sub, item) => out.push({ ts, color, text, id, sub, item });
    if (st.s1) push(st.s1.opened, '#d8412f', 'CVE-2026-41877 linked to FileBridge MFT: 2 servers and 14 suppliers exposed', 'cve-41877', 'CTI Analyst · graph write from CTI feeds', st.s1);
    if (st.w121) push(tsOf(st, CP.store.find('actions', 'A-9830'), 'cti-4', 'Tue 08:48'), '#1597a5', 'mft-prd-01 protected by virtual patch W-121 (blocking, 0 false positive in replay)', 'ctl-W-121', 'WAF Tuning Agent · WAF', st.w121);
    if (st.d418) push(tsOf(st, null, 'cti-5', 'Tue 08:51'), '#1597a5', 'Detection D-418 monitors mft-prd-01; backtest found a probe from 45.155.204.9', 'ip-probe', 'Detection Engineer Agent · SIEM', st.d418);
    if (st.fx) push(tsOf(st, null, 'cti-6', 'Tue 08:56'), '#088a42', 'Forensic verdict on mft-prd-01: ' + st.fx.verdict, 'mft-prd-01', 'Forensic Agent · EDR', st.fx);
    if (st.patched) push(st.patched.ts, '#088a42', 'mft-prd-01 patched to FileBridge 9.1.4 (CHG-88412): exposure closed', 'mft-prd-01', 'VulnOps Agent · ITSM', st.patched);
    if (st.answers) push(st.answers.ts, '#b8770f', '10 suppliers confirmed the patch, Atlas Payroll still on 8.7 (flow quarantined), 3 overdue', 'tp-atlas', 'TPRM Agent · supplier portal', CP.store.find('actions', 'A-9851'));
    if (st.s2) push(st.s2.opened, '#d8412f', 't.op-17: high-risk sign-in from an unknown device after 23 MFA pushes', 'id-top17', 'Identity provider', st.s2);
    if (st.revoked) push(st.revoked.ts, '#c43d8a', 't.op-17 sessions and tokens revoked, device blocked', 'id-top17', 'Identity Response Agent', st.revoked);
    if (st.rule) push(st.rule.ts, '#c43d8a', 'Inbox rule hiding payment-hub emails removed from t.op-17 mailbox', 'app-mail', 'Identity Response Agent · mail', st.rule);
    if (st.spray) push(st.spray.ts, '#c43d8a', 'Attacker IP blocked; 4 Treasury accounts forced to re-register MFA', 'ip-s2', 'Threat Hunter Agent', st.spray);
    if (st.data) push(st.data.ts, '#7a3ff2', 'Treasury · Beneficiaries: 37 files downloaded before revocation (1,200 IBANs)', 'data-benef', 'Data Protection Agent', st.data);
    if (st.suspended) push(st.suspended.ts, '#211248', 't.op-17 suspended, 3 payments held (€4.2 M) by Treasury decision', 'id-top17', 'Head of Treasury decided · Identity Response Agent executed', st.suspended);
    if (st.toxic) push(tsOf(st, null, 'id-9', 'Wed 03:13'), '#c43d8a', 'Segregation of duties: 27 create-and-approve combinations under review', 'ctl-sod', 'Access Review Agent', st.toxic);
    if (st.gaps.length) push(tsOf(st, null, 'rg-4', 'Mon 09:25'), '#b8770f', 'Exit plan not tested flagged on ' + st.gaps.length + ' critical suppliers (' + st.gaps.map((t) => t.name.split(' ')[0]).join(', ') + ')', st.gaps[0].id, 'Controls & Evidence Agent · DORA request', st.gaps[0]);
    if (st.dv) push(st.dv.detected, '#5a2be0', 'SOC Triage Agent: deviation on auto-close rate (61% to 84%)', 'id-ag-triage', 'Deviation hunt', st.dv);
    if (st.kill) push(st.kill.ts, '#d8412f', 'SOC Triage Agent lowered to L0 (kill-switch): access unchanged, writes need an analyst', 'id-ag-triage', 'Run supervisor decided', st.kill);
    if (st.triage && st.dv && st.dv.status === 'closed') push(tsOf(st, null, 'dr-8', 'Sun 10:15'), '#088a42', 'SOC Triage Agent back to L2 (v2.6.0) after a 72 h canary', 'id-ag-triage', 'Orchestrator', st.dv);
    const base = [
      { ts: 'Tue 08:30', color: '#6d687e', text: 'CMDB sync: 214 assets updated, 3 new owners confirmed', id: 'waf-edge-01', sub: 'CMDB connector' },
      { ts: 'Tue 07:55', color: '#6d687e', text: '14 internet-facing servers with CVSS ≥ 8 linked to patch changes', id: 'z-internet', sub: 'VulnOps Agent · scanner' },
      { ts: 'Tue 07:31', color: '#6d687e', text: '42 dormant identities removed from the graph after manager confirmation', id: 'ctl-mfa', sub: 'Access Review Agent · IGA' },
      { ts: 'Tue 06:48', color: '#6d687e', text: '3,912 indicators matched against group assets: 0 match', id: 'z-internet', sub: 'CTI Collector' }
    ];
    return out.reverse().concat(base);
  }

  const STEP_QUERIES = {
    'cti-2': ['MATCH (sw:Application {name:"FileBridge MFT"})<-[:RUNS]-(x) RETURN x, x.owner, x.criticality', 16, 38],
    'cti-7': ['MATCH (s:Supplier)-[:RUNS]->(:Application {name:"FileBridge MFT"}) RETURN s, s.contact, s.version', 14, 22],
    'cti-10': ['MATCH (s:Supplier {name:$answering})-[r:RUNS]->(sw) SET r.version = $answer', 11, 61],
    'id-2': ['MATCH (i:Identity {account:"t.op-17"})-[r:HAS_ACCESS]->(t) RETURN t, r.privilege', 9, 27],
    'id-6': ['MATCH (i:Identity {account:"t.op-17"})-[:HAS_ACCESS]->(a)-[:STORES]->(d:Data) RETURN d, d.personal_data', 3, 19],
    'id-9': ['MATCH (i:Identity)-[r1]->(a)<-[r2]-(i) WHERE toxic_pair(r1.right, r2.right) RETURN i, a', 27, 140],
    'rg-2': ['MATCH (f:BusinessService {dora_critical:true})-[:PROVIDES]-(s:Supplier) RETURN f, s', 96, 210],
    'rg-3': ['MATCH (s:Supplier)-[c:CONTRACT]-(:Group) RETURN s, c, s.subcontractors', 1240, 880],
    'rg-4': ['MATCH (s:Supplier {criticality:"critical"}) WHERE s.exit_plan.tested = false RETURN s', 7, 44]
  };
  function queryLog(G) {
    const rows = CP.store.get('traces').filter((t) => (t.flow || []).some((f) => f[0] === 'ctx-graph' || f[1] === 'ctx-graph')).map((t) => {
      const sq = STEP_QUERIES[t.id.replace(/^tr-/, '')] || ['graph.query · ' + t.title, '', ''];
      return { ts: t.ts, actor: t.actor, purpose: t.title, gql: sq[0], rows: sq[1], ms: sq[2], cas: t.case, item: t };
    }).reverse();
    const base = [
      { ts: 'Tue 08:12', actor: 'ag-soc-triage', purpose: 'Identity context for alert 88213 (risky sign-in, Retail)', gql: 'MATCH (i:Identity {account:"r.adv-311"})-[r:HAS_ACCESS]->(t) RETURN t, r.privilege', rows: 6, ms: 31 },
      { ts: 'Tue 07:55', actor: 'ag-vuln', purpose: 'Internet-facing servers with CVSS ≥ 8', gql: 'MATCH (:Zone {name:"Internet"})-[:ROUTES_TO*1..2]->(h)-[:AFFECTED_BY]->(v) WHERE v.cvss >= 8 RETURN h, v', rows: 14, ms: 66 },
      { ts: 'Tue 07:31', actor: 'ag-iam-review', purpose: 'Dormant identities with access to critical applications', gql: 'MATCH (i:Identity)-[:HAS_ACCESS]->(a {criticality:"critical"}) WHERE i.last_used < date() - 90 RETURN i', rows: 42, ms: 118 },
      { ts: 'Tue 06:48', actor: 'ag-cti-collect', purpose: 'Match 3,912 indicators against group assets', gql: 'UNWIND $iocs AS ioc MATCH (x) WHERE x.ip = ioc OR x.domain = ioc RETURN x', rows: 0, ms: 420 },
      { ts: 'Mon 17:10', actor: 'p-marc', purpose: 'Suppliers with leaked credentials that run FileBridge', gql: 'MATCH (s:Supplier)-[:RUNS]->(:Application {name:"FileBridge MFT"}) WHERE s.leaked_credentials RETURN s', rows: 1, ms: 24 }
    ];
    return rows.concat(base);
  }

  /* ======================================================================
     10. Small renderers
     ====================================================================== */
  function hlGql(s) {
    return esc(s).replace(/(\/\/[^\n]*)/g, '<span class="c">$1</span>')
      .replace(/(&quot;[^&\n]*?&quot;)/g, '<span class="s">$1</span>')
      .replace(/\b(MATCH|OPTIONAL|WHERE|RETURN|ORDER BY|AND|OR|NOT|IS NULL|AS|ANY SHORTEST|UNWIND|SET|LIMIT|DESC|IN)\b/g, '<span class="k">$1</span>')
      .replace(/(:[A-Z][A-Za-z]+|\[:[A-Z_|*0-9.]+)/g, '<span class="l">$1</span>');
  }

  function dqStrip(G) {
    const open = DQ.filter((d) => !blFor(d));
    const top = open.filter((d) => !d.unknown)[0] || open[0];
    const unknown = DQ.filter((d) => d.unknown).length;
    return '<div class="gx-dq" role="region" aria-label="Graph data quality">' +
      '<div><div class="k">' + I('layers') + ' Coverage</div><div class="v">94.2%</div><div class="s">assets with owner and criticality · 18,420</div></div>' +
      '<div><div class="k">' + I('clock') + ' Freshness</div><div class="v">96.1%</div><div class="s">attributes refreshed &lt; 24 h · median 41 min</div></div>' +
      '<div><div class="k">' + I('user') + ' Unknown owners</div><div class="v warn">312</div><div class="s">assets · ' + unknown + ' in this view</div></div>' +
      '<div><div class="k">' + I('alert') + ' Conflicts</div><div class="v warn">' + (21 + open.length) + '</div><div class="s">attributes where sources disagree</div></div>' +
      '<div>' + (top ? '<div class="iss"><b>Top issue:</b> ' + lnk(G, top.entity) + ' · ' + esc(top.attr) + ': ' + esc(SRC[top.a[0]]) + ' says "' + esc(top.a[1]) + '", ' + esc(SRC[top.b[0]]) + ' says "' + esc(top.b[1]) + '"</div>' : '<div class="iss">All conflicts in this view are in the Build backlog.</div>') +
      '<div class="row wrap" style="gap:6px">' + (top && !RO() ? '<button class="small" data-action="dq-send" data-dq="' + esc(top.id) + '">' + I('send') + ' Send to Build backlog</button>' : '') + '<a class="small-txt" href="#/graph-x/quality" style="font-weight:600">Open data quality ' + I('arrowRight') + '</a></div></div></div>';
  }

  function resultsCard(G, R, kind) {
    if (!R) return '';
    const rows = R.rows || [];
    const tbl = rows.length ? '<div class="table-wrap"><table class="t"><thead><tr>' + R.cols.map((c) => '<th>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' +
      rows.map((r) => '<tr class="clickable' + (r.off ? ' gx-off' : '') + (r.id === this.ui.center ? ' sel' : '') + '" data-action="pick" data-id="' + esc(r.id) + '">' + r.cells.map((c) => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>'
      : '<div class="empty">' + esc(R.empty || 'No result.') + '</div>';
    return '<section class="gx-res" aria-label="Query and results">' +
      '<div class="gx-res-q"><div class="h">' + I(kind === 'search' ? 'search' : 'message') + (kind === 'search' ? ' Search' : ' Question') + '<button class="small on-dark" style="margin-left:auto" data-action="clear" aria-label="Clear the query">' + I('x') + ' Clear</button></div>' +
      '<div class="title">' + esc(R.title) + '</div>' +
      '<pre aria-label="Graph query">' + hlGql(R.gql) + '</pre>' +
      '<div class="meta"><span>read-only</span><span>' + (R.ms || (18 + (R.gql.length % 40))) + ' ms</span><span>' + rows.length + ' rows</span><span>as of ' + esc(CP.clock.label()) + '</span></div>' +
      '<div class="acts"><button class="small on-dark" data-action="copyq">' + I('file') + ' Copy query</button><button class="small on-dark" data-action="csv">' + I('arrowRight') + ' Export CSV</button></div></div>' +
      '<div class="gx-res-r"><div class="rh"><b>' + rows.length + ' result' + (rows.length === 1 ? '' : 's') + '</b><span class="small-txt muted">Click a row to centre the graph and open its 360</span></div>' +
      (R.note ? '<div class="note">' + esc(R.note) + '</div>' : '') + tbl + '</div></section>';
  }

  /* ======================================================================
     11. Screen
     ====================================================================== */
  const DEPTHS = [1, 2, 3];
  /* Mouse drag-to-pan on the canvas (one set of window listeners for the module). */
  let DRAG = null;
  window.addEventListener('pointermove', (ev) => { if (!DRAG) return; DRAG.el.scrollLeft = DRAG.l - (ev.clientX - DRAG.x); DRAG.el.scrollTop = DRAG.t - (ev.clientY - DRAG.y); });
  window.addEventListener('pointerup', () => { if (DRAG) { DRAG.el.classList.remove('drag'); DRAG = null; } });

  CP.screen({
    id: 'graph-x', part: 2, label: 'Graph', icon: 'network',
    ui: { center: null, depth: 2, edgeOn: {}, path: '', trail: [], active: null, routeKey: null, group: 'all', typed: '', view: null, needFit: true, focusSearch: false },

    defaultCenter() {
      const p = CP.player && CP.player.status && CP.player.status().scenario;
      return p ? ({ cti: 'mft-prd-01', identity: 'id-top17', regulator: 'tp-atlas', drift: 'id-ag-triage' }[p.id] || 'mft-prd-01') : 'mft-prd-01';
    },
    focus(id, depth, path) {
      const u = this.ui;
      if (u.center !== id) { u.trail = u.trail.filter((x) => x !== id).concat([id]).slice(-7); }
      u.center = id; if (depth) u.depth = depth; u.path = path || ''; u.needFit = true; u.view = null;
    },
    setActive(G, a) {
      this.ui.active = a;
      let R = null;
      if (a.kind === 'q') R = runQuestion(G, a.id);
      if (a.kind === 't') R = runTemplate(G, a.tpl, a.arg);
      if (R) this.focus(R.center, R.depth, R.path || '');
      if (a.kind === 'search') { const m = search(G, a.text, this.ui.group); if (m[0]) this.focus(m[0].id, Math.max(this.ui.depth, 1)); }
    },
    applyRoute(G, route) {
      const q = route.query || {};
      const key = JSON.stringify(q);
      if (key === this.ui.routeKey) return;
      this.ui.routeKey = key;
      if (q.ask && qById(q.ask)) { this.setActive(G, { kind: 'q', id: q.ask }); this.ui.typed = qById(q.ask).text; return; }
      if (q.id && G.nodes[q.id]) { this.ui.active = null; this.focus(q.id); this.ui.typed = G.nodes[q.id].label; return; }
      if (q.q) {
        this.ui.typed = q.q;
        const p = parseAsk(G, q.q);
        if (p) { this.setActive(G, p); return; }
        this.setActive(G, { kind: 'search', text: q.q });
      }
    },

    render(route) {
      const G = build();
      const sub = route.sub || 'explore';
      if (sub === 'explore') this.applyRoute(G, route);
      if (!this.ui.center || !G.nodes[this.ui.center]) { this.ui.center = this.defaultCenter(); this.ui.needFit = true; }
      const open = DQ.filter((d) => !blFor(d)).length;
      const role = CP.role(CP.currentRole) || {};
      const right = ui.av(role.persona, 'sm') + '<span>' + esc(role.label || '') + '</span>' + (RO() ? ui.tag(I('eye') + ' Read-only', 'outline') : '');
      const groups = [
        { label: 'Explore', tabs: [{ id: 'explore', label: 'Explorer', icon: 'network' }, { id: 'questions', label: 'Questions', icon: 'message', count: QS.length }] },
        { label: 'Trust the data', tabs: [{ id: 'quality', label: 'Data quality', icon: 'gauge', count: open || '', warn: true }, { id: 'model', label: 'Model & sources', icon: 'database' }] }
      ];
      const body = sub === 'questions' ? this.renderQuestions(G) : sub === 'quality' ? this.renderQuality(G) : sub === 'model' ? this.renderModel(G) : this.renderExplore(G);
      return ui.tabbar('graph-x', groups, sub, right) + '<div class="gx">' + (RO() ? '<div class="gx-ro">' + I('eye') + '<span><b>Read-only access (internal audit).</b> You can search, run questions, inspect provenance and export results; changes and backlog requests are disabled.</span></div>' : '') + body + '</div>';
    },

    renderExplore(G) {
      const u = this.ui;
      let R = null; let kind = '';
      if (u.active) {
        if (u.active.kind === 'q') { R = runQuestion(G, u.active.id); kind = 'q'; }
        else if (u.active.kind === 't') { R = runTemplate(G, u.active.tpl, u.active.arg); kind = 'q'; }
        else if (u.active.kind === 'search') {
          const m = search(G, u.active.text, u.group).slice(0, 25);
          kind = 'search';
          R = { title: 'Search: "' + u.active.text + '"', gql: 'MATCH (n)\nWHERE n.name CONTAINS "' + u.active.text.toLowerCase() + '"\n   OR n.alias CONTAINS "' + u.active.text.toLowerCase() + '"' + (u.group !== 'all' ? '\n  AND n:' + ({ asset: 'Asset', identity: 'Identity', app: 'Application', service: 'BusinessService', supplier: 'Supplier', vuln: 'Vulnerability', control: 'Control' }[u.group]) : '') + '\nRETURN n.name, labels(n), n.owner, n.criticality\nLIMIT 25',
            cols: ['Entity', 'Type', 'Detail', 'Owner', 'Criticality', 'Status now'],
            rows: m.map((n) => ({ id: n.id, cells: [lnk(G, n.id), esc(tLabel(n)), esc(n.sub), esc(n.ownerName || (n.ownerName === null ? 'Unknown' : '')), critTag(n.critLevel), flagTag(topFlag(n))], csv: [n.label, tLabel(n), n.sub, n.ownerName || '', n.critLevel || '', (topFlag(n) || {}).text || ''] })),
            note: m.length ? 'Best match centred in the graph. Try a question in plain words, for example "Blast radius of ' + m[0].label + '".' : '',
            empty: 'Nothing matches "' + u.active.text + '". Try an asset (mft-prd-01), an identity (t.op-17), a supplier (Atlas), a CVE or a business service.' };
        }
      }
      this._R = R;
      const path = pathFor(G, u.path, u.center);
      const L2 = layout(G, u.center, u.depth, u.edgeOn, path);
      const c = G.nodes[u.center];
      const counts = {}; L2.vis.forEach((id) => { const t = G.nodes[id].type; counts[t] = (counts[t] || 0) + 1; });
      const pathOpts = PATHS.filter((p) => pathFor(G, p.id, u.center)).map((p) => '<option value="' + p.id + '"' + (u.path === p.id ? ' selected' : '') + '>' + esc(p.label) + '</option>').join('');
      const toOpts = JEWELS.filter((j) => j !== u.center && G.nodes[j]).map((j) => '<option value="to:' + j + '"' + (u.path === 'to:' + j ? ' selected' : '') + '>' + esc(G.nodes[j].label) + '</option>').join('');
      const qcounts = {}; QS.forEach((q) => { const r = runQuestion(G, q.id); qcounts[q.id] = r ? r.rows.filter((x) => !x.off).length : 0; });

      const searchCard = '<section class="gx-search" data-tour="graph-search" aria-label="Search the security graph">' +
        '<form class="gx-sbox" data-gx-form role="search" autocomplete="off"><label class="sr" for="gx-q">Search entities or ask a question</label>' +
        '<div class="gx-sfield">' + I('search') + '<input id="gx-q" name="q" value="' + esc(u.typed || '') + '" placeholder="Search an asset, identity, supplier, CVE… or ask: Blast radius of mft-prd-01" aria-autocomplete="list" aria-controls="gx-sug" aria-expanded="false"><kbd>/</kbd><button type="submit" class="primary">' + I('arrowRight') + '<span class="sr">Search</span></button></div>' +
        '<div class="gx-sug" id="gx-sug" role="listbox" aria-label="Suggestions"></div></form>' +
        '<div class="gx-filters" role="group" aria-label="Entity type"><span class="lbl">Type</span>' + GROUPS.map((g) => '<button class="gx-chip' + (u.group === g[0] ? ' on' : '') + '" data-action="group" data-g="' + g[0] + '" aria-pressed="' + (u.group === g[0]) + '">' + (g[0] !== 'all' ? '<i style="background:' + T[g[0]].color + '"></i>' : '') + esc(g[1]) + '</button>').join('') + '</div>' +
        '<div class="gx-saved"><span class="lbl">' + I('message') + ' Saved questions</span>' + QS.map((q) => '<button class="gx-q' + (u.active && u.active.kind === 'q' && u.active.id === q.id ? ' on' : '') + '" data-action="ask" data-q="' + q.id + '">' + esc(q.text) + '<span class="n">' + qcounts[q.id] + '</span></button>').join('') + '</div></section>';

      const tools = '<div class="gx-tools">' +
        '<div class="grp"><span class="lbl">Depth</span><div class="gx-seg" role="group" aria-label="Depth">' + DEPTHS.map((d) => '<button class="' + (u.depth === d ? 'on' : '') + '" data-action="depth" data-d="' + d + '" aria-pressed="' + (u.depth === d) + '">' + d + ' hop' + (d > 1 ? 's' : '') + '</button>').join('') + '</div></div>' +
        '<div class="grp" role="group" aria-label="Edge types"><span class="lbl">Edges</span>' + Object.keys(E).map((k) => '<button class="gx-ef' + (u.edgeOn[k] !== false ? ' on' : '') + '" data-action="edge" data-e="' + k + '" aria-pressed="' + (u.edgeOn[k] !== false) + '"><i style="background:' + E[k].color + '"></i>' + esc(E[k].label) + '</button>').join('') + '</div>' +
        '<div class="grp" style="flex:1;min-width:220px"><span class="lbl">Path</span><label class="sr" for="gx-path">Highlight a path</label><select id="gx-path" data-change="path"><option value="">None</option>' + (pathOpts ? '<optgroup label="Attack and dependency paths">' + pathOpts + '</optgroup>' : '') + '<optgroup label="Shortest path from ' + esc(c.label) + ' to…">' + toOpts + '</optgroup></select></div></div>';

      const trail = '<div class="gx-trail" aria-label="Exploration trail">' + (u.trail.length > 1 ? '<button class="small" data-action="back" aria-label="Back to previous entity">' + I('chevronLeft') + '</button>' : '') +
        u.trail.filter((id) => G.nodes[id]).map((id, i, a) => (i ? '<span aria-hidden="true">›</span>' : '') + '<button class="' + (id === u.center ? 'cur' : '') + '" data-action="pick" data-id="' + esc(id) + '">' + esc(G.nodes[id].label) + '</button>').join('') + '</div>';

      const pathBar = path ? '<div class="gx-pathbar">' + I('workflow') + '<b>Path ' + (path.nodes.length - 1) + ' hops:</b>' + path.nodes.map((id, i) => (i ? '<span class="ar">' + I('arrowRight') + '</span>' : '') + '<span class="hop">' + tBadge(G.nodes[id], true) + esc(G.nodes[id].label) + '</span>').join('') + '<button class="small ghost" data-action="nopath" style="margin-left:auto">' + I('x') + ' Clear</button></div>' : '';

      const legendTypes = Object.keys(counts).filter((t) => t !== 'more').sort((a, b) => TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b));
      const legend = '<div class="gx-legend">' + legendTypes.map((t) => '<span><i style="border-color:' + T[t].color + '"></i>' + esc(T[t].label) + ' ' + counts[t] + '</span>').join('') +
        '<span style="margin-left:auto"><em style="background:#d8412f"></em>exposed</span><span><em style="background:#e09a1f"></em>mitigated / gap</span><span><em style="background:#088a42"></em>remediated</span><span><em style="background:#8d879d"></em>unknown owner / blocked</span></div>';

      const canvas = '<section class="gx-cv" data-tour="graph-canvas" aria-label="Neighbourhood graph">' +
        '<div class="gx-cv-h"><h2>' + I('network') + ' Neighbourhood of ' + esc(c.label) + '</h2><span class="small-txt muted">' + L2.vis.length + ' entities · ' + u.depth + ' hop' + (u.depth > 1 ? 's' : '') + '</span><span class="spacer"></span>' + trail + '</div>' +
        tools + pathBar +
        '<div class="gx-stage-wrap"><div class="gx-stage" tabindex="0" aria-label="Graph canvas: drag to pan, Ctrl and wheel to zoom">' + canvasSvg(G, L2, u.center, u.edgeOn, path) + '</div>' +
        '<div class="gx-zoom" role="group" aria-label="Zoom"><button data-action="zoom" data-z="in" aria-label="Zoom in" title="Zoom in">+</button><button data-action="zoom" data-z="out" aria-label="Zoom out" title="Zoom out">−</button><button data-action="zoom" data-z="fit" aria-label="Fit to view" title="Fit">' + I('target') + '</button></div>' +
        '<div class="gx-hint">Click a node to recentre · drag to pan · Ctrl + wheel to zoom</div></div>' + legend + '</section>';

      const log = changeLog(G);
      const low = '<div class="gx-low">' + ui.card(I('activity') + ' Graph changes', '<div class="gx-log">' + log.slice(0, 9).map((x) => '<div class="gx-log-i' + (x.item && CP.store.isNew(x.item, 6000) ? ' new' : '') + '"><span class="ts">' + esc(x.ts) + '</span><i class="d" style="background:' + x.color + '"></i><span class="tx">' + (G.nodes[x.id] ? '<button class="gx-link" style="font-weight:600;text-decoration:none;color:var(--ink)" data-action="pick" data-id="' + esc(x.id) + '">' + esc(x.text) + '</button>' : esc(x.text)) + '<small>' + esc(x.sub) + '</small></span></div>').join('') + '</div>', { sub: 'Live: scenario effects land here as the agents write to the graph', right: (G.st.s1 || G.st.s2 || G.st.gaps.length || G.st.dv) ? ui.tag('<span class="dot"></span> Live', 'green') : ui.tag('Baseline', 'outline') }) +
        ui.card(I('bot') + ' Same graph, humans and agents', '<p class="small-txt" style="margin:0 0 10px;color:#3b3550">Agents query this graph about 9,800 times a day (graph.query is granted to 8 of 16 agents, read-only). Every query is logged with the case it served, so "why did the agent think this server mattered?" has an answer.</p>' +
          ui.hbars([{ label: 'SOC Triage', value: 4120, color: CP.domain('soc').color }, { label: 'Access Review', value: 2310, color: CP.domain('iam').color }, { label: 'VulnOps', value: 1460, color: CP.domain('soc').color }, { label: 'CTI Analyst', value: 880, color: CP.domain('cti').color }, { label: 'TPRM', value: 610, color: CP.domain('grc').color }, { label: 'Humans', value: 430, color: CP.domain('human').color }], { unit: '' }) +
          '<div class="row" style="margin-top:10px"><a href="#/graph-x/questions" class="small-txt" style="font-weight:600">Open the query log ' + I('arrowRight') + '</a></div>', { sub: 'Queries today by caller' }) + '</div>';

      return ui.head('Work · Security graph', 'Graph explorer', 'Context one search away: owners, criticality, business services, exposures, suppliers and identities, with the source and freshness of every attribute. The same graph the agents use to decide.', '') +
        dqStrip(G) + searchCard + resultsCard.call(this, G, R, kind) +
        '<div class="gx-main">' + canvas + panel360(G, u.center) + '</div>' + low;
    },

    renderQuestions(G) {
      const groups = {}; QS.forEach((q) => { (groups[q.group] = groups[q.group] || []).push(q); });
      const cards = QS.map((q) => {
        const r = runQuestion(G, q.id); const n = r ? r.rows.filter((x) => !x.off).length : 0;
        const hot = (q.id === 'q-inet' && G.st.s1 && !G.st.patched) || (q.id === 'q-reach-top17' && G.st.s2) || (q.id === 'q-exit' && G.st.gaps.length);
        return '<article class="gx-qc"><div class="g"><span>' + esc(q.group) + '</span>' + (hot ? ui.tag('Live', 'green') : '') + '</div><h3>' + esc(q.text) + '</h3><p>' + esc(q.desc) + '</p>' +
          '<div class="f"><span class="big' + (q.id === 'q-inet' && n && !G.st.patched ? ' red' : '') + '">' + n + '</span><span>result' + (n === 1 ? '' : 's') + ' now</span><span class="spacer"></span><button class="primary small" data-action="ask" data-q="' + q.id + '">' + I('play') + ' Run</button></div></article>';
      }).join('');
      const log = queryLog(G);
      const tbl = '<div class="table-wrap gx-qlog" style="max-height:560px"><table class="t"><thead><tr><th>Time</th><th>Caller</th><th>Purpose</th><th>Query</th><th>Rows</th><th>Case</th></tr></thead><tbody>' +
        log.map((l) => '<tr class="' + (l.item && CP.store.isNew(l.item, 6000) ? 'new' : '') + '"><td class="mono small-txt">' + esc(l.ts) + '</td><td>' + ui.who(l.actor) + '</td><td>' + esc(l.purpose) + '</td><td><code title="' + esc(l.gql) + '">' + esc(l.gql) + '</code></td><td class="num">' + esc(l.rows) + (l.ms ? ' <span class="muted small-txt">· ' + l.ms + ' ms</span>' : '') + '</td><td>' + (l.cas ? caseLinks([l.cas]) || esc(l.cas) : '<span class="muted">·</span>') + '</td></tr>').join('') + '</tbody></table></div>';
      return ui.head('Graph · Questions', 'Questions people and agents ask', 'Saved questions run real graph queries on live data. Ask in plain words in the explorer ("Who runs FileBridge?", "Blast radius of swift-gw-01", "What can t.op-04 reach?"); the platform shows the query it ran, so nothing is a black box.', '<a href="#/graph-x" class="btn-demo" style="background:var(--indigo);color:#fff">' + I('network') + '<span class="lbl" style="display:inline">Open the explorer</span></a>') +
        '<div class="grid g-1-2" style="align-items:start"><div class="gx-qcards" style="grid-template-columns:1fr">' + cards + '</div>' +
        ui.card(I('list') + ' Query log', tbl, { sub: 'Every graph read, by humans and agents, with the case it served · scenario steps appear here as they run' }) + '</div>';
    },

    renderQuality(G) {
      const ro = RO();
      const conflicts = DQ.filter((d) => !d.unknown);
      const unk = DQ.filter((d) => d.unknown);
      const open = DQ.filter((d) => !blFor(d)).length;
      const actionCell = (d) => { const b = blFor(d); return b ? '<a href="#/build/backlog" class="tag green" style="text-decoration:none">' + I('check') + ' ' + esc(b.id) + ' · ' + esc(b.status) + '</a>' : (ro ? '<span class="muted small-txt">Read-only</span>' : '<button class="small" data-action="dq-send" data-dq="' + esc(d.id) + '">' + I('send') + ' Send to backlog</button>'); };
      const cTbl = '<div class="table-wrap"><table class="t"><thead><tr><th>Entity</th><th>Attribute</th><th>Source A</th><th>Source B</th><th>Rule applied</th><th>Fix</th><th></th></tr></thead><tbody>' +
        conflicts.map((d) => { const n = G.nodes[d.entity]; const at = n && n.attrs.find((a) => a.conflict && a.conflict.dq === d.id); return '<tr><td>' + lnk(G, d.entity) + '</td><td>' + esc(d.attr) + '</td><td><span class="gx-src">' + esc(SRC[d.a[0]]) + '</span><div class="small-txt">' + esc(d.a[1]) + ' <span class="muted">· ' + esc(d.a[2]) + '</span></div></td><td><span class="gx-src">' + esc(SRC[d.b[0]]) + '</span><div class="small-txt">' + esc(d.b[1]) + ' <span class="muted">· ' + esc(d.b[2]) + '</span></div></td><td class="small-txt">' + esc(at ? at.conflict.rule : 'Freshest authoritative source wins') + '</td><td class="small-txt">' + esc(d.fix) + '</td><td>' + actionCell(d) + '</td></tr>'; }).join('') + '</tbody></table></div>';
      const uTbl = '<div class="table-wrap"><table class="t"><thead><tr><th>Asset</th><th>Kind</th><th>Platform suggestion</th><th>Criticality</th><th></th></tr></thead><tbody>' +
        unk.map((d) => { const n = G.nodes[d.entity]; return '<tr><td>' + lnk(G, d.entity) + '</td><td class="small-txt">' + esc(n.sub) + '</td><td class="small-txt">' + esc(d.b[1]) + '<div class="muted">' + esc(d.fix) + '</div></td><td>' + critTag(n.critLevel) + '</td><td>' + actionCell(d) + '</td></tr>'; }).join('') + '</tbody></table></div>';
      const cov = [['Assets', 94.2, 95, '#2f7de1'], ['Identities', 99.1, 98, '#c43d8a'], ['Applications', 91.4, 95, '#451dc7'], ['Business services', 100, 100, '#088a42'], ['Suppliers', 95.3, 95, '#b8770f'], ['Controls', 88.0, 90, '#1597a5'], ['Vulnerabilities', 97.6, 95, '#d8412f']];
      const covH = '<div class="gx-cov">' + cov.map((c) => '<div class="gx-cov-r" title="' + esc(c[0] + ': ' + c[1] + '% (target ' + c[2] + '%)') + '"><span>' + esc(c[0]) + '</span><div class="bar" style="--c:' + c[3] + '"><span style="width:' + c[1] + '%"></span><em style="left:' + c[2] + '%"></em></div><b>' + c[1] + '%</b></div>').join('') + '<div class="small-txt muted">Coverage = entities with owner, criticality and at least one fresh source. Black tick: target.</div></div>';
      const conn = '<div class="table-wrap"><table class="t"><thead><tr><th>Connector</th><th>Feeds</th><th>Last sync</th><th>SLA</th><th>Status</th></tr></thead><tbody>' +
        CONNECTORS.map((c) => '<tr><td><b style="font-weight:600">' + esc(c[0] === 'ot' ? 'OT asset inventory' : SRC[c[0]]) + '</b></td><td class="small-txt">' + esc(c[1]) + '</td><td class="small-txt">' + esc(c[2] === 'not connected' ? c[2] : c[2] + ' ago') + '</td><td class="small-txt">' + esc(c[3] || '·') + '</td><td>' + (c[4] === 'ok' ? ui.tag('Healthy', 'green') : c[4] === 'warn' ? ui.tag('Late', 'amber') : ui.tag('B-311 in progress', 'outline')) + '</td></tr>').join('') + '</tbody></table></div>';
      return ui.head('Graph · Trust the data', 'Data quality', 'Agents act on what the graph says, so its quality is a security control. Conflicts are resolved by explicit precedence rules and shown, never hidden; fixes go to the Build backlog with one click.', '') +
        '<div class="metrics" style="grid-template-columns:repeat(4,minmax(0,1fr));margin-bottom:18px">' +
        ui.metric({ label: 'Coverage', icon: 'layers', value: '94.2', unit: '%', foot: 'assets with owner and criticality', spark: [91.0, 91.8, 92.4, 93.1, 93.6, 94.2], delta: '+3.2 pts', deltaDir: 'up' }) +
        ui.metric({ label: 'Freshness', icon: 'clock', value: '96.1', unit: '%', foot: 'attributes refreshed in 24 h · median 41 min' }) +
        ui.metric({ label: 'Unknown owners', icon: 'user', value: '312', foot: 'assets (1.7%) · ' + unk.length + ' suggested here', color: '#8a5a05' }) +
        ui.metric({ label: 'Open conflicts', icon: 'alert', value: String(21 + open), foot: open + ' in this view, others in triage', color: '#8a5a05' }) + '</div>' +
        '<div style="margin-bottom:18px">' + ui.card('Conflicting attributes', cTbl, { sub: 'Two sources disagree: the platform applies the precedence rule, keeps both values and asks for a fix' }) + '</div>' +
        '<div class="grid g-3-2" style="align-items:start"><div class="stack">' + ui.card('Unknown owners', uTbl, { sub: 'Assets nobody is accountable for: the first thing an incident needs and the last thing a CMDB knows' }) + ui.card('Coverage by entity type', covH, { sub: 'Graph-wide' }) + '</div>' + ui.card('Connectors feeding the graph', conn, { sub: 'Freshness against SLA' }) + '</div>';
    },

    renderModel(G) {
      const types = [
        ['asset', 'Assets', '18,420', 'Servers, network devices, cloud workloads, data stores', 'CMDB, EDR, cloud inventory, scanners'],
        ['identity', 'Identities', '61,000', '38,900 human · 21,300 service accounts · 16 agents', 'Identity provider, access governance, HR'],
        ['app', 'Applications', '2,150', 'In-house, vendor software and SaaS', 'CMDB, SaaS discovery'],
        ['service', 'Business services', '184', 'With RTO/RPO and DORA critical functions', 'Business impact analysis'],
        ['supplier', 'Suppliers', '1,240', 'ICT arrangements, sub-contracting chains', 'TPRM inventory, contracts, rating feeds'],
        ['vuln', 'Vulnerabilities & threats', '9,812', 'Open findings, CVEs, threat actors, indicators', 'Scanners, CTI feeds'],
        ['control', 'Controls', '1,436', 'WAF rules, detections, policies, SoD rules', 'WAF, SIEM, control library'],
        ['bu', 'Business units', '6', 'Owners of risk and services', 'HR, BIA']
      ];
      const rels = [['ROUTES_TO', 'net', 'Network reachability: internet, WAF, firewalls, zones', 48200], ['RUNS / HOSTS', 'runs', 'Asset runs software; supplier runs a product', 61400], ['SUPPORTS / FLOWS_TO', 'supports', 'Application supports a business service; data flows between applications', 9870], ['HAS_ACCESS', 'access', 'Identity has a right on an application or asset, with privilege', 1912000], ['PROVIDES / EXCHANGES_WITH', 'supplier', 'Supplier provides a service; business service exchanges with a supplier', 3860], ['STORES / ACCESSED', 'data', 'Where data lives, who touched it', 14300], ['AFFECTED_BY / EXPLOITS / PROBED', 'exposure', 'Vulnerabilities, threat actors and indicators', 112400], ['PROTECTED_BY / MONITORED_BY', 'control', 'Controls in front of or watching an entity', 26700]];
      const prec = [['PR-01', 'Owner', 'CMDB > ITSM change history > platform suggestion (needs human confirmation)'], ['PR-02', 'Internet-facing', 'Attack surface scan > firewall config > CMDB'], ['PR-03', 'Manager, department', 'HR system > identity provider'], ['PR-04', 'Software version', 'Vulnerability scanner > EDR > CMDB (freshest wins within 24 h)'], ['PR-05', 'Supplier software', 'Latest supplier attestation > TPRM inventory > contract annex'], ['PR-06', 'Criticality', 'Business impact analysis > CMDB'], ['PR-07', 'Data classification', 'Most restrictive observed value (DLP scan) > declared value']];
      return ui.head('Graph · Trust the data', 'Model & sources', 'What the graph knows, where each fact comes from, and which source wins when they disagree. Agents and humans read the same model through the same read-only API.', '') +
        '<div class="gx-types" style="margin-bottom:18px">' + types.map((t) => '<div class="gx-type">' + '<span class="gx-ti" style="background:' + T[t[0]].color + ';width:34px;height:34px;font-size:17px">' + I(T[t[0]].icon) + '</span><div><b>' + esc(t[1]) + '</b><div class="num">' + esc(t[2]) + '</div><small>' + esc(t[3]) + '</small><small>Sources: ' + esc(t[4]) + '</small></div></div>').join('') + '</div>' +
        '<div class="grid g2" style="align-items:start">' +
        ui.card('Relationship types', '<div class="table-wrap"><table class="t"><thead><tr><th>Relationship</th><th>Meaning</th><th>Edges</th></tr></thead><tbody>' + rels.map((r) => '<tr><td><span class="row" style="gap:8px"><i style="width:16px;height:3px;display:inline-block;background:' + E[r[1]].color + '"></i><code class="mono small-txt">' + esc(r[0]) + '</code></span></td><td class="small-txt">' + esc(r[2]) + '</td><td class="num small-txt">' + CP.fmt(r[3]) + '</td></tr>').join('') + '</tbody></table></div>', { sub: 'Edge counts graph-wide' }) +
        ui.card('Source precedence rules', '<div class="table-wrap"><table class="t"><thead><tr><th>Rule</th><th>Attribute</th><th>Order</th></tr></thead><tbody>' + prec.map((p) => '<tr><td class="mono small-txt" style="white-space:nowrap">' + esc(p[0]) + '</td><td><b style="font-weight:600">' + esc(p[1]) + '</b></td><td class="small-txt">' + esc(p[2]) + '</td></tr>').join('') + '</tbody></table></div><div class="notice info" style="margin-top:12px">Agent findings (forensic verdicts, owner suggestions, exit-plan gaps) are written as attributes with the agent as source and the case as evidence. They never overwrite an authoritative source silently.</div>', { sub: 'Versioned with the platform policies (Design)' }) + '</div>';
    },

    mount(root) {
      const self = this; const u = this.ui;
      const inp = root.querySelector('#gx-q'); const sug = root.querySelector('#gx-sug');
      if (inp && sug) {
        let items = []; let sel = -1;
        const G = build();
        const draw = () => {
          const v = inp.value.trim();
          if (!v) {
            items = QS.slice(0, 6).map((q) => ({ ask: q.id, label: q.text, sub: q.group }));
            sug.innerHTML = '<div class="gh">Saved questions</div>' + items.map((it, i) => '<button type="button" role="option" data-i="' + i + '" class="' + (i === sel ? 'on' : '') + '"><span class="gx-ti o ask" style="color:var(--indigo)">' + I('message') + '</span><span class="sx"><b>' + esc(it.label) + '</b><small>' + esc(it.sub) + '</small></span></button>').join('');
          } else {
            const p = parseAsk(G, v);
            const m = search(G, v, u.group).slice(0, 9);
            const qm = QS.filter((q) => (q.text + ' ' + q.keys.join(' ')).toLowerCase().indexOf(v.toLowerCase()) >= 0).slice(0, 3);
            items = [];
            if (p) items.push({ parsed: p, label: p.kind === 'q' ? qById(p.id).text : ({ blast: 'Blast radius of ', runs: 'Who runs ', reach: 'What can ' }[p.tpl] + G.nodes[p.arg].label + (p.tpl === 'reach' ? ' reach?' : p.tpl === 'runs' ? '?' : '')), sub: 'Run as a graph question' });
            qm.forEach((q) => { if (!p || p.kind !== 'q' || p.id !== q.id) items.push({ ask: q.id, label: q.text, sub: 'Saved question · ' + q.group }); });
            const byG = {};
            m.forEach((n) => { const g = T[n.type].g; (byG[g] = byG[g] || []).push(n); });
            let h = items.length ? '<div class="gh">Questions</div>' + items.map((it, i) => '<button type="button" role="option" data-i="' + i + '" class="' + (i === sel ? 'on' : '') + '"><span class="gx-ti o" style="color:var(--indigo)">' + I('message') + '</span><span class="sx"><b class="ask">' + esc(it.label) + '</b><small>' + esc(it.sub) + '</small></span></button>').join('') : '';
            GROUPS.slice(1).forEach((g) => {
              if (!byG[g[0]]) return;
              h += '<div class="gh">' + esc(g[1]) + '</div>';
              byG[g[0]].forEach((n) => { const i = items.length; items.push({ id: n.id }); const f = topFlag(n); h += '<button type="button" role="option" data-i="' + i + '" class="' + (i === sel ? 'on' : '') + '">' + tBadge(n) + '<span class="sx"><b>' + esc(n.label) + '</b><small>' + esc(tLabel(n) + ' · ' + n.sub) + '</small></span>' + (f ? flagTag(f) : critTag(n.critLevel)) + '</button>'; });
            });
            if (!m.length && !items.length) h = '<div class="gh">No match</div><div class="small-txt muted" style="padding:8px 12px 12px">Press Enter to search all attributes, or try "mft", "t.op-17", "Atlas", "CVE-2026".</div>';
            sug.innerHTML = h;
          }
          sug.classList.add('open'); inp.setAttribute('aria-expanded', 'true');
        };
        const close = () => { sug.classList.remove('open'); inp.setAttribute('aria-expanded', 'false'); sel = -1; };
        const choose = (it) => {
          close(); u.focusSearch = false;
          if (it.ask) { u.routeKey = null; CP.go('graph-x', null, { ask: it.ask }); return; }
          if (it.parsed) { u.routeKey = null; CP.go('graph-x', null, { q: inp.value.trim() }); return; }
          if (it.id) { u.routeKey = null; u.active = null; CP.go('graph-x', null, { id: it.id }); }
        };
        inp.addEventListener('input', () => { u.typed = inp.value; sel = -1; draw(); });
        inp.addEventListener('focus', () => { u.focusSearch = true; draw(); });
        inp.addEventListener('blur', () => { setTimeout(() => { if (document.activeElement !== inp) { close(); u.focusSearch = false; } }, 180); });
        inp.addEventListener('keydown', (ev) => {
          if (ev.key === 'ArrowDown') { ev.preventDefault(); sel = Math.min(items.length - 1, sel + 1); draw(); }
          else if (ev.key === 'ArrowUp') { ev.preventDefault(); sel = Math.max(-1, sel - 1); draw(); }
          else if (ev.key === 'Escape') { close(); }
          else if (ev.key === 'Enter' && sel >= 0 && items[sel]) { ev.preventDefault(); choose(items[sel]); }
        });
        sug.addEventListener('mousedown', (ev) => { const b = ev.target.closest('button[data-i]'); if (!b) return; ev.preventDefault(); choose(items[+b.dataset.i]); });
        root.querySelector('[data-gx-form]').addEventListener('submit', (ev) => {
          ev.preventDefault(); const v = inp.value.trim(); close(); u.focusSearch = false;
          u.routeKey = null; CP.go('graph-x', null, v ? { q: v } : null);
          if (!v) { u.active = null; }
        });
        if (u.focusSearch) { inp.focus(); const L0 = inp.value.length; try { inp.setSelectionRange(L0, L0); } catch (e) { /* not supported */ } }
        if (!self._slash) {
          self._slash = true;
          document.addEventListener('keydown', (ev) => {
            if (ev.key !== '/' || CP.route.id !== 'graph-x' || ev.target.closest('input,textarea,select,[contenteditable]')) return;
            const i = document.getElementById('gx-q'); if (i) { ev.preventDefault(); i.focus(); }
          });
        }
      }

      /* Canvas: fit, zoom, pan, keyboard */
      const stage = root.querySelector('.gx-stage'); const svg = stage && stage.querySelector('svg');
      if (stage && svg) {
        const vb = svg.dataset.vb.split(' ').map(Number);
        const vbo = { x: vb[0], y: vb[1], w: vb[2], h: vb[3], cx: vb[0] + vb[2] / 2, cy: vb[1] + vb[3] / 2 };
        let z = 1, x0 = vbo.x, y0 = vbo.y;
        const apply = (nz, px, py) => {
          z = Math.max(0.25, Math.min(2.2, nz));
          const cw = stage.clientWidth, ch = stage.clientHeight;
          const W = Math.max(vbo.w, cw / z), H = Math.max(vbo.h, ch / z);
          x0 = vbo.cx - W / 2; y0 = vbo.cy - H / 2;
          svg.setAttribute('viewBox', [x0, y0, W, H].map((v) => v.toFixed(1)).join(' '));
          svg.setAttribute('width', Math.round(W * z)); svg.setAttribute('height', Math.round(H * z));
          stage.scrollLeft = (px - x0) * z - cw / 2; stage.scrollTop = (py - y0) * z - ch / 2;
          u.view = { z, px, py };
        };
        const centerPt = () => ({ px: x0 + (stage.scrollLeft + stage.clientWidth / 2) / z, py: y0 + (stage.scrollTop + stage.clientHeight / 2) / z });
        const fit = () => { const f = Math.min(stage.clientWidth / vbo.w, stage.clientHeight / vbo.h); const narrow = stage.clientWidth < 600; apply(Math.max(narrow ? 0.55 : 0.42, Math.min(1.15, f)), narrow ? 0 : vbo.cx, narrow ? 0 : vbo.cy); };
        if (u.needFit || !u.view) { fit(); u.needFit = false; } else apply(u.view.z, u.view.px, u.view.py);
        self._zoom = (k) => { if (k === 'fit') { fit(); return; } const c = centerPt(); apply(z * (k === 'in' ? 1.25 : 0.8), c.px, c.py); };
        stage.addEventListener('scroll', () => { const c = centerPt(); u.view = { z, px: c.px, py: c.py }; }, { passive: true });
        stage.addEventListener('wheel', (ev) => { if (!ev.ctrlKey && !ev.metaKey) return; ev.preventDefault(); const c = centerPt(); apply(z * (ev.deltaY < 0 ? 1.12 : 0.89), c.px, c.py); }, { passive: false });
        stage.addEventListener('pointerdown', (ev) => { if (ev.pointerType !== 'mouse' || ev.button !== 0 || ev.target.closest('.gx-n')) return; DRAG = { el: stage, x: ev.clientX, y: ev.clientY, l: stage.scrollLeft, t: stage.scrollTop }; stage.classList.add('drag'); });
        stage.addEventListener('keydown', (ev) => {
          const g = ev.target.closest('.gx-n');
          if (g && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); g.dispatchEvent(new MouseEvent('click', { bubbles: true })); return; }
          if (ev.key === '+' || ev.key === '=') { ev.preventDefault(); self._zoom('in'); }
          if (ev.key === '-') { ev.preventDefault(); self._zoom('out'); }
          if (ev.key === '0') { ev.preventDefault(); self._zoom('fit'); }
        });
      }
      const p360 = root.querySelector('.gx-360');
      if (p360) { if (u.p360 && u.p360.id === u.center) p360.scrollTop = u.p360.top; p360.addEventListener('scroll', () => { u.p360 = { id: u.center, top: p360.scrollTop }; }, { passive: true }); }
    },

    actions: {
      node(el) {
        const id = el.dataset.id; const n = build().nodes[id];
        if (id.indexOf('more:') === 0) { this.focus(id.slice(5)); CP.render(); return; }
        if (!n) return;
        this.focus(id); this.ui.path = ''; CP.render();
      },
      pick(el) {
        const id = el.dataset.id;
        if (CP.route.sub && CP.route.sub !== 'explore') { this.ui.routeKey = null; this.ui.active = null; CP.go('graph-x', null, { id }); return; }
        const keepPath = this.ui.path && this.ui.path.indexOf('to:') !== 0 && (PATHS.find((p) => p.id === this.ui.path) || { nodes: [] }).nodes.indexOf(id) >= 0;
        const p = this.ui.path;
        this.focus(id); if (keepPath) this.ui.path = p;
        CP.render();
      },
      back() { const t = this.ui.trail; if (t.length < 2) return; t.pop(); const id = t[t.length - 1]; this.ui.center = id; this.ui.path = ''; this.ui.needFit = true; this.ui.view = null; CP.render(); },
      depth(el) { this.ui.depth = +el.dataset.d; this.ui.needFit = true; CP.render(); },
      edge(el) { const k = el.dataset.e; this.ui.edgeOn[k] = this.ui.edgeOn[k] === false; this.ui.needFit = true; CP.render(); },
      path(el) {
        const v = el.value; this.ui.path = v;
        const pr = PATHS.find((p) => p.id === v);
        if (pr && pr.center !== this.ui.center) { const keep = v; this.focus(pr.center); this.ui.path = keep; }
        this.ui.needFit = true; CP.render();
      },
      nopath() { this.ui.path = ''; CP.render(); },
      group(el) { this.ui.group = el.dataset.g; if (this.ui.active && this.ui.active.kind === 'search') { const m = search(build(), this.ui.active.text, this.ui.group); if (m[0]) this.focus(m[0].id); } CP.render(); },
      ask(el) { this.ui.routeKey = null; CP.go('graph-x', null, { ask: el.dataset.q }); },
      blast(el) { this.ui.routeKey = null; CP.go('graph-x', null, { q: 'Blast radius of ' + build().nodes[el.dataset.id].label }); },
      reach(el) { this.ui.routeKey = null; CP.go('graph-x', null, { q: 'What can ' + build().nodes[el.dataset.id].label + ' reach?' }); },
      runs(el) { this.ui.routeKey = null; CP.go('graph-x', null, { q: 'Who runs ' + build().nodes[el.dataset.id].label + '?' }); },
      clear() { this.ui.active = null; this.ui.typed = ''; this.ui.routeKey = null; CP.go('graph-x'); },
      zoom(el) { if (this._zoom) this._zoom(el.dataset.z); },
      share(el) {
        const url = location.href.split('#')[0] + '#/graph-x?id=' + encodeURIComponent(el.dataset.id);
        try { navigator.clipboard.writeText(url).then(() => CP.toast('Link copied: ' + url), () => CP.toast('Link: ' + url)); } catch (e) { CP.toast('Link: ' + url); }
      },
      copyq() {
        const R = this._R; if (!R) return;
        try { navigator.clipboard.writeText(R.gql).then(() => CP.toast('Query copied to the clipboard.'), () => CP.toast('Copy is blocked in this browser.', 'warn')); } catch (e) { CP.toast('Copy is blocked in this browser.', 'warn'); }
      },
      csv() {
        const R = this._R; if (!R) return;
        const q = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
        const lines = [R.cols.map(q).join(',')].concat(R.rows.map((r) => (r.csv || []).map(q).join(',')));
        const blob = new Blob(['# ' + R.title + ' · exported ' + CP.clock.label() + ' · Novalys security graph (simulated)\n' + lines.join('\n')], { type: 'text/csv' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'graph-' + R.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.csv';
        document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
        CP.toast('Exported ' + R.rows.length + ' rows (CSV)' + (RO() ? ', export logged in the audit trail.' : '.'));
      },
      'dq-send'(el) {
        if (RO()) { CP.toast('Read-only role: internal audit cannot raise backlog items.', 'warn'); return; }
        const d = DQ.find((x) => x.id === el.dataset.dq); if (!d || blFor(d)) return;
        const from = { ciso: 'ciso', engage: 'engage', build: 'build', run: 'run', trust: 'trust', analyst: 'run' }[CP.currentRole] || 'run';
        CP.store.apply({ op: 'add', coll: 'backlog', item: { id: d.bl, title: 'Graph data quality: ' + d.fix + ' (' + d.attr + ', ' + (build().nodes[d.entity] || {}).label + ')', domain: 'data', type: d.kind, from, priority: d.pr, status: 'new', effort: 'S', source: 'graph-x' } });
        CP.feed({ actor: (CP.role(CP.currentRole) || {}).persona, domain: 'data', level: 'action', text: 'sent a graph data-quality fix to the Build backlog: ' + d.fix + ' (' + d.bl + ').' });
        CP.toast('Sent to the Build backlog as ' + d.bl + ': ' + d.fix);
      }
    }
  });
})();
