import React, { Component } from 'react'

import logo from './../../../utils/image/logo_HCMUS.jpg'
import './studentCard.css'

class StudentCard extends Component{
	static defaultProps = {
		data: {},
	}

	render(){
		const date = new Date()
		const { hoTen, MSSV, ngaySinh, idPhong, nganhHoc, truong, img } = this.props.data
		var avt = img ? img: logo
		var strDate = new Date(ngaySinh).toLocaleDateString('en-GB')
		var semester = (date.getFullYear() - 1 ) + '-' + date.getFullYear()
		if(date.getMonth() >= 6){
			semester = date.getFullYear() + '-' + (date.getFullYear() + 1)
		}
		var room = '' , major = '', school = ''
		if(idPhong){
			room = idPhong.tenPhong
		}
		if(nganhHoc){
			major = nganhHoc.tenNganh
		}
		if(truong){
			school = truong.tenTruong
		}

		return (
			<div className='card'>
        		<div className='header-card'>
        			<img src={logo} alt="Smiley face" className={'logo-card'}/>
        			<div className='header-card-title'>
        				<span style={{fontSize: '14px', display:'block'}}> TRƯỜNG ĐẠI HỌC KHOA HỌC TỰ NHIÊN </span>
        				<span style={{fontSize: '11px'}}> PHÒNG CÔNG TÁC SINH VIÊN </span>
        			</div>
        		</div>
        		<div className='body-card'>
        			<div style={{textAlign: 'center'}}>
        				<img src={avt} alt="Smiley face" className={'avt-card'}/>
        				<span style={{fontWeight: 'bold'}}> { MSSV } </span>
        			</div>
        			<div className='body-card-right'>
        				<span className='name-card' style={{color: 'red'}}> THẺ LƯU TRÚ </span>
        				<span className='name-card' style={{color: 'blue'}}> { hoTen } </span>
        				<span className='info-card'> Ngày sinh: { strDate }</span>
        				<span className='info-card'> Khoa: {major} </span>
        				<span className='info-card'> Trường: {school} </span>
        				<span className='info-card'> Phòng: {room} </span>
        			</div>
        		</div>
        		<div className='footer-card'>
        			<span style={{background: '#82D348', marginRight:'4px'}}>{semester}</span>
        			<span>  KÍ TÚC XÁ 135B - TRẦN HƯNG ĐẠO, Q1, TP. HỒ CHÍ MINH</span>
        		</div>
        	</div>
		)
	}
}

export default StudentCard