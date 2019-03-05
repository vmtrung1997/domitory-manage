import React, { Component } from 'react'
import { Modal, Col, Row, Form, Button, InputGroup, FormControl, Dropdown, SplitButton, ButtonToolbar } from 'react-bootstrap'
import Login from './../../containers/student/login'

import './headerHomepage.css'

class HeaderHomepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoginModal: false,
            username: ''
        }
    }

    Login = () => {
        this.setState({ showLoginModal: !this.state.showLoginModal });
    }

    hideLogin = (show) => {
        console.log(show);
        this.setState({
            showLoginModal: show
        })
    }

    dataLogin = (data) => {
        console.log(data);
        this.setState({
            username: data.username
        })

    }
    setActive = () => {

    }
    handleSelect = (event) => {
        console.log(event)
    }
    getScroll = (event) => {
        this.props.getScroll(event.target.value);
    }
    render() {
        let isLogin;
        if (!this.state.username) {
            isLogin = <Button onClick={this.Login} variant="primary" className='form-rounded menu-item'>
                <span>Đăng nhập</span></Button>
        }
        else {
            isLogin = <ButtonToolbar>
                {['Primary'].map(
                    variant => (
                        <SplitButton

                            title={`Chao ${this.state.username}`}
                            variant="link"
                            id={`dropdown-split-variants-${variant}`}
                            key={variant}
                            onSelect={this.handleSelect}
                        

                        >
                            <Dropdown.Item eventKey="1"><i className="fas fa-user-circle"></i><span className = 'list-menu-sub'>Trang cá nhân</span></Dropdown.Item>
                            <Dropdown.Item eventKey="2"><i className="fas fa-snowboarding"></i><span className ='list-menu-sub'>Hoạt động</span></Dropdown.Item>
                            <Dropdown.Item eventKey="3"><i className="fas fa-file-invoice"></i><span className ='list-menu-sub'>Điện nước</span></Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item eventKey="4"><i className="fas fa-sign-out-alt"></i><span className ='list-menu-sub'>Thoát</span></Dropdown.Item>
                        </SplitButton>
                    ),
                )}
            </ButtonToolbar>;
        }
        return (
            <div>
                {this.state.showLoginModal && <Login dataLogin={this.dataLogin} hideLogin={this.hideLogin}></Login>}
                <div className='HeaderHomepage'>
                    <div className='option'>
                        <div>
                            <i className="far fa-clock"></i>&nbsp;
                            <button onClick={this.getScroll} value="1">Trang chủ</button>
                        </div>
                        <div>
                            <i className="far fa-clock"></i>&nbsp;
                            <span onClick={this.getScroll} value="2">Tin tuc</span>
                        </div>
                        <div>
                            <i className="far fa-clock"></i>&nbsp;
                            <span onClick={this.getScroll} value="3">Gioi thieu  </span>
                        </div>
                    </div>
                    <div className='logoHeader'>
                        <img style={{ width: '100px', height: '100px', borderRadius: '50%' }} src='/images/Logo-KHTN.jpg'></img>
                    </div>
                    <div className='option'>
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
                        <div className='right-content'>

                            {isLogin}
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default HeaderHomepage