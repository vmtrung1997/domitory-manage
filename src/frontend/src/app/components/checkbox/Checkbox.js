import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Checkbox.css'

class Checkbox extends Component {
  static propTypes = {
    name: PropTypes.string,
    label: PropTypes.string
  }
  static defaultProps = {
    check: false
  }
  constructor(props){
    super(props)
    this.state = {
      check: this.props.check,
      name: this.props.name || null
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
      <div>
        <label className="container-checkbox">{label}
          <input type="checkbox" defaultChecked={this.state.check} onChange={this.handleChangeChk} value={this.state.check}/>
          <span className="checkmark"></span>
        </label>
      </div>
    </React.Fragment>
    )    
  }
}
export default Checkbox;
