import Swiper from 'swiper/dist/js/swiper.js';

import { getEl } from '@/utilities/getElements';

import SliderScrollHandler from './SliderScrollHandler';

import sliderConfig from './configs/slider';
import recipesConfig from './configs/recipes';
import productsConfig from './configs/products';

function Sliders(services) {
  this.sliders = {};
  this.viewportService = services.viewportService;
  this.scrollService = services.scrollService;

  this.init();
}

Sliders.prototype.init = function () {
  this.initSlider('slider', 'slider__wrapper', sliderConfig);
  this.initSlider('recipes', 'recipes__wrapper', recipesConfig);
  this.initSlider('products', 'products__inner', productsConfig);

  this.scrollHandler = new SliderScrollHandler(
    this.sliders,
    this.viewportService,
  );
};

Sliders.prototype.initSlider = function (name, className, config) {
  var slider = getEl(className);
  if (!slider) return;

  this.sliders[name] = {
    el: slider,
    swiper: new Swiper(slider, config),
  };
};

Sliders.prototype.destroySlider = function (name) {
  this.sliders[name].swiper.destroy();
};

Sliders.prototype.handleScroll = function () {
  this.scrollHandler.handleScroll();
};

Sliders.prototype.destroy = function () {
  this.scrollHandler.destroy();
  this.scrollService.unregister(this);

  Object.keys(this.sliders).forEach(function (key) {
    this.destroySlider(key);
  }, this);
};

export default Sliders;
