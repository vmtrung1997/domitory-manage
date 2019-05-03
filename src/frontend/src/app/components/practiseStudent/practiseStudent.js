import React from 'react'
import { Table } from 'react-bootstrap'
import './../titleStudent/titleStudent.css'
import './../tableStudentTextStyle/tableStudentTextStyle.css'
import Axios from 'axios';
import {connect} from 'react-redux'
import refreshToken from "./../../../utils/refresh_token";
import jwt_decode from "jwt-decode";

class PractiseStudent extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            point: []
        }
    }
    
    getPoint = async () =>{
        await refreshToken();
        var secret = localStorage.getItem("secret");
    
        if (secret) {
          const decode = jwt_decode(secret);
          secret = JSON.parse(secret);
          var id = decode.user.profile._id;
        Axios.post('/student/get-point',{id: id, ngayVaoO: decode.user.profile.ngayVaoO}).then(rs =>{
            var point = [];
            rs.data.data.forEach(item=>{
                point.push({term: item.year, point: item.point});
            })

            this.setState({point: point})
        });
        }
    }

    componentDidMount(){
        this.getPoint();
    }

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
                            <thead className ='thread-student'>
                                <tr>
                                    <th>Năm học</th>                                  
                                    <th>Điểm</th>
                                    {/* <th>Chi tiết</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.point.map(item =>{
                                    return(
                                        <tr>
                                        <td>{item.term}-{item.term + 1}</td>
                                        <td>{item.point}</td>
                                        {/* <td><Detail></Detail></td> */}
                                    </tr>
                                    )
                                })}
                              
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
  