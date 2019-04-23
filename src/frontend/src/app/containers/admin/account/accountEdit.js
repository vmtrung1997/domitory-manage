import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import TimeField from 'react-simple-timefield';
import axios from './../../../config'
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from "react-toasts";

import refreshToken from './../../../../utils/refresh_token'
import Button from './../../../components/button/button'
import Input from './../../../components/input/input'
import CheckBox from './../../../components/checkbox/checkbox'
import Select from './../../../components/selectOption/select'

class AccountEdit extends Component{
	static defaultProps = {
		show: false,
		handleClose: () => {},
		handleSave: () => {},
	}

  constructor(props){
    super(props)
    this.state = {
      name: '',
      rule: '',
    }
  }

  componentWillMount(){
    this.setState({
      name: this.props.data.username,
      rule: this.props.data.loai
    })
  }

  getValue = (name, val) => {
    this.setState({ [name]: val })
  }

  handleSave = async () => {
    await refreshToken()
    var secret = JSON.parse(localStorage.getItem('secret'))
    axios({
      method: 'post',
      url: `/manager/account/update_account?id=${this.props.data._id}`,
      headers: { 
        'Content-Type': 'application/json',
        'x-access-token': secret.access_token
      },
      data:{
        rule: this.state.rule
      }
    }).then(res => {
      ToastsStore.success("Chỉnh sửa tài khoản thành công!");
    }).catch(err => {
      ToastsStore.error("Chỉnh sửa tài khoản không thành công!");
    })

    this.props.handleSave()
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

		return(
      <React.Fragment>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>
  			<Modal show={this.props.show} onHide={this.props.handleClose} style={{marginTop: '-20px'}}>
          		<Modal.Header closeButton>
              		<Modal.Title>Chỉnh sửa tài khoản</Modal.Title>
            		</Modal.Header>
            		<Modal.Body>
            			<div>
            				<span> Tài khoản </span>
                    <Input
                      disabled={true}
                      value={this.state.name}
                      getValue={ (obj) => this.getValue(obj.name, obj.value)}
                      name='name'
                    />
            			</div>
                  <div>
                    <span> Tài khoản </span>
              			<Select 
                      options={rule} 
                      value={this.state.rule} 
                      selected={val => this.getValue('rule',val)} 
                    />
            			</div>              
            		</Modal.Body>
            		<Modal.Footer>
  	            	<Button variant='default' color='default' onClick={this.props.handleClose}>
  	            		Đóng
  	            	</Button>
  	            	<Button variant='default' onClick={this.handleSave}>
  	            		Lưu
  	              	</Button>
          		</Modal.Footer>
        </Modal>
      </React.Fragment>
		)
	}
}

export default AccountEdit