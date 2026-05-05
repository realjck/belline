# Cards Screen Bottom Nav — Design Spec

**Date:** 2026-05-05

## Summary

Add a bottom navigation bar to screen 1 (cards gallery) with a single left arrow button that returns to the home screen.

## Scope

- `index.html` — add `<div class="bottom-nav">` to `#s-cards`
- `assets/css/style.css` — fix scroll container for `#s-cards` and `.cards-gallery`
- `assets/app/app.js` — cache new DOM element, add event listener, update scroll reset

## Feature: Bottom Nav on Cards Screen

### HTML change (`index.html`)

Replace current `#s-cards` content:
```html
<!-- SCREEN 1 — CARDS GALLERY -->
<div class="screen" id="s-cards">
  <div class="cards-gallery" id="cards-gallery"></div>
</div>
```

With:
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

Single left arrow, no spacer (only one element, `justify-content: space-between` aligns it to the start).

### CSS change (`style.css`)

Currently `.screen` has `overflow-y: auto`, so the whole screen scrolls. With a `.bottom-nav` inside, we need the gallery to scroll instead so the nav stays fixed at the bottom.

Add to the CARDS GALLERY section:
```css
#s-cards {
  overflow-y: hidden;
}

.cards-gallery {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}
```

This mirrors the pattern used in screen 3, where `#card-text-content` has `flex: 1; overflow-y: auto` and the `.bottom-nav` stays fixed.

### JS changes (`app.js`)

**1. `cacheDOM()`** — add after `dom.cardsGallery`:
```js
dom.arrCardsHome = document.getElementById('arr-cards-home');
```

**2. `setupEventListeners()`** — add:
```js
dom.arrCardsHome.addEventListener('click', () => {
  dom.cardsGallery.scrollTop = 0;
  goTo(0);
  playSound('back');
});
```

**3. Home button handler** — update scroll reset from screen to gallery:
```js
// Before:
dom.screenCards.scrollTop = 0;
// After:
dom.cardsGallery.scrollTop = 0;
```

## Scroll Preservation

Scroll position of the gallery is preserved when navigating to a card and back. It is reset when:
- Clicking the left arrow in the new bottom-nav
- Clicking the home button in the header

Both behaviors remain identical to current.

## Non-goals

- No center button or right spacer (single element doesn't need balancing)
- No label or text on the arrow
- No change to header home button behavior
