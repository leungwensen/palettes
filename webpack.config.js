const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: 'cheap-source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'assets'),
    filename: 'bundle.js',
    library: 'APP',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  devServer: {
    // contentBase: path.resolve(__dirname, 'assets')
    open: true,
    publicPath: '/assets/'
  },
  externals: {
    'chroma-js': 'chroma',
    'dat.gui': 'dat',
    'plotly.js': 'Plotly',
    'vanilla-picker': 'Picker',
    jquery: 'jQuery',
    lodash: '_',
  }
};
