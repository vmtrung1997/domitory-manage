import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './input.css'

class Input extends Component {
  static propTypes = {
    value: PropTypes.any,
    placeholder: PropTypes.string,
    mask: PropTypes.any,
    color: PropTypes.oneOf(['success', 'warning', 'danger','info']),
    ref: PropTypes.any
  }
  static defaultProps = {

    pattern: '*',
    required: false,
    type: 'text',
    width: '100%',
    fontSize: '14px',
    placeholder: '',
    padding: '6px 12px',
    borderRadius: '1px',
    textAlign: '',
    disabled: false,
    autoFocus: false,
    getValue: () => {},
    onKeyPress: () => {},
    onChange: () => {},
    onFocus: () => {}
  }
  onChange = (event) => {
    this.props.getValue(event.target);
    this.props.onChange(event);
  }
  onRef = (event) => {
    this.props.ref(event)
  }
  render() {
    var {color} = this.props
    return (
      <React.Fragment>
        <input
          style={{width: `${this.props.width}`, fontSize: `${this.props.fontSize}`, padding: `${this.props.padding}`, borderRadius: `${this.props.borderRadius}`, textAlign: `${this.props.textAlign}`}}
          className={`input-control input-${color}`}
          name={this.props.name}
          onChange={this.onChange}
          value={this.props.value}
          type={this.props.type}
          disabled = {this.props.disabled}
          placeholder={this.props.placeholder}
          onKeyPress={this.props.onKeyPress}
          data-mask={this.props.mask}
          ref={this.props.onRef}
          onFocus={this.props.onFocus}
          min={this.props.min}
          max={this.props.max}
          pattern={this.props.pattern}
          required={this.props.required}
        />
      </React.Fragment>
    );
  }
}

export default Input;
