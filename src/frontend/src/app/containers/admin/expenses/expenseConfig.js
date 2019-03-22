import React from 'react'
import {Modal,Table } from 'react-bootstrap'
import Button from '../../../components/button/button'
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import {get_parameter} from './expensesAction'
import Input from '../../../components/input/input';
class Example extends React.Component {
  
  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: false,
      edit: false
    }
  }
  componentDidMount(){

  }
  handleClose() {
    this.setState({ show: false});
  }
  handleEdit = () => {
    this.setState({edit: true})
  }
  handleShow() {
    this.setState({ show: true });
    get_parameter().then(result => {
      this.setState({parameter: result.data.data});
    })
  }
  
  handleSubmit = () => {
    
  }
  onDeleteRow = (index) => {
    
  }
  render() {
    return (
      <>
        <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} lightBackground store={ToastsStore}/>
        <Button title={'Cài đặt'} onClick={this.handleShow}>
					<i className="fas fa-cogs"></i>
				</Button>
        <Modal show={this.state.show} onHide={this.handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Thông số</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Table bordered hover responsive size="sm">
					<thead >
						<tr>
							<th>Id</th>
							<th>Loại chi phí</th>
							<th>Giá trị đầu</th>
							<th>Giá trị cuối</th>
							<th>Đơn vị</th>
							<th>Mô tả</th>
							<th>Giá trị thực</th>
						</tr>
					</thead>
					<tbody>
            {this.state.parameter && this.state.parameter.map((para, index) => {
              return(
                <tr key={index}>
                  <td>{para.id}</td>
                  <td>{para.loaiChiPhi}</td>
                  <td>{para.giaTriDau}</td>
                  <td>{para.giaTriCuoi}</td>
                  <td>{para.donVi}</td>
                  <td>{para.moTa}</td>
                  <td>{para.giaTriThuc}</td>
                </tr>
              )
            })}
					</tbody>
				</Table>
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