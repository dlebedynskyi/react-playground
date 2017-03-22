import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { ABOUT_SWITCH } from '../constants';

const hoc = connect(
  state => ({
    text: state && state.about && state.about.counter
  }),
  dispatch => ({
    change: () => dispatch({ type: ABOUT_SWITCH })
  })
);

const About = ({ text, change }) => (
  <div>
    <h2>About with counter</h2>
    <p>Counter is {text}</p>
    <button onClick={change}> trigger action </button>
  </div>
);

About.propTypes = {
  text: PropTypes.number.isRequired,
  change: PropTypes.func.isRequired
};

export default hoc(About);
