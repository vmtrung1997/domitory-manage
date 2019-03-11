import React from 'react'
import { Table } from 'react-bootstrap'
import './billStudent.css'
import './../titleStudent/titleStudent.css'



class BillStudent extends React.Component {


    render() {
        return (
            <React.Fragment>
                <div className='title-header '>
                    <span>THÔNG TIN ĐIỆN NƯỚC</span>
                </div>
                <div className='title-header-line'></div>
                <div className='time-bill'>
                    <div className='time-bill-header'><span>Gần nhất</span></div>
                    <div className='text-style'>
                        <Table responsive bordered size='sm' hover>
                            <thead>
                                <tr>
                                    <th>Tháng/ Năm</th>
                                    <th>Ngày ghi</th>
                                    <th>Chỉ số điện</th>
                                    <th>Chỉ số nước</th>
                                    <th>Chỉ số nước</th>
                                    <th>Tổng cộng</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Table cell</td>
                                    <td>Table cell</td>
                                    <td>Table cell</td>
                                    <td>Table cell</td>
                                    <td>Table cell</td>
                                    <td className='is-dont-done'>Table cell</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>

                    <div className='time-bill'>
                        <div className='time-bill-header'><span>Cũ hơn</span></div>
                        <div className='text-style'>
                        <Table responsive bordered size='sm' hover>
                            <thead>
                                <tr>
                                    <th>Tháng/ Năm</th>
                                    <th>Ngày ghi</th>
                                    <th>Chỉ số điện</th>
                                    <th>Chỉ số nước</th>
                                    <th>Chỉ số nước</th>
                                    <th>Tổng cộng</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Table cell</td>
                                    <td>Table cell</td>
                                    <td>Table cell</td>
                                    <td>Table cell</td>
                                    <td>Table cell</td>
                                    <td className='is-done'>Table cell</td>
                                </tr>
                            </tbody>
                        </Table>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}



export default BillStudent;