import React from 'react'
import { InputGroup, Row, Col, Button } from 'react-bootstrap'
import './profileStudent.css'
import "react-datepicker/dist/react-datepicker.css";
import MyInput from '../input/input'
import MySelectOption from '../selectOption/select'
import './../titleStudent/titleStudent.css'
import { connect } from 'react-redux'
import axios from 'axios'
import jwt_decode from 'jwt-decode';
import { bindActionCreators } from 'redux'
import * as UserAction from '../../actions/userAction'
import * as SpecializedAction from '../../actions/SpecialAction'
import * as SchoolAction from '../../actions/schoolAction'
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
class ProfileStudent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
            readOnly: true,
            isDisable: true,

            MSSV: '',
            danToc: undefined,
            diaChi: undefined,
            email: undefined,
            gioiTinh: undefined,
            hoTen: '',
            tenPhong: '',
            idTaiKhoan: undefined,
            maThe: undefined,
            moTa: undefined,
            nganhHoc: undefined,
            ngayHetHan: undefined,
            ngaySinh: undefined,
            ngayVaoO: undefined,
            sdt: undefined,
            sdtNguoiThan: undefined,
            truong: undefined,
            nganhOptions: [],
            truongOptions: []

        };
        this.handleChange = this.handleChange.bind(this);
    }

    getValue = (obj) => {
        console.log(obj.name);
        this.setState({ [obj.name]: obj.value })
    }

    editProfile = () => {
        this.setState({ readOnly: !this.state.readOnly })
        this.setState({ isDisable: !this.state.isDisable });
    }

    updateProfile = () => {
        var data = {
            MSSV: this.state.MSSV,
            danToc: this.state.danToc,
            diaChi: this.state.diaChi,
            email: this.state.email,
            gioiTinh: this.state.gioiTinh,
            hoTen: this.state.hoTen,
            idPhong: this.state.tenPhong._id,
            idTaiKhoan: this.state.idTaiKhoan,
            nganhHoc: this.state.nganhHoc.value,
            ngayHetHan: this.state.ngayHetHan,
            ngaySinh: this.state.ngaySinh,
            ngayVaoO: this.state.ngayVaoO,
            sdt: this.state.sdt,
            sdtNguoiThan: this.state.sdtNguoiThan,
            truong: this.state.truong.value
        };

        var secret = localStorage.getItem('secret');
        secret = JSON.parse(secret);
        axios.defaults.headers['x-access-token'] = secret.access_token;
        axios.post(`http://localhost:4000/api/student/update-info`, { data: data }).then(res => {
            if (res.data.res === "success") {
                ToastsStore.success("Cập nhật thành công");
            }
            else {
                ToastsStore.error("Cập nhật thất bại");
            }
        })
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
                    //Lưu trong redux
                    this.props.getUserAction(res.data.data);

                    var nganhHoc = {
                        label: res.data.data.nganhHoc.tenNganh,
                        value: res.data.data.nganhHoc._id
                    }

                    var truong = {
                        label: res.data.data.truong.tenTruong,
                        value: res.data.data.truong._id
                    }
                    //Lưu trong state
                    this.setState({
                        MSSV: res.data.data.MSSV,
                        danToc: res.data.data.danToc,
                        diaChi: res.data.data.diaChi,
                        email: res.data.data.email,
                        gioiTinh: res.data.data.gioiTinh,
                        hoTen: res.data.data.hoTen,
                        tenPhong: res.data.data.idPhong,
                        idTaiKhoan: res.data.data.idTaiKhoan,
                        maThe: res.data.data.maThe,
                        moTa: res.data.data.moTa,
                        nganhHoc: nganhHoc,
                        ngayHetHan: res.data.data.ngayHetHan,
                        ngaySinh: res.data.data.ngaySinh,
                        ngayVaoO: res.data.data.ngayVaoO,
                        sdt: res.data.data.sdt,
                        sdtNguoiThan: res.data.data.sdtNguoiThan,
                        truong: truong
                    })
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
                    var options = res.data.data.map(obj => {
                        return { value: obj._id, label: obj.tenNganh }
                    })
                    this.setState({ nganhOptions: options })
                }
            }).catch(err => {
                console.log(err)
            })

            //Lấy danh sách các trường
            axios.get('http://localhost:4000/api/student/get-school').then(res => {
                if (res) {
                    console.log(res.data.data);
                    res.data.data.forEach(element => {
                        this.props.getSchool(element);
                    });
                    var options = res.data.data.map(obj => {
                        return { value: obj._id, label: obj.tenTruong }
                    })
                    this.setState({ truongOptions: options })
                }
            }).catch(err => {
                console.log(err)
            })
        }
        else {
            console.log('ko co data');
        }
    }

    nganhSelected = (value) => {
        console.log(value);
        var nganh = this.state.nganhOptions.find(obj => obj.value === value)
        this.setState({
            nganhHoc: nganh
        })
    }

    genderSelected = (value) => {
        this.setState({ gioiTinh: value });
    }

    truongSelected = (value) => {

        var truong = this.state.truongOptions.find(obj => obj.value === value)
        this.setState({
            truong: truong
        })

    }

    render() {
        var { state } = this.props;
        var profile = state.userProfile || null;

        var gender = [{ value: 0, label: 'Nữ' }, { value: 1, label: 'Nam' }]
        var majorInput;
        var schoolInput;
        var genderInput;
        if (!this.state.readOnly) {

            genderInput = <MySelectOption
                name='gioiTinh'
                getValue={this.getValue}
                disabled={this.state.readOnly}
                value={this.state.gioiTinh}
                options={gender}
                selected={this.genderSelected}
            />

            majorInput = <MySelectOption
                name='nganhHoc'
                getValue={this.getValue}
                disabled={this.state.readOnly}
                value={this.state.nganhHoc.value}
                options={this.state.nganhOptions}
                selected={this.nganhSelected}
            />

            schoolInput = <MySelectOption
                name='truong'
                getValue={this.getValue}
                disabled={this.state.readOnly}
                value={this.state.truong.value}
                options={this.state.truongOptions}
                selected={this.truongSelected}
            />
        }
        else {
            schoolInput = <MyInput getValue={this.getValue} name='truong' readOnly={this.state.readOnly} value={profile.truong.tenTruong} borderRadius="3px" />
            majorInput = <MyInput getValue={this.getValue} name='nganhHoc' disabled={this.state.readOnly} value={profile.nganhHoc.tenNganh} borderRadius="3px" />
            genderInput = <MyInput getValue={this.getValue} name='gioiTinh' readOnly={this.state.readOnly} value={profile.gioiTinh === '1' ? 'Nam' : 'Nữ'} borderRadius="3px" />
        }



        return (
            <React.Fragment>
               
                <div className='title-header'>
                    <span>THÔNG TIN CÁ NHÂN</span>
                </div>
                <div className='title-header-line'></div>
                <div className='profile-panel'>
                
                    <Row>
                    <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} lightBackground store={ToastsStore}/>
                        <Col sm={10}>
                            <div className='profile-panel-content'>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Mã thẻ
                                            <MyInput getValue={this.getValue} disabled name='maThe' value={profile.maThe} borderRadius="3px" />
                                        </Col>
                                        <Col>
                                            Email
                                            <MyInput getValue={this.getValue} name='email' disabled={this.state.readOnly} value={profile.email} borderRadius="3px" />
                                        </Col>
                                    </Row>
                                </div>

                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Họ tên
                                            <MyInput getValue={this.getValue} name='hoTen' disabled={this.state.readOnly} value={profile.hoTen} borderRadius="3px" />
                                        </Col>
                                        <Col>
                                            Địa chỉ
                                            <MyInput getValue={this.getValue} name='diaChi' disabled={this.state.readOnly} value={profile.diaChi} borderRadius="3px" />
                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Ngày sinh
                                            <InputGroup className="mb-3">
                                                <MyInput name='ngaySinh' getValue={this.getValue} disabled={this.state.readOnly} value={profile.ngaySinh} className={'input-picker'} borderRadius="3px" />
                                                {/* <FormControl readOnly={this.state.readOnly} value={profile.ngaySinh} aria-describedby="basic-addon1" /> */}
                                                {/* <DatePicker
                                                    customInput={<InputDatetimePicker />} */}

                                                {/* onChange={this.handleChange} /> */}
                                            </InputGroup>
                                        </Col>

                                        <Col>
                                            Số điện thoại
                                            <MyInput getValue={this.getValue} name='sdt' disabled={this.state.readOnly} value={profile.sdt} borderRadius="3px" />
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
                                            <MyInput getValue={this.getValue} name='sdtNguoiThan' disabled={this.state.readOnly} value={profile.sdtNguoiThan} borderRadius="3px" />

                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Trường
                                            {schoolInput}
                                        </Col>
                                        <Col>
                                            Ngày vào
                                            <MyInput getValue={this.getValue} name='ngayVaoO' disabled={this.state.readOnly} value={profile.ngayVaoO} borderRadius="3px" />

                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Phòng
                                            <MyInput
                                                getValue={this.getValue}
                                                name='tenPhong'
                                                readOnly={this.state.readOnly}
                                                value={profile.idPhong.tenPhong}
                                                borderRadius="3px" />
                                        </Col>
                                        <Col>
                                            Ngày hết hạn
                                            <MyInput getValue={this.getValue} name='ngayHetHan' disabled={this.state.readOnly} value={profile.ngayHetHan} borderRadius="3px" />

                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Trạng thái
                                            <MyInput getValue={this.getValue} disabled={this.state.readOnly} borderRadius="3px" />
                                        </Col>
                                        <Col>
                                            Dân tộc
                                            <MyInput getValue={this.getValue} name='danToc' readOdisablednly={this.state.readOnly} value={profile.danToc} borderRadius="3px" />

                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col sm={6}>
                                            Giới tính
                                           {genderInput}
                                        </Col>

                                    </Row>
                                </div>
                                <Row>
                                    <div className='profile-panel-button'>

                                        <Button disabled={!this.state.isDisable} onClick={this.editProfile}>Chỉnh sửa</Button>


                                    </div>
                                    <div className='profile-panel-button'>
                                        <Button disabled={this.state.isDisable} variant="success" onClick={this.updateProfile}>Lưu</Button>

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
        getSchool: bindActionCreators(SchoolAction.GET_SCHOOL_INFO, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileStudent);
