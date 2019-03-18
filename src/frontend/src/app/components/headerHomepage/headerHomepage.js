import React, { Component } from 'react'
import { Button, InputGroup, FormControl, Dropdown, SplitButton, ButtonToolbar } from 'react-bootstrap'
import Login from './../../containers/student/modalLogin/login'
import { connect } from 'react-redux'
import './headerHomepage.css'
import { Link } from 'react-router-dom'
import axios from 'axios'

class HeaderHomepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoginModal: false,
            isLogin: false,
        }
    }

    Login = () => {
        this.setState({ showLoginModal: !this.state.showLoginModal });
    }

    hideLogin = (show) => {
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

    logOut = () => {
        const secret = JSON.parse(localStorage.getItem('secret'))

        axios.get(`http://localhost:4000/api/logout`, {
            headers: {
                'x-refresh-token': secret.refresh_token
            }
        })

        localStorage.removeItem('secret');
        this.setState({ isLogin: false })
    }

    render() {
        let isLogin;
        const secret = JSON.parse(localStorage.getItem('secret'))
        if (secret && !this.state.isLogin) {
            this.setState({ isLogin: true })
        }
        if (!secret && !this.state.isLogin) {
            isLogin = <Button onClick={this.Login} variant="primary" className='form-rounded menu-item btn-menu'>
                <span>Đăng nhập</span></Button>
        }
        else {
            // var name = userProfile.hoTen.split(" ");
            // name = name[name.length-1];
            isLogin = <ButtonToolbar>
                {['Primary'].map(
                    variant => (
                        <SplitButton

                            title={`Chào $`}
                            variant="link"
                            id={`dropdown-split-variants-${variant}`}
                            key={variant}
                            onSelect={this.handleSelect}
                        >
                            <Dropdown.Item eventKey="1"><Link to="/dashboard#profile"><i className="fas fa-user-circle"></i><span className='list-menu-sub'>Trang cá nhân</span></Link></Dropdown.Item>
                            <Dropdown.Item eventKey="2"><i className="fas fa-snowboarding"></i><span className='list-menu-sub'>Hoạt động</span></Dropdown.Item>
                            <Dropdown.Item eventKey="3"><i className="fas fa-file-invoice"></i><span className='list-menu-sub'>Điện nước</span></Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={this.logOut} eventKey="4"><i className="fas fa-sign-out-alt"></i><span className='list-menu-sub'>Thoát</span></Dropdown.Item>
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
                            <Button className="outline btn-menu" variant="light" onClick={this.getScroll} value="1">
                                TRANG CHỦ</Button>
                        </div>
                        <div>
                            <Button className="outline btn-menu" variant="light" onClick={this.getScroll} value="2">
                                TIN TỨC</Button>
                        </div>
                        <div>
                            <Button className="outline btn-menu" variant="light" onClick={this.getScroll} value="3">
                                THÔNG TIN</Button>
                        </div>
                    </div>
                    <div className='logoHeader'>
                        <img alt="img_header" className='img-header' style={{ width: '100px', height: '100px', borderRadius: '50%' }} src='/images/Logo-KHTN.jpg'></img>
                    </div>
                    <div className='option'>
                        <div className='right-content'>
                            <InputGroup className="">
                                <FormControl className='form-rounded btn-menu'
                                    placeholder="Tìm kiếm..."
                                    aria-label=""
                                    aria-describedby="basic-addon2"
                                />

                            </InputGroup>
                        </div>
                        <div className='right-content '>

                            {isLogin}
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
var mapStateToProps = (state) => {
    return {
        state: state
    };
}


export default connect(mapStateToProps, null)(HeaderHomepage);