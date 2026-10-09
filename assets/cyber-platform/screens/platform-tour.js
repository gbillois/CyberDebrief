/* Cyber AI Platform demo: Part 1 "Platform tour". A narrated walk around the
   simple diagram, one component at a time, then how the platform gets built. */
(function () {
  'use strict';
  const CP = window.CP; const esc = CP.esc; const ui = CP.ui;
  const SVGNS = 'http://www.w3.org/2000/svg';
  const DOMS = ['dom-grc', 'dom-appsec', 'dom-data', 'dom-iam', 'dom-soc', 'dom-cti', 'dom-more'];
  const HUMANS = ['hu-ciso', 'hu-engage', 'hu-build', 'hu-run', 'hu-trust'];

  const STOPS = [
    { k: 'The core', title: 'At the core, the AI platform', short: 'The core', nodes: ['orch', 'humans', 'safety', 'graph', 'lake'].concat(DOMS),
      text: 'At the core sits the cyber AI platform: one place where AI agents work for every cyber domain, on one shared context. Around it, nothing is thrown away: the platform plugs into the systems the organisation already runs.' },
    { k: 'Around it', title: 'The existing cyber systems', short: 'Cyber systems', nodes: ['cyber'],
      text: 'EDR, firewalls, proxies, WAF, IAM, vulnerability scanners: the security tools the teams already operate. They feed the platform with data and events, and they receive its orders. They give the platform its view of threats and controls.' },
    { k: 'Around it', title: 'The IT systems', short: 'IT systems', nodes: ['it'],
      text: 'CMDB, directory, cloud and infrastructure, business applications: they tell the platform what exists, who owns it and what it supports. With the cyber systems, they provide visibility across the whole information system.' },
    { k: 'The conductor', title: 'The orchestrator', short: 'Orchestrator', nodes: ['orch'], badges: { orch: 'collects · orders · checks · escalates' },
      text: 'The orchestrator collects data and events, assigns the work to the agents, sends deterministic orders back to the systems, checks that all is well and escalates when it is not. It is the only path between agents and systems, so every action is controlled and recorded.' },
    { k: 'Governance', title: 'Humans decide above threshold', short: 'Humans decide', nodes: ['humans'].concat(HUMANS),
      text: 'Each type of action has an autonomy level and a decision holder. Below the threshold an agent acts and reports; above it (blast radius, money, a message leaving the group, low confidence, a first time) the orchestrator stops and asks the right person, with a ready option.' },
    { k: 'Safety', title: 'Sandbox, kill-switch and rollback', short: 'Safety', nodes: ['safety'],
      text: 'Every change is first replayed in a sandbox on real traffic. Every action keeps a rollback point. Any agent, any domain or the whole fleet can be dropped to suggest-only in one click.' },
    { k: 'The workforce', title: 'Specialized agents, one or more per domain', short: 'Agents', nodes: DOMS, badges: { 'dom-more': 'several dozen, eventually' },
      text: 'GRC, AppSec, Data, IAM, SOC, CTI: each domain has one or more specialized agents that act. A handful at the start, eventually several dozen, each with its own tools, guardrails, autonomy level, product owner and supervisor.' },
    { k: 'Shared context', title: 'The Cyber Security Graph', short: 'Security graph', nodes: ['graph'].concat(DOMS),
      text: 'All agents share the Cyber Security Graph: a real-time view of the organisation\'s security posture and cyber context. Assets, identities, suppliers, exposures and their relationships, so an alert immediately becomes a business-aware decision.' },
    { k: 'Shared context', title: 'The Cyber Data Lake', short: 'Data lake', nodes: ['lake'], badges: { lake: 'drifts · trends · evidence' },
      text: 'The Cyber Data Lake complements the graph as long-term memory: logs, evidence, cases and decisions kept over time. It is used to measure drifts and trends, backtest detections, train and evaluate agents, and answer regulators.' },
    { k: 'Around it', title: 'The outside world and the people', short: 'Outside & people', nodes: ['out-cti', 'out-tp', 'out-reg'].concat(HUMANS),
      text: 'On one side, the outside world: threat intelligence, suppliers, regulators. On the other, the people of the new organisation, each with a console on the platform: the CISO, Engage, Build, Run, and Trust & Challenge.' },
    { k: 'How it gets built', title: 'Perimeter by perimeter, federated then unified', short: 'Perimeter by perimeter', nodes: ['dom-grc', 'dom-soc', 'graph', 'lake'], badges: { 'dom-grc': 'start here', 'dom-soc': 'start here' }, visual: 'federated',
      text: 'It will be built perimeter by perimeter: federated at first, then increasingly unified. Two natural starting points: GRC, whose platforms are expanding to collect evidence and respond to risk, and the SOC, which already holds the logs and can extend to other functions.' },
    { k: 'How it gets built', title: 'Buy, build, or both', short: 'Buy or build', nodes: ['orch', 'graph', 'lake'].concat(DOMS), visual: 'paths',
      text: 'Some organisations are evaluating generic data and AI platforms, or the platforms of the major security vendors. Others are building it themselves, successfully. Most will combine both: buy the engines, build the context, the agents and the decision rights that make it theirs.' },
    { k: 'Key point', title: 'Never frozen', short: 'Never frozen', nodes: ['hu-build', 'hu-run', 'hu-trust'].concat(DOMS), visual: 'cadence',
      text: 'The platform must keep evolving, never frozen. It is continuously developed by the teams, agent by agent, week after week: far from the six-monthly releases of the past. Build ships, Run measures, Trust & Challenge tests, every week.' }
  ];

  CP.css('ptour', `
  .pt-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:14px;flex-wrap:wrap}.pt-head h1{margin:0}.pt-steps{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px}
  .pt-steps button{min-height:30px;padding:.2rem .5rem;font-size:11.5px;font-weight:600;gap:5px}
  .pt-steps button .n{font-family:var(--mono);opacity:.6}
  .pt-steps button.active{background:var(--dark);border-color:var(--dark);color:#fff}
  .pt-steps button.seen{border-color:#bdb0e8}
  .pt-cap{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:18px;background:#fff;border:1px solid var(--line);border-top:3px solid var(--green);padding:14px 20px;min-height:118px;align-items:center}
  .pt-cap .pt-k{font-size:11px;letter-spacing:1.3px;text-transform:uppercase;color:var(--green-ink);font-weight:700}
  .pt-cap h2{margin:4px 0 6px;font-size:22px;letter-spacing:-.5px}
  .pt-cap p{margin:0;font-size:15px;line-height:1.6;color:#3b3550;max-width:860px}
  .pt-nav{display:flex;flex-direction:column;gap:8px;align-items:flex-end;justify-content:space-between}
  .pt-nav .row button{min-height:40px}
  .pt-count{font-family:var(--mono);font-size:12px;color:var(--muted)}
  .pt-stage{border:1px solid var(--line);border-top:0;background:#fff;position:relative}
  .pt-stage svg.arch .n-box{transition:opacity .4s}
  .pt-badge rect{fill:#04f06a}
  .pt-badge text{font-size:12px;font-weight:700;fill:#10291b}
  .pt-visual{display:grid;gap:6px;min-width:330px;max-width:460px}
  .pt-fed{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center}
  .pt-fed .col{border:1px solid var(--line);padding:10px;background:#fbfafd}
  .pt-fed .col b{display:block;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:6px}
  .pt-fed .box{border:1.5px solid var(--indigo);background:#fff;padding:5px 8px;font-size:12px;font-weight:600;margin-top:5px}
  .pt-fed .box.d{border-style:dashed;border-color:#b9b3c9;color:var(--muted);font-weight:500}
  .pt-fed .uni{border:2px solid var(--indigo);background:var(--indigo-50);padding:8px;display:grid;gap:4px}
  .pt-fed .uni span{font-size:11.5px;background:#fff;border:1px solid #d8cfee;padding:3px 6px;font-weight:600}
  .pt-path{border:1px solid var(--line);padding:6px 10px;display:flex;gap:10px;align-items:flex-start;background:#fff}
  .pt-path .i{color:var(--indigo);margin-top:2px}
  .pt-path b{font-size:13px;display:block}
  .pt-path span{font-size:12px;color:var(--muted);line-height:1.45}
  .pt-cad{border:1px solid var(--line);padding:10px 12px;background:#fff}
  .pt-cad b{font-size:12px;display:flex;justify-content:space-between}
  .pt-cad .track{position:relative;height:18px;background:#f3f1f8;margin-top:6px}
  .pt-cad .track i{position:absolute;top:3px;width:3px;height:12px;background:var(--indigo)}
  .pt-cad .track.old i{background:#b9b3c9;width:6px}
  @media(max-width:1100px){.pt-cap{grid-template-columns:1fr}.pt-nav{align-items:flex-start}.pt-visual{max-width:none;min-width:0}}
  .pt-steps .lb{white-space:nowrap}
  @media(max-width:760px){.pt-head .row{flex-wrap:wrap}.pt-stage .arch-scroll svg.arch{width:1100px;max-width:none}.pt-cap h2{font-size:19px}.pt-cap p{font-size:14px}}
  `);

  const S = { i: 0, seen: { 0: true }, auto: null };

  function visual(v) {
    if (v === 'federated') {
      return '<div class="pt-visual"><div class="pt-fed"><div class="col"><b>First: federated</b><div class="box">GRC platform</div><div class="box">SOC platform</div><div class="box d">other domains, later</div></div>' + CP.icon('arrowRight') +
        '<div class="col"><b>Then: unified</b><div class="uni"><span>One orchestrator</span><span>GRC · SOC · CTI · AppSec · IAM · Data</span><span>One graph, one data lake</span></div></div></div></div>';
    }
    if (v === 'paths') {
      return '<div class="pt-visual">' + [
        ['database', 'Generic data & AI platform', 'Strong engines and scale; the cyber context and agents remain to be built.'],
        ['shield', 'Security vendor platform', 'Fast start on the vendor\'s own tools; check openness to the rest of the estate.'],
        ['code', 'Build it yourself', 'Full fit and control; needs a real product team and engineering discipline.']
      ].map((p) => '<div class="pt-path">' + CP.icon(p[0]) + '<div><b>' + esc(p[1]) + '</b><span>' + esc(p[2]) + '</span></div></div>').join('') + '</div>';
    }
    if (v === 'cadence') {
      const ticks = (n, w) => Array.from({ length: n }, (_, k) => '<i style="left:' + ((k + 0.5) / n * 100).toFixed(1) + '%"></i>').join('');
      return '<div class="pt-visual"><div class="pt-cad"><b><span>The past: big releases</span><span class="muted">2 a year</span></b><div class="track old">' + ticks(2) + '</div></div>' +
        '<div class="pt-cad"><b><span>The platform: continuous delivery</span><span style="color:var(--indigo)">every week, per agent</span></b><div class="track">' + ticks(26) + '</div></div>' +
        '<div class="small-txt muted">Each release goes through evals, red team, sandbox replay and canary before production.</div></div>';
    }
    return '';
  }

  function paint(root) {
    const svg = root.querySelector('svg.arch'); if (!svg) return;
    const stop = STOPS[S.i];
    svg.classList.add('dim');
    CP.qsa('.n-box', svg).forEach((g) => g.classList.toggle('hot', stop.nodes.indexOf(g.getAttribute('data-node')) >= 0));
    const layer = svg.querySelector('.tokens'); layer.innerHTML = '';
    const L = CP.arch.simpleLayout();
    Object.keys(stop.badges || {}).forEach((id) => {
      const n = L.nodes.find((x) => x.id === id); if (!n) return;
      const label = stop.badges[id]; const w = label.length * 7 + 18;
      const g = document.createElementNS(SVGNS, 'g'); g.setAttribute('class', 'pt-badge');
      const x = Math.min(Math.max(n.x + n.w / 2 - w / 2, 4), 1596 - w), y = n.y - 26;
      g.innerHTML = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="22"/><text x="' + (x + w / 2) + '" y="' + (y + 15) + '" text-anchor="middle">' + esc(label) + '</text>';
      layer.appendChild(g);
    });
  }

  function go(i) {
    S.i = Math.max(0, Math.min(STOPS.length - 1, i)); S.seen[S.i] = true;
    CP.render();
  }
  function stopAuto() { if (S.auto) { clearInterval(S.auto); S.auto = null; } }

  CP.screen({
    id: 'platform-tour', part: 1, label: 'Platform tour', icon: 'compass', live: false, ownKeys: true,
    render() {
      const stop = STOPS[S.i];
      const d = CP.arch.drawSvg(true);
      const nav = '<div class="row"><span class="pt-count">' + (S.i + 1) + ' / ' + STOPS.length + '</span>' +
        '<button data-action="ptPrev"' + (S.i === 0 ? ' disabled' : '') + ' aria-label="Previous">' + CP.icon('chevronLeft') + '</button>' +
        '<button class="' + (S.auto ? 'primary' : '') + '" data-action="ptAuto">' + CP.icon(S.auto ? 'pause' : 'play') + (S.auto ? ' Pause' : ' Play the tour') + '</button>' +
        (S.i < STOPS.length - 1 ? '<button class="go" data-action="ptNext">Next ' + CP.icon('arrowRight') + '</button>' : '<a class="btn-demo" href="' + CP.href('arch-simple') + '" style="height:40px">See it work ' + CP.icon('arrowRight') + '</a>') + '</div>';
      return '<div class="pt-head"><div><div class="eyebrow">How it works · Platform tour</div><h1>One centralized cyber platform</h1></div>' + nav + '</div>' +
        '<div class="pt-steps" role="tablist" aria-label="Tour stops">' + STOPS.map((s, k) => '<button role="tab" aria-selected="' + (k === S.i) + '" class="' + (k === S.i ? 'active' : S.seen[k] ? 'seen' : '') + '" data-action="ptGo" data-i="' + k + '" title="' + esc(s.title) + '"><span class="n">' + (k + 1) + '</span><span class="lb">' + esc(s.short || s.title) + '</span></button>').join('') + '</div>' +
        '<div class="pt-cap" data-tour="ptour-cap"><div><div class="pt-k">' + esc(stop.k) + '</div><h2>' + esc(stop.title) + '</h2><p>' + esc(stop.text) + '</p></div>' + (stop.visual ? visual(stop.visual) : '<div></div>') + '</div>' +
        '<div class="pt-stage" data-tour="ptour-stage"><div class="arch-scroll">' + d.svg + '</div></div>';
    },
    mount(root) {
      paint(root);
      root.querySelector('svg.arch').addEventListener('click', (e) => {
        const g = e.target.closest('.n-box'); if (!g) return;
        const id = g.getAttribute('data-node'); const k = STOPS.findIndex((s) => s.nodes[0] === id || s.nodes.indexOf(id) >= 0 && s.nodes.length < 4);
        if (k >= 0) { stopAuto(); go(k); } else { const inf = CP.arch.info(id); CP.toast(inf[1] || inf[0]); }
      });
    },
    actions: {
      ptGo(el) { stopAuto(); go(+el.dataset.i); },
      ptNext() { stopAuto(); go(S.i + 1); },
      ptPrev() { stopAuto(); go(S.i - 1); },
      ptAuto() {
        if (S.auto) { stopAuto(); CP.render(); return; }
        if (S.i >= STOPS.length - 1) S.i = 0;
        S.auto = setInterval(() => { if (CP.route.id !== 'platform-tour' || S.i >= STOPS.length - 1) { stopAuto(); if (CP.route.id === 'platform-tour') CP.render(); return; } go(S.i + 1); }, 9000);
        CP.render();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (CP.route.id !== 'platform-tour' || (CP.tour && CP.tour.active) || e.target.closest('input,textarea,select')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); stopAuto(); go(S.i + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); stopAuto(); go(S.i - 1); }
    if (e.key === ' ') { e.preventDefault(); CP.screens['platform-tour'].actions.ptAuto(); }
  });
})();
