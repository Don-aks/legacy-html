import ParallaxJS from 'parallax-js';

import toArray from '@/utilities/toArray';
import { getElements } from '@/utilities/getElements';

function Parallax() {
  this.scenes = getElements('image-scene');
  this.init();
}

Parallax.prototype.init = function () {
  // TODO: remove it
  if (window.innerWidth > 1200) return;

  this.scenes.forEach(function (scene) {
    // TODO: add 'new ParallaxJS(scene, { relativeInput: true });'
    new ParallaxJS(scene);

    // Reseting styles from Parallax
    scene.style.position = '';
    scene.style.transform = '';
    scene.style.transformStyle = '';
    scene.style.perspective = '';

    var layers = scene.querySelectorAll('[data-depth]');
    toArray(layers).forEach(function (el) {
      el.style.position = '';
      el.style.top = '';
      el.style.left = '';
    });
  });
};

export default Parallax;
