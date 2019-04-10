import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import TimeField from 'react-simple-timefield';
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from "react-toasts";
import axios from './../../../config'

import './accountAdd.css'
import refreshToken from './../../../../utils/refresh_token'
import Button from './../../../components/button/button'
import Input from './../../../components/input/input'
import CheckBox from './../../../components/checkbox/checkbox'
import Select from './../../../components/selectOption/select'

class AccountAdd extends Component{
	static defaultProps = {
		show: false,
		handleClose: () => {},
		handleSave: () => {},
	}
  constructor(props){
    super(props)
    var today = new Date()
    var time = today.getHours() + ':' + today.getMinutes()
    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      name: '',
      CMND: '',
      Email: '',
      rule: 'SA',
      school: '',
      MSSV: ''
    }
  }

  componentWillMount = async () => {
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
  getValue = (name, val) => {
    this.setState({ [name]: val })
  }

  handleSave = async () => {
    if(this.state.password === this.state.confirmPassword){
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
          school: this.state.school,
          MSSV: this.state.MSSV
        }
      }).then(res => {
        ToastsStore.success("Thêm tài khoản thành công!");
      }).catch(err => {
        if(err.response.status === 409){
          ToastsStore.error("Tài khoản đã tồn tại!");
        }
        else{
          ToastsStore.error("Thêm tài khoản không thành công!");
        }
      })
      this.props.handleSave()
    } else {
      ToastsStore.error("Mật khẩu không trùng khớp!");
    }
  }

  getRule = () => {
    return [
      {value: 'SA', label: 'Trưởng quản lý'},
      {value: 'AM', label: 'Quản lý'},
      {value: 'BV', label: 'Bảo vệ'},
      {value: 'SV', label: 'Sinh viên'},
    ]
  }
  
	render(){
    var rule = this.getRule()
    var school = this.state.listSchool

		return(
      <React.Fragment>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>
  			<Modal show={this.props.show} onHide={this.props.handleClose}>
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
                    { this.state.rule === 'SV' ?
                      <React.Fragment>
                        <p> Trường </p>
                        <p> MSSV </p>
                      </React.Fragment>
                      :
                      <React.Fragment/>
                    }
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
                    { this.state.rule === 'SV' ?
                      <React.Fragment>
                        <Select 
                          options={school} 
                          value={this.state.school} 
                          selected={val => this.getValue('school',val)} 
                        />
                        <Input
                          getValue={ (obj) => this.getValue(obj.name, obj.value)}
                          name='MSSV'
                        />
                      </React.Fragment>
                      :
                      <React.Fragment/>
                    }
                  </div>
            		</Modal.Body>
            		<Modal.Footer>
  	            	<Button variant='default' color='default' onClick={this.props.handleClose}>
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