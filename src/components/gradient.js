import React from 'react';
import chroma from 'chroma-js';
import {
  Icon,
  message,
} from 'antd';

function noop() {
}

export default class Gradient extends React.Component {
  state = {
    selected: null,
  }

  render() {
    const {
      colors = ['white', 'black'],
      onSelect = noop,
    } = this.props;
    const {
      selected,
    } = this.state;

    const scale = chroma.scale(colors).domain([0, 100]);
    const ticks = [];
    for (let i = 0; i < 100; i ++) {
      ticks.push(i);
    }

    return (
      <div className="gradient">
        {
          ticks.map(tick => {
            const color = scale(tick).hex();
            return (<span
                class={`grad-step ${tick === selected ? 'selected' : ''}`}
                style={{
                  backgroundColor: color,
                }}
                onClick={() => {
                  console.log('hahah');
                  onSelect(color);
                  this.setState({
                    selected: tick,
                  })
                }}>
              </span>);
          })
        }
      </div>
    );
  }
}
