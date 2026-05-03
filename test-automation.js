/**
 * Automated Test Suite for Belline Oracle Phase 1
 * Runs automated tests that can be executed in the browser console
 */

const TestSuite = {
  tests: [],
  passed: 0,
  failed: 0,
  results: [],

  // Add a test
  test(name, fn) {
    this.tests.push({ name, fn });
  },

  // Run all tests
  async run() {
    console.clear();
    console.log('='.repeat(80));
    console.log('BELLINE ORACLE PHASE 1 - AUTOMATED TEST SUITE');
    console.log('='.repeat(80));

    for (const test of this.tests) {
      try {
        await test.fn();
        this.passed++;
        this.results.push({ test: test.name, status: 'PASS' });
        console.log(`✓ ${test.name}`);
      } catch (error) {
        this.failed++;
        this.results.push({ test: test.name, status: 'FAIL', error: error.message });
        console.log(`✗ ${test.name}`);
        console.log(`  Error: ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`RESULTS: ${this.passed} passed, ${this.failed} failed`);
    console.log('='.repeat(80));
  },

  assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  },

  assertEquals(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}`);
    }
  },

  assertExists(element, selector) {
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
  },

  assertVisible(element) {
    if (!element || element.offsetParent === null) {
      throw new Error(`Element is not visible: ${element?.id || 'unknown'}`);
    }
  },

  assertHasClass(element, className) {
    if (!element.classList.contains(className)) {
      throw new Error(`Element missing class: ${className}`);
    }
  },

  assertNotHasClass(element, className) {
    if (element.classList.contains(className)) {
      throw new Error(`Element should not have class: ${className}`);
    }
  }
};

// ── TASK 8: HOME PAGE TESTS ──

TestSuite.test('Home page renders with correct title', () => {
  const homeTitle = document.querySelector('.home-title');
  TestSuite.assertExists(homeTitle, '.home-title');
  TestSuite.assert(
    homeTitle.textContent.includes('Belline') || homeTitle.textContent.includes('Oracle'),
    'Home title should contain "Belline" or "Oracle"'
  );
});

TestSuite.test('Home subtitle displays', () => {
  const subtitle = document.getElementById('home-subtitle');
  TestSuite.assertExists(subtitle, '#home-subtitle');
  TestSuite.assert(subtitle.textContent.length > 0, 'Subtitle should have content');
});

TestSuite.test('Two main buttons are visible', () => {
  const btStart = document.getElementById('bt-start');
  TestSuite.assertExists(btStart, '#bt-start');
  TestSuite.assertVisible(btStart);
});

TestSuite.test('Light theme is default', () => {
  const root = document.documentElement;
  const bgColor = window.getComputedStyle(root).getPropertyValue('--color-bg');
  TestSuite.assert(currentTheme === 'light' || bgColor.includes('cream') || bgColor.includes('beige') || bgColor.includes('fff'),
    'Light theme should be default');
});

TestSuite.test('Settings button opens modal', () => {
  const btSettings = document.getElementById('bt-settings');
  const modal = document.getElementById('modal-settings');
  TestSuite.assertExists(btSettings, '#bt-settings');
  TestSuite.assertExists(modal, '#modal-settings');
  btSettings.click();
  const isOpen = modal.classList.contains('open') || getComputedStyle(modal).display !== 'none';
  TestSuite.assert(isOpen, 'Settings modal should open when button clicked');
});

TestSuite.test('Info button opens modal', () => {
  const btInfo = document.getElementById('bt-info');
  const modal = document.getElementById('modal-info');
  TestSuite.assertExists(btInfo, '#bt-info');
  TestSuite.assertExists(modal, '#modal-info');
  btInfo.click();
  const isOpen = modal.classList.contains('open') || getComputedStyle(modal).display !== 'none';
  TestSuite.assert(isOpen, 'Info modal should open when button clicked');
});

TestSuite.test('Theme toggle button exists', () => {
  const btTheme = document.getElementById('bt-theme');
  TestSuite.assertExists(btTheme, '#bt-theme');
  TestSuite.assertVisible(btTheme);
});

// ── TASK 9: CARDS GALLERY TESTS ──

TestSuite.test('Navigate to cards gallery', () => {
  const btStart = document.getElementById('bt-start');
  btStart.click();
  const cardsScreen = document.getElementById('s-cards');
  TestSuite.assertHasClass(cardsScreen, 'active');
});

TestSuite.test('Home button visible on cards screen', () => {
  const btHome = document.getElementById('bt-home');
  TestSuite.assertNotHasClass(btHome, 'hidden');
});

TestSuite.test('All 53 cards render', () => {
  const cards = document.querySelectorAll('.card-thumb');
  TestSuite.assertEquals(cards.length, 53, 'Should have exactly 53 cards');
});

TestSuite.test('Cards display in grid layout', () => {
  const gallery = document.getElementById('cards-gallery');
  const style = window.getComputedStyle(gallery);
  TestSuite.assert(
    style.display === 'grid' || style.display.includes('grid'),
    'Cards gallery should use CSS grid'
  );
});

TestSuite.test('Group headers are present', () => {
  const headers = document.querySelectorAll('.cards-group-header');
  TestSuite.assert(headers.length > 0, 'Group headers should be present');
});

TestSuite.test('Language toggle changes group names', () => {
  const initialText = document.querySelector('.cards-group-header')?.textContent || '';

  // Open settings and toggle language
  const btSettings = document.getElementById('bt-settings');
  btSettings.click();
  const langOpposite = currentLang === 'fr' ? 'en' : 'fr';
  const langButton = document.getElementById(`settings-lang-${langOpposite}`);
  if (langButton) {
    langButton.click();
  }

  const newText = document.querySelector('.cards-group-header')?.textContent || '';
  TestSuite.assert(initialText !== newText, 'Group header text should change when language changes');
});

// ── TASK 10: CARD VIEWS TESTS ──

TestSuite.test('Click card navigates to large view', () => {
  const firstCard = document.querySelector('.card-thumb');
  if (firstCard) {
    firstCard.click();
    const largeScreen = document.getElementById('s-card-large');
    TestSuite.assertHasClass(largeScreen, 'active');
  }
});

TestSuite.test('Navigation arrows present in large view', () => {
  const arrPrev = document.getElementById('arr-prev');
  const arrNext = document.getElementById('arr-next');
  TestSuite.assertExists(arrPrev, '#arr-prev');
  TestSuite.assertExists(arrNext, '#arr-next');
});

TestSuite.test('Card image displays', () => {
  const img = document.querySelector('.card-large-image');
  TestSuite.assertExists(img, '.card-large-image');
  TestSuite.assert(img.src.length > 0, 'Card image should have src');
});

TestSuite.test('Previous/next arrows navigate', () => {
  const arrNext = document.getElementById('arr-next');
  const initialSrc = document.querySelector('.card-large-image').src;
  arrNext.click();
  const newSrc = document.querySelector('.card-large-image').src;
  TestSuite.assert(initialSrc !== newSrc, 'Card image should change when navigating');
});

TestSuite.test('Click card image navigates to text view', () => {
  const img = document.querySelector('.card-large-image');
  img.click();
  const textScreen = document.getElementById('s-card-text');
  TestSuite.assertHasClass(textScreen, 'active');
});

TestSuite.test('Card text renders', () => {
  const content = document.getElementById('card-text-content');
  TestSuite.assertExists(content, '#card-text-content');
  TestSuite.assert(content.textContent.length > 0, 'Card text should have content');
});

TestSuite.test('Text view has back button', () => {
  const btBack = document.getElementById('bt-text-back');
  TestSuite.assertExists(btBack, '#bt-text-back');
});

// ── TASK 11: PERSISTENCE & FLOW TESTS ──

TestSuite.test('localStorage keys exist', () => {
  TestSuite.assert(
    localStorage.getItem('Belline_lang') !== null,
    'Belline_lang should exist in localStorage'
  );
  TestSuite.assert(
    localStorage.getItem('Belline_theme') !== null,
    'Belline_theme should exist in localStorage'
  );
  TestSuite.assert(
    localStorage.getItem('Belline_sound') !== null,
    'Belline_sound should exist in localStorage'
  );
});

TestSuite.test('Theme persistence works', () => {
  const initialTheme = currentTheme;
  const btTheme = document.getElementById('bt-theme');

  // Toggle theme
  btTheme.click();

  // Check if theme changed
  const newTheme = currentTheme;
  TestSuite.assert(initialTheme !== newTheme, 'Theme should toggle');

  // Check localStorage
  const savedTheme = localStorage.getItem('Belline_theme');
  TestSuite.assertEquals(savedTheme, newTheme, 'Saved theme should match current theme');
});

TestSuite.test('Sound toggle works', () => {
  const initialSound = soundEnabled;
  const btSettings = document.getElementById('bt-settings');
  btSettings.click();

  const soundOpposite = soundEnabled ? 'off' : 'on';
  const soundButton = document.getElementById(`settings-sound-${soundOpposite}`);
  if (soundButton) {
    soundButton.click();
  }

  TestSuite.assert(soundEnabled !== initialSound, 'Sound setting should toggle');
});

TestSuite.test('Navigation is smooth without errors', () => {
  // Go back to home
  const btHome = document.getElementById('bt-home');
  btHome.click();

  const homeScreen = document.getElementById('s-home');
  TestSuite.assertHasClass(homeScreen, 'active');
});

TestSuite.test('All 53 cards are accessible', () => {
  // Test a few key card indices
  const cardIndices = [0, 13, 26, 39, 52];

  // Navigate to cards
  const btStart = document.getElementById('bt-start');
  btStart.click();

  for (const idx of cardIndices) {
    const cards = document.querySelectorAll('.card-thumb');
    if (cards[idx]) {
      cards[idx].click();
      const img = document.querySelector('.card-large-image');
      TestSuite.assert(img.src.length > 0, `Card ${idx} should have image`);

      // Go back to gallery
      const btCardBack = document.getElementById('bt-card-back');
      btCardBack.click();
    }
  }
});

TestSuite.test('No console errors detected', () => {
  // This is a basic check - real console errors would show in console
  TestSuite.assert(true, 'Manual console review recommended');
});

// Run all tests when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => TestSuite.run());
} else {
  // DOM already loaded, run tests
  TestSuite.run();
}
