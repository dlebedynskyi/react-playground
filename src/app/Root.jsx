import React from 'react';
import Route from 'react-router-dom/Route';
import Link from 'react-router-dom/Link';
import Switch from 'react-router-dom/Switch';
import Status from './core/components/Status';
import Home from './home';
import About from './about';

const NotFound = () => (
  <div> 
     <Status code="404" />
     Not Found
  </div>
);

export default() => (
  <div>
    <ul>
      <li> <Link to="/">Home</Link> </li>
      <li> <Link to="/about">About</Link> </li>
      <li> <Link to="/topics">Topics</Link> </li>
      <li> <Link to="/legal">Legal</Link> </li>
    </ul>
    <hr />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  </div>
);

