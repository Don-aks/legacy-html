function isIE() {
  var ua = window.navigator.userAgent;

  // IE 10 or older
  var msie = ua.indexOf('MSIE ');

  // IE 11
  var trident = ua.indexOf('Trident/');

  return msie > -1 || trident > -1;
}

export default isIE;
