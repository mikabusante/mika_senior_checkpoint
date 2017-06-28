import React from 'react';
import { Link } from 'react-router';

export default function App () {
  return (
    <div>
      <h1>School Name Goes Here</h1>
      <Link to='/campuses'>Campuses</Link>
      <Link to='/students'>Students</Link>
    </div>
  );
}
