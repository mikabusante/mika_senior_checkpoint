import React from "react";

export const CampusList = props => {
  return (
    <ul>
      {props.campuses.map(campus => {
        return <li key={campus.id}>{campus.name}</li>;
      })}
    </ul>
  );
};
