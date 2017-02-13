import Home from './containers/Home';
import reducer from './reducers/home';
import withAsyncReducers from '../store/withAsyncReducers';

export default withAsyncReducers('home', reducer)(Home);
