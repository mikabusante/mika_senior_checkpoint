/* DO NOT EDIT */

import React from 'react';
import { Link } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <h1>School Name Goes Here</h1>
      <Link to='/campuses'>Campuses</Link>
      <Link to='/students'>Students</Link>
    </div>
  );
};

export default App;
