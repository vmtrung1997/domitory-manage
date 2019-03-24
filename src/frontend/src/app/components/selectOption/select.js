import React, { Component } from 'react';
import './select.css'

class Select extends Component {
  static defaultProps = {
		selected: () => {},
		value: () => { return this.props.options[0].value},
		disabled: false
  }
	onHandleChange = (event) => {
		event.persist();
		this.props.selected(event.target.value);
	}
	render() {
		let options = this.props.options && this.props.options.map(_option => {
			return <option key={_option.value} value={_option.value}>{_option.label}</option>
		});
		return (
			<React.Fragment>
				<select className="select-control" 
								defaultValue={this.props.value} 
								onChange={this.onHandleChange} 
								onSelect={this.onHandleChange} 
								disabled={this.props.disabled}>
					{options}
				</select>
			</React.Fragment>
		);
	}
}
export default Select;
