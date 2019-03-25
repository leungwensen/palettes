import 'antd/dist/antd.css';
import './css/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Button from 'antd/es/button';
import Divider from 'antd/es/divider';
import Drawer from 'antd/es/drawer';
import Icon from 'antd/es/icon';
import Layout from 'antd/es/layout';
import List from 'antd/es/list';
import Menu from 'antd/es/menu';
import {
  SketchPicker as Picker,
} from 'react-color';
import ColorBlock from './components/color-block';
import DistanceMatrix from './components/distance-matrix';
import GradientPaletteBy1 from './components/gradient-palette-by1';
import GradientPaletteByMany from './components/gradient-palette-by-many';
import PresetPalettes from './components/preset-palettes';
import VisInCharts from './components/vis-in-charts';
import VisInColorSpace from './components/vis-in-color-space';
import palettes from './palettes';

const {
  Content, Footer, Sider,
} = Layout;

// const DEFAULT_PALETTE = palettes.Tableau.Tableau_10;
const DEFAULT_PALETTE = palettes.AntD3.regular.All_12;

class App extends React.Component {
  constructor(props) {
    super(props);

    const color = localStorage.getItem('currentColor') || DEFAULT_PALETTE[0];
    const cachedPalette = localStorage.getItem('currentPalette');
    const palette = cachedPalette ? JSON.parse(cachedPalette) : DEFAULT_PALETTE.concat([]);
    const tab = localStorage.getItem('currentTab') || 'VisInColorSpace';

    this.state = {
      currentPalette: palette,
      currentColor: color,
      currentTab: tab,
      showPresetPalettes: false,
      windowSize: window.innerWidth,
    };
  }

  addToPalette = () => {
    const { currentColor, currentPalette } = this.state;
    if (currentPalette.indexOf(currentColor) === -1) {
      currentPalette.push(currentColor)
      this.setState({
        currentPalette,
      });
    }
  }

  syncCache = () => {
    requestAnimationFrame(() => {
      localStorage.setItem('currentColor', this.state.currentColor);
      localStorage.setItem('currentPalette', JSON.stringify(this.state.currentPalette));
      localStorage.setItem('currentTab', this.state.currentTab);
    });
  }

  componentDidMount() {
    this.syncCache();
  }
  componentDidUpdate() {
    this.syncCache();
  }

  render() {
    window.onresize = () => {
      this.setState({
        sizeKey: window.innerWidth,
      });
    }
    const {
      currentColor,
      currentPalette,
      currentTab,
      showPresetPalettes,
      windowSize,
    } = this.state;
    return (
      <Layout key={windowSize}>
        {/* sider */}
        <Sider width={300}
          style={{
            overflow: 'auto', height: '100vh', position: 'fixed', left: 0, background: '#fff',
            boxShadow: '2px 0px 2px 1px rgba(0, 0, 0, .1)'
          }}>
          <div
            style={{ padding: '8px' }}>
            <Button type="primary" onClick={() => {
              this.setState({
                showPresetPalettes: true,
              });
            }}>
              preset palettes
              <Icon type="right" />
            </Button>
            <div className="color-picker-container">
              <Picker width={250} color={currentColor} presetColors={[]}
                onChange={(color) => {
                  this.setState({
                    currentColor: color.hex
                  });
                }}/>
              <p>
                <Button block onClick={this.addToPalette}>
                  add to palette <Icon type="plus"></Icon>
                </Button>
              </p>
            </div>
            <Divider/>
            {
              currentPalette.map((color, index) => (
                <ColorBlock
                  selected={color === currentColor}
                  color={color}
                  index={index}
                  showColor={true}
                  showDeleteIcon={true}
                  showIndex={true}
                  onDelete={(item) => {
                     _.remove(currentPalette, (c) => {
                      return c === item;
                    });
                    this.setState({
                      currentPalette,
                    });
                  }}
                  onSelected={(c) => {
                    this.setState({
                      currentColor: c,
                    });
                  }}/>
              ))
            }
          </div>
        </Sider>
        {/* main content */}
        <Layout style={{ marginLeft: 300 }}>
          <Menu
            onClick={(e) => {
              this.setState({
                currentTab: e.key,
              });
            }}
            selectedKeys={[currentTab]}
            mode="horizontal">
            <Menu.Item key="VisInColorSpace"> Vis in Color Space </Menu.Item>
            <Menu.Item key="DistanceMatrix"> Distance Matrix </Menu.Item>
            <Menu.Item key="GradientPaletteBy1"> Gradient Palette by 1 </Menu.Item>
            <Menu.Item key="GradientPaletteByMany"> Gradient Palette by Many </Menu.Item>
            <Menu.Item key="PaletteByImage"> Palette by Image </Menu.Item>
            <Menu.Item key="PaletteByColorSet"> Palette by Color Set </Menu.Item>
            <Menu.Item key="VisInCharts" disabled> Vis in Charts </Menu.Item>
          </Menu>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div
              style={{ padding: 24, background: '#fff', textAlign: 'center' }}
              key={this.state.currentTab}>
              {
                currentTab === 'VisInColorSpace' && (
                  <VisInColorSpace colors={currentPalette}/>
                )
              }
              {
                currentTab === 'DistanceMatrix' && (
                  <DistanceMatrix colors={currentPalette}/>
                )
              }
              {
                currentTab === 'GradientPaletteBy1' && (
                  <GradientPaletteBy1 color={currentColor} colors={currentPalette}
                    onPaletteSelect={(p) => {
                      this.setState({
                        currentPalette: p,
                      });
                    }}/>
                )
              }
              {
                currentTab === 'GradientPaletteByMany' && (
                  <GradientPaletteByMany color={currentColor} colors={currentPalette}
                    setPalette={(p) => {
                      this.setState({
                        currentPalette: p,
                      });
                    }}/>
                )
              }
              {
                currentTab === 'VisInCharts' && (
                  <VisInCharts colors={currentPalette}/>
                )
              }
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            <p> Palettes, View & Make </p>
            <p> https://github.com/leungwensen/palettes </p>
            <p> leungwensen@gmail.com </p>
          </Footer>
        </Layout>
        {/* Drawer for preset palettes */}
        <Drawer title="Preset Palettes" placement="left" closable={true} width={480}
          visible={showPresetPalettes}
          onClose={() => {
            this.setState({ showPresetPalettes: false });
          }}>
          <PresetPalettes
            onSelect={(palette) => {
              this.setState({
                currentPalette: palette.colors.concat(),
                showPresetPalettes: false,
              });
            }}/>
        </Drawer>
      </Layout>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
