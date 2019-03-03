import 'antd/dist/antd.css';
import './css/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import {
  Menu,
  Button,
  Divider,
  Drawer,
  Icon,
  Layout,
  List,
} from 'antd';
import {
  SketchPicker as Picker,
} from 'react-color';
import palettes from './palettes';
import PresetPalettes from './components/preset-palettes';
import DistanceMatrix from './components/distance-matrix';
import GradientPaletteBy1 from './components/gradient-palette-by1';
import GradientPaletteBy2 from './components/gradient-palette-by2';
import VisInCharts from './components/vis-in-charts';
import VisInColorSpace from './components/vis-in-color-space';

const {
  Content, Footer, Sider,
} = Layout;

class App extends React.Component {
  state = {
    showPresetPalettes: false,
    currentPalette: palettes.Tableau.Tableau_10.concat([]),
    currentColor: palettes.Tableau.Tableau_10[0],
    currentTab: 'VisInColorSpace',
    sizeKey: window.innerWidth,
  };

  addToPalette = () => {
    const { currentColor, currentPalette } = this.state;
    if (currentPalette.indexOf(currentColor) === -1) {
      currentPalette.push(currentColor)
      this.setState({
        currentPalette,
      });
    }
  }

  render() {
    window.onresize = () => {
      this.setState({
        sizeKey: window.innerWidth,
      });
    }
    return (
      <Layout key={this.state.sizeKey}>
        {/* sider */}
        <Sider width={300}
          style={{
            overflow: 'auto', height: '100vh', position: 'fixed', left: 0, background: '#fff',
            boxShadow: '2px 0px 2px 1px rgba(0, 0, 0, .1)'
          }}>
          <div
            style={{ padding: '8px' }}>
            <Button type="primary" onClick={() => {
              this.setState({ showPresetPalettes: true });
            }}>
              preset palettes
              <Icon type="right" />
            </Button>
            <div className="color-picker-container">
              <Picker width={260} color={this.state.currentColor} presetColors={[]}
                onChange={(color) => {
                  this.setState({
                    currentColor: color.hex
                  });
                }}/>
              <p><Button block onClick={this.addToPalette}>add to palette</Button></p>
            </div>
            <Divider/>
            <List size="small"
              dataSource={this.state.currentPalette}
              renderItem={(item, index) => (
                <List.Item className={item === this.state.currentColor ? 'selected' : ''}
                  style={{ background: item }}
                  onClick={() => {
                    this.setState({
                      currentColor: item
                    });
                  }}>
                  <div style={{ width: '100%' }}>
                    {index} {item}
                    <Icon type="delete" theme="twoTone" twoToneColor="#f00"
                      onClick={() => {
                        const { currentPalette } = this.state;
                        _.remove(currentPalette, (color) => {
                          return color === item;
                        });
                        this.setState({
                          currentPalette
                        });
                      }}/>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </Sider>
        {/* main content */}
        <Layout style={{ marginLeft: 300 }}>
          <Menu
            onClick={(e) => {
              this.setState({
                currentTab: e.key
              });
            }}
            selectedKeys={[this.state.currentTab]}
            mode="horizontal">
            <Menu.Item key="VisInColorSpace"> Vis in Color Space </Menu.Item>
            <Menu.Item key="DistanceMatrix"> Distance Matrix </Menu.Item>
            <Menu.Item key="GradientPaletteBy1"> Gradient Palette by 1 </Menu.Item>
            <Menu.Item key="GradientPaletteBy2" disabled> Gradient Palette by 2 </Menu.Item>
            <Menu.Item key="VisInCharts" disabled> Vis in Charts </Menu.Item>
          </Menu>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, background: '#fff', textAlign: 'center' }} key={this.state.currentTab}>
              {
                this.state.currentTab === 'VisInColorSpace' && (
                  <VisInColorSpace colors={this.state.currentPalette}/>
                )
              }
              {
                this.state.currentTab === 'DistanceMatrix' && (
                  <DistanceMatrix colors={this.state.currentPalette}/>
                )
              }
              {
                this.state.currentTab === 'GradientPaletteBy1' && (
                  <GradientPaletteBy1 color={this.state.currentColor} colors={this.state.currentPalette}
                    onPaletteSelect={(p) => {
                      this.setState({
                        currentPalette: p,
                      });
                    }}/>
                )
              }
              {
                this.state.currentTab === 'GradientPaletteBy2' && (
                  <GradientPaletteBy2 color1={this.state.currentColor} color2={this.state.currentColor}/>
                )
              }
              {
                this.state.currentTab === 'VisInCharts' && (
                  <VisInCharts colors={this.state.currentPalette}/>
                )
              }
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Palettes, View & Make
          </Footer>
        </Layout>
        {/* Drawer for preset palettes */}
        <Drawer title="Preset Palettes" placement="left" closable={true} width={480}
          visible={this.state.showPresetPalettes}
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
