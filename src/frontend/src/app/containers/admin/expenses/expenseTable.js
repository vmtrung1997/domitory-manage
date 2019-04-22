import React from 'react';
import ExpenseDetail from './expenseDetail'
import { Table } from 'react-bootstrap'
import Optimize from '../../../optimization/optimizationNumber/optimizationNumber'
import MyPagination from './../../../components/pagination/pagination'
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
	handleLoading = (value) => {
		this.props.loading(value);
	}
	render() {
		const data = this.props.table.docs
		const table = data.map((row, index) => {
			return (
				<tr key={row._id}>
					<td>{index + 1}</td>
					<td>{row.thang}</td>
					<td>{row.nam}</td>
					<td><span className={'link-table'} onClick={() => this.onHandleClick(row)}>{row.idPhong.tenPhong}</span></td>
					<td className={'text-right'}>{row.thayDien?row.soDien-row.soDienCu+row.thayDien.dienMoi-row.thayDien.dienCu:(row.soDien>0?row.soDien-row.soDienCu:row.soDien)}</td>
					<td className={'text-right'}>{row.thayNuoc?row.soNuoc-row.soNuocCu+row.thayNuoc.nuocMoi-row.thayNuoc.nuocCu:(row.soNuoc>0?row.soNuoc-row.soNuocCu:row.soNuoc)}</td>
					<td className={'text-right'}>{Optimize.OpitmizeNumber(row.tienRac)}</td>
					<td className={'text-right'}>{Optimize.OpitmizeNumber(row.tongTien)}</td>
					<td>{row.trangThai === 0 ? 'Chưa thanh toán' : 'Đã thanh toán'}</td>
				</tr>
			)
		})

		return (
			<React.Fragment>
				{this.state.showDetail && <ExpenseDetail expenseDetail={this.state.detail} show={this.showDetail} retriveSearch={this.retriveSearch} loading={this.handleLoading}/>}
				<Table bordered hover responsive size="sm">
					<thead className="title-table">
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
				{
				this.props.table && this.props.table.docs.length !== 0?
				<MyPagination page={this.props.table.page} totalPages={this.props.table.totalPages} clickPage={this.handlePageChange}/>:''
				}
				</div>
			</React.Fragment>
		)
	}
}