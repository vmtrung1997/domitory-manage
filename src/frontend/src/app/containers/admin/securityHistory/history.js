import React, { Component } from 'react'
import {Row,Col} from 'react-bootstrap'
import Title from '../../../components/title/title';
import DatePicker from '../../../components/datePicker/datePicker'
import MyPagination from './../../../components/pagination/pagination'
import Button from '../../../components/button/button';
import {findHistory} from './historyAction'
import { imageFile,defaultImage } from '../../../function/imageFunction'
import './history.css'
import Loader from '../../../components/loader/loader';
class Security extends Component{
	constructor(props) {
			super(props);
			this.state ={
				fromDate: new Date(),
				toDate: new Date(),
				page: 1,
				limit: 10,
				totalPages: 0,
				table: [],
				loading: false
			}
	}
	componentDidMount(){
		this.setState({
			loading: true
		})
		var parameter = {
			time: {
				fromDate: this.state.fromDate,
				toDate: this.state.toDate
			},
			options: {
				page: 1,
				limit: this.state.limit
			}
		}
		findHistory(parameter).then(result => {
			if (result.data){
				var table = result.data.data.docs.map(value => {
					var profile = value.profile
					value.imgFile = profile && ('img' in profile)?imageFile(value.profile.img):''
					return value;
				})
				this.setState({
					table: table,
					page: 1,
					totalPages: result.data.data.totalPages
				})
				this.setState({loading: false})
			}
		}).catch(err => {
			this.setState({loading: false})
		})
	}
	
	onHandleSubmit = (page) => {
		var {state} = this;
		this.setState({loading: true})
		var parameter = {
			time: {
				fromDate: state.fromDate,
				toDate: state.toDate
			},
			options: {
				page: page,
				limit: state.limit
			}
		}
		findHistory(parameter).then(result => {
			if (result.data){
				var table = result.data.data.docs.map(value => {
					var profile = value.profile
					value.imgFile = profile && ('img' in profile)?imageFile(value.profile.img):''
					return value;
				})
				this.setState({
					table: table,
					page: page,
					totalPages: result.data.data.totalPages
				})
				this.setState({loading: false})
			}
		}).catch(err => {
			this.setState({loading: false})
		})
	}
	render(){
		return(
      <React.Fragment>
				<Loader loading={this.state.loading}/>
        <Title>Lịch sử ra vào</Title>
				<div className="content-body">
					<Row>
						<Col>
						Từ ngày
						<div>
							<DatePicker 
								startDate={this.state.fromDate}
								getValue={(date) => {this.setState({fromDate: date})}}
							/>
						</div>
						</Col>
						<Col>
						Đến ngày
						<div>
							<DatePicker
								startDate={this.state.toDate}
								getValue={(date) => {this.setState({toDate: date})}}
							/>
						</div>
						</Col>
						<Col>&nbsp;<Col><Button onClick={e => this.onHandleSubmit(1)}><i className="fas fa-search" /></Button></Col></Col>
					</Row>
					<div style={{display: 'flex', justifyContent: 'center'}}>
						{this.state.table.length>0 && <div className={'table-history'}>
							{this.state.table.map((value, index) => {
								let thoiGian = new Date(value.thoiGian)
								if (value.profile!==null){
									return (
										<div className={'item-history'} key={index}>
											<div className={'item-image'}>
												<img alt={value.profile._id} src={value.imgFile !== "" ? value.imgFile : defaultImage} alt="hinh" />
											</div>
											<div className={'item-text'}>
												<div>{value.profile.hoTen}</div>
												<div>{value.profile.idPhong.tenPhong}</div>
												<div>{thoiGian.toLocaleTimeString() + ' ' + thoiGian.toLocaleDateString()}</div>
											</div>
										</div>
									)
								}
								return (<div></div>)
							})}
						</div>}
						</div>
				<div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', marginRight: '20px'}}>
					{
					this.state.table && this.state.table.length > 0?
					<MyPagination page={this.state.page} totalPages={this.state.totalPages} clickPage={this.onHandleSubmit}/>:''
					}
				</div>
				</div>
      </React.Fragment>

  		)
	}
}

export default Security