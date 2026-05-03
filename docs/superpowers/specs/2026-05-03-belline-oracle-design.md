# Belline Oracle — Design Specification

**Date:** May 3, 2026  
**Scope:** Phase 1 — Home page + Cards gallery with card details  
**Status:** Approved

---

## Overview

The Belline Oracle companion app replicates the visual design and architecture of the existing YiJing application while presenting 53 oracle cards organized into 8 groups. Users navigate through a card gallery, view detailed card information, and read full card texts in Markdown format.

**Not in scope (Phase 1):**
- "Consulter l'oracle" page (querying oracle, casting logic)
- Overlaid text on card images (architecture prepared, implementation later)
- PWA service worker (can be added later like YiJing)

---

## Pages & Navigation Flow

### 1. Home Page (`#s-home`)

**Content:**
- Title: "L'Oracle de Belline"
- Subtitle: "Application compagnon"
- Two action buttons:
  - "Les cartes" → navigates to Cards gallery
  - "Consulter l'oracle" → disabled/visually disabled (shows tooltip or greyed out)
- Same visual style as YiJing home (centered layout, logo placeholder)

**Styling:**
- Background: light theme #dccbaf, dark theme anthracite
- Uses existing CSS screen transition system from YiJing

---

### 2. Les Cartes (Cards Gallery) (`#s-cards`)

**Content:**
- Scrollable list of 53 cards organized by group
- Each group displays with a title (planet name), except the first group (4 cards with no label)

**Group structure (by planet):**
```
- [Unnamed] → cards 0-3 (4 cards, no header)
- Soleil (#d47706) → 7 cards
- Lune (#3c6382) → 7 cards
- Mercure (#e64f3a) → 7 cards
- Venus (#089992) → 7 cards
- Mars (#b81540) → 7 cards
- Jupiter (#0c2462) → 7 cards
- Saturne (#814c9a) → 7 cards
```

**Card Grid:**
- 4 columns, fixed (maintains 4 columns on all screen sizes, including very small screens)
- Cards display thumbnail images (assets/cartes_illustrations/)
- Each card image is clickable → navigates to Card Details (Large view)

**Header:**
- Left side: home icon button (returns to home)
- Right side: three buttons
  - Settings/Gear icon (opens Settings modal)
  - Info icon (opens Info modal)
  - Light/Dark theme toggle button

---

### 3. Carte Agrandie (Large Card View) (`#s-card-large`)

**Navigation flow:**
1. User clicks card thumbnail in gallery → shows large card image
2. User clicks large card image → advances to Card Text view
3. User clicks home icon → returns to home
4. Bottom navigation bar:
   - Left button: previous card (linear navigation)
   - Center button: "Revenir aux cartes" → returns to gallery
   - Right button: next card (linear navigation)

**Content:**
- Full-height card image from assets/cartes_illustrations/NN.jpg
- Previous/Center/Next buttons at bottom
- Same screen transition system as YiJing

**Data:**
- Cards indexed 0-52, navigation wraps (card 52 → 0, card -1 → 52)
- When changing cards, update image immediately before transition

---

### 4. Texte de la Carte (Card Text) (`#s-card-text`)

**Content:**
- Markdown text from assets/cartes_textes_complets/NN.md rendered to HTML
- Full scrollable text content
- Uses marked.js (same as YiJing) to parse markdown

**Navigation:**
- Bottom navigation bar (same as Large Card view):
  - Left button: previous card text
  - Center button: "Revenir aux cartes"
  - Right button: next card text
- Click on text area → returns to Large Card view (same card)
- Home icon → returns to home

---

## Modals (inherited from YiJing)

### Settings Modal (`#modal-settings`)
- Language toggle (FR / EN)
- Sound toggle (enabled/disabled)
- Persisted to localStorage
- (Theme toggle moved to header — permanent light/dark button in navbar)

### Info Modal (`#modal-info`)
- Version number (e.g., "v1.0.0")
- HTML paragraph text describing the app
- Credits (if any)
- Links (to be defined)

---

## Data Structure

### Groups Map (Approach B)

```javascript
const GROUPS = {
  null: [0, 1, 2, 3],           // "Les 4 premières" (no planet name)
  'Soleil': [4, 5, 6, 7, 8, 9, 10],
  'Lune': [11, 12, 13, 14, 15, 16, 17],
  'Mercure': [18, 19, 20, 21, 22, 23, 24],
  'Venus': [25, 26, 27, 28, 29, 30, 31],
  'Mars': [32, 33, 34, 35, 36, 37, 38],
  'Jupiter': [39, 40, 41, 42, 43, 44, 45],
  'Saturne': [46, 47, 48, 49, 50, 51, 52]
};

const GROUP_COLORS = {
  'Soleil': '#d47706',
  'Lune': '#3c6382',
  'Mercure': '#e64f3a',
  'Venus': '#089992',
  'Mars': '#b81540',
  'Jupiter': '#0c2462',
  'Saturne': '#814c9a'
};
```

**Card metadata file:** `assets/data/belline-cards.js`
```javascript
const BELLINE_CARDS = [
  { id: 0, name: "Card Name", group: null },
  { id: 1, name: "Card Name", group: 'Soleil' },
  ...
];
```

**UI text:** `assets/data/ui-texts.js` (extended with Belline strings)
- Page titles
- Button labels
- Group names
- All strings support FR/EN

---

## Architecture & File Structure

### Project Layout
```
belline/
├── index.html                          (main entry point)
├── assets/
│   ├── css/
│   │   └── style.css                   (main styles, variables for Belline colors)
│   ├── js/
│   │   └── app.js                      (application logic)
│   ├── data/
│   │   ├── ui-texts.js                 (UI strings + Belline additions)
│   │   ├── belline-cards.js            (card metadata)
│   │   ├── book/
│   │   │   ├── fr/
│   │   │   │   ├── 00.md ... 52.md    (card texts)
│   │   │   └── en/
│   │   │       ├── 00.md ... 52.md    (card texts translated)
│   ├── libs/
│   │   └── marked/
│   │       └── marked.min.js
│   ├── sounds/
│   │   ├── click.mp3
│   │   └── back.mp3
│   ├── fonts/
│   │   ├── poppins/         (modern display font for titles)
│   │   └── noto-serif/
│   ├── cartes_illustrations/
│   │   ├── 00.jpg ... 52.jpg           (card images, copied to project)
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-05-03-belline-oracle-design.md
```

### Screen System (from YiJing)
- CSS-based screen transitions (`opacity`, `transform: translateX`)
- All screens are `position: absolute; inset: 0` inside `#screens`
- Active screen has class `.screen.active`
- Leaving screen has class `.screen.leaving` (removed after 400ms)

### Localization
- Two languages: FR (default) and EN
- Persisted in localStorage as `Belline_lang`
- `SwitchLang()` function re-renders all UI text and reloads current card text if on card details

### Theme
- Light/dark toggle via `:root.light` CSS class
- Persisted in localStorage as `Belline_theme`
- CSS variables for Belline colors (both light and dark modes)

---

## Color Palette

**Light theme:**
- Background: #dccbaf (off-white/beige)
- Text: #333 (dark)
- Accents: group-specific colors

**Dark theme:**
- Background: anthracite (#1a1a1a or similar)
- Text: #f0f0f0
- Accents: group-specific colors (adjusted for contrast)

**Group colors (planet titles):**
- Soleil: #d47706
- Lune: #3c6382
- Mercure: #e64f3a
- Venus: #089992
- Mars: #b81540
- Jupiter: #0c2462
- Saturne: #814c9a

---

## Typography & UI Elements

**From YiJing (reuse/adapt):**
- Poppins (modern display font for titles, replaces Hidetoshy)
- Noto Serif for body text (kept from YiJing)
- Noto Sans SC for labels
- Rounded border buttons with stroke (existing style)
- Click sound on buttons (optional, can be disabled)

**Responsive:**
- Max width: 720px (mobile-first)
- Adapts to device safe-area insets (statusbar)

---

## Entry Point & Initialization

**index.html loads in order:**
1. `assets/libs/marked/marked.min.js` → window.marked
2. `assets/data/ui-texts.js` → window.UI_TEXTS[lang][key]
3. `assets/data/belline-cards.js` → window.BELLINE_CARDS, window.GROUPS, window.GROUP_COLORS
4. `assets/css/style.css`
5. `assets/js/app.js` (main application logic)

**app.js responsibilities:**
- Initialize screen system
- Manage navigation (goTo(pageIndex))
- Load/render card gallery (group by GROUPS structure)
- Render card details (large view + text view)
- Handle theme & language switches
- Persist preferences to localStorage

---

## Future Considerations

**Overlaid text on cards** (Phase 2):
- Architecture prepared: GROUP_COLORS and metadata in place
- Will add `assets/data/card-texts-overlay/` with localized text
- Render text as canvas overlay or absolutely positioned div

**Consulter l'oracle** (Phase 2):
- Oracle casting logic (random card selection or algorithmic)
- New screen with casting animation
- Button enabled and wired in Phase 2

**PWA / Service Worker** (Optional):
- Can be added like YiJing using Workbox CLI
- Command: `npm run pwa` to regenerate sw.js

---

## Success Criteria

- [ ] Pages render correctly in light/dark themes
- [ ] All 53 card thumbnails display in grouped gallery
- [ ] Navigation (prev/next/center button) works correctly
- [ ] Card text renders from markdown without formatting issues
- [ ] Language toggle (FR/EN) updates all UI text + card text
- [ ] Preferences persisted to localStorage
- [ ] Responsive on mobile (720px constraint)
- [ ] Same look & feel as YiJing (reused CSS patterns)

---

## Notes

- **Asset copying:** Don't link to @assets/ — copy cartes_illustrations and cartes_textes_complets into the project root (assets/ subdirectory)
- **Markdown content:** All 53 .md files already exist in assets/cartes_textes_complets/
- **Card images:** All 53 .jpg files already exist in assets/cartes_illustrations/
- **No build step:** Served as static files; open index.html directly or use local HTTP server
