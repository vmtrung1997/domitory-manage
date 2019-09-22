import React, { Component } from 'react'
import { Table } from 'react-bootstrap'

import Checkbox from './../../../components/checkbox/checkbox'

class RegisteredTable extends Component{
	static defaultProps = {
		data: [],
		point: [],
		check: {},
		checkBox: () => {}
	}
	
	handleCheck = (index, e) => {
		this.props.checkBox({id: e.value, bool: e.chk})
	}
	render(){
		const point = this.props.point
		const table = this.props.data.map( (row, index) => {
			var date = new Date(row.date)
			var semester = ''
			if( date.getMount >= 7){
				semester = `${date.getFullYear()} - ${date.getFullYear() + 1}`
			} else {
				semester = `${date.getFullYear() - 1} - ${date.getFullYear()}`
			}
			return (
				<tr key={index} >
					<td>{index + 1}</td>
					{ row.idProfile ?
						<>
						<td>{row.idProfile.MSSV}</td>
						<td>{row.idProfile.hoTen}</td>
						<td style={{textAlign: 'center'}}>{row.idProfile.idPhong ? row.idProfile.idPhong.tenPhong : '---' }</td>
						<td style={{textAlign: 'center'}}>{semester}</td>
						<td style={{textAlign: 'center'}}>{point[row.idProfile._id]}</td>
						</>
					:
						<>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						</>
					}
					{ row.isAc ?
						<td style={{textAlign: "center", color: "#1ab394"}}><i class="fas fa-check"></i></td>
					:
						<td></td>
					}
					<td className={'text-center'} >
						<Checkbox 
							style={{ display: 'flex', justifyContent: 'center' }} 
							name={row._id}
							check={this.props.check[row._id]} 
							isCheck={(e) => this.handleCheck(index,e)}
						/>
					</td>
				</tr>
			)
		})
		return(
			<Table bordered hover responsive size="sm" className="table-activity">
				<thead className="title-table">
					<tr style={{textAlign: 'center'}}>
						<th>STT</th>
						<th>MSSV</th>
						<th>Họ và tên</th>
						<th>Phòng</th>
						<th>Năm học</th>
						<th>Điểm hoạt động</th>
						<th>Chấp nhận</th>
						<th>Chọn</th>
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