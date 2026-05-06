# Design : Écrans de tirage — Belline Oracle

**Date :** 2026-05-06  
**Approche retenue :** Extension directe (A) — ajout de 3 nouveaux écrans dans le système existant

---

## 1. Vue d'ensemble

Ajout d'un flux de tirage d'une carte unique accessible depuis la Home. Le flux comporte 3 nouveaux écrans (4, 5, 6) s'inscrivant dans l'architecture SPA vanilla JS existante (même `screenMap`, même système de transitions CSS).

---

## 2. Map des écrans

| Index | ID | Description |
|-------|----|-------------|
| 0 | `#s-home` | Accueil (modifié) |
| 1 | `#s-cards` | Galerie (inchangé) |
| 2 | `#s-card-large` | Vue carte (inchangé) |
| 3 | `#s-card-text` | Texte carte (inchangé) |
| 4 | `#s-tirage-choix` | Choix du tirage *(nouveau)* |
| 5 | `#s-tirage-domaine` | Domaine de la question *(nouveau)* |
| 6 | `#s-tirage-chiffre` | Animation + sélection du chiffre *(nouveau)* |

**Flux avant :** `Home (0)` → `Choix (4)` → `Domaine (5)` → `Chiffres (6)`  
**Retours arrière :** 4→0, 5→4, 6→5

---

## 3. Modifications — Home (écran 0)

### Boutons
- Bouton existant `#bt-start` ("Les cartes") → `goTo(1)`, inchangé
- Nouveau bouton `#bt-tirage` ("Tirage") → `goTo(4)`
- Les deux boutons dans un `<div class="home-buttons">` (flex column, gap 12px, align-items center)
- Style identique `.btn-start` pour les deux

### Resserrement vertical (sans toucher au logo 300px)
- `.home-body` : `gap: 24px` → `gap: 12px`
- `.home-title` : `font-size: 64px` → `52px`, `margin-bottom: 12px` → `0`
- `.home-sub` : `margin-bottom: 12px` → `0`
- `.btn-start` : `margin-top: 40px` → `0`

### Clé i18n
- `btn-tirage` : `"Tirage"` / `"Reading"`

---

## 4. Écran 4 — Choix du tirage (`#s-tirage-choix`)

### Layout
- Flex column, justify-content center, align-items center, gap 16px, padding 24px
- Deux boutons `.btn-action`, width 80% max
  - `#bt-une-carte` : "Une seule carte" → `goTo(5)`, actif
  - `#bt-tirage-croix` : "Tirage en croix", classe `.disabled`, `opacity: 0.35`, `pointer-events: none`

### Bottom nav
- Flèche ← `#arr-tirage-choix-back` → `goTo(0)` + son back
- Spacer droit `.nav-spacer`

### Clés i18n
- `btn-une-carte` : `"Une seule carte"` / `"Single Card"`
- `btn-tirage-croix` : `"Tirage en croix"` / `"Cross Reading"`

---

## 5. Écran 5 — Domaine (`#s-tirage-domaine`)

### Layout
- Flex column, justify-content center, align-items center, gap 16px, padding 24px
- Titre `#tirage-domaine-title` : DM Sans, font-size 17px, text-align center, color muted
- 5 boutons `.btn-action.btn-domain`, width 80% max, text-align left
  - Glyphe à gauche : `<span class="domain-glyph">` avec `font-family: 'Segoe UI Symbol'`, `color: var(--color-accent)`
  - Au clic : `currentDomain = key` puis `goTo(6)`

### Mapping domaines
| Clé | Glyphe | FR | EN |
|-----|--------|----|----|
| `amour` | ♡ | Amour / Sentimental | Love / Relationships |
| `travail` | ⌬ | Travail / Professionnel | Work / Professional |
| `argent` | ❖ | Argent / Financier | Money / Financial |
| `famille` | ᗑ | Famille | Family |
| `spiritualite` | ☸︎ | Spiritualité | Spirituality |

### Bottom nav
- Flèche ← `#arr-tirage-domaine-back` → `goTo(4)` + son back
- Spacer droit `.nav-spacer`

### Clés i18n
- `screen-domaine-title` : `"Sur quoi porte votre question ?"` / `"What is your question about?"`
- `domain-amour` : `"Amour / Sentimental"` / `"Love / Relationships"`
- `domain-travail` : `"Travail / Professionnel"` / `"Work / Professional"`
- `domain-argent` : `"Argent / Financier"` / `"Money / Financial"`
- `domain-famille` : `"Famille"` / `"Family"`
- `domain-spiritualite` : `"Spiritualité"` / `"Spirituality"`

---

## 6. Écran 6 — Animation + Chiffres (`#s-tirage-chiffre`)

### Layout
- Flex column, justify-content center, align-items center, gap 24px, padding 24px
- Titre `#tirage-chiffre-title` : Big Shoulders Display, uppercase, font-size 22px, text-align center
- Bloc animation `#tirage-animation` : 200×200px, centré
- Grille de chiffres `#tirage-numbers` :
  - Ligne 1 : 1 2 3 4 5 (flex row, gap 8px, justify-content center)
  - Ligne 2 : 6 7 8 9 (flex row, gap 8px, justify-content center)
  - Boutons circulaires 42×42px style `.nav-arr`
  - Au clic : `currentNumber = n` (aucune navigation — phase 2)

### Animation
- Extraite de `animation_belline.html` (cercles, étoiles, lune, soleil, carte centrale)
- `--fg` remplacé par `var(--color-accent)` dans le CSS de l'animation
- `--bg` remplacé par `var(--color-bg)`
- Taille fixe 200×200px via `.stage`
- Compatible light/dark automatiquement via les variables CSS globales

### Bottom nav
- Flèche ← `#arr-tirage-chiffre-back` → `goTo(5)` + son back
- Spacer droit `.nav-spacer`

### Clé i18n
- `screen-chiffre-title` : `"Choisissez un chiffre"` / `"Choose a number"`

---

## 7. État partagé ajouté

```js
let currentDomain = null;   // clé domaine choisi à l'écran 5
let currentNumber = null;   // chiffre choisi à l'écran 6 (phase 2)
```

---

## 8. Fichiers modifiés

| Fichier | Nature des changements |
|---------|----------------------|
| `index.html` | Bouton #bt-tirage sur home + 3 nouveaux screens |
| `assets/css/style.css` | Styles home ajustés + styles écrans 4/5/6 + animation |
| `assets/data/ui-texts.js` | Nouvelles clés i18n FR/EN |
| `assets/app/app.js` | screenMap étendu, DOM cache, event listeners, nouvelles variables d'état |
