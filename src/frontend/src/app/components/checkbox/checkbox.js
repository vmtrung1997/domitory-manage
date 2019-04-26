import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './checkbox.css'

class Checkbox extends Component {
  static propTypes = {
    name: PropTypes.string,
    label: PropTypes.string
  }
  static defaultProps = {
    disabled: false,
    check: false,
    type: 'checkbox',
    isCheck: () => {},
    style: {display: 'block'},
    checkmark: ''
  }
  constructor(props){
    super(props)
    this.state = {
      check: this.props.check,
      name: this.props.name || null
    }
  } 
  componentWillReceiveProps(e){
    if (e.check !== this.state.check){
      this.setState({check: e.check});
    }
  }
  handleChangeChk = () => {
    var temp = !this.state.check
    this.setState({check: temp})
    this.props.isCheck({value: this.props.name, chk: temp});
  }

  render() {
    var label = this.props.label;
    return (
    <React.Fragment>
      <div style={this.props.style}>
        <label className="container-checkbox">{label}
          <input 
            checked={this.props.check}
            type={this.props.type}
            onChange={this.handleChangeChk} 
            disabled={this.props.disabled}
          />
          <span className={`checkmark ${this.props.checkmark}`}></span>
        </label>
      </div>
    </React.Fragment>
    )    
  }
}
export default Checkbox;
