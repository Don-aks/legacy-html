import { getEl, getElements } from '@/utilities/getElements';
import setFocusTrap from '@/utilities/setFocusTrap';

import CLASSES from '@/constants/CLASSES';

function Menu(services) {
  this.CLASSES = {
    menuActive: 'header__menu--active',
  };

  this.element = getEl('header__menu');
  this.links = getElements('menu__link', this.element);

  this.btn = getEl('header__btn');
  this.btnLine = getEl('header__btn-line');
  this.closeBtn = getEl('header__btn--close');

  this._removeFocusTrap = null;

  this.outsideClickService = services.outsideClickService;
  this.escStackService = services.escStackService;
  this.focusNavigation = services.focusNavigation;

  this.isOpen = false;

  this.init();
}

Menu.prototype.init = function () {
  this.btn.addEventListener('click', this.changeState.bind(this));
  this.closeBtn.addEventListener('click', this.changeState.bind(this));
};

Menu.prototype.close = function () {
  this.changeState(false);
};

Menu.prototype.changeState = function (forceState) {
  var state =
    typeof forceState === 'boolean'
      ? forceState
      : !this.element.classList.contains(this.CLASSES.menuActive);

  this.isOpen = state;
  this._updateUI(state);

  if (state) {
    this._onOpen();
  } else {
    this._onClose();
  }
};

Menu.prototype._updateUI = function (state) {
  this.element.classList.toggle(this.CLASSES.menuActive, state);

  document.documentElement.classList.toggle(CLASSES.locked, state);
  document.body.classList.toggle(CLASSES.overlay, state);

  // TODO: use visibility instead of tabindex
  var tabIndex = state ? '0' : '-1';

  this.closeBtn.setAttribute('tabindex', tabIndex);
  this.links.forEach(function (link) {
    link.setAttribute('tabindex', tabIndex);
  });

  this.element.setAttribute('aria-hidden', String(!state));
  this.btn.setAttribute('aria-expanded', String(state));
  this.closeBtn.setAttribute('aria-expanded', String(state));
};

Menu.prototype._onOpen = function () {
  this._removeFocusTrap = setFocusTrap(this.element);

  var self = this;

  function onTransitionEnd() {
    self.element.removeEventListener('transitionend', onTransitionEnd);
    self.links[0].focus();
  }

  this.element.addEventListener('transitionend', onTransitionEnd);

  setTimeout(function () {
    self.focusNavigation.register(self.element);
    self.outsideClickService.register(self);
    self.escStackService.register(self);
  }, 0);
};

Menu.prototype._onClose = function () {
  if (this._removeFocusTrap) {
    this._removeFocusTrap();
  }

  this.btn.focus();

  this.escStackService.unregister(this);
  this.outsideClickService.unregister(this);
  this.focusNavigation.unregister(this.element);
};

export default Menu;
