import throttle from '@/utilities/throttle';

function ScrollService() {
  this.scrollTargets = [];
  this.init();
}

ScrollService.prototype.init = function () {
  var self = this;
  this.onScroll = throttle(function () {
    self.handleScroll();
  }, 200);

  window.addEventListener('scroll', this.onScroll);
};

ScrollService.prototype.handleScroll = function () {
  this.scrollTargets.forEach(function (target) {
    target.handleScroll();
  });
};

ScrollService.prototype.register = function (instance) {
  if (!instance) {
    throw new Error('Instance must be defined');
  }

  if (typeof instance.handleScroll !== 'function') {
    throw new Error('Instance must have handleScroll() method');
  }

  this.scrollTargets.push(instance);
};

ScrollService.prototype.unregister = function (instance) {
  var index = this.scrollTargets.indexOf(instance);
  if (index === -1) {
    throw new Error('Instance not found');
  }

  this.scrollTargets.splice(index, 1);
};

ScrollService.prototype.destroy = function () {
  window.removeEventListener('scroll', this.onScroll);
};

export default ScrollService;
