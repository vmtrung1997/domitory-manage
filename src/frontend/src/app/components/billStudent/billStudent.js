import React from 'react'
import { Table, Button } from 'react-bootstrap'
import './billStudent.css'
import './../titleStudent/titleStudent.css'
import axios from 'axios';
import { connect } from 'react-redux'
import jwt_decode from 'jwt-decode';
import * as StudentAction from '../../actions/studentAction';
import { bindActionCreators } from 'redux'
import DetailBill from './detailBill'
import OpitmizeNumber from '../../optimization/optimizationNumber/optimizationNumber'

class BillStudent extends React.Component {

    constructor(props) {
        super(props);
        this.state = ({
            showDetail: false,
            data: []
        })
    }

    componentDidMount() {

        var secret = localStorage.getItem('secret');
        const decode = jwt_decode(secret);
        secret = JSON.parse(secret);
        var id = decode.user.userEntity._id;

        //Lấy thông tin điện nước
        axios.post(`http://localhost:4000/api/student/get-info`, { id: id }).then(res => {
            if (res) {
                axios.post(`http://localhost:4000/api/student/get-bill`, { id: res.data.data.idPhong._id }).then(res => {
                    console.log(res.data);
                    //Lưu bill trong redux;
                    res.data.data.map(item => {
                        this.props.getBill(item)
                    })

                });
            }
        });
    }

    showDetail = (data) => {
        this.setState({
            showDetail: !this.state.showDetail
        })
        this.setState({
            data: data
        })
    }

    hideDetail = (data) =>{

        this.setState({
            showDetail: data
        })
    }

    render() {
        var isFirstRow = false;
   
        return (

            <React.Fragment>
                {this.state.showDetail &&
                    <DetailBill 
                        hideDetail = {this.hideDetail}
                        data= {this.state.data}
                    >
                    </DetailBill>}

                <div className='title-header '>
                    <span>THÔNG TIN ĐIỆN NƯỚC</span>
                </div>
                <div className='title-header-line'></div>
                <div className='time-bill'>
                    <div className='time-bill-header'><span>Gần nhất</span></div>
                    <div className='text-style'>
                        <Table bordered hover responsive size="sm">
                            <thead >
                                <tr>
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
                                <tr onClick={e => this.showDetail(this.props.state[0])}>
                                    <td>{this.props.state[0].thang}</td>
                                    <td>{this.props.state[0].nam}</td>
                                    <td>{this.props.profile.idPhong.tenPhong}</td>
                                    <td>{this.props.state[0].soDien - this.props.state[0].soDienCu}</td>
                                    <td>{this.props.state[0].soNuoc - this.props.state[0].soNuocCu}</td>
                                    <td>{this.props.state[0].tienRac}</td>
                                    <td>{OpitmizeNumber.OpitmizeNumber(this.props.state[0].tongTien)}</td>

                                    {this.props.state[0].trangThai === "0" ? <td className='is-dont-done'>Chưa thanh toán</td> : <td className='is-done'>Đã thanh toán</td>}

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
                                    {
                                        this.props.state.map(item => {
                                            if (!isFirstRow) {
                                                isFirstRow = true;
                                            }
                                            else {
                                                return (
                                                    <tr onClick={e => this.showDetail(item)}>
                                                        <td>{item.thang}</td>
                                                        <td>{item.nam}</td>
                                                        <td>{this.props.profile.idPhong.tenPhong}</td>
                                                        <td>{item.soDien - item.soDienCu}</td>
                                                        <td>{item.soNuoc - item.soNuocCu}</td>
                                                        <td>{item.tienRac}</td>
                                                        <td>{OpitmizeNumber.OpitmizeNumber(item.tongTien)}</td>
                                                        {item.trangThai === "0" ? <td className='is-dont-done'>Chưa thanh toán</td> : <td className='is-done'>Đã thanh toán</td>}


                                                    </tr>
                                                )
                                            }
                                        })
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

var mapStateToProps = (state) => {
    return {
        state: state.bill,
        profile: state.userProfile
    };
}

var mapDispatchToProps = (dispatch) => {
    return {
        getBill: bindActionCreators(StudentAction.GET_BILL_INFO, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BillStudent);