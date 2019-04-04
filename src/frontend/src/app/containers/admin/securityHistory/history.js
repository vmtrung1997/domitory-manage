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
				fromDate: '2016-3-1',
				toDate: '2016-3-1',
				page: 1,
				limit: 10,
				totalPages: 0,
				table: [],
				loading: false
			}
	}
	componentDidMount(){
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
		console.log(parameter);
		findHistory(parameter).then(result => {
			console.log(result);
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
			console.log(err)})
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
						<div><DatePicker getValue={(date) => {this.setState({fromDate: date})}}/></div>
						</Col>
						<Col>
						Đến ngày
						<div><DatePicker getValue={(date) => {this.setState({toDate: date})}}/></div>
						</Col>
						<Col>&nbsp;<Col><Button onClick={e => this.onHandleSubmit(1)}><i className="fas fa-search" /></Button></Col></Col>
					</Row>
					<Row>
					<div>
						{this.state.table.length>0 && <div className={'table-history'}>
							{this.state.table.map((value, index) => {
								let thoiGian = new Date(value.thoiGian)
								if (value.profile!==null){
									return (
										<div className={'item-history'} key={index}>
											<div className={'item-image'}>
												<img src={value.imgFile !== "" ? value.imgFile : defaultImage} />
											</div>
											<div className={'item-text'}>
												<div>{value.profile.hoTen}</div>
												<div>{value.profile.idPhong.tenPhong}</div>
												<div>{thoiGian.toLocaleTimeString() + ' ' + thoiGian.toLocaleDateString()}</div>
											</div>
										</div>
									)
								}
							})}
						</div>}
						</div>
				<div className="float-right">
				{
				this.state.table && this.state.table.length > 0?
				<MyPagination page={this.state.page} totalPages={this.state.totalPages} clickPage={this.onHandleSubmit}/>:''
				}
				</div>
					</Row>
				</div>
      </React.Fragment>

  		)
	}
}

export default Security