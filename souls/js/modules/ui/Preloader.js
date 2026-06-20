import CLASSES from '@/constants/CLASSES';
import { getEl } from '@/utilities/getElements';

function Preloader(headerLogo) {
  this.element = getEl('preloader');
  this.logo = getEl('logo__img', this.element);

  this.headerLogo = headerLogo;
  this.init();
}

Preloader.prototype.init = function () {
  this.start();
};

Preloader.prototype.start = function () {
  document.documentElement.classList.remove(CLASSES.locked);
  document.documentElement.classList.remove(CLASSES.langLoading);

  document.documentElement.classList.add(CLASSES.preloaderAnimation);

  document.body.removeAttribute('aria-busy');

  var self = this;
  setTimeout(function () {
    self._animateLogo();
    self._removeWhenAnimationEnds();
  }, 0);
};

Preloader.prototype._removeWhenAnimationEnds = function () {
  if (!this.element || !this.logo || !this.headerLogo) {
    return;
  }

  function onTransitionEnd() {
    this.logo.removeEventListener('transitionend', onTransitionEnd);

    document.documentElement.classList.remove(CLASSES.preloaderAnimation);

    document.body.removeChild(this.element);

    this.element = null;
    this.logo = null;
  }

  this.logo.addEventListener('transitionend', onTransitionEnd.bind(this));
};

Preloader.prototype._animateLogo = function () {
  if (!this.logo || !this.headerLogo) {
    return;
  }

  var from = this.logo.getBoundingClientRect();
  var to = this.headerLogo.getBoundingClientRect();

  var dx = to.left - from.left;
  var dy = to.top - from.top;

  this.logo.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
};

export default Preloader;
