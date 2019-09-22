import React, { Component } from 'react'
import {Row,Col} from 'react-bootstrap'
import Title from '../../../components/title/title';
import DatePicker from '../../../components/datePicker/datePicker'
import MyPagination from './../../../components/pagination/pagination'
import Button from '../../../components/button/button';
import {findHistory} from './historyAction'
import {Link} from 'react-router-dom'
import './history.css'
import Loader from '../../../components/loader/loader';
import RadioButton from '../../../components/radioButton/radioButton';
import Select from '../../../components/selectOption/select';
class Security extends Component{
	constructor(props) {
			super(props);
			this.state ={
				fromDate: new Date(),
				toDate: new Date(),
				page: 1,
				limit: 12,
				totalPages: 0,
				table: [],
				loading: false,
				type: 'in-dormitory'
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
				this.setState({
					table: result.data.data.docs,
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
			type: this.state.type,
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
				this.setState({
					table: result.data.data.docs,
					page: page,
					totalPages: result.data.data.totalPages
				})
				this.setState({loading: false})
			}
		}).catch(err => {
			this.setState({loading: false})
		})
	}
	typeSelected = e => {
		this.setState({type: e});
	}
	render(){
		let options = [
			{value: 'in-dormitory', label: 'Vào ký túc xá'},
			{value: 'out-dormitory', label: 'Ra ký túc xá'}
		]
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
						<Col>&nbsp;<Col>
						<Select options={options} value={this.state.type} selected={this.typeSelected} />
						</Col></Col>
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
											{value.profile.img ?<img alt={value.profile._id} src={value.profile.img}/>:<div>Chưa cập nhật ảnh</div>}
											</div>
											<div className={'item-history-text'}>
												<div><Link to={`/admin/student/detail/${value.profile.MSSV}`}>{value.profile.MSSV}</Link></div>
												<div>{value.profile.hoTen}</div>
												<div>{value.profile.idPhong?value.profile.idPhong.tenPhong:"Chưa cập nhật phòng"}</div>
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