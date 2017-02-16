import createReducer from '../../store/createReducer';
import {ABOUT_SWITCH} from '../constants';

const initialState = {
  counter: 1
};

export default createReducer(initialState, {
  [ABOUT_SWITCH]: state => ({...state, counter: state.counter + 1})
});
