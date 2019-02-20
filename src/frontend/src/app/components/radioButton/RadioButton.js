import React, { Component } from 'react';
import './RadioButton.css'

class RadioButton extends Component {
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
          <input type="radio" defaultChecked={this.state.check} onChange={this.handleChangeChk} value={this.state.value} name={this.props.name}/>
          <span className="checkmark-radio"></span>
        </label>
    </React.Fragment>
    )    
  }
}
export default RadioButton;
