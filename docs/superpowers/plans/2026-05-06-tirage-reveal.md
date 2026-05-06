# Tirage Reveal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an animated card-draw transition (screen 7) and a card revelation screen (screen 8) to the existing tirage flow.

**Architecture:** Two new screens added to the vanilla JS SPA — `#s-tirage-anim` (animation, no navbar, auto-transitions) and `#s-tirage-reveal` (card + domain text + bottom nav). CSS scoped under `tc-*` prefix for the animation. Random card drawn via `crypto.getRandomValues()`. Domain text extracted from pre-parsed markdown by h3 index.

**Tech Stack:** Vanilla JS, HTML, CSS custom properties. `marked.js` global for markdown parsing. `crypto.getRandomValues()` for secure random. No build step.

---

## File Map

| File | Changes |
|------|---------|
| `assets/data/ui-texts.js` | Add `btn-nouveau-tirage` key (FR + EN) |
| `index.html` | Add screens 7 (`#s-tirage-anim`) and 8 (`#s-tirage-reveal`) after screen 6 |
| `assets/css/style.css` | Add `tc-*` animation styles + `.tirage-anim-screen` + `reveal-*` styles |
| `assets/app/app.js` | State var, screenMap, DOM cache, applyLanguage, 5 new functions, updated event listeners |

---

## Context for agentic workers

This is a vanilla JS SPA (no framework, no bundler). All scripts loaded via `<script>` in `index.html`. Navigation via `goTo(screenIndex)`. Existing tirage state: `currentDomain` (string key: amour/travail/argent/famille/spiritualite), `currentNumber` (int 1–9). Current screens: 0–6. Spec: `docs/superpowers/specs/2026-05-06-tirage-reveal-design.md`.

The existing num-btn handler (in `setupEventListeners()`, around line 594 in `app.js`) currently only stores `currentNumber`. This task replaces that handler with the full navigation logic.

No test framework exists. Verification is visual (open `index.html` via Live Server).

---

## Task 1: i18n key `btn-nouveau-tirage`

**Files:**
- Modify: `assets/data/ui-texts.js:17` (FR section) and `:65` (EN section)

- [ ] **Step 1: Add FR key** — in `assets/data/ui-texts.js`, after the line `'screen-chiffre-title': ...` in the `fr` block (line 17), add:

```js
    'btn-nouveau-tirage': 'Nouveau tirage',
```

- [ ] **Step 2: Add EN key** — in `assets/data/ui-texts.js`, after the line `'screen-chiffre-title': ...` in the `en` block (line 65), add:

```js
    'btn-nouveau-tirage': 'New Reading',
```

- [ ] **Step 3: Verify** — open browser console, run `UI_TEXTS.fr['btn-nouveau-tirage']`. Expected: `"Nouveau tirage"`.

- [ ] **Step 4: Commit**

```bash
git add assets/data/ui-texts.js
git commit -m "feat: add btn-nouveau-tirage i18n key (FR + EN)"
```

---

## Task 2: HTML — screens 7 and 8

**Files:**
- Modify: `index.html:229` (after closing `</div>` of screen 6, before `</div><!-- /#screens -->`)

- [ ] **Step 1: Add screen 7 and 8** — in `index.html`, insert the following block after line 229 (`</div>` closing `#s-tirage-chiffre`) and before `</div><!-- /#screens -->` (line 231):

```html
    <!-- SCREEN 7 — TIRAGE ANIMATION -->
    <div class="screen tirage-anim-screen" id="s-tirage-anim">
      <div class="tc-stage" id="tc-deck"></div>
    </div>

    <!-- SCREEN 8 — TIRAGE REVEAL -->
    <div class="screen" id="s-tirage-reveal">
      <div class="tirage-body tirage-reveal-body">
        <div id="reveal-header" class="reveal-header"></div>
        <img id="reveal-card-img" class="reveal-card-img" alt="">
        <p id="reveal-text" class="reveal-text"></p>
      </div>
      <div class="bottom-nav">
        <button class="nav-arr" id="arr-reveal-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="btn-action" id="bt-nouveau-tirage"></button>
        <div class="nav-spacer"></div>
      </div>
    </div>
```

- [ ] **Step 2: Verify structure** — in browser, open DevTools → Elements, confirm `#s-tirage-anim` and `#s-tirage-reveal` exist inside `#screens`.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add tirage animation and reveal screens HTML (screens 7 + 8)"
```

---

## Task 3: CSS — animation styles and reveal styles

**Files:**
- Modify: `assets/css/style.css:932` (after `.num-btn:active` rule, before the `ta-*` animation section)

- [ ] **Step 1: Add all new CSS** — insert the following block in `assets/css/style.css` after line 931 (`.num-btn:active { ... }`):

```css
/* ═══════════════════════════════════════════════════════════
   SCREEN 7 — TIRAGE CARD ANIMATION (tc-* prefix)
   ═══════════════════════════════════════════════════════════ */

.tirage-anim-screen {
  justify-content: center;
  align-items: center;
}

#s-tirage-anim {
  --tc-bg: var(--color-bg);
  --tc-fg: var(--color-text);
  --tc-card-w: 38px;
  --tc-card-h: 56px;
}

.tc-stage {
  width: 200px;
  height: 200px;
  position: relative;
  display: grid;
  place-items: center;
  perspective: 600px;
}

.tc-card {
  position: absolute;
  width: var(--tc-card-w);
  height: var(--tc-card-h);
  transform-style: preserve-3d;
  --tx: 0px; --ty: 0px; --rot: 0deg;
  --fade-x: 0px; --fade-o: 1; --flip: 0deg;
  transform: translate(var(--tx), var(--ty)) translateX(var(--fade-x)) rotate(var(--rot)) rotateY(var(--flip));
  opacity: var(--fade-o);
  transition: none;
}

.tc-card.tc-fading {
  transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  --fade-x: -120px;
  --fade-o: 0;
}

.tc-card.tc-flipping {
  transition: transform 0.7s cubic-bezier(0.45, 0, 0.2, 1);
  --flip: 180deg;
}

.tc-face {
  position: absolute;
  inset: 0;
  border: 2px solid var(--tc-fg);
  border-radius: 4px;
  background: var(--tc-bg);
  backface-visibility: hidden;
  display: grid;
  place-items: center;
}

.tc-back {
  background:
    repeating-linear-gradient(45deg, var(--tc-fg) 0 1.5px, transparent 1.5px 5px),
    var(--tc-bg);
}

.tc-back::before {
  content: "";
  position: absolute;
  inset: 4px;
  border: 1.5px solid var(--tc-bg);
  border-radius: 2px;
  box-shadow: inset 0 0 0 1.5px var(--tc-fg);
}

.tc-back::after {
  content: "";
  width: 10px;
  height: 10px;
  background: var(--tc-bg);
  border: 1.5px solid var(--tc-fg);
  transform: rotate(45deg);
  z-index: 1;
}

.tc-front {
  transform: rotateY(180deg);
  background: var(--tc-bg);
}

@media (prefers-reduced-motion: reduce) {
  .tc-card.tc-fading,
  .tc-card.tc-flipping { transition-duration: 0.01s !important; }
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 8 — TIRAGE REVEAL
   ═══════════════════════════════════════════════════════════ */

.tirage-reveal-body {
  gap: 16px;
  justify-content: center;
}

.reveal-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.reveal-card-img {
  flex: 1;
  max-height: 55vh;
  width: auto;
  object-fit: contain;
  border-radius: min(8vw, 40px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}

.reveal-text {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: var(--color-text);
  text-align: center;
  line-height: 1.5;
}
```

- [ ] **Step 2: Verify** — open `index.html` in browser, open DevTools → Console, run:
  ```js
  document.getElementById('s-tirage-anim').style.background = 'red'
  ```
  Switch to screen 7 via `goTo(7)` — confirm the screen fills the viewport (red background visible). Then run `document.getElementById('s-tirage-anim').style.background = ''` to reset.

- [ ] **Step 3: Commit**

```bash
git add assets/css/style.css
git commit -m "feat: add tc-* animation CSS and reveal screen styles"
```

---

## Task 4: JS — state, screenMap, DOM cache, applyLanguage

**Files:**
- Modify: `assets/app/app.js` (multiple locations)

- [ ] **Step 1: Add state variable** — after `let currentNumber = null;` (line 14), add:

```js
let tirageCardId = null;
```

- [ ] **Step 2: Extend screenMap** — in the `screenMap` object (lines 17–25), add entries for screens 7 and 8:

```js
const screenMap = {
  0: 's-home',
  1: 's-cards',
  2: 's-card-large',
  3: 's-card-text',
  4: 's-tirage-choix',
  5: 's-tirage-domaine',
  6: 's-tirage-chiffre',
  7: 's-tirage-anim',
  8: 's-tirage-reveal'
};
```

- [ ] **Step 3: Add DOM cache entries** — at the end of `cacheDOM()`, after `dom.tirageNumbers = ...` (line 94), add:

```js
  dom.revealHeader    = document.getElementById('reveal-header');
  dom.revealCardImg   = document.getElementById('reveal-card-img');
  dom.revealText      = document.getElementById('reveal-text');
  dom.arrRevealBack   = document.getElementById('arr-reveal-back');
  dom.btNouveauTirage = document.getElementById('bt-nouveau-tirage');
```

- [ ] **Step 4: Add applyLanguage binding** — at the end of `applyLanguage()`, after `dom.tirageChiffreTitle.textContent = txt('screen-chiffre-title');` (line 185), add:

```js
  dom.btNouveauTirage.textContent = txt('btn-nouveau-tirage');
```

- [ ] **Step 5: Verify** — in browser console, run `goTo(8)`. Screen 8 should appear. Run `applyLanguage()`. Check that `document.getElementById('bt-nouveau-tirage').textContent` is `"Nouveau tirage"`.

- [ ] **Step 6: Commit**

```bash
git add assets/app/app.js
git commit -m "feat: extend app.js state, screenMap, DOM cache and applyLanguage for screens 7+8"
```

---

## Task 5: JS — core functions

**Files:**
- Modify: `assets/app/app.js` (add after `initTirageAnimation()` function, before `// ──── BOOTSTRAP ────`)

- [ ] **Step 1: Add all new functions** — insert the following block after the closing `}` of `initTirageAnimation()` (after line 618) and before `// ──── BOOTSTRAP ────` (line 620):

```js
// ──── TIRAGE CARD DRAW ────

function drawTirageCard() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  tirageCardId = buf[0] % 53;
}

// ──── TIRAGE CARD ANIMATION (tc-*) ────

const tcSleep = ms => new Promise(r => setTimeout(r, ms));

function tcJitter(i) {
  const r = x => x - Math.floor(x);
  return {
    tx:  (r(Math.sin(i * 12.9898) * 43758.5453) - 0.5) * 4,
    ty:  (r(Math.sin(i * 78.233)  * 43758.5453) - 0.5) * 4,
    rot: (r(Math.sin(i * 39.346)  * 43758.5453) - 0.5) * 6
  };
}

function buildTcDeck(deckEl, n) {
  deckEl.innerHTML = '';
  const total = n + 1;
  for (let i = 0; i < total; i++) {
    const card = document.createElement('div');
    card.className = 'tc-card';
    const j = tcJitter(i);
    const isFinal = i === 0;
    card.style.setProperty('--tx',  isFinal ? '0px'  : j.tx  + 'px');
    card.style.setProperty('--ty',  isFinal ? '0px'  : j.ty  + 'px');
    card.style.setProperty('--rot', isFinal ? '0deg' : j.rot + 'deg');
    card.style.zIndex = String(i + 1);
    const back  = document.createElement('div'); back.className  = 'tc-face tc-back';
    const front = document.createElement('div'); front.className = 'tc-face tc-front';
    card.appendChild(front);
    card.appendChild(back);
    deckEl.appendChild(card);
  }
}

async function playTcAnim(n, onComplete) {
  const deckEl = document.getElementById('tc-deck');
  buildTcDeck(deckEl, n);
  await tcSleep(400);
  const cards = Array.from(deckEl.children);
  for (let k = cards.length - 1; k >= 1; k--) {
    cards[k].classList.add('tc-fading');
    await tcSleep(380);
  }
  await tcSleep(250);
  cards[0].classList.add('tc-flipping');
  await tcSleep(750);
  onComplete();
}

// ──── TIRAGE REVEAL RENDERING ────

async function renderTirageReveal() {
  const groupName  = getGroupNameForCardId(tirageCardId);
  const groupColor = getGroupColor(groupName);
  const groupSymbol = getGroupSymbol(groupName);
  const cardName   = getCardName(tirageCardId, currentLang);
  const groupLabel = groupName ? txt(`group-${groupName}`) : '';
  const square = groupColor
    ? `<span class="planet-color-square" style="background:${groupColor}">${groupSymbol}</span> `
    : '';
  const label = groupLabel ? `${groupLabel} ` : '';
  dom.revealHeader.innerHTML = `${square}${label}${tirageCardId} / ${cardName}`;

  dom.revealCardImg.src = ALL_CARDS[tirageCardId].imageUrl;
  dom.revealCardImg.alt = cardName;

  const DOMAIN_H3_INDEX = { amour: 0, travail: 1, argent: 2, famille: 3, spiritualite: 4 };
  const h3Index = DOMAIN_H3_INDEX[currentDomain] ?? 0;
  const cardIdStr = String(tirageCardId).padStart(2, '0');
  try {
    const md = await fetch(`./assets/data/book/${currentLang}/${cardIdStr}.md`).then(r => r.text());
    const tmp = document.createElement('div');
    tmp.innerHTML = marked.parse(md);
    const h3s = tmp.querySelectorAll('h3');
    const targetH3 = h3s[h3Index];
    let text = '';
    if (targetH3) {
      let sib = targetH3.nextElementSibling;
      while (sib && sib.tagName !== 'P') sib = sib.nextElementSibling;
      if (sib) text = sib.textContent;
    }
    dom.revealText.textContent = text;
  } catch {
    dom.revealText.textContent = '';
  }
}
```

- [ ] **Step 2: Verify drawTirageCard** — in browser console:
  ```js
  drawTirageCard(); console.log(tirageCardId);
  ```
  Expected: integer between 0 and 52. Run 5 times — values should vary.

- [ ] **Step 3: Verify buildTcDeck** — in browser console:
  ```js
  buildTcDeck(document.getElementById('tc-deck'), 3);
  document.getElementById('tc-deck').children.length
  ```
  Expected: `4` (3 + 1 final card).

- [ ] **Step 4: Commit**

```bash
git add assets/app/app.js
git commit -m "feat: add drawTirageCard, tc animation helpers, and renderTirageReveal"
```

---

## Task 6: JS — event listeners

**Files:**
- Modify: `assets/app/app.js:594–599` (replace existing num-btn handler) and add reveal screen listeners

- [ ] **Step 1: Replace num-btn handler** — find the current num-btn handler in `setupEventListeners()` (lines 594–599):

```js
  dom.tirageNumbers.addEventListener('click', (e) => {
    const btn = e.target.closest('.num-btn');
    if (!btn) return;
    currentNumber = parseInt(btn.dataset.num, 10);
    playSound('click');
  });
```

Replace it with:

```js
  dom.tirageNumbers.addEventListener('click', (e) => {
    const btn = e.target.closest('.num-btn');
    if (!btn) return;
    currentNumber = parseInt(btn.dataset.num, 10);
    drawTirageCard();
    if (currentNumber === 1) {
      renderTirageReveal();
      goTo(8);
    } else {
      goTo(7);
      playTcAnim(currentNumber - 1, () => { renderTirageReveal(); goTo(8); });
    }
    playSound('click');
  });
```

- [ ] **Step 2: Add reveal screen listeners** — at the end of `setupEventListeners()`, after the closing `}` of the num-btn listener (line 599) and before the function's closing `}` (line 600), add:

```js
  // Screen 8 — Reveal
  dom.arrRevealBack.addEventListener('click', () => { goTo(4); playSound('back'); });
  dom.btNouveauTirage.addEventListener('click', () => { goTo(5); playSound('click'); });
```

- [ ] **Step 3: Full flow test — chiffre 1** — in browser:
  - Navigate: Home → Tirage → Carte unique → select a domain → tap chiffre **1**
  - Expected: screen 8 appears immediately (no animation), card image visible, header shows planet + card name, text below in normal color.

- [ ] **Step 4: Full flow test — chiffre 3** — in browser:
  - Navigate back to Home → Tirage → Carte unique → select a domain → tap chiffre **3**
  - Expected: screen 7 appears with 4-card deck, 3 cards slide left, last card flips, then screen 8 auto-appears.

- [ ] **Step 5: Verify back navigation** — on screen 8, tap ← arrow. Expected: screen 4 (choix tirage).

- [ ] **Step 6: Verify "Nouveau tirage"** — on screen 8, tap "Nouveau tirage". Expected: screen 5 (domaine).

- [ ] **Step 7: Verify dark mode** — toggle dark mode, repeat a tirage. Expected: animation cards use `--color-bg` and `--color-text` (dark palette). The card back stripes and the card border adapt.

- [ ] **Step 8: Commit**

```bash
git add assets/app/app.js
git commit -m "feat: wire num-btn handler and reveal screen event listeners"
```
