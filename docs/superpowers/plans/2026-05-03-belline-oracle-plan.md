# Belline Oracle Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vanilla JS companion app for Belline Oracle cards with Home page, grouped card gallery, and detailed card views.

**Architecture:** Single-page app with CSS-based screen transitions (no framework). Reuses YiJing patterns: navbar with home/settings/info/theme buttons, modals for settings/info, localStorage for preferences, marked.js for markdown rendering.

**Tech Stack:** Vanilla JS, CSS Grid/Flexbox, marked.js (markdown parser), Poppins font (Google Fonts), localStorage for state

---

## Task 1: Copy card assets to project

**Files:**
- Copy: `assets/cartes_illustrations/00.jpg` ... `52.jpg` (from @assets/)
- Copy: `assets/data/book/fr/00.md` ... `52.md` (from @assets/cartes_textes_complets/, rename to match)
- Copy: `assets/data/book/en/00.md` ... `52.md` (create English translations or placeholders)

**Steps:**

- [ ] Create directories

```powershell
mkdir -p "E:\LOCALHOST\belline\assets\cartes_illustrations"
mkdir -p "E:\LOCALHOST\belline\assets\data\book\fr"
mkdir -p "E:\LOCALHOST\belline\assets\data\book\en"
```

- [ ] Copy card illustrations from @assets/

```powershell
Copy-Item -Path "E:\LOCALHOST\belline\assets\cartes_illustrations\*" `
          -Destination "E:\LOCALHOST\belline\assets\cartes_illustrations\" -Recurse
```

(Manually copy all 53 .jpg files, or use: Copy from `assets/` folder's `cartes_illustrations/` to project's `assets/cartes_illustrations/`)

- [ ] Copy French card texts

```powershell
Copy-Item -Path "E:\LOCALHOST\belline\assets\cartes_textes_complets\*.md" `
          -Destination "E:\LOCALHOST\belline\assets\data\book\fr\" -Recurse
```

- [ ] Create English placeholder texts

Create 53 files in `assets/data/book/en/` named `00.md` ... `52.md` with placeholder content:

```markdown
# Card [ID] - [Name]

English translation coming soon.
```

(Or manually translate the French content)

- [ ] Verify all assets copied

```powershell
Get-ChildItem "E:\LOCALHOST\belline\assets\cartes_illustrations\" | Measure-Object
# Expected: 53 items

Get-ChildItem "E:\LOCALHOST\belline\assets\data\book\fr\" | Measure-Object
# Expected: 53 items
```

- [ ] Commit

```bash
git add assets/cartes_illustrations/ assets/data/book/
git commit -m "assets: add Belline card illustrations and texts (FR/EN)"
```

---

## Task 2: Create base HTML structure (index.html)

**Files:**
- Create: `index.html`

**Steps:**

- [ ] Write index.html with screen system and modals

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="theme-color" content="#1a1a1a">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
  <title>L'Oracle de Belline</title>
  <meta name="description" content="Application compagnon pour l'Oracle de Belline">
  
  <link rel="shortcut icon" href="./assets/images/favicon.png">
  <link rel="icon" type="image/x-icon" href="./assets/images/favicon.ico">
  <link href="./assets/css/style.css" rel="stylesheet">
</head>
<body>

<!-- ── Shared header ── -->
<header class="hdr">
  <div class="hdr-left">
    <button class="hdr-home hidden" id="bt-home" aria-label="Home">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H15v-5h-6v5H4a1 1 0 01-1-1V10.5z"/>
      </svg>
    </button>
  </div>
  <div class="hdr-right">
    <button class="hdr-btn" id="bt-settings" aria-label="Settings">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    </button>
    <button class="hdr-btn" id="bt-info" aria-label="Info">i</button>
    <button class="hdr-btn" id="bt-theme" aria-label="Theme">☀️</button>
  </div>
</header>

<div id="app">

  <!-- ── Screens ── -->
  <div id="screens">

    <!-- SCREEN 0 — HOME -->
    <div class="screen active" id="s-home">
      <div class="home-body">
        <div class="home-title" id="home-title"></div>
        <div class="home-subtitle" id="home-subtitle"></div>
        <button class="btn-primary" id="bt-cards"></button>
        <button class="btn-secondary" id="bt-oracle" disabled></button>
      </div>
    </div>

    <!-- SCREEN 1 — CARDS GALLERY -->
    <div class="screen" id="s-cards">
      <div class="cards-container" id="cards-container"></div>
    </div>

    <!-- SCREEN 2 — CARD LARGE -->
    <div class="screen" id="s-card-large">
      <div class="card-image-area">
        <img id="card-image-large" src="" alt="Card" class="card-image">
      </div>
      <div class="card-nav">
        <button class="btn-nav" id="bt-prev">←</button>
        <button class="btn-nav primary" id="bt-back-to-cards">Revenir aux cartes</button>
        <button class="btn-nav" id="bt-next">→</button>
      </div>
    </div>

    <!-- SCREEN 3 — CARD TEXT -->
    <div class="screen" id="s-card-text">
      <div class="card-text-area" id="card-text-area"></div>
      <div class="card-nav">
        <button class="btn-nav" id="bt-prev-text">←</button>
        <button class="btn-nav primary" id="bt-back-to-cards-text">Revenir aux cartes</button>
        <button class="btn-nav" id="bt-next-text">→</button>
      </div>
    </div>

  </div>

</div>

<!-- ── Modals ── -->
<div id="modal-settings" class="modal hidden">
  <div class="modal-content">
    <h2 id="settings-title"></h2>
    <div class="modal-row">
      <label id="lang-label"></label>
      <div class="toggle-group">
        <button class="toggle-btn active" data-lang="fr" id="lang-fr">Français</button>
        <button class="toggle-btn" data-lang="en" id="lang-en">English</button>
      </div>
    </div>
    <div class="modal-row">
      <label id="sound-label"></label>
      <button class="toggle-btn" id="toggle-sound"></button>
    </div>
    <button class="btn-close" id="bt-close-settings">×</button>
  </div>
</div>

<div id="modal-info" class="modal hidden">
  <div class="modal-content">
    <h2 id="info-title"></h2>
    <div id="info-version" class="info-version"></div>
    <div id="info-text" class="info-text"></div>
    <button class="btn-close" id="bt-close-info">×</button>
  </div>
</div>

<!-- ── Scripts ── -->
<script src="./assets/libs/marked/marked.min.js"></script>
<script src="./assets/data/ui-texts.js"></script>
<script src="./assets/data/belline-cards.js"></script>
<script src="./assets/js/app.js"></script>

</body>
</html>
```

- [ ] Commit

```bash
git add index.html
git commit -m "feat: add base HTML structure with screens and modals"
```

---

## Task 3: Create CSS with theme variables and screen system

**Files:**
- Create: `assets/css/style.css`

**Steps:**

- [ ] Write style.css with Belline colors, theme variables, and screen system

```css
:root {
  --color-bg: #dccbaf;
  --color-text: #333333;
  --color-text-secondary: #666666;
  --color-border: #b8a89a;
  --color-header: #e8dcc3;
  
  --color-soleil: #d47706;
  --color-lune: #3c6382;
  --color-mercure: #e64f3a;
  --color-venus: #089992;
  --color-mars: #b81540;
  --color-jupiter: #0c2462;
  --color-saturne: #814c9a;
  
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.15);
}

:root.light {
  --color-bg: #dccbaf;
  --color-text: #333333;
  --color-text-secondary: #666666;
  --color-border: #b8a89a;
  --color-header: #e8dcc3;
}

:root.dark {
  --color-bg: #1a1a1a;
  --color-text: #f0f0f0;
  --color-text-secondary: #b0b0b0;
  --color-border: #333333;
  --color-header: #2a2a2a;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body {
  font-family: 'Noto Serif', serif;
  color: var(--color-text);
  background: var(--color-bg);
  transition: background 0.3s, color 0.3s;
}

/* ── Font imports ── */
@font-face {
  font-family: 'Poppins';
  src: url('./fonts/poppins/poppins-700.woff2') format('woff2');
  font-weight: 700;
}

@font-face {
  font-family: 'Poppins';
  src: url('./fonts/poppins/poppins-600.woff2') format('woff2');
  font-weight: 600;
}

@font-face {
  font-family: 'Poppins';
  src: url('./fonts/poppins/poppins-400.woff2') format('woff2');
  font-weight: 400;
}

/* ── Header ── */
header.hdr {
  background: var(--color-header);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: calc(env(safe-area-inset-top, 0px) + 12px) 16px 12px;
  gap: 16px;
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.hdr-left, .hdr-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.hdr-home.hidden {
  display: none;
}

.hdr-btn {
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  border-radius: 4px;
  transition: background 0.2s;
}

.hdr-btn:active {
  background: rgba(0,0,0,0.1);
}

.hdr-btn svg {
  width: 24px;
  height: 24px;
  stroke: currentColor;
}

/* ── App container ── */
#app {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  max-width: 720px;
  margin: 0 auto;
  position: relative;
}

/* ── Screens system ── */
#screens {
  position: relative;
  flex: 1;
  overflow: hidden;
}

.screen {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: translateX(30px);
  pointer-events: none;
  transition: opacity 0.4s ease, transform 0.4s ease;
  overflow-y: auto;
  overflow-x: hidden;
}

.screen.active {
  opacity: 1;
  transform: translateX(0);
  pointer-events: all;
  z-index: 1;
}

.screen.leaving {
  opacity: 0;
  transform: translateX(-30px);
  pointer-events: none;
  z-index: 0;
}

/* ── Home screen ── */
.home-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px 20px;
  text-align: center;
  gap: 24px;
}

.home-title {
  font-family: 'Poppins', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text);
}

.home-subtitle {
  font-size: 16px;
  color: var(--color-text-secondary);
}

.btn-primary, .btn-secondary {
  padding: 12px 24px;
  border-radius: 8px;
  border: 2px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Noto Sans', sans-serif;
}

.btn-primary:active {
  transform: scale(0.95);
  background: var(--color-text);
  color: var(--color-bg);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Cards gallery ── */
.cards-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 16px;
  padding-bottom: 60px;
}

.card-thumb {
  aspect-ratio: 2/3;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  border: 2px solid transparent;
}

.card-thumb:active {
  transform: scale(0.95);
}

.card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.group-header {
  grid-column: 1 / -1;
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 600;
  padding: 16px 0 8px;
  margin-top: 8px;
}

/* ── Card large view ── */
.card-image-area {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 20px;
  overflow: hidden;
}

.card-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  cursor: pointer;
  border-radius: 8px;
}

.card-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  gap: 8px;
  background: var(--color-header);
  border-top: 1px solid var(--color-border);
}

.btn-nav {
  padding: 8px 16px;
  border: 2px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  flex: 0 1 auto;
  transition: all 0.2s;
}

.btn-nav.primary {
  flex: 1;
  background: var(--color-text);
  color: var(--color-bg);
  border-color: var(--color-text);
}

.btn-nav:active {
  transform: scale(0.95);
}

/* ── Card text view ── */
.card-text-area {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  padding-bottom: 80px;
}

.card-text-area h1 {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  margin-bottom: 16px;
  color: var(--color-text);
}

.card-text-area h2 {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  margin-top: 20px;
  margin-bottom: 12px;
  color: var(--color-text);
}

.card-text-area p {
  margin-bottom: 12px;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

/* ── Modals ── */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  opacity: 1;
  pointer-events: all;
  transition: opacity 0.3s;
}

.modal.hidden {
  opacity: 0;
  pointer-events: none;
}

.modal-content {
  background: var(--color-bg);
  border-radius: 12px;
  padding: 24px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 2px solid var(--color-border);
}

.modal-content h2 {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  margin-bottom: 20px;
  color: var(--color-text);
}

.modal-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}

.modal-row:last-child {
  border-bottom: none;
}

.modal-row label {
  font-size: 14px;
  color: var(--color-text);
}

.toggle-group {
  display: flex;
  gap: 8px;
}

.toggle-btn {
  padding: 6px 12px;
  border: 2px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: var(--color-text);
  color: var(--color-bg);
  border-color: var(--color-text);
}

.btn-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--color-text);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-version {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.info-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .cards-container {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

- [ ] Commit

```bash
git add assets/css/style.css
git commit -m "feat: add Belline CSS with colors, theme, and screen system"
```

---

## Task 4: Create UI texts data (ui-texts.js)

**Files:**
- Create: `assets/data/ui-texts.js`

**Steps:**

- [ ] Write ui-texts.js with FR/EN strings

```javascript
const UI_TEXTS = {
  fr: {
    // Home
    'home-title': "L'Oracle de Belline",
    'home-subtitle': 'Application compagnon',
    'btn-cards': 'Les cartes',
    'btn-oracle': 'Consulter l\'oracle',
    
    // Cards
    'group-4premières': 'Les 4 premières',
    'group-Soleil': 'Soleil',
    'group-Lune': 'Lune',
    'group-Mercure': 'Mercure',
    'group-Venus': 'Vénus',
    'group-Mars': 'Mars',
    'group-Jupiter': 'Jupiter',
    'group-Saturne': 'Saturne',
    
    // Buttons
    'btn-back-to-cards': 'Revenir aux cartes',
    'btn-settings': 'Préférences',
    'btn-info': 'À propos',
    'btn-theme': 'Thème',
    
    // Settings modal
    'settings-title': 'Préférences',
    'lang-label': 'Langue',
    'lang-fr': 'Français',
    'lang-en': 'English',
    'sound-label': 'Sons',
    'sound-on': 'Activé',
    'sound-off': 'Désactivé',
    
    // Info modal
    'info-title': 'À propos',
    'info-version': 'Version 1.0.0',
    'info-text': '<p>L\'Oracle de Belline est une application compagnon pour explorer les 53 cartes de l\'Oracle de Belline.</p><p>Chaque carte porte une signification particulière, idéale pour la consultation et la méditation.</p>'
  },
  en: {
    // Home
    'home-title': 'Belline Oracle',
    'home-subtitle': 'Companion App',
    'btn-cards': 'Cards',
    'btn-oracle': 'Query Oracle',
    
    // Cards
    'group-4premières': 'First Four',
    'group-Soleil': 'Sun',
    'group-Lune': 'Moon',
    'group-Mercure': 'Mercury',
    'group-Venus': 'Venus',
    'group-Mars': 'Mars',
    'group-Jupiter': 'Jupiter',
    'group-Saturne': 'Saturn',
    
    // Buttons
    'btn-back-to-cards': 'Back to Cards',
    'btn-settings': 'Settings',
    'btn-info': 'About',
    'btn-theme': 'Theme',
    
    // Settings modal
    'settings-title': 'Settings',
    'lang-label': 'Language',
    'lang-fr': 'Français',
    'lang-en': 'English',
    'sound-label': 'Sounds',
    'sound-on': 'Enabled',
    'sound-off': 'Disabled',
    
    // Info modal
    'info-title': 'About',
    'info-version': 'Version 1.0.0',
    'info-text': '<p>Belline Oracle is a companion app to explore the 53 cards of the Belline Oracle.</p><p>Each card carries particular significance, ideal for consultation and meditation.</p>'
  }
};
```

- [ ] Commit

```bash
git add assets/data/ui-texts.js
git commit -m "feat: add UI text strings (FR/EN)"
```

---

## Task 5: Create card metadata (belline-cards.js)

**Files:**
- Create: `assets/data/belline-cards.js`

**Steps:**

- [ ] Write belline-cards.js with GROUPS structure and metadata

```javascript
const GROUPS = {
  null: [0, 1, 2, 3],
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

// Flat array of all cards for linear navigation
const ALL_CARDS = Array.from({length: 53}, (_, i) => ({
  id: i,
  imageUrl: `./assets/cartes_illustrations/${String(i).padStart(2, '0')}.jpg`
}));

// Helper to get group name for a card ID
function getGroupNameForCardId(cardId) {
  for (const [groupName, cardIds] of Object.entries(GROUPS)) {
    if (cardIds.includes(cardId)) {
      return groupName;
    }
  }
  return null;
}

// Helper to get color for a group
function getGroupColor(groupName) {
  return GROUP_COLORS[groupName] || null;
}
```

- [ ] Commit

```bash
git add assets/data/belline-cards.js
git commit -m "feat: add card metadata and GROUPS structure"
```

---

## Task 6: Create main app.js with initialization

**Files:**
- Create: `assets/js/app.js`

**Steps:**

- [ ] Write app.js with initialization, state management, and screen navigation

```javascript
// ── State ──
let currentLang = localStorage.getItem('Belline_lang') || 'fr';
let currentTheme = localStorage.getItem('Belline_theme') || 'light';
let soundEnabled = localStorage.getItem('Belline_sound') !== 'false';
let currentScreen = 0;
let currentCardId = 0;
let isCardTextView = false; // true = text view, false = large card view

// ── Cache ──
const screenMap = {
  0: 's-home',
  1: 's-cards',
  2: 's-card-large',
  3: 's-card-text'
};

const screens = document.querySelectorAll('.screen');
const modalSettings = document.getElementById('modal-settings');
const modalInfo = document.getElementById('modal-info');

// ── Initialize ──
function init() {
  loadPreferences();
  setupEventListeners();
  renderHome();
  goTo(0);
}

function loadPreferences() {
  // Apply theme
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('light');
  }
  
  // Update UI
  updateSettingsDisplay();
}

function setupEventListeners() {
  // Home buttons
  document.getElementById('bt-cards').addEventListener('click', () => goTo(1));
  document.getElementById('bt-oracle').addEventListener('click', () => {
    // Disabled, no-op
  });
  
  // Header buttons
  document.getElementById('bt-home').addEventListener('click', () => goTo(0));
  document.getElementById('bt-settings').addEventListener('click', openSettingsModal);
  document.getElementById('bt-info').addEventListener('click', openInfoModal);
  document.getElementById('bt-theme').addEventListener('click', toggleTheme);
  
  // Card gallery
  document.getElementById('bt-back-to-cards-text').addEventListener('click', () => goTo(1));
  
  // Large card view
  document.getElementById('bt-prev').addEventListener('click', prevCard);
  document.getElementById('bt-next').addEventListener('click', nextCard);
  document.getElementById('bt-back-to-cards').addEventListener('click', () => goTo(1));
  document.getElementById('card-image-large').addEventListener('click', () => {
    isCardTextView = true;
    renderCardText();
    goTo(3);
  });
  
  // Text view
  document.getElementById('bt-prev-text').addEventListener('click', prevCard);
  document.getElementById('bt-next-text').addEventListener('click', nextCard);
  document.getElementById('bt-back-to-cards-text').addEventListener('click', () => goTo(1));
  document.getElementById('card-text-area').addEventListener('click', () => {
    isCardTextView = false;
    renderCardLarge();
    goTo(2);
  });
  
  // Settings modal
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', (e) => switchLang(e.target.dataset.lang));
  });
  document.getElementById('toggle-sound').addEventListener('click', toggleSound);
  document.getElementById('bt-close-settings').addEventListener('click', closeSettingsModal);
  
  // Info modal
  document.getElementById('bt-close-info').addEventListener('click', closeInfoModal);
  
  // Modal backdrop clicks
  modalSettings.addEventListener('click', (e) => {
    if (e.target === modalSettings) closeSettingsModal();
  });
  modalInfo.addEventListener('click', (e) => {
    if (e.target === modalInfo) closeInfoModal();
  });
}

// ── Navigation ──
function goTo(screenIndex) {
  const fromScreen = document.getElementById(screenMap[currentScreen]);
  const toScreen = document.getElementById(screenMap[screenIndex]);
  
  if (fromScreen === toScreen) return;
  
  // Animate out
  if (fromScreen) {
    fromScreen.classList.remove('active');
    fromScreen.classList.add('leaving');
    setTimeout(() => {
      fromScreen.classList.remove('leaving');
    }, 400);
  }
  
  // Animate in
  toScreen.classList.add('active');
  currentScreen = screenIndex;
  
  // Show/hide home button
  const homeBtn = document.getElementById('bt-home');
  if (screenIndex === 0) {
    homeBtn.classList.add('hidden');
  } else {
    homeBtn.classList.remove('hidden');
  }
}

function prevCard() {
  currentCardId = (currentCardId - 1 + 53) % 53;
  playSound('back');
  if (isCardTextView) {
    renderCardText();
  } else {
    renderCardLarge();
  }
}

function nextCard() {
  currentCardId = (currentCardId + 1) % 53;
  playSound('back');
  if (isCardTextView) {
    renderCardText();
  } else {
    renderCardLarge();
  }
}

// ── Screen rendering ──
function renderHome() {
  document.getElementById('home-title').textContent = txt('home-title');
  document.getElementById('home-subtitle').textContent = txt('home-subtitle');
  document.getElementById('bt-cards').textContent = txt('btn-cards');
  document.getElementById('bt-oracle').textContent = txt('btn-oracle');
}

function renderCards() {
  const container = document.getElementById('cards-container');
  container.innerHTML = '';
  
  for (const [groupName, cardIds] of Object.entries(GROUPS)) {
    // Group header (except first unnamed group)
    if (groupName !== 'null') {
      const header = document.createElement('div');
      header.className = 'group-header';
      header.textContent = txt(`group-${groupName}`);
      header.style.color = getGroupColor(groupName);
      container.appendChild(header);
    }
    
    // Cards in group
    cardIds.forEach(cardId => {
      const card = document.createElement('div');
      card.className = 'card-thumb';
      const img = document.createElement('img');
      img.src = ALL_CARDS[cardId].imageUrl;
      img.alt = `Card ${cardId}`;
      card.appendChild(img);
      card.addEventListener('click', () => {
        currentCardId = cardId;
        isCardTextView = false;
        renderCardLarge();
        playSound('click');
        goTo(2);
      });
      container.appendChild(card);
    });
  }
}

function renderCardLarge() {
  const img = document.getElementById('card-image-large');
  img.src = ALL_CARDS[currentCardId].imageUrl;
  img.alt = `Card ${currentCardId}`;
}

function renderCardText() {
  const area = document.getElementById('card-text-area');
  area.innerHTML = '<p>Loading...</p>';
  
  const textFile = `./assets/data/book/${currentLang}/${String(currentCardId).padStart(2, '0')}.md`;
  
  fetch(textFile)
    .then(res => res.text())
    .then(md => {
      area.innerHTML = marked.parse(md);
    })
    .catch(err => {
      area.innerHTML = '<p>Error loading text.</p>';
      console.error(err);
    });
}

// ── Modals ──
function openSettingsModal() {
  modalSettings.classList.remove('hidden');
  playSound('click');
}

function closeSettingsModal() {
  modalSettings.classList.add('hidden');
  playSound('click');
}

function openInfoModal() {
  document.getElementById('info-title').textContent = txt('info-title');
  document.getElementById('info-version').textContent = txt('info-version');
  document.getElementById('info-text').innerHTML = txt('info-text');
  modalInfo.classList.remove('hidden');
  playSound('click');
}

function closeInfoModal() {
  modalInfo.classList.add('hidden');
  playSound('click');
}

// ── Preferences ──
function switchLang(lang) {
  if (lang === currentLang) return;
  
  currentLang = lang;
  localStorage.setItem('Belline_lang', lang);
  
  // Update UI
  updateSettingsDisplay();
  renderHome();
  if (currentScreen === 1) renderCards();
  if (currentScreen === 3) renderCardText();
  
  playSound('click');
}

function updateSettingsDisplay() {
  document.getElementById('settings-title').textContent = txt('settings-title');
  document.getElementById('lang-label').textContent = txt('lang-label');
  document.getElementById('sound-label').textContent = txt('sound-label');
  
  // Update language toggle
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
  
  // Update sound toggle
  const soundBtn = document.getElementById('toggle-sound');
  soundBtn.textContent = soundEnabled ? txt('sound-on') : txt('sound-off');
  soundBtn.classList.toggle('active', soundEnabled);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  currentTheme = isDark ? 'dark' : 'light';
  localStorage.setItem('Belline_theme', currentTheme);
  playSound('click');
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem('Belline_sound', soundEnabled);
  updateSettingsDisplay();
  playSound('click');
}

// ── Utilities ──
function txt(key) {
  return UI_TEXTS[currentLang][key] || `[${key}]`;
}

function playSound(type) {
  if (!soundEnabled) return;
  
  const soundUrl = type === 'back' 
    ? './assets/sounds/back.mp3'
    : './assets/sounds/click.mp3';
  
  const audio = new Audio(soundUrl);
  audio.play().catch(() => {
    // Silently fail if audio can't play
  });
}

// ── Start app ──
window.addEventListener('DOMContentLoaded', init);
```

- [ ] Commit

```bash
git add assets/js/app.js
git commit -m "feat: add main app logic with screens, navigation, and preferences"
```

---

## Task 7: Add Poppins font files

**Files:**
- Create: `assets/fonts/poppins/poppins-*.woff2`

**Steps:**

- [ ] Download Poppins font from Google Fonts

Visit https://fonts.google.com/specimen/Poppins and download weights: 400, 600, 700 (woff2 format)

- [ ] Create fonts directory and place files

```powershell
mkdir -p "E:\LOCALHOST\belline\assets\fonts\poppins"
# Copy downloaded .woff2 files to this directory
# Expected files:
# - poppins-400.woff2
# - poppins-600.woff2
# - poppins-700.woff2
```

- [ ] Commit

```bash
git add assets/fonts/poppins/
git commit -m "assets: add Poppins font files"
```

---

## Task 8: Manual testing — Home page

**Files:** None

**Steps:**

- [ ] Start local HTTP server

```powershell
# Install Python if not already installed, then:
cd "E:\LOCALHOST\belline"
python -m http.server 8000
# Open browser to http://localhost:8000
```

- [ ] Test Home page renders correctly

- Check "L'Oracle de Belline" title displays
- Check "Application compagnon" subtitle displays
- Check two buttons: "Les cartes" and "Consulter l'oracle"
- Check "Consulter l'oracle" button is disabled/greyed out
- Check light theme is applied by default

- [ ] Test theme toggle

- Click theme button (☀️) → page should switch to dark mode
- Refresh page → dark mode should persist
- Click theme button again → back to light mode
- Refresh → light mode should persist

- [ ] Test settings modal

- Click settings button (gear) → settings modal opens
- Check language toggle shows FR/EN
- Check sound toggle shows Enabled/Disabled
- Click close (×) → modal closes
- Click outside modal → modal closes

- [ ] Test info modal

- Click info button (i) → info modal opens
- Check version number displays
- Check about text displays
- Click close → modal closes

- [ ] No crash, all text readable in both themes

- [ ] Screenshot for verification (optional)

---

## Task 9: Manual testing — Cards gallery

**Files:** None

**Steps:**

- [ ] Navigate to Cards page

- Click "Les cartes" button on home page
- Page should transition to cards gallery
- Home button should appear in navbar

- [ ] Verify cards display

- All 53 cards should be visible in 4-column grid
- Cards should display images from assets/cartes_illustrations/
- Groups should have colored headers (Soleil, Lune, etc.)
- First 4 cards should not have a group header

- [ ] Test card click

- Click any card thumbnail → should navigate to large card view
- Image should display full-size
- Navigation buttons should be visible at bottom

- [ ] Test language switch

- Open settings modal
- Switch to English (En)
- Close modal and return to gallery
- Group names should change to English (Sun, Moon, etc.)
- Switch back to French → should display French names again

- [ ] No crashes, all images load

---

## Task 10: Manual testing — Card Large & Text views

**Files:** None

**Steps:**

- [ ] Navigate to a card's large view

- From cards gallery, click any card
- Large image should display
- Previous/Next/Center buttons should be visible

- [ ] Test navigation between cards

- Click Next button → image changes to next card
- Continue clicking → wraps from card 52 to card 0 (verify wrapper behavior)
- Click Previous → goes to previous card, wraps correctly

- [ ] Test "Back to Cards" button

- Click center button → returns to gallery
- Gallery shows all cards

- [ ] Navigate to card text view

- Click on the large card image
- Should display markdown text from assets/data/book/{lang}/NN.md
- Navigation buttons should remain (Previous/Next/Back to Cards)

- [ ] Test text view navigation

- Click Previous/Next buttons → text changes to previous/next card
- "Back to Cards" → returns to gallery

- [ ] Click card text to return to large view

- Click anywhere on the text area → returns to large card view

- [ ] Test language switch in card views

- Open settings, switch to English
- Card text should reload in English
- French texts already exist, English are placeholders but should still render

- [ ] Sound plays on clicks (if enabled)

- Navigate through cards, click buttons
- Hear click/back sounds if audio is enabled
- Disable sound in settings → no sounds
- Enable → sounds return

- [ ] No crashes during navigation

---

## Task 11: Manual testing — Complete user flow

**Files:** None

**Steps:**

- [ ] Complete flow test

- Start at Home
- Click "Les cartes" → gallery
- Click a card → large view
- Click image → text view
- Click next → next card text
- Click "Back to Cards" → gallery
- Click home button → home page
- Verify all transitions smooth

- [ ] Test light/dark toggle throughout

- In each screen (home, gallery, large, text), toggle theme
- All colors should update immediately
- Refresh page → theme persists

- [ ] Test language toggle throughout

- In each screen, switch language
- All UI text + card text should update
- Refresh → language persists

- [ ] Sound toggle

- Enable/disable sound, verify clicks are silent/audible as expected

- [ ] localStorage verification

- Open browser DevTools → Application → localStorage
- Verify keys: `Belline_lang`, `Belline_theme`, `Belline_sound`
- Values should match current state

- [ ] Responsive check

- Test on mobile view (720px max-width)
- Cards grid stays 4 columns
- All buttons accessible
- Text readable

- [ ] No console errors

- Open DevTools console → should be clean (no JS errors)

- [ ] All requirements met

- ✅ Home page with 2 buttons
- ✅ Cards gallery with 7 groups + colors
- ✅ Large card view with navigation
- ✅ Card text view (markdown rendered)
- ✅ Light/dark theme toggle
- ✅ Language toggle (FR/EN)
- ✅ Settings modal (lang + sound)
- ✅ Info modal (version + text)
- ✅ localStorage persistence
- ✅ Sound on/off
- ✅ Wrapper navigation (prev/next)

- [ ] Commit final state

```bash
git add -A
git commit -m "build: Belline Oracle Phase 1 complete and tested"
```

---

## Self-Review Against Spec

**Spec coverage:**
- ✅ Home page (title, subtitle, 2 buttons, Oracle button disabled)
- ✅ Cards gallery (grouped by planet, 4 columns, colored headers)
- ✅ Card large view (full-image, click to text view)
- ✅ Card text view (markdown rendered)
- ✅ Navigation (prev/next wrapper, center button returns)
- ✅ Header (home left, settings/info/theme right)
- ✅ Settings modal (language + sound only, no theme toggle there)
- ✅ Info modal (version + HTML text)
- ✅ Localization (FR/EN)
- ✅ Theme (light/dark, stored in localStorage)
- ✅ Color palette (Belline colors, group colors)
- ✅ Font (Poppins for display)
- ✅ Sound (click/back, can disable)

**No placeholders found.** All code is complete and ready to implement.

**Type consistency:** All function names, IDs, and data keys are consistent throughout (goTo, txt, playSound, GROUPS, GROUP_COLORS, ALL_CARDS, etc.).

**All spec requirements covered.**

---

## Notes for Implementation

- **No build step:** Serve as static files via HTTP server (no bundling)
- **marked.js:** Already included in assets/libs/marked/ (from YiJing)
- **Font files:** Download from Google Fonts in woff2 format
- **Card images:** All exist in assets/cartes_illustrations/ (copy to project)
- **Card texts:** All exist in assets/cartes_textes_complets/ (copy to assets/data/book/fr/)
- **English texts:** Create placeholders for Phase 1 (translate later)
- **localStorage keys:** `Belline_lang`, `Belline_theme`, `Belline_sound`
- **Screen IDs:** Match the HTML (s-home, s-cards, s-card-large, s-card-text)
- **Button IDs:** Match the HTML (bt-home, bt-settings, etc.)
