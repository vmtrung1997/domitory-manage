import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import { withRouter, Link } from 'react-router-dom'
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from "react-toasts";
import axios from './../../config'
import jwt_decode from 'jwt-decode'
import { saveAs } from 'file-saver'

import Loader from './../loader/loader'
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
	handleSaveEdit = (state) => {
		this.setState({ [state]: false })
		this.props.refresh()
	}
	handleSave = async () => {
		await refreshToken()
    	var secret = JSON.parse(localStorage.getItem('secret'))
		axios({
	      	method: 'post',
	      	url: `/manager/activity/delete?id=${this.state.id}`,
	      	headers: { 'x-access-token': secret.access_token }
	    }).then(res => {
	    	ToastsStore.success("Xóa hoạt động thành công!");
	    }).catch(err => {
	    	ToastsStore.error("Xóa hoạt động không thành công!");
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
	handleRollCall = (data) => {
		this.setState({
			showRollCall: true,
			dataEdit: data
		})
	}
	handleExport =  async (data) => {
		await refreshToken()
		this.setState({ loading: true })
    	var secret = JSON.parse(localStorage.getItem('secret'))
		axios({
	      	method: 'post',
	      	url: '/manager/activity/export_detail_activity',
	      	headers: { 'x-access-token': secret.access_token },
	      	data: {
	        	data: data
	        }
	    }).then(res => {
	    	var byteCharacters = window.atob(res.data.file);
	        var byteNumbers = new Array(byteCharacters.length);
	        for (var i = 0; i < byteCharacters.length; i++) {
	          byteNumbers[i] = byteCharacters.charCodeAt(i);
	        }
	        var byteArray = new Uint8Array(byteNumbers);
	        var blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
	        
	        saveAs(blob, res.data.filename) 

	        this.setState({ loading: false }) 
        	ToastsStore.success("Xuất file báo cáo hoạt động thành công!");
	    }).catch(err => {
	    	this.setState({ loading: false })
	    	ToastsStore.error("Xuất báo  hoạt động không thành công!");
	   })
	}
	render(){
		const secret = JSON.parse(localStorage.getItem('secret'))
		const user = jwt_decode(secret.access_token).user
      	const isAdmin = user.userEntity.loai === 'DD' ? false : true

		const table = this.props.data.map((row, index) => {
			var curData = new Date();
			var date = new Date(row.ngayBD);
			var strDate = date.toLocaleDateString('en-GB')
			var url = `/admin/activity/detail/${row._id}`
			var strTime = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})

			return (
				<tr key={index} >
					<td>{index + 1}</td>
					<td style={{maxWidth: '500px'}}>
						<Link to={url}>{row.ten}</Link>
					</td>
					<td>{strTime}</td>
					<td>{strDate}</td>
					<td>{row.diaDiem}</td>
					{row.batBuoc ? (
						<td style={{textAlign: 'center', color: '#04C913'}}> <i className="fas fa-check"></i> </td>
					):(
						<td>  </td>
					)}
					<td style={{textAlign: 'center'}}> 
						<Button title={'Điểm danh'} color={'success'} onClick={(e) => {this.handleRollCall(row)}}>
							<i className="fas fa-poll-h"></i>
						</Button>
						{curData > date || !isAdmin ? (
							<React.Fragment/>
						):(
							<>
							<Button title={'Chỉnh sửa'} color={'warning'} style={{margin: '0 5px'}} onClick={(e) => {this.handleEdit(row)}}>
								<i className="fas fa-edit"></i>
							</Button>
							<Button title={'Xóa'} color={'danger'} onClick={(e) => {this.handleDelete(row._id)}}>
								<i className=" fas fa-trash-alt"></i>
							</Button>
							</>
						)}
						<Button title={'Xuất báo cáo'} onClick={() => this.handleExport(row)}  style={{margin: '0 5px'}}>
            				<i className="fas fa-file-export"/>
            			</Button>
					</td>
				</tr>
			)
		})

		return(
			<React.Fragment>
		        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>
		        <Loader loading={this.state.loading}/>
				<Confirm 
					show={this.state.showDelete}
					title={'Xóa hoạt động'}
					content={'Bạn có muốn xóa hoạt động này !'}
					handleClose={() => this.handleClose('showDelete')}
					handleSave={() => this.handleSave()}
				/>
				{this.state.showEdit ?
					<ActivityEdit 
						show={this.state.showEdit}
						data={this.state.dataEdit}
						handleClose={() => this.handleClose('showEdit')} 
						handleSave={() => this.handleSaveEdit('showEdit')}
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
					<thead className="title-table">
						<tr style={{textAlign: 'center'}}>
							<th>STT</th>
							<th>Hoạt động</th>
							<th>Thời gian</th>
							<th>Ngày</th>
							<th>Địa điểm</th>
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