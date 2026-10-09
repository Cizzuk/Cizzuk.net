(function() {
"use strict";

const SESSION_LANG_KEY = 'selectedAlternateLanguage';

const browserLanguage = navigator.language.split('-')[0];
const storedLanguage = sessionStorage.getItem(SESSION_LANG_KEY);
const preferredLanguage = (storedLanguage || browserLanguage).toLowerCase();

const alternateLinks = document.querySelectorAll('link[rel="alternate"]');
const alternateLanguages = new Map();

// Redirect to the preferred language if it is available
for (const alternateLink of alternateLinks) {
  const lang = alternateLink.getAttribute('hreflang');
  const href = alternateLink.getAttribute('href');

  if (!lang || !href) {
    continue;
  }

  const alternateURL = new URL(href, window.location.href);

  // Skip if the alternate URL is the same as the current URL
  if (window.location.origin === alternateURL.origin &&
      window.location.pathname === alternateURL.pathname) {
    continue;
  }

  // Redirect
  if (preferredLanguage === lang.toLowerCase()) {
    window.location.href = alternateURL.href;
    break;
  }

  alternateLanguages.set(alternateURL.href, lang);
}

// Add click event to alternate language links to store the selected language
for (const langLink of document.querySelectorAll('a[href]')) {
  const lang = alternateLanguages.get(langLink.href);

  if (lang) {
    langLink.addEventListener('click', () => {
      sessionStorage.setItem(SESSION_LANG_KEY, lang);
    });
  }
}
})();
