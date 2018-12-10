/* DO NOT EDIT */

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';

import createMemoryHistory from 'history/createMemoryHistory'
const history = createMemoryHistory()

import App from './components/App';

ReactDOM.render(
  <Router history={history}>
    <Route path='/' component={App} />
  </Router>,
  document.getElementById('app')
);
