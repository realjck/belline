# Card Text Truncation & H3 Symbols — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On the card text screen (screen 3), display only the first section of each card's markdown (h1 + first h2 + 5 h3s with their paragraphs), and prefix each h3 with a styled Unicode symbol in the card's planet color.

**Architecture:** All changes are in `renderCardText()` in `app.js` — truncate the raw markdown string before parsing, then inject symbol spans into the parsed DOM. One new CSS rule in `style.css`. No changes to markdown source files.

**Tech Stack:** Vanilla JS, marked.js, CSS custom properties, Segoe UI Symbol font (already loaded via `@font-face`)

---

### Task 1: Add `.h3-symbol` CSS rule

**Files:**
- Modify: `assets/css/style.css` (CARD TEXT VIEW section, around line 510)

- [ ] **Step 1: Add the CSS rule after the existing `#card-text-content h3` block**

In `style.css`, after this block:
```css
#card-text-content h3,
#card-text-content h4 {
  font-size: 20px;
}
```

Add:
```css
#card-text-content h3 .h3-symbol {
  font-family: 'Segoe UI Symbol', sans-serif;
  margin-right: 8px;
  font-size: inherit;
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/style.css
git commit -m "style: add h3-symbol rule for card text screen"
```

---

### Task 2: Add `H3_SYMBOLS` constant to `app.js`

**Files:**
- Modify: `assets/app/app.js` (STATE MANAGEMENT section, top of file)

- [ ] **Step 1: Add the constant after the existing state variables (around line 12)**

After `let currentCardId = 0;`, add:
```js
const H3_SYMBOLS = ['♡', '⌬', '❖', 'ᗑ', '☸︎'];
```

Note: the 5th symbol `☸︎` is `☸` (U+2638) followed by `︎` (U+FE0E, variation selector-15) to force text rendering instead of emoji — same pattern as `♀︎` and `♂︎` in `GROUP_SYMBOLS` in `belline-cards.js`.

- [ ] **Step 2: Commit**

```bash
git add assets/app/app.js
git commit -m "feat: add H3_SYMBOLS constant for card text h3 icons"
```

---

### Task 3: Truncate markdown before parsing in `renderCardText()`

**Files:**
- Modify: `assets/app/app.js` — `renderCardText()` function (around line 375)

Current code to locate (inside the `try` block):
```js
const mdText = await response.text();
const htmlContent = marked.parse(mdText);
dom.cardTextContent.innerHTML = htmlContent;
```

- [ ] **Step 1: Replace those 3 lines with the truncated version**

```js
const mdText = await response.text();

const h2Regex = /^## /gm;
let count = 0;
let cutIndex = mdText.length;
let match;
while ((match = h2Regex.exec(mdText)) !== null) {
  count++;
  if (count === 2) { cutIndex = match.index; break; }
}
const truncatedMd = mdText.slice(0, cutIndex);

const htmlContent = marked.parse(truncatedMd);
dom.cardTextContent.innerHTML = htmlContent;
```

- [ ] **Step 2: Manual verification**

Open the app in a browser (Live Server on `index.html`). Navigate to any card's text screen (screen 3). Verify:
- Only the h1, the first h2 ("Signification et interpretation"), and the 5 h3 sections are visible
- The "Dans un tirage en croix" section is gone
- The card text scrolls normally

- [ ] **Step 3: Commit**

```bash
git add assets/app/app.js
git commit -m "feat: truncate card text markdown before second h2"
```

---

### Task 4: Inject h3 symbols in `renderCardText()`

**Files:**
- Modify: `assets/app/app.js` — `renderCardText()` function (after the h1 planet square injection block)

Current code to locate (still inside the `try` block, after `dom.cardTextContent.innerHTML = htmlContent;`):
```js
const groupName = getGroupNameForCardId(currentCardId);
const groupColor = getGroupColor(groupName);
const groupSymbol = getGroupSymbol(groupName);
if (groupColor && groupSymbol) {
  const h1 = dom.cardTextContent.querySelector('h1');
  if (h1) {
    const square = document.createElement('span');
    square.className = 'planet-color-square';
    square.style.background = groupColor;
    square.textContent = groupSymbol;
    h1.insertBefore(square, h1.firstChild);
  }
}
```

- [ ] **Step 1: Add h3 symbol injection immediately after the closing `}` of the h1 block above**

```js
const h3s = dom.cardTextContent.querySelectorAll('h3');
const symbolColor = groupColor || 'var(--color-accent)';
h3s.forEach((h3, i) => {
  if (i >= H3_SYMBOLS.length) return;
  const span = document.createElement('span');
  span.className = 'h3-symbol';
  span.textContent = H3_SYMBOLS[i];
  span.style.color = symbolColor;
  h3.insertBefore(span, h3.firstChild);
});
```

- [ ] **Step 2: Manual verification — planet card**

Navigate to a planet card (e.g. card 1 — Soleil group, orange `#d47706`). Open its text screen. Verify:
- Each of the 5 h3 headings has its symbol prefix: ♡ ⌬ ❖ ᗑ ☸ (rendered as text, not emoji)
- Symbols are colored orange (`#d47706`)
- Symbols use the Segoe UI Symbol font (no fallback glyph box)
- 8px gap between symbol and heading text

- [ ] **Step 3: Manual verification — null-group card**

Navigate to card 0 (no planet group). Open its text screen. Verify:
- The 5 symbols appear and are colored with the accent color (brown in light mode, gold in dark mode)
- No JS errors in the browser console

- [ ] **Step 4: Manual verification — language switch**

While on a card text screen, switch language (FR ↔ EN) via settings. Verify:
- The text reloads correctly with symbols still present
- No duplicate symbols injected

- [ ] **Step 5: Commit**

```bash
git add assets/app/app.js
git commit -m "feat: inject planet-colored unicode symbols before card text h3s"
```
