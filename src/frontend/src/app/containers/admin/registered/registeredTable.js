import React, { Component } from 'react'
import { Table } from 'react-bootstrap'

import Checkbox from './../../../components/checkbox/checkbox'

class RegisteredTable extends Component{
	static defaultProps = {
		data: [],
		point: []
	}
	constructor(props) {
		super(props)
		this.state = {
			check: []
		}
	}
	componentDidMount(){
		// var check = this.props.data.map((row, index) => { 
		// 	console.log(row)
		// 	return {[row._id]:row.isAc}
		// })
		console.log(1,	this.props.data)
		//this.setState({check: this.props.data})
	}
	handleCheck = (index, e) => {
		console.log(this.state)
	}
	render(){
		const point = this.props.point
		const table = this.props.data.map( (row, index) => {
			return (
				<tr key={index} >
					<td>{index + 1}</td>
					{ row.idProfile ?
						<>
						<td>{row.idProfile.MSSV}</td>
						<td>{row.idProfile.hoTen}</td>
						<td style={{textAlign: 'center'}}>{row.idProfile.idPhong ? row.idProfile.idPhong.tenPhong : '---' }</td>
						<td style={{textAlign: 'center'}}>{point[index]}</td>
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
							check={row.isAc} 
							name={row._id}
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