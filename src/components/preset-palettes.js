import React from 'react';
import {
  each,
  isArray,
  map,
  some,
} from 'lodash';
import {
  Collapse
} from 'antd'
import palettes from '../palettes';

const { Panel } = Collapse;

const paletteList = [];

each(palettes, (palette, name) => {
  some(palette, (value, key) => {
    if (isArray(value)) {
      // palette is a palette
      paletteList.push({
        name,
        colors: palette
      });
      return true;
    } else {
      paletteList.push({
        name: `${name}.${key}`,
        colors: value
      });
    }
  });
});

class PresetPalettes extends React.Component {
  render() {
    const { onSelect } = this.props;
    return (
      <Collapse>
        {
          map(paletteList, (palette, index) => <Panel header={palette.name} index={index} key={index}>
            {map(palette.colors, (colors, name) => <div key={name}>
              <p style={{ marginBottom: 0 }}>{name}</p>
              <table
                className="preset-palette-colors"
                style={{ width: '100%', border: '2px solid rgba(0, 0, 0, 0)' }}
                onClick={() => {
                  onSelect({
                    name,
                    colors
                  });
                }}
              >
                <tbody>
                  <tr>
                    {map(colors, (color, i) => <td key={i} style={{ background: color }}>&nbsp;</td>)}
                  </tr>
                </tbody>
              </table>
            </div>)}
          </Panel>)
        }
      </Collapse>
    );
  }
}

export default PresetPalettes;
