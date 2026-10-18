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
    alare: document.getElementById('app-intro-alare')
};

const appPreviews = {
    deflector: document.getElementById('app-preview-deflector'),
    sidesearch: document.getElementById('app-preview-sidesearch'),
    cbnote: document.getElementById('app-preview-cbnote'),
    alare: document.getElementById('app-preview-alare')
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
    rootMargin: `-30% 0px -50% 0px`, // top = CBNote bottom
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
    rootMargin: `-5% 0px -25% 0px`,
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


// --- dropcat SVG Animations ---

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
