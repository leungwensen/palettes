import React from 'react';
import _ from 'lodash';
import chroma from 'chroma-js';
import {
  Form,
  Icon,
  Radio,
  Slider,
} from 'antd'
import palettes from '../palettes';
import getPaletteByColorRange from '../util/palette-by-range';

const MODES = [
  'rgb',
  'lrgb',
  'lab',
  'hsl',
  'hcl',
  'lch',
];

class GradientPaletteBy2 extends React.Component {
  state = {
    start: palettes.ColorBrewer2.sequential.Blues_9[0],
    end: palettes.ColorBrewer2.sequential.Blues_9[8],
  }

  render() {
    return <div></div>
  }
}

export default GradientPaletteBy2;
