'use strict';

var FOCUSABLE_SELECTOR = '[href], button, input, select, textarea, [tabindex]';

// STICKY HEADER
var SCROLL_THRESHOLD = 70;
var lastScroll = 0;

var header = getEl('.header');

var modal = getEl('.modal');
var openModalBtns = getAllEls('.js-open-modal');
var removeModalFocusTrap = null;

var modalBackdrop = getEl('.modal-backdrop');
if (modalBackdrop) {
  modalBackdrop.addEventListener('click', closeModal);
}

if (openModalBtns) {
  openModalBtns.forEach(function (element) {
    element.addEventListener('click', openModal);
  });
}

var closeModalBtn = getEl('.modal__close-btn');
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeModal);
}

var modalForm = getEl('.modal__form');
if (modalForm) {
  modalForm.addEventListener('submit', function (event) {
    event.preventDefault();
    successModal();

    setTimeout(closeModal, 2000);
  });
}

window.addEventListener('keydown', function (event) {
  if (event.keyCode === 27) {
    closeModal();
  }
});

var throttledSetFixedHeader = throttle(setFixedHeader, 150);

window.addEventListener('scroll', function () {
  var currentScroll = window.scrollY || window.pageYOffset;

  if (currentScroll === 0) {
    removeClass(header, 'header--hidden');
    removeClass(header, 'header--fixed');
    lastScroll = 0;
    return;
  }

  addClass(header, 'header--fixed');
  throttledSetFixedHeader();
});

setFixedHeader();

// FUNCTIONS
function setFixedHeader() {
  var className = 'header--hidden';
  var currentScroll = window.scrollY || window.pageYOffset;

  var isScrolledUp = lastScroll - currentScroll > SCROLL_THRESHOLD;
  var isScrolledDown = currentScroll - lastScroll > SCROLL_THRESHOLD;

  if (isScrolledDown) {
    addClass(header, className);
  }

  if (isScrolledUp || currentScroll === 0) {
    removeClass(header, className);
  }

  lastScroll = currentScroll;
}

function openModal() {
  if (!modal) return;

  addClass(modal, 'modal--active');
  addClass(document.body, 'modal-open');
  removeModalFocusTrap = setFocusTrap(modal);
}

function closeModal() {
  if (!modal) return;

  removeClass(modal, 'modal--active');
  removeClass(document.body, 'modal-open');

  if (modal.className.indexOf('modal--success') !== -1) {
    setTimeout(function () {
      removeClass(modal, 'modal--success');
    }, 300);
  }

  if (removeModalFocusTrap) {
    removeModalFocusTrap();
    removeModalFocusTrap = null;
  }
}

function successModal() {
  if (!modal) return;
  addClass(modal, 'modal--success');
}

// UTILS
function throttle(callback, delay) {
  var timeout;

  return function (...args) {
    if (timeout) return;

    timeout = setTimeout(() => {
      callback.apply(this, args);
      timeout = null;
    }, delay);
  };
}

function getEl(selector) {
  return document.querySelector(selector);
}

function getAllEls(selector) {
  return toArray(document.querySelectorAll(selector));
}

function addClass(el, className) {
  if ((' ' + el.className + ' ').indexOf(' ' + className + ' ') !== -1) return;

  el.className += ' ' + className;
  el.className = el.className.trim();
}

function removeClass(el, className) {
  el.className = (' ' + el.className + ' ')
    .replace(' ' + className + ' ', ' ')
    .trim();
}

function toArray(obj) {
  return Array.prototype.slice.call(obj);
}

function getFocusable(container) {
  return toArray(container.querySelectorAll(FOCUSABLE_SELECTOR));
}

function setFocusTrap(container) {
  var focusableElements = getFocusable(container).filter(function (el) {
    return el.getAttribute('tabindex') !== '-1' && !el.disabled;
  });

  if (focusableElements.length === 0) return function () {};

  var firstElement = focusableElements[0];
  var lastElement = focusableElements[focusableElements.length - 1];

  firstElement.focus();

  function handleKeyDown(event) {
    var isTabPressed = event.keyCode === 9;
    if (!isTabPressed) return;

    if (
      event.shiftKey &&
      (document.activeElement === firstElement ||
        !container.contains(document.activeElement))
    ) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (
      !event.shiftKey &&
      (document.activeElement === lastElement ||
        !container.contains(document.activeElement))
    ) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  document.addEventListener('keydown', handleKeyDown);

  return function () {
    document.removeEventListener('keydown', handleKeyDown);
  };
}
