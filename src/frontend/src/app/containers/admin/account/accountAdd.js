import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from "react-toasts";
import axios from './../../../config'

import './accountAdd.css'
import refreshToken from './../../../../utils/refresh_token'
import Button from './../../../components/button/button'
import Input from './../../../components/input/input'
import Select from './../../../components/selectOption/select'

const initialState = {
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
  CMND: '',
  Email: '',
  rule: 'SA', 
}

class AccountAdd extends Component{
	static defaultProps = {
		show: false,
		handleClose: () => {},
		handleSave: () => {},
	}
  constructor(props){
    super(props)
    this.state = initialState
  }

  getValue = (name, val) => {
    this.setState({ [name]: val })
  }

  getRule = () => {
    return [
      {value: 'SA', label: 'Trưởng quản lý'},
      {value: 'AM', label: 'Quản lý'},
      {value: 'BV', label: 'Bảo vệ'},
      {value: 'ADCP', label: 'Quản lý chi phí'},
      {value: 'GDN', label: 'Ghi chi phí'},
      {value: 'DD', label: 'Điểm danh'}
    ]
  }

  handleSave = async () => {
    var {username, password, confirmPassword, name, CMND, Email} = this.state
    if(!username || !password || !confirmPassword || !name || !CMND || !Email)
    {
      ToastsStore.error("Bạn phải nhập đầy đủ thông tin!");
    } else if (password !== confirmPassword){
      ToastsStore.error("Mật khẩu không trùng khớp!");
    } else {
      await refreshToken()
        var secret = JSON.parse(localStorage.getItem('secret'))
        axios({
          method: 'post',
          url: '/manager/account/add_account',
          headers: { 
            'Content-Type': 'application/json',
            'x-access-token': secret.access_token
          },
          data:{
            username: this.state.username,
            password: this.state.password,
            name: this.state.name,
            CMND: this.state.CMND,
            Email: this.state.Email,
            rule: this.state.rule,
          }
        }).then(res => {
          ToastsStore.success("Thêm tài khoản thành công!");
        }).catch(err => {
           ToastsStore.error( err.response.data.ms );
        })
        this.setState(initialState)
        this.props.handleSave()
    } 
  }

  handleClose = () => {
    this.setState(initialState)
    this.props.handleClose()
  }
  
	render(){
    var rule = this.getRule()

		return(
      <React.Fragment>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>
  			<Modal show={this.props.show} onHide={this.handleClose}>
          		<Modal.Header closeButton>
              		<Modal.Title>Thêm tài khoản</Modal.Title>
            		</Modal.Header>
            		<Modal.Body className='body-modal-add'>
                  <div className='field-add'>
                    <p> Họ tên </p>
                    <p> CMND/Căn cước </p>
                    <p> Email </p>
                    <p> Tài khoản </p>
                    <p> Mật khẩu </p>
            		    <p> Nhập lại mật khẩu </p>
                    <p> Loại tài khoản </p>
                  </div>
                  <div style={{width: '60%'}}>
                    <Input
                      getValue={ (obj) => this.getValue(obj.name, obj.value)}
                      name='name'
                    />
                    <Input
                      getValue={ (obj) => this.getValue(obj.name, obj.value)}
                      name='CMND'
                    />
                    <Input
                      getValue={ (obj) => this.getValue(obj.name, obj.value)}
                      name='Email'
                    />
                    <Input
                      getValue={ (obj) => this.getValue(obj.name, obj.value)}
                      name='username'
                    />
                    <Input
                      type='password'
                      getValue={ (obj) => this.getValue(obj.name, obj.value)}
                      name='password'
                    />
                    <Input
                      type='password'
                      getValue={ (obj) => this.getValue(obj.name, obj.value)}
                      name='confirmPassword'
                    />
                    <Select 
                      options={rule} 
                      value={this.state.rule} 
                      selected={val => this.getValue('rule',val)} 
                    />
                  </div>
            		</Modal.Body>
            		<Modal.Footer>
  	            	<Button variant='default' color='default' onClick={this.handleClose}>
  	            		Đóng
  	            	</Button>
  	            	<Button variant='default' onClick={this.handleSave}>
  	            		Xác nhận
  	              	</Button>
          		</Modal.Footer>
        </Modal>
      </React.Fragment>
		)
	}
}

export default AccountAdd