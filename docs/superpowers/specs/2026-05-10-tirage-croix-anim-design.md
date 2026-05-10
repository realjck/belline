# Design — Écran d'animation croix (Screen 10)

**Date :** 2026-05-10  
**Branche :** dev  
**Statut :** Approuvé

---

## Contexte

Dans le tirage en croix, l'utilisateur tire 5 cartes séquentiellement (positions 1–5). Actuellement, chaque tirage passe par Screen 8 (reveal) avec le texte masqué — l'utilisateur voit sa carte mais sans le contexte de la croix en construction. L'objectif est de remplacer ce passage par un écran dédié qui montre la croix se construire au fil des tirages.

---

## Flux de navigation

### Avant (mode croix, par position)
```
Screen 6 (chiffre) → [Screen 7 si n>1] → Screen 8 (reveal, texte masqué) → flèche droite → Screen 6 suivant
```

### Après (mode croix, par position)
```
Screen 6 (chiffre)
  → drawCroixCard(n)
  → [si n > 1] goTo(7, 'forward') → playTcAnim(n-1, cb)
  → goTo(10, 'forward')
    renderCroixAnim()        ← construit la grille + déclenche spring
    playSound('belline')
    setTimeout ~1800ms (après fin animation)
    → [position < 5] croixPosition++ → goTo(6, 'forward')
    → [position = 5] renderCroixRecap() → goTo(9, 'forward')
```

**Screen 8 en mode croix** : n'est plus visité pendant le tirage séquentiel. Reste accessible uniquement via `croixFromRecap = true` (clic depuis le récap Screen 9) — comportement inchangé.

---

## Screen 10 — `#s-tirage-croix-anim`

### HTML

```html
<!-- SCREEN 10 — TIRAGE CROIX ANIM -->
<div class="screen" id="s-tirage-croix-anim">
  <div class="croix-anim-body">
    <div class="croix-anim-grid" id="croix-anim-grid"></div>
  </div>
</div>
```

Ajout dans `screenMap` : `10: 's-tirage-croix-anim'`

### Rendu de la grille

`renderCroixAnim()` construit 5 cellules `data-pos="1"` à `data-pos="5"` avec trois états :

| État | Condition | Apparence |
|------|-----------|-----------|
| **Tirée** | pos < croixPosition | Image de la carte, style normal |
| **Courante** | pos = croixPosition | Image + classe `.spring-in` (animation) |
| **Vide** | pos > croixPosition | Placeholder, bordure épaisse pointillée |

Aucun label de position affiché sur cet écran.

### Positionnement grille (identique Screen 9)

```
grid-template-columns: 1fr 1fr 1fr  (3×3)
data-pos="1" → grid-area: 2 / 1   (Situation — gauche)
data-pos="2" → grid-area: 2 / 3   (Opposition — droite)
data-pos="3" → grid-area: 1 / 2   (Conseil — haut)
data-pos="4" → grid-area: 3 / 2   (Résultat — bas)
data-pos="5" → grid-area: 2 / 2   (Synthèse — centre)
```

---

## Animation spring

```css
@keyframes croix-spring-in {
  0%   { transform: scale(0);    opacity: 0; }
  45%  { transform: scale(1.4);  opacity: 1; }
  62%  { transform: scale(0.82); }
  78%  { transform: scale(1.18); }
  90%  { transform: scale(0.96); }
  100% { transform: scale(1);    opacity: 1; }
}
```

- **Durée :** 0.9s, `ease-out`
- **Déclenchement :** 120ms après l'arrivée sur Screen 10 (laisse la transition de navigation se terminer)
- `transform-origin: center` sur la cellule courante
- `prefers-reduced-motion` : durée réduite à 0.01s

**Timing total sur l'écran :**
- 120ms délai avant animation
- 900ms animation spring
- 1800ms pause contemplative après animation
- **≈ 2.8s** au total avant auto-avance

---

## Placeholder vide

```css
border: 3px dashed var(--color-muted);
border-radius: min(2vw, 10px);
opacity: 0.5;
```

---

## Son

`playSound('belline')` joué au moment où la classe `.spring-in` est ajoutée (synchronisé avec le déclenchement de l'animation).

---

## Modifications de code

### `index.html`
- Bloc HTML Screen 10 (après Screen 9)

### `app.js`
- `screenMap` : ajout `10: 's-tirage-croix-anim'`
- État global : ajout `let croixAnimTimeoutId = null;`
- `cacheDOM()` : ajout `dom.croixAnimGrid = document.getElementById('croix-anim-grid')`
- `setupEventListeners()`, bloc Screen 6 : remplacer `goTo(8)` + `renderTirageReveal()` par `goTo(10, 'forward')` + `renderCroixAnim()` en mode croix
- Bouton Home : `clearTimeout(croixAnimTimeoutId)` aux côtés de `tcAnimCancelled = true`
- Nouvelle fonction `renderCroixAnim()`

### `style.css`
- Section Screen 10 : `.croix-anim-body`, `.croix-anim-grid`, `.croix-anim-cell`, `.croix-anim-cell.spring-in`, `@keyframes croix-spring-in`, placeholder vide, `prefers-reduced-motion`

---

## Ce qui ne change pas

- Screen 8 (reveal) et sa logique `croixFromRecap`
- Screen 9 (récap) et `renderCroixRecap()`
- Screen 7 (tc-anim) et `playTcAnim()`
- Tous les autres écrans et modes
