import React from 'react';
import _ from 'lodash';
import chroma from 'chroma-js';
import {
  Button,
  Divider,
  Form,
  Slider,
} from 'antd';
import ColorBlock from './color-block';
import getPaletteByImage from '../util/palette-by-image';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.style.display = 'none';
document.body.appendChild(canvas);

class PaletteByImage extends React.Component {
  state = {
    file: '',
    url: '',
    count: 5,
  }

  _handleImageChange(e) {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      const url = reader.result;
      const img = new Image;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        this.setState({
          file,
          url,
        });
      };
      img.src = url;
    }
    reader.readAsDataURL(file)
  }

  render() {
    const {
      count,
      url,
      file,
    } = this.state;
    const {
      setPalette
    } = this.props;
    let palette = [];
    if (file) {
      palette = getPaletteByImage(canvas, count);
    }
    console.log(palette);
    return <div>
      <Form layout="inline">
        <Form.Item label="">
          <input className="fileInput" type="file" 
            onChange={(e)=>this._handleImageChange(e)} />
        </Form.Item>
      </Form>
      <div className="preview" style={{
        height: 300,
        marginTop: 24,
      }}>
        <img src={url} height='300'/>
      </div>
      <Divider></Divider>
      <Form layout="inline">
        <Form.Item label="Count">
          <Slider min={2} max={40} value={count} style={{ width: 120 }}
            onChange={(value) => {
              this.setState({ count: value })
            }}/>
        </Form.Item>
      </Form>
      <div className="ant-table ant-table-small" style={{ marginTop: 24 }}>
        <div className="ant-table-content">
          <div className="ant-table-body" style={{ margin: 0 }}>
            <table style={{ fontFamily: 'Monospace' }}>
              <tbody className="ant-table-tbody">
                <tr>
                  {palette.map((c, i) => <td key={`${i}-${c}`}>
                    <ColorBlock color={c}/>
                  </td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Button block size="large" type="danger"
        onClick={() => {
          setPalette(palette);
        }}>
        Set as Current Palette
      </Button>

    </div>
  }
}

export default PaletteByImage;
