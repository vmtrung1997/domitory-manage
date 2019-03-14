import React, { Component } from 'react'
import { Table, Col } from 'react-bootstrap'
import axios from './../../config'

import './infoActivityTable.css'
import Confirm from './../confirm/confirm'

class InfoActivityTable extends Component{
	constructor(props){
		super(props)
		this.state = {
			show: false,
			id: ''
		}
	}
	static defaultProps = {
		handleSave: () => {},
	}
	handleDelete = (id) => {
		this.setState({ 
			show: true,
			id: id
		})
	}
	handleClose = () => {
		this.setState({ show: false })
	}
	handleSave = () => {
    	var secret = JSON.parse(localStorage.getItem('secret'))
		axios({
	      	method: 'post',
	      	url: `/manager/activity/delete?id=${this.state.id}`,
	      	headers: { 'x-access-token': secret.access_token }
	    })
		this.setState({ show: false })

    	this.props.handleSave()
    	console.log(12)
	}

	render(){
		const table = this.props.data.map((row, index) => {
			var curData = new Date();
			var date = new Date(row.ngay);
			var strDate = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`
			return (
				<tr key={index}>
					<td>{index + 1}</td>
					<td>{row.ten}</td>
					<td>{strDate}</td>
					<td>{row.diaDiem}</td>
					<td>{row.soLuong}</td>
					{row.batBuoc ? (
						<td style={{textAlign: 'center', color: '#04C913'}}> <i className="fas fa-check"></i> </td>
					):(
						<td>  </td>
					)}
					{curData > date ? (
						<td className='lb-done'> Hoàn thành </td>
					):(
						<td className="bt-delete"> <i onClick={() => {this.handleDelete(row._id)}} className="fas fa-trash-alt"></i> </td>
					)}
				</tr>
			)
		})
		return(
			<React.Fragment>
				<Confirm show={this.state.show} handleClose={this.handleClose} handleSave={this.handleSave}/>
				<Table bordered hover responsive size="sm" className="table-activity">
					<thead >
						<tr>
							<th>STT</th>
							<th>Hoạt động</th>
							<th>Thời gian</th>
							<th>Địa điểm</th>
							<th>Tham gia</th>
							<th>Bắt buộc</th>
							<th>Thao tác</th>
						</tr>
					</thead>
					<tbody>
						{table}
					</tbody>
				</Table>
			</React.Fragment>
		)
	}
}

export default InfoActivityTable