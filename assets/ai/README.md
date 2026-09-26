# Médias de `ai.html` (Hors du bac à sable)

`ai.html` fonctionne sans aucun de ces fichiers : chaque emplacement manquant
s'affiche en pointillés avec la description du plan attendu et un lien vers la
source. Déposez le fichier au chemin indiqué et il apparaît automatiquement.
La touche `M` masque les emplacements encore vides pendant une répétition.

## Liste des plans

| Scène | Fichier | Contenu attendu | Où le trouver |
|---|---|---|---|
| 10 · L'appel | `hf-disclosure.jpg` | Capture du billet de Hugging Face du 16 juillet 2026, avec la mention « used LLM still not known » | huggingface.co/blog/security-incident-july-2026 |
| 16 · DseWiki | `dsewiki.jpg` | Capture de l'analyse du Nightingale Collective, ou d'une page DseWiki avec des contributions signées par des agents | collusion.wiki |
| 19 · Extrait | `albanese-presser.mp4` | 20 à 40 s de la conférence de presse d'Anthony Albanese, New York, 24 septembre 2026 | ABC News, SBS, Guardian Australia |
| 29 · Extrait | `unipwn-demo.mp4` | Démonstration publique UniPwn (prise de contrôle d'un robot Unitree), ou photo d'un G1 | vidéos des chercheurs, septembre 2025 |
| 35 · Fausses preuves | `refund-fraud.jpg` | Exemple publié de photo de produit « abîmé » générée ou retouchée par IA | South China Morning Post (2025), Modern Retail (2026) |
| 4, 9 · Portraits | `people/delangue.jpg`, `people/wolf.jpg` | Portraits carrés de Clément Delangue et Thomas Wolf | photos de presse Hugging Face |

Sans portrait, la page affiche les initiales.

## Plans supplémentaires possibles

Chaque objet `visual` ou `media` du tableau `SCENES` accepte :

```js
{ kind: 'media', type: 'image', src: 'assets/ai/fichier.jpg', caption: '…', credit: '…', todo: '…', href: '…' }
{ kind: 'media', type: 'video', src: 'assets/ai/extrait.mp4', poster: 'assets/ai/extrait.jpg', caption: '…' }
{ kind: 'media', type: 'youtube', id: 'IDENTIFIANT', start: 42, end: 75, caption: '…' }
```

Idées : l'alerte de l'Australian Cyber Security Centre (24 septembre), la page
Transluce (23 septembre), l'article d'Axios ou du Wall Street Journal sur
Gemini, la séance du Conseil de sécurité de l'ONU (23 septembre, UN Web TV), le
reportage de CNN sur Arup, la fiche de la FCC (28 juillet).

## Conseils

- En salle, préférez des fichiers locaux aux vidéos YouTube : le réseau des
  lieux de conférence est rarement fiable.
- Gardez des extraits courts, sourcés à l'écran (légende et crédit). Pour une
  diffusion publique ultérieure, revalidez les droits de chaque extrait.
- Images en 1920 px de large maximum, vidéos en H.264 (MP4) pour la
  compatibilité.
