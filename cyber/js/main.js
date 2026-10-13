'use strict';

// STICKY HEADER
const SCROLL_THRESHOLD = 70;
let lastScroll = 0;

var header = getEl('.header');
window.addEventListener('scroll', throttle(setFixedHeader, 150));
setFixedHeader();

// FUNCTIONS
function setFixedHeader() {
  var className = 'header--fixed';
  var currentScroll = window.scrollY || window.pageYOffset;

  console.log(currentScroll);
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
function throttle(func, limit) {
  var lastFunc;
  var lastRan;
  return function () {
    var context = this;
    var args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        function () {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan),
      );
    }
  };
}

function getEl(selector) {
  return document.querySelector(selector);
}

function getAllEls(selector) {
  return toArray(document.querySelectorAll(selector));
}

function addClass(el, className) {
  if (el.className.includes(className)) return;

  el.className += ' ' + className;
}

function removeClass(el, className) {
  el.className = el.className.replace(className, '');
}

function toArray(obj) {
  return Array.prototype.slice.call(obj);
}
