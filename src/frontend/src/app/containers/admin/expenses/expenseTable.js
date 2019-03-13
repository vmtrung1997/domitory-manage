import React from 'react';
import { Table } from 'react-bootstrap'
import Pagination from 'react-js-pagination'


export default class ExpenseTable extends React.Component {
	constructor(props) {
		super(props)
	}
	handlePageChange = (value) => {
		this.props.pageChange(value)
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
					<td>{row.idPhong.tenPhong}</td>
					<td>{row.soDien>0?row.soDien - row.soDienCu:row.soDienCu}</td>
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