/* eslint-disable import/prefer-default-export, no-console */
const webpack = require('webpack');
const debug = require('debug');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const webpackConfig = require('../config/webpack.config.server.js');

const logger = require('./logger');

const log = {
  warn: console.warn || console.log,
  error: console.error,
  pack: debug('react-playground:build:server')
};
let hasCompleteFirstCompilation = false;

module.exports = () =>
  new Promise((resolve, reject) => {
    logger.start('Building server');
    const compiler = webpack(webpackConfig);
    let watcher;
    const onExit = () => {
      if (watcher) {
        watcher.close();
      }
    };

    watcher = compiler.watch({}, (err, stats) => {
      log.pack('Server compiled');
      log.pack(
        stats.toString({
          chunks: false,
          colors: true
        })
      );
      if (err) {
        console.error('got webpack error', err);
        reject(err);
        return;
      }

      const rawMessages = stats.toJson({}, true);
      const messages = formatWebpackMessages(rawMessages);
      // resolving promise on first compilation complete
      if (!messages.errors.length) {
        logger.task('Server compiled successfully!');
        hasCompleteFirstCompilation = true;
        resolve(watcher);
        return;
      }

      // some errors happened
      if (messages.errors.length) {
        logger.error('Failed to compile.');
        // report errors to console
        messages.errors.forEach(log.error);
        // first compile failed. rejecting promise
        if (!hasCompleteFirstCompilation) {
          onExit();
          reject(stats);
        }
        return;
      }

      if (messages.warnings.length) {
        logger.warn('Compiled with warnings.');
        messages.warnings.forEach(log.warn);
      }
    });

    process.on('SIGTERM', onExit);
    process.on('SIGINT', onExit);
  });
