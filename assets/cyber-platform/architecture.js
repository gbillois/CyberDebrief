/* Cyber AI Platform demo: Part 1 architecture views (simple and detailed),
   scenario control band, flow animation, swimlane timeline and event log. */
(function () {
  'use strict';
  const CP = window.CP;
  const esc = CP.esc;
  const SVGNS = 'http://www.w3.org/2000/svg';

  /* ------------------------------------------------------------------
     Node geometry. kind: ext | human | sys | int | orch | pill | agent | dom | ctx | band
     ------------------------------------------------------------------ */
  const PEOPLE = [
    ['hu-ciso', 'CISO', 'p-elena'], ['hu-engage', 'Engage', 'p-amira'], ['hu-build', 'Build', 'p-raj'],
    ['hu-run', 'Run', 'p-chloe'], ['hu-trust', 'Trust & Challenge', 'p-jonas']
  ];
  const DOMS = [['dom-grc', 'GRC', 'grc'], ['dom-appsec', 'AppSec', 'appsec'], ['dom-data', 'Data', 'data'], ['dom-iam', 'IAM', 'iam'], ['dom-soc', 'SOC', 'soc'], ['dom-cti', 'CTI', 'cti'], ['dom-more', 'Many more…', 'orch']];
  const AGENTS_BY_DOM = {
    'dom-grc': ['ag-grc-tprm', 'ag-grc-controls', 'ag-grc-policy'],
    'dom-appsec': ['ag-as-waf', 'ag-as-code'],
    'dom-data': ['ag-dt-dlp', 'ag-dt-evidence'],
    'dom-iam': ['ag-iam-resp', 'ag-iam-review'],
    'dom-soc': ['ag-soc-triage', 'ag-soc-detect', 'ag-soc-forensic', 'ag-soc-hunt', 'ag-vuln'],
    'dom-cti': ['ag-cti-collect', 'ag-cti-analyst'],
    'dom-more': []
  };

  function simpleLayout() {
    const N = [];
    N.push({ id: 'out-cti', x: 20, y: 200, w: 170, h: 84, kind: 'ext', label: 'CTI feeds & CERTs', sub: 'advisories, IoCs' });
    N.push({ id: 'out-tp', x: 20, y: 310, w: 170, h: 84, kind: 'ext', label: 'Third parties', sub: '1,240 ICT suppliers' });
    N.push({ id: 'out-reg', x: 20, y: 420, w: 170, h: 84, kind: 'ext', label: 'Regulators', sub: 'DORA, NIS2, AI Act' });
    PEOPLE.forEach((p, i) => N.push({ id: p[0], x: 1410, y: 160 + i * 96, w: 170, h: 80, kind: 'human', label: p[1], person: p[2] }));
    N.push({ id: 'cyber', x: 240, y: 22, w: 550, h: 76, kind: 'sys', label: 'CYBER SYSTEMS & TOOLS', sub: 'EDR, FW, Proxy, WAF, IAM…' });
    N.push({ id: 'it', x: 830, y: 22, w: 540, h: 76, kind: 'sys', label: 'IT SYSTEMS & BUS. APPS', sub: 'CMDB, directory, cloud, data lake…' });
    N.push({ id: 'orch', x: 250, y: 186, w: 1100, h: 104, kind: 'orch', label: 'AI CYBER ORCHESTRATOR', sub: '& Integration layer', desc: 'Assigns the work, enforces decision rights, escalates' });
    N.push({ id: 'humans', x: 920, y: 210, w: 200, h: 56, kind: 'pill', label: 'HUMANS DECIDE', sub: '(above threshold)' });
    N.push({ id: 'safety', x: 1136, y: 210, w: 200, h: 56, kind: 'pill2', label: 'SANDBOX, KILL-SWITCH', sub: '& ROLLBACK' });
    const ax = 440, aw = (1336 - ax - 6 * 12) / 7;
    DOMS.forEach((d, i) => N.push({ id: d[0], x: ax + i * (aw + 12), y: 330, w: aw, h: 64, kind: 'dom', label: d[1], domain: d[2] }));
    N.push({ id: 'graph', x: 250, y: 486, w: 840, h: 104, kind: 'ctx', label: 'CYBER SECURITY GRAPH', sub: 'Shared context: assets, identities, exposures and relationships' });
    N.push({ id: 'lake', x: 1104, y: 506, w: 232, h: 64, kind: 'lake', label: 'CYBER DATA LAKE', sub: 'long-term memory' });
    return { w: 1600, h: 650, nodes: N };
  }

  function fullLayout() {
    const N = [];
    N.push({ id: 'out-cti', x: 20, y: 190, w: 170, h: 80, kind: 'ext', label: 'CTI feeds & CERTs', sub: 'STIX/TAXII, ISAC' });
    N.push({ id: 'out-tp', x: 20, y: 290, w: 170, h: 80, kind: 'ext', label: 'Supplier portal', sub: 'questionnaires, answers' });
    N.push({ id: 'out-reg', x: 20, y: 390, w: 170, h: 80, kind: 'ext', label: 'Regulator portals', sub: 'notifications, evidence' });
    PEOPLE.forEach((p, i) => N.push({ id: p[0], x: 1410, y: 190 + i * 96, w: 170, h: 80, kind: 'human', label: p[1], person: p[2] }));
    const sys = [['sys-edr', 'EDR'], ['sys-siem', 'SIEM'], ['sys-waf', 'WAF'], ['sys-fw', 'Firewall'], ['sys-proxy', 'Proxy'], ['sys-mail', 'Mail gateway'], ['sys-vuln', 'Vuln scanner'], ['sys-pam', 'PAM']];
    const it = [['it-cmdb', 'CMDB'], ['it-entra', 'Directory / IdP'], ['it-itsm', 'ITSM'], ['it-m365', 'Collaboration suite'], ['it-apps', 'Business apps'], ['it-hr', 'HR system']];
    N.push({ id: 'g-cyber', x: 240, y: 14, w: 550, h: 122, kind: 'group', label: 'CYBER SYSTEMS & TOOLS' });
    N.push({ id: 'g-it', x: 830, y: 14, w: 540, h: 122, kind: 'group', label: 'IT SYSTEMS & BUSINESS APPS' });
    sys.forEach((s, i) => N.push({ id: s[0], x: 254 + (i % 4) * 132, y: 44 + Math.floor(i / 4) * 44, w: 124, h: 36, kind: 'sys', label: s[1], parent: 'cyber' }));
    it.forEach((s, i) => N.push({ id: s[0], x: 844 + (i % 3) * 174, y: 44 + Math.floor(i / 3) * 44, w: 166, h: 36, kind: 'sys', label: s[1], parent: 'it' }));
    N.push({ id: 'b-int', x: 250, y: 178, w: 1100, h: 64, kind: 'band', label: 'INTEGRATION LAYER', tone: 'int' });
    N.push({ id: 'int-mcp', x: 420, y: 186, w: 296, h: 48, kind: 'int', label: 'MCP / API connector gateway', sub: 'least-privilege scopes', parent: 'orch' });
    N.push({ id: 'int-bus', x: 728, y: 186, w: 296, h: 48, kind: 'int', label: 'Event bus', sub: 'alerts, changes, answers', parent: 'orch' });
    N.push({ id: 'int-exec', x: 1036, y: 186, w: 300, h: 48, kind: 'int', label: 'Deterministic action executors', sub: 'signed playbooks, rollback points', parent: 'orch' });
    N.push({ id: 'b-orch', x: 250, y: 252, w: 1100, h: 92, kind: 'band', label: 'AI CYBER ORCHESTRATOR', tone: 'orch' });
    const orch = [['or-plan', 'Planner & router', 'splits, assigns, tracks', 'orch'], ['or-policy', 'Decision-rights policy', 'L0 to L3, thresholds', 'orch'], ['or-hitl', 'Human-in-the-loop', 'escalation queue', 'humans'], ['or-sandbox', 'Sandbox', 'digital twin, replay', 'safety'], ['or-kill', 'Kill-switch & rollback', 'per agent, per domain', 'safety'], ['or-audit', 'Audit trail', 'every step, signed', 'orch']];
    const ow = (930 - 5 * 10) / 6;
    orch.forEach((o, i) => N.push({ id: o[0], x: 420 + i * (ow + 10), y: 264, w: ow, h: 68, kind: o[3] === 'humans' ? 'pill' : o[3] === 'safety' ? 'pill2' : 'orchn', label: o[1], sub: o[2], parent: o[3] }));
    N.push({ id: 'b-ai', x: 250, y: 354, w: 1100, h: 56, kind: 'band', label: 'AI SERVICES', tone: 'int' });
    N.push({ id: 'ai-gw', x: 420, y: 362, w: 452, h: 40, kind: 'int', label: 'Model gateway', sub: 'routing, guardrails, cost metering', parent: 'orch' });
    N.push({ id: 'ai-eval', x: 884, y: 362, w: 452, h: 40, kind: 'int', label: 'Eval & telemetry', sub: 'traces, scores, drift monitors', parent: 'safety' });
    N.push({ id: 'b-ag', x: 250, y: 420, w: 1100, h: 334, kind: 'band', label: 'SPECIALIZED AGENTS', tone: 'agents' });
    const cw = (930 - 6 * 8) / 7;
    DOMS.forEach((d, i) => {
      const x = 420 + i * (cw + 8);
      N.push({ id: d[0], x, y: 430, w: cw, h: 314, kind: 'col', label: d[1], domain: d[2] });
      AGENTS_BY_DOM[d[0]].forEach((aid, k) => {
        const ag = (CP.data.seed.agents || []).find((a) => a.id === aid);
        N.push({ id: aid, x: x + 6, y: 466 + k * 54, w: cw - 12, h: 46, kind: 'agent', label: ag ? ag.name.replace(' Agent', '') : aid, domain: d[2], parent: d[0] });
      });
    });
    N.push({ id: 'b-ctx', x: 250, y: 766, w: 1100, h: 210, kind: 'band', label: 'SHARED CONTEXT', tone: 'ctx' });
    N.push({ id: 'ctx-graph', x: 420, y: 778, w: 520, h: 186, kind: 'ctx', label: 'Cyber security graph', sub: 'assets · identities · suppliers · exposures · controls', parent: 'graph', mini: true });
    N.push({ id: 'ctx-memory', x: 952, y: 778, w: 180, h: 186, kind: 'ctx', label: 'Case memory', sub: 'past cases, playbooks, lessons', parent: 'graph' });
    N.push({ id: 'ctx-lake', x: 1144, y: 778, w: 192, h: 186, kind: 'lake', label: 'Cyber data lake', sub: 'logs, evidence, 13 months hot', parent: 'lake' });
    return { w: 1600, h: 990, nodes: N };
  }

  /* Map an actor id to a node id. */
  function actorNode(actor) {
    if (!actor) return null;
    if (CP.agent(actor)) return actor;
    const m = { orchestrator: 'or-plan', 'cti-feed': 'out-cti', regulator: 'out-reg', thirdparty: 'out-tp', entra: 'it-entra', edr: 'sys-edr', siem: 'sys-siem', waf: 'sys-waf', itsm: 'it-itsm', mail: 'sys-mail', sandbox: 'or-sandbox', killswitch: 'or-kill', evals: 'ai-eval', deviation: 'ai-eval', redteam: 'hu-trust', lod2: 'hu-trust' };
    if (m[actor]) return m[actor];
    const p = CP.person(actor);
    if (p) { const t = { ciso: 'hu-ciso', engage: 'hu-engage', build: 'hu-build', run: 'hu-run', trust: 'hu-trust', business: 'hu-ciso' }; return t[p.team] || 'hu-ciso'; }
    return null;
  }

  const FULL_PARENT = {};
  function parentOf(id, simple) {
    if (!simple) return id;
    if (!FULL_PARENT._built) {
      fullLayout().nodes.forEach((n) => { FULL_PARENT[n.id] = n.parent || n.id; });
      Object.keys(AGENTS_BY_DOM).forEach((d) => AGENTS_BY_DOM[d].forEach((a) => { FULL_PARENT[a] = d; }));
      FULL_PARENT._built = true;
    }
    return FULL_PARENT[id] || id;
  }

  /* ------------------------------------------------------------------
     Component descriptions (click a block)
     ------------------------------------------------------------------ */
  const INFO = {
    'out-cti': ['Outside world', 'Threat intelligence sources: national CERTs, the sector ISAC, commercial feeds. Ingested through a connector, normalised (STIX) and matched against the graph within seconds.'],
    'out-tp': ['Outside world', 'Third parties reached through the supplier portal: questionnaires, evidence, answers. Every message leaving the group is validated by Engage (L1), unless a standing approval exists.'],
    'out-reg': ['Outside world', 'Supervisors and authorities: DORA, NIS2, AI Act, GDPR. Requests come in, evidence and notifications go out, always signed off by a human.'],
    cyber: ['Systems', 'The security tools the platform reads (alerts, logs, configurations) and drives (rules, blocks, isolation) through APIs and MCP servers. Agents never touch them directly: orders go through deterministic executors.'],
    it: ['Systems', 'The IT and business systems that give context and receive changes: CMDB, identity provider, ITSM, collaboration suite, cloud, business applications, HR. Changes follow the change process, raised by the platform.'],
    orch: ['Platform core', 'The AI cyber orchestrator: receives events, plans the response, assigns tasks to agents, checks the decision rights of every action and escalates to humans above threshold. With the integration layer, it is the only path between agents and systems.'],
    humans: ['Governance', 'Above a threshold (blast radius, reversibility, money, external exposure, novelty, low confidence), the orchestrator stops and asks the person who holds the decision right, with a ready-to-execute option and a recommendation.'],
    safety: ['Safety layer', 'Every change is first replayed in a sandbox (digital twin). Every action has a rollback point. Any agent, domain or the whole fleet can be dropped to suggest-only with a kill-switch.'],
    graph: ['Shared context', 'One graph for every agent: assets, identities, applications, suppliers, vulnerabilities, controls, business services and their relationships. This is what turns an alert into a business-aware decision.'],
    lake: ['Shared context', 'The cyber data lake: logs, evidence, cases and decisions kept as long-term memory. Agents backtest rules on it, Trust & Challenge re-samples it, regulators get evidence from it.'],
    'int-mcp': ['Integration layer', 'Connector gateway (MCP servers and APIs). Each agent gets least-privilege scopes, split between read and act. Owned by Build, monitored by Run.'],
    'int-bus': ['Integration layer', 'Event bus carrying alerts, changes, supplier answers and decisions between systems, agents and the orchestrator.'],
    'int-exec': ['Integration layer', 'Deterministic executors: signed playbooks that turn an approved order into exact API calls, with a rollback point. Agents decide what; executors do it the same way every time.'],
    'or-plan': ['Orchestrator', 'Splits a case into tasks, picks the agents, tracks progress and closes the loop.'],
    'or-policy': ['Orchestrator', 'Decision-rights policy as code: for each action type, the autonomy level (L0 to L3), the thresholds and the decision holder. Written by Build, approved by the CISO.'],
    'or-hitl': ['Orchestrator', 'Queue of decisions waiting for a human, routed to the right role (CISO, Engage, Run, Build) with context, options and a recommendation.'],
    'or-sandbox': ['Safety layer', 'Digital twin of critical systems: rules, patches and new agent versions are replayed on real traffic before production.'],
    'or-kill': ['Safety layer', 'Lower any agent, domain or the whole fleet to suggest-only in one click; replay or undo past actions from the journal.'],
    'or-audit': ['Orchestrator', 'Every event, reasoning step, tool call and decision is recorded and signed: the basis of trust, audit and regulatory evidence.'],
    'ai-gw': ['AI services', 'Model gateway: routes each task to the right model (frontier, small, on-premises), applies guardrails, meters cost per agent and per case.'],
    'ai-eval': ['AI services', 'Traces and scores of every agent run, drift monitors and evaluation suites. Feeds Run (quality) and Trust & Challenge (assurance).'],
    'ctx-graph': ['Shared context', '48k assets, 61k identities, 2,150 applications, 1,240 suppliers, their exposures and controls, refreshed continuously from the connectors.'],
    'ctx-memory': ['Shared context', 'What the platform learnt: past cases, playbooks, decisions and lessons, retrievable by every agent.'],
    'ctx-lake': ['Shared context', 'Logs and evidence (13 months hot, 7 years cold), the source for backtests, hunts, investigations and regulatory evidence.'],
    'hu-ciso': ['People', 'The CISO: sees the whole platform, decides above threshold, reports value and risk to the board.'],
    'hu-engage': ['People', 'Engage speaks for cyber outside the CISO organisation: business units, suppliers, regulators, crisis, culture. Validates what leaves the group.'],
    'hu-build': ['People', 'Platform Operations · Build: agent product owners and developers per domain, the program & platform manager. They code and evolve agents, tools and decision rights.'],
    'hu-run': ['People', 'Platform Operations · Run: agent supervisors per domain, platform quality and performance managers. They watch, roll back, pull the kill-switch.'],
    'hu-trust': ['People', 'Trust & Challenge: AI assurance (evals, deviation hunt) and Offensive (red team, adversary lab). They do not take the agents at their word.']
  };
  function info(id) {
    if (INFO[id]) return INFO[id];
    const ag = CP.agent(id);
    if (ag) { const d = CP.domain(ag.domain); return [d.label + ' agent', ag.name + ' (v' + ag.version + ', ' + ag.model + '). Autonomy ' + ag.mode + '. Tools: ' + ag.tools.join(', ') + '. Product owner: ' + (CP.person(ag.owner) || {}).name + ', supervisor: ' + (CP.person(ag.supervisor) || {}).name + '.']; }
    if (id.indexOf('dom-') === 0) {
      const d = DOMS.find((x) => x[0] === id); const list = AGENTS_BY_DOM[id].map((a) => (CP.agent(a) || {}).name).filter(Boolean);
      return ['Specialized agents', d[1] === 'Many more…' ? 'New domains plug into the same platform and context: OT security, fraud, cloud posture, physical security…' : 'The ' + d[1] + ' domain: ' + list.join(', ') + '. One product owner and one supervisor per domain.'];
    }
    if (id.indexOf('sys-') === 0 || id.indexOf('it-') === 0) return ['Systems', 'Connected through the MCP gateway: the platform reads it for context and drives it only through deterministic executors.'];
    return ['Component', ''];
  }

  /* ------------------------------------------------------------------
     SVG drawing
     ------------------------------------------------------------------ */
  function wrap(text, max) {
    const words = String(text).split(' '); const lines = []; let cur = '';
    words.forEach((w) => { if ((cur + ' ' + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); });
    if (cur) lines.push(cur);
    return lines;
  }
  function textLines(lines, x, y, size, opts) {
    opts = opts || {};
    return lines.map((l, i) => '<text x="' + x + '" y="' + (y + i * (size + 3)) + '" font-size="' + size + '" text-anchor="' + (opts.anchor || 'middle') + '" fill="' + (opts.fill || '#201c30') + '" font-weight="' + (opts.weight || 500) + '"' + (opts.ls ? ' letter-spacing="' + opts.ls + '"' : '') + '>' + esc(l) + '</text>').join('');
  }

  function drawNode(n) {
    const cx = n.x + n.w / 2, cy = n.y + n.h / 2;
    let body = '';
    const d = n.domain ? CP.domain(n.domain) : null;
    switch (n.kind) {
      case 'group':
        return '<g><rect x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" fill="#e9e4fb" stroke="#cbbff3"/>' + textLines([n.label], n.x + 14, n.y + 20, 11, { anchor: 'start', fill: '#2b1960', weight: 700, ls: 1.2 }) + '</g>';
      case 'band': {
        const fills = { int: '#f1eefb', orch: '#211248', agents: '#5cf59e', ctx: '#e6e4ee' };
        const tc = n.tone === 'orch' ? '#fff' : '#211248';
        return '<g><rect x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" fill="' + fills[n.tone] + '"' + (n.tone === 'agents' ? ' fill-opacity=".55"' : '') + '/>' +
          textLines(wrap(n.label, 14), n.x + 16, n.y + 24, 11.5, { anchor: 'start', fill: tc, weight: 700, ls: 1 }) + '</g>';
      }
      case 'col':
        return '<g class="n-box" data-node="' + n.id + '"><rect class="n-bg" x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" fill="#ffffff" fill-opacity=".55" stroke="#ffffff"/>' +
          '<rect x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="4" fill="' + d.hex + '"/>' + textLines([n.label], cx, n.y + 24, 12.5, { weight: 700, fill: '#211248' }) + '</g>';
      case 'ext':
        body = '<rect class="n-bg" x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" fill="#fff8ec" stroke="#e8c88a" stroke-width="1.5"/>' + textLines(wrap(n.label, 18), cx, n.y + 32, 13.5, { weight: 650 }) + textLines([n.sub], cx, n.y + n.h - 16, 11, { fill: '#8a5a05' });
        break;
      case 'human': {
        const p = CP.person(n.person);
        body = '<rect class="n-bg" x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" fill="#ecfbf2" stroke="#9fdcb8" stroke-width="1.5"/>' +
          '<rect x="' + (n.x + 12) + '" y="' + (n.y + 20) + '" width="36" height="36" fill="' + (p ? p.color : '#451dc7') + '"/>' + textLines([p ? p.abbr : ''], n.x + 30, n.y + 42, p && p.abbr.length > 3 ? 9.5 : 11, { fill: '#fff', weight: 700 }) +
          textLines(wrap(n.label, 13), n.x + 58, n.y + 34, 13.5, { anchor: 'start', weight: 700, fill: '#0b5e2d' }) + textLines([p ? p.title.split(' · ')[0] + ' console' : ''], n.x + 58, n.y + n.h - 18, 11, { anchor: 'start', fill: '#3b3550' });
        break;
      }
      case 'sys':
        body = '<rect class="n-bg" x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" fill="' + (n.sub ? '#d9d0fb' : '#fff') + '" stroke="' + (n.sub ? '#b9a9f2' : '#cfcadf') + '" stroke-width="1.2"/>' +
          (n.sub ? textLines([n.label], cx, n.y + 34, 13.5, { weight: 700, fill: '#2b1960', ls: 1.4 }) + textLines([n.sub], cx, n.y + 56, 12.5, { fill: '#3b3550' }) : textLines([n.label], cx, cy + 4.5, 12.5, { weight: 600 }));
        break;
      case 'int':
        body = '<rect class="n-bg" x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" fill="#fff" stroke="#bdb0e8" stroke-width="1.2"/>' +
          textLines([n.label], cx, n.y + (n.h > 44 ? 21 : 17), 12.5, { weight: 650, fill: '#2b1960' }) + textLines([n.sub], cx, n.y + (n.h > 44 ? 38 : 32), 10.5, { fill: '#6d687e' });
        break;
      case 'orch':
        body = '<rect class="n-bg" x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" fill="#211248" stroke="#211248"/>' +
          textLines([n.label], n.x + 26, n.y + 40, 14, { anchor: 'start', fill: '#fff', weight: 700, ls: 1.3 }) + textLines([n.sub], n.x + 26, n.y + 60, 12.5, { anchor: 'start', fill: '#cfc6ea' }) +
          textLines([n.desc], n.x + 330, n.y + 56, 13.5, { anchor: 'start', fill: '#e5def8' });
        break;
      case 'orchn':
        body = '<rect class="n-bg" x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" fill="#36206f" stroke="#4b3590"/>' + textLines(wrap(n.label, 18), cx, n.y + 28, 12.5, { fill: '#fff', weight: 650 }) + textLines([n.sub], cx, n.y + n.h - 12, 10.5, { fill: '#cfc6ea' });
        break;
      case 'pill':
        body = '<rect class="n-bg" x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" rx="' + Math.min(30, n.h / 2) + '" fill="#5cf59e" stroke="#04f06a"/>' + textLines(wrap(n.label, 18), cx, n.y + (n.h > 60 ? 28 : 25), 12.5, { weight: 800, fill: '#10291b', ls: .6 }) + textLines([n.sub], cx, n.y + n.h - (n.h > 60 ? 12 : 13), 10.5, { fill: '#10291b' });
        break;
      case 'pill2':
        body = '<rect class="n-bg" x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" rx="' + Math.min(30, n.h / 2) + '" fill="#211248" stroke="#5cf59e" stroke-width="1.5"/>' + textLines(wrap(n.label, 20), cx, n.y + (n.h > 60 ? 28 : 25), 11.5, { weight: 700, fill: '#5cf59e', ls: .6 }) + textLines([n.sub], cx, n.y + n.h - (n.h > 60 ? 12 : 13), 10.5, { fill: '#5cf59e' });
        break;
      case 'dom':
        body = '<rect class="n-bg" x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" fill="#fff" stroke="#211248" stroke-width="1.5"/>' + '<rect x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="4" fill="' + d.hex + '"/>' + textLines([n.label], cx, cy + 5, 14, { weight: 700, fill: '#211248' });
        break;
      case 'agent':
        body = '<rect class="n-bg" x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" fill="#fff" stroke="#d8d3e6"/>' + '<rect x="' + n.x + '" y="' + n.y + '" width="4" height="' + n.h + '" fill="' + d.hex + '"/>' +
          textLines(wrap(n.label, 15), n.x + 12, n.y + 19, 11.5, { anchor: 'start', weight: 650 }) + '<text class="ag-lvl" data-agent-lvl="' + n.id + '" x="' + (n.x + n.w - 6) + '" y="' + (n.y + n.h - 7) + '" font-size="9.5" text-anchor="end" font-family="IBM Plex Mono, monospace" fill="#6d687e"></text>';
        break;
      case 'ctx':
        body = '<rect class="n-bg" x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" fill="' + (n.sub && n.kind === 'ctx' && n.id === 'graph' ? '#ece9f3' : '#fff') + '" stroke="#cfcadf" stroke-width="1.2"/>' +
          (n.id === 'graph' ? textLines([n.label], n.x + 24, n.y + 40, 14, { anchor: 'start', weight: 700, fill: '#211248', ls: 1.3 }) + textLines([n.sub], n.x + 24, n.y + 66, 13.5, { anchor: 'start', fill: '#3b3550' }) + miniGraph(n.x + 560, n.y + 10, 260, 84)
            : textLines([n.label], n.x + 14, n.y + 24, 13, { anchor: 'start', weight: 700, fill: '#211248' }) + textLines(wrap(n.sub, n.mini ? 60 : 22), n.x + 14, n.y + 44, 11, { anchor: 'start', fill: '#6d687e' }) + (n.mini ? miniGraph(n.x + 20, n.y + 66, n.w - 40, n.h - 76) : ''));
        break;
      case 'lake':
        body = '<rect class="n-bg" x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" fill="#fff" stroke="#211248" stroke-width="1.5" stroke-dasharray="4 3"/>' +
          (n.h < 100 ? textLines([n.label], cx, n.y + 28, 12.5, { weight: 800, fill: '#211248', ls: 1 }) + textLines([n.sub], cx, n.y + 48, 11.5, { fill: '#6d687e' })
            : textLines([n.label], n.x + 14, n.y + 24, 13, { anchor: 'start', weight: 700, fill: '#211248' }) + textLines(wrap(n.sub, 24), n.x + 14, n.y + 44, 11, { anchor: 'start', fill: '#6d687e' }) + lakeIcon(n.x + n.w / 2, n.y + 130));
        break;
      default:
        body = '';
    }
    return '<g class="n-box ' + (n.kind === 'human' ? 'human' : '') + '" data-node="' + n.id + '" tabindex="0" role="button" aria-label="' + esc(n.label) + '">' + body + '</g>';
  }

  function miniGraph(x, y, w, h) {
    const pts = [[.1, .5, 'asset'], [.3, .2, 'identity'], [.32, .8, 'app'], [.55, .45, 'service'], [.75, .15, 'supplier'], [.78, .8, 'vuln'], [.95, .5, 'control']];
    const P = pts.map((p) => [x + p[0] * w, y + p[1] * h, p[2]]);
    const E = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [5, 6], [4, 6], [2, 5]];
    return '<g opacity=".9">' + E.map((e) => '<line x1="' + P[e[0]][0] + '" y1="' + P[e[0]][1] + '" x2="' + P[e[1]][0] + '" y2="' + P[e[1]][1] + '" stroke="#bdb0e8" stroke-width="1.2"/>').join('') +
      P.map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="#451dc7"/><text x="' + p[0] + '" y="' + (p[1] + 15) + '" font-size="9" text-anchor="middle" fill="#6d687e">' + p[2] + '</text>').join('') + '</g>';
  }
  function lakeIcon(cx, cy) {
    return '<g fill="none" stroke="#451dc7" stroke-width="1.6"><ellipse cx="' + cx + '" cy="' + (cy - 14) + '" rx="34" ry="9"/><path d="M' + (cx - 34) + ' ' + (cy - 14) + 'v28c0 5 15 9 34 9s34-4 34-9v-28M' + (cx - 34) + ' ' + cy + 'c0 5 15 9 34 9s34-4 34-9"/></g>';
  }

  function arrow(x1, y1, x2, y2, color, label, lx, anchor) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + color + '" stroke-width="2" marker-end="url(#ah-' + (color === '#088a42' ? 'g' : color === '#9a93ad' ? 'm' : 'i') + ')"/>' +
      (label ? '<text x="' + (lx || x1 + 8) + '" y="' + ((y1 + y2) / 2 + 4) + '" font-size="11.5" fill="' + color + '" font-style="italic" text-anchor="' + (anchor || 'start') + '">' + esc(label) + '</text>' : '');
  }

  function staticEdges(simple, L) {
    const by = {}; L.nodes.forEach((n) => { by[n.id] = n; });
    let g = '';
    if (simple) {
      g += arrow(330, 98, 330, 184, '#451dc7', 'data & events (API/MCP…)', 340) + arrow(560, 184, 560, 100, '#088a42', 'deterministic orders', 570);
      g += arrow(980, 98, 980, 184, '#451dc7') + arrow(1200, 184, 1200, 100, '#088a42');
      DOMS.forEach((d) => { const n = by[d[0]]; const x = n.x + n.w / 2; g += '<line x1="' + x + '" y1="' + (n.y + n.h + 4) + '" x2="' + x + '" y2="482" stroke="#9a93ad" stroke-width="1.6" marker-end="url(#ah-m)" marker-start="url(#ah-ms)"/>'; });
      ['out-cti', 'out-tp', 'out-reg'].forEach((id) => { const n = by[id]; g += '<path d="M' + (n.x + n.w) + ' ' + (n.y + n.h / 2) + ' C 215 ' + (n.y + n.h / 2) + ', 220 238, 248 238" fill="none" stroke="#e8c88a" stroke-width="1.6" stroke-dasharray="4 4"/>'; });
      PEOPLE.forEach((p) => { const n = by[p[0]]; g += '<path d="M1352 238 C 1385 238, 1380 ' + (n.y + n.h / 2) + ', ' + n.x + ' ' + (n.y + n.h / 2) + '" fill="none" stroke="#9fdcb8" stroke-width="1.6" stroke-dasharray="4 4"/>'; });
    } else {
      g += arrow(330, 136, 330, 184, '#451dc7', 'data & events', 340) + arrow(560, 184, 560, 138, '#088a42', 'deterministic orders', 570);
      g += arrow(980, 136, 980, 184, '#451dc7') + arrow(1200, 184, 1200, 138, '#088a42');
      DOMS.forEach((d) => { const n = by[d[0]]; const x = n.x + n.w / 2; g += '<line x1="' + x + '" y1="' + (n.y + n.h + 2) + '" x2="' + x + '" y2="776" stroke="#9a93ad" stroke-width="1.4" marker-end="url(#ah-m)" marker-start="url(#ah-ms)"/>'; });
      ['out-cti', 'out-tp', 'out-reg'].forEach((id) => { const n = by[id]; g += '<path d="M' + (n.x + n.w) + ' ' + (n.y + n.h / 2) + ' C 300 ' + (n.y + n.h / 2) + ', 300 210, 418 210" fill="none" stroke="#e8c88a" stroke-width="1.5" stroke-dasharray="4 4"/>'; });
      PEOPLE.forEach((p) => { const n = by[p[0]]; g += '<path d="M' + (by['or-hitl'].x + by['or-hitl'].w / 2) + ' 332 C 900 350, 1380 ' + (n.y + n.h / 2) + ', ' + n.x + ' ' + (n.y + n.h / 2) + '" fill="none" stroke="#9fdcb8" stroke-width="1.2" stroke-dasharray="4 4" opacity=".7"/>'; });
    }
    return g;
  }

  function drawSvg(simple) {
    const L = simple ? simpleLayout() : fullLayout();
    const frame = simple ? { x: 236, y: 146, w: 1128, h: 462 } : { x: 236, y: 152, w: 1128, h: 832 };
    let s = '<svg class="arch" viewBox="0 0 ' + L.w + ' ' + L.h + '" role="img" aria-label="' + (simple ? 'Simple view of the cyber AI platform' : 'Detailed architecture of the cyber AI platform') + '" font-family="Inter, system-ui, sans-serif">' +
      '<defs>' +
      '<marker id="ah-i" viewBox="0 0 12 12" refX="10.5" refY="6" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L11 6 L0.5 11.2 L3.2 6 Z" fill="#451dc7"/></marker>' +
      '<marker id="ah-g" viewBox="0 0 12 12" refX="10.5" refY="6" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L11 6 L0.5 11.2 L3.2 6 Z" fill="#088a42"/></marker>' +
      '<marker id="ah-m" viewBox="0 0 12 12" refX="10.5" refY="6" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8 L11 6 L0.5 11.2 L3.2 6 Z" fill="#9a93ad"/></marker>' +
      '<marker id="ah-ms" viewBox="0 0 12 12" refX="10.5" refY="6" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0.5 0.8 L11 6 L0.5 11.2 L3.2 6 Z" fill="#9a93ad"/></marker>' +
      '<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '</defs>' +
      '<text x="105" y="' + (simple ? 182 : 172) + '" font-size="11" text-anchor="middle" fill="#8a5a05" font-weight="700" letter-spacing="1.2">OUTSIDE</text>' +
      '<text x="1495" y="' + (simple ? 144 : 172) + '" font-size="11" text-anchor="middle" fill="#0b5e2d" font-weight="700" letter-spacing="1.2">PEOPLE · ROLE CONSOLES</text>' +
      '<rect x="' + frame.x + '" y="' + frame.y + '" width="' + frame.w + '" height="' + frame.h + '" fill="#fff" fill-opacity=".7" stroke="#cfcadf" stroke-width="1.2"/>' +
      '<text x="' + (frame.x + frame.w - 14) + '" y="' + (frame.y + (simple ? 26 : 18)) + '" font-size="11.5" font-weight="700" fill="#6d687e" letter-spacing="1.3" text-anchor="end">CYBER AI PLATFORM</text>';
    const order = ['group', 'band', 'col'];
    const nodes = L.nodes.slice().sort((a, b) => (order.indexOf(b.kind) >= 0 ? 1 : 0) - (order.indexOf(a.kind) >= 0 ? 1 : 0));
    s += '<g class="n-layer">' + nodes.filter((n) => order.indexOf(n.kind) >= 0).map(drawNode).join('') + '</g>';
    s += '<g class="edges">' + staticEdges(simple, L) + '</g>';
    s += '<g class="n-layer">' + nodes.filter((n) => order.indexOf(n.kind) < 0).map(drawNode).join('') + '</g>';
    if (simple) s += '<text x="268" y="352" font-size="12.5" font-weight="700" fill="#211248" letter-spacing="1">SPECIALIZED AGENTS</text><text x="268" y="372" font-size="11.5" fill="#211248" font-style="italic">One or many per domain</text><text x="268" y="388" font-size="11.5" fill="#211248" font-style="italic">that acts</text>';
    if (!simple) s += '<text x="266" y="470" font-size="11" fill="#211248" font-style="italic">One product owner</text><text x="266" y="486" font-size="11" fill="#211248" font-style="italic">and one supervisor</text><text x="266" y="502" font-size="11" fill="#211248" font-style="italic">per domain. Level</text><text x="266" y="518" font-size="11" fill="#211248" font-style="italic">shown on each agent.</text>';
    s += '<g class="flows"></g><g class="tokens"></g></svg>';
    return { svg: s, layout: L };
  }

  /* ------------------------------------------------------------------
     Flow animation
     ------------------------------------------------------------------ */
  /* Flow path between two blocks: leaves and enters each block straight
     (short stubs perpendicular to the edge), with a cubic curve between, so
     the arrowhead always sits square on the target. */
  function anchors(a, b, off) {
    if (a === b) return null;
    off = off || 0;
    const ac = [a.x + a.w / 2, a.y + a.h / 2], bc = [b.x + b.w / 2, b.y + b.h / 2];
    const dx = bc[0] - ac[0], dy = bc[1] - ac[1];
    const GAP = 3, STUB = 14;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    /* Attach on the facing sides, at the point most aligned with the other block. */
    const gy = Math.max(b.y - (a.y + a.h), a.y - (b.y + b.h)), gx = Math.max(b.x - (a.x + a.w), a.x - (b.x + b.w));
    let p1, p2, vertical, sx, sy;
    if (gy > 0 && gy * 1.8 >= gx) {
      vertical = true; sy = dy > 0 ? 1 : -1; sx = 0;
      const ox = (Math.max(a.x, b.x) + Math.min(a.x + a.w, b.x + b.w)) / 2; /* centre of the horizontal overlap, if any */
      const overlap = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) > 24;
      const x1 = overlap ? ox : clamp(bc[0], a.x + 14, a.x + a.w - 14), x2 = overlap ? ox : clamp(ac[0], b.x + 14, b.x + b.w - 14);
      p1 = [x1, dy > 0 ? a.y + a.h : a.y]; p2 = [x2, dy > 0 ? b.y - GAP : b.y + b.h + GAP];
    } else {
      vertical = false; sx = dx > 0 ? 1 : -1; sy = 0;
      const oy = (Math.max(a.y, b.y) + Math.min(a.y + a.h, b.y + b.h)) / 2;
      const overlap = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) > 16;
      const y1 = overlap ? oy : clamp(bc[1], a.y + 10, a.y + a.h - 10), y2 = overlap ? oy : clamp(ac[1], b.y + 10, b.y + b.h - 10);
      p1 = [dx > 0 ? a.x + a.w : a.x, y1]; p2 = [dx > 0 ? b.x - GAP : b.x + b.w + GAP, y2];
    }
    /* Sideways offset, used to separate a return flow from its outbound twin. */
    if (vertical) { p1[0] += off; p2[0] += off; } else { p1[1] += off; p2[1] += off; }
    const q1 = [p1[0] + sx * 6, p1[1] + sy * 6], q2 = [p2[0] - sx * STUB, p2[1] - sy * STUB];
    const span = vertical ? Math.abs(q2[1] - q1[1]) : Math.abs(q2[0] - q1[0]);
    const k = Math.max(24, span * 0.5);
    const c1 = [q1[0] + sx * k, q1[1] + sy * k], c2 = [q2[0] - sx * k, q2[1] - sy * k];
    const f = (pt) => pt[0].toFixed(1) + ' ' + pt[1].toFixed(1);
    return 'M' + f(p1) + ' L' + f(q1) + ' C' + f(c1) + ' ' + f(c2) + ' ' + f(q2) + ' L' + f(p2);
  }

  /* One arrowhead marker per flow colour, so the head matches its flow. */
  function flowMarker(svg, color) {
    const id = 'ahf-' + color.replace(/[^0-9a-z]/gi, '');
    if (!svg.querySelector('#' + id)) {
      const m = document.createElementNS(SVGNS, 'marker');
      m.setAttribute('id', id); m.setAttribute('viewBox', '0 0 12 12'); m.setAttribute('refX', '10.5'); m.setAttribute('refY', '6');
      m.setAttribute('markerWidth', '12'); m.setAttribute('markerHeight', '12'); m.setAttribute('markerUnits', 'userSpaceOnUse'); m.setAttribute('orient', 'auto');
      m.innerHTML = '<path d="M0.5 0.8 L11 6 L0.5 11.2 L3.2 6 Z" fill="' + color + '"/>';
      svg.querySelector('defs').appendChild(m);
    }
    return 'url(#' + id + ')';
  }

  const view = { simple: true, layout: null, root: null, animId: 0 };

  function viewFlows(step) {
    const out = []; const seen = {};
    (step.flow || []).forEach((f) => {
      const a = parentOf(f[0], view.simple), b = parentOf(f[1], view.simple);
      if (a === b) return;
      const k = a + '>' + b; if (seen[k] && view.simple) return; seen[k] = 1;
      out.push([a, b]);
    });
    return out;
  }
  function stepNodes(step) {
    const set = {};
    viewFlows(step).forEach((f) => { set[f[0]] = 1; set[f[1]] = 1; });
    (step.focus || []).forEach((id) => { set[parentOf(id, view.simple)] = 1; });
    const an = actorNode(step.actor); if (an) set[parentOf(an, view.simple)] = 1;
    if (step.gate) { set[parentOf('or-hitl', view.simple)] = 1; }
    return Object.keys(set);
  }

  function nodeById(id) { return view.layout.nodes.find((n) => n.id === id); }
  function colorFor(step) { const d = CP.domain(step.domain); return d.hex || '#451dc7'; }

  function highlight(step) {
    const svg = view.root && view.root.querySelector('svg.arch'); if (!svg) return;
    CP.qsa('.n-box', svg).forEach((g) => g.classList.remove('hot'));
    if (!step) { svg.classList.remove('dim'); return; }
    svg.classList.add('dim');
    stepNodes(step).forEach((id) => { const g = svg.querySelector('.n-box[data-node="' + id + '"]'); if (g) g.classList.add('hot'); });
    if (!view.simple) { const col = svg.querySelectorAll('.n-box[data-node^="dom-"]'); col.forEach((c) => c.classList.add('keep')); }
  }

  function drawFlows(step, animate) {
    const svg = view.root && view.root.querySelector('svg.arch'); if (!svg) return;
    const layer = svg.querySelector('.flows'), tok = svg.querySelector('.tokens');
    layer.innerHTML = ''; tok.innerHTML = '';
    if (!step) return;
    const color = colorFor(step);
    const vf = viewFlows(step);
    const keys = vf.map((f) => f[0] + '>' + f[1]);
    const flows = vf.map((f) => ({ f, d: anchors(nodeById(f[0]) || {}, nodeById(f[1]) || {}, keys.indexOf(f[1] + '>' + f[0]) >= 0 && f[0] > f[1] ? 9 : (keys.indexOf(f[1] + '>' + f[0]) >= 0 ? -9 : 0)) })).filter((x) => x.d && nodeById(x.f[0]) && nodeById(x.f[1]));
    const id = ++view.animId;
    const speed = Math.max(1, (CP.player.status().speed || 1));
    const hop = 720 / Math.min(speed, 3);
    flows.forEach((x, i) => {
      const p = document.createElementNS(SVGNS, 'path');
      p.setAttribute('d', x.d); p.setAttribute('class', 'flow-path trail'); p.setAttribute('stroke', color);
      p.setAttribute('marker-end', flowMarker(svg, color));
      if (animate) p.style.opacity = '0';
      layer.appendChild(p);
      if (!animate) return;
      setTimeout(() => {
        if (id !== view.animId) return;
        p.style.transition = 'opacity .2s'; p.style.opacity = '1';
        const len = p.getTotalLength();
        const dot = document.createElementNS(SVGNS, 'circle');
        dot.setAttribute('r', '7'); dot.setAttribute('fill', color); dot.setAttribute('stroke', '#fff'); dot.setAttribute('stroke-width', '2.5'); dot.setAttribute('filter', 'url(#glow)');
        tok.appendChild(dot);
        const t0 = performance.now();
        (function frame(now) {
          if (id !== view.animId) { dot.remove(); return; }
          const k = Math.min(1, (now - t0) / hop); const e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          const pt = p.getPointAtLength(e * len); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
          if (k < 1) requestAnimationFrame(frame);
          else { pulseNode(x.f[1], color); setTimeout(() => dot.remove(), 120); }
        })(t0);
      }, i * hop);
    });
  }
  function pulseNode(id, color) {
    const svg = view.root && view.root.querySelector('svg.arch'); const n = nodeById(id); if (!svg || !n) return;
    const r = document.createElementNS(SVGNS, 'rect');
    r.setAttribute('x', n.x - 3); r.setAttribute('y', n.y - 3); r.setAttribute('width', n.w + 6); r.setAttribute('height', n.h + 6);
    r.setAttribute('fill', 'none'); r.setAttribute('stroke', color); r.setAttribute('stroke-width', '3'); r.setAttribute('class', 'halo');
    svg.querySelector('.tokens').appendChild(r); setTimeout(() => r.remove(), 1400);
  }

  function paintAgentLevels() {
    const svg = view.root && view.root.querySelector('svg.arch'); if (!svg) return;
    CP.qsa('[data-agent-lvl]', svg).forEach((t) => {
      const a = CP.agent(t.getAttribute('data-agent-lvl'));
      if (!a) return;
      t.textContent = a.mode + (a.status !== 'active' ? ' · ' + a.status : '');
      t.setAttribute('fill', a.status === 'degraded' || a.status === 'suspended' ? '#a4233a' : a.status === 'canary' ? '#451dc7' : '#6d687e');
    });
  }

  /* ------------------------------------------------------------------
     Control band, side panel, timeline, log, value
     ------------------------------------------------------------------ */
  function controlHtml() {
    const st = CP.player.status(); const S = st.scenario;
    const chips = CP.scenarios.map((s) => '<button class="scn-chip' + (S && S.id === s.id ? ' active' : '') + '" data-action="loadScn" data-id="' + s.id + '" title="' + esc(s.title) + '"><span class="n">' + s.n + '</span> ' + esc(s.short) + '</button>').join('');
    const sw = '<div class="view-switch" role="tablist" aria-label="Level of detail"><a href="' + CP.href('arch-simple') + '" class="' + (view.simple ? 'active' : '') + '">Simple view</a><a href="' + CP.href('arch-full') + '" class="' + (!view.simple ? 'active' : '') + '">Detailed view</a></div>';
    const step = st.step, next = st.next;
    const pend = CP.store.pendingApprovals().length;
    const segs = S ? S.steps.map((s, i) => '<button class="seg' + (i <= st.index ? ' done' : '') + (i === st.index && (st.playing || st.waiting) ? ' cur' : '') + (s.gate ? ' gate' : '') + '" style="--seg:' + CP.domain(s.domain).hex + '" data-action="jump" data-i="' + i + '" title="' + esc((i + 1) + '. ' + s.title + (s.gate ? ' (human decision)' : '')) + '" aria-label="' + esc('Step ' + (i + 1) + ': ' + s.title) + '"></button>').join('') : '';
    const pct = S ? Math.round(((st.index + 1) / S.steps.length) * 100) : 0;
    return '<section class="control" data-tour="control"><div class="control-top"><span class="ct-label">' + CP.icon('play') + ' Scenario control</span>' + sw + '<div class="scn-chips" data-tour="scn-chips">' + chips + '</div></div>' +
      '<div class="control-main"><div class="ctl-btns">' +
      (st.playing ? '<button class="go" data-player="pause">' + CP.icon('pause') + ' Pause</button>' : '<button class="go" data-player="play"' + (st.done ? ' disabled' : '') + '>' + CP.icon('play') + ' ' + (S && st.index >= 0 ? 'Resume' : 'Start') + '</button>') +
      '<button class="on-dark" data-player="next" title="Next step (→)" aria-label="Next step">' + CP.icon('next') + '</button><button class="on-dark" data-player="restart" title="Restart" aria-label="Restart"' + (S ? '' : ' disabled') + '>' + CP.icon('restart') + '</button></div>' +
      '<div class="ctl-clock"><div class="lbl">Scenario time</div><div class="big">' + esc(CP.clock.elapsed()) + '</div><div class="sm">Simulated ' + esc(CP.clock.label()) + '</div></div>' +
      '<div class="ctl-now"><div class="lbl">' + (st.waiting ? 'Waiting for a human decision' : 'Current step') + '</div><div class="t">' + esc(step ? step.title : S ? 'Ready: press Start' : 'Pick a scenario') + '</div><div class="s">' + esc(next ? 'Next: ' + next.title : S ? (st.done ? 'Scenario complete' : '') : '4 scenarios, from one alert to the board') + '</div></div>' +
      '<div class="ctl-counters"><div class="ctl-counter"><b>' + (S ? (st.index + 1) + '/' + S.steps.length : '0') + '</b><span>Steps</span></div><div class="ctl-counter' + (pend ? ' warn' : '') + '"><b>' + pend + '</b><span>To decide</span></div><div class="ctl-counter ok"><b>' + (S ? S.value.platform : '–') + '</b><span>Platform</span></div></div>' +
      '<div class="ctl-speed"><div class="lbl" style="font-size:10.5px;letter-spacing:1.3px;color:#bdb0dc;font-weight:700;text-transform:uppercase">Speed</div><select data-change="speed" aria-label="Playback speed">' + [0.5, 1, 2, 4].map((v) => '<option value="' + v + '"' + (st.speed === v ? ' selected' : '') + '>×' + v + '</option>').join('') + '</select></div></div>' +
      (S ? '<div class="ctl-progress">' + segs + '<span class="pct">' + pct + '%</span></div>' : '') + '</section>';
  }

  function artifactHtml(a) {
    if (!a) return '';
    let body = '';
    if (a.type === 'code') body = CP.ui.code(a.body, a.lang);
    else if (a.type === 'email') body = CP.ui.email(a);
    else if (a.type === 'list') body = '<ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.6">' + a.items.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>';
    else if (a.type === 'table') body = '<div class="table-wrap"><table class="t" style="font-size:12.5px"><thead><tr>' + a.cols.map((c) => '<th>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + a.rows.map((r) => '<tr>' + r.map((c) => '<td>' + (/^L[0-3]$/.test(c) ? CP.ui.lvl(c) : esc(c)) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
    return '<div class="artifact"><div class="a-head"><b>' + CP.icon('file') + ' ' + esc(a.title) + '</b></div>' + body + '</div>';
  }

  /* Caption bar above the diagram: the current step (or component info). */
  function captionHtml() {
    const st = CP.player.status(); const S = st.scenario;
    if (view.info) {
      const [kind, txt] = info(view.info); const n = nodeById(view.info) || {};
      return '<div class="cap"><div class="cap-meta">' + CP.ui.tag(esc(kind), 'outline') + '</div><div class="cap-main"><h3 class="sc-title">' + esc(n.label || view.info) + '</h3><p class="sc-text">' + esc(txt) + '</p></div><div class="cap-side"><button class="small" data-action="closeInfo">' + CP.icon('x') + ' Close</button></div></div>';
    }
    if (!S) {
      return '<div class="cap cap-pick"><div class="cap-main"><div class="eyebrow">Pick a scenario</div><p class="sc-text">Each scenario starts from one real-world trigger. Blocks light up, tokens travel along the flows, and every step shows the agent, its autonomy level and what it produced. Click any block to learn what it does.</p></div>' +
        '<div class="cap-scns">' + CP.scenarios.map((s) => '<button class="scn-card" data-action="loadScn" data-id="' + s.id + '" data-autoplay="1"><span class="sn">' + s.n + ' · ' + esc(s.short) + '</span><h3>' + esc(s.title) + '</h3><span class="row wrap" style="padding-top:2px;gap:6px">' + s.domains.map((d) => CP.ui.dom(d)).join('') + '</span></button>').join('') + '</div></div>';
    }
    const step = st.step;
    if (!step) {
      return '<div class="cap"><div class="cap-meta">' + CP.ui.tag(S.n, 'dark') + '<span class="row wrap" style="gap:8px">' + S.domains.map((d) => CP.ui.dom(d)).join('') + '</span></div><div class="cap-main"><h3 class="sc-title">' + esc(S.title) + '</h3><p class="sc-text">' + esc(S.pitch) + '</p></div>' +
        '<div class="cap-side"><div class="sc-metric"><b>' + esc(S.value.manual) + ' → ' + esc(S.value.platform) + '</b><span>today vs with the platform</span></div><button class="go" data-player="play">' + CP.icon('play') + ' Start</button></div></div>';
    }
    const ap = step.gate ? CP.store.find('approvals', step.gate.approval.id) : null;
    return '<div class="cap' + (ap && ap.status === 'pending' ? ' cap-gate' : '') + '" data-tour="arch-caption"><div class="cap-meta">' + CP.ui.tag('Step ' + (st.index + 1) + '/' + st.total, 'dark') + '<span class="tag outline mono">' + esc(CP.clock.elapsed(step.t)) + '</span>' + CP.ui.lvl(step.level) + '<span class="cap-who">' + CP.ui.who(step.actor) + '</span></div>' +
      '<div class="cap-main"><h3 class="sc-title">' + esc(step.title) + '</h3><p class="sc-text">' + esc(step.text) + '</p></div>' +
      '<div class="cap-side">' + (step.metric ? '<div class="sc-metric"><b>' + esc(step.metric.value) + '</b><span>' + esc(step.metric.label) + '</span></div>' : '') +
      (ap && ap.status === 'pending' ? '<div class="cap-dec"><div class="small-txt"><b>' + CP.icon('users') + ' ' + esc((CP.person(ap.decider) || {}).name || '') + ' decides</b></div><div class="row" style="gap:6px"><button class="go small" data-decide="' + esc(ap.id) + '" data-decision="approve">' + CP.icon('check') + ' ' + esc(ap.approveLabel || 'Approve') + '</button><button class="danger small" data-decide="' + esc(ap.id) + '" data-decision="reject">' + esc(ap.rejectLabel || 'Reject') + '</button></div></div>' : '') +
      (ap && ap.status !== 'pending' ? CP.ui.status(ap.status, ap.status === 'approved' ? 'Approved by ' + ((CP.person(ap.decidedBy) || {}).name || 'human') : 'Rejected: fallback applied') : '') +
      (step.see ? '<button class="small" data-go="' + step.see[0] + (step.see[1] ? '/' + step.see[1] : '') + '">' + CP.icon('external') + ' ' + esc(step.see[2]) + '</button>' : '') + '</div></div>';
  }

  /* Details row under the diagram: artifact and decision card. */
  function detailsHtml() {
    const st = CP.player.status(); const step = st.step;
    if (!step) return '';
    const ap = step.gate ? CP.store.find('approvals', step.gate.approval.id) : null;
    const art = artifactHtml(step.artifact);
    if (!art && !ap) return '';
    return '<div class="grid ' + (art && ap ? 'g2' : '') + '" style="margin-top:18px">' + (ap ? '<div data-tour="arch-decision">' + CP.ui.decision(ap, { pulse: ap.status === 'pending' }) + '</div>' : '') + (art ? '<div class="card" style="padding:0">' + art + '</div>' : '') + '</div>';
  }
  const sideHtml = captionHtml;

  function timelineHtml() {
    const st = CP.player.status(); const S = st.scenario;
    if (!S) return '';
    const LANES = [['ext', 'Outside'], ['src', 'Systems'], ['orch', 'Orchestrator'], ['cti', 'CTI'], ['grc', 'GRC'], ['appsec', 'AppSec'], ['data', 'Data'], ['iam', 'IAM'], ['soc', 'SOC / VulnOps'], ['human', 'Humans'], ['trust', 'Trust & Challenge']];
    const used = LANES.filter((l) => S.steps.some((s) => laneOf(s) === l[0]));
    const n = S.steps.length;
    const pos = (i) => ((i + 0.5) / n) * 100;
    let rows = '';
    used.forEach((l) => {
      const d = CP.domain(l[0] === 'human' ? 'human' : l[0]);
      rows += '<div class="lane-label" style="--lc:' + d.hex + '">' + esc(l[1]) + '</div><div class="lane-track">';
      S.steps.forEach((s, i) => {
        if (laneOf(s) !== l[0]) return;
        const cls = i > st.index ? ' future' : '' + (i === st.index ? ' cur' : '');
        rows += '<div class="ev' + cls + (s.gate ? ' gate' : '') + '" style="left:calc(' + pos(i) + '% - ' + (50 / n) + '% + 2px);width:calc(' + (100 / n) + '% - 4px);min-width:0;max-width:none;--ec:' + d.hex + '" data-action="jump" data-i="' + i + '" title="' + esc((i + 1) + '. ' + s.title + ' · ' + CP.clock.label(s.t)) + '"><div class="ev-t">' + esc(CP.clock.label(s.t).slice(4)) + (s.gate ? ' · decision' : '') + '</div><div class="ev-x">' + esc(s.title) + '</div></div>';
      });
      rows += '</div>';
    });
    const nowLeft = st.index >= 0 ? pos(st.index) : 0;
    return '<section class="lanes" data-tour="lanes"><div class="lanes-head"><div><div class="eyebrow">Real-time flow timeline</div><div class="small-txt muted">One lane per actor, one card per step, in order. Click a card to jump to it. Gold cards wait for a human.</div></div><div class="row small-txt muted">' + CP.icon('clock') + ' ' + esc(CP.clock.label(0)) + ' → ' + esc(CP.clock.label(S.steps[n - 1].t)) + '</div></div>' +
      '<div class="lanes-grid"><div class="lane-axis-label">Step</div><div class="lane-axis">' + S.steps.map((s, i) => '<span style="flex:1;text-align:center">' + (i + 1) + '</span>').join('') + '</div>' + rows +
      '<div class="now-line" style="left:calc(var(--lw) + (100% - var(--lw)) * ' + (nowLeft / 100).toFixed(4) + ');' + (st.index < 0 ? 'display:none' : '') + '"></div></div></section>';
  }
  function laneOf(s) { return s.domain === 'ext' || s.domain === 'src' ? s.domain : s.domain; }

  function logHtml() {
    return '<div class="log" id="arch-log" aria-live="polite">' + CP.player.log.map(logLine).join('') + '</div>';
  }
  function logLine(l) {
    const a = CP.actor(l.actor);
    return '<div class="l ' + esc(l.cls) + '"><span class="lt">' + esc(l.ts) + '</span><span class="la" style="color:' + (a.color && a.color.indexOf('var') < 0 ? a.color : '#b9a8ff') + '">' + esc(a.name) + '</span><span class="lx">' + esc(l.text) + '</span></div>';
  }

  function valueHtml() {
    const S = CP.player.status().scenario;
    if (!S) return '<div class="card"><div class="eyebrow">Value</div><p class="small-txt muted" style="margin:0">Pick a scenario to compare today\'s way of working with the platform.</p></div>';
    const v = S.value;
    const mx = Math.max(v.manualHours, v.platformHours, 1);
    return '<div class="card" data-tour="value"><div class="card-title"><div><div class="eyebrow">Value of this scenario</div><h3 style="margin:0">' + esc(v.manual) + ' → ' + esc(v.platform) + '</h3></div>' + CP.ui.tag(v.decisions + ' human decision' + (v.decisions > 1 ? 's' : ''), 'amber') + '</div>' +
      (v.manualHours ? '<div class="value-bars"><div class="vb-row"><span>Today</span><div class="vb-bar"><span style="width:100%;--c:#b9b3c9"></span></div><b>' + CP.fmt(v.manualHours) + ' h</b></div><div class="vb-row"><span>With platform</span><div class="vb-bar"><span style="width:' + (v.platformHours / mx * 100).toFixed(1) + '%;--c:#451dc7"></span></div><b>' + CP.fmt(v.platformHours) + ' h</b></div></div><p class="small-txt muted" style="margin:10px 0 0">Human effort. ' + esc(v.note) + '</p>'
        : '<p class="small-txt muted" style="margin:0">' + esc(v.note) + '</p>') + '</div>';
  }

  /* ------------------------------------------------------------------
     Screen rendering and live updates
     ------------------------------------------------------------------ */
  function renderArch(simple) {
    view.simple = simple;
    const d = drawSvg(simple); view.layout = d.layout;
    const S = CP.player.status().scenario;
    return CP.ui.head(simple ? 'How it works · Simple view' : 'How it works · Detailed view',
      simple ? 'Toward one centralized cyber platform' : 'Inside the platform: components and flows',
      simple ? 'One context to host many agents. Pick a scenario and watch how one trigger travels from the systems to the orchestrator, the specialized agents, the shared context and, above threshold, to the humans who decide.'
        : 'The same scenarios, at component level: connectors and executors, the orchestrator\'s planner, policy engine, human-in-the-loop queue and safety layer, the model gateway, 16 agents in 6 domains, and the shared graph, memory and data lake.',
      '<button class="small" data-action="legend">' + CP.icon('info') + ' How to read it</button>') +
      '<div id="arch-control">' + controlHtml() + '</div>' +
      '<div id="arch-side">' + captionHtml() + '</div>' +
      '<div class="arch-stage" data-tour="arch-stage"><div class="arch-scroll">' + d.svg + '</div><div class="arch-legend"><span><i style="background:#451dc7"></i>data & events</span><span><i style="background:#088a42"></i>deterministic orders</span><span><i style="background:repeating-linear-gradient(90deg,#7a3ff2 0 6px,transparent 6px 10px)"></i>live flow (colour = domain)</span><span><i style="background:#5cf59e;height:10px;width:14px"></i>humans decide</span><span>Click any block for details</span></div></div>' +
      '<div id="arch-details">' + detailsHtml() + '</div>' +
      '<div id="arch-timeline">' + timelineHtml() + '</div>' +
      '<div class="grid g-3-2" style="margin-top:18px"><div class="card" style="padding:0"><div class="card-title" style="padding:14px 16px 0;margin-bottom:10px"><div><div class="eyebrow">Event log</div><div class="sub">What the orchestrator records, in order (audit trail)</div></div></div>' + logHtml() + '</div><div id="arch-value">' + valueHtml() + '</div></div>' +
      (S ? '' : '');
  }

  function mountArch(root) {
    view.root = root;
    view.info = view.info || null;
    const st = CP.player.status();
    paintAgentLevels();
    if (st.step) { highlight(st.step); drawFlows(st.step, false); }
    const log = root.querySelector('#arch-log'); if (log) log.scrollTop = log.scrollHeight;
    root.querySelector('svg.arch').addEventListener('click', (e) => {
      const g = e.target.closest('.n-box'); if (!g) return;
      view.info = g.getAttribute('data-node'); refresh(['side']);
    });
    root.querySelector('svg.arch').addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return; const g = e.target.closest('.n-box'); if (!g) return;
      view.info = g.getAttribute('data-node'); refresh(['side']);
    });
  }

  function isArch() { return CP.route.id === 'arch-simple' || CP.route.id === 'arch-full'; }
  function refresh(parts) {
    if (!isArch() || !view.root) return;
    const map = { control: ['#arch-control', controlHtml], side: ['#arch-side', captionHtml], details: ['#arch-details', detailsHtml], timeline: ['#arch-timeline', timelineHtml], value: ['#arch-value', valueHtml] };
    (parts || Object.keys(map)).forEach((k) => { const el = view.root.querySelector(map[k][0]); if (el) el.innerHTML = map[k][1](); });
  }

  CP.bus.on('player:step', ({ step, instant }) => {
    if (!isArch()) return;
    view.info = null;
    highlight(step); drawFlows(step, !instant); paintAgentLevels();
    refresh(['control', 'side', 'details', 'timeline']);
  });
  CP.bus.on('player:log', (l) => {
    if (!isArch() || !view.root) return;
    const el = view.root.querySelector('#arch-log'); if (!el) return;
    el.insertAdjacentHTML('beforeend', logLine(l)); el.scrollTop = el.scrollHeight;
  });
  CP.bus.on('player:state', () => refresh(['control']));
  CP.bus.on('player:load', () => { view.info = null; if (isArch()) CP.render(); });
  CP.bus.on('change', () => { if (isArch()) { refresh(['control', 'side', 'details']); paintAgentLevels(); } });

  const actions = {
    loadScn(el) { CP.player.load(el.dataset.id, { autoplay: !!el.dataset.autoplay }); },
    jump(el) { CP.player.jump(+el.dataset.i); },
    speed(el) { CP.player.setSpeed(+el.value); },
    closeInfo() { view.info = null; refresh(['side']); },
    legend() {
      CP.modal('How to read the diagram', '<div class="stack" style="gap:12px;font-size:14px;line-height:1.6">' +
        '<p style="margin:0"><b>Top:</b> the systems the platform reads and drives. Indigo arrows carry data and events in; green arrows carry deterministic orders out, executed by signed playbooks, never directly by an agent.</p>' +
        '<p style="margin:0"><b>Middle:</b> the orchestrator assigns work and checks decision rights; the specialized agents act in their domain; humans decide above threshold; the safety layer tests in a sandbox and can roll back or switch any agent off.</p>' +
        '<p style="margin:0"><b>Bottom:</b> the shared context every agent uses: the cyber security graph (what is connected to what) and the data lake (long-term memory).</p>' +
        '<p style="margin:0"><b>Sides:</b> the outside world on the left (CTI, suppliers, regulators) and the people of the new organisation on the right, each with their console in Part 2.</p>' +
        '<p style="margin:0"><b>Autonomy levels:</b> ' + CP.data.autonomy.map((a) => CP.ui.lvl(a.id) + ' ' + esc(a.desc)).join('<br>') + '</p></div>');
    }
  };

  CP.screen({ id: 'arch-simple', part: 1, label: 'Simple view', icon: 'layers', live: false, render() { return renderArch(true); }, mount: mountArch, actions });
  CP.screen({ id: 'arch-full', part: 1, label: 'Detailed view', icon: 'network', live: false, render() { return renderArch(false); }, mount: mountArch, actions });
  CP.arch = { simpleLayout, fullLayout, info, drawSvg };
})();
