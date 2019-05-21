import React, { Component } from 'react'
import axios from './../../../config'
import { Row, Col } from 'react-bootstrap'

import './account.css'
import Title from './../../../components/title/title'
import Button from './../../../components/button/button'
import AccountTable from './accountTable'
import Input from './../../../components/input/input'
import Loader from './../../../components/loader/loader'
import refreshToken from './../../../../utils/refresh_token'
import MyPagination from './../../../components/pagination/pagination'
import Select from './../../../components/selectOption/select'
import AccountAdd from './accountAdd'

class Account extends Component{
	constructor(props){
		super(props)
		this.state = {
			totalPages: 1,
			page: 1,
			showAdd: false,
			loading: false,
			query: '',
			rule: '',
			data: []
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
      		url: `/manager/account/get_list_account?page=${this.state.page}`,
			headers: { 'x-access-token': secret.access_token},
			data: {
				search: this.state.query,
				rule: this.state.rule,
			}
		})
      	.then(res => {
       	    this.setState({
    	    	data: res.data.rs.docs,
				loading: false,
				showAdd: false,
				totalPages: res.data.rs.totalPages
			})
		})
		.catch( err => {
			this.setState({ loading: false })
		})
	}

	changeState = (key, value) => {
		this.setState({ [key]: value })
	}

	handleSearch = (page) => {
		this.setState({ page: page })
		this.getData()
	}

	getRule = () => {
		return [
			{value: '', label: 'Tất cả'},
			{value: 'SA', label: 'Trưởng quản lý'},
			{value: 'AM', label: 'Quản lý'},
			{value: 'BV', label: 'Bảo vệ'},
			{value: 'SV', label: 'Sinh viên'},
		]
	}
	
	render(){
		var rule = this.getRule()
		
		return(
			<React.Fragment>
				<Loader loading={this.state.loading}/>
				<AccountAdd 
					show={this.state.showAdd}
					handleClose={() => this.changeState('showAdd', false)}
					handleSave={this.getData}
				/>
				<Title> Hoạt động sinh viên </Title>

        		<div className={'content-body full'}>
					<div>
						<Row className={'m-b-10'}>
							<Col>
								<span> Tài khoản </span>
								<Input 
									placeholder={'Tìm kiếm'} 
									getValue={ (obj) => this.changeState('query', obj.value)}
									onKeyPress={ e => {if(e.key === 'Enter') this.handleSearch(1)}}
								/>
							</Col>
							<Col md={3} xs={12}>
								<span> Phân quyền </span>
								<Select 
									options={rule} 
									value={this.state.rule} 
									selected={val => this.changeState('rule',val)} 
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
								title={'Thêm mới'}
								color={'warning'}
								onClick={ e => this.changeState('showAdd', true)}
								style={{padding: '5px 20px'}}
							> 
								<i className="fas fa-plus"/>
							</Button>
						</div>
					</div>
					<AccountTable data={this.state.data} refresh={this.getData}/>
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

export default Account