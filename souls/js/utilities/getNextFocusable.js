import getFocusable from '@/utilities/getFocusable';

function getNextFocusable(element) {
  var allFocusable = getFocusable(document);
  var elementIndex = allFocusable.indexOf(element);

  return allFocusable[elementIndex + 1] || null;
}

export default getNextFocusable;
