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
const MAX_COUNT = 12;
const MIN_COUNT = 20;

const PLOT_LAYOUT = {
  margin: {
    l: 40,
    r: 30,
    t: 20,
    b: 30,
  },
  height: 310,
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
  count = count * 2;
  count = count < MIN_COUNT ? MIN_COUNT : count;
  const trace = {
    x: randomNumberArray(count),
    y: randomNumberArray(count),
    mode: 'markers',
    type: 'scatter',
    marker: {
      size: randomNumberArray(count, [3, 80]),
      color: repeat(colors, count),
      opacity: randomNumberArray(count, [0.5, 0.75]),
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
  count = Math.round(count / 2);
  count = count > MAX_COUNT ? MAX_COUNT : count;
  const actualColors = repeat(colors, count);
  const traces = [];
  const layout = {
    ...PLOT_LAYOUT,
    xaxis: {
      title: '',
    },
  };
  for (let i = 0; i < count; i ++) {
    traces.push({
      x: randomStringArray(20),
      y: randomNumberArray(20),
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
function drawPie(id, count, colors) {
  count = Math.round(count / 2);
  count = count > MAX_COUNT ? MAX_COUNT : count;
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
  };
  Plotly.purge(id);
  Plotly.newPlot(id, [trace], layout, {
    displayModeBar: false
  });
}
function drawHBar(id, count, colors) {
  count = count > MAX_COUNT ? MAX_COUNT : count;
  const trace = {
    x: randomNumberArray(count),
    y: randomStringArray(count),
    type: 'bar',
    orientation: 'h',
    marker: {
      color: repeat(colors, count),
    },
  };
  const layout = {
    ...PLOT_LAYOUT,
  };
  Plotly.purge(id);
  Plotly.newPlot(id, [trace], layout, {
    displayModeBar: false
  });
}
function drawSBar(id, count, colors) {
  count = count > MAX_COUNT ? MAX_COUNT : count;
  const barCount = 12;
  const actualColors = repeat(colors, count);
  const y = randomStringArray(barCount);
  const data = [];
  for (let i = 0; i < count; i ++) {
    data.push({
      x: randomNumberArray(barCount),
      y,
      type: 'bar',
      orientation: 'h',
      marker: {
        color: actualColors[i],
      },
    })
  }
  const layout = {
    ...PLOT_LAYOUT,
    barmode: 'stack',
  };
  Plotly.purge(id);
  Plotly.newPlot(id, data, layout, {
    displayModeBar: false
  });
}
function drawArea(id, count, colors) {
  count = count > MAX_COUNT ? MAX_COUNT : count;
  const steps = 12;
  const x = randomStringArray(steps);
  const actualColors = repeat(colors, count);
  const data = [];
  for (let i = 0; i < count; i ++) {
    data.push({
      x,
      y: randomNumberArray(steps),
      stackgroup: 'one',
      groupnorm: 'percent',
      marker: {
        color: actualColors[i],
      }
    });
  }
  const layout = {
    ...PLOT_LAYOUT,
  };
  Plotly.purge(id);
  Plotly.newPlot(id, data, layout, {
    displayModeBar: false
  });
}
function drawRadar(id, count, colors) {
  count = count > MAX_COUNT ? MAX_COUNT : count;
  const steps = 7;
  const theta = randomStringArray(steps);
  const actualColors = repeat(colors, count);
  const data = [];
  for (let i = 0; i < count; i ++) {
    data.push({
      type: 'scatterpolar',
      r: randomNumberArray(steps),
      theta,
      fill: 'toself',
      marker: {
        color: actualColors[i],
      }
    })
  }
  const layout = {
    ...PLOT_LAYOUT,
    polar: {
      radialaxis: {
        visible: true,
      },
    },
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
      minCount: 4,
      count: vicColorsCount,
      maxCount: 40,
      gridLayout: [
        { i: 'scatter', x: 0, y: 0, w: 6, h: 3, static: true },
        { i: 'line', x: 6, y: 0, w: 6, h: 3, static: true },
        { i: 'pie', x: 0, y: 3, w: 6, h: 3, static: true },
        { i: 'bar', x: 6, y: 3, w: 6, h: 3, static: true },
        { i: 'hbar', x: 0, y: 6, w: 6, h: 3, static: true },
        { i: 'sbar', x: 6, y: 6, w: 6, h: 3, static: true },
        { i: 'area', x: 0, y: 9, w: 6, h: 3, static: true },
        { i: 'radar', x: 6, y: 9, w: 6, h: 3, static: true },
      ],
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
    drawScatter('vis-in-scatter', count, colors);
    drawLine('vis-in-line', count, colors);
    drawPie('vis-in-pie', count, colors);
    drawBar('vis-in-bar', count, colors);
    drawHBar('vis-in-hbar', count, colors);
    drawSBar('vis-in-sbar', count, colors);
    drawArea('vis-in-area', count, colors);
    drawRadar('vis-in-radar', count, colors);
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
      gridLayout,
    } = this.state;

    const PLOT_STYLE = {
      border: '1px solid #eee'
    }

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
        layout={gridLayout}
        cols={12} rowHeight={100} width={window.innerWidth - 380}
        isResizable={false}
        key={count} >
        <div key="scatter" style={PLOT_STYLE}>
          <div className="vis-plot" id="vis-in-scatter"></div>
        </div>
        <div key="line" style={PLOT_STYLE}>
          <div className="vis-plot" id="vis-in-line"></div>
        </div>
        <div key="pie" style={PLOT_STYLE}>
          <div className="vis-plot" id="vis-in-pie"></div>
        </div>
        <div key="bar" style={PLOT_STYLE}>
          <div className="vis-plot" id="vis-in-bar"></div>
        </div>
        <div key="hbar" style={PLOT_STYLE}>
          <div className="vis-plot" id="vis-in-hbar"></div>
        </div>
        <div key="sbar" style={PLOT_STYLE}>
          <div className="vis-plot" id="vis-in-sbar"></div>
        </div>
        <div key="area" style={PLOT_STYLE}>
          <div className="vis-plot" id="vis-in-area"></div>
        </div>
        <div key="radar" style={PLOT_STYLE}>
          <div className="vis-plot" id="vis-in-radar"></div>
        </div>
      </GridLayout>

    </div>
  }

}

export default VisInCharts;
