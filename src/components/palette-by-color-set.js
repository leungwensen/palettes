import React from 'react';
import _ from 'lodash';
import chroma from 'chroma-js';
import {
  Button,
  Divider,
  Form,
  Slider,
} from 'antd';
import ColorBlock from './color-block';
import paletteGen from '../util/palette-gen';

class PaletteByColorSet extends React.Component {
  state = {
    mode: 'rgb', // rgb / hsl / hcl
    range: '',
    url: '',
    count: 5,
  }
}

export default PaletteByColorSet;
