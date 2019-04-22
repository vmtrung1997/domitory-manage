import React from 'react'
import { Row, Col, Modal, Table } from 'react-bootstrap'
import Button from '../../../components/button/button'
import Input from '../../../components/input/input'
import Optimize from '../../../optimization/optimizationNumber/optimizationNumber'
import { remove_expense, update_expense, submit_expense } from './expensesAction'
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import './expenses.css'
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
      soNuoc: 0,
      soDienResetDau: 0,
      soDienResetCuoi: 0,
      soNuocResetDau: 0,
      soNuocResetCuoi: 0
    };
  }
  componentDidMount() {
    var { expenseDetail } = this.props;
    this.setState({ exp: expenseDetail, soDien: expenseDetail.soDien, soNuoc: expenseDetail.soNuoc })
    if (expenseDetail.thayDien) {
      this.setState({ soDienResetDau: expenseDetail.thayDien.dienCu, soDienResetCuoi: expenseDetail.thayDien.dienMoi })
    }
    if (expenseDetail.thayNuoc) {
      this.setState({ soNuocResetDau: expenseDetail.thayNuoc.nuocCu, soNuocResetCuoi: expenseDetail.thayNuoc.nuocMoi })
    }
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
    var { exp } = this.state;
    if (!window.confirm("Bạn chắc chắn muốn xóa chi phí này"))
      return;
    self.props.loading(true)
    remove_expense(exp).then(result => {
      if (result.data) {
        ToastsStore.success("Xóa chi phí thành công");
        self.props.retriveSearch(true);
        self.handleClose();
      } else {
        ToastsStore.error("Xóa chi phí thất bại");
      }
      self.props.loading(false)
    });
  }
  handleEdit = () => {
    this.setState({ capNhat: true, disabled: false })
  }
  handleUpdate = (event) => {
    event.preventDefault();
    var self = this;
    var { expenseDetail } = this.props;
    if (parseInt(this.state.soDien) < expenseDetail.soDienCu) {
      ToastsStore.error("Số điện đầu phải nhỏ hơn số điện cuối")
      return;
    }
    expenseDetail.soDien = parseInt(this.state.soDien);
    if (parseInt(this.state.soNuoc) < expenseDetail.soNuocCu) {
      ToastsStore.error("Số nước đầu phải nhỏ hơn số nước cuối")
      return;
    }
    expenseDetail.soNuoc = parseInt(this.state.soNuoc);
    if (expenseDetail.thayDien) {
      if (parseInt(this.state.soDienResetDau) > parseInt(this.state.soDienResetCuoi)) {
        ToastsStore.error("Số điện reset đầu phải nhỏ hơn số điện reset cuối")
        return;
      }
      expenseDetail.thayDien.dienCu = parseInt(this.state.soDienResetDau);
      expenseDetail.thayDien.dienMoi = parseInt(this.state.soDienResetCuoi);
    }
    if (expenseDetail.thayNuoc) {
      if (parseInt(this.state.soNuocResetDau) > parseInt(this.state.soNuocResetCuoi)) {
        ToastsStore.error("Số nước reset đầu phải nhỏ hơn số nước reset cuối")
        return;
      }
      expenseDetail.thayNuoc.nuocCu = parseInt(this.state.soNuocResetDau);
      expenseDetail.thayNuoc.nuocMoi = parseInt(this.state.soNuocResetCuoi);
    }
    console.log(expenseDetail);
    if (expenseDetail.trangThai===1 && expenseDetail.thayDien && expenseDetail.thayNuoc && !window.confirm(`Cập nhật đồng hồ điện [${expenseDetail.thayDien.dienMoi}] và đồng hồ nước [${expenseDetail.thayNuoc.nuocMoi}]`))
      return;
    else if (expenseDetail.trangThai===1 && expenseDetail.thayDien && !expenseDetail.thayNuoc && !window.confirm(`Cập nhật lại đồng hồ điện: [${expenseDetail.thayDien.dienMoi}]`))
      return;
    else if (expenseDetail.trangThai===1 && expenseDetail.thayNuoc && !expenseDetail.thayDien && !window.confirm(`Cập nhật lại đồng hồ nước: [${expenseDetail.thayNuoc.nuocMoi}]`))
      return;
    self.props.loading(true)
    update_expense(expenseDetail).then(result => {
      if (result.data.rs==='success') {
        ToastsStore.success("Cập nhật chi phí thành công");
        self.props.retriveSearch(true);
      } else {
        ToastsStore.error("Cập nhật chi phí thất bại");
      }
      self.props.loading(false)
      self.handleClose();
    }).catch(() => {
      this.props.loading(false)
    })
  }
  handleSubmit = () => {
    var { expenseDetail } = this.props;
    if (expenseDetail.thayDien && expenseDetail.thayNuoc && !window.confirm(`Xác nhận thanh toán chi phí này? \n (Cập nhật đồng hồ điện [${expenseDetail.thayDien.dienMoi}] và đồng hồ nước [${expenseDetail.thayNuoc.nuocMoi}])`))
      return;
    else if (expenseDetail.thayDien && !expenseDetail.thayNuoc && !window.confirm(`Xác nhận thanh toán chi phí này? \n (Cập nhật lại đồng hồ điện: [${expenseDetail.thayDien.dienMoi}])`))
      return;
    else if (expenseDetail.thayNuoc && !expenseDetail.thayDien && !window.confirm(`Xác nhận thanh toán chi phí này? \n (Cập nhật lại đồng hồ nước: [${expenseDetail.thayNuoc.nuocMoi}])`))
      return;
    this.props.loading(true)
    var exp = { id: this.props.expenseDetail._id };
    submit_expense(exp).then(result => {
      if (result.data.rs === 'fail') {
        ToastsStore.error("Thanh toán không thành công")
      } else {
        this.props.retriveSearch(true);
        ToastsStore.success("Thanh toán thành công");
      }
      this.props.loading(false)
      this.handleClose();
    }).catch(() => {
      this.props.loading(false)
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
        <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} lightBackground store={ToastsStore} />
        <Modal show={this.state.show} onHide={this.handleClose} size="lg">
          <form onSubmit={this.handleUpdate}>
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                Tháng/năm
            <Input disabled={true} value={exp.thang + '/' + exp.nam} />
              </Col>
              <Col>Phòng
            <Input disabled={true} value={exp.idPhong.tenPhong} /></Col>
            </Row>
            <Row>
              <Col md='12'>
                <Table bordered hover responsive size="sm">
                  <thead className="title-table text-center">
                    <tr>
                      <th>Loại</th>
                      <th>Chỉ số đầu</th>
                      <th>Chỉ số cuối</th>
                      <th>Tiêu thụ</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Điện</td>
                      <td className='text-right'>{Optimize.OpitmizeNumber(exp.soDienCu)}</td>
                      <td className='text-right m-b-0'>{this.state.disabled ? Optimize.OpitmizeNumber(this.state.soDien) :
                        <Input name={'soDien'} type={'number'} min={0} value={this.state.soDien} getValue={this.handleChange} />
                      }</td>
                      <td rowSpan={exp.thayDien ? '2' : '1'} className='text-right vertical-middle'>{
                        Optimize.OpitmizeNumber(exp.thayDien ? this.state.soDien - exp.soDienCu + exp.thayDien.dienMoi - exp.thayDien.dienCu :
                          this.state.soDien - exp.soDienCu)
                      }</td>
                      <td rowSpan={exp.thayDien ? '2' : '1'} className='text-right vertical-middle'>{Optimize.OpitmizeNumber(exp.tienDien)}</td>
                    </tr>
                    {exp.thayDien && <tr>
                      <td>Điện (thay mới)</td>
                      <td className='text-right m-b-0'>{this.state.disabled ? Optimize.OpitmizeNumber(exp.thayDien.dienCu) :
                        <Input name={'soDienResetDau'} type={'number'} min={0} value={this.state.soDienResetDau} getValue={this.handleChange} />
                      }</td>
                      <td className='text-right m-b-0'>{this.state.disabled ? Optimize.OpitmizeNumber(exp.thayDien.dienMoi) :
                        <Input name={'soDienResetCuoi'} type={'number'} min={0} value={this.state.soDienResetCuoi} getValue={this.handleChange} />
                      }</td>
                    </tr>}
                    <tr>
                      <td>Nước</td>
                      <td className='text-right m-b-0'>{Optimize.OpitmizeNumber(exp.soNuocCu)}</td>
                      <td className='text-right m-b-0'>{this.state.disabled ? Optimize.OpitmizeNumber(this.state.soNuoc) :
                        <Input name={'soNuoc'} type={'number'} min={0} value={this.state.soNuoc} getValue={this.handleChange} />
                      }</td>
                      <td rowSpan={exp.thayNuoc ? '2' : '1'} className='text-right vertical-middle'>{
                        Optimize.OpitmizeNumber(exp.thayNuoc ? this.state.soNuoc - exp.soNuocCu + exp.thayNuoc.nuocMoi - exp.thayNuoc.nuocCu :
                          this.state.soNuoc - exp.soNuocCu)

                      }</td>
                      <td rowSpan={exp.thayNuoc ? '2' : '1'} className='text-right vertical-middle'>{Optimize.OpitmizeNumber(exp.tienNuoc)}</td>
                    </tr>
                    {exp.thayNuoc && <tr>
                      <td>Nước (thay mới)</td>
                      <td className='text-right'>{this.state.disabled ? Optimize.OpitmizeNumber(exp.thayNuoc.nuocCu) :
                        <Input name={'soNuocResetDau'} type={'number'} min={0} value={this.state.soNuocResetDau} getValue={this.handleChange} />
                      }</td>
                      <td className='text-right m-b-0'>{this.state.disabled ? Optimize.OpitmizeNumber(exp.thayNuoc.nuocMoi) :
                        <Input name={'soNuocResetCuoi'} type={'number'} min={0} value={this.state.soNuocResetCuoi} getValue={this.handleChange} />
                      }</td>
                    </tr>}
                    <tr>
                      <td className='text-center' colSpan={4}>Tiền rác</td>
                      <td className='text-right'>{Optimize.OpitmizeNumber(exp.tienRac)}</td>
                    </tr>
                    <tr>
                      <td className='text-center' colSpan={4}>Tổng tiền</td>
                      <td className='text-right danger-text'>{Optimize.OpitmizeNumber(exp.tongTien)}</td>
                    </tr>
                    <tr>
                      <td className='text-center' colSpan={4}>Trạng thái</td>
                      <td className={exp.trangThai === 1 ? 'text-center success-text' : 'text-center danger-text'}>{exp.trangThai === 1 ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row className='text-right warning-text'>
              <Col md={12} xs={12}> Thành tiền: {exp.tongTienChu}</Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="default" color="default" onClick={this.handleClose}>
              Đóng
            </Button>
            {exp.trangThai === 0 && <Button color="danger" onClick={this.handleDelete}>
              Xóa
            </Button>}
            {!this.state.capNhat && <Button color="warning" onClick={this.handleEdit}>
              Chỉnh sửa
            </Button>}
            {this.state.capNhat && <Button color="warning" type='submit'>
              Cập nhật
            </Button>}
            {exp.trangThai === 0 && <Button variant="default"  onClick={this.handleSubmit}>
              Xác nhận thanh toán
        </Button>}
          </Modal.Footer>
          </form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Example;