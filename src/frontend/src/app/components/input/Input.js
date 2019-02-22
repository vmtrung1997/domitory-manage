import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Input.css'

class Input extends Component {
  static propTypes = {
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string
  }
  static defaultProps = {
    type: 'text',
    width: '100%',
    fontSize: '14px',
    placeholder: '',
    getValue: () => {}
  }
  onChange = (event) => {
    this.props.getValue(event.target.value);
  }
  render() {
    return (
      <React.Fragment>
        <input 
          style={{width: `${this.props.width}`, fontSize: `${this.props.fontSize}`}}
          onChange={this.onChange} 
          defaultValue={this.props.defaultValue} 
          type={this.props.type} 
          className="input-control" 
          placeholder={this.props.placeholder} />
      </React.Fragment>
    );
  }
}

export default Input;
