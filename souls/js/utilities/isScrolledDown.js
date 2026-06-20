function isScrolledDown(el, offset) {
  offset = offset || 0;

  var scrollY = window.innerHeight - offset;
  var top = el.getBoundingClientRect().top;

  return top < scrollY;
}

export default isScrolledDown;
