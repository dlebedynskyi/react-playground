const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

require('./environment');

const { SRC, COMPILED } = require('./paths');

module.exports = {
  target: 'node',
  externals: [nodeExternals()],
  entry: { server: [`${SRC}/server-entry.js`] },
  devtool: 'source-map',
  output: {
    path: COMPILED,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/'
  },
  performance: false,
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.PORT': JSON.stringify(process.env.PORT),
      'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
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
        loader: 'babel-loader'
      }
    ]
  }
};
