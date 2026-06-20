import throttle from '@/utilities/throttle';

function ViewportService(header) {
  this.header = header;
  this.init();
}

ViewportService.prototype.init = function () {
  var self = this;
  this.onResize = throttle(function () {
    self.update();
  }, 200);

  window.addEventListener('resize', this.onResize);
  this.update();
};

ViewportService.prototype.update = function () {
  this.halfWindowHeight = window.innerHeight / 2;
  this.headerHeight = this.header.element.offsetHeight;
  this.headerWrapperHeight = this.header.wrapper.offsetHeight;
};

ViewportService.prototype.destroy = function () {
  window.removeEventListener('resize', this.onResize);
};

export default ViewportService;
