'use strict';

// ------------ CONSTANTS --------------

var HIDE_MENU_BREAKPOINT = 1200;
var FOCUSABLE_SELECTORS = 'a[href], button, [tabindex="0"]';
var HIDDEN_CELLS =
  '.header__cell-phone, .header__cell-salons, .header__cell-social';

// ------------- VARIABLES --------------

var $header = $('.header__top');
var $headerList = $('.header__list');
var $hiddenCells = $header.find(HIDDEN_CELLS);

var $headerBtnMenu = $header.find('.header__btn-menu');

var $news = $('.news');
var $tabs = $news.find('.tabs__tab');

var UI = {
  $skipToContent: $('.skip-to-content'),
  $content: $('#main'),

  $highContrastBtn: $('.btn--visually-impaired'),

  $header: $header,
  $headerFocusable: getFocusable($('.header')),
  $headerList: $headerList,
  $headerListFocusable: getFocusable($headerList),
  headerListActiveClass: 'header__list--active',
  headerScrolledClass: 'header__top--scrolled',

  $headerBtnMenu: $headerBtnMenu,
  $btnMenuLine: $headerBtnMenu.find('.btn-menu__line'),
  $hiddenCells: $hiddenCells,
  $hiddenCellsFocusable: getFocusable($hiddenCells),
  btnMenuLineActiveClass: 'btn-menu__line--active',

  $btnBooking: $('.header__btn-booking'),

  $salons: $('.salons'),
  $salonsSubmenu: $('.salons__submenu'),
  $salonsLinks: $('.salons__link'),
  salonsSelector: '.salons',
  salonsSubmenuSelector: '.salons__submenu',
  salonsHideClass: 'salons__submenu--hidden',

  $heroBtn: $('.hero__btn'),
  $heroSlider: $('.hero__slider'),
  sliderBtnPrevHTML:
    '<button class="slick-prev" aria-label="Попередній слайд" type="button">←</button>',
  sliderBtnNextHTML:
    '<button class="slick-next" aria-label="Наступний слайд" type="button">→</button>',

  $tabs: $tabs,
  $tabsBtns: $tabs.find('.tabs__btn'),
  tabsTabSelector: '.tabs__tab',
  tabsBtnSelector: '.tabs__btn',
  tabsActiveClass: 'tabs__tab--active',

  $newsItems: $('.news__item'),
  newsItemActiveClass: 'news__item--active',

  $modalForm: $('.modal__form'),
  modalThanksSelector: '#modal-thanks',
};

var removeFocusTrapFunc;

var $window = $(window);
var $body = $(document.body);

// ------------- INITIALIZATION --------------

if ($window.outerWidth() <= HIDE_MENU_BREAKPOINT) {
  setTabIndex(getFocusable(UI.$headerList), -1);
  setTabIndex(getFocusable(UI.$hiddenCells), -1);
}

pulse(UI.$btnBooking);

// ------------- HANDLERS --------------

UI.$skipToContent.on('click', function () {
  UI.$content.trigger('focus');
});

$window.on('scroll', throttle(handleScroll, 150));

UI.$highContrastBtn.on('click', function () {
  var willBeActive = !$body.hasClass('visually-impaired');

  $body.toggleClass('visually-impaired', willBeActive);
  UI.$highContrastBtn.attr('aria-pressed', String(willBeActive));
});

UI.$headerBtnMenu.on('click', handleBtnMenuClick);
$window.on('resize', debounce(handleResize, 150));
$body.on('click', handleSalonsClick);

UI.$btnBooking.on('click', function () {
  $(this).attr('aria-expanded', 'true');
});

UI.$modalForm.on('submit', function (event) {
  event.preventDefault();

  $.fancybox.close();
  $.fancybox.open({
    src: UI.modalThanksSelector,
    type: 'inline',
  });
});

$('a[href^="#"]').on('click', function (e) {
  e.preventDefault();

  var target = $(this).attr('href');
  if (!target || target === '#') return;

  $([document.documentElement, document.body]).animate(
    {
      scrollTop: $(target).offset().top - $header.height(),
    },
    500,
  );
});

UI.$heroSlider.on('mousedown', function () {
  UI.$heroSlider.css('cursor', 'grabbing');
});

UI.$heroSlider.on('mouseup', function () {
  UI.$heroSlider.css('cursor', '');
});

UI.$tabsBtns.on('click', toggleTab);
UI.$tabsBtns.on('keydown', handleKeyboardOnTabsBtns);

// ------------- PLUGINS --------------

UI.$heroSlider.slick({
  responsive: [
    {
      breakpoint: 1331,
      settings: {
        arrows: false,
      },
    },
  ],
  autoplay: true,
  autoplaySpeed: 5000,

  prevArrow: UI.sliderBtnPrevHTML,
  nextArrow: UI.sliderBtnNextHTML,
});

UI.$btnBooking.fancybox({
  afterClose: function () {
    UI.$btnBooking.attr('aria-expanded', 'false');
  },
});

// ------------- FUNCTIONS --------------

function handleScroll() {
  if ($window.scrollTop() > 0) {
    UI.$header.addClass(UI.headerScrolledClass);
    return;
  }

  UI.$header.removeClass(UI.headerScrolledClass);
}

function handleBtnMenuClick() {
  var willBeActive = !UI.$headerList.hasClass(UI.headerListActiveClass);

  UI.$btnMenuLine.toggleClass(UI.btnMenuLineActiveClass, willBeActive);
  UI.$headerList.toggleClass(UI.headerListActiveClass, willBeActive);
  $body.toggleClass('locked', willBeActive);

  UI.$headerListFocusable.prop('tabIndex', willBeActive ? 0 : -1);
  UI.$hiddenCellsFocusable.prop('tabIndex', willBeActive ? 0 : -1);

  if (!willBeActive) {
    UI.$headerBtnMenu.focus();
  }

  UI.$headerBtnMenu.attr('aria-expanded', String(willBeActive));
  UI.$headerList.attr('aria-hidden', String(!willBeActive));

  if (willBeActive) {
    removeFocusTrapFunc = setFocusTrap(UI.$headerFocusable);
    return;
  }

  if (removeFocusTrapFunc) {
    removeFocusTrapFunc();
  }
}

function handleResize() {
  var isMenuVisible = $window.outerWidth() > HIDE_MENU_BREAKPOINT;
  setTabIndex(UI.$headerListFocusable, isMenuVisible ? 0 : -1);
  setTabIndex(UI.$hiddenCellsFocusable, isMenuVisible ? 0 : -1);

  UI.$headerList.attr('aria-hidden', String(!isMenuVisible));
}

function handleSalonsClick(e) {
  var className = '';
  var $target = $(e.target);

  var isToggleBtn = $target.closest(UI.salonsSelector).length;
  var isSubmenu = $target.closest(UI.salonsSubmenuSelector).length;
  var isSubmenuHidden = UI.$salonsSubmenu.hasClass(UI.salonsHideClass);

  if (isToggleBtn && isSubmenuHidden) {
    showSalonsSubmenu();
    return;
  }

  if (isToggleBtn && !isSubmenuHidden) {
    hideSalonsSubmenu();
    return;
  }

  if (!isSubmenu) {
    hideSalonsSubmenu();
    return;
  }
}

function showSalonsSubmenu() {
  toggleSalonsSubmenu(false);
}

function hideSalonsSubmenu() {
  toggleSalonsSubmenu(true);
}

function toggleSalonsSubmenu(shouldHide) {
  UI.$salonsSubmenu.toggleClass(UI.salonsHideClass, shouldHide);

  UI.$salons.attr('aria-expanded', String(!shouldHide));
  UI.$salonsSubmenu.attr('aria-hidden', String(shouldHide));

  UI.$salonsLinks.prop('tabIndex', shouldHide ? -1 : 0);
}

function pulse($element, delay) {
  delay = delay || 5000;
  $element.css('transform', 'scale(1.05)');

  setTimeout(function () {
    $element.css('transform', 'scale(1)');
    setTimeout(function () {
      pulse($element, delay);
    }, delay);
  }, 500);
}

function toggleTab($tabBtn) {
  if (!($tabBtn instanceof jQuery)) {
    if (!$(this).is(UI.tabsBtnSelector)) {
      return;
    }

    $tabBtn = $(this);
  }

  var $tab = $($tabBtn).closest(UI.tabsTabSelector);
  var $btn = $tab.find(UI.tabsBtnSelector);

  var articleId = $btn.attr('aria-controls');
  var $article = UI.$newsItems.filter('#' + articleId);

  UI.$tabs.not($tab).removeClass(UI.tabsActiveClass);
  $tab.addClass(UI.tabsActiveClass);

  setTabIndex(UI.$tabsBtns.not($btn), -1);
  $btn.prop('tabIndex', 0);
  $btn.focus();

  UI.$tabsBtns.not($btn).attr('aria-selected', 'false');
  $btn.attr('aria-selected', 'true');

  UI.$newsItems.not($article).removeClass(UI.newsItemActiveClass);
  $article.addClass(UI.newsItemActiveClass);
}

function handleKeyboardOnTabsBtns(e) {
  var $target = $(e.target);
  if (!$target.is(UI.tabsBtnSelector)) return;

  var key = e.keyCode;
  var index = UI.$tabsBtns.index($target);
  var len = UI.$tabsBtns.length;

  switch (key) {
    case 36: // Home
      toggleTab(UI.$tabsBtns.first());
      break;
    case 35: // End
      toggleTab(UI.$tabsBtns.last());
      break;
    case 38: // ArrowUp
      toggleTab(UI.$tabsBtns.eq((index - 1 + len) % len));
      break;
    case 40: // ArrowDown
      toggleTab(UI.$tabsBtns.eq((index + 1 + len) % len));
      break;

    default:
      return;
  }

  e.preventDefault();
}

// --------------- UTILITIES -----------------

function debounce(func, wait) {
  var timeout;

  return function () {
    var context = this;
    var args = arguments;

    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(context, args);
    }, wait);
  };
}

function throttle(func, limit) {
  var inThrottle;

  return function () {
    var context = this;
    var args = arguments;

    if (!inThrottle) {
      func.apply(context, args);

      inThrottle = true;

      setTimeout(function () {
        inThrottle = false;
      }, limit);
    }
  };
}

function setTabIndex($elements, value) {
  $elements.each(function () {
    var $this = $(this);

    if ($this.prop('tabIndex') === value) return;
    $this.prop('tabIndex', value);
  });
}

function getFocusable($container) {
  return $container.find(FOCUSABLE_SELECTORS);
}

function setFocusTrap($focusableElements) {
  function trapFocus(event) {
    var $focusableElements = event.data.$focusableElements;
    var isTabPressed = event.key === 'Tab' || event.keyCode === 9;
    if (!isTabPressed) return;

    if ($focusableElements.length === 0) {
      console.error(
        'No focusable elements provided for focus trap by event.data',
      );
      return;
    }

    var $enabledElements = $focusableElements.filter(function () {
      return $(this).prop('tabIndex') >= 0 && !$(this).prop('disabled');
    });

    var $firstElement = $enabledElements.first();
    var $lastElement = $enabledElements.last();
    var $activeElement = $(document.activeElement);

    if (event.shiftKey) {
      if ($activeElement.is($firstElement)) {
        $lastElement.focus();
        event.preventDefault();
      }

      return;
    }

    if ($activeElement.is($lastElement)) {
      $firstElement.focus();
      event.preventDefault();
    }
  }

  $body.on('keydown', { $focusableElements: $focusableElements }, trapFocus);

  return function () {
    $body.off('keydown', trapFocus);
  };
}
