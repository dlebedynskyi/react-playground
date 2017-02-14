/* eslint-disable react/jsx-filename-extension */
import {Provider as Redux} from 'react-redux';

import StaticRouter from 'react-router/StaticRouter';
import { withAsyncComponents } from 'react-async-component';
import ServerTiming from 'servertiming';

import debug from 'debug';
import React from 'react';
import {renderToString, renderToStaticMarkup} from 'react-dom/server';
import Helmet from 'react-helmet';

import buildClientConfig from './buildClientConfig';
import Root from '../../app/Root';

import Html from '../templates/Html';

import configureStore from '../../app/store/store';
import {INITIAL_CONSTRUCT} from '../../app/core/constants';

const log = debug('react-playground:server:render');
const perfomanceLog = debug('react-playground:server:perfomance');

const App = (store, req, routerContext) => (
    <Redux store={store}>
        <StaticRouter location={req.url} context={routerContext}>
          <Root />
        </StaticRouter>
    </Redux>
);

const renderPage = (body, head, initialState, config, assets, {state, STATE_IDENTIFIER} = {}) => {

  perfomanceLog('rendering page result for ');
  const clientConfig = buildClientConfig(config);
  const stylesheet = assets.stylesheet;
  const script = assets.javascript;

  const html = renderToStaticMarkup(<Html
    body={body || ''}
    head={head}
    initialState={initialState}
    config={clientConfig}
    stylesheet={stylesheet}
    script={script}
    asyncComponents={{state, STATE_IDENTIFIER}} />
  );

  return `<!doctype html>${html}`;
};

export default function renderAppWrapper(assets, config) {
  return async (req, res, next) => {
    const timing = new ServerTiming();
    timing.startTimer('Render');

    perfomanceLog(`request started for ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    // creating store
    const store = configureStore({});
    // dispatch initial state construction to update dynamic values
    store.dispatch({type: INITIAL_CONSTRUCT});
    // create router context
    const routerContext = {};
    // construct app component with async loaded chunks
    const asyncSplit = await withAsyncComponents(App(store, req, routerContext));
    // getting async component after code split loaded
    const {appWithAsyncComponents} = asyncSplit;
    //  actual component to string
    const body = renderToString(appWithAsyncComponents);
    // getting head
    const head = Helmet.rewind();
    // and inital state
    const initialState = store.getState();

    if (routerContext.url) {
      timing.stopTimer('Render');
      res.setHeader('Server-Timing', timing.generateHeader());
      // we got URL - this is a signal that redirect happened
      res.status(301).setHeader('Location', routerContext.url);

      perfomanceLog(`request ended for ${req.protocol}://${req.get('host')}${req.originalUrl}`);
      res.end();
      next();
      return;
    }
    // checking is page is 404
    let status = 200;
    if (routerContext.status === '404') {
      log('sending 404 for ', req.url);
      status = 404;
    } else {
      log('router resolved to actual page');
    }

    // rendering result page
    const page = renderPage(body, head, initialState, config, assets, asyncSplit);
    timing.stopTimer('Render');
    res.setHeader('Server-Timing', timing.generateHeader());
    res.status(status).send(page);


    perfomanceLog(`request ended for ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
  };
}
