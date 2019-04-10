import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import { withRouter, Link } from 'react-router-dom'
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from "react-toasts";
import axios from './../../../config'

import Confirm from './../../../components/confirm/confirm'
import refreshToken from './../../../../utils/refresh_token'
import Button from './../../../components/button/button'
import AccountEdit from './accountEdit'

class AccountTable extends Component{
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
	handleSaveEdit = (state) => {
		this.setState({ [state]: false })
		this.props.refresh()
	}
	handleSave = async () => {
		await refreshToken()
    	var secret = JSON.parse(localStorage.getItem('secret'))
		axios({
	      	method: 'post',
	      	url: `/manager/account/delete_account?id=${this.state.id}`,
	      	headers: { 'x-access-token': secret.access_token }
	    }).then(res => {
	    	ToastsStore.success("Xóa tài khoản thành công!");
	    }).catch(err => {
	    	ToastsStore.error("Xóa tài khoản không thành công!");
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

	render(){
		const table = this.props.data.map((row, index) => {
			var rule = ''
			var url = `/admin/activity/detail/${row._id}`
			switch(row.loai){
				case 'SA':
					rule = 'Trưởng quản lý'
					break
				case 'AM':
					rule = 'Quản lý'
					break
				case 'BV':
					rule = 'Bảo vệ'
					break
				case 'SV':
					rule = 'Sinh viên'
					break
				default:
					break
			}
			return (
				<tr key={index} >
					<td>{index + 1}</td>
					<td style={{maxWidth: '500px'}}>
						<Link to={url}>{row.username}</Link>						
					</td>
					{ row.idProfile ? 
						<td>{row.idProfile.hoTen}</td>
						:
						<td></td>
					}
					<td>{rule}</td>
					<td style={{textAlign: 'center'}}> 
						<Button title={'Chỉnh sửa'} color={'warning'} style={{margin: '0 5px'}} onClick={(e) => {this.handleEdit(row)}}>
							<i className="fas fa-edit"></i>
						</Button>
						<Button title={'Xóa'} color={'danger'} onClick={(e) => {this.handleDelete(row._id)}}>
							<i className=" fas fa-trash-alt"></i>
						</Button>
					</td>
				</tr>
			)
		})

		return(
			<React.Fragment>
		        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>
				<Confirm 
					show={this.state.showDelete}
					title={'Xóa tài khoản'}
					content={'Bạn có muốn xóa tài khoản này !'}
					handleClose={() => this.handleClose('showDelete')}
					handleSave={() => this.handleSave()}
				/>
				{this.state.showEdit ?
					<AccountEdit 
						show={this.state.showEdit}
						data={this.state.dataEdit}
						handleClose={() => this.handleClose('showEdit')} 
						handleSave={() => this.handleSaveEdit('showEdit')}
					/>
					: <React.Fragment/>
				}
				<Table bordered hover responsive size="sm" className="table-activity">
					<thead style={{background: '#cfcfcf', textAlign: 'center'}}>
						<tr>
							<th>STT</th>
							<th>Tài khoản</th>
							<th>Chủ tài khoản</th>
							<th>Phân quyền</th>
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

export default withRouter(AccountTable)