import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import ReactToPrint from 'react-to-print'

import './infoStudent.css'
import Button from './../../../components/button/button'
import StudentCard from './../../../components/studentCard/studentCard'

class PrintStudentCard extends Component {
	static defaultProps = {
		data: {},
		show: false,
		handleClose: () => {},
	}
	handlePrint = () => {
		this.props.handleClose()
	}
	render(){
		return(
			<Modal show={this.props.show} onHide={this.props.handleClose}>
	          	<Modal.Header closeButton>
	            	<Modal.Title>In thẻ sinh viên</Modal.Title>
	         	</Modal.Header>
		        <Modal.Body bsPrefix='card-center'>
			   		<StudentCard data={this.props.data} ref={el => (this.componentRef = el)}/>
		        </Modal.Body>
	        	<Modal.Footer>
	            	<Button variant='default' color='default' onClick={this.props.handleClose}>
	              		Đóng
		            </Button>
		            <ReactToPrint
				        trigger={() => <Button variant='default' onClick={this.handlePrint}>In thẻ</Button>}
				        content={() => this.componentRef}
				    />
	          	</Modal.Footer>
        	</Modal>
		)
	}
}

export default PrintStudentCard;