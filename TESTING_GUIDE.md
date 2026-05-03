# Belline Oracle Phase 1 - Testing Guide

## Quick Start

### 1. Start the Server
Server is already running at: **http://localhost:8000**

### 2. Run Automated Tests
Open in browser: **http://localhost:8000/automated-tests.html**

This page runs all automated data validation tests and should show:
- ✓ All 53 cards found
- ✓ All 8 groups (1 null + 7 planets) properly structured
- ✓ All translations loaded (FR and EN)
- ✓ Markdown rendering functional
- **Expected Result**: 14/14 tests passing (100%)

### 3. Manual Testing

Open the main application: **http://localhost:8000**

Follow the manual test checklists below for Tasks 8-11.

---

## Test Coverage

| Component | Status | Testing Method |
|-----------|--------|-----------------|
| Data structures | ✓ Verified | Automated tests |
| Asset loading | ✓ Verified | Server checks |
| Code logic | ✓ Verified | Code analysis |
| Visual rendering | ⊙ Pending | Manual browser |
| User interactions | ⊙ Pending | Manual browser |
| Theme persistence | ✓ Code OK | Manual verification |
| Language persistence | ✓ Code OK | Manual verification |
| Sound functionality | ✓ Code OK | Manual verification |
| Animations | ✓ Code OK | Manual verification |
| Error handling | ✓ Code OK | Manual verification |

---

## Task 8: Home Page Tests

**What to test**: Home screen title, subtitle, buttons, theme toggle, modals

### Checklist

- [ ] **Title displays**: "L'Oracle de Belline" (in French)
- [ ] **Subtitle displays**: "Application compagnon"
- [ ] **Logo image loads**: Belline Oracle logo visible
- [ ] **"Les cartes" button visible**: Main action button
- [ ] **Default theme is light**: Cream/beige background (#dccbaf)
- [ ] **Click ☀️ button**: Theme changes to dark (black #1a1a1a)
- [ ] **Refresh page**: Dark theme persists
- [ ] **Click ☀️ again**: Theme changes back to light
- [ ] **Refresh page**: Light theme persists
- [ ] **Click ⚙️ (settings) button**: Modal opens
- [ ] **Settings modal shows**:
  - [ ] "Préférences" title
  - [ ] Language toggle (FR/EN)
  - [ ] Sound toggle (Activé/Désactivé)
  - [ ] X button in corner
- [ ] **Click × button**: Modal closes
- [ ] **Click outside modal**: Modal closes
- [ ] **Click ⚙️ again**: Modal opens (still works)
- [ ] **Click i button**: Info modal opens
- [ ] **Info modal shows**:
  - [ ] "À propos" title
  - [ ] Version info (1.0.0)
  - [ ] Application description text
  - [ ] X button in corner
- [ ] **Close info modal**: X button works
- [ ] **Close info modal**: Clicking outside works
- [ ] **No console errors**: Open DevTools (F12) → Console tab is empty

### Expected Visual Appearance

**Light Theme**:
- Background: Cream/beige (#dccbaf)
- Text: Dark gray (#333)

**Dark Theme**:
- Background: Black (#1a1a1a)
- Text: Light gray (#f0f0f0)

---

## Task 9: Cards Gallery Tests

**What to test**: Card grid, grouping, language switching

### Checklist

- [ ] **Click "Les cartes" button**: Navigates to gallery
- [ ] **Home button (🏠) visible**: In top-left corner
- [ ] **Cards display in 4-column grid**: Fixed layout
- [ ] **Exactly 53 cards visible**: Count them or inspect
- [ ] **First 4 cards have no header**: Cards 0-3
- [ ] **"Les 4 premières" header appears**: Before card 4
- [ ] **Group headers visible**: Soleil, Lune, Mercure, etc.
- [ ] **Group headers have colors**:
  - [ ] Soleil: Orange (#d47706)
  - [ ] Lune: Blue (#3c6382)
  - [ ] Mercure: Red (#e64f3a)
  - [ ] Venus: Teal (#089992)
  - [ ] Mars: Red-burgundy (#b81540)
  - [ ] Jupiter: Dark blue (#0c2462)
  - [ ] Saturne: Purple (#814c9a)
- [ ] **Cards are clickable**: Cursor changes to pointer
- [ ] **Scroll through all cards**: No missing cards
- [ ] **Open settings modal**: Click ⚙️
- [ ] **Toggle language to EN**: Click "English"
- [ ] **Settings close**: Click × or outside
- [ ] **Gallery updates**: Headers now show English names
  - [ ] "First Four" instead of "Les 4 premières"
  - [ ] "Sun" instead of "Soleil"
  - [ ] "Moon" instead of "Lune"
  - [ ] etc.
- [ ] **All 53 cards still visible**: No cards disappeared
- [ ] **Toggle back to FR**: Language switches back
- [ ] **All cards still visible**: After language switch

### Expected Card Distribution

- Cards 0-3: No group (4 cards)
- Cards 4-10: Soleil (7 cards)
- Cards 11-17: Lune (7 cards)
- Cards 18-24: Mercure (7 cards)
- Cards 25-31: Venus (7 cards)
- Cards 32-38: Mars (7 cards)
- Cards 39-45: Jupiter (7 cards)
- Cards 46-52: Saturne (7 cards)

**Total**: 53 cards

---

## Task 10: Card Large & Text Views Tests

**What to test**: Large card view, navigation, text rendering

### Checklist

#### Large Card View
- [ ] **Click any card thumbnail**: Navigates to large view
- [ ] **Card image displays**: Full-size card image visible
- [ ] **Card number displayed**: Format "#00", "#01", etc.
- [ ] **Card title displays**: Loaded from markdown file
- [ ] **Three navigation buttons visible**: ← button, center button, → button
- [ ] **Buttons labeled correctly**:
  - [ ] Left: Previous card arrow
  - [ ] Center: "Revenir aux cartes"
  - [ ] Right: Next card arrow

#### Navigation Testing
- [ ] **Click right arrow (→)**: Next card image changes
- [ ] **Click right arrow multiple times**: Cards advance 4→10
- [ ] **Click left arrow (←)**: Previous card image changes
- [ ] **At card 0, click left**: Wraps to card 52
- [ ] **At card 52, click right**: Wraps to card 0
- [ ] **Click "Revenir aux cartes"**: Returns to gallery view

#### Text View
- [ ] **Click card image**: Navigates to text view
- [ ] **Card text displays**: Markdown content renders
- [ ] **Text is readable**: Good contrast with background
- [ ] **Navigation buttons still present**: Arrows still visible
- [ ] **Click right arrow**: Next card text loads
- [ ] **Click left arrow**: Previous card text loads
- [ ] **Click "Revenir aux cartes"**: Back to gallery
- [ ] **Markdown formatting visible**:
  - [ ] Headings are larger
  - [ ] Bold text is bold
  - [ ] Lists are formatted
  - [ ] Paragraphs have spacing
- [ ] **Text works in both themes**:
  - [ ] Switch to dark theme (click ☀️)
  - [ ] Text still readable (good contrast)
  - [ ] Switch back to light theme
  - [ ] Text still readable

#### Wrapping & Edge Cases
- [ ] **Navigate to card 0**: Image displays correctly
- [ ] **Navigate to card 52**: Last card displays
- [ ] **From card 0, click left**: Smoothly wraps to 52
- [ ] **From card 52, click right**: Smoothly wraps to 0
- [ ] **All card titles load**: Try cards 0, 13, 26, 39, 52
- [ ] **All card text files load**: Try same cards in text view

---

## Task 11: Persistence & Complete Flow Tests

**What to test**: localStorage persistence, theme/language persistence, complete navigation flow

### Checklist

#### Complete Navigation Flow
- [ ] **Start at home page**: Title visible
- [ ] **Click "Les cartes"**: Gallery loads (animation smooth)
- [ ] **Click any card**: Large view loads (animation smooth)
- [ ] **Click arrow buttons**: Image changes smoothly
- [ ] **Click card image**: Text view loads (animation smooth)
- [ ] **Click "Revenir aux cartes"**: Back to gallery (no glitches)
- [ ] **Click home icon**: Back to home (animation smooth)
- [ ] **Repeat flow 2-3 times**: No performance degradation
- [ ] **No visual glitches**: Transitions are clean

#### Theme Persistence
- [ ] **Current theme is light**: Verify background color
- [ ] **Click theme button (☀️)**: Theme changes to dark
- [ ] **Open DevTools** (F12 → Application → localStorage)
- [ ] **Verify key exists**: `Belline_theme`
- [ ] **Verify value is**: `"dark"`
- [ ] **Refresh page**: Theme is still dark
- [ ] **Check localStorage again**: Value still `"dark"`
- [ ] **Click theme button**: Switch to light
- [ ] **Check localStorage**: Value now `"light"`
- [ ] **Refresh page**: Still light
- [ ] **Toggle 3-4 times**: Persistence works each time

#### Language Persistence
- [ ] **Current language is FR**: Text in French
- [ ] **Open settings (⚙️)**: Modal opens
- [ ] **Click "English"**: Language switches
- [ ] **Close settings**: Modal closes
- [ ] **Gallery shows English**: Headers in English
- [ ] **Check localStorage**: `Belline_lang = "en"`
- [ ] **Refresh page**: Still English
- [ ] **Open settings**: Toggle back to FR
- [ ] **Check localStorage**: `Belline_lang = "fr"`
- [ ] **Refresh page**: Back to French
- [ ] **Test with multiple cards**: Language persists through navigation

#### Sound Persistence
- [ ] **Open settings (⚙️)**
- [ ] **Check sound setting**: Note current state (Activé/Désactivé)
- [ ] **Check localStorage**: `Belline_sound = "true"` or `"false"`
- [ ] **Toggle sound**: Click opposite option
- [ ] **Check localStorage**: Value changed
- [ ] **Refresh page**: Setting persists
- [ ] **Toggle again**: Works consistently
- [ ] **Close and reopen settings**: Setting still shows correct state

#### localStorage Verification
- [ ] **Open DevTools** (F12)
- [ ] **Go to Application tab**
- [ ] **Expand localStorage** → localhost:8000
- [ ] **Verify 3 keys exist**:
  1. [ ] `Belline_lang` (value: "en" or "fr")
  2. [ ] `Belline_theme` (value: "light" or "dark")
  3. [ ] `Belline_sound` (value: "true" or "false")
- [ ] **Change each setting**: localStorage updates in real-time
- [ ] **Refresh page**: All 3 keys still present with updated values
- [ ] **Clear localStorage**: localStorage → Clear All
- [ ] **Refresh page**: Defaults restore (FR, light, sound on)

#### Error Checking
- [ ] **Open DevTools Console** (F12 → Console tab)
- [ ] **Navigate through all screens**: No red error messages
- [ ] **Click all buttons**: No errors in console
- [ ] **Switch themes and languages**: No errors
- [ ] **Open modals**: No errors
- [ ] **Check Network tab**: 
  - [ ] No 404 errors
  - [ ] All images load (HTTP 200)
  - [ ] All markdown files load (HTTP 200)
- [ ] **Scroll and inspect any warnings**: Should be minimal

#### All 53 Cards Accessible
- [ ] **Navigate to card 0**: Image + title + text load
- [ ] **Navigate to card 13**: Different card loads correctly
- [ ] **Navigate to card 26**: Card 26 displays
- [ ] **Navigate to card 39**: Card 39 displays
- [ ] **Navigate to card 52**: Last card displays correctly
- [ ] **Check all images load**: No broken image icons
- [ ] **Check text loads for each**: No "Unable to load" messages
- [ ] **Test in both languages**: Text files load in FR and EN

---

## Browser DevTools Checklist

### Console (F12 → Console)
- [ ] No JavaScript errors (red messages)
- [ ] No uncaught exceptions
- [ ] Only warnings are OK (yellow messages)
- [ ] No `undefined is not a function` errors
- [ ] No `Uncaught ReferenceError` messages
- [ ] No `Cannot read property` errors

### Network Tab (F12 → Network)
- [ ] All CSS loads: ✓ (HTTP 200)
- [ ] All JavaScript loads: ✓ (HTTP 200)
- [ ] All images load: ✓ (HTTP 200)
- [ ] All markdown files load: ✓ (HTTP 200)
- [ ] No 404 errors
- [ ] No CORS errors
- [ ] Load time acceptable (< 2 seconds for full page)

### Application → localStorage
- [ ] Keys visible: Belline_lang, Belline_theme, Belline_sound
- [ ] Values correct: Reflect current settings
- [ ] Updates in real-time: Change setting, watch localStorage update
- [ ] Persists across refreshes: Refresh page, values remain

### Performance
- [ ] Theme toggle is instant (no lag)
- [ ] Language switch is instant (no lag)
- [ ] Card navigation is smooth (animations visible)
- [ ] Card gallery loads all 53 cards quickly
- [ ] No freezing or stuttering during transitions

---

## Reporting Issues

If any test fails:

1. **Document the issue**:
   - Which task failed (8, 9, 10, or 11)
   - What was expected vs. what happened
   - Browser and OS information
   - Steps to reproduce

2. **Gather evidence**:
   - Take a screenshot
   - Check browser console for errors
   - Check Network tab for failed requests
   - Note localStorage state

3. **Example Issue Report**:
   ```
   Task 9 - Cards not displayed
   Expected: 53 cards in 4-column grid
   Actual: Only 10 cards visible, rest of page blank
   Browser: Chrome 120, Windows 11
   Error: "marked is not defined" in console
   Network: marked.min.js returns 404
   ```

---

## Success Criteria

✓ **All tests pass** when:
- All items in Tasks 8-11 checklists are checked
- No console errors
- No network 404 errors
- localStorage correctly stores all 3 keys
- Theme and language persist after refresh
- All 53 cards accessible with images and text
- Smooth animations between screens
- Responsive to all user interactions
- Markdown text renders correctly

---

## Quick Reference

### Key Files
- `index.html` - Main page
- `assets/app/app.js` - Application logic
- `assets/css/style.css` - Styling
- `assets/data/belline-cards.js` - Card data
- `assets/data/ui-texts.js` - Translations
- `automated-tests.html` - Automated test runner

### Key URLs
- **Main app**: http://localhost:8000
- **Automated tests**: http://localhost:8000/automated-tests.html
- **Server running**: Yes ✓

### Data Summary
- **Total cards**: 53 (IDs 0-52)
- **Groups**: 8 (1 null + 7 planets)
- **Languages**: 2 (FR, EN)
- **Themes**: 2 (light, dark)
- **localStorage keys**: 3 (lang, theme, sound)

---

**Last Updated**: 2026-05-03  
**Status**: Ready for manual browser testing  
**Confidence**: HIGH (all code verified)
