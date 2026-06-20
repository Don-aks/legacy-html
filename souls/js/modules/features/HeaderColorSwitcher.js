import isScrolledDown from '@/utilities/isScrolledDown';
import { getEl } from '@/utilities/getElements';

import SECTIONS_BG_COLORS from '@/constants/SECTION_BG_COLORS';

function HeaderColorSwitcher(header, services) {
  this.header = header;
  this.scrollService = services.scrollService;
  this.viewportService = services.viewportService;

  this.sections = SECTIONS_BG_COLORS.map(function (config) {
    return getEl(config.sectionClass);
  });

  this.init();
}

HeaderColorSwitcher.prototype.init = function () {
  this.setHeaderBgColor();
};

HeaderColorSwitcher.prototype.setHeaderBgColor = function (color) {
  var rgbColor;

  if (typeof color !== 'string') {
    rgbColor = this.getColor();
  }

  if (!rgbColor) {
    this._removeColor();
    return;
  }

  this._setColor(rgbColor);
};

HeaderColorSwitcher.prototype.handleScroll = function () {
  this.setHeaderBgColor();
};

HeaderColorSwitcher.prototype.getColor = function () {
  var color = null;

  for (var i = 0; i < SECTIONS_BG_COLORS.length; i++) {
    var config = SECTIONS_BG_COLORS[i];
    var section = this.sections[i];

    if (isScrolledDown(section, this.viewportService.halfWindowHeight)) {
      color = config.rgbColor;
      break;
    }
  }

  return color;
};

HeaderColorSwitcher.prototype._setColor = function (rgbColor) {
  this.header.element.style.color = 'rgb(' + rgbColor + ')';
  this.header.wrapper.style.backgroundColor = 'rgba(' + rgbColor + ', 0.5)';
};

HeaderColorSwitcher.prototype._removeColor = function () {
  this.header.element.style.color = '';
  this.header.wrapper.style.backgroundColor = '';
};

HeaderColorSwitcher.prototype.destroy = function () {
  this._removeColor();
  this.scrollService.unregister(this);
};

export default HeaderColorSwitcher;
