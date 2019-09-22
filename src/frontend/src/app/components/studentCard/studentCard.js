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
        		<div className='header-card color-card'>
        			<img src={logo} alt="Smiley face" className={'logo-card'}/>
        			<div className='header-card-title'>
        				<span> TRƯỜNG ĐẠI HỌC KHOA HỌC TỰ NHIÊN </span>
        				<span> PHÒNG CÔNG TÁC SINH VIÊN </span>
        			</div>
        		</div>
        		<div className='body-card'>
        			<div className={'img-card'} style={{textAlign: 'center'}}>
        				<img src={avt} alt="Smiley face" className={'avt-card'}/>
        				<span className='lb-MSSV'> { MSSV } </span>
        			</div>
        			<div className='body-card-right'>
        				<span className='name-card' > THẺ LƯU TRÚ </span>
        				<span className='name-person' > { hoTen } </span>
    					<span className='info-card'> Ngày sinh: <span className="info-content">{strDate}</span></span>
						<span className='info-card'> Khoa: <span className="info-content">{major} </span></span>
						<span className='info-card'> Trường: <span className="info-content">{school} </span></span>
						<span className='info-card'> Phòng: <span className="info-content print-room">{room} </span></span>
        			</div>
        		</div>
        		<div className='footer-card color-card'>
        			<span> {semester} KÍ TÚC XÁ 135B - TRẦN HƯNG ĐẠO, Q1, TP. HỒ CHÍ MINH</span>
        		</div>
        	</div>
		)
	}
}

export default StudentCard