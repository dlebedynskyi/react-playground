// Load environment variables from .env file. Surpress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({silent: true});
const debug = require('debug');

const {CONTENT, DIST_CONTENT_PATH} = require('./paths');

const configValue = {};

configValue.environment = getEnvOrDefault('NODE_ENV', 'development');

if (configValue.environment === 'development') {
  configValue.assetsPort = getEnvOrDefault('DEV_ASSETS_PORT', '5000');
  configValue.publicAssets = `http://localhost:${configValue.assetsPort}`;
} else {
  configValue.publicAssets = getEnvOrDefault('CDN_URL', '');
}

configValue.port = getEnvOrDefault('PORT', 5001);
configValue.protocol = getEnvOrDefault('PROTOCOL', 'http');
configValue.hostname = getEnvOrDefault('HOSTNAME', 'localhost');

configValue.staticAssetsCache = getEnvOrDefault('STATIC_CACHE_DURATION', 1000 * 60 * 60 * 24 * 30); // 30 days
configValue.dynamicCache = getEnvOrDefault('DYNAMIC_CACHE_DURATION', 0); // 0 ms

configValue.contentDir =
  configValue.environment === 'development' ?
  CONTENT :
  DIST_CONTENT_PATH;

debug.enable(process.env.DEBUG);

module.exports = configValue;

function getEnvOrDefault(key, defaultValue) {
  if (!process.env[key]) {
    if (typeof defaultValue === 'undefined' && process.env.NODE_ENV !== 'test') {
      console.warn('WARNING: Missing ENV var ', key); //eslint-disable-line
      debug(`WARNING: Missing ENV var ${key}`);
    } else {
      process.env[key] = defaultValue;
    }
  }
  return process.env[key];
}
