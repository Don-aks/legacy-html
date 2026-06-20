import { getElements } from '@/utilities/getElements';
import addClassOnScroll from '@/utilities/addClassOnScroll';

function ImagesRotation(scrollService, viewportService) {
  this.rotatedClass = 'images-rotate__wrapper--show';
  this.scrollService = scrollService;
  this.viewportService = viewportService;

  this.wrappers = getElements('images-rotate__wrapper');
  this.rotateOnView();
}

ImagesRotation.prototype.handleScroll = function () {
  this.rotateOnView();
};

ImagesRotation.prototype.rotateOnView = function () {
  var self = this;
  this.wrappers.forEach(function (wrapper) {
    self.rotate(wrapper);
  });
};

ImagesRotation.prototype.rotate = function (wrapper) {
  addClassOnScroll(
    wrapper,
    null,
    this.rotatedClass,
    null,
    this.viewportService.headerHeight,
  );
};

ImagesRotation.prototype.destroy = function () {
  var self = this;
  this.wrappers.forEach(function (wrapper) {
    wrapper.classList.remove(self.rotatedClass);
  });

  this.scrollService.unregister(this);
};

export default ImagesRotation;
