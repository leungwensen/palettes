import chroma from 'chroma-js';
import _ from 'lodash';

const hueStep = 2;
const saturationStep = 16;
const saturationStep2 = 5;
const brightnessStep1 = 5;
const brightnessStep2 = 15;
const lightColorCount = 5;
const darkColorCount = 4;

function getHue(hsv, i, isLight) {
  let hue;
  const [h, s, v] = hsv;
  if (h >= 60 && h <= 240) {
    hue = isLight ? h - hueStep * i : h + hueStep * i;
  } else {
    hue = isLight ? h + hueStep * i : h - hueStep * i;
  }
  if (hue < 0) {
    hue += 360;
  } else if (hue >= 360) {
    hue -= 360;
  }
  return hue;
}

function getSaturation(hsv, i, isLight) {
  let saturation;
  const [h, s, v] = hsv;
  if (isLight) {
    saturation = s * 100 - saturationStep * i;
  } else if (i == darkColorCount) {
    saturation = s * 100 + saturationStep;
  } else {
    saturation = s * 100 + saturationStep2 * i;
  }
  if (saturation > 100) {
    saturation = 100;
  }
  if (isLight && i === lightColorCount && saturation > 10) {
    saturation = 10;
  }
  if (saturation < 6) {
    saturation = 6;
  }
  return _.clamp(saturation, 0, 100);
}

function getValue(hsv, i, isLight) {
  const [h, s, v] = hsv;
  if (isLight) {
    return _.clamp(v * 100 + brightnessStep1 * i, 0, 100);
  }
  return _.clamp(v * 100 - brightnessStep2 * i, 0, 100);
}

function colorPalette (color, index) {
  const isLight = index <= 6;
  const hsv = chroma(color).hsv();
  const i = isLight ? lightColorCount + 1 - index : index - lightColorCount - 1;
  return chroma.hsv(
    getHue(hsv, i, isLight),
    getSaturation(hsv, i, isLight) / 100,
    getValue(hsv, i, isLight) / 100,
  ).hex();
}

function getPalette(color) {
  const palette = [];
  for (let i = 0; i < 10; i += 1) {
    palette.push(colorPalette(color, i + 1));
  }
  return palette.reverse();
}

export default getPalette;
