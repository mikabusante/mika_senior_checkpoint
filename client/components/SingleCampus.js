import React from "react";
import SingleStudent from "./SingleStudent";

const SingleCampus = props => {
  return (
    <div>
      <h2>{props.campus.name}</h2>
      {props.campus.students.map(student => (
        <SingleStudent student={student} />
      ))}
    </div>
  );
};

export default SingleCampus;
