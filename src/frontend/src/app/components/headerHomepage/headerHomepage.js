import React, { Component } from 'react'
import { Modal,Col, Row, Form, Button, InputGroup, FormControl } from 'react-bootstrap'
import Login from './../../containers/student/login'

import './headerHomepage.css'

class HeaderHomepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoginModal: false,
        }
    }

    Login = () => {
        this.setState({showLoginModal:!this.state.showLoginModal});
    }

    hideLogin = (show) =>{
        console.log(show);
        this.setState({
            showLoginModal: show
        })
    }
    
    render() {
        return (
            <div>
                    {this.state.showLoginModal && <Login hideLogin = {this.hideLogin}></Login>}
                <div className='HeaderHomepage'>

                    <div className='header-list'>
                        <Row>
                            <Col sm={1}></Col>
                            <Col sm={1} className='menu-item menu'>
                                <i className="far fa-clock"></i>&nbsp;
                                        <span >Trang chủ</span>

                            </Col>
                            <Col sm={1} className="menu-item menu">

                                <i className="far fa-bell"></i>&nbsp;
                                        <span>Tin tức</span>

                            </Col>
                            <Col sm={1} className="menu-item menu">

                                <i className="fas fa-info"></i>&nbsp;
                                        <span className="menu-item">Giới thiệu</span>


                            </Col>
                            <Col sm={1}></Col>
                            <Col sm={1}>
                                <div className='logoHeader'>
                                    <img style={{ width: '100px', height: '100px', borderRadius: '50%' }} src='/images/Logo-KHTN.jpg'></img>
                                </div>
                            </Col>
                            <Col sm={2}></Col>
                            <Col sm={2}>
                                <div className='right-content'>
                                    <InputGroup className="">
                                        <FormControl className='form-rounded'
                                            placeholder=""
                                            aria-label=""
                                            aria-describedby="basic-addon2"
                                        />
                                        <InputGroup.Append>
                                            <InputGroup.Text className='form-rounded' id="basic-addon2"><i className="fas fa-search"></i></InputGroup.Text>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </div>
                            </Col>
                            <Col sm={2}>
                                <div className='right-content'>
                                    <Button onClick={this.Login} variant="primary" className='form-rounded menu-item'>

                                        <span>Đăng nhập</span></Button>
                                </div>
                            </Col>

                        </Row>
                    </div>

                </div>

</div>
        )
    }
}

export default HeaderHomepage