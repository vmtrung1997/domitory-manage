import React, { Component } from 'react'
import { Modal, Row, Col, Table } from 'react-bootstrap'
import Button from '../../../components/button/button'
import ReactToPrint from 'react-to-print'
import Input from '../../../components/input/input'
import './Card.css'
import logo from './../../../../utils/image/logo_HCMUS.jpg'

class PrintInforStudent extends Component {
	static defaultProps = {
		show: false,
		handleClose: () => {},
		handlePrint: () => {},
	}

	render(){
		return(
			<Modal show={this.props.show} onHide={this.props.handleClose}>
	          	<Modal.Header closeButton>
	            	<Modal.Title>In thẻ sinh viên</Modal.Title>
	         	</Modal.Header>
		        <Modal.Body>
		        	<div className='card'>
		        		<div className='header-card'>
		        			<img src={logo} alt="Smiley face" className={'logo-card'}/>
		        			<div className='header-card-title'>
		        				<span style={{fontSize: '16px', display:'block'}}> TRƯỜNG ĐẠI HỌC KHOA HỌC TỰ NHIÊN </span>
		        				<span style={{fontSize: '12px'}}> PHÒNG CÔNG TÁC SINH VIÊN </span>
		        			</div>
		        		</div>
		        		<div className='body-card'>
		        			<div style={{textAlign: 'center'}}>
		        				<img src={logo} alt="Smiley face" className={'avt-card'}/>
		        				<span style={{fontWeight: 'bold'}}> 1512618 </span>
		        			</div>
		        			<div className='body-card-right'>
		        				<h4 style={{color: 'red', fontWeight: 'bold', textAlign: 'center'}}> THẺ LƯU TRÚ </h4>
		        				<h5 style={{color: 'blue', fontWeight: 'bold', textAlign: 'center'}}> Trần Thành Trung </h5>
		        				<h6> Ngày sinh: 03/08/1997</h6>
		        				<h6> Khoa: Công nghệ thông tin </h6>
		        				<h6> Trường: Đại học Khoa Học Tự Nhiên </h6>
		        				<h6 style={{margin: '0'}}> Phòng: 103 </h6>
		        			</div>
		        		</div>
		        		<div className='footer-card'>
		        			<span style={{background: '#82D348', margin:'-2px 0'}}>2019-2020</span>
		        			<span> KÍ TÚC XÁ 135B - TRẦN HƯNG ĐẠO, QUẬN 1, TP. HỒ CHÍ MINH</span>
		        		</div>
		        	</div>
		        </Modal.Body>
	        	<Modal.Footer>
	            	<Button variant='default' color='default' onClick={this.props.handleClose}>
	              		Đóng
		            </Button>
	            	<Button variant='default' onClick={this.props.handleClose}>
	            		In thẻ
		            </Button>
	          	</Modal.Footer>
        	</Modal>
		)
	}
}

export default PrintInforStudent;