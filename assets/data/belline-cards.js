/**
 * Card metadata and GROUPS structure for Belline Oracle cards
 * Total: 53 cards (0-52) grouped by planetary associations
 */

const GROUPS = {
  null: [0, 1, 2, 3],
  Soleil: [4, 5, 6, 7, 8, 9, 10],
  Lune: [11, 12, 13, 14, 15, 16, 17],
  Mercure: [18, 19, 20, 21, 22, 23, 24],
  Venus: [25, 26, 27, 28, 29, 30, 31],
  Mars: [32, 33, 34, 35, 36, 37, 38],
  Jupiter: [39, 40, 41, 42, 43, 44, 45],
  Saturne: [46, 47, 48, 49, 50, 51, 52]
};

const GROUP_COLORS = {
  Soleil: '#d47706',
  Lune: '#3c6382',
  Mercure: '#e64f3a',
  Venus: '#089992',
  Mars: '#b81540',
  Jupiter: '#5aaa1c',
  Saturne: '#814c9a'
};

const GROUP_SYMBOLS = {
  Soleil:  '☉',
  Lune:    '☾',
  Mercure: '☿',
  Venus:   '♀︎',
  Mars:    '♂︎',
  Jupiter: '♃',
  Saturne: '♄'
};

function getGroupSymbol(groupName) {
  if (!groupName) return null;
  return GROUP_SYMBOLS[groupName] || null;
}

const CARD_NAMES = {
  fr: [
    'Carte bleue', 'La Destinée', "L'étoile de l'homme", "L'étoile de la femme",
    'Nativité', 'Réussite', 'Élévation', 'Honneurs', 'Pensée Amitié', 'Campagne Santé', 'Présents',
    'Trahison', 'Départ', 'Inconstance', 'Découverte', "L'eau", 'Les pénates', 'Maladie',
    'Changement', 'Argent', 'Intelligence', 'Vol Perte', 'Entreprises', 'Trafic', 'Nouvelle',
    'Plaisirs', 'Paix', 'Union', 'Famille', 'Amor', 'La table', 'Passions',
    'Méchanceté', 'Procès', 'Despotisme', 'Ennemis', 'Pourparlers', 'Feu', 'Accident',
    'Appui', 'Beauté', 'Héritage', 'Sagesse', 'La renommée', 'Le hasard', 'Bonheur',
    'Infortune', 'Stérilité', 'Fatalité', 'Grâce', 'Ruine', 'Retard', 'Cloître'
  ],
  en: [
    'Carte bleue', 'La Destinée', "L'étoile de l'homme", "L'étoile de la femme",
    'Nativité', 'Réussite', 'Élévation', 'Honneurs', 'Pensée Amitié', 'Campagne Santé', 'Présents',
    'Trahison', 'Départ', 'Inconstance', 'Découverte', "L'eau", 'Les pénates', 'Maladie',
    'Changement', 'Argent', 'Intelligence', 'Vol Perte', 'Entreprises', 'Trafic', 'Nouvelle',
    'Plaisirs', 'Paix', 'Union', 'Famille', 'Amor', 'La table', 'Passions',
    'Méchanceté', 'Procès', 'Despotisme', 'Ennemis', 'Pourparlers', 'Feu', 'Accident',
    'Appui', 'Beauté', 'Héritage', 'Sagesse', 'La renommée', 'Le hasard', 'Bonheur',
    'Infortune', 'Stérilité', 'Fatalité', 'Grâce', 'Ruine', 'Retard', 'Cloître'
  ]
};

/** Returns the card name in the given language, falling back to French. */
function getCardName(cardId, lang) {
  const names = CARD_NAMES[lang] || CARD_NAMES.fr;
  return names[cardId] ?? CARD_NAMES.fr[cardId];
}

const ALL_CARDS = Array.from({ length: 53 }, (_, i) => ({
  id: i,
  imageUrl: `./assets/images/cartes/${String(i).padStart(2, '0')}.jpg`
}));

/**
 * Get the planet group name for a given card ID
 * @param {number} cardId - Card ID (0-52)
 * @returns {string|null} - Planet name or null for first 4 cards
 */
function getGroupNameForCardId(cardId) {
  for (const [groupName, cardIds] of Object.entries(GROUPS)) {
    if (cardIds.includes(cardId)) {
      return groupName === 'null' ? null : groupName;
    }
  }
  return null;
}

/**
 * Get the hex color code for a given planet group
 * @param {string|null} groupName - Planet name or null
 * @returns {string|null} - Hex color code or null if no color defined
 */
function getGroupColor(groupName) {
  if (groupName === null) {
    return null;
  }
  return GROUP_COLORS[groupName] || null;
}

// Verify all 53 cards are included
if (ALL_CARDS.length !== 53) {
  throw new Error(`Expected 53 cards, got ${ALL_CARDS.length}`);
}

// Verify no duplicate card IDs across groups
const allCardIds = Object.values(GROUPS).flat();
if (new Set(allCardIds).size !== allCardIds.length) {
  throw new Error('Duplicate card IDs found in GROUPS');
}

// Verify card ID range
const sortedCardIds = allCardIds.sort((a, b) => a - b);
if (sortedCardIds[0] !== 0 || sortedCardIds[sortedCardIds.length - 1] !== 52) {
  throw new Error('Card IDs must range from 0 to 52');
}

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GROUPS,
    GROUP_COLORS,
    GROUP_SYMBOLS,
    ALL_CARDS,
    getGroupNameForCardId,
    getGroupColor,
    getGroupSymbol,
    getCardName
  };
}
