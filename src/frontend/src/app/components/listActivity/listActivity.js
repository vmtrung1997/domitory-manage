import React from 'react'
import { Table, Form, Button } from 'react-bootstrap'
import './listActivity.css'
import './../titleStudent/titleStudent.css'
import './../tableStudentTextStyle/tableStudentTextStyle.css'


class ListActivity extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className='title-header '>
                    <span>HOẠT ĐỘNG ĐANG DIỄN RA</span>
                </div>
                <div className='title-header-line'></div>
                <div className='time-bill'>
                    <div className='time-bill-header'><span>Đang diễn ra</span></div>
                    <div className='text-style'>
                        <Table responsive bordered size='sm' hover>
                            <thead>
                                <tr>
                                    <th>Thời gian</th>
                                    <th>Tên hoạt động</th>
                                    <th>Mô tả</th>
                                    <th>Điểm tham gia/ Vắng</th>
                                    <th>Trạng thái</th>
                                    <th>Đăng ký</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Table cell</td>
                                    <td>Table cell</td>
                                    <td>Table cell</td>
                                    <td className='is-dont-done'>Table cell</td>
                                    <td> <Form.Check type="checkbox" /></td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className = 'register-activity'>
                    <Button>Đăng ký</Button>
                </div>
            </React.Fragment>
        )
    }
}



export default ListActivity;