# Tirage Croix Anim — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Screen 10 (`#s-tirage-croix-anim`) that shows the cross layout building up card by card during a tirage en croix, replacing the intermediate Screen 8 visits.

**Architecture:** New screen (index 10) added to screenMap with no bottom nav; `renderCroixAnim()` builds a 3×3 cross grid showing drawn cards (filled) and pending positions (dashed placeholder); the current card springs in with a CSS keyframe animation, then auto-advances after 1800ms via a cancellable timeout.

**Tech Stack:** Vanilla JS, CSS custom properties, no build step. Serve via Live Server. No test framework — verification is manual in browser.

**Spec:** `docs/superpowers/specs/2026-05-10-tirage-croix-anim-design.md`

---

## File Map

| File | Change |
|------|--------|
| `index.html` | Add Screen 10 HTML block after Screen 9 |
| `assets/app/app.js` | screenMap +1 entry, state var, cacheDOM, renderCroixAnim(), navigation wiring, home button |
| `assets/css/style.css` | Append Screen 10 section at end of file |

---

## Task 1 — HTML: Add Screen 10 + update screenMap

**Files:**
- Modify: `index.html` (after line 267, closing `</div>` of Screen 9)
- Modify: `assets/app/app.js` (screenMap, line ~35)

- [ ] **Step 1: Add Screen 10 HTML**

In `index.html`, immediately after the Screen 9 closing `</div>` (line 267, before `</div><!-- /#screens -->`), insert:

```html
    <!-- SCREEN 10 — TIRAGE CROIX ANIM -->
    <div class="screen" id="s-tirage-croix-anim">
      <div class="croix-anim-body">
        <div class="croix-anim-grid" id="croix-anim-grid"></div>
      </div>
    </div>
```

- [ ] **Step 2: Add index 10 to screenMap**

In `assets/app/app.js`, update `screenMap` to add entry 10:

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
  9: 's-tirage-croix-recap',
  10: 's-tirage-croix-anim'
};
```

- [ ] **Step 3: Verify in browser**

Open the app via Live Server. Open the browser console and run:
```js
goTo(10)
```
Expected: no console error, app navigates to a blank screen (no CSS yet).

- [ ] **Step 4: Commit**

```bash
git add index.html assets/app/app.js
git commit -m "feat: add Screen 10 HTML skeleton and screenMap entry for croix-anim"
```

---

## Task 2 — CSS: Screen 10 styles

**Files:**
- Modify: `assets/css/style.css` (append at end, after line 1434)

- [ ] **Step 1: Append Screen 10 section to style.css**

Add the following block at the very end of `assets/css/style.css`:

```css
/* ═══════════════════════════════════════════════════════════
   SCREEN 10 — TIRAGE CROIX ANIM (croix-anim-* prefix)
   ═══════════════════════════════════════════════════════════ */

#s-tirage-croix-anim {
  overflow: hidden;
}

.croix-anim-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  min-height: 0;
  overflow: hidden;
}

.croix-anim-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: repeat(3, 1fr);
  gap: 8px;
  width: 100%;
  max-width: 280px;
  max-height: calc(100dvh - 120px);
  aspect-ratio: 2 / 3;
  margin: auto;
}

.croix-anim-cell {
  border-radius: min(2vw, 10px);
  overflow: hidden;
  min-width: 0;
  min-height: 0;
}

/* Cross positions: left, right, top, bottom, center */
.croix-anim-cell[data-pos="1"] { grid-area: 2 / 1; }
.croix-anim-cell[data-pos="2"] { grid-area: 2 / 3; }
.croix-anim-cell[data-pos="3"] { grid-area: 1 / 2; }
.croix-anim-cell[data-pos="4"] { grid-area: 3 / 2; }
.croix-anim-cell[data-pos="5"] { grid-area: 2 / 2; }

.croix-anim-cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.croix-anim-cell.placeholder {
  border: 3px dashed var(--color-muted);
  border-radius: min(2vw, 10px);
  opacity: 0.5;
  overflow: visible;
}

.croix-anim-cell.spring-in {
  animation: croix-spring-in 0.9s ease-out forwards;
  transform-origin: center;
  position: relative;
  z-index: 10;
}

@keyframes croix-spring-in {
  0%   { transform: scale(0);    opacity: 0; }
  45%  { transform: scale(1.4);  opacity: 1; }
  62%  { transform: scale(0.82); }
  78%  { transform: scale(1.18); }
  90%  { transform: scale(0.96); }
  100% { transform: scale(1);    opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .croix-anim-cell.spring-in { animation-duration: 0.01s; }
}
```

- [ ] **Step 2: Verify layout in browser**

Run in console: `goTo(10)`. Expected: blank centered area visible (no grid cells yet, just the empty `.croix-anim-body` flexbox taking up the screen).

- [ ] **Step 3: Commit**

```bash
git add assets/css/style.css
git commit -m "feat: add Screen 10 CSS layout, grid, spring animation, placeholder"
```

---

## Task 3 — JS: State + cacheDOM + renderCroixAnim()

**Files:**
- Modify: `assets/app/app.js`

- [ ] **Step 1: Add croixAnimTimeoutId state variable**

In `app.js`, in the `// ──── STATE MANAGEMENT ────` block, add after `let croixFromRecap = false;`:

```js
let croixAnimTimeoutId = null;
```

- [ ] **Step 2: Cache the grid element**

In `cacheDOM()`, add after `dom.btCroixNouveauTirage = ...`:

```js
dom.croixAnimGrid = document.getElementById('croix-anim-grid');
```

- [ ] **Step 3: Implement renderCroixAnim()**

Add the following function in `app.js` after the `renderCroixRecap()` function (around line 966):

```js
function renderCroixAnim() {
  dom.croixAnimGrid.innerHTML = '';

  for (let pos = 1; pos <= 5; pos++) {
    const cell = document.createElement('div');
    cell.className = 'croix-anim-cell';
    cell.dataset.pos = String(pos);

    if (pos <= croixPosition) {
      const cardId = croixCards[pos - 1];
      const img = document.createElement('img');
      img.src = ALL_CARDS[cardId].imageUrl;
      img.alt = getCardName(cardId, currentLang);
      cell.appendChild(img);
    } else {
      cell.classList.add('placeholder');
    }

    dom.croixAnimGrid.appendChild(cell);
  }

  // 400ms: safely after the 350ms screen transition, so spring starts when Screen 10 is fully visible
  croixAnimTimeoutId = setTimeout(() => {
    const currentCell = dom.croixAnimGrid.querySelector(`.croix-anim-cell[data-pos="${croixPosition}"]`);
    if (currentCell) {
      currentCell.classList.add('spring-in');
      playSound('belline');
    }

    croixAnimTimeoutId = setTimeout(() => {
      if (croixPosition < 5) {
        croixPosition++;
        updateCroixPositionTitle();
        goTo(6, 'forward');
      } else {
        renderCroixRecap();
        goTo(9, 'forward');
      }
    }, 900 + 1800);
  }, 400);
}
```

- [ ] **Step 4: Verify renderCroixAnim() renders manually**

In the browser console, simulate a croix tirage then call the function:
```js
tirageMode = 'croix';
shuffleCroixDeck();
croixPosition = 1;
croixCards = [];
drawCroixCard(1);
renderCroixAnim();
goTo(10);
```
Expected:
- Screen 10 slides in (350ms transition)
- At ~400ms after the call: card at position 1 (left) springs in with belline sound
- 4 dashed placeholder outlines visible at the other 4 positions
- After ~3.1s total, automatically navigates to Screen 6

- [ ] **Step 5: Test position 3 (with 2 prior cards)**

```js
clearTimeout(croixAnimTimeoutId);
croixPosition = 3;
croixCards[0] = 5;
croixCards[1] = 12;
drawCroixCard(1);
renderCroixAnim();
goTo(10);
```
Expected:
- Cards visible at positions 1 (left) and 2 (right)
- New card springs in at position 3 (top) after ~400ms
- 2 placeholders at positions 4 (bottom) and 5 (center)

- [ ] **Step 6: Commit**

```bash
git add assets/app/app.js
git commit -m "feat: add renderCroixAnim() with spring animation and auto-advance"
```

---

## Task 4 — JS: Wire navigation

**Files:**
- Modify: `assets/app/app.js`

- [ ] **Step 1: Update Screen 6 handler for croix mode**

In `setupEventListeners()`, find the `dom.tirageNumbers.addEventListener('click', ...)` block. The current croix branch (around line 670) is:

```js
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
}
```

Replace it with:

```js
if (tirageMode === 'croix') {
  drawCroixCard(currentNumber);
  if (currentNumber === 1) {
    renderCroixAnim();
    goTo(10, 'forward');
  } else {
    goTo(7, 'forward');
    playTcAnim(currentNumber - 1, () => {
      renderCroixAnim();
      goTo(10, 'forward');
    });
  }
}
```

- [ ] **Step 2: Cancel pending timeout in Home button handler**

In `setupEventListeners()`, find the `dom.btHome.addEventListener('click', ...)` handler (around line 530). It currently reads:

```js
dom.btHome.addEventListener('click', () => {
  tirageMode = 'une-carte';
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
  clearTimeout(croixAnimTimeoutId);
  dom.cardsGallery.scrollTop = 0;
  goTo(0);
  playSound('back');
});
```

- [ ] **Step 3: Commit**

```bash
git add assets/app/app.js
git commit -m "feat: wire Screen 10 into croix navigation, cancel timeout on home"
```

---

## Task 5 — End-to-end verification

No code changes. Manual browser testing only.

- [ ] **Step 1: Full tirage en croix — 5 positions**

Start a tirage en croix from Screen 4. For each of the 5 positions:
- Select a number on Screen 6
- If number > 1: Screen 7 (tc-anim pile) plays, then auto-transitions to Screen 10
- If number = 1: directly to Screen 10
- Screen 10 shows: all previously drawn cards in their cross position, new card springing in at the current position, remaining positions as dashed placeholders
- Sound `belline.mp3` plays as the card springs in
- After ~3.1s: auto-advances to Screen 6 (positions 1–4) or Screen 9 recap (position 5)

Expected at each position:
| Position | Filled cells | Placeholder cells | Animating cell |
|----------|-------------|-------------------|----------------|
| 1 | 0 prior | 4 (pos 2,3,4,5) | pos 1 (left) |
| 2 | 1 (pos 1) | 3 (pos 3,4,5) | pos 2 (right) |
| 3 | 2 (pos 1,2) | 2 (pos 4,5) | pos 3 (top) |
| 4 | 3 (pos 1,2,3) | 1 (pos 5) | pos 4 (bottom) |
| 5 | 4 (pos 1,2,3,4) | 0 | pos 5 (center) |

- [ ] **Step 2: Verify Screen 9 recap still works**

After position 5, Screen 9 appears with all 5 cards. Click a card → Screen 8 (reveal with text, `croixFromRecap = true`) → back arrow → Screen 9. Verify this flow is unaffected.

- [ ] **Step 3: Verify une-carte mode is unaffected**

Start a tirage une-carte. Select domain → select number → Screen 7 (if n>1) → Screen 8 (reveal with text + "Nouveau tirage" button). Verify Screen 10 is never visited.

- [ ] **Step 4: Verify Home button cancels animation**

Start a croix tirage, reach Screen 10. While the spring animation is running or during the pause, tap the Home button. Expected: navigates immediately to Screen 0, no delayed navigation to Screen 6 fires afterward.

- [ ] **Step 5: Verify dark mode + both languages**

Toggle dark mode, run a croix tirage, confirm cross grid looks correct. Switch language mid-tirage (settings modal), confirm no visual breakage.

- [ ] **Step 6: Final commit if any fixes applied**

```bash
git add -p
git commit -m "fix: <describe any fix>"
```
(Skip if no fixes needed.)
