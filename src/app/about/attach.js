/* eslint-disable global-require */
import { attachReducer } from '../store/store';
import withAsyncReducers from '../store/withAsyncReducers';
import About from './containers/About';

const REDUCER_NAME = 'about';

if (module.hot) {
  module.hot.accept(() => {
    const newReducer = require('./reducers/about').default;
    attachReducer(REDUCER_NAME, newReducer, true);
  });
}

const reducer = require('./reducers/about').default;

export default withAsyncReducers(REDUCER_NAME, reducer)(About);
