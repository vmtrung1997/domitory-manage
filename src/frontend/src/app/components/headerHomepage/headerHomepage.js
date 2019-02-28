import React, { Component } from 'react'
import { Col, Row, Form, Button, InputGroup, FormControl } from 'react-bootstrap'
import './headerHomepage.css'

class HeaderHomepage extends Component {
    render() {
        return (
            <React.Fragment>

                <div className='HeaderHomepage'>
                    <div className='menu'>
                        <Row>
                        <Col sm={1}></Col>
 
                                <Col sm={1}>
                                    <div className="menu-item">
                                        <i className="far fa-clock"></i>
                                        <span >Trang chủ</span>
                                    </div>
                                </Col>
                                <Col sm={1}>
                                    <div className="menu-item">
                                        <i className="far fa-bell"></i>
                                        <span>Tin tức</span>
                                    </div>
                                </Col>
                                <Col sm={1}>
                                    <div className="menu-item">
                                        <i className="fas fa-info"></i>
                                        <span className="menu-item">Giới thiệu</span>
                                    </div>

                                </Col>

                            <Col sm={1}></Col>
                            <Col sm={1}>
                                <div className='logoHeader'>
                                    <img style = {{  width: '100px', height: '100px',borderRadius: '50%'}} src='/images/Logo-KHTN.jpg'></img>
                                </div>
                            </Col>
                            <Col sm={2}></Col>
                            <Col sm={2}>
                                <InputGroup className="mb-3 ">
                                    <FormControl className='form-rounded'
                                        placeholder=""
                                        aria-label=""
                                        aria-describedby="basic-addon2"
                                    />
                                    <InputGroup.Append>
                                        <InputGroup.Text className='form-rounded' id="basic-addon2"><i class="fas fa-search"></i></InputGroup.Text>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Col>
                            <Col sm = {2}>
                                <Button variant="primary" className='form-rounded menu-item'>

                                    <span>Đăng nhập</span></Button>
                            </Col>

                        </Row>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}

export default HeaderHomepage