import React from 'react';
import _ from 'lodash';
import chroma from 'chroma-js';
import {
  Form,
  Icon,
  Radio,
  Slider,
} from 'antd'
import getAntD3Palette from '../util/antd3-palette';

function getPaletteByColor(color, mode, count) {
  const white = chroma('white');
  const origin = chroma(color);

  if (mode === 'lab') {
    const range = [
      origin.darken(1),
      origin,
      origin.brighten(1),
      white,
    ];
    return chroma.scale(range)
      // .correctLightness()
      .mode(mode)
      .cache(false)
      .colors(count);
  }
  if (mode === 'antd3') {
    return getAntD3Palette(color);
  }
}

const COLOR_SPACES = [
  'lab',
  'antd3',
];

class GradientPaletteBy1 extends React.Component {
  state = {
    mode: 'lab',
    colorsCount: 10,
  }

  render() {
    const { color, colors } = this.props;
    const onPaletteSelect = this.props.onPaletteSelect || function() {};
    let { mode, currentComponent, colorsCount } = this.state;
    if (mode === 'antd3') {
      colorsCount = 10;
    }
    const components = mode.split('');
    const paletteByOne = getPaletteByColor(color, mode, colorsCount);
    const palettes = [];
    colors.map(c => {
      palettes.push(getPaletteByColor(c, mode, colorsCount));
    });
    return <div>
      <Form layout="inline">
        <Form.Item label="Mode">
          <Radio.Group defaultValue={mode} onChange={(e) => {
            const currentMode = e.target.value;
            this.setState({
              mode: currentMode,
              currentComponent: currentMode.split('')[0], 
            })
          }}>
            {
              COLOR_SPACES.map((cs, i) => <Radio.Button key={i} value={cs}>{_.toUpper(cs)}</Radio.Button>)
            }
          </Radio.Group>
        </Form.Item>
        {
          mode === 'antd3' ? '' : <Form.Item label="Count">
            <Slider min={2} max={40} value={colorsCount} style={{ width: 120 }}
              onChange={(value) => {
                this.setState({ colorsCount: value })
              }}/>
          </Form.Item>
        }
      </Form>
      <div className="ant-table ant-table-small" style={{ marginTop: 24 }}>
        <div className="ant-table-content">
          <div className="ant-table-body" style={{ margin: 0 }}>
            <table style={{ fontFamily: 'Monospace' }}>
              <tbody className="ant-table-tbody">
                <tr>
                  <td key={`0-${color}`} style={{ background: color, border: '2px solid white' }}>{colors.length > 10? '##' : '#'} {color}</td>
                  <td key="0-0" style={{ border: '2px solid white' }}>
                    <Icon type="plus-circle" theme="twoTone" twoToneColor="#f00" onClick={() => {
                      onPaletteSelect(paletteByOne);
                    }}/>
                  </td>
                  {paletteByOne.map((c, i) => <td key={`${i}-${c}`} style={{ background: c, border: '2px solid white' }}>
                    &nbsp;
                  </td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="ant-table ant-table-small" style={{ marginTop: 24 }}>
        <div className="ant-table-content">
          <div className="ant-table-body" style={{ margin: 0 }}>
            <table style={{ fontFamily: 'Monospace' }}>
              <tbody className="ant-table-tbody">
                {
                  palettes.map((p, i) => <tr>
                    <td key={`0-${colors[i]}`} style={{ background: colors[i], border: '2px solid white' }}>{i} {colors[i]}</td>
                    <td key={`${i}-0`} style={{ border: '2px solid white' }}>
                      <Icon type="plus-circle" theme="twoTone" twoToneColor="#f00" onClick={() => {
                        onPaletteSelect(p);
                      }}/>
                    </td>
                    {p.map((c, i) => <td key={`${i}-${c}`} style={{ background: c, border: '2px solid white' }}>
                      &nbsp;
                    </td>)}
                  </tr>)
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  }
}

export default GradientPaletteBy1;
