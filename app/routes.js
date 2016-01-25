import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import Popular from './components/Popular';

export default (
  <Route component={App}>
    <Route path='/' component={Home} />
    <Route path='/popular' component={Popular} />
  </Route>
);
