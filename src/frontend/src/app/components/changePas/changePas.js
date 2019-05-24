import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from "react-toasts";

import axios from './../../config'
import refreshToken from './../../../utils/refresh_token'
import Button from './../button/button'
import Input from './../input/input'

const initialState = {
  oldPas: '',
  newPas: '',
  confirmNewPas: ''
}

class ChangePas extends Component{
  static defaultProps = {
    show: false,
    handleClose: () => {},
  }
  constructor(props) {
    super(props)
    this.state = initialState
  }

  getValue = (key, val) => {
    this.setState({ [key]: val })
  }

  handleClose = () => {
    this.setState(initialState)
    this.props.handleClose()
  }

  handleSave = async () => {
    if(this.state.oldPas === '' || this.state.newPas === '' || this.state.confirmNewPas === ''){
      ToastsStore.error("Bạn phải nhập đầy đủ thông tin")
    } else if ( this.state.newPas !== this.state.confirmNewPas){
      ToastsStore.error("Mật khẩu xác nhận không trùng với mật khẩu mới")
    } else if ( this.state.newPas.length < 8){
      ToastsStore.error("Mật khẩu mới phải nhiều hơn 8 kí tự")
    } else {
      await refreshToken()
      const secret = JSON.parse(localStorage.getItem('secret'))
      axios({
        method: 'post',
        url:'/user/change-password-admin',
        data: {
          token: secret,
          oldPas: this.state.oldPas,
          newPas: this.state.newPas
        }
      })
      .then(res => {
        if(res.status === 200)
        {
          this.setState(initialState)
          ToastsStore.success("Đổi mật khẩu thành công!");
          this.props.handleClose()
        } else {
          ToastsStore.error("Mật khẩu không chính xác");
        }
      }).catch(err => {
        ToastsStore.error("Đổi mật khẩu không thành công");
      })
    }
  }
  
  render(){
    return(
      <React.Fragment>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>
        <Modal show={this.props.show} onHide={this.handleClose}>
              <Modal.Header closeButton>
                  <Modal.Title>Đổi mật khẩu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className='body-modal-add'>
                    <div className='field-add'>
                      <p> Mật khẩu cũ </p>
                      <p> Mật khẩu mới </p>
                      <p> Xác nhận mật khẩu mới </p>
                    </div>
                    <div style={{width: '60%'}}>
                      <Input
                        type='password'
                        getValue={ (obj) => this.getValue(obj.name, obj.value)}
                        name='oldPas'
                      />
                      <Input
                        type='password'
                        getValue={ (obj) => this.getValue(obj.name, obj.value)}
                        name='newPas'
                      />
                      <Input
                        type='password'
                        getValue={ (obj) => this.getValue(obj.name, obj.value)}
                        name='confirmNewPas'
                        onKeyPress={ (e) => {if(e.key === 'Enter') this.handleSave()}}
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

export default ChangePas