import React from 'react'
import { Modal, Row, Col } from 'react-bootstrap'
import Button from '../../../components/button/button'
import Checkbox from '../../../components/checkbox/checkbox'
import Input from '../../../components/input/input'
import Select from '../../../components/selectOption/select'
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
class Example extends React.Component {
  
  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: false,
      edit: false
    }
  }
  componentDidMount(){
  }
  handleClose() {
    this.setState({ show: false});
  }
  handleEdit = () => {
    this.setState({edit: true})
  }
  handleShow() {
    this.setState({ show: true });
  }
  
  handleSubmit = () => {
    
  }
  handleCheck = () => {

  }
  statusSelected = () => {

  }
  render() {
    var trangThai = [
			{ value: 2, label: 'Tất cả' },
			{ value: 1, label: 'Đã thanh toán' },
			{ value: 0, label: 'Chưa thanh toán' }]
    return (
      <>
        <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} lightBackground store={ToastsStore}/>
        <Button title={'Xuất báo cáo'} onClick={this.handleShow}>
        <i className="fas fa-file-export" />
				</Button>
        <Modal show={this.state.show} onHide={this.handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Xuất báo cáo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
              Từ tháng
              <Input />
              </Col>
              <Col>
              Đến tháng
              <Input />
              </Col>
            </Row>
            <Row>
              <Col>Phòng
              <Input /></Col>
              <Col>Trạng thái
              <Select options={trangThai} selected={this.statusSelected} /></Col>
            </Row>
            <Row>
              <Col><Checkbox label={'Số điện trong tháng'} value={false} name={'sdtt'} isCheck={this.handleCheck}/></Col>
              <Col><Checkbox label={'Số nước trong tháng'} value={false} name={'sntt'} isCheck={this.handleCheck}/></Col>
            </Row>
            <Row>
              <Col><Checkbox label={'Số điện hiện tại'} value={false} name={'sdht'} isCheck={this.handleCheck}/></Col>
              <Col><Checkbox label={'Số nước hiện tại'} value={false} name={'snht'} isCheck={this.handleCheck}/></Col>
            </Row>
            <Row>
              <Col><Checkbox label={'Tiền rác'} value={false} name={'tr'} isCheck={this.handleCheck}/></Col>
              <Col><Checkbox label={'Tổng tiền (bằng số)'} value={false} name={'ttbs'} isCheck={this.handleCheck}/></Col>
            </Row>
            <Row>
              
              <Col><Checkbox label={'Tổng tiền (bằng chữ)'} value={false} name={'ttbc'} isCheck={this.handleCheck}/></Col>
              <Col></Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="default" color="default" onClick={this.handleClose}>
              Đóng
            </Button>
            <Button variant="default" onClick={this.handleSubmit}>
              Thực hiện
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default Example;