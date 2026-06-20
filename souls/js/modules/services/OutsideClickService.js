function OutsideClickService() {
  this.stack = [];
  this.init();
}

OutsideClickService.prototype.register = function (instance) {
  if (!instance) {
    throw new Error('Instance must be defined');
  }

  if (!instance.element) {
    throw new Error('Instance must have element property');
  }

  if (typeof instance.close !== 'function') {
    throw new Error('Instance must have close() method');
  }

  if (this.stack.indexOf(instance) !== -1) {
    return;
  }

  this.stack.push(instance);
};

OutsideClickService.prototype.unregister = function (instance) {
  var index = this.stack.indexOf(instance);
  if (index === -1) {
    throw new Error('Instance not found');
  }

  this.stack.splice(index, 1);
};

OutsideClickService.prototype.init = function () {
  var self = this;
  this.onClick = function (e) {
    self.handleClick(e);
  };

  document.addEventListener('click', this.onClick);
};

OutsideClickService.prototype.handleClick = function (e) {
  var instance = this.stack[this.stack.length - 1];
  if (!instance) return;

  if (instance.element === e.target || instance.element.contains(e.target)) {
    return;
  }

  instance.close();
};

OutsideClickService.prototype.destroy = function () {
  document.removeEventListener('click', this.onClick);
};

export default OutsideClickService;
