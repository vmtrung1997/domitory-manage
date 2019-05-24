import React, { Component } from 'react'
import axios from 'axios'
import { Modal } from 'react-bootstrap'

import './accountDetail.css'
import refreshToken from './../../../../utils/refresh_token'
import Input from './../../../components/input/input'
import Button from './../../../components/button/button'

class AccountDetail extends Component{
	constructor(props){
		super(props)
		this.state = {
			loading: false,
		}
	}
	componentDidMount = async () => {
		await refreshToken()
	    let secret = JSON.parse(localStorage.getItem('secret'))
	    axios.get('/manager/getElement/truong',  {
	      headers: { 'x-access-token': secret.access_token }
	    }).then(result => {
	      this.setState({ 
	        listSchool: result.data.map(truong => ({ value: truong._id, label: truong.tenTruong }))
	      })

	    }).catch(err => {})
	}
	render(){
		const data  = this.props.data
		var isStudent = false
		var rule = ''
		switch(data.loai){
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
				isStudent = true
				break
			default:
				break
		}
		if(!data.idProfile){
			return( <React.Fragment/>)
		} else {
			return(
				<React.Fragment>
		  			<Modal show={this.props.show} onHide={this.props.handleClose}>
		          		<Modal.Header closeButton>
		              		<Modal.Title>Thông tin chủ tài khoản</Modal.Title>
		            		</Modal.Header>
		            		<Modal.Body className='body-modal-add'>
		                  <div className='field-add'>
		                    <p> Họ tên </p>
		                    <p> CMND/Căn cước </p>
		                    <p> Email </p>
		                    <p> Tài khoản </p>
		                    <p> Loại tài khoản </p>
		                    { isStudent ? (
								<React.Fragment>
		                    		<p> MSSV </p>
								</React.Fragment>
		                    ):(
								<React.Fragment/>	                    	 
		                    )}
		                  </div>
		                  <div style={{width: '60%'}}>
		                    <Input value={data.idProfile.hoTen} disabled={true}/>
		                    <Input value={data.idProfile.CMND} disabled={true}/>
		                    <Input value={data.idProfile.email} disabled={true}/>
		                    <Input value={data.username} disabled={true}/>
		                    <Input value={rule} disabled={true}/>
		                    { isStudent ? (
				                <Input value={data.idProfile.MSSV} disabled={true}/>
		                    ):(
								<React.Fragment/>	                    	 
		                    )}
		                  </div>
		            		</Modal.Body>
		            		<Modal.Footer>
		  	            	<Button variant='default' color='default' onClick={this.props.handleClose}>
		  	            		Đóng
		  	            	</Button>
		          		</Modal.Footer>
		        	</Modal>
				</React.Fragment>
			)
		}
	}
}

export default AccountDetail