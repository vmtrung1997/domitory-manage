import React from 'react'
import { Table, Row, Col, Modal } from 'react-bootstrap'
import Input from '../../../components/input/input'
import Button from '../../../components/button/button'
import Select from '../../../components/selectOption/select'
import { getData, add_expense, find_expense, info_room } from '../expenses/expensesAction'
import { get_month } from './expenseRepo'
import { ToastsStore } from 'react-toasts';
import './expenses.css'
import Checkbox from '../../../components/checkbox/checkbox';
class Example extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      rooms: [],
      table: [],
      room: 0,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      monthOptions: [],
      yearOptions: [],
      soDien: 0,
      soNuoc: 0,
      submit: false,
      tableErr: [],
      infoRoom: {},
      resetSoDien: false,
      resetSoNuoc: false,
      soDienResetDau: 0,
      soDienResetCuoi: 0,
      soNuocResetDau: 0,
      soNuocResetCuoi: 0,
      idRoom: 0,
      trangThai: 0,
    };
  }

  handleClose() {
    this.setState({
      show: false,
      room: 0,
      soDien: 0,
      soNuoc: 0,
      resetSoDien: false,
      resetSoNuoc: false,
      soDienResetDau: 0,
      soDienResetCuoi: 0,
      soNuocResetDau: 0,
      soNuocResetCuoi: 0,
      trangThai: 0,
    });
  }
  handleReset = async () => {
    let roomOptions = await this.getRoomOption();
    this.setState({
      table: [],
      room: 0,
      soDien: 0,
      soNuoc: 0,
      resetSoDien: false,
      resetSoNuoc: false,
      soDienResetDau: 0,
      soDienResetCuoi: 0,
      soNuocResetDau: 0,
      soNuocResetCuoi: 0,
      rooms: roomOptions,
      trangThai: 0
    });
  }
  
  getRoomOption = (month, year) => {
    if (month == null)
      month = this.state.month
    if (year == null)
      year = this.state.year
    return new Promise(resolve => {
      getData({month: month, year: year}).then(result => {
        if (result.data){
          var roomOptions = []
          result.data.result.forEach((room) => {
            let find = this.state.table.find(item => item.phong.value === room._id)
            if (!find){
              roomOptions.push(room)
            }
          })
          roomOptions = roomOptions.map(room => ({ value: room._id, label: room.tenPhong, loaiPhong: room.loaiPhong }))
          resolve(roomOptions);
        }
      }).catch(() => { resolve([])})
    })
  }
  handleShow = async () => {
    this.setState({ show: true });
    let monthOptions = get_month();
    monthOptions.shift();
    let yearNow = new Date().getFullYear() - 1;
    let yearOptions = [...Array(3)].map((_, i) => { return { value: i + yearNow, label: i + yearNow } })
    var roomOptions = await this.getRoomOption();
    this.setState({
      rooms: roomOptions,
      monthOptions: monthOptions,
      yearOptions: yearOptions,
    });
    this.selected(roomOptions[0].value);
  }
  selected =  (value) => {
    var room = this.state.rooms.find(obj => obj.value === value)
    info_room({ idPhong: value }).then(result => {
      if (result.data) {
        this.setState({ room: room, infoRoom: result.data.data, idRoom: room.value })
      }
    })
  }
  monthSelected = async value => {
    let roomOptions = await this.getRoomOption(value);
    this.setState({ month: value,rooms : roomOptions })
  }
  yearSelected = async value => {
    let roomOptions = await this.getRoomOption(null, value);
    this.setState({ year: value, rooms : roomOptions });
  }
  onChange = (target) => {
    this.setState({ [target.name]: target.value })
  }
  setDienNuoc = (table, room) => {
    var roomOptions = this.state.rooms.filter(item => item.value !== room.value);
    if (roomOptions.length> 0){
      this.selected(roomOptions[0].value)
    }
    this.setState({
      table: table,
      soDien: 0,
      soNuoc: 0,
      resetSoDien: false,
      resetSoNuoc: false,
      soDienResetDau: 0,
      soDienResetCuoi: 0,
      soNuocResetDau: 0,
      soNuocResetCuoi: 0,
      trangThai: 0,
      rooms: roomOptions
    });
  }
  addRow = (event) => {
    event.preventDefault();
    var { table, month, year, soDien, soNuoc, room, infoRoom,
      resetSoDien, resetSoNuoc,
      soDienResetDau, soDienResetCuoi,
      soNuocResetDau, soNuocResetCuoi, trangThai } = this.state;
    find_expense({ thang: parseInt(month), nam: parseInt(year), phong: room }).then(result => {
      if (result.data.rs === 'accept') {
        if (infoRoom.loaiPhong.dien || infoRoom.loaiPhong.nuoc) {
          if (infoRoom.chiPhi.soDien > parseInt(soDien) || infoRoom.chiPhi.soNuoc > parseInt(soNuoc)) {
            ToastsStore.error(`Dữ liệu [điện: ${soDien}, nước: ${soNuoc}] phải lớn hơn hiện tại`);
            return;
          }
          if (this.state.table.find(p => p.thang === month && p.nam === year && p.phong === room)) {
            ToastsStore.error(`Dữ liệu [${month}/${year} phòng ${room.label}] đã có trong bảng`);
            return;
          }
        }
        if (resetSoDien && parseInt(soDienResetCuoi) < parseInt(soDienResetDau)) {
          ToastsStore.error(`Số điện reset cuối phải lớn hơn số điện reset đầu`);
          return;
        }
        if (resetSoNuoc && parseInt(soNuocResetCuoi) < parseInt(soNuocResetDau)) {
          ToastsStore.error(`Số nước reset cuối phải lớn hơn số nước reset đầu`);
          return;
        }
        var row = {
          thang: parseInt(month),
          nam: parseInt(year),
          phong: room,
          soDien: infoRoom.loaiPhong.dien ? parseInt(soDien) : 0,
          soNuoc: infoRoom.loaiPhong.nuoc ? parseInt(soNuoc) : 0,
          soDienCu: infoRoom.loaiPhong.dien ? infoRoom.chiPhi.soDien : 0,
          soNuocCu: infoRoom.loaiPhong.nuoc ? infoRoom.chiPhi.soNuoc : 0,
          isResetDien: resetSoDien,
          isResetNuoc: resetSoNuoc,
          trangThai: trangThai
        }
        if (resetSoDien) {
          row.soDienResetDau = soDienResetDau ? parseInt(soDienResetDau) : 0;
          row.soDienResetCuoi = soDienResetCuoi ? parseInt(soDienResetCuoi) : 0;
        }
        if (resetSoNuoc) {
          row.soNuocResetDau = soNuocResetDau ? parseInt(soNuocResetDau) : 0;
          row.soNuocResetCuoi = soNuocResetCuoi ? parseInt(soNuocResetCuoi) : 0;
        }
        table.push(row);
        this.setDienNuoc(table, room);
      } else {
        ToastsStore.error(`Dữ liệu [${month}/${year} phòng ${room.label}] đã tồn tại`);
      }
    })
  }
  handleSubmit = () => {
    var self = this;
    var { table } = this.state;
    if (table.length < 1) {
      ToastsStore.error("Không có dữ liệu thêm");
      return;
    }
    this.props.loading(true)
    add_expense(table).then(result => {
      if (result.data) {
        self.props.loading(false)
        if (result.data.rs === 'fail') {
          ToastsStore.error("Có lỗi xảy ra");
          this.setState({ tableErr: result.data.dataErr, table: result.data.table })
          self.handleClose();
        } else {
          ToastsStore.success("Thêm chi phí thành công");
          this.setState({ show: false })
          self.handleReset();
          self.props.retriveSearch(true);
        }
      }
    }).catch(err => {
      self.props.loading(false)
      this.setState({ show: false })
      ToastsStore.error("Thêm chi phí thất bại");
      self.handleClose();
    })
  }
  onDeleteRow = (index) => {
    var {table, rooms} = this.state
    var room = table.find((_, _index) => index === _index);
    rooms.push(room);
    table.splice(index, 1);
    this.setState({ table: table, rooms: rooms });
  }
  handleCheckTrangThai = e => {
    this.setState({trangThai: e.chk?2:0})
  }
  render() {
    var table = this.state.table && this.state.table.length > 0 ? this.state.table.map((row, index) => {
      return (
        <tr key={index}>
          <td>{row.thang + "/" + row.nam}</td>
          <td>{row.phong.label}</td>
          <td>{row.isResetDien ? row.soDienResetCuoi - row.soDienResetDau + row.soDien - row.soDienCu : row.soDien - row.soDienCu}</td>
          <td>{row.isResetNuoc ? row.soNuocResetCuoi - row.soNuocResetDau + row.soNuoc - row.soNuocCu : row.soNuoc - row.soNuocCu}</td>
          <td>
            {!this.state.submit && <i className="fas fa-times-circle"
              style={{ cursor: 'pointer', fontSize: '1em', color: 'red' }}
              onClick={() => this.onDeleteRow(index)}></i>}
          </td>
        </tr>
      )
    }) : [];
    return (
      <>
        <Button color={'warning'} onClick={this.handleShow}>
          <i className="fas fa-plus" />
        </Button>
        <Modal show={this.state.show} onHide={this.handleClose} size="lg">
          {/* dialogClassName="modal-90w" */}
          <Modal.Header closeButton>
            <Modal.Title>
              Thêm chi phí
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={'p-10'}>
              <form onSubmit={e => this.addRow(e)}>
                <Row>
                  <Col md={3} xs={12}>
                    Tháng
                  <Select options={this.state.monthOptions} value={this.state.month} selected={this.monthSelected} />
                  </Col>
                  <Col md={1} xs={12}></Col>
                  <Col md={3} xs={12}>
                    Năm
                  <Select options={this.state.yearOptions} value={this.state.year} selected={this.yearSelected} />
                  </Col>
                  <Col md={1} xs={12}></Col>
                  <Col md={3} xs={12}>
                    Phòng
                  <Select options={this.state.rooms} value={this.state.idRoom} selected={this.selected} />
                  </Col>
                </Row>
                <Row>
                  <Col md={3} xs={12}>
                    Số điện
                  <Input type="number" min={0} value={this.state.soDien} getValue={this.onChange} name={'soDien'} disabled={Object.keys(this.state.infoRoom).length && !this.state.infoRoom.loaiPhong.dien} />
                    {this.state.resetSoDien &&
                      <Row className="d-md-none">
                        <Col>
                          Chỉ số đầu
                    <Input type='number' min={0} name='soDienResetDau' value={this.state.soDienResetDau} getValue={this.onChange} />
                          Chỉ số cuối
                    <Input type='number' min={0} name='soDienResetCuoi' value={this.state.soDienResetCuoi} getValue={this.onChange} />
                        </Col>
                      </Row>
                    }
                  </Col>
                  <Col md={1} xs={12}>&nbsp;
                      <Button title='Reset số điện' disabled={this.state.infoRoom.loaiPhong ? !this.state.infoRoom.loaiPhong.dien : false} onClick={() => { this.setState({ resetSoDien: !this.state.resetSoDien }) }}><i className="fas fa-retweet"></i></Button>
                  </Col>
                  <Col md={3}>
                    Số nước
                  <Input type="number" min={0} value={this.state.soNuoc} getValue={this.onChange} name={'soNuoc'} disabled={Object.keys(this.state.infoRoom).length && !this.state.infoRoom.loaiPhong.nuoc} />
                    {this.state.resetSoDien &&
                      <Row className="d-md-none">
                        <Col>
                          Chỉ số đầu
                    <Input type='number' min={0} name='soNuocResetDau' value={this.state.soNuocResetDau} getValue={this.onChange} />
                          Chỉ số cuối
                    <Input type='number' min={0} name='soNuocResetCuoi' value={this.state.soNuocResetCuoi} getValue={this.onChange} />
                        </Col>
                      </Row>
                    }
                  </Col>
                  <Col md={1} xs={12}>
                    &nbsp;
                      <Button title='Reset số nước' disabled={this.state.infoRoom.loaiPhong ? !this.state.infoRoom.loaiPhong.nuoc : false} onClick={() => { this.setState({ resetSoNuoc: !this.state.resetSoNuoc }) }}><i className="fas fa-retweet"></i></Button>
                  </Col>
                  <Col md={3} xs={12}>
                  &nbsp;
                  <Checkbox label={'Thiếu dữ liệu'}  check={this.state.trangThai === 2} isCheck={(e) => this.handleCheckTrangThai(e)} />
                  </Col>
                  <Col md={1}>
                    &nbsp;
                      <Button color={'warning'} type='submit' size={'md'}><i className="fas fa-plus" /></Button>
                  </Col>
                  
                </Row>
                {(this.state.resetSoDien || this.state.resetSoNuoc) && <div className="d-none d-md-block">
                  <Row>
                    <Col md={this.state.resetSoDien && this.state.resetSoNuoc ? '2' : !this.state.resetSoDien && this.state.resetSoNuoc ? '5' : '2'} className='text-right'>
                      Chỉ số đầu
                    </Col>
                    {this.state.resetSoDien &&
                      <Col md='2'>
                        <Input type='number' min={0} name='soDienResetDau' value={this.state.soDienResetDau} getValue={this.onChange} />
                      </Col>}
                    {!this.state.resetSoDien || this.state.resetSoNuoc && <Col md='1'></Col>}
                    <Col md='2'>{this.state.resetSoNuoc &&
                      <Input type='number' min={0} name='soNuocResetDau' value={this.state.soNuocResetDau} getValue={this.onChange} />}
                    </Col>
                  </Row>
                </div>}
                {(this.state.resetSoDien || this.state.resetSoNuoc) && <div className="d-none d-md-block">
                  <Row>
                    <Col md={this.state.resetSoDien && this.state.resetSoNuoc ? '2' : !this.state.resetSoDien && this.state.resetSoNuoc ? '5' : '2'} className='text-right'>
                      Chỉ số cuối
                    </Col>
                    {this.state.resetSoDien && <Col md='2'>
                      <Input type='number' min={0} name='soDienResetCuoi' value={this.state.soDienResetCuoi} getValue={this.onChange} />
                    </Col>}
                    {!this.state.resetSoDien || this.state.resetSoNuoc && <Col md='1'></Col>}
                    <Col md='2'>{this.state.resetSoNuoc &&
                      <Input type='number' min={0} name='soNuocResetCuoi' value={this.state.soNuocResetCuoi} getValue={this.onChange} />}
                    </Col>
                  </Row>
                </div>}
                {Object.keys(this.state.infoRoom).length && <Row className={'m-b-10'}>
                  <Col md={4} xs={12}>
                    Số điện hiện tại: {this.state.infoRoom.chiPhi.soDien}
                  </Col>
                  <Col md={4} xs={12}>
                    Số nước hiện tại: {this.state.infoRoom.chiPhi.soNuoc}
                  </Col>
                  <Col md={4} xs={12}>
                    Loại: {this.state.infoRoom.loaiPhong.ten}
                  </Col>
                </Row>}
              </form>
              <Row>
                <Col>
                  <div className={'maxHeight'}>
                    <Table striped hover responsive size="lg">
                      <thead>
                        <tr>
                          <th>Tháng/Năm</th>
                          <th>Phòng</th>
                          <th>Điện tiêu thụ</th>
                          <th>Nước tiêu thụ</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {table}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="default" color="default" onClick={this.handleClose}>
              Đóng
            </Button>
            <Button variant="default" color="danger" onClick={this.handleReset}>
              Xóa bảng
            </Button>
            <Button variant="default" onClick={this.handleSubmit}>
              Xác nhận
              </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default Example;

{/* <form onSubmit={e => this.addRow(e)}>
                <Row>
                  <Col md={1} xs={12}> 
                    Tháng
                  <Select options={this.state.monthOptions} value={this.state.month} selected={this.monthSelected} />
                  </Col>
                  <Col md={2} xs={12}>
                    Năm
                  <Select options={this.state.yearOptions} value={this.state.year} selected={this.yearSelected} />
                  </Col>
                  <Col md={2} xs={12}>
                    Phòng
                  <Select options={this.state.rooms} value={this.state.idRoom} selected={this.selected} />
                  </Col>
                </Row>
                <Row>
                  <Col md={2} xs={12}>
                    Số điện
                  <Input type="number" min={0} value={this.state.soDien} getValue={this.onChange} name={'soDien'} disabled={Object.keys(this.state.infoRoom).length && !this.state.infoRoom.loaiPhong.dien} />
                    {this.state.resetSoDien &&
                      <Row className="d-md-none">
                        <Col>
                          Chỉ số đầu
                    <Input type='number' min={0} name='soDienResetDau' value={this.state.soDienResetDau} getValue={this.onChange} />
                          Chỉ số cuối
                    <Input type='number' min={0} name='soDienResetCuoi' value={this.state.soDienResetCuoi} getValue={this.onChange} />
                        </Col>
                      </Row>
                    }
                  </Col>
                  <Col md={1} xs={12}>&nbsp;
                <Col md='12'>
                      <Button title='Reset số điện' disabled={this.state.infoRoom.loaiPhong ? !this.state.infoRoom.loaiPhong.dien : false} onClick={() => { this.setState({ resetSoDien: !this.state.resetSoDien }) }}><i className="fas fa-retweet"></i></Button>
                    </Col>
                  </Col>
                  <Col md={2}>
                    Số nước
                  <Input type="number" min={0} value={this.state.soNuoc} getValue={this.onChange} name={'soNuoc'} disabled={Object.keys(this.state.infoRoom).length && !this.state.infoRoom.loaiPhong.nuoc} />
                    {this.state.resetSoDien &&
                      <Row className="d-md-none">
                        <Col>
                          Chỉ số đầu
                    <Input type='number' min={0} name='soNuocResetDau' value={this.state.soNuocResetDau} getValue={this.onChange} />
                          Chỉ số cuối
                    <Input type='number' min={0} name='soNuocResetCuoi' value={this.state.soNuocResetCuoi} getValue={this.onChange} />
                        </Col>
                      </Row>
                    }
                  </Col>
                  <Col md={1} xs={12}>
                    &nbsp;
                    <Col md='12'>
                      <Button title='Reset số nước' disabled={this.state.infoRoom.loaiPhong ? !this.state.infoRoom.loaiPhong.nuoc : false} onClick={() => { this.setState({ resetSoNuoc: !this.state.resetSoNuoc }) }}><i className="fas fa-retweet"></i></Button>
                    </Col>
                  </Col>
                  <Col md={1}>
                    &nbsp;
                    <Col md={12}>
                      <Button color={'warning'} type='submit' size={'md'}><i className="fas fa-plus" /></Button>
                    </Col>
                  </Col>
                </Row>
                {(this.state.resetSoDien || this.state.resetSoNuoc) && <div className="d-none d-md-block">
                  <Row>
                    <Col md={this.state.resetSoDien && this.state.resetSoNuoc ? '5' : !this.state.resetSoDien && this.state.resetSoNuoc ? '8' : '5'} className='text-right'>
                      Chỉ số đầu
                    </Col>
                    {this.state.resetSoDien &&
                      <Col md='2'>
                        <Input type='number' min={0} name='soDienResetDau' value={this.state.soDienResetDau} getValue={this.onChange} />
                      </Col>}
                    {!this.state.resetSoDien || this.state.resetSoNuoc && <Col md='1'></Col>}
                    <Col md='2'>{this.state.resetSoNuoc &&
                      <Input type='number' min={0} name='soNuocResetDau' value={this.state.soNuocResetDau} getValue={this.onChange} />}
                    </Col>
                  </Row>
                </div>}
                {(this.state.resetSoDien || this.state.resetSoNuoc) && <div className="d-none d-md-block">
                  <Row>
                    <Col md={this.state.resetSoDien && this.state.resetSoNuoc ? '5' : !this.state.resetSoDien && this.state.resetSoNuoc ? '8' : '5'} className='text-right'>
                      Chỉ số cuối
                    </Col>
                    {this.state.resetSoDien && <Col md='2'>
                      <Input type='number' min={0} name='soDienResetCuoi' value={this.state.soDienResetCuoi} getValue={this.onChange} />
                    </Col>}
                    {!this.state.resetSoDien || this.state.resetSoNuoc && <Col md='1'></Col>}
                    <Col md='2'>{this.state.resetSoNuoc &&
                      <Input type='number' min={0} name='soNuocResetCuoi' value={this.state.soNuocResetCuoi} getValue={this.onChange} />}
                    </Col>
                  </Row>
                </div>}
                {Object.keys(this.state.infoRoom).length && <Row className={'m-b-10'}>
                  <Col md={4} xs={12}>
                    Loại: {this.state.infoRoom.loaiPhong.ten}
                  </Col>
                  <Col md={4} xs={12}>
                    Số điện hiện tại: {this.state.infoRoom.chiPhi.soDien}
                  </Col>
                  <Col md={4} xs={12}>
                    Số nước hiện tại: {this.state.infoRoom.chiPhi.soNuoc}
                  </Col>
                </Row>}
              </form> */}