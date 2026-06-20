import isScrolledDown from '@/utilities/isScrolledDown';

function SliderScrollHandler(sliders, viewportService) {
  this.viewportService = viewportService;
  this.slidersWithStates = Object.keys(sliders).map(function (key) {
    return {
      slider: sliders[key],
      isScrolledDown: false,
      isScrolledUp: true,
    };
  });
}

SliderScrollHandler.prototype.handleScroll = function () {
  var self = this;

  this.slidersWithStates.forEach(function (config) {
    var slider = config.slider;
    var isScrolled = isScrolledDown(
      slider.el,
      self.viewportService.halfWindowHeight,
    );

    if (isScrolled && !config.isScrolledDown && config.isScrolledUp) {
      slider.swiper.slideNext();
      config.isScrolledDown = true;
      config.isScrolledUp = false;
      return;
    }

    if (!isScrolled && config.isScrolledDown && !config.isScrolledUp) {
      slider.swiper.slidePrev();
      config.isScrolledDown = false;
      config.isScrolledUp = true;
    }
  });
};

SliderScrollHandler.prototype.destroy = function () {
  this.slidersWithStates.forEach(function (config) {
    config.slider.swiper.destroy();
  });
};

export default SliderScrollHandler;
