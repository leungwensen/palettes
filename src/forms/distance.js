
import 'antd/dist/antd.css';
import '../css/distance.less';
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import chroma from 'chroma-js';
import io from 'socket.io-client';
import {
  Button,
  // Carousel,
  Divider,
  Layout,
  List,
  Menu,
} from 'antd';
import {
  SketchPicker as Picker,
} from 'react-color';
import ColorBlock from '../components/color-block';
import Gradient from '../components/gradient';
import SiteFooter from '../components/site-footer';
import data from './distance.json';

const {
  Header, Footer, Content,
} = Layout;

const testRanges = {
  grey: ['#ffffff', '#000000'],
  blue: ['#ffffff', '#0000ff'],
  blueorange: ['#0000ff', '#ffffff', '#7F3B08'],
  orange: ['#ffffff', '#7F3B08'],
  green: ['#ffffff', '#024219'],
  viridis: ['#440154', '#21918C', '#FDE725'],
  plasma: ['#0D0887', '#CC4778', '#F0F921'],
  magma: ['#000004', '#B73779', '#FCFDBF'],
};

const riddles = {};
const rangeKeys = _.keys(testRanges);

_.each(rangeKeys, (key) => {
  riddles[key] = chroma.scale(testRanges[key]).domain([0, 100])(Math.round(Math.random() * 80 + 10)).hex();
});

const socket = io.connect();
socket.on('connect', function () {
  console.log('connect');
});

class App extends React.Component {
  state = {
    currentStep: 0,
    // currentStep: rangeKeys.length - 1,
    lastStep: rangeKeys.length - 1,
    finished: false,
    answers: {},
    currentSelected: null,
    currentKey: null,
    submitted: false,
    average: 0,
  }

  componentDidMount() {
    const id = 'histogram';
    const x = data.filter(item => item < 16);
    const trace = {
      x,
      type: 'histogram',
      histnorm: 'probability',
      marker: {
        line: {
          color:  "white", 
          width: 1,
        },
      },
    };
    Plotly.purge(id);
    Plotly.newPlot(id, [trace]);
  }

  render() {
    const {
      currentStep,
      lastStep,
      finished,
      answers,
      currentSelected,
      currentKey,
      submitted,
      average,
    } = this.state;

    return (
      <div className="distance-form">
        <Layout>
          <Header>
            <h1 style={{ color: 'white' }}>
              Color Distance Test
            </h1>
          </Header>
          <Content style={{ backgroundColor: 'white', textAlign: 'center', paddingBottom: 64 }}>
            <h2>测试直觉色差用，完成时间越短越好～</h2>
            {
              _.map(rangeKeys, (key, index) => {
                return <div style={{ padding: 45, display: currentStep === index ? 'block': 'none' }}>
                  <h3>{key}</h3>
                  <p style={{ marginBottom: 48 }}>
                    <span style={{ width: 40, display: 'inline-block', }}>
                      <ColorBlock color={riddles[key]}/>
                    </span>
                  </p>
                  <p>
                    <Gradient colors={testRanges[key]} onSelect={(color) => {
                      this.setState({
                        finished: true,
                        currentSelected: color,
                        currentKey: key,
                      })
                    }}/>
                  </p>
                </div>
              })
            }
            {
              !finished ? <p>click to select the same color</p> : ''
            }
            {
              finished && !submitted ? (currentStep !== lastStep ? <Button
                onClick={() => {
                  answers[currentKey] = currentSelected;
                  this.setState({
                    currentStep: currentStep + 1,
                    finished: false,
                    answers,
                  });
                }}
              >OK, Next</Button> : <Button
                onClick={() => {
                  answers[currentKey] = currentSelected;
                  const distanceByKey = {};
                  console.log(riddles, answers);
                  _.each(rangeKeys, (key) => {
                    distanceByKey[key] = chroma.distance(riddles[key], answers[key], 'lab');
                  });
                  const pairs = _.map(distanceByKey, (distance, key) => {
                    return [key, distance];
                  }).sort((a, b) => a[1] - b[1]);
                  pairs.pop();
                  pairs.shift();
                  const distance = _.sum(pairs.map(item => item[1])) / pairs.length;
                  const riddle = _.map(pairs, item => riddles[item[0]]).join('-');
                  const answer = _.map(pairs, item => answers[item[0]]).join('-');
                  socket.emit('answer.new', {
                    riddle,
                    answer,
                    distance,
                  });
                  this.setState({
                    submitted: true,
                    average: distance,
                  })
                }}
              >OK, Submit</Button>) : ''
            }
            {
              submitted && average ? <h3>average: {average}</h3> : ''
            }
          </Content>
          <div id="histogram"></div>
          <Footer style={{ textAlign: 'center' }}>
            <SiteFooter/>
          </Footer>
        </Layout>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
