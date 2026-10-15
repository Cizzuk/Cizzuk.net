(function() {
"use strict";

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
    setTimeout(randomBlink, Math.random() * 4000 + 4000); // 4-8s
};

// Random look around animation
let lookDir = Math.random() < 0.5 ? right : left;
const randomLook = () => {
    lookDir.beginElement();
    lookDir = lookDir === right ? left : right;
    setTimeout(randomLook, Math.random() * 9000 + 6000); // 6-15s
};

setTimeout(randomBlink, Math.random() * 1000 + 2000); // 2-3s
setTimeout(randomLook, Math.random() * 3000 + 2000); // 2-5s

})();
