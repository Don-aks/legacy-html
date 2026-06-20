import getFocusable from '@/utilities/getFocusable';

function FocusNavigation() {
  this.containers = [];
  this.init();
}

FocusNavigation.prototype.init = function () {
  var self = this;

  this.onKeyDown = function (e) {
    self.handleKeyDown(e);
  };

  document.addEventListener('keydown', this.onKeyDown);
};

FocusNavigation.prototype.register = function (container, focusableElements) {
  if (!container) {
    throw new Error('Container must be defined');
  }

  this.containers.push({
    element: container,
    focusable: focusableElements || getFocusable(container),
  });
};

FocusNavigation.prototype.unregister = function (container) {
  var searched = this.containers.filter(function (c) {
    return c.element === container;
  });

  if (searched.length === 0) {
    throw new Error('Container not found');
  }

  this.containers.splice(this.containers.indexOf(searched[0]), 1);
};

FocusNavigation.prototype.handleKeyDown = function (e) {
  function onKeyDown(focusable) {
    var key = e.keyCode;
    var current = focusable.indexOf(document.activeElement);
    var len = focusable.length;
    var next;

    switch (key) {
      case 40: // ArrowDown
      case 38: // ArrowUp
        var step = key === 40 ? 1 : -1;
        next = (current + step + len) % len;
        break;

      case 36: // Home
        next = 0;
        break;

      case 35: // End
        next = len - 1;
        break;

      // If it's not one of the handled keys
      default:
        return;
    }

    if (next !== undefined && focusable[next]) {
      e.preventDefault();
      focusable[next].focus();
    }
  }

  this.containers.forEach(function (container) {
    if (!container.element.contains(document.activeElement)) {
      return;
    }

    onKeyDown(container.focusable);
  });
};

export default FocusNavigation;
