const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'cheap-source-map',
  entry: {
    bundle: './src/index.js',
    distance: './src/forms/distance.js',
  },
  output: {
    path: path.resolve(__dirname, 'assets'),
    library: 'APP',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-flow',
              '@babel/preset-react',
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-syntax-dynamic-import',
            ],
          },
        },
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // {
      //   loader:'webpack-ant-icon-loader',
      //   enforce: 'pre',
      //   include:[
      //     path.resolve('node_modules/@ant-design/icons/lib/dist')
      //   ]
      // },
    ]
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/,
  },
  externals: {
    'chroma-js': 'chroma',
    // 'lodash': '_',
    'socket.io-client': 'io',
    'plotly.js': 'Plotly',
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
};
