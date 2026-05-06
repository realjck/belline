# Design : Animation + Révélation du tirage — Belline Oracle

**Date :** 2026-05-06  
**Branche :** `feat/tirage-screens`  
**Phase :** 2 — suite de la phase 1 (écrans 0–6 déjà implémentés)

---

## 1. Vue d'ensemble

Après la sélection d'un chiffre (1–9) sur l'écran 6, deux nouveaux écrans complètent le flux de tirage d'une carte unique :

- **Écran 7** (`#s-tirage-anim`) : animation de transition (cartes qui défilent, dernière qui se retourne). Affiché uniquement si le chiffre choisi est ≥ 2. Pas de navbar.
- **Écran 8** (`#s-tirage-reveal`) : révélation de la carte tirée avec son illustration et le paragraphe correspondant au domaine choisi.

---

## 2. Map des écrans complète

| Index | ID | Description |
|-------|----|-------------|
| 0 | `#s-home` | Accueil |
| 1 | `#s-cards` | Galerie |
| 2 | `#s-card-large` | Vue détaillée |
| 3 | `#s-card-text` | Texte complet |
| 4 | `#s-tirage-choix` | Choix du tirage |
| 5 | `#s-tirage-domaine` | Domaine de la question |
| 6 | `#s-tirage-chiffre` | Sélection du chiffre |
| 7 | `#s-tirage-anim` | Animation de transition *(nouveau)* |
| 8 | `#s-tirage-reveal` | Révélation de la carte *(nouveau)* |

**Flux :**
- Chiffre ≥ 2 → tirage → `goTo(7)` → animation auto → `goTo(8)`
- Chiffre = 1 → tirage → `goTo(8)` directement
- Retour depuis 8 → `goTo(4)` (flèche ←)
- "Nouveau tirage" depuis 8 → `goTo(5)`

---

## 3. État partagé

```js
let tirageCardId = null;  // carte tirée, séparée de currentCardId (galerie)
```

Variable séparée de `currentCardId` pour éviter toute interférence avec la navigation galerie (écrans 1–3).

**Tirage aléatoire via API Crypto :**
```js
function drawTirageCard() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  tirageCardId = buf[0] % 53;  // index 0–52
}
```

Appelé immédiatement au clic sur un chiffre, avant toute navigation.

---

## 4. Écran 7 — Animation de transition (`#s-tirage-anim`)

### Layout

- Plein écran, pas de navbar
- Flex column, `justify-content: center`, `align-items: center`, `flex: 1`
- Un seul enfant : `#tc-deck` (container de la pile de cartes)

### CSS — préfixe `tc-` (scoped, même pattern que `ta-*`)

```css
#s-tirage-anim {
  --tc-bg: var(--color-bg);
  --tc-fg: var(--color-text);
  --tc-card-w: 38px;
  --tc-card-h: 56px;
}

.tc-stage       { width: 200px; height: 200px; position: relative; display: grid; place-items: center; perspective: 600px; }
.tc-card        { position: absolute; width: var(--tc-card-w); height: var(--tc-card-h); transform-style: preserve-3d;
                  --tx: 0px; --ty: 0px; --rot: 0deg; --fade-x: 0px; --fade-o: 1; --flip: 0deg;
                  transform: translate(var(--tx), var(--ty)) translateX(var(--fade-x)) rotate(var(--rot)) rotateY(var(--flip));
                  opacity: var(--fade-o); transition: none; }
.tc-card.tc-fading  { transition: transform 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.55s cubic-bezier(0.4,0,0.2,1);
                      --fade-x: -120px; --fade-o: 0; }
.tc-card.tc-flipping { transition: transform 0.7s cubic-bezier(0.45,0,0.2,1); --flip: 180deg; }
.tc-face        { position: absolute; inset: 0; border: 2px solid var(--tc-fg); border-radius: 4px;
                  background: var(--tc-bg); backface-visibility: hidden; }
.tc-back        { background: repeating-linear-gradient(45deg, var(--tc-fg) 0 1.5px, transparent 1.5px 5px), var(--tc-bg); }
.tc-back::before { content: ""; position: absolute; inset: 4px; border: 1.5px solid var(--tc-bg);
                   border-radius: 2px; box-shadow: inset 0 0 0 1.5px var(--tc-fg); }
.tc-back::after  { content: ""; width: 10px; height: 10px; background: var(--tc-bg);
                   border: 1.5px solid var(--tc-fg); transform: rotate(45deg); z-index: 1;
                   position: absolute; }
.tc-front       { transform: rotateY(180deg); background: var(--tc-bg); }
@media (prefers-reduced-motion: reduce) {
  .tc-card.tc-fading, .tc-card.tc-flipping { transition-duration: 0.01s !important; }
}
```

### JS

```js
function tcJitter(i) {
  const r = x => x - Math.floor(x);
  const a = r(Math.sin(i * 12.9898) * 43758.5453);
  const b = r(Math.sin(i * 78.233)  * 43758.5453);
  const c = r(Math.sin(i * 39.346)  * 43758.5453);
  return { tx: (a - 0.5) * 4, ty: (b - 0.5) * 4, rot: (c - 0.5) * 6 };
}

function buildTcDeck(deckEl, n) {
  deckEl.innerHTML = '';
  const total = n + 1;
  for (let i = 0; i < total; i++) {
    const card = document.createElement('div');
    card.className = 'tc-card';
    const j = tcJitter(i);
    const isFinal = i === 0;
    card.style.setProperty('--tx', isFinal ? '0px' : j.tx + 'px');
    card.style.setProperty('--ty', isFinal ? '0px' : j.ty + 'px');
    card.style.setProperty('--rot', isFinal ? '0deg' : j.rot + 'deg');
    card.style.zIndex = String(i + 1);
    const back = document.createElement('div'); back.className = 'tc-face tc-back';
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

const tcSleep = ms => new Promise(r => setTimeout(r, ms));
```

**Déclenchement :** Au clic sur un bouton chiffre (`.num-btn`) :
```js
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
```

---

## 5. Écran 8 — Révélation (`#s-tirage-reveal`)

### Layout HTML — Écran 7

```html
<div id="s-tirage-anim" class="screen tirage-anim-screen">
  <div class="tc-stage" id="tc-deck"></div>
</div>
```

`#tc-deck` et `.tc-stage` sont le même élément : la grille perspective dans laquelle les `.tc-card` (position: absolute) se superposent.

### Layout HTML — Écran 8

```html
<div id="s-tirage-reveal" class="screen">
  <div class="tirage-body tirage-reveal-body">
    <div id="reveal-header" class="reveal-header"></div>
    <img id="reveal-card-img" class="reveal-card-img" alt="">
    <p id="reveal-text" class="reveal-text"></p>
  </div>
  <div class="bottom-nav">
    <button class="nav-arr" id="arr-reveal-back">←SVG</button>
    <button class="btn-action" id="bt-nouveau-tirage"></button>
    <div class="nav-spacer"></div>
  </div>
</div>
```

### CSS

```css
.tirage-reveal-body   { gap: 16px; justify-content: center; }
.reveal-header        { display: flex; align-items: center; gap: 8px; font-family: 'Big Shoulders Display', sans-serif;
                        font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
                        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.reveal-card-img      { flex: 1; max-height: 55vh; width: auto; object-fit: contain;
                        border-radius: min(8vw, 40px); box-shadow: 0 8px 32px rgba(0,0,0,0.18); }
.reveal-text          { font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--color-text);
                        text-align: center; line-height: 1.5; }
```

### Header

- Carte **avec planète** : `<span class="planet-color-square" style="background:{groupColor}">{glyphe}</span> {NOM-PLANÈTE} {N} / {NOM-CARTE}`  
  Réutilise `.planet-color-square` (18×18px, Segoe UI Symbol, déjà défini en CSS).
- Carte **sans planète** (id 0–3) : `{N} / {NOM-CARTE}` (pas de carré).

### Rendu JS — `renderTirageReveal()`

```js
async function renderTirageReveal() {
  // Header
  const groupName = getGroupNameForCardId(tirageCardId);
  const groupColor = getGroupColor(groupName);
  const groupSymbol = getGroupSymbol(groupName);
  const cardName = getCardName(tirageCardId, currentLang);
  const groupLabel = groupName ? txt(`group-${groupName}`) : '';
  const square = groupColor ? `<span class="planet-color-square" style="background:${groupColor}">${groupSymbol}</span>` : '';
  const label = groupLabel ? `${groupLabel} ` : '';
  dom.revealHeader.innerHTML = `${square}${label}${tirageCardId} / ${cardName}`;

  // Image
  const card = ALL_CARDS[tirageCardId];
  dom.revealCardImg.src = card.imageUrl;
  dom.revealCardImg.alt = cardName;

  // Text — premier paragraphe du h3 domaine
  const DOMAIN_H3_INDEX = { amour: 0, travail: 1, argent: 2, famille: 3, spiritualite: 4 };
  const h3Index = DOMAIN_H3_INDEX[currentDomain] ?? 0;
  const cardId = String(tirageCardId).padStart(2, '0');
  const md = await fetch(`./assets/data/book/${currentLang}/${cardId}.md`).then(r => r.text());
  const tmp = document.createElement('div');
  tmp.innerHTML = marked.parse(md);
  const h3s = tmp.querySelectorAll('h3');
  const targetH3 = h3s[h3Index];
  let text = '';
  if (targetH3) {
    let el = targetH3.nextElementSibling;
    while (el && el.tagName !== 'P') el = el.nextElementSibling;
    if (el) text = el.textContent;
  }
  dom.revealText.textContent = text;
}
```

### i18n

| Clé | FR | EN |
|-----|----|----|
| `btn-nouveau-tirage` | `"Nouveau tirage"` | `"New Reading"` |

### DOM cache (nouveaux éléments)

```js
dom.revealHeader   = document.getElementById('reveal-header');
dom.revealCardImg  = document.getElementById('reveal-card-img');
dom.revealText     = document.getElementById('reveal-text');
dom.arrRevealBack  = document.getElementById('arr-reveal-back');
dom.btNouveauTirage = document.getElementById('bt-nouveau-tirage');
```

### applyLanguage()

```js
dom.btNouveauTirage.textContent = txt('btn-nouveau-tirage');
```

### Event listeners

```js
dom.arrRevealBack.addEventListener('click', () => { goTo(4); playSound('back'); });
dom.btNouveauTirage.addEventListener('click', () => { goTo(5); playSound('click'); });
```

---

## 6. Fichiers modifiés

| Fichier | Changements |
|---------|-------------|
| `index.html` | Screens 7 et 8 HTML |
| `assets/css/style.css` | Classes `tc-*` (animation) + classes `reveal-*` (révélation) |
| `assets/data/ui-texts.js` | Clé `btn-nouveau-tirage` (FR + EN) |
| `assets/app/app.js` | `tirageCardId`, `drawTirageCard()`, `tcJitter()`, `buildTcDeck()`, `playTcAnim()`, `tcSleep`, `renderTirageReveal()`, screenMap 7+8, cacheDOM, applyLanguage, event listeners |
