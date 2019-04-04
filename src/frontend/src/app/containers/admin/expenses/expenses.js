import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap'
import SSelect from 'react-select';

import Button from '../../../components/button/button'
import Select from '../../../components/selectOption/select'
import ModalExpense from './expensesModal'
import Title from '../../../components/title/title'
import ExpenseTable from '../expenses/expenseTable'
import { search, getData } from '../expenses/expensesAction'
import {get_month, get_year, get_status} from './expenseRepo'
import Loader from './../../../components/loader/loader'
import ModalConfig from './expenseConfig'
import ModalExport from './expenseExport'


class Expenses extends Component {
	static propTypes = {
		label: PropTypes.string,
	}
	constructor(props) {
		super(props)
		this.state = {
			dataTable: { docs: [] },
			rooms: [],
			sendRoom: [],
			roomSelected: 0,
			monthSelected: 0,
			yearSelected: 0,
			statusSelected: 2,
			loading: false,
			options: {
				page: 1,
				limit: 10
			},
			show: true
		}
	}
	componentDidMount() {
		var self = this;
		getData().then(result => {
			if (result.data) {
				var roomOptions = result.data.result.map(room => ({ value: room._id, label: room.tenPhong }))
				roomOptions.unshift({ value: 0, label: 'Tất cả' });
				self.setState({ rooms: roomOptions });
				self.searchTable(1);
			}
		}).catch(err => {})
	}
	searchTable = (page) => {
		this.handleLoading(true)
		this.setState({options: {page: 1}})
		var options = {
			month: parseInt(this.state.monthSelected),
			year: parseInt(this.state.yearSelected),
			room: this.state.roomSelected,
			status: parseInt(this.state.statusSelected),
			options: this.state.options
		}
		options.options.page=page
		search(options).then(result => {
			if (result.data) {
				this.setState({ dataTable: result.data.rs, loading: false,options: {page: 1} })
			}
		}).catch(error => {});
	}
	roomSelected = selectedOption => {
		this.setState({ roomSelected: selectedOption, options: { page: 1 } })
	}
	monthSelected = value => {
		this.setState({ monthSelected: value, options: { page: 1 } })
	}
	yearSelected = value => {
		this.setState({ yearSelected: value, options: { page: 1 } })
	}
	statusSelected = value => {
		this.setState({ statusSelected: value, options: { page: 1 } })
	}
	pageChange = value => {
		this.searchTable(value)
	}
	handleLoading = (value) => {
		this.setState({loading: value});
	}
	handleRequire = (value) => {
		this.setState({required: value})
		var self = this;
		getData().then(result => {
			if (result.data) {
				var roomOptions = result.data.result.map(room => ({ value: room._id, label: room.tenPhong }))
				roomOptions.unshift({ value: 0, label: 'Tất cả' });
				self.setState({ rooms: roomOptions });
				self.searchTable(1);
			}
		}).catch(err => {})
	}
	render() {
		var month = get_month();
		var year = get_year();
		var trangThai = get_status();
		return (
			<React.Fragment>
				<Loader loading={this.state.loading}/>
				<Title> Chi phí </Title>
				<div className={'content-body'}>
					<div>
						<Row className={'m-b-10'}>
							<Col md={2} xs={12}>
								Tháng
              <Select options={month} value={this.state.monthSelected} selected={this.monthSelected} />
							</Col>
							<Col md={2} xs={12}>
								Năm
              <Select options={year} value={this.state.yearSelected} selected={this.yearSelected} />
							</Col>
							<Col md={4} xs={12}>
								Phòng
								<Select 
									isSearchable={true}
									value={this.state.roomSelected}
									onChange={this.roomSelected}
									options={this.state.rooms} />
							</Col>
							<Col md={3} xs={12}>
								Trạng thái
              <Select options={trangThai} selected={this.statusSelected} />
							</Col>
							<Col md={1}>
								&nbsp;
              <Col md={12}><Button onClick={e => this.searchTable(1)}><i className="fas fa-search" /></Button></Col>
							</Col>
						</Row>
						<div className="flex-row-end m-b-10">
							<ModalConfig loading={this.handleLoading}/>
							<ModalExport loading={this.handleLoading} roomList={this.state.rooms}/>
							<ModalExpense loading={this.handleLoading} retriveSearch={() => this.pageChange(1)}/>
						</div>
						<ExpenseTable table={this.state.dataTable} 
												pageChange={e => this.pageChange(e)} 
												retriveSearch={() => this.pageChange(1)}
												loading={this.handleLoading}
												/>
						
					</div>
				</div>
			</React.Fragment>
		)
	}
}

export default Expenses;
