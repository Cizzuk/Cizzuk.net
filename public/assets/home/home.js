(function() {
"use strict";

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- App Intro & Preview Animations ---

const appPreviewMain = document.getElementById('app-preview-main');
const appPreviewWrapper = document.getElementById('app-preview-wrapper');

const appIntros = {
    deflector: document.getElementById('app-intro-deflector'),
    sidesearch: document.getElementById('app-intro-sidesearch'),
    cbnote: document.getElementById('app-intro-cbnote'),
    alare: document.getElementById('app-intro-alare'),
};

const appPreviews = {
    deflector: document.getElementById('app-preview-deflector'),
    sidesearch: document.getElementById('app-preview-sidesearch'),
    cbnote: document.getElementById('app-preview-cbnote'),
    alare: document.getElementById('app-preview-alare'),
};

// Animations

const sharedAnimationTiming = {
    duration: 1000,
    easing: 'cubic-bezier(0.2, 0, 0, 1)',
    fill: 'forwards'
}

const sharedAnimationTimingReverse = {
    duration: 1000,
    direction: 'reverse',
    easing: 'cubic-bezier(1, 0, 0.8, 1)',
    fill: 'forwards'
}

const fadeInTumbling = [
    { opacity: 0 },
    { opacity: 1 }
];

// App Preview Slide

const appPreviewSlideRatio = '30%';
const appPreviewSlideMargin = '3%';

const appPreviewWrapperSlideTumbling = reduceMotion ? [
    { transform: 'translateX(0)', opacity: 1 },
    { transform: 'translateX(0)', opacity: 0, offset: 0.5 },
    { transform: 'translateX(calc(-100% + 30% - 20px))', opacity: 0, offset: 0.5 },
    { transform: 'translateX(calc(-100% + 30% - 20px))', opacity: 1 }
] : [
    { transform: 'translateX(0)' },
    { transform: `translateX(calc((-100% + ${appPreviewSlideRatio}) - ${appPreviewSlideMargin}))` }
];

const appPreviewSlideTumbling = reduceMotion ? [
    { right: '50%', transform: 'translateX(50%)' },
    { right: '50%', transform: 'translateX(50%)', offset: 0.5 },
    { right: '0', transform: 'translateX(0)', offset: 0.5 },
    { right: '0', transform: 'translateX(0)' }
] : [
    { right: '50%', transform: 'translateX(50%)' },
    { right: '0', transform: 'translateX(0)' }
];

let slidedAppPreview = false;
const slideAppPreview = () => {
    if (slidedAppPreview) return;
    appPreviewWrapper.animate(appPreviewWrapperSlideTumbling, sharedAnimationTiming);
    Object.values(appPreviews).forEach((element) => {
        element.animate(appPreviewSlideTumbling, sharedAnimationTiming);
    });
    slidedAppPreview = true;
}
const unslideAppPreview = () => {
    if (!slidedAppPreview) return;
    appPreviewWrapper.animate(appPreviewWrapperSlideTumbling, sharedAnimationTimingReverse);
    Object.values(appPreviews).forEach((element) => {
        element.animate(appPreviewSlideTumbling, sharedAnimationTimingReverse);
    });
    slidedAppPreview = false;
}

const showApp = (introElement, previewElement) => {
    Object.values(appIntros).forEach((element) => {
        if (element === introElement) {
            if (element.dataset.isShown !== 'true') {
                element.animate(fadeInTumbling, sharedAnimationTiming);
                element.dataset.isShown = 'true';
            }
        } else if (element.dataset.isShown === 'true') {
            element.animate(fadeInTumbling, sharedAnimationTimingReverse);
            element.dataset.isShown = 'false';
        }
    });
    Object.values(appPreviews).forEach((element) => {
        if (element === previewElement) {
            if (element.dataset.isShown !== 'true') {
                element.animate(fadeInTumbling, sharedAnimationTiming);
                element.dataset.isShown = 'true';
            }
        } else if (element.dataset.isShown === 'true') {
            element.animate(fadeInTumbling, sharedAnimationTimingReverse);
            element.dataset.isShown = 'false';
        }
    });
}

// Initialize Styles

Object.values(appIntros).forEach((element) => {
    element.style.opacity = 0;
});

Object.values(appPreviews).forEach((element) => {
    element.style.opacity = 0;
});

appPreviewMain.style.display = 'block';

document.querySelectorAll('[data-script-class]').forEach((element) => {
    const className = element.dataset.scriptClass;
    element.classList.add(className);
});

document.querySelectorAll('[data-script-style]').forEach((element) => {
    const style = element.dataset.scriptStyle;
    element.style.cssText += style;
});

[appIntros.sidesearch, appIntros.cbnote].forEach((element) => {
    element.style.paddingInlineStart = `calc(${appPreviewSlideRatio} + ${appPreviewSlideMargin})`;
});

// Animation Triggers
// rootMargin tops have an additional -5%

// Show Deflector
const observerShowDeflector = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            showApp(appIntros.deflector, appPreviews.deflector);
            unslideAppPreview();
        }
    });
}, {
    rootMargin: `-5% 0px -50% 0px`,
    threshold: 0
});
observerShowDeflector.observe(appIntros.deflector);

// Show Side Search
const observerShowSidesearch = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            showApp(appIntros.sidesearch, appPreviews.sidesearch);
            slideAppPreview();
        }
    });
}, {
    rootMargin: `-30% 0px -50% 0px`,
    threshold: 0
});
observerShowSidesearch.observe(appIntros.sidesearch);

// Show CBNote
const observerShowCbnote = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            showApp(appIntros.cbnote, appPreviews.cbnote);
            slideAppPreview();
        }
    });
}, {
    rootMargin: `-5% 0px -40% 0px`,
    threshold: 0
});
observerShowCbnote.observe(appIntros.cbnote);

// Show Alare
const observerShowAlare = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            showApp(appIntros.alare, appPreviews.alare);
            unslideAppPreview();
        }
    });
}, {
    rootMargin: `0% 0px 0% 0px`,
    threshold: 0
});
observerShowAlare.observe(appIntros.alare);

// --- Fade-In Animations ---

const fadeInClassElements = document.querySelectorAll('.fadein');

const observerShowNormalFade = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.animate(fadeInTumbling, sharedAnimationTiming);
            observerShowNormalFade.unobserve(entry.target);
        }
    });
}, {
    rootMargin: `0% 0px -15% 0px`,
    threshold: 0
});

fadeInClassElements.forEach((element) => {
    element.style.opacity = 0;
    observerShowNormalFade.observe(element);
});

// --- dropcat SVG Animations ---

const dropcat = document.getElementById('dropcat');
const dropcatSVG = `
    <svg class="dropcat" aria-hidden viewBox="0 0 72 48" fill="none" stroke="#36F" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <path d="M12 46c-7 0-10-4-10-8s1-9 6-14 14-5 22-5 11-5 12-7c5-10 12-10 17-10 0 17 0 17 5 22s6 10 6 14-3 8-10 8zm18-34c-5-10-12-10-17-10v12" />
      <path d="M 29,28 V 38 M 43,28 V 38">
        <animate id="drpct-blink" attributeName="d" dur="0.2s" begin="indefinite" values="M 29,28 V 38 M 43,28 V 38;M 29,36 V 37 M 43,36 V 37;M 29,28 V 38 M 43,28 V 38" />
        <animateTransform id="drpct-right" attributeName="transform" type="translate" dur="1.5s" begin="indefinite" keyTimes="0;0.1;0.9;1" values="0,0;-3,0;-3,0;0,0" />
        <animateTransform id="drpct-left" attributeName="transform" type="translate" dur="1.5s" begin="indefinite" keyTimes="0;0.1;0.9;1" values="0,0;3,0;3,0;0,0" />
      </path>
    </svg>
    `

// Replace icons with SVG
dropcat.innerHTML = dropcatSVG;

// Skip animation if user prefers reduced motion
if (!reduceMotion) {
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
}

})();
