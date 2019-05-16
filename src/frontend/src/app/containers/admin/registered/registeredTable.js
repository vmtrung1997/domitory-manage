import React, { Component } from 'react'
import { Table } from 'react-bootstrap'

import Checkbox from './../../../components/checkbox/checkbox'

class RegisteredTable extends Component{
	static defaultProps = {
		data: []
	}
	render(){
		const table = this.props.data.map( (row, index) => {
			return (
				<tr key={index} >
					<td>{index + 1}</td>
					{ row.idProfile ?
						<>
						<td>{row.idProfile.MSSV}</td>
						<td>{row.idProfile.hoTen}</td>
						<td style={{textAlign: 'center'}}>{row.idProfile.idPhong ? row.idProfile.idPhong.tenPhong : '---' }</td>
						<td style={{textAlign: 'center'}}>{row.idProfile.hoTen}</td>
						</>
					:
						<>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						</>
					}
					<td className={'text-center'} >
						<Checkbox 
							style={{ display: 'flex', justifyContent: 'center' }} 
							check={row.isAccept} 
						/>
					</td>
				</tr>
			)
		})
		console.log(this.props.data)
		return(
			<Table bordered hover responsive size="sm" className="table-activity">
				<thead className="title-table">
					<tr style={{textAlign: 'center'}}>
						<th>STT</th>
						<th>MSSV</th>
						<th>Họ và tên</th>
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