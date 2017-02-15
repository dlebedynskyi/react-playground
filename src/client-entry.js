/* eslint-disable global-require, no-underscore-dangle, react/jsx-filename-extension,  */
import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';

import Router from 'react-router-dom/BrowserRouter';
import {Provider} from 'react-redux';
import { withAsyncComponents } from 'react-async-component';

import configureStore from './app/store/store';
import ReactHotLoader from './app/ReactHotLoader';
import {configureENV} from './app/core/env';
import {INITIAL_CONSTRUCT} from './app/core/constants';
import './styles/app.scss';

const log = debug('react-playground:client-entry');
log('Client environment %s', process.env);

const rootEl = document.getElementById('app');

const config = window.__CONFIG__ || {};
log('configuring client env with %j', config);
configureENV(config);

log('recived initial state', window.__INITIAL_STATE__);
// creating store with registry
const store = configureStore(window.__INITIAL_STATE__ || {});
// dispatch initial state construction to update dynamic values
store.dispatch({type: INITIAL_CONSTRUCT});

// create render function
const render = RootEl => {
  const app = (
      <Provider store={store}>
        <ReactHotLoader>
            <Router><RootEl /></Router>
        </ReactHotLoader>
      </Provider>
  );

  withAsyncComponents(app).then(({appWithAsyncComponents}) => {
    ReactDOM.render(appWithAsyncComponents, rootEl);
  });
};

// set up hot reloading on the client
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./app/Root', () => {
    const Root = require('./app/Root').default; // eslint-disable-line no-shadow

    render(Root);
  });
}

// now ready for first render
const Root = require('./app/Root').default; // eslint-disable-line no-shadow

render(Root);
