import React from 'react'

class InputDatePicker extends React.Component {
    render () {
      return (
        <button
          className="dt"
          onClick={this.props.onClick}>
          <i className="far fa-calendar-alt"></i>
          {this.props.value}
        </button>
        
      )
    }
  }

  export default InputDatePicker