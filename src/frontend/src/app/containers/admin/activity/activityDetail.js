import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table, Col } from 'react-bootstrap'
import axios from 'axios'

import './activityDetail.css'
import refreshToken from './../../../../utils/refresh_token'
import Loader from './../../../components/loader/loader'
import Title from './../../../components/title/title'


class ActivityDetail extends Component{
	constructor(props){
		super(props)
		this.state = {
			signup: 0,
			join: 0,
			loading: false,
			hd: {},
			data: []
		}
	}
	componentWillMount = async () => {
		await refreshToken()
		this.setState({ loading: true })
		var secret = JSON.parse(localStorage.getItem('secret'))
		axios.get(`/manager/activity/detail?id=${this.props.match.params.id}`,{
			headers: { 'x-access-token': secret.access_token}
		})
      	.then(res => {  
       	    this.setState({
       	    	hd: res.data.hd[0],
    	    	data: res.data.rs,
				loading: false,
			})
		})
		.catch( err => {
			this.setState({ loading: false })
		})
	}
	render(){
		var table = []
		var iSignup = 0
		var iJoin = 0

		var date = new Date(this.state.hd.ngayBD);
		var strDateStart = `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
		date = new Date(this.state.hd.ngayKT);
		var strDateEnd = `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

		this.state.data.map( (item, index) => {
			if(item.status === 0){
				iSignup++
			}
			else{
				iJoin++
			}

			table.push(
				<tr key={index}>
					<td>{index + 1}</td>
					<td>{item.idSV.MSSV}</td>
					<td>{item.idSV.hoTen}</td>
					{item.isDK ? (
						<td style={{textAlign: 'center', color: '#04C913'}}> 
							<i className="fas fa-check"></i> 
						</td>
					) : (<td> </td>)}
					{item.isTG ? (
						<td style={{textAlign: 'center', color: '#04C913'}}> 
							<i className="fas fa-check"></i> 
						</td>
					) : (<td> </td>)}
				</tr>
			)
			return true
		})
		return(
			<React.Fragment>
				<Loader loading={this.state.loading}/>
				<Title> Hoạt động sinh viên </Title>
        		<div style={{height: '500px', overflow: 'auto'}} className={'content-body full'}>
        			<Link to={'/admin/activity'} className="back">
                		<i className="fas fa-chevron-left"/>
                		<span>Trở về</span>
              		</Link>
              		<div className="title-detail"> Chi tiết hoạt động </div>
					<div className="detail-activity">
						<Col md={3} style={{textAlign: 'right'}}>
							<p style={{fontWeight: 'bold'}}> Hoạt động </p>
							<p style={{fontWeight: 'bold'}}> Thời gian bắt đầu </p>
							<p style={{fontWeight: 'bold'}}> Thời gian kết thúc </p>
							<p style={{fontWeight: 'bold'}}> Địa điểm </p>
							<p style={{fontWeight: 'bold'}}> Điểm </p>
							<p style={{fontWeight: 'bold'}}> Bắt buộc </p>
							<p style={{fontWeight: 'bold'}}> Mô tả </p>
						</Col>
						<Col>
							<p>	{this.state.hd.ten} </p>
							<p> {strDateStart} </p>
							<p> {strDateEnd} </p>
							{this.state.hd.diaDiem ?
								<p> {this.state.hd.diaDiem} </p>
								:
								<p> &nbsp; </p>
							}
							{this.state.hd.diem ?
								<p> {this.state.hd.diem} </p>
								:
								<p> &nbsp; </p>
							}
							<p> {this.state.hd.batBuoc ? 'có' : 'không'} </p>
							<textarea rows={this.state.hd.moTa ? 4:1} value={this.state.hd.moTa} disabled={true}/>
						</Col>
					</div>
					<Table bordered hover responsive size="sm" className="table-activity">
						<thead style={{background: '#cfcfcf', textAlign: 'center'}}>
							<tr>
								<th>STT</th>
								<th>MSSV</th>
								<th>Họ tên</th>
								<th>Đăng ký</th>
								<th>Tham gia</th>
							</tr>
						</thead>
						<tbody>
							{table}
							<tr>
								<td colSpan="3" style={{border: 'none'}}></td>
								<td>Đăng ký: {iSignup}</td>
								<td>Tham gia: {iJoin}</td>
							</tr>
						</tbody>
					</Table>
				</div>

			</React.Fragment>
		)
	}
}

export default ActivityDetail