/* eslint-disable no-param-reassign */
/* Based on  https://gist.github.com/gaearon/0a2213881b5d53973514 */

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import has from 'lodash.has';
import set from 'lodash.set';
import get from 'lodash.get';
import thunkMiddleware from 'redux-thunk';

import reducers from '../core/reducers';
import dummyReducer from './dummyReducer';

const debugEnhancer =
  typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ?
  window.devToolsExtension() : f => f;

export default function configureStore(initialState = {}) {
  const initialReducers = createAsyncReducers({}, Object.keys(initialState));
  
  const enhancer = compose(
     applyMiddleware(thunkMiddleware), // middlewares 
     debugEnhancer
   );
   
  const store = createStore(
    initialReducers,
    initialState,
    enhancer
  );
  
  // registry for async reducers
  store.asyncReducers = {};
  
  if (module.hot) {
    module.hot.accept('../core/reducers', () => {
      const nextReducers = require('../core/reducers').default; // eslint-disable-line global-require
      
      const replace = {...nextReducers, ...store.asyncReducers};
      store.replaceReducer(replace);
    });
  }
  
  return store;
}


export function createAsyncReducers(asyncReducers, persist = []) {  
  const allReducers = {
    ...reducers,
    ...asyncReducers
  };
  
  persist.forEach(key => {
    if (!{}.hasOwnProperty.call(allReducers, key)) { 
      allReducers[key] = dummyReducer;
    }
  });
  
  
  return combineReducers(allReducers);
}

export function injectReducer(store, name, asyncReducer, force = false) {
  if (!force && has(store.asyncReducers, name)) {
    const r = get(store.asyncReducers, name);
    if (r === dummyReducer) { return; }
  } 
  
  set(store.asyncReducers, name, asyncReducer);
  store.replaceReducer(createAsyncReducers(store.asyncReducers));
}
