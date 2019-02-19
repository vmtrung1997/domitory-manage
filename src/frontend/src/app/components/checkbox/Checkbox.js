import React, { Component } from 'react';
import './Checkbox.css'

class Checkbox extends Component {
  constructor(props){
    super(props)
    this.state = {
      check: false
    }
  }
  render() {
    var label = this.props.label;
    return (
    <React.Fragment>
      <div>
        <label className="container-checkbox">{label}
          <input type="checkbox" value={this.state.check}/>
          <span className="checkmark"></span>
        </label>
      </div>
    </React.Fragment>
    )    
  }
}
export default Checkbox;
