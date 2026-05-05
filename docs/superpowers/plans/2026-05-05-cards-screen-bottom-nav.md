# Cards Screen Bottom Nav — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bottom navigation bar to the cards gallery screen (screen 1) with a single left arrow button that returns to the home screen.

**Architecture:** Three-file change — HTML adds the `.bottom-nav` markup, CSS makes `.cards-gallery` the scroll container (instead of the whole screen) so the nav stays fixed at the bottom, JS wires up the click handler and updates the existing scroll reset to target `.cards-gallery`.

**Tech Stack:** Vanilla JS, HTML, CSS — no bundler, no framework.

---

### Task 1: HTML + CSS — Add bottom-nav and fix scroll container

**Files:**
- Modify: `index.html` — `#s-cards` block (line 67–69)
- Modify: `assets/css/style.css` — CARDS GALLERY section (around line 294)

- [ ] **Step 1: Add `.bottom-nav` to `#s-cards` in `index.html`**

Locate this block (lines 67–69):
```html
    <!-- SCREEN 1 — CARDS GALLERY -->
    <div class="screen" id="s-cards">
      <div class="cards-gallery" id="cards-gallery"></div>
    </div>
```

Replace with:
```html
    <!-- SCREEN 1 — CARDS GALLERY -->
    <div class="screen" id="s-cards">
      <div class="cards-gallery" id="cards-gallery"></div>
      <div class="bottom-nav">
        <button class="nav-arr" id="arr-cards-home">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </div>
    </div>
```

- [ ] **Step 2: Add CSS to make `.cards-gallery` the scroll container**

In `assets/css/style.css`, locate the `.cards-gallery` rule (around line 294):
```css
.cards-gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 16px;
  align-content: start;
}
```

Add `flex: 1; overflow-y: auto; min-height: 0;` to it:
```css
.cards-gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 16px;
  align-content: start;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}
```

Then add a rule for `#s-cards` immediately after (or nearby, within the CARDS GALLERY section):
```css
#s-cards {
  overflow-y: hidden;
}
```

This prevents double-scrolling: `#s-cards` (the `.screen`) no longer scrolls; `.cards-gallery` does instead — matching the pattern used by `#card-text-content` in screen 3.

- [ ] **Step 3: Verify layout visually**

Open the app in a browser (Live Server on `index.html`). Navigate to the cards screen. Verify:
- The cards gallery scrolls normally
- The bottom-nav with the left arrow is visible and stays fixed at the bottom while scrolling
- The arrow is styled in the accent color with circular border (same as other `.nav-arr` buttons)

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/style.css
git commit -m "feat: add bottom-nav to cards screen with home arrow"
```

---

### Task 2: JS — Wire up event listener and update scroll reset

**Files:**
- Modify: `assets/app/app.js` — `cacheDOM()` (around line 44), `setupEventListeners()` (around line 436), home button handler (around line 437)

- [ ] **Step 1: Add `dom.arrCardsHome` to `cacheDOM()`**

Locate the Cards screen section in `cacheDOM()` (around line 44):
```js
  // Cards screen
  dom.cardsGallery = document.getElementById('cards-gallery');
```

Add the new element after it:
```js
  // Cards screen
  dom.cardsGallery = document.getElementById('cards-gallery');
  dom.arrCardsHome = document.getElementById('arr-cards-home');
```

- [ ] **Step 2: Add event listener in `setupEventListeners()`**

Locate the home button handler in `setupEventListeners()`:
```js
  dom.btHome.addEventListener('click', () => {
    dom.screenCards.scrollTop = 0;
    goTo(0);
    playSound('back');
  });
```

Update it to reset `.cards-gallery` scroll (not `.screenCards`), and add the new arrow listener immediately after:
```js
  dom.btHome.addEventListener('click', () => {
    dom.cardsGallery.scrollTop = 0;
    goTo(0);
    playSound('back');
  });

  dom.arrCardsHome.addEventListener('click', () => {
    dom.cardsGallery.scrollTop = 0;
    goTo(0);
    playSound('back');
  });
```

- [ ] **Step 3: Verify behavior**

Open the app in a browser. Test the following:
- Scroll down the cards list, then click the left arrow in the bottom-nav → goes to home, gallery scroll resets to top
- Scroll down the cards list, then click the home icon in the header → goes to home, gallery scroll resets to top
- Scroll down the list, click a card (go to screen 2), press back → returns to screen 1 with scroll position preserved (not reset)

- [ ] **Step 4: Commit**

```bash
git add assets/app/app.js
git commit -m "feat: wire up cards screen home arrow and fix gallery scroll reset"
```
