import getClosest from '@/utilities/getClosest';

function ScrollIntoView(menu, services) {
  this.menu = menu;
  this.viewportService = services.viewportService;

  this.init();
}

ScrollIntoView.prototype.init = function () {
  var self = this;
  this.onClick = function (e) {
    self.handleClick(e);
  };

  document.addEventListener('click', this.onClick);
};

ScrollIntoView.prototype.handleClick = function (e) {
  var targetLink = getClosest(e.target, 'a');
  if (!targetLink) return;

  var href = targetLink.getAttribute('href');
  var isIgnoreScroll = targetLink.hasAttribute('data-no-smooth-scroll');

  if (!this._isAnchor(href) || isIgnoreScroll) {
    return;
  }

  var scrollTarget = document.querySelector(href);
  if (!scrollTarget) return;

  e.preventDefault();
  if (this.menu.isOpen) {
    this.menu.changeState(false);
  }

  var topOffset = 0;
  var elementPosition = scrollTarget.getBoundingClientRect().top;
  var offsetPosition = elementPosition - topOffset;

  window.scrollBy({
    top: offsetPosition - this.viewportService.headerWrapperHeight,
    behavior: 'smooth',
  });
};

ScrollIntoView.prototype._isAnchor = function (href) {
  return href !== '#' && href.indexOf('#') === 0;
};

ScrollIntoView.prototype.destroy = function () {
  document.removeEventListener('click', this.onClick);
};

export default ScrollIntoView;
