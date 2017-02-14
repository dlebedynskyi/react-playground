/* eslint-disable import/prefer-default-export */
import express from 'express';
import debug from 'debug';
import hpp from 'hpp';
import helmet from 'helmet';
import compression from 'compression';

import { routingApp, setRoutes } from './router';
import buildAssets from '../config/assets';

const assets = buildAssets();

export const createServer = config => {
  const server = express();

  const log = debug('react-playground:server.js');
  log('starting with config %O', config);
  server.set('etag', true);

  // Prevent HTTP Parameter pollution.
  // @see http://bit.ly/2f8q7Td
  server.use(hpp());

  if (config.environment !== 'production') {
    server.use((req, res, next) => {
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.header('Pragma', 'no-cache');
      res.header('Expires', 0);
      next();
    });
  }

  // The xssFilter middleware sets the X-XSS-Protection header to prevent
  // reflected XSS attacks.
  // @see https://helmetjs.github.io/docs/xss-filter/
  server.use(helmet.xssFilter());

  // Frameguard mitigates clickjacking attacks by setting the X-Frame-Options header.
  // @see https://helmetjs.github.io/docs/frameguard/
  server.use(helmet.frameguard('deny'));

  // Sets the X-Download-Options to prevent Internet Explorer from executing
  // downloads in your site’s context.
  // @see https://helmetjs.github.io/docs/ienoopen/
  server.use(helmet.ieNoOpen());

  // Don’t Sniff Mimetype middleware, noSniff, helps prevent browsers from trying
  // to guess (“sniff”) the MIME type, which can have security implications. It
  // does this by setting the X-Content-Type-Options header to nosniff.
  // @see https://helmetjs.github.io/docs/dont-sniff-mimetype/
  server.use(helmet.noSniff());

  server.use(compression());
  server.enable('view cache');
  server.enable('strict routing');

  setRoutes(assets, config);
  server.use('/', routingApp);
  // Don't expose any software information to potential hackers.
  server.disable('X-Powered-By');

  return server;
};
