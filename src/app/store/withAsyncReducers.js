import React, {Component} from 'react';
import storeShape from 'react-redux/lib/utils/storeShape';
import {injectReducer} from './store';

const storeKey = 'store';
/**
 * withAsyncReducers - HOC component to register async reducer
 * @param  {string}  name          reducer name 
 * @param  {function}  reducer     reducer function
 * @param  {Boolean} [force=false] should replace be forced
 * @return {Component} React Component
 */
const withAsyncReducers = (name, reducer, force = false) => 
  BaseComponent => 
  class WithAsyncComponent extends Component {
    static contextTypes = {
      [storeKey]: storeShape
    };
    
    constructor(props, context) {
      super(props, context);
      this.store = this.props[storeKey] || this.context[storeKey];
    }
    
    componentWillMount() {
      this.attachReducers();
    }
    
    attachReducers() {
      if (!reducer || !name) { return; }
      injectReducer(this.store, `${name}`, reducer, force);
    }
    
    render() {
      return React.createElement(BaseComponent, this.props);
    }
  };

export default withAsyncReducers;
