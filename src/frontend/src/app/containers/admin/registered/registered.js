import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'

import refreshToken from './../../../../utils/refresh_token'
import axios from './../../../config'
import Input from './../../../components/input/input'
import Button from './../../../components/button/button'
import MyPagination from './../../../components/pagination/pagination'
import Loader from './../../../components/loader/loader'
import Title from './../../../components/title/title'
import RegisteredTable from './registeredTable'
import './registered.css'

class Registered extends Component{
	constructor(props){
		super(props)
		this.state = {
			loading: false,
			query: '',

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
				search: this.state.query,
				rule: this.state.rule,
			}
		})
      	.then(res => {
       	    this.setState({
       	    	point: res.data.point,
    	    	data: res.data.rs.docs,
				loading: false,
				totalPages: res.data.rs.totalPages
			})
		})
		.catch( err => {
			this.setState({ loading: false })
		})
	}
	render(){
		return(
			<React.Fragment>
				<Loader loading={this.state.loading}/>
				<Title> Hoạt động sinh viên </Title>

        		<div className={'content-body full'}>
					<div>
						<Row className={'m-b-10'}>
							<Col>
								<Input 
									placeholder={'Tìm kiếm'} 
									getValue={ (obj) => this.changeState('query', obj.value)}
									onKeyPress={ e => {if(e.key === 'Enter') this.handleSearch(1)}}
								/>
							</Col>
              				<Col md={2} xs={12}>
              					<Button 
              						title={'Tìm kiếm'}
              						style={{padding: '7px 15px'}}
              						onClick={ e => this.handleSearch(1)}
              					>
              						<i className="fas fa-search" />
              					</Button>
              				</Col>
              			</Row>		
					</div>
					<RegisteredTable data={this.state.data} point={this.state.point}/>
					<div className={'is-pagination'}>
						<MyPagination 
							page={this.state.page} 
							totalPages={this.state.totalPages} 
							clickPage={this.handleSearch}
						/>
	            	</div>
				</div>

			</React.Fragment>
		)
	}
}

export default Registered