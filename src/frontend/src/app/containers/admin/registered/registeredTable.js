import React, { Component } from 'react'
import { Table } from 'react-bootstrap'

class RegisteredTable extends Component{
	render(){
		const table = ''
		return(
			<Table bordered hover responsive size="sm" className="table-activity">
				<thead className="title-table">
					<tr style={{textAlign: 'center'}}>
						<th>STT</th>
						<th>MSSV</th>
						<th>Họ và tên</th>
						<th>Trường</th>
						<th>Phòng</th>
						<th>Điểm hoạt động</th>
						<th>Xác nhận</th>
					</tr>
				</thead>
				<tbody>
					{table}
				</tbody>
			</Table>
		)
	}
}
export default RegisteredTable