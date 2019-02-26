import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Select.css'

class Select extends Component {
	static propTypes = {
    options: PropTypes.array.isRequired,
    defaultValue: PropTypes.object.isRequired,
  }
  static defaultProps = {
    selected: () => {}
  }
	onHandleChange = (event) => {
		event.persist();
		this.props.selected(event.target.value);
	}
	render() {
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