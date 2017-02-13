const once = require('lodash.once');
const nodemon = require('nodemon');
const debug = require('debug');

const wpClient = require('./client');
const wpServer = require('./server');

const {SERVER_PATH, COMPILED} = require('../src/config/paths');
const env = require('../src/config/environment');

const clearConsole = require('./clearConsole');
const logger = require('./logger');
const openBrowser = require('./openBrowser');

const log = debug('react-playground:build:nodemon');

const monitorServer = () => {
  logger.start('Starting to monitor build');
  log('execute path', SERVER_PATH);
  log('watching for ', COMPILED);

  nodemon({
    script: SERVER_PATH,
    watch: [COMPILED]
  })
  .once('start', () => {
    logger.end('Server started');
    if (process.env.NO_BROWSER !== 'true') {
      const url = `${env.protocol}://${env.host}`;
      log(`setting timer to open browser at ${url}`);
      setTimeout(() => { openBrowser(url); }, 1000);
    }
  })
  .on('restart', () => {
    logger.info('restarting monitor');
  })
  .on('crash', err => {
    logger.error('monitor failed', err);
  })
  .on('quit', process.exit);
};

const runServer = () => wpServer(once(monitorServer));

process.on('EADDRINUSE', () => process.exit(1));

clearConsole();
logger.start('Starting build');
wpClient(once(runServer));
