import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './radioButton.css'

class RadioButton extends Component {
  static propTypes = {
    label: PropTypes.string,
  }
  static defaultProps = {
    check: false,
    name: '',
    value: '',
    isRadioChk: () => {}
  }
  constructor(props){
    super(props)
    this.state = {
      check: this.props.check
    }
  }
  handleChangeChk = () => {
    var temp = !this.state.check
    this.setState({check: temp})
    this.props.isRadioChk({value: this.props.value})
  }
  render() {
    var label = this.props.label;
    return (
    <React.Fragment>
        <label className="container-radio">{label}
          <input type="radio" defaultChecked={this.state.check} onChange={this.handleChangeChk} value={this.props.value} name={this.props.name}/>
          <span className="checkmark-radio"></span>
        </label>
    </React.Fragment>
    )    
  }
}

export default RadioButton;
