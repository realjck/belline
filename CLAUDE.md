# Belline Oracle — CLAUDE.md

Application web compagnon pour l'Oracle de Belline. Vanilla JS SPA, mobile-first (max 720px), aucun framework, aucun bundler. Servir via un serveur HTTP local (ex: Live Server).

## Stack

- **HTML/CSS/JS** vanille, pas de build step
- **marked.js** (`assets/libs/marked/marked.min.js`) pour le rendu Markdown des textes de cartes
- **Google Fonts** : Big Shoulders Display (100–900) + DM Sans variable (100–900) — chargées via `<link>` dans `index.html`
- **Segoe UI Symbol** : police locale (`assets/fonts/segoe-ui-symbol/Segoe-UI-Symbol.ttf`) chargée via `@font-face` — utilisée pour les glyphes planétaires Unicode dans les carrés colorés
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
  fonts/segoe-ui-symbol/          Segoe UI Symbol (TTF) — glyphes planétaires
  sounds/click.mp3, back.mp3, belline.mp3
  libs/marked/marked.min.js
```

**Ne pas utiliser** `assets/cartes_illustrations/` (dossier source à supprimer) ni `assets/cartes_textes_complets/` (source originale, ne pas lier directement).

## Architecture écrans

11 écrans (SPA, transitions CSS `opacity + translateX .35s ease`) :

| Index | ID | Description |
|-------|----|-------------|
| 0 | `#s-home` | Accueil |
| 1 | `#s-cards` | Galerie des 53 cartes (responsive grid, groupée) |
| 2 | `#s-card-large` | Vue détaillée d'une carte |
| 3 | `#s-card-text` | Texte complet de la carte (Markdown) |
| 4 | `#s-tirage-choix` | Choix du type de tirage |
| 5 | `#s-tirage-domaine` | Choix du domaine de question |
| 6 | `#s-tirage-chiffre` | Sélection du chiffre (1–9) |
| 7 | `#s-tirage-anim` | Animation de la pile de cartes |
| 8 | `#s-tirage-reveal` | Révélation de la carte tirée |
| 9 | `#s-tirage-croix-recap` | Récapitulatif du tirage en croix (5 cartes) |
| 10 | `#s-tirage-croix-anim` | Animation croix — carte courante avec spring (pas de navbar) |

Navigation gérée par `goTo(screenIndex, forceDirection)` dans `app.js`. L'écran entrant reçoit `.active`, le sortant `.leaving` (retiré après 350ms). Les transitions sont **directionnelles** : avancer → slide depuis la droite, reculer (`screenIndex < currentScreen`) → slide depuis la gauche (classes `.back-enter` / `.back-leaving`). `forceDirection = 'forward' | 'back'` permet de forcer la direction (ex. 8→6 en mode croix doit animer vers l'avant).

## Navigation des écrans

- **Screen 2 (vue carte)** : flèche gauche → liste (1), flèche droite → texte (3), clic image → texte (3)
- **Screen 3 (texte)** : flèche gauche → vue carte (2), tap n'importe où → vue carte (2). Pas de bouton central.
- **Screen 6 (chiffre)** : clic bouton 1–9 → tirage + `goTo(7)` si n ≥ 2, `goTo(10)` directement si n = 1 (mode croix) ou `goTo(8)` (mode une-carte)
- **Screen 7 (anim)** : auto → `goTo(10)` (mode croix) ou `goTo(8)` (mode une-carte) à la fin de l'animation
- **Screen 8 (reveal) — mode une-carte** : pas de flèche gauche, "Nouveau tirage" → domaine (5), clic carte → ouvre modale texte (`#modal-reveal-text`)
- **Screen 8 (reveal) — mode croix séquentiel** : flèche droite uniquement → position suivante (6) ou récap (9) ; clic carte = flèche droite. Texte non affiché (pas de modale).
- **Screen 8 (reveal) — mode croix depuis récap** : flèche gauche → récap (9), clic carte → ouvre modale texte
- **Screen 9 (récap croix)** : pas de flèche gauche, "Nouveau tirage" → choix tirage (4), clic carte → détail (8)
- **Screen 10 (croix-anim)** : pas de navbar. Auto-avance après ~2.7s vers chiffre (6) si position < 5, ou récap (9) si position = 5.
- **Bouton home (navbar)** : retour à l'accueil (0) + scroll top de la liste des cartes + `clearTimeout(croixAnimTimeoutId)`

## Flux tirage une-carte (screens 4 → 8)

```
Home → [Consulter l'oracle] → Choix tirage (4)
→ Domaine (5) → Chiffre (6)
→ si n = 1 : renderTirageReveal() → goTo(8)
→ si n ≥ 2 : goTo(7) → playTcAnim(n-1, cb) → renderTirageReveal() → goTo(8)
```

- `drawTirageCard()` : tirage cryptographique via `crypto.getRandomValues`, stocké dans `tirageCardId`
- `playSound('belline')` joué à l'arrivée sur l'écran 8

## Flux tirage en croix (screens 4 → 6/7/10 × 5 → 9)

```
Choix tirage (4) → [Tirage en croix] → Chiffre (6) [position 1]
→ drawCroixCard(n)
→ si n = 1 : renderCroixAnim() → goTo(10)
→ si n ≥ 2 : goTo(7) → playTcAnim(n-1, cb) → renderCroixAnim() → goTo(10)
→ Screen 10 : spring animation + son belline → auto-avance après ~2.7s
  → position < 5 : croixPosition++ → goTo(6)
  → position = 5 : renderCroixRecap() → goTo(9)
→ clic carte sur récap → croixFromRecap = true → renderTirageReveal() → goTo(8)
→ flèche gauche → goTo(9) [retour récap]
```

- `shuffleCroixDeck()` : Fisher-Yates avec `crypto.getRandomValues`, 53 cartes → `croixDeck`
- `drawCroixCard(n)` : `splice(0, n-1)` pour écarter, `splice(0, 1)[0]` pour tirer — garantit l'absence de doublons
- Texte affiché : h3 à l'index `4 + croixPosition` (indices 5–9 du fichier .md)
- Screen 8 en mode croix séquentiel : **plus visité** — remplacé par screen 10. Accessible uniquement depuis le récap (`croixFromRecap = true`)
- `playSound('belline')` joué au déclenchement du spring sur screen 10, `playSound('click')` depuis le récap

## Conventions CSS importantes

- `#main` : max-width 720px, centré, height 100vh/100dvh (pas de `overflow:hidden` — géré par `#app`)
- `body` : background `var(--color-bg)` (s'adapte light/dark)
- Variables principales : `--color-bg`, `--color-bg2`, `--color-accent` (`#7a5c3a` light / `#c8963c` dark), `--color-text`, `--color-border`, `--color-muted`
- `.dark` sur `<html>` pour le mode sombre
- **Typos** : `'Big Shoulders Display'` pour tous les titres (uppercase + letter-spacing), `'DM Sans'` pour le corps
- Boutons `.btn-action` : DM Sans, width auto (fit-content), border-radius 9999px, border 1.5px, accent au tap
- Flèches `.nav-arr` : circulaires (border-radius 50%, 42×42px), couleur accent
- `.bottom-nav` : `justify-content: space-between` — flèches aux bords, bouton centré. Utiliser `.nav-spacer` (42×42px invisible) pour équilibrer quand une flèche manque
- Arrondis cartes : `min(2vw, 16px)` galerie, `min(4vw, 40px)` vue reveal (screen 8), `min(8vw, 40px)` vue large (screen 2)
- Navbar (`hdr`) : fond étendu full-width via `box-shadow: 0 0 0 100vmax` + `clip-path: inset(0 -100vmax)`
- Modales : `backdrop-filter: blur(6px)`, animation slide+fade sur `.modal-sheet` via `.active`/`.closing`
- Screen 8 : `overflow: hidden` — navbar à 3 colonnes CSS Grid (`reveal-bottom-nav`) pour stabiliser le layout quand boutons visibles/invisibles via `style.visibility` + `disabled`
- Screen 9 : `overflow: hidden` — grille centrée avec `max-width`, `max-height: calc(100dvh - 210px)`, `aspect-ratio: 2/3`

## Présentation planète (pattern unifié sur screens 2, 3, 8)

Format header : `[planet-color-square] [NOM PLANÈTE en couleur] N / Nom de la carte`

- `.planet-color-square` : carré coloré (background = couleur planète) avec glyphe Segoe UI Symbol
- Taille par contexte : 18×18px défaut, 30×30px dans `.card-large-header`, 36×36px dans `.reveal-header`, 42×42px dans `#card-text-content h1`
- Cartes 0–3 (sans planète) : pas de carré, pas de nom coloré — affichage `N / Nom` seul
- Injecté via JS (`innerHTML` ou `insertBefore`) après rendu Markdown

## Galerie des cartes (screen 1)

- Grid responsive : 4 colonnes < 520px, 7 colonnes ≥ 520px
- Chaque `.card-item` : flex-column, `min-width: 0` (requis pour le tronquage du label)
  - `.card-item-label` : `N / Nom`, Big Shoulders Display 14px uppercase, `text-overflow: ellipsis`
  - `.card-item-img` : wrapper avec border-radius + overflow hidden
- En-têtes de groupe `.cards-group-header` : `.group-color-square` (24×24px, Segoe UI Symbol) + nom du groupe en couleur normale, 22px, border-bottom coloré

## Animation tirage (screen 7) — préfixe CSS `tc-*`

- `#s-tirage-anim` : plein écran, pas de navbar, `--tc-fg: var(--color-accent)`
- `buildTcDeck(deckEl, n)` : crée n+1 cartes `.tc-card` avec jitter déterministe (`tcJitter`)
- `playTcAnim(n, onComplete)` : fade séquentiel des cartes (300ms initial, 330ms/carte, transition 0.52s), pause 300ms finale, pas de flip
- `tcSleep` : `ms => new Promise(r => setTimeout(r, ms))`

## Révélation (screen 8) — préfixe CSS `reveal-*`

- `.reveal-card-wrapper` : `flex: 1; min-height: 0` — prend tout l'espace disponible, contient l'image
- `.reveal-card-img` : `max-height: 100%; width: auto; max-width: 100%` — s'adapte sans crop ni bandes blanches. Cursor toujours `pointer`.
- `.reveal-croix-position` : titre de position (ex. "Situation actuelle") affiché en mode croix uniquement
- Animation d'entrée : `@keyframes reveal-flip-in` (scaleX 0→1, 0.45s ease-out) via classe `.flip-in`, re-déclenchée à chaque tirage
- **Texte** : stocké dans `revealTextContent` (variable JS), affiché dans `#modal-reveal-text` au tap de la carte. Non affiché en mode croix séquentiel.
- `updateRevealNavbar()` : gère `style.visibility` + `disabled` sur les 3 boutons selon le mode (une-carte / croix-actif / croix-depuis-récap)
- Fichiers book fetchés : `./assets/data/book/${currentLang}/${cardId}.md`

## Modale texte reveal (`#modal-reveal-text`)

- `modal-overlay modal-centered` — centrée, même pattern que `modal-settings`
- Ouverte par `openRevealTextModal()` au tap de la carte en mode une-carte ou `croixFromRecap`
- Fermée par `closeRevealTextModal()` au tap n'importe où sur la modale (overlay ou sheet)
- `cursor: pointer` sur toute la modale
- Contenu : `.modal-body.reveal-modal-body` (DM Sans 16px, line-height 1.5)

## Animation croix (screen 10) — préfixe CSS `croix-anim-*`

- `#s-tirage-croix-anim` : pas de navbar, `overflow: hidden`
- `renderCroixAnim()` : construit une grille 3×3 avec 5 cellules `data-pos="1"` à `data-pos="5"` :
  - pos < croixPosition → image de la carte (déjà tirées)
  - pos = croixPosition → image + classe `.spring-pending` (invisible) → spring déclenché à 400ms
  - pos > croixPosition → `.placeholder` (bordure pointillée, fond transparent, pas d'ombre)
- Timing : 400ms délai → spring 0.9s → 1300ms pause → auto-avance
- `croixAnimTimeoutId` : référence au timeout courant, annulé par le bouton home
- Positions grille (identiques screen 9) : pos1→2/1, pos2→2/3, pos3→1/2, pos4→3/2, pos5→2/2

## Récap tirage en croix (screen 9)

- `renderCroixRecap()` : construit la grille 5 cartes, titre + sous-titre localisés
- Layout CSS Grid 3×3 avec positions fixes via `data-pos` + `grid-area` :
  - pos 1 (Situation) → 2/1, pos 2 (Opposition) → 2/3, pos 3 (Conseil) → 1/2, pos 4 (Résultat) → 3/2, pos 5 (Synthèse) → 2/2
- Cartes : ombre portée `box-shadow`, pas de border, `border-radius: min(2vw, 10px)`
- Navbar : pas de flèche gauche — "Nouveau tirage" centré entre deux `.nav-spacer`, ramène au choix tirage (4)
- Clic carte → `croixFromRecap = true`, `renderTirageReveal()`, `goTo(8, 'forward')`
- `switchLang()` re-rend le récap si `currentScreen === 9 && croixCards.length === 5`

## État global (`app.js`)

- `currentScreen` : index écran actif
- `currentCardId` : carte sélectionnée dans la galerie (screens 1–3)
- `tirageCardId` : carte tirée pour le tirage (screens 7–8), séparé de `currentCardId`
- `currentDomain` : domaine choisi (screen 5)
- `currentNumber` : chiffre choisi (screen 6)
- `currentLang` : `'fr'` | `'en'`
- `soundEnabled`, `darkMode`
- `tirageMode` : `'une-carte'` | `'croix'`
- `croixPosition` : position courante 1–5
- `croixCards` : tableau des 5 IDs de cartes tirées
- `croixDeck` : deck restant après shuffle (évite les doublons)
- `croixFromRecap` : `true` quand on navigue vers screen 8 depuis le récap
- `croixAnimTimeoutId` : ID du setTimeout courant sur screen 10 (annulable)
- `revealTextContent` : texte de lecture stocké lors du fetch, affiché dans la modale au tap

## Données cartes

Dans `belline-cards.js` :
- `GROUPS` : `{ null: [0,1,2,3], Soleil: [...], Lune: [...], ... }` — 8 groupes
- `GROUP_COLORS` : couleur hex par groupe planétaire
- `GROUP_SYMBOLS` : glyphe Unicode par planète (☉ ☾ ☿ ♀︎ ♂︎ ♃ ♄) — ♀ et ♂ suivis de U+FE0E pour forcer le rendu texte (pas emoji)
- `getGroupSymbol(groupName)` : retourne le glyphe Unicode du groupe
- `getGroupNameForCardId(cardId)` : retourne le nom du groupe planétaire (null pour cartes 0–3)
- `CARD_NAMES` : `{ fr: [...53 noms...], en: [...53 noms...] }` — noms localisés
- `getCardName(cardId, lang)` : retourne le nom localisé avec fallback `fr`
- `ALL_CARDS` : array de 53 objets `{ id, imageUrl }` — images dans `assets/images/cartes/XX.jpg`

## Structure Markdown des cartes (fichiers book)

Chaque fichier `.md` contient 10 sections `###` (index 0–9) :

| Index | Section |
|-------|---------|
| 0–4 | Domaines une-carte : Amour, Travail, Financier, Famille, Spiritualité |
| 5 | En position 1 — Situation actuelle |
| 6 | En position 2 — Oppositions |
| 7 | En position 3 — Conseil |
| 8 | En position 4 — Résultat |
| 9 | En position 5 — Synthèse |

## Localisation

`ui-texts.js` expose `UI_TEXTS = { fr: {...}, en: {...} }`. Clés de groupes : `group-4premières`, `group-Soleil`, etc. Fonction `txt(key)` dans `app.js`.
Titres home localisés via `dom.homeTitle.innerHTML = txt('home-title')` (contient `<br>`).
Noms de cartes via `getCardName(cardId, currentLang)` dans `belline-cards.js`.

## Sons

`playSound(type)` avec map : `click` → `click.mp3`, `back` → `back.mp3`, `belline` → `belline.mp3`. Silencieux si `soundEnabled = false`.
