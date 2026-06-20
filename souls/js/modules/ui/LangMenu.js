import { getEl, getElements } from '@/utilities/getElements';

function LangMenu(langSwitcher, services) {
  this.CLASSES = {
    menuActive: 'lang__menu--active',
  };

  this.element = getEl('lang');
  this.btn = getEl('lang__btn', this.element);
  this.text = getEl('lang__text', this.btn);

  this.menu = getEl('lang__menu', this.element);
  this.links = getElements('lang__link', this.menu);

  this.langSwitcher = langSwitcher;
  this.escStackService = services.escStackService;
  this.outsideClickService = services.outsideClickService;

  this.isOpen = false;
  this.init();
}

LangMenu.prototype.init = function () {
  this.btn.addEventListener('click', this.toggleLangMenu.bind(this));

  window.addEventListener(
    'hashchange',
    function () {
      var lang = this.langSwitcher.changeLanguage();
      if (!lang) return;

      this.updateLanguageUI(lang);
    }.bind(this),
  );
};

LangMenu.prototype.close = function () {
  this.toggleLangMenu(false);

  this.escStackService.unregister(this);
  this.outsideClickService.unregister(this);
};

LangMenu.prototype.toggleLangMenu = function (forceState) {
  var state = forceState;

  if (typeof forceState !== 'boolean') {
    state = !this.menu.classList.contains(this.CLASSES.menuActive);
  }

  this.isOpen = state;

  // TODO: use visibility instead of tabindex
  this.links.forEach(function (link) {
    link.setAttribute('tabindex', state ? '0' : '-1');
  });

  var isOpen = this.menu.classList.toggle(this.CLASSES.menuActive, state);

  this.menu.setAttribute('aria-hidden', String(!isOpen));
  this.btn.setAttribute('aria-expanded', String(isOpen));

  if (isOpen) {
    var self = this;

    function onTransitionEnd() {
      self.menu.removeEventListener('transitionend', onTransitionEnd);
      self.links[0].focus();
    }

    this.menu.addEventListener('transitionend', onTransitionEnd);

    this.outsideClickService.register(this);
    this.escStackService.register(this);
    return;
  }

  this.btn.focus();
};

LangMenu.prototype.updateLanguageUI = function (lang) {
  document.documentElement.lang = lang;
  this.text.textContent = lang;
};

export default LangMenu;
