import React from 'react';
import {Table}  from 'react-bootstrap'

export default class ExpenseTable extends React.Component{
  render() {
    const data = []
		const table = data.map((row, index) => {
			return (
				<tr key={index}>
					<td>{index + 1}</td>
					<td>{row.thang}</td>
					<td>{row.nam}</td>
					<td>{row.phong}</td>
					<td>{row.soDien}</td>
					<td>{row.soNuoc}</td>
					<td>{row.tien}</td>
					<td>Đã thanh toán</td>
				</tr>
			)
		})
		
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
      </React.Fragment>
    )
  }
}