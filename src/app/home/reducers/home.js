// @flow
import { HOME_SWITCH } from '../constants';

const initialState: Object = {
  counter: 0
};

const home = (state: Object = initialState, action: {type: string}) => {
  if (!action) {
    return state;
  }
  if (action.type === HOME_SWITCH) {
    return { ...state, counter: state.counter + 1 };
  }

  return state;
};

export default home;
