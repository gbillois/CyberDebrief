# Médias de `ai.html` (Hors du bac à sable)

`ai.html` est autonome : polices, carte et code sont dans le fichier. Il se joue
sans réseau, par exemple sur un portable branché en HDMI. Les seuls éléments
externes sont les médias ci-dessous, à déposer **à côté du fichier**, dans ce
dossier `assets/ai/`. Chaque emplacement vide s'affiche en pointillés avec la
description du plan attendu ; la touche `M` les masque pendant une répétition.

Pour emporter la présentation : copier `ai.html` et le dossier `assets/ai/`
ensemble (clé USB, disque local). Rien d'autre n'est nécessaire.

## Vidéos (fichiers MP4 locaux)

Sans réseau, seules les vidéos locales sont lues. Si l'ordinateur est en ligne et
qu'un fichier manque, la page propose l'extrait YouTube correspondant, chargé au
clic : c'est une solution de secours, pas la version de salle.

| Scène | Fichier à déposer | Contenu | Source identifiée |
|---|---|---|---|
| 13 · Black Hat (facultatif) | `blackhat-briefing.mp4` | Session sur l'incident OpenAI / Hugging Face, Black Hat USA, août 2026 | [YouTube JmklCcqSwz8](https://www.youtube.com/watch?v=JmklCcqSwz8) (chaîne à vérifier) |
| 21 · Conférence de presse | `albanese-presser.mp4` | Anthony Albanese annonce l'intrusion, New York, 24 septembre 2026 | [ABC News, YH690PgNFdM](https://www.youtube.com/watch?v=YH690PgNFdM) · version intégrale [fbdIerD4lT8](https://www.youtube.com/watch?v=fbdIerD4lT8) |
| 26 · Conseil de sécurité (facultatif) | `un-security-council.mp4` | Sam Altman, Dario Amodei, Clément Delangue devant le Conseil de sécurité, 23 septembre 2026 | [YouTube eBEYrOk42Rg](https://www.youtube.com/watch?v=eBEYrOk42Rg), ou UN Web TV |
| 33 · UniPwn (facultatif) | `unipwn-demo.mp4` | Démonstration de prise de contrôle d'un robot Unitree | [YouTube ALIHl4-nVAg](https://www.youtube.com/watch?v=ALIHl4-nVAg) (chaîne à vérifier) |
| 39 · Arup (facultatif) | `arup-report.mp4` | Reportage sur la fraude par deepfake chez Arup (2024) | [YouTube iGJnHHOMwuI](https://www.youtube.com/watch?v=iGJnHHOMwuI) (chaîne à vérifier) |

Format conseillé : MP4 (H.264 + AAC), 1080p, extrait de 20 à 40 secondes déjà
coupé. Pour obtenir les fichiers, passez par une source qui autorise le
téléchargement (espace presse du diffuseur, UN Web TV, demande à la chaîne) ;
les identifiants YouTube servent à repérer le bon extrait.

## Captures et portraits

| Scène | Fichier | Contenu attendu | Où le trouver |
|---|---|---|---|
| 10 · L'appel | `hf-disclosure.jpg` | Capture du billet de Hugging Face du 16 juillet 2026, mention « used LLM still not known » visible | huggingface.co/blog/security-incident-july-2026 |
| 18 · DseWiki | `dsewiki.jpg` | Capture de l'analyse du Nightingale Collective | collusion.wiki |
| 40 · Fausses preuves | `refund-fraud.jpg` | Exemple publié de photo de produit « abîmé » générée ou retouchée par IA | South China Morning Post (2025), Modern Retail (2026) |
| 4, 9 · Portraits | `people/delangue.jpg`, `people/wolf.jpg` | Portraits carrés de Clément Delangue et Thomas Wolf | photos de presse Hugging Face |

Captures en PNG ou JPG, 1920 px de large au plus. Sans portrait, la page affiche
les initiales.

## En salle, en HDMI

1. Brancher le portable sur le projecteur en **écran étendu** (pas en miroir).
2. Ouvrir `ai.html` dans Chrome, Edge ou Firefox.
3. Appuyer sur `P` : la vue présentateur (texte à dire, notes, minuteur, scène
   suivante) s'ouvre dans une seconde fenêtre. La garder sur l'écran du portable.
4. Glisser la fenêtre principale sur le projecteur, puis `F` pour le plein écran.
5. Avancer avec `→`, `Espace` ou une télécommande de présentation, depuis l'une
   ou l'autre fenêtre. `B` met le projecteur au noir.

Tester une fois avant la séance avec le Wi-Fi coupé.

## Ajouter un plan

Chaque objet `visual` ou `media` du tableau `SCENES` accepte :

```js
{ kind: 'media', type: 'image', src: 'assets/ai/fichier.jpg', caption: '…', credit: '…', todo: '…', href: '…' }
{ type: 'video', src: 'assets/ai/extrait.mp4', poster: 'assets/ai/extrait.jpg', yt: 'IDENTIFIANT', start: 42, end: 75 }
```

Pour une diffusion publique ultérieure (avec voix off), revalider les droits de
chaque extrait.
