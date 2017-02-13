import {HOME_SWITCH} from '../constants';

const initialState = {
  counter: 0
};

const home = (state = initialState, action) => {
  if (!action) { return state; }
  if (action.type === HOME_SWITCH) { 
    return {...state, counter: state.counter + 1};
  }
  
  return state;
};


export default home;
