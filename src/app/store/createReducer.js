/**
 * create reducer - helper funciton to create reducer as an object based on RSA
 * http://redux.js.org/docs/recipes/ReducingBoilerplate.html#generating-reducers
 * @param  initialState - initial state of reducer
 * @param  {object} handlers  object with keys as action.type and value as reduce function
 * @return {function} - create reducer function
 **/
export default function createReducer(initialState, handlers = {}) {
  return function reducer(state = initialState, action) {
    if (action && {}.hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action);
    }
    return state;
  };
}
