const _ = require('lodash');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

module.exports = _.merge({
  optimization: {
    minimize: true,
  }
}, webpackConfig);
