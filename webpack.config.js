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
            presets: [
              '@babel/preset-env',
              '@babel/preset-flow',
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-syntax-dynamic-import',
            ],
            ignore: ['node_modules', 'build'],
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
    'lodash': '_',
    'plotly.js': 'Plotly',
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
};
