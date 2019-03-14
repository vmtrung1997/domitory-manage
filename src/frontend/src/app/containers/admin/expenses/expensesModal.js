import React from 'react'
import { Table, Row, Col, Modal } from 'react-bootstrap'
import Input from '../../../components/input/input'
import Button from '../../../components/button/button'
import Select from '../../../components/selectOption/select'
import {getData, add_expense} from '../expenses/expensesAction'
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
      soNuoc: 0
    };
  }
  componentDidMount(){
    var self = this;
    getData().then(result => {
			if (result.data) {
        var roomOptions = result.data.result.map(room => ({value: room._id, label: room.tenPhong}))
        console.log(roomOptions[0])
				self.setState({rooms: roomOptions, room: roomOptions[0]});
			}
		}).catch(err => console.log(err))
  }
  handleClose() {
    this.setState({ show: false, table: [], room: this.state.rooms[0], month: this.props.currentMonth, year: this.props.currentYear,soDien:0,soNuoc:0 });
  }

  handleShow() {
    this.setState({ show: true });
  }
  selected = (value) => {
    var room = this.state.rooms.find(obj => obj.value === value)
    this.setState({ room: room })
  }
  monthSelected = value =>{
    this.setState({month: value})
  }
  yearSelected = value => {
    this.setState({year: value});
  }
  onChange = (target) => {
    this.setState({ [target.name]: target.value })
  }

  addRow = () => {
    var {table,month, year, soDien, soNuoc, room} = this.state;
    var row = {thang: month, nam: year, phong: room, soDien: parseInt(soDien), soNuoc: parseInt(soNuoc) }
    table.push(row);
    this.setState({
      table: table,
      soDien: 0,
      soNuoc: 0
    })
    this.setState({ soDien: 0, soNuoc:0 })
  }
  handleSubmit = () => {
    var {table} = this.state;
    add_expense(table).then(result => {
      alert(result);
    }).catch(err => console.log(err))
  }
  onDeleteRow = (index) => {
    var table = this.state.table
    table.splice(index,1);
    this.setState({table: table});
  }
  render() {
    var monthOptions = [...Array(12)].map((_, i) =>  {return { value: i+1, label: i+1 }});
    var yearOptions = [...Array(3)].map((_, i) => { return { value: i + 2015, label: i + 2015 } });
    var table = this.state.table.length ? this.state.table.map((row,index) => {
      return (
        <tr key={index}>
          <td>{row.thang + "/" + row.nam}</td>
          <td>{row.phong.label}</td>
          <td>{row.soDien}</td>
          <td>{row.soNuoc}</td>
          <td><i className="fas fa-times-circle" style={{cursor: 'pointer', fontSize: '1em', color: 'red'}} onClick={(event) => this.onDeleteRow(index)}></i></td>
        </tr>
      )
    }) : [];
    return (
      <>
        <Button color={'warning'} onClick={this.handleShow}>
          <i className="fas fa-plus"/>
        </Button>
        <Modal show={this.state.show} onHide={this.handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Thêm chi phí</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={'p-10'}>
              <Row className={'m-b-10'}>
                <Col md={2}>
                  Tháng
                  <Select options={monthOptions} selected={this.monthSelected}/>
                </Col>
                <Col md={2}>
                  Năm
                  <Select options={yearOptions} selected={this.yearSelected}/>
                </Col>
                <Col md={2}>
                  Phòng
                  <Select options={this.state.rooms} selected={this.selected}/>
                </Col>
                <Col md={2}>
                  Số điện
                  <Input type="number" value={this.state.soDien} getValue={this.onChange} name={'soDien'} />
                </Col>
                <Col md={2}>
                  Số nước
                  <Input type="number" value={this.state.soNuoc} getValue={this.onChange} name={'soNuoc'} />
                </Col>
                <Col md={2}>
                &nbsp;
                <Col md={12}><Button color={'warning'} size={'md'} onClick={this.addRow}><i className="fas fa-plus"/></Button></Col>
                </Col>
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
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {table}
                    </tbody>
                  </Table>
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