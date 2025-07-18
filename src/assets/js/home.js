---
---
(function() {
"use strict";

// SVG Icons
const iconData = {
  gh: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98 98"><path fill="var(--text)" fill-rule="evenodd" d="M48.9.8C21.8.8 0 22.8 0 50c0 21.8 14 40.2 33.4 46.7 2.4.5 3.3-1.1 3.3-2.4 0-1.1-.1-5-.1-9.1-13.6 2.9-16.4-5.9-16.4-5.9-2.2-5.7-5.4-7.2-5.4-7.2-4.4-3 .3-3 .3-3 4.9.3 7.5 5.1 7.5 5.1 4.4 7.5 11.4 5.4 14.2 4.1.4-3.2 1.7-5.4 3.1-6.6-10.8-1.1-22.2-5.4-22.2-24.3 0-5.4 1.9-9.8 5-13.2-.5-1.2-2.2-6.3.5-13 0 0 4.1-1.3 13.4 5.1 3.9-1.1 8.1-1.6 12.2-1.6s8.3.6 12.2 1.6c9.3-6.4 13.4-5.1 13.4-5.1 2.7 6.8 1 11.8.5 13 3.2 3.4 5 7.8 5 13.2 0 18.9-11.4 23.1-22.3 24.3 1.8 1.5 3.3 4.5 3.3 9.1 0 6.6-.1 11.9-.1 13.5 0 1.3.9 2.9 3.3 2.4C83.5 90.2 97.5 71.8 97.5 50 97.7 22.8 75.9.8 48.9.8z"/></svg>',
  zenn: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82 82"><path fill="#3ea8ff" d="M.9 81.1h17c.9 0 1.7-.5 2.2-1.2L66.9 3c.6-1-.1-2.2-1.3-2.2H49.5c-.8 0-1.5.4-1.9 1.1L-.2 79.7c-.3.6.1 1.4.8 1.4zm58.6-1.2l22.1-35.5c.7-1.1-.1-2.5-1.4-2.5h-16c-.6 0-1.2.3-1.5.8L40 79c-.6.9.1 2.1 1.2 2.1h16.3c.8 0 1.6-.4 2-1.2z"/></svg>',
  mail: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 1.5 21 21.5" fill="none" stroke="var(--text)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M19 5H4c-1.2 0-2.2 1-2.2 2.2v9.6C1.8 18 2.8 19 4 19h15c1.2 0 2.2-1 2.2-2.2V7.2C21.2 6 20.2 5 19 5z"/><path d="M21 8l-9.5 4.5L2 8"/></svg>',
  heart: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 1 22 22" fill="none" stroke="var(--heart)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M12 21C6 17 2 14 2 9c0-6 7-8 10-2 3-6 10-4 10 2 0 5-4 8-10 12z"/></svg>'
};

// Replace icons with SVG versions
const replaceIcons = () => {
  // Replace all icons that have corresponding SVG data
  Object.keys(iconData).forEach(iconId => {
    const iconContainer = document.getElementById(`icon-${iconId}`);
    if (iconContainer && iconData[iconId]) {
      iconContainer.innerHTML = iconData[iconId];
    }
  });
};

// Replace dropcat icon and other icons
const drpctMain = document.getElementById('drpct-main');
if (!drpctMain) return;

// Replace dropcat img to svg
drpctMain.innerHTML = `<svg viewBox="0 0 72 48" fill="none" stroke="#36F" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"><path d="M12 46c-7 0-10-4-10-8s1-9 6-14 14-5 22-5 11-5 12-7c5-10 12-10 17-10 0 17 0 17 5 22s6 10 6 14-3 8-10 8zm18-34c-5-10-12-10-17-10v12"/><path d="M 29,28 V 38 M 43,28 V 38"><animate id="drpct-blink" attributeName="d" dur="0.2s" begin="indefinite" values="M 29,28 V 38 M 43,28 V 38;M 29,36 V 37 M 43,36 V 37;M 29,28 V 38 M 43,28 V 38"/><animateTransform id="drpct-right" attributeName="transform" type="translate" dur="1.5s" begin="indefinite" keyTimes="0;0.1;0.9;1" values="0,0;-3,0;-3,0;0,0"/><animateTransform id="drpct-left" attributeName="transform" type="translate" dur="1.5s" begin="indefinite" keyTimes="0;0.1;0.9;1" values="0,0;3,0;3,0;0,0"/></path></svg>`;

// Replace other icons with SVG versions
replaceIcons();

// Skip animation if user prefers reduced motion
if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

const [blink, right, left] = ['drpct-blink', 'drpct-right', 'drpct-left']
  .map(id => document.getElementById(id));

// Random blink animation
const randomBlink = () => {
    blink.beginElement();
    if (Math.random() < 0.5) {
        setTimeout(() => blink.beginElement(), 250);
    }
    setTimeout(randomBlink, Math.random() * 4000 + 4000);
};

// Random look around animation
let lookDir = Math.random() < 0.5 ? right : left;
const randomLook = () => {
    lookDir.beginElement();
    lookDir = lookDir === right ? left : right;
    setTimeout(randomLook, Math.random() * 9000 + 6000);
};

setTimeout(randomBlink, Math.random() * 1000 + 2000);
setTimeout(randomLook, Math.random() * 3000 + 2000);

})();
