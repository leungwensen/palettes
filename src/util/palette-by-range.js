import chroma from 'chroma-js';

function getPaletteByColorRange(range, mode, count, bezier) {
  if (bezier) {
    return chroma.bezier(range)
      .scale()
      .mode(mode)
      .cache(false)
      .colors(count);
  }
  return chroma.scale(range)
    // .correctLightness()
    .mode(mode)
    .cache(false)
    .colors(count);
}

export default getPaletteByColorRange;
