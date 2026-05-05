# Card Text Screen — Truncation & H3 Symbols

**Date:** 2026-05-05

## Summary

Modify `renderCardText()` to display only the first section of each card's markdown (h1 + first h2 + 5 h3s), and inject a styled Unicode symbol before each h3 using the planet group color.

## Scope

- `assets/app/app.js` — `renderCardText()` function
- `assets/css/style.css` — new `.h3-symbol` rule

## Feature 1 — Markdown Truncation

All card markdown files share the same structure:
1. `# N - Card Name`
2. `## Signification et interpretation` (keep)
3. Five `### Category` headings with paragraphs (keep)
4. `## Dans un tirage en croix` (line 27 — **cut here**)

**Implementation:** In `renderCardText()`, after fetching the markdown text and before calling `marked.parse()`, find the index of the second `## ` at the start of a line using `/^## /gm` regex, then `mdText.slice(0, cutIndex)`.

```js
const h2Regex = /^## /gm;
let count = 0;
let cutIndex = mdText.length;
let match;
while ((match = h2Regex.exec(mdText)) !== null) {
  count++;
  if (count === 2) { cutIndex = match.index; break; }
}
const truncatedMd = mdText.slice(0, cutIndex);
// then: marked.parse(truncatedMd)
```

## Feature 2 — H3 Symbols

After parsing and injecting the h1 planet square (existing), iterate over the 5 `<h3>` elements and prepend a `<span class="h3-symbol">` with the corresponding symbol, colored with the planet group color.

**Symbols (in order):**
| Position | Symbol | Category |
|----------|--------|----------|
| 1 | ♡ | Amour / Sentimental |
| 2 | ⌬ | Travail / Professionnel |
| 3 | ❖ | Argent / Financier |
| 4 | ᗑ | Famille |
| 5 | ☸ | Spiritualité |

**Color logic:**
- Cards with a planet group → `groupColor` (hex from `GROUP_COLORS`)
- Cards 0–3 (null group, no planet) → `var(--color-accent)` fallback

**Constant to add near top of app.js:**
```js
const H3_SYMBOLS = ['♡', '⌬', '❖', 'ᗑ', '☸'];
```

**Injection code (after h1 square injection):**
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

## Feature 3 — CSS

Add to `style.css` in the CARD TEXT VIEW section:

```css
#card-text-content h3 .h3-symbol {
  font-family: 'Segoe UI Symbol', sans-serif;
  margin-right: 8px;
  font-size: inherit;
}
```

No background, no border-radius — inline colored text only.

## Non-goals

- No changes to `.md` source files
- No prev/next h3 symbol navigation
- No changes to h1 or h2 styling
