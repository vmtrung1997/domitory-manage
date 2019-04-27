import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import './datePicker.css'
import "react-datepicker/dist/react-datepicker.css";
class MyDatePicker extends Component {

	static defaultProps = {
		getValue: () => {},
		width: '100%',
		fontSize: '20px',
		startDate: new Date(),
		dateFormat: 'd/MM/yyyy'
	}
	
	constructor(props) {
    super(props);
    this.state = {
      startDate: this.props.startDate
    };
    this.handleChange = this.handleChange.bind(this);
  }
 
  handleChange(date) {
		console.log(date);
    this.setState({
      startDate: date
		});
		this.props.getValue(date);
  }
	render() {
		return (
			<DatePicker
				style={{width: `${this.props.width}`, fontSize: `${this.props.fontSize}`}}
				className="input-control"
				selected={this.state.startDate}
				onChange={this.handleChange}
				dateFormat={this.props.dateFormat}
			/>
		);
	}
}

export default MyDatePicker;
