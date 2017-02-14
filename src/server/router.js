import express from 'express';
import debug from 'debug';
import compression from 'compression';

import renderApp from './middleware/render-app';

import { DIST, PUBLIC } from '../config/paths';
import {onError} from './middleware/error';

const log = debug('react-playground:router');

export const routingApp = express();

/**
 * function to server static assets for dev from server/public (PUBLIC) without cache
 * or from build/dist (DIST) on production with cache in place
 * @param  {object} config
 * @return static middleware
 */
function getStaticAssets(config) {
  if (config.environment === 'development') {
    log('serving external files from', PUBLIC);
    return express.static(PUBLIC);
  }

  log('serving production assets from ', DIST);
  return express.static(DIST, {
    maxAge: (+config.staticAssetsCache)
  });
}

export function setRoutes(assets, config) {
  log('adding react routes');
  log('recived assets', assets);
  log('public path maps to', PUBLIC);
  routingApp.disable('x-powered-by');

  // setting logging via Raven
  if (config.environment === 'production') {
    log('configure production logging');
    // TODO: production loging set up now
  } else {
    log('development loging');
  }
  // setting headers and static assets
  routingApp
    .use((req, res, next) => {
      res.header('X-Powered-By', 'Unicorn Poops');
      next();
    })
    .use(getStaticAssets(config))
    .use(compression());

  routingApp
    .get('*', renderApp(assets, config));

  // setting dynamicCache for html page
  if (config.environment === 'production') {
    routingApp
      .use((req, res, next) => {
        res.set('Cache-Control', `private, max-age=${config.dynamicCache}`);
        next();
      });
  }
  // custom error responce to client
  routingApp.use(onError);
}
