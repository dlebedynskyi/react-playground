import test from 'ava';
import reducer from './home';

const initialState = {
  counter: 0
};

test('initialState', t => {
  const state = reducer();
  t.deepEqual(state, initialState, 'must have initialState');
});
