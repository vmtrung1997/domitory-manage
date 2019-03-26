import React, { Component } from 'react'
import axios from './../../../config'
import { Row, Col } from 'react-bootstrap'

import './activity.css'
import Title from './../../../components/title/title'
import Button from './../../../components/button/button'
import InfoActivity from './../../../components/infoActivity/infoActivity'
import Input from './../../../components/input/input'
import ActivityModal from './activityModal'
import Loader from './../../../components/loader/loader'
import refreshToken from './../../../../utils/refresh_token'
import MyPagination from './../../../components/pagination/pagination'
import Select from './../../../components/selectOption/select'

class Activity extends Component{
	constructor(props){
		super(props)
		this.state = {
			totalPages: 1,
			page: 1,
			show: false,
			loading: false,
			last: {},
			data: [],
			yearSelected: new Date().getFullYear(),
			monthSelected: new Date().getMonth() + 1
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
				last: res.data.last,
				totalPages: res.data.rs.totalPages
			})
		})
		.catch( err => {
			this.setState({ loading: false })
		})
	}
	
	componentWillMount = () => {
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
	getValue = (state, value) => {
		this.setState({ 
			[state]: value, 
		})
	}
	getMonth = () => {
		var month = []
		for(var i = 0; i < 12; i++){
			month.push({value: i+1, label: i+1})
		}
		return month
	}
	getYear = () => {
		var year = []
		if(this.state.last){
			var date = new Date(this.state.last.ngay)
			var curDate = new Date().getFullYear()
			for(var i = date.getFullYear(); i <= curDate; i++){
				year.push({value: i, label: i})
			}
		}
		return year
	}
	render(){
		var month = this.getMonth()
		var year = this.getYear()
		return(
			<React.Fragment>
				<Loader loading={this.state.loading}/>
				<ActivityModal show={this.state.show} handleClose={this.handleClose} handleSave={this.handleSave}/>
				<Title> Hoạt động sinh viên </Title>
        		<div className={'content-body full'}>
					<div>
						<Row className={'m-b-10'}>
							<Col>
								<span> Tìm kiếm </span>
								<Input placeholder={'Hoạt động'}/>
							</Col>
							<Col md={2} xs={12}>
								<span> Tháng </span>
								<Select 
									options={month} 
									value={this.state.monthSelected} 
									selected={val => this.getValue('monthSelected',val)} 
								/>
							</Col>
							<Col md={3} xs={12}>
								<span> Năm </span>
              					<Select 
              						options={year} 
              						value={this.state.yearSelected}
              						selected={val => this.getValue('yearSelected', val)}
              					/>	
              				</Col>
              				<Col md={2} xs={12}>
              					<div>&nbsp;</div>
              					<Button style={{padding: '7px 15px'}} ><i className="fas fa-search" /></Button>
              				</Col>
              			</Row>		
						<div className='bts-header'>
							<Button color={'warning'} onClick={this.handleShow} style={{padding: '5px 20px'}}> 
								<i className="fas fa-plus"/>
							</Button>
							<Button style={{margin: '0 5px', padding: '5px 20px'}}>
                				<i className="fas fa-file-export"/>
                			</Button>
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