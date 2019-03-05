import chroma from 'chroma-js';

function getPaletteByColorRange(range, mode, count) {
  return chroma.scale(range)
    // .correctLightness()
    .mode(mode)
    .cache(false)
    .colors(count);
}

export default getPaletteByColorRange;
