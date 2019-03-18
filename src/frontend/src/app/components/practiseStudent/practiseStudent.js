import React from 'react'
import { Table } from 'react-bootstrap'
import './../titleStudent/titleStudent.css'
import './../tableStudentTextStyle/tableStudentTextStyle.css'


class PractiseStudent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className='title-header '>
                    <span>ĐIỂM RÈN LUYỆN</span>
                </div>
                <div className='title-header-line'></div>
                <div className='time-bill'>
                   
                    <div className='text-style'>
                        <Table responsive bordered size='sm' hover>
                            <thead>
                                <tr>
                                    <th>Năm học</th>
                                    <th>Học kỳ</th>
                                    <th>Điểm</th>
                                    <th>Xếp loại DRL</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Table cell</td>
                                    <td>Table cell</td>
                                    <td>Table cell</td>
                                  
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}



export default PractiseStudent;