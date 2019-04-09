import React from 'react';
import _ from 'lodash';
import chroma from 'chroma-js';
import {
  Button,
  Divider,
  Form,
  Icon,
  Radio,
  Slider
} from 'antd';
import {
  SketchPicker as Picker,
} from 'react-color';
import randomColor from '../util/random-color';
import ColorBlock from './color-block';

function paletteByColorRange(range, mode, count, bezier) {
  return chroma.scale(range)
    // .correctLightness()
    .mode(mode)
    .cache(false)
    .colors(count);
}

const MODES = [
  'rgb',
  'lrgb',
  'lab',
  'hsl',
  'hcl',
  'hsv',
];

const RANGE = [];
const MAX_PALETTE_SIZE = 40;
for (let i = 0; i < MAX_PALETTE_SIZE; i += 1) {
  RANGE.push(randomColor());
}

class GradientPaletteByMany extends React.Component {
  constructor(props) {
    super(props);

    const gpmMode = localStorage.getItem('gpmMode ') || MODES[0];
    const gpmColorsCount = localStorage.getItem('gpmColorsCount') ?
      parseInt(localStorage.getItem('gpmColorsCount'), 10) : 2;
    const gpmPaletteSize = localStorage.getItem('gpmPaletteSize') ?
      parseInt(localStorage.getItem('gpmPaletteSize'), 10) : 10;
    const range = localStorage.getItem('gpmRange') ?
      JSON.parse(localStorage.getItem('gpmRange')) : RANGE;

    this.state = {
      mode: gpmMode,
      minCount: 2,
      maxCount: 5,
      count: gpmColorsCount,
      minPaletteSize: 2,
      maxPaletteSize: MAX_PALETTE_SIZE,
      paletteSize: gpmPaletteSize,
      range,
    };
  }

  syncCache = () => {
    requestAnimationFrame(() => {
      localStorage.setItem('gpmMode', this.state.mode);
      localStorage.setItem('gpmColorsCount', this.state.count);
      localStorage.setItem('gpmPaletteSize', this.state.paletteSize);
      localStorage.setItem('gpmRange', JSON.stringify(this.state.range));
    });
  }

  componentDidMount() {
    this.syncCache();
  }
  componentDidUpdate() {
    this.syncCache();
  }

  render() {
    let { colors, setPalette } = this.props;
    setPalette = setPalette || function() {};
    const {
      count,
      maxCount,
      minCount,
      mode,
      minPaletteSize,
      maxPaletteSize,
      paletteSize,
      range,
    } = this.state;
    const palette = paletteByColorRange(range.slice(0, count), mode, paletteSize);
    return <div>
      <Form layout="inline">
        <Form.Item label="Colors Count">
          <Slider min={minCount} max={maxCount} value={count} style={{ width: 120 }}
            onChange={(value) => {
              if (paletteSize < value) {
                paletteSize = value + 1;
              }
              this.setState({
                count: value,
                minPaletteSize: value,
                paletteSize,
                range,
              })
            }}/>
        </Form.Item>
      </Form>
      <div className="ant-table ant-table-small" style={{ marginTop: 24 }}>
        <div className="ant-table-content">
          <div className="ant-table-body" style={{ margin: 0 }}>
            <table style={{ fontFamily: 'Monospace' }}>
              <tbody className="ant-table-tbody">
                <tr>
                  {
                    range.slice(0, count).map((val, index) => <td>
                      <Picker color={range[index]} presetColors={colors.concat(['#FFFFFF', '#000000'])}
                        onChange={(color) => {
                          range[index] = color.hex;
                          this.setState({
                            range,
                          });
                        }}/>
                    </td>)
                  }
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Divider></Divider>
      <Form layout="inline">
        <Form.Item label="Mode">
          <Radio.Group defaultValue={mode} onChange={(e) => {
            const currentMode = e.target.value;
            this.setState({
              mode: currentMode,
            })
          }}>
            {
              MODES.map((cs, i) => <Radio.Button key={i} value={cs}>{_.toUpper(cs)}</Radio.Button>)
            }
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Palette Size">
          <Slider min={minPaletteSize} max={maxPaletteSize} value={paletteSize} style={{ width: 120 }}
            onChange={(value) => {
              this.setState({
                paletteSize: value,
              })
            }}/>
        </Form.Item>
      </Form>
      <div className="ant-table ant-table-small" style={{ marginTop: 24 }}>
        <div className="ant-table-content">
          <div className="ant-table-body" style={{ margin: 0 }}>
            <table style={{ fontFamily: 'Monospace' }}>
              <tbody className="ant-table-tbody">
                <tr>
                  {palette.map((c, i) => <td key={`${i}-${c}`}>
                    <ColorBlock color={c}/>
                  </td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Button block size="large" type="danger"
        onClick={() => {
          setPalette(palette);
        }}>
        Set as Current Palette
      </Button>
    </div>
  }
}

export default GradientPaletteByMany;
