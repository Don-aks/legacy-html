import CLASSES from '@/constants/CLASSES';

import { getEl } from '@/utilities/getElements';
import escapeHTML from '@/utilities/escapeHTML';
import setHash from '@/utilities/setHash';

function LangSwitcher() {
  this.originalPageLang = document.documentElement.lang;
  this._previousLang = null;

  this.langDict = LANG_DICTIONARY;
  this.init();
}

LangSwitcher.prototype.init = function () {
  this._cacheOriginalLangItems();
};

LangSwitcher.prototype.changeLanguage = function (lang) {
  if (typeof lang === 'string' && this._isLang(lang)) {
    // It's recursive call here and below
    // because we handle hash change in the same function
    setHash(lang);
    return;
  }

  var currentLang = this._getLangFromHash();

  if (this._previousLang === null && currentLang === null) {
    var storedLang = this._getLangFromStorage();
    if (this._isLang(storedLang)) {
      setHash(storedLang);
      return;
    }

    var browserLang = navigator.language || navigator.userLanguage;
    if (this._isLang(browserLang)) {
      setHash(browserLang);
      return;
    }
  }

  if (currentLang === null) {
    return;
  }

  if (currentLang === this.originalPageLang && this._previousLang === null) {
    setHash(this.originalPageLang);
    return;
  }

  this._translateAllItems(currentLang);

  this._previousLang = currentLang;
  this._saveLang(currentLang);

  return currentLang;
};

LangSwitcher.prototype._cacheOriginalLangItems = function () {
  Object.keys(this.langDict).forEach(
    function (key) {
      var elem = getEl('lng-' + key);
      if (!elem) {
        console.warn('Element with lng-' + key + ' class not found');
        return;
      }

      var attr = this._getTargetTextAttribute(elem);
      if (attr) {
        this.langDict[key][this.originalPageLang] = elem.getAttribute(attr);
        return;
      }

      this.langDict[key][this.originalPageLang] = elem.innerHTML;
    }.bind(this),
  );
};

LangSwitcher.prototype._translateAllItems = function (lang) {
  var self = this;

  Object.keys(this.langDict).forEach(function (key) {
    var elems = document.querySelectorAll('.lng-' + key);
    if (elems.length === 0) {
      return;
    }

    var rawText = self.langDict[key][lang];

    var safeHtml = escapeHTML(rawText).replace(/\n/g, '<br>');
    if (lang === self.originalPageLang) {
      safeHtml = rawText;
    }

    elems.forEach(function (el) {
      if (rawText === '') {
        el.classList.add(CLASSES.hidden);
        return;
      }

      if (el.classList.contains(CLASSES.hidden)) {
        el.classList.remove(CLASSES.hidden);
      }

      var attr = self._getTargetTextAttribute(el);
      if (attr) {
        el.setAttribute(attr, rawText);
        return;
      }

      el.innerHTML = safeHtml;
    });
  });
};

// ====== UTILS ====== //

LangSwitcher.prototype._isLang = function (lang) {
  return LANG_LIST.some(function (langItem) {
    return lang.indexOf(langItem) !== -1;
  });
};

LangSwitcher.prototype._getLangFromHash = function () {
  var hash = location.hash.replace('#', '');
  return this._isLang(hash) ? hash : null;
};

LangSwitcher.prototype._getLangFromStorage = function () {
  return localStorage.getItem('user-lang');
};

LangSwitcher.prototype._saveLang = function (lang) {
  localStorage.setItem('user-lang', lang);
};

LangSwitcher.prototype._getTargetTextAttribute = function (element) {
  if (element.tagName === 'IMG') {
    return 'alt';
  }

  if (element.tagName === 'INPUT') {
    return 'placeholder';
  }

  if (element.hasAttribute('aria-label')) {
    return 'aria-label';
  }

  return null;
};

export default LangSwitcher;
