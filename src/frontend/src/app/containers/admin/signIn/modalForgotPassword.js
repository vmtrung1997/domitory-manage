import React, { Component } from 'react'
import { Table, Modal } from 'react-bootstrap'
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from "react-toasts";

import axios from './../../../config'
import refreshToken from './../../../../utils/refresh_token'
import Button from './../../../components/button/button'

class ForgotPassword extends Component{
  static defaultProps = {
    show: false,
    handleClose: () => {},
  }
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render(){
    return(
      <React.Fragment>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>
        <Modal show={this.props.show} onHide={this.props.handleClose} >
              <Modal.Header closeButton>
                  <Modal.Title>Đổi mật khẩu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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

export default ForgotPassword