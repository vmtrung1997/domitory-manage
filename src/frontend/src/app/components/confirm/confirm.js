import React, { Component } from 'react'

import { Modal } from 'react-bootstrap'
import Button from './../button/button'
import './confirm.css'

class Confirm extends Component{
	static defaultProps = {
		show: false,
		content: '',
		handleClose: () => {},
		handleSave: () => {},
	}
	
	render(){
		return(
			<Modal show={this.props.show} onHide={this.props.handleClose}>
        		<Modal.Header closeButton>
            		<Modal.Title>Xóa hoạt động</Modal.Title>
          		</Modal.Header>
          		<Modal.Body>
          			<div>
          				<span>Bạn có muốn xóa hoạt động này !</span>
          			</div>
          		</Modal.Body>
          		<Modal.Footer>
	            	<Button variant='default' color='default' onClick={this.props.handleClose}>
	            		Đóng
	            	</Button>
	            	<Button variant='default' onClick={this.props.handleSave}>
	            		Đồng ý
	              	</Button>
        		</Modal.Footer>
      		</Modal>
		)
	}
}

export default Confirm