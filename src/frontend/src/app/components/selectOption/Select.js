import React, { Component } from 'react';
import './Select.css'

class Select extends Component {
	onHandleChange = (event) => {
		event.persist();
		this.props.selected(event.target.value);
	}
	render() {
		const select = this.props.placeholder;
		let options = this.props.options.map(_option => {
			return <option key={_option.value} value={_option.value}>{_option.label}</option>
		});
		return (
			<React.Fragment>
				<select className="select-control" defaultValue={this.props.value} onChange={this.onHandleChange} onSelect={this.onHandleChange}>
					{options}
				</select>
			</React.Fragment>
		);
	}
}
export default Select;
