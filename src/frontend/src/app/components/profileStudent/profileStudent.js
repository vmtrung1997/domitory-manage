import React from 'react'
import { ListGroup, Image, InputGroup, Button, FormControl, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap'
import './profileStudent.css'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import MyInput from '../input/input'
import MyDatePicker from '../datePicker/datePicker'
import MySelectOption from '../selectOption/select'
import InputDatetimePicker from './../../components/inputDatetimePicker/inputDatimePicker'
import './../titleStudent/titleStudent.css'
import {connect} from 'react-redux'

const fadeImages = [
    '/images/01_ataulfohouse_apaloosa.jpg',
    '/images/26_ataulfohouse_apaloosa.jpg',
    '/images/26_ataulfohouse_apaloosa.jpg',
];

class ProfileStudent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date()
        };
        this.handleChange = this.handleChange.bind(this);
    }



    handleChange(date) {
        this.setState({
            startDate: date
        });
        console.log(date);
    }


    render() {
        var {state} = this.props;
        var profile = state.userProfile;
        console.log(profile);
        const nganh = [{ value: 1, label: 'CNTT' }, { value: 2, label: 'Sinh hoc' }, { value: 3, label: 'Toan hoc' }]
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
                                            <MyInput value = {profile.maThe} borderRadius="3px" />
                                        </Col>
                                        <Col>
                                           
                                            Email
                                            <MyInput value = {profile.email} borderRadius="3px" />
                                        </Col>
                                    </Row>
                                </div>

                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                          
                                            Họ tên
                                            <MyInput value = {profile.hoTen} borderRadius="3px" />
                                        </Col>
                                        <Col>
                                           
                                            Địa chỉ
                                            <MyInput value = {profile.diaChi} borderRadius="3px" />
                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Ngày sinh
                                            <InputGroup className="mb-3">
                                                <FormControl value = {profile.ngaySinh} className={'input-picker'} aria-describedby="basic-addon1" />
                                                <DatePicker
                                                    customInput={<InputDatetimePicker />}
                                                
                                                    onChange={this.handleChange} />
                                            </InputGroup>
                                        </Col>

                                        <Col>
                                            Số điện thoại
                                            <MyInput value = {profile.sdt} borderRadius="3px" />
                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Ngành học
                                            <MySelectOption value={profile.nganhHoc} options={nganh} />
                                        </Col>
                                        <Col>
                                            Số điện thoại người thân
                                            <MyInput value={profile.sdtNguoiThan} borderRadius="3px" />

                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Trường
                                            <MyInput value={profile.truong} borderRadius="3px" />
                                        </Col>
                                        <Col>
                                            Ngày vào
                                            <MyInput value={profile.ngayVaoO} borderRadius="3px" />

                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Phòng
                                            <MyInput value={profile.idPhongHoc}  borderRadius="3px" />
                                        </Col>
                                        <Col>
                                            Ngày hết hạn
                                            <MyInput value={profile.ngayHetHan} borderRadius="3px" />

                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Trạng thái
                                            <MyInput borderRadius="3px" />
                                        </Col>
                                        <Col>
                                            Dân tộc
                                            <MyInput  value={profile.danToc} borderRadius="3px" />

                                        </Col>
                                    </Row>
                                </div>
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

  export default connect(mapStateToProps, null)(ProfileStudent);
