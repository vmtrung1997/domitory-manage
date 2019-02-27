import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Row, Col, FormControl } from 'react-bootstrap'
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
		return (
			<React.Fragment>
				<div className={'m-t-60 p-10'}>
					<Row className={'m-b-10'}>
						<Col sm={4}><FormControl placeholder="Tháng/năm" /></Col>
						<Col sm={4}><FormControl placeholder="Phòng" /></Col>
						<Col sm={4}><Button variant="primary">Tìm kiếm</Button></Col>
					</Row>
					<Row className={'m-b-10'}>
						<Col md={"auto"}><Example /></Col>
					</Row>
					<Row>
						<Table striped hover responsive size="lg">
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
