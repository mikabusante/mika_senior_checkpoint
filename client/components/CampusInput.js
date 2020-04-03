/* eslint react/no-unused-state:0 */
import React, { Component } from "react";
import e from "express";

export class CampusInput extends Component {
  constructor() {
    super();
    this.state = {
      name: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      name: e.target.value
    });
  }

  render() {
    //your code here
    return <input onChange={e => this.handleChange(e)} />;
  }
}
