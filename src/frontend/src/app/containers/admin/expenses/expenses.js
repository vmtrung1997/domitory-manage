import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Row, Col } from 'react-bootstrap'
import Button from '../../../components/button/button'
import Select from '../../../components/selectOption/select'
import ModalExpense from './expensesModal'
import Title from '../../../components/title/title'
import Input from '../../../components/input/input'
class Expenses extends Component {
	static propTypes = {
		label: PropTypes.string,
	}
	constructor(props) {
		super(props)
		this.state = {
			txtUsername: '',
			txtPassword: '',
		}
	}
	render() {
		const data = [
			{
				phong: '101',
				thang: '1/2019',
				soDien: '30',
				soNuoc: '5',
				tien: '10000000'
			},
			{
				phong: '101',
				thang: '1/2019',
				soDien: '30',
				soNuoc: '5',
				tien: '10000000'
			},
			{
				phong: '101',
				thang: '1/2019',
				soDien: '30',
				soNuoc: '5',
				tien: '10000000'
			}
		]
		const table = data.map((row, index) => {
			return (
				<tr key={index}>
					<td>{index + 1}</td>
					<td>{row.thang}</td>
					<td>{row.phong}</td>
					<td>{row.soDien}</td>
					<td>{row.soNuoc}</td>
					<td>{row.tien}</td>
				</tr>
			)
		})
		var month = [...Array(13)].map((_, i) => { return i === 0 ? { value: i, label: 'Tất cả' } : { value: i, label: i } });
		var year = [...Array(4)].map((_, i) => { return i === 0 ? { value: i, label: 'Tất cả' } : { value: i + 2017, label: i + 2017 } });
		var phong = [...Array(7)].map((_, i) => { return i === 0 ? { value: i, label: 'Tất cả' } : { value: i + 100, label: i + 100 } });
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
						<Col md={2} xs={12}><Button color={'warning'}>
								Chi phí tổng hợp
							</Button></Col>
							<Col md={3} xs={12}><Button>
								Chi phí chưa thanh toán
							</Button></Col>
							<Col md={{size: 6, offset: '5'}} xs={12}><ModalExpense /></Col>
						</Row>
						<Row className={'m-b-10'}>
							<Col md={2} xs={12}>
								Tháng
              <Select options={month} value={month[4].value} />
							</Col>
							<Col md={2} xs={12}>
								Năm
              <Select options={year} />
							</Col>
							<Col md={2} xs={12}>
								Phòng
              <Select options={phong} />
							</Col>
							<Col md={4} xs={12}>
								Trạng thái
              <Select options={trangThai} />
							</Col>
							<Col md={2}>
								&nbsp;
              <Col md={12}><Button><i className="fas fa-search" /></Button></Col>
							</Col>
						</Row>
						<Table bordered hover responsive size="sm">
							<thead >
								<tr>
									<th>STT</th>
									<th>Tháng/Năm</th>
									<th>Phòng</th>
									<th className={'table-header'}>Chỉ số điện</th>
									<th className={'table-header'}>Chỉ số nước</th>
									<th className={'table-header'}>Số tiền</th>
								</tr>
							</thead>
							<tbody>
								{table}
							</tbody>
						</Table>
					</div>
				</div>
			</React.Fragment>
		)
	}
}

export default Expenses;
