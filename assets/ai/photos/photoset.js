// Photo edition of the talk: which photo goes behind which scene.
// tools/build-talk-photos.py inlines this file into ai-talk-photos.html.
// Modes: 'brand' (photo in Wavestone indigo, title and chapters), 'dark'
// (full-bleed, white text), 'side' (photo on the right, fading into the page).
// A missing file is simply skipped. Credits are shown on screen.

Object.assign(PHOTO, {
  // Unsplash License (free to use); photographers credited on screen
  'racks': 'Taylor Vick on Unsplash',
  'servers': 'Tyler on Unsplash',
  'earth-night': 'NASA on Unsplash',
  'chip': 'Laura Ockel on Unsplash',
  'capitol': 'Andy Feliciotti on Unsplash',
  'exam': 'Nguyen Dang Hoang Nhu on Unsplash',
  'keyboard': 'Clint Patterson on Unsplash',
  'humanoid': 'Franck V. on Unsplash',
  'phone': 'Rodion Kutsaiev on Unsplash',
  'phone-side': 'Eddy Billard on Unsplash',
  'padlock': 'FlyD on Unsplash',
  'audience': 'Alexandre Pellaes on Unsplash',
  'hong-kong': 'Henry Lai on Unsplash',
  'maranello': 'Daniele Fotia on Unsplash',
  'pyongyang': 'Thomas Evans on Unsplash',
  'kyiv': 'Glib Albovsky on Unsplash',
  'beijing': 'chen zy on Unsplash',
  'taipei': 'Mark Huang on Unsplash',
  'earth-side': 'Carl Wang on Unsplash',
  'san-francisco': 'Jamie Street on Unsplash',
  'payment': 'rupixen on Unsplash',
  'new-mexico': 'Andreas Rasmussen on Unsplash',
  'germany': 'Stephan Widua on Unsplash',
});

const PH = (id, mode, pos) => ({ src: `assets/ai/photos/${FILE[id] || id}.jpg`, id, mode, pos });
const FILE = { go2: 'unitree-go2', unsc: 'un-chamber' };
const PHOTOSET = {
  'Title':                              { bg: PH('racks', 'brand') },
  'Chapter 1: The Exam':                { bg: PH('exam', 'brand') },
  'Chapter 1 in one sentence':          { bg: PH('servers', 'side') },
  'Chapter 2: The Wave':                { bg: PH('earth-night', 'brand') },
  'Chapter 2 in one sentence':          { bg: PH('earth-side', 'side') },
  'Chapter 3: Why':                     { bg: PH('chip', 'brand') },
  'Chapter 4: The Rules':               { bg: PH('capitol', 'brand') },
  'Chapter 4 in one sentence':          { bg: PH('unsc', 'side', '60% 50%') },
  'Chapter 5: The Attackers Level Up':  { bg: PH('keyboard', 'brand') },
  'Chapter 5 in one sentence':          { bg: PH('hong-kong', 'side') },
  'Chapter 6: The Body':                { bg: PH('humanoid', 'brand') },
  'Chapter 6 in one sentence':          { bg: PH('go2', 'side', '78% 50%') },
  'Chapter 7: You':                     { bg: PH('phone', 'brand') },
  'Chapter 7 in one sentence':          { bg: PH('phone-side', 'side') },
  'Chapter 8: What Works':              { bg: PH('padlock', 'brand') },
  'Question for the room':              { bg: PH('audience', 'dark') },
  'Map of incidents': { bubbles: {
    1: PH('new-mexico'), 2: PH('servers'), 3: PH('germany'),
  } },
  'Attackers on the map': { bubbles: {
    1: PH('hong-kong'), 2: PH('maranello'), 3: PH('pyongyang'), 4: PH('kyiv'), 5: PH('racks'),
    6: PH('taipei'), 7: PH('san-francisco'), 8: PH('payment'), 9: PH('earth-side'),
  } },
};

SCENES.forEach(s => {
  const p = PHOTOSET[s.title]; if (!p) return;
  if (p.bg) s.bg = p.bg;
  if (p.bubbles) (s.bubbles || []).forEach(b => { if (p.bubbles[b.k] && !b.media) b.photo = p.bubbles[b.k]; });
});
