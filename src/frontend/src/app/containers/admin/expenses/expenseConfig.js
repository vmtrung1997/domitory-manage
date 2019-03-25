import React from 'react'
import { Modal, Table, Tab, Tabs } from 'react-bootstrap'
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';

import Button from '../../../components/button/button'
import { get_parameter, config_expense } from './expensesAction'
import Input from '../../../components/input/input';

class Example extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: false,
      edit: false,
      key: 'dien',
      parameter: []
    }
  }
  componentDidMount() {

  }
  handleClose() {
    this.setState({ show: false, edit: false, parameter:[] });
  }
  handleEdit = () => {
    this.setState({ edit: true })
  }
  handleShow() {
    this.setState({ show: true });
    get_parameter().then(result => {
      this.setState({ parameter: result.data.data });
    })
  }

  handleSubmit = () => {
    var {parameter} = this.state
    this.handleClose();
    this.props.loading(true)
    config_expense(parameter).then(result => {
      if (result.data.rs === 'success'){
        this.props.loading(false)
        ToastsStore.success("Lưu thành công");        
      } else {
        this.props.loading(false)
        ToastsStore.error("Lưu thất bại");
      }
    }).catch(() =>{
      this.props.loading(false)
      ToastsStore.error("Có lỗi xảy ra");
    })
  }

  getValue = (target) => {
    var table = this.state.parameter.map(t => {
      if (t.id === parseInt(target.name))
        t.giaTriThuc = parseInt(target.value)
      return t
    });
    this.setState({ parameter: table })
  }
  render() {
    var dienTable = this.state.parameter && this.state.parameter.length > 0 && this.state.parameter.filter(d => d.loaiChiPhi === 'dien');
    var nuocTable = this.state.parameter && this.state.parameter.length > 0 && this.state.parameter.filter(d => d.loaiChiPhi === 'nuoc')
    var tab = (eventKey, title, table) => {
      return (
        <Tab eventKey={eventKey} title={title}>
          <div style={{padding: '1em'}}>
            <Table bordered hover responsive size="sm">
              <thead >
                <tr>
                  <th>STT</th>
                  <th>Giá trị đầu</th>
                  <th>Giá trị cuối</th>
                  <th>Đơn vị</th>
                  <th>Mô tả</th>
                  <th>Giá trị thực</th>
                </tr>
              </thead>
              <tbody>
                {table && table.map((para, index) => {
                  return (
                    <tr key={index}>
                      <td>{index+1}</td>
                      <td className={'text-right'}>{para.giaTriDau}</td>
                      <td className={'text-right'}>{para.giaTriCuoi}</td>
                      <td>{para.donVi}</td>
                      <td>{para.moTa}</td>
                      <td className={'text-right'}>{!this.state.edit && para.giaTriThuc}
                        {this.state.edit && <Input type='number' value={para.giaTriThuc} name={para.id} getValue={this.getValue} />}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        </Tab>
      )
    }
    return (
      <>
        <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} lightBackground store={ToastsStore} />
        <Button title={'Cài đặt'} onClick={this.handleShow}>
          <i className="fas fa-cogs"></i>
        </Button>
        <Modal show={this.state.show} onHide={this.handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Thông số</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tabs
              id="controlled-tab-example"
              activeKey={this.state.key}
              onSelect={key => this.setState({ key })}
            >
              {tab('dien', 'Thông số điện', dienTable)}
              {tab('nuoc', 'Thông số nước', nuocTable)}
            </Tabs>
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