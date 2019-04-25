import React from 'react'
import { Modal } from 'react-bootstrap'
import Button from '../../../components/button/button'
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import {require_expense} from './expensesAction'
import Input from '../../../components/input/input';
import md5 from 'md5'
class Example extends React.Component {
  
  constructor(props, context) {
    super(props, context);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: true,
      edit: false,
      pass: ''
    }
  }
  handleClose() {
    this.setState({ show: false, pass: ''});
  }
  handleEdit = () => {
    this.setState({edit: true})
  }
  handleSubmit = () => {
    var self = this;
    var pass = this.state.pass
    require_expense({pass: pass}).then(result => {
      if (result.data.rs === 'success'){
        ToastsStore.success("Yêu cầu thành công");
        this.props.require(true);
        self.handleClose()
      } else{
        this.props.require(false);
        ToastsStore.error("Mật khẩu không chính xác");
      }
    }).catch(err => {
      this.props.require(false);
      ToastsStore.error("Có lỗi xảy ra");
    })
  }
  getValue = (target) => {
    this.setState({pass: md5(target.value)})
  }
  render() {
    return (
      <>
        <Modal show={this.state.show} onHide={this.handleClose} size="sm">
          <Modal.Header>
            <Modal.Title>Xác nhận mật khẩu</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          Nhập mật khẩu
          <Input getValue={this.getValue} type={'password'} onKeyPress={ (e) => {if(e.key === 'Enter') this.handleSubmit()}}/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="default" color="default" onClick={this.handleSubmit}>
              Xác nhận
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default Example;