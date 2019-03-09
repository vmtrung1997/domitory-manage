import React, { Component } from 'react'
import { Table, Col } from 'react-bootstrap'

import './infoActivityTable.css'

class InfoActivityTable extends Component{
	constructor(props){
	    super(props)
	}
	
	render(){
		const table = this.props.data.map((row, index) => {
			return (
				<tr key={index}>
					<td>{index + 1}</td>
					<td>{row.name}</td>
					<td>{row.time}</td>
					<td>{row.location}</td>
					<td>{row.par}</td>
					<td>{row.rule}</td>
					<td>{row.status}</td>
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