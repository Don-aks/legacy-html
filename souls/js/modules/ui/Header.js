import { getEl } from '@/utilities/getElements';

function Header(services) {
  this.scrollService = services.scrollService;

  this.fixedClass = 'fixed';
  this.element = getEl('header');
  this.wrapper = getEl('header__wrapper', this.element);
  this.logo = getEl('logo__img', this.wrapper);
  this.title = getEl('hero__title', this.element);
}

Header.prototype.init = function () {
  this.changePosition();
  this.scrollTitle();

  var self = this;
  this.onScrollWithoutThrottle = function () {
    self.scrollTitle();
  };

  window.addEventListener('scroll', this.onScrollWithoutThrottle);
};

Header.prototype.handleScroll = function () {
  this.changePosition();
};

Header.prototype.changePosition = function () {
  if (window.scrollY > this.viewportService.headerWrapperHeight) {
    this.wrapper.classList.add(this.fixedClass);
    return;
  }

  this.wrapper.classList.remove(this.fixedClass);
};

Header.prototype.scrollTitle = function () {
  if (window.scrollY < this.viewportService.headerHeight) {
    this.title.style.transform = 'translateY(' + window.scrollY * 1.5 + 'px)';
  }
};

Header.prototype.destroy = function () {
  this.wrapper.classList.remove(this.fixedClass);
  window.removeEventListener('scroll', this.onScrollWithoutThrottle);

  this.scrollService.unregister(this);
};

export default Header;
