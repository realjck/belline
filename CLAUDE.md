# Belline Oracle — CLAUDE.md

Application web compagnon pour l'Oracle de Belline. Vanilla JS SPA, mobile-first (max 720px), aucun framework, aucun bundler. Servir via un serveur HTTP local (ex: Live Server).

## Stack

- **HTML/CSS/JS** vanille, pas de build step
- **marked.js** (`assets/libs/marked/marked.min.js`) pour le rendu Markdown des textes de cartes
- **localStorage** : `Belline_lang`, `Belline_theme`, `Belline_sound`
- Pas d'`export`/`import` — tous les scripts sont chargés en `<script>` dans `index.html`

## Structure des fichiers clés

```
index.html                        Point d'entrée unique
assets/
  css/style.css                   Tout le CSS (variables, thèmes, écrans, composants)
  app/app.js                      Logique principale (state, navigation, rendu, events)
  data/
    ui-texts.js                   Textes FR/EN (objet UI_TEXTS)
    belline-cards.js              GROUPS, GROUP_COLORS, ALL_CARDS (53 cartes)
    book/fr/XX.md                 Textes des cartes en français (00.md à 52.md)
    book/en/XX.md                 Textes des cartes en anglais
  images/cartes/XX.jpg            Illustrations (00.jpg à 52.jpg)
  fonts/
    poppins/                      Poppins 400/600/700 (titres de groupes)
    noto-sans-sc/                 Noto Sans SC 500 (boutons)
  sounds/click.mp3, back.mp3
  libs/marked/marked.min.js
```

**Ne pas utiliser** `assets/cartes_illustrations/` (dossier source à supprimer) ni `assets/cartes_textes_complets/` (source originale, ne pas lier directement).

## Architecture écrans

4 écrans (SPA, transitions CSS `opacity + translateX .35s ease`) :

| Index | ID | Description |
|-------|----|-------------|
| 0 | `#s-home` | Accueil |
| 1 | `#s-cards` | Galerie des 53 cartes (4 colonnes, groupées) |
| 2 | `#s-card-large` | Vue détaillée d'une carte |
| 3 | `#s-card-text` | Texte complet de la carte (Markdown) |

Navigation gérée par `goTo(screenIndex)` dans `app.js`. L'écran entrant reçoit `.active`, le sortant `.leaving` (retiré après 350ms).

## Conventions CSS importantes

- `#main` : max-width 720px, centré, height 100vh
- `body` : background `var(--color-bg)` (s'adapte light/dark)
- Variables principales : `--color-bg`, `--color-bg2`, `--color-accent` (`#7a5c3a` light / `#c8963c` dark), `--color-text`, `--color-border`, `--color-muted`
- `.dark` sur `<html>` pour le mode sombre
- Boutons `.btn-action` : Noto Sans SC, uppercase, border-radius 9999px, border 1.5px, accent au tap
- Flèches `.nav-arr` : circulaires (border-radius 50%, 42×42px), couleur accent
- Arrondis cartes : `min(2vw, 16px)` galerie, `min(6vw, 28px)` vue large
- Transitions cartes (prev/next) : classes `.card-exit-left/right` + `.card-enter-left/right`

## Données cartes

Dans `belline-cards.js` :
- `GROUPS` : `{ null: [0,1,2,3], Soleil: [...], Lune: [...], ... }` — 8 groupes (null = les 4 premières)
- `GROUP_COLORS` : couleur hex par groupe planétaire
- `ALL_CARDS` : array de 53 objets `{ id, imageUrl }` — images dans `assets/images/cartes/XX.jpg`

## Localisation

`ui-texts.js` expose `UI_TEXTS = { fr: {...}, en: {...} }`. Clés de groupes : `group-4premières`, `group-Soleil`, etc. Fonction `txt(key)` dans `app.js`.

## Ce qui est prévu pour plus tard (Phase 2)

- Bouton "Consulter l'oracle" sur la home (désactivé en Phase 1)
- Tirage de cartes avec interprétation
