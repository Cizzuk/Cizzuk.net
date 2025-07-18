---
---
(function() {
"use strict";

const siteLangs = {{ site.languages | jsonify }};
let userLang = navigator.language.split('-')[0];
if (!siteLangs.includes(userLang)) userLang = "{{ site.fallback_lang | default: site.lang | default: site.languages[0] }}";
window.location.replace(`/${userLang}${window.location.pathname}`);

})();
