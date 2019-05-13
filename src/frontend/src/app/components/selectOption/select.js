import React, { Component } from 'react';
import './select.css'
import ReactSelect from 'react-select';

const customStyle = {
	indicatorSeparator: styles => ({
		...styles,
		display: 'none'
	}),
	dropdownIndicator: styles => ({
		...styles,
		paddingTop: '0'
	}),
	menu: styles => ({
		...styles,
		marginTop: '0',
		marginLeft: '1px',
		marginRight: '-1px',
		borderRadius: '0'
	}),
	control: (styles, state) => ({
		...styles,
		backgroundColor: 'white',
		border: state.isFocused ? '1px solid #1ab394 !important' : '1px solid #e5e6e7 !important',
		borderRadius: '1px',
		height: 0,
    outline: state.isFocused ? 'transparent !important' : 'transparent !important',
    boxShadow: '0 1px transparent !important',
		marginBottom: '10px'
	}),
	input: styles => ({
		...styles,
		outline: 'transparent !important',
		top: 0
	}),
	singleValue: styles => ({
		...styles,
		top: '40%'
	}),
}
class Select extends Component {
	static defaultProps = {
		selected: () => { },
		onChange: () => { },
		value: () => { return this.props.options[0].value },
		disabled: false,
		isSearchable: false,
		placeholder: ''
	}
	// constructor(props){
	// 	super(props);
	// 	this.state = {
  //     value: () => { return this.props.options[0].value },
  //   }
	// }
	onHandleChange = (event) => {
		event.persist();
		this.props.selected(event.target.value);
	}
	render() {
		console.log('==renser select', this.props.value)
		return (
			<React.Fragment>
				{this.props.isSearchable ?
					<ReactSelect
						styles={customStyle}
						placeholder={this.props.placeholder}
						isSearchable={true}
						value={this.props.value}
						onChange={this.props.onChange}
						options={this.props.options} /> :
					<select className="select-control"
						defaultValue={this.props.value}
						onChange={this.onHandleChange}
						onSelect={this.onHandleChange}
						disabled={this.props.disabled}>

						{this.props.options && this.props.options.map(_option => {
							return <option key={_option.value} value={_option.value}>{_option.label}</option>
						})}

					</select>
				}
			</React.Fragment>
		);
	}
}
export default Select;
