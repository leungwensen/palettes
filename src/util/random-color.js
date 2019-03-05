// get random color from w3c x11 named colors
import _ from 'lodash';
import { w3cX11 } from '../named';

const keys = _.keys(w3cX11);

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomColor() {
  const index = randomInt(0, keys.length);
  return w3cX11[keys[index]];
}

export default randomColor;
