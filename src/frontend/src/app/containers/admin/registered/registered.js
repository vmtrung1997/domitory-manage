import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from "react-toasts";

import refreshToken from './../../../../utils/refresh_token'
import axios from './../../../config'
import Input from './../../../components/input/input'
import Button from './../../../components/button/button'
import MyPagination from './../../../components/pagination/pagination'
import Loader from './../../../components/loader/loader'
import Title from './../../../components/title/title'
import RegisteredTable from './registeredTable'
import Select from './../../../components/selectOption/select'
import './registered.css'

class Registered extends Component{
	constructor(props){
		super(props)
		this.state = {
			accept: 'all',
			loading: false,
			query: '',
			check: {},
			totalPages: 1,
			yearSelected: 0,
			page: 1
		}
	}

	componentDidMount(){
		this.getData()
	}

	getData = async () => {
		this.setState({ loading: true})		
		await refreshToken()
		var secret = JSON.parse(localStorage.getItem('secret'))
		axios({
			method: 'post',
      		url: `/manager/register/getListRegister`,
			headers: { 'x-access-token': secret.access_token},
			data: {
				page: this.state.page,
				rule: this.state.rule,
				accept: this.state.accept,
				year: this.state.yearSelected
			}
		})
      	.then(res => {
      		var check = {} 
			res.data.rs.docs.map((row, index) => { 
				check[row._id]= false
			})
       	    this.setState({
       	    	last: res.data.last,
       	    	point: res.data.point,
    	    	data: res.data.rs.docs,
				loading: false,
				check: check,
				totalPages: res.data.rs.totalPages
			})
		})
		.catch( err => {
			this.setState({ loading: false })
		})
	}

	checkBox = (e) => {
		var check = this.state.check
		check[e.id] = e.bool
		this.setState({check: check})
	}

	handleClick = async () => {
		await refreshToken()
		var secret = JSON.parse(localStorage.getItem('secret'))
		axios({
			method: 'post',
      		url: '/manager/register/acceptRequest',
			headers: { 'x-access-token': secret.access_token},
			data: {
				check: this.state.check,
			}
		})
      	.then(res => {
       		this.getData()
      		ToastsStore.success("Cập nhập thành công!");
		})
		.catch( err => {
			this.setState({ loading: false })
		    ToastsStore.error("Cập nhập không thành công!");
		})
	}

	changeState = (key, value) => {
		this.setState({ [key]: value })
	}

	handleSearch = (page) => {
		this.setState({ page: page })
		this.getData()
	}

	render(){
		var accept = [
			{value: 'all', label: 'Tất cả'},
			{value: true, label: 'Đồng ý'},
			{value: false, label: 'Chưa đồng ý'}
		]

		return(
			<React.Fragment>
        		<ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>
				<Loader loading={this.state.loading}/>
				<Title> Hoạt động sinh viên </Title>

        		<div className={'content-body full'}>
					<div>
						<Row className={'m-b-10'}>
              				<Col md={5} xs={12}>
								<span> Xác nhận </span>
              					<Select 
              						options={accept} 
              						value={this.state.accept}
              						selected={val => this.changeState('accept', val)}
              					/>	
              				</Col>
              				<Col md={2} xs={12}>
              					<div>&nbsp;</div>
              					<Button 
              						title={'Tìm kiếm'}
              						style={{padding: '7px 15px'}}
              						onClick={ e => this.handleSearch(1)}
              					>
              						<i className="fas fa-search" />
              					</Button>
              				</Col>
              			</Row>
              			<div className='bts-header'>
							<Button 
								title={'Xác nhận'}
								color={'primary'}
								onClick={ e => this.handleClick()}
								style={{padding: '5px 20px', fontSize:'14px'}}
							> 
								Xác nhận
							</Button>
						</div>	
					</div>
					<RegisteredTable 
						data={this.state.data} 
						check={this.state.check} 
						point={this.state.point} 
						checkBox={e => {this.checkBox(e)}}
					/>
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

export default Registered