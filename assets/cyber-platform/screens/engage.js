/* Cyber AI Platform demo: Engage console (Head of Engage persona).
   Engage speaks for cyber outside the CISO organisation: business units,
   third parties, regulators, crisis stakeholders and staff. The core idea is
   a stakeholder memory (Party 360): everything the platform knows about a
   party, pulled from the security graph and the data lake, with agents
   drafting every outgoing message and Engage validating it (L1). */
(function () {
  'use strict';
  const CP = window.CP;
  const esc = CP.esc;
  const ui = CP.ui;
  const I = CP.icon;

  CP.css('engage', `
.eg-split{display:grid;grid-template-columns:minmax(0,1fr) 470px;gap:18px;align-items:start}
.eg-panel{scroll-margin-top:118px;position:sticky;top:120px;max-height:calc(100vh - 136px);overflow:auto;background:#fff;border:1px solid var(--line);border-top:3px solid var(--indigo)}
.eg-ph{padding:16px 18px 14px;background:var(--dark);color:#fff;position:sticky;top:0;z-index:2}
.eg-ph .eg-kind{font-size:10.5px;letter-spacing:1.4px;text-transform:uppercase;color:#9d8fc4;font-weight:700;display:flex;align-items:center;gap:6px}
.eg-ph h2{margin:6px 0 4px;font-size:19px;color:#fff}
.eg-ph .eg-sub{font-size:12.5px;color:#cfc6ea}
.eg-ph .eg-tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
.eg-ph .eg-btns{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}
.eg-ph .eg-close{position:absolute;top:10px;right:10px}
.eg-src{display:flex;gap:6px;flex-wrap:wrap;align-items:center;padding:9px 18px;background:#f4f1fd;border-bottom:1px solid var(--line);font-size:11.5px;color:var(--muted)}
.eg-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;padding:2px 7px;border:1px solid #d9d1f3;background:#fff;color:#4a3a7a;white-space:nowrap}
.eg-sec{padding:14px 18px;border-bottom:1px solid var(--line-2)}
.eg-sec:last-child{border-bottom:0}
.eg-sec h4{font-size:10.5px;text-transform:uppercase;letter-spacing:1.3px;color:var(--indigo);margin:0 0 9px;display:flex;align-items:center;justify-content:space-between;gap:8px}
.eg-sec h4 small{font-size:11px;letter-spacing:0;text-transform:none;color:var(--muted);font-weight:500}
.eg-sec .kv{font-size:12.5px;gap:5px 14px}
.eg-alert{display:flex;gap:8px;align-items:flex-start;font-size:12.5px;line-height:1.5;padding:8px 10px;border-left:3px solid var(--amber);background:#fff8ea;margin-bottom:6px}
.eg-alert.error{border-color:var(--red);background:#fff1f3}
.eg-alert.ok{border-color:var(--green-ink);background:#effdf5}
.eg-alert.info{border-color:var(--indigo);background:#f3f0fd}
.eg-alert svg{margin-top:2px}
.eg-qa{display:grid;grid-template-columns:22px 1fr;gap:3px 8px;font-size:12.5px;padding:7px 0;border-bottom:1px dashed var(--line-2)}
.eg-qa:last-child{border-bottom:0}
.eg-qa .n{font-family:var(--mono);font-size:11px;color:var(--muted);padding-top:1px}
.eg-qa .q{color:var(--muted)}
.eg-qa .a{font-weight:600}
.eg-qa .a.bad{color:var(--red-ink)}
.eg-qa .a.pend{color:var(--muted);font-weight:500;font-style:italic}
.eg-tl{display:grid}
.eg-tl-i{display:grid;grid-template-columns:78px 18px 1fr;gap:8px;padding:7px 0;font-size:12.5px;line-height:1.45;border-bottom:1px dashed var(--line-2);align-items:start}
.eg-tl-i:last-child{border-bottom:0}
.eg-tl-i .d{font-family:var(--mono);font-size:11px;color:var(--muted);padding-top:1px}
.eg-tl-i .ic{color:var(--indigo);padding-top:1px}
.eg-tl-i.new{animation:newrow 2.4s}
.eg-tl-i button.linkish{all:unset;cursor:pointer;color:var(--indigo);font-weight:600}
.eg-tl-i button.linkish:hover{text-decoration:underline}
.eg-tl-i button.linkish:focus-visible{outline:2px solid #9173fa}
.eg-cm{display:grid;grid-template-columns:1fr auto;gap:2px 10px;padding:7px 0;border-bottom:1px dashed var(--line-2);font-size:12.5px}
.eg-cm:last-child{border-bottom:0}
.eg-cm small{color:var(--muted);font-size:11.5px}
.eg-campaign{background:var(--dark);color:#fff;padding:16px 20px;border-top:3px solid var(--green);margin-bottom:18px}
.eg-campaign.calm{border-top-color:#9173fa}
.eg-campaign .eg-c-top{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.eg-campaign .eg-c-title{font-weight:650;font-size:16px}
.eg-campaign .eg-c-sub{font-size:12.5px;color:#cfc6ea;margin-top:3px}
.eg-campaign .eg-c-counts{display:flex;gap:6px;margin-left:auto;flex-wrap:wrap}
.eg-cnt{background:#ffffff14;padding:6px 10px;min-width:74px;text-align:center}
.eg-cnt b{display:block;font-size:20px;line-height:1.1;font-variant-numeric:tabular-nums}
.eg-cnt span{font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#cfc6ea;font-weight:700}
.eg-cnt.red{background:#d8412f}.eg-cnt.red span{color:#ffe1e5}
.eg-cnt.amber{background:#ffb648;color:#3d2600}.eg-cnt.amber span{color:#3d2600}
.eg-cnt.green{background:var(--green);color:#10291b}.eg-cnt.green span{color:#10291b}
.eg-bar{display:flex;height:10px;margin-top:14px;background:#ffffff1f}
.eg-bar span{display:block;height:100%}
.eg-c-foot{display:flex;gap:14px;align-items:center;margin-top:10px;font-size:12px;color:#cfc6ea;flex-wrap:wrap}
.eg-c-foot .eg-leg{display:flex;gap:5px;align-items:center}
.eg-c-foot .eg-leg i{width:9px;height:9px;display:inline-block}
.eg-filters{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px}
.eg-filters select,.eg-filters input{border:1px solid var(--line);background:#fff;padding:7px 9px;font-size:13px;min-height:34px}
.eg-filters input{min-width:200px}
.eg-filters label{font-size:11.5px;color:var(--muted);display:flex;flex-direction:column;gap:3px}
.eg-name b{display:block;font-weight:600}
.eg-name small{color:var(--muted);font-size:12px}
.eg-score{display:flex;align-items:center;gap:8px;min-width:96px}
.eg-score b{font-variant-numeric:tabular-nums;width:22px}
.eg-score .progress{flex:1;min-width:40px}
.eg-score .dl{font-size:11px;color:var(--red-ink);font-weight:650}
.eg-m5{grid-template-columns:repeat(5,minmax(0,1fr))}
.eg-dec{display:grid;gap:12px}
.eg-dec-empty{display:flex;align-items:center;gap:10px;padding:12px 14px;border:1px dashed #d9d3e4;background:#fbfafc;font-size:13px;color:var(--muted)}
.eg-attn{display:grid;gap:6px}
.eg-attn button{justify-content:space-between;width:100%;text-align:left;font-weight:500}
.eg-attn button span.l{display:flex;flex-direction:column;gap:2px}
.eg-attn button small{color:var(--muted);font-weight:400;font-size:12px}
.eg-bu-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.eg-bu{all:unset;box-sizing:border-box;cursor:pointer;background:#fff;border:1px solid var(--line);padding:16px;display:flex;flex-direction:column;gap:10px;min-width:0}
.eg-bu:hover{border-color:var(--indigo)}
.eg-bu:focus-visible{outline:3px solid #9173fa}
.eg-bu.sel{border-color:var(--indigo);box-shadow:inset 0 3px var(--indigo);background:#fbfaff}
.eg-bu .eg-bu-top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}
.eg-bu h3{margin:0;font-size:15px}
.eg-bu .eg-bu-score{font-size:26px;font-weight:650;color:var(--indigo);letter-spacing:-1px;line-height:1}
.eg-bu .eg-bu-score small{font-size:11px;color:var(--muted);letter-spacing:0;font-weight:500;display:block;text-align:right}
.eg-bu .eg-bu-meta{display:flex;gap:12px;font-size:12px;color:var(--muted);flex-wrap:wrap}
.eg-bu .eg-bu-meta b{color:var(--ink)}
.eg-req{border:1px solid var(--line);padding:12px 14px;display:grid;gap:6px;background:#fff}
.eg-req+.eg-req{margin-top:8px}
.eg-req .eg-req-top{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.eg-req .eg-req-t{font-weight:600;font-size:13.5px}
.eg-req .eg-req-ai{font-size:12.5px;background:#f4f1fd;padding:7px 9px;line-height:1.5}
.eg-req .eg-req-act{display:flex;gap:6px;flex-wrap:wrap}
.eg-tp{font-size:13.5px;line-height:1.55;margin:0;padding-left:20px}
.eg-tp li{margin-bottom:6px}
.eg-countdown{background:#2a0f1a;color:#fff;padding:16px 20px;border-top:3px solid var(--red);margin-bottom:18px;display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:22px;align-items:center}
.eg-countdown .big{font-size:34px;font-weight:700;letter-spacing:-1px;font-variant-numeric:tabular-nums;line-height:1}
.eg-countdown .lbl{font-size:10.5px;letter-spacing:1.3px;text-transform:uppercase;color:#f3b8c2;font-weight:700}
.eg-countdown .t{font-weight:650;font-size:15px}
.eg-countdown .s{font-size:12.5px;color:#f1cdd4;margin-top:3px}
.eg-countdown .progress{background:#ffffff26;margin-top:10px}
.eg-countdown .progress span{background:#ff7a8a}
.eg-ev{display:grid;grid-template-columns:28px minmax(0,1fr) 120px 150px;gap:8px;align-items:center;font-size:12.5px;padding:7px 0;border-bottom:1px solid var(--line-2)}
.eg-ev .n{font-family:var(--mono);color:var(--muted);font-size:11px}
.eg-ev .src{color:var(--muted);font-size:11.5px}
.eg-ev-group{font-size:10.5px;text-transform:uppercase;letter-spacing:1.2px;color:var(--indigo);font-weight:700;padding:12px 0 4px;border-bottom:1px solid var(--line)}
.eg-stk{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.eg-stk-i{border:1px solid var(--line);padding:12px;background:#fff;display:flex;flex-direction:column;gap:6px;min-width:0;border-top:3px solid #c9c3d8}
.eg-stk-i.done{border-top-color:var(--green-ink)}
.eg-stk-i.todo{border-top-color:var(--amber)}
.eg-stk-i.wait{border-top-color:var(--indigo)}
.eg-stk-i .h{display:flex;align-items:center;gap:7px;font-weight:650;font-size:13.5px}
.eg-stk-i .d{font-size:12px;color:var(--muted);line-height:1.45;flex:1}
.eg-level{display:flex;gap:4px;margin-top:8px}
.eg-level i{flex:1;height:8px;background:#eeebf4}
.eg-level i.on{background:var(--amber)}
.eg-level i.on.l3{background:var(--red)}
.eg-brief h3{font-size:12px;text-transform:uppercase;letter-spacing:1.2px;color:var(--indigo);margin:18px 0 8px}
.eg-brief h3:first-child{margin-top:0}
.eg-brief p,.eg-brief li{font-size:13.5px;line-height:1.6}
.eg-brief ol,.eg-brief ul{margin:0;padding-left:20px}
.eg-brief .eg-meet{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;background:#f7f6fb;border:1px solid var(--line);padding:12px 14px;font-size:12.5px}
.eg-brief .eg-meet b{display:block;font-size:10.5px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:3px}
.eg-brief .eg-ai{display:flex;gap:8px;align-items:center;font-size:12px;color:var(--muted);margin-top:16px;padding-top:12px;border-top:1px solid var(--line)}
.eg-textarea{width:100%;min-height:260px;border:1px solid var(--line);padding:12px;font-family:var(--mono);font-size:12.5px;line-height:1.6;resize:vertical}
.eg-mail{border:1px solid var(--line)}
.eg-mail .eg-mh{background:#f7f6fa;padding:10px 14px;border-bottom:1px solid var(--line);display:grid;gap:3px;font-size:12.5px}
.eg-mail .eg-mh span{color:var(--muted);display:inline-block;width:64px}
.eg-mail .eg-mb{padding:14px;white-space:pre-wrap;font-size:13px;line-height:1.6}
.eg-rule{display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-bottom:1px dashed var(--line-2);font-size:12.5px;line-height:1.5}
.eg-rule:last-child{border-bottom:0}
.eg-hs{border:1px solid var(--line);padding:12px 14px;background:#fff}
.eg-hs+.eg-hs{margin-top:8px}
.eg-hs .eg-hs-t{font-weight:600;font-size:13.5px}
.eg-hs .eg-hs-x{font-size:12.5px;color:#3b3550;line-height:1.5;margin:6px 0 8px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
@media(max-width:1280px){.eg-split{grid-template-columns:1fr}.eg-panel{position:static;max-height:none}.eg-m5{grid-template-columns:repeat(3,minmax(0,1fr))}.eg-stk{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:1100px){.eg-bu-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.eg-m5{grid-template-columns:repeat(2,minmax(0,1fr))}.eg-countdown{grid-template-columns:1fr}.eg-brief .eg-meet{grid-template-columns:1fr}}
@media(max-width:760px){.eg-bu-grid,.eg-stk{grid-template-columns:1fr}.eg-ev{grid-template-columns:24px minmax(0,1fr) auto}.eg-ev .src{display:none}
.eg-m5,.eg .metrics{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px}.eg .metric{padding:12px}.eg .metric .value{font-size:24px}.eg .metric .spark{display:none}
.eg .page-head{flex-direction:column;align-items:stretch}.eg .page-head .actions select{max-width:none!important;width:100%}.eg h1{font-size:24px}
.eg .card{padding:14px}.eg button.small{min-height:40px}.eg button{min-height:42px}
.eg-filters label{flex:1 1 140px}.eg-filters input,.eg-filters select{width:100%;min-width:0}
.eg-campaign{padding:14px}.eg-campaign .eg-c-counts{margin-left:0;width:100%}.eg-cnt{flex:1;min-width:56px;padding:6px 4px}
.eg-countdown{padding:14px}.eg-countdown .big{font-size:28px}
.eg-panel{border-left:1px solid var(--line);border-right:1px solid var(--line)}.eg-ph{position:static}.eg-ph h2{padding-right:44px}
.eg-tl-i{grid-template-columns:64px 16px minmax(0,1fr)}
.eg-clk{grid-template-columns:110px minmax(0,1fr) 44px!important}
.eg-mail .eg-mh span{width:auto;margin-right:6px}.eg-textarea{min-height:200px}
.eg .grid{gap:12px}.eg .stack{gap:12px}
.eg .table-wrap table.t{min-width:640px}.eg .eg-panel .table-wrap table.t{min-width:420px}.eg-cnt span{font-size:8.5px;letter-spacing:.3px}.eg-ev{grid-template-columns:24px minmax(0,1fr) auto}}
`);

  /* ------------------------------------------------------------------
     Static memory (console-only). Coherent with data.js and scenarios.js.
     ------------------------------------------------------------------ */
  const CAMPAIGN = 'CVE-2026-41877';
  const FB = ['tp-paycore', 'tp-atlas', 'tp-claimsone', 'tp-medassist', 'tp-kyc', 'tp-docusafe', 'tp-insight', 'tp-actuary', 'tp-broker', 'tp-printhub', 'tp-fleet', 'tp-lexis', 'tp-taxpro', 'tp-shred'];
  /* Messages addressed to several parties at once. */
  const COMM_PARTIES = {
    'M-410': FB,
    'M-420': ['tp-ledger', 'tp-swiftnet', 'tp-nimbus', 'tp-callwave', 'tp-hrcloud', 'tp-claimsone', 'tp-atlas', 'tp-insight', 'tp-broker', 'tp-actuary', 'tp-kyc', 'tp-mailo']
  };
  /* Cases that concern a party (security graph relations). */
  const CASE_PARTIES = {
    'C-2301': FB.concat(['bu-pay', 'bu-it', 'bu-ins']),
    'C-2302': ['bu-pay', 'reg-dpa'],
    'C-2279': ['tp-lexis'],
    'C-2284': ['bu-cib', 'bu-pay'],
    'C-2291': ['bu-it']
  };
  /* Outgoing messages held by a gate of the orchestrator. */
  const GATED = { 'M-410': 'AP-CTI-TPRM' };

  const REGULATORS = [
    { id: 'reg-sup', name: 'Banking supervisor', regName: 'Supervisor', full: 'National competent authority · DORA and prudential supervision', fw: 'DORA', contact: 'Head of ICT risk inspection', since: '2019', rating: 'Constructive, demanding on third-party risk' },
    { id: 'reg-ncsa', name: 'National cyber agency', regName: 'National cyber agency', full: 'NIS2 competent authority · essential entities, finance sector', fw: 'NIS2', contact: 'NIS2 sector lead (finance)', since: '2024', rating: 'Good, cooperative on threat sharing' },
    { id: 'reg-dpa', name: 'Data protection authority', regName: 'Data protection authority', full: 'GDPR supervisory authority · lead authority for the group', fw: 'GDPR', contact: 'Case officer · breach notification desk', since: '2018', rating: 'Neutral, 1 closed complaint in 2025' },
    { id: 'reg-ai', name: 'AI office', regName: 'AI office', full: 'AI Act market surveillance · high-risk AI systems', fw: 'AI Act', contact: 'Unit for financial services AI, generic mailbox', since: '2026', rating: 'New relationship, information requests only' }
  ];
  const REG_BY_NAME = {}; REGULATORS.forEach((r) => { REG_BY_NAME[r.regName] = r.id; });

  /* Per-party memory: what the data lake already holds about the relationship. */
  const MEM = {
    'tp-atlas': {
      contact: 'Supplier CISO · Atlas Payroll Services', owner: 'p-marc', bizOwner: 'Group HR (shared services, Group IT & Operations)',
      contract: { ref: 'CTR-2019-0412', value: '€2.4 M / year', renewal: 'Jun 2027', clauses: 'Audit right yes · 24 h incident notice no · exit assistance 6 months' },
      assets: ['mft-prd-01 · SFTP flow "payroll-out" (monthly, 38k records)', 'HR data hub · API read-only', 'Payroll approval workflow (Group HR)'],
      graph: { edges: 46, docs: 312 },
      meeting: { title: 'Quarterly service review · Atlas Payroll', when: 'Thu 15 Oct · 10:00', where: 'Video call + Atlas Lyon office', attendees: 'Atlas CISO, Group HR payroll lead, Third-party risk lead, Business CISO' },
      history: [
        { d: '24 Sep 2026', ic: 'users', t: 'Quarterly service review: payroll run SLA 99.7%, security score stable at 64.' },
        { d: '02 Jul 2026', ic: 'file', t: 'Annual DORA questionnaire answered: 11 findings, 3 open (MFA on admin portal, log retention, exit plan).' },
        { d: '15 Mar 2026', ic: 'shield', t: 'On-site audit by Novalys TPRM: backup restore test witnessed, OK.' },
        { d: '09 Jan 2026', ic: 'alert', t: 'Minor incident: payroll file delayed 6 h (storage failure). Notified at T+5 h, contract says 24 h.' }
      ],
      commitments: [
        { t: 'Enforce MFA on the payroll admin portal', who: 'Atlas Payroll', due: '30 Sep 2026', st: 'late' },
        { t: 'Extend log retention to 12 months', who: 'Atlas Payroll', due: '31 Dec 2026', st: 'open' },
        { t: 'Share the new DR site test report', who: 'Atlas Payroll', due: '15 Oct 2026', st: 'open' }
      ],
      questions: ['When will the exit plan be documented and tested (open since the 2025 audit)?']
    },
    'tp-paycore': {
      contact: 'Supplier head of security · PayCore Processing', owner: 'p-marc', bizOwner: 'Payments & Treasury',
      contract: { ref: 'CTR-2017-0088', value: '€11.8 M / year', renewal: 'Dec 2027', clauses: 'Audit right yes · 4 h incident notice · tested exit plan (2025)' },
      assets: ['mft-prd-01 · card clearing files (hourly)', 'Payment messaging gateway', 'Card authorisation API'],
      graph: { edges: 88, docs: 641 },
      meeting: { title: 'Strategic supplier committee · PayCore', when: 'Tue 20 Oct · 14:00', where: 'Amsterdam + video call', attendees: 'PayCore head of security, Head of Payments, Business CISO, Third-party risk lead' },
      history: [
        { d: '30 Sep 2026', ic: 'users', t: 'Strategic supplier committee: PCI DSS 4.0 report shared, 0 open findings.' },
        { d: '12 Jun 2026', ic: 'shield', t: 'Joint resilience test (card clearing failover): RTO 38 min against 2 h target.' },
        { d: '20 Feb 2026', ic: 'file', t: 'DORA questionnaire answered, score 82 (+3).' }
      ],
      commitments: [{ t: 'Share SOC 2 Type II report 2026', who: 'PayCore', due: '31 Oct 2026', st: 'open' }],
      questions: []
    },
    'tp-claimsone': {
      contact: 'Supplier CISO · ClaimsOne', owner: 'p-marc', bizOwner: 'Insurance',
      contract: { ref: 'CTR-2021-0311', value: '€3.1 M / year', renewal: 'Mar 2027', clauses: 'Audit right yes · 24 h incident notice · no exit plan' },
      assets: ['mft-prd-01 · claims documents (daily)', 'Health data vault (pseudonymised)'],
      graph: { edges: 54, docs: 388 },
      meeting: { title: 'Service review · ClaimsOne', when: 'Mon 19 Oct · 11:00', where: 'Video call', attendees: 'ClaimsOne CISO, Insurance operations lead, Third-party risk lead' },
      history: [
        { d: '18 Sep 2026', ic: 'users', t: 'Service review: health data processing addendum signed (GDPR Art. 28).' },
        { d: '04 May 2026', ic: 'file', t: 'DORA questionnaire answered, score 77; exit plan missing.' }
      ],
      commitments: [{ t: 'Draft an exit plan for the claims platform', who: 'Insurance + ClaimsOne', due: '31 Dec 2026', st: 'open' }],
      questions: []
    },
    'tp-lexis': {
      contact: 'Managing partner · LexAdvisors', owner: 'p-marc', bizOwner: 'Group Legal',
      contract: { ref: 'CTR-2020-0190', value: '€0.9 M / year', renewal: 'Jan 2027', clauses: 'Confidentiality yes · no security annex' },
      assets: ['mft-prd-01 · litigation files (weekly)'],
      graph: { edges: 19, docs: 96 },
      meeting: { title: 'Security follow-up · LexAdvisors', when: 'Wed 14 Oct · 16:00', where: 'Video call', attendees: 'LexAdvisors managing partner, Group Legal, Third-party risk lead' },
      history: [
        { d: 'Fri 9 Oct', ic: 'alert', t: 'External rating down 12 points; leaked credentials found on a paste site (case C-2279).' },
        { d: '14 Apr 2026', ic: 'file', t: 'DORA questionnaire answered late (21 days), score 70.' }
      ],
      commitments: [{ t: 'Reset leaked accounts and enforce MFA on the extranet', who: 'LexAdvisors', due: 'Fri 16 Oct', st: 'open' }],
      questions: ['Which Novalys files were stored on the extranet accounts that leaked?']
    },
    'tp-ledger': {
      contact: 'Supplier CISO · LedgerLine', owner: 'p-marc', bizOwner: 'Retail Banking + Group IT',
      contract: { ref: 'CTR-2015-0021', value: '€14.6 M / year', renewal: 'Dec 2028', clauses: 'Audit right yes · 4 h notice · exit assistance 18 months, plan untested' },
      assets: ['Core banking cluster (on premises)', 'Batch interfaces to 212 applications'],
      graph: { edges: 214, docs: 902 },
      meeting: { title: 'Executive steering · LedgerLine', when: 'Thu 22 Oct · 09:30', where: 'Frankfurt', attendees: 'LedgerLine CISO, Group CIO, Business CISO, Head of Engage' },
      history: [{ d: '10 Sep 2026', ic: 'users', t: 'Executive steering: release 26.3 security fixes, DORA concentration risk discussed.' }],
      commitments: [{ t: 'Plan an exit-plan desk test (DORA Art. 28.8)', who: 'Group IT + LedgerLine', due: 'Q1 2027', st: 'open' }],
      questions: []
    }
  };
  const MEM_BU = {
    'bu-retail': { owner: 'Head of Retail Banking', committee: 'Retail risk committee · Thu 22 Oct', suppliers: ['tp-ledger', 'tp-kyc', 'tp-callwave', 'tp-printhub', 'tp-mailo'],
      requests: [
        { id: 'RQ-118', type: 'SaaS onboarding', t: 'Onboard "SmartBudget" personal finance SaaS (client data, EU hosting)', from: 'Retail product team', age: '4 d', ai: 'TPRM Agent pre-assessment: medium risk. SOC 2 report valid, 3 contract clauses missing (audit right, 24 h notice, sub-processors).' },
        { id: 'RQ-121', type: 'Exception', t: 'Keep TLS 1.0 on 140 ATM gateways until March 2027', from: 'ATM operations', age: '9 d', ai: 'Controls Agent: compensating controls exist (private network, WAF). Recommend 3-month exception with monthly scan evidence.' },
        { id: 'RQ-124', type: 'New project', t: 'Voice banking pilot with an external speech provider', from: 'Digital channels', age: '2 d', ai: 'Security-by-design kick-off proposed; AI Act screening needed (biometric data).' },
        { id: 'RQ-126', type: 'Access', t: 'Give the fraud team read access to mobile telemetry', from: 'Fraud office', age: '1 d', ai: 'Access Review Agent: no toxic combination; data minimisation note required.' }
      ],
      projects: [{ n: 'Mobile app v9 · passkeys for 4.2 M clients', ph: 'Build', st: 'on-track', note: 'Threat model done, Code Review Agent on 100% of PRs' }, { n: 'Branch Wi-Fi refresh (620 branches)', ph: 'Design', st: 'at-risk', note: 'Supplier not yet assessed' }] },
    'bu-pay': { owner: 'Head of Treasury', committee: 'Payments risk committee · Wed 21 Oct', suppliers: ['tp-paycore', 'tp-swiftnet'],
      requests: [
        { id: 'RQ-119', type: 'Exception', t: 'Postpone phishing-resistant MFA for 41 Treasury operators until January', from: 'Treasury desk', age: '6 d', ai: 'Not recommended: Treasury operators approve up to €5 M. Propose number matching by end of October as an interim step.' },
        { id: 'RQ-123', type: 'SaaS onboarding', t: 'Instant payments fraud scoring SaaS (real-time, EU hosted)', from: 'Payments product', age: '3 d', ai: 'TPRM Agent: critical function (DORA). Full due diligence and exit plan required before go-live.' },
        { id: 'RQ-127', type: 'New project', t: 'Payment network security attestation 2027: scope review', from: 'Payments IT', age: '5 d', ai: 'Controls Agent pre-mapped 27 of 32 controls from existing evidence.' }
      ],
      projects: [{ n: 'Instant payments (SEPA Inst) at scale', ph: 'Build', st: 'on-track', note: 'Fraud and abuse cases reviewed with the BISO' }, { n: 'Payment hub segregation of duties', ph: 'Run', st: 'at-risk', note: 'Toxic combinations under review (C-2284)' }] },
    'bu-cib': { owner: 'Head of Corporate & Investment Banking', committee: 'CIB operational risk committee · Mon 26 Oct', suppliers: ['tp-swiftnet', 'tp-insight'],
      requests: [
        { id: 'RQ-115', type: 'Access', t: 'Trade finance role redesign (create vs approve letters of credit)', from: 'Trade finance ops', age: '12 d', ai: 'Access Review Agent: 11 users hold both rights today (C-2284). Redesign removes all of them.' },
        { id: 'RQ-125', type: 'SaaS onboarding', t: 'ESG data provider for credit analysis', from: 'Credit risk', age: '2 d', ai: 'Low risk: public data only. Fast-track onboarding proposed.' }
      ],
      projects: [{ n: 'Trading floor recording replacement', ph: 'Design', st: 'on-track', note: 'Retention and access controls defined' }] },
    'bu-ins': { owner: 'CEO Insurance', committee: 'Insurance risk committee · Tue 27 Oct', suppliers: ['tp-claimsone', 'tp-medassist', 'tp-broker', 'tp-actuary'],
      requests: [
        { id: 'RQ-112', type: 'SaaS onboarding', t: 'Telematics data platform for motor insurance', from: 'Motor product', age: '15 d', ai: 'TPRM Agent: location data, high privacy impact. DPIA required with the DPO.' },
        { id: 'RQ-116', type: 'Exception', t: 'Brokers keep password-only access to the broker portal until Q1', from: 'Broker channel', age: '10 d', ai: 'WAF rate limiting is live (W-112 pattern). Recommend exception only for brokers under 50 policies.' },
        { id: 'RQ-120', type: 'New project', t: 'Claims automation with a generative AI assistant', from: 'Claims operations', age: '7 d', ai: 'AI Act: limited risk. Prompt-injection review by Trust & Challenge required (health data).' },
        { id: 'RQ-122', type: 'Access', t: 'Actuarial team access to raw health claims for pricing', from: 'Actuarial', age: '6 d', ai: 'Data Protection Agent: pseudonymised extract sufficient; raw access not justified.' },
        { id: 'RQ-128', type: 'SaaS onboarding', t: 'E-signature for policy documents', from: 'Customer operations', age: '1 d', ai: 'Provider already assessed for Retail (score 83). Reuse assessment.' }
      ],
      projects: [{ n: 'New broker portal', ph: 'Build', st: 'on-track', note: 'Pen test booked in November' }, { n: 'Health claims data vault', ph: 'Run', st: 'on-track', note: 'Encryption keys under group HSM' }] },
    'bu-am': { owner: 'CEO Asset Management', committee: 'AM risk committee · Thu 29 Oct', suppliers: ['tp-insight'],
      requests: [{ id: 'RQ-117', type: 'SaaS onboarding', t: 'Market data terminal replacement (cloud)', from: 'Front office', age: '8 d', ai: 'Integrity of market data is a top risk: require signed feeds and an exit plan.' }],
      projects: [{ n: 'Portfolio management system upgrade', ph: 'Test', st: 'on-track', note: 'Privileged access reviewed' }] },
    'bu-it': { owner: 'Group CIO', committee: 'IT & Operations risk committee · Fri 23 Oct', suppliers: ['tp-nimbus', 'tp-atlas', 'tp-hrcloud', 'tp-docusafe', 'tp-shred', 'tp-fleet'],
      requests: [
        { id: 'RQ-110', type: 'Exception', t: 'End-of-life server OS on 38 legacy servers until June 2027', from: 'Infrastructure', age: '21 d', ai: 'VulnOps Agent: 9 are internet reachable. Exception only for the 29 internal ones, with EDR enforced.' },
        { id: 'RQ-111', type: 'New project', t: 'Move the payroll interface to an API (replace SFTP with Atlas)', from: 'HR IT', age: '18 d', ai: 'Would remove the FileBridge dependency for payroll. Recommend acceleration.' },
        { id: 'RQ-113', type: 'Access', t: 'Break-glass accounts for the cloud landing zone', from: 'Cloud team', age: '11 d', ai: 'IAM: 2 accounts, hardware keys, alerting on every use. Approve.' },
        { id: 'RQ-114', type: 'SaaS onboarding', t: 'IT asset discovery SaaS', from: 'IT operations', age: '9 d', ai: 'Feeds the security graph. Low risk, read-only connectors.' },
        { id: 'RQ-109', type: 'Exception', t: 'Disable EDR on 12 trading latency servers', from: 'Infrastructure', age: '25 d', ai: 'Not recommended. Propose the low-latency EDR profile tested by the SOC.' },
        { id: 'RQ-129', type: 'New project', t: 'Data centre exit to Nimbus Cloud (wave 3)', from: 'Infrastructure', age: '3 d', ai: 'Concentration risk on Nimbus rises to 41% of critical workloads: DORA Art. 29 assessment needed.' }
      ],
      projects: [{ n: 'Data centre exit, wave 3', ph: 'Design', st: 'at-risk', note: 'Concentration risk assessment pending' }, { n: 'Privileged access (PAM) rollout', ph: 'Run', st: 'on-track', note: '86% of admin accounts vaulted' }] }
  };
  const MEM_REG = {
    'reg-sup': {
      inspections: [
        { d: 'Mar 2025', t: 'On-site inspection: ICT outsourcing and third-party risk', r: '4 findings, 3 closed' },
        { d: 'Nov 2024', t: 'Thematic review: cyber resilience of payment systems', r: 'Satisfactory' },
        { d: 'Jun 2023', t: 'Desk review: cloud outsourcing notifications', r: '1 finding, closed' }
      ],
      commitments: [
        { t: 'Finding F-2025-03: tested exit plans for all critical ICT providers', who: 'Engage + business owners', due: '31 Dec 2026', st: 'at-risk' },
        { t: 'Quarterly update on the register of information quality', who: 'Head of Engage', due: '30 Oct 2026', st: 'open' }
      ],
      meeting: { title: 'Annual supervisory dialogue · ICT risk', when: 'Fri 6 Nov · 10:00', where: 'Supervisor premises', attendees: 'Supervisor ICT inspection head, CISO, Head of Engage, CRO' }
    },
    'reg-ncsa': {
      inspections: [{ d: 'Feb 2026', t: 'NIS2 registration and contact points', r: 'Accepted' }, { d: 'Sep 2025', t: 'Sector exercise on DDoS (finance)', r: 'Participated' }],
      commitments: [{ t: 'Send the annual NIS2 self-assessment', who: 'Head of Engage', due: '31 Jan 2027', st: 'open' }],
      meeting: { title: 'NIS2 finance sector working group', when: 'Wed 4 Nov · 14:00', where: 'Agency, Paris', attendees: 'Agency NIS2 sector lead, Head of Engage, Crisis manager' }
    },
    'reg-dpa': {
      inspections: [{ d: 'Oct 2025', t: 'Complaint on marketing consent (closed, no sanction)', r: 'Closed' }, { d: 'Mar 2024', t: 'Breach notification: misdirected statements (212 clients)', r: 'Closed, no follow-up' }],
      commitments: [{ t: 'Annual review of the records of processing', who: 'DPO', due: '31 Dec 2026', st: 'open' }],
      meeting: { title: 'DPO liaison call', when: 'Mon 19 Oct · 15:00', where: 'Phone', attendees: 'DPA case officer, DPO, Head of Engage' }
    },
    'reg-ai': {
      inspections: [{ d: 'Jul 2026', t: 'Information request: general-purpose AI use in credit scoring', r: 'Answered' }],
      commitments: [{ t: 'Inventory and classification of AI systems, incl. the 16 cyber agents', who: 'AI assurance lead', due: '2 Aug 2027', st: 'open' }],
      meeting: { title: 'AI Act readiness exchange', when: 'Thu 12 Nov · 11:00', where: 'Video call', attendees: 'AI office unit, AI assurance lead, Head of Engage' }
    }
  };

  /* Bodies of agent-drafted messages (the store only keeps the headers). */
  const BODIES = {
    'M-401': 'Dear LexAdvisors security team,\n\nOur threat intelligence found 6 credentials of your staff on a paste site dated 7 October, including two accounts with access to the extranet where Novalys litigation files are exchanged.\n\nCould you, within 48 hours:\n1. reset the affected accounts and confirm MFA is enforced on the extranet;\n2. tell us whether Novalys files were accessed since 1 October;\n3. name a contact for follow-up.\n\nThe list of accounts is available in the supplier portal (restricted).\n\nThird-Party Security, Novalys Group',
    'M-398': 'Retail Banking · monthly cyber risk review (September)\n\nRisk score 58 (down 1). Top risks: account takeover (credential stuffing blocked by W-112, 0.00% false positives) and mobile app fraud (2 new malware families targeting banking apps in the EU).\n\nDecisions needed at the next committee: SmartBudget SaaS onboarding (RQ-118) and the TLS 1.0 exception on ATM gateways (RQ-121).\n\nPrepared by the Controls & Evidence Agent, validated by the Business CISO.',
    'M-410': 'Dear security contact,\n\nA critical vulnerability in FileBridge MFT (CVE-2026-41877) is being exploited by the ransomware group COBALT LYNX against the financial sector. Our records show you use FileBridge to exchange files with Novalys.\n\n1. Which FileBridge version do you run? (we believe: {version})\n2. Is the vendor patch 9.1.4 applied? If not, when?\n3. Have you searched for the indicators attached?\n4. Have you seen any suspicious activity since 1 October?\n\nCritical suppliers: please answer within 24 hours.\n\nThird-Party Security, Novalys Group',
    'M-412': 'Dear Atlas Payroll security team,\n\nThank you for your quick answer. FileBridge 8.7 is exploitable through CVE-2026-41877 and COBALT LYNX is actively scanning for it.\n\nAs a precaution, the SFTP flow between Atlas Payroll and Novalys has been moved to a quarantine zone at 12:42: files are still received but scanned and held for manual release. This will remain until we confirm the patch.\n\nWe ask you to:\n1. install FileBridge 9.1.4 within 24 hours (by Wednesday 12:45);\n2. run the attached indicator search on your server and share the result;\n3. confirm in writing once done, so we can restore the normal flow.\n\nOur third-party risk lead will call you this afternoon to agree the plan.\n\nThird-Party Security, Novalys Group',
    'M-415': 'To: Data protection authority · breach notification desk\nNotification under Article 33 GDPR (initial notification)\n\nController: Novalys Group (lead establishment).\nDPO: Data Protection Officer, dpo@novalys.example.\n\n1. Nature of the breach: unauthorised access to a Treasury employee account after an MFA fatigue attack, on Wednesday between 02:12 and 02:14. The attacker downloaded 37 files from the "Treasury · Beneficiaries" library of the collaboration suite.\n2. Categories and approximate number: about 1,200 data subjects (payment beneficiaries, mostly corporate contacts); data: names, IBANs, bank names. No special category data.\n3. Likely consequences: risk of targeted payment fraud and phishing using the beneficiary data.\n4. Measures taken: sessions and tokens revoked at 02:14, malicious mailbox rule removed, attacker IP blocked, account suspended, 3 payments held for verification, phishing-resistant MFA being enforced for all payment approvers.\n5. Communication to data subjects: under assessment with the DPO; affected corporate clients will be contacted by their relationship managers.\n\nFurther information will be provided in phases (Art. 33(4)).',
    'M-416': 'Subject: 3 minutes: say no to the 23rd MFA push\n\nLast week, an attacker sent one of our colleagues 23 MFA notifications at 2 a.m. until one was accepted. This 3-minute module shows what happened (anonymised), why "push fatigue" works, and what to do: never approve a request you did not start, report it with one click, and switch to number matching today.\n\nAudience: 312 finance staff still using push MFA. Completion tracked per team; managers receive a summary on Friday.',
    'M-420': 'Dear provider,\n\nUnder the EU Digital Operational Resilience Act (Art. 28), Novalys keeps a register of its ICT arrangements, including the sub-contractors that support them.\n\nWe have pre-filled the sub-contracting chain we know for the services you provide. Please confirm or complete it in the supplier portal (rank 1 and rank 2 sub-contractors, country, data location) within 10 business days.\n\nThis request uses the standard template approved by Engage (standing approval SA-2026-07).\n\nThird-Party Security, Novalys Group'
  };

  /* Earlier messages kept in the memory (read-only archive, before today). */
  const ARCHIVE = [
    { id: 'M-396', ts: 'Fri 16:05', party: 'tp-paycore', channel: 'Supplier portal', subject: 'Request: SOC 2 Type II report 2026', status: 'answered', author: 'ag-grc-tprm', validator: 'p-marc', _arch: true },
    { id: 'M-394', ts: 'Fri 11:20', party: 'reg-sup', channel: 'Regulator portal', subject: 'Quarterly update: register of information quality (Q3)', status: 'sent', author: 'ag-grc-controls', validator: 'p-amira', _arch: true },
    { id: 'M-392', ts: 'Thu 15:40', party: 'tp-atlas', channel: 'Supplier portal', subject: 'Reminder: MFA on the payroll admin portal (commitment due 30 Sep)', status: 'sent', author: 'ag-grc-tprm', validator: 'p-marc', _arch: true },
    { id: 'M-390', ts: 'Thu 09:10', party: 'bu-ins', channel: 'Email', subject: 'Pre-assessment: telematics data platform (RQ-112)', status: 'answered', author: 'ag-grc-controls', validator: 'p-lucas', _arch: true },
    { id: 'M-387', ts: 'Wed 14:30', party: 'staff', partyLabel: 'Executives and assistants (186)', channel: 'Learning platform', subject: 'Spot a deepfake CFO call (L-402 reminder)', status: 'sent', author: 'ag-grc-policy', validator: 'p-leo', _arch: true },
    { id: 'M-385', ts: 'Wed 10:00', party: 'tp-claimsone', channel: 'Supplier portal', subject: 'Exit plan for the claims platform: proposed template', status: 'sent', author: 'ag-grc-tprm', validator: 'p-marc', _arch: true }
  ];
  BODIES['M-396'] = 'Dear PayCore security team,\n\nAs agreed at the strategic supplier committee of 30 September, could you share your SOC 2 Type II report for 2026 through the supplier portal by 31 October?\n\nThird-Party Security, Novalys Group';
  BODIES['M-392'] = 'Dear Atlas Payroll security team,\n\nAt the service review of 24 September you committed to enforce MFA on the payroll admin portal by 30 September. Our external scan still shows password-only access. Could you confirm the new date?\n\nThird-Party Security, Novalys Group';
  const allComms = () => CP.store.get('comms').concat(ARCHIVE.filter((a) => !CP.store.find('comms', a.id)));
  const findComm = (id) => CP.store.find('comms', id) || ARCHIVE.find((a) => a.id === id);
  const SEQ = { n: 430 };
  const now = () => (CP.clock ? CP.clock.label() : 'Tue 08:30');
  const seedTp = (id) => (CP.data.seed.thirdParties || []).find((t) => t.id === id) || {};
  const critRank = { critical: 0, high: 1, medium: 2, low: 3 };
  const scoreCls = (s) => (s < 60 ? 'red' : s < 75 ? 'amber' : 'green');
  const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973; return h; };

  /* Compact "who": avatar + role name (role names are self-explanatory). */
  const whoS = (id) => '<span class="row" style="gap:7px;display:inline-flex;white-space:nowrap">' + ui.av(id, 'sm') + '<b style="font-weight:600">' + esc(CP.actor(id).name) + '</b></span>';

  function party(id) {
    if (!id) return null;
    const t = CP.store.find('thirdParties', id); if (t) return { id, kind: 'tp', name: t.name, sub: t.service, raw: t };
    const b = CP.store.find('businessUnits', id); if (b) return { id, kind: 'bu', name: b.name, sub: 'Business unit · ' + (MEM_BU[id] ? MEM_BU[id].owner : ''), raw: b };
    const r = REGULATORS.find((x) => x.id === id); if (r) return { id, kind: 'reg', name: r.name, sub: r.full, raw: r };
    return null;
  }
  function partyLabel(m) { if (m.partyLabel) return m.partyLabel; const p = party(m.party); return p ? p.name : (m.party || ''); }
  function commsFor(id) {
    return allComms().filter((m) => m.party === id || (COMM_PARTIES[m.id] || []).indexOf(id) >= 0);
  }
  function casesFor(id) { return CP.store.get('cases').filter((c) => (CASE_PARTIES[c.id] || []).indexOf(id) >= 0); }
  function regItemsFor(regId) { return CP.store.get('regulatory').filter((r) => REG_BY_NAME[r.regulator] === regId); }
  function fbVersion(t) { const p = (t.products || []).find((x) => /FileBridge/.test(x)); return p ? p.replace('FileBridge MFT ', '') : null; }
  function campaignTps() { return CP.store.get('thirdParties').filter((t) => t.questionnaire && t.questionnaire.campaign === CAMPAIGN); }
  function engageApprovals() { return CP.store.get('approvals').filter((a) => a.role === 'engage'); }
  function memTp(t) {
    if (MEM[t.id]) return MEM[t.id];
    const h = hash(t.id);
    const bu = Object.keys(MEM_BU).find((k) => MEM_BU[k].suppliers.indexOf(t.id) >= 0);
    return {
      contact: 'Security contact · ' + t.name, owner: 'p-marc', bizOwner: bu ? CP.store.find('businessUnits', bu).name : 'Group functions',
      contract: { ref: 'CTR-20' + (16 + (h % 9)) + '-0' + (100 + (h % 800)), value: '€' + (0.3 + (h % 40) / 10).toFixed(1) + ' M / year', renewal: ['Mar', 'Jun', 'Sep', 'Dec'][h % 4] + ' 20' + (27 + (h % 2)), clauses: 'Audit right ' + (h % 3 ? 'yes' : 'no') + ' · ' + (t.criticality === 'critical' || t.criticality === 'high' ? '24 h' : '72 h') + ' incident notice' },
      assets: fbVersion(t) ? ['mft-prd-01 · file exchange (' + (t.dataShared || 'files') + ')'] : [t.products && t.products[0] ? t.products[0] + ' · ' + (t.dataShared || '') : 'No technical interconnection'],
      graph: { edges: 8 + (h % 40), docs: 30 + (h % 200) },
      meeting: { title: 'Service review · ' + t.name, when: ['Mon 19 Oct · 10:00', 'Wed 21 Oct · 15:00', 'Tue 27 Oct · 11:00'][h % 3], where: 'Video call', attendees: t.name + ' security contact, ' + (bu ? CP.store.find('businessUnits', bu).name + ' service owner, ' : '') + 'Third-party risk lead' },
      history: [
        { d: t.lastAssessment || 'Mar 2026', ic: 'file', t: 'DORA questionnaire answered, score ' + seedTp(t.id).score + '.' },
        { d: 'Nov 2025', ic: 'users', t: 'Annual service review with the business owner.' }
      ],
      commitments: [], questions: []
    };
  }

  /* Live facts: what changed for this party, computed from the store. */
  function liveTp(t) {
    const q = t.questionnaire || {}; const seed = seedTp(t.id);
    const o = { alerts: [], commitments: [], questions: [], deadlines: [] };
    if (q.campaign) {
      if (q.status === 'flagged') {
        o.alerts.push({ cls: 'error', ic: 'flag', t: 'Flagged on ' + q.campaign + ': "' + (q.answer || 'still vulnerable') + '". Still exploitable by COBALT LYNX.' });
        o.commitments.push({ t: 'Install FileBridge 9.1.4 and confirm in writing', who: t.name, due: 'Wed 12:45 (24 h)', st: 'open' });
        o.commitments.push({ t: 'Restore the normal flow once the patch is verified by an external scan', who: 'TPRM Agent · Business CISO informed', due: 'after patch', st: 'open' });
        o.questions.push('Have you searched for the COBALT LYNX indicators on your FileBridge server (logs since 1 October)?');
        o.deadlines.push({ t: 'FileBridge fix due', d: 'Wed 12:45' });
      } else if (q.status === 'overdue') {
        o.alerts.push({ cls: '', ic: 'clock', t: 'No answer to the ' + q.campaign + ' questionnaire. Automatic reminder sent; phone escalation proposed.' });
        o.questions.push('The 4 questions of the ' + q.campaign + ' campaign (version, patch, indicator search, suspicious activity).');
        o.deadlines.push({ t: 'Questionnaire answer (72 h)', d: 'Fri 09:00' });
      } else if (q.status === 'sent') {
        o.alerts.push({ cls: 'info', ic: 'send', t: q.campaign + ' questionnaire sent ' + (q.sentAt || '') + '. Waiting for the answer.' });
        o.questions.push('The 4 questions of the ' + q.campaign + ' campaign.');
        o.deadlines.push({ t: 'Questionnaire answer', d: t.criticality === 'critical' ? 'Wed 09:00 (24 h)' : 'Fri 09:00 (72 h)' });
      } else if (q.status === 'draft') {
        o.alerts.push({ cls: 'info', ic: 'bot', t: q.campaign + ' questionnaire drafted and pre-filled by the TPRM Agent. Waiting for validation by the third-party risk lead (L1).' });
      } else if (q.status === 'answered') {
        o.alerts.push({ cls: 'ok', ic: 'checkCircle', t: 'Answered ' + q.campaign + ': "' + (q.answer || 'patched') + '". Checked against external scan, consistent.' });
      }
    }
    if (q.gap) {
      o.alerts.push({ cls: '', ic: 'gavel', t: q.gap + ' (DORA Art. 28.8). Raised while answering the supervisory request R-DORA-REQ.' });
      o.commitments.push({ t: 'Run and document an exit-plan test', who: 'Business owner + TPRM', due: 'Q1 2027', st: 'open' });
    }
    CP.store.get('actions').filter((a) => a.action && a.action.indexOf(t.name.split(' ')[0]) >= 0 && a.scenario).forEach((a) => {
      o.alerts.push({ cls: 'error', ic: 'lock', t: a.ts + ' · ' + a.action + ' (' + CP.actor(a.agent).name + ', ' + a.level + ', rollback ready). Business CISO informed.' });
    });
    if (seed.score && t.score < seed.score) o.alerts.push({ cls: '', ic: 'trending', t: 'Security score down from ' + seed.score + ' to ' + t.score + ' after today\'s answers.' });
    return o;
  }

  function scoreHistory(t) {
    const s = seedTp(t.id).score || t.score; const h = hash(t.id);
    const vals = [-6, -4, -5, -2, -1, 0].map((d, i) => Math.max(30, Math.min(98, s + d + ((h >> i) % 3) - 1)));
    vals[vals.length - 1] = s; vals.push(t.score);
    return { vals, labels: ['Q2 25', 'Q3 25', 'Q4 25', 'Q1 26', 'Q2 26', 'Q3 26', 'Today'] };
  }

  /* ------------------------------------------------------------------
     Party 360 panel (third parties, business units, regulators)
     ------------------------------------------------------------------ */
  const sec = (title, body, right) => '<section class="eg-sec"><h4>' + title + (right ? '<small>' + right + '</small>' : '') + '</h4>' + body + '</section>';
  const alertsHtml = (arr) => CP.map(arr, (a) => '<div class="eg-alert ' + (a.cls || '') + '">' + I(a.ic || 'info') + '<span>' + esc(a.t) + '</span></div>');
  const cmHtml = (arr) => arr.length ? CP.map(arr, (c) => '<div class="eg-cm"><span>' + esc(c.t) + '<br><small>' + esc(c.who) + ' · due ' + esc(c.due) + '</small></span>' + ui.status(c.st === 'late' ? 'overdue' : c.st === 'done' ? 'done' : c.st === 'at-risk' ? 'at-risk' : 'open', c.st === 'late' ? 'Late' : c.st === 'open' ? 'Open' : null) + '</div>') : '<div class="small-txt muted">No open commitment.</div>';

  function timeline(id, staticHist) {
    const items = commsFor(id).map((m) => ({ d: m.ts, ic: m.channel === 'Learning platform' ? 'graduation' : 'mail', t: '<button class="linkish" data-action="review" data-id="' + esc(m.id) + '">' + esc(m.subject) + '</button> <span class="muted">· ' + esc(m.channel) + ' · drafted by ' + esc(CP.actor(m.author).name) + '</span> ' + ui.status(m.status), cls: ui.newCls(m) }))
      .concat(casesFor(id).map((c) => ({ d: c.opened, ic: 'shield', t: '<b>' + esc(c.id) + '</b> ' + esc(c.title) + ' ' + ui.sev(c.severity) + ' ' + ui.status(c.status), cls: ui.newCls(c) })))
      .concat((staticHist || []).map((h) => ({ d: h.d, ic: h.ic, t: esc(h.t), cls: '' })));
    if (!items.length) return '<div class="small-txt muted">No interaction recorded yet.</div>';
    return '<div class="eg-tl">' + CP.map(items, (x) => '<div class="eg-tl-i' + x.cls + '"><span class="d">' + esc(x.d) + '</span><span class="ic">' + I(x.ic) + '</span><span>' + x.t + '</span></div>') + '</div>';
  }

  function panelHead(p, tags, extra) {
    return '<div class="eg-ph"><div class="eg-kind">' + I('compass') + 'Party 360 · ' + (p.kind === 'tp' ? 'ICT third party' : p.kind === 'bu' ? 'Business unit' : 'Regulator') + '</div>' +
      '<h2>' + esc(p.name) + '</h2><div class="eg-sub">' + esc(p.sub) + '</div>' +
      (tags ? '<div class="eg-tags">' + tags + '</div>' : '') +
      '<div class="eg-btns"><button class="go small" data-action="brief" data-id="' + esc(p.id) + '" data-tour="engage-brief">' + I('sparkles') + ' Prepare my meeting</button>' +
      '<button class="on-dark small" data-action="ask" data-id="' + esc(p.id) + '">' + I('message') + ' Ask a question</button>' + (extra || '') + '</div>' +
      '<button class="on-dark small eg-close" data-action="closeParty" aria-label="Close Party 360">' + I('x') + '</button></div>';
  }
  function srcStrip(m, extra) {
    return '<div class="eg-src">' + I('database') + ' Pulled live from' +
      '<span class="eg-chip">' + I('network') + ' Security graph · ' + m.graph.edges + ' links</span>' +
      '<span class="eg-chip">' + I('database') + ' Data lake · ' + m.graph.docs + ' docs</span>' + (extra || '') + '</div>';
  }

  function tpPanel(t) {
    const p = party(t.id); const m = memTp(t); const live = liveTp(t); const q = t.questionnaire || {};
    const tags = ui.sev(t.criticality) + ui.tag(esc(t.country), 'outline') + (t.critFunction ? ui.tag('DORA critical function', 'amber') : '') + (q.status && q.status !== 'none' ? ui.status(q.status) : '');
    const hist = scoreHistory(t);
    const v = fbVersion(t);
    let qa = '';
    if (q.campaign) {
      const st = q.status;
      const ans = (good, bad, pre) => st === 'answered' ? [good, ''] : st === 'flagged' ? [bad, 'bad'] : [pre || 'Awaiting answer', 'pend'];
      const rows = [
        ['Which FileBridge version do you run?', ans('9.1.4', (q.answer || '').match(/8\.\d/) ? (q.answer.match(/8\.\d/)[0]) + ' (vulnerable)' : 'Vulnerable version', 'Pre-filled from the graph: ' + (v || 'unknown') + ' (to confirm)')],
        ['Is the vendor patch 9.1.4 applied?', ans('Yes, applied Tue', 'No, planned Friday')],
        ['Have you searched for the indicators?', ans('Yes, negative', 'Not yet performed')],
        ['Suspicious activity since 1 October?', ans('None observed', 'None reported, no search done')]
      ];
      qa = sec('Questionnaire · ' + esc(q.campaign), CP.map(rows, (r, i) => '<div class="eg-qa"><span class="n">Q' + (i + 1) + '</span><span><span class="q">' + esc(r[0]) + '</span><br><span class="a ' + r[1][1] + '">' + esc(r[1][0]) + '</span></span></div>') +
        (st === 'answered' ? '<div class="small-txt muted" style="margin-top:6px">' + I('bot') + ' TPRM Agent check: answer consistent with the external scan banner (confidence 0.93).</div>' : st === 'flagged' ? '<div class="small-txt" style="margin-top:6px;color:var(--red-ink)">' + I('bot') + ' TPRM Agent check: version 8.7 confirmed by the graph and the external scan. Flagged as exploitable.</div>' : ''),
      (q.sentAt ? 'sent ' + esc(q.sentAt) : st === 'draft' ? 'draft' : ''));
    }
    return '<aside class="eg-panel" data-tour="engage-party360" aria-label="Party 360">' + panelHead(p, tags) + srcStrip(m, '<span class="eg-chip">' + I('file') + ' TPRM · contracts</span>') +
      (live.alerts.length ? sec('What changed', alertsHtml(live.alerts), 'live') : '') +
      sec('Profile', '<dl class="kv"><dt>Service</dt><dd>' + esc(t.service) + '</dd><dt>Data shared</dt><dd>' + esc(t.dataShared || '') + '</dd><dt>Products</dt><dd>' + esc((t.products || []).join(', ')) + '</dd>' +
        '<dt>Business owner</dt><dd>' + esc(m.bizOwner) + '</dd><dt>Contact</dt><dd>' + esc(m.contact) + '</dd><dt>Relationship</dt><dd>' + whoS(m.owner) + '</dd>' +
        '<dt>Contract</dt><dd>' + esc(m.contract.ref + ' · ' + m.contract.value + ' · renewal ' + m.contract.renewal) + '</dd><dt>Clauses</dt><dd>' + esc(m.contract.clauses) + '</dd>' +
        '<dt>Sub-contractors</dt><dd>' + esc(t.subcontractors) + ' known (rank 1)</dd><dt>Exit plan</dt><dd>' + (t.exitPlan ? ui.status('done', 'Documented') : ui.status('overdue', 'Missing')) + '</dd><dt>Last assessment</dt><dd>' + esc(t.lastAssessment) + '</dd></dl>') +
      sec('Exposure in the graph', '<ul class="eg-tp" style="font-size:12.5px">' + CP.map(m.assets, (a) => '<li>' + esc(a) + '</li>') + '</ul>' + (v ? '<div class="small-txt muted" style="margin-top:4px">' + I('box') + ' FileBridge MFT ' + esc(v) + (/^9\.1/.test(v) && !(q.status === 'flagged') ? '' : ' · below 9.1.4') + '</div>' : '')) +
      qa +
      sec('Security score', ui.line([{ label: String(t.score), color: t.score < seedTp(t.id).score ? 'var(--red)' : 'var(--indigo)', values: hist.vals }], hist.labels, { w: 420, h: 140, min: 40, max: 100, label: 'Security score history' }), 'external rating + questionnaires') +
      sec('Open questions and commitments', (live.questions.concat(m.questions).length ? '<ul class="eg-tp" style="font-size:12.5px;margin-bottom:8px">' + CP.map(live.questions.concat(m.questions), (x) => '<li>' + I('message') + ' ' + esc(x) + '</li>') + '</ul>' : '') + cmHtml(live.commitments.concat(m.commitments))) +
      (live.deadlines.length ? sec('Deadlines', CP.map(live.deadlines, (d) => '<div class="eg-cm"><span>' + esc(d.t) + '</span><b class="num">' + esc(d.d) + '</b></div>')) : '') +
      sec('Interactions', timeline(t.id, m.history), 'store comms + history') +
      '</aside>';
  }

  function regPanel(r) {
    const p = party(r.id); const m = MEM_REG[r.id]; const items = regItemsFor(r.id);
    const cm = m.commitments.slice();
    const alerts = [];
    items.filter((x) => x.scenario).forEach((x) => alerts.push({ cls: x.status === 'submitted' ? 'ok' : 'error', ic: x.status === 'submitted' ? 'checkCircle' : 'alert', t: x.item + ' · due ' + x.due + ' · ' + (x.status === 'submitted' ? 'submitted' : x.collected + ' of ' + x.total + ' evidence items') }));
    commsFor(r.id).filter((x) => x.status === 'awaiting').forEach((x) => alerts.push({ cls: '', ic: 'mail', t: 'Draft awaiting your validation: ' + x.subject }));
    return '<aside class="eg-panel" data-tour="engage-party360" aria-label="Party 360">' + panelHead(p, ui.tag(esc(r.fw), 'teal') + ui.tag('Since ' + esc(r.since), 'outline')) +
      srcStrip({ graph: { edges: 20 + items.length * 9, docs: 140 + items.length * 37 } }, '<span class="eg-chip">' + I('gavel') + ' Regulatory register</span>') +
      (alerts.length ? sec('What changed', alertsHtml(alerts), 'live') : '') +
      sec('Relationship', '<dl class="kv"><dt>Authority</dt><dd>' + esc(r.full) + '</dd><dt>Main contact</dt><dd>' + esc(r.contact) + '</dd><dt>Relationship owner</dt><dd>' + whoS('p-amira') + '</dd><dt>Climate</dt><dd>' + esc(r.rating) + '</dd></dl>') +
      sec('Upcoming deadlines', items.length ? CP.map(items, (x) => '<div class="eg-cm"><span>' + esc(x.item) + '<br><small>' + esc(x.framework) + ' · owner ' + esc((CP.person(x.owner) || {}).name || '') + ' · ' + CP.pct(x.total ? x.collected / x.total * 100 : 0) + ' evidence</small></span><span style="text-align:right">' + ui.status(x.status) + '<br><small class="num">' + esc(x.due) + '</small></span></div>') : '<div class="small-txt muted">No open item.</div>') +
      sec('Commitments made to this authority', cmHtml(cm)) +
      sec('Past inspections and reviews', CP.map(m.inspections, (x) => '<div class="eg-cm"><span>' + esc(x.t) + '<br><small>' + esc(x.d) + '</small></span><small>' + esc(x.r) + '</small></div>')) +
      sec('Interactions', timeline(r.id, []), 'store comms') +
      '</aside>';
  }

  /* ------------------------------------------------------------------
     Meeting brief (AI generated from the Party 360 memory)
     ------------------------------------------------------------------ */
  function briefData(id) {
    const p = party(id); if (!p) return null;
    const pts = [], asks = [], raise = [], since = [];
    let meet, summary, cm = [], agent = 'ag-grc-tprm', nSrc;
    if (p.kind === 'tp') {
      const t = p.raw, m = memTp(t), live = liveTp(t), q = t.questionnaire || {};
      meet = m.meeting; cm = live.commitments.concat(m.commitments); nSrc = 9 + (m.graph.docs % 14);
      summary = t.name + ' provides ' + t.service.toLowerCase() + ' (' + t.criticality + (t.critFunction ? ', supports a DORA critical function' : '') + '). Security score ' + t.score + (t.score < (seedTp(t.id).score || 0) ? ' (down from ' + seedTp(t.id).score + ' today)' : '') + '. ' +
        (q.status === 'flagged' ? 'They are still exposed to CVE-2026-41877 and their file flow is in quarantine: this meeting is about getting a firm patch date.' : q.status === 'answered' ? 'They answered the CVE-2026-41877 campaign quickly and are patched: thank them and move to routine topics.' : 'No live incident with this supplier.');
      live.alerts.forEach((a) => since.push(a.t));
      commsFor(t.id).slice(0, 3).forEach((c) => since.push(c.ts + ' · message "' + c.subject + '" (' + c.status + ')'));
      if (q.status === 'flagged') {
        pts.push('Open with the facts: version 8.7 is exploitable and COBALT LYNX is scanning the sector. The quarantine of the SFTP flow is a precaution, not a sanction.');
        pts.push('Get a firm date and time for FileBridge 9.1.4, and a named person on their side. Our deadline is Wednesday 12:45.');
        pts.push('Explain the exit from quarantine: patch, external scan by our TPRM Agent, then the flow is restored the same day.');
        pts.push('Payroll run of 25 October: agree a fallback (manual secure transfer) if the patch slips.');
        asks.push('Written confirmation of the patch and the indicator search result.', 'Access to their FileBridge logs since 1 October if anything looks suspicious.');
        raise.push('They may ask to lift the quarantine before patching because of the payroll calendar: the decision belongs to the Business CISO, who is invited.');
      } else if (q.status === 'answered') {
        pts.push('Thank them for answering the CVE-2026-41877 questionnaire within hours: it saved us a phone escalation.');
      } else if (q.status === 'overdue' || q.status === 'sent') {
        pts.push('Ask for the CVE-2026-41877 answers on the spot: version, patch status, indicator search.');
      }
      if (q.gap || !t.exitPlan) pts.push('Exit plan: ' + (q.gap ? 'the supervisor will see that it is untested. ' : 'still missing. ') + 'Agree a desk test date before Q1 2027 (DORA Art. 28.8).');
      if (m.commitments.some((c) => c.st === 'late')) pts.push('Follow up on late commitments: ' + m.commitments.filter((c) => c.st === 'late').map((c) => c.t.charAt(0).toLowerCase() + c.t.slice(1)).join('; ') + '.');
      const miss = m.contract.clauses.split(' · ').filter((x) => / no$/.test(x)).map((x) => x.replace(/ no$/, ''));
      pts.push('Contract ' + m.contract.ref + ' renews ' + m.contract.renewal + (miss.length ? ': negotiate the missing clauses now (' + miss.join(', ') + ').' : ': clauses complete, keep the audit right in use.'));
      asks.push('Updated sub-contracting chain for the DORA register.');
      raise.push('Questionnaire fatigue: remind them that pre-filled answers come from the platform and only changes are needed.');
    } else if (p.kind === 'bu') {
      const b = p.raw, mb = MEM_BU[b.id]; agent = 'ag-grc-controls'; nSrc = 21;
      meet = { title: mb.committee.split(' · ')[0], when: mb.committee.split(' · ')[1], where: 'Business committee room + video call', attendees: mb.owner + ', Business CISO, risk and compliance leads' };
      const reqs = mb.requests;
      summary = b.name + ': cyber risk score ' + b.riskScore + ' (trend ' + (b.trend[0] - b.riskScore > 0 ? 'down ' + (b.trend[0] - b.riskScore) + ' pts in 6 months' : 'stable') + '), ' + b.apps + ' applications, ' + reqs.length + ' open requests from the business.';
      casesFor(b.id).forEach((c) => since.push(c.opened + ' · ' + c.id + ' ' + c.title + ' (' + c.status + ')'));
      commsFor(b.id).slice(0, 3).forEach((c) => since.push(c.ts + ' · ' + c.subject));
      pts.push('Risk score ' + b.riskScore + ', improving: say what drove it (' + b.topRisks.join(', ').toLowerCase() + ' are still the top risks).');
      const c2302 = CP.store.find('cases', 'C-2302');
      if (b.id === 'bu-pay' && c2302) pts.push('The 2 a.m. MFA fatigue case: contained in 7 minutes, 3 payments (€4.2 M) held, 1,200 IBANs exposed and notified to the DPA. Ask for sponsorship of phishing-resistant MFA for all approvers (B-315).');
      const c2301 = CP.store.find('cases', 'C-2301');
      if ((b.id === 'bu-it' || b.id === 'bu-pay' || b.id === 'bu-ins') && c2301) pts.push('CVE-2026-41877: protected in 6 minutes, 11 of 14 suppliers cleared in 4 h. Residual risk on Atlas Payroll (flow in quarantine).');
      reqs.slice(0, 3).forEach((r) => pts.push('Decide ' + r.id + ' (' + r.type.toLowerCase() + '): ' + r.t + '. Recommendation: ' + r.ai));
      asks.push('A business owner for each open request older than 10 days.', 'Participation in the 5 November crisis exercise.');
      raise.push('Delivery pressure on new SaaS onboarding: show the average onboarding time is now 6 days, down from 24.');
    } else {
      const r = p.raw, mr = MEM_REG[r.id], items = regItemsFor(r.id); agent = 'ag-grc-controls'; nSrc = 34;
      meet = mr.meeting; cm = mr.commitments;
      summary = r.name + ' (' + r.fw + '): ' + items.length + ' open item(s); relationship ' + r.rating.toLowerCase() + '.';
      items.forEach((x) => since.push(x.item + ' · ' + (x.status === 'submitted' ? 'submitted' : x.collected + '/' + x.total + ' evidence') + ' · due ' + x.due));
      const req = CP.store.find('regulatory', 'R-DORA-REQ');
      if (r.id === 'reg-sup' && req) {
        pts.push('Supervisory request of 13 October: ' + (req.status === 'submitted' ? 'submitted 3 days early, with 3 gaps disclosed and a dated plan.' : req.collected + ' of 23 evidence items assembled.'));
        pts.push('Present the 3 gaps ourselves: 31 sub-contracting chains, 7 untested exit plans, 2 late notifications. Each has an owner and a date.');
        pts.push('Show the new automated controls: daily register refresh (B-316) and the 4-hour notification monitor (B-317).');
      }
      const bre = CP.store.find('regulatory', 'R-GDPR-BRE');
      if (r.id === 'reg-dpa' && bre) pts.push('Breach of Wednesday 02:13 (1,200 beneficiary records): initial notification ' + (bre.status === 'submitted' ? 'sent within the 72 h' : 'pending validation') + '. Describe containment (7 minutes) and the decision on informing data subjects.');
      mr.commitments.forEach((c) => pts.push('Commitment: ' + c.t + ' (due ' + c.due + ', ' + c.st + ').'));
      pts.push('Show how the platform keeps evidence traceable to source systems (LoD2 sampled 10%, 0 discrepancy).');
      asks.push('Feedback on the format of the register submission.', 'Expected timeline for the next on-site inspection.');
      raise.push('Use of AI agents in security operations: be ready to explain decision rights and the kill-switch (AI Act register).');
    }
    return { p, meet, summary, pts, asks, raise, since, cm, agent, nSrc };
  }

  function briefHtml(id) {
    const b = briefData(id); if (!b) return '';
    return '<div class="eg-brief" data-tour="engage-brief-modal">' +
      '<div class="eg-meet"><div><b>Meeting</b>' + esc(b.meet.title) + '</div><div><b>When · where</b>' + esc(b.meet.when) + ' · ' + esc(b.meet.where) + '</div><div><b>Attendees</b>' + esc(b.meet.attendees) + '</div></div>' +
      '<h3 style="margin-top:16px">In one minute</h3><p style="margin:0">' + esc(b.summary) + '</p>' +
      (b.since.length ? '<h3>Since your last meeting</h3><ul>' + CP.map(b.since.slice(0, 6), (x) => '<li>' + esc(x) + '</li>') + '</ul>' : '') +
      '<h3>Talking points</h3><ol>' + CP.map(b.pts, (x) => '<li>' + esc(x) + '</li>') + '</ol>' +
      '<div class="grid g2" style="margin-top:4px"><div><h3>What we ask</h3><ul>' + CP.map(b.asks, (x) => '<li>' + esc(x) + '</li>') + '</ul></div><div><h3>What they may raise</h3><ul>' + CP.map(b.raise, (x) => '<li>' + esc(x) + '</li>') + '</ul></div></div>' +
      (b.cm.length ? '<h3>Commitments to follow up</h3>' + cmHtml(b.cm) : '') +
      '<div class="eg-ai">' + ui.av(b.agent, 'sm') + '<span>Drafted by <b>' + esc(CP.actor(b.agent).name) + '</b> (L0 · suggest) from ' + b.nSrc + ' sources in the security graph and the data lake, in 8 s. Check before sharing outside Engage.</span></div></div>';
  }

  /* Agent draft for "Ask a question". */
  function askDraft(id) {
    const p = party(id); if (!p) return { text: '', channel: '', author: '', validator: '' };
    if (p.kind === 'tp') {
      const t = p.raw, m = memTp(t), live = liveTp(t);
      const qn = live.questions[0] || m.questions[0] || 'Could you confirm the current status of your exit plan for the services provided to Novalys and share the date of the last test?';
      return { channel: 'Supplier portal', author: 'ag-grc-tprm', validator: 'p-marc', subject: 'Question from Novalys Group · ' + t.name,
        text: 'Dear ' + t.name + ' security team,\n\n' + qn + '\n\nContext: ' + (live.alerts[0] ? live.alerts[0].t : 'part of our continuous third-party monitoring under DORA.') + '\n\nCould you answer through the supplier portal within 3 business days' + (t.criticality === 'critical' ? ' (24 hours if it relates to an active vulnerability)' : '') + '?\n\nKind regards,\nThird-Party Security, Novalys Group\n(on behalf of the Third-party risk lead)' };
    }
    if (p.kind === 'bu') {
      const mb = MEM_BU[p.id];
      return { channel: 'Email', author: 'ag-grc-controls', validator: 'p-lucas', subject: 'Cyber: one question before the ' + mb.committee.split(' · ')[0],
        text: 'Hello,\n\nAhead of the ' + mb.committee + ', could your team confirm the business owner and the target date for request ' + mb.requests[0].id + ' (' + mb.requests[0].t + ')?\n\nOur pre-assessment: ' + mb.requests[0].ai + '\n\nThanks,\nBusiness CISO, Novalys Group' };
    }
    const r = p.raw;
    return { channel: 'Regulator portal', author: 'ag-grc-controls', validator: 'p-amira', subject: 'Clarification request · ' + r.fw,
      text: 'Dear Madam, Dear Sir,\n\nIn preparing our ' + r.fw + ' submissions, we would welcome a clarification on the expected level of detail for the sub-contracting chain (rank 2 and beyond) in the register of information.\n\nWe remain available for a call at your convenience.\n\nYours sincerely,\nHead of Engage · Compliance & regulators, Novalys Group' };
  }

  /* ------------------------------------------------------------------
     Shared blocks
     ------------------------------------------------------------------ */
  function partyPicker() {
    const opt = (id, n) => '<option value="' + esc(id) + '">' + esc(n) + '</option>';
    return '<label class="sr-only" for="eg-party-pick" style="position:absolute;left:-9999px">Open a Party 360</label><select id="eg-party-pick" data-change="openParty" style="border:1px solid var(--line);padding:8px 10px;min-height:36px;font-size:13px;background:#fff;max-width:260px">' +
      '<option value="">Open a Party 360…</option>' +
      '<optgroup label="Third parties">' + CP.map(CP.store.get('thirdParties'), (t) => opt(t.id, t.name)) + '</optgroup>' +
      '<optgroup label="Business units">' + CP.map(CP.store.get('businessUnits'), (b) => opt(b.id, b.name)) + '</optgroup>' +
      '<optgroup label="Regulators">' + CP.map(REGULATORS, (r) => opt(r.id, r.name)) + '</optgroup></select>';
  }

  function decisionsBlock(filter) {
    const all = engageApprovals().filter(filter || (() => true));
    const pend = all.filter((a) => a.status === 'pending');
    const done = all.filter((a) => a.status !== 'pending').slice(0, 2);
    return '<div class="eg-dec" data-tour="engage-decisions">' +
      (pend.length ? CP.map(pend, (a) => ui.decision(a, { pulse: true })) : '<div class="eg-dec-empty">' + I('checkCircle') + '<span>' + (done.length ? 'No decision waiting. Recent Engage decisions below.' : 'No decision waiting for Engage. Agents act alone below threshold; anything leaving the group (suppliers, regulators, press) comes here first.') + '</span></div>') +
      CP.map(done, (a) => ui.decision(a)) + '</div>';
  }

  function commRowActions(m) {
    const gate = GATED[m.id] && CP.store.find('approvals', GATED[m.id]);
    if (m.status === 'awaiting' && gate && gate.status === 'pending') return '<button class="small" data-open-drawer>' + I('users') + ' Decide (' + esc(gate.id) + ')</button>';
    if (m.status === 'awaiting') return '<div class="row" style="gap:6px;white-space:nowrap"><button class="small" data-action="review" data-id="' + esc(m.id) + '">' + I('eye') + ' Review</button><button class="small go" data-action="validate" data-id="' + esc(m.id) + '">' + I('send') + ' Validate and send</button></div>';
    if (m.status === 'draft') return '<button class="small" data-action="resubmit" data-id="' + esc(m.id) + '">' + I('rollback') + ' Resubmit</button>';
    return '<button class="small ghost" data-action="review" data-id="' + esc(m.id) + '">' + I('eye') + ' View</button>';
  }

  /* ------------------------------------------------------------------
     Sub-tab: Third parties
     ------------------------------------------------------------------ */
  function renderThirdParties(route) {
    const S = this.ui;
    const tps = CP.store.get('thirdParties');
    const k = CP.store.state.kpis;
    const camp = campaignTps();
    const cnt = { draft: 0, sent: 0, answered: 0, flagged: 0, overdue: 0 };
    camp.forEach((t) => { cnt[t.questionnaire.status] = (cnt[t.questionnaire.status] || 0) + 1; });
    const sel = route.query.id && CP.store.find('thirdParties', route.query.id);

    // Campaign banner
    let banner;
    if (camp.length) {
      const tot = camp.length, done = cnt.answered + cnt.flagged;
      const seg = (n, c) => n ? '<span style="width:' + (n / tot * 100) + '%;background:' + c + '" title="' + n + '"></span>' : '';
      const m410 = CP.store.find('comms', 'M-410');
      banner = '<section class="eg-campaign" data-tour="engage-campaign" aria-label="Active questionnaire campaign">' +
        '<div class="eg-c-top"><div><div class="eyebrow" style="color:#9de8bd;margin:0 0 4px">' + I('radar') + ' Active campaign · CTI-triggered</div><div class="eg-c-title">' + esc(CAMPAIGN) + ' · FileBridge MFT · ' + tot + ' suppliers questioned</div>' +
        '<div class="eg-c-sub">Opened from case C-2301 by the TPRM Agent · 4 targeted questions, pre-filled from the graph · 24 h deadline for the 3 critical suppliers' + (m410 ? ' · message ' + esc(m410.id) + ' ' + esc(ui.status(m410.status).replace(/<[^>]+>/g, '').toLowerCase()) : '') + '</div></div>' +
        '<div class="eg-c-counts">' +
        '<div class="eg-cnt"><b>' + cnt.draft + '</b><span>Draft</span></div>' +
        '<div class="eg-cnt"><b>' + cnt.sent + '</b><span>Sent</span></div>' +
        '<div class="eg-cnt green"><b>' + cnt.answered + '</b><span>Answered</span></div>' +
        '<div class="eg-cnt red"><b>' + cnt.flagged + '</b><span>Flagged</span></div>' +
        '<div class="eg-cnt amber"><b>' + cnt.overdue + '</b><span>Overdue</span></div></div></div>' +
        '<div class="eg-bar" role="img" aria-label="Campaign progress">' + seg(cnt.answered, '#04f06a') + seg(cnt.flagged, '#d8412f') + seg(cnt.overdue, '#ffb648') + seg(cnt.sent, '#9173fa') + seg(cnt.draft, '#ffffff40') + '</div>' +
        '<div class="eg-c-foot"><b style="color:#fff">' + CP.pct(done / tot * 100) + ' answered</b><span class="eg-leg"><i style="background:#04f06a"></i>Answered</span><span class="eg-leg"><i style="background:#d8412f"></i>Flagged</span><span class="eg-leg"><i style="background:#ffb648"></i>Overdue</span><span class="eg-leg"><i style="background:#9173fa"></i>Sent</span><span class="eg-leg"><i style="background:#ffffff40"></i>Draft</span>' +
        '<span class="spacer"></span>' + (cnt.answered + cnt.flagged ? 'Usual time to 11 answers: 3 weeks · today: 4 h' : 'Usual time to 11 answers: 3 weeks') +
        (cnt.overdue ? '<button class="on-dark small" data-action="escalate">' + I('bell') + ' Escalate ' + cnt.overdue + ' overdue by phone</button>' : '') +
        (cnt.flagged ? '<button class="go small" data-action="selTp" data-id="' + esc(camp.find((t) => t.questionnaire.status === 'flagged').id) + '">' + I('flag') + ' Open flagged supplier</button>' : '') + '</div></section>';
    } else {
      banner = '<section class="eg-campaign calm" data-tour="engage-campaign" aria-label="Questionnaire campaigns"><div class="eg-c-top"><div><div class="eyebrow" style="color:#c9bdf5;margin:0 0 4px">' + I('list') + ' Campaigns</div><div class="eg-c-title">Annual DORA assessment 2026 · ' + CP.fmt(k.thirdPartiesAssessed) + ' of 1,240 ICT third parties assessed</div>' +
        '<div class="eg-c-sub">No CTI-triggered campaign running. When an advisory hits a product used by suppliers, the TPRM Agent opens a targeted campaign here within minutes.</div></div>' +
        '<div class="eg-c-counts"><div class="eg-cnt green"><b>' + CP.pct(k.thirdPartiesAssessed / 1240 * 100) + '</b><span>Assessed</span></div><div class="eg-cnt amber"><b>23</b><span>Overdue</span></div><div class="eg-cnt"><b>35</b><span>In progress</span></div></div></div>' +
        '<div class="eg-bar"><span style="width:' + (k.thirdPartiesAssessed / 1240 * 100) + '%;background:#9173fa"></span></div></section>';
    }

    // Filters
    const qx = (S.q || '').toLowerCase();
    let rows = tps.filter((t) => (S.crit === 'all' || !S.crit || t.criticality === S.crit) &&
      (!S.camp || S.camp === 'all' || (t.questionnaire.status || 'none') === S.camp) &&
      (!S.fb || S.fb === 'all' || (S.fb === 'yes' ? t.fileBridge : !t.fileBridge)) &&
      (!qx || (t.name + ' ' + t.service + ' ' + t.country + ' ' + (t.products || []).join(' ')).toLowerCase().indexOf(qx) >= 0));
    if (camp.length) {
      const pr = { flagged: 0, overdue: 1, sent: 2, draft: 3, answered: 4, none: 5 };
      rows = rows.slice().sort((a, b) => (pr[a.questionnaire.status] - pr[b.questionnaire.status]) || (critRank[a.criticality] - critRank[b.criticality]));
    }
    const overdueN = 23 + cnt.overdue, flaggedN = 4 + cnt.flagged;
    const crit = tps.filter((t) => t.criticality === 'critical').length;

    const cols = [
      { label: 'Supplier', render: (t) => '<span class="eg-name"><b>' + esc(t.name) + '</b><small>' + esc(t.service) + ' · ' + esc(t.country) + '</small></span>' },
      { label: 'Criticality', render: (t) => ui.sev(t.criticality) },
      { label: 'Score', render: (t) => { const s0 = seedTp(t.id).score; return '<span class="eg-score"><b>' + t.score + '</b>' + ui.progress(t.score, scoreCls(t.score)) + (t.score < s0 ? '<span class="dl">' + (t.score - s0) + '</span>' : '') + '</span>'; } },
      { label: 'FileBridge', render: (t) => t.fileBridge ? '<span class="mono small-txt">' + esc(fbVersion(t) || 'yes') + '</span>' : '<span class="muted small-txt">No</span>' },
      { label: 'Questionnaire', render: (t) => ui.status(t.questionnaire.status || 'none') + (t.questionnaire.gap ? ' ' + ui.tag('Gap', 'red') : '') },
      { label: 'DORA', render: (t) => (t.critFunction ? ui.tag('CIF', 'amber') + ' ' : '') + '<span title="Exit plan" class="small-txt ' + (t.exitPlan ? '' : 'muted') + '">' + (t.exitPlan ? I('check') + ' exit plan' : I('x') + ' no exit plan') + '</span>' }
    ];
    const table = ui.table(cols, rows, {
      rowClass: (t) => 'clickable' + (sel && sel.id === t.id ? ' sel' : ''),
      rowAttrs: (t) => 'data-action="selTp" data-id="' + esc(t.id) + '" tabindex="0" aria-label="Open Party 360 for ' + esc(t.name) + '"',
      empty: 'No supplier matches these filters.', max: 760
    });
    const sOpt = (v, l, cur) => '<option value="' + v + '"' + ((cur || 'all') === v ? ' selected' : '') + '>' + l + '</option>';
    const filters = '<div class="eg-filters">' +
      '<label>Criticality<select data-change="tpCrit">' + sOpt('all', 'All', S.crit) + sOpt('critical', 'Critical', S.crit) + sOpt('high', 'High', S.crit) + sOpt('medium', 'Medium', S.crit) + sOpt('low', 'Low', S.crit) + '</select></label>' +
      '<label>Questionnaire<select data-change="tpCamp">' + sOpt('all', 'All statuses', S.camp) + sOpt('flagged', 'Flagged', S.camp) + sOpt('overdue', 'Overdue', S.camp) + sOpt('sent', 'Sent', S.camp) + sOpt('draft', 'Draft', S.camp) + sOpt('answered', 'Answered', S.camp) + sOpt('none', 'No campaign', S.camp) + '</select></label>' +
      '<label>FileBridge<select data-change="tpFb">' + sOpt('all', 'Any', S.fb) + sOpt('yes', 'Uses FileBridge', S.fb) + sOpt('no', 'No FileBridge', S.fb) + '</select></label>' +
      '<label>Search<input id="eg-tp-q" type="search" placeholder="Name, service, product, country" value="' + esc(S.q || '') + '"></label>' +
      '<span class="spacer"></span><span class="small-txt muted">' + rows.length + ' of ' + tps.length + ' in scope · 1,240 in the register</span></div>';

    // Right column: Party 360 or attention list
    let right;
    if (sel) right = tpPanel(sel);
    else {
      const attn = tps.filter((t) => ['flagged', 'overdue'].indexOf(t.questionnaire.status) >= 0 || t.questionnaire.gap || (t.criticality === 'critical' && !t.exitPlan) || t.score < 65).slice(0, 7);
      right = '<aside class="eg-panel" data-tour="engage-party360" aria-label="Party 360"><div class="eg-ph"><div class="eg-kind">' + I('compass') + 'Party 360 · stakeholder memory</div><h2>Everything we know, in one place</h2><div class="eg-sub">Pick a supplier: profile, contracts, data shared, exposure in the graph, questionnaire answers, score history, every message exchanged, open commitments, and a meeting brief written by the agent.</div></div>' +
        sec('Needs your attention', '<div class="eg-attn">' + CP.map(attn, (t) => '<button data-action="selTp" data-id="' + esc(t.id) + '"><span class="l"><b>' + esc(t.name) + '</b><small>' + esc(t.questionnaire.status === 'flagged' ? 'Flagged on ' + CAMPAIGN : t.questionnaire.status === 'overdue' ? 'Questionnaire overdue' : t.questionnaire.gap ? t.questionnaire.gap : t.score < 65 ? 'Score ' + t.score + ' (below 65)' : 'Critical, no exit plan') + '</small></span>' + I('chevronRight') + '</button>') + '</div>') +
        sec('What the memory holds', '<dl class="kv"><dt>Parties</dt><dd>1,240 suppliers · 6 business units · 4 authorities</dd><dt>Messages</dt><dd>' + CP.fmt(18420 + allComms().length) + ' archived, 100% agent-drafted since June</dd><dt>Documents</dt><dd>41,300 contracts, answers and reports</dd><dt>Refresh</dt><dd>Graph sync every 15 min</dd></dl>') + '</aside>';
    }

    return ui.head('Engage · Third parties', 'Third-party risk', 'One memory for 1,240 ICT suppliers. The TPRM Agent questions, reads and scores; the third-party risk lead validates what leaves the group.',
      partyPicker() + '<button data-action="exportRegister">' + I('file') + ' Export DORA register</button>') +
      '<div class="metrics eg-m5" style="margin-bottom:18px">' +
      ui.metric({ label: 'ICT third parties', icon: 'building', value: '1,240', foot: CP.fmt(crit) + ' critical shown · 96 support critical functions' }) +
      ui.metric({ label: 'Assessed this cycle', icon: 'checkCircle', value: CP.pct(k.thirdPartiesAssessed / 1240 * 100), foot: CP.fmt(k.thirdPartiesAssessed) + ' of 1,240', spark: [71, 78, 84, 88, 91, 95] }) +
      ui.metric({ label: 'Critical (DORA CIF)', icon: 'shield', value: '96', foot: '6 in this view · 7 without tested exit plan' }) +
      ui.metric({ label: 'Overdue', icon: 'clock', value: String(overdueN), color: cnt.overdue ? 'var(--red-ink)' : null, foot: cnt.overdue ? '+' + cnt.overdue + ' from the CVE campaign' : 'annual questionnaires', flash: cnt.overdue > 0 }) +
      ui.metric({ label: 'Flagged suppliers', icon: 'flag', value: String(flaggedN), color: cnt.flagged ? 'var(--red-ink)' : null, foot: cnt.flagged ? 'Atlas Payroll flow restricted' : 'under remediation', flash: cnt.flagged > 0 }) + '</div>' +
      banner +
      '<div class="eg-split"><div class="stack">' +
      ui.card('Decisions for Engage', decisionsBlock(), { sub: 'Above threshold: external communication, regulatory commitments', right: ui.tag(I('users') + ' Humans decide', 'amber') }) +
      ui.card('Suppliers in scope', filters + table, { sub: 'Critical and high suppliers, plus every supplier exposed to a live advisory · click a row for the Party 360' }) +
      '</div>' + right + '</div>';
  }

  /* ------------------------------------------------------------------
     Sub-tab: Business units
     ------------------------------------------------------------------ */
  function reqState(S, id) { return (S.req || {})[id]; }
  function renderBusiness(route) {
    const S = this.ui;
    const bus = CP.store.get('businessUnits');
    const selId = route.query.id || S.bu || 'bu-pay';
    const b = CP.store.find('businessUnits', selId) || bus[0];
    const mb = MEM_BU[b.id];
    const openReq = (id) => MEM_BU[id].requests.filter((r) => !reqState(S, r.id)).length;
    const totalOpen = bus.reduce((a, x) => a + openReq(x.id), 0);
    const avg = Math.round(bus.reduce((a, x) => a + x.riskScore, 0) / bus.length);
    const cards = '<div class="eg-bu-grid">' + CP.map(bus, (x) => {
      const inc = casesFor(x.id).filter((c) => c.status !== 'closed' && c.scenario);
      return '<button class="eg-bu' + (x.id === b.id ? ' sel' : '') + ui.newCls(x) + '" data-action="selBu" data-id="' + esc(x.id) + '" aria-pressed="' + (x.id === b.id) + '">' +
        '<span class="eg-bu-top"><span><h3>' + esc(x.name) + '</h3><span class="small-txt muted">' + esc(MEM_BU[x.id].owner) + '</span></span><span class="eg-bu-score">' + x.riskScore + '<small>risk score</small></span></span>' +
        '<span class="row between">' + ui.spark(x.trend, { w: 150, h: 30, color: 'var(--green-ink)' }) + '<span class="small-txt" style="color:var(--green-ink);font-weight:650">' + (x.riskScore - x.trend[0]) + ' pts · 6 mo</span></span>' +
        '<span class="row wrap" style="gap:5px">' + CP.map(x.topRisks, (r) => ui.tag(esc(r))) + CP.map(inc, (c) => ui.tag(I('alert') + ' ' + esc(c.id), 'red')) + '</span>' +
        '<span class="eg-bu-meta"><span>BISO <b>' + esc((CP.person(x.biso) || {}).name || '') + '</b></span><span><b>' + openReq(x.id) + '</b> open requests</span><span><b>' + x.apps + '</b> apps</span></span></button>';
    }) + '</div>';

    const reqs = '<div>' + CP.map(mb.requests, (r) => {
      const st = reqState(S, r.id);
      return '<div class="eg-req"><div class="eg-req-top">' + ui.tag(esc(r.type), r.type === 'Exception' ? 'amber' : r.type === 'SaaS onboarding' ? 'teal' : '') + '<span class="mono small-txt muted">' + esc(r.id) + '</span><span class="small-txt muted">' + esc(r.from) + ' · ' + esc(r.age) + '</span><span class="spacer"></span>' + (st ? ui.status(st === 'approved' ? 'approved' : st === 'rejected' ? 'rejected' : 'in-progress', st === 'approved' ? 'Approved with conditions' : st === 'rejected' ? 'Declined' : 'Sent back for info') : ui.status('new', 'Open')) + '</div>' +
        '<div class="eg-req-t">' + esc(r.t) + '</div><div class="eg-req-ai">' + I('bot') + ' ' + esc(r.ai) + '</div>' +
        (st ? '' : '<div class="eg-req-act"><button class="small go" data-action="reqDecide" data-id="' + esc(r.id) + '" data-d="approved">' + I('check') + ' Approve with conditions</button><button class="small" data-action="reqDecide" data-id="' + esc(r.id) + '" data-d="info">' + I('message') + ' Ask for information</button><button class="small danger" data-action="reqDecide" data-id="' + esc(r.id) + '" data-d="rejected">' + I('x') + ' Decline</button></div>') + '</div>';
    }) + '</div>';
    const bd = briefData(b.id);
    const sups = mb.suppliers.map((id) => CP.store.find('thirdParties', id)).filter(Boolean);
    const supTable = ui.table([
      { label: 'Supplier', render: (t) => '<a href="#/engage/thirdparties?id=' + esc(t.id) + '">' + esc(t.name) + '</a>' },
      { label: 'Criticality', render: (t) => ui.sev(t.criticality) },
      { label: 'Score', render: (t) => '<b class="num">' + t.score + '</b>' },
      { label: 'Status', render: (t) => ui.status(t.questionnaire.status || 'none') }
    ], sups, { empty: 'No supplier linked.' });

    return ui.head('Engage · Business units', 'Business CISOs', 'Each business unit sees its own cyber risk, its requests and its projects. The platform prepares the committee; the BISO brings the decisions.',
      partyPicker() + '<button class="primary" data-action="brief" data-id="' + esc(b.id) + '">' + I('sparkles') + ' Prepare the ' + esc(mb.committee.split(' · ')[0].toLowerCase()) + '</button>') +
      '<div class="metrics" style="margin-bottom:18px">' +
      ui.metric({ label: 'Business units covered', icon: 'building', value: String(bus.length), foot: '1 BISO pool · ' + CP.fmt(bus.reduce((a, x) => a + x.apps, 0)) + ' apps mapped' }) +
      ui.metric({ label: 'Average risk score', icon: 'gauge', value: String(avg), delta: '-4 pts', deltaDir: 'up', foot: 'in 6 months', spark: [65, 64, 63, 62, 61, avg] }) +
      ui.metric({ label: 'Open business requests', icon: 'list', value: String(totalOpen), foot: 'avg. answer 2.1 days (was 9)' }) +
      ui.metric({ label: 'Next committee', icon: 'clock', value: 'Wed 21', unit: 'Oct', foot: 'Payments risk committee' }) + '</div>' +
      cards +
      '<div class="grid g-3-2" style="margin-top:18px" data-tour="engage-bu360">' +
      '<div class="stack">' + ui.card(I('compass') + ' BU 360 · ' + esc(b.name), '<div class="notice info" style="margin-bottom:12px">' + esc(bd.summary) + '</div>' +
        '<h3>Talking points for the ' + esc(mb.committee) + '</h3><ol class="eg-tp">' + CP.map(bd.pts.slice(0, 5), (x) => '<li>' + esc(x) + '</li>') + '</ol>', { cls: 'accent', sub: 'Owner ' + esc(mb.owner) + ' · BISO ' + esc((CP.person(b.biso) || {}).name || ''), right: '<button class="small" data-action="brief" data-id="' + esc(b.id) + '">' + I('sparkles') + ' Full brief</button>' }) +
      ui.card('Requests from the business', reqs, { sub: 'Pre-assessed by agents · the BISO decides', right: ui.tag(openReq(b.id) + ' open', openReq(b.id) ? 'amber' : 'green') }) + '</div>' +
      '<div class="stack">' + ui.card('Security by design', CP.map(mb.projects, (pr) => '<div class="list-item"><div class="li-main"><div class="li-title">' + esc(pr.n) + '</div><div class="li-sub">' + esc(pr.ph) + ' · ' + esc(pr.note) + '</div></div>' + ui.status(pr.st) + '</div>'), { sub: 'Projects followed by the BISO' }) +
      ui.card('Third parties of this business', supTable, { sub: 'From the security graph' }) +
      ui.card('Interactions', timeline(b.id, [{ d: 'Sep 2026', ic: 'users', t: mb.committee.split(' · ')[0] + ': risk review and 4 decisions recorded.' }]), { sub: 'Messages, cases and committees' }) + '</div></div>';
  }

  /* ------------------------------------------------------------------
     Sub-tab: Regulators
     ------------------------------------------------------------------ */
  const EVIDENCE = [
    ['Register of information: ICT arrangements', 'Art. 28', 'TPRM + contracts + CMDB', 'reg'], ['Key contractual provisions', 'Art. 30', 'Contract repository', 'reg'], ['ICT third-party risk policy', 'Art. 28(2)', 'Policy repository', 'reg'],
    ['Concentration risk assessment', 'Art. 29', 'Security graph', 'reg'], ['Sub-contracting chains of critical arrangements', 'RTS Art. 28', 'TPRM', 'reg', 'gap', '31 arrangements without full chain'],
    ['Critical functions and their ICT providers', 'Art. 28', 'Security graph', 'reg'], ['Exit strategies of critical providers', 'Art. 28(8)', 'TPRM', 'reg', 'gap', '7 critical providers without tested exit plan'],
    ['Pre-contract due diligence records', 'Art. 28(4)', 'TPRM', 'reg'], ['Annual review of the register (board minutes)', 'Art. 28(3)', 'Policy repository', 'reg'], ['SLAs and monitoring of CIF services', 'Art. 30(3)', 'ITSM', 'reg'],
    ['Resilience testing programme', 'Art. 24', 'Data lake', 'test'], ['Resilience test reports, 12 months', 'Art. 25', 'Data lake', 'test'], ['Vulnerability assessments summary', 'Art. 25', 'VulnOps', 'test'], ['Scenario-based tests of critical functions', 'Art. 25', 'BCP repository', 'test'],
    ['TLPT scope and results', 'Art. 26', 'Trust & Challenge', 'test'], ['Remediation of test findings', 'Art. 24(5)', 'GRC', 'test'], ['Business continuity and DR tests', 'Art. 11', 'BCP repository', 'test'], ['Backup restoration tests', 'Art. 12', 'Backup platform', 'test'],
    ['Major ICT incident log, 12 months', 'Art. 17', 'Case history', 'inc'], ['Incident classification records', 'Art. 18', 'Case history', 'inc'], ['Notifications to the supervisor and timelines', 'Art. 19', 'Case history', 'inc', 'gap', '2 initial notifications after 4 h (5 h 10, 6 h 40)'],
    ['Post-incident reviews and lessons', 'Art. 13', 'Data lake', 'inc'], ['Board approval of the ICT risk framework', 'Art. 5', 'Policy repository', 'gov']
  ];
  function evidencePack(req) {
    const gapsKnown = CP.store.get('thirdParties').some((t) => t.questionnaire && t.questionnaire.gap) || req.collected >= 23;
    const order = EVIDENCE.map((e, i) => i).filter((i) => !EVIDENCE[i][4]).concat(EVIDENCE.map((e, i) => i).filter((i) => EVIDENCE[i][4]));
    const rank = {}; order.forEach((i, r) => { rank[i] = r; });
    const groups = { reg: 'Register and third-party risk · Art. 28 to 30', test: 'Resilience testing · Art. 24 to 26, 11 to 12', inc: 'Incidents · Art. 13, 17 to 19', gov: 'Governance · Art. 5' };
    let last = '', list = '';
    EVIDENCE.forEach((e, i) => {
      if (e[3] !== last) { list += '<div class="eg-ev-group">' + esc(groups[e[3]]) + '</div>'; last = e[3]; }
      const collected = rank[i] < req.collected;
      const isGap = e[4] === 'gap' && gapsKnown;
      const st = isGap ? (collected ? ui.tag('Collected · gap disclosed', 'amber') : ui.tag('Gap found', 'red')) : collected ? ui.status('done', 'Collected') : req.collected ? ui.status('in-progress', 'Assembling') : ui.status('new', 'Mapped');
      list += '<div class="eg-ev"><span class="n">' + (i + 1) + '</span><span>' + esc(e[0]) + (isGap ? '<br><span class="small-txt" style="color:var(--red-ink)">' + esc(e[5]) + '</span>' : '') + '</span><span class="src">' + esc(e[1]) + ' · ' + esc(e[2]) + '</span><span>' + st + '</span></div>';
    });
    const ap = CP.store.find('approvals', 'AP-RG-SUBMIT');
    const m420 = CP.store.find('comms', 'M-420');
    const b316 = CP.store.find('backlog', 'B-316'), b317 = CP.store.find('backlog', 'B-317');
    const plan = gapsKnown ? '<div class="list">' + CP.map([
      { g: '31 sub-contracting chains missing', r: '12 providers asked to complete pre-filled chains' + (m420 ? ' (' + m420.id + ' sent)' : ''), o: 'p-marc', d: '15 Nov 2026', s: m420 ? 'in-progress' : 'new' },
      { g: '7 exit plans untested', r: 'Desk tests with business owners: Atlas Payroll, ClaimsOne, LedgerLine, SwiftNet and 3 others', o: 'p-lucas', d: 'Q1 2027', s: 'new' },
      { g: '2 late notifications (> 4 h)', r: 'Control monitor on the 4-hour deadline' + (b317 ? ' (' + b317.id + ')' : '') + ' and daily register refresh' + (b316 ? ' (' + b316.id + ')' : ''), o: 'p-raj', d: '30 Nov 2026', s: b317 ? 'in-progress' : 'new' }
    ], (x) => '<div class="list-item"><div class="li-main"><div class="li-title" style="color:var(--red-ink)">' + I('alert') + ' ' + esc(x.g) + '</div><div class="li-sub">' + esc(x.r) + '</div><div class="row wrap small-txt" style="margin-top:6px;gap:8px">' + whoS(x.o) + '<span class="muted">due ' + esc(x.d) + '</span></div></div>' + ui.status(x.s) + '</div>') + '</div>' : '<div class="empty">Cross-checks running. Gaps will appear here before the supervisor sees them.</div>';
    const pct = req.collected / req.total * 100;
    return ui.card(I('gavel') + ' Supervisory request · evidence pack', '<div class="grid g-3-2"><div>' +
      '<div class="row wrap" style="margin-bottom:10px">' + ui.status(req.status) + '<span class="small-txt muted">Received Mon 13 Oct · due ' + esc(req.due) + ' (5 business days) · owner Head of Engage</span></div>' +
      '<div class="row" style="gap:12px;margin-bottom:6px"><b style="font-size:28px;color:var(--indigo);letter-spacing:-1px" class="num">' + req.collected + ' / ' + req.total + '</b><span class="small-txt muted">evidence items collected, each traced to its source system</span></div>' +
      ui.progress(pct, pct >= 100 ? 'green' : '') + '<div style="margin-top:12px">' + list + '</div></div>' +
      '<div class="stack"><div><h3>Gaps and remediation plan</h3>' + plan + '</div>' +
      (ap ? '<div><h3>Decision</h3>' + ui.decision(ap, { pulse: ap.status === 'pending' }) + '</div>' : '<div class="notice info">' + I('info') + ' Submitting the pack is a regulatory commitment (L1): when the pack is complete, the orchestrator asks you to decide, with the CISO co-signing.</div>') +
      (req.collected >= 23 ? '<button data-action="coverLetter">' + I('file') + ' Read the cover letter (draft)</button>' : '') +
      (req.status === 'submitted' ? '<div class="notice ok">' + I('checkCircle') + ' Submitted on the supervisor portal 3 days before the deadline. LoD2 re-sampled 10% of the evidence: 0 discrepancy.</div>' : '') +
      '<div class="small-txt muted">Manual baseline: 3 weeks, 6 people, 20 owners chased by email. With the platform: 2 days, gaps found by us.</div></div></div>',
    { cls: 'accent', tour: 'engage-evidence', sub: 'DORA · ICT register, resilience tests and incident log requested by the supervisor', right: ui.tag('S3 · live', 'indigo') });
  }

  function breachBanner(bre) {
    const scn = CP.player && CP.player.status().scenario;
    const inS2 = scn && scn.id === 'identity';
    const left = inS2 ? Math.max(0, 72 * 3600 - CP.clock.t) : null;
    const h = left != null ? Math.floor(left / 3600) : null, mm = left != null ? Math.floor((left % 3600) / 60) : null;
    const m415 = CP.store.find('comms', 'M-415');
    const sent = bre.status === 'submitted' || (m415 && m415.status === 'sent');
    return '<section class="eg-countdown" data-tour="engage-gdpr" aria-label="GDPR 72-hour clock"><div><div class="lbl">GDPR Art. 33 · 72 h clock</div><div class="big">' + (sent ? 'Notified' : h != null ? h + ' h ' + String(mm).padStart(2, '0') : '72 h') + '</div><div class="s">' + (sent ? 'within the deadline' : 'left · deadline ' + esc(bre.due)) + '</div></div>' +
      '<div><div class="t">' + esc(bre.item) + '</div><div class="s">Started Wed 02:13 (awareness at 02:20) · 1,200 beneficiary records (names, IBANs) · DPO informed · ' + bre.collected + ' of ' + bre.total + ' notification elements ready</div>' + ui.progress(sent ? 100 : (left != null ? (1 - left / (72 * 3600)) * 100 : 5)) + '</div>' +
      '<div class="row wrap" style="gap:6px">' + (m415 ? (m415.status === 'awaiting' ? '<button class="on-dark small" data-action="review" data-id="M-415">' + I('eye') + ' Review draft</button><button class="go small" data-action="validate" data-id="M-415">' + I('send') + ' Validate and send</button>' : ui.status(m415.status)) : '') + '</div></section>';
  }

  function renderRegulators(route) {
    const items = CP.store.get('regulatory');
    const req = CP.store.find('regulatory', 'R-DORA-REQ');
    const bre = CP.store.find('regulatory', 'R-GDPR-BRE');
    const selId = route.query.id || this.ui.reg || (req ? 'reg-sup' : bre ? 'reg-dpa' : 'reg-sup');
    const r = REGULATORS.find((x) => x.id === selId) || REGULATORS[0];
    const atRisk = items.filter((x) => x.status === 'at-risk').length;
    const ev = items.reduce((a, x) => a + x.collected, 0), evT = items.reduce((a, x) => a + x.total, 0);
    const table = ui.table([
      { label: 'Framework', render: (x) => ui.tag(esc(x.framework), 'teal') },
      { label: 'Item', render: (x) => '<span class="eg-name"><b>' + esc(x.item) + '</b><small>' + esc(x.regulator) + ' · ' + esc(x.id) + '</small></span>' },
      { label: 'Due', render: (x) => '<span class="num">' + esc(x.due) + '</span>' },
      { label: 'Owner', render: (x) => whoS(x.owner) },
      { label: 'Evidence', w: '150px', render: (x) => '<div class="small-txt num" style="margin-bottom:3px">' + CP.fmt(x.collected) + ' / ' + CP.fmt(x.total) + '</div>' + ui.progress(x.collected / x.total * 100, x.status === 'at-risk' ? 'amber' : x.status === 'submitted' ? 'green' : '') },
      { label: 'Status', render: (x) => ui.status(x.status) }
    ], items, { rowClass: (x) => 'clickable' + (REG_BY_NAME[x.regulator] === r.id ? ' sel' : ''), rowAttrs: (x) => 'data-action="selReg" data-id="' + esc(REG_BY_NAME[x.regulator] || 'reg-sup') + '"' });
    const regCards = '<div class="grid g2">' + CP.map(REGULATORS, (x) => {
      const its = regItemsFor(x.id);
      return '<button class="eg-bu' + (x.id === r.id ? ' sel' : '') + '" data-action="selReg" data-id="' + esc(x.id) + '"><span class="eg-bu-top"><span><h3>' + esc(x.name) + '</h3><span class="small-txt muted">' + esc(x.contact) + '</span></span>' + ui.tag(esc(x.fw), 'teal') + '</span>' +
        '<span class="eg-bu-meta"><span><b>' + its.length + '</b> open items</span><span><b>' + its.filter((i) => i.status === 'at-risk').length + '</b> at risk</span><span>Next: <b>' + esc(MEM_REG[x.id].meeting.when.split(' · ')[0]) + '</b></span></span></button>';
    }) + '</div>';
    return '<div data-tour="engage-regulators">' + ui.head('Engage · Regulators', 'Compliance & regulators', 'DORA, NIS2, AI Act and GDPR in one register. Agents assemble the evidence from the data lake; the Head of Engage decides what the group commits to.', partyPicker() + '<button data-action="brief" data-id="' + esc(r.id) + '">' + I('sparkles') + ' Prepare my meeting</button>') +
      '<div class="metrics" style="margin-bottom:18px">' +
      ui.metric({ label: 'Open regulatory items', icon: 'gavel', value: String(items.length), foot: items.filter((x) => x.scenario).length ? items.filter((x) => x.scenario).length + ' new this week' : '4 frameworks', flash: items.some((x) => CP.store.isNew(x)) }) +
      ui.metric({ label: 'At risk', icon: 'alert', value: String(atRisk), color: atRisk > 1 ? 'var(--red-ink)' : null, foot: atRisk ? items.filter((x) => x.status === 'at-risk').map((x) => x.framework).join(', ') : 'none' }) +
      ui.metric({ label: 'Evidence collected', icon: 'database', value: CP.pct(ev / evT * 100), foot: CP.fmt(ev) + ' of ' + CP.fmt(evT) + ' items, from the data lake' }) +
      ui.metric({ label: 'Next deadline', icon: 'clock', value: bre && bre.status !== 'submitted' ? '72 h' : req && req.status !== 'submitted' ? 'Mon 20' : '30 Nov', foot: bre && bre.status !== 'submitted' ? 'GDPR breach notification' : req && req.status !== 'submitted' ? 'DORA supervisory request' : 'DORA register of information' }) + '</div>' +
      (bre ? breachBanner(bre) : '') +
      (req ? evidencePack(req) + '<div style="height:18px"></div>' : '') +
      (!req ? '<div style="margin-bottom:18px">' + decisionsBlock((a) => a.id === 'AP-RG-SUBMIT') + '</div>' : '') +
      '<div class="eg-split"><div class="stack">' + ui.card('Regulatory register', table, { sub: 'Click an item to open the authority\'s Party 360' }) +
      ui.card('Supervisory relationships', regCards, { sub: 'Who we talk to, what we promised, what comes next' }) + '</div>' + regPanel(r) + '</div></div>';
  }

  /* ------------------------------------------------------------------
     Sub-tab: Crisis
     ------------------------------------------------------------------ */
  const HOLDING = [
    { id: 'HS-01', cs: 'C-2301', t: 'Reactive press line · FileBridge vulnerability', who: 'Press desk', agent: 'ag-grc-policy', x: 'Novalys is aware of a vulnerability affecting a file-transfer product used across the financial sector. Our teams protected the affected service within minutes and applied the vendor patch the same morning. We have no indication that client data was accessed. We are working closely with our partners and the authorities.' },
    { id: 'HS-02', cs: 'C-2301', t: 'Relationship manager FAQ · supplier vulnerability', who: 'Client-facing staff', agent: 'ag-grc-policy', x: 'If a client asks: a vulnerability in a widely used file-transfer product was published this morning. Novalys systems were protected in 6 minutes and patched. Some partners are still being checked; payroll and card services are running normally. Do not speculate on suppliers by name.' },
    { id: 'HS-03', cs: 'C-2302', t: 'Internal note · Treasury desk', who: 'Treasury staff (41)', agent: 'ag-grc-policy', x: 'Overnight, a colleague\'s account was targeted by repeated MFA requests. The account was secured within minutes and three payments are on hold for verification. Never approve an MFA request you did not start, and report it with the "Report" button. Your manager will brief you at 08:30.' },
    { id: 'HS-04', cs: 'C-2302', t: 'Client letter · beneficiaries whose IBAN was exposed', who: '1,200 data subjects', agent: 'ag-grc-controls', x: 'We are writing to inform you that on 14 October an unauthorised party accessed a file containing your company name and bank account details (IBAN). No passwords or card data were involved. Please be vigilant about any request to change payment details that claims to come from Novalys. Your relationship manager will contact you.' },
    { id: 'HS-00', cs: null, t: 'Generic reactive line · cyber incident (template v4)', who: 'Press desk', agent: 'ag-grc-policy', x: 'Novalys is investigating a cyber security event. Our response teams activated our procedures immediately and the situation is under control. Client services operate normally. We will share more information as soon as it is confirmed.' }
  ];
  const PLAYBOOKS = [
    ['Ransomware on core IT', 'p-tom', 'Jun 2026', 'Never', 74], ['Third-party compromise (supply chain)', 'p-marc', 'Mar 2026', 'Tue (C-2301)', 81], ['Personal data breach (GDPR 72 h)', 'p-sara', 'Apr 2026', 'Wed (C-2302)', 68],
    ['Payment fraud and BEC', 'p-lucas', 'Sep 2026', 'Wed (C-2302)', 77], ['DDoS on digital channels', 'p-tom', 'Sep 2025', 'Feb 2026', 85], ['Insider data theft', 'p-tom', 'Nov 2025', 'Never', 52], ['AI agent misbehaviour (kill-switch)', 'p-chloe', 'Aug 2026', 'Never', 90]
  ];
  function stakeholders() {
    const c1 = CP.store.find('cases', 'C-2301'), c2 = CP.store.find('cases', 'C-2302');
    const m410 = CP.store.find('comms', 'M-410'), m415 = CP.store.find('comms', 'M-415'), m416 = CP.store.find('comms', 'M-416'), m412 = CP.store.find('comms', 'M-412');
    const apHold = CP.store.find('approvals', 'AP-ID-HOLD'), apPatch = CP.store.find('approvals', 'AP-CTI-PATCH');
    const st = (s, d) => ({ s, d });
    const map = {
      excom: st('idle', 'Standby. Weekly cyber flash on Monday.'), dpo: st('idle', 'No personal data event.'), reg: st('idle', 'No notifiable event.'), clients: st('idle', 'No client impact.'),
      press: st('idle', 'Generic reactive line on file (v4).'), sup: st('idle', 'Routine campaigns only.'), staff: st('idle', 'Monthly awareness newsletter.'), biz: st('idle', 'Monthly BU reviews.')
    };
    if (c1) {
      map.sup = m410 && m410.status === 'sent' ? st('done', '14 FileBridge suppliers questioned (M-410)' + (m412 ? '; Atlas Payroll called and flow restricted (M-412).' : '.')) : st(m410 && m410.status === 'awaiting' ? 'wait' : 'todo', '14 suppliers to question: draft M-410 awaiting the third-party risk lead.');
      map.excom = apPatch && apPatch.status !== 'pending' ? st('done', 'CISO decided the emergency patch at ' + (apPatch.decidedAt || '') + '; 1-page brief ' + (c1.status === 'closed' ? 'sent.' : 'in progress.')) : st('wait', 'CISO briefed; emergency patch decision pending.');
      map.press = st('todo', 'Reactive line drafted (HS-01). Use only if asked.');
      map.reg = st('idle', 'DORA major-incident criteria not met: no notification.');
      map.biz = st('done', 'Payments, Insurance and Group IT BISOs informed' + (m412 ? '; the Business CISO owns the Atlas flow decision.' : '.'));
      map.clients = st('idle', 'No client impact: services running.');
    }
    if (c2) {
      map.dpo = st('done', 'DPO informed at 02:20: 1,200 IBANs exposed.');
      map.reg = m415 ? (m415.status === 'sent' ? st('done', 'DPA notified (M-415) within 72 h. DORA: not a major incident.') : st('wait', 'DPA notification M-415 drafted, awaiting the Head of Engage.')) : st('todo', 'GDPR assessment in progress (72 h clock).');
      map.excom = apHold ? (apHold.status === 'pending' ? st('wait', 'Head of Treasury called: suspend and hold €4.2 M?') : st('done', 'Head of Treasury decided at ' + (apHold.decidedAt || '') + '. ExCom flash at 07:00.')) : st('todo', 'Head of Treasury to call if payments are involved.');
      map.clients = st('todo', '1,200 beneficiaries: letter HS-04 drafted, DPO to decide on Art. 34.');
      map.staff = m416 ? st('done', 'Micro-training M-416 sent to 312 finance staff.') : st('todo', 'Treasury desk note HS-03 ready for 08:30.');
      map.press = st('todo', 'Reactive line on file; no media interest detected.');
      map.biz = st('done', 'Head of Treasury in the loop for the payment decision; Payments BISO briefed.');
    }
    return [
      ['excom', 'ExCom and CISO', 'users'], ['biz', 'Business owners', 'building'], ['dpo', 'DPO', 'lock'], ['reg', 'Regulators', 'gavel'],
      ['clients', 'Clients', 'user'], ['press', 'Press and social', 'megaphone'], ['sup', 'Suppliers', 'link'], ['staff', 'Staff', 'graduation']
    ].map((x) => Object.assign({ key: x[0], label: x[1], icon: x[2] }, map[x[0]]));
  }
  function renderCrisis() {
    const S = this.ui;
    const cases = CP.store.get('cases');
    const hi = cases.filter((c) => c.severity === 'high' || c.severity === 'critical');
    const active = hi.filter((c) => c.status !== 'closed');
    const critOpen = active.some((c) => c.severity === 'critical' && c.status === 'open');
    const level = critOpen ? 2 : active.length ? 1 : 0;
    const lvLabel = ['Level 0 · Business as usual', 'Level 1 · Enhanced monitoring', 'Level 2 · Crisis cell on standby', 'Level 3 · Crisis cell activated'][level];
    const stk = stakeholders();
    const hs = HOLDING.filter((h) => !h.cs || cases.find((c) => c.id === h.cs));
    const hsAwait = hs.filter((h) => !(S.hs || {})[h.id]).length;
    const incTable = ui.table([
      { label: 'Case', render: (c) => '<span class="eg-name"><b>' + esc(c.id) + ' · ' + esc(c.title) + '</b><small>' + esc(c.summary || '') + '</small></span>' },
      { label: 'Severity', render: (c) => ui.sev(c.severity) },
      { label: 'Status', render: (c) => ui.status(c.status) },
      { label: 'Opened', render: (c) => '<span class="num small-txt">' + esc(c.opened) + '</span>' },
      { label: 'Domains', render: (c) => CP.map(c.domains || [], (d) => ui.dom(d) + ' ') }
    ], hi, { empty: 'No high or critical incident. Medium and low cases stay with Run.' });
    const tl = CP.store.get('feed').filter((f) => f.scenario && (f.scenario === 'cti' || f.scenario === 'identity')).slice(0, 8);
    const lessons = [];
    if (CP.store.find('cases', 'C-2301')) lessons.push(['Tue · C-2301', 'Supplier questionnaire answered by 11 of 14 in 4 h: keep pre-filled campaigns as the default for supply-chain advisories.']);
    if (CP.store.find('cases', 'C-2302')) lessons.push(['Wed · C-2302', 'Same operator could create and approve beneficiaries: 27 toxic combinations under review; phishing-resistant MFA for approvers (B-315).']);
    lessons.push(['Jun 2026 · exercise', 'Legal sign-off on press lines took 47 min: pre-approved templates by incident type now on file.'], ['Mar 2026 · exercise', 'Supplier contacts were outdated for 18% of critical providers: now refreshed monthly by the TPRM Agent.'], ['Nov 2025 · incident', 'DDoS on mobile banking: status page updated after 52 min. Now automatic after 10 min of degradation.']);

    return ui.head('Engage · Crisis', 'Crisis & incident management', 'The crisis manager runs the crisis cell. The platform keeps the situation, the stakeholder map and the holding statements ready, so that people spend their time deciding.',
      '<button data-action="playbook" data-id="0">' + I('book') + ' Playbooks</button><button class="primary" data-action="exercise">' + I('play') + ' Prepare next exercise</button>') +
      '<div class="metrics" style="margin-bottom:18px">' +
      '<div class="metric"><div class="label">' + I('alert') + 'Crisis level</div><div class="value" style="font-size:22px;letter-spacing:-.4px;color:' + (level >= 2 ? 'var(--red-ink)' : level ? '#8a5a05' : 'var(--green-ink)') + '">' + esc(lvLabel) + '</div><div class="eg-level">' + [1, 2, 3].map((i) => '<i class="' + (i <= level ? 'on' + (level >= 2 ? ' l3' : '') : '') + '"></i>').join('') + '</div></div>' +
      ui.metric({ label: 'Active high / critical incidents', icon: 'shield', value: String(active.length), color: active.length ? 'var(--red-ink)' : null, foot: hi.length + ' this week', flash: active.some((c) => CP.store.isNew(c)) }) +
      ui.metric({ label: 'Stakeholders informed', icon: 'users', value: stk.filter((x) => x.s === 'done').length + ' / ' + stk.filter((x) => x.s !== 'idle').length, foot: stk.filter((x) => x.s === 'todo' || x.s === 'wait').length + ' to inform or decide' }) +
      ui.metric({ label: 'Holding statements awaiting', icon: 'megaphone', value: String(hsAwait), foot: 'drafted by agents, validated by Engage' }) + '</div>' +
      '<div class="grid g-3-2"><div class="stack">' +
      ui.card('Active incidents', incTable, { sub: 'High and critical cases from the shared case store' }) +
      ui.card('Stakeholder map · who to inform', '<div class="eg-stk">' + CP.map(stk, (x) => '<div class="eg-stk-i ' + x.s + '"><div class="h">' + I(x.icon) + esc(x.label) + '</div><div class="d">' + esc(x.d) + '</div>' +
        (x.s === 'done' ? ui.status('done', 'Informed') : x.s === 'wait' ? ui.status('pending', 'Decision pending') : x.s === 'todo' ? '<button class="small" data-action="inform" data-id="' + esc(x.key) + '">' + I('send') + ' Draft message</button>' : ui.tag('Standby', 'outline')) + '</div>') + '</div>', { sub: 'Built from the cases, decisions and messages in the platform' }) +
      ui.card('Holding statements', CP.map(hs, (h) => {
        const ok = (S.hs || {})[h.id];
        return '<div class="eg-hs"><div class="row wrap"><span class="eg-hs-t">' + esc(h.t) + '</span><span class="spacer"></span>' + (h.cs ? '<span class="mono small-txt muted">' + esc(h.cs) + '</span>' : '') + (ok ? ui.status('done', 'Validated · on file') : ui.status('awaiting')) + '</div>' +
          '<div class="small-txt muted">For ' + esc(h.who) + ' · drafted by ' + esc(CP.actor(h.agent).name) + '</div><div class="eg-hs-x">' + esc(h.x) + '</div>' +
          '<div class="row" style="gap:6px"><button class="small" data-action="hsReview" data-id="' + esc(h.id) + '">' + I('eye') + ' Review</button>' + (ok ? '' : '<button class="small go" data-action="hsValidate" data-id="' + esc(h.id) + '">' + I('check') + ' Validate</button>') + '</div></div>';
      }), { sub: 'Agents draft from the facts in the case; nothing leaves without Engage' }) +
      '</div><div class="stack">' +
      ui.card('Crisis timeline', tl.length ? ui.feed(tl, 8) : '<div class="empty">No incident timeline. During an incident, every agent action and human decision lands here, time-stamped.</div>', { sub: 'Shared log of the incident' }) +
      ui.card('On-call roster · week 42', '<div class="list">' + CP.map([['Crisis manager on duty', 'p-tom'], ['Deputy (business)', 'p-lucas'], ['CISO', 'p-elena'], ['DPO', 'p-sara'], ['Run supervisor', 'p-chloe'], ['Business owner, payments', 'p-hugo']], (x) => '<div class="list-item"><div class="li-main"><div class="li-sub">' + esc(x[0]) + '</div></div>' + whoS(x[1]) + '</div>') +
        '<div class="list-item"><div class="li-main"><div class="li-sub">Group communications</div></div><b class="small-txt">Comms duty officer (on call)</b></div></div>', { sub: 'Paged by the orchestrator when a decision needs them' }) +
      ui.card('Next crisis exercise', '<div class="eyebrow" style="margin-bottom:4px">Thu 5 Nov 2026 · 09:00 to 12:30</div><h3 style="margin:0 0 6px">Operation Black Ledger</h3><p class="small-txt" style="margin:0 0 10px">Ransomware on the payments chain with a supplier twist. ExCom and crisis cell, run in CrisisMaker. Injects drafted by the platform from real cases' + (CP.store.find('cases', 'C-2301') ? ' (C-2301' + (CP.store.find('cases', 'C-2302') ? ', C-2302' : '') + ')' : '') + '.</p>' +
        '<div class="row between small-txt"><span>Preparation</span><b class="num">' + (60 + (CP.store.find('cases', 'C-2301') ? 10 : 0) + (CP.store.find('cases', 'C-2302') ? 10 : 0)) + '%</b></div>' + ui.progress(60 + (CP.store.find('cases', 'C-2301') ? 10 : 0) + (CP.store.find('cases', 'C-2302') ? 10 : 0)) +
        '<div class="row" style="margin-top:12px;gap:6px"><button class="small primary" data-action="exercise">' + I('play') + ' Open in CrisisMaker</button><button class="small" data-action="playbook" data-id="0">' + I('book') + ' Linked playbook</button></div>', { cls: 'accent' }) +
      ui.card('Playbooks', ui.table([
        { label: 'Playbook', render: (p) => '<button class="linkish" style="all:unset;cursor:pointer;color:var(--indigo);font-weight:600" data-action="playbook" data-id="' + PLAYBOOKS.indexOf(p) + '">' + esc(p[0]) + '</button>' },
        { label: 'Last exercised', render: (p) => '<span class="small-txt">' + esc(p[2]) + '</span>' },
        { label: 'Automated', render: (p) => '<span class="small-txt num">' + p[4] + '%</span>' }
      ], PLAYBOOKS), { sub: 'Share of steps run by agents' }) +
      ui.card('Lessons learned', '<div class="list">' + CP.map(lessons, (l) => '<div class="list-item"><div class="li-main"><div class="li-sub mono">' + esc(l[0]) + '</div><div class="small-txt" style="line-height:1.5;margin-top:2px">' + esc(l[1]) + '</div></div></div>') + '</div>') +
      '</div></div>';
  }

  /* ------------------------------------------------------------------
     Sub-tab: Culture
     ------------------------------------------------------------------ */
  const TRAININGS = [
    { id: 'L-402', ts: '02 Oct', subject: 'Spot a deepfake CFO call', who: 'Executives and assistants (186)', completion: 88 },
    { id: 'L-398', ts: '24 Sep', subject: 'Secrets never go in code', who: 'Developers (2,350)', completion: 76 },
    { id: 'L-391', ts: '18 Sep', subject: 'Account recovery scams on the phone', who: 'Contact centre (1,420)', completion: 91 }
  ];
  function renderCulture() {
    const S = this.ui;
    const learn = CP.store.get('comms').filter((m) => m.channel === 'Learning platform');
    const m416 = CP.store.find('comms', 'M-416');
    const pops = [
      ['Finance staff on push MFA', 312, m416 ? 'medium' : 'high', 'MFA fatigue, payment approval rights', m416 ? 'Micro-training sent (M-416)' : 'Targeted training proposed'],
      ['Executives and assistants', 186, 'high', 'Spear-phishing, deepfake voice', 'L-402 completed 88%'],
      ['IT administrators', 420, 'high', 'Privileged access, MFA bypass', 'Hardware keys rollout 86%'],
      ['Contact centre', 1420, 'medium', 'Social engineering on account recovery', 'L-391 completed 91%'],
      ['Developers', 2350, 'medium', 'Secrets in code, typosquatted packages', 'L-398 completed 76%'],
      ['New joiners (< 90 days)', 640, 'medium', 'Low completion of onboarding module (71%)', 'Manager nudges weekly'],
      ['Branch staff', 9800, 'low', 'Tailgating, USB devices', 'Annual module']
    ];
    const clickBU = [['Insurance', 6.2, 7.9], ['Retail Banking', 4.8, 6.1], ['Corporate & Investment', 3.9, 5.2], ['Payments & Treasury', 3.1, 4.4], ['Asset Management', 2.7, 3.6], ['Group IT & Operations', 2.2, 2.9]];
    const chart = '<div style="display:grid;gap:10px">' + CP.map(clickBU, (r) => '<div class="eg-clk" style="display:grid;grid-template-columns:170px 1fr 54px;gap:10px;align-items:center;font-size:12.5px"><span>' + esc(r[0]) + '</span><span style="display:grid;gap:3px"><span style="height:12px;background:#eeebf4;position:relative" title="September: ' + r[1] + '%"><span style="position:absolute;inset:0 auto 0 0;width:' + (r[1] / 8 * 100) + '%;background:' + (r[1] > 5 ? 'var(--red)' : r[1] > 3.5 ? 'var(--amber)' : 'var(--indigo)') + '"></span></span><span style="height:5px;background:#f4f2f8;position:relative" title="June: ' + r[2] + '%"><span style="position:absolute;inset:0 auto 0 0;width:' + (r[2] / 8 * 100) + '%;background:#c9c3d8"></span></span></span><b class="num" style="text-align:right">' + r[1] + '%</b></div>') +
      '<div class="row small-txt muted" style="gap:14px;margin-top:4px"><span class="row" style="gap:5px"><i style="width:10px;height:10px;background:var(--indigo);display:inline-block"></i>September simulation</span><span class="row" style="gap:5px"><i style="width:10px;height:4px;background:#c9c3d8;display:inline-block"></i>June simulation</span></div></div>';
    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const trainings = learn.map((m) => ({ id: m.id, ts: m.ts, subject: m.subject, who: m.partyLabel || partyLabel(m), completion: m.status === 'sent' ? 41 : 0, _m: m })).concat(TRAININGS);
    const upcoming = [
      ['Mon 20 Oct', 'Q4 phishing simulation: parcel delivery + MFA prompt', 'All staff (38,000)', 'ready'],
      ['Mon 26 Oct', 'Phishing-resistant MFA enrolment drive', 'Payment approvers (1,140)', m416 ? 'ready' : 'draft'],
      ['Thu 5 Nov', 'ExCom tabletop: ransomware on payments (CrisisMaker)', 'ExCom (12)', 'ready'],
      ['Thu 12 Nov', 'Secure coding challenge', 'Developers (2,350)', 'draft']
    ].concat(S.newCampaigns || []);
    return ui.head('Engage · Culture', 'Culture & engagement', 'The culture lead sends training where the risk is, not to everyone. Agents turn real incidents into short, anonymised modules; humans choose the audience and validate.',
      '<button class="primary" data-action="trainingNew">' + I('sparkles') + ' New targeted micro-training</button>') +
      '<div class="metrics" style="margin-bottom:18px">' +
      ui.metric({ label: 'Phishing click rate', icon: 'mail', value: '4.1', unit: '%', delta: '-5.7 pts', deltaDir: 'up', foot: 'in 12 months', spark: [9.8, 8.4, 7.2, 6.1, 5.2, 4.1], sparkColor: 'var(--green-ink)' }) +
      ui.metric({ label: 'Report rate', icon: 'flag', value: '63', unit: '%', delta: '+32 pts', deltaDir: 'up', foot: 'users who report the simulation', spark: [31, 36, 43, 49, 55, 63] }) +
      ui.metric({ label: 'Mandatory training', icon: 'graduation', value: '94', unit: '%', foot: 'completion · 2,280 late' }) +
      ui.metric({ label: 'Human risk index', icon: 'users', value: m416 ? '36' : '38', unit: '/100', foot: m416 ? '-2 after targeted MFA module' : 'lower is better', flash: !!(m416 && CP.store.isNew(m416)) }) + '</div>' +
      '<div class="grid g2">' + ui.card('Phishing simulation · click rate by business unit', chart, { sub: 'September campaign, 38,000 recipients' }) +
      ui.card('Click rate and report rate · 12 months', ui.line([{ label: 'Report %', color: 'var(--green-ink)', values: [31, 34, 36, 40, 43, 45, 49, 52, 55, 58, 60, 63] }, { label: 'Click %', color: 'var(--red)', values: [9.8, 9.1, 8.4, 8.0, 7.2, 6.9, 6.1, 5.8, 5.2, 4.9, 4.6, 4.1] }], months, { w: 600, h: 210, min: 0, max: 70, label: 'Click and report rates' }), { sub: 'Group-wide monthly simulations' }) + '</div>' +
      '<div class="grid g-3-2" style="margin-top:18px">' +
      ui.card('Human risk by population', ui.table([
        { label: 'Population', render: (p) => '<b>' + esc(p[0]) + '</b>' }, { label: 'People', render: (p) => '<span class="num">' + CP.fmt(p[1]) + '</span>' },
        { label: 'Risk', render: (p) => ui.sev(p[2]) }, { label: 'Main driver', render: (p) => '<span class="small-txt">' + esc(p[3]) + '</span>' }, { label: 'Action', render: (p) => '<span class="small-txt">' + esc(p[4]) + '</span>' }
      ], pops, { rowClass: (p) => (m416 && p[0].indexOf('push MFA') >= 0 ? ' new' : '') }), { sub: 'Computed from identity, access rights, simulations and incidents in the graph' }) +
      '<div class="stack">' + ui.card('Targeted micro-trainings', '<div class="list">' + CP.map(trainings, (t) => '<div class="list-item' + (t._m ? ui.newCls(t._m) : '') + '"><div class="li-main"><div class="li-title">' + (t._m ? '<button class="linkish" style="all:unset;cursor:pointer;color:var(--indigo);font-weight:600" data-action="review" data-id="' + esc(t.id) + '">' + esc(t.subject) + '</button>' : esc(t.subject)) + '</div><div class="li-sub">' + esc(t.id) + ' · ' + esc(t.ts) + ' · ' + esc(t.who) + (t._m ? ' · drafted by ' + esc(CP.actor(t._m.author).name) + ', validated by ' + esc((CP.person(t._m.validator) || {}).name || '') : '') + '</div>' +
        (t._m && t._m.status !== 'sent' ? '' : '<div class="row" style="gap:8px;margin-top:5px">' + ui.progress(t.completion, t.completion > 80 ? 'green' : '') + '<span class="small-txt num">' + t.completion + '%' + (t._m ? ' in 2 h' : '') + '</span></div>') + '</div>' + (t._m ? ui.status(t._m.status) : '') + '</div>') + '</div>', { sub: 'Learning platform · store messages' }) +
      ui.card('Upcoming campaigns', '<div class="list">' + CP.map(upcoming, (u) => '<div class="list-item"><div class="li-main"><div class="li-title">' + esc(u[1]) + '</div><div class="li-sub">' + esc(u[0]) + ' · ' + esc(u[2]) + '</div></div>' + ui.status(u[3] === 'ready' ? 'on-track' : u[3] === 'awaiting' ? 'awaiting' : 'draft', u[3] === 'ready' ? 'Ready' : null) + '</div>') + '</div>') + '</div></div>';
  }

  /* ------------------------------------------------------------------
     Sub-tab: Outbox
     ------------------------------------------------------------------ */
  function renderComms() {
    const S = this.ui;
    const all = allComms();
    const f = S.out || 'all';
    const rows = all.filter((m) => f === 'all' || m.status === f);
    const n = (s) => all.filter((m) => m.status === s).length;
    const table = ui.table([
      { label: 'Time', render: (m) => '<span class="num small-txt mono">' + esc(m.ts) + '</span>' },
      { label: 'Message', render: (m) => '<span class="eg-name" style="display:block;min-width:240px"><b>' + esc(m.subject) + '</b><small>' + esc(m.id) + ' · ' + esc(m.channel) + (m.scenario ? ' · ' + esc((CP.scenarioById(m.scenario) || {}).n || '') : '') + '</small></span>' },
      { label: 'Party', render: (m) => { const p = party(m.party); return p ? '<a href="#/engage/' + (p.kind === 'tp' ? 'thirdparties' : p.kind === 'bu' ? 'business' : 'regulators') + '?id=' + esc(p.id) + '">' + esc(partyLabel(m)) + '</a>' : '<span>' + esc(partyLabel(m)) + '</span>'; } },
      { label: 'Drafted by', render: (m) => whoS(m.author) },
      { label: 'Validator', render: (m) => m.validator ? whoS(m.validator) : '<span class="muted">Standing approval</span>' },
      { label: 'Status', render: (m) => ui.status(m.status) + (GATED[m.id] ? '<div class="small-txt muted" style="margin-top:3px">gate ' + esc(GATED[m.id]) + '</div>' : '') },
      { label: '', render: commRowActions }
    ], rows, { empty: 'No message with this status.' });
    const pill = (v, l) => '<button class="' + (f === v ? 'active' : '') + '" data-action="outFilter" data-id="' + v + '">' + l + '</button>';
    return '<div data-tour="engage-outbox">' + ui.head('Engage · Outbox', 'Outbox', 'Every message that leaves cyber, in one place. Agents draft from the shared memory; a named Engage validator approves each external message (L1). Nothing is sent by an agent alone.', partyPicker()) +
      '<div class="metrics" style="margin-bottom:18px">' +
      ui.metric({ label: 'Awaiting validation', icon: 'hourglass', value: String(n('awaiting')), color: n('awaiting') ? '#8a5a05' : null, foot: 'external comms are L1', flash: all.some((m) => m.status === 'awaiting' && CP.store.isNew(m)) }) +
      ui.metric({ label: 'Sent this week', icon: 'send', value: String(212 + n('sent') + n('answered')), foot: '100% drafted by agents' }) +
      ui.metric({ label: 'Median validation time', icon: 'clock', value: '6', unit: 'min', delta: '-3 h', deltaDir: 'up', foot: 'vs manual drafting' }) +
      ui.metric({ label: 'Answer rate', icon: 'message', value: '91', unit: '%', foot: 'suppliers within deadline (was 54%)' }) + '</div>' +
      '<div class="stack">' + ui.card('Messages', '<div class="pill-tabs" style="margin-bottom:12px">' + pill('all', 'All · ' + all.length) + pill('awaiting', 'Awaiting · ' + n('awaiting')) + pill('draft', 'Draft · ' + n('draft')) + pill('sent', 'Sent · ' + n('sent')) + pill('answered', 'Answered · ' + n('answered')) + '</div>' + table, { sub: 'Store comms and the archive: suppliers, regulators, business units, staff' }) +
      '<div class="grid g2">' + ui.card('Who validates what', CP.map([
        ['send', 'Suppliers (portal, phone)', 'Third-party risk lead · L1', 'Standing approval for the DORA sub-contracting template (SA-2026-07).'],
        ['gavel', 'Regulators and authorities', 'Head of Engage · L1', 'CISO co-signs any disclosure of a gap.'],
        ['building', 'Business units', 'Business CISO · L1', 'Monthly reviews pre-approved by format.'],
        ['megaphone', 'Press and clients', 'Crisis manager + Group comms · L1', 'Holding statements validated in advance by incident type.'],
        ['graduation', 'Staff training', 'Culture lead · L1', 'Anonymised cases only; audience chosen by a human.']
      ], (r) => '<div class="eg-rule">' + I(r[0]) + '<div><b>' + esc(r[1]) + '</b> · <span class="muted">' + esc(r[2]) + '</span><div class="small-txt muted">' + esc(r[3]) + '</div></div></div>'), { sub: 'Decision rights for external communication' }) +
      ui.card('Why it matters', '<p class="small-txt" style="margin:0 0 8px">Before the platform: 3 hours to draft a supplier questionnaire, 3 weeks to collect 11 answers, and no single place to see what the group told whom.</p><p class="small-txt" style="margin:0">Now: agents write from the facts in the graph, Engage validates in minutes, and every message lands in the party\'s memory for the next meeting.</p>') +
      '</div></div></div>';
  }

  /* ------------------------------------------------------------------
     Modals
     ------------------------------------------------------------------ */
  function commBody(m) {
    let b = BODIES[m.id] || m.body;
    if (!b || b.length < 30) b = 'Drafted by ' + CP.actor(m.author).name + ' from the Party 360 memory.\n\n' + m.subject + '\n\n(Message generated from the case facts and the party history.)';
    if (m.id === 'M-410') b = b.replace('{version}', '8.7 / 9.0 / 9.1, pre-filled per supplier');
    return b;
  }
  function openReview(id) {
    const m = findComm(id); if (!m) return;
    const gate = GATED[m.id] && CP.store.find('approvals', GATED[m.id]);
    const from = m.channel === 'Regulator portal' ? 'Head of Engage · Compliance & regulators, Novalys Group' : m.channel === 'Learning platform' ? 'Cyber Culture team <cyberculture@novalys.example>' : m.channel === 'Supplier portal' || m.channel === 'Phone + portal' ? 'Novalys Third-Party Security <tprm@novalys.example>' : 'Novalys Cyber <cyber@novalys.example>';
    const body = '<div class="row wrap" style="margin-bottom:12px">' + ui.status(m.status) + ui.tag(esc(m.channel), 'outline') + '<span class="small-txt muted">' + esc(m.id) + ' · ' + esc(m.ts) + '</span><span class="spacer"></span><span class="small-txt">Drafted by</span>' + whoS(m.author) + (m.validator ? '<span class="small-txt">Validator</span>' + whoS(m.validator) : '') + '</div>' +
      '<div class="eg-mail"><div class="eg-mh"><div><span>From</span>' + esc(from) + '</div><div><span>To</span>' + esc(partyLabel(m)) + '</div><div><span>Subject</span><b>' + esc(m.subject) + '</b></div></div><div class="eg-mb">' + esc(commBody(m)) + '</div></div>' +
      (m.status === 'awaiting' ? '<div class="notice info" style="margin-top:12px">' + I('bot') + ' Checks by the platform: facts traced to ' + (m.scenario === 'identity' ? 'case C-2302 and the collaboration suite audit log' : m.scenario === 'cti' ? 'case C-2301 and the security graph' : 'the Party 360 memory') + ' · no confidential indicator leaked · tone policy passed · recipient verified in the directory.</div>' : '') +
      (m.validatedBy ? '<div class="small-txt muted" style="margin-top:10px">Validated by ' + esc((CP.person(m.validatedBy) || {}).name || '') + ' at ' + esc(m.validatedAt || '') + '</div>' : '');
    let foot = '<button data-close-modal>Close</button>';
    if (m.status === 'awaiting' && gate && gate.status === 'pending') foot = '<button data-close-modal>Close</button><button class="primary" data-open-drawer>' + I('users') + ' Decide in the decisions drawer</button>';
    else if (m.status === 'awaiting') foot = '<button class="danger" data-action="sendBack" data-id="' + esc(m.id) + '">' + I('rollback') + ' Send back to the agent</button><button data-close-modal>Close</button><button class="go" data-action="validate" data-id="' + esc(m.id) + '">' + I('send') + ' Validate and send</button>';
    CP.modal(I('mail') + ' ' + esc(m.subject), body, foot);
  }
  const POPULATIONS = ['Payment approvers on push MFA (1,140)', 'IT administrators (420)', 'Executives and assistants (186)', 'Contact centre (1,420)', 'New joiners (640)'];

  /* ------------------------------------------------------------------
     Screen
     ------------------------------------------------------------------ */
  CP.screen({
    id: 'engage', part: 2, role: 'engage', label: 'Engage', icon: 'megaphone',
    ui: { crit: 'all', camp: 'all', fb: 'all', q: '', out: 'all', req: {}, hs: {} },
    render(route) {
      const sub = route.sub || 'thirdparties';
      const tps = CP.store.get('thirdParties');
      const attn = tps.filter((t) => ['flagged', 'overdue'].indexOf(t.questionnaire.status) >= 0).length;
      const pendE = CP.store.pendingApprovals('engage').length;
      const regAttn = CP.store.get('regulatory').filter((r) => r.status === 'at-risk').length;
      const crisisN = CP.store.get('cases').filter((c) => (c.severity === 'high' || c.severity === 'critical') && c.status !== 'closed').length;
      const awaiting = CP.store.get('comms').filter((m) => m.status === 'awaiting').length;
      const bizN = Object.keys(MEM_BU).reduce((a, k) => a + MEM_BU[k].requests.filter((r) => !this.ui.req[r.id]).length, 0);
      const groups = [
        { label: 'STAKEHOLDERS', tabs: [
          { id: 'thirdparties', label: 'Third parties', icon: 'link', count: (attn + (pendE && CP.store.pendingApprovals('engage').some((a) => a.id === 'AP-CTI-TPRM') ? 1 : 0)) || '', warn: true },
          { id: 'business', label: 'Business units', icon: 'building', count: bizN },
          { id: 'regulators', label: 'Regulators', icon: 'gavel', count: regAttn || '', warn: true }
        ] },
        { label: 'EVENTS', tabs: [
          { id: 'crisis', label: 'Crisis', icon: 'alert', count: crisisN || '', warn: true },
          { id: 'culture', label: 'Culture', icon: 'graduation' }
        ] },
        { label: 'WORKSPACE', tabs: [{ id: 'comms', label: 'Outbox', icon: 'send', count: awaiting || '', warn: true }] }
      ];
      const right = ui.av('p-amira', 'sm') + '<span>' + esc(CP.person('p-amira').name) + '</span>';
      const R = { thirdparties: renderThirdParties, business: renderBusiness, regulators: renderRegulators, crisis: renderCrisis, culture: renderCulture, comms: renderComms }[sub] || renderThirdParties;
      return ui.tabbar('engage', groups, sub, right) + '<div class="eg">' + R.call(this, route) + '</div>';
    },
    mount(root, route) {
      const inp = root.querySelector('#eg-tp-q');
      if (inp) {
        inp.addEventListener('input', () => { this.ui.q = inp.value; this.ui._refocus = true; CP.render(); });
        if (this.ui._refocus) { inp.focus(); const n = inp.value.length; try { inp.setSelectionRange(n, n); } catch (e) { /* search inputs in some engines */ } this.ui._refocus = false; }
      }
      if (this.ui._scrollPanel) {
        this.ui._scrollPanel = false;
        const pn = root.querySelector('.eg-panel');
        if (pn && window.innerWidth <= 1280) setTimeout(() => pn.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
      }
      root.querySelectorAll('tr[data-action="selTp"]').forEach((tr) => tr.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); CP.go('engage', 'thirdparties', { id: tr.dataset.id }); } }));
    },
    actions: {
      selTp(el) { this.ui._scrollPanel = true; CP.go('engage', 'thirdparties', { id: el.dataset.id }); },
      selBu(el) { this.ui.bu = el.dataset.id; CP.go('engage', 'business', { id: el.dataset.id }); },
      selReg(el) { this.ui.reg = el.dataset.id; this.ui._scrollPanel = true; CP.go('engage', 'regulators', { id: el.dataset.id }); },
      closeParty(el, ev, route) { CP.go('engage', route.sub || 'thirdparties'); },
      openParty(el) {
        const p = party(el.value); if (!p) return;
        CP.go('engage', p.kind === 'tp' ? 'thirdparties' : p.kind === 'bu' ? 'business' : 'regulators', { id: p.id });
      },
      tpCrit(el) { this.ui.crit = el.value; CP.render(); },
      tpCamp(el) { this.ui.camp = el.value; CP.render(); },
      tpFb(el) { this.ui.fb = el.value; CP.render(); },
      outFilter(el) { this.ui.out = el.dataset.id; CP.render(); },
      brief(el) {
        const id = el.dataset.id; const p = party(id); if (!p) return;
        CP.modal(I('sparkles') + ' Meeting brief · ' + esc(p.name), briefHtml(id),
          '<button data-close-modal>Close</button><button data-action="briefCopy" data-id="' + esc(id) + '">' + I('file') + ' Save to my notes</button><button class="primary" data-action="briefShare" data-id="' + esc(id) + '">' + I('send') + ' Share with internal attendees</button>');
      },
      briefCopy(el) { CP.toast('Brief saved to your notes and to the Party 360 memory of ' + party(el.dataset.id).name + '.'); CP.closeModal(); },
      briefShare(el) {
        const p = party(el.dataset.id);
        CP.feed({ actor: 'p-amira', domain: 'human', level: 'info', text: 'shared the AI meeting brief for ' + p.name + ' with internal attendees.' });
        CP.toast('Brief shared with the internal attendees (calendar invite updated).'); CP.closeModal();
      },
      ask(el) {
        const id = el.dataset.id; const p = party(id); const d = askDraft(id);
        CP.modal(I('message') + ' Ask a question · ' + esc(p.name),
          '<div class="row wrap" style="margin-bottom:10px">' + whoS(d.author) + '<span class="small-txt muted">drafted this from the Party 360 memory in 3 s · channel ' + esc(d.channel) + ' · validator</span>' + whoS(d.validator) + '</div>' +
          '<label class="small-txt muted" for="eg-ask-subj">Subject</label><input id="eg-ask-subj" style="width:100%;border:1px solid var(--line);padding:8px 10px;margin:4px 0 10px" value="' + esc(d.subject) + '">' +
          '<label class="small-txt muted" for="eg-ask-body">Message (edit freely)</label><textarea id="eg-ask-body" class="eg-textarea">' + esc(d.text) + '</textarea>' +
          '<div class="notice info" style="margin-top:10px">' + I('lock') + ' External communication is L1: the message goes to the Outbox and leaves only once the ' + esc(((CP.person(d.validator) || {}).name || '').toLowerCase()) + ' validates it.</div>',
          '<button data-close-modal>Cancel</button><button class="primary" data-action="askSubmit" data-id="' + esc(id) + '">' + I('send') + ' Submit for validation</button>');
      },
      askSubmit(el) {
        const id = el.dataset.id; const p = party(id); const d = askDraft(id);
        const subj = (document.getElementById('eg-ask-subj') || {}).value || d.subject;
        const body = (document.getElementById('eg-ask-body') || {}).value || d.text;
        const mid = 'M-' + (++SEQ.n);
        BODIES[mid] = body;
        CP.store.apply({ op: 'add', coll: 'comms', item: { id: mid, ts: now(), party: id, channel: d.channel, subject: subj, status: 'awaiting', author: d.author, validator: d.validator } });
        CP.feed({ actor: d.author, domain: 'grc', level: 'action', text: 'drafted ' + mid + ' to ' + p.name + ' ("' + subj + '"), awaiting validation.' });
        CP.closeModal(); CP.toast(mid + ' queued in the Outbox for the ' + ((CP.person(d.validator) || {}).name || 'validator').toLowerCase() + '.');
      },
      review(el) { openReview(el.dataset.id); },
      validate(el) {
        const m = CP.store.find('comms', el.dataset.id); if (!m || m.status !== 'awaiting') return;
        const by = m.validator || 'p-amira';
        CP.store.apply([{ op: 'update', coll: 'comms', id: m.id, patch: { status: 'sent', validatedBy: by, validatedAt: now() } }, { op: 'inc', path: 'kpis.humanDecisions', by: 1 }]);
        if (m.id === 'M-415') CP.store.apply({ op: 'update', coll: 'regulatory', id: 'R-GDPR-BRE', patch: { status: 'submitted', collected: 6 } });
        CP.feed({ actor: by, domain: 'human', level: 'decision', text: 'validated and sent ' + m.id + ' to ' + partyLabel(m) + ': ' + m.subject });
        CP.closeModal(); CP.toast('Sent: ' + m.subject + ' (' + partyLabel(m) + ').');
      },
      sendBack(el) {
        const m = CP.store.find('comms', el.dataset.id); if (!m) return;
        CP.store.apply({ op: 'update', coll: 'comms', id: m.id, patch: { status: 'draft' } });
        CP.feed({ actor: m.validator || 'p-amira', domain: 'human', level: 'info', text: 'sent ' + m.id + ' back to ' + CP.actor(m.author).name + ' for rework.' });
        CP.closeModal(); CP.toast(m.id + ' sent back to the agent. It will propose a new version.', 'warn');
      },
      resubmit(el) {
        const m = CP.store.find('comms', el.dataset.id); if (!m) return;
        CP.store.apply({ op: 'update', coll: 'comms', id: m.id, patch: { status: 'awaiting', ts: now() } });
        CP.feed({ actor: m.author, domain: 'grc', level: 'action', text: 'resubmitted ' + m.id + ' for validation after rework.' });
        CP.toast(m.id + ' resubmitted for validation.');
      },
      escalate() {
        const od = campaignTps().filter((t) => t.questionnaire.status === 'overdue');
        CP.feed({ actor: 'ag-grc-tprm', domain: 'grc', level: 'action', text: 'scheduled phone escalation for ' + od.map((t) => t.name).join(', ') + ' (scripts drafted, calls by the third-party risk lead).' });
        CP.toast('Phone escalation scheduled for ' + od.length + ' suppliers. Call scripts are in each Party 360.');
      },
      exportRegister() { CP.toast('DORA register exported: 1,240 arrangements, supervisor template (xlsx). Traced to TPRM, contracts and CMDB.'); },
      reqDecide(el) {
        const id = el.dataset.id, d = el.dataset.d; this.ui.req[id] = d;
        const label = d === 'approved' ? 'approved with conditions' : d === 'rejected' ? 'declined' : 'sent back for information';
        CP.feed({ actor: 'p-lucas', domain: 'human', level: 'decision', text: label + ' business request ' + id + '.' });
        CP.toast('Request ' + id + ' ' + label + '. The requester is informed by the agent.');
        CP.render();
      },
      hsReview(el) {
        const h = HOLDING.find((x) => x.id === el.dataset.id); if (!h) return;
        const ok = this.ui.hs[h.id];
        CP.modal(I('megaphone') + ' ' + esc(h.t), '<div class="row wrap" style="margin-bottom:10px">' + whoS(h.agent) + '<span class="small-txt muted">for ' + esc(h.who) + (h.cs ? ' · case ' + esc(h.cs) : '') + '</span></div><div class="eg-mail"><div class="eg-mb">' + esc(h.x) + '</div></div>' +
          '<div class="notice info" style="margin-top:10px">' + I('bot') + ' Facts checked against the case. No supplier named, no technical indicator, no unconfirmed figure. Legal pre-approved wording family: "cyber event, under control".</div>',
          '<button data-close-modal>Close</button>' + (ok ? '' : '<button class="go" data-action="hsValidate" data-id="' + esc(h.id) + '">' + I('check') + ' Validate</button>'));
      },
      hsValidate(el) {
        const h = HOLDING.find((x) => x.id === el.dataset.id); if (!h) return;
        this.ui.hs[h.id] = true;
        CP.feed({ actor: 'p-tom', domain: 'human', level: 'decision', text: 'validated holding statement "' + h.t + '" (on file, ready to use).' });
        CP.closeModal(); CP.toast('Holding statement validated and on file: ' + h.t + '.'); CP.render();
      },
      inform(el) {
        const key = el.dataset.id;
        const map = { press: [CP.store.find('cases', 'C-2301') ? 'HS-01' : 'HS-00', 'Press desk'], clients: ['HS-04', '1,200 beneficiaries'], staff: ['HS-03', 'Treasury staff (41)'], sup: [null, 'Suppliers'], excom: [null, 'ExCom'], reg: [null, 'Regulators'], dpo: [null, 'DPO'], biz: [null, 'Business owners'] };
        const hs = map[key] && map[key][0] && HOLDING.find((x) => x.id === map[key][0]);
        if (hs) { this.actions.hsReview.call(this, { dataset: { id: hs.id } }); return; }
        const mid = 'M-' + (++SEQ.n);
        BODIES[mid] = 'Situation update for ' + map[key][1] + '.\n\nFacts confirmed so far are summarised from the open cases. Next update in 2 hours or at the next decision.\n\nCrisis manager, Novalys Group';
        CP.store.apply({ op: 'add', coll: 'comms', item: { id: mid, ts: now(), party: 'crisis', partyLabel: map[key][1], channel: 'Crisis cell', subject: 'Situation update · ' + map[key][1], status: 'awaiting', author: 'ag-grc-policy', validator: 'p-tom' } });
        CP.toast(mid + ' drafted for ' + map[key][1] + ' and queued in the Outbox.');
      },
      playbook(el) {
        const p = PLAYBOOKS[+el.dataset.id || 0];
        const steps = ['Qualify the event and the crisis level (orchestrator proposes, crisis manager confirms)', 'Page the on-call roster and open the crisis room', 'Freeze evidence and start the incident timeline (agents)', 'Map impacted services, suppliers and data in the graph', 'Decide containment above threshold (CISO, business owner)', 'Draft stakeholder messages: ExCom, DPO, regulators, clients, press (agents draft, Engage validates)', 'Regulatory clocks: DORA 4 h / 72 h, GDPR 72 h, NIS2 24 h', 'Recovery, lessons learned and playbook update'];
        CP.modal(I('book') + ' Playbook · ' + esc(p[0]), '<div class="row wrap" style="margin-bottom:12px"><span class="small-txt muted">Owner</span>' + whoS(p[1]) + '<span class="small-txt muted">· last exercised ' + esc(p[2]) + ' · last used ' + esc(p[3]) + ' · ' + p[4] + '% of steps automated</span></div><ol class="eg-tp">' + CP.map(steps, (s, i) => '<li>' + esc(s) + (i === 2 || i === 3 || i === 5 ? ' ' + ui.tag(I('bot') + ' agents', 'teal') : i === 4 ? ' ' + ui.tag(I('users') + ' humans decide', 'amber') : '') + '</li>') + '</ol>',
          '<button data-close-modal>Close</button><button class="primary" data-action="exercise">' + I('play') + ' Exercise it in CrisisMaker</button>');
      },
      exercise() {
        CP.closeModal();
        CP.feed({ actor: 'p-tom', domain: 'human', level: 'info', text: 'sent "Operation Black Ledger" to CrisisMaker with injects generated from this week\'s cases.' });
        CP.toast('Exercise package sent to CrisisMaker: scenario, 34 injects and the stakeholder map. Invitations ready for Thu 5 Nov.');
      },
      coverLetter() {
        CP.modal(I('file') + ' Cover letter (draft)', '<div class="eg-mail"><div class="eg-mh"><div><span>From</span>Head of Engage · Compliance & regulators, Novalys Group</div><div><span>To</span>Supervisor · ICT risk inspection team</div><div><span>Subject</span><b>Your request of 13 October: ICT third-party register and resilience evidence</b></div></div><div class="eg-mb">Please find enclosed:\n· the register of information (1,240 arrangements, 96 supporting critical functions);\n· 23 evidence items, each referenced to its source system;\n· the log of the 4 major ICT incidents of the last 12 months.\n\nIn preparing this answer we identified three points we are already remediating (annex 4): sub-contracting data for 31 arrangements (by 15 Nov), exit-plan tests for 7 critical providers (by Q1 2027), and an automated control on the 4-hour notification deadline (live by 30 Nov).\n\nYours sincerely,\nHead of Engage · co-signed by the Group CISO</div></div>', '<button data-close-modal>Close</button>');
      },
      trainingNew() {
        CP.modal(I('sparkles') + ' New targeted micro-training', '<label class="small-txt muted" for="eg-tr-pop">Audience (from the human risk model)</label><select id="eg-tr-pop" style="width:100%;border:1px solid var(--line);padding:8px 10px;margin:4px 0 12px">' + CP.map(POPULATIONS, (p) => '<option>' + esc(p) + '</option>') + '</select>' +
          '<label class="small-txt muted" for="eg-tr-body">Module drafted by the Policy Agent from this week\'s cases (anonymised)</label><textarea id="eg-tr-body" class="eg-textarea" style="min-height:180px">3 minutes: the request you did not start\n\n1. What happened this week (anonymised): an attacker tried to make a colleague approve an MFA push at night.\n2. Why it works: fatigue and urgency.\n3. What to do: refuse, report with one click, switch to number matching or a hardware key.\n4. Quiz: 3 questions.</textarea>',
          '<button data-close-modal>Cancel</button><button class="primary" data-action="trainingSubmit">' + I('send') + ' Submit for validation</button>');
      },
      trainingSubmit() {
        const pop = (document.getElementById('eg-tr-pop') || {}).value || POPULATIONS[0];
        const body = (document.getElementById('eg-tr-body') || {}).value || '';
        const mid = 'M-' + (++SEQ.n);
        BODIES[mid] = body;
        CP.store.apply({ op: 'add', coll: 'comms', item: { id: mid, ts: now(), party: 'staff', partyLabel: pop, channel: 'Learning platform', subject: body.split('\n')[0] || 'Micro-training', status: 'awaiting', author: 'ag-grc-policy', validator: 'p-leo' } });
        CP.feed({ actor: 'ag-grc-policy', domain: 'grc', level: 'action', text: 'drafted micro-training ' + mid + ' for ' + pop + ', awaiting the culture lead.' });
        CP.closeModal(); CP.toast(mid + ' drafted for ' + pop + '. Validate it in the Outbox.');
      }
    }
  });
})();
