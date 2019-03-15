import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap'
import Button from '../../../components/button/button'
import Select from '../../../components/selectOption/select'
import ModalExpense from './expensesModal'
import Title from '../../../components/title/title'
import ExpenseTable from '../expenses/expenseTable'
import { search, getData } from '../expenses/expensesAction'
import SSelect from 'react-select';
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
			options: {
				page: 1,
				limit: 10
			}
		}
	}
	componentDidMount() {
		var self = this;
		getData().then(result => {
			if (result.data) {
				var roomOptions = result.data.result.map(room => ({ value: room._id, label: room.tenPhong }))
				roomOptions.unshift({ value: 0, label: 'Tất cả' });
				self.setState({ rooms: roomOptions });
				self.searchTable();
			}
		}).catch(err => console.log(err))
	}

	searchTable = () => {
		var options = {
			month: parseInt(this.state.monthSelected),
			year: parseInt(this.state.yearSelected),
			room: this.state.roomSelected,
			status: parseInt(this.state.statusSelected),
			options: this.state.options
		}
		console.log(options)
		search(options).then(result => {
			if (result.data) {
				this.setState({ dataTable: result.data.rs })
			}
		}).catch(error => {
			console.log(error)
		});
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
		console.log(value);
		this.setState({ statusSelected: value, options: { page: 1 } })
	}
	pageChange = value => {
		this.setState({ options: { page: value } })
		this.searchTable()
	}
	render() {
		var month = [...Array(13)].map((_, i) => { return i === 0 ? { value: i, label: 'Tất cả' } : { value: i, label: i } });
		var year = [...Array(4)].map((_, i) => { return i === 0 ? { value: i, label: 'Tất cả' } : { value: i + 2014, label: i + 2014 } });
		var trangThai = [
			{ value: 2, label: 'Tất cả' },
			{ value: 1, label: 'Đã thanh toán' },
			{ value: 0, label: 'Chưa thanh toán' }]
		return (
			<React.Fragment>
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
									placeholder={''}
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
              <Col md={12}><Button onClick={this.searchTable}><i className="fas fa-search" /></Button></Col>
							</Col>
						</Row>
						<div className="float-right m-b-10">
							<Button>
								<i className="fas fa-file-export" />
							</Button>
							<ModalExpense />
						</div>
						<ExpenseTable table={this.state.dataTable} pageChange={this.pageChange} />
					</div>
				</div>
			</React.Fragment>
		)
	}
}

export default Expenses;
