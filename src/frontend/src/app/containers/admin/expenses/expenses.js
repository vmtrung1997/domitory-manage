import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Row, Col } from 'react-bootstrap'
import Input from '../../../components/input/input'
import Button from '../../../components/button/button'
import Select from '../../../components/selectOption/select'
import Example from './expensesModal'
class Expenses extends Component {
	static propTypes = {
		label: PropTypes.string,
	}
	static defaultProps = {
		check: false,
		name: '',
		value: '',
		isRadioChk: () => { }
	}
	constructor(props) {
		super(props)
		this.state = {
			check: this.props.check
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
		var month = [...Array(12)].map((_, i) => {return i ===0? {value: i+1, label: 'Tất cả'}: {value: i+1, label: i+1}});
		var year = [...Array(4)].map((_, i) => {return i===0?{value: i+1, label: 'Tất cả'}: {value: i+2018, label: i+2018}});
		var phong = [...Array(6)].map((_, i) => {return i===0?{value: i+1, label: 'Tất cả'}: {value: i+101, label: i+101}});
		var trangThai = [
			{value: 0, label: 'Tất cả'},
			{value: 1, label: 'Đã thanh toán'},
			{value: 2, label: 'Chưa thanh toán'}]
		return (
			<React.Fragment>
				<div className={'m-t-60 p-10'}>
					<Row className={'m-b-10'}>
						<Col md={4}>
							<Col md={12}><Example /></Col>
						</Col>
					</Row>
					<Row className={'m-b-10'}>
						<Col md={2} xs={12}>
							<Col md={12}><label>Tháng</label></Col>
							<Col md={12}>
								<Select options={month} value={month[4].value} />
							</Col>
						</Col>
						<Col md={2} xs={12}>
							<Col md={12}><label>Năm</label></Col>
							<Col md={12}><Select options={year} /></Col>
						</Col>
						<Col md={2} xs={12}>
							<Col md={12}><label>Phòng</label></Col>
							<Col md={12}><Select options={phong} /></Col>
						</Col>
						<Col md={4} xs={12}>
							<Col md={12}><label>Trạng thái</label></Col>
							<Col md={12}><Select options={trangThai} /></Col>
						</Col>
						<Col md={2}>
							<Col md={12}>&nbsp;</Col>
							<Col md={12}><Button color={'warning'} size={'md'}>Tìm kiếm</Button></Col>
						</Col>
					</Row>

					<Row>
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
					</Row>
				</div>
			</React.Fragment>
		)
	}
}

export default Expenses;
