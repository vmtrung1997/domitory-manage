import React from 'react'
import { InputGroup, FormControl, Row, Col, Button } from 'react-bootstrap'
import './profileStudent.css'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import MyInput from '../input/input'
import MySelectOption from '../selectOption/select'
import InputDatetimePicker from './../../components/inputDatetimePicker/inputDatimePicker'
import './../titleStudent/titleStudent.css'
import { connect } from 'react-redux'
import axios from 'axios'
import jwt_decode from 'jwt-decode';
import { bindActionCreators } from 'redux'
import * as UserAction from '../../actions/userAction'
import * as SpecializedAction from '../../actions/SpecialAction'

class ProfileStudent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
            readOnly: true,
            isDisable: true,
            major: undefined
        };
        this.handleChange = this.handleChange.bind(this);
    }

    editProfile = () => {
        this.setState({ readOnly: false })
        this.setState({ isDisable: !this.state.isDisable });
    }

    handleChange(date) {
        this.setState({
            startDate: date
        });
        console.log(date);
    }

    componentDidMount() {
        var secret = localStorage.getItem('secret');
        const decode = jwt_decode(secret);
        secret = JSON.parse(secret);

        if (secret) {

            var id = decode.user.userEntity._id;

            //Lấy thông tin sinh viên
            axios.defaults.headers['x-access-token'] = secret.access_token;
            axios.post(`http://localhost:4000/api/student/get-info`, { id: id }).then(res => {
                if (res) {
                    this.props.getUserAction(res.data.data);
                }
            }).catch(err => {
                console.log(err)
            })

            //Lấy danh sách các ngành học
            axios.get('http://localhost:4000/api/student/get-specialized').then(res => {
                if (res) {
                    res.data.data.forEach(element => {
                        this.props.getSpecialized(element);
                    });
                }
            }).catch(err => {
                console.log(err)
            })

            var { state } = this.props;
            var profile = state.userProfile;
            this.setState({ major: profile.nganhHoc.tenNganh });
        }
        else {
            console.log('ko co data');
        }
    }

    render() {
        var { state } = this.props;
        var profile = state.userProfile;
        var specialized = state.specialized;

        const nganh = [];
        specialized.map(function (item, i) {
            nganh.push({ value: item.tenNganh, label: item.tenNganh });
        })

        var majorInput;
        if (!this.state.readOnly) {
            majorInput = <MySelectOption
                readOnly={this.state.readOnly}
                value={this.state.major}
                options={nganh}
            />
        }
        else{
            majorInput = <MyInput readOnly={this.state.readOnly} value={profile.nganhHoc.tenNganh} borderRadius="3px" />
        }
        return (
            <React.Fragment>
                <div className='title-header'>
                    <span>THÔNG TIN CÁ NHÂN</span>
                </div>
                <div className='title-header-line'></div>
                <div className='profile-panel'>
                    <Row>
                        <Col sm={10}>
                            <div className='profile-panel-content'>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>

                                            Mã thẻ
                                            <MyInput readOnly={this.state.readOnly} value={profile.maThe} borderRadius="3px" />
                                        </Col>
                                        <Col>

                                            Email
                                            <MyInput readOnly={this.state.readOnly} value={profile.email} borderRadius="3px" />
                                        </Col>
                                    </Row>
                                </div>

                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Họ tên
                                            <MyInput readOnly={this.state.readOnly} value={profile.hoTen} borderRadius="3px" />
                                        </Col>
                                        <Col>
                                            Địa chỉ
                                            <MyInput readOnly={this.state.readOnly} value={profile.diaChi} borderRadius="3px" />
                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Ngày sinh
                                            <InputGroup className="mb-3">
                                                <MyInput readOnly={this.state.readOnly} value={profile.ngaySinh} className={'input-picker'} borderRadius="3px" />
                                                {/* <FormControl readOnly={this.state.readOnly} value={profile.ngaySinh} aria-describedby="basic-addon1" /> */}
                                                {/* <DatePicker
                                                    customInput={<InputDatetimePicker />} */}

                                                {/* onChange={this.handleChange} /> */}
                                            </InputGroup>
                                        </Col>

                                        <Col>
                                            Số điện thoại
                                            <MyInput readOnly={this.state.readOnly} value={profile.sdt} borderRadius="3px" />
                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Ngành học
                                            
                                                {majorInput}
                                        </Col>
                                        <Col>
                                            Số điện thoại người thân
                                            <MyInput readOnly={this.state.readOnly} value={profile.sdtNguoiThan} borderRadius="3px" />

                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Trường
                                            <MyInput
                                                readOnly={this.state.readOnly}
                                                value={profile.truong.tenTruong}
                                                borderRadius="3px" />
                                        </Col>
                                        <Col>
                                            Ngày vào
                                            <MyInput readOnly={this.state.readOnly} value={profile.ngayVaoO} borderRadius="3px" />

                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Phòng
                                            <MyInput
                                                readOnly={this.state.readOnly}
                                                value={profile.idPhong.tenPhong}
                                                borderRadius="3px" />
                                        </Col>
                                        <Col>
                                            Ngày hết hạn
                                            <MyInput readOnly={this.state.readOnly} value={profile.ngayHetHan} borderRadius="3px" />

                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Trạng thái
                                            <MyInput readOnly={this.state.readOnly} borderRadius="3px" />
                                        </Col>
                                        <Col>
                                            Dân tộc
                                            <MyInput readOnly={this.state.readOnly} value={profile.danToc} borderRadius="3px" />

                                        </Col>
                                    </Row>
                                </div>
                                <Row>
                                    <div className='profile-panel-button'>

                                        <Button disabled={!this.state.isDisable} onClick={this.editProfile}>Chỉnh sửa</Button>


                                    </div>
                                    <div className='profile-panel-button'>
                                        <Button disabled={this.state.isDisable} variant="success" onClick={this.editProfile}>Lưu</Button>

                                    </div>
                                </Row>
                            </div>
                        </Col>

                    </Row>
                </div>


            </React.Fragment>
        )
    }
}

var mapStateToProps = (state) => {
    return {
        state: state
    };
}

var mapDispatchToProps = (dispatch) => {
    return {
        getUserAction: bindActionCreators(UserAction.GET_USER_INFO, dispatch),
        getSpecialized: bindActionCreators(SpecializedAction.GET_SPECIALIZED_INFO, dispatch),
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(ProfileStudent);
