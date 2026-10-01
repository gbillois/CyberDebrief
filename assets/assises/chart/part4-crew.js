// ════════════════════════════════════════════════════════════════════════
// PART 4 · THE CREW (36 - 40 min) · the cape: heading, lighthouse, fleet
// ════════════════════════════════════════════════════════════════════════
const LH = [10560, 5560];          // the lighthouse, on the cape's north-west point
LAYERS.push(() => {
  const [x, y] = LH;
  // the heading: a bearing line laid from the cape towards the open sea
  let s = `<g class="fl" data-flag="p4-heading"><path class="draw" pathLength="1" data-flag="p4-heading" d="M${x - 120},${y - 260} L${x - 1500},${y - 1700}" stroke="var(--indigo)" stroke-width="10" fill="none"/>
    <path d="M${x - 1500},${y - 1700} l70,10 l-60,60z" fill="var(--indigo)"/>
    <circle cx="${x - 120}" cy="${y - 260}" r="150" fill="none" stroke="var(--indigo)" stroke-width="5" stroke-dasharray="14 14"/></g>`;
  // the lighthouse and its sweeping beam
  s += `<g class="fl" data-flag="p4-light"><g transform="translate(${x} ${y})"><path d="M0,0 L760,-260 A800,800 0 0,0 760,260 Z" fill="var(--green)" opacity=".22" class="p4-beam"/></g>
    <circle cx="${x}" cy="${y}" r="46" fill="var(--green)"/><circle cx="${x}" cy="${y}" r="46" fill="none" stroke="var(--green)" stroke-width="10" class="pulse"/></g>`;
  // the fleet: boats regrouped in one formation
  const F = [[0, 0], [-170, 120], [170, 120], [-340, 240], [340, 240], [0, 260]];
  s += `<g class="fl" data-flag="p4-fleet" transform="translate(${x - 900} ${y - 900}) rotate(-40)">${F.map(([dx, dy], i) => `<g transform="translate(${dx} ${dy})"><path d="M-40,8 L40,8 L28,24 L-30,24Z" fill="var(--ink)"/><path d="M-4,4 L-4,-62 L30,4Z" fill="${i ? 'var(--lav)' : 'var(--green)'}"/></g>`).join('')}</g>`;
  return s;
});

SCENES.push(
{ ch: 'c4', type: 'waypoint', title: 'Waypoint 04 · The crew', ref: 'Chapter 4: Transform your organization', leg: 4, cam: { x: 10300, y: 5000, w: 4200 },
  html: () => waypointCard({ n: '04', place: 'The crew', theme: 'Three sails set. <em>Now the crew.</em>', line: 'A yacht goes nowhere on its sails alone. Beyond technology, transform the organization that sails it.', photo: IMG.yacht3, cap: 'Three sails. The rest is people.' }) },

{ ch: 'c4', type: 'helm', title: 'Heading, lighthouse, fleet', ref: 'Bet on your teams', leg: 4, cam: { x: 10300, y: 4750, w: 5000 }, onF: { 1: ['p4-heading'], 2: ['p4-light'], 3: ['p4-fleet'] },
  html: () => `<div class="cart at-r w-m"><span class="tab">Bet on your teams</span><p class="kick">Empower the crew to navigate</p>
    <h2 class="h s t">Set a heading, light <em>one</em> lighthouse, regroup the fleet</h2>
    <ul class="log">
      <li${fa(1)}><i>i.</i><span><b>Set the heading.</b> Choose where AI must genuinely transform the model: the workflows where speed or outcomes must change radically, the target level, one ambition shared by cyber, IT and business leaders.</span></li>
      <li${fa(2)}><i>ii.</i><span><b>Light one lighthouse.</b> One end-to-end workflow with visible operational value. Redesign it, do not just automate tasks. Its results prepare the next ones.</span></li>
      <li${fa(3)}><i>iii.</i><span><b>Regroup the fleet.</b> Cyber, IT, data, AI and operations in one team; one executive sponsor and one transformation lead; clear decision rights and authority to act; roles redesigned as AI reshapes the work.</span></li></ul>
    <p class="p"${fa(4)} style="font-family:var(--f-serif);font-style:italic;font-size:1.35rem;color:var(--ink)">Start focused. Prove the shift. Then expand.</p></div>
  ${pin(LH[0] - 1500, LH[1] - 1700, '<span class="tag">Heading · the ambition</span>', 't', 1, 'margin-top:-1rem')}
  ${pin(LH[0] - 80, LH[1] + 20, '<span class="tag g">Lighthouse · one workflow</span>', 'r', 2, 'margin-left:-1.4rem')}
  ${pin(LH[0] - 1000, LH[1] - 760, '<span class="tag">The fleet · one team</span>', 'b', 3, 'margin-top:1.6rem')}` },

{ ch: 'c4', type: 'manifest', title: 'The crew manifest', ref: 'Lead the human shift', leg: 4, cam: { x: 9200, y: 4600, w: 6400 }, on: ['p4-heading', 'p4-light', 'p4-fleet'],
  html: () => `<div class="cart at-tl w-xl" style="top:6rem"><span class="tab">Crew manifest</span><p class="kick">Lead the human shift</p>
    <h2 class="h s t">Cyber teams that <em>secure AI</em> and <em>sail with it</em></h2>
    <p class="p">Two missions for every CISO team: secure the company's AI, and put AI to work inside cyber.</p>
    <div class="office"${fa(1)}><b>New: a Cyber Data &amp; AI Office</b><span>Your own data scientists and AI engineers. They build and run the cyber data lake and the agents, and raise every cyber team's AI literacy.</span></div>
    <div class="manifest"${fa(2)}>
      <div><i>01</i><b>Lead the change</b><p><b>Show the way:</b> leaders use AI in their own work first. <b>Say early</b> which tasks go to agents and which roles grow.</p></div>
      <div><i>02</i><b>Train everyone</b><p><b>AI security basics</b> for every cyber role: prompt injection, agents, data leaks. <b>Labs:</b> build and red-team an agent in a sandbox.</p></div>
      <div><i>03</i><b>Redraw the org chart</b><p><b>New roles:</b> AI security architect, agent identity owner, AI red teamer. <b>Rebuild junior paths</b> as L1 work moves to agents.</p></div>
      <div><i>04</i><b>Name an owner</b><p><b>One human owner</b> for every agent and its actions. <b>AI risk shared</b> with IT, data and business teams (RACI).</p></div></div></div>` },
);
