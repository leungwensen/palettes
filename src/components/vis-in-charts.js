import GridLayout from 'react-grid-layout';
import Plotly from 'plotly.js';
import React from 'react';
import _ from 'lodash';
import chroma from 'chroma-js';
import {
  Form,
  Radio,
  Slider,
} from 'antd';
import { COLOR_RANGE } from '../constants';

const RANGE = [0, 100];

const PLOT_LAYOUT = {
  margin: {
    l: 40,
    r: 30,
    t: 20,
    b: 24,
  },
  height: 310,
  xaxis: {
    title: 'x',
    range: RANGE,
  },
  yaxis: {
    title: 'y',
    range: RANGE,
  },
};

function randomNumberArray(count, range = RANGE) {
  const arr = [];
  console.log(range);
  for (let i = 0; i < count; i ++) {
    arr.push(Math.random() * (range[1] - range[0]) + range[0]);
  }
  return arr;
}
function randomStringArray(count) {
  const arr = [];
  for (let i = 0; i < count; i ++) {
    arr.push(`a${i}`);
  }
  return arr;
}
function repeat(arr, len) {
  let result = [];
  while (result.length < len) {
    result = result.concat(arr);
  }
  return result;
}

function drawScatter(id, count, colors) {
  const trace = {
    x: randomNumberArray(count),
    y: randomNumberArray(count),
    mode: 'markers',
    type: 'scatter',
    marker: {
      size: randomNumberArray(count, [3, 20]),
      color: repeat(colors, count),
      opacity: 1,
    },
  };
  const layout = {
    ...PLOT_LAYOUT
  };
  Plotly.purge(id);
  Plotly.newPlot(id, [trace], layout, {
    displayModeBar: false
  });
}
function drawLine(id, count, colors) {
  const actualColors = repeat(colors, count);
  const traces = [];
  const layout = {
    ...PLOT_LAYOUT,
    xaxis: {
      title: 'x',
    },
  };
  for (let i = 0; i < count; i ++) {
    traces.push({
      x: randomStringArray(10),
      y: randomNumberArray(10),
      mode: 'lines',
      type: 'lines',
      line: {
        color: actualColors[i],
      },
    })
  }
  Plotly.purge(id);
  Plotly.newPlot(id, traces, layout, {
    displayModeBar: false
  });
}
function drawBar(id, count, colors) {
  const trace = {
    x: randomStringArray(count),
    y: randomNumberArray(count),
    type: 'bar',
    marker: {
      color: repeat(colors, count),
    },
  };
  const layout = {
    ...PLOT_LAYOUT,
    xaxis: {
      title: 'x',
    },
  };
  Plotly.purge(id);
  Plotly.newPlot(id, [trace], layout, {
    displayModeBar: false
  });
}
function drawPie(id, count, colors) {
  const actualColors = repeat(colors, count);
  const data = [{
    values: randomNumberArray(count),
    labels: randomStringArray(count),
    type: 'pie',
    marker: {
      colors: actualColors,
    },
  }];
  const layout = {
    ...PLOT_LAYOUT
  };
  Plotly.purge(id);
  Plotly.newPlot(id, data, layout, {
    displayModeBar: false
  });
}

class VisInCharts extends React.Component {
  constructor(props) {
    super(props);

    const vicColorsCount = localStorage.getItem('vicColorsCount') ?
      parseInt(localStorage.getItem('vicColorsCount'), 10) : 6;

    this.state = {
      minCount: 3,
      count: vicColorsCount,
      maxCount: 30,
    };
  }

  syncCache = () => {
    requestAnimationFrame(() => {
      localStorage.setItem('vicColorsCount', this.state.count);
    });
  }

  drawPlots() {
    const { colors } = this.props;
    const { count } = this.state;
    console.log(colors, count);
    drawScatter('vis-in-scatter', count, colors);
    drawLine('vis-in-line', count, colors);
    drawBar('vis-in-bar', count, colors);
    drawPie('vis-in-pie', count, colors);
  }

  componentDidMount() {
    this.syncCache();
    this.drawPlots();
  }
  componentDidUpdate() {
    this.syncCache();
    this.drawPlots();
  }

  render() {
    const {
      count,
      minCount,
      maxCount,
    } = this.state;
    return <div>
      <Form layout="inline">
        <Form.Item label="items Count">
          <Slider min={minCount} max={maxCount} value={count} style={{ width: 120 }}
            onChange={(value) => {
              this.setState({
                count: value,
              })
            }}/>
        </Form.Item>
      </Form>
      <GridLayout
        className="vis-in-charts"
        layout={[
          { i: 'scatter', x: 0, y: 0, w: 6, h: 3, static: true },
          { i: 'line', x: 6, y: 0, w: 6, h: 3, static: true },
          { i: 'bar', x: 0, y: 3, w: 6, h: 3, static: true },
          { i: 'pie', x: 6, y: 3, w: 6, h: 3, static: true },
        ]}
        cols={12} rowHeight={100} width={window.innerWidth - 380}
        // isResizable={false}
        key={count} >
        <div key="scatter" style={{ border: '1px solid #eee' }}>
          <div className="vis-plot" id="vis-in-scatter"></div>
        </div>
        <div key="line" style={{ border: '1px solid #eee' }}>
          <div className="vis-plot" id="vis-in-line"></div>
        </div>
        <div key="bar" style={{ border: '1px solid #eee' }}>
          <div className="vis-plot" id="vis-in-bar"></div>
        </div>
        <div key="pie" style={{ border: '1px solid #eee' }}>
          <div className="vis-plot" id="vis-in-pie"></div>
        </div>
      </GridLayout>

    </div>
  }
}

export default VisInCharts;
