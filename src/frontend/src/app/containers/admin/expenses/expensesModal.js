import React from 'react'
import { Table, Button, Row, Col, FormControl, Modal, Form } from 'react-bootstrap'
class Example extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false,
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    return (
      <>
        <Button variant="success" onClick={this.handleShow}>
          Thêm
          </Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Thêm chi phí</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className={'m-b-10'}>
              <Col sm={4}>
                <Form.Control as="select">
                  <option>101</option>
                  <option>102</option>
                  <option>103</option>
                  <option>104</option>
                  <option>105</option>
                </Form.Control>
              </Col>
              <Col sm={4}><FormControl placeholder="Số điện" /></Col>
              <Col sm={4}><FormControl placeholder="Số nước" /></Col>
            </Row>
            <Row className={'m-b-10'}>
              <Col sm={4}><Button variant="success">Thêm</Button></Col>
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
            <Button variant="secondary" onClick={this.handleClose}>
              Đóng
              </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Xác nhận
              </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default Example;