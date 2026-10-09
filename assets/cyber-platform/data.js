/* Cyber AI Platform demo: the simulated world (fictitious company Novalys
   Group). Every name, figure and organisation here is invented. */
(function () {
  'use strict';
  const CP = window.CP = window.CP || {};
  const D = CP.data = {};

  D.home = 'home';
  D.company = {
    name: 'Novalys Group', short: 'Novalys', sector: 'European banking & insurance group',
    staff: '38,000 staff', countries: '14 countries', thirdParties: 1240, apps: 2150, identities: 61000,
    regs: ['DORA', 'NIS2', 'AI Act', 'GDPR'], date: 'Tuesday 13 October 2026'
  };

  D.domains = [
    { id: 'cti', label: 'CTI', color: 'var(--d-cti)', hex: '#7a3ff2' },
    { id: 'grc', label: 'GRC', color: 'var(--d-grc)', hex: '#1597a5' },
    { id: 'appsec', label: 'AppSec', color: 'var(--d-appsec)', hex: '#e0662b' },
    { id: 'data', label: 'Data', color: 'var(--d-data)', hex: '#2f7de1' },
    { id: 'iam', label: 'IAM', color: 'var(--d-iam)', hex: '#c43d8a' },
    { id: 'soc', label: 'SOC / VulnOps', color: 'var(--d-soc)', hex: '#a87a00' },
    { id: 'orch', label: 'Orchestrator', color: 'var(--d-orch)', hex: '#451dc7' },
    { id: 'human', label: 'Humans', color: 'var(--d-human)', hex: '#088a42' },
    { id: 'src', label: 'Systems', color: 'var(--d-src)', hex: '#6d687e' },
    { id: 'ext', label: 'Outside', color: 'var(--d-ext)', hex: '#c8861a' },
    { id: 'trust', label: 'Trust & Challenge', color: '#5a2be0', hex: '#5a2be0' }
  ];

  D.autonomy = [
    { id: 'L0', short: 'Suggest', label: 'L0 · Suggest', desc: 'The agent proposes; a human performs the action.' },
    { id: 'L1', short: 'Approve', label: 'L1 · Act on approval', desc: 'The agent prepares everything and acts once the decision holder approves.' },
    { id: 'L2', short: 'Act & notify', label: 'L2 · Act and notify', desc: 'The agent acts inside its guardrails, informs the supervisor, a rollback point exists.' },
    { id: 'L3', short: 'Autonomous', label: 'L3 · Autonomous', desc: 'The agent acts alone; quality sampling checks it afterwards.' }
  ];

  /* Personas are named by their role only: no personal names. */
  D.people = [
    { id: 'p-elena', name: 'CISO', title: 'Group CISO', abbr: 'CISO', team: 'ciso', color: '#451dc7' },
    { id: 'p-amira', name: 'Head of Engage', title: 'Engage · Compliance & regulators', abbr: 'ENG', team: 'engage', color: '#1597a5' },
    { id: 'p-marc', name: 'Third-party risk lead', title: 'Engage · TPRM', abbr: 'TPRM', team: 'engage', color: '#1597a5' },
    { id: 'p-lucas', name: 'Business CISO', title: 'Engage · Payments & Treasury', abbr: 'BISO', team: 'engage', color: '#1597a5' },
    { id: 'p-tom', name: 'Crisis manager', title: 'Engage · Crisis & incident management', abbr: 'CRI', team: 'engage', color: '#1597a5' },
    { id: 'p-leo', name: 'Culture lead', title: 'Engage · Culture & engagement', abbr: 'CUL', team: 'engage', color: '#1597a5' },
    { id: 'p-raj', name: 'Platform manager', title: 'Build · Program & platform manager', abbr: 'PGM', team: 'build', color: '#e0662b' },
    { id: 'p-ines', name: 'Agent product owner', title: 'Build · SOC domain', abbr: 'PO', team: 'build', color: '#e0662b' },
    { id: 'p-yuki', name: 'Agent developer', title: 'Build · SOC & AppSec', abbr: 'DEV', team: 'build', color: '#e0662b' },
    { id: 'p-chloe', name: 'Head of Run', title: 'Run · Agent supervisor SOC', abbr: 'RUN', team: 'run', color: '#2f7de1' },
    { id: 'p-mei', name: 'Agent supervisor', title: 'Run · GRC & IAM domains', abbr: 'SUP', team: 'run', color: '#2f7de1' },
    { id: 'p-pierre', name: 'Quality manager', title: 'Run · Platform quality', abbr: 'QA', team: 'run', color: '#2f7de1' },
    { id: 'p-nadia', name: 'Performance manager', title: 'Run · AI costs, efficiency & ROI', abbr: 'PERF', team: 'run', color: '#2f7de1' },
    { id: 'p-jonas', name: 'AI assurance lead', title: 'Trust & Challenge · Data scientists', abbr: 'AIA', team: 'trust', color: '#5a2be0' },
    { id: 'p-sam', name: 'Red team lead', title: 'Trust & Challenge · Offensive', abbr: 'RED', team: 'trust', color: '#5a2be0' },
    { id: 'p-hugo', name: 'Head of Treasury', title: 'Business owner · Payments', abbr: 'TRE', team: 'business', color: '#3a3550' },
    { id: 'p-sara', name: 'DPO', title: 'Data Protection Officer', abbr: 'DPO', team: 'business', color: '#3a3550' }
  ];

  D.roles = [
    { id: 'ciso', label: 'CISO', persona: 'p-elena', screen: 'ciso', desc: 'Global view, decisions above threshold, value' },
    { id: 'engage', label: 'Engage', persona: 'p-amira', screen: 'engage', desc: 'Business, third parties, regulators, crisis, culture' },
    { id: 'build', label: 'Platform Ops · Build', persona: 'p-raj', screen: 'build', desc: 'Agent products, studio, pipeline, connectors' },
    { id: 'run', label: 'Platform Ops · Run', persona: 'p-chloe', screen: 'run', desc: 'Live operations, supervision, quality, cost' },
    { id: 'trust', label: 'Trust & Challenge', persona: 'p-jonas', screen: 'trust', desc: 'AI assurance, red team, adversary lab, LoD2' }
  ];

  /* Non-agent actors that appear in logs and timelines. */
  D.actors = {
    orchestrator: { name: 'Orchestrator', sub: 'AI cyber orchestrator', color: 'var(--d-orch)' },
    'cti-feed': { name: 'CTI feeds', sub: 'CERT-FR, ISAC, commercial', color: 'var(--d-ext)' },
    regulator: { name: 'Supervisor', sub: 'National competent authority', color: 'var(--d-ext)' },
    thirdparty: { name: 'Third parties', sub: 'Supplier portal', color: 'var(--d-ext)' },
    entra: { name: 'Identity provider', sub: 'Identity provider', color: 'var(--d-src)' },
    edr: { name: 'EDR', sub: 'Endpoint detection', color: 'var(--d-src)' },
    siem: { name: 'SIEM', sub: 'Security analytics', color: 'var(--d-src)' },
    waf: { name: 'WAF', sub: 'Web application firewall', color: 'var(--d-src)' },
    itsm: { name: 'ITSM', sub: 'Change & ticketing', color: 'var(--d-src)' },
    mail: { name: 'Mail gateway', sub: 'Email security', color: 'var(--d-src)' },
    sandbox: { name: 'Sandbox', sub: 'Digital twin', color: 'var(--d-orch)' },
    killswitch: { name: 'Kill-switch', sub: 'Safety layer', color: 'var(--red)' },
    evals: { name: 'Eval harness', sub: 'AI assurance', color: '#5a2be0' },
    deviation: { name: 'Deviation hunt', sub: 'AI assurance monitor', color: '#5a2be0' },
    redteam: { name: 'Adversary lab', sub: 'Offensive', color: '#5a2be0' }
  };

  /* Sidebar groups (screen ids). */
  D.navGroups = [
    { label: 'How it works', part: 1, items: ['home', 'platform-tour', 'arch-simple', 'arch-full', 'build-it', 'rights'] },
    { label: 'The platform', part: 2, items: ['ciso', 'engage', 'build', 'run', 'trust'] },
    { label: 'Showcase', part: 0, items: ['demo'] }
  ];

  /* Decision rights: what each kind of action needs. Used by the policy
     engine narrative and the Decision rights screen. */
  D.rights = [
    { action: 'Enrich an indicator, query the graph, open a case', domain: 'all', level: 'L3', decider: '', why: 'Read-only, no impact' },
    { action: 'Block a known-bad IP or domain (confidence ≥ 90%)', domain: 'soc', level: 'L3', decider: '', why: 'Reversible in seconds, no business flow' },
    { action: 'Revoke sessions and force re-authentication', domain: 'iam', level: 'L3', decider: '', why: 'User-level, reversible, protects the account' },
    { action: 'Deploy a SIEM or EDR detection rule', domain: 'soc', level: 'L2', decider: 'p-chloe', why: 'Backtested on 30 days; noise budget enforced' },
    { action: 'Deploy a WAF virtual patch in blocking mode', domain: 'appsec', level: 'L2', decider: 'p-chloe', why: 'Sandbox replay must show 0 false positive' },
    { action: 'Restrict a third-party connection', domain: 'grc', level: 'L2', decider: 'p-lucas', why: 'Partial flow cut, business informed' },
    { action: 'Send questions or notices to third parties', domain: 'grc', level: 'L1', decider: 'p-marc', why: 'External communication on behalf of the group' },
    { action: 'Disable a privileged or executive account', domain: 'iam', level: 'L1', decider: 'p-chloe', why: 'Business continuity of a key person' },
    { action: 'Emergency patch outside the change window', domain: 'soc', level: 'L1', decider: 'p-elena', why: 'Service interruption on a critical application' },
    { action: 'Isolate a production server', domain: 'soc', level: 'L1', decider: 'p-elena', why: 'Blast radius above 1 critical business service' },
    { action: 'Freeze outgoing payments', domain: 'iam', level: 'L1', decider: 'p-hugo', why: 'Direct financial and client impact' },
    { action: 'Submit evidence or a notification to a regulator', domain: 'grc', level: 'L1', decider: 'p-amira', why: 'Regulatory commitment of the group' },
    { action: 'Lower an agent autonomy level (kill-switch)', domain: 'orch', level: 'L1', decider: 'p-chloe', why: 'Any Run supervisor; immediate in emergency' },
    { action: 'Promote a new agent version to production', domain: 'orch', level: 'L1', decider: 'p-ines', why: 'Product owner, with Trust & Challenge sign-off' }
  ];
  D.thresholds = [
    { k: 'Blast radius', v: 'More than 50 users, 1 critical business service or 1 production server' },
    { k: 'Reversibility', v: 'No rollback in under 5 minutes' },
    { k: 'Confidence', v: 'Agent confidence under 85%, or disagreement between two agents' },
    { k: 'Exposure', v: 'Any message leaving the group: clients, suppliers, press, regulators' },
    { k: 'Money', v: 'Any action on payments, or an impact above €100k' },
    { k: 'Novelty', v: 'An action the agent has never performed in production' }
  ];

  const tp = (id, name, service, criticality, country, score, fileBridge, extra) => Object.assign({
    id, name, service, criticality, country, score, fileBridge, questionnaire: { status: 'none' },
    critFunction: criticality === 'critical', exitPlan: criticality !== 'critical', lastAssessment: 'Mar 2026', subcontractors: 2
  }, extra || {});

  D.seed = {
    kpis: {
      actionsToday: 1284, autonomousShare: 87, humanDecisions: 14, hoursSaved: 312, mttcMinutes: 18,
      aiCostToday: 1840, riskScore: 62, exposureOpen: 37, agentsActive: 16, alertsTriaged: 3420,
      killSwitches: 0, thirdPartiesAssessed: 1182, detectionsLive: 412, casesOpen: 6, qaSampled: 214, qaAgreement: 96.4
    },

    agents: [
      { id: 'ag-cti-collect', name: 'CTI Collector', domain: 'cti', mode: 'L3', status: 'active', version: '1.8.2', owner: 'p-ines', supervisor: 'p-chloe', model: 'Frontier-M (EU)', tasksToday: 642, autoRate: 99, accuracy: 97.8, costToday: 96, tools: ['cti.feeds.read', 'graph.query', 'case.open'] },
      { id: 'ag-cti-analyst', name: 'CTI Analyst', domain: 'cti', mode: 'L2', status: 'active', version: '2.1.0', owner: 'p-ines', supervisor: 'p-chloe', model: 'Frontier-L (EU)', tasksToday: 58, autoRate: 81, accuracy: 94.1, costToday: 142, tools: ['graph.query', 'lake.search', 'orchestrator.plan'] },
      { id: 'ag-grc-tprm', name: 'TPRM Agent', domain: 'grc', mode: 'L1', status: 'active', version: '1.4.0', owner: 'p-raj', supervisor: 'p-mei', model: 'Frontier-M (EU)', tasksToday: 37, autoRate: 42, accuracy: 95.2, costToday: 61, tools: ['tprm.inventory', 'tprm.questionnaire', 'portal.send', 'graph.query'] },
      { id: 'ag-grc-controls', name: 'Controls & Evidence Agent', domain: 'grc', mode: 'L2', status: 'active', version: '1.6.1', owner: 'p-raj', supervisor: 'p-mei', model: 'Frontier-L (EU)', tasksToday: 112, autoRate: 77, accuracy: 93.6, costToday: 118, tools: ['controls.map', 'lake.search', 'doc.generate'] },
      { id: 'ag-grc-policy', name: 'Policy Agent', domain: 'grc', mode: 'L1', status: 'active', version: '1.1.3', owner: 'p-raj', supervisor: 'p-mei', model: 'Frontier-M (EU)', tasksToday: 9, autoRate: 30, accuracy: 96.0, costToday: 14, tools: ['policy.repo', 'doc.generate'] },
      { id: 'ag-as-waf', name: 'WAF Tuning Agent', domain: 'appsec', mode: 'L2', status: 'active', version: '1.3.4', owner: 'p-yuki', supervisor: 'p-chloe', model: 'Frontier-M (EU)', tasksToday: 24, autoRate: 88, accuracy: 98.3, costToday: 22, tools: ['waf.rules', 'sandbox.replay', 'graph.query'] },
      { id: 'ag-as-code', name: 'Code Review Agent', domain: 'appsec', mode: 'L2', status: 'active', version: '3.0.1', owner: 'p-yuki', supervisor: 'p-chloe', model: 'Frontier-L (EU)', tasksToday: 318, autoRate: 74, accuracy: 92.8, costToday: 236, tools: ['scm.read', 'scm.pr.comment', 'sca.scan'] },
      { id: 'ag-dt-dlp', name: 'Data Protection Agent', domain: 'data', mode: 'L2', status: 'active', version: '1.2.0', owner: 'p-raj', supervisor: 'p-mei', model: 'Frontier-M (EU)', tasksToday: 205, autoRate: 83, accuracy: 94.9, costToday: 71, tools: ['collab.audit', 'dlp.events', 'classification.read'] },
      { id: 'ag-dt-evidence', name: 'Evidence Collector', domain: 'data', mode: 'L3', status: 'active', version: '1.0.6', owner: 'p-raj', supervisor: 'p-mei', model: 'Small-S (on-prem)', tasksToday: 486, autoRate: 100, accuracy: 99.1, costToday: 18, tools: ['lake.search', 'cmdb.read', 'tprm.inventory'] },
      { id: 'ag-iam-resp', name: 'Identity Response Agent', domain: 'iam', mode: 'L2', status: 'active', version: '2.0.2', owner: 'p-ines', supervisor: 'p-mei', model: 'Frontier-M (EU)', tasksToday: 47, autoRate: 91, accuracy: 97.2, costToday: 33, tools: ['idp.sessions', 'idp.access_policy', 'mail.rules', 'graph.query'] },
      { id: 'ag-iam-review', name: 'Access Review Agent', domain: 'iam', mode: 'L1', status: 'active', version: '1.5.0', owner: 'p-ines', supervisor: 'p-mei', model: 'Frontier-M (EU)', tasksToday: 1310, autoRate: 64, accuracy: 95.5, costToday: 104, tools: ['iga.read', 'graph.query', 'iga.campaign'] },
      { id: 'ag-soc-triage', name: 'SOC Triage Agent', domain: 'soc', mode: 'L2', status: 'active', version: '2.5.0', owner: 'p-ines', supervisor: 'p-chloe', model: 'Frontier-M (EU)', tasksToday: 3420, autoRate: 61, accuracy: 96.8, costToday: 412, tools: ['siem.alerts', 'edr.query', 'mail.query', 'case.update', 'graph.query'] },
      { id: 'ag-soc-detect', name: 'Detection Engineer Agent', domain: 'soc', mode: 'L2', status: 'active', version: '1.9.0', owner: 'p-ines', supervisor: 'p-chloe', model: 'Frontier-L (EU)', tasksToday: 16, autoRate: 70, accuracy: 93.9, costToday: 88, tools: ['siem.rules', 'lake.backtest', 'sigma.convert'] },
      { id: 'ag-soc-forensic', name: 'Forensic Agent', domain: 'soc', mode: 'L2', status: 'active', version: '1.2.5', owner: 'p-ines', supervisor: 'p-chloe', model: 'Frontier-L (EU)', tasksToday: 7, autoRate: 86, accuracy: 91.7, costToday: 57, tools: ['edr.collect', 'edr.query', 'lake.search'] },
      { id: 'ag-soc-hunt', name: 'Threat Hunter Agent', domain: 'soc', mode: 'L2', status: 'active', version: '1.4.2', owner: 'p-ines', supervisor: 'p-chloe', model: 'Frontier-L (EU)', tasksToday: 21, autoRate: 79, accuracy: 92.4, costToday: 96, tools: ['lake.search', 'edr.query', 'proxy.logs'] },
      { id: 'ag-vuln', name: 'VulnOps Agent', domain: 'soc', mode: 'L2', status: 'active', version: '2.2.0', owner: 'p-yuki', supervisor: 'p-chloe', model: 'Frontier-M (EU)', tasksToday: 274, autoRate: 85, accuracy: 95.0, costToday: 72, tools: ['vuln.scanner', 'graph.query', 'itsm.change'] }
    ],

    approvals: [],

    cases: [
      { id: 'C-2291', title: 'Phishing wave impersonating the HR portal', severity: 'medium', status: 'contained', domains: ['soc', 'iam'], opened: 'Mon 16:20', owner: 'ag-soc-triage', summary: '212 emails quarantined, 3 clicks, credentials reset automatically.' },
      { id: 'C-2288', title: 'Expired TLS certificate on a broker API', severity: 'low', status: 'open', domains: ['appsec'], opened: 'Mon 11:05', owner: 'ag-vuln', summary: 'Renewal change raised, due tonight.' },
      { id: 'C-2284', title: 'Toxic access combination in Trade Finance', severity: 'medium', status: 'open', domains: ['iam', 'grc'], opened: 'Sun 09:12', owner: 'ag-iam-review', summary: '11 users can both create and approve letters of credit.' },
      { id: 'C-2279', title: 'Supplier rating drop: LexAdvisors', severity: 'low', status: 'monitoring', domains: ['grc'], opened: 'Fri 14:40', owner: 'ag-grc-tprm', summary: 'External rating down 12 points, leaked credentials on a paste site.' }
    ],

    feed: [
      { id: 'f-b1', ts: '08:12', actor: 'ag-soc-triage', domain: 'soc', level: 'info', text: 'closed 186 benign alerts overnight (sampled 5% for QA).' },
      { id: 'f-b2', ts: '07:55', actor: 'ag-vuln', domain: 'soc', level: 'action', text: 'raised 14 patch changes for internet-facing servers (CVSS ≥ 8).' },
      { id: 'f-b3', ts: '07:31', actor: 'ag-iam-review', domain: 'iam', level: 'info', text: 'removed 42 dormant accounts after manager confirmation.' },
      { id: 'f-b4', ts: '06:48', actor: 'ag-cti-collect', domain: 'cti', level: 'info', text: 'ingested 3,912 indicators, 0 matches on group assets.' },
      { id: 'f-b5', ts: '06:02', actor: 'ag-grc-controls', domain: 'grc', level: 'info', text: 'refreshed 312 control tests for the NIS2 self-assessment.' }
    ],

    actions: [
      { id: 'A-9812', ts: '08:05', agent: 'ag-soc-triage', system: 'Mail gateway', action: 'Quarantined 38 emails from a lookalike domain', level: 'L3', status: 'done', rollback: true },
      { id: 'A-9809', ts: '07:55', agent: 'ag-vuln', system: 'ITSM', action: 'Raised 14 standard patch changes', level: 'L2', status: 'done', rollback: true },
      { id: 'A-9801', ts: '07:31', agent: 'ag-iam-review', system: 'IGA', action: 'Disabled 42 dormant accounts', level: 'L1', status: 'done', rollback: true },
      { id: 'A-9794', ts: '03:14', agent: 'ag-iam-resp', system: 'Identity provider', action: 'Revoked sessions of 2 users after risky sign-in', level: 'L3', status: 'done', rollback: true },
      { id: 'A-9790', ts: '02:40', agent: 'ag-soc-triage', system: 'Proxy', action: 'Blocked 3 domains (malware C2, confidence 96%)', level: 'L3', status: 'done', rollback: true },
      { id: 'A-9783', ts: 'Mon 22:10', agent: 'ag-as-waf', system: 'WAF', action: 'Tuned rule 942100 on the broker portal (FP reduced 80%)', level: 'L2', status: 'done', rollback: true }
    ],

    thirdParties: [
      tp('tp-paycore', 'PayCore Processing', 'Card & payments processing', 'critical', 'NL', 82, true, { dataShared: 'Card transactions', products: ['FileBridge MFT 9.1', 'SWIFT gateway'], exitPlan: true }),
      tp('tp-atlas', 'Atlas Payroll Services', 'Payroll outsourcing', 'critical', 'FR', 64, true, { dataShared: 'Payroll & HR data of 38k staff', products: ['FileBridge MFT 8.7'], exitPlan: false }),
      tp('tp-claimsone', 'ClaimsOne', 'Insurance claims SaaS', 'critical', 'IE', 77, true, { dataShared: 'Claims & health data', products: ['FileBridge MFT 9.0'], exitPlan: false }),
      tp('tp-ledger', 'LedgerLine', 'Core banking software', 'critical', 'DE', 88, false, { dataShared: 'Accounts & balances', products: ['LedgerLine Core'], exitPlan: false }),
      tp('tp-nimbus', 'Nimbus Cloud', 'IaaS hosting', 'critical', 'FR', 91, false, { dataShared: 'Hosted workloads', products: ['Nimbus Compute'], exitPlan: true }),
      tp('tp-swiftnet', 'SwiftNet Bureau', 'SWIFT service bureau', 'critical', 'BE', 86, false, { dataShared: 'Payment messages', products: ['Alliance Lite'], exitPlan: false }),
      tp('tp-medassist', 'MedAssist', 'Health claims assistance', 'high', 'FR', 71, true, { dataShared: 'Health data', products: ['FileBridge MFT 9.1'] }),
      tp('tp-kyc', 'VeriKYC', 'Identity verification', 'high', 'ES', 79, true, { dataShared: 'ID documents', products: ['FileBridge MFT 9.1'] }),
      tp('tp-docusafe', 'DocuSafe Archiving', 'Legal archiving', 'high', 'FR', 73, true, { dataShared: 'Contracts & statements', products: ['FileBridge MFT 8.9'] }),
      tp('tp-insight', 'InsightBI', 'Analytics outsourcing', 'high', 'PT', 69, true, { dataShared: 'Pseudonymised client data', products: ['FileBridge MFT 9.0'] }),
      tp('tp-actuary', 'ActuaRisk', 'Actuarial modelling', 'high', 'UK', 80, true, { dataShared: 'Policy portfolios', products: ['FileBridge MFT 9.1'] }),
      tp('tp-broker', 'BrokerLink', 'Insurance broker platform', 'high', 'IT', 75, true, { dataShared: 'Policyholder data', products: ['FileBridge MFT 9.1'] }),
      tp('tp-callwave', 'CallWave', 'Contact centre', 'high', 'MA', 72, false, { dataShared: 'Client contact data', products: ['CallWave CX'] }),
      tp('tp-hrcloud', 'PeopleCloud', 'HR information system', 'high', 'IE', 84, false, { dataShared: 'HR records', products: ['PeopleCloud'] }),
      tp('tp-printhub', 'PrintHub', 'Statement printing', 'medium', 'FR', 66, true, { dataShared: 'Client statements', products: ['FileBridge MFT 8.7'] }),
      tp('tp-fleet', 'FleetGo Leasing', 'Vehicle leasing', 'medium', 'FR', 70, true, { dataShared: 'Staff data', products: ['FileBridge MFT 9.0'] }),
      tp('tp-lexis', 'LexAdvisors', 'External legal counsel', 'medium', 'FR', 58, true, { dataShared: 'Litigation files', products: ['FileBridge MFT 9.1'] }),
      tp('tp-taxpro', 'TaxPro Reporting', 'Tax reporting', 'medium', 'LU', 76, true, { dataShared: 'Client tax data', products: ['FileBridge MFT 9.1'] }),
      tp('tp-mailo', 'Mailo', 'Marketing email', 'medium', 'FR', 81, false, { dataShared: 'Contact emails', products: ['Mailo Cloud'] }),
      tp('tp-shred', 'ShredSecure', 'Secure destruction', 'low', 'FR', 74, true, { dataShared: 'None (physical)', products: ['FileBridge MFT 8.9'] })
    ],

    comms: [
      { id: 'M-401', ts: 'Mon 17:30', party: 'tp-lexis', channel: 'Supplier portal', subject: 'Leaked credentials found on a paste site', status: 'answered', author: 'ag-grc-tprm', validator: 'p-marc', body: 'Dear LexAdvisors security team, ...' },
      { id: 'M-398', ts: 'Mon 10:00', party: 'bu-retail', channel: 'Business review', subject: 'Monthly cyber risk review: Retail Banking', status: 'sent', author: 'ag-grc-controls', validator: 'p-lucas', body: '' }
    ],

    businessUnits: [
      { id: 'bu-retail', name: 'Retail Banking', biso: 'p-lucas', riskScore: 58, trend: [61, 60, 60, 59, 58, 58], topRisks: ['Account takeover', 'Mobile app fraud'], openRequests: 4, apps: 412 },
      { id: 'bu-pay', name: 'Payments & Treasury', biso: 'p-lucas', riskScore: 66, trend: [70, 69, 67, 67, 66, 66], topRisks: ['Payment fraud', 'SWIFT chain'], openRequests: 3, apps: 96 },
      { id: 'bu-cib', name: 'Corporate & Investment', biso: 'p-lucas', riskScore: 61, trend: [64, 63, 63, 62, 61, 61], topRisks: ['Insider trading data', 'Trade finance access'], openRequests: 2, apps: 230 },
      { id: 'bu-ins', name: 'Insurance', biso: 'p-lucas', riskScore: 63, trend: [66, 65, 64, 64, 63, 63], topRisks: ['Health data leak', 'Broker channel'], openRequests: 5, apps: 318 },
      { id: 'bu-am', name: 'Asset Management', biso: 'p-lucas', riskScore: 55, trend: [57, 57, 56, 56, 55, 55], topRisks: ['Market data integrity'], openRequests: 1, apps: 140 },
      { id: 'bu-it', name: 'Group IT & Operations', biso: 'p-lucas', riskScore: 64, trend: [69, 68, 66, 65, 64, 64], topRisks: ['Legacy exposure', 'Admin accounts'], openRequests: 6, apps: 954 }
    ],

    regulatory: [
      { id: 'R-DORA-ROI', framework: 'DORA', regulator: 'Supervisor', item: 'Register of information on ICT third parties (Art. 28)', due: '30 Nov 2026', status: 'on-track', owner: 'p-amira', collected: 1182, total: 1240 },
      { id: 'R-DORA-TLPT', framework: 'DORA', regulator: 'Supervisor', item: 'Threat-led penetration test, 2026 cycle', due: '15 Dec 2026', status: 'at-risk', owner: 'p-sam', collected: 3, total: 5 },
      { id: 'R-NIS2', framework: 'NIS2', regulator: 'National cyber agency', item: 'Annual self-assessment of security measures', due: '31 Jan 2027', status: 'on-track', owner: 'p-amira', collected: 312, total: 380 },
      { id: 'R-AIACT', framework: 'AI Act', regulator: 'AI office', item: 'Inventory and risk classification of AI systems (incl. cyber agents)', due: '2 Aug 2027', status: 'on-track', owner: 'p-jonas', collected: 41, total: 64 },
      { id: 'R-GDPR', framework: 'GDPR', regulator: 'Data protection authority', item: 'Records of processing: annual review', due: '31 Dec 2026', status: 'on-track', owner: 'p-sara', collected: 220, total: 260 }
    ],

    detections: [
      { id: 'D-412', name: 'Impossible travel on privileged identity', platform: 'SIEM', author: 'ag-soc-detect', status: 'live', backtest: '30 d · 2 TP · 0 FP', mitre: ['T1078'], fpRate: 0.4 },
      { id: 'D-409', name: 'Mailbox forwarding rule to external domain', platform: 'SIEM', author: 'ag-soc-detect', status: 'live', backtest: '30 d · 5 TP · 1 FP', mitre: ['T1114.003'], fpRate: 1.2 },
      { id: 'D-401', name: 'LSASS access by unsigned process', platform: 'EDR', author: 'p-chloe', status: 'live', backtest: '30 d · 0 TP · 0 FP', mitre: ['T1003.001'], fpRate: 0.1 },
      { id: 'D-397', name: 'Mass download from file share by one user', platform: 'SIEM', author: 'ag-soc-detect', status: 'live', backtest: '30 d · 3 TP · 4 FP', mitre: ['T1530'], fpRate: 2.8 }
    ],

    wafRules: [
      { id: 'W-118', name: 'Broker portal · rule 942100 tuned', app: 'Broker portal', mode: 'block', status: 'live', fp: '0.02%', author: 'ag-as-waf' },
      { id: 'W-112', name: 'Mobile API · credential stuffing rate limit', app: 'Mobile banking API', mode: 'block', status: 'live', fp: '0.00%', author: 'ag-as-waf' }
    ],

    forensics: [],

    backlog: [
      { id: 'B-311', title: 'Connector: OT asset inventory into the graph', domain: 'data', type: 'connector', from: 'run', priority: 'high', status: 'in-progress', effort: 'M' },
      { id: 'B-309', title: 'Agent: automate supplier exit-plan reviews', domain: 'grc', type: 'feature', from: 'engage', priority: 'medium', status: 'new', effort: 'L' },
      { id: 'B-305', title: 'Lower Code Review Agent false positives on Java', domain: 'appsec', type: 'fix', from: 'run', priority: 'medium', status: 'in-progress', effort: 'S' },
      { id: 'B-302', title: 'Eval suite: payment fraud scenarios for IAM agents', domain: 'iam', type: 'eval', from: 'trust', priority: 'high', status: 'new', effort: 'M' },
      { id: 'B-298', title: 'Board report generator: quarterly cyber dashboard', domain: 'grc', type: 'feature', from: 'ciso', priority: 'low', status: 'done', effort: 'S' }
    ],

    releases: [
      { id: 'REL-77', agent: 'ag-as-code', version: '3.1.0', stage: 'eval', status: 'in-progress', note: 'Java rules rework (B-305)', evals: 94.2 },
      { id: 'REL-76', agent: 'ag-iam-review', version: '1.6.0', stage: 'canary', status: 'in-progress', note: 'Toxic combination detection', evals: 96.1 },
      { id: 'REL-74', agent: 'ag-cti-analyst', version: '2.1.0', stage: 'prod', status: 'done', note: 'Graph-aware exposure scoring', evals: 95.4 }
    ],

    evals: [
      { id: 'E-1', agent: 'ag-soc-triage', suite: 'Alert triage gold set (2,000 cases)', score: 96.8, prev: 96.5, status: 'pass', date: 'Mon' },
      { id: 'E-2', agent: 'ag-iam-resp', suite: 'Identity compromise playbooks', score: 97.2, prev: 97.0, status: 'pass', date: 'Mon' },
      { id: 'E-3', agent: 'ag-grc-tprm', suite: 'Questionnaire analysis', score: 95.2, prev: 94.0, status: 'pass', date: 'Sun' },
      { id: 'E-4', agent: 'ag-as-code', suite: 'Secure code review (OWASP set)', score: 92.8, prev: 93.4, status: 'warn', date: 'Sun' },
      { id: 'E-5', agent: 'ag-soc-detect', suite: 'Detection quality & noise', score: 93.9, prev: 93.1, status: 'pass', date: 'Sat' },
      { id: 'E-6', agent: 'ag-cti-analyst', suite: 'Exposure reasoning', score: 94.1, prev: 93.8, status: 'pass', date: 'Sat' }
    ],

    deviations: [
      { id: 'DV-31', agent: 'ag-as-code', signal: 'Review time per PR +40% after model update', metric: 'Latency', baseline: '38 s', observed: '53 s', status: 'closed', detected: 'Thu' }
    ],

    redteam: [
      { id: 'RT-58', campaign: 'Prompt injection in supplier answers', target: 'platform', technique: 'Indirect prompt injection', result: 'blocked_', date: 'Last week' },
      { id: 'RT-57', campaign: 'Tool abuse: make the WAF agent disable a rule', target: 'platform', technique: 'Excessive agency', result: 'blocked_', date: 'Last week' },
      { id: 'RT-55', campaign: 'Ransomware group emulation (FIN-style)', target: 'IS', technique: 'Adversary emulation', result: 'detected', date: 'Sep 2026' },
      { id: 'RT-52', campaign: 'Data exfiltration through agent memory', target: 'platform', technique: 'Memory poisoning', result: 'detected', date: 'Sep 2026' }
    ]
  };
})();
