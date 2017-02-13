import {Children} from 'react';

// We create this wrapper so that we only import react-hot-laoder for a
// development build.  Small savings. :)
const ReactHotLoader =
  process.env.NODE_ENV === 'development'
  ? require('react-hot-loader').AppContainer
  : ({ children }) => Children.only(children);

export default ReactHotLoader;
