import toArray from '@/utilities/toArray';
import getClosest from '@/utilities/getClosest';

import addClassOnScroll from '@/utilities/addClassOnScroll';

function AnimateOnScroll(services) {
  this.animations = this._getAnimated();
  this.viewportService = services.viewportService;
  this.scrollService = services.scrollService;

  this.init();
}

AnimateOnScroll.prototype.init = function () {
  this.animateElements();
};

AnimateOnScroll.prototype.handleScroll = function () {
  this.animateElements();
};

AnimateOnScroll.prototype.animateElements = function () {
  var self = this;
  this.animations.forEach(function (config) {
    addClassOnScroll(
      config.el,
      config.container,
      config.animationName,
      config.animationOutName,
      self.viewportService.halfWindowHeight,
    );
  });
};

AnimateOnScroll.prototype._getAnimated = function () {
  var elements = document.querySelectorAll('[data-animation]');

  return toArray(elements).map(function (el) {
    var animationName = el.dataset.animation;
    var container = getClosest(el, '[data-animation-container]');

    var animationOutName = null;
    if (animationName.indexOf('In') !== -1) {
      animationOutName = animationName.replace('In', 'Out');
    }

    return {
      el: el,
      container: container,
      animationName: animationName,
      animationOutName: animationOutName,
    };
  });
};

AnimateOnScroll.prototype.destroy = function () {
  this.animations.forEach(function (config) {
    config.el.classList.remove(config.animationName);
    config.el.classList.remove(config.animationOutName);
  });

  this.scrollService.unregister(this);
};

export default AnimateOnScroll;
