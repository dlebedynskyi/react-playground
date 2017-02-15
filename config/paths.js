const path = require('path');

const ROOT = path.join(process.cwd());
const BABEL_CLIENT = path.join(ROOT, '.client.babelrc');

const SRC = path.join(ROOT, 'src');
const COMPILED = path.join(ROOT, 'build');
const SERVER_PATH = path.join(COMPILED, 'server.js');

const DIST = path.join(COMPILED, 'dist');
const COMPILED_ASSETS_PUBLIC_PATH = 'assets/';
const DIST_COMPILED_ASSETS_PUBLIC_PATH = path.join(DIST, COMPILED_ASSETS_PUBLIC_PATH);

const APP = path.join(SRC, 'app');
const SERVER = path.join(SRC, 'server');
const PUBLIC = path.join(SERVER, 'public');
const CONTENT = path.join(SERVER, 'content');
const DIST_CONTENT_PATH = path.join(COMPILED, 'content');
const ICONS = path.join(SRC, 'icons');
const STYLES = path.join(SRC, 'styles');

const WEBPACK_ASSET_FILE_NAME = 'webpack-assets.json';
const WEBPACK_ASSET_FILE_FOLDER = COMPILED;
const WEBPACK_ASSET_FILE_PATH = path.join(WEBPACK_ASSET_FILE_FOLDER, WEBPACK_ASSET_FILE_NAME);

module.exports = {
  ROOT,
  BABEL_CLIENT,
  SRC,
  DIST,
  COMPILED_ASSETS_PUBLIC_PATH,
  DIST_COMPILED_ASSETS_PUBLIC_PATH,
  DIST_CONTENT_PATH,
  COMPILED,
  SERVER_PATH,
  APP,
  ICONS,
  PUBLIC,
  CONTENT,
  STYLES,
  WEBPACK_ASSET_FILE_NAME,
  WEBPACK_ASSET_FILE_FOLDER,
  WEBPACK_ASSET_FILE_PATH
};
