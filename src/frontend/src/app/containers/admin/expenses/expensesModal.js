import React from 'react'
import { Table, Row, Col, Modal } from 'react-bootstrap'
import Input from '../../../components/input/input'
import Button from '../../../components/button/button'
import Select from '../../../components/selectOption/select'
import { getData, add_expense, find_expense, check_expense, info_room } from '../expenses/expensesAction'
import { get_month, get_year,  } from './expenseRepo'
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
class Example extends React.Component {
  static defaultProps = {
    currentYear: 2015,
    currentMonth: 1
  }

  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      rooms: [],
      table: [],
      room: 0,
      month: this.props.currentMonth,
      year: this.props.currentYear,
      soDien: 0,
      soNuoc: 0,
      submit: false,
      tableErr: [],
      infoRoom: {}
    };
  }
  componentDidMount() {
    
  }
  handleClose() {
    this.setState({ show: false, table: [], room: 0, month: this.props.currentMonth, year: this.props.currentYear, soDien: 0, soNuoc: 0 });
  }

  handleShow() {
    this.setState({ show: true });
    var self = this;
    getData().then(result => {
      if (result.data) {
        var roomOptions = result.data.result.map(room => ({ value: room._id, label: room.tenPhong, loaiPhong: room.loaiPhong }))
        self.setState({ rooms: roomOptions});
        this.selected(roomOptions[0].value);
      }
    }).catch(err => {
    })
  }
  selected = (value) => {
    var room = this.state.rooms.find(obj => obj.value === value)
    info_room({idPhong: value}).then(result => {
      if (result.data) {
        this.setState({ room: room, infoRoom: result.data.data })
      }
    })
  }
  monthSelected = value => {
    this.setState({ month: value })
  }
  yearSelected = value => {
    this.setState({ year: value });
  }
  onChange = (target) => {
    this.setState({ [target.name]: target.value })
  }
  setDienNuoc = (table) => {
    this.setState({table: table, soDien: 0, soNuoc: 0})
  }
  addRow = () => {
    var { table, month, year, soDien, soNuoc, room } = this.state;
    find_expense({ thang: parseInt(month), nam: parseInt(year), phong: room }).then(result => {
      if (result.data.rs === 'accept') {
        check_expense({phong: room, soDien: parseInt(soDien), soNuoc: parseInt(soNuoc)}).then(rsCheck => {
          if (rsCheck.data.rs === 'accept'){
            if (this.state.table.find(p => p.thang === month && p.nam === year && p.phong === room)) {
              ToastsStore.error(`Dữ liệu [${month}/${year} phòng ${room.label}] đã có trong bảng`);
            } else {
              var row = { thang: parseInt(month), nam: parseInt(year), phong: room, soDien: parseInt(soDien), soNuoc: parseInt(soNuoc) }
              table.push(row);
              this.setDienNuoc(table);
            }
          } else {
            ToastsStore.error(`Dữ liệu [điện: ${soDien}, nước: ${soNuoc}] phải lớn hơn hiện tại`);
          }
        })
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
        if (result.data.rs ==='fail') {
          ToastsStore.error("Có lỗi xảy ra");
          this.setState({ tableErr: result.data.dataErr, table: result.data.table })
          self.handleClose();
        } else {
          ToastsStore.success("Thêm chi phí thành công");
          self.handleClose();
          self.props.retriveSearch(true);
        }
      }
    }).catch(err => {
      ToastsStore.error("Thêm chi phí thất bại");
      self.handleClose();
    })
  }
  onDeleteRow = (index) => {
    var table = this.state.table
    table.splice(index, 1);
    this.setState({ table: table });
  }
  render() {
    var monthOptions = get_month();
    monthOptions.shift();
    var yearOptions = get_year();
    yearOptions.shift();
    var table = this.state.table && this.state.table.length > 0 ? this.state.table.map((row, index) => {
      return (
        <tr key={index}>
          <td>{row.thang + "/" + row.nam}</td>
          <td>{row.phong.label}</td>
          <td>{row.soDien}</td>
          <td>{row.soNuoc}</td>
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
        <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} lightBackground store={ToastsStore} />
        <Button color={'warning'} onClick={this.handleShow}>
          <i className="fas fa-plus" />
        </Button>
        <Modal show={this.state.show} onHide={this.handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Thêm chi phí
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={'p-10'}>
              <Row>
                <Col md={2}>
                  Tháng
                  <Select options={monthOptions} selected={this.monthSelected} />
                </Col>
                <Col md={2}>
                  Năm
                  <Select options={yearOptions} selected={this.yearSelected} />
                </Col>
                <Col md={2}>
                  Phòng
                  <Select options={this.state.rooms} selected={this.selected} />
                </Col>
                <Col md={2}>
                  Số điện
                  <Input type="number" value={this.state.soDien} getValue={this.onChange} name={'soDien'} disabled={Object.keys(this.state.infoRoom).length && !this.state.infoRoom.loaiPhong.dien}/>
                </Col>
                <Col md={2}>
                  Số nước
                  <Input type="number" value={this.state.soNuoc} getValue={this.onChange} name={'soNuoc'} disabled={Object.keys(this.state.infoRoom).length && !this.state.infoRoom.loaiPhong.nuoc}/>
                </Col>
                <Col md={2}>
                  &nbsp;
                <Col md={12}><Button color={'warning'} size={'md'} onClick={this.addRow}><i className="fas fa-plus" /></Button></Col>
                </Col>
              </Row>
              { Object.keys(this.state.infoRoom).length && <Row className={'m-b-10'}>
                <Col md={4}>
                  Loại: {this.state.infoRoom.loaiPhong.ten}
                </Col>
                <Col md={4}>
                  Số điện hiện tại: {this.state.infoRoom.chiPhi.soDien}
                </Col>
                <Col md={4}>
                  Số nước hiện tại: {this.state.infoRoom.chiPhi.soNuoc}
                </Col>
              </Row>}
              <Row>
                <Col>
                  <div className={'maxHeight'}>
                    <Table striped hover responsive size="lg">
                      <thead>
                        <tr>
                          <th>Tháng/Năm</th>
                          <th>Phòng</th>
                          <th>Chỉ số điện</th>
                          <th>Chỉ số nước</th>
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