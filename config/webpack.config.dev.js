const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const utils = require('./utils');

const defaultConfig = require('./webpack.common');
const { publicAssets } = require('./environment');

const hot = `webpack-hot-middleware/client?path=${publicAssets}/__webpack_hmr`;

const devConfig = Object.assign({}, defaultConfig);

// enable hot server
const app = utils.isHot() ? [hot, 'react-hot-loader/patch', ...devConfig.entry.app] : [...devConfig.entry.app];

devConfig.entry.app = app;
// enable Hot module replacement
if (utils.isHot()) {
  devConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
}

// extract all styles in one chunk
devConfig.plugins.push(new ExtractTextPlugin({ filename: '[name].css', allChunks: true }));

module.exports = devConfig;
