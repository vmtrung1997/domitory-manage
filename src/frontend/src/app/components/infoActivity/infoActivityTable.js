import React, { Component } from 'react'
import { Table, Col } from 'react-bootstrap'

import './infoActivityTable.css'

class InfoActivityTable extends Component{
	constructor(props){
	    super(props)
	}
	
	render(){
		const table = this.props.data.map((row, index) => {
			var curData = new Date();
			var date = new Date(row.ngay);
			var strDate = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`
			return (
				<tr key={index}>
					<td>{index + 1}</td>
					<td>{row.ten}</td>
					<td>{strDate}</td>
					<td>{row.diaDiem}</td>
					<td>{row.soLuong}</td>
					{row.batBuoc ? (
						<td> Bắt buộc </td>
					):(
						<td> Không bắt buộc </td>
					)}
					{curData > date ? (
						<td> Hoàn thành </td>
					):(
						<td> Chưa hoàn thành </td>
					)}
				</tr>
			)
		})
		return(
			<Table bordered hover responsive size="sm" className="table-activity">
				<thead >
					<tr>
						<th>STT</th>
						<th>Hoạt động</th>
						<th>Thời gian</th>
						<th>Địa điểm</th>
						<th>Tham gia</th>
						<th>Hình thức</th>
						<th>Tình trạng</th>
					</tr>
				</thead>
				<tbody>
					{table}
				</tbody>
			</Table>
		)
	}
}

export default InfoActivityTable