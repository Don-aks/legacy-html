'use strict';

// ======== VARIABLES ===========

var CLASSES = {
  locked: 'locked',

  header: 'header',
  headerNav: 'header__nav',
  headerLink: 'header__link',
  headerLogo: 'header__logo',
  headerActive: 'header--active',
  headerButton: 'header__button',

  menu: 'header__list',
  menuActive: 'header__list--active',

  menuBtn: 'menu-button',
  menuBtnActive: 'menu-button--active',

  dropDownLink: 'header__link--drop-down',

  submenu: 'submenu',
  submenuHidden: 'submenu--hidden',
  submenuLink: 'submenu__link',

  serviceGrid: 'services',

  dpContainer: 'ui-datepicker',
  dpBtnPrev: 'ui-datepicker-prev',
  dpBtnNext: 'ui-datepicker-next',
  dpHeader: 'ui-datepicker-header',
  dpMonthSelect: 'ui-datepicker-month',
  dpMonthSelectMenu: 'ui-datepicker-month-select',
  dpYearSelect: 'ui-datepicker-year',

  selectmenuBtn: 'ui-selectmenu-button',

  appointmentSection: 'appointment',
  appointmentDp: 'appointment__date',
  appointmentButtonContainer: 'appointment__buttons',
  appointmentBtn: 'appointment__button',
  appointmentBtnActive: 'appointment__button--active',
  appointmentOption: 'appointment__option',
};

var header = getElementByClass(CLASSES.header);
var headerNav = getElementByClass(CLASSES.headerNav, header);
var menu = getElementByClass(CLASSES.menu, header);
var menuButton = getElementByClass(CLASSES.menuBtn, header);
var menuFocusableElements = getFocusable(menu);
var menuElementsAndClasses = [
  [document.body, CLASSES.locked],
  [menu, CLASSES.menuActive],
  [header, CLASSES.headerActive],
  [menuButton, CLASSES.menuBtnActive],
];
var headerLinks = toArray(header.querySelectorAll('.' + CLASSES.headerLink));

var elementsToToggleFocusTrap = getFocusable(headerNav);
var removeMenuFocusTrap;

var logo = getElementByClass(CLASSES.headerLogo, header);
var firstHeaderButton = getElementByClass(CLASSES.headerButton, header);
var firstMenuElement = menuFocusableElements[0];

var menuTabRoute = [
  { from: logo, to: firstHeaderButton },
  { from: menuButton, to: firstMenuElement },
  { from: firstHeaderButton, to: logo, shift: true },
];

var submenu = getElementByClass(CLASSES.submenu, header);
var submenuTransitionDelay = getTransitionDurationInMs(submenu);

var dropDownLink = getElementByClass(CLASSES.dropDownLink, header);
var submenuLinks = toArray(submenu.querySelectorAll('.' + CLASSES.submenuLink));

var submenuAnimationTimeoutId;
var removeSubmenuFocusTrap;

var serviceGrid = getElementByClass(CLASSES.serviceGrid);

var appointmentSection = document.querySelector(
  '.' + CLASSES.appointmentSection,
);
var serviceSelect = document.querySelector('#service');

// ======== HANDLERS ===========

menuButton.addEventListener('click', toggleMenu);

window.addEventListener(
  'resize',
  debounce(function () {
    var isMenuVisible = window.innerWidth > 1200;
    toggleMenu(isMenuVisible);
  }, 200),
);

headerLinks.forEach(function (link) {
  link.addEventListener('click', handleHeaderLinkClick);
});

submenu.addEventListener('click', onServiceLinkClick);

document.body.addEventListener('click', function (e) {
  if (dropDownLink === e.target || dropDownLink.contains(e.target)) {
    toggleSubmenu(!isSubmenuClosed());
    return;
  }

  if (submenu !== e.target && !submenu.contains(e.target)) {
    toggleSubmenu(true, false);
  }
});

document.addEventListener('keydown', function (event) {
  var isEscKey = event.keyCode === 27;
  if (!isEscKey) return;

  if (!isSubmenuClosed()) {
    toggleSubmenu(true);
    return;
  }

  if (isMenuOpen()) {
    toggleMenu(false);
  }
});

submenu.addEventListener('keydown', function (e) {
  var key = e.keyCode;
  var current = submenuLinks.indexOf(document.activeElement);
  var len = submenuLinks.length;
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

  if (next !== undefined && submenuLinks[next]) {
    e.preventDefault();
    submenuLinks[next].focus();
  }
});

serviceGrid.addEventListener('click', onServiceLinkClick);

// ======== OTHER ===========

if (window.innerWidth <= 1200) {
  disableAccessibility(menu, menuFocusableElements);
}

// ======== PLUGINS ===========

/*let dp = new AirDatepicker('#input-date', {
  inline: true,
  locale: {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    daysMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    today: 'Today',
    clear: 'Clear',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: 'hh:mm aa',
    firstDay: 0
  },
  prevHtml: '',
  nextHtml: '',
  onRenderCell: function({date, cellType}) {
    if (cellType === 'day') {
      const now = new Date(Date.now());
      const today12_30am = new Date(Date.now()).setHours(12, 30, 0, 0);
      const currentDate = new Date(Date.now()).setHours(0, 0, 0, 0);

      if ((date - currentDate == 0 && now > today12_30am) || date < currentDate) {
        return {
          disabled: true
        }
      }
    }
  }
});

let isAllDatesDisabled = true;
const dates = document.querySelectorAll(
  '.-inline- .air-datepicker-cell:not(.-other-month-)'
);
for (let i = 0; i < dates.length; i++) {
  if (!dates[i].classList.contains('-disabled-')) {
    isAllDatesDisabled = false;
  }
}

if (isAllDatesDisabled) {
  dp.next();
}*/

$.datepicker.setDefaults({
  dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  nextText: '',
  prevText: '',
});

var datePicker = $('.' + CLASSES.appointmentDp);
var inputDate = $('#input-date');

var now = new Date(Date.now());
var today12_30am = new Date(Date.now()).setHours(12, 30, 0, 0);
var currentDate = new Date(Date.now()).setHours(0, 0, 0, 0);
var firstWorkDay = getFirstAvailableWorkDay(now);

var lastFocusedDirection;

datePicker.datepicker({
  altField: '#input-date',
  changeMonth: true,
  changeYear: true,
  // firstDay: 1,
  appendTo: '.' + CLASSES.appointmentDp,

  onSelect: function (dateText) {
    inputDate.val(dateText);
    disablePastDateFocus();
    enableNavKeyboardSupport();
    setTimeout(initDatepickerSelects, 0);
    setTimeout(fixDatepickerNavTabOrder, 0);
  },

  onChangeMonthYear: function () {
    setTimeout(function () {
      disablePastDateFocus();
      enableNavKeyboardSupport();
      restoreDatepickerNavFocus();
      setTimeout(initDatepickerSelects, 0);
      setTimeout(fixDatepickerNavTabOrder, 0);
    }, 0);
  },

  beforeShowDay: function (date) {
    if (date < firstWorkDay || isWeekend(date)) {
      return [false, 'past-day'];
    }

    return [true, ''];
  },
});

datePicker.datepicker('setDate', firstWorkDay);
$('#input-date').val($.datepicker.formatDate('mm/dd/yy', firstWorkDay));

disablePastDateFocus();
enableNavKeyboardSupport();
fixDatepickerNavTabOrder();

initDatepickerSelects();

var timeInput = document.querySelector('#input-time');
var buttonContainer = getElementByClass(CLASSES.appointmentButtonContainer);
var buttons = document.querySelectorAll('.' + CLASSES.appointmentBtn);

buttonContainer.addEventListener('click', handleClickOnButtonContainer);

// ======== FUNCTIONS (JS) ===========

function toggleMenu(desiredState) {
  var active = desiredState;

  if (typeof desiredState !== 'boolean') {
    active = !menu.classList.contains(CLASSES.menuActive);
  }

  menuElementsAndClasses.forEach(function (arr) {
    arr[0].classList.toggle(arr[1], active);
  });

  if (!active) {
    if (removeMenuFocusTrap) {
      removeMenuFocusTrap();
      removeMenuFocusTrap = null;
    }

    menuButton.focus();
  }

  setElementsAccessibility(menu, menuFocusableElements, !active);
  menuButton.setAttribute('aria-expanded', String(active));

  // Focus trap setup
  if (active) {
    var last = getLastVisibleElement(menuFocusableElements);

    var routes = [
      { from: last, to: logo },
      { from: logo, to: last, shift: true },
    ].concat(menuTabRoute);

    removeMenuFocusTrap = createSmartFocusTrap(
      elementsToToggleFocusTrap,
      routes,
    );
  }
}

function toggleSubmenu(isHide, forceFocus = true) {
  function show() {
    submenu.style.display = '';
    submenu.setAttribute('aria-hidden', 'false');
    dropDownLink.setAttribute('aria-expanded', 'true');

    setTimeout(function () {
      submenu.classList.remove(CLASSES.submenuHidden);
    }, 0);
  }

  function hide() {
    submenu.classList.add(CLASSES.submenuHidden);
    setTimeout(hideCompletly, submenuTransitionDelay);
  }

  function hideCompletly() {
    submenu.style.display = 'none';
    submenu.setAttribute('aria-hidden', 'true');
    dropDownLink.setAttribute('aria-expanded', 'false');
  }

  function focusOnFirstLink() {
    submenuLinks[0].focus();
  }

  clearTimeout(submenuAnimationTimeoutId);

  if (isHide) {
    if (forceFocus) {
      dropDownLink.focus();
    }

    hide();

    if (removeSubmenuFocusTrap) {
      removeSubmenuFocusTrap();
      removeSubmenuFocusTrap = null;
    }
    return;
  }

  show();

  removeSubmenuFocusTrap = createSmartFocusTrap(submenuLinks);

  if (forceFocus) {
    setTimeout(focusOnFirstLink, submenuTransitionDelay);
  }
}

function handleHeaderLinkClick(e) {
  var href = e.target.getAttribute('href');
  if (!href || href[0] !== '#') return;

  var targetSection = document.querySelector(href);
  if (!targetSection) {
    console.error('No section found for href: ' + href);
    return;
  }

  if (!isSubmenuClosed()) {
    toggleSubmenu(true);
  }

  if (isMenuOpen()) {
    toggleMenu(false);
  }

  e.preventDefault();

  var sectionRect = targetSection.getBoundingClientRect();
  var sectionPosition = sectionRect.top + window.pageYOffset;

  window.scrollTo({ top: sectionPosition, behavior: 'smooth' });

  if (href === '#footer-contact') {
    setTimeout(function () {
      blink(targetSection);
    }, 1000);
  }
}

function isMenuOpen() {
  return menu.classList.contains(CLASSES.menuActive);
}

function isSubmenuClosed() {
  return submenu.classList.contains(CLASSES.submenuHidden);
}

function onServiceLinkClick(e) {
  var optionValue = e.target.getAttribute('data-option');
  if (!optionValue) return;

  e.preventDefault();

  var option = document.querySelector(
    '.' + CLASSES.appointmentOption + '[value="' + optionValue + '"]',
  );

  if (!option) {
    console.error('No option with value "' + optionValue + '"');
    return;
  }

  if (isMenuOpen()) {
    toggleMenu(false);
  }

  toggleSubmenu(true);

  var sectionRect = appointmentSection.getBoundingClientRect();
  var sectionPosition = sectionRect.top + window.pageYOffset;

  window.scrollTo({ top: sectionPosition, behavior: 'smooth' });
  serviceSelect.value = optionValue;
}

function handleClickOnButtonContainer(event) {
  if (event.target.classList.contains(CLASSES.appointmentBtn)) {
    // Reset active state for all buttons
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove(CLASSES.appointmentBtnActive);
    }

    timeInput.value = event.target.innerText;
    event.target.classList.add(CLASSES.appointmentBtnActive);
  }
}

// ========= FUNCTIONS (JQuery) ===========

function disablePastDateFocus() {
  $('.past-day a').attr('tabindex', '-1');
}

function enableNavKeyboardSupport() {
  $('.' + CLASSES.dpBtnPrev + ', .' + CLASSES.dpBtnNext)
    .attr('tabindex', '0')
    .off('keydown')
    .on('keydown', function (e) {
      var isSpaceOrEnter = e.keyCode === 13 || e.keyCode === 32;
      if (!isSpaceOrEnter) return;

      if ($(this).hasClass(CLASSES.dpBtnPrev)) {
        lastFocusedDirection = 'prev';
      } else if ($(this).hasClass(CLASSES.dpBtnNext)) {
        lastFocusedDirection = 'next';
      }

      // Prevent page scroll when space is pressed
      e.preventDefault();

      $(this).trigger('click');
    });
}

function restoreDatepickerNavFocus() {
  if (!lastFocusedDirection) return;

  setTimeout(function () {
    var datepicker = $('.' + CLASSES.dpContainer);
    var isPrev = lastFocusedDirection === 'prev';
    var selector = '.' + (isPrev ? CLASSES.dpBtnPrev : CLASSES.dpBtnNext);

    var newButton = datepicker.find(selector);
    if (newButton.length) newButton.trigger('focus');
  }, 0);
}

function initDatepickerSelects() {
  function onChange() {
    $(this).trigger('change');
    initDatepickerSelects();
  }

  $('.' + CLASSES.dpMonthSelect).selectmenu({
    change: function () {
      onChange.call(this);
    },
    classes: {
      'ui-selectmenu-menu': CLASSES.dpMonthSelectMenu,
    },
  });

  $('.' + CLASSES.dpYearSelect).selectmenu({
    change: function () {
      onChange.call(this);
    },
  });

  fixDatepickerNavTabOrder();
  removePastYearsFromSelect();
}

function fixDatepickerNavTabOrder() {
  var $header = $('.' + CLASSES.dpHeader);
  var $prev = $header.find('.' + CLASSES.dpBtnPrev);
  var $next = $header.find('.' + CLASSES.dpBtnNext);

  if (!$prev.length || !$next.length) {
    console.error('Datepicker nav buttons not found');
    return;
  }

  $header.append($prev).append($next);
  $prev.attr('tabindex', '0');
  $next.attr('tabindex', '0');
}

function removePastYearsFromSelect() {
  var currentYear = new Date().getFullYear();

  $('.' + CLASSES.dpYearSelect + ' option').each(function () {
    var year = parseInt($(this).val(), 10);

    if (year < currentYear) {
      $(this).remove();
    }
  });

  $('.' + CLASSES.dpYearSelect).selectmenu('refresh');
}

// ======== UTILS ===========

function getElementByClass(className, parent) {
  parent = parent || document;
  return parent.querySelector('.' + className);
}

function debounce(func, wait) {
  var timeout;

  return function (...args) {
    var later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function toArray(obj) {
  return Array.prototype.slice.call(obj);
}

var matchesSelector =
  Element.prototype.matches ||
  Element.prototype.msMatchesSelector ||
  Element.prototype.webkitMatchesSelector;

function getClosest(element, selector) {
  while (element && element.nodeType === 1) {
    if (matchesSelector.call(element, selector)) {
      return element;
    }

    element = element.parentNode;
  }

  return null;
}

function blink(element, repeatCount) {
  if (!element || element.offsetParent === null) return;

  var count = repeatCount || 2;
  var duration = 400;
  var delay = 1000;

  function step() {
    if (count <= 0) return;

    element.classList.add('blink');

    setTimeout(function () {
      element.classList.remove('blink');
      count -= 1;

      if (count > 0) {
        setTimeout(step, delay);
      }
    }, duration);
  }

  step();
}

function getTransitionDurationInMs(el) {
  var style = getComputedStyle(el);
  var durationStr = style.transitionDuration || style.webkitTransitionDuration;

  var durations = durationStr.split(',').map(function (d) {
    d = d.trim();
    var isMs = d.indexOf('ms') !== -1;
    return isMs ? parseFloat(d) : parseFloat(d) * 1000;
  });

  // if multiple
  return Math.max.apply(Math, durations);
}

function getLastVisibleElement(elements) {
  for (var i = elements.length - 1; i >= 0; i--) {
    if (elements[i].offsetParent !== null) {
      return elements[i];
    }
  }

  return null;
}

function getFirstAvailableWorkDay(startDate) {
  var targetDate = new Date(startDate.getTime());

  if (now > today12_30am) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  while (isWeekend(targetDate)) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  targetDate.setHours(0, 0, 0, 0);

  return targetDate;
}

function isWeekend(date) {
  var day = date.getDay();
  return day === 0 || day === 6;
}

function getFocusable(container) {
  return container.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]',
  );
}

function enableAccessibility(container, focusableElements) {
  setElementsAccessibility(container, focusableElements, false);
}

function disableAccessibility(container, focusableElements) {
  setElementsAccessibility(container, focusableElements, true);
}

function toggleAccessibilityWithTabIndexCondition(
  container,
  focusableElements,
  isHidden,
) {
  setElementsAccessibility(container, focusableElements, isHidden, true);
}

function setElementsAccessibility(
  container,
  focusableElements,
  isHidden,
  isForceTabIndexUpdate = false,
) {
  var focusable = toArray(focusableElements);

  if (isForceTabIndexUpdate) {
    var wantedTabIndex = isHidden ? '-1' : '0';

    focusable.forEach((el) => {
      if (el.getAttribute('tabindex') !== wantedTabIndex) {
        el.setAttribute('tabindex', wantedTabIndex);
      }
    });
  } else {
    focusable.forEach((el) =>
      el.setAttribute('tabindex', isHidden ? '-1' : '0'),
    );
  }

  var active = document.activeElement;
  if (isHidden && container.contains(active)) {
    active.blur();
  }

  container.setAttribute('aria-hidden', String(isHidden));
}

/**
 * Creates a focus trap with custom navigation routes.
 * @param {HTMLElement[]} elements - Elements to cycle focus between.
 * @param {Object[]} customRoutes - Custom transitions: { from: HTMLElement, to: HTMLElement, shift: boolean }.
 */
function createSmartFocusTrap(elements, customRoutes = []) {
  var first = elements[0];
  var last = elements[elements.length - 1];

  function handleKeyDown(event) {
    var isTabPressed = event.keyCode === 9;
    if (!isTabPressed) return;

    var active = document.activeElement;

    for (var i = 0; i < customRoutes.length; i++) {
      var route = customRoutes[i];

      if (active === route.from && event.shiftKey === Boolean(route.shift)) {
        route.to.focus();
        event.preventDefault();
        return;
      }
    }

    if (event.shiftKey && active === first) {
      last.focus();
      event.preventDefault();
    } else if (!event.shiftKey && active === last) {
      first.focus();
      event.preventDefault();
    }
  }

  function handleFocusIn(event) {
    var isFocusInside = toArray(elements).some((el) => {
      return el.contains(event.target) || el === event.target;
    });

    if (!isFocusInside) {
      first.focus();
    }
  }

  document.addEventListener('focusin', handleFocusIn);
  document.addEventListener('keydown', handleKeyDown);

  return function destroy() {
    document.removeEventListener('focusin', handleFocusIn);
    document.removeEventListener('keydown', handleKeyDown);
  };
}
