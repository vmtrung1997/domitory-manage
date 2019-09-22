import React from 'react'
import { Modal, Row, Col } from 'react-bootstrap'
import { ToastsStore } from 'react-toasts';

import Button from '../../../components/button/button'
import { getData, reset_room, info_room } from './expensesAction'
import Input from '../../../components/input/input';
import Select from '../../../components/selectOption/select'
import Checkbox from '../../../components/checkbox/checkbox';
class Example extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: false,
      edit: false,
      rooms: [],
      dienCheck: false,
      nuocCheck: false,
      dienCu: 0,
      dienMoi: 0,
      nuocCu: 0,
      nuocMoi: 0,
      idPhong: '',
      infoRoom: {}
    }
  }
  componentDidMount() {

  }
  handleClose() {
    this.setState({
      show: false,
      edit: false,
      rooms: [],
      dienCheck: false,
      nuocCheck: false,
      dienCu: 0,
      dienMoi: 0,
      nuocCu: 0,
      nuocMoi: 0,
      idPhong: ''
    });
  }
  handleEdit = () => {
    this.setState({ edit: true })
  }
  handleShow() {
    this.setState({ show: true });
    getData().then(value => {
      if (value.data) {
        var rooms = value.data.result.map(v => {
          return { value: v._id, label: v.tenPhong }
        })
        this.setState({ rooms: rooms, idPhong: rooms[0].value })
        info_room({ idPhong: rooms[0].value }).then(result => {
          if (result.data) {
            this.setState({ idPhong: result.data.data.chiPhi.idPhong, infoRoom: result.data.data })
          }
        })
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    //var {dienCheck, dienCu, dienMoi, nuocCheck, nuocCu, nuocMoi} = this.state;
    var submit = {
      idPhong: this.state.idPhong,
      dienCheck: this.state.dienCheck,
      //dienCu: this.state.dienCu,
      dienMoi: this.state.dienMoi,
      nuocCheck: this.state.nuocCheck,
      //nuocCu: this.state.nuocCu,
      nuocMoi: this.state.nuocMoi
    }
    if (!submit.dienCheck && !submit.nuocCheck)
      this.handleClose();
    reset_room(submit).then(result => {
      if (result.data.rs === 'success') {
        ToastsStore.success('Thay đổi thành công')
      } else {
        ToastsStore.error('Thay đổi thất bại')
      }
      this.handleClose();
    })
  }

  getValue = (target) => {
    this.setState({ [target.name]: target.value })
  }
  selectRoom = (value) => {
    info_room({ idPhong: value }).then(result => {
      if (result.data) {
        this.setState({ idPhong: result.data.data.chiPhi.idPhong, infoRoom: result.data.data })
      }
    })
  }
  render() {
    return (
      <>
        <Button title={'Reset'} onClick={this.handleShow}>
          <i className="fas fa-window-restore"></i>
        </Button>
        <Modal show={this.state.show} onHide={this.handleClose} size="lg">
          <form onSubmit={e => this.handleSubmit(e)}>
            <Modal.Header closeButton>
              <Modal.Title>Thông số ban đầu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col>
                  Phòng
              <Select options={this.state.rooms} selected={this.selectRoom} value={this.state.idPhong} ></Select>
                </Col>
              </Row>
              <Row>
                <Col md={3}>
                  &nbsp;
                  <Col md={12}>
                    <Checkbox label={'Reset số điện'} check={this.state.dienCheck} isCheck={val => this.setState({ dienCheck: val.chk })} />
                  </Col>
                </Col>
                <Col>
                  Số điện đồng hồ mới
                <Input type='number' min={0} value={this.state.dienMoi} name='dienMoi' disabled={!this.state.dienCheck} getValue={this.getValue} />
                </Col>
                <Col> Số điện đã lưu:
              <Col md={12}>
                    {Object.keys(this.state.infoRoom).length > 0 &&
                      this.state.infoRoom.chiPhi.soDien
                    }
                  </Col>
                </Col>
              </Row>
              <Row>
                <Col md={3}>
                  &nbsp;
                <Col md={12}>
                    <Checkbox label={'Reset số nước'} check={this.state.nuocCheck} isCheck={val => this.setState({ nuocCheck: val.chk })} />
                  </Col>
                </Col>
                <Col>
                  Số nước đồng hồ mới
                <Input type='number' min={0} value={this.state.nuocMoi} name='nuocMoi' disabled={!this.state.nuocCheck} getValue={this.getValue} />
                </Col>
                <Col>
                  Số nước đã lưu: <Col>
                    {Object.keys(this.state.infoRoom).length > 0 && this.state.infoRoom.chiPhi.soNuoc}
                  </Col>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="default" color="default" onClick={this.handleClose}>
                Đóng
            </Button>
              <Button variant="default" color="success" type='submit'>
                Lưu
            </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </>
    );
  }
}

export default Example;