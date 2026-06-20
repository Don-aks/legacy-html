import { getElements } from '@/utilities/getElements';
import getClosest from '@/utilities/getClosest';

function Notify() {
  this.CLASSES = {
    notify: 'notify',
    notifyClosed: 'notify--closed',
  };

  this.btns = getElements('notify__close');
  this.init();
}

Notify.prototype.init = function () {
  var self = this;

  this.btns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      self.handleClick(e);
    });
  });
};

Notify.prototype.handleClick = function (e) {
  var notify = getClosest(e.currentTarget, '.' + this.CLASSES.notify);

  if (!notify) {
    console.error('No notify found for', e.currentTarget);
    return;
  }

  this.close(notify);
};

Notify.prototype.close = function (notify) {
  notify.nextElementSibling.focus();
  notify.classList.add(this.CLASSES.notifyClosed);
};

Notify.prototype.destroy = function () {};

export default Notify;
