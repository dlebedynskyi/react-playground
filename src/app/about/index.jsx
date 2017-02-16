import { createAsyncComponent } from 'react-async-component';

const AsyncAbout = createAsyncComponent({
  name: 'about',
  resolve: () => new Promise(resolve =>
    require.ensure([], require => {
      resolve(require('./attach'));
    }, 'about'))
});

export default AsyncAbout;
