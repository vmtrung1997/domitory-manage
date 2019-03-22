import React from 'react'
import { Row, Col, Modal } from 'react-bootstrap'
import Button from '../../../components/button/button'
import Input from '../../../components/input/input'
import {remove_expense, update_expense} from './expensesAction'
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
class Example extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: true,
      disabled: true,
      capNhat: false,
      soDien: 0,
      soNuoc: 0
    };
  }
  componentDidMount(){
    var {expenseDetail} = this.props;
    this.setState({exp: expenseDetail})
  }
  handleClose() {
    this.setState({ show: false, disabled: true, capNhat: false });
    this.props.show(false)
  }
  handleShow() {
    this.setState({ show: true });
  }
  handleDelete = () => {
    var self = this;
    var {exp} = this.state;
    if (!window.confirm("Bạn chắc chắn muốn xóa chi phí này"))
      return;
    remove_expense(exp).then(result => {
      if (result.data){
        ToastsStore.success("Xóa chi phí thành công");
        self.props.retriveSearch(true);
        self.handleClose();
      } else {
        ToastsStore.err("Xóa chi phí thất bại");
      }
    });
  }
  handleEdit = () => {
    this.setState({capNhat: true, disabled: false})
  }
  handleUpdate = () => {
    var self = this;
    var {expenseDetail} = this.props;
    expenseDetail.soDien = this.state.soDien;
    expenseDetail.soNuoc = this.state.soNuoc;
    console.log(expenseDetail);
    update_expense(expenseDetail).then(result => {
      if (result.data){
        ToastsStore.success("Cập nhật chi phí thành công");
        self.props.retriveSearch(true);
        self.handleClose();
      } else {
        ToastsStore.err("Cập nhật chi phí thất bại");
        self.handleClose();
      }
    })
  }
  handleChange = (target) => {
    this.setState({
      [target.name]: parseInt(target.value)
    })
  }
  render() {
    var exp = this.props.expenseDetail;
    return (
      <React.Fragment>
      <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} lightBackground store={ToastsStore}/>
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
            <Input name={'soDien'} type={'number'} disabled={this.state.disabled} value={exp.soDien} getValue={this.handleChange}/>
            </Col>
            <Col>
            Số nước hiện tại
            <Input name={'soNuoc'} type={'number'} disabled={this.state.disabled} value={exp.soNuoc} getValue={this.handleChange}/></Col>
          </Row>
          <Row>
            <Col>
            Tiền điện
            <Input name={'soDien'} type={'number'} disabled={true} value={exp.tienDien} getValue={this.handleChange}/>
            </Col>
            <Col>
            Tiền nước
            <Input name={'soNuoc'} type={'number'} disabled={true} value={exp.tienNuoc} getValue={this.handleChange}/></Col>
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
          {exp.trangThai===0 && <Button color="danger" onClick={this.handleDelete}>
            Xóa
            </Button>}
            {exp.trangThai===0 && !this.state.capNhat && <Button color="warning" onClick={this.handleEdit}>
            Chỉnh sửa
            </Button>}
            {exp.trangThai===0 && this.state.capNhat && <Button color="warning" onClick={this.handleUpdate}>
            Cập nhật
            </Button>}
          { exp.trangThai===0 && <Button variant="default" onClick={this.handleClose}>
          Xác nhận thanh toán
        </Button>}
        </Modal.Footer>
      </Modal>
      </React.Fragment>
    );
  }
}

export default Example;