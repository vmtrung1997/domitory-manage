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
			<Table striped bordered hover responsive size="lg" className="table-activity">
				<thead >
					<tr>
						<td>STT</td>
						<td>Hoạt động</td>
						<td>Thời gian</td>
						<td>Địa điểm</td>
						<td>Tham gia</td>
						<td>Hình thức</td>
						<td>Tình trạng</td>
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