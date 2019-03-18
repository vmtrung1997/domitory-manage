import React from 'react'
import { Modal } from 'react-bootstrap'
import Button from '../../../components/button/button'
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
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