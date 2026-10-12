(function() {
"use strict";

const urlParams = new URLSearchParams(window.location.search);
const appName = urlParams.get('appname');
const appBundleId = urlParams.get('bundleid');

if (appBundleId) {
  const viewappDiv = document.getElementById('viewapp');
  const viewappButton = document.getElementById('viewapp-button');
  const viewappName = document.getElementById('viewapp-name');

  viewappButton.href = `altstore-pal://viewapp?bundleid=${encodeURIComponent(appBundleId)}`;
  if (appName) viewappName.outerText = appName;
  viewappDiv.style.display = 'block';
}

const alternateLangLinks = document.querySelectorAll('a[data-alternate-lang]');
alternateLangLinks.forEach(link => {
  const url = new URL(link.href);
  if (appName) url.searchParams.set('appname', appName);
  if (appBundleId) url.searchParams.set('bundleid', appBundleId);
  link.href = url.toString();
});

})();
