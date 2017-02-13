/* eslint-disable import/prefer-default-export */
const webpack = require('webpack');
const debug = require('debug');
const webpackConfig = require('../src/config/webpack.config.server.js');

const formatWebpackMessages = require('./formatWebpackMessages');
const logger = require('./logger');

const log = {
  general: console.log,
  pack: debug('react-playground:build:server')
};
let hasCompleteFirstCompilation = false;

module.exports = function runCompiler(cb = () => {}) {
  logger.start('Building server');
  const compiler = webpack(webpackConfig);
  let watcher;
  const onExit = () => { if (watcher) { watcher.close(); } };

  watcher = compiler.watch({}, (err, stats) => {
    log.pack('Server compiled');
    log.pack(stats.toString({
      chunks: false,
      colors: true
    }));

    const rawMessages = stats.toJson({}, true);
    const messages = formatWebpackMessages(rawMessages);

    if (!messages.errors.length && !messages.warnings.length) {
      logger.task('Server compiled successfully!');
      hasCompleteFirstCompilation = true;
      if (cb) { cb(stats); }
      return;
    }

    if (messages.errors.length) {
      logger.error('Failed to compile.');
      messages.errors.forEach(log.general);

      if (!hasCompleteFirstCompilation) { onExit(); }
      return;
    }

    if (messages.warnings.length) {
      logger.warn('Compiled with warnings.');
      messages.warnings.forEach(log.general);
    }
  });

  process.on('SIGINT', onExit);
};
