import test from 'ava';
import reducer from 'app/home/reducers/home';

const initialState = {
  counter: 0
};

test('initialState', t => {
  const state = reducer();
  t.deepEqual(state, initialState, 'must have initialState');
});
