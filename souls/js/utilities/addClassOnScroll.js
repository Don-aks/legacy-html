import isScrolledDown from './isScrolledDown';

function addClassOnScroll(
  element,
  container,
  className,
  animationOutName,
  offset,
) {
  offset = offset || 0;
  var scrollTrigger = container || element;
  var isScrolled = isScrolledDown(scrollTrigger, offset);

  if (isScrolled) {
    element.classList.add(className);
    if (animationOutName) {
      element.classList.remove(animationOutName);
    }
    return;
  }

  element.classList.remove(className);
  if (animationOutName) {
    element.classList.add(animationOutName);
  }
}

export default addClassOnScroll;
