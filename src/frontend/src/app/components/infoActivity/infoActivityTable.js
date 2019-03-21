import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from './../../config'

import './infoActivityTable.css'
import Confirm from './../confirm/confirm'
import refreshToken from './../../../utils/refresh_token'
import Button from './../button/button'
import ActivityEdit from './../../containers/admin/activity/activityEdit'

class InfoActivityTable extends Component{
	constructor(props){
		super(props)
		this.state = {
			dataEdit: {},
			showDelete: false,
			showEdit: false,
			id: ''
		}
	}
	static defaultProps = {
		refresh: () => {}
	}
	handleDelete = (id) => {
		this.setState({ 
			showDelete: true,
			id: id
		})
	}
	handleClose = (state) => {
		this.setState({ [state]: false })
	}
	handleSave = async (state) => {
		await refreshToken()
    	var secret = JSON.parse(localStorage.getItem('secret'))
		axios({
	      	method: 'post',
	      	url: `/manager/activity/delete?id=${this.state.id}`,
	      	headers: { 'x-access-token': secret.access_token }
	    })
		this.setState({ [state]: false })
		this.props.refresh()
	}
	handleEdit = (data) => {
		this.setState({
			showEdit: true,
			dataEdit: data
		})
	}

	render(){
		const table = this.props.data.map((row, index) => {
			var curData = new Date();
			var date = new Date(row.ngay);
			var strDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
			var url = `/admin/activity/detail/${row._id}`
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
						<td className='lb-done'>
							<Link to={url}>
								<Button> 
									<i className="fas fa-poll-h"></i>
								</Button>
							</Link>
						</td>
					):(
						<td style={{textAlign: 'center'}}> 
							<Link to={url}>
								<Button>
									<i className="fas fa-poll-h"></i>
								</Button>
							</Link>
							<Button color={'warning'} style={{margin: '0 5px'}} onClick={(e) => {this.handleEdit(row)}}>
								<i className="fas fa-edit"></i>
							</Button>
							<Button color={'danger'} onClick={(e) => {this.handleDelete(row._id)}}>
								<i className=" fas fa-trash-alt"></i>
							</Button>
						</td>
					)}
				</tr>
			)
		})

		return(
			<React.Fragment>
				<Confirm show={this.state.showDelete} handleClose={() => this.handleClose('showDelete')} handleSave={() => this.handleSave('showDelete')}/>
				{this.state.showEdit ?
					<ActivityEdit 
						show={this.state.showEdit}
						data={this.state.dataEdit}
						handleClose={() => this.handleClose('showEdit')} 
						handleSave={() => this.handleSave('showEdit')}
					/>
					: <React.Fragment/>
				}
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