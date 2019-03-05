import React from 'react';
import _ from 'lodash';
import chroma from 'chroma-js';
import {
  Button,
  Divider,
  Form,
  Icon,
  Radio,
  Slider,
} from 'antd'
import {
  SketchPicker as Picker,
} from 'react-color';
import paletteByColorRange from '../util/palette-by-range';
import randomColor from '../util/random-color';

const MODES = [
  'rgb',
  'lrgb',
  'lab',
  'hsl',
  'hcl',
];

const RANGE = [];
const MAX_PALETTE_SIZE = 40;
for (let i = 0; i < MAX_PALETTE_SIZE; i += 1) {
  RANGE.push(randomColor());
}

class GradientPaletteBy2 extends React.Component {
  state = {
    mode: MODES[0],
    minCount: 2,
    maxCount: 5,
    count: 2,
    minPaletteSize: 2,
    maxPaletteSize: MAX_PALETTE_SIZE,
    paletteSize: 5,
    range: RANGE,
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
                  {palette.map((c, i) => <td key={`${i}-${c}`} style={{ background: c, height: 48, border: '2px solid white' }}>
                    &nbsp;
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

export default GradientPaletteBy2;
