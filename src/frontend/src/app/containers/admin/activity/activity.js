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
import ActivityExport from './activityExport'

class Activity extends Component{
	constructor(props){
		super(props)
		this.state = {
			totalPages: 1,
			page: 1,
			showAdd: false,
			showExport: false,
			loading: false,
			query: '',
			last: {},
			data: [],
			yearSelected: 0,
			monthSelected: 0,
			require: -1
		}
	}

	getData = async () => {
		await refreshToken()
		var secret = JSON.parse(localStorage.getItem('secret'))
		axios({
			method: 'post',
      		url: `/manager/activity/get_activity?page=${this.state.page}`,
			headers: { 'x-access-token': secret.access_token},
			data: {
				search: this.state.query,
				year: this.state.yearSelected,
				month: this.state.monthSelected,
				require: this.state.require
			}
		})
      	.then(res => {
       	    this.setState({
    	    	data: res.data.rs.docs,
				loading: false,
				showAdd: false,
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

	handleShow = (nameModal) => {
		this.setState({ [nameModal]: true })
	}
	handleClose = (nameModal) => {
		this.setState({ [nameModal]: false })
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
		var month = [{value: 0, label: 'Tất cả'}]
		for(var i = 0; i < 12; i++){
			month.push({value: i+1, label: i+1})
		}
		return month
	}
	getYear = () => {
		var year = [{value: 0, label: 'Tất cả'}]
		if(this.state.last){
			var date = new Date(this.state.last.ngayBD)
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
		var require = [
			{value: -1, label: 'Tất cả'},
			{value: true, label: 'Bắt buộc'},
			{value: false, label: 'Không bắt buộc'}
		]
		return(
			<React.Fragment>
				<Loader loading={this.state.loading}/>
				<ActivityModal show={this.state.showAdd} handleClose={() => this.handleClose('showAdd')} handleSave={this.handleSave}/>
				<ActivityExport show={this.state.showExport} handleClose={() =>this.handleClose('showExport')} handleSave={this.handleSave}/>
				<Title> Hoạt động sinh viên </Title>
        		<div className={'content-body full'}>
					<div>
						<Row className={'m-b-10'}>
							<Col>
								<span> Hoạt động </span>
								<Input 
									placeholder={'Tìm kiếm'} 
									getValue={ (obj) => this.getValue('query', obj.value)}
									onKeyPress={ (e) => {if(e.key === 'Enter') this.getData()}}
								/>
							</Col>
							<Col md={2} xs={12}>
								<span> Tháng </span>
								<Select 
									options={month} 
									value={this.state.monthSelected} 
									selected={val => this.getValue('monthSelected',val)} 
								/>
							</Col>
							<Col md={2} xs={12}>
								<span> Năm </span>
              					<Select 
              						options={year} 
              						value={this.state.yearSelected}
              						selected={val => this.getValue('yearSelected', val)}
              					/>	
              				</Col>
              				<Col md={2} xs={12}>
								<span> Hình thức </span>
              					<Select 
              						options={require} 
              						value={this.state.require}
              						selected={val => this.getValue('require', val)}
              					/>	
              				</Col>
              				<Col md={1} xs={12}>
              					<div>&nbsp;</div>
              					<Button title={'Tìm kiếm'} style={{padding: '7px 15px'}} onClick={this.getData}><i className="fas fa-search" /></Button>
              				</Col>
              			</Row>		
						<div className='bts-header'>
							<Button title={'Thêm mới'} color={'warning'} onClick={() => this.handleShow('showAdd')} style={{padding: '5px 20px'}}> 
								<i className="fas fa-plus"/>
							</Button>
							<Button title={'Xuất báo cáo'} onClick={() => this.handleShow('showExport')}  style={{margin: '0 5px', padding: '5px 20px'}}>
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