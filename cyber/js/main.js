'use strict';

// STICKY HEADER
var SCROLL_THRESHOLD = 70;
var lastScroll = 0;

var header = getEl('.header');
window.addEventListener('scroll', throttle(setFixedHeader, 150));
setFixedHeader();

// FUNCTIONS
function setFixedHeader() {
  var className = 'header--fixed';
  var currentScroll = window.scrollY || window.pageYOffset;

  if (currentScroll > 0) {
    addClass(header, className);
  } else {
    removeClass(header, className);
  }

  var isScrolledUp = lastScroll - currentScroll > SCROLL_THRESHOLD;
  var isScrolledDown = currentScroll - lastScroll > SCROLL_THRESHOLD;

  if (isScrolledDown) {
    addClass(header, 'header--hidden');
  }

  if (isScrolledUp || currentScroll === 0) {
    removeClass(header, 'header--hidden');
  }

  lastScroll = currentScroll;
}

// UTILS
function throttle(callback, delay) {
  let isThrottled = false;

  return function () {
    if (isThrottled) return;

    callback.apply(this, arguments);
    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
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
