import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './input.css'

class Input extends Component {
  static propTypes = {
    value: PropTypes.any,
    placeholder: PropTypes.string
  }
  static defaultProps = {
    type: 'text',
    width: '100%',
    fontSize: '14px',
    placeholder: '',
    padding: '6px 12px',
    borderRadius: '1px',
    getValue: () => {}
  }
  onChange = (event) => {
    this.props.getValue(event.target.value);
  }
  render() {
    return (
      <React.Fragment>
        <input 
          style={{width: `${this.props.width}`, fontSize: `${this.props.fontSize}`, padding: `${this.props.padding}`, borderRadius: `${this.props.borderRadius}`}}
          onChange={this.onChange} 
          value={this.props.value}
          type={this.props.type} 
          className="input-control" 
          placeholder={this.props.placeholder} />
      </React.Fragment>
    );
  }
}

export default Input;
