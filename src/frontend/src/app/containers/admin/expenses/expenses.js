import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap'
import Button from '../../../components/button/button'
import Select from '../../../components/selectOption/select'
import ModalExpense from './expensesModal'
import Title from '../../../components/title/title'
import ExpenseTable from '../expenses/expenseTable'
import {search, getData} from '../expenses/expensesAction'
import SSelect from 'react-select';
class Expenses extends Component {
	static propTypes = {
		label: PropTypes.string,
	}
	constructor(props) {
		super(props)
		this.state = {
			dataTable: [],
			phong: []
		}
	}
	componentDidMount() {
		getData().then(result => {
			if (result.data) {
				console.log(result.data);
			}
		})
	}
	
	searchTable = (object) => {
		search({options: {
			page: 1,
			limit: 10
		}}).then(result => {
			if (result.data){
				this.setState({dataTable: result.data.rs})
			}
		}).catch(error => {
			console.log(error)
		});
	}
	handleChange = (selectedOption) => {
    console.log(`Option selected:`, selectedOption);
  }
	render() {
		var today = new Date();
		console.log(today.getFullYear());
		const options = [
			{ value: 'chocolate', label: 'Chocolate' },
			{ value: 'strawberry', label: 'Strawberry' },
			{ value: 'vanilla', label: 'Vanilla' }
		];
		var selectedOption = null;

		var month = [...Array(13)].map((_, i) => { return i === 0 ? { value: i, label: 'Tất cả' } : { value: i, label: i } });
		var year = [...Array(4)].map((_, i) => { return i === 0 ? { value: i, label: 'Tất cả' } : { value: i + 2017, label: i + 2017 } });
		var phong = [] // [...Array(7)].map((_, i) => { return i === 0 ? { value: i, label: 'Tất cả' } : { value: i + 100, label: i + 100 } });
		var trangThai = [
			{ value: 0, label: 'Tất cả' },
			{ value: 1, label: 'Đã thanh toán' },
			{ value: 2, label: 'Chưa thanh toán' }]
		return (
			<React.Fragment>
				<Title> Chi phí </Title>
				<div className={'content-body'}>
					<div>
						<Row className={'m-b-10'}>
							<Col md={2} xs={12}>
								Tháng
              <Select options={month} value={today.getMonth()} />
							</Col>
							<Col md={2} xs={12}>
								Năm
              <Select options={year} value={today.getFullYear()}/>
							</Col>
							<Col md={2} xs={12}>
								Phòng
								<SSelect
									value={selectedOption}
									onChange={this.handleChange}
									options={options}/>
							</Col>
							<Col md={4} xs={12}>
								Trạng thái
              <Select options={trangThai} />
							</Col>
							<Col md={2}>
								&nbsp;
              <Col md={12}><Button onClick={this.searchTable}><i className="fas fa-search" /></Button></Col>
							</Col>
						</Row>
						<div className="float-right m-b-10">
						<Button color={'success'}>
								Báo cáo
							</Button>
							<ModalExpense />
						</div>
						<ExpenseTable />
					</div>
				</div>
			</React.Fragment>
		)
	}
}

export default Expenses;
