import React from 'react'
import { Table, Form, Button } from 'react-bootstrap'
import './listActivity.css'
import './../titleStudent/titleStudent.css'
import './../tableStudentTextStyle/tableStudentTextStyle.css'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import * as StudentAction from '../../actions/studentAction';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import CheckBox from '../../components/checkbox/checkbox';
import MyButton from '../../components/button/button'

class ListActivity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: []
        }
    }
    listOption = [false];
    listRegister = [];
    register = () => {
        var self = this;
        // check hoạt động bắt buộc
        var isValid = true;
        // && this.listOption[index] === false
        this.state.activities.map((item, index) => {
            if (item.batBuoc && item.check === false ) {
                isValid = false;
            }
        })

        if (isValid) {
            var data = [];
          
            data = this.state.activities.filter(obj => obj.check === true)
            var secret = localStorage.getItem('secret');
            const decode = jwt_decode(secret);
            var id = decode.user.profile._id;


            var info = {
                activity: data,
                user: id
            }

            //Đăng ký tham gia hoạt động
            axios.post('http://localhost:4000/api/student/register-activities', { data: info }).then(res => {
                if (res.status === 201) {
                    ToastsStore.success("Đăng ký thành công");
                    //load lại danh sách hoạt động
                   this.getActivity();
                }
                else {
                    ToastsStore.warning("Đăng ký không thành công");
                }
            })
        }
        else {
            ToastsStore.error("Vui lòng chọn tất cả các hoạt động Bắt buộc");
        }
    }

    selectRegister = (item, index) => {
     
        var {activities} = this.state;
        var act = activities.map(obj => {
            if (obj._id === item._id){

                obj.check = !obj.check;
                return obj
            } else return obj
        })

        this.setState({activities: act})
    }

    getActivity = () => {
        var secret = localStorage.getItem('secret');
        const decode = jwt_decode(secret);
        secret = JSON.parse(secret);
        var id = decode.user.profile._id;
        //Lấy thông tin hoạt động
        var activity = [];
        axios.post(`http://localhost:4000/api/student/get-list-activities`, { id: id }).then(res => {
            res.data.data.map(item => {
                if (item) {
                    item.check=false;
                    activity.push(item);
                }
            })
            this.setState({
                activities: activity
            })

        })
    }
    componentDidMount() {
        this.getActivity();
    }

    render() {

        console.log('activities ', this.state.activities);
        var index = -1;
        return (
            <React.Fragment>
                <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} lightBackground store={ToastsStore} />
                <div className='title-header '>
                    <span>HOẠT ĐỘNG SẮP DIỄN RA</span>
                </div>
                <div className='title-header-line'></div>



                {this.state.activities.length === 0?

                    <div  style = {{'marginTop':'30px'}}>
                        <span>Bạn chưa có hoạt động nào.</span>
                    </div> :
                    <div>
                        <div className='time-bill'>
                            <div className='text-style'>
                                <Table responsive bordered size='sm' hover>
                                    <thead>
                                        <tr>
                                            <th>Thời gian</th>
                                            <th>Tên hoạt động</th>
                                            <th>Mô tả</th>
                                            <th>Điểm</th>
                                            <th>Địa điểm</th>
                                            <th>Trạng thái</th>
                                            <th>Đăng ký</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.activities.map((item, index) => {
                            
                                            var d = new Date(item.ngay);
                                            var month = d.getMonth() + 1;

                                            this.listOption[index] = false; //default Option
                                            var formatDay = d.getDate() + '/' + month + '/' + d.getFullYear();

                                            return (
                                                <tr key={index}>
                                                    <td>{formatDay}</td>
                                                    <td>{item.ten}</td>
                                                    <td>{item.moTa}</td>
                                                    <td>{item.diem}</td>
                                                    <td>{item.diaDiem}</td>
                                                    <td className={item.batBuoc === true ?'is-dont-done':''}>{item.batBuoc === true ? 'Bắt buộc':''}</td>
                                                    <td> <input checked={item.check} onChange={e => this.selectRegister(item, index)} type='checkbox' /></td>
                                                </tr>
                                            )
                                        })}

                                    </tbody>
                                </Table>
                            </div>
                        </div>

                        <div><span style={{ 'color': 'red' }}>* Các hoạt động Bắt buộc yêu cầu sinh viên phải đăng ký</span></div>
                        <div className='register-activity'>
                            <Button variant='success' onClick={this.register}>Đăng ký</Button>
                        </div>
                    </div>
                }



            </React.Fragment>
        )
    }
}


var mapStateToProps = (state) => {
    return {
        activity: state.activity,
        profile: state.userProfile
    };
}

var mapDispatchToProps = (dispatch) => {
    return {
        getActivity: bindActionCreators(StudentAction.GET_LIST_ACTIVITY, dispatch),
        updateActivity: bindActionCreators(StudentAction.REGISTER_ACTIVITY, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListActivity);
