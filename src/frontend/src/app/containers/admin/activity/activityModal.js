import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import DatePicker from 'react-datepicker'

import Button from './../../../components/button/button'
import Input from './../../../components/input/input'
import CheckBox from './../../../components/checkbox/checkbox'

class ActivityModal extends Component{
	static defaultProps = {
		show: false,
		handleClose: () => {},
		handleSave: () => {},
	}
  getValue = (e) => {
    console.log()
  }
  handleSave = () => {
    console.log(1)

    this.props.handleSave()
  }

	render(){
		var today = new Date()
		return(
			<Modal show={this.props.show} onHide={this.props.handleClose} style={{marginRight: '-10px'}}>
        		<Modal.Header closeButton>
            		<Modal.Title>Thêm hoạt động</Modal.Title>
          		</Modal.Header>
          		<Modal.Body>
          			<div>
          				<span> Hoạt động </span>
          				<Input getValue={this.getValue} name="name"/>
          			</div>
          			<div>
          				<span> Địa điểm </span>
          				<Input/>
          			</div>
          			<div style={{width: '50%'}}>
          				<span> Thời gian </span>
          				<DatePicker
          					dateFormat="dd/MM/yyyy"
							selected={today}
							onChange={this.handleChange}
							className='input-datepicker'
						/>
          			</div>
          			<div>
          				<span> Mô tả </span>
          				<textarea rows='4'/>
          			</div>
          			<div style={{marginTop: '10px'}}>
          				<span style={{fontWeight: 'bold'}}> Bắt buộc </span>
          				<CheckBox style={{marginTop: '-10px', display: 'contents'}}/>
          			</div>
          		</Modal.Body>
          		<Modal.Footer>
	            	<Button variant="default" color="default" onClick={this.props.handleClose}>
	            		Đóng
	            	</Button>
	            	<Button variant="default" onClick={this.handleSave}>
	            		Xác nhận
	              	</Button>
        		</Modal.Footer>
        	</Modal>
		)
	}
}

export default ActivityModal