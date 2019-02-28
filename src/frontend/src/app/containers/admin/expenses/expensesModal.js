import React from 'react'
import { Table, Row, Col, FormControl, Modal, Form } from 'react-bootstrap'
import Input from '../../../components/input/input'
import Button from '../../../components/button/button'
import Select from '../../../components/selectOption/select'
class Example extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      table: [],
      soDien: 1,
      soNuoc: 1
    };

  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  addRow = () => {

  }
  render() {
    var options = [{ value: 1, label: '101' }, { value: 2, label: '102' }]
    return (
      <>
        <Button color={"success"} onClick={this.handleShow}>
          Ghi bảng ghi
          </Button>

        <Modal show={this.state.show} onHide={this.handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Thêm chi phí</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className={'m-b-10'}>
              <Col md={4}>
                <Col md={12}><label>Phòng</label></Col>
                <Col md={12}><Select options={options} value={options[1].value} /></Col>
              </Col>
              <Col md={4}>
                <Col md={12}><label>Số điện</label></Col>
                <Col md={12}><Input /></Col>
              </Col>
              <Col md={4}>
                <Col md={12}><label>Số nước</label></Col>
                <Col md={12}><Input /></Col>
              </Col>
            </Row>
            <Row className={'m-b-10'}>
              <Col md={4}><Button color={'warning'} size={'md'} onClick={this.addRow}>Thêm</Button></Col>
            </Row>
            <Row>
              <Col>
                <Table striped hover responsive size="lg">
                  <thead>
                    <tr>
                      <th>Tháng/Năm</th>
                      <th>Phòng</th>
                      <th>Chỉ số điện</th>
                      <th>Chỉ số nước</th>
                    </tr>
                  </thead>
                  <tbody>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="default" color="default" onClick={this.handleClose}>
              Đóng
              </Button>
            <Button variant="default" onClick={this.handleClose}>
              Xác nhận
              </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default Example;