(function() {
"use strict";

const urlParams = new URLSearchParams(window.location.search);
const appName = urlParams.get('appname');
const appBundleId = urlParams.get('bundleid');

if (appName && appBundleId) {
  const viewappDiv = document.getElementById('viewapp');
  const viewappButton = document.getElementById('viewapp-button');

  viewappButton.href = `altstore-pal://viewapp?bundleid=${encodeURIComponent(appBundleId)}`;
  viewappButton.textContent = viewappButton.textContent.replace("{appName}", () => appName);
  viewappDiv.classList.remove('hidden');

  const alternateLangLinks = document.querySelectorAll('a[data-alternate-lang]');
  alternateLangLinks.forEach(link => {
    const url = new URL(link.href);
    url.searchParams.set('appname', appName);
    url.searchParams.set('bundleid', appBundleId);
    link.href = url.toString();
  });
}
})();
