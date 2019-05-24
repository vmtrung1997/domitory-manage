import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from "react-toasts";

import axios from './../../../config'
import refreshToken from './../../../../utils/refresh_token'
import Button from './../../../components/button/button'
import Input from './../../../components/input/input'

const initialState = {
    username: '',
    email: ''
};

class ForgotPassword extends Component{
  static defaultProps = {
    show: false,
    handleClose: () => {},
  }
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      email: ''
    }
  }

  getValue = (key, val) => {
    this.setState({ [key]: val })
  }

  handleClose = () => {
    this.setState(initialState)
    this.props.handleClose()
  }

  handleSave = async () => {
    await refreshToken()
    axios({
      method: 'post',
      url:'/user/reset-password-admin',
      data: {
        username: this.state.username,
        email: this.state.email
      }
    })
    .then(res => {
      this.setState(initialState)
      ToastsStore.success("Đã gửi mật khẩu mới về email đã đăng ký!");
      this.props.handleClose()
      
    }).catch(err => {
      ToastsStore.error( err.response.data.msg );
    })
  }
  
  render(){
    return(
      <React.Fragment>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>
        <Modal show={this.props.show} onHide={this.handleClose}>
              <Modal.Header closeButton>
                  <Modal.Title>Quên mật khẩu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div style={{fontSize: '13px', marginBottom: '10px', color: '#BABABA'}}> 
                    * Chúng tôi sẽ gửi mật khẩu mới vào địa chỉ email được đăng ký bởi tài khoản
                  </div>
                  <div className='body-modal-add'>
                    <div className='field-add'>
                      <p> Tài khoản </p>
                      <p> Địa chỉ email </p>
                    </div>
                    <div style={{width: '60%'}}>
                      <Input
                        getValue={ (obj) => this.getValue(obj.name, obj.value)}
                        name='username'
                      />
                      <Input
                        getValue={ (obj) => this.getValue(obj.name, obj.value)}
                        name='email'
                      />
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant='default' color='default' onClick={this.handleClose}>
                    Đóng
                  </Button>
                  <Button variant='default' color='primary' onClick={this.handleSave}>
                    Xác nhận
                  </Button>
              </Modal.Footer>
        </Modal>
      </React.Fragment>
    )
  }
}

export default ForgotPassword