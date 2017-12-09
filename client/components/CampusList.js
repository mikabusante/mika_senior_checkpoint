import React, { Component } from 'react';

export default class CampusList extends Component {
  //your code here
  render() {
    return (
      <ul>
        {
          this.props.campuses.map(campus => {
            return (
              <li>{campus.name}</li>
            )
          })
        }
      </ul>
    )
  }
}
