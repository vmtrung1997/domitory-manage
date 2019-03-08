import React, { Component } from 'react'
import PropTypes from 'prop-types';

import './infoActivity.css'
import Button from './../button/button'

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
	    par: PropTypes.number,
	    unPar: PropTypes.number,
	}
	static defaultProps = {
	    name: '',
	    time: '',
	    location: '',
	    rule: 'không bắt buộc',
	    status: 'Chưa tổ chức',
	    par: 0,
	}

	render(){
		return(
			<div className="form-acivity">
				<div className='title-activity' style={{padding: '10px 20px'}}> 
					<span> {this.props.name} </span>
					<div className='icon-activity'>
						<i style={{	cursor: 'pointer' }} className="far fa-eye"></i>
						<i style={{	cursor: 'pointer' }} className="fas fa-paint-brush"></i>
						<i style={{	cursor: 'pointer' }} className="fas fa-trash-alt"></i>
					</div>
				</div>
				<div className='content-activity'>
					<div>
						<span> Địa điểm: {this.props.location} </span>
					</div>
					<div>
						<span> Thời gian: {this.props.time} </span>
					</div>
					<div> Hoạt động: {this.props.rule} </div>
					<div> 
						<span> Tham gia: </span>
						<input style={{width: '40px', textAlign: 'center'}} value={this.props.par}/>
					</div>
					<div> Tình trạng: {this.props.status} </div>
				</div>
			</div>
		)
	}
}

export default InfoActivity