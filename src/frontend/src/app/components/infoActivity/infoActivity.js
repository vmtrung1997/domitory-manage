import React, { Component } from 'react'
import PropTypes from 'prop-types';

import './infoActivity.css' 

class InfoActivity extends Component{
	constructor(props){
	    super(props)
	}
	static propTypes = {
	    name: PropTypes.string,
	    time: PropTypes.string,
	    location: PropTypes.string,
	    rule: PropTypes.string,
	    status: PropTypes.string,
	}
	static defaultProps = {
	    name: '',
	    time: '',
	    location: '',
	    rule: 'Hoạt động không bắt buộc',
	    status: 'Chưa tổ chức',
	}
	render(){
		return(
			<div className="form-acivity">
				<div> {this.props.name} </div>
				<div> {this.props.time} </div>
				<div> {this.props.location} </div>
				<div> {this.props.rule} </div>
				<div> 
					<span> Tham gia </span>
					<input value="1"/>
					<span> Vắng </span>
				</div>
				<div> {this.props.status} </div>
			</div>
		)
	}
}

export default InfoActivity