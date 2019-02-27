import React from 'react'
import { Table, Button, Row, Col, FormControl, Modal } from 'react-bootstrap'
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
            <Row className={'m-b-10 justify-content-md-center'}>
						<Col sm={4}><FormControl placeholder="Tháng/năm" /></Col>
						<Col sm={4}><FormControl placeholder="Phòng" /></Col>
						<Col sm={4}><Button variant="success">Tìm kiếm</Button></Col>
					</Row>
					<Row className={'m-b-10'}>
						<Button variant="success">Thêm bảng</Button>
					</Row>
					<Row>
                <Table striped hover responsive size="lg">
                  <thead>
                    <tr>
                      <td>Tháng/Năm</td>
                      <td>Phòng</td>
                      <td>Chỉ số điện</td>
                      <td>Chỉ số nước</td>
                      <td>Số tiền</td>
                    </tr>
                  </thead>
                  <tbody>
                  </tbody>
                </Table>
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