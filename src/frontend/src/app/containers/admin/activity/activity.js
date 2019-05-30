import React, { Component } from 'react'
import axios from './../../../config'
import { Row, Col } from 'react-bootstrap'
import jwt_decode from 'jwt-decode'

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

	componentWillMount = () => {
		this.getData()
	}

	getData = async () => {
		this.setState({ loading: true})		
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
			for(var i = curDate; i >= date.getFullYear(); i--){
				year.push({value: i, label: i})
			}
		}
		return year
	}

	changeState = (key, value) => {
		this.setState({ [key]: value })
	}

	handleSearch = (page) => {
		this.setState({ page: page})
		this.getData()
	}

	render(){
		var month = this.getMonth()
		var year = this.getYear()
		var require = [
			{value: -1, label: 'Tất cả'},
			{value: true, label: 'Bắt buộc'},
			{value: false, label: 'Không bắt buộc'}
		]
		var lastDate = new Date().getFullYear()
		if(this.state.last)
			lastDate = new Date(this.state.last.ngayBD).getFullYear()
		const secret = JSON.parse(localStorage.getItem('secret'))
		const user = jwt_decode(secret.access_token).user
      	const isAdmin = user.userEntity.loai == 'DD' ? false : true

		return(
			<React.Fragment>
				<Loader loading={this.state.loading}/>
				<ActivityModal 
					show={this.state.showAdd}
					handleClose={() => this.changeState('showAdd', false)}
					handleSave={this.getData}
				/>
				<ActivityExport 
					last={lastDate}
					show={this.state.showExport}
					handleClose={() => this.changeState('showExport', false)}
					handleSave={this.getData}
				/>
				<Title> Hoạt động sinh viên </Title>
        		<div className={'content-body full'}>
					<div>
						<Row className={'m-b-10'}>
							<Col>
								<span> Hoạt động </span>
								<Input 
									placeholder={'Tìm kiếm'} 
									getValue={ (obj) => this.changeState('query', obj.value)}
									onKeyPress={ (e) => {if(e.key === 'Enter') this.handleSearch(1)}}
								/>
							</Col>
							<Col md={2} xs={12}>
								<span> Tháng </span>
								<Select 
									options={month} 
									value={this.state.monthSelected} 
									selected={val => this.changeState('monthSelected',val)} 
								/>
							</Col>
							<Col md={2} xs={12}>
								<span> Năm </span>
              					<Select 
              						options={year} 
              						value={this.state.yearSelected}
              						selected={val => this.changeState('yearSelected', val)}
              					/>	
              				</Col>
              				<Col md={2} xs={12}>
								<span> Hình thức </span>
              					<Select 
              						options={require} 
              						value={this.state.require}
              						selected={val => this.changeState('require', val)}
              					/>	
              				</Col>
              				<Col md={1} xs={12}>
              					<div>&nbsp;</div>
              					<Button title={'Tìm kiếm'} style={{padding: '7px 15px'}} onClick={e => this.handleSearch(1)}><i className="fas fa-search" /></Button>
              				</Col>
              			</Row>
              			{ isAdmin ? (
              				<div className='bts-header'>
								<Button title={'Thêm mới'} color={'warning'} onClick={() => this.changeState('showAdd', true)} style={{padding: '5px 20px'}}> 
									<i className="fas fa-plus"/>
								</Button>
								<Button title={'Xuất báo cáo'} onClick={() => this.changeState('showExport', true)}  style={{margin: '0 5px', padding: '5px 20px'}}>
	                				<i className="fas fa-file-export"/>
	                			</Button>
							</div>
              			):(
              				<>
              				</>
              			)}		
						
					</div>
					<InfoActivity data={this.state.data} refresh={this.getData}/>
					<div style={{display: 'flex', justifyContent: 'space-between'}}>
						<div style={{display: 'flex', alignItems: 'baseline'}}>
			                <span style={{marginRight: '2px'}}>Trang</span>
			                <Input width='40px' textAlign='center' value={this.state.page}/>
			                <span>/{this.state.totalPages}</span>
			            </div>
						<div className={'is-pagination'}>
							<MyPagination 
								page={this.state.page} 
								totalPages={this.state.totalPages} 
								clickPage={this.handleSearch}
							/>
		            	</div>
	            	</div>
				</div>

			</React.Fragment>
		)
	}
}

export default Activity