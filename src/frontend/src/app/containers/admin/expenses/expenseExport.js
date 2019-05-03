import React from 'react'
import { Modal, Row, Col } from 'react-bootstrap'
import Button from '../../../components/button/button'
import Checkbox from '../../../components/checkbox/checkbox'
// import Input from '../../../components/input/input'
import Select from '../../../components/selectOption/select'
import { report_expense } from './expensesAction'
import { get_month, get_year, get_status } from './expenseRepo'
import { ToastsStore } from 'react-toasts';
import { saveAs } from 'file-saver'
class Example extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: false,
      fromMonth: 1,
      toMonth: 1,
      fromYear: 2015,
      toYear: 2015,
      soDien: true,
      soNuoc: true,
      tienRac: true,
      tongTien: true,
      room: 0,
      status: 0,
      disableToMonth: true
    }
  }
  componentDidMount() {
  }
  handleClose() {
    this.setState({
      show: false,
      loading: false,
      fromMonth: 1,
      toMonth: 1,
      toYear: 2015,
      fromYear: 2015,
      soDien: true,
      soNuoc: true,
      tienRac: true,
      tongTien: true,
      room: 0,
      status: 0,
      disableToMonth: true
    });
  }
  handleShow() {
    this.setState({ show: true });
  }
  monthFromSelected = (value) => {
    this.setState({ fromMonth: value })
  }
  yearFromSelected = (value) => {
    this.setState({ fromYear: value })
  }
  monthToSelected = (value) => {
    this.setState({ toMonth: value });
  }
  yearToSelected = (value) => {
    this.setState({ toYear: value });
  }
  s2ab = (s) => {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  handleSubmit = () => {
    var self = this;
    this.props.loading(true)
    this.handleClose()
    var report = { ...this.state };
    report.fromMonth = parseInt(report.fromMonth)
    report.toMonth = parseInt(report.toMonth)
    report.fromYear = parseInt(report.fromYear)
    report.toYear = parseInt(report.toYear)
    report.status = parseInt(report.status)
    if (report.room === '0')
      report.room = 0;
    report_expense(report).then(result => {
      if (result.data.rs === 'fail') {
        ToastsStore.error(result.data.msg)
      } else {
        var byteCharacters = window.atob(result.data.file);
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, result.data.filename)
      }
      self.props.loading(false);

    }).catch(err => { });
  }
  handleCheck = (obj) => {
    this.setState({ [obj.value]: obj.chk })
  }
  statusSelected = (value) => {
    this.setState({ status: value })
  }
  roomSelected = (value) => {
    this.setState({ room: value })
  }
  getValue = (target) => {
    this.setState({
      [target.name]: target.value
    })
  }
  handleCheckToMonth = () => {
    this.setState({ disableToMonth: !this.state.disableToMonth })
  }
  render() {
    var month = get_month().filter(m => m.value !== 0);
    var year = get_year().filter(y => y.value !== 0);
    var trangThai = get_status();
    var { roomList } = this.props
    return (
      <>
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
                <div style={{ marginBottom: '8px' }}>Tháng</div>
                <Row>
                  <Col><Select options={month} selected={this.monthFromSelected} /></Col>
                  <Col><Select options={year} selected={this.yearFromSelected} /></Col>
                </Row>
              </Col>
              <Col>
                <Checkbox label={'Đến tháng'} check={!this.state.disableToMonth} name={'sdtt'} isCheck={this.handleCheckToMonth} />
                <Row>
                  <Col><Select options={month} selected={this.monthToSelected} disabled={this.state.disableToMonth} /></Col>
                  <Col><Select options={year} selected={this.yearToSelected} disabled={this.state.disableToMonth} /></Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>Phòng
              <Select options={roomList} selected={this.roomSelected} />
              </Col>
              <Col>Trạng thái
              <Select options={trangThai} selected={this.statusSelected} /></Col>
            </Row>
            <Row>
              <Col><Checkbox label={'Số điện'} check={this.state.soDien} name={'soDien'} isCheck={this.handleCheck} /></Col>
              <Col><Checkbox label={'Số nước'} check={this.state.soNuoc} name={'soNuoc'} isCheck={this.handleCheck} /></Col>
            </Row>
            <Row>
              <Col><Checkbox label={'Tiền rác'} check={this.state.tienRac} name={'tienRac'} isCheck={this.handleCheck} /></Col>
              <Col><Checkbox label={'Tổng tiền'} check={this.state.tongTien} name={'tongTien'} isCheck={this.handleCheck} /></Col>
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