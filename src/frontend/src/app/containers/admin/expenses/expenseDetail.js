import React from 'react'
import { Row, Col, Modal } from 'react-bootstrap'
import Button from '../../../components/button/button'
import Input from '../../../components/input/input'
class Example extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: true,
    };
  }
  componentDidMount(){

  }
  handleClose() {
    this.setState({ show: false });
    this.props.show(false)
  }

  handleShow() {
    this.setState({ show: true });
  }
  render() {
    var exp = this.props.expenseDetail;
    console.log(exp);
    return (
      <Modal show={this.state.show} onHide={this.handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
            Tháng/năm
            <Input disabled={true} value={exp.thang +'/'+ exp.nam}/>
            </Col>
            <Col>Phòng
            <Input disabled={true} value={exp.idPhong.tenPhong}/></Col>
          </Row>
          <Row>
            <Col>
            Số điện cũ
            <Input disabled={true} value={exp.soDienCu}/>
            </Col>
            <Col>Số nước cũ
            <Input disabled={true} value={exp.soNuocCu}/></Col>
          </Row>
          <Row>
            <Col>
            Số điện hiện tai
            <Input disabled={true} value={exp.soDien}/>
            </Col>
            <Col>
            Số nước hiện tại
            <Input disabled={true} value={exp.soNuoc}/></Col>
          </Row>
          <Row>
            <Col>
            Tiền rác
            <Input disabled={true} value={exp.tienRac}/>
            </Col>
            <Col>
            Tổng tiền
            <Input disabled={true} value={exp.tongTien}/></Col>
          </Row>
          <Row>
            <Col>
            Trạng thái
            <Input disabled={true} value={exp.trangThai === 1?'Đã thanh toán':'Chưa thanh toán'}/>
            </Col>
            <Col>
            Tổng tiền chữ
            <Input disabled={true} value={exp.tongTienChu}/></Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="default" color="default" onClick={this.handleClose}>
            Đóng
            </Button>
          {exp.trangThai===0 && <Button variant="danger" onClick={this.handleClose}>
            Xóa
            </Button>}
            {exp.trangThai===0 && <Button variant="warning" onClick={this.handleClose}>
            Chỉnh sửa
            </Button>}
          { exp.trangThai===0 && <Button variant="default" onClick={this.handleClose}>
          Xác nhận thanh toán
        </Button>}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Example;