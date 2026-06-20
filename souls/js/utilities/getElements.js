import toArray from './toArray';

export function getEl(className, parent) {
  parent = parent || document;
  return parent.querySelector('.' + className);
}

export function getElements(className, parent) {
  parent = parent || document;
  return toArray(parent.querySelectorAll('.' + className));
}
