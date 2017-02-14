const nodemon = require('nodemon');
const debug = require('debug');
const clearConsole = require('react-dev-utils/clearConsole');
const openBrowser = require('react-dev-utils/openBrowser');

const webpackClient = require('./client');
const webpackServer = require('./server');

const {SERVER_PATH, COMPILED} = require('../src/config/paths');
const env = require('../src/config/environment');


const logger = require('./logger');

const log = debug('react-playground:build:nodemon');

const monitorServer = () => {
  logger.start('Starting to monitor build');
  log('execute path', SERVER_PATH);
  log('watching for ', COMPILED);

  return nodemon({
    script: SERVER_PATH,
    watch: [COMPILED]
  })
  .once('start', () => {
    logger.end('Server started');
    if (process.env.NO_BROWSER !== 'true') {
      const url = `${env.protocol}://${env.hostname}${env.port ? `:${env.port}` : ''}`;
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

const onExit = code => { process.exit(code); };

process.on('EADDRINUSE', onExit);
process.on('SIGINT', onExit);
process.on('SIGTERM', onExit);

clearConsole();
logger.start('Starting build');

webpackClient()
.then(() => webpackServer())
.then(() => monitorServer());
