import React, { Component } from 'react'
import axios from './../../../config'

import './activity.css'
import Title from './../../../components/title/title'
import Button from './../../../components/button/button'
import InfoActivity from './../../../components/infoActivity/infoActivity'
import ActivityModal from './activityModal'
import Loader from './../../../components/loader/loader'
import refreshToken from './../../../../utils/refresh_token'
import MyPagination from './../../../components/pagination/pagination'

class Activity extends Component{
	constructor(props){
		super(props)
		this.state = {
			totalPages: 1,
			page: 1,
			show: false,
			loading: false,
			data: []
		}
	}

	getData = async () => {
		await refreshToken()
		var secret = JSON.parse(localStorage.getItem('secret'))
		axios.get(`/manager/activity/get_activity?page=${this.state.page}`,{
			headers: { 'x-access-token': secret.access_token}
		})
      	.then(res => {  
       	    this.setState({
    	    	data: res.data.rs.docs,
				loading: false,
				show: false,
				totalPages: res.data.rs.totalPages
			})
		})
		.catch( err => {
			this.setState({ loading: false })
		})
	}
	
	componentDidMount = () => {
		this.setState({ loading: true})		
		this.getData()
	}

	handleShow = () => {
		this.setState({ show: true })
	}
	handleClose = () => {
		this.setState({ show: false })
	}
	clickPage = (page) => {
		this.setState({ 
			page: page,
		})
		this.getData()
	}
	handleSave = () => {
		this.getData()
	}
	render(){	
		return(
			<React.Fragment>
				<Loader loading={this.state.loading}/>
				<ActivityModal show={this.state.show} handleClose={this.handleClose} handleSave={this.handleSave}/>
				<Title> Hoạt động sinh viên </Title>
        		<div className={'content-body full'}>
					<div className='header-optimize'>
						<div/>
						<div className='bts-header'>
							<Button className='bt-header' color='success' onClick={this.handleShow}>Thêm</Button>
							<Button className='bt-header' color='success'>Báo cáo</Button>
						</div>
					</div>
					<InfoActivity data={this.state.data} refresh={this.getData}/>
					<div className={'is-pagination'}>
						<MyPagination page={this.state.page} totalPages={this.state.totalPages} clickPage={this.clickPage}/>
	            	</div>
				</div>

			</React.Fragment>
		)
	}
}

export default Activity