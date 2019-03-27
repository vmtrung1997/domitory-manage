import React from 'react'
import { ListGroup, Image, InputGroup, Button, FormControl, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap'
import './activityStudent.css'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import MyInput from '../input/input'
import MyDatePicker from '../datePicker/datePicker'
import MySelectOption from '../selectOption/select'
import InputDatetimePicker from './../../components/inputDatetimePicker/inputDatimePicker'


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
    }


    render() {
        const nganh = [{ value: 1, label: 'CNTT' }, { value: 2, label: 'Sinh hoc' }, { value: 3, label: 'Toan hoc' }]
        return (
            <React.Fragment>
                <div className='title-header'>
                    <span>THÔNG TIN CÁ NHÂN</span>
                </div>
                <div className='profile-line'></div>
                <div className='profile-panel'>
                    <Row>
                        <Col sm={10}>
                            <div className='profile-panel-content'>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            {/* <InputGroup className="mb-3">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>Mã thẻ</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl aria-describedby="basic-addon1" />
                                            </InputGroup> */}
                                            Mã thẻ
                                            <MyInput borderRadius="3px" />
                                        </Col>
                                        <Col>
                                            {/* <InputGroup className="mb-3">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>Email</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl aria-describedby="basic-addon1" />
                                            </InputGroup> */}
                                            Email
                                            <MyInput borderRadius="3px" />
                                        </Col>
                                    </Row>
                                </div>

                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            {/* <InputGroup className="mb-3">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>Họ tên</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl aria-describedby="basic-addon1" />
                                            </InputGroup> */}
                                            Họ tên
                                            <MyInput borderRadius="3px" />
                                        </Col>
                                        <Col>
                                            {/* <InputGroup className="mb-3">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>Địa chỉ</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl aria-describedby="basic-addon1" />
                                            </InputGroup> */}
                                            Địa chỉ
                                            <MyInput borderRadius="3px" />
                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Ngày sinh
                                            <InputGroup className="mb-3">
                                                <FormControl className={'input-picker'} aria-describedby="basic-addon1" />
                                                <DatePicker
                                                    customInput={<InputDatetimePicker />}
                                                    //selected={this.state.startDate}
                                                    onChange={this.handleChange} />
                                            </InputGroup>
                                        </Col>

                                        <Col>
                                            Số điện thoại
                                            <MyInput borderRadius="3px" />
                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Ngành học
                                            <MySelectOption value={nganh[0]} options={nganh} />
                                        </Col>
                                        <Col>
                                            Số điện thoại người thân
                                            <MyInput borderRadius="3px" />

                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Trường
                                            <MyInput borderRadius="3px" />
                                        </Col>
                                        <Col>
                                            Ngày vào
                                            <MyInput borderRadius="3px" />

                                        </Col>
                                    </Row>
                                </div>
                                <div className='profile-panel-content-row'>
                                    <Row>
                                        <Col>
                                            Phòng
                                            <MyInput borderRadius="3px" />
                                        </Col>
                                        <Col>
                                            Ngày hết hạn
                                            <MyInput borderRadius="3px" />

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
                                            <MyInput borderRadius="3px" />

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



export default ProfileStudent