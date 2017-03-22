const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const utils = require('./utils');
const loadBabel = require('./babel');

const { publicAssets } = require('./environment');

const vendor = require('./vendor');

const {
  SRC,
  DIST,
  COMPILED_ASSETS_PUBLIC_PATH,
  WEBPACK_ASSET_FILE_NAME,
  WEBPACK_ASSET_FILE_FOLDER,
  BABEL_CLIENT
} = require('./paths');

const babelrc = loadBabel(BABEL_CLIENT);
const babelPlugins = babelrc.plugins;

if (utils.isProduction()) {
  babelPlugins.push('transform-react-remove-prop-types');
}

Object.assign(babelrc, {
  plugins: babelPlugins
});

module.exports = {
  entry: {
    vendor,
    app: [`${SRC}/client-entry.js`]
  },
  performance: false,
  devtool: 'source-map',
  output: {
    path: `${DIST}/${COMPILED_ASSETS_PUBLIC_PATH}`,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: `${publicAssets}/${COMPILED_ASSETS_PUBLIC_PATH}`
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.PORT': JSON.stringify(process.env.PORT),
      'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new AssetsPlugin({
      filename: WEBPACK_ASSET_FILE_NAME,
      path: WEBPACK_ASSET_FILE_FOLDER,
      includeManifest: 'manifest',
      prettyPrint: true
    })
  ],
  resolve: {
    modules: ['node_modules', SRC],
    extensions: ['.js', '.jsx', '.json', '.scss']
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.jsx?$/,
        include: [/src/],
        loader: 'babel-loader',
        query: babelrc
      },
      {
        test: /\.css$/,
        include: [/src/],
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: ['css-loader', 'postcss-loader']
        })
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot)$/,
        loader: 'url-loader',
        query: {
          name: '[hash].[ext]',
          limit: 10000
        }
      },
      {
        test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
        loader: 'url-loader'
      },
      {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
        query: {
          name: '[hash].[ext]'
        }
      }
    ]
  }
};
