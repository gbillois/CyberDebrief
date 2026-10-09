/* Cyber AI Platform demo: apps for the roles outside the CISO organisation.
   - Risk owner app (owner): the business decider (Head of Treasury) on a phone.
     Decisions framed in business terms, risk acceptances, service posture.
   - Supplier portal (supplier): the external view of Atlas Payroll Services.
     Pre-filled questionnaires, evidence, rating, messages, shared plan.
   - Evidence room (auditor): read-only third line view. Evidence with
     provenance, signed audit trail, sampling tool, AI register summary.
   Plain script, works from file://. */
(function () {
  'use strict';
  const CP = window.CP;
  const esc = CP.esc;
  const ui = CP.ui;
  const I = CP.icon;
  const get = (c) => CP.store.get(c);
  const find = (c, id) => CP.store.find(c, id);
  const pname = (id) => (CP.person(id) || {}).name || id;
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const DATES = { Mon: 'Monday 12 October', Tue: 'Tuesday 13 October', Wed: 'Wednesday 14 October', Thu: 'Thursday 15 October', Fri: 'Friday 16 October', Sat: 'Saturday 17 October', Sun: 'Sunday 18 October' };
  const pad = (n) => String(n).padStart(2, '0');

  /* ---------------- Shared helpers ---------------- */
  /* Sort key for "Tue 08:48" style stamps (no day = today, Tuesday). */
  function tsKey(ts) {
    const m = String(ts || '').match(/^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+)?(\d{1,2}):(\d{2})/);
    if (!m) return -1;
    return (m[1] ? DAYS.indexOf(m[1]) : 1) * 1440 + (+m[2]) * 60 + (+m[3]);
  }
  function hm(ts) { const m = String(ts || '').match(/(\d{1,2}):(\d{2})/); return m ? pad(m[1]) + ':' + m[2] : ''; }
  function dayOf(ts) { const m = String(ts || '').match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/); return m ? m[1] : 'Tue'; }
  function addMin(ts, n) {
    const m = String(ts || '').match(/(\d{1,2}):(\d{2})/); if (!m) return '';
    const t = (+m[1]) * 60 + (+m[2]) + n;
    return pad(Math.floor(t / 60) % 24) + ':' + pad(t % 60);
  }
  const clockLabel = () => (CP.clock ? CP.clock.label() : 'Tue 08:30');
  /* Deterministic 64-hex "SHA-256 looking" digest (simulation only). */
  function hx(s) {
    let out = '';
    for (let k = 0; k < 8; k++) {
      let h = (0x811c9dc5 ^ Math.imul(k + 1, 0x9e3779b1)) >>> 0;
      for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
      h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15;
      out += ('0000000' + (h >>> 0).toString(16)).slice(-8);
    }
    return out;
  }
  const shortHash = (s) => { const h = hx(s); return h.slice(0, 6) + '…' + h.slice(-4); };
  function rng(seedStr) {
    let a = parseInt(hx(seedStr).slice(0, 8), 16) >>> 0;
    return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const persona = (pid, extra) => { const p = CP.person(pid) || {}; return ui.av(pid, 'sm') + '<span><b style="color:var(--ink);font-weight:600">' + esc(p.name) + '</b> · ' + esc(p.title) + '</span>' + (extra || ''); };
  function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }

  CP.css('outside', `
/* ===== Risk owner app ===== */
.ow-wrap{display:grid;grid-template-columns:auto minmax(0,440px);gap:44px;justify-content:center;align-items:start;padding:6px 0 24px}
.ow-phone{width:414px;height:clamp(600px,calc(100vh - 128px),804px);position:sticky;top:116px;border:12px solid #17112b;border-radius:48px;background:#17112b;box-shadow:0 30px 80px #1a0e3d40,0 0 0 1px #3a3155 inset;flex:none}
.ow-notch{position:absolute;top:8px;left:50%;transform:translateX(-50%);width:118px;height:30px;background:#17112b;border-radius:16px;z-index:9}
.ow-screen{position:absolute;inset:0;background:#f6f5fa;border-radius:36px;overflow:hidden;display:flex;flex-direction:column}
.ow-status{height:46px;flex:none;display:flex;align-items:center;justify-content:space-between;padding:6px 26px 0 30px;font-size:14px;font-weight:650;color:var(--ink);background:#fff}
.ow-status .sig{display:flex;gap:5px;align-items:center}
.ow-status .sig i{display:inline-block;width:3px;background:var(--ink)}
.ow-status .bat{width:24px;height:11px;border:1.5px solid var(--ink);border-radius:3px;position:relative;margin-left:4px}
.ow-status .bat::after{content:'';position:absolute;inset:1.5px 6px 1.5px 1.5px;background:var(--ink);border-radius:1px}
.ow-head{flex:none;display:flex;align-items:center;gap:10px;padding:8px 16px 12px;background:#fff;border-bottom:1px solid var(--line)}
.ow-head .ow-logo{width:30px;height:30px;background:var(--indigo);color:#fff;display:grid;place-items:center;font-size:11px;font-weight:800;box-shadow:2px 2px 0 var(--green);flex:none}
.ow-head .ow-t{flex:1;min-width:0}
.ow-head .ow-t b{display:block;font-size:15px;letter-spacing:-.2px}
.ow-head .ow-t small{display:block;font-size:11.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ow-head .ow-back{min-height:34px;padding:0 8px;border:0;background:transparent;color:var(--indigo);font-size:14px}
.ow-body{flex:1;overflow:auto;overscroll-behavior:contain;position:relative}
.ow-pad{padding:14px 14px 20px;display:grid;gap:14px;align-content:start}
.ow-nav{flex:none;display:grid;grid-template-columns:repeat(4,1fr);background:#fff;border-top:1px solid var(--line);padding:6px 4px 14px}
.ow-nav a{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:11px;font-weight:600;color:var(--muted);text-decoration:none;padding:6px 2px;position:relative}
.ow-nav a .i{font-size:21px}
.ow-nav a.on{color:var(--indigo)}
.ow-nav a .bdg{position:absolute;top:1px;left:calc(50% + 6px);background:var(--red);color:#fff;font-size:10px;font-weight:700;min-width:17px;height:17px;display:grid;place-items:center;border-radius:9px;padding:0 4px}
.ow-hello small{font-size:12px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:1px}
.ow-hello h2{font-size:23px;letter-spacing:-.6px;margin:4px 0 4px;line-height:1.2}
.ow-hello p{margin:0;font-size:13.5px;color:#4a4560;line-height:1.5}
.ow-sec-t{font-size:11px;text-transform:uppercase;letter-spacing:1.3px;color:var(--muted);font-weight:700;margin:4px 0 -4px;display:flex;justify-content:space-between;align-items:center}
.ow-dcard{all:unset;box-sizing:border-box;display:block;cursor:pointer;background:#fff;border:1px solid #f1c27a;border-left:5px solid #ffb648;border-radius:14px;padding:14px 14px 12px;box-shadow:0 4px 14px #c8861a1c;animation:owpulse 1.8s infinite}
.ow-dcard:focus-visible{outline:3px solid #9173fa}
@keyframes owpulse{50%{box-shadow:0 0 0 4px #ffb64844}}
.ow-dcard .t{font-weight:700;font-size:16px;line-height:1.3;margin:6px 0 6px;color:var(--ink)}
.ow-dcard .m{display:flex;gap:8px;flex-wrap:wrap;align-items:center;font-size:12.5px;color:var(--muted)}
.ow-dcard .go{display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:13px;font-weight:650;color:var(--indigo)}
.ow-due{display:inline-flex;gap:5px;align-items:center;font-size:12px;font-weight:700;color:#8a5a05;background:var(--amber-50);padding:3px 8px;border-radius:20px}
.ow-due.red{color:var(--red-ink);background:var(--red-50)}
.ow-calm{background:#fff;border:1px solid var(--line);border-radius:14px;padding:18px;text-align:center}
.ow-calm>.i{font-size:30px;color:var(--green-ink)}
.ow-calm b{display:block;font-size:15px;margin:6px 0 4px}
.ow-calm p{margin:0;font-size:13px;color:var(--muted);line-height:1.5}
.ow-notes{background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden}
.ow-note{display:grid;grid-template-columns:30px 1fr auto;gap:10px;padding:12px 14px;border-bottom:1px solid var(--line-2);align-items:start;text-decoration:none;color:inherit}
.ow-note:last-child{border-bottom:0}
.ow-note .ic{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;background:var(--indigo-50);color:var(--indigo);font-size:15px}
.ow-note .ic.ok{background:var(--green-50);color:var(--green-ink)}
.ow-note .ic.warn{background:var(--amber-50);color:#8a5a05}
.ow-note .ic.bad{background:var(--red-50);color:var(--red-ink)}
.ow-note b{display:block;font-size:13.5px;line-height:1.35}
.ow-note span{display:block;font-size:12.5px;color:var(--muted);line-height:1.45;margin-top:2px}
.ow-note time{font-size:11.5px;color:var(--muted);white-space:nowrap;font-variant-numeric:tabular-nums}
.ow-note.new{animation:newrow 2.4s}
.ow-urgent{display:flex;gap:8px;align-items:center;background:#fff3dc;border:1px solid #f1c27a;border-radius:12px;padding:10px 12px;font-size:13px;font-weight:600;color:#7a4d00}
.ow-urgent.ok{background:var(--green-50);border-color:#a8e6c1;color:#116539}
.ow-urgent.ko{background:var(--red-50);border-color:#f0b9c3;color:var(--red-ink)}
.ow-h{font-size:21px;letter-spacing:-.5px;line-height:1.25;margin:0}
.ow-blk{background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px}
.ow-blk h3{font-size:11px;text-transform:uppercase;letter-spacing:1.3px;color:var(--indigo);margin:0 0 8px;display:flex;align-items:center;gap:6px}
.ow-blk p{margin:0;font-size:14px;line-height:1.55;color:#2f2a42}
.ow-blk ul{margin:0;padding-left:18px;font-size:14px;line-height:1.55;color:#2f2a42}
.ow-blk li+li{margin-top:4px}
.ow-stakes{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.ow-stake{background:var(--indigo-50);border-radius:10px;padding:10px 8px;text-align:center}
.ow-stake b{display:block;font-size:19px;color:var(--indigo);letter-spacing:-.5px;font-variant-numeric:tabular-nums}
.ow-stake span{display:block;font-size:11px;color:var(--muted);line-height:1.35;margin-top:2px}
.ow-pay{display:grid;grid-template-columns:1fr auto;gap:2px 10px;padding:9px 0;border-top:1px solid var(--line-2);font-size:13px}
.ow-pay b{font-variant-numeric:tabular-nums}
.ow-pay small{grid-column:1/-1;color:var(--muted);font-size:12px}
.ow-did{display:grid;grid-template-columns:44px 1fr;gap:8px;font-size:13px;line-height:1.45;padding:6px 0;border-top:1px dashed var(--line-2)}
.ow-did:first-of-type{border-top:0}
.ow-did time{font-family:var(--mono);font-size:11.5px;color:var(--green-ink);font-weight:600;padding-top:1px}
.ow-opt{border:1px solid var(--line);border-radius:12px;padding:12px;margin-top:8px}
.ow-opt.rec{border-color:var(--green-ink);background:#f3fff8}
.ow-opt .ot{display:flex;justify-content:space-between;align-items:center;gap:8px;font-weight:700;font-size:14.5px}
.ow-opt ul{margin:6px 0 0;font-size:13px}
.ow-rec{background:var(--dark);color:#fff;border-radius:14px;padding:14px}
.ow-rec h3{color:var(--green)}
.ow-rec p{color:#ece6ff}
.ow-rec .conf{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:12px;color:#cfc6ea}
.ow-rec .conf .bar{flex:1;height:6px;background:#ffffff26;border-radius:3px;overflow:hidden}
.ow-rec .conf .bar span{display:block;height:100%;background:var(--green)}
.ow-chips{display:flex;gap:6px;flex-wrap:wrap}
.ow-chip{font-size:12px;padding:4px 9px;border-radius:20px;background:#efedf6;color:#4a4560;font-weight:550}
.ow-act{position:sticky;bottom:0;background:linear-gradient(#f6f5fa00,#f6f5fa 18%);padding:16px 14px 12px;display:grid;gap:8px;z-index:3}
.ow-big{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ow-big button{min-height:56px;font-size:15.5px;justify-content:center;border-radius:14px;font-weight:700}
.ow-big button.go{box-shadow:0 6px 16px #04f06a40}
.ow-sec2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ow-sec2 button{border-radius:12px;justify-content:center;min-height:44px;font-size:13px}
.ow-foot{font-size:11.5px;color:var(--muted);line-height:1.5;text-align:center;padding:0 6px}
.ow-card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px}
.ow-card .top{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}
.ow-card .id{font-family:var(--mono);font-size:11px;color:var(--muted)}
.ow-card b.tt{display:block;font-size:14.5px;line-height:1.35;margin:3px 0 6px}
.ow-card p{margin:0 0 6px;font-size:13px;line-height:1.5;color:#3b3550}
.ow-card .btns{display:flex;gap:8px;margin-top:10px}
.ow-card .btns button{flex:1;justify-content:center;border-radius:10px}
.ow-card.warn{border-color:#f1c27a;border-left:4px solid #ffb648}
.ow-card.bad{border-color:#f0b9c3;border-left:4px solid var(--red)}
.ow-card.req{border-color:var(--indigo);border-left:4px solid var(--indigo)}
.ow-svc{all:unset;box-sizing:border-box;cursor:pointer;display:grid;grid-template-columns:12px 1fr auto;gap:12px;align-items:center;background:#fff;border:1px solid var(--line);border-radius:14px;padding:13px 14px;width:100%}
.ow-svc:focus-visible{outline:3px solid #9173fa}
.ow-svc .dot{width:12px;height:12px;border-radius:50%}
.ow-svc b{display:block;font-size:14px}
.ow-svc span{display:block;font-size:12.5px;color:var(--muted);line-height:1.4;margin-top:2px}
.ow-svc .st{font-size:12px;font-weight:700;text-align:right;white-space:nowrap}
.ow-svc.new{animation:newrow 2.4s}
.ow-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.ow-kpi{background:#fff;border:1px solid var(--line);border-radius:12px;padding:10px;text-align:center}
.ow-kpi b{display:block;font-size:20px;color:var(--indigo);letter-spacing:-.5px}
.ow-kpi span{font-size:11px;color:var(--muted);line-height:1.3;display:block}
.ow-hist{display:grid;grid-template-columns:auto 1fr;gap:4px 10px;padding:12px 14px;border-bottom:1px solid var(--line-2);font-size:13px}
.ow-hist:last-child{border-bottom:0}
.ow-hist time{font-size:11.5px;color:var(--muted);font-variant-numeric:tabular-nums;grid-column:1/-1}
.ow-hist b{font-size:13.5px;line-height:1.35}
.ow-hist small{grid-column:1/-1;color:var(--muted);font-size:12px;line-height:1.4}
.ow-scrim{position:absolute;inset:0;background:#140b2b66;z-index:20;border:0;padding:0;margin:0;min-height:0;width:100%;cursor:default}
.ow-scrim:hover{background:#140b2b66}
.ow-sheet{position:absolute;left:0;right:0;bottom:0;max-height:86%;overflow:auto;background:#fff;border-radius:20px 20px 0 0;z-index:21;padding:10px 16px 18px;box-shadow:0 -10px 40px #1a0e3d33;animation:owsheet .22s ease-out}
@keyframes owsheet{from{transform:translateY(40px);opacity:.4}}
.ow-sheet .grab{width:40px;height:5px;background:#d9d5e4;border-radius:3px;margin:0 auto 10px}
.ow-sheet h3{font-size:17px;margin:0 0 6px;letter-spacing:-.3px}
.ow-sheet p{font-size:13.5px;line-height:1.55;margin:0 0 10px;color:#3b3550}
.ow-sheet .full{width:100%;justify-content:center;min-height:50px;border-radius:12px;font-size:15px;margin-top:8px}
.ow-face{display:flex;gap:10px;align-items:center;background:var(--indigo-50);border-radius:12px;padding:10px 12px;font-size:12.5px;color:#3b3550;margin:8px 0}
.ow-face .i{font-size:24px;color:var(--indigo)}
.ow-chat{display:grid;gap:8px;margin:8px 0}
.ow-msg{max-width:86%;padding:9px 12px;border-radius:14px;font-size:13.5px;line-height:1.5}
.ow-msg.me{justify-self:end;background:var(--indigo);color:#fff;border-bottom-right-radius:4px}
.ow-msg.bot{justify-self:start;background:#f1eff7;color:var(--ink);border-bottom-left-radius:4px}
.ow-msg.bot small{display:block;font-size:11px;color:var(--muted);margin-top:4px}
.ow-sugg{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}
.ow-sugg button{border-radius:20px;font-size:12.5px;min-height:32px;padding:.3rem .75rem;font-weight:550}
.ow-input{display:flex;gap:6px;margin-top:8px}
.ow-input input{flex:1;border:1px solid var(--line);border-radius:12px;padding:10px 12px;font-size:14px;min-width:0}
.ow-input button{border-radius:12px}
.ow-call{position:absolute;inset:0;background:linear-gradient(#211248,#140b2f);color:#fff;z-index:30;display:flex;flex-direction:column;align-items:center;padding:90px 24px 40px;text-align:center}
.ow-call .av{width:92px;height:92px;border-radius:50%;font-size:22px;min-width:92px}
.ow-call h3{font-size:24px;margin:18px 0 4px;color:#fff}
.ow-call p{color:#cfc6ea;font-size:14px;margin:0 0 6px;line-height:1.5}
.ow-call .shared{margin-top:22px;background:#ffffff14;border-radius:14px;padding:12px 14px;font-size:13px;text-align:left;line-height:1.5;color:#e5def8}
.ow-call .cbtns{margin-top:auto;display:flex;gap:28px}
.ow-call .cbtns button{width:66px;height:66px;border-radius:50%;justify-content:center;font-size:22px;border:0}
.ow-call .cbtns .hang{background:var(--red);color:#fff}
.ow-call .cbtns .mute{background:#ffffff26;color:#fff}
.ow-call .cbtns small{display:block;font-size:11.5px;color:#cfc6ea;margin-top:6px}
.ow-lock{position:absolute;inset:0;z-index:25;background:radial-gradient(circle at 30% 20%,#3b2391,#140b2f 70%);color:#fff;display:flex;flex-direction:column;align-items:center;padding:70px 16px 30px}
.ow-lock .lt{font-size:76px;font-weight:300;letter-spacing:-3px;line-height:1;font-variant-numeric:tabular-nums}
.ow-lock .ld{font-size:16px;color:#e5def8;margin-top:6px}
.ow-push{all:unset;box-sizing:border-box;cursor:pointer;display:block;width:100%;background:#ffffffe8;color:var(--ink);border-radius:18px;padding:12px 14px;margin-top:34px;box-shadow:0 10px 30px #0006;animation:owdrop .5s ease-out}
.ow-push:focus-visible{outline:3px solid var(--green)}
@keyframes owdrop{from{transform:translateY(-30px);opacity:0}}
.ow-push .ph{display:flex;align-items:center;gap:8px;font-size:11.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;font-weight:600}
.ow-push .ph .ow-logo{width:20px;height:20px;background:var(--indigo);color:#fff;display:grid;place-items:center;font-size:8px;font-weight:800;border-radius:5px}
.ow-push .ph time{margin-left:auto;text-transform:none;letter-spacing:0}
.ow-push b{display:block;font-size:14.5px;margin:6px 0 2px;line-height:1.3}
.ow-push span{display:block;font-size:13px;line-height:1.4;color:#3b3550}
.ow-lock .hint{margin-top:auto;font-size:13px;color:#cfc6ea;display:flex;flex-direction:column;align-items:center;gap:8px}
.ow-lock .hint .i{font-size:30px;color:#fff}
.ow-pushbar{position:absolute;left:10px;right:10px;top:50px;z-index:15}
.ow-pushbar .ow-push{margin:0;background:#fff;border:1px solid #f1c27a}
.ow-side{display:grid;gap:16px;align-content:start;padding-top:4px}
.ow-side .card h2{font-size:22px;letter-spacing:-.5px;margin:0 0 8px;line-height:1.25}
.ow-side .card p{margin:0 0 10px;font-size:14px;color:#3b3550}
.ow-anat{display:grid;gap:0;counter-reset:a;margin-top:6px}
.ow-anat div{display:grid;grid-template-columns:26px 1fr;gap:8px;padding:7px 0;border-top:1px solid var(--line-2);font-size:13px;line-height:1.45}
.ow-anat div::before{counter-increment:a;content:counter(a);width:22px;height:22px;background:var(--indigo-50);color:var(--indigo);display:grid;place-items:center;font-size:11px;font-weight:700}
.ow-anat b{font-weight:650}
.ow-demo{display:none!important;margin:12px auto 0}
.ow-try{background:var(--dark);color:#fff;padding:16px 18px;border-top:3px solid var(--green)}
.ow-try b{display:block;font-size:15px;margin-bottom:4px}
.ow-try p{font-size:13px;color:#cfc6ea;margin:0 0 12px;line-height:1.5}
@media(max-width:1100px){.ow-wrap{grid-template-columns:auto;justify-items:center}.ow-phone{position:relative;top:auto}.ow-side{max-width:640px}}
@media(max-width:600px){
  main.view:has(.ow-wrap) .subnav{display:none}
  .ow-wrap{display:block;margin:-6px -14px 0;padding:0}
  .ow-phone{width:auto;height:auto;border:0;border-radius:0;box-shadow:none;background:transparent}
  .ow-notch,.ow-status,.ow-lock,.ow-side{display:none}
  .ow-demo{display:inline-flex!important}
  .ow-screen{position:static;border-radius:0;overflow:visible;min-height:calc(100vh - 110px)}
  .ow-head{position:sticky;top:96px;z-index:12}
  .ow-body{overflow:visible;padding-bottom:70px}
  .ow-nav{position:fixed;left:0;right:0;bottom:0;z-index:60;padding-bottom:10px;box-shadow:0 -6px 20px #1a0e3d14}
  .ow-act{bottom:62px}
  .ow-pushbar{position:sticky;top:150px;left:auto;right:auto;margin:10px 10px 0}
  .ow-scrim{position:fixed;z-index:90}
  .ow-sheet{position:fixed;z-index:91;max-height:84vh}
  .ow-call{position:fixed;z-index:95}
}

/* ===== Supplier portal ===== */
.sp-ext{display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:#fff4df;border:1px solid #f1c27a;border-left:5px solid var(--amber);padding:10px 14px;margin:0 0 18px;font-size:13px;color:#5c3b00}
.sp-ext b{font-size:12px;text-transform:uppercase;letter-spacing:1.3px;color:#8a5a05;display:flex;align-items:center;gap:7px}
.sp-ext .sp-x{margin-left:auto;display:flex;gap:6px;flex-wrap:wrap}
.sp-brand{display:flex;align-items:center;gap:14px;margin-bottom:18px;flex-wrap:wrap}
.sp-logo{width:46px;height:46px;background:#c8861a;color:#fff;display:grid;place-items:center;font-weight:800;font-size:15px;letter-spacing:-.4px;flex:none}
.sp-brand h1{margin:0;font-size:26px}
.sp-brand .sub{font-size:13px;color:var(--muted);margin-top:2px}
.sp-brand .acts{margin-left:auto;display:flex;gap:8px;flex-wrap:wrap}
.sp-alert{display:flex;gap:12px;align-items:flex-start;padding:14px 16px;background:#fff0f2;border:1px solid #f0b9c3;border-left:5px solid var(--red);margin-bottom:18px}
.sp-alert .i{font-size:20px;color:var(--red-ink);margin-top:1px}
.sp-alert b{display:block;font-size:15px;margin-bottom:3px}
.sp-alert p{margin:0;font-size:13.5px;line-height:1.55;color:#4a2530}
.sp-alert p b{display:inline;font-size:inherit;margin:0}
.sp-alert.ok{background:var(--green-50);border-color:#a8e6c1;border-left-color:var(--green-ink)}
.sp-alert.ok .i{color:var(--green-ink)}
.sp-alert.ok p{color:#1f4d33}
.sp-req{display:grid;grid-template-columns:34px minmax(0,1fr) 140px 150px auto;gap:12px;align-items:center;padding:13px 4px;border-bottom:1px solid var(--line-2)}
.sp-req:last-child{border-bottom:0}
.sp-req .ic{width:34px;height:34px;display:grid;place-items:center;background:var(--indigo-50);color:var(--indigo);font-size:16px}
.sp-req .ic.urg{background:var(--red-50);color:var(--red-ink)}
.sp-req .ic.done{background:var(--green-50);color:var(--green-ink)}
.sp-req b{display:block;font-size:14px;font-weight:600;line-height:1.35}
.sp-req small{display:block;font-size:12.5px;color:var(--muted);margin-top:2px;line-height:1.4}
.sp-req .dl{font-size:12.5px;line-height:1.4}
.sp-req .dl span{display:block;color:var(--muted);font-size:11.5px}
.sp-req.new{animation:newrow 2.4s}
.sp-qs{display:grid;grid-template-columns:270px minmax(0,1fr);gap:18px;align-items:start}
.sp-qlist{display:grid;gap:8px}
.sp-qbtn{all:unset;box-sizing:border-box;cursor:pointer;display:block;background:#fff;border:1px solid var(--line);padding:12px 14px}
.sp-qbtn:hover{border-color:var(--indigo)}
.sp-qbtn:focus-visible{outline:3px solid #9173fa}
.sp-qbtn.on{border-color:var(--indigo);box-shadow:inset 4px 0 var(--indigo);background:#faf8ff}
.sp-qbtn b{display:block;font-size:13.5px;line-height:1.35}
.sp-qbtn small{display:block;font-size:12px;color:var(--muted);margin:3px 0 6px}
.sp-ai{display:flex;gap:10px;align-items:flex-start;background:#f3f0fd;border:1px solid #ddd3fb;padding:10px 12px;font-size:12.5px;line-height:1.55;color:#3b3550;margin-bottom:14px}
.sp-ai .i{font-size:18px;color:var(--indigo);margin-top:1px}
.sp-q{border:1px solid var(--line);background:#fff;padding:14px 16px;margin-bottom:10px}
.sp-q.ok{border-left:4px solid var(--green-ink)}
.sp-q.fix{border-left:4px solid var(--indigo)}
.sp-q.todo{border-left:4px solid #ffb648}
.sp-q .qh{display:flex;gap:10px;align-items:flex-start}
.sp-q .qn{font-family:var(--mono);font-size:11.5px;color:var(--muted);padding-top:2px;flex:none}
.sp-q .qt{font-weight:600;font-size:14px;line-height:1.45;flex:1}
.sp-q .ans{margin:10px 0 0 26px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.sp-q .val{background:#f7f6fb;border:1px solid var(--line);padding:8px 10px;font-size:13.5px;font-weight:600;flex:1;min-width:200px}
.sp-q .val.empty{color:var(--muted);font-weight:500;font-style:italic;background:#fffaf0;border-style:dashed}
.sp-q .src{margin:8px 0 0 26px;display:flex;gap:6px;flex-wrap:wrap;align-items:center;font-size:11.5px;color:var(--muted)}
.sp-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;padding:2px 7px;border:1px solid #d9d1f3;background:#fff;color:#4a3a7a;white-space:nowrap}
.sp-q select,.sp-q input[type=text]{border:1px solid var(--indigo);padding:8px 10px;font-size:13.5px;flex:1;min-width:200px;background:#fff}
.sp-submit{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:14px 16px;background:var(--dark);color:#fff;border-top:3px solid var(--green);margin-top:6px}
.sp-submit .t{flex:1;min-width:200px;font-size:13px;color:#cfc6ea}
.sp-submit .t b{color:#fff;font-size:14.5px;display:block}
.sp-upl{border:2px dashed #cfc6ea;background:#fbfaff;padding:20px;text-align:center}
.sp-upl .i{font-size:28px;color:var(--indigo)}
.sp-upl p{margin:6px 0 12px;font-size:13px;color:var(--muted)}
.sp-upl .row{justify-content:center;flex-wrap:wrap}
.sp-upl select{border:1px solid var(--line);padding:8px 10px;font-size:13px;max-width:100%}
.sp-filebtn{display:inline-flex;align-items:center;gap:7px;background:var(--indigo);color:#fff;font-size:.84rem;font-weight:600;padding:.55rem .8rem;min-height:36px;cursor:pointer}
.sp-filebtn:hover{background:var(--indigo-700)}
input.sp-file:focus-visible+label{outline:3px solid #9173fa;outline-offset:2px}
.sp-comp{display:grid;grid-template-columns:minmax(0,1.2fr) 70px minmax(0,1.6fr) auto;gap:12px;align-items:center;padding:11px 0;border-bottom:1px solid var(--line-2);font-size:13px}
.sp-comp:last-child{border-bottom:0}
.sp-comp b{font-weight:600}
.sp-comp .sc{font-variant-numeric:tabular-nums;font-weight:700}
.sp-comp .tip{color:#3b3550;line-height:1.45}
.sp-comp .tip em{font-style:normal;color:var(--green-ink);font-weight:700}
.sp-thread{display:grid;gap:12px;max-height:620px;overflow:auto;padding:4px 4px 4px 0}
.sp-m{max-width:78%;border:1px solid var(--line);background:#fff;padding:12px 14px}
.sp-m.in{justify-self:start;border-left:4px solid var(--indigo)}
.sp-m.out{justify-self:end;background:#fff8ea;border-color:#f1c27a;border-right:4px solid var(--amber)}
.sp-m .mh{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:12px;color:var(--muted);margin-bottom:6px}
.sp-m .mh b{color:var(--ink);font-size:12.5px}
.sp-m .ms{font-weight:650;font-size:14px;margin-bottom:4px}
.sp-m .mb{font-size:13px;line-height:1.55;white-space:pre-wrap;color:#3b3550}
.sp-m.new{animation:newrow 2.4s}
.sp-compose{display:grid;gap:8px;margin-top:14px}
.sp-compose textarea{border:1px solid var(--line);padding:10px 12px;font-size:13.5px;min-height:90px;resize:vertical;width:100%}
.sp-steps{display:grid;gap:0;margin:8px 0 4px}
.sp-step{display:grid;grid-template-columns:28px minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px 0;border-top:1px solid #f3d3da}
.sp-step .n{width:26px;height:26px;display:grid;place-items:center;font-size:12px;font-weight:700;background:#fff;border:1px solid #f0b9c3;color:var(--red-ink)}
.sp-step.done .n{background:var(--green-ink);border-color:var(--green-ink);color:#fff}
.sp-step b{font-size:13.5px;display:block}
.sp-step small{font-size:12px;color:var(--muted);display:block;line-height:1.4}
.sp-flow{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12.5px;margin:10px 0 4px}
.sp-flow span.n{border:1px solid var(--line);background:#fff;padding:6px 10px;font-weight:600}
.sp-flow span.q{border:1px solid #f0b9c3;background:var(--red-50);color:var(--red-ink);padding:6px 10px;font-weight:700}
.sp-flow span.okz{border:1px solid #a8e6c1;background:var(--green-50);color:#116539;padding:6px 10px;font-weight:700}
@media(max-width:1100px){.sp-qs{grid-template-columns:minmax(0,1fr)}.sp-req{grid-template-columns:34px minmax(0,1fr) auto}.sp-req .dl,.sp-req .stc{grid-column:2}.sp-comp{grid-template-columns:1fr 60px}.sp-comp .tip{grid-column:1/-1}}
@media(max-width:600px){.sp-chip{white-space:normal}.sp-q .val{min-width:0;flex-basis:100%}.sp-m{max-width:94%}.sp-brand h1{font-size:21px}.sp-brand .acts{margin-left:0}.sp-req{grid-template-columns:30px minmax(0,1fr)}.sp-req>*:last-child{grid-column:2}.sp-q .ans,.sp-q .src{margin-left:0}}

/* ===== Evidence room ===== */
.ar-ro{display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:#f1eff6;border:1px solid var(--line);border-left:5px solid #514c63;padding:10px 14px;margin:0 0 18px;font-size:13px;color:#3b3550}
.ar-ro b{font-size:12px;text-transform:uppercase;letter-spacing:1.3px;color:#3a3550;display:flex;align-items:center;gap:7px}
.ar-ro .ar-links{margin-left:auto;display:flex;gap:8px;flex-wrap:wrap}
.ar-ro .ar-links a{font-size:12.5px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:5px;border:1px solid var(--line);background:#fff;padding:5px 9px;color:var(--indigo)}
.ar-ro .ar-links a:hover{border-color:var(--indigo)}
.ar-ver{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:650;color:#116539;background:var(--green-50);padding:2px 6px;white-space:nowrap}
.ar-ver.run{color:#8a5a05;background:var(--amber-50)}
.ar-hash{font-family:var(--mono);font-size:11.5px;color:#4a3a7a;word-break:break-all}
.ar-type{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:650;white-space:nowrap}
.ar-type .i{font-size:13px}
.ar-filters{display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;margin-bottom:12px}
.ar-filters label{font-size:11.5px;color:var(--muted);display:flex;flex-direction:column;gap:3px}
.ar-filters select,.ar-filters input{border:1px solid var(--line);background:#fff;padding:7px 9px;font-size:13px;min-height:34px}
.ar-filters input{min-width:220px}
.ar-cust{display:grid;gap:0;margin-top:6px}
.ar-cust div{display:grid;grid-template-columns:22px 92px minmax(0,1fr);gap:10px;padding:8px 0;border-top:1px dashed var(--line-2);font-size:12.5px;line-height:1.45;align-items:start}
.ar-cust div:first-child{border-top:0}
.ar-cust .d{width:10px;height:10px;background:var(--indigo);margin:4px 0 0 5px}
.ar-cust .d.ok{background:var(--green-ink)}
.ar-cust .d.me{background:#514c63}
.ar-cust time{font-family:var(--mono);font-size:11.5px;color:var(--muted)}
.ar-ev{border:1px solid var(--line);padding:12px 14px;margin-bottom:10px;background:#fff}
.ar-ev .eh{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px}
.ar-ev .eh b{font-size:14px}
.ar-ev .kv{font-size:12.5px;gap:4px 14px}
.ar-tools{display:grid;gap:4px;margin:4px 0}
.ar-tools div{display:grid;grid-template-columns:22px minmax(0,1fr) auto;gap:8px;font-size:12.5px;align-items:center;padding:6px 8px;background:#f7f6fb;border:1px solid var(--line-2)}
.ar-tools code{font-family:var(--mono);font-size:12px;color:var(--indigo);font-weight:600}
.ar-tools small{color:var(--muted);font-size:11.5px}
.ar-samp-head{display:grid;grid-template-columns:repeat(4,minmax(0,1fr)) auto;gap:12px;align-items:end;margin-bottom:14px}
.ar-samp-head label{font-size:11.5px;color:var(--muted);display:flex;flex-direction:column;gap:4px;font-weight:600}
.ar-samp-head select,.ar-samp-head input{border:1px solid var(--line);background:#fff;padding:8px 10px;font-size:13px;min-height:36px;width:100%}
.ar-res select{border:1px solid var(--line);background:#fff;padding:4px 6px;font-size:12.5px}
.ar-res select.pass{border-color:var(--green-ink);background:var(--green-50);color:#116539;font-weight:650}
.ar-res select.exc{border-color:var(--red);background:var(--red-50);color:var(--red-ink);font-weight:650}
.ar-concl{padding:12px 14px;font-size:13.5px;line-height:1.55;border-left:4px solid var(--line);background:#fbfafc;margin-top:12px}
.ar-concl.ok{border-color:var(--green-ink);background:var(--green-50)}
.ar-concl.ko{border-color:var(--red);background:#fff1f3}
.ar-pack{border:1px solid var(--line);background:#fff;padding:16px;display:grid;gap:8px}
.ar-pack.live{border-top:3px solid var(--indigo)}
.ar-pack.new{animation:newrow 2.4s}
.ar-pack h3{margin:0;font-size:15px}
.ar-pack .meta{font-size:12.5px;color:var(--muted);line-height:1.5}
.ar-log{display:grid;gap:0;font-size:12.5px}
.ar-log div{display:grid;grid-template-columns:72px minmax(0,1fr);gap:8px;padding:6px 0;border-top:1px dashed var(--line-2)}
.ar-log div:first-child{border-top:0}
.ar-log time{font-family:var(--mono);font-size:11.5px;color:var(--muted)}
.ar-nw,.ar-root .case-link{white-space:nowrap}
.ar-res,.sp-q,.ow-input,.sp-upl,.ar-filters,.sp-compose{position:relative}
.ar-split{grid-template-columns:minmax(0,3fr) minmax(260px,1fr)}
@media(max-width:1100px){.ar-samp-head{grid-template-columns:1fr 1fr}.ar-nw,.ar-root .case-link{white-space:nowrap}
.ar-split{grid-template-columns:1fr}}
@media(max-width:600px){.ar-samp-head{grid-template-columns:1fr}.ar-filters input{min-width:0;width:100%}.ar-filters label{flex:1 1 140px}.ar-cust div{grid-template-columns:22px minmax(0,1fr)}.ar-cust div>span:last-child{grid-column:2}}
`);

  /* =====================================================================
     1. RISK OWNER APP (Head of Treasury, business owner of Payments)
     ===================================================================== */

  /* Business framing of the decisions a risk owner receives. Written by the
     platform from the case facts; keyed by approval id. */
  const FRAME = {
    'AP-ID-HOLD': {
      push: 'Possible payment fraud: 3 payments (€4.2 M) wait for your decision',
      headline: 'Hold 3 payments (€4.2 M) and suspend a hijacked Treasury account?',
      stake: '€4.2 M',
      minutes: 15,
      happened: [
        'At 02:12 an attacker got into the account of one of your payment approvers (t.op-17) by flooding the operator with login requests until one was accepted.',
        'The platform locked the attacker out by 02:14. Nobody else in your team is affected.',
        'Before that, this account approved 3 payments worth €4.2 M. They are still in the queue for the 06:00 cut-off: nothing has left the bank yet.'
      ],
      stakes: [['€4.2 M', '3 payments in the 06:00 queue'], ['2 of 3', 'beneficiaries created yesterday'], ['1,200', 'client bank details copied']],
      payments: [
        ['PAY-77120', '€1.90 M', 'New beneficiary created Tue 17:48 · bank never used by Novalys', 'high'],
        ['PAY-77124', '€1.55 M', 'New beneficiary created Tue 18:02', 'high'],
        ['PAY-77131', '€0.75 M', 'Known supplier, bank details unchanged since 2023', 'low']
      ],
      options: [
        { key: 'approve', label: 'Hold and suspend', rec: true, cons: ['The 3 payments wait until 10:00; your desk calls the beneficiaries back from 07:00', 'Possible late-payment fees on 1 payment (about €3k)', 'The operator is suspended until a supervised re-onboarding'] },
        { key: 'reject', label: 'Release the payments', cons: ['Payments leave at the 06:00 cut-off', 'If fraudulent, recovery chances are below 20% once sent', 'The platform raises fraud monitoring on the 3 beneficiaries'] }
      ],
      recommendation: 'Hold. Two beneficiaries were created yesterday by the same account and one bank is new for Novalys. Holding costs a few hours; releasing could cost €3.45 M.',
      confidence: 0.91,
      noAnswer: 'You get a call at {d5}. If you still cannot answer, the CISO on duty is called at {d10}. The payments stay in the queue meanwhile; at 05:30 the safe default for payments above €1 M applies: hold.',
      reversible: 'Yes. Held payments can be released in one tap until the 10:00 cut-off, one by one or all together. The suspension is lifted by the identity team after a supervised re-onboarding.',
      informed: ['CISO on duty (in the loop)', 'Business CISO · Payments & Treasury', 'DPO (client data copied)'],
      right: 'Freeze outgoing payments · L1 · Head of Treasury',
      did: {
        'id-3': 'Locked the attacker out: all sessions cut, unknown device blocked.',
        'id-4': 'Removed a hidden email rule that was hiding payment confirmations from you.',
        'id-5': 'Blocked the attacker\'s address; 4 other Treasury accounts it tried are protected.',
        'id-6': 'Measured what was copied: 37 files, 1,200 client bank details. The DPO is informed.'
      },
      qa: [
        ['Is the attacker still in?', 'No. Every session of the account was cut by 02:14, the device is blocked and the attacker\'s address is blocked since 02:18. No activity on the account since 02:14.'],
        ['Can I release only the known supplier payment?', 'Yes. PAY-77131 (€0.75 M) goes to a known supplier with unchanged bank details: the platform rates it low risk. Approve the hold now, then release PAY-77131 from this app at 07:00 in one tap.'],
        ['Who else knows?', 'The CISO on duty sees this decision live. The Business CISO for Payments and the DPO are informed. Nobody outside Novalys has been contacted.'],
        ['Has this happened before?', 'Not in Treasury. The same technique hit Retail Banking twice in 2026; both times it was contained before any payment left.']
      ],
      outcomeOk: ['Account suspended and 3 payments held at {t}.', 'Your desk is briefed at 07:00 with the list of beneficiaries to call back.', 'The decision is signed and stored in the audit trail.'],
      outcomeKo: ['Payments released at {t} by your decision.', 'Fraud monitoring is raised on the 3 beneficiaries for 30 days.', 'The decision is signed and stored in the audit trail.']
    }
  };
  function frameFor(a) {
    if (FRAME[a.id]) return FRAME[a.id];
    return {
      push: a.title, headline: a.title, stake: '', minutes: 30, happened: [a.summary || ''], stakes: [], payments: [],
      options: [{ key: 'approve', label: a.approveLabel || 'Approve', rec: true, cons: a.impacts || [] }, { key: 'reject', label: a.rejectLabel || 'Reject', cons: ['The platform applies the fallback agreed in the policy'] }],
      recommendation: a.recommendation || '', confidence: 0.85, noAnswer: 'The CISO on duty is called at {d10}.', reversible: 'See the case for rollback options.',
      informed: ['CISO on duty'], right: (a.autonomy || 'L1') + ' · ' + pname(a.decider), did: {}, qa: [], outcomeOk: ['Decision recorded at {t}.'], outcomeKo: ['Decision recorded at {t}.']
    };
  }
  const ownerApprovals = () => get('approvals').filter((a) => a.role === 'owner');
  const ownerPending = () => CP.store.pendingApprovals('owner');
  function deadlineOf(a) { const f = frameFor(a); return addMin(a.createdAt, f.minutes || 15); }

  /* Static owner data: risk acceptances and exceptions held by the Head of Treasury. */
  const RISKS = [
    { id: 'RA-121', kind: 'Exception', title: 'Push login approval still allowed for 41 Treasury operators', why: 'Phishing-resistant security keys are back-ordered until November.', residual: 'High · an attacker can wear an operator down with login requests', comp: 'Number matching, sign-in risk policy, 24/7 monitoring', expires: 'Fri 30 Oct', days: 17, owner: 'p-hugo' },
    { id: 'RA-114', kind: 'Risk acceptance', title: 'SWIFT gateway server runs an operating system out of vendor support', why: 'Migration to the new gateway is planned for December 2026.', residual: 'Medium · up to €1.5 M (fraud through a compromised gateway), unlikely', comp: 'Isolated network segment, application allowlisting, 24/7 monitoring', expires: 'Mon 26 Oct', days: 13, owner: 'p-hugo' },
    { id: 'EX-2207', kind: 'Exception', title: 'Treasury file share can be shared with 2 correspondent banks', why: 'Needed for daily liquidity reporting until the secure portal is live.', residual: 'Low · data leak limited to liquidity reports', comp: 'Data-loss monitoring on the share, monthly access review', expires: 'Thu 31 Dec', days: 79, owner: 'p-hugo' },
    { id: 'RA-098', kind: 'Risk acceptance', title: 'Payment hub admin sessions are not recorded', why: 'Session recording arrives with the new privileged access tool (Q1 2027).', residual: 'Medium · an admin misuse would be hard to prove', comp: 'Daily review of admin actions by the Identity agents', expires: 'Fri 8 Jan', days: 87, owner: 'p-hugo', renewedOn: 'Thu 8 Oct' }
  ];
  const HISTORY = [
    { ts: 'Mon 12 Oct · 18:05', title: 'Blocked a payment to a newly created beneficiary flagged by fraud scoring (€380k)', out: 'approved', took: '3 min', note: 'Beneficiary confirmed fraudulent the next morning.' },
    { ts: 'Thu 8 Oct · 11:20', title: 'Renewed risk acceptance RA-098 (admin sessions not recorded) for 3 months', out: 'approved', took: '6 min', note: 'Compensating control: daily review by the Identity agents.' },
    { ts: 'Tue 29 Sep · 16:40', title: 'Freeze card processing during a supplier outage (impact €2.1 M per hour)', out: 'rejected', took: '9 min', note: 'Alternative chosen: rate limiting plus enhanced monitoring.' },
    { ts: 'Thu 17 Sep · 09:12', title: 'Emergency re-enrolment of 41 Treasury operators to number matching', out: 'approved', took: '2 min', note: '' }
  ];

  function ownerServices() {
    const c2302 = find('cases', 'C-2302'), c2301 = find('cases', 'C-2301');
    const pay = find('thirdParties', 'tp-paycore') || {};
    const pq = (pay.questionnaire || {}).status;
    const out = [];
    let payState = 'ok', payText = 'No attack in progress. 3 open findings, none urgent.', payFind = ['Admin sessions not recorded (your risk acceptance RA-098)', '2 service accounts with passwords older than 1 year (fix planned Nov)', 'Payment file signing key rotates in 21 days (scheduled)'];
    if (c2302) {
      const held = find('actions', 'A-9877');
      payState = c2302.status === 'open' ? (ownerPending().length ? 'attack' : 'contained') : 'contained';
      payText = c2302.status === 'open' && !held ? 'A Treasury account was hijacked at 02:12. The attacker is locked out; your decision on 3 payments is pending.' : 'Attacked at 02:12, contained at 02:14.' + (held ? ' 3 payments held by your decision.' : '');
      payFind = ['Hijacked approver account t.op-17: contained, decision ' + (held ? 'taken' : 'pending'), '1,200 client bank details copied: the DPO is assessing a notification', '27 people can both create and approve a beneficiary (fix proposed)'].concat(payFind.slice(0, 1));
    }
    out.push({ id: 'svc-pay', name: 'Payment hub · SEPA and SWIFT payments', crit: 'Critical', state: payState, text: payText, findings: payFind, item: c2302 });
    let mftState = 'ok', mftText = 'Exchanges files with 14 suppliers. No known exposure.', mftFind = ['TLS configuration reviewed in September: compliant'];
    if (c2301) {
      const patched = find('actions', 'A-9836'), vp = find('actions', 'A-9830');
      mftState = patched ? 'ok' : vp ? 'contained' : 'risk';
      mftText = patched ? 'Targeted by a zero-day on Tue: blocked at 08:48, patched at 09:12. Probed, not compromised.' : vp ? 'Zero-day on the file transfer server: blocked by a virtual patch at 08:48, real patch pending.' : 'Zero-day on the file transfer server, protection in progress.';
      mftFind = ['CVE-2026-41877 on mft-prd-01: ' + (patched ? 'patched (change CHG-88412)' : 'virtual patch W-121 in place'), 'One probe seen 3 days ago, answered with an error: no impact'];
    }
    out.push({ id: 'svc-mft', name: 'Supplier file exchange', crit: 'Critical', state: mftState, text: mftText, findings: mftFind, item: c2301 });
    out.push({ id: 'svc-swift', name: 'SWIFT gateway', crit: 'Critical', state: 'risk', text: 'Server on an operating system out of vendor support (your risk acceptance RA-114, expires 26 Oct). Compensated by isolation and monitoring.', findings: ['Operating system out of vendor support until the December migration', 'Monitoring and allowlisting checked weekly: effective'] });
    let cardState = 'ok', cardText = 'Run by PayCore Processing. Supplier rating 82, above the 70 threshold.';
    if (pq === 'sent' || pq === 'draft') { cardState = 'risk'; cardText = 'PayCore Processing uses the file transfer product hit by Tuesday\'s zero-day. Waiting for its answer.'; }
    if (pq === 'answered') cardText = 'PayCore Processing confirmed on Tue it is patched against the zero-day (checked by the platform).';
    out.push({ id: 'svc-card', name: 'Card processing (outsourced)', crit: 'Critical', state: cardState, text: cardText, findings: ['Supplier rating 82 / 100', pq === 'answered' ? 'Zero-day questionnaire: answered, patched' : 'Annual assessment: done Mar 2026'], item: pay });
    out.push({ id: 'svc-cash', name: 'Cash management and Treasury dealing', crit: 'High', state: 'ok', text: 'No attack in progress. 1 open finding: a dealing app library to update (planned 22 Oct).', findings: ['Dealing app: outdated library, fix planned 22 Oct'] });
    return out;
  }
  const SVC_STATE = { ok: ['var(--green-ink)', 'Protected'], risk: ['#c8861a', 'At risk'], contained: ['#c8861a', 'Attacked · contained'], attack: ['var(--red)', 'Under attack'] };

  CP.screen({
    id: 'owner', part: 2, role: 'owner', label: 'Risk owner app', icon: 'user',
    ui: { scroll: {}, unlocked: {}, sheet: null, call: null, chat: {}, draft: '', renewed: {}, expired: {}, toxic: null, released: {}, lastKey: '' },

    render(route) {
      const sub = route.sub || 'decisions';
      const pend = ownerPending();
      const tabs = [
        { id: 'decisions', label: 'Decisions', icon: 'bell', count: pend.length || '', warn: true },
        { id: 'risks', label: 'My risks', icon: 'shield' },
        { id: 'services', label: 'My services', icon: 'activity' },
        { id: 'history', label: 'History', icon: 'clock' }
      ];
      return ui.tabbar('owner', [{ label: 'Phone app', tabs }], sub === 'decide' ? 'decisions' : sub, persona('p-hugo')) +
        '<div class="ow-wrap">' + this.phone(route, sub, pend) + this.side(pend) + '</div>';
    },

    /* ---------- The phone ---------- */
    phone(route, sub, pend) {
      const t = hm(clockLabel());
      let body = '', head;
      const a = sub === 'decide' ? (find('approvals', route.query.id) || pend[0] || ownerApprovals()[0]) : null;
      if (sub === 'decide') {
        head = '<button class="ow-back" data-go="owner/decisions" aria-label="Back to decisions">' + I('chevronLeft') + ' Decisions</button><div class="ow-t"><b>Decision</b><small>' + esc(a ? a.id : '') + '</small></div>';
        body = this.vDecide(a);
      } else {
        head = '<span class="ow-logo" aria-hidden="true">AI</span><div class="ow-t"><b>Novalys Cyber</b><small>Risk owner · Payments &amp; Treasury</small></div>' + ui.av('p-hugo');
        body = sub === 'risks' ? this.vRisks() : sub === 'services' ? this.vServices() : sub === 'history' ? this.vHistory() : this.vInbox(pend);
      }
      const nav = [['decisions', 'bell', 'Decisions'], ['risks', 'shield', 'My risks'], ['services', 'activity', 'Services'], ['history', 'clock', 'History']].map((n) => {
        const on = n[0] === sub || (n[0] === 'decisions' && sub === 'decide');
        return '<a href="' + CP.href('owner', n[0]) + '" class="' + (on ? 'on' : '') + '"' + (on ? ' aria-current="page"' : '') + '>' + I(n[1]) + '<span>' + n[2] + '</span>' + (n[0] === 'decisions' && pend.length ? '<span class="bdg">' + pend.length + '</span>' : '') + '</a>';
      }).join('');
      const fresh = pend.find((x) => !this.ui.unlocked[x.id]);
      const push = fresh && sub !== 'decide' ? '<div class="ow-pushbar">' + this.pushCard(fresh, t) + '</div>' : '';
      const lock = fresh && sub !== 'decide' ? '<div class="ow-lock" role="dialog" aria-label="Lock screen with a notification"><div class="lt">' + esc(t) + '</div><div class="ld">' + esc(DATES[dayOf(clockLabel())] || '') + '</div>' + this.pushCard(fresh, 'now') +
        '<div class="hint">' + I('fingerprint') + 'Tap the notification · face recognition unlocks</div></div>' : '';
      return '<div class="ow-phone" data-tour="owner-phone" role="region" aria-label="Risk owner app">' +
        '<div class="ow-notch" aria-hidden="true"></div><div class="ow-screen">' +
        '<div class="ow-status" aria-hidden="true"><span>' + esc(t) + '</span><span class="sig"><i style="height:5px"></i><i style="height:7px"></i><i style="height:9px"></i><i style="height:11px"></i><span style="font-size:12px;margin-left:4px">5G</span><span class="bat"></span></span></div>' +
        '<header class="ow-head">' + head + '</header>' + push +
        '<div class="ow-body" data-k="' + esc(sub + (a ? a.id : '')) + '">' + body + '</div>' +
        '<nav class="ow-nav" aria-label="App sections">' + nav + '</nav>' +
        this.sheet() + this.callView() + lock + '</div></div>';
    },
    pushCard(a, time) {
      const f = frameFor(a);
      return '<button class="ow-push" data-action="owUnlock" data-id="' + esc(a.id) + '"><span class="ph"><span class="ow-logo">AI</span>Novalys Cyber · decision<time>' + esc(time) + '</time></span><b>' + esc(f.push) + '</b><span>Answer by ' + esc(deadlineOf(a)) + '. The platform recommends: ' + esc((f.options.find((o) => o.rec) || {}).label || '') + '.</span></button>';
    },

    vInbox(pend) {
      const t = hm(clockLabel()), h = +t.slice(0, 2);
      const hello = '<div class="ow-hello"><small>' + esc(dayOf(clockLabel())) + ' · ' + esc(t) + '</small><h2>' + (pend.length ? (pend.length === 1 ? 'One decision needs you' : pend.length + ' decisions need you') : (h < 6 ? 'All quiet tonight' : 'Nothing needs you right now')) + '</h2><p>' +
        (pend.length ? 'Everything else was handled by the platform. Each decision below is explained in business terms, with a recommendation.' : 'The platform performed ' + CP.fmt(CP.store.state.kpis.actionsToday) + ' security actions today. None needed a business decision from you.') + '</p></div>';
      const cards = pend.map((a) => {
        const f = frameFor(a), rec = f.options.find((o) => o.rec) || {};
        return '<button class="ow-dcard" data-action="owOpen" data-id="' + esc(a.id) + '"><span class="m"><span class="ow-due red">' + I('clock') + ' Answer by ' + esc(deadlineOf(a)) + '</span><span>' + esc(f.minutes) + ' min</span>' + (f.stake ? '<span>· ' + esc(f.stake) + ' at stake</span>' : '') + '</span>' +
          '<div class="t">' + esc(f.headline) + '</div><span class="m">' + I('bot') + ' Recommended: <b style="color:var(--ink)">' + esc(rec.label || '') + '</b> · confidence ' + Math.round((f.confidence || 0.85) * 100) + '%</span>' +
          '<span class="go">Review and decide ' + I('chevronRight') + '</span></button>';
      }).join('');
      const calm = pend.length ? '' : '<div class="ow-calm">' + I('shieldCheck') + '<b>Your services are protected</b><p>You only get a notification when a decision is above the threshold you own: money, payments, or a key business account.</p><button class="small ow-demo" data-action="owSimulate">' + I('play') + ' Demo: run S2 to the 2 a.m. decision</button></div>';
      const notes = this.notes();
      return '<div class="ow-pad">' + hello + cards + calm +
        '<div class="ow-sec-t"><span>Updates · no action needed</span><span>' + notes.length + '</span></div>' +
        '<div class="ow-notes">' + notes.map((n) => '<a class="ow-note' + (n.cls || '') + '" href="' + n.href + '"><span class="ic ' + (n.tone || '') + '">' + I(n.icon) + '</span><span><b>' + esc(n.t) + '</b><span>' + esc(n.s) + '</span></span><time>' + esc(n.ts) + '</time></a>').join('') + '</div></div>';
    },
    notes() {
      const out = [];
      const c2302 = find('cases', 'C-2302');
      if (c2302) out.push({ icon: 'shieldCheck', tone: 'ok', t: 'Containment done without waking you', s: 'Attacker locked out, hidden email rule removed, attacker address blocked (02:14 to 02:18).', ts: '02:18', href: CP.href('owner', 'services'), cls: ui.newCls(c2302) });
      const dec = ownerApprovals().filter((a) => a.status !== 'pending');
      dec.forEach((a) => out.push({ icon: a.status === 'approved' ? 'check' : 'x', tone: a.status === 'approved' ? 'ok' : 'warn', t: (a.status === 'approved' ? 'You approved: ' : 'You rejected: ') + frameFor(a).headline.replace(/\?$/, ''), s: 'Executed by the platform and signed in the audit trail.', ts: hm(a.decidedAt), href: '#/owner/decide?id=' + a.id, cls: ui.newCls(a) }));
      const b315 = find('backlog', 'B-315');
      if (b315) out.push({ icon: 'alert', tone: 'warn', t: 'Your position is requested on a risk', s: '27 people in your teams can both create and approve a beneficiary.', ts: '03:13', href: CP.href('owner', 'risks'), cls: ui.newCls(b315) });
      const c2301 = find('cases', 'C-2301');
      if (c2301) {
        const patched = find('actions', 'A-9836');
        out.push({ icon: patched ? 'shieldCheck' : 'shield', tone: patched ? 'ok' : 'warn', t: 'Zero-day on your supplier file exchange', s: patched ? 'Blocked at 08:48, patched at 09:12 with the CISO\'s approval. Probed, not compromised.' : 'Blocked by a virtual patch at 08:48; the real patch is decided by the CISO.', ts: patched ? '09:12' : '08:48', href: CP.href('owner', 'services'), cls: ui.newCls(c2301) });
        const pay = find('thirdParties', 'tp-paycore');
        if (pay && (pay.questionnaire || {}).status === 'answered') out.push({ icon: 'building', tone: 'ok', t: 'Card processing supplier confirmed it is patched', s: 'PayCore Processing answered within 4 hours; answer checked against the evidence.', ts: '12:42', href: CP.href('owner', 'services'), cls: ui.newCls(pay) });
      }
      if (!this.ui.renewed['RA-114'] && !this.ui.expired['RA-114']) out.push({ icon: 'hourglass', tone: 'warn', t: 'Risk acceptance RA-114 expires in 13 days', s: 'SWIFT gateway on an unsupported system. Renew or let it expire.', ts: 'Mon', href: CP.href('owner', 'risks') });
      out.push({ icon: 'file', t: 'Monthly cyber review of Payments & Treasury is ready', s: 'Risk index 66, down 4 points in 6 months (lower is better).', ts: 'Mon', href: CP.href('owner', 'services') });
      return out;
    },

    vDecide(a) {
      if (!a) return '<div class="ow-pad"><div class="ow-calm">' + I('checkCircle') + '<b>No decision here</b><p>When the platform needs a business decision from you, it appears here with everything you need to decide in minutes.</p></div></div>';
      const f = frameFor(a), dl = deadlineOf(a), pending = a.status === 'pending';
      const fill = (s) => String(s).replace('{d5}', addMin(a.createdAt, 5)).replace('{d10}', addMin(a.createdAt, 10)).replace('{t}', hm(a.decidedAt) || dl);
      let strip;
      if (pending) strip = '<div class="ow-urgent">' + I('clock') + '<span>Answer by <b>' + esc(dl) + '</b> · ' + esc(f.minutes) + ' min · the CISO on duty sees it too</span></div>';
      else strip = '<div class="ow-urgent ' + (a.status === 'approved' ? 'ok' : 'ko') + '">' + I(a.status === 'approved' ? 'checkCircle' : 'x') + '<span>Decided at ' + esc(hm(a.decidedAt)) + ' by ' + esc(a.decidedBy === 'p-hugo' || !a.decidedBy ? 'you' : pname(a.decidedBy)) + ': <b>' + esc(a.status === 'approved' ? (a.approveLabel || 'Approved') : (a.rejectLabel || 'Rejected')) + '</b></span></div>';
      const did = get('traces').filter((t) => t.scenario === a.scenario && f.did[t.id.replace(/^tr-/, '')]).map((t) => '<div class="ow-did"><time>' + esc(hm(t.ts)) + '</time><span>' + esc(f.did[t.id.replace(/^tr-/, '')]) + '</span></div>').join('');
      const blk = (title, icon, inner) => '<section class="ow-blk"><h3>' + I(icon) + esc(title) + '</h3>' + inner + '</section>';
      let html = '<div class="ow-pad">' + strip + '<h2 class="ow-h">' + esc(f.headline) + '</h2>' +
        blk('What happened', 'info', '<ul>' + f.happened.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>') +
        (f.stakes.length || f.payments.length ? blk('What is at stake', 'euro', (f.stakes.length ? '<div class="ow-stakes">' + f.stakes.map((s) => '<div class="ow-stake"><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></div>').join('') + '</div>' : '') +
          (f.payments.length ? '<div style="margin-top:10px">' + f.payments.map((p) => '<div class="ow-pay"><span class="mono" style="font-size:12px">' + esc(p[0]) + ' ' + (p[3] === 'high' ? ui.tag('High risk', 'red') : ui.tag('Low risk', 'green')) + '</span><b>' + esc(p[1]) + '</b><small>' + esc(p[2]) + '</small></div>').join('') + '</div>' : '')) : '') +
        (did ? blk('Already done by the platform', 'shieldCheck', did) : '') +
        blk('Your options', 'scale', f.options.map((o) => '<div class="ow-opt' + (o.rec ? ' rec' : '') + '"><div class="ot"><span>' + esc(o.label) + '</span>' + (o.rec ? ui.tag(I('check') + ' Recommended', 'green') : '') + '</div><ul>' + o.cons.map((c) => '<li>' + esc(c) + '</li>').join('') + '</ul></div>').join('')) +
        '<section class="ow-blk ow-rec"><h3>' + I('bot') + 'Platform recommendation</h3><p>' + esc(f.recommendation) + '</p><div class="conf"><span>Confidence</span><span class="bar"><span style="width:' + Math.round(f.confidence * 100) + '%"></span></span><b style="color:#fff">' + Math.round(f.confidence * 100) + '%</b></div></section>' +
        blk('If you do not answer by ' + dl, 'hourglass', '<p>' + esc(fill(f.noAnswer)) + '</p>') +
        blk('Can it be undone?', 'rollback', '<p>' + esc(f.reversible) + '</p>') +
        blk('Who is informed', 'users', '<div class="ow-chips">' + f.informed.map((x) => '<span class="ow-chip">' + esc(x) + '</span>').join('') + '</div>');
      if (!pending) {
        const outc = a.status === 'approved' ? f.outcomeOk : f.outcomeKo;
        html += blk('What happened next', 'checkCircle', '<ul>' + outc.map((x) => '<li>' + esc(fill(x)) + '</li>').join('') + '</ul>' +
          (a.id === 'AP-ID-HOLD' && a.status === 'approved' ? (this.ui.released['PAY-77131'] ? '<p style="margin-top:8px;color:var(--green-ink);font-weight:600">' + I('check') + ' PAY-77131 (€0.75 M, known supplier) released by you.</p>' : '<div class="row wrap" style="margin-top:10px"><button class="small" data-action="owRelease" data-id="PAY-77131">' + I('rollback') + ' Release PAY-77131 only (known supplier)</button></div>') : ''));
      }
      html += '<div class="ow-foot">Decision right: ' + esc(f.right) + '. Requested by ' + esc(CP.actor(a.requestedBy).name) + ' at ' + esc(hm(a.createdAt)) + '. Your answer is signed with your device key and stored in the audit trail.</div></div>';
      html += '<div class="ow-act">' + (pending ? '<div class="ow-big"><button class="go" data-action="owDecide" data-id="' + esc(a.id) + '" data-decision="approve">' + I('check') + esc(a.approveLabel || 'Approve') + '</button><button class="danger" data-action="owDecide" data-id="' + esc(a.id) + '" data-decision="reject">' + I('x') + esc(a.rejectLabel || 'Reject') + '</button></div>' : '') +
        '<div class="ow-sec2"><button data-action="owCall" data-id="' + esc(a.id) + '">' + I('users') + ' Call the CISO on duty</button><button data-action="owAsk" data-id="' + esc(a.id) + '">' + I('message') + ' Ask a question</button></div></div>';
      return html;
    },

    vRisks() {
      const c2302 = find('cases', 'C-2302'), b315 = find('backlog', 'B-315');
      let html = '<div class="ow-pad"><div class="ow-hello"><small>My risks</small><h2>Risks you accepted</h2><p>You own these risks for Payments &amp; Treasury. The platform watches them and tells you when the situation changes.</p></div>';
      if (b315) {
        const ch = this.ui.toxic;
        html += '<div class="ow-card req' + ui.newCls(b315) + '"><div class="top"><span class="id">REQUEST · from the platform</span>' + ui.tag('Your position', 'indigo') + '</div><b class="tt">27 people in your teams can both create and approve a beneficiary</b>' +
          '<p>This is how tonight\'s attack could reach €4.2 M: the hijacked operator created two beneficiaries yesterday and approved payments to them.</p><p><b>Fix:</b> remove the create right from approvers (2 days of re-assignment, no business stop). <b>Or accept</b> for 30 days with a daily review.</p>' +
          (ch ? '<p style="color:var(--green-ink);font-weight:650;margin:6px 0 0">' + I('check') + ' ' + (ch === 'fix' ? 'You asked for the fix. The Access Review agent prepares the change for Thursday.' : 'Accepted for 30 days (RA-130). Daily review by the Access Review agent.') + '</p>' :
            '<div class="btns"><button class="primary" data-action="owToxic" data-choice="fix">' + I('check') + ' Fix it</button><button data-action="owToxic" data-choice="accept">Accept 30 days</button></div>') + '</div>';
      }
      html += RISKS.map((r) => {
        const exploited = r.id === 'RA-121' && c2302;
        const ren = this.ui.renewed[r.id], exp = this.ui.expired[r.id];
        const soon = r.days <= 20;
        let st = exp ? ui.tag(exp === 'closed' ? 'Closed' : 'Will expire', 'outline') : ren ? ui.tag('Renewed until ' + esc(ren), 'green') : soon ? ui.tag('Expires in ' + r.days + ' days', 'amber') : ui.tag('Until ' + esc(r.expires), 'outline');
        if (exploited && !exp) st = ui.tag('Exploited tonight', 'red');
        return '<div class="ow-card' + (exploited && !exp ? ' bad' : soon && !ren && !exp ? ' warn' : '') + '"><div class="top"><span class="id">' + esc(r.id) + ' · ' + esc(r.kind) + '</span>' + st + '</div><b class="tt">' + esc(r.title) + '</b>' +
          '<p>' + esc(r.why) + '</p><p><b>If it goes wrong:</b> ' + esc(r.residual) + '</p><p><b>What protects you meanwhile:</b> ' + esc(r.comp) + '</p>' +
          (exploited && !exp ? '<p style="color:var(--red-ink);font-weight:600">' + I('alert') + ' Tonight\'s attack used exactly this gap (case C-2302). The platform advises closing the exception: switch the 41 operators to number matching plus device binding today.</p>' : '') +
          (r.renewedOn && !ren ? '<p class="muted" style="font-size:12px">Last renewed ' + esc(r.renewedOn) + ' by you.</p>' : '') +
          (exp ? '' : '<div class="btns">' + (exploited ? '<button class="primary" data-action="owExpire" data-id="' + r.id + '" data-how="closed">' + I('lock') + ' Close the exception now</button>' : '<button data-action="owRenew" data-id="' + r.id + '">' + I('restart') + ' Renew</button><button data-action="owExpire" data-id="' + r.id + '" data-how="expire">Let it expire</button>') + '</div>') + '</div>';
      }).join('');
      return html + '</div>';
    },

    vServices() {
      const sv = ownerServices();
      const ok = sv.filter((s) => s.state === 'ok').length;
      const bu = find('businessUnits', 'bu-pay') || { riskScore: 66, trend: [] };
      return '<div class="ow-pad"><div class="ow-hello"><small>My business services</small><h2>' + ok + ' of ' + sv.length + ' services protected</h2><p>Plain status of the services you own, updated live by the platform. Tap a service for its open findings.</p></div>' +
        '<div class="ow-kpis"><div class="ow-kpi"><b>' + esc(bu.riskScore) + '</b><span>Risk index (lower is better)</span></div><div class="ow-kpi"><b style="color:var(--green-ink)">−4</b><span>points in 6 months</span></div><div class="ow-kpi"><b>' + sv.reduce((n, s) => n + s.findings.length, 0) + '</b><span>open findings</span></div></div>' +
        sv.map((s) => { const st = SVC_STATE[s.state]; return '<button class="ow-svc' + (s.item ? ui.newCls(s.item) : '') + '" data-action="owService" data-id="' + s.id + '"><span class="dot" style="background:' + st[0] + '"></span><span><b>' + esc(s.name) + '</b><span>' + esc(s.text) + '</span></span><span class="st" style="color:' + st[0] + '">' + esc(st[1]) + '<br><span class="muted" style="font-weight:500">' + s.findings.length + ' finding' + (s.findings.length > 1 ? 's' : '') + '</span></span></button>'; }).join('') +
        '<div class="ow-foot">Status comes from the security graph: assets, suppliers and identities linked to each service, with live cases and findings.</div></div>';
    },

    vHistory() {
      const dec = ownerApprovals().filter((a) => a.status !== 'pending');
      const items = dec.map((a) => ({ ts: (dayOf(a.decidedAt) + ' · ' + hm(a.decidedAt)), title: frameFor(a).headline.replace(/\?$/, ''), out: a.status, took: Math.max(1, tsKey(a.decidedAt) - tsKey(a.createdAt)) + ' min', note: a.id + ' · signed and executed by the platform', it: a })).concat(HISTORY);
      return '<div class="ow-pad"><div class="ow-hello"><small>History</small><h2>Your recent decisions</h2><p>Every decision is signed, stored in the audit trail and visible to internal audit.</p></div>' +
        '<div class="ow-kpis"><div class="ow-kpi"><b>' + (9 + dec.length) + '</b><span>decisions in 90 days</span></div><div class="ow-kpi"><b>4 min</b><span>median time to decide</span></div><div class="ow-kpi"><b>0</b><span>missed deadlines</span></div></div>' +
        '<div class="ow-notes">' + items.map((h) => '<div class="ow-hist' + (h.it ? ui.newCls(h.it) : '') + '"><time>' + esc(h.ts) + ' · decided in ' + esc(h.took) + '</time>' + ui.status(h.out) + '<b>' + esc(h.title) + '</b>' + (h.note ? '<small>' + esc(h.note) + '</small>' : '') + '</div>').join('') + '</div></div>';
    },

    /* ---------- Overlays inside the phone ---------- */
    sheet() {
      const s = this.ui.sheet; if (!s) return '';
      let inner = '';
      if (s.type === 'confirm') {
        const a = find('approvals', s.id); if (!a || a.status !== 'pending') { this.ui.sheet = null; return ''; }
        const f = frameFor(a), opt = f.options.find((o) => o.key === s.decision) || {};
        inner = '<h3>Confirm: ' + esc(opt.label || (s.decision === 'approve' ? a.approveLabel : a.rejectLabel)) + '</h3><p>' + esc(s.decision === 'approve' ? 'The platform executes it at once: ' + (opt.cons || []).slice(0, 1).join('') + '.' : 'The platform applies your choice: ' + (opt.cons || []).slice(0, 1).join('') + '.') + '</p>' +
          '<div class="ow-face">' + I('fingerprint') + '<span>Your decision is signed with your device key (face recognition) and recorded in the audit trail with the case facts you saw.</span></div>' +
          '<button class="full ' + (s.decision === 'approve' ? 'go' : 'danger') + '" data-action="owConfirm">' + I('fingerprint') + ' Sign and confirm</button><button class="full ghost" data-action="owSheetClose">Cancel</button>';
      } else if (s.type === 'ask') {
        const a = find('approvals', s.id) || {}; const f = frameFor(a); const chat = this.ui.chat[s.id] || [];
        const asked = chat.map((c) => c.q);
        inner = '<h3>Ask about this decision</h3><p>Answers come from the case facts only. If the platform does not know, it forwards your question to the CISO on duty.</p>' +
          '<div class="ow-chat">' + chat.map((c) => '<div class="ow-msg me">' + esc(c.q) + '</div><div class="ow-msg bot">' + esc(c.a) + '<small>' + esc(c.src) + '</small></div>').join('') + '</div>' +
          '<div class="ow-sugg">' + f.qa.filter((q) => asked.indexOf(q[0]) < 0).map((q) => '<button data-action="owQ" data-q="' + esc(q[0]) + '">' + esc(q[0]) + '</button>').join('') + '</div>' +
          '<div class="ow-input"><label class="sr" for="ow-q">Your question</label><input id="ow-q" type="text" placeholder="Type a question…" value="' + esc(this.ui.draft) + '" autocomplete="off"><button class="primary" data-action="owSend" aria-label="Send question">' + I('send') + '</button></div>' +
          '<button class="full ghost" data-action="owSheetClose">Close</button>';
      } else if (s.type === 'renew') {
        const r = RISKS.find((x) => x.id === s.id) || {};
        inner = '<h3>Renew ' + esc(r.id) + '</h3><p>' + esc(r.title) + '</p><div class="ow-face">' + I('bot') + '<span><b>Since you accepted it:</b> no incident on this asset, compensating controls tested effective last week, exposure unchanged. The platform sees no reason against a renewal of up to 3 months.</span></div>' +
          '<button class="full primary" data-action="owRenewDo" data-months="3">Renew 3 months</button><button class="full" data-action="owRenewDo" data-months="6">Renew 6 months (needs the CISO\'s co-signature)</button><button class="full ghost" data-action="owSheetClose">Cancel</button>';
      } else if (s.type === 'service') {
        const sv = ownerServices().find((x) => x.id === s.id) || { findings: [] }; const st = SVC_STATE[sv.state] || SVC_STATE.ok;
        inner = '<h3>' + esc(sv.name) + '</h3><p><b style="color:' + st[0] + '">' + esc(st[1]) + '</b> · ' + esc(sv.crit) + ' service</p><p>' + esc(sv.text) + '</p><div class="ow-sec-t" style="margin:8px 0 6px"><span>Open findings</span></div><ul style="margin:0;padding-left:18px;font-size:13.5px;line-height:1.6">' + sv.findings.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
          '<button class="full" data-action="owAskBiso" data-id="' + esc(sv.id) + '">' + I('message') + ' Ask my Business CISO</button><button class="full ghost" data-action="owSheetClose">Close</button>';
      }
      return '<button class="ow-scrim" data-action="owSheetClose" aria-label="Close panel" tabindex="-1"></button><div class="ow-sheet" role="dialog" aria-modal="true"><div class="grab" aria-hidden="true"></div>' + inner + '</div>';
    },
    callView() {
      const c = this.ui.call; if (!c) return '';
      return '<div class="ow-call" role="dialog" aria-label="Call with the CISO on duty">' + ui.av('p-elena') + '<h3>CISO on duty</h3><p>' + (c.connected ? 'Connected · secure call' : 'Calling…') + '</p>' +
        (c.connected ? '<div class="shared">' + I('monitor') + ' The CISO on duty sees the same decision screen as you (' + esc(c.id) + '), the case and the agents\' trace. The call is noted in the case.</div>' : '<p style="font-size:12.5px">On-call rota · answers in 40 s on average</p>') +
        '<div class="cbtns"><div><button class="mute" data-action="owMute" aria-label="Mute">' + I('bell') + '</button><small>Mute</small></div><div><button class="hang" data-action="owHang" aria-label="End call">' + I('x') + '</button><small>End</small></div></div></div>';
    },

    /* ---------- Explanation panel beside the phone ---------- */
    side(pend) {
      const s2 = CP.player && CP.player.status().scenario && CP.player.status().scenario.id === 'identity';
      const try_ = pend.length ? '<div class="ow-try"><b>' + I('bell') + ' A decision is waiting on the phone</b><p>' + esc(frameFor(pend[0]).push) + '. Open the notification, read the business framing, then decide.</p></div>'
        : '<div class="ow-try"><b>Try it: 02:12, a payment approver is hijacked</b><p>Runs scenario S2 up to the moment the platform needs the Head of Treasury. The push lands on the phone.</p><button class="go" data-action="owSimulate">' + I('play') + (s2 ? ' Replay S2 to the decision' : ' Run S2 to the decision') + '</button></div>';
      return '<aside class="ow-side" aria-label="Why a phone">' +
        ui.card('', '<div class="eyebrow">Risk owner app · business decider</div><h2>Why a phone</h2><p>Business owners decide in minutes, wherever they are: at 2 a.m., in a board meeting, at an airport. They will not open a security console.</p><p>The platform frames the decision in business terms: money, clients, deadlines. No alert IDs, no jargon. Everything technical was already done by the agents.</p>' +
          '<div class="ow-anat"><div><span><b>What happened</b>, in three plain sentences</span></div><div><span><b>What is at stake</b>, in euros and clients</span></div><div><span><b>Options with consequences</b>, and the platform\'s recommendation with its confidence</span></div><div><span><b>What happens if I do not answer</b> by the deadline</span></div><div><span><b>Can it be undone?</b> Reversibility, spelled out</span></div><div><span><b>Approve or reject</b> in one tap, signed with the device key</span></div></div>', { cls: 'accent' }) +
        try_ +
        ui.card('What the platform gains', '<div class="kv"><dt>Decisions sent to this role</dt><dd>9 in 90 days (out of 38,400 agent actions on Payments)</dd><dt>Median time to decide</dt><dd>4 min, night included</dd><dt>Escalation if unanswered</dt><dd>Call at +5 min, CISO on duty at +10 min</dd><dt>Decision rights</dt><dd>Payments, key business accounts, risk acceptances on owned services</dd></div>') +
        '</aside>';
    },

    mount(root, route) {
      const body = root.querySelector('.ow-body');
      if (body) {
        const k = body.dataset.k;
        if (k !== this.ui.lastKey) { body.scrollTop = 0; this.ui.lastKey = k; } else body.scrollTop = this.ui.scroll[k] || 0;
        body.addEventListener('scroll', () => { this.ui.scroll[k] = body.scrollTop; }, { passive: true });
      }
      const q = root.querySelector('#ow-q');
      if (q) {
        q.addEventListener('input', () => { this.ui.draft = q.value; });
        q.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); this.actions.owSend.call(this); } });
        if (this.ui.focusQ) { q.focus(); this.ui.focusQ = false; }
      }
      const sheet = root.querySelector('.ow-sheet');
      if (sheet && this.ui.sheetScrollEnd) { sheet.scrollTop = sheet.scrollHeight; this.ui.sheetScrollEnd = false; }
    },

    actions: {
      owOpen(el) { this.ui.unlocked[el.dataset.id] = true; CP.go('owner', 'decide', { id: el.dataset.id }); },
      owUnlock(el) { this.ui.unlocked[el.dataset.id] = true; CP.go('owner', 'decide', { id: el.dataset.id }); },
      owDecide(el) { this.ui.sheet = { type: 'confirm', id: el.dataset.id, decision: el.dataset.decision }; CP.render(); },
      owConfirm() {
        const s = this.ui.sheet; this.ui.sheet = null;
        if (s) { const a = find('approvals', s.id); if (a && a.status === 'pending') CP.decide(s.id, s.decision, 'p-hugo'); }
        CP.render();
      },
      owSheetClose() { this.ui.sheet = null; CP.render(); },
      owAsk(el) { this.ui.sheet = { type: 'ask', id: el.dataset.id }; this.ui.focusQ = true; CP.render(); },
      owQ(el) {
        const s = this.ui.sheet; if (!s) return;
        const f = frameFor(find('approvals', s.id) || {}); const qa = f.qa.find((q) => q[0] === el.dataset.q); if (!qa) return;
        (this.ui.chat[s.id] = this.ui.chat[s.id] || []).push({ q: qa[0], a: qa[1], src: 'From the case facts · ' + hm(clockLabel()) });
        this.ui.sheetScrollEnd = true; CP.render();
      },
      owSend() {
        const s = this.ui.sheet; const txt = (this.ui.draft || '').trim(); if (!s || !txt) return;
        (this.ui.chat[s.id] = this.ui.chat[s.id] || []).push({ q: txt, a: 'I cannot answer this from the case facts with enough confidence, so I have not guessed. Your question is forwarded to the CISO on duty, who answers here within 5 minutes.', src: 'Forwarded to the CISO on duty · ' + hm(clockLabel()) });
        this.ui.draft = ''; this.ui.sheetScrollEnd = true; this.ui.focusQ = true;
        CP.feed({ actor: 'p-hugo', domain: 'human', level: 'info', text: 'asked a question on ' + s.id + ' from the risk owner app: "' + txt.slice(0, 80) + '" (forwarded to the CISO on duty).' });
        CP.toast('Question forwarded to the CISO on duty.');
      },
      owCall(el) {
        const id = el.dataset.id; this.ui.call = { id, connected: false };
        CP.feed({ actor: 'p-hugo', domain: 'human', level: 'info', text: 'called the CISO on duty from the risk owner app about ' + id + '.' });
        CP.render();
        setTimeout(() => { if (this.ui.call && this.ui.call.id === id) { this.ui.call.connected = true; if (CP.route.id === 'owner') CP.render(); } }, 1400);
      },
      owHang() { this.ui.call = null; CP.toast('Call ended (0 min 42 s). Noted in the case.'); CP.render(); },
      owMute() { CP.toast('Microphone muted.'); },
      owRelease(el) {
        this.ui.released[el.dataset.id] = true;
        CP.feed({ actor: 'p-hugo', domain: 'human', level: 'decision', text: 'released held payment ' + el.dataset.id + ' (€0.75 M, known supplier) from the risk owner app.' });
        CP.toast('Payment ' + el.dataset.id + ' released. The 2 other payments stay held.'); CP.render();
      },
      owRenew(el) { this.ui.sheet = { type: 'renew', id: el.dataset.id }; CP.render(); },
      owRenewDo(el) {
        const s = this.ui.sheet; if (!s) return; const m = +el.dataset.months;
        const until = m === 3 ? (s.id === 'RA-114' ? '26 Jan 2027' : '31 Jan 2027') : (s.id === 'RA-114' ? '26 Apr 2027' : '30 Apr 2027');
        this.ui.renewed[s.id] = until; this.ui.sheet = null;
        CP.feed({ actor: 'p-hugo', domain: 'human', level: 'decision', text: 'renewed ' + s.id + ' until ' + until + (m === 6 ? ' (CISO co-signature requested)' : '') + '.' });
        CP.toast(s.id + ' renewed until ' + until + '. Signed and recorded.'); CP.render();
      },
      owExpire(el) {
        const id = el.dataset.id, how = el.dataset.how; this.ui.expired[id] = how;
        CP.feed({ actor: 'p-hugo', domain: 'human', level: 'decision', text: how === 'closed' ? 'closed exception ' + id + ': 41 Treasury operators move to number matching and device binding today.' : 'let ' + id + ' expire: the remediation becomes mandatory at the expiry date.' });
        CP.toast(how === 'closed' ? id + ' closed. The Identity agents switch the 41 operators today.' : id + ' will expire. The platform tracks the remediation.'); CP.render();
      },
      owToxic(el) {
        const ch = el.dataset.choice; this.ui.toxic = ch;
        CP.feed({ actor: 'p-hugo', domain: 'human', level: 'decision', text: ch === 'fix' ? 'asked to remove the create-beneficiary right from 27 approvers (toxic combination).' : 'accepted the toxic combination risk for 30 days (RA-130) with daily review.' });
        CP.toast(ch === 'fix' ? 'Fix requested. The Access Review agent prepares the change.' : 'Accepted for 30 days (RA-130).'); CP.render();
      },
      owService(el) { this.ui.sheet = { type: 'service', id: el.dataset.id }; CP.render(); },
      owAskBiso() { this.ui.sheet = null; CP.toast('Message sent to the Business CISO for Payments & Treasury.'); CP.feed({ actor: 'p-hugo', domain: 'human', level: 'info', text: 'asked the Business CISO a question from the risk owner app.' }); CP.render(); },
      owSimulate() {
        if (!CP.player) return;
        this.ui.unlocked = {}; this.ui.sheet = null; this.ui.call = null;
        CP.player.load('identity'); CP.player.jump(5); CP.player.next();
        CP.go('owner', 'decisions');
      }
    }
  });

  /* =====================================================================
     2. SUPPLIER PORTAL (external view of Atlas Payroll Services)
     ===================================================================== */
  const CVE_Q = [
    { id: 'q1', q: 'Which FileBridge MFT version runs on the platform that exchanges files with Novalys?', pre: 'FileBridge MFT 8.7', src: 'Your 2026 annual answer · version banner seen by external scan Tue 08:51', conf: 'High', opts: ['FileBridge MFT 8.7', 'FileBridge MFT 9.0', 'FileBridge MFT 9.1.3 or lower', 'FileBridge MFT 9.1.4 (patched)'] },
    { id: 'q2', q: 'Is the vendor patch 9.1.4 applied? If not, when will it be?', pre: 'Not applied (banner still shows 8.7)', src: 'External scan Tue 08:51', conf: 'Medium', opts: ['Not applied (banner still shows 8.7)', 'Planned within 24 h', 'Planned Friday 16 Oct', 'Applied today'] },
    { id: 'q3', q: 'Have you searched your logs for the attached indicators (3 IP addresses, 2 domains, 1 file hash)?', pre: null, src: 'Novalys cannot know this: your answer is needed', opts: ['Yes, no match', 'Yes, match found', 'Search in progress', 'Not yet'] },
    { id: 'q4', q: 'Have you seen any suspicious activity on FileBridge since 1 October?', pre: null, src: 'Novalys cannot know this: your answer is needed', opts: ['No', 'Yes, under investigation', 'Yes, confirmed incident'] },
    { id: 'q5', q: 'Who can reach your FileBridge endpoint from the internet?', pre: 'Novalys IP ranges only (allowlist)', src: 'Firewall rule set in your March 2026 evidence pack', conf: 'Medium', opts: ['Novalys IP ranges only (allowlist)', 'Several clients (allowlist)', 'Any address (internet-facing)'] },
    { id: 'q6', q: '24/7 security contact for escalation', pre: 'Supplier CISO · +33 1 84 60 12 41', src: 'Contract annex 3 (security contacts)', conf: 'High', text: true }
  ];
  const FLAGGED_ANS = { q1: 'FileBridge MFT 8.7', q2: 'Planned Friday 16 Oct', q3: 'Yes, no match', q4: 'No', q5: 'Novalys IP ranges only (allowlist)', q6: 'Supplier CISO · +33 1 84 60 12 41' };
  const SUBS = [
    { name: 'Hexacloud Hosting', country: 'FR', service: 'Hosting of the payroll platform (IaaS)', data: 'Payroll and HR data (encrypted at rest)', src: 'Contract annex 4' },
    { name: 'PrintMail Services', country: 'FR', service: 'Payslip printing and mailing', data: 'Names, addresses, net pay', src: 'Your 2025 register answer' },
    { name: 'Securis Backup', country: 'BE', service: 'Off-site encrypted backup', data: 'Encrypted backups only', src: 'Your 2026 annual answer' }
  ];
  const ATLAS_MSGS = [
    { id: 'AM-1', ts: 'Wed 18 Mar', dir: 'in', subject: 'Annual security assessment 2026: result and agreed actions', body: 'Thank you for completing the 2026 assessment (118 questions). Result: 71 / 100.\nTwo actions agreed: MFA on the payroll admin portal (by 30 Sep) and ISO 27001 surveillance audit evidence (by 30 Nov).' },
    { id: 'AM-2', ts: 'Fri 21 Aug', dir: 'in', subject: 'Leaked credentials: 4 accounts of your staff found on a paste site', body: 'Our threat intelligence found 4 email and password pairs of Atlas Payroll staff on a public paste site (dated 19 Aug). Please reset them and confirm.' },
    { id: 'AM-3', ts: 'Sat 22 Aug', dir: 'out', subject: 'Re: Leaked credentials', body: 'Reset done on the 4 accounts, sessions revoked. Two were former contractors: accounts disabled.' },
    { id: 'M-392', ts: 'Thu 8 Oct', dir: 'in', subject: 'Reminder: MFA on the payroll admin portal (commitment due 30 Sep)', body: 'Your commitment from the 2026 assessment was due on 30 Sep. Could you share the new date and the progress so far?' },
    { id: 'AM-5', ts: 'Fri 9 Oct', dir: 'out', subject: 'Re: MFA on the payroll admin portal', body: 'Rollout at 80%: remaining are 6 service accounts used by the payroll batch. New date: 30 Oct.' }
  ];
  const MSG_BODY = {
    'M-410': 'A critical vulnerability in FileBridge MFT (CVE-2026-41877) is being exploited by a ransomware group against the financial sector. Our records show you use FileBridge to exchange files with Novalys.\n\nWe pre-filled what we already know. Please confirm or correct it in the portal within 24 hours (critical supplier).',
    'M-412': 'Your answer shows FileBridge 8.7 is still exploitable. To protect the payroll data we exchange, your SFTP flow to Novalys was moved to a quarantine zone at 12:42: files are still accepted, scanned, then released with up to 2 hours of delay.\n\nPlease patch within 24 hours. The restriction is lifted once version 9.1.4 is verified (see your remediation plan in the portal).',
    'M-420': 'As part of the DORA register of information, please confirm your sub-contracting chain. We pre-filled 3 sub-contractors from your contract and previous answers. Deadline: Fri 17 Oct.'
  };
  const EVID = [
    { id: 'EV-ISO', name: 'ISO 27001 certificate', base: 'expiring', shared: 'Mar 2026', note: 'Current certificate expires 30 Nov 2026. Renewal requested by Novalys.' },
    { id: 'EV-SOC', name: 'Independent controls report (type II, 2025)', base: 'shared', shared: 'Mar 2026', note: 'Checked by Novalys: scope covers the payroll platform.' },
    { id: 'EV-PT', name: 'Penetration test summary 2026', base: 'shared', shared: 'Jun 2026', note: '0 critical, 2 high findings (both closed).' },
    { id: 'EV-BCP', name: 'Business continuity test report', base: 'shared', shared: 'Apr 2026', note: 'Payroll run restored in 6 h (target 8 h).' },
    { id: 'EV-FB', name: 'Proof of FileBridge 9.1.4 installation', base: 'requested', cve: true, note: 'Version screen and vendor package hash.' },
    { id: 'EV-IOC', name: 'Indicator search output (CVE-2026-41877)', base: 'requested', cve: true, note: 'Export of the search on the 6 indicators, last 30 days.' }
  ];
  const SAMPLE_FILES = { 'EV-ISO': ['iso27001-certificate-2026-renewal.pdf', 412000], 'EV-FB': ['filebridge-9.1.4-version-and-hash.png', 238000], 'EV-IOC': ['ioc-search-cve-2026-41877.csv', 18400], 'EV-SOC': ['controls-report-type2-2025.pdf', 2240000], 'EV-PT': ['pentest-summary-2026.pdf', 640000], 'EV-BCP': ['bcp-test-report-2026.pdf', 880000] };

  function atlas() {
    const tp = find('thirdParties', 'tp-atlas') || { score: 64, questionnaire: {} };
    const q = tp.questionnaire || {};
    const cve = q.campaign === 'CVE-2026-41877' && ['sent', 'answered', 'flagged', 'overdue'].indexOf(q.status) >= 0;
    const lift = find('approvals', 'AP-ATLAS-LIFT');
    const lifted = !!lift && lift.status === 'approved';
    const restricted = !!find('actions', 'A-9851') && !lifted;
    return { tp, q, cve, status: q.status, restricted, lifted, liftPending: !!lift && lift.status === 'pending', lift, m420: find('comms', 'M-420'), m410: find('comms', 'M-410'), m412: find('comms', 'M-412'), gap: tp.gap, score: tp.score };
  }

  CP.screen({
    id: 'supplier', part: 2, role: 'supplier', label: 'Supplier portal', icon: 'building',
    ui: { q: {}, editing: null, draft: {}, chain: null, chainRows: null, uploads: [], evTarget: 'EV-ISO', msg: '', patched: false, planAdds: {}, sel: null },

    render(route) {
      const sub = route.sub || 'requests';
      const A = atlas();
      const reqs = this.requests(A);
      const open = reqs.filter((r) => r.open).length;
      const todoQ = (A.cve && A.status === 'sent' ? 1 : 0) + (A.m420 && !this.ui.chain ? 1 : 0);
      const groups = [
        { label: 'From Novalys', tabs: [{ id: 'requests', label: 'Requests', icon: 'list', count: open || '', warn: true }, { id: 'questionnaires', label: 'Questionnaires', icon: 'file', count: todoQ || '', warn: true }, { id: 'messages', label: 'Messages', icon: 'message' }] },
        { label: 'Our security', tabs: [{ id: 'evidence', label: 'Evidence', icon: 'box' }, { id: 'rating', label: 'Security rating', icon: 'gauge' }, { id: 'plan', label: 'Remediation plan', icon: 'workflow', count: A.restricted ? '!' : '', warn: true }] }
      ];
      const banner = '<div class="sp-ext" role="note"><b>' + I('eye') + ' External view: what Atlas Payroll sees</b><span>Supplier portal of Novalys Group. Only data about Atlas Payroll Services is shown: no other supplier, no internal score, no internal case.</span><span class="sp-x">' + ui.tag(I('lock') + ' External access · MFA', 'outline') + '</span></div>';
      const brand = '<div class="sp-brand"><span class="sp-logo" aria-hidden="true">AP</span><div><h1>Atlas Payroll Services</h1><div class="sub">Critical ICT provider of Novalys Group · payroll outsourcing · contract NVL-TP-0412 · signed in as Supplier CISO</div></div></div>';
      let body;
      if (sub === 'questionnaires') body = this.rQuest(A, route);
      else if (sub === 'evidence') body = this.rEvidence(A);
      else if (sub === 'rating') body = this.rRating(A);
      else if (sub === 'messages') body = this.rMessages(A);
      else if (sub === 'plan') body = this.rPlan(A);
      else body = this.rRequests(A, reqs);
      return ui.tabbar('supplier', groups, sub, persona('p-supplier')) + banner + brand + body;
    },

    requests(A) {
      const r = [];
      const uploadedIso = this.ui.uploads.some((u) => u.target === 'EV-ISO' && u.status === 'shared');
      if (A.cve) {
        const st = { sent: ['red', 'Action required'], answered: ['green', 'Submitted'], flagged: ['amber', 'Reviewed: patch required'], overdue: ['red', 'Overdue'] }[A.status];
        r.push({ id: 'REQ-CVE', icon: 'alert', urg: A.status === 'sent' || A.status === 'overdue', title: 'Urgent · CVE-2026-41877 (FileBridge MFT) questionnaire', sub: '6 questions, 4 pre-filled by Novalys · critical supplier: 24 h', rec: 'Tue 09:00', due: 'Wed 09:00', dueNote: '24 h', st, go: 'questionnaires', sel: 'cve', open: A.status === 'sent' || A.status === 'overdue', item: A.tp });
      }
      if (A.restricted || A.liftPending) r.push({ id: 'REQ-LIFT', icon: 'lock', urg: true, title: 'Patch FileBridge and request verification to lift the flow restriction', sub: 'Your SFTP flow to Novalys is in a quarantine zone since Tue 12:42', rec: 'Tue 12:45', due: 'Wed 12:45', dueNote: '24 h', st: A.liftPending ? ['indigo', 'Verification requested'] : ['red', 'Action required'], go: 'plan', open: !A.liftPending, item: A.m412 });
      if (A.m420) r.push({ id: 'REQ-SUB', icon: 'network', title: 'DORA register: confirm your sub-contracting chain (pre-filled)', sub: '3 sub-contractors pre-filled from your contract and previous answers', rec: 'Mon 09:40', due: 'Fri 17 Oct', dueNote: '5 days', st: this.ui.chain ? ['green', 'Confirmed'] : ['amber', 'To confirm'], go: 'questionnaires', sel: 'sub', open: !this.ui.chain, item: A.m420 });
      if (A.gap) r.push({ id: 'REQ-EXIT', icon: 'rollback', title: 'Joint exit-plan test for the payroll service (DORA Art. 28)', sub: 'Novalys will propose dates: data export format and reversibility test', rec: 'Mon 09:50', due: 'Q1 2027', dueNote: 'planning', st: ['outline', 'Scheduling'], go: 'plan', open: false, item: A.tp });
      r.push({ id: 'REQ-ISO', icon: 'file', title: 'Evidence: ISO 27001 certificate renewal', sub: 'Current certificate expires 30 Nov 2026', rec: 'Thu 1 Oct', due: 'Fri 30 Oct', dueNote: '17 days', st: uploadedIso ? ['green', 'Shared'] : ['amber', 'Open'], go: 'evidence', open: !uploadedIso });
      r.push({ id: 'REQ-MFA', icon: 'key', title: 'Commitment: MFA on the payroll admin portal', sub: 'Agreed in the 2026 assessment · rollout at 80%', rec: 'Wed 18 Mar', due: '30 Sep', dueNote: 'new date 30 Oct', st: ['red', 'Overdue'], go: 'plan', open: true });
      r.push({ id: 'REQ-ANN', icon: 'checkCircle', done: true, title: 'Annual security assessment 2026', sub: '118 questions · result 71 / 100 at the time', rec: 'Feb 2026', due: '31 Mar 2026', dueNote: 'done 18 Mar', st: ['green', 'Completed'], go: 'questionnaires', sel: 'annual', open: false });
      return r;
    },

    rRequests(A, reqs) {
      const open = reqs.filter((r) => r.open);
      const alert = A.restricted ? '<div class="sp-alert" role="alert">' + I('lock') + '<div><b>Your file flow to Novalys is restricted</b><p>Since Tue 12:42 your SFTP flow goes through a quarantine zone: files are still accepted, scanned, then released with up to 2 hours of delay. It is lifted once FileBridge 9.1.4 is verified. <a href="' + CP.href('supplier', 'plan') + '">See how to lift it</a></p></div></div>'
        : A.lifted ? '<div class="sp-alert ok">' + I('checkCircle') + '<div><b>Flow restriction lifted</b><p>Your SFTP flow is back to normal since ' + esc(hm(A.lift.decidedAt)) + '. Thank you for the quick fix.</p></div></div>' : '';
      const metrics = '<div class="metrics" style="margin-bottom:18px">' +
        ui.metric({ label: 'Open requests', icon: 'list', value: open.length, foot: open.filter((r) => r.urg).length + ' urgent' }) +
        ui.metric({ label: 'Next deadline', icon: 'clock', value: open.length ? esc(open[0].due) : 'None', foot: open.length ? esc(open[0].title.slice(0, 38)) + '…' : 'All caught up' }) +
        ui.metric({ label: 'Your security rating', icon: 'gauge', value: A.score, unit: '/100', foot: 'Novalys threshold for critical suppliers: 70', color: A.score < 60 ? 'var(--red-ink)' : A.score < 70 ? '#a56b00' : 'var(--indigo)' }) +
        ui.metric({ label: 'Answers pre-filled for you', icon: 'sparkles', value: '68', unit: '%', foot: 'of questions this year, confirmed in 1 click' }) + '</div>';
      const list = ui.card('Requests from Novalys', '<div data-tour="supplier-requests">' + reqs.map((r) => '<div class="sp-req' + (r.item ? ui.newCls(r.item) : '') + '"><span class="ic ' + (r.urg ? 'urg' : r.done ? 'done' : '') + '">' + I(r.icon) + '</span><div><b>' + esc(r.title) + '</b><small>' + esc(r.sub) + ' · received ' + esc(r.rec) + '</small></div>' +
        '<div class="dl"><span>Deadline</span><b>' + esc(r.due) + '</b> <span>' + esc(r.dueNote) + '</span></div><div class="stc">' + ui.tag(esc(r.st[1]), r.st[0]) + '</div>' +
        '<button class="small' + (r.open ? ' primary' : '') + '" data-action="spGo" data-go-sub="' + r.go + '" data-sel="' + (r.sel || '') + '">' + (r.open ? 'Open' : 'View') + ' ' + I('chevronRight') + '</button></div>').join('') + '</div>',
      { cls: 'accent', sub: 'Every request has a deadline, an owner at Novalys and a reason. Nothing arrives by spreadsheet any more.' });
      const how = ui.card('How this portal works', '<div class="sp-ai" style="margin:0 0 12px">' + I('sparkles') + '<span><b>Less work for you.</b> Novalys\' third-party agent pre-fills answers from what Novalys already knows: your contract, your previous answers, your certificates, external scans. You confirm or correct. You remain responsible for your answers.</span></div>' +
        '<div class="kv"><dt>Who reads your answers</dt><dd>The third-party agent analyses them, a Novalys analyst reviews the result</dd><dt>Decisions about you</dt><dd>Always taken by a person at Novalys, never by an agent alone</dd><dt>AI transparency</dt><dd>Content prepared with AI is labelled as such</dd><dt>Your data</dt><dd>Visible only to Novalys third-party risk and your account</dd></div>');
      return alert + metrics + '<div class="grid g-2-1">' + list + how + '</div>';
    },

    rQuest(A, route) {
      const avail = [];
      if (A.cve) avail.push({ id: 'cve', t: 'CVE-2026-41877 · FileBridge MFT', s: 'Received Tue 09:00 · due Wed 09:00', st: { sent: ['red', 'To answer'], answered: ['green', 'Submitted'], flagged: ['amber', 'Reviewed'], overdue: ['red', 'Overdue'] }[A.status] });
      if (A.m420) avail.push({ id: 'sub', t: 'DORA register · sub-contracting chain', s: 'Received Mon 09:40 · due Fri 17 Oct', st: this.ui.chain ? ['green', 'Confirmed'] : ['amber', 'To confirm'] });
      avail.push({ id: 'annual', t: 'Annual security assessment 2026', s: 'Completed 18 Mar 2026', st: ['green', 'Completed'] });
      let sel = route.query.sel || this.ui.sel || avail[0].id;
      if (!avail.find((x) => x.id === sel)) sel = avail[0].id;
      const list = '<div class="sp-qlist">' + avail.map((x) => '<button class="sp-qbtn' + (x.id === sel ? ' on' : '') + '" data-action="spSel" data-sel="' + x.id + '"><b>' + esc(x.t) + '</b><small>' + esc(x.s) + '</small>' + ui.tag(esc(x.st[1]), x.st[0]) + '</button>').join('') +
        (!A.cve ? '<div class="empty" style="padding:14px;font-size:12.5px">No urgent questionnaire open. When Novalys sends one, you get an email and it appears here, pre-filled.</div>' : '') + '</div>';
      const pane = sel === 'cve' ? this.paneCve(A) : sel === 'sub' ? this.paneSub(A) : this.paneAnnual();
      return '<div class="sp-qs">' + list + '<div>' + pane + '</div></div>';
    },
    paneCve(A) {
      const submitted = A.status === 'answered' || A.status === 'flagged';
      const head = '<div class="card-title"><div><h2>CVE-2026-41877 · FileBridge MFT</h2><div class="sub">From Novalys Third-Party Security · received Tue 09:00 · due Wed 09:00 (24 h, critical supplier)</div></div>' + ui.status(submitted ? 'submitted' : A.status === 'overdue' ? 'overdue' : 'pending', submitted ? 'Submitted' : A.status === 'overdue' ? 'Overdue' : 'To answer') + '</div>';
      if (submitted) {
        const ans = A.status === 'flagged' ? FLAGGED_ANS : (A.q.portal || (A.lifted ? Object.assign({}, FLAGGED_ANS, { q1: 'FileBridge MFT 9.1.4 (patched)', q2: 'Applied today' }) : FLAGGED_ANS));
        const review = A.status === 'flagged'
          ? '<div class="sp-alert" style="margin-top:14px">' + I('alert') + '<div><b>Reviewed by Novalys: still exploitable</b><p>Version 8.7 is vulnerable and actively exploited. Your flow was restricted at 12:42 to protect the payroll data; it is lifted once 9.1.4 is verified. <a href="' + CP.href('supplier', 'plan') + '">Open the remediation plan</a></p></div></div>'
          : '<div class="sp-alert ok" style="margin-top:14px">' + I('checkCircle') + '<div><b>Submitted ' + esc(A.q.answeredAt || '') + '</b><p>The third-party agent analyses your answers against what Novalys observes (external scan, evidence). A Novalys analyst reviews the result; you will be notified here.</p></div></div>';
        return ui.card('', head + CVE_Q.map((q, i) => '<div class="sp-q ok"><div class="qh"><span class="qn">' + (i + 1) + '.</span><span class="qt">' + esc(q.q) + '</span>' + ui.tag(I('check') + ' Answered', 'green') + '</div><div class="ans"><span class="val">' + esc(ans[q.id] || '') + '</span></div></div>').join('') + review);
      }
      const st = this.ui.q;
      const done = CVE_Q.filter((q) => st[q.id]).length, corrected = CVE_Q.filter((q) => st[q.id] && st[q.id].state === 'corrected').length;
      const rows = CVE_Q.map((q, i) => {
        const s = st[q.id]; const editing = this.ui.editing === q.id;
        const cls = s ? (s.state === 'corrected' ? 'fix' : 'ok') : (q.pre ? '' : 'todo');
        const val = s ? s.value : q.pre;
        let ans;
        if (editing) {
          const cur = this.ui.draft[q.id] != null ? this.ui.draft[q.id] : (val || '');
          ans = (q.text ? '<label class="sr" for="sp-in-' + q.id + '">Answer</label><input type="text" id="sp-in-' + q.id + '" data-q="' + q.id + '" value="' + esc(cur) + '">'
            : '<label class="sr" for="sp-in-' + q.id + '">Answer</label><select id="sp-in-' + q.id + '" data-q="' + q.id + '">' + (cur ? '' : '<option value="">Choose…</option>') + q.opts.map((o) => '<option' + (o === cur ? ' selected' : '') + '>' + esc(o) + '</option>').join('') + '</select>') +
            '<button class="small primary" data-action="spSave" data-q="' + q.id + '">' + I('check') + ' Save</button><button class="small ghost" data-action="spCancel">Cancel</button>';
        } else {
          ans = '<span class="val' + (val ? '' : ' empty') + '">' + esc(val || 'Your answer is needed') + '</span>' +
            (s ? '<button class="small ghost" data-action="spEdit" data-q="' + q.id + '">Change</button>' :
              (q.pre ? '<button class="small go" data-action="spConfirm" data-q="' + q.id + '">' + I('check') + ' Confirm</button><button class="small" data-action="spEdit" data-q="' + q.id + '">Correct</button>' : '<button class="small primary" data-action="spEdit" data-q="' + q.id + '">Answer</button>'));
        }
        const tagS = s ? (s.state === 'corrected' ? ui.tag('Corrected by you', 'indigo') : ui.tag(I('check') + ' Confirmed', 'green')) : q.pre ? ui.tag(I('sparkles') + ' Pre-filled', 'outline') : ui.tag('To answer', 'amber');
        return '<div class="sp-q ' + cls + '"><div class="qh"><span class="qn">' + (i + 1) + '.</span><span class="qt">' + esc(q.q) + '</span>' + tagS + '</div><div class="ans">' + ans + '</div>' +
          '<div class="src">' + (q.pre ? '<span class="sp-chip">' + I('database') + ' Source: ' + esc(q.src) + '</span><span class="sp-chip">Confidence: ' + esc(q.conf) + '</span>' : '<span class="sp-chip">' + I('info') + ' ' + esc(q.src) + '</span>') + '</div></div>';
      }).join('');
      return ui.card('', head + '<div class="sp-ai">' + I('sparkles') + '<span><b>4 of 6 answers were pre-filled by Novalys\' third-party agent (AI)</b> from information Novalys already holds; each shows its source. Check them: confirm in one click or correct. Two questions only you can answer.</span></div>' + rows +
        '<div class="sp-submit"><div class="t"><b>' + done + ' of 6 answers ready' + (corrected ? ' · ' + corrected + ' corrected' : '') + '</b>Submitting sends your answers to Novalys Third-Party Security. You can still add evidence afterwards.</div><button class="go" data-action="spSubmit"' + (done < 6 ? ' disabled' : '') + '>' + I('send') + ' Submit to Novalys</button></div>');
    },
    paneSub(A) {
      const rows = this.ui.chainRows || SUBS.map((s) => Object.assign({ state: 'pre' }, s));
      const confirmed = this.ui.chain;
      const tbl = ui.table([
        { label: 'Sub-contractor', render: (r) => '<b style="font-weight:600">' + esc(r.name) + '</b><div class="small-txt muted">' + esc(r.country) + '</div>' },
        { label: 'Service to Atlas', render: (r) => esc(r.service) },
        { label: 'Novalys data involved', render: (r) => esc(r.data) },
        { label: 'Source', render: (r) => r.state === 'added' ? ui.tag('Added by you', 'indigo') : '<span class="sp-chip">' + I('sparkles') + ' ' + esc(r.src) + '</span>' },
        { label: '', render: (r) => confirmed ? ui.tag(I('check') + ' Confirmed', 'green') : r.state === 'ok' ? ui.tag(I('check') + ' OK', 'green') : '<span class="row" style="gap:4px"><button class="small go" data-action="spSubOk" data-name="' + esc(r.name) + '">' + I('check') + '</button><button class="small danger" data-action="spSubDel" data-name="' + esc(r.name) + '" aria-label="Remove ' + esc(r.name) + '">' + I('x') + '</button></span>' }
      ], rows);
      return ui.card('DORA register · sub-contracting chain', '<div class="sp-ai">' + I('sparkles') + '<span>Novalys must keep a register of its ICT providers and their sub-contractors supporting critical functions (DORA Art. 28). We pre-filled your chain; please confirm each line, remove what is wrong and add what is missing.</span></div>' + tbl +
        (confirmed ? '<div class="sp-alert ok" style="margin-top:14px">' + I('checkCircle') + '<div><b>Chain confirmed ' + esc(confirmed) + '</b><p>' + rows.length + ' sub-contractors recorded in the Novalys register. You will be asked again only if something changes.</p></div></div>' :
          '<div class="row wrap" style="margin-top:12px"><button data-action="spSubAdd">' + I('arrowRight') + ' Add a sub-contractor</button><span class="spacer"></span><button class="go" data-action="spSubConfirm">' + I('send') + ' Confirm the chain</button></div>'),
      { sub: 'Requested Mon 09:40 · due Fri 17 Oct' });
    },
    paneAnnual() {
      return ui.card('Annual security assessment 2026', '<div class="kv" style="margin-bottom:14px"><dt>Completed</dt><dd>18 Mar 2026 · 118 questions (81 pre-filled)</dd><dt>Result at the time</dt><dd>71 / 100</dd><dt>Agreed actions</dt><dd>MFA on the payroll admin portal (overdue) · ISO 27001 surveillance evidence (due 30 Nov)</dd><dt>Next assessment</dt><dd>Feb 2027</dd></div>' +
        ui.hbars([{ label: 'Governance', value: 82 }, { label: 'Access', value: 64, color: '#c8861a' }, { label: 'Operations', value: 70 }, { label: 'Resilience', value: 66, color: '#c8861a' }, { label: 'Supply chain', value: 74 }], { max: 100, unit: '/100' }), { sub: 'Read-only · your answers are kept and reused to pre-fill next year' });
    },

    rEvidence(A) {
      const ups = this.ui.uploads;
      const items = EVID.filter((e) => !e.cve || A.cve).map((e) => {
        const u = ups.filter((x) => x.target === e.id).slice(-1)[0];
        let st = e.base === 'shared' ? ['green', 'Shared'] : e.base === 'expiring' ? ['amber', 'Renewal requested'] : ['red', 'Requested'];
        if (u) st = u.status === 'shared' ? ['green', 'Shared ' + u.ts] : ['indigo', 'Scanning…'];
        return Object.assign({}, e, { u, st });
      });
      const tbl = ui.table([
        { label: 'Evidence', render: (e) => '<b style="font-weight:600">' + esc(e.name) + '</b><div class="small-txt muted">' + esc(e.note) + '</div>' },
        { label: 'Last shared', render: (e) => esc(e.u ? e.u.name : (e.shared || '·')) },
        { label: 'Status', render: (e) => ui.tag(esc(e.st[1]), e.st[0]) },
        { label: 'Novalys check', render: (e) => e.u && e.u.status === 'shared' ? '<span class="small-txt">' + I('check') + ' ' + esc(e.u.check) + '</span>' : e.base === 'shared' ? '<span class="small-txt muted">Accepted</span>' : '<span class="small-txt muted">Waiting for your file</span>' },
        { label: '', render: (e) => '<button class="small" data-action="spTarget" data-id="' + e.id + '">' + I('arrowRight') + ' Upload</button>' }
      ], items);
      const tgt = this.ui.evTarget;
      const upl = '<div class="sp-upl">' + I('box') + '<p>Files are scanned for malware, hashed (SHA-256) and shared only with Novalys third-party risk. Nothing leaves this demo: the upload is simulated.</p>' +
        '<div class="row"><label class="sr" for="sp-tgt">Evidence</label><select id="sp-tgt" data-change="spTargetSel">' + items.map((e) => '<option value="' + e.id + '"' + (e.id === tgt ? ' selected' : '') + '>' + esc(e.name) + '</option>').join('') + '</select>' +
        '<input type="file" id="sp-file" class="sr sp-file" data-change="spFile"><label for="sp-file" class="sp-filebtn">' + I('external') + ' Choose a file</label><button data-action="spSample">' + I('file') + ' Use a sample file</button></div></div>';
      const recent = ups.length ? '<div class="list" style="margin-top:12px">' + ups.slice().reverse().map((u) => '<div class="list-item"><span>' + I(u.status === 'shared' ? 'checkCircle' : 'clock') + '</span><div class="li-main"><div class="li-title">' + esc(u.name) + '</div><div class="li-sub">' + esc((EVID.find((e) => e.id === u.target) || {}).name || '') + ' · ' + CP.fmt(u.size / 1024) + ' KB · ' + (u.status === 'shared' ? 'malware scan clean · SHA-256 <span class="mono">' + esc(u.hash) + '</span> · shared ' + esc(u.ts) : 'scanning…') + '</div></div></div>').join('') + '</div>' : '';
      return '<div class="grid g-2-1">' + ui.card('Evidence requested and shared', tbl, { cls: 'accent', sub: 'Novalys reuses each file for every framework that needs it: one upload, several controls.' }) +
        ui.card('Upload evidence', upl + recent) + '</div>';
    },

    rRating(A) {
      const flagged = A.status === 'flagged' && !A.lifted;
      const comps = [
        { k: 'Patching cadence', v: flagged ? 35 : A.lifted ? 74 : 58, tip: A.lifted ? 'FileBridge patched within 24 h of the request' : 'FileBridge 8.7 is exploitable (CVE-2026-41877). Patch to 9.1.4', pts: A.lifted ? 0 : 9, id: 'fb' },
        { k: 'Internet exposure', v: 72, tip: 'Close 2 legacy endpoints still accepting TLS 1.0', pts: 3, id: 'tls' },
        { k: 'Email security', v: 81, tip: 'Move your DMARC policy from quarantine to reject', pts: 2, id: 'dmarc' },
        { k: 'Leaked credentials', v: 60, tip: '4 staff credentials found in August: reset done, enforce MFA on the 6 remaining service accounts', pts: 3, id: 'mfa' },
        { k: 'Evidence freshness', v: this.ui.uploads.some((u) => u.target === 'EV-ISO' && u.status === 'shared') ? 82 : 55, tip: 'ISO 27001 certificate expires 30 Nov: upload the renewal', pts: 4, id: 'iso' },
        { k: 'Questionnaire answers', v: A.cve && A.status === 'sent' ? 70 : 92, tip: A.cve && A.status === 'sent' ? 'Answer the CVE-2026-41877 questionnaire (due Wed 09:00)' : 'Answers complete and on time', pts: A.cve && A.status === 'sent' ? 2 : 0, id: 'q' }
      ];
      const labels = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
      const vals = [69, 68, 66, 65, 64, A.score];
      const left = ui.card('Your rating as seen by Novalys', '<div class="row wrap" style="gap:24px;align-items:center">' + ui.gauge(A.score, { label: String(A.score), sub: 'out of 100', color: A.score < 60 ? 'var(--red)' : A.score < 70 ? '#c8861a' : 'var(--indigo)', w: 200 }) +
        '<div style="flex:1;min-width:220px"><div class="kv"><dt>Novalys threshold</dt><dd>70 for critical suppliers</dd><dt>Below 60</dt><dd>Flows can be restricted (contract §9.4)</dd><dt>Updated</dt><dd>Daily, plus on every answer or evidence</dd></div></div></div>' +
        '<div style="margin-top:14px">' + ui.line([{ label: 'Rating', color: A.score < 60 ? '#d8412f' : '#451dc7', values: vals }], labels, { h: 170, min: 40, max: 80, label: 'Rating over 6 months' }) + '</div>' +
        '<p class="small-txt muted" style="margin:6px 0 0">Only your own rating is shown. Ratings of other suppliers are never visible in this portal.</p>', { cls: 'accent' });
      const right = ui.card('How to improve it', comps.map((c) => '<div class="sp-comp"><b>' + esc(c.k) + '</b><span class="sc" style="color:' + (c.v < 60 ? 'var(--red-ink)' : c.v < 70 ? '#a56b00' : 'var(--green-ink)') + '">' + c.v + '</span><span class="tip">' + esc(c.tip) + (c.pts ? ' · <em>+' + c.pts + ' points</em>' : '') + '</span>' +
        (c.pts ? (this.ui.planAdds[c.id] ? ui.tag(I('check') + ' In your plan', 'green') : '<button class="small" data-action="spAddPlan" data-id="' + c.id + '" data-t="' + esc(c.tip) + '">Add to plan</button>') : '<span></span>') + '</div>').join('') +
        '<div class="row wrap" style="margin-top:12px"><span class="small-txt muted">A signal looks wrong?</span><button class="small ghost" data-action="spDispute">' + I('flag') + ' Dispute a signal</button></div>', { sub: 'Signals come from external scans, your answers and your evidence. Each one says how many points it is worth.' });
      return '<div class="grid g2">' + left + right + '</div>';
    },

    rMessages(A) {
      const msgs = ATLAS_MSGS.map((m) => Object.assign({ key: tsKeyLong(m.ts) }, m));
      if (A.m410 && A.m410.status === 'sent') msgs.push({ id: 'M-410', ts: 'Tue 09:00', key: 100000 + tsKey('Tue 09:00'), dir: 'in', subject: A.m410.subject, body: MSG_BODY['M-410'], it: A.m410 });
      get('comms').filter((c) => c.party === 'tp-atlas').forEach((c) => msgs.push({ id: c.id, ts: c.ts, key: 100000 + tsKey(c.ts), dir: c.author === 'p-supplier' ? 'out' : 'in', subject: c.subject, body: c.body && c.body.length > 30 && c.body.indexOf('...') < 0 ? c.body : (MSG_BODY[c.id] || c.subject), it: c }));
      if (A.m420) msgs.push({ id: 'M-420', ts: 'Mon 09:40', key: 100000 + tsKey('Mon 09:40'), dir: 'in', subject: A.m420.subject, body: MSG_BODY['M-420'], it: A.m420 });
      msgs.sort((a, b) => a.key - b.key);
      const thread = '<div class="sp-thread" id="sp-thread">' + msgs.map((m) => '<div class="sp-m ' + m.dir + (m.it ? ui.newCls(m.it) : '') + '"><div class="mh">' + (m.dir === 'in' ? '<b>Novalys Third-Party Security</b>' + ui.tag(I('sparkles') + ' Prepared with AI, reviewed by a person', 'outline') : '<b>You · Supplier CISO</b>') + '<span>' + esc(m.ts) + '</span></div>' + (m.body && m.body.trim() === m.subject.trim() ? '' : '<div class="ms">' + esc(m.subject) + '</div>') + '<div class="mb">' + esc(m.body) + '</div></div>').join('') + '</div>';
      const compose = '<div class="sp-compose"><label class="small-txt muted" for="sp-msg">Reply to Novalys Third-Party Security</label><textarea id="sp-msg" placeholder="Write your message…">' + esc(this.ui.msg) + '</textarea><div class="row"><span class="small-txt muted">Delivered to the Novalys third-party team; urgent topics also trigger a call from their duty officer.</span><span class="spacer"></span><button class="primary" data-action="spSend">' + I('send') + ' Send</button></div></div>';
      return ui.card('Messages with Novalys', thread + compose, { cls: 'accent', sub: msgs.length + ' messages · one thread per supplier, kept for audit' });
    },

    rPlan(A) {
      const hasFb = this.ui.uploads.some((u) => u.target === 'EV-FB' && u.status === 'shared');
      const hasIoc = this.ui.uploads.some((u) => u.target === 'EV-IOC' && u.status === 'shared');
      let restr = '';
      if (A.restricted || A.liftPending) {
        const steps = [
          [this.ui.patched, 'Install FileBridge MFT 9.1.4', 'Vendor package, then restart the transfer service (about 20 min).', this.ui.patched ? '' : '<button class="small" data-action="spPatched">' + I('check') + ' Mark as done</button>'],
          [hasFb, 'Upload proof of installation', 'Version screen and vendor package hash.', hasFb ? '' : '<button class="small" data-action="spTargetGo" data-id="EV-FB">' + I('arrowRight') + ' Upload</button>'],
          [hasIoc, 'Upload your indicator search output', 'Search on the 6 indicators over 30 days.', hasIoc ? '' : '<button class="small" data-action="spTargetGo" data-id="EV-IOC">' + I('arrowRight') + ' Upload</button>'],
          [A.liftPending, 'Request verification', 'Novalys rescans your endpoint; a Novalys person decides to lift (usually within 1 hour).', A.liftPending ? '' : '<button class="small go" data-action="spVerify"' + (this.ui.patched && hasFb && hasIoc ? '' : ' disabled') + '>' + I('send') + ' Request verification</button>']
        ];
        restr = '<div class="sp-alert" style="display:block" role="region" aria-label="Flow restriction">' + '<div class="row" style="gap:10px;align-items:flex-start">' + I('lock') + '<div><b>Your SFTP flow to Novalys is restricted since Tue 12:42</b><p>Why: FileBridge 8.7 is exploitable and actively exploited against the financial sector. Novalys protects the payroll data of its 38,000 staff while you patch.</p></div></div>' +
          '<div class="sp-flow"><span class="n">Atlas FileBridge</span>' + I('arrowRight') + '<span class="q">' + I('lock') + ' Quarantine zone · scan · up to 2 h delay</span>' + I('arrowRight') + '<span class="n">Novalys payroll intake</span></div>' +
          '<p style="margin:8px 0 2px"><b>What still works:</b> files are accepted and delivered after scanning. <b>What changes:</b> delays of up to 2 hours on payroll files; please plan Thursday\'s run accordingly.</p>' +
          '<div class="sp-steps">' + steps.map((s, i) => '<div class="sp-step' + (s[0] ? ' done' : '') + '"><span class="n">' + (s[0] ? I('check') : i + 1) + '</span><span><b>' + esc(s[1]) + '</b><small>' + esc(s[2]) + '</small></span>' + (s[3] || (s[0] ? ui.tag('Done', 'green') : '')) + '</div>').join('') + '</div>' +
          (A.liftPending ? '<div class="notice info" style="margin-top:8px">' + I('clock') + ' External rescan at ' + esc(hm(A.lift.createdAt)) + ': version 9.1.4 confirmed. Lifting the restriction is now with the Business CISO at Novalys (a person decides, not an agent).</div>' : '') + '</div>';
      } else if (A.lifted) {
        restr = '<div class="sp-alert ok">' + I('checkCircle') + '<div><b>Restriction lifted at ' + esc(hm(A.lift.decidedAt)) + '</b><p>Version 9.1.4 verified, indicator search negative. Your SFTP flow is back to normal.</p><div class="sp-flow"><span class="n">Atlas FileBridge</span>' + I('arrowRight') + '<span class="okz">' + I('check') + ' Direct</span>' + I('arrowRight') + '<span class="n">Novalys payroll intake</span></div></div></div>';
      }
      const items = [];
      if (A.cve) items.push({ id: 'RP-FB', t: 'Patch FileBridge MFT 8.7 to 9.1.4 (CVE-2026-41877)', from: 'CVE-2026-41877 questionnaire', due: A.status === 'flagged' ? 'Wed 14 Oct 12:45' : 'Wed 14 Oct 09:00', owner: 'Atlas IT operations', pr: A.lifted ? 100 : A.liftPending ? 90 : this.ui.patched ? 60 : 10, st: A.lifted ? 'done' : A.status === 'flagged' ? 'at-risk' : 'in-progress', it: A.tp });
      items.push({ id: 'RP-MFA', t: 'MFA on the payroll admin portal (6 service accounts left)', from: 'Annual assessment 2026', due: '30 Sep → 30 Oct', owner: 'Atlas IT security', pr: 80, st: 'at-risk' });
      items.push({ id: 'RP-ISO', t: 'ISO 27001 surveillance audit evidence', from: 'Annual assessment 2026', due: '30 Nov 2026', owner: 'Atlas compliance', pr: this.ui.uploads.some((u) => u.target === 'EV-ISO' && u.status === 'shared') ? 100 : 30, st: this.ui.uploads.some((u) => u.target === 'EV-ISO' && u.status === 'shared') ? 'done' : 'on-track' });
      if (A.m420) items.push({ id: 'RP-SUB', t: 'Confirm the sub-contracting chain (DORA register)', from: 'Novalys request M-420', due: 'Fri 17 Oct', owner: 'Supplier CISO', pr: this.ui.chain ? 100 : 0, st: this.ui.chain ? 'done' : 'new', it: A.m420 });
      if (A.gap) items.push({ id: 'RP-EXIT', t: 'Joint exit-plan test: payroll data export and reversibility', from: 'Novalys DORA review', due: 'Q1 2027', owner: 'Atlas + Novalys', pr: 0, st: 'new', it: A.tp });
      Object.keys(this.ui.planAdds).forEach((k) => items.push({ id: 'RP-' + k.toUpperCase(), t: this.ui.planAdds[k], from: 'Security rating tip', due: 'Your date', owner: 'Supplier CISO', pr: 0, st: 'new' }));
      const tbl = ui.table([
        { label: 'Action', render: (r) => '<b style="font-weight:600">' + esc(r.t) + '</b><div class="small-txt muted">' + esc(r.id) + ' · from ' + esc(r.from) + '</div>' },
        { label: 'Owner', render: (r) => esc(r.owner) },
        { label: 'Due', render: (r) => '<span class="num">' + esc(r.due) + '</span>' },
        { label: 'Progress', render: (r) => '<div style="min-width:90px">' + ui.progress(r.pr, r.st === 'done' ? 'green' : r.st === 'at-risk' ? 'amber' : '') + '<span class="small-txt muted">' + r.pr + '%</span></div>' },
        { label: 'Status', render: (r) => ui.status(r.st) }
      ], items.map((r) => Object.assign({ _new: r.it && r.it._new }, r)));
      return restr + ui.card('Shared remediation plan', tbl, { cls: 'accent', sub: 'Shared between Atlas Payroll and Novalys. Both sides see the same dates; overdue items trigger a reminder, not a spreadsheet.' });
    },

    mount(root) {
      root.querySelectorAll('.sp-q [data-q]').forEach((inp) => {
        const save = () => { this.ui.draft[inp.dataset.q] = inp.value; };
        inp.addEventListener('input', save); inp.addEventListener('change', save);
      });
      const ta = root.querySelector('#sp-msg'); if (ta) ta.addEventListener('input', () => { this.ui.msg = ta.value; });
      const th = root.querySelector('#sp-thread'); if (th) th.scrollTop = th.scrollHeight;
    },

    actions: {
      spGo(el) { const sel = el.dataset.sel; if (sel) this.ui.sel = sel; CP.go('supplier', el.dataset.goSub, sel ? { sel } : null); },
      spSel(el) { this.ui.sel = el.dataset.sel; CP.go('supplier', 'questionnaires', { sel: el.dataset.sel }); },
      spConfirm(el) { const q = CVE_Q.find((x) => x.id === el.dataset.q); this.ui.q[q.id] = { state: 'confirmed', value: q.pre }; CP.render(); },
      spEdit(el) { this.ui.editing = el.dataset.q; delete this.ui.draft[el.dataset.q]; CP.render(); },
      spCancel() { this.ui.editing = null; CP.render(); },
      spSave(el) {
        const id = el.dataset.q, q = CVE_Q.find((x) => x.id === id);
        const inp = document.getElementById('sp-in-' + id); const v = ((inp && inp.value) || this.ui.draft[id] || '').trim();
        if (!v) { CP.toast('Choose or type an answer first.', 'warn'); return; }
        this.ui.q[id] = { state: q.pre && v === q.pre ? 'confirmed' : (q.pre ? 'corrected' : 'confirmed'), value: v };
        this.ui.editing = null; CP.render();
      },
      spSubmit() {
        const tp = find('thirdParties', 'tp-atlas'); if (!tp) return;
        if (CVE_Q.some((q) => !this.ui.q[q.id])) { CP.toast('Some answers are still missing.', 'warn'); return; }
        const ans = {}; CVE_Q.forEach((q) => { ans[q.id] = this.ui.q[q.id].value; });
        const corrected = CVE_Q.filter((q) => this.ui.q[q.id].state === 'corrected').length;
        const summary = ans.q1 + '; patch: ' + ans.q2 + '; IoC search: ' + ans.q3 + '; suspicious activity: ' + ans.q4;
        let ts = clockLabel();
        if (tsKey(ts) < tsKey(tp.questionnaire.sentAt || 'Tue 09:00')) ts = dayOf(tp.questionnaire.sentAt || 'Tue 09:00') + ' ' + addMin(tp.questionnaire.sentAt || 'Tue 09:00', 34);
        CP.store.apply([
          { op: 'update', coll: 'thirdParties', id: 'tp-atlas', patch: { questionnaire: Object.assign({}, tp.questionnaire, { status: 'answered', answer: summary, answeredAt: ts, via: 'Supplier portal', portal: ans }) } },
          { op: 'add', coll: 'comms', item: { id: 'M-' + (430 + Math.floor(Math.random() * 60)), ts, party: 'tp-atlas', channel: 'Supplier portal', subject: 'Answers submitted: CVE-2026-41877 questionnaire (6 of 6)', status: 'answered', author: 'p-supplier', validator: '', body: 'Answers submitted through the portal.\n' + summary } }
        ]);
        CP.feed({ actor: 'p-supplier', domain: 'ext', level: 'info', text: 'Atlas Payroll Services submitted its CVE-2026-41877 answers in the supplier portal (6 of 6, ' + corrected + ' corrected): ' + summary + '.' });
        CP.toast('Answers submitted to Novalys. The third-party agent analyses them; a Novalys analyst reviews the result.');
      },
      spSubOk(el) { const rows = this.ui.chainRows || (this.ui.chainRows = SUBS.map((s) => Object.assign({ state: 'pre' }, s))); const r = rows.find((x) => x.name === el.dataset.name); if (r) r.state = 'ok'; CP.render(); },
      spSubDel(el) { const rows = this.ui.chainRows || (this.ui.chainRows = SUBS.map((s) => Object.assign({ state: 'pre' }, s))); this.ui.chainRows = rows.filter((x) => x.name !== el.dataset.name); CP.toast(el.dataset.name + ' removed from your chain.'); CP.render(); },
      spSubAdd() {
        const self = this;
        const d = CP.modal('Add a sub-contractor', '<div class="stack" style="gap:10px"><label class="small-txt">Name<br><input id="sp-sn" style="width:100%;padding:8px;border:1px solid var(--line)" value="Payline Support"></label><label class="small-txt">Country<br><input id="sp-sc" style="width:100%;padding:8px;border:1px solid var(--line)" value="PT"></label><label class="small-txt">Service to Atlas<br><input id="sp-ss" style="width:100%;padding:8px;border:1px solid var(--line)" value="Level 1 support for payroll users (no data export)"></label></div>',
          '<button class="ghost" data-close-modal>Cancel</button><button class="primary" id="sp-add-ok">Add</button>');
        d.querySelector('#sp-add-ok').addEventListener('click', () => {
          const rows = self.ui.chainRows || (self.ui.chainRows = SUBS.map((s) => Object.assign({ state: 'pre' }, s)));
          rows.push({ name: d.querySelector('#sp-sn').value || 'New sub-contractor', country: d.querySelector('#sp-sc').value || '', service: d.querySelector('#sp-ss').value || '', data: 'To be confirmed by Novalys', src: '', state: 'added' });
          CP.closeModal(); CP.toast('Sub-contractor added.'); CP.render();
        });
      },
      spSubConfirm() {
        const rows = this.ui.chainRows || SUBS.map((s) => Object.assign({ state: 'pre' }, s));
        this.ui.chainRows = rows.map((r) => Object.assign({}, r, { state: r.state === 'added' ? 'added' : 'ok' }));
        this.ui.chain = clockLabel();
        CP.store.apply([
          { op: 'update', coll: 'thirdParties', id: 'tp-atlas', patch: { subcontractors: rows.length, subChain: 'confirmed' } },
          { op: 'add', coll: 'comms', item: { id: 'M-' + (500 + Math.floor(Math.random() * 90)), ts: clockLabel(), party: 'tp-atlas', channel: 'Supplier portal', subject: 'Sub-contracting chain confirmed (' + rows.length + ' sub-contractors)', status: 'answered', author: 'p-supplier', validator: '', body: 'Chain confirmed in the portal: ' + rows.map((r) => r.name).join(', ') + '.' } }
        ]);
        CP.feed({ actor: 'p-supplier', domain: 'ext', level: 'info', text: 'Atlas Payroll Services confirmed its sub-contracting chain for the DORA register (' + rows.length + ' sub-contractors).' });
        CP.toast('Chain confirmed. Novalys\' register is updated.');
      },
      spTarget(el) { this.ui.evTarget = el.dataset.id; CP.render(); setTimeout(() => { const s = document.getElementById('sp-tgt'); if (s) s.focus(); }, 30); },
      spTargetGo(el) { this.ui.evTarget = el.dataset.id; CP.go('supplier', 'evidence'); },
      spTargetSel(el) { this.ui.evTarget = el.value; },
      spFile(el) { const f = el.files && el.files[0]; if (!f) return; this.upload(f.name, f.size); },
      spSample() { const s = SAMPLE_FILES[this.ui.evTarget] || ['evidence.pdf', 120000]; this.upload(s[0], s[1]); },
      spPatched() { this.ui.patched = true; CP.toast('Noted. Now upload the proof of installation.'); CP.render(); },
      spVerify() {
        if (find('approvals', 'AP-ATLAS-LIFT') && find('approvals', 'AP-ATLAS-LIFT').status === 'pending') return;
        const ts = clockLabel();
        CP.store.apply([
          { op: 'add', coll: 'approvals', item: { id: 'AP-ATLAS-LIFT', role: 'engage', decider: 'p-lucas', requestedBy: 'ag-grc-tprm', autonomy: 'L2', title: 'Lift the restriction on the Atlas Payroll SFTP flow', summary: 'Atlas Payroll uploaded proof of FileBridge 9.1.4 and a negative indicator search. External rescan at ' + hm(ts) + ' confirms version 9.1.4. Restore the flow from the quarantine zone.', threshold: 'restore a restricted third-party connection', impacts: ['Payroll files no longer delayed by quarantine scanning (up to 2 h)', 'Virtual patch W-121 stays in place for 7 days'], recommendation: 'Lift: version verified by scan and evidence consistent with the answers.', approveLabel: 'Lift restriction', rejectLabel: 'Keep restricted', status: 'pending', createdAt: ts } }
        ]);
        CP.feed({ actor: 'ag-grc-tprm', domain: 'grc', level: 'decision', text: 'rescanned Atlas Payroll FileBridge endpoint: 9.1.4 confirmed; asked the Business CISO to lift the flow restriction.' });
        CP.toast('Verification requested. Novalys rescanned your endpoint: 9.1.4 confirmed. A Novalys person decides on the lift.');
      },
      spAddPlan(el) { this.ui.planAdds[el.dataset.id] = el.dataset.t; CP.toast('Added to your remediation plan.'); CP.render(); },
      spDispute() {
        CP.modal('Dispute a signal', '<p class="small-txt" style="margin-top:0">Tell Novalys which signal is wrong and why. A Novalys analyst answers within 5 business days; the signal is frozen meanwhile.</p><label class="small-txt">Signal<br><select style="width:100%;padding:8px;border:1px solid var(--line)"><option>Internet exposure: 2 endpoints with TLS 1.0</option><option>Leaked credentials</option><option>Email security</option></select></label><label class="small-txt" style="display:block;margin-top:10px">Explanation<br><textarea style="width:100%;min-height:80px;padding:8px;border:1px solid var(--line)">One of the two endpoints was decommissioned on 2 Oct; DNS record removed today.</textarea></label>',
          '<button class="ghost" data-close-modal>Cancel</button><button class="primary" data-action="spDisputeSend">Send dispute</button>');
      },
      spDisputeSend() { CP.closeModal(); CP.feed({ actor: 'p-supplier', domain: 'ext', level: 'info', text: 'Atlas Payroll disputed a rating signal (internet exposure).' }); CP.toast('Dispute sent. A Novalys analyst answers within 5 business days.'); },
      spSend() {
        const t = (this.ui.msg || '').trim(); if (!t) { CP.toast('Write a message first.', 'warn'); return; }
        CP.store.apply({ op: 'add', coll: 'comms', item: { id: 'M-' + (600 + Math.floor(Math.random() * 300)), ts: clockLabel(), party: 'tp-atlas', channel: 'Supplier portal', subject: t.split('\n')[0].slice(0, 70), status: 'answered', author: 'p-supplier', validator: '', body: t } });
        CP.feed({ actor: 'p-supplier', domain: 'ext', level: 'info', text: 'Atlas Payroll sent a message in the supplier portal.' });
        this.ui.msg = ''; CP.toast('Message sent to Novalys Third-Party Security.');
      }
    },
    upload(name, size) {
      const target = this.ui.evTarget;
      const u = { id: CP.uid('up'), target, name, size, status: 'scanning', ts: '', hash: shortHash(name + size), check: '' };
      this.ui.uploads.push(u); CP.render();
      setTimeout(() => {
        u.status = 'shared'; u.ts = hm(clockLabel());
        u.check = { 'EV-FB': 'Version 9.1.4 and vendor hash match', 'EV-IOC': '6 indicators searched, 30 days, 0 match', 'EV-ISO': 'Scope covers payroll platform · valid to Nov 2029' }[target] || 'Readable, in scope, dated 2026';
        CP.feed({ actor: 'p-supplier', domain: 'ext', level: 'info', text: 'Atlas Payroll shared evidence "' + name + '" (' + ((EVID.find((e) => e.id === target) || {}).name || target) + ').' });
        CP.toast('"' + name + '" scanned and shared with Novalys.');
        if (CP.route.id === 'supplier') CP.render();
      }, 1200);
    }
  });
  /* Long-form dates in the static thread ("Wed 18 Mar") sort before this week. */
  function tsKeyLong(s) {
    const M = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10 };
    const m = String(s).match(/(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct)/);
    return m ? M[m[2]] * 100 + (+m[1]) : 0;
  }

  /* When Novalys lifts the restriction (decided by the Business CISO in the
     Inbox or the decisions drawer), restore the flow and tell the supplier. */
  CP.bus.on('decision', (ev) => {
    if (!ev || ev.id !== 'AP-ATLAS-LIFT') return;
    const tp = find('thirdParties', 'tp-atlas'); const ts = clockLabel();
    if (ev.decision === 'approve') {
      CP.store.apply([
        { op: 'add', coll: 'actions', item: { id: 'A-' + (9900 + Math.floor(Math.random() * 90)), ts, agent: 'ag-grc-tprm', system: 'Firewall', action: 'Restored Atlas Payroll SFTP flow from the quarantine zone', level: 'L2', status: 'done', rollback: true } },
        { op: 'update', coll: 'thirdParties', id: 'tp-atlas', patch: { score: 61, questionnaire: Object.assign({}, (tp || {}).questionnaire, { status: 'answered', answer: 'Patched to 9.1.4 (verified by scan), IoC search negative' }) } },
        { op: 'add', coll: 'comms', item: { id: 'M-' + (700 + Math.floor(Math.random() * 90)), ts, party: 'tp-atlas', channel: 'Supplier portal', subject: 'Restriction lifted: FileBridge 9.1.4 verified', status: 'sent', author: 'ag-grc-tprm', validator: 'p-lucas', body: 'Thank you. Version 9.1.4 is verified and your indicator search is negative. Your SFTP flow is back to normal. The virtual patch on our side stays 7 more days as defence in depth.' } }
      ]);
    } else {
      CP.store.apply({ op: 'add', coll: 'comms', item: { id: 'M-' + (800 + Math.floor(Math.random() * 90)), ts, party: 'tp-atlas', channel: 'Supplier portal', subject: 'Restriction kept for now', status: 'sent', author: 'ag-grc-tprm', validator: 'p-lucas', body: 'We keep the restriction for now while we complete checks. We will contact you within 2 hours.' } });
    }
  });

  /* A demo reset (or a scenario rewind) restores the baseline: forget the
     transient state of the owner and supplier apps that referred to it. */
  CP.bus.on('change', (reason) => {
    if (reason !== 'reset') return;
    const o = CP.screens.owner, sp = CP.screens.supplier;
    if (o) Object.assign(o.ui, { unlocked: {}, sheet: null, call: null, chat: {}, draft: '', released: {}, toxic: null });
    if (sp) Object.assign(sp.ui, { q: {}, editing: null, draft: {}, chain: null, chainRows: null, uploads: [], patched: false });
    if (CP.route.id === 'owner' || CP.route.id === 'supplier') CP.render();
  });

  /* =====================================================================
     3. EVIDENCE ROOM (internal audit, third line, read-only)
     ===================================================================== */
  const AGENT_SHORT = {
    'ag-cti-collect': ['Collect threat intelligence into the graph', 'Minimal'], 'ag-cti-analyst': ['Assess exposure to new threats', 'Minimal'],
    'ag-grc-tprm': ['Analyse supplier answers, draft supplier messages', 'Limited (transparency)'], 'ag-grc-controls': ['Map requirements to controls, assemble evidence', 'Minimal'],
    'ag-grc-policy': ['Draft policies and awareness content', 'Limited (transparency)'], 'ag-as-waf': ['Tune WAF rules, write virtual patches', 'Minimal'],
    'ag-as-code': ['Review code changes for security flaws', 'Minimal'], 'ag-dt-dlp': ['Investigate data-loss alerts', 'Not high-risk · DPIA done'],
    'ag-dt-evidence': ['Collect evidence from lake, CMDB, TPRM', 'Minimal'], 'ag-iam-resp': ['Contain compromised identities', 'Minimal'],
    'ag-iam-review': ['Prepare access reviews, detect toxic access', 'High-risk candidate · legal review'], 'ag-soc-triage': ['Triage alerts and reported phishing', 'Minimal'],
    'ag-soc-detect': ['Write, backtest and deploy detections', 'Minimal'], 'ag-soc-forensic': ['Forensic triage through the EDR', 'Minimal'],
    'ag-soc-hunt': ['Hunt threats across 90 days of telemetry', 'Minimal'], 'ag-vuln': ['Prioritise vulnerabilities, raise patch changes', 'Minimal']
  };
  const TOOL = {
    'ctx-graph': ['graph.query', 'Security graph'], 'ctx-lake': ['lake.search', 'Cyber data lake'], 'ctx-memory': ['memory.read', 'Agent memory'],
    'sys-waf': ['waf.deploy_rule', 'WAF'], 'sys-siem': ['siem.deploy_rule', 'SIEM'], 'sys-edr': ['edr.collect', 'EDR'], 'sys-fw': ['firewall.move_flow', 'Firewall'],
    'sys-proxy': ['proxy.block', 'Proxy'], 'sys-vuln': ['vuln.scan', 'Vulnerability scanner'], 'it-entra': ['idp.revoke_sessions', 'Identity provider'],
    'it-m365': ['collab.audit / mail.rules', 'Collaboration suite'], 'it-itsm': ['itsm.change', 'ITSM'], 'it-cmdb': ['cmdb.read', 'CMDB'],
    'or-sandbox': ['sandbox.replay', 'Sandbox'], 'or-hitl': ['hitl.escalate', 'Human-in-the-loop'], 'or-policy': ['policy.check', 'Policy engine'],
    'or-plan': ['orchestrator.plan', 'Orchestrator'], 'or-kill': ['killswitch.set_level', 'Kill-switch'], 'or-audit': ['audit.write', 'Audit log'],
    'ai-eval': ['eval.run', 'Eval harness'], 'int-mcp': ['mcp.ingest', 'MCP connector'], 'out-tp': ['portal.send', 'Supplier portal'], 'out-reg': ['regulator.submit', 'Regulator portal'], 'int-exec': ['executor.run', 'Executor']
  };
  function toolsOf(flow) {
    const out = [], seen = {};
    (flow || []).forEach((p) => {
      const to = p[1]; let k = to;
      if (/^hu-/.test(to)) { const key = 'notify.' + to.slice(3); if (!seen[key]) { seen[key] = 1; out.push([key, 'Notify ' + to.slice(3) + ' team']); } return; }
      if (!TOOL[k] && TOOL[p[0]] && /^ctx-/.test(p[0])) k = null;
      if (k && TOOL[k] && !seen[TOOL[k][0]] && k !== 'int-exec' && k !== 'int-bus') { seen[TOOL[k][0]] = 1; out.push(TOOL[k]); }
    });
    return out;
  }

  /* Key controls of the evidence room, with scenario overlays. */
  const EVA = 'ag-dt-evidence', CTA = 'ag-grc-controls';
  const CONTROLS = [
    { id: 'CTL-AI-01', name: 'Agent actions above threshold need a named human decision', fw: 'AI Act Art. 14 · DORA Art. 5', owner: 'p-chloe', freq: 'Continuous', ev: [['Decision-rights policy v4 (export)', 'Policy engine', 'Mon 23:00', EVA, 'JSON', '46 KB'], ['Human-in-the-loop decisions log (30 days)', 'Orchestrator · HITL service', 'Tue 06:00', EVA, 'JSONL', '1.2 MB']] },
    { id: 'CTL-AI-02', name: 'Autonomy changes (kill-switch) are approved and logged', fw: 'AI Act Art. 14(4) · ISO 42001', owner: 'p-chloe', freq: 'Per event', ev: [['Autonomy level history of 16 agents', 'Orchestrator registry', 'Tue 06:00', EVA, 'CSV', '88 KB'], ['Monthly kill-switch drill record (Sep)', 'Run · drill log', 'Wed 30 Sep', CTA, 'PDF', '310 KB']] },
    { id: 'CTL-AI-03', name: 'Agent versions are evaluated before promotion', fw: 'AI Act Art. 15 · ISO 42001', owner: 'p-ines', freq: 'Per release', ev: [['Eval reports of the last 3 releases', 'Eval harness', 'Mon 18:40', EVA, 'PDF', '2.4 MB'], ['Release pipeline gate log', 'Build pipeline', 'Mon 18:42', EVA, 'JSONL', '140 KB']] },
    { id: 'CTL-LOG-01', name: 'Audit trail integrity: hash chain, signatures, write-once storage', fw: 'DORA Art. 12 · ISO 27001 A.8.15', owner: 'p-pierre', freq: 'Hourly', ev: [['Hash chain verification report', 'Audit log service', 'Tue 08:00', EVA, 'JSON', '12 KB'], ['Write-once retention configuration', 'Evidence vault', 'Mon 23:00', EVA, 'JSON', '6 KB']] },
    { id: 'CTL-IAM-04', name: 'Phishing-resistant MFA for payment approvers', fw: 'DORA Art. 9 · NIS2 Art. 21(2)(j)', owner: 'p-mei', freq: 'Daily', ev: [['Sign-in policy export (payment approvers)', 'Identity provider', 'Tue 06:02', EVA, 'JSON', '184 KB'], ['Exception register extract (RA-121)', 'GRC repository', 'Tue 06:05', EVA, 'CSV', '4 KB']] },
    { id: 'CTL-VUL-01', name: 'Critical vulnerabilities on internet-facing assets fixed within 72 h', fw: 'NIS2 Art. 21(2)(e) · ISO 27001 A.8.8', owner: 'p-chloe', freq: 'Daily', ev: [['Internet-facing vulnerability report', 'Vulnerability scanner', 'Tue 05:30', EVA, 'CSV', '640 KB']] },
    { id: 'CTL-CHG-02', name: 'Emergency changes approved by an authorised person', fw: 'ISO 27001 A.8.32 · DORA Art. 9(4)(e)', owner: 'p-chloe', freq: 'Per event', ev: [['Emergency change register (Q4)', 'ITSM', 'Tue 06:00', EVA, 'CSV', '22 KB']] },
    { id: 'CTL-TP-02', name: 'Critical third parties assessed yearly and on major threat events', fw: 'DORA Art. 28 · NIS2 Art. 21(2)(d)', owner: 'p-marc', freq: 'Yearly + events', ev: [['Third-party assessment status (1,240)', 'TPRM inventory', 'Tue 06:00', EVA, 'CSV', '1.1 MB']] },
    { id: 'CTL-TP-05', name: 'Exit plans of critical ICT providers exist and are tested', fw: 'DORA Art. 28(8)', owner: 'p-marc', freq: 'Yearly', ev: [['Exit plan register (96 critical arrangements)', 'TPRM inventory', 'Mon 06:00', EVA, 'CSV', '48 KB']] },
    { id: 'CTL-INC-03', name: 'Major incidents: initial notification within 4 hours', fw: 'DORA Art. 19', owner: 'p-amira', freq: 'Per event', ev: [['Major incident register (12 months)', 'Case history', 'Mon 06:00', EVA, 'CSV', '36 KB']] },
    { id: 'CTL-DP-01', name: 'Personal data breaches assessed within 72 hours', fw: 'GDPR Art. 33', owner: 'p-sara', freq: 'Per event', ev: [['Breach register 2026', 'GRC repository', 'Mon 06:00', EVA, 'CSV', '9 KB']] },
    { id: 'CTL-DET-02', name: 'Detection rules backtested before production', fw: 'Internal standard SOC-07', owner: 'p-chloe', freq: 'Per rule', ev: [['Detection catalogue with backtest results', 'SIEM', 'Tue 06:00', EVA, 'JSON', '420 KB']] }
  ];
  function ctlState(c) {
    const has = (coll, id) => !!find(coll, id);
    const ap = (id) => find('approvals', id);
    const extra = []; let res = 'pass', note = 'Operating effectively', last = 'Sep 2026';
    switch (c.id) {
      case 'CTL-AI-01': {
        const dec = get('approvals').filter((a) => a.status !== 'pending').length;
        note = dec ? dec + ' decision' + (dec > 1 ? 's' : '') + ' this week, each signed; 0 action above threshold without decision' : 'Sample of 60 (Sep): 0 action above threshold without decision';
        get('approvals').filter((a) => a.status !== 'pending').slice(0, 4).forEach((a) => extra.push(['Signed decision ' + a.id + ' (' + pname(a.decidedBy || a.decider) + ')', 'Orchestrator · HITL service', a.decidedAt, 'orchestrator', 'JSON', '3 KB', a]));
        break;
      }
      case 'CTL-AI-02':
        if (ap('AP-DR-KILL')) { extra.push(['Kill-switch decision AP-DR-KILL (SOC Triage to L0)', 'Orchestrator · kill-switch', ap('AP-DR-KILL').decidedAt || 'Thu 10:23', 'orchestrator', 'JSON', '3 KB', ap('AP-DR-KILL')]); note = 'Real activation on Thu (DV-34): approved by the Head of Run in 18 min'; }
        break;
      case 'CTL-AI-03':
        if (has('releases', 'REL-79')) { extra.push(['Eval report SOC Triage v2.6.0 (98.7%, 30/30 injections blocked)', 'Eval harness', 'Thu 14:05', 'evals', 'PDF', '880 KB', find('releases', 'REL-79')]); note = 'REL-79 promoted with Trust & Challenge sign-off'; }
        break;
      case 'CTL-IAM-04':
        res = 'warn'; note = '41 Treasury operators on push approval under exception RA-121';
        if (has('cases', 'C-2302')) { res = 'fail'; note = 'Exception exploited on Wed (C-2302, MFA fatigue on a payment approver)'; extra.push(['Sign-in log extract t.op-17 (23 pushes, 02:06 to 02:12)', 'Identity provider', 'Wed 02:14', 'ag-iam-resp', 'JSON', '62 KB', find('cases', 'C-2302')]); }
        break;
      case 'CTL-VUL-01':
        if (has('actions', 'A-9836')) { note = 'CVE-2026-41877 on mft-prd-01: protected in 6 min, patched in 30 min'; extra.push(['Emergency change CHG-88412 and post-patch scan', 'ITSM / vulnerability scanner', 'Tue 09:12', 'ag-vuln', 'JSON', '18 KB', find('actions', 'A-9836')]); }
        if (has('wafRules', 'W-121')) extra.push(['Virtual patch W-121 with sandbox replay (182,400 requests, 0 FP)', 'WAF', 'Tue 08:48', 'ag-as-waf', 'YAML', '2 KB', find('wafRules', 'W-121')]);
        break;
      case 'CTL-CHG-02':
        if (ap('AP-CTI-PATCH') && ap('AP-CTI-PATCH').status !== 'pending') { extra.push(['CISO approval AP-CTI-PATCH (signed)', 'Orchestrator · HITL service', ap('AP-CTI-PATCH').decidedAt, 'orchestrator', 'JSON', '3 KB', ap('AP-CTI-PATCH')]); note = 'CHG-88412 approved by the CISO before execution'; }
        break;
      case 'CTL-TP-02': {
        const ans = get('thirdParties').filter((t) => (t.questionnaire || {}).campaign === 'CVE-2026-41877' && ['answered', 'flagged'].indexOf(t.questionnaire.status) >= 0).length;
        if (ans) { note = 'Event-driven campaign CVE-2026-41877: ' + ans + '/14 answered within 4 h'; extra.push(['Campaign answers CVE-2026-41877 (' + ans + ' suppliers)', 'Supplier portal', 'Tue 12:42', 'ag-grc-tprm', 'JSON', '96 KB', find('thirdParties', 'tp-atlas')]); }
        else note = '1,182 of 1,240 assessed in the last 12 months';
        break;
      }
      case 'CTL-TP-05':
        res = 'warn'; note = 'Exit plans exist for 89 of 96 critical arrangements';
        if (get('thirdParties').some((t) => t.gap)) { res = 'fail'; note = '7 critical providers without a tested exit plan (gap disclosed to the supervisor)'; last = 'Mon (S3)'; }
        break;
      case 'CTL-INC-03':
        if (has('regulatory', 'R-DORA-REQ') && get('traces').some((t) => t.id === 'tr-rg-4')) { res = 'fail'; note = '2 of 4 major incidents notified late (5 h 10 and 6 h 40)'; last = 'Mon (S3)'; }
        break;
      case 'CTL-DP-01':
        if (has('comms', 'M-415')) { note = 'C-2302: assessment drafted 15 min after detection, DPO informed'; extra.push(['Breach assessment draft M-415 (1,200 records)', 'GRC repository', 'Wed 02:28', CTA, 'DOCX', '74 KB', find('comms', 'M-415')]); }
        break;
      case 'CTL-DET-02':
        if (has('detections', 'D-418')) { note = 'D-418 backtested on 30 days before going live'; extra.push(['Backtest of D-418 (30 days, 1 hit, 0 FP)', 'Cyber data lake', 'Tue 08:51', 'ag-soc-detect', 'JSON', '14 KB', find('detections', 'D-418')]); }
        break;
      default: break;
    }
    return { res, note, last, ev: c.ev.map((e) => e.concat([null])).concat(extra) };
  }
  const RESULT = { pass: ['green', 'Effective'], warn: ['amber', 'Exception noted'], fail: ['red', 'Deficient'] };

  /* 23 evidence items of the DORA supervisory pack (S3). */
  const DORA_ITEMS = [
    ['Register of ICT third-party arrangements', 'Art. 28', 'TPRM + contracts + CMDB'], ['Arrangements supporting critical functions (96)', 'Art. 28', 'Security graph'], ['Contractual clauses checklist', 'Art. 30', 'Contract repository'],
    ['Sub-contracting chains', 'Art. 28 RTS', 'Supplier portal'], ['Concentration risk analysis', 'Art. 29', 'Security graph'], ['Critical functions and their ICT providers', 'Art. 28', 'Security graph'],
    ['Exit strategies of critical providers', 'Art. 28(8)', 'TPRM inventory'], ['Pre-contract risk assessments (12 months)', 'Art. 28(4)', 'TPRM inventory'], ['ICT third-party risk policy', 'Art. 28(2)', 'Policy repository'],
    ['Board review of third-party policy', 'Art. 5', 'Board minutes'], ['Resilience test reports (12 months)', 'Art. 24-25', 'Data lake'], ['Scenario-based test results', 'Art. 25', 'Data lake'],
    ['Vulnerability assessment summary', 'Art. 25', 'Vulnerability scanner'], ['Business continuity test reports', 'Art. 11', 'BCM tool'], ['TLPT scope and results', 'Art. 26', 'Trust & Challenge'],
    ['Remediation of test findings', 'Art. 24', 'Case history'], ['Incident classification method', 'Art. 18', 'Policy repository'], ['Incident management procedure', 'Art. 17', 'Policy repository'],
    ['Major incidents, timelines, notifications', 'Art. 17-19', 'Case history'], ['Root cause analyses of major incidents', 'Art. 17', 'Case history'], ['Lessons learned register', 'Art. 13', 'Data lake'],
    ['Communication plan and records', 'Art. 14', 'Engage outbox'], ['Board approval of ICT risk framework', 'Art. 5', 'Policy repository']
  ];

  function trailEntries() {
    const out = [];
    get('traces').forEach((t) => {
      const ag = CP.agent(t.actor), per = CP.person(t.actor);
      const type = ag || t.actor === 'orchestrator' ? 'agent' : per ? 'human' : t.actor === 'lod2' || t.actor === 'redteam' || t.actor === 'deviation' ? 'assurance' : 'event';
      out.push({ k: 'tr:' + t.id, kind: 'trace', type, ts: t.ts, actor: t.actor, level: t.level, title: t.title, text: t.text, case: t.case, ref: t, _new: t._new });
    });
    get('approvals').forEach((a) => {
      out.push({ k: 'rq:' + a.id, kind: 'request', type: 'policy', ts: a.createdAt, actor: 'orchestrator', level: a.autonomy, title: 'Escalated to ' + pname(a.decider) + ': ' + a.title, text: a.summary, case: (CP.scenarioById && a.scenario && CP.scenarioById(a.scenario) || {}).caseId, ref: a, _new: a._new });
      if (a.status !== 'pending') out.push({ k: 'dc:' + a.id, kind: 'decision', type: 'decision', ts: a.decidedAt, actor: a.decidedBy || a.decider, level: a.autonomy, title: (a.status === 'approved' ? 'Approved: ' : 'Rejected: ') + a.title, text: a.summary, case: (CP.scenarioById && a.scenario && CP.scenarioById(a.scenario) || {}).caseId, ref: a, _new: a._new });
    });
    get('actions').forEach((x) => out.push({ k: 'ac:' + x.id, kind: 'action', type: 'change', ts: x.ts, actor: x.agent, level: x.level, title: x.action, text: x.system + ' · rollback point ' + (x.rollback ? 'kept' : 'none'), case: (CP.scenarioById && x.scenario && CP.scenarioById(x.scenario) || {}).caseId, ref: x, _new: x._new }));
    [
      { ts: 'Mon 21:58', actor: 'ag-as-waf', level: 'L2', title: 'Blocked by policy: WAF Tuning Agent tried to disable rule 942100 in production', text: 'Out of mandate: disabling a blocking rule needs L1 approval. The agent opened a request instead.' },
      { ts: 'Mon 17:28', actor: 'p-marc', level: 'L1', title: 'Approved: message M-401 to LexAdvisors (leaked credentials)', text: 'External communication validated by the third-party risk lead.', type: 'decision' },
      { ts: 'Tue 04:10', actor: 'ag-grc-tprm', level: 'L1', title: 'Blocked by policy: prompt-injection text detected in a supplier answer', text: 'Answer quarantined; analyst review requested. Matches red team case RT-58.' }
    ].forEach((s, i) => out.push({ k: 'bs:' + i, kind: 'static', type: s.type || 'policy', ts: s.ts, actor: s.actor, level: s.level, title: s.title, text: s.text, case: '', ref: null }));
    out.sort((a, b) => tsKey(a.ts) - tsKey(b.ts));
    let prev = 'genesis-2026-10-12';
    out.forEach((e, i) => { e.seq = 48211 + i; e.prev = prev; e.hash = hx(prev + '|' + e.k + '|' + e.ts + '|' + e.title); prev = e.hash; });
    return out.reverse();
  }
  const TTYPE = { agent: ['bot', 'Agent step', 'var(--indigo)'], human: ['user', 'Human action', 'var(--green-ink)'], decision: ['check', 'Human decision', 'var(--green-ink)'], change: ['zap', 'Executed change', '#a56b00'], policy: ['shield', 'Policy check', '#5a2be0'], event: ['globe', 'External event', 'var(--muted)'], assurance: ['shieldCheck', 'Assurance', '#5a2be0'] };

  const POPS = {
    actions: { label: 'Agent actions · last 30 days', attr: 'Authorised by decision rights, correct outcome, signed log entry' },
    decisions: { label: 'Human decisions · last 90 days', attr: 'Decided by the holder of the right, before execution, with the facts recorded' },
    evidence: { label: 'Evidence items · Q3 2026', attr: 'Hash matches the source, collected by the declared agent, in scope of the control' }
  };
  function popSize(p) {
    if (p === 'actions') return get('agents').reduce((n, a) => n + a.tasksToday, 0) * 22;
    if (p === 'decisions') return 412 + get('approvals').filter((a) => a.status !== 'pending').length;
    return 1846;
  }
  const TPL = {
    soc: ['Closed benign alert (VPN egress flagged as impossible travel)', 'Quarantined 12 emails from a lookalike domain', 'Raised patch change for a CVSS 8.8 web server flaw', 'Blocked a C2 domain (confidence 94%)', 'Grouped 31 alerts into one case'],
    iam: ['Revoked sessions after a risky sign-in', 'Removed a dormant account after manager confirmation', 'Flagged a toxic access combination for review'],
    grc: ['Mapped 14 control tests to NIS2 measures', 'Analysed a supplier questionnaire answer', 'Drafted a supplier reminder (sent after validation)'],
    appsec: ['Commented a pull request: SQL injection risk', 'Tuned a WAF rule (sandbox replay, 0 FP)'],
    data: ['Collected evidence: firewall rule export', 'Investigated a data-loss alert: false positive', 'Collected evidence: access review campaign results'],
    cti: ['Ingested an advisory, 0 group assets matched', 'Scored exposure of 3 servers to a new CVE']
  };
  const DEC_TPL = [['p-marc', 'Validated a supplier message (external communication)'], ['p-chloe', 'Approved an executive account suspension'], ['p-amira', 'Approved a regulatory submission'], ['p-elena', 'Approved an emergency patch outside the window'], ['p-ines', 'Promoted an agent version to canary'], ['p-hugo', 'Held outgoing payments pending call-backs'], ['p-lucas', 'Approved a third-party connection restriction'], ['p-chloe', 'Lowered an agent autonomy level']];
  const EV_TPL = [['Sign-in policy export', 'Identity provider'], ['Firewall rule set', 'Firewall'], ['Access review campaign results', 'IGA'], ['Backup restore test log', 'Backup platform'], ['Patch compliance report', 'Vulnerability scanner'], ['Supplier assessment record', 'TPRM inventory'], ['Detection backtest report', 'Cyber data lake'], ['Change record', 'ITSM']];
  const MON = ['Sep', 'Sep', 'Sep', 'Oct', 'Oct'];
  function drawSample(pop, n, seed) {
    const r = rng(seed + '|' + pop), N = popSize(pop), out = [], used = {};
    const agents = get('agents');
    const totalT = agents.reduce((s, a) => s + a.tasksToday, 0);
    const real = pop === 'decisions' ? get('approvals').filter((a) => a.status !== 'pending') : [];
    for (let i = 0; i < Math.min(n, N); i++) {
      let idx; do { idx = Math.floor(r() * N); } while (used[idx]); used[idx] = 1;
      const day = 1 + Math.floor(r() * 28), hh = Math.floor(r() * 24), mm = Math.floor(r() * 60);
      const when = (day <= 12 ? 'Oct ' + day : MON[Math.floor(r() * 3)] + ' ' + (day + 1)) + ' ' + pad(hh) + ':' + pad(mm);
      if (pop === 'actions') {
        let x = r() * totalT, ag = agents[0]; for (const a of agents) { x -= a.tasksToday; if (x <= 0) { ag = a; break; } }
        const tl = TPL[ag.domain] || TPL.soc;
        out.push({ id: 'A-' + (900000 - idx), when, who: ag.id, what: tl[Math.floor(r() * tl.length)], lvl: ag.mode, pop });
      } else if (pop === 'decisions') {
        if (idx < real.length) { const a = real[idx]; out.push({ id: a.id, when: a.decidedAt, who: a.decidedBy || a.decider, what: (a.status === 'approved' ? 'Approved: ' : 'Rejected: ') + a.title, lvl: a.autonomy, pop }); continue; }
        const d = DEC_TPL[Math.floor(r() * DEC_TPL.length)];
        out.push({ id: 'AP-' + (7000 + idx), when, who: d[0], what: d[1], lvl: 'L1', pop });
      } else {
        const e = EV_TPL[Math.floor(r() * EV_TPL.length)];
        out.push({ id: 'EV-' + (20000 + idx), when, who: EVA, what: e[0] + ' · ' + e[1], lvl: 'L3', pop, hash: shortHash('ev' + idx) });
      }
    }
    return out;
  }

  CP.screen({
    id: 'auditor', part: 2, role: 'auditor', label: 'Evidence room', icon: 'search',
    ui: { q: '', type: 'all', caseF: 'all', chain: null, access: [], pop: 'actions', size: 60, seed: 1, sample: null, results: {} },

    render(route) {
      const sub = route.sub || 'controls';
      const s3 = find('regulatory', 'R-DORA-REQ');
      const groups = [
        { label: 'Evidence', tabs: [{ id: 'controls', label: 'Controls & evidence', icon: 'shieldCheck' }, { id: 'packs', label: 'Evidence packs', icon: 'box', count: s3 ? 'new' : '' }] },
        { label: 'Trail', tabs: [{ id: 'trail', label: 'Signed audit trail', icon: 'fingerprint' }] },
        { label: 'Testing', tabs: [{ id: 'sampling', label: 'Sampling', icon: 'filter' }] },
        { label: 'Governance', tabs: [{ id: 'register', label: 'AI register', icon: 'book' }] }
      ];
      const ro = '<div class="ar-ro" role="note"><b>' + I('eye') + ' Read-only · third line of defence</b><span>Nothing here can be changed. Every view is logged in your access log; evidence comes straight from the evidence vault, never from the agents\' own reports.</span><span class="ar-links"><a href="#/cases">' + I('workflow') + ' Cases</a><a href="#/trust">' + I('shieldCheck') + ' Assurance (LoD2)</a></span></div>';
      let body;
      if (sub === 'packs') body = this.rPacks();
      else if (sub === 'trail') body = this.rTrail();
      else if (sub === 'sampling') body = this.rSampling();
      else if (sub === 'register') body = this.rRegister();
      else body = this.rControls();
      return ui.tabbar('auditor', groups, sub, persona('p-auditor')) + ro + body;
    },
    logAccess(what) { this.ui.access.unshift({ ts: hm(clockLabel()), what }); this.ui.access = this.ui.access.slice(0, 12); },

    rControls() {
      const rows = CONTROLS.map((c) => { const s = ctlState(c); return Object.assign({ c, s, _new: s.ev.some((e) => e[6] && CP.store.isNew(e[6])) ? Date.now() : 0 }, { id: c.id }); });
      const def = rows.filter((r) => r.s.res === 'fail').length, warn = rows.filter((r) => r.s.res === 'warn').length;
      const nEv = rows.reduce((n, r) => n + r.s.ev.length, 0);
      const s3 = find('regulatory', 'R-DORA-REQ');
      const head = ui.head('Evidence room · internal audit', 'Controls and evidence', 'Each control shows its evidence with full provenance: source system, collection time, collector agent, hash and chain of custody. Open a control to inspect and verify.', '');
      const metrics = '<div class="metrics" style="margin-bottom:18px">' + ui.metric({ label: 'Key controls in scope', icon: 'shieldCheck', value: CONTROLS.length, foot: 'of 48 in the Q4 audit plan' }) +
        ui.metric({ label: 'Deficient or with exceptions', icon: 'alert', value: def + warn, foot: def + ' deficient · ' + warn + ' exception' + (warn > 1 ? 's' : ''), color: def ? 'var(--red-ink)' : undefined }) +
        ui.metric({ label: 'Evidence items attached', icon: 'box', value: nEv, foot: '1,846 in the vault this quarter' }) +
        ui.metric({ label: 'Hash and signature checks', icon: 'fingerprint', value: '100', unit: '%', foot: 'last chain verification ' + (this.ui.chain && this.ui.chain.done ? this.ui.chain.at : 'Tue 08:00') }) + '</div>';
      const notice = s3 ? '<div class="notice info" style="margin-bottom:18px">' + I('box') + ' <b>New evidence pack:</b> DORA supervisory request (' + s3.collected + '/23 items). <a href="' + CP.href('auditor', 'packs') + '">Open it in Evidence packs</a>' + (find('cases', 'C-2303') && find('cases', 'C-2303').status === 'closed' ? ', including the LoD2 re-sample.' : '.') + '</div>' : '';
      const tbl = ui.table([
        { label: 'Control', render: (r) => '<b style="font-weight:600">' + esc(r.c.name) + '</b><div class="small-txt muted mono">' + esc(r.c.id) + '</div>' },
        { label: 'Framework', render: (r) => '<span class="small-txt">' + esc(r.c.fw) + '</span>' },
        { label: 'Owner', render: (r) => '<span class="small-txt">' + esc(pname(r.c.owner)) + '</span>' },
        { label: 'Result', render: (r) => ui.tag(esc(RESULT[r.s.res][1]), RESULT[r.s.res][0]) + '<div class="small-txt muted" style="margin-top:3px;max-width:280px">' + esc(r.s.note) + '</div>' },
        { label: 'Evidence', render: (r) => '<span class="num">' + r.s.ev.length + '</span>' },
        { label: '', render: (r) => '<button class="small" data-action="arCtl" data-id="' + r.c.id + '">' + I('search') + ' Inspect</button>' }
      ], rows, { rowClass: () => 'clickable', rowAttrs: (r) => 'data-action="arCtl" data-id="' + r.c.id + '"' });
      const acc = ui.card('Your access log', this.ui.access.length ? '<div class="ar-log">' + this.ui.access.map((a) => '<div><time>' + esc(a.ts) + '</time><span>' + esc(a.what) + '</span></div>').join('') + '</div>' : '<div class="empty" style="padding:16px">Your views appear here. Internal audit\'s own access is logged like everyone else\'s.</div>', { sub: 'Visible to the audit committee chair' });
      const how = ui.card('Why you can rely on it', '<div class="kv"><dt>Collection</dt><dd>Read-only connectors, service account svc-evidence-ro</dd><dt>Integrity</dt><dd>SHA-256 at source, hash chain, write-once vault (10 years)</dd><dt>Independence</dt><dd>Evidence never comes from the acting agent\'s own report</dd><dt>Second line</dt><dd>LoD2 re-samples 10% against source systems</dd></div>');
      return head + metrics + notice + '<div class="grid ar-split">' + ui.card('Key controls', tbl, { cls: 'accent', sub: 'Live results: scenario events update the controls they touch.' }) + '<div class="stack">' + how + acc + '</div></div>';
    },
    ctlModal(id) {
      const c = CONTROLS.find((x) => x.id === id); if (!c) return;
      const s = ctlState(c);
      this.logAccess('Opened ' + c.id + ' (' + s.ev.length + ' evidence items)');
      const evs = s.ev.map((e, i) => {
        const h = hx(c.id + e[0] + e[2]);
        const coll = e[3];
        const custody = [
          ['ok', e[2], 'Collected by ' + CP.actor(coll).name + ' through a read-only connector (' + esc(e[1]) + ')'],
          ['ok', e[2], 'Hashed at source: SHA-256 ' + h.slice(0, 12) + '…'],
          ['ok', addMin(e[2], 1) ? dayOf(e[2]) + ' ' + addMin(e[2], 1) : e[2], 'Stored in the write-once evidence vault (retention 10 years)'],
          ['', addMin(e[2], 3) ? dayOf(e[2]) + ' ' + addMin(e[2], 3) : e[2], 'Mapped to ' + c.id + ' by the Controls & Evidence Agent'],
          (i === 0 ? ['', 'Sep 2026', 'Re-sampled by LoD2 assurance: hash matched the source'] : null),
          ['me', hm(clockLabel()) ? dayOf(clockLabel()) + ' ' + hm(clockLabel()) : '', 'Viewed by Internal auditor (this view, logged)']
        ].filter(Boolean);
        return '<div class="ar-ev"><div class="eh"><b>' + esc(e[0]) + '</b>' + ui.tag(esc(e[4]) + ' · ' + esc(e[5]), 'outline') + '<span class="ar-ver" id="arv-' + i + '">' + I('check') + ' Hash verified</span></div>' +
          '<dl class="kv"><dt>Source system</dt><dd>' + esc(e[1]) + '</dd><dt>Collected</dt><dd>' + esc(e[2]) + '</dd><dt>Collector</dt><dd>' + esc(CP.actor(coll).name) + (CP.agent(coll) ? ' v' + esc(CP.agent(coll).version) : '') + '</dd><dt>SHA-256</dt><dd class="ar-hash">' + h + '</dd></dl>' +
          '<div class="small-txt" style="margin-top:8px;font-weight:650">Chain of custody</div><div class="ar-cust">' + custody.map((k) => '<div><span class="d ' + k[0] + '"></span><time>' + esc(k[1]) + '</time><span>' + k[2] + '</span></div>').join('') + '</div>' +
          '<div class="row" style="margin-top:8px"><button class="small" data-action="arVerify" data-i="' + i + '">' + I('fingerprint') + ' Re-verify hash</button></div></div>';
      }).join('');
      CP.modal(esc(c.id) + ' · ' + esc(c.name), '<div class="row wrap" style="margin-bottom:12px">' + ui.tag(esc(RESULT[s.res][1]), RESULT[s.res][0]) + '<span class="small-txt muted">' + esc(c.fw) + ' · owner ' + esc(pname(c.owner)) + ' · tested ' + esc(c.freq.toLowerCase()) + '</span></div><div class="notice' + (s.res === 'pass' ? ' ok' : s.res === 'fail' ? ' error' : '') + '" style="margin-bottom:14px">' + esc(s.note) + '</div>' + evs,
        '<span class="small-txt muted" style="margin-right:auto">Read-only. Export is watermarked and logged.</span><button data-action="arExportCtl" data-id="' + c.id + '">' + I('file') + ' Export with manifest</button><button class="primary" data-close-modal>Close</button>');
      CP.render();
    },

    rPacks() {
      const s3 = find('regulatory', 'R-DORA-REQ');
      const c2303 = find('cases', 'C-2303');
      const resampled = c2303 && c2303.status === 'closed';
      const packs = [];
      if (s3) packs.push({ id: 'EP-DORA-REQ', live: true, t: 'DORA supervisory request: ICT register, resilience tests, incident log', meta: s3.collected + ' of 23 items · due ' + s3.due + ' · owner ' + pname(s3.owner) + ' · status ' + (s3.status === 'submitted' ? 'submitted' : 'in preparation'), pr: Math.round(s3.collected / 23 * 100), st: s3.status === 'submitted' ? 'submitted' : 'in-progress', lod2: resampled ? '10% re-sampled by LoD2: 3 items, 412 source records, 0 discrepancy (Tue 09:20)' : s3.status === 'submitted' ? 'LoD2 re-sample running' : 'LoD2 re-sample after submission', it: s3 });
      const nis = find('regulatory', 'R-NIS2') || {}, roi = find('regulatory', 'R-DORA-ROI') || {}, ai = find('regulatory', 'R-AIACT') || {};
      packs.push(
        { id: 'EP-NIS2', t: 'NIS2 annual self-assessment', meta: (nis.collected || 312) + ' of ' + (nis.total || 380) + ' items · due ' + (nis.due || '31 Jan 2027'), pr: Math.round((nis.collected || 312) / (nis.total || 380) * 100), st: 'in-progress', lod2: 'Last LoD2 re-sample Sep 2026: 1 discrepancy (outdated screenshot, corrected in 2 h)' },
        { id: 'EP-ROI', t: 'DORA register of information (quarterly)', meta: (roi.collected || 1182) + ' of ' + (roi.total || 1240) + ' arrangements · due ' + (roi.due || '30 Nov 2026'), pr: Math.round((roi.collected || 1182) / (roi.total || 1240) * 100), st: 'on-track', lod2: 'Last LoD2 re-sample Aug 2026: 62 arrangements, 0 discrepancy' },
        { id: 'EP-AI', t: 'AI Act inventory and classification of AI systems', meta: (ai.collected || 41) + ' of ' + (ai.total || 64) + ' systems documented · due ' + (ai.due || '2 Aug 2027'), pr: Math.round((ai.collected || 41) / (ai.total || 64) * 100), st: 'on-track', lod2: 'Not yet re-sampled' },
        { id: 'EP-ISO', t: 'ISO 27001 surveillance audit pack', meta: '240 items · delivered Jul 2026', pr: 100, st: 'done', lod2: 'LoD2 re-sample Jul 2026: 24 items, 0 discrepancy' }
      );
      const head = ui.head('Evidence room · packs', 'Evidence packs', 'Packs assembled by the platform for supervisors and auditors. Each item keeps its link to the source system, so you can re-perform any of them.', '');
      const grid = '<div class="grid g2">' + packs.map((p) => '<div class="ar-pack' + (p.live ? ' live' : '') + (p.it ? ui.newCls(p.it) : '') + '"><div class="row between" style="align-items:flex-start"><h3>' + esc(p.t) + '</h3>' + ui.status(p.st) + '</div><div class="meta">' + esc(p.meta) + '</div>' + ui.progress(p.pr, p.pr === 100 ? 'green' : '') +
        '<div class="meta">' + I('shieldCheck') + ' ' + esc(p.lod2) + '</div><div class="row"><span class="mono small-txt muted">' + esc(p.id) + '</span><span class="spacer"></span><button class="small" data-action="arPack" data-id="' + p.id + '">' + I('search') + ' Open pack</button></div></div>').join('') + '</div>';
      const empty = s3 ? '' : '<div class="notice info" style="margin-bottom:18px">' + I('info') + ' Run scenario S3 (regulator request) to see a DORA supervisory pack assembled live, then re-sampled by the second line.</div>';
      return head + empty + grid;
    },
    packModal(id) {
      this.logAccess('Opened evidence pack ' + id);
      if (id !== 'EP-DORA-REQ') {
        CP.modal(esc(id), '<p class="small-txt">Items, sources and hashes are listed in the pack manifest. Open a control in Controls &amp; evidence to inspect the provenance of an item.</p>' + ui.code('manifest: ' + id + '\nsigned_by: platform-signer-2026-03 (ed25519)\nitems_hash_root: ' + hx(id).slice(0, 32) + '\nverified: true', 'yaml'), '<button class="primary" data-close-modal>Close</button>');
        CP.render(); return;
      }
      const s3 = find('regulatory', 'R-DORA-REQ') || { collected: 0 };
      const c2303 = find('cases', 'C-2303'); const resampled = c2303 && c2303.status === 'closed';
      const picked = [0, 10, 18];
      const tbl = ui.table([
        { label: '#', render: (r) => '<span class="mono small-txt ar-nw">EV-' + pad(r.i + 1) + '</span>' },
        { label: 'Evidence', render: (r) => esc(r.e[0]) },
        { label: 'DORA', render: (r) => '<span class="small-txt">' + esc(r.e[1]) + '</span>' },
        { label: 'Source', render: (r) => '<span class="small-txt">' + esc(r.e[2]) + '</span>' },
        { label: 'Hash', render: (r) => r.i < s3.collected ? '<span class="ar-hash ar-nw">' + shortHash('dora' + r.i) + '</span>' : '<span class="muted small-txt">pending</span>' },
        { label: 'LoD2', render: (r) => resampled && picked.indexOf(r.i) >= 0 ? ui.tag(I('check') + ' Re-sampled', 'green') : '' }
      ], DORA_ITEMS.map((e, i) => ({ e, i })), { max: 380 });
      CP.modal('DORA supervisory pack · R-DORA-REQ', '<div class="row wrap" style="margin-bottom:12px">' + ui.status(s3.status === 'submitted' ? 'submitted' : 'in-progress') + '<span class="small-txt muted">' + s3.collected + ' of 23 items · case <a href="#/cases/C-2303" data-close-modal>C-2303</a> · assembled by Evidence Collector and Controls &amp; Evidence Agent</span></div>' +
        (resampled ? '<div class="notice ok" style="margin-bottom:12px"><b>LoD2 re-sample: 0 discrepancy.</b> 10% of the items (EV-01 register extract, EV-11 resilience test reports, EV-19 incident timelines) re-checked against TPRM, CMDB and the case history: 412 source records, Tue 09:20, signed by LoD2 assurance.</div>' : '<div class="notice" style="margin-bottom:12px">LoD2 re-samples 10% of the items against the source systems once the pack is submitted.</div>') +
        (s3.status === 'submitted' ? '<div class="small-txt" style="margin-bottom:10px">' + I('send') + ' Submitted on the supervisor portal with proactive disclosure of 3 gaps (decision AP-RG-SUBMIT, Head of Engage, CISO co-signature).</div>' : '') + tbl,
      '<button data-action="arExportCtl" data-id="EP-DORA-REQ">' + I('file') + ' Export with manifest</button><button class="primary" data-close-modal>Close</button>');
      CP.render();
    },

    rTrail() {
      const all = trailEntries();
      const cases = Array.from(new Set(all.map((e) => e.case).filter(Boolean))).sort();
      const types = [['all', 'All entries'], ['agent', 'Agent steps'], ['decision', 'Human decisions'], ['change', 'Executed changes'], ['policy', 'Policy checks'], ['assurance', 'Assurance'], ['event', 'External events']];
      const rows = all.filter((e) => (this.ui.type === 'all' || e.type === this.ui.type || (this.ui.type === 'decision' && e.type === 'human')) && (this.ui.caseF === 'all' || e.case === this.ui.caseF));
      const ch = this.ui.chain;
      const verify = ch && ch.running ? '<span class="ar-ver run">' + I('clock') + ' Verifying ' + CP.fmt(ch.n) + ' entries…</span>' : ch && ch.done ? '<span class="ar-ver">' + I('check') + ' Chain intact · ' + CP.fmt(ch.n) + ' entries · verified ' + esc(ch.at) + '</span>' : '';
      const head = ui.head('Evidence room · trail', 'Signed audit trail', 'Every agent step, policy check, human decision and executed change, in one hash-chained trail. Each entry is signed; the chain is anchored hourly with a trusted timestamp.', '<button data-action="arChain">' + I('fingerprint') + ' Verify the chain</button><button data-action="arExport">' + I('file') + ' Export signed CSV</button>');
      const filters = '<div class="ar-filters"><label>Type<select data-change="arType">' + types.map((t) => '<option value="' + t[0] + '"' + (t[0] === this.ui.type ? ' selected' : '') + '>' + t[1] + '</option>').join('') + '</select></label>' +
        '<label>Case<select data-change="arCase"><option value="all">All cases</option>' + cases.map((c) => '<option' + (c === this.ui.caseF ? ' selected' : '') + '>' + esc(c) + '</option>').join('') + '</select></label>' +
        '<label>Search<input id="ar-q" type="search" placeholder="Actor, action, case…" value="' + esc(this.ui.q) + '"></label><span class="spacer"></span><span class="small-txt muted" id="ar-count">' + rows.length + ' entries</span>' + verify + '</div>';
      const tbl = ui.table([
        { label: '#', render: (e) => '<span class="mono small-txt muted">' + e.seq + '</span>' },
        { label: 'Time', render: (e) => '<span class="mono small-txt">' + esc(e.ts) + '</span>' },
        { label: 'Type', render: (e) => { const t = TTYPE[e.type] || TTYPE.event; return '<span class="ar-type" style="color:' + t[2] + '">' + I(t[0]) + esc(t[1]) + '</span>'; } },
        { label: 'Actor', render: (e) => ui.who(e.actor) },
        { label: 'What', render: (e) => '<span style="font-size:13px">' + esc(e.title) + '</span>' },
        { label: 'Case', render: (e) => e.case ? '<a class="case-link ar-nw" href="#/cases/' + esc(e.case) + '">' + esc(e.case) + '</a>' : '<span class="muted">·</span>' },
        { label: 'Level', render: (e) => e.level ? ui.lvl(e.level) : '' },
        { label: 'Integrity', render: (e) => '<span class="ar-hash">' + e.hash.slice(0, 8) + '</span> <span class="ar-ver">' + I('check') + ' Signed</span>' }
      ], rows, { max: 640, empty: 'No entry matches these filters.', rowClass: () => 'clickable', rowAttrs: (e) => 'data-action="arEntry" data-k="' + esc(e.k) + '" data-text="' + esc((e.title + ' ' + e.actor + ' ' + CP.actor(e.actor).name + ' ' + (e.case || '') + ' ' + e.ts).toLowerCase()) + '"' });
      const empty = get('traces').length ? '' : '<div class="notice info" style="margin-bottom:12px">' + I('info') + ' Run a scenario to watch agent steps and human decisions arrive in the trail, each signed and chained.</div>';
      return head + empty + ui.card('', filters + tbl, { cls: 'accent', tour: 'auditor-trail' });
    },
    entryModal(k) {
      const e = trailEntries().find((x) => x.k === k); if (!e) return;
      this.logAccess('Opened trail entry #' + e.seq);
      const t = TTYPE[e.type] || TTYPE.event;
      let body = '<div class="row wrap" style="margin-bottom:12px"><span class="ar-type" style="color:' + t[2] + '">' + I(t[0]) + esc(t[1]) + '</span>' + (e.level ? ui.lvl(e.level) : '') + '<span class="small-txt muted">' + esc(e.ts) + '</span>' + (e.case ? '<a class="case-link" href="#/cases/' + esc(e.case) + '" data-close-modal>' + esc(e.case) + '</a>' : '') + '<span class="spacer"></span>' + ui.who(e.actor) + '</div>';
      body += '<p style="margin:0 0 12px;font-size:14px">' + esc(e.text || '') + '</p>';
      if (e.kind === 'trace') {
        const tr = e.ref, tools = toolsOf(tr.flow);
        const L = (CP.data.autonomy || []).find((x) => x.id === tr.level) || {};
        const gate = tr.gate ? find('approvals', tr.gate) : null;
        body += '<div class="grid g2" style="margin-bottom:12px"><div><div class="small-txt" style="font-weight:650;margin-bottom:4px">Tool calls (from the execution graph)</div><div class="ar-tools">' + (tools.length ? tools.map((x) => '<div>' + I('terminal') + '<code>' + esc(x[0]) + '</code><small>' + esc(x[1]) + '</small></div>').join('') : '<div>' + I('info') + '<span>No tool call: observation only</span></div>') + '</div></div>' +
          '<div><div class="small-txt" style="font-weight:650;margin-bottom:4px">Policy check</div><dl class="kv"><dt>Level</dt><dd>' + esc(L.label || tr.level) + '</dd><dt>Rule</dt><dd>' + esc(L.desc || '') + '</dd>' + (gate ? '<dt>Threshold</dt><dd>' + esc(gate.threshold || '') + '</dd><dt>Decider</dt><dd>' + esc(pname(gate.decider)) + ' · ' + esc(gate.status) + '</dd>' : '<dt>Decider</dt><dd>None needed (within mandate)</dd>') + '</dl></div></div>';
        if (tr.artifact) {
          const a = tr.artifact;
          body += '<div class="small-txt" style="font-weight:650;margin-bottom:4px">Output: ' + esc(a.title || '') + '</div>' +
            (a.type === 'code' ? ui.code(a.body, a.lang) : a.type === 'email' ? ui.email(a) : a.type === 'list' ? '<ul style="font-size:13px;line-height:1.55;margin:0 0 8px">' + a.items.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' : a.type === 'table' ? ui.table(a.cols.map((c, i) => ({ label: c, render: (r) => esc(r[i]) })), a.rows) : '');
        }
      } else if (e.kind === 'decision' || e.kind === 'request') {
        const a = e.ref;
        body += '<dl class="kv" style="margin-bottom:12px"><dt>Requested by</dt><dd>' + esc(CP.actor(a.requestedBy).name) + ' at ' + esc(a.createdAt || '') + '</dd><dt>Threshold</dt><dd>' + esc(a.threshold || '') + '</dd><dt>Decision holder</dt><dd>' + esc(pname(a.decider)) + '</dd><dt>Outcome</dt><dd>' + ui.status(a.status) + (a.decidedAt ? ' at ' + esc(a.decidedAt) : '') + '</dd><dt>Recommendation shown</dt><dd>' + esc(a.recommendation || '') + '</dd>' + (e.kind === 'decision' ? '<dt>Signature</dt><dd>Decider device key (FIDO2) · verified</dd>' : '') + '</dl>';
      } else if (e.kind === 'action') {
        const x = e.ref;
        body += '<dl class="kv" style="margin-bottom:12px"><dt>Action</dt><dd>' + esc(x.id) + '</dd><dt>System</dt><dd>' + esc(x.system) + '</dd><dt>Executed by</dt><dd>Executor on behalf of ' + esc(CP.actor(x.agent).name) + '</dd><dt>Rollback point</dt><dd>' + (x.rollback ? 'Kept (one-click rollback)' : 'None') + '</dd></dl>';
      }
      body += '<div class="small-txt" style="font-weight:650;margin:10px 0 4px">Integrity</div><dl class="kv"><dt>Entry</dt><dd class="mono">#' + e.seq + '</dd><dt>Entry hash</dt><dd class="ar-hash">' + e.hash + '</dd><dt>Previous hash</dt><dd class="ar-hash">' + esc(e.prev) + '</dd><dt>Signature</dt><dd><span class="ar-ver">' + I('check') + ' Verified</span> ed25519 · key platform-signer-2026-03</dd><dt>Time anchor</dt><dd>Trusted timestamp (RFC 3161) · ' + esc(dayOf(e.ts)) + ' ' + esc(addMin((hm(e.ts) || '00:00').slice(0, 2) + ':00', 60)) + '</dd></dl>';
      CP.modal('Trail entry #' + e.seq + ' · ' + esc(e.title.slice(0, 70)), body, '<span class="small-txt muted" style="margin-right:auto">Read-only</span><button class="primary" data-close-modal>Close</button>');
      CP.render();
    },

    rSampling() {
      const pop = this.ui.pop, N = popSize(pop);
      const sample = this.ui.sample && this.ui.sample.pop === pop ? this.ui.sample : null;
      const seedLabel = 'AUD-Q4-' + pad(this.ui.seed) + '-' + pop.toUpperCase().slice(0, 3);
      const head = ui.head('Evidence room · testing', 'Sampling', 'Pick a population, set the sample size, draw a reproducible random sample and record your test results. Results stay in your workpaper (this browser).', '');
      const ctrl = '<div class="ar-samp-head"><label>Population<select data-change="arPop">' + Object.keys(POPS).map((k) => '<option value="' + k + '"' + (k === pop ? ' selected' : '') + '>' + POPS[k].label + '</option>').join('') + '</select></label>' +
        '<label>Population size<input type="text" value="' + CP.fmt(N) + ' items" readonly aria-readonly="true"></label>' +
        '<label>Sample size<select data-change="arSize">' + [[25, '25 · 90% confidence, 9% tolerable'], [60, '60 · 95% confidence, 5% tolerable'], [100, '100 · 95% confidence, 3% tolerable']].map((o) => '<option value="' + o[0] + '"' + (o[0] === this.ui.size ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></label>' +
        '<label>Random seed<input type="text" value="' + seedLabel + '" readonly aria-readonly="true"></label>' +
        '<div class="row" style="gap:6px"><button class="primary" data-action="arDraw">' + I('filter') + ' Draw sample</button><button data-action="arReseed" title="New seed">' + I('restart') + '</button></div></div>' +
        '<div class="small-txt muted" style="margin:-4px 0 12px">Attribute tested: ' + esc(POPS[pop].attr) + '. Sample drawn from the evidence vault, not from agent reports. The seed makes the draw reproducible by the external auditor.</div>';
      let tbl = '', concl = '';
      if (sample) {
        const res = this.ui.results[sample.key] || {};
        const tested = sample.items.filter((x) => res[x.id] && res[x.id] !== '').length;
        const exc = sample.items.filter((x) => res[x.id] === 'exc').length;
        tbl = ui.table([
          { label: 'Item', render: (x) => '<span class="mono small-txt">' + esc(x.id) + '</span>' },
          { label: 'When', render: (x) => '<span class="small-txt">' + esc(x.when) + '</span>' },
          { label: 'Actor', render: (x) => ui.who(x.who) },
          { label: 'What', render: (x) => '<span style="font-size:13px">' + esc(x.what) + '</span>' + (x.hash ? '<div class="ar-hash">' + esc(x.hash) + '</div>' : '') },
          { label: 'Level', render: (x) => ui.lvl(x.lvl) },
          { label: 'Re-perform', render: (x) => '<button class="small ghost" data-action="arReperf" data-id="' + esc(x.id) + '">' + I('search') + ' Evidence</button>' },
          { label: 'Result', render: (x) => '<span class="ar-res"><label class="sr" for="r-' + esc(x.id) + '">Result for ' + esc(x.id) + '</label><select id="r-' + esc(x.id) + '" data-change="arResult" data-id="' + esc(x.id) + '" class="' + (res[x.id] || '') + '"><option value="">Not tested</option><option value="pass"' + (res[x.id] === 'pass' ? ' selected' : '') + '>Pass</option><option value="exc"' + (res[x.id] === 'exc' ? ' selected' : '') + '>Exception</option><option value="na"' + (res[x.id] === 'na' ? ' selected' : '') + '>N/A</option></select></span>' }
        ], sample.items, { max: 520 });
        const rate = tested ? exc / tested * 100 : 0;
        const tol = this.ui.size === 25 ? 9 : this.ui.size === 100 ? 3 : 5;
        concl = '<div class="ar-concl ' + (tested === sample.items.length ? (exc ? 'ko' : 'ok') : '') + '"><b>' + tested + ' of ' + sample.items.length + ' tested · ' + exc + ' exception' + (exc === 1 ? '' : 's') + (tested ? ' · deviation rate ' + CP.fmt(rate, 1) + '%' : '') + '.</b> ' +
          (tested < sample.items.length ? 'Conclusion available once every item is tested.' : exc ? 'Exceptions found: the control cannot be relied on at ' + tol + '% tolerable deviation. Extend the sample or report a finding.' : 'No exception: the control operates effectively at ' + (this.ui.size === 25 ? 90 : 95) + '% confidence for a ' + tol + '% tolerable deviation.') +
          '</div><div class="row wrap" style="margin-top:10px"><button class="small" data-action="arMarkAll">' + I('check') + ' Mark untested as pass</button><button class="small" data-action="arExportWp">' + I('file') + ' Export workpaper</button><span class="small-txt muted">Saved locally · drawn ' + esc(sample.at) + ' · seed ' + esc(sample.seed) + '</span></div>';
      } else {
        tbl = '<div class="empty">' + I('filter') + ' No sample drawn yet for this population. Choose a size and draw: items come with their source record so you can re-perform the test.</div>';
      }
      return head + ui.card('', ctrl + tbl + concl, { cls: 'accent', tour: 'auditor-sampling' });
    },
    reperfModal(id) {
      const s = this.ui.sample; const x = s && s.items.find((i) => i.id === id); if (!x) return;
      this.logAccess('Re-performed sample item ' + id);
      const right = (CP.data.rights || []).find((r) => r.domain === (CP.agent(x.who) || {}).domain) || CP.data.rights[0];
      CP.modal('Re-perform · ' + esc(id), '<dl class="kv"><dt>Item</dt><dd>' + esc(x.what) + '</dd><dt>When</dt><dd>' + esc(x.when) + '</dd><dt>Actor</dt><dd>' + esc(CP.actor(x.who).name) + '</dd><dt>Source record</dt><dd>Retrieved from the cyber data lake (write-once partition)</dd><dt>Hash</dt><dd class="ar-hash">' + hx(id + x.when) + ' <span class="ar-ver">' + I('check') + ' matches</span></dd><dt>Decision right applied</dt><dd>' + esc(right.action) + ' · ' + esc(right.level) + (right.decider ? ' · decider ' + esc(pname(right.decider)) : ' · no human needed') + '</dd><dt>Signature</dt><dd><span class="ar-ver">' + I('check') + ' Verified</span> ed25519</dd></dl>',
        '<button class="primary" data-close-modal>Close</button>');
      CP.render();
    },

    rRegister() {
      const ags = get('agents');
      const evals = get('evals');
      const c2304 = find('cases', 'C-2304');
      const lv = { L0: 0, L1: 0, L2: 0, L3: 0 }; ags.forEach((a) => { lv[a.mode] = (lv[a.mode] || 0) + 1; });
      const head = ui.head('Evidence room · governance', 'AI register summary', 'Every agent acting in the platform, its purpose, risk class, autonomy and track record. Full register and evals in Assurance.', '<a class="btn-demo" style="background:#fff;border:1px solid var(--line);color:var(--indigo)" href="#/trust/register">' + I('book') + ' Full AI register</a>');
      const metrics = '<div class="metrics" style="margin-bottom:18px">' + ui.metric({ label: 'AI systems (agents) in production', icon: 'bot', value: ags.length, foot: 'plus orchestrator and eval harness' }) +
        ui.metric({ label: 'Autonomy mix', icon: 'gauge', value: lv.L3 + ' · ' + lv.L2 + ' · ' + lv.L1 + (lv.L0 ? ' · ' + lv.L0 : ''), foot: 'L3 · L2 · L1' + (lv.L0 ? ' · L0' : '') }) +
        ui.metric({ label: 'High-risk candidates', icon: 'scale', value: 1, foot: 'Access Review Agent · legal review' }) +
        ui.metric({ label: 'AI incidents (90 days)', icon: 'alert', value: c2304 ? 1 : 0, foot: c2304 ? 'C-2304 · ' + (c2304.status === 'closed' ? 'closed' : 'open') : 'none recorded', color: c2304 && c2304.status !== 'closed' ? 'var(--red-ink)' : undefined }) + '</div>';
      const tbl = ui.table([
        { label: 'Agent', render: (a) => '<b style="font-weight:600">' + esc(a.name) + '</b><div class="small-txt muted">v' + esc(a.version) + ' · ' + esc(a.model) + '</div>' },
        { label: 'Domain', render: (a) => ui.dom(a.domain) },
        { label: 'Purpose', render: (a) => '<span class="small-txt">' + esc((AGENT_SHORT[a.id] || [''])[0]) + '</span>' },
        { label: 'AI Act class', render: (a) => { const c = (AGENT_SHORT[a.id] || ['', ''])[1]; return ui.tag(esc(c), /High/.test(c) ? 'amber' : /Limited/.test(c) ? 'teal' : 'outline'); } },
        { label: 'Autonomy', render: (a) => ui.lvl(a.mode) },
        { label: 'Last eval', render: (a) => { const e = evals.filter((x) => x.agent === a.id).slice(-1)[0]; return '<span class="num">' + CP.fmt(e ? e.score : a.accuracy, 1) + '%</span>'; } },
        { label: 'Owner · supervisor', render: (a) => '<span class="small-txt">' + esc(pname(a.owner)) + ' · ' + esc(pname(a.supervisor)) + '</span>' },
        { label: 'Incidents', render: (a) => a.id === 'ag-soc-triage' && c2304 ? '<a class="case-link" href="#/cases/C-2304">C-2304</a>' : '<span class="muted">0</span>' }
      ], ags, { max: 620 });
      return head + metrics + ui.card('Agents', tbl, { cls: 'accent', sub: 'Live from the platform registry. Autonomy changes (kill-switch, canary) appear here immediately.' });
    },

    mount(root) {
      const q = root.querySelector('#ar-q');
      if (q) {
        const apply = () => {
          const v = q.value.trim().toLowerCase(); this.ui.q = q.value; let n = 0;
          root.querySelectorAll('tr[data-text]').forEach((tr) => { const on = !v || tr.dataset.text.indexOf(v) >= 0; tr.style.display = on ? '' : 'none'; if (on) n++; });
          const c = root.querySelector('#ar-count'); if (c) c.textContent = n + ' entries';
        };
        q.addEventListener('input', apply); if (this.ui.q) apply();
      }
    },

    actions: {
      arCtl(el) { this.ctlModal(el.dataset.id); },
      arVerify(el) {
        const s = document.getElementById('arv-' + el.dataset.i); if (!s) return;
        s.className = 'ar-ver run'; s.innerHTML = I('clock') + ' Recomputing…';
        setTimeout(() => { s.className = 'ar-ver'; s.innerHTML = I('check') + ' Recomputed at ' + hm(clockLabel()) + ': matches'; }, 900);
        this.logAccess('Re-verified an evidence hash');
      },
      arExportCtl(el) { this.logAccess('Exported ' + el.dataset.id + ' with manifest'); CP.toast('Export prepared for ' + el.dataset.id + ': watermarked, with signed manifest. Logged in your access log.'); },
      arPack(el) { this.packModal(el.dataset.id); },
      arEntry(el, ev) { const a = ev.target.closest('a[href]'); if (a) { location.hash = a.getAttribute('href'); return; } this.entryModal(el.dataset.k); },
      arType(el) { this.ui.type = el.value; CP.render(); },
      arCase(el) { this.ui.caseF = el.value; CP.render(); },
      arChain() {
        const n = CP.store.state.kpis.actionsToday + trailEntries().length;
        this.ui.chain = { running: true, n }; CP.render();
        setTimeout(() => { this.ui.chain = { done: true, n, at: hm(clockLabel()) }; this.logAccess('Verified the trail hash chain (' + CP.fmt(n) + ' entries)'); CP.toast('Hash chain intact: ' + CP.fmt(n) + ' entries, every signature verified, last anchor ' + dayOf(clockLabel()) + ' ' + hm(clockLabel()).slice(0, 2) + ':00.'); if (CP.route.id === 'auditor') CP.render(); }, 1300);
      },
      arExport() { this.logAccess('Exported the audit trail (signed CSV)'); CP.toast('Signed CSV prepared (' + trailEntries().length + ' entries, manifest signed). Logged in your access log.'); },
      arPop(el) { this.ui.pop = el.value; CP.render(); },
      arSize(el) { this.ui.size = +el.value; CP.render(); },
      arReseed() { this.ui.seed++; CP.toast('New seed: the next draw is different and reproducible with this seed.'); CP.render(); },
      arDraw() {
        const pop = this.ui.pop, seed = 'AUD-Q4-' + pad(this.ui.seed) + '-' + pop.toUpperCase().slice(0, 3);
        const items = drawSample(pop, this.ui.size, seed);
        this.ui.sample = { pop, seed, key: seed + '-' + this.ui.size, items, at: clockLabel() };
        const saved = lsGet('cp-aud-results'); if (saved && saved[this.ui.sample.key] && !this.ui.results[this.ui.sample.key]) this.ui.results[this.ui.sample.key] = saved[this.ui.sample.key];
        this.logAccess('Drew ' + items.length + ' items from ' + POPS[pop].label.toLowerCase());
        CP.toast(items.length + ' items drawn from ' + CP.fmt(popSize(pop)) + ' (seed ' + seed + ').'); CP.render();
      },
      arResult(el) {
        const s = this.ui.sample; if (!s) return;
        const r = this.ui.results[s.key] = this.ui.results[s.key] || {}; r[el.dataset.id] = el.value;
        lsSet('cp-aud-results', this.ui.results); CP.render();
      },
      arMarkAll() {
        const s = this.ui.sample; if (!s) return;
        const r = this.ui.results[s.key] = this.ui.results[s.key] || {}; s.items.forEach((x) => { if (!r[x.id]) r[x.id] = 'pass'; });
        lsSet('cp-aud-results', this.ui.results); CP.render();
      },
      arReperf(el) { this.reperfModal(el.dataset.id); },
      arExportWp() { this.logAccess('Exported a sampling workpaper'); CP.toast('Workpaper exported: population, seed, sample, results and conclusion, signed with your key.'); }
    }
  });
})();
