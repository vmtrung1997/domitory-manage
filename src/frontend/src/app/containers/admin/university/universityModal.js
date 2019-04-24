import React, { Component } from 'react'

import { Modal } from 'react-bootstrap'
import Button from '../../../components/button/button';

class Confirm extends Component{
	static defaultProps = {
		show: false,
		content: '',
		title: '',
		handleClose: () => {},
		handleSave: () => {},
	}
	
	render(){
		return(
			<Modal show={this.props.show} onHide={this.props.handleClose}>
        		<Modal.Header closeButton>
            		<Modal.Title>{this.props.title}</Modal.Title>
          		</Modal.Header>
          		<Modal.Body>
          			{this.props.children}
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