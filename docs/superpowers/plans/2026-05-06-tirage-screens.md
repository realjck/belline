# Tirage Screens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 3-screen card-drawing flow (choice → domain → number picker with animation) behind a new "Tirage" button on the Home screen.

**Architecture:** Pure extension of the existing vanilla JS SPA — 3 new screens added to `screenMap` (indices 4, 5, 6), HTML added to `index.html`, styles appended to `style.css`, i18n keys added to `ui-texts.js`, and wiring added to `app.js`. The Belline animation is embedded as scoped `ta-*` CSS classes. No new files created.

**Tech Stack:** Vanilla JS, CSS custom properties, HTML. No build step.

---

## File Map

| File | Changes |
|------|---------|
| `assets/data/ui-texts.js` | Add 10 new i18n keys (FR + EN) |
| `index.html` | Home: wrap buttons in `.home-buttons`, add `#bt-tirage`. Add screens 4, 5, 6 |
| `assets/css/style.css` | Tighten home spacing, add tirage screen styles, add `ta-*` animation CSS |
| `assets/app/app.js` | Extend screenMap, add state vars, extend DOM cache, extend applyLanguage(), add event listeners, add initTirageAnimation() |

---

## Task 1: Create feature branch

- [ ] **Create and checkout branch**

```bash
git checkout -b feat/tirage-screens
```

Expected: `Switched to a new branch 'feat/tirage-screens'`

---

## Task 2: Add i18n keys to `ui-texts.js`

**File:** `assets/data/ui-texts.js`

- [ ] **Add keys to FR section** — insert after `'btn-oracle': 'Consulter l\'oracle',`

```js
    'btn-tirage': 'Tirage',
    'btn-une-carte': 'Une seule carte',
    'btn-tirage-croix': 'Tirage en croix',
    'screen-domaine-title': 'Sur quoi porte votre question ?',
    'domain-amour': 'Amour / Sentimental',
    'domain-travail': 'Travail / Professionnel',
    'domain-argent': 'Argent / Financier',
    'domain-famille': 'Famille',
    'domain-spiritualite': 'Spiritualité',
    'screen-chiffre-title': 'Choisissez un chiffre',
```

- [ ] **Add keys to EN section** — insert after `'btn-oracle': 'Query Oracle',`

```js
    'btn-tirage': 'Reading',
    'btn-une-carte': 'Single Card',
    'btn-tirage-croix': 'Cross Reading',
    'screen-domaine-title': 'What is your question about?',
    'domain-amour': 'Love / Relationships',
    'domain-travail': 'Work / Professional',
    'domain-argent': 'Money / Financial',
    'domain-famille': 'Family',
    'domain-spiritualite': 'Spirituality',
    'screen-chiffre-title': 'Choose a number',
```

- [ ] **Commit**

```bash
git add assets/data/ui-texts.js
git commit -m "feat: add tirage i18n keys (FR + EN)"
```

---

## Task 3: Modify Home screen — HTML

**File:** `index.html`

- [ ] **Replace the single `#bt-start` button with a wrapped pair** — replace the existing `<!-- SCREEN 0 — HOME -->` block:

```html
    <!-- SCREEN 0 — HOME -->
    <div class="screen active" id="s-home">
      <div class="home-body">
        <div class="home-title" id="home-title"></div>
        <img class="home-logo" src="./assets/images/belline-logo.png" alt="Belline Oracle logo">
        <div class="home-sub" id="home-subtitle"></div>
        <div class="home-buttons">
          <button class="btn-start" id="bt-start"></button>
          <button class="btn-start" id="bt-tirage"></button>
        </div>
      </div>
    </div>
```

- [ ] **Verify** — open `index.html` in a browser via Live Server. The home should show two pill buttons stacked vertically, even if the second has no text yet.

---

## Task 4: Modify Home screen — CSS

**File:** `assets/css/style.css`

- [ ] **Tighten vertical spacing** — in the `HOME SCREEN` section, apply these changes:

In `.home-body`: change `gap: 24px` → `gap: 12px`

In `.home-title`: change `font-size: 64px` → `font-size: 52px` and remove `margin-bottom: 12px` (set to `0`)

In `.home-sub`: remove `margin-bottom: 12px` (set to `0`)

In `.btn-start`: remove `margin-top: 40px` (set to `0`)

- [ ] **Add `.home-buttons` rule** — add after `.btn-start` block:

```css
.home-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}
```

- [ ] **Verify** — in browser, the home content should fit within the visible viewport without scrolling on a 375px-wide mobile screen. Title, logo (300px wide), subtitle and two buttons all visible.

- [ ] **Commit**

```bash
git add index.html assets/css/style.css
git commit -m "feat: add tirage button to home and tighten layout"
```

---

## Task 5: Add screens 4 and 5 to `index.html`

**File:** `index.html` — insert after closing `</div>` of SCREEN 3

- [ ] **Add screen 4 — Choix du tirage**

```html
    <!-- SCREEN 4 — TIRAGE CHOIX -->
    <div class="screen" id="s-tirage-choix">
      <div class="tirage-body">
        <button class="btn-action" id="bt-une-carte"></button>
        <button class="btn-action btn-disabled" id="bt-tirage-croix"></button>
      </div>
      <div class="bottom-nav">
        <button class="nav-arr" id="arr-tirage-choix-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span class="nav-spacer"></span>
      </div>
    </div>
```

- [ ] **Add screen 5 — Domaine**

```html
    <!-- SCREEN 5 — TIRAGE DOMAINE -->
    <div class="screen" id="s-tirage-domaine">
      <div class="tirage-body">
        <div class="tirage-domaine-title" id="tirage-domaine-title"></div>
        <button class="btn-action btn-domain" data-domain="amour">
          <span class="domain-glyph">♡</span>
          <span class="domain-label" data-key="domain-amour"></span>
        </button>
        <button class="btn-action btn-domain" data-domain="travail">
          <span class="domain-glyph">⌬</span>
          <span class="domain-label" data-key="domain-travail"></span>
        </button>
        <button class="btn-action btn-domain" data-domain="argent">
          <span class="domain-glyph">❖</span>
          <span class="domain-label" data-key="domain-argent"></span>
        </button>
        <button class="btn-action btn-domain" data-domain="famille">
          <span class="domain-glyph">ᗑ</span>
          <span class="domain-label" data-key="domain-famille"></span>
        </button>
        <button class="btn-action btn-domain" data-domain="spiritualite">
          <span class="domain-glyph">☸︎</span>
          <span class="domain-label" data-key="domain-spiritualite"></span>
        </button>
      </div>
      <div class="bottom-nav">
        <button class="nav-arr" id="arr-tirage-domaine-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span class="nav-spacer"></span>
      </div>
    </div>
```

---

## Task 6: Add screen 6 to `index.html`

**File:** `index.html` — insert after screen 5

- [ ] **Add screen 6 — Chiffres + Animation**

```html
    <!-- SCREEN 6 — TIRAGE CHIFFRE -->
    <div class="screen" id="s-tirage-chiffre">
      <div class="tirage-body tirage-chiffre-body">
        <div class="tirage-chiffre-title" id="tirage-chiffre-title"></div>
        <div id="tirage-animation">
          <div class="tirage-anim">
            <div class="ta-disc"></div>
            <div class="ta-ticks" id="ta-ticks"></div>
            <div class="ta-ring ta-r3"></div>
            <div class="ta-ring ta-r2"></div>
            <div class="ta-ring ta-r1"></div>
            <div class="ta-orbit ta-sun">
              <div class="ta-body">
                <div class="ta-sun-icon">
                  <div class="ta-core"></div>
                  <div class="ta-ray"></div>
                  <div class="ta-ray"></div>
                  <div class="ta-ray"></div>
                  <div class="ta-ray"></div>
                </div>
              </div>
            </div>
            <div class="ta-orbit ta-moon">
              <div class="ta-body">
                <div class="ta-moon-icon"></div>
              </div>
            </div>
            <div class="ta-orbit ta-star" style="--ta-dur:1.75s; --ta-dir:normal; --ta-r:var(--ta-orbit-1);">
              <div class="ta-body"><div class="ta-star-icon" style="--ta-s:9px;"></div></div>
            </div>
            <div class="ta-orbit ta-star" style="--ta-dur:1.75s; --ta-dir:normal; --ta-r:var(--ta-orbit-1); animation-delay:-0.875s;">
              <div class="ta-body" style="animation-delay:-0.875s;"><div class="ta-star-icon" style="--ta-s:7px;"></div></div>
            </div>
            <div class="ta-orbit ta-star" style="--ta-dur:3.5s; --ta-dir:reverse; --ta-r:var(--ta-orbit-3); animation-delay:-0.5s;">
              <div class="ta-body" style="animation-delay:-0.5s;"><div class="ta-star-icon" style="--ta-s:8px;"></div></div>
            </div>
            <div class="ta-orbit ta-star" style="--ta-dur:3.5s; --ta-dir:reverse; --ta-r:var(--ta-orbit-3); animation-delay:-2s;">
              <div class="ta-body" style="animation-delay:-2s;"><div class="ta-star-icon" style="--ta-s:6px;"></div></div>
            </div>
            <div class="ta-orbit ta-star" style="--ta-dur:3.5s; --ta-dir:reverse; --ta-r:var(--ta-orbit-3); animation-delay:-2.75s;">
              <div class="ta-body" style="animation-delay:-2.75s;"><div class="ta-star-icon" style="--ta-s:7px;"></div></div>
            </div>
            <div class="ta-card-wrap">
              <div class="ta-card">
                <div class="ta-card-face ta-front"></div>
                <div class="ta-card-face ta-back"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="tirage-numbers" id="tirage-numbers">
          <div class="tirage-numbers-row">
            <button class="nav-arr num-btn" data-num="1">1</button>
            <button class="nav-arr num-btn" data-num="2">2</button>
            <button class="nav-arr num-btn" data-num="3">3</button>
            <button class="nav-arr num-btn" data-num="4">4</button>
            <button class="nav-arr num-btn" data-num="5">5</button>
          </div>
          <div class="tirage-numbers-row">
            <button class="nav-arr num-btn" data-num="6">6</button>
            <button class="nav-arr num-btn" data-num="7">7</button>
            <button class="nav-arr num-btn" data-num="8">8</button>
            <button class="nav-arr num-btn" data-num="9">9</button>
          </div>
        </div>
      </div>
      <div class="bottom-nav">
        <button class="nav-arr" id="arr-tirage-chiffre-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span class="nav-spacer"></span>
      </div>
    </div>
```

- [ ] **Commit**

```bash
git add index.html
git commit -m "feat: add tirage screens 4, 5, 6 HTML structure"
```

---

## Task 7: Add CSS for tirage screens to `style.css`

**File:** `assets/css/style.css` — append all the following at the end of the file

- [ ] **Add tirage screen base styles**

```css
/* ═══════════════════════════════════════════════════════════
   TIRAGE SCREENS (4, 5, 6)
   ═══════════════════════════════════════════════════════════ */

.tirage-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex: 1;
  padding: 24px;
}

.btn-disabled {
  opacity: 0.35;
  pointer-events: none;
}

/* Screen 5 — Domain */
.tirage-domaine-title {
  font-size: 17px;
  color: var(--color-muted);
  text-align: center;
  margin-bottom: 8px;
}

.btn-domain {
  display: flex;
  align-items: center;
  gap: 12px;
  width: min(80%, 400px);
  text-align: left;
}

.domain-glyph {
  font-family: 'Segoe UI Symbol', sans-serif;
  font-size: 18px;
  color: var(--color-accent);
  flex-shrink: 0;
}

/* Screen 6 — Chiffres */
.tirage-chiffre-body {
  gap: 24px;
}

.tirage-chiffre-title {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 22px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
}

#tirage-animation {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tirage-numbers {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.tirage-numbers-row {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.num-btn {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 18px;
  font-weight: 600;
}
```

- [ ] **Add animation CSS** — append immediately after the tirage screen styles:

```css
/* ═══════════════════════════════════════════════════════════
   TIRAGE ANIMATION (ta-* prefix, scoped to avoid conflicts)
   ═══════════════════════════════════════════════════════════ */

.tirage-anim {
  --ta-bg: var(--color-bg);
  --ta-fg: var(--color-accent);
  --ta-size: 200px;
  --ta-stroke: 2px;
  --ta-orbit-1: 38px;
  --ta-orbit-2: 60px;
  --ta-orbit-3: 82px;

  width: var(--ta-size);
  height: var(--ta-size);
  position: relative;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.ta-disc {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: var(--ta-stroke) solid var(--ta-fg);
  animation: ta-spin 4.5s linear infinite;
}

.ta-ring {
  position: absolute;
  top: 50%; left: 50%;
  border-radius: 50%;
  border: 1.5px dashed var(--ta-fg);
  opacity: 0.4;
  transform: translate(-50%, -50%);
}
.ta-r1 { width: calc(var(--ta-orbit-1) * 2); height: calc(var(--ta-orbit-1) * 2); }
.ta-r2 { width: calc(var(--ta-orbit-2) * 2); height: calc(var(--ta-orbit-2) * 2); }
.ta-r3 { width: calc(var(--ta-orbit-3) * 2); height: calc(var(--ta-orbit-3) * 2); }

.ta-ticks {
  position: absolute; inset: 0;
  border-radius: 50%;
  animation: ta-spin 15s linear infinite reverse;
}
.ta-ticks i {
  position: absolute;
  top: 0; left: 50%;
  width: 2px; height: 6px;
  background: var(--ta-fg);
  transform-origin: 50% calc(var(--ta-size) / 2);
}

.ta-card-wrap {
  position: absolute;
  width: 38px;
  height: 56px;
  perspective: 400px;
  z-index: 4;
}
.ta-card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: ta-card-flip 1s ease-in-out infinite;
}
.ta-card-face {
  position: absolute;
  inset: 0;
  border: 2px solid var(--ta-fg);
  border-radius: 4px;
  background: var(--ta-bg);
  backface-visibility: hidden;
  display: grid;
  place-items: center;
}
.ta-front {
  background:
    repeating-linear-gradient(45deg,
      var(--ta-fg) 0 1.5px,
      transparent 1.5px 5px),
    var(--ta-bg);
}
.ta-front::before {
  content: "";
  position: absolute;
  inset: 4px;
  border: 1.5px solid var(--ta-bg);
  border-radius: 2px;
  box-shadow: inset 0 0 0 1.5px var(--ta-fg);
}
.ta-front::after {
  content: "";
  width: 10px; height: 10px;
  background: var(--ta-bg);
  border: 1.5px solid var(--ta-fg);
  transform: rotate(45deg);
  z-index: 1;
}
.ta-back {
  transform: rotateY(180deg);
  font-size: 22px;
  font-weight: 700;
  font-family: ui-serif, Georgia, "Times New Roman", serif;
  color: var(--ta-fg);
}
.ta-back::before { content: "?"; }

.ta-orbit {
  position: absolute;
  top: 50%; left: 50%;
  width: 0; height: 0;
}
.ta-orbit > .ta-body { position: absolute; }

.ta-orbit.ta-sun { animation: ta-spin 4.5s linear infinite; }
.ta-orbit.ta-sun > .ta-body {
  top: calc(var(--ta-orbit-3) * -1);
  animation: ta-counter-spin 4.5s linear infinite;
}

.ta-sun-icon { width: 22px; height: 22px; position: relative; }
.ta-sun-icon .ta-core {
  position: absolute; inset: 5px;
  border-radius: 50%;
  background: var(--ta-fg);
}
.ta-sun-icon .ta-ray {
  position: absolute;
  top: 50%; left: 50%;
  width: 3px; height: 24px;
  background: var(--ta-fg);
  transform-origin: center;
  border-radius: 1.5px;
  margin-left: -1.5px;
  margin-top: -12px;
}
.ta-sun-icon .ta-ray:nth-child(2) { transform: rotate(0deg); }
.ta-sun-icon .ta-ray:nth-child(3) { transform: rotate(45deg); }
.ta-sun-icon .ta-ray:nth-child(4) { transform: rotate(90deg); }
.ta-sun-icon .ta-ray:nth-child(5) { transform: rotate(135deg); }

.ta-orbit.ta-moon { animation: ta-spin 3.25s linear infinite reverse; }
.ta-orbit.ta-moon > .ta-body {
  top: calc(var(--ta-orbit-2) * -1);
  animation: ta-counter-spin-rev 3.25s linear infinite;
}
.ta-moon-icon {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--ta-fg);
  -webkit-mask: radial-gradient(circle 9px at 14px 10px, transparent 98%, #000 100%);
          mask: radial-gradient(circle 9px at 14px 10px, transparent 98%, #000 100%);
  transform: rotate(-25deg);
}

.ta-orbit.ta-star {
  animation: ta-spin var(--ta-dur, 5s) linear infinite var(--ta-dir, normal);
}
.ta-orbit.ta-star > .ta-body {
  top: calc(var(--ta-r, var(--ta-orbit-1)) * -1);
  animation: ta-counter-spin var(--ta-dur, 5s) linear infinite var(--ta-dir, normal);
}

.ta-star-icon {
  width: var(--ta-s, 10px);
  height: var(--ta-s, 10px);
  position: relative;
}
.ta-star-icon::before,
.ta-star-icon::after {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--ta-fg);
  clip-path: polygon(50% 0, 58% 42%, 100% 50%, 58% 58%, 50% 100%, 42% 58%, 0 50%, 42% 42%);
}
.ta-star-icon::after {
  transform: scale(0.5) rotate(45deg);
  opacity: 0.85;
}

@keyframes ta-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes ta-counter-spin {
  from { transform: translate(-50%, 0) rotate(0deg); }
  to   { transform: translate(-50%, 0) rotate(-360deg); }
}
@keyframes ta-counter-spin-rev {
  from { transform: translate(-50%, 0) rotate(0deg); }
  to   { transform: translate(-50%, 0) rotate(360deg); }
}
@keyframes ta-card-flip {
  0%   { transform: rotateY(0deg); }
  45%  { transform: rotateY(180deg); }
  50%  { transform: rotateY(180deg); }
  95%  { transform: rotateY(360deg); }
  100% { transform: rotateY(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .ta-disc, .ta-ticks, .ta-orbit, .ta-orbit > .ta-body, .ta-card {
    animation-duration: 60s !important;
  }
}
```

- [ ] **Commit**

```bash
git add assets/css/style.css
git commit -m "feat: add tirage screens CSS and animation styles"
```

---

## Task 8: Update `app.js` — state, screenMap, DOM cache, applyLanguage

**File:** `assets/app/app.js`

- [ ] **Add state variables** — add after `let currentCardId = 0;`

```js
let currentDomain = null;
let currentNumber = null;
```

- [ ] **Extend screenMap** — replace the existing `screenMap` object:

```js
const screenMap = {
  0: 's-home',
  1: 's-cards',
  2: 's-card-large',
  3: 's-card-text',
  4: 's-tirage-choix',
  5: 's-tirage-domaine',
  6: 's-tirage-chiffre'
};
```

- [ ] **Extend cacheDOM()** — add before the closing `}` of `cacheDOM()`:

```js
  // Tirage
  dom.btTirage = document.getElementById('bt-tirage');
  dom.btUneCarte = document.getElementById('bt-une-carte');
  dom.btTirageCroix = document.getElementById('bt-tirage-croix');
  dom.arrTirageChoixBack = document.getElementById('arr-tirage-choix-back');
  dom.tirageDomainTitle = document.getElementById('tirage-domaine-title');
  dom.arrTirageDomaineBack = document.getElementById('arr-tirage-domaine-back');
  dom.tirageChiffreTitle = document.getElementById('tirage-chiffre-title');
  dom.arrTirageChiffreBack = document.getElementById('arr-tirage-chiffre-back');
  dom.tirageNumbers = document.getElementById('tirage-numbers');
```

- [ ] **Extend applyLanguage()** — add before the closing `}` of `applyLanguage()`:

```js
  // Home tirage button
  dom.btTirage.textContent = txt('btn-tirage');

  // Screen 4 — Choix
  dom.btUneCarte.textContent = txt('btn-une-carte');
  dom.btTirageCroix.textContent = txt('btn-tirage-croix');

  // Screen 5 — Domaine
  dom.tirageDomainTitle.textContent = txt('screen-domaine-title');
  document.querySelectorAll('.domain-label[data-key]').forEach(el => {
    el.textContent = txt(el.dataset.key);
  });

  // Screen 6 — Chiffre
  dom.tirageChiffreTitle.textContent = txt('screen-chiffre-title');
```

- [ ] **Commit**

```bash
git add assets/app/app.js
git commit -m "feat: extend app.js state, screenMap, DOM cache and language bindings"
```

---

## Task 9: Update `app.js` — event listeners and animation init

**File:** `assets/app/app.js`

- [ ] **Add tirage event listeners** — add inside `setupEventListeners()`, before the closing `}`:

```js
  // Home — tirage button
  dom.btTirage.addEventListener('click', () => {
    goTo(4);
    playSound('click');
  });

  // Screen 4 — Choix
  dom.arrTirageChoixBack.addEventListener('click', () => {
    goTo(0);
    playSound('back');
  });
  dom.btUneCarte.addEventListener('click', () => {
    goTo(5);
    playSound('click');
  });

  // Screen 5 — Domaine
  dom.arrTirageDomaineBack.addEventListener('click', () => {
    goTo(4);
    playSound('back');
  });
  document.querySelectorAll('.btn-domain').forEach(btn => {
    btn.addEventListener('click', () => {
      currentDomain = btn.dataset.domain;
      goTo(6);
      playSound('click');
    });
  });

  // Screen 6 — Chiffres
  dom.arrTirageChiffreBack.addEventListener('click', () => {
    goTo(5);
    playSound('back');
  });
  dom.tirageNumbers.addEventListener('click', (e) => {
    const btn = e.target.closest('.num-btn');
    if (!btn) return;
    currentNumber = parseInt(btn.dataset.num, 10);
    playSound('click');
  });
```

- [ ] **Add `initTirageAnimation()` function** — add before the `// ──── BOOTSTRAP ────` comment:

```js
// ──── TIRAGE ANIMATION ────

function initTirageAnimation() {
  const ticks = document.getElementById('ta-ticks');
  if (!ticks) return;
  const N = 24;
  for (let i = 0; i < N; i++) {
    const tick = document.createElement('i');
    tick.style.transform = `translateX(-50%) rotate(${(360 / N) * i}deg)`;
    tick.style.transformOrigin = `50% calc(var(--ta-size) / 2)`;
    if (i % 6 === 0) {
      tick.style.height = '10px';
      tick.style.width = '2.5px';
    }
    ticks.appendChild(tick);
  }
}
```

- [ ] **Call `initTirageAnimation()` from `init()`** — add after `renderHome();` and before `goTo(0);`:

```js
  initTirageAnimation();
```

- [ ] **Commit**

```bash
git add assets/app/app.js
git commit -m "feat: wire tirage event listeners and animation tick init"
```

---

## Task 10: Manual verification

Open `index.html` via Live Server and verify:

- [ ] **Home screen** — two buttons visible, both styled identically, no overflow beyond viewport height (375px × 667px simulation). Texts correct in FR and EN after language switch.

- [ ] **Screen 4 (Choix)** — "Tirage" button on home navigates here. "Une seule carte" button is active. "Tirage en croix" is grayed out and unclickable. Back arrow ← returns to home.

- [ ] **Screen 5 (Domaine)** — "Une seule carte" navigates here. Title displayed. 5 domain buttons visible with colored glyph (Segoe UI Symbol font) left-aligned. Back arrow ← returns to screen 4. Language switch updates all labels.

- [ ] **Screen 6 (Chiffres)** — clicking any domain navigates here. Title displayed. Animation visible: outer disc spinning, dashed rings, orbiting sun/moon/stars in accent color, card flipping at center. Numbers 1–5 on first row, 6–9 on second row. Back arrow ← returns to screen 5.

- [ ] **Dark mode** — toggle theme from header. Animation adapts automatically (accent color adjusts with CSS variable).

- [ ] **Final commit**

```bash
git add -A
git commit -m "feat: complete tirage screens flow (screens 4, 5, 6)"
```
