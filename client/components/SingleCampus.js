import React from 'react';
import SingleStudent from './SingleStudent';

export default function SingleCampus (props) {
  return (
    <div>
      <h2>{props.campus.name}</h2>
      {
        props.students.map(student => {
          return <SingleStudent student={student} />
        })
      }
    </div>
  )
}
