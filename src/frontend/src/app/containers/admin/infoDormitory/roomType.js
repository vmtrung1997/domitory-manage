import React, { Component } from 'react'

import { Modal, Row, Col, Table } from 'react-bootstrap'
import Button from '../../../components/button/button'
import { getRoomTypes } from './roomTypeAction'
import Checkbox from '../../../components/checkbox/checkbox';
import Input from '../../../components/input/input';
import {addRoomType, updateRoomType, removeRoomType} from './roomTypeAction'
import {ToastsStore} from "react-toasts";

class Confirm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      table: []
    }
  }
  handleClose = () => {
    this.setState({ show: false, table: [] })
  }
  onShow = () => {
    this.setState({ show: true })
    getRoomTypes().then(result => {
      if (result.data) {
        this.setState({
          table: result.data.map(v => { return { ...v, 
            update: false,
            tenUpdate: v.ten,
            dienUpdate: v.dien,
            nuocUpdate: v.nuoc,
            tienRacUpdate: v.tienRac,
            isNew: false
          } 
          })
        })
      }
    })
  }
  setCheck = (index, e, type) => {
    var { table } = this.state;
    table = table.map((v, i) => {
      if (i === index)
        v[type] = e.chk
      return v;
    })
    this.setState({ table: table })
  }
  addRow = () => {
    var {table} = this.state;
    table.push({
      loai: 2,
      ten: 'No data',
      tenUpdate: 'No data',
      dien: false,
      dienUpdate: false,
      nuoc: false,
      nuocUpdate: false,
      tienRac: 0,
      tienRacUpdate: 0,
      update: true,
      isNew: true
    })
    this.setState({
      table: table
    })
  }
  updateRow = (index) => {
    var { table } = this.state;
    table = table.map((v, i) => {
      if (v.update){
        v.dienUpdate= v.dien;
        v.tenUpdate=v.ten;
        v.nuocUpdate=v.nuoc;
        v.tienRacUpdate= v.tienRac
        v.update=false
      }
      if (index === i){
        v.update = true
      }
      return v;
    })
    this.setState({ table: table })
  }
  onChange = (i, e, type) => {
    var {table} = this.state;
    table[i][type] = e.value;
    this.setState({table: table})
  }
  onSubmit = (e) => {
    e.preventDefault();
    var data = this.state.table.find(v => v.update===true);
    var dataObject = {
      loai: data.loai,
      dien: data.dienUpdate,
      nuoc: data.nuocUpdate,
      ten: data.tenUpdate,
      tienRac: data.tienRacUpdate
    }
    if (data.isNew){
      addRoomType({data: dataObject}).then(result => {
        if (result.data.rs === 'success'){
          ToastsStore.success('Thêm loại phòng thành công');
          let table = this.state.table.map(v => {
            if (v.isNew){
              v._id = result.data.data._id
              v.isNew = false;
              v.dien = v.dienUpdate;
              v.nuoc = v.nuocUpdate;
              v.ten = v.tenUpdate;
              v.tienRac = v.tienRacUpdate;
              v.update = false
            }
            return v;
          })
          this.setState({table: table})
        } else 
          ToastsStore.error('Có lỗi xảy ra')
      }).catch(err => console.log(err))
    } else {
      dataObject._id = data._id
      updateRoomType({data: dataObject}).then(result => {
        if (result.data.rs === 'success'){
          ToastsStore.success('Cập nhật thành công');
          let table = this.state.table.map(v => {
            if (v.update){
              v.dien = v.dienUpdate;
              v.nuoc = v.nuocUpdate;
              v.ten = v.tenUpdate;
              v.tienRac = v.tienRacUpdate;
              v.update = false
            }
            return v;
          })
          this.setState({table: table})
        } else 
          ToastsStore.error('Có lỗi xảy ra')
      })
    }
  }
  onRemoveRow = (index) => {
    var {table} = this.state
    var row = table[index];
    if (row.isNew){
      table.splice(index,1)
      this.setState({table: table});
    } else {
      if (!window.confirm(`Xóa loại phòng [${row.tenUpdate}]`))
        return;
      removeRoomType({data: {_id: row._id}}).then(result => {
        if (result.data.rs === 'success'){
          ToastsStore.success('Xóa phòng thành công');
          table.splice(index,1);
          this.setState({table: table});
        } else {
          ToastsStore.error(result.data.msg)
        }
      }).catch(err => ToastsStore.error('Có lỗi xảy ra'))
    }
  }
  render() {
    return (
      <React.Fragment>
        <Button
          shadow
          color={'danger'}
          onClick={() => this.onShow()}
        >
          Loại phòng
                </Button>
        <Modal show={this.state.show} onHide={this.handleClose} size='lg'>
          <Modal.Header closeButton>
            <Modal.Title>Loại phòng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className='m-b-10'>
              <Col><Button color='warning' onClick={this.addRow}>Thêm</Button></Col>
            </Row>
            <Row>
              <Col>
              <form onSubmit={this.onSubmit}>
                <Table bordered hover responsive size="sm">
                  <thead className="title-table text-center">
                    <tr>
                      <th>Tên loại phòng</th>
                      <th>Sử dụng điện</th>
                      <th>Sử dụng nước</th>
                      <th>Tiền rác</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.table && this.state.table.map((row, index) => {
                      return (
                        <tr key={index}>
                          <td className={row.isNew?'text-info':''}>{!row.update?row.ten:
                          <Input value={this.state.table[index].tenUpdate} getValue={(e) => this.onChange(index, e, 'tenUpdate')} />}</td>
                          <td className='text-center'>{!row.update ? (row.dien ?
                            (<i style={{ color: '#28a745' }} className="fas fa-check success"></i>) :
                            (<i style={{ color: '#dc3545' }} className="fas fa-times"></i>)) :
                            <Checkbox className='display-inline' check={row.dienUpdate} checkmark={'check-mark-fix'} name={`${index}`} isCheck={(e) => { this.setCheck(index, e, 'dienUpdate') }} />
                          }</td>
                          <td className='text-center'>{!row.update ? (row.nuoc ?
                            (<i style={{ color: '#28a745' }} className="fas fa-check success"></i>) :
                            (<i style={{ color: '#dc3545' }} className="fas fa-times"></i>)) :
                            <Checkbox className='display-inline' check={row.nuocUpdate} checkmark={'check-mark-fix'} name={`${index}`} isCheck={(e) => { this.setCheck(index, e, 'nuocUpdate') }} />
                          }</td>
                          <td>{!row.update?row.tienRac: 
                          <Input type={'number'} min={0} value={this.state.table[index].tienRacUpdate} getValue={(e) => this.onChange(index, e, 'tienRacUpdate')} />}
                          </td>
                          <td>
                            {!row.update?
                            <Button color='warning' title={'Chỉnh sửa'} onClick={() => this.updateRow(index)}><i className="fas fa-edit"></i></Button>:''}
                            {row.update?
                            <Button title={'Lưu'} type='submit'><i className="fas fa-save"></i></Button>:''} &nbsp;
                            {(row.loai !== 0 && row.loai !== 1) &&  <Button color='danger' title={'Xóa'} onClick={() => this.onRemoveRow(index)}><i className="fas fa-trash-alt"></i></Button>}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </form>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='default' color='default' onClick={this.handleClose}>
              Đóng
	            	</Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    )
  }
}

export default Confirm