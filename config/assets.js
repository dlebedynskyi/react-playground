const debug = require('debug');
const {WEBPACK_ASSET_FILE_PATH} = require('./paths');

const fs = require('fs');

const log = debug('react-playground:server:assets');
const commonConfig = require('./webpack.common.js');

module.exports = () => {
  const javascript = [];
  const stylesheet = [];
  const file = fs.readFileSync(WEBPACK_ASSET_FILE_PATH, 'utf8');
  const assets = file ? JSON.parse(file) : null;
  if (!file || !assets) {
    log('Assets file was not found. Expected ', file);
    return {javascript, stylesheet};
  }

  const entries = Object.keys(commonConfig.entry || {});

  entries.forEach(k => {
    if (!assets[k]) { return; }
    if (assets[k].js) {
      javascript.push(assets[k].js);
    }
    if (assets[k].css) {
      stylesheet.push(assets[k].css);
    }
  });

  const result = {javascript, stylesheet};
  log('building assets');
  log(result);

  return result;
};
