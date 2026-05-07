# Tirage en Croix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable the "Tirage en croix" button to draw 5 cards sequentially without repeats, display each card reveal with its cross-position text, then show a recap screen with all 5 cards in a cross layout.

**Architecture:** Mode flag (`tirageMode`) reuses existing screens 6/7/8 with conditional rendering; new screen 9 handles the recap. A shuffled deck (`croixDeck`) ensures no duplicate cards across the 5 draws. `goTo()` gains a `forceDirection` param so forward transitions from screen 8→6 don't animate as "back".

**Tech Stack:** Vanilla JS, CSS Grid, crypto.getRandomValues, marked.js (already loaded), no build step. Serve via Live Server.

---

## File Map

| File | Changes |
|------|---------|
| `assets/data/ui-texts.js` | Add 6 keys for position labels and recap title |
| `index.html` | Enable croix button; add position-title div to screen 6; replace screen 8 spacer with right-arrow button; add screen 9 |
| `assets/css/style.css` | Grid nav override for screen 8; `.position-title`; cross grid + cell styles |
| `assets/app/app.js` | New state vars; update `screenMap`/`goTo`/`cacheDOM`; deck functions; screen 4/6/8 logic; new `renderCroixRecap`; language switching |

---

## Task 1: Add cross position texts to ui-texts.js

**Files:**
- Modify: `assets/data/ui-texts.js`

- [ ] **Step 1: Add keys to French block**

In `assets/data/ui-texts.js`, inside the `fr` object, add after `'btn-nouveau-tirage': 'Nouveau tirage',`:

```js
'croix-pos-1': '1. Situation actuelle',
'croix-pos-2': '2. Opposition',
'croix-pos-3': '3. Conseil',
'croix-pos-4': '4. Résultat',
'croix-pos-5': '5. Synthèse',
'croix-recap-title': 'Votre tirage en croix',
'btn-croix-nouveau-tirage': 'Nouveau tirage',
```

- [ ] **Step 2: Add keys to English block**

Inside the `en` object, add after `'btn-nouveau-tirage': 'New Reading',`:

```js
'croix-pos-1': '1. Current Situation',
'croix-pos-2': '2. Opposition',
'croix-pos-3': '3. Advice',
'croix-pos-4': '4. Outcome',
'croix-pos-5': '5. Synthesis',
'croix-recap-title': 'Your Cross Reading',
'btn-croix-nouveau-tirage': 'New Reading',
```

- [ ] **Step 3: Commit**

```bash
git add assets/data/ui-texts.js
git commit -m "feat: add cross reading UI texts (positions + recap title)"
```

---

## Task 2: HTML structure changes

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Enable the Tirage en croix button (screen 4)**

Find:
```html
<button class="btn-action btn-disabled" id="bt-tirage-croix"></button>
```
Replace with:
```html
<button class="btn-action" id="bt-tirage-croix"></button>
```

- [ ] **Step 2: Add position-title div to screen 6**

Find the opening tag of the chiffre body:
```html
<div class="tirage-body tirage-chiffre-body">
  <div class="tirage-chiffre-title" id="tirage-chiffre-title"></div>
```
Replace with:
```html
<div class="tirage-body tirage-chiffre-body">
  <div class="position-title hidden" id="croix-position-title"></div>
  <div class="tirage-chiffre-title" id="tirage-chiffre-title"></div>
```

- [ ] **Step 3: Replace screen 8 bottom-nav with 3-item grid nav**

Find the entire screen 8 bottom-nav block:
```html
      <div class="bottom-nav">
        <button class="nav-arr" id="arr-reveal-back" aria-label="Back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="btn-action" id="bt-nouveau-tirage"></button>
        <div class="nav-spacer"></div>
      </div>
```
Replace with:
```html
      <div class="bottom-nav reveal-bottom-nav">
        <button class="nav-arr" id="arr-reveal-back" aria-label="Back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="btn-action" id="bt-nouveau-tirage"></button>
        <button class="nav-arr" id="arr-reveal-next" aria-label="Next" style="visibility:hidden">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
```

- [ ] **Step 4: Add screen 9 (tirage croix recap) before `</div><!-- /#screens -->`**

Find:
```html
  </div><!-- /#screens -->
```
Insert before it:
```html
    <!-- SCREEN 9 — TIRAGE CROIX RECAP -->
    <div class="screen" id="s-tirage-croix-recap">
      <div class="croix-recap-body">
        <div class="croix-recap-title" id="croix-recap-title"></div>
        <div class="croix-grid" id="croix-grid"></div>
      </div>
      <div class="bottom-nav">
        <button class="nav-arr" id="arr-croix-recap-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="btn-action" id="bt-croix-nouveau-tirage"></button>
        <span class="nav-spacer"></span>
      </div>
    </div>

```

- [ ] **Step 5: Verify HTML in browser**

Open with Live Server. Navigate to screen 4 (click "Tirage") — both buttons should appear (no greyed-out "Tirage en croix"). Screen 6 structure unchanged visually. Screen 8 layout unchanged visually (the right arrow is invisible via `style`). No JS errors in console.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: HTML structure for tirage en croix (screens 4/6/8/9)"
```

---

## Task 3: CSS for screen 8 nav grid and cross layout

**Files:**
- Modify: `assets/css/style.css`

- [ ] **Step 1: Add screen 8 grid nav override**

At the end of the `SCREEN 8 — TIRAGE REVEAL` section (after `#s-tirage-reveal { overflow: hidden; }`):

```css
/* 3-column grid nav for reveal screen — keeps layout stable across modes */
.reveal-bottom-nav {
  display: grid;
  grid-template-columns: 42px 1fr 42px;
  align-items: center;
}
.reveal-bottom-nav .btn-action {
  justify-self: center;
}
```

- [ ] **Step 2: Add `.position-title` style**

After the reveal-bottom-nav block:

```css
/* ═══════════════════════════════════════════════════════════
   SCREEN 6 — POSITION TITLE (cross mode)
   ═══════════════════════════════════════════════════════════ */

.position-title {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: clamp(22px, 5.5vw, 32px);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-accent);
  text-align: center;
  padding: 0 16px 8px;
}
```

- [ ] **Step 3: Add screen 9 cross recap styles**

```css
/* ═══════════════════════════════════════════════════════════
   SCREEN 9 — TIRAGE CROIX RECAP
   ═══════════════════════════════════════════════════════════ */

.croix-recap-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px 0;
  overflow-y: auto;
  min-height: 0;
}

.croix-recap-title {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: clamp(18px, 4.5vw, 24px);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-accent);
  text-align: center;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.croix-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  width: 100%;
  max-width: 380px;
}

.croix-cell {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

/* Cross positions: left, right, top, bottom, center */
.croix-cell[data-pos="1"] { grid-area: 2 / 1; }
.croix-cell[data-pos="2"] { grid-area: 2 / 3; }
.croix-cell[data-pos="3"] { grid-area: 1 / 2; }
.croix-cell[data-pos="4"] { grid-area: 3 / 2; }
.croix-cell[data-pos="5"] { grid-area: 2 / 2; }

.croix-cell-img {
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: min(2vw, 10px);
  border: 1.5px solid var(--color-border);
  display: block;
  transition: border-color .2s;
}
.croix-cell:active .croix-cell-img {
  border-color: var(--color-accent);
}

.croix-cell-label {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-muted);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
```

- [ ] **Step 4: Verify layout in browser**

Open screen 8 — layout should look identical to before (left arrow, centered button, right arrow invisible). No visual regression on other screens.

- [ ] **Step 5: Commit**

```bash
git add assets/css/style.css
git commit -m "feat: CSS for cross reading (reveal grid nav, position title, recap cross grid)"
```

---

## Task 4: app.js — state, screenMap, goTo, cacheDOM

**Files:**
- Modify: `assets/app/app.js`

- [ ] **Step 1: Add cross state variables after existing state declarations**

After `let tcAnimCancelled = false;` (line 16), add:

```js
let tirageMode = 'une-carte';  // 'une-carte' | 'croix'
let croixPosition = 1;          // 1–5
let croixCards = [];            // drawn card ID per position
let croixDeck = [];             // remaining shuffled deck
let croixFromRecap = false;     // true when viewing detail from recap screen
```

- [ ] **Step 2: Add screen 9 to screenMap**

Replace the `screenMap` object (lines 19–29):

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
  8: 's-tirage-reveal',
  9: 's-tirage-croix-recap'
};
```

- [ ] **Step 3: Add new DOM element caches in cacheDOM()**

After `dom.btNouveauTirage = document.getElementById('bt-nouveau-tirage');` (end of Tirage section), add:

```js
  dom.arrRevealNext = document.getElementById('arr-reveal-next');
  dom.croixPositionTitle = document.getElementById('croix-position-title');
  dom.croixGrid = document.getElementById('croix-grid');
  dom.croixRecapTitle = document.getElementById('croix-recap-title');
  dom.arrCroixRecapBack = document.getElementById('arr-croix-recap-back');
  dom.btCroixNouveauTirage = document.getElementById('bt-croix-nouveau-tirage');
```

- [ ] **Step 4: Update goTo() to accept a forceDirection parameter**

Replace the existing `goTo(screenIndex)` function signature and `isBack` line:

```js
function goTo(screenIndex, forceDirection = null) {
  const fromScreenId = screenMap[currentScreen];
  const toScreenId = screenMap[screenIndex];

  if (!fromScreenId || !toScreenId) return;

  const fromScreen = document.getElementById(fromScreenId);
  const toScreen = document.getElementById(toScreenId);

  // Update home button visibility
  if (screenIndex === 0) {
    dom.btHome.classList.add('hidden');
  } else {
    dom.btHome.classList.remove('hidden');
  }

  const isBack = forceDirection === 'back'
    || (forceDirection !== 'forward' && screenIndex < currentScreen);

  // Exit screen
  if (fromScreen !== toScreen) {
    fromScreen.classList.remove('active');
    fromScreen.classList.add(isBack ? 'back-leaving' : 'leaving');
    setTimeout(() => {
      fromScreen.classList.remove('leaving', 'back-leaving');
    }, 350);
  }

  // Enter screen — slide from left if going back
  if (isBack) {
    toScreen.classList.add('back-enter');
    void toScreen.offsetWidth;
    toScreen.classList.remove('back-enter');
  }
  toScreen.classList.add('active');

  currentScreen = screenIndex;
}
```

- [ ] **Step 5: Verify in browser**

No visible change yet. Open DevTools console — no errors. Navigate between screens — transitions still work correctly.

- [ ] **Step 6: Commit**

```bash
git add assets/app/app.js
git commit -m "feat: add cross reading state, screen 9 to screenMap, forceDirection in goTo"
```

---

## Task 5: app.js — deck functions + screen 4 event listener

**Files:**
- Modify: `assets/app/app.js`

- [ ] **Step 1: Add shuffleCroixDeck() and drawCroixCard() after drawTirageCard()**

After the existing `drawTirageCard()` function (around line 666), add:

```js
function shuffleCroixDeck() {
  croixDeck = Array.from({ length: 53 }, (_, i) => i);
  for (let i = 52; i > 0; i--) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const j = buf[0] % (i + 1);
    [croixDeck[i], croixDeck[j]] = [croixDeck[j], croixDeck[i]];
  }
}

function drawCroixCard(n) {
  croixDeck.splice(0, n - 1);
  const cardId = croixDeck.splice(0, 1)[0];
  croixCards[croixPosition - 1] = cardId;
  tirageCardId = cardId;
}
```

- [ ] **Step 2: Add updateCroixPositionTitle() helper**

After `drawCroixCard()`, add:

```js
function updateCroixPositionTitle() {
  if (tirageMode !== 'croix') {
    dom.croixPositionTitle.classList.add('hidden');
    return;
  }
  dom.croixPositionTitle.textContent = txt(`croix-pos-${croixPosition}`);
  dom.croixPositionTitle.classList.remove('hidden');
}
```

- [ ] **Step 3: Wire screen 4 buttons and update home button in setupEventListeners()**

Find the existing `dom.btUneCarte` listener block in `setupEventListeners()`:
```js
  dom.btUneCarte.addEventListener('click', () => {
    goTo(5);
    playSound('click');
  });
```
Replace it and add the croix listener:
```js
  dom.btUneCarte.addEventListener('click', () => {
    tirageMode = 'une-carte';
    updateCroixPositionTitle();
    goTo(5);
    playSound('click');
  });

  dom.btTirageCroix.addEventListener('click', () => {
    tirageMode = 'croix';
    croixPosition = 1;
    croixCards = [];
    croixFromRecap = false;
    shuffleCroixDeck();
    updateCroixPositionTitle();
    goTo(6, 'forward');
    playSound('click');
  });
```

Also update the home button listener (already exists, find it):
```js
  dom.btHome.addEventListener('click', () => {
    tcAnimCancelled = true;
    dom.cardsGallery.scrollTop = 0;
    goTo(0);
    playSound('back');
  });
```
Replace with:
```js
  dom.btHome.addEventListener('click', () => {
    tirageMode = 'une-carte';
    tcAnimCancelled = true;
    dom.cardsGallery.scrollTop = 0;
    goTo(0);
    playSound('back');
  });
```

- [ ] **Step 4: Verify in browser**

Click "Tirage" → click "Tirage en croix". Should land on screen 6 with a position title "1. Situation actuelle" visible at the top. Open DevTools → Application → no errors. Verify `croixDeck` in console: `croixDeck.length` should be 53.

- [ ] **Step 5: Commit**

```bash
git add assets/app/app.js
git commit -m "feat: deck shuffle/draw functions and screen 4 cross reading entry"
```

---

## Task 6: app.js — screen 6 back button + number click handler

**Files:**
- Modify: `assets/app/app.js`

- [ ] **Step 1: Update arrTirageChiffreBack listener to handle cross mode**

Find the existing listener in `setupEventListeners()`:
```js
  dom.arrTirageChiffreBack.addEventListener('click', () => {
    goTo(5);
    playSound('back');
  });
```
Replace with:
```js
  dom.arrTirageChiffreBack.addEventListener('click', () => {
    if (tirageMode === 'croix') {
      tirageMode = 'une-carte';
      updateCroixPositionTitle();
      goTo(4);
    } else {
      goTo(5);
    }
    playSound('back');
  });
```

- [ ] **Step 2: Verify back button in browser**

- Start a cross reading (screen 6 shows "1. Situation actuelle")
- Press left arrow → goes to screen 4 (tirage choice), not screen 5
- Click "Carte unique" → goes to screen 5 (domain), then screen 6 with NO position title visible ✓
- Start cross reading again → position title reappears ✓

- [ ] **Step 3: Commit**

```bash
git add assets/app/app.js
git commit -m "feat: screen 6 back arrow goes to screen 4 in cross mode, reset tirageMode on exit"
```

---

## Task 7: app.js — number click handler for cross mode

**Files:**
- Modify: `assets/app/app.js`

- [ ] **Step 1: Replace the tirageNumbers click handler**

Find the existing handler in `setupEventListeners()`:
```js
  dom.tirageNumbers.addEventListener('click', (e) => {
    const btn = e.target.closest('.num-btn');
    if (!btn) return;
    currentNumber = parseInt(btn.dataset.num, 10);
    drawTirageCard();
    playSound('click');
    if (currentNumber === 1) {
      renderTirageReveal().then(() => { playSound('belline'); goTo(8); });
    } else {
      goTo(7);
      playTcAnim(currentNumber - 1, async () => { await renderTirageReveal(); playSound('belline'); goTo(8); });
    }
  });
```
Replace with:
```js
  dom.tirageNumbers.addEventListener('click', (e) => {
    const btn = e.target.closest('.num-btn');
    if (!btn) return;
    currentNumber = parseInt(btn.dataset.num, 10);
    playSound('click');

    if (tirageMode === 'croix') {
      drawCroixCard(currentNumber);
      if (currentNumber === 1) {
        renderTirageReveal().then(() => { playSound('belline'); goTo(8, 'forward'); });
      } else {
        goTo(7, 'forward');
        playTcAnim(currentNumber - 1, async () => {
          await renderTirageReveal();
          playSound('belline');
          goTo(8, 'forward');
        });
      }
    } else {
      drawTirageCard();
      if (currentNumber === 1) {
        renderTirageReveal().then(() => { playSound('belline'); goTo(8); });
      } else {
        goTo(7);
        playTcAnim(currentNumber - 1, async () => { await renderTirageReveal(); playSound('belline'); goTo(8); });
      }
    }
  });
```

- [ ] **Step 2: Verify in browser**

Do a full cross reading test for position 1:
- "Tirage en croix" → screen 6 shows "1. Situation actuelle"
- Click any number (e.g. 3) → animation plays (3 cards fade) → screen 8 appears with a card and text
- Try number 1 → goes directly to screen 8 (no animation)
- Verify `croixCards[0]` in console is a number 0–52

Also verify "Carte unique" still works: "Carte unique" → screen 5 (domain) → screen 6 (no position title) → number → reveal.

- [ ] **Step 3: Commit**

```bash
git add assets/app/app.js
git commit -m "feat: number click handler supports cross drawing mode"
```

---

## Task 8: app.js — modify renderTirageReveal + updateRevealNavbar + screen 8 events

**Files:**
- Modify: `assets/app/app.js`

- [ ] **Step 1: Replace renderTirageReveal() with mode-aware version**

Replace the entire existing `renderTirageReveal()` function (lines ~721–762) with:

```js
async function renderTirageReveal() {
  const groupName   = getGroupNameForCardId(tirageCardId);
  const groupColor  = getGroupColor(groupName);
  const groupSymbol = getGroupSymbol(groupName);
  const cardName    = getCardName(tirageCardId, currentLang);
  const groupLabel  = groupName ? txt(`group-${groupName}`) : '';
  const square = groupColor
    ? `<span class="planet-color-square" style="background:${groupColor}">${groupSymbol || ''}</span> `
    : '';
  const label = groupLabel
    ? `<span style="color:${groupColor}">${groupLabel}</span> `
    : '';
  dom.revealHeader.innerHTML = `${square}${label}${tirageCardId} / ${cardName}`;

  dom.revealCardImg.src = ALL_CARDS[tirageCardId].imageUrl;
  dom.revealCardImg.alt = cardName;
  dom.revealCardImg.classList.remove('flip-in');
  void dom.revealCardImg.offsetWidth;
  dom.revealCardImg.classList.add('flip-in');

  let h3Index;
  if (tirageMode === 'croix') {
    h3Index = 4 + croixPosition;
  } else {
    const DOMAIN_H3_INDEX = { amour: 0, travail: 1, argent: 2, famille: 3, spiritualite: 4 };
    h3Index = DOMAIN_H3_INDEX[currentDomain] ?? 0;
  }

  const cardIdStr = String(tirageCardId).padStart(2, '0');
  try {
    const r = await fetch(`./assets/data/book/${currentLang}/${cardIdStr}.md`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const md = await r.text();
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

  updateRevealNavbar();
}
```

- [ ] **Step 2: Add updateRevealNavbar() after renderTirageReveal()**

```js
function updateRevealNavbar() {
  if (tirageMode === 'une-carte') {
    dom.arrRevealBack.style.visibility = 'visible';
    dom.btNouveauTirage.style.visibility = 'visible';
    dom.arrRevealNext.style.visibility = 'hidden';
  } else if (croixFromRecap) {
    dom.arrRevealBack.style.visibility = 'visible';
    dom.btNouveauTirage.style.visibility = 'hidden';
    dom.arrRevealNext.style.visibility = 'hidden';
  } else {
    dom.arrRevealBack.style.visibility = 'hidden';
    dom.btNouveauTirage.style.visibility = 'hidden';
    dom.arrRevealNext.style.visibility = 'visible';
  }
}
```

- [ ] **Step 3: Replace screen 8 event listeners in setupEventListeners()**

Find:
```js
  // Screen 8 — Reveal
  dom.arrRevealBack.addEventListener('click', () => { goTo(6); playSound('back'); });
  dom.btNouveauTirage.addEventListener('click', () => { goTo(5); playSound('click'); });
```
Replace with:
```js
  // Screen 8 — Reveal
  dom.arrRevealBack.addEventListener('click', () => {
    if (croixFromRecap) {
      croixFromRecap = false;
      goTo(9, 'back');
    } else {
      goTo(6);
    }
    playSound('back');
  });

  dom.arrRevealNext.addEventListener('click', () => {
    if (croixPosition < 5) {
      croixPosition++;
      updateCroixPositionTitle();
      goTo(6, 'forward');
    } else {
      renderCroixRecap();
      goTo(9, 'forward');
    }
    playSound('click');
  });

  dom.btNouveauTirage.addEventListener('click', () => { goTo(5); playSound('click'); });
```

- [ ] **Step 4: Verify in browser — cross reading positions 1–5**

Complete a full 5-card cross reading:
- Enter cross mode, pick number for position 1 → screen 8 shows card + position text (h3 n°6 of the card md) and right arrow only
- Press right arrow → screen 6 shows "2. Opposition"
- Repeat through positions 2, 3, 4
- On position 4's reveal: right arrow → screen 6 shows "5. Synthèse"  
- On position 5's reveal: right arrow → navigates to screen 9 (blank for now)
- Check `croixCards` in console — should have 5 distinct IDs, no repeats

Also verify "Carte unique" still shows domain text and left arrow + nouveau tirage button.

- [ ] **Step 5: Commit**

```bash
git add assets/app/app.js
git commit -m "feat: mode-aware renderTirageReveal, updateRevealNavbar, screen 8 cross navigation"
```

---

## Task 9: app.js — renderCroixRecap + screen 9 events + language switching

**Files:**
- Modify: `assets/app/app.js`

- [ ] **Step 1: Add renderCroixRecap() after updateRevealNavbar()**

```js
function renderCroixRecap() {
  dom.croixRecapTitle.textContent = txt('croix-recap-title');
  dom.croixGrid.innerHTML = '';

  for (let pos = 1; pos <= 5; pos++) {
    const cardId = croixCards[pos - 1];
    const cell = document.createElement('div');
    cell.className = 'croix-cell';
    cell.dataset.pos = String(pos);

    const img = document.createElement('img');
    img.src = ALL_CARDS[cardId].imageUrl;
    img.alt = getCardName(cardId, currentLang);
    img.className = 'croix-cell-img';

    const label = document.createElement('div');
    label.className = 'croix-cell-label';
    label.textContent = getCardName(cardId, currentLang);

    cell.appendChild(img);
    cell.appendChild(label);

    cell.addEventListener('click', () => {
      tirageCardId = cardId;
      croixPosition = pos;
      croixFromRecap = true;
      renderTirageReveal().then(() => {
        playSound('belline');
        goTo(8, 'forward');
      });
    });

    dom.croixGrid.appendChild(cell);
  }
}
```

- [ ] **Step 2: Add screen 9 event listeners in setupEventListeners()**

After the `dom.btNouveauTirage` listener, add:

```js
  // Screen 9 — Croix recap
  dom.arrCroixRecapBack.addEventListener('click', () => {
    tirageMode = 'une-carte';
    goTo(4);
    playSound('back');
  });

  dom.btCroixNouveauTirage.addEventListener('click', () => {
    tirageMode = 'une-carte';
    goTo(4);
    playSound('click');
  });
```

- [ ] **Step 3: Add croix-nouveau-tirage text to applyLanguage()**

In `applyLanguage()`, after `dom.btNouveauTirage.textContent = txt('btn-nouveau-tirage');`, add:

```js
  dom.btCroixNouveauTirage.textContent = txt('btn-croix-nouveau-tirage');
```

Also add at the end of `applyLanguage()`:

```js
  updateCroixPositionTitle();
```

- [ ] **Step 4: Update switchLang() to handle screens 8 and 9 in cross mode**

Find the existing `switchLang()` function. Replace the screen 8 condition and add screen 9:
```js
  } else if (currentScreen === 8 && tirageCardId !== null) {
    renderTirageReveal();
  }
```
Replace with:
```js
  } else if (currentScreen === 8 && tirageCardId !== null) {
    renderTirageReveal();
  } else if (currentScreen === 9) {
    renderCroixRecap();
  }
```

- [ ] **Step 5: Verify full cross reading flow in browser**

**Happy path:**
1. "Tirage en croix" → screen 6 "1. Situation actuelle"
2. Pick a number → animation (if n≥2) → screen 8, card shown, only right arrow visible
3. Right arrow × 4 → screens 6 for positions 2–5, each with correct title
4. After position 5 reveal → right arrow → screen 9 shows:
   - Title "Votre tirage en croix"
   - 5 cards in cross layout (top/left/center/right/bottom)
   - Each card shows card name
5. Click any card → screen 8 shows that card's detail with back arrow (no right arrow)
6. Back arrow → screen 9 (recap restored)
7. "Nouveau tirage" → screen 4

**Language switch:**
- Switch language mid-reading (on screen 6 or 8 or 9) — titles and card names update in current language

**Regression check:**
- "Carte unique" full flow still works end-to-end

- [ ] **Step 6: Commit**

```bash
git add assets/app/app.js
git commit -m "feat: cross recap screen, card detail review, language switching for cross mode"
```

---

## Self-Review Notes

| Spec requirement | Covered in task |
|-----------------|-----------------|
| 5 positions with titles | Tasks 5–6 |
| No duplicate cards (shuffled deck, splice-based draw) | Task 5 |
| h3 indices 5–9 for cross positions | Task 7 |
| Screen 6 back → screen 4 (all positions) | Task 6 (arrTirageChiffreBack mode check) |
| Screen 8 right arrow only in cross mode | Tasks 7 |
| Screen 8 back + no right in review-from-recap | Tasks 7–8 |
| Screen 9 cross grid layout | Task 3 (CSS) + Task 8 (JS) |
| Screen 9 "Nouveau tirage" → screen 4 | Task 8 |
| Screen 9 left arrow → screen 4 | Task 8 |
| Card click in recap → detail view | Task 8 |
| Language switching on screens 6/8/9 | Task 8 |
| goTo direction for 8→6 forward transitions | Task 4 |
