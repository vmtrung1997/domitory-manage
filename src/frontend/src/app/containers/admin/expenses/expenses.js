import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap'

import Button from '../../../components/button/button'
import Select from '../../../components/selectOption/select'
import ModalExpense from './expensesModal'
import Title from '../../../components/title/title'
import ExpenseTable from '../expenses/expenseTable'
import { search, getData, getYear } from '../expenses/expensesAction'
import { get_month, get_year_db, get_status } from './expenseRepo'
import Loader from './../../../components/loader/loader'
import ModalConfig from './expenseTypeDetail'
import ModalExport from './expenseExport'
import ModalReset from './expenseReset'
import ModalPrint from './expensePrint'
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import Input from '../../../components/input/input';
import jwt_decode from 'jwt-decode'
class Expenses extends Component {
	static propTypes = {
		label: PropTypes.string,
	}
	constructor(props) {
		super(props)
		this.state = {
			dataTable: { docs: [], totalPages: 1 },
			rooms: [],
			sendRoom: [],
			roomSelected: 0,
			monthSelected: 0,
			yearSelected: 0,
			statusSelected: 2,
			monthOptions: [],
			yearOptions: [],
			statusOptions: [],
			loading: false,
			options: {
				page: 1,
				limit: 10
			},
			show: true,
			showPrint: false,
			roles: []
		}
	}
	componentDidMount() {
		var self = this;
		this.showPrint = false;
		this.getRoles();
		getData().then(result => {
			if (result.data) {
				var roomOptions = result.data.result.map(room => ({ value: room._id, label: room.tenPhong, idLoaiPhong: room.idLoaiPhong }))
				roomOptions.unshift({ value: 0, label: 'Tất cả' });
				self.setState({
					rooms: roomOptions,
					roomSelected: 0,
					monthOptions: get_month(),
					statusOptions: get_status()
				});
				getYear().then(resultMonth => {
					if (resultMonth.data) {
						this.setState({ yearOptions: get_year_db(resultMonth.data.year) })
						self.searchTable(1);
					}
				})
			}
		}).catch(err => { })
	}
	getRoles = () => {
		let token = JSON.parse(localStorage.getItem('secret'));
		let decode = jwt_decode(token.access_token)
		if (decode && decode.user.userEntity.phanQuyen){
			this.setState({
				roles: decode.user.userEntity.phanQuyen.quyen
			})

		}
	}
	searchTable = (page) => {
		this.handleLoading(true)
		this.setState({ options: { page: 1 } })
		var options = {
			month: parseInt(this.state.monthSelected),
			year: parseInt(this.state.yearSelected),
			room: this.state.roomSelected,
			status: parseInt(this.state.statusSelected),
			options: this.state.options
		}
		options.options.page = page
		search(options).then(result => {
			if (result.data) {
				var table = result.data.rs.docs
				table = table.map(t => {
					return { ...t, check: false }
				})
				this.setState({ dataTable: { ...result.data.rs, docs: table }, loading: false, options: { ...this.state.options, page: 1 } })
			}
		}).catch(error => { });
	}
	roomSelected = selectedOption => {
		this.setState({ roomSelected: selectedOption, options: { ...this.state.options, page: 1 } })
	}
	monthSelected = value => {
		this.setState({ monthSelected: value, options: { ...this.state.options, page: 1 } })
	}
	yearSelected = value => {
		this.setState({ yearSelected: value, options: { ...this.state.options, page: 1 } })
	}
	statusSelected = value => {
		this.setState({ statusSelected: value, options: { ...this.state.options, page: 1 } })
	}
	pageChange = value => {
		this.searchTable(value)
	}
	handleLoading = (value) => {
		this.setState({ loading: value });
	}
	handleRequire = (value) => {
		this.setState({ required: value })
		var self = this;
		getData().then(result => {
			if (result.data) {
				var roomOptions = result.data.result.map(room => ({ value: room._id, label: room.tenPhong }))
				roomOptions.unshift({ value: 0, label: 'Tất cả' });
				self.setState({ rooms: roomOptions });
				self.searchTable(1);
			}
		}).catch(err => { })
	}
	handlePrint = () => {
	}
	printTableCondition = () => {
		var { roomSelected, monthSelected, yearSelected, statusSelected } = this.state
		return {
			roomSelected: roomSelected,
			monthSelected: monthSelected,
			yearSelected: yearSelected,
			statusSelected: statusSelected
		}
	}
	printSelectedCondition = () => {
		return this.state.dataTable.docs.filter(v => v.check === true)
	}
	handleOnChangePage = () => {
		let { options } = this.state;
		if (this.state.dataTable.totalPages >= options.page && options.page >= 1) {
			this.searchTable(options.page)
		} else {
			this.setState({ options: { ...options, page: this.state.dataTable.page } })
		}
	}
	handlePrintSelected = (e) => {
		if (!e)
			return;
		ToastsStore.success('Request print selected')
		let model = this.state.dataTable.docs.filter(v => v.check === true);
		this.setState({ showPrint: false, tableModel: model })
	}
	render() {
		return (
			<React.Fragment>
				<ToastsContainer position={ToastsContainerPosition.TOP_CENTER} lightBackground store={ToastsStore} />
				<Loader loading={this.state.loading} />
				<Title> Chi phí </Title>
				<div className={'content-body'}>
					<div>
						<Row className={'m-b-10'}>
							<Col md={2} xs={12}>
								Tháng
              <Select options={this.state.monthOptions} value={this.state.monthSelected} selected={this.monthSelected} />
							</Col>
							<Col md={2} xs={12}>
								Năm
              <Select options={this.state.yearOptions} value={this.state.yearSelected} selected={this.yearSelected} />
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
              <Select options={this.state.statusOptions} value={this.state.statusSelected} selected={this.statusSelected} />
							</Col>
							<Col md={1}>
								&nbsp;
              <Col md={12}><Button onClick={e => this.searchTable(1)}><i className="fas fa-search" /></Button></Col>
							</Col>
						</Row>
						<Row className={'m-b-10'}>
							<Col className='flex flex-between' >
								<div className='button-control button-space'>
									<ModalPrint show={this.state.showPrint}
										printTable={{
											month: this.state.monthSelected,
											room: this.state.roomSelected,
											year: this.state.yearSelected,
											status: this.state.statusSelected
										}}
										printSelected={this.state.dataTable.docs.filter(v => v.check === true).map(v => v._id)}
										tableModel={this.state.tableModel} />
									<ModalExport loading={this.handleLoading} roomList={this.state.rooms} />
									{this.state.roles && this.state.roles.includes('CP02') &&
									<ModalConfig loading={this.handleLoading} />}
									{this.state.roles && this.state.roles.includes('CP02') &&
									<ModalReset loading={this.handleLoading}/>}
								</div>
								{this.state.roles && this.state.roles.includes('CP03') &&
							<div className='button-control'>
							<ModalExpense loading={this.handleLoading} retriveSearch={() => this.pageChange(1)} />
						</div>}
							</Col>
						</Row>
						<ExpenseTable table={this.state.dataTable}
							pageChange={e => this.pageChange(e)}
							retriveSearch={() => this.pageChange(1)}
							loading={this.handleLoading}
							sendTable={table => this.setState({ dataTable: { ...this.state.dataTable, docs: table } })}
						><Input
								type='number'
								value={this.state.options.page}
								width='60px'
								getValue={e => this.setState({ options: { ...this.state.options, page: e.value } })}
								onKeyPress={(e) => { if (e.key === 'Enter') this.handleOnChangePage() }}
							/>
						</ExpenseTable>
					</div>
				</div>
			</React.Fragment>
		)
	}
}

export default Expenses;
