# Belline Oracle — CLAUDE.md

Application web compagnon pour l'Oracle de Belline. Vanilla JS SPA, mobile-first (max 720px), aucun framework, aucun bundler. Servir via un serveur HTTP local (ex: Live Server).

## Stack

- **HTML/CSS/JS** vanille, pas de build step
- **marked.js** (`assets/libs/marked/marked.min.js`) pour le rendu Markdown des textes de cartes
- **Google Fonts** : Big Shoulders Display (100–900) + DM Sans variable (100–900) — chargées via `<link>` dans `index.html`
- **localStorage** : `Belline_lang`, `Belline_theme`, `Belline_sound`
- Pas d'`export`/`import` — tous les scripts sont chargés en `<script>` dans `index.html`

## Structure des fichiers clés

```
index.html                        Point d'entrée unique
manifest.json                     PWA manifest minimal
assets/
  css/style.css                   Tout le CSS (variables, thèmes, écrans, composants)
  app/app.js                      Logique principale (state, navigation, rendu, events)
  data/
    ui-texts.js                   Textes FR/EN (objet UI_TEXTS)
    belline-cards.js              GROUPS, GROUP_COLORS, CARD_NAMES, ALL_CARDS, getCardName()
    book/fr/XX.md                 Textes des cartes en français (00.md à 52.md)
    book/en/XX.md                 Textes des cartes en anglais
  images/cartes/XX.jpg            Illustrations (00.jpg à 52.jpg)
  fonts/                          Polices locales (non utilisées, conservées)
  sounds/click.mp3, back.mp3
  libs/marked/marked.min.js
```

**Ne pas utiliser** `assets/cartes_illustrations/` (dossier source à supprimer) ni `assets/cartes_textes_complets/` (source originale, ne pas lier directement).

## Architecture écrans

4 écrans (SPA, transitions CSS `opacity + translateX .35s ease`) :

| Index | ID | Description |
|-------|----|-------------|
| 0 | `#s-home` | Accueil |
| 1 | `#s-cards` | Galerie des 53 cartes (responsive grid, groupée) |
| 2 | `#s-card-large` | Vue détaillée d'une carte |
| 3 | `#s-card-text` | Texte complet de la carte (Markdown) |

Navigation gérée par `goTo(screenIndex)` dans `app.js`. L'écran entrant reçoit `.active`, le sortant `.leaving` (retiré après 350ms).

## Navigation des écrans

- **Screen 2 (vue carte)** : flèche gauche → liste (screen 1), flèche droite → texte (screen 3), clic image → texte
- **Screen 3 (texte)** : flèche gauche → vue carte (screen 2), bouton central → liste (screen 1)
- **Bouton home (navbar)** : retour à l'accueil (screen 0) + scroll top de la liste des cartes
- La position de scroll de la liste est préservée lors des navigations (reset uniquement via home)

## Conventions CSS importantes

- `#main` : max-width 720px, centré, height 100vh (pas de `overflow:hidden` — géré par `#app`)
- `body` : background `var(--color-bg)` (s'adapte light/dark)
- Variables principales : `--color-bg`, `--color-bg2`, `--color-accent` (`#7a5c3a` light / `#c8963c` dark), `--color-text`, `--color-border`, `--color-muted`
- `.dark` sur `<html>` pour le mode sombre
- **Typos** : `'Big Shoulders Display'` pour tous les titres (uppercase + letter-spacing), `'DM Sans'` pour le corps
- Boutons `.btn-action` : DM Sans, width auto (fit-content), border-radius 9999px, border 1.5px, accent au tap
- Flèches `.nav-arr` : circulaires (border-radius 50%, 42×42px), couleur accent
- `.bottom-nav` : `justify-content: space-between` — flèches aux bords, bouton centré. Utiliser `.nav-spacer` (42×42px invisible) pour équilibrer quand une flèche manque
- Arrondis cartes : `min(2vw, 16px)` galerie, `min(8vw, 40px)` vue large
- Navbar (`hdr`) : fond étendu full-width via `box-shadow: 0 0 0 100vmax` + `clip-path: inset(0 -100vmax)`
- Modales : `backdrop-filter: blur(6px)`, animation slide+fade sur `.modal-sheet` via `.active`/`.closing`

## Galerie des cartes (screen 1)

- Grid responsive : 4 colonnes < 520px, 7 colonnes ≥ 520px
- Chaque `.card-item` : flex-column, `min-width: 0` (requis pour le tronquage du label)
  - `.card-item-label` : `N / Nom`, Big Shoulders Display 14px uppercase, `text-overflow: ellipsis`
  - `.card-item-img` : wrapper avec border-radius + overflow hidden
- En-têtes de groupe `.cards-group-header` : carré coloré `.group-color-square` + nom du groupe, 22px, border-bottom 4px

## Vue détaillée (screen 2)

- `.card-large-header` : titre `N / Nom` au-dessus de la carte (Big Shoulders Display 26px uppercase)
- `.card-large-planet` : badge planète en dessous (`.planet-color-square` + nom du groupe, 13px centré)
- Plus de navigation prev/next entre les cartes

## Données cartes

Dans `belline-cards.js` :
- `GROUPS` : `{ null: [0,1,2,3], Soleil: [...], Lune: [...], ... }` — 8 groupes
- `GROUP_COLORS` : couleur hex par groupe planétaire
- `CARD_NAMES` : `{ fr: [...53 noms...], en: [...53 noms...] }` — noms localisés
- `getCardName(cardId, lang)` : retourne le nom localisé avec fallback `fr`
- `ALL_CARDS` : array de 53 objets `{ id, imageUrl }` — images dans `assets/images/cartes/XX.jpg`

## Localisation

`ui-texts.js` expose `UI_TEXTS = { fr: {...}, en: {...} }`. Clés de groupes : `group-4premières`, `group-Soleil`, etc. Fonction `txt(key)` dans `app.js`.
Titres home localisés via `dom.homeTitle.innerHTML = txt('home-title')` (contient `<br>`).
Noms de cartes via `getCardName(cardId, currentLang)` dans `belline-cards.js`.

## Ce qui est prévu pour plus tard (Phase 2)

- Bouton "Consulter l'oracle" sur la home (désactivé en Phase 1)
- Tirage de cartes avec interprétation
- Traductions supplémentaires (3-4 langues) : ajouter des clés dans `UI_TEXTS` et `CARD_NAMES`
