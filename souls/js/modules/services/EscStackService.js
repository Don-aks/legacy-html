function EscStackService() {
  this.stack = [];
  this.init();
}

EscStackService.prototype.register = function (instance) {
  if (!instance) {
    throw new Error('Instance must be defined');
  }

  if (typeof instance.close !== 'function') {
    throw new Error('Instance must have close() method');
  }

  if (this.stack.indexOf(instance) !== -1) {
    return;
  }

  this.stack.push(instance);
};

EscStackService.prototype.unregister = function (instance) {
  var index = this.stack.indexOf(instance);
  if (index === -1) {
    throw new Error('Instance not found');
  }

  this.stack.splice(index, 1);
};

EscStackService.prototype.init = function () {
  var self = this;
  this.onKeyDown = function (e) {
    self.handleKeyDown(e);
  };

  document.addEventListener('keydown', this.onKeyDown);
};

EscStackService.prototype.handleKeyDown = function (e) {
  var isEsc = e.keyCode === 27;
  if (!isEsc) return;
  // TODO: add preventDefault

  var instance = this.stack[this.stack.length - 1];
  if (!instance) return;

  instance.close();
};

EscStackService.prototype.destroy = function () {
  document.removeEventListener('keydown', this.onKeyDown);
};

export default EscStackService;
