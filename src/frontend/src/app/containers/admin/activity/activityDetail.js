import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
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
		var joinTable = []
		var signUpTable = []
		var iSignup = 0
		var iJoin = 0
		var date = new Date(this.state.hd.ngay);
		var strDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

		this.state.data.map( (item, index) => {
			if(item.status === 0){
				iSignup++
				signUpTable.push(
					<tr key={index}>
						<td>{iSignup}</td>
						<td>{item.idSV.MSSV}</td>
						<td>{item.idSV.hoTen}</td>
					</tr>
				)
			} else {
				iJoin++
				joinTable.push(
					<tr key={index}>
						<td>{iJoin}</td>
						<td>{item.idSV.MSSV}</td>
						<td>{item.idSV.hoTen}</td>
					</tr>
				)
			}
			return true
		})
		return(
			<React.Fragment>
				<Loader loading={this.state.loading}/>
				<Title> Hoạt động sinh viên </Title>
        		<div className={'content-body full'}>
        			<Link to={'/admin/activity'} className="back">
                		<i className="fas fa-chevron-left"/>
                		<span>Trở về</span>
              		</Link>
					<div>
						<div style={{margin: '0 100px'}}>
							<div>
								<span style={{fontWeight: 'bold'}}> Hoạt động: </span>
								{this.state.hd.ten}
							</div>
							<div>
								<span style={{fontWeight: 'bold'}}>Thời gian: </span>
								{strDate}
							</div>
							<div>
								<span style={{fontWeight: 'bold'}}> Địa điểm: </span>
								{this.state.hd.diaDiem}
							</div>
							<div>
								<span style={{fontWeight: 'bold'}}> Điểm: </span>
								{this.state.hd.diem}
							</div>
							<div>
								<span style={{fontWeight: 'bold'}}> Bắt buộc: </span>
								{this.state.hd.batBuoc ? 'có' : 'không'}
							</div>
							<div>
								<span style={{fontWeight: 'bold'}}> Mô tả: </span>
							</div>
							<textarea rows={this.state.hd.moTa ? 4:1} value={this.state.hd.moTa} disabled={true}/>
						</div>
						<div> 
							 <span style={{fontWeight: 'bold'}}> Đăng ký: </span>
							{iSignup}
						</div>
						<Table bordered hover responsive size="sm" className="table-activity">
							<thead >
								<tr>
									<th>STT</th>
									<th>MSSV</th>
									<th>Họ tên</th>
								</tr>
							</thead>
							<tbody>
								{signUpTable}
							</tbody>
						</Table>
						<div>
							<span style={{fontWeight: 'bold'}}> Tham gia: </span>
							{iJoin}
						</div>
						<Table bordered hover responsive size="sm" className="table-activity">
							<thead >
								<tr>
									<th>STT</th>
									<th>Họ tên</th>
									<th>MSSV</th>
								</tr>
							</thead>
							<tbody>
								{joinTable}
							</tbody>
						</Table>
					</div>
				</div>

			</React.Fragment>
		)
	}
}

export default ActivityDetail