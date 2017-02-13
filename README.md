# react-playground
React application with React Router v4, async components etc

## What is this for? 
Demo app to show react router v4 beta with async component, code split and async reducer registration.

Bases on excellent work of great people
 - [Dan Abramov on inject reducers](http://stackoverflow.com/questions/32968016/how-to-dynamically-load-reducers-for-code-splitting-in-a-redux-application/33045558)
 - [React async component](https://github.com/ctrlplusb/react-async-component)
 - [Create react app scripts](https://github.com/facebookincubator/create-react-app/tree/master/packages/react-scripts)
 - [React Universally](https://github.com/ctrlplusb/react-universally)
 - [React Router v4](https://github.com/ReactTraining/react-router/tree/v4)
 - [webpack 2](https://github.com/webpack/webpack/)


## Client Side setup

1. Open `Root.jsx`.  There you can see that we have pretty basic RR4 routing. 
```jsx
<ul>
  <li> <Link to="/">Home</Link> </li>
  <li> <Link to="/about">About</Link> </li>
  <li> <Link to="/topics">Topics</Link> </li>
  <li> <Link to="/legal">Legal</Link> </li>
</ul>
```

2. Open `client-entry.js`. Here we have Routing set up for React Router and Redux store.
```jsx
// create render function
const render = RootEl => {
  const app = (
      <Provider store={store}>
        <ReactHotLoader>
            <Router><RootEl /></Router>
        </ReactHotLoader>
      </Provider>
  );
```

and set up for async components
```jsx
withAsyncComponents(app).then(({appWithAsyncComponents}) => {
  ReactDOM.render(appWithAsyncComponents, rootEl);
});
```

3. Open `About/index.jsx`. It has a bit more then you need to code split. And we will get back to it later.
Below is full code you need to code split of components using RR4 and `react-async-component`.   

```jsx 
import { createAsyncComponent } from 'react-async-component';

const AsyncAbout = createAsyncComponent({
  name: 'about',
  resolve: () => new Promise(resolve =>
    require.ensure([
      './reducers/about'
    ], require => {
      const component = require('./containers/About').default;
      resolve({default: component});
    }, 'about'))
});

export default AsyncAbout;
```

### Server Side setup

Server side setup is done within `render-app.js`
1. Redux Store and Router
```jsx
import {Provider as Redux} from 'react-redux';
import StaticRouter from 'react-router/StaticRouter';

const App = (store, req, routerContext) => (
    <Redux store={store}>
        <StaticRouter location={req.url} context={routerContext}>
          <Root />
        </StaticRouter>
    </Redux>
);

```   

2. rendering app with Router context and async components
```jsx
// create router context
const routerContext = {};
// construct app component with async loaded chunks
const asyncSplit = await withAsyncComponents(App(store, req, routerContext));
// getting async component after code split loaded
const {appWithAsyncComponents} = asyncSplit;
//  actual component to string
const body = renderToString(appWithAsyncComponents);
```

3. Rendering actual page is done in `Html.jsx`. For client to understand what content we rendered and do same we need to pass down async chunk state 
```jsx
{asyncComponents && asyncComponents.state ?
  <script
    dangerouslySetInnerHTML={{ __html: `
      window.${asyncComponents.STATE_IDENTIFIER} = ${serialize(asyncComponents.state, {isJSON: true})};
      `}} /> :
    null}
```

And at this point you have SSR of React app using React router with Async Components.

## Handling 404 and redirects with React Router

1. View `Status.jsx`. All this component is doing really is just setting value on Static Router Context.  

```jsx
componentWillMount() {
  const { staticContext } = this.context.router;
  if (staticContext) {
    staticContext.status = this.props.code;
  }
}
```

2. then we can handle this value in `render-app.js` for SSR   

```
// checking is page is 404
let status = 200; 
if (routerContext.status === '404') {
  log('sending 404 for ', req.url);
  status = 404;
} else {
  log('router resolved to actual page');
}

// rendering result page
const page = renderPage(body, head, initialState, config, assets, asyncSplit);
res.status(status).send(page);
```
3. This is basically same exact thing RR 4 is doing for redirect.  

```jsx
if (routerContext.url) {
  // we got URL - this is a signal that redirect happened
  res.status(301).setHeader('Location', routerContext.url);
```

4. If you try to navigate to  `/legal` you will see that Not Found is returned and server is giving us 404 as expected. `/topic` will do 301 redirect. More details on how to use [Switch](https://reacttraining.com/react-router/examples/ambiguous-matches)

## Enabling async reducers 

Coming back to About component. Full source 

```jsx
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
```

`withAsyncReducers` is core function that we use here. It finds redux store from context and tries to register  **top-level reducer** passed into it. 

```jsx 

import {injectReducer} from './store';

//... 

componentWillMount() {
  this.attachReducers();
}

attachReducers() {
  if (!reducer || !name) { return; }
  injectReducer(this.store, `${name}`, reducer, force);
}

```

This may not be ideal for some scenarios and should be used with caution. Main risk is that some actions that happen before reducer is loaded and registered would be tracked. In case you need track of those you might look into more complex and robust solutions like [redux-persist](https://github.com/rt2zz/redux-persist)

`injectReducer` is a function that is responsible for
 - checking is async reducer was already injected into async registry
 - Creating new redux function and replacing state function with it.
 
 ###Caveats using async reducers###
 1. **SSR.** we don't won't to loose initialState that was sent from server. Redux currently is checking that once we create store on client and will remove all state that does not have reducers yet. _And we don't have it since we have not loaded our components yet_. To fix that we use `dummyReducer` function that will be later replaced with real one. 
 
```
const initialReducers = createAsyncReducers({}, Object.keys(initialState));
// ...  setting dummy 
  persist.forEach(key => {
    if (!{}.hasOwnProperty.call(allReducers, key)) { 
      allReducers[key] = dummyReducer;
    }
  });
//... replacing dummy 
  if (!force && has(store.asyncReducers, name)) {
    const r = get(store.asyncReducers, name);
    if (r === dummyReducer) { return; }
  } 
  
```
2. All shared reducers should be registered outside of code split. See `core` folder and stuff.
 

 