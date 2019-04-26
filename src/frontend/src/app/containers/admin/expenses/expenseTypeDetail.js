import React from 'react'
import { Modal, Table, Row, Col } from 'react-bootstrap'
import { ToastsStore } from 'react-toasts';
import Select from '../../../components/selectOption/select'
import Button from '../../../components/button/button'
import { get_room_type, get_detail_room_type, update_detail_room_type } from './expensesAction'
import Input from '../../../components/input/input';

class Example extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: false,
      edit: false,
      roomType: [],
      selectedDetail: {},
      selectType: [],
      parameter: [],
      dienTable: [],
      nuocTable: [],
      selectedType: '',
      tienRac: 0,
    }
  }
  componentDidMount() {
  }
  handleClose() {
    this.setState({ show: false, 
      edit: false, 
      roomType: [], 
      selectedDetail: [],
      selectType: [],
      parameter: [],
      dienTable: [],
      nuocTable: [],
      selectedType: '',
      tienRac: 0, });
  }
  handleEdit = () => {
    this.setState({ edit: true })
  }
  handleShow() {
    this.setState({ show: true });
    get_room_type().then(result => {
      var selectType = result.data.data.map(value => {
        return { value: value._id, label: value.ten }
      })
      this.setState({ roomType: result.data.data, selectType: selectType });
      this.getDetailRoomType(selectType[0].value);
    })
  }
  getDetailRoomType = (id) => {
    get_detail_room_type({ idLoaiPhong: id }).then(detail => {
      if (detail.data){
        var parameter = detail.data.data;
        var selectedDetail = this.state.roomType.find(p => p._id === id);
        this.setState({
          selectedType: id,
          selectedDetail: selectedDetail,
          dienTable: selectedDetail.dien? parameter.filter(p => p.loaiChiPhi === 0):[],
          nuocTable: selectedDetail.nuoc? parameter.filter(p => p.loaiChiPhi === 1):[],
          tienRac: this.state.roomType.find(p => p._id === id).tienRac
        });
      }
    })
  }
  handleSubmit = () => {
    var { dienTable, nuocTable, selectedDetail } = this.state;
    if (selectedDetail.dien){
      dienTable = dienTable.map((value, index) => {
        value.id = index +1;
        return value;
      })
    }
    if (selectedDetail.nuoc){
      nuocTable = nuocTable.map((value,index) => {
        value.id = index +1;
        return value
      })
    }
    var table = dienTable.concat(nuocTable);
    update_detail_room_type({
      idLoaiPhong: this.state.selectedType, 
      table: table,
      tienRac: this.state.tienRac
     }).then(result => {
       if (result.data.rs === 'success'){
        ToastsStore.success("Cập nhật thành công");
        this.handleClose()
       } else {
        ToastsStore.error("Cập nhật thất bại");
       }
     })
  }
  selectedType = (value) => {
    this.getDetailRoomType(value);
  }
  getValue = (target) => {
    var position = target.name.split('.');
    var table;
    if (parseInt(position[0]) === 0)
      table = this.state.dienTable;
    else
      table = this.state.nuocTable;
    table = table.map((t, index) => {
      if (parseInt(position[2]) === index) {
        if (position[3] === 'number')
          if (position[4] === 'float')
            t[position[1]] = parseFloat(target.value);
          else
            t[position[1]] = parseInt(target.value);
        else
          t[position[1]] = target.value
      }
      return t
    });
    this.setState({ parameter: table })
  }
  tableRender = (table, type) => {
    return (
      <Table bordered hover responsive size="sm">
        <thead className="title-table">
          <tr>
            <th>STT</th>
            <th>Giá trị đầu</th>
            <th>Giá trị cuối</th>
            <th>Đơn vị</th>
            <th>Mô tả</th>
            <th>Giá trị thực</th>
            {this.state.edit && <th></th>}
          </tr>
        </thead>
        <tbody>
          {table && table.map((para, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className={'text-right'}>
                  {!this.state.edit && para.giaTriDau}
                  {this.state.edit && <Input type='number' value={para.giaTriDau} name={`${type}.giaTriDau.${index}.number`} getValue={this.getValue} />}
                </td>
                <td className={'text-right'}>
                  {!this.state.edit && para.giaTriCuoi}
                  {this.state.edit && <Input type='number' value={para.giaTriCuoi} name={`${type}.giaTriCuoi.${index}.number`} getValue={this.getValue} />}
                </td>
                <td>
                  {!this.state.edit && para.donVi}
                  {this.state.edit && <Input value={para.donVi} name={`${type}.donVi.${index}.text`} getValue={this.getValue} />}
                </td>
                <td>
                  {!this.state.edit && para.moTa}
                  {this.state.edit && <Input value={para.moTa} name={`${type}.moTa.${index}.text`} getValue={this.getValue} />}
                </td>
                <td className={'text-right'}>
                  {!this.state.edit && para.giaTriThuc}
                  {this.state.edit && <Input type='number' value={para.giaTriThuc} name={`${type}.giaTriThuc.${index}.number.float`} getValue={this.getValue} />}
                </td>
                {this.state.edit && <td className={'text-center'}>
                  <Button color="danger" onClick={() => this.removeRow(type, index)}> - </Button>
                </td>}
              </tr>
            )
          })}
        </tbody>
      </Table>
    )
  }
  removeRow = (type, index) => {
    var { dienTable, nuocTable } = this.state
    if (type === 0) {
      dienTable.splice(index, 1)
      this.setState({ dienTable: dienTable })
    }
    else {
      nuocTable.splice(index, 1);
      this.setState({ nuocTable: nuocTable })
    }
  }
  addRow = (type) => {
    var { dienTable, nuocTable } = this.state
    var row = {
      loaiChiPhi: this.state.selectedType,
      giaTriDau: 0,
      giaTriCuoi: 0,
      giaTriThuc: 0,
      moTa: '',
      donVi: ''
    };
    if (type === 0) {
      dienTable.push(row)
      this.setState({ dienTable: dienTable });
    } else {
      nuocTable.push(row);
      this.setState({ nuocTable: nuocTable })
    }
  }
  render() {
    var { dienTable, nuocTable } = this.state;
    return (
      <>
        <Button title={'Cài đặt'} onClick={this.handleShow}>
          <i className="fas fa-cogs"></i>
        </Button>
        <Modal show={this.state.show} onHide={this.handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Thông số</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                {this.state.selectType.length > 0 && <Select options={this.state.selectType} selected={this.selectedType}></Select>}
              </Col>
            </Row>
            {this.state.selectedDetail && this.state.selectedDetail.dien && <Row>
              <Col style={{marginBottom: '10px'}} md={12}>Thông số điện {this.state.edit && <Button color="warning" onClick={() => this.addRow(0)}>+</Button>}</Col>
              <Col md={12}>
                {this.tableRender(dienTable, 0)}
              </Col>
            </Row>}
            {this.state.selectedDetail && this.state.selectedDetail.nuoc && <Row>
              <Col style={{marginBottom: '10px'}} md={12}>Thông số nước {this.state.edit && <Button color="warning" onClick={() => this.addRow(1)}>+</Button>}</Col>
              <Col md={12}>
                {this.tableRender(nuocTable, 1)}
              </Col>
            </Row>}
            <Row>
              <Col>
                Tiền rác: <Input type='number' value={this.state.tienRac} disabled={!this.state.edit} getValue={p => {this.setState({tienRac: parseInt(p.value)})}}></Input>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="default" color="default" onClick={this.handleClose}>
              Đóng
            </Button>
            {!this.state.edit && <Button variant="default" color="warning" onClick={this.handleEdit}>
              Chỉnh sửa
            </Button>}
            {this.state.edit && <Button variant="default" color="success" onClick={this.handleSubmit}>
              Lưu
            </Button>}
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default Example;