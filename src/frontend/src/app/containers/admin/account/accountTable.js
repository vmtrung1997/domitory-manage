import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from "react-toasts";
import axios from './../../../config'

import './accountTable.css'
import jwt_decode from 'jwt-decode';
import Confirm from './../../../components/confirm/confirm'
import refreshToken from './../../../../utils/refresh_token'
import Button from './../../../components/button/button'
import AccountEdit from './accountEdit'
import AccountDetail from './accountDetail'

class AccountTable extends Component{
	constructor(props){
		super(props)
		this.state = {
			dataEdit: {},
			dataDetail: {},
			showDelete: false,
			showEdit: false,
			showDetail: false,
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
	handleEdit = (data) => {
		this.setState({
			showEdit: true,
			dataEdit: data
		})
	}
	handleDetail = (data) => {
		this.setState({
			showDetail: true,
			dataDetail: data
		})
	}
	handleSaveEdit = (state) => {
		this.setState({ [state]: false })
		this.props.refresh()
	}
	handleSaveDelete = async () => {
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
	handleClose = (state) => {
		this.setState({ [state]: false })
	}

	render(){
		const token = JSON.parse(localStorage.getItem('secret'));
		const decode = jwt_decode(token.access_token)
		const userId = decode.user.userEntity ? decode.user.userEntity.id : ""
		const table = this.props.data.map((row, index) => {
			console.log(row)
			var rule = ''
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
				case 'ADCP':
					rule = 'Quản lý chi phí'
					break
				case 'GDN':
					rule = 'Ghi điện nước'
					break
				case 'DD':
					rule = 'Điểm danh'
					break
				default:
					break
			}
			return (
				<tr key={index} >
					<td>{index + 1}</td>
					<td className="lb-username" onClick={(e) => {this.handleDetail(row)}}>
						{row.username}
					</td>
					{ row.idProfile ?
						<td>{row.idProfile.hoTen}</td>
						:
						<td></td>
					}
					<td>{rule}</td>
					{userId !== row._id && row.isDelete === 0 ? (
						<td style={{textAlign: 'center'}}>
							<Button title={'Chỉnh sửa'} color={'warning'} style={{margin: '0 5px'}} onClick={(e) => {this.handleEdit(row)}}>
								<i className="fas fa-edit"></i>
							</Button>
							<Button title={'Xóa'} color={'danger'} onClick={(e) => {this.handleDelete(row._id)}}>
								<i className=" fas fa-trash-alt"></i>
							</Button>
						</td>
					) : (
						<td style={{textAlign: "center"}}> {row.isDelete === 1 ? 'Đã xoá': ''} </td>
					)}
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
					handleSave={() => this.handleSaveDelete()}
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
				{this.state.showDetail ?
					<AccountDetail
						show={this.state.showDetail}
						data={this.state.dataDetail}
						handleClose={() => this.handleClose('showDetail')}
					/>
					: <React.Fragment/>
				}
				<Table bordered hover responsive size="sm" className="table-activity">
					<thead className="title-table">
						<tr style={{textAlign: 'center'}}>
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
