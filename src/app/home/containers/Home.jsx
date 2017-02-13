import React from 'react';
import {connect} from 'react-redux';
import {HOME_SWITCH} from '../constants';

const hoc = connect(
  state => ({
    text: state && state.home && state.home.counter
  }),
  dispatch => ({
    change: () => dispatch({type: HOME_SWITCH})
  })
);

export default hoc(
  ({text, change}) => (
    <div> 
      <p>Home saying: {text}</p>
      <button onClick={change}> trigger action </button>
    </div>)
  );
