require('core-js');

const configureENV = require('./app/core/env').configureENV;
const config = require('./config/environment');

configureENV(config);

const createServer = require('./server/server').createServer;

// Tell any CSS tooling to use all vendor prefixes if the
// user agent is not known.
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

const server = createServer(config);

server.listen(config.port, () => {
  console.log(`listening at ${config.port}://${config.hostname}:${config.port}`); // eslint-disable-line
});
