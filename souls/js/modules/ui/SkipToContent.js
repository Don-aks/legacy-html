import { getEl } from '@/utilities/getElements';

function SkipToContent() {
  this.skipToContent = getEl('skip-to-content');
  this.content = document.querySelector('#content');

  if (!this.content) return;

  this.init();
}

SkipToContent.prototype.init = function () {
  var self = this;
  this.skipToContent.addEventListener('click', function () {
    self.content.focus();
  });
};

export default SkipToContent;
