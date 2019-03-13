import React from 'react'
import {InputGroup, FormControl, Row, Col, Button } from 'react-bootstrap'
import './profileStudent.css'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import MyInput from '../input/input'
import MySelectOption from '../selectOption/select'
import InputDatetimePicker from './../../components/inputDatetimePicker/inputDatimePicker'
import './../titleStudent/titleStudent.css'
import {connect} from 'react-redux'


class ProfileStudent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
            readOnly: true,
            isDisable: true
        };
        this.handleChange = this.handleChange.bind(this);
    }

    editProfile = () =>{
        this.setState({readOnly: false})
        this.setState({isDisable: !this.state.isDisable});
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
        var specialized = state.specialized;
        const nganh = [];
        specialized.map(function(item,i){
            nganh.push({value: item.tenNganh, label: item.tenNganh});
        })
       
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
                                            <MyInput readOnly = {this.state.readOnly} value = {profile.maThe} borderRadius="3px" />
                                        </Col>
                                        <Col>
                                           
                                            Email
                                            <MyInput readOnly = {this.state.readOnly} value = {profile.email} borderRadius="3px" />
                                        </Col>
                                    </Row>
                                </div>

                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                          
                                            Họ tên
                                            <MyInput readOnly = {this.state.readOnly} value = {profile.hoTen} borderRadius="3px" />
                                        </Col>
                                        <Col>
                                           
                                            Địa chỉ
                                            <MyInput readOnly = {this.state.readOnly} value = {profile.diaChi} borderRadius="3px" />
                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Ngày sinh
                                            <InputGroup className="mb-3">
                                                <FormControl readOnly = {this.state.readOnly} value = {profile.ngaySinh} className={'input-picker'} aria-describedby="basic-addon1" />
                                                <DatePicker
                                                    customInput={<InputDatetimePicker />}
                                                
                                                    onChange={this.handleChange} />
                                            </InputGroup>
                                        </Col>

                                        <Col>
                                            Số điện thoại
                                            <MyInput readOnly = {this.state.readOnly} value = {profile.sdt} borderRadius="3px" />
                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Ngành học
                                            <MySelectOption  value={profile.nganhHoc.tenNganh} 
                                            options={nganh} 
                                            />
                                        </Col>
                                        <Col>
                                            Số điện thoại người thân
                                            <MyInput readOnly = {this.state.readOnly} value={profile.sdtNguoiThan} borderRadius="3px" />

                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Trường
                                            <MyInput readOnly = {this.state.readOnly} value={profile.truong.tenTruong} borderRadius="3px" />
                                        </Col>
                                        <Col>
                                            Ngày vào
                                            <MyInput readOnly = {this.state.readOnly} value={profile.ngayVaoO} borderRadius="3px" />

                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Phòng
                                            <MyInput readOnly = {this.state.readOnly} value={profile.idPhong.tenPhong}  borderRadius="3px" />
                                        </Col>
                                        <Col>
                                            Ngày hết hạn
                                            <MyInput readOnly = {this.state.readOnly} value={profile.ngayHetHan} borderRadius="3px" />

                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Trạng thái
                                            <MyInput readOnly = {this.state.readOnly} borderRadius="3px" />
                                        </Col>
                                        <Col>
                                            Dân tộc
                                            <MyInput readOnly = {this.state.readOnly} value={profile.danToc} borderRadius="3px" />

                                        </Col>
                                    </Row>
                                </div>
                                <Row>
                                <div className='profile-panel-button'>
                               
                                    <Button disabled = {!this.state.isDisable} onClick = {this.editProfile}>Chỉnh sửa</Button>
                                    
                               
                                </div>
                                <div className='profile-panel-button'>
                               <Button disabled = {this.state.isDisable} variant="success" onClick = {this.editProfile}>Lưu</Button>
                          
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

  export default connect(mapStateToProps, null)(ProfileStudent);
