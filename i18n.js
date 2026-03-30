/* ===================================
   PERMITHA KMITL - i18n ENGINE
   JSON-based language switcher.
   Add data-i18n="key" to any element
   to make it translatable.
   =================================== */

(function() {
    'use strict';

    var langCache = {};
    var currentLang = 'id';
    var defaultLang = 'id';
    var langChangeCallbacks = [];

    // Detect saved language or use default
    try {
        var saved = localStorage.getItem('permitha-lang');
        if (saved) currentLang = saved;
    } catch (e) {}

    function loadLang(lang, callback) {
        if (langCache[lang]) {
            callback(langCache[lang]);
            return;
        }

        var url = 'lang/' + lang + '.json?_=' + Date.now();

        if (typeof fetch === 'function') {
            fetch(url)
                .then(function(response) {
                    if (!response.ok) throw new Error('HTTP ' + response.status);
                    return response.json();
                })
                .then(function(data) {
                    langCache[lang] = data;
                    callback(data);
                })
                .catch(function(error) {
                    console.warn('i18n: fetch failed for ' + lang + '.json:', error.message);
                    loadLangXHR(lang, callback);
                });
        } else {
            loadLangXHR(lang, callback);
        }
    }

    function loadLangXHR(lang, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'lang/' + lang + '.json?_=' + Date.now(), true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                    try {
                        langCache[lang] = JSON.parse(xhr.responseText);
                    } catch (e) {
                        console.warn('i18n: Failed to parse ' + lang + '.json');
                        langCache[lang] = {};
                    }
                } else {
                    console.warn('i18n: Could not load ' + lang + '.json (HTTP ' + xhr.status + ')');
                    langCache[lang] = {};
                }
                callback(langCache[lang]);
            }
        };
        xhr.send();
    }

    function applyTranslations(data) {
        if (!data || typeof data !== 'object') return;

        var elements = document.querySelectorAll('[data-i18n]');
        for (var i = 0; i < elements.length; i++) {
            try {
                var el = elements[i];
                var key = el.getAttribute('data-i18n');
                if (data[key] !== undefined) {
                    if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                        el.setAttribute('placeholder', data[key]);
                    } else {
                        el.textContent = data[key];
                    }
                }
            } catch (e) {}
        }

        // Handle data-i18n-placeholder for search inputs etc.
        var placeholderEls = document.querySelectorAll('[data-i18n-placeholder]');
        for (var j = 0; j < placeholderEls.length; j++) {
            try {
                var pEl = placeholderEls[j];
                var pKey = pEl.getAttribute('data-i18n-placeholder');
                if (data[pKey] !== undefined) {
                    pEl.setAttribute('placeholder', data[pKey]);
                }
            } catch (e) {}
        }

        document.documentElement.lang = currentLang;
    }

    function notifyLangChange(lang, data) {
        for (var i = 0; i < langChangeCallbacks.length; i++) {
            try {
                langChangeCallbacks[i](lang, data);
            } catch (e) {
                console.warn('i18n: Language change callback error:', e.message);
            }
        }
    }

    function switchLanguage(lang) {
        currentLang = lang;

        try {
            localStorage.setItem('permitha-lang', lang);
        } catch (e) {}

        delete langCache[lang];

        loadLang(lang, function(data) {
            applyTranslations(data);
            updateActiveFlagDisplay(lang);
            closeLangDropdown();
            notifyLangChange(lang, data);

            setTimeout(function() {
                applyTranslations(data);
            }, 100);
        });
    }

    function updateActiveFlagDisplay(lang) {
        var flagEl = document.getElementById('active-flag');
        if (!flagEl) return;

        var flags = { en: '🇺🇸', id: '🇮🇩', th: '🇹🇭' };
        flagEl.textContent = flags[lang] || flags[defaultLang];
    }

    function toggleLangDropdown(e) {
        if (e) e.stopPropagation();
        var dropdown = document.getElementById('lang-dropdown');
        if (!dropdown) return;
        dropdown.classList.toggle('open');
    }

    function closeLangDropdown() {
        var dropdown = document.getElementById('lang-dropdown');
        if (dropdown) dropdown.classList.remove('open');
    }

    document.addEventListener('click', function(e) {
        var wrapper = document.querySelector('.lang-switcher-wrapper');
        if (wrapper && !wrapper.contains(e.target)) {
            closeLangDropdown();
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        updateActiveFlagDisplay(currentLang);

        loadLang(currentLang, function(data) {
            applyTranslations(data);
            setTimeout(function() {
                applyTranslations(data);
            }, 200);
            notifyLangChange(currentLang, data);
        });
    });

    window.switchLanguage = switchLanguage;
    window.toggleLangDropdown = toggleLangDropdown;
    window.getCurrentLang = function() { return currentLang; };
    window.getLangData = function() { return langCache[currentLang] || {}; };
    window.onLanguageChange = function(callback) { langChangeCallbacks.push(callback); };
})();
