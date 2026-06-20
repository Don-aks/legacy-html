function escapeHTML(str) {
  var p = document.createElement('p');
  p.textContent = str;
  return p.innerHTML;
}

export default escapeHTML;
