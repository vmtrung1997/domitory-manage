import React from 'react'
import { Table } from 'react-bootstrap'
import './../titleStudent/titleStudent.css'
import './../tableStudentTextStyle/tableStudentTextStyle.css'
import Axios from 'axios';
import {connect} from 'react-redux'


class PractiseStudent extends React.Component {

    test = () =>{
        Axios.post('/student/get-point',{id: this.props.userProfile.idTaiKhoan, ngayVaoO: this.props.userProfile.ngayVaoO}).then(rs =>{});
    }

    render() {
        return (
            <React.Fragment>

                <div className='title-header '>
                    <span>ĐIỂM RÈN LUYỆN</span>
                </div>
                <div className='title-header-line'></div>
                <button onClick = {this.test}>A</button>
                <div className='time-bill'>
                   
                    <div className='text-style'>
                        <Table responsive bordered size='sm' hover>
                            <thead>
                                <tr>
                                    <th>Năm học</th>
                                    <th>Học kỳ</th>
                                    <th>Điểm</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
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

var mapStateToProps = state => {
    return {
      userProfile: state.userProfile
    };
  };
  
  
  export default connect(
    mapStateToProps
  )(PractiseStudent);
  