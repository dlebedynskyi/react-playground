/* eslint-disable import/prefer-default-export, no-console */
const express = require('express');
const debug = require('debug');

const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const webpack = require('webpack');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

const {PUBLIC} = require('../src/config/paths');
const webpackConfig = require('../src/config/webpack.config.dev');
const env = require('../src/config/environment');


const logger = require('./logger');
const buildUtils = require('../src/config/utils');

const log = {
  general: console.log,
  pack: debug('react-playground:build:compiler'),
  hot: debug('react-playground:build:hot-reload')
};

let hasCompleteFirstCompilation = false;

module.exports = () => new Promise((resolve, reject) => {
  logger.start('Creating assets server');
  const app = express();
  const compiler = webpack(webpackConfig);

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });

  app.use('/', express.static(PUBLIC));

  app.use(devMiddleware(compiler, {
    noInfo: true,
    quiet: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      reasons: false
    }
  }));

  if (buildUtils.isHot()) {
    app.use(hotMiddleware(compiler, {
      log: log.hot,
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000
    }));
  }

  let httpServer;

  const onExit = () => {
    console.log('exiting process');
    if (httpServer) { httpServer.close(); }
    process.exit(0);
  };

  compiler.plugin('done', stats => {
    log.pack('Assets compiled');
    log.pack(stats.toString({
      chunks: false,
      colors: true
    }));

    const rawMessages = stats.toJson({}, true);
    const messages = formatWebpackMessages(rawMessages);
    if (!messages.errors.length && !messages.warnings.length) {
      logger.task('Assets compiled successfully!');
      if (!hasCompleteFirstCompilation) {
        logger.end('Assets server compiled');
      }

      hasCompleteFirstCompilation = true;
      resolve(httpServer);
      return;
    }

    if (messages.errors.length) {
      logger.error('Failed to compile.');
      messages.errors.forEach(log.general);

      if (!hasCompleteFirstCompilation) {
        onExit();
        reject(stats);
      }

      return;
    }

    if (messages.warnings.length) {
      logger.warn('Compiled with warnings.');
      messages.warnings.forEach(log.general);
    }
  });

  httpServer = app.listen(env.assetsPort);
  process.on('SIGTERM', onExit);
  process.on('SIGINT', onExit);

  logger.info(`Assets Server spawned at :${env.assetsPort}. Please wait for assets rebuild`);
});
