import { createAsyncComponent } from 'react-async-component';
import withAsyncReducers from '../store/withAsyncReducers';

const AsyncAbout = createAsyncComponent({
  name: 'about',
  resolve: () => new Promise(resolve =>
    require.ensure([
      './reducers/about'
    ], require => {
      const reducer = require('./reducers/about').default;
      const component = require('./containers/About').default;
      const withReducer = withAsyncReducers('about', reducer)(component);
      resolve({default: withReducer});
    }, 'about'))
});

export default AsyncAbout;
