import React from 'react';
import ExpenseDetail from './expenseDetail'
import { Table } from 'react-bootstrap'
import Pagination from 'react-js-pagination'
import './expenses.css'

export default class ExpenseTable extends React.Component {
	constructor(props) {
		super(props)
		this.state ={
			showDetail: false,
			detail: {}
		}
	}
	handlePageChange = (value) => {
		this.props.pageChange(value)
	}
	onHandleClick = (value) => {
		this.setState({
			showDetail: !this.state.showDetail,
			detail: value
		})
	}
	showDetail = (value) => {
		this.setState({showDetail: value})
	}
	retriveSearch = (value) => {
		this.props.retriveSearch(value);
	}
	render() {
		// console.log('table', this.props.table)
		const data = this.props.table.docs
		const table = data.map((row, index) => {
			return (
				<tr key={row._id}>
					<td>{index + 1}</td>
					<td>{row.thang}</td>
					<td>{row.nam}</td>
					<td><span className={'link'} onClick={() => this.onHandleClick(row)}>{row.idPhong.tenPhong}</span></td>
					<td>{row.soDien>0?row.soDien - row.soDienCu:row.soDien}</td>
					<td>{row.soNuoc>0?row.soNuoc - row.soNuocCu:row.soNuoc}</td>
					<td>{row.tienRac}</td>
					<td>{row.tongTien}</td>
					<td>{row.trangThai === 0 ? 'Chưa thanh toán' : 'Đã thanh toán'}</td>
				</tr>
			)
		})
		const pagination = this.props.table && this.props.table.docs.length !== 0?
			<Pagination
										activePage={this.props.table.page}
										itemsCountPerPage={this.props.table.limit}
										totalItemsCount={this.props.table.totalDocs}
										pageRangeDisplayed={5}
										innerClass={'pagination'}
										itemClass={'page-item'}
										onChange={this.handlePageChange} />:''
		return (
			<React.Fragment>
				{this.state.showDetail && <ExpenseDetail expenseDetail={this.state.detail} show={this.showDetail} retriveSearch={this.retriveSearch}/>}
				<Table bordered hover responsive size="sm">
					<thead >
						<tr>
							<th>STT</th>
							<th>Tháng</th>
							<th>Năm</th>
							<th>Phòng</th>
							<th>Số điện</th>
							<th>Số nước</th>
							<th>Tiền rác</th>
							<th>Tổng tiền</th>
							<th>Trạng thái</th>
						</tr>
					</thead>
					<tbody>
						{table}
					</tbody>
				</Table>
				<div className="float-right">
					{pagination}
				</div>
			</React.Fragment>
		)
	}
}