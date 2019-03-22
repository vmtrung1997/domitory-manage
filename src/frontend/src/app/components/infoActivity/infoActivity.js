import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import { Link, withRouter } from 'react-router-dom'
import axios from './../../config'

import './infoActivity.css'
import Confirm from './../confirm/confirm'
import refreshToken from './../../../utils/refresh_token'
import Button from './../button/button'
import ActivityEdit from './../../containers/admin/activity/activityEdit'
import ActivityRollCall from './../../containers/admin/activity/activityRollCall'

class InfoActivity extends Component{
	constructor(props){
		super(props)
		this.state = {
			dataEdit: {},
			showRollCall: false,
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
	handleSave = async () => {
		await refreshToken()
    	var secret = JSON.parse(localStorage.getItem('secret'))
		axios({
	      	method: 'post',
	      	url: `/manager/activity/delete?id=${this.state.id}`,
	      	headers: { 'x-access-token': secret.access_token }
	    })
	    this.setState({ showDelete: false })
		this.props.refresh()
	}
	handleEdit = (data) => {
		this.setState({
			showEdit: true,
			dataEdit: data
		})
	}

	handleClick = (id) => {
		this.props.history.push({
			pathname: `/admin/activity/detail/${id}`
		})
	}

	handleRollCall = (data) => {
		this.setState({
			showRollCall: true,
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
				<tr key={index} onDoubleClick={e => {this.handleClick(row._id)}}>
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
							<Button onClick={(e) => {this.handleRollCall(row)}}> 
								<i className="fas fa-poll-h"></i>
							</Button>
						</td>
					):(
						<td style={{textAlign: 'center'}}> 
							<Button onClick={(e) => {this.handleRollCall(row)}}>
								<i className="fas fa-poll-h"></i>
							</Button>
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
				<Confirm show={this.state.showDelete} handleClose={() => this.handleClose('showDelete')} handleSave={() => this.handleSave()}/>
				{this.state.showEdit ?
					<ActivityEdit 
						show={this.state.showEdit}
						data={this.state.dataEdit}
						handleClose={() => this.handleClose('showEdit')} 
						handleSave={() => this.handleClose('showEdit')}
					/>
					: <React.Fragment/>
				}
				{this.state.showRollCall ?
					<ActivityRollCall 
						show={this.state.showRollCall}
						data={this.state.dataEdit}
						handleClose={() => this.handleClose('showRollCall')} 
						handleSave={() => this.handleClose('showRollCall')}
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

export default withRouter(InfoActivity)