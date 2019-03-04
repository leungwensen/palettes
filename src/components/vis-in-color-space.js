import _ from 'lodash';
import chroma from 'chroma-js';
import Plotly from 'plotly.js';
import React from 'react';
import GridLayout from 'react-grid-layout';
import {
  Form,
  Radio,
  Slider,
} from 'antd'

const COLOR_SPACES = [
  'lab',
  'rgb',
  'hsl',
  'hcl',
];
const RANGE = {
  r: [0, 270],
  g: [0, 270],
  b: [0, 270],
  h: [0, 370],
  c: [0, 110],
  l: [0, 110],
  s: [0, 110],
  'a*': [-90, 100],
  'b*': [-110, 100],
};
const TWO_D_PLOT_LAYOUT = {
  margin: {
    l: 40,
    r: 30,
    t: 10,
    b: 24,
  },
  height: 320,
};

function generateTwoModes(mode) {
  const letters = mode.split('');
  const map = {};
  for (let i = 0; i < letters.length; i += 1) {
    for (let j = 0; j < letters.length; j += 1) {
      const a = letters[i];
      const b = letters[j];
      if (a !== b) {
        const key = `${a}${b}`;
        if (!map[key]) {
          map[key] = true;
        }
      }
    }
  }
  return _.keys(map).sort();
}

function draw3dScatter(id, palette, colorSpace, size) {
  const x = [];
  const y = [];
  const z = [];
  _.each(palette, color => {
    const components = chroma(color)[colorSpace]();
    x.push(components[0]);
    y.push(components[1]);
    z.push(components[2]);
  });
  const trace = {
    x, y, z,
    mode: 'markers',
    type: 'scatter3d',
    name: 'Colors',
    marker: {
      size,
      color: palette,
      opacity: 1,
      line: {
        color: 'black',
        width: 1,
        opacity: 1,
      },
    }
  };
  const data = [trace];
  const layout = {
    scene: {
      camera: {
        eye: colorSpace === 'lab' ? { x: 0.5, y: 0.001, z: -2.5 } : { x: 0.001, y: -2, z: 1 },
        center: { x: 0, y: 0, z: 0 }
      }
    },
    height: 460,
    margin: {
      l: 0,
      r: 0,
      t: 0,
      b: 0,
      pad: 0,
    },
  };
  let [d1, d2, d3] = colorSpace.split('');
  if (colorSpace === 'lab') {
    d2 = `${d2}*`;
    d3 = `${d3}*`;
  }
  layout.scene.xaxis = { title: _.toUpper(d1), range: RANGE[d1] };
  layout.scene.yaxis = { title: _.toUpper(d2), range: RANGE[d2] };
  layout.scene.zaxis = { title: _.toUpper(d3), range: RANGE[d3] };
  Plotly.purge(id);
  Plotly.newPlot(id, data, layout, {
    displayModeBar: false
  });
}

function draw2dPlot(id, palette, mode, xy) {
  let [d1, d2] = xy.split('');
  const x = [];
  const y = [];
  _.each(palette, color => {
    const components = chroma(color)[mode]();
    x.push(components[mode.indexOf(d1)]);
    y.push(components[mode.indexOf(d2)]);
  });
  const trace = {
    x, y,
    mode: 'lines+markers',
    type: 'scatter',
    marker: {
      size: 24,
      color: palette,
      opacity: 1,
      line: {
        color: 'black',
        width: 1,
        opacity: 1,
      },
    },
    line: {
      color: 'rgba(0, 0, 0, 0.1)',
      size: 1,
    },
  };
  if (mode === 'lab') {
    if (d1 === 'a' || d1 === 'b') d1 = `${d1}*`;
    if (d2 === 'a' || d2 === 'b') d2 = `${d2}*`;
  }
  const layout = {
    xaxis: {
      title: _.toUpper(d1),
      range: RANGE[d1]
    },
    yaxis: {
      title: _.toUpper(d2),
      range: RANGE[d2]
    },
    ...TWO_D_PLOT_LAYOUT
  }
  Plotly.purge(id);
  Plotly.newPlot(id, [trace], layout, {
    displayModeBar: false
  });
}
function draw1dPlot(id, palette, mode, d2) {
  const x = [];
  const y = [];
  _.each(palette, (color, i) => {
    const components = chroma(color)[mode]();
    x.push(`${i}`);
    y.push(components[mode.indexOf(d2)]);
  });
  const trace = {
    x, y,
    mode: 'lines+markers',
    type: 'scatter',
    marker: {
      size: 24,
      color: palette,
      opacity: 1,
      line: {
        color: 'black',
        width: 1,
        opacity: 1,
      },
    },
    line: {
      color: 'rgba(0, 0, 0, 0.1)',
      size: 1,
    },
  };
  if (mode === 'lab') {
    if (d2 === 'a' || d2 === 'b') d2 = `${d2}*`;
  }
  const layout = {
    xaxis: {
      title: 'index',
    },
    yaxis: {
      title: _.toUpper(d2),
      range: RANGE[d2]
    },
    ...TWO_D_PLOT_LAYOUT
  }
  Plotly.purge(id);
  Plotly.newPlot(id, [trace], layout, {
    displayModeBar: false
  });
}

class VisInColorSpace extends React.Component {
  state = {
    mode: 'lab',
    threeSize: 8,
    twoModes: generateTwoModes('lab'),
    twoMode: 'ab',
    oneModes: 'lab'.split(''),
    oneMode: 'l',
  }

  drawPlots() {
    const { colors } = this.props;
    const { mode, threeSize, twoMode, oneMode } = this.state;
    draw3dScatter('3d-scatter-plot', colors, mode, threeSize);
    draw2dPlot('2d-plot', colors, mode, twoMode);
    draw1dPlot('1d-plot', colors, mode, oneMode);
  }

  componentDidUpdate() {
    this.drawPlots();
  }

  componentDidMount() {
    this.drawPlots();
  }

  render() {
    const { twoModes, oneModes, mode, threeSize } = this.state;
    return (
      <GridLayout
        className="layout"
        layout={[
          { i: '3d', x: 0, y: 0, w: 12, h: 4, static: true },
          { i: '2d', x: 0, y: 4, w: 6, h: 3, static: true },
          { i: '1d', x: 6, y: 4, w: 6, h: 3, static: true }
        ]}
        cols={12} rowHeight={120} width={window.innerWidth - 380}
        isResizable={false}
        key={mode}>
        <div key="3d" style={{ border: '1px solid #eee' }}>
          <Form layout="inline">
            <Form.Item label="Mode">
              <Radio.Group defaultValue={mode} onChange={(e) => {
                const cs = e.target.value;
                const twoModes = generateTwoModes(cs);
                const oneModes = cs.split('');
                this.setState({
                  mode: cs,
                  twoModes,
                  twoMode: twoModes[0],
                  oneModes,
                  oneMode: oneModes[0]
                });
              }}>
                {
                  COLOR_SPACES.map((cs, i) => <Radio.Button key={i} value={cs}>{_.toUpper(cs)}</Radio.Button>)
                }
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Scatter Size">
              <Slider min={5} max={30} defaultValue={8} style={{ width: 120 }}
                onChange={(value) => {
                  Plotly.restyle('3d-scatter-plot', {
                    'marker.size': value,
                  });
                }} />
            </Form.Item>
          </Form>
          <div className="vis-plot" id="3d-scatter-plot"></div>
        </div>
        <div key="2d" style={{ border: '1px solid #eee' }}>
          <Form layout="inline" key={mode}>
            <Form.Item label="Mode">
              <Radio.Group defaultValue={twoModes[0]} onChange={(e) => {
                this.setState({
                  twoMode: e.target.value,
                });
              }}>
                {
                  twoModes.map((mode, i) => <Radio.Button key={i} value={mode}>{_.toUpper(mode)}</Radio.Button>)
                }
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Scatter Size">
              <Slider min={5} max={50} defaultValue={12} style={{ width: 120 }}
                onChange={(value) => {
                  Plotly.restyle('2d-plot', {
                    'marker.size': value,
                  });
                }} />
            </Form.Item>
          </Form>
          <div className="vis-plot" id="2d-plot"></div>
        </div>
        <div key="1d" style={{ border: '1px solid #eee' }}>
          <Form layout="inline" key={mode}>
            <Form.Item label="Mode">
              <Radio.Group defaultValue={oneModes[0]} onChange={(e) => {
                this.setState({
                  oneMode: e.target.value,
                });
              }}>
                {
                  oneModes.map((mode, i) => <Radio.Button key={i} value={mode}>{_.toUpper(mode)}</Radio.Button>)
                }
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Scatter Size">
              <Slider min={5} max={50} defaultValue={12} style={{ width: 120 }}
                onChange={(value) => {
                  Plotly.restyle('1d-plot', {
                    'marker.size': value,
                  });
                }} />
            </Form.Item>
          </Form>
          <div className="vis-plot" id="1d-plot"></div>
        </div>
      </GridLayout>
    )
  }
}

export default VisInColorSpace;
