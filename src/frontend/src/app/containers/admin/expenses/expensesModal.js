import React from 'react'
import { Table, Row, Col, Modal } from 'react-bootstrap'
import Input from '../../../components/input/input'
import Button from '../../../components/button/button'
import Select from '../../../components/selectOption/select'
class Example extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      table: [],
      phong: 101,
      soDien: 0,
      soNuoc: 0
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }
  selected = (value) => {
    this.setState({phong: value})
  }
  onChange = (target) => {
    this.setState({[target.name]: target.value})
  }
  
  addRow = () => {
    var row = {phong: this.state.phong, soDien: this.state.soDien, soNuoc: this.state.soNuoc}
    var table = this.state.table;
    table.push(row);
    this.setState({
      table: table,
      soDien: 0,
      soNuoc: 0
    })
    this.setState({soDien: 0})
  }

  render() {
    var options = [{ value: 101, label: '101' }, { value: 102, label: '102' }]
    var date = new Date();
    var table = this.state.table.length?this.state.table.map((row, index) => {
      return (
        <tr key={index}>
          <td>{date.getMonth() + "/" + date.getFullYear()}</td>
          <td>{row.phong}</td>
          <td>{row.soDien}</td>
          <td>{row.soNuoc}</td>
        </tr>
      )
    }):[];
    return (
      <>
        <Button onClick={this.handleShow}>
          Bảng ghi
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Thêm chi phí</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className={'p-10'}>
            <Row className={'m-b-10'}>
              <Col md={3}>
                <Col md={12}><label>Phòng</label></Col>
                <Col md={12}><Select options={options} value={options[0].value} selected={this.selected} /></Col>
              </Col>
              <Col md={3}>
                <Col md={12}><label>Số điện</label></Col>
                <Col md={12}><Input type="number" value={this.state.soDien} getValue={this.onChange} name={'soDien'}/></Col>
              </Col>
              <Col md={3}>
                <Col md={12}><label>Số nước</label></Col>
                <Col md={12}><Input type="number" value={this.state.soNuoc} getValue={this.onChange} name={'soNuoc'}/></Col>
              </Col>
              <Col md={3}>
              <Col md={12}>&nbsp;</Col>
              <Col md={12}><Button color={'warning'} size={'md'} onClick={this.addRow}>Thêm</Button></Col></Col>
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
            <Button variant="default" onClick={this.handleClose}>
              Xác nhận
              </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default Example;