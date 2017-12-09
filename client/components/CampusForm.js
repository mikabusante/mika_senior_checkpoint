import React, { Component } from 'react';

export default class CampusForm extends Component {
  //your code here

  constructor() {
    super();
    this.state = {
      name: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    console.log('hi');
    const name = evt.target.value;
    this.setState({
      name
    })
  }

  render() {
    return (
      <input onChange = {this.handleChange}/>
    )
  }
}
