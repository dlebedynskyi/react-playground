const debug = require('debug');
const { WEBPACK_ASSET_FILE_PATH } = require('./paths');

const fs = require('fs');

const log = debug('react-playground:server:assets');

module.exports = () => {
  const file = fs.readFileSync(WEBPACK_ASSET_FILE_PATH, 'utf8');
  const assets = file ? JSON.parse(file) : null;
  if (!file || !assets) {
    log('Assets file was not found. Expected ', file);
    return null;
  }

  log('assets file', assets);
  return assets;
};
