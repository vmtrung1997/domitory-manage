import React, { Component } from 'react'
import axios from 'axios'

import './activity.css'
import Title from './../../../components/title/title'
import Button from './../../../components/button/button'
import InfoActivity from './../../../components/infoActivity/infoActivity'
import InfoActivityTable from './../../../components/infoActivity/infoActivityTable'
import ActivityModal from './activityModal'
import Loader from './../../../components/loader/loader'

axios.defaults.baseURL = 'http://localhost:4000/api'

class Activity extends Component{
	constructor(props){
		super(props)
		this.state = {
			page: 1,
			isTable: true,
			show: false,
			loading: false,
			data: []
		}
	}

	componentDidMount = () => {
		var secret = JSON.parse(localStorage.getItem('secret'))

		this.setState({ loading: true})
		axios.get(`/manager/activity/get_activity?page=${this.state.page}`,{
			headers: { 'x-access-token': secret.access_token}
		})
      	.then(res => {
    	    this.setState({data: res.data.rs.docs})
		})
		.catch( err => {
			axios.get(`/user/me_access`,  {
            	headers: { 'x-refresh-token': secret.refresh_token }
        	})
        	.then( res => {
        		localStorage.setItem('secret', JSON.stringify(res.data))
        		axios.get(`/manager/activity/get_activity?page=${this.state.page}`,{
					headers: { 'x-access-token': res.access_token}
				})
				.then(res => {
	    	    	this.setState({data: res.data.rs.docs})
				})
        	})
		}).then( () => {
			this.setState({ loading: false})
		})
	}
	isCheckTable = (val) => {
		this.setState({ isTable: val })
	}
	handleShow = () => {
		this.setState({ show: true })
	}
	handleClose = () => {
		this.setState({ show: false })
	}
	handleSave = () => {
		this.setState({ show: false })
	}
	render(){	
		const tmp = this.state.data.map((item , i) => {
			return(
				<InfoActivity
					name = {item.ten}
					time = {item.ngay}
					location= {item.diaDiem}
					par = {item.soLuong}
					rule = {item.batBuoc}
					status = {item.status}
				/>
			)
		})
		return(
			<React.Fragment>
				<Loader loading={this.state.loading}/>
				<Title> Hoạt động sinh viên </Title>
        		<div className={'content-body'}>
					<div className='header-optimize'>
						<div>
							<Button 
								color='default' 
								style={{margin: '3px', border: '1px solid #bababa'}} 
								onClick={() => this.isCheckTable(true)}
							>
								<i className="fas fa-list-ul"></i>
							</Button>
							<Button 
								color='default' 
								style={{border: '1px solid #bababa'}} 
								onClick={() => this.isCheckTable(false)}
							>
								<i className="fas fa-table"></i>
							</Button>
						</div>
						<div className='bts-header'>
							<Button className='bt-header' color='success' onClick={this.handleShow}>Thêm</Button>
							<ActivityModal show={this.state.show} handleClose={this.handleClose} handleSave={this.handleSave}/>
							<Button className='bt-header' color='success'>Báo cáo</Button>
						</div>
					</div>
					{ this.state.isTable ? 
						<InfoActivityTable data={this.state.data}/>
						:
						<div className="infor-activity">
							{tmp}
						</div>

					}
				</div>
			</React.Fragment>
		)
	}
}

export default Activity