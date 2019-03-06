import CopyToClipboard from 'react-copy-to-clipboard';
import React from 'react';
import chroma from 'chroma-js';
import {
  Icon,
  message,
} from 'antd';

function noop() {
}

export default class ColorBlock extends React.Component {
  getTextStyle() {
    const { color } = this.props;
    const fontColor = chroma(color).luminance() < 0.5 ? '#fff' : '#000';
    return {
      background: color,
      color: fontColor,
    }
  }

  onCopied = () => {
    const {
      color,
      onSelected = noop,
    } = this.props;
    message.success(`Copied: ${color}`);
    onSelected(color);
  }

  render() {
    const {
      selected,
      color,
      index,
      showIndex,
      showColor,
      showDeleteIcon,
      onDelete = noop,
    } = this.props;
    return (
      <CopyToClipboard onCopy={this.onCopied} title="click to copy color">
        <div
          className={`color-block${selected ? ' selected' : ''}`}
          style={this.getTextStyle()}>
          {
            showIndex ? <span className="index-text">
              {index}
            </span> : ''
          }
          {
            showColor ? <span className="color-value">
              {color.toLowerCase()}
            </span> : ''
          }
          &nbsp;
          {
            showDeleteIcon ? (
              <Icon type="delete" theme="twoTone" twoToneColor="#f00"
                onClick={() => {
                  onDelete(color);
                }}/>) : ''
          }
        </div>
      </CopyToClipboard>
    );
  }
}
