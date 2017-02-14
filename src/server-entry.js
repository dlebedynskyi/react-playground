require('core-js');

const buildAssets = require('../config/assets');
const configureENV = require('./app/core/env').configureENV;
const config = require('../config/environment');

configureENV(config);

const createServer = require('./server/server').createServer;

// Tell any CSS tooling to use all vendor prefixes if the
// user agent is not known.
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

const server = createServer(config, buildAssets);

server.listen(config.port, () => {
  console.log(`listening at http://localhost:${config.port}`); // eslint-disable-line
});
