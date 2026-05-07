# Tirage en Croix — Design Spec
_Date: 2026-05-07_

## Overview

Add a 5-card "cross reading" mode to the Belline Oracle app. The user draws 5 cards sequentially (one per position), then sees a recap screen with all 5 cards laid out in a cross. The second button on screen 4 ("Tirage en croix") is currently disabled — this feature enables it.

## Architecture

**Approach:** Mode flag + reuse of existing screens 6, 7, 8. New screen 9 for recap. All conditional logic in `app.js`.

**Files changed:**
- `index.html` — add screen 9, activate cross button, adjust screen 8 navbar
- `assets/app/app.js` — new state, new functions, navigation changes
- `assets/css/style.css` — cross grid layout, position title
- `assets/data/ui-texts.js` — cross position labels (FR/EN)

---

## State

Four new global variables added to `app.js`:

```js
let tirageMode = 'une-carte';  // 'une-carte' | 'croix'
let croixPosition = 1;          // current position 1–5
let croixCards = [];            // drawn card IDs per position, length 5
let croixDeck = [];             // remaining shuffled deck (no repeats)
let croixFromRecap = false;     // true when navigating to screen 8 from recap
```

---

## Card Draw Algorithm

### `shuffleCroixDeck()`
Fisher-Yates shuffle of `[0..52]` using `crypto.getRandomValues` for each swap.
Stores result in `croixDeck`.

### `drawCroixCard(n)`
1. Remove `n-1` cards from the front of `croixDeck` (counted cards, discarded)
2. Take the next card (`splice(0, 1)[0]`) → stored in `croixCards[croixPosition - 1]` and `tirageCardId`

This guarantees no duplicate across the 5 draws. Minimum deck depletion: 5 cards (all 1s). Maximum: 45 cards (all 9s). Deck never runs out (53 cards total).

---

## Markdown Structure (h3 indices)

Each card's `.md` file has 10 `h3` sections (0-indexed):

| Index | Section |
|-------|---------|
| 0 | Amour / Sentimental |
| 1 | Travail / Professionnel |
| 2 | Financier / Matériel |
| 3 | Famille |
| 4 | Spiritualité |
| 5 | En position 1 (situation actuelle) |
| 6 | En position 2 (oppositions) |
| 7 | En position 3 (conseil) |
| 8 | En position 4 (résultat) |
| 9 | En position 5 (synthèse) |

The cross reveal uses h3 at index `4 + croixPosition` (i.e., index 5–9).

---

## Screen Flow

### Entering cross mode (screen 4)
- `bt-tirage-croix` loses `btn-disabled` class
- On click: `tirageMode = 'croix'`, `shuffleCroixDeck()`, `croixPosition = 1`, `croixCards = []`, `goTo(6)`
- Domain selection (screen 5) is **skipped** — domain is not relevant to cross readings

### Screen 6 — Chiffre (modified for croix mode)
- A position title is injected at the top of the screen:
  - 1. Situation actuelle
  - 2. Opposition
  - 3. Conseil
  - 4. Résultat
  - 5. Synthèse
- Left arrow → `goTo(4)` (cancels the whole cross reading, for all positions)
- On number click: call `drawCroixCard(n)` instead of `drawTirageCard()`; rest of animation flow is unchanged

### Screen 7 — Animation
No changes.

### Screen 8 — Reveal (modified for croix mode)
- Text: h3 at index `4 + croixPosition` (not domain-based)
- Navbar:
  - **Positions 1–4:** right arrow only → `croixPosition++`, `goTo(6)`
  - **Position 5:** right arrow only → `renderCroixRecap()`, `goTo(9)`
  - **From recap (review mode):** left arrow shown → `croixFromRecap = false`, `goTo(9)`
- "Nouveau tirage" button is hidden in croix mode

### Screen 9 — Récap (new)
- Renders 5 cards in a cross layout (see below)
- Each card is clickable: `croixFromRecap = true`, set `tirageCardId` and `croixPosition` to that card's data, `renderCroixReveal()`, `goTo(8)`
- Left arrow → `goTo(4)`
- "Nouveau tirage" button → `tirageMode = 'une-carte'`, `goTo(4)`

---

## Cross Layout (screen 9)

```
         [3]
[1]      [5]      [2]
         [4]
```

CSS Grid 3 columns × 3 rows:
- Position 3 (Conseil) → row 1, col 2
- Position 1 (Situation) → row 2, col 1
- Position 5 (Synthèse) → row 2, col 2 (center)
- Position 2 (Opposition) → row 2, col 3
- Position 4 (Résultat) → row 3, col 2

Each cell: card thumbnail image + position number + card name label.

---

## New `screenMap` entry

```js
9: 's-tirage-croix-recap'
```

---

## Localisation (ui-texts.js)

New keys added (FR and EN):

```
'croix-pos-1': '1. Situation actuelle'  /  '1. Current Situation'
'croix-pos-2': '2. Opposition'          /  '2. Opposition'
'croix-pos-3': '3. Conseil'             /  '3. Advice'
'croix-pos-4': '4. Résultat'            /  '4. Outcome'
'croix-pos-5': '5. Synthèse'            /  '5. Synthesis'
'croix-recap-title': 'Votre tirage en croix'  /  'Your Cross Reading'
```

---

## Language switching

`switchLang()` must also handle cross mode:
- `currentScreen === 8` and `tirageMode === 'croix'`: re-render `renderCroixReveal()`
- `currentScreen === 9`: re-render `renderCroixRecap()`

Position title labels in screen 6 are also language-aware and must update on language switch.

---

## CSS additions

- `.position-title` — large title in screen 6 (Big Shoulders Display, uppercase)
- `.croix-grid` — 3×3 CSS grid container for recap
- `.croix-cell` — individual card cell (image + label, clickable)
- `.croix-cell-label` — position number + card name below thumbnail
