/**
 * Belline Oracle - Main Application Logic
 * Handles state management, navigation, rendering, and user interactions
 */

// ──── STATE MANAGEMENT ────

let currentLang = 'fr';
let currentTheme = 'light';
let soundEnabled = true;
let currentScreen = 0;
let currentCardId = 0;
let currentDomain = null;
let currentNumber = null;
let tirageCardId = null;
const H3_SYMBOLS = ['♡', '⌬', '❖', 'ᗑ', '☸︎'];

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

// ──── DOM ELEMENT CACHE ────

const dom = {};

function cacheDOM() {
  // Screen elements
  dom.screens = document.querySelectorAll('.screen');
  dom.screenHome = document.getElementById('s-home');
  dom.screenCards = document.getElementById('s-cards');
  dom.screenCardLarge = document.getElementById('s-card-large');
  dom.screenCardText = document.getElementById('s-card-text');

  // Header buttons
  dom.btHome = document.getElementById('bt-home');
  dom.btSettings = document.getElementById('bt-settings');
  dom.btInfo = document.getElementById('bt-info');
  dom.btTheme = document.getElementById('bt-theme');

  // Home screen
  dom.homeTitle = document.getElementById('home-title');
  dom.homeSubtitle = document.getElementById('home-subtitle');
  dom.btStart = document.getElementById('bt-start');

  // Cards screen
  dom.cardsGallery = document.getElementById('cards-gallery');
  dom.arrCardsHome = document.getElementById('arr-cards-home');

  // Card large screen
  dom.cardLargeImage = document.getElementById('card-large-image');
  dom.cardLargeHeader = document.getElementById('card-large-header');
  dom.cardLargeContainer = document.querySelector('.card-large-container');
  dom.cardLargeInfoEl = document.querySelector('.card-large-info');
  dom.arrPrev = document.getElementById('arr-prev');
  dom.arrNext = document.getElementById('arr-next');

  // Card text screen
  dom.cardTextContent = document.getElementById('card-text-content');
  dom.btTextBack = document.getElementById('bt-text-back');
  dom.arrPrevText = document.getElementById('arr-prev-text');

  // Modals
  dom.modalSettings = document.getElementById('modal-settings');
  dom.modalInfo = document.getElementById('modal-info');
  dom.modalSettingsTitle = document.getElementById('modal-settings-title');
  dom.modalInfoTitle = document.getElementById('modal-info-title');
  dom.modalInfoBody = document.getElementById('modal-info-body');
  dom.btSettingsClose = document.getElementById('bt-settings-close');
  dom.btModalClose = document.getElementById('bt-modal-close');

  // Settings
  dom.settingsLangLabel = document.getElementById('settings-lang-label');
  dom.settingsSoundLabel = document.getElementById('settings-sound-label');
  dom.settingsLangEn = document.getElementById('settings-lang-en');
  dom.settingsLangFr = document.getElementById('settings-lang-fr');
  dom.settingsSoundOn = document.getElementById('settings-sound-on');
  dom.settingsSoundOff = document.getElementById('settings-sound-off');

  // Tirage
  dom.btTirage = document.getElementById('bt-tirage');
  dom.btUneCarte = document.getElementById('bt-une-carte');
  dom.btTirageCroix = document.getElementById('bt-tirage-croix');
  dom.arrTirageChoixBack = document.getElementById('arr-tirage-choix-back');
  dom.tirageDomainTitle = document.getElementById('tirage-domaine-title');
  dom.arrTirageDomaineBack = document.getElementById('arr-tirage-domaine-back');
  dom.tirageChiffreTitle = document.getElementById('tirage-chiffre-title');
  dom.arrTirageChiffreBack = document.getElementById('arr-tirage-chiffre-back');
  dom.tirageNumbers = document.getElementById('tirage-numbers');
  dom.revealHeader = document.getElementById('reveal-header');
  dom.revealCardImg = document.getElementById('reveal-card-img');
  dom.revealText = document.getElementById('reveal-text');
  dom.arrRevealBack = document.getElementById('arr-reveal-back');
  dom.btNouveauTirage = document.getElementById('bt-nouveau-tirage');
}

// ──── INITIALIZATION ────

function init() {
  cacheDOM();
  loadPreferences();
  applyTheme();
  applyLanguage();
  setupEventListeners();
  renderHome();
  initTirageAnimation();
  goTo(0);
}

function loadPreferences() {
  const savedLang = localStorage.getItem('Belline_lang');
  if (savedLang) {
    currentLang = savedLang;
  }

  const savedTheme = localStorage.getItem('Belline_theme');
  if (savedTheme) {
    currentTheme = savedTheme;
  }

  const savedSound = localStorage.getItem('Belline_sound');
  if (savedSound !== null) {
    soundEnabled = savedSound === 'true';
  }
}

// ──── PREFERENCES ────

function txt(key) {
  const text = UI_TEXTS[currentLang][key];
  if (!text) {
    console.warn(`Missing translation key: ${key}`);
    return key;
  }
  return text;
}

function applyLanguage() {
  // Home screen
  dom.homeTitle.innerHTML = txt('home-title');
  dom.homeSubtitle.textContent = txt('home-subtitle');
  dom.btStart.textContent = txt('btn-cards');

  // Header/Navigation buttons
  dom.btHome.setAttribute('aria-label', txt('btn-back-to-cards'));
  dom.btSettings.setAttribute('aria-label', txt('btn-settings'));
  dom.btInfo.setAttribute('aria-label', txt('btn-info'));
  dom.btTheme.setAttribute('aria-label', txt('btn-theme'));

  // Large card screen

  // Text screen
  dom.btTextBack.textContent = txt('btn-back-to-cards');

  // Modals
  dom.modalSettingsTitle.textContent = txt('settings-title');
  dom.modalInfoTitle.textContent = txt('info-title');
  dom.modalInfoBody.innerHTML = `
    <p class="info-version">${txt('info-version')}</p>
    <p>${txt('info-text')}</p>
  `;

  // Settings labels
  dom.settingsLangLabel.textContent = txt('lang-label');
  dom.settingsSoundLabel.textContent = txt('sound-label');
  dom.settingsLangEn.textContent = txt('lang-en');
  dom.settingsLangFr.textContent = txt('lang-fr');
  dom.settingsSoundOn.textContent = txt('sound-on');
  dom.settingsSoundOff.textContent = txt('sound-off');

  // Home tirage button
  dom.btTirage.textContent = txt('btn-tirage');

  // Screen 4 — Choix
  dom.btUneCarte.textContent = txt('btn-une-carte');
  dom.btTirageCroix.textContent = txt('btn-tirage-croix');

  // Screen 5 — Domaine
  dom.tirageDomainTitle.textContent = txt('screen-domaine-title');
  document.querySelectorAll('.domain-label[data-key]').forEach(el => {
    el.textContent = txt(el.dataset.key);
  });

  // Screen 6 — Chiffre
  dom.tirageChiffreTitle.textContent = txt('screen-chiffre-title');
  dom.btNouveauTirage.textContent = txt('btn-nouveau-tirage');
}

function applyTheme() {
  const root = document.documentElement;
  if (currentTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

function switchLang(lang) {
  currentLang = lang;
  localStorage.setItem('Belline_lang', lang);
  applyLanguage();
  updateSettingsDisplay();

  if (currentScreen === 1) {
    renderCards();
  } else if (currentScreen === 2) {
    renderCardLarge();
  } else if (currentScreen === 3) {
    renderCardText();
  }

  playSound('click');
}

function toggleTheme() {
  if (currentTheme === 'light') {
    currentTheme = 'dark';
  } else {
    currentTheme = 'light';
  }
  localStorage.setItem('Belline_theme', currentTheme);
  applyTheme();
  playSound('click');
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem('Belline_sound', String(soundEnabled));
  updateSettingsDisplay();
  playSound('click');
}

function updateSettingsDisplay() {
  if (currentLang === 'fr') {
    dom.settingsLangFr.classList.add('active');
    dom.settingsLangEn.classList.remove('active');
  } else {
    dom.settingsLangEn.classList.add('active');
    dom.settingsLangFr.classList.remove('active');
  }

  if (soundEnabled) {
    dom.settingsSoundOn.classList.add('active');
    dom.settingsSoundOff.classList.remove('active');
  } else {
    dom.settingsSoundOff.classList.add('active');
    dom.settingsSoundOn.classList.remove('active');
  }
}

// ──── SOUND ────

function playSound(type) {
  if (!soundEnabled) return;

  const soundMap = { click: './assets/sounds/click.mp3', back: './assets/sounds/back.mp3', belline: './assets/sounds/belline.mp3' };
  const soundFile = soundMap[type] ?? soundMap.click;
  const audio = new Audio(soundFile);
  audio.play().catch(() => {
    // Silently fail if sound doesn't exist or can't play
  });
}

// ──── NAVIGATION ────

function goTo(screenIndex) {
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

  // Exit screen: remove active, add leaving
  if (fromScreen !== toScreen) {
    fromScreen.classList.remove('active');
    fromScreen.classList.add('leaving');

    // After animation, remove leaving class
    setTimeout(() => {
      fromScreen.classList.remove('leaving');
    }, 350);
  }

  // Enter screen: add active
  toScreen.classList.add('active');

  currentScreen = screenIndex;
}

function changeCardId(direction) {
  if (direction === 'next') {
    currentCardId = currentCardId === 52 ? 0 : currentCardId + 1;
  } else {
    currentCardId = currentCardId === 0 ? 52 : currentCardId - 1;
  }
}

function navigateCard(direction) {
  playSound('click');

  if (currentScreen !== 2) {
    changeCardId(direction);
    renderCardLarge();
    if (currentScreen === 3) renderCardText();
    return;
  }

  const els = [dom.cardLargeContainer, dom.cardLargeInfoEl];
  const exitClass  = direction === 'next' ? 'card-exit-left'   : 'card-exit-right';
  const enterClass = direction === 'next' ? 'card-enter-right' : 'card-enter-left';

  els.forEach(el => el.classList.add(exitClass));

  setTimeout(() => {
    changeCardId(direction);
    els.forEach(el => { el.classList.remove(exitClass); el.classList.add(enterClass); });
    renderCardLarge();
    dom.cardLargeContainer.offsetHeight; // force reflow
    els.forEach(el => el.classList.remove(enterClass));
  }, 250);
}

function prevCard() { navigateCard('prev'); }
function nextCard()  { navigateCard('next'); }

// ──── RENDERING ────

function renderHome() {
  // Home screen is static, only translations change in applyLanguage()
}

function renderCards() {
  dom.cardsGallery.innerHTML = '';

  let previousGroupName = undefined;

  ALL_CARDS.forEach(card => {
    const groupName = getGroupNameForCardId(card.id);

    // Add group header if this is a new group
    if (groupName !== previousGroupName) {
      const headerDiv = document.createElement('div');
      headerDiv.className = 'cards-group-header';

      const groupTextKey = groupName === null ? 'group-4premières' : `group-${groupName}`;
      const groupColor = getGroupColor(groupName);
      const groupSymbol = getGroupSymbol(groupName);
      const square = groupColor ? `<span class="group-color-square" style="background:${groupColor}">${groupSymbol || ''}</span>` : '';
      headerDiv.innerHTML = `${square}<span>${txt(groupTextKey)}</span>`;
      if (groupColor) headerDiv.style.borderBottomColor = groupColor;

      dom.cardsGallery.appendChild(headerDiv);
      previousGroupName = groupName;
    }

    // Create card element
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card-item';
    cardDiv.innerHTML = `
      <div class="card-item-label">${card.id} / ${getCardName(card.id, currentLang)}</div>
      <div class="card-item-img"><img src="${card.imageUrl}" alt="${getCardName(card.id, currentLang)}" loading="lazy"></div>`;
    cardDiv.addEventListener('click', () => {
      currentCardId = card.id;
      renderCardLarge();
      goTo(2);
      playSound('click');
    });

    dom.cardsGallery.appendChild(cardDiv);
  });
}

function renderCardLarge() {
  const card = ALL_CARDS[currentCardId];
  const groupName = getGroupNameForCardId(currentCardId);
  const cardName = getCardName(currentCardId, currentLang);
  const groupColor = getGroupColor(groupName);
  const groupSymbol = getGroupSymbol(groupName);
  const groupLabel = groupName ? txt(`group-${groupName}`) : '';
  const square = groupColor ? `<span class="planet-color-square" style="background:${groupColor}">${groupSymbol || ''}</span>` : '';
  const label = groupLabel ? `<span style="color:${groupColor}">${groupLabel}</span> ` : '';
  dom.cardLargeHeader.innerHTML = `${square}${label}${currentCardId} / ${cardName}`;

  dom.cardLargeImage.src = card.imageUrl;
  dom.cardLargeImage.alt = cardName;

  // Update navigation buttons

  // Add click handler to image to view text
  dom.cardLargeImage.style.cursor = 'pointer';
  dom.cardLargeImage.onclick = () => {
    goTo(3);
    renderCardText();
    playSound('click');
  };
}

async function renderCardText() {
  const cardId = String(currentCardId).padStart(2, '0');
  const mdFile = `./assets/data/book/${currentLang}/${cardId}.md`;

  try {
    const response = await fetch(mdFile);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

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

        const label = document.createElement('span');
        label.style.color = groupColor;
        label.textContent = txt(`group-${groupName}`) + ' ';
        h1.insertBefore(label, square.nextSibling);
      }
    }

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

    dom.cardTextContent.scrollTop = 0;
  } catch (error) {
    console.error(`Failed to load card text: ${mdFile}`, error);
    dom.cardTextContent.innerHTML = `<p>Unable to load card text.</p>`;
    dom.cardTextContent.scrollTop = 0;
  }
}

// ──── MODALS ────

function openSettingsModal() {
  dom.modalSettings.classList.add('active');
  updateSettingsDisplay();
  playSound('click');
}

function closeSettingsModal() {
  dom.modalSettings.classList.remove('active');
  playSound('back');
}

function openInfoModal() {
  dom.modalInfo.classList.add('active');
  playSound('click');
}

function closeInfoModal() {
  dom.modalInfo.classList.add('closing');
  setTimeout(() => dom.modalInfo.classList.remove('active', 'closing'), 280);
  playSound('back');
}

// ──── EVENT LISTENERS ────

function setupEventListeners() {
  // Header buttons
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

  dom.btSettings.addEventListener('click', openSettingsModal);
  dom.btInfo.addEventListener('click', openInfoModal);
  dom.btTheme.addEventListener('click', toggleTheme);

  // Home screen
  dom.btStart.addEventListener('click', () => {
    renderCards();
    goTo(1);
    playSound('click');
  });

  // Large card screen
  dom.arrPrev.addEventListener('click', () => { goTo(1); playSound('back'); });
  dom.arrNext.addEventListener('click', () => { renderCardText(); goTo(3); playSound('click'); });

  // Text screen
  dom.arrPrevText.addEventListener('click', () => { goTo(1); playSound('back'); });
  dom.btTextBack.addEventListener('click', () => { goTo(2); playSound('back'); });

  // Settings modal
  dom.settingsLangEn.addEventListener('click', () => switchLang('en'));
  dom.settingsLangFr.addEventListener('click', () => switchLang('fr'));
  dom.settingsSoundOn.addEventListener('click', toggleSound);
  dom.settingsSoundOff.addEventListener('click', toggleSound);
  dom.btSettingsClose.addEventListener('click', closeSettingsModal);

  // Info modal
  dom.btModalClose.addEventListener('click', closeInfoModal);

  // Modal backdrops close modals
  dom.modalSettings.addEventListener('click', (e) => {
    if (e.target === dom.modalSettings) {
      closeSettingsModal();
    }
  });

  dom.modalInfo.addEventListener('click', (e) => {
    if (e.target === dom.modalInfo) {
      closeInfoModal();
    }
  });

  // Keyboard shortcuts (optional, for accessibility)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (dom.modalSettings.classList.contains('active')) {
        closeSettingsModal();
      }
      if (dom.modalInfo.classList.contains('active')) {
        closeInfoModal();
      }
    }
  });

  // Home — tirage button
  dom.btTirage.addEventListener('click', () => {
    goTo(4);
    playSound('click');
  });

  // Screen 4 — Choix
  dom.arrTirageChoixBack.addEventListener('click', () => {
    goTo(0);
    playSound('back');
  });
  dom.btUneCarte.addEventListener('click', () => {
    goTo(5);
    playSound('click');
  });

  // Screen 5 — Domaine
  dom.arrTirageDomaineBack.addEventListener('click', () => {
    goTo(4);
    playSound('back');
  });
  document.querySelectorAll('.btn-domain').forEach(btn => {
    btn.addEventListener('click', () => {
      currentDomain = btn.dataset.domain;
      goTo(6);
      playSound('click');
    });
  });

  // Screen 6 — Chiffres
  dom.arrTirageChiffreBack.addEventListener('click', () => {
    goTo(5);
    playSound('back');
  });
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

  // Screen 8 — Reveal
  dom.arrRevealBack.addEventListener('click', () => { goTo(5); playSound('back'); });
  dom.btNouveauTirage.addEventListener('click', () => { goTo(6); playSound('click'); });
}

// ──── TIRAGE ANIMATION ────

function initTirageAnimation() {
  const ticks = document.getElementById('ta-ticks');
  if (!ticks) return;
  const N = 24;
  for (let i = 0; i < N; i++) {
    const tick = document.createElement('i');
    tick.style.transform = `translateX(-50%) rotate(${(360 / N) * i}deg)`;
    tick.style.transformOrigin = `50% calc(var(--ta-size) / 2)`;
    if (i % 6 === 0) {
      tick.style.height = '10px';
      tick.style.width = '2.5px';
    }
    ticks.appendChild(tick);
  }
}

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
  if (!deckEl) return;
  buildTcDeck(deckEl, n);
  await tcSleep(300);
  const cards = Array.from(deckEl.children);
  for (let k = cards.length - 1; k >= 1; k--) {
    cards[k].classList.add('tc-fading');
    await tcSleep(330);
  }
  await tcSleep(300);
  onComplete();
}

// ──── TIRAGE REVEAL RENDERING ────

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

  const DOMAIN_H3_INDEX = { amour: 0, travail: 1, argent: 2, famille: 3, spiritualite: 4 };
  const h3Index = DOMAIN_H3_INDEX[currentDomain] ?? 0;
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
}

// ──── BOOTSTRAP ────

document.addEventListener('DOMContentLoaded', init);
