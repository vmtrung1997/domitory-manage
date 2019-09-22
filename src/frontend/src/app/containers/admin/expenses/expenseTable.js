import React from 'react';
import ExpenseDetail from './expenseDetail'
import { Table, Row, Col } from 'react-bootstrap'
import Optimize from '../../../optimization/optimizationNumber/optimizationNumber'
import MyPagination from './../../../components/pagination/pagination'
import './expenses.css'
import Checkbox from '../../../components/checkbox/checkbox';

export default class ExpenseTable extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showDetail: false,
			detail: {},
			checkAll: false,
			page: 1
		}
	}
	componentDidMount() {
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
	componentWillReceiveProps(props) {
		if (props.table.page != this.state.page) {
			this.setState({ page: props.table.page })
		}
	}
	showDetail = (value) => {
		this.setState({ showDetail: value })
	}
	retriveSearch = (value) => {
		this.props.retriveSearch(value);
	}
	handleLoading = (value) => {
		this.props.loading(value);
	}
	handleCheckAll = (e) => {
		var table = this.props.table.docs.map((value) => {
			return { ...value, check: e.chk }
		});
		this.setState({ checkAll: e.chk })
		this.props.sendTable(table)
	}
	handleRowCheck = (i, e) => {
		var table = this.props.table.docs.map((value, index) => {
			return index === i ? { ...value, check: e.chk } : { ...value }
		});
		this.props.sendTable(table)
	}
	getStatus = (row) => {
		switch(row.trangThai){
			case 0:
			return <i style={{ color: '#dc3545' }} title={"Chưa thanh toán"} className="fas fa-times "></i>
			case 1:
			return <i style={{ color: '#28a745' }} title={"Đã thanh toán"} className="fas fa-check success"></i>
			case 2:
			return <i style={{ color: '#ffc107' }} title={"Thiếu dữ liệu"} className="fas fa-exclamation-triangle"></i>
		}
	}
	render() {
		return (
			<React.Fragment>
				{this.state.showDetail && <ExpenseDetail expenseDetail={this.state.detail} show={this.showDetail} retriveSearch={this.retriveSearch} loading={this.handleLoading} />}
				<Row>
					<Col>
						<Table bordered hover responsive size="sm">
							<thead className="title-table text-center">
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
									<th>In &nbsp;<Checkbox style={{ display: 'inline-block' }} checkmark={'checkmark-expense'} check={this.state.checkAll} isCheck={(e) => this.handleCheckAll(e)}></Checkbox></th>
								</tr>
							</thead>
							<tbody>
								{this.props.table.docs.map((row, index) => {
									return (
										<tr key={row._id}>
											<td className={'text-center'}>{index + 1}</td>
											<td>{row.thang}</td>
											<td>{row.nam}</td>
											<td className={'text-center'}><span className={'link-table'} onClick={() => this.onHandleClick(row)}>{row.idPhong.tenPhong}</span></td>
											<td className={'text-right'}>{row.thayDien ? row.soDien - row.soDienCu + row.thayDien.dienMoi - row.thayDien.dienCu : (row.soDien > 0 ? row.soDien - row.soDienCu : row.soDien)}</td>
											<td className={'text-right'}>{row.thayNuoc ? row.soNuoc - row.soNuocCu + row.thayNuoc.nuocMoi - row.thayNuoc.nuocCu : (row.soNuoc > 0 ? row.soNuoc - row.soNuocCu : row.soNuoc)}</td>
											<td className={'text-right'}>{Optimize.OpitmizeNumber(row.tienRac)}</td>
											<td className={'text-right'}>{Optimize.OpitmizeNumber(row.tongTien)}</td>
											<td className={'text-center'}>{this.getStatus(row)}
											</td>
											<td className={'text-center'} >
												<Checkbox style={{ display: 'inline-block' }} name={row._id} checkmark={'checkmark-expense'} check={row.check} isCheck={(e) => this.handleRowCheck(index, e)} />
											</td>
										</tr>
									)
								})}
							</tbody>
						</Table>
					</Col>
				</Row>
				<Row>
					<Col className='flex flex-between'>
						<div className='flex-baseline'>
							Trang&nbsp;{this.props.children}&nbsp;/ {this.props.table.totalPages}
						</div>
						<div>
							{
								this.props.table.docs.length ?
									<MyPagination page={this.props.table.page} totalPages={this.props.table.totalPages} clickPage={this.handlePageChange} /> : ''
							}
						</div>
					</Col>
				</Row>
			</React.Fragment>
		)
	}
}