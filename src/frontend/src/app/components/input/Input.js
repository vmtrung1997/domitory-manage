import React, { Component } from 'react';
import './Input.css'

class Input extends Component {
  onChange = (event) => {
    this.props.getValue(event.target.value);
  }
  render() {
    const placeholder = this.props.placeholder
    const type = this.props.type
    return (
      <React.Fragment>
        <input onChange={this.onChange} defaultValue={this.props.defaultValue} type={type} className="input-control" placeholder={placeholder}/>
      </React.Fragment>
    );
  }
}
export default Input;
