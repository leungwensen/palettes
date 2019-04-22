import React from 'react';
import _ from 'lodash';
import chroma from 'chroma-js';
import {
  Form,
  Radio,
  Slider,
} from 'antd';
import ColorBlock from './color-block';

function generateDistanceMatrix(colors, mode = 'lab', threshold = 20) {
  const matrix = [];
  const row0 = [{
    header: false,
    content: null,
    background: 'white',
  }]; // cell 0x0 of row 0
  matrix.push(row0);
  for (let i = 0; i < colors.length; i += 1) {
    row0.push({
      header: true,
      content: i,
      background: colors[i],
    });
  } // fulfill row0
  for (let i = 0; i < colors.length; i += 1) {
    const color1 = colors[i];
    const rowi = [{
      header: true,
      content: colors[i],
      background: colors[i],
    }];
    for (let j = 0; j < colors.length; j += 1) {
      const color2 = colors[j];
      let distance = 0;
      if (color1 !== color2) {
        distance = chroma.distance(color1, color2, mode);
      }
      rowi.push({
        header: false,
        content: distance ? Math.round(distance) : '',
        background: distance && (distance < threshold) ? 'red' : 'white',
      });
    }
    matrix.push(rowi);
  }
  return matrix;
}

const COLOR_SPACES = [
  'lab',
  'rgb',
  'hsl',
  'hcl',
];

class DistanceMatrix extends React.Component {
  state = {
    mode: 'lab',
    threshold: 20
  }

  render() {
    const { colors } = this.props;
    const matrix = generateDistanceMatrix(colors, this.state.mode, this.state.threshold);
    return <div>
      <Form layout="inline">
        <Form.Item label="Mode">
          <Radio.Group defaultValue="lab" onChange={(e) => {
            this.setState({
              mode: e.target.value
            })
          }}>
            {
              COLOR_SPACES.map((cs, i) => <Radio.Button key={i} value={cs}>{_.toUpper(cs)}</Radio.Button>)
            }
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Threshold">
          <Slider min={1} max={255} value={this.state.threshold} style={{ width: 120 }}
            onChange={(value) => {
              this.setState({ threshold: value })
            }}/>
        </Form.Item>
      </Form>
      <div className="ant-table ant-table-small" style={{ marginTop: 24 }}>
        <div className="ant-table-content">
          <div className="ant-table-body" style={{ margin: 0 }}>
            <table>
              <tbody className="ant-table-tbody">
                {
                  matrix.map((row, i) => (
                    <tr key={i}>
                    {
                      row.map((cell, j) => (
                        cell.header ?
                        <td style={{ textAlign: 'center' }}>
                          <ColorBlock
                            index={j - 1} color={cell.background}
                            showColor={i !== 0} showIndex={ i === 0 } />
                        </td> :
                        <td key={j}
                          style={{ background: cell.background, textAlign: 'right', paddingRight: 1 }}>
                          {cell.content}
                        </td>
                      ))
                    }
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  }
}

export default DistanceMatrix;
