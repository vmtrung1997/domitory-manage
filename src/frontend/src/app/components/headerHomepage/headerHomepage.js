import React, { Component } from "react";
import {
  Button,
  FormControl,
  Dropdown,
  Nav,
  Form,
  Navbar
} from "react-bootstrap";
import Login from "./../../containers/student/modalLogin/login";
import ChangePassword from "./../../containers/student/modalResetPassword/modelPassword";
import ResetPassword from "./../../containers/student/modalForgotPassword/modalForgotPassword"
import { connect } from "react-redux";
import "./headerHomepage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

class HeaderHomepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoginModal: false,
      showResetPasswordModal: false,
      showPasswordModal: false,
      isLogin: false,
      name: ""
    };
  }

  Login = () => {
    this.setState({ showLoginModal: !this.state.showLoginModal });
  };

  hideLogin = show => {
    this.setState({
      showLoginModal: show
    });
  };


  abc = show =>{
    console.log('vo day');
    this.setState({
      showResetPasswordModal: show
    });
  }

  showResetPassword = () =>{
    this.setState({
      showResetPasswordModal: true
    })
  }
  dataLogin = data => {
    this.setUserName(data);
  };

  setUserName = secret => {
    const decode = jwt_decode(secret);
    console.log(decode);
    var name = decode.user.profile.hoTen.split(" ");
    this.setState({ name: name[name.length - 1] });
  };
  changePass = () =>{
    this.setState({
      showPasswordModal: true
    })
  }

  setActive = () => {};
  handleSelect = event => {
    console.log(event);
  };


  logOut = () => {
    const secret = JSON.parse(localStorage.getItem("secret"));

    axios.get(`http://localhost:4000/api/logout`, {
      headers: {
        "x-refresh-token": secret.refresh_token
      }
    });

    localStorage.removeItem("secret");
    this.setState({ isLogin: false });
  };

  componentDidMount() {
    var secret = localStorage.getItem("secret");
    if (secret) {
      this.setUserName(secret);
    }
  }

  hideChangePassword = (value) =>{
    this.setState({
      showPasswordModal: false
    })
  }
  render() {
    let isLogin;
    const secret = JSON.parse(localStorage.getItem("secret"));
    if (secret && !this.state.isLogin) {
      const decode = jwt_decode(secret.access_token);
      if (decode.user.userEntity.loai === "SV")
        this.setState({ isLogin: true });
    }
    if (!this.state.isLogin) {
      isLogin = (
        <Button
          variant="light"
          onClick={this.Login}
          className="form-rounded btn-hover"
        >
          Đăng nhập
        </Button>
      );
    } else {
      isLogin = (
        <Dropdown>
          <Dropdown.Toggle
            variant="light"
            id="dropdown-basic"
            className="form-rounded btn-hover"
          >
            <span> {this.state.name}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu alignRight>
            <Dropdown.Item eventKey="1">
              <Link to="/dashboard" className="list-item-link">
                <i className="fas fa-user-circle" />
                <span className="list-menu-sub">Dashboard</span>
              </Link>
            </Dropdown.Item>

            <Dropdown.Item onClick={this.changePass} eventKey="1">
              <Link to="/dashboard" className="list-item-link">
                <i className="fas fa-lock" />
                <span className="list-menu-sub">Đổi mật khẩu</span>
              </Link>
            </Dropdown.Item>

            <Dropdown.Divider />
            <Dropdown.Item onClick={this.logOut} eventKey="4">
              <i className="fas fa-sign-out-alt" />
              <span className="list-menu-sub">Thoát</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    }
    console.log(this.props.location);
    return (
      <React.Fragment>
        {this.state.showLoginModal && (
          <Login dataLogin={this.dataLogin} hideLogin={this.hideLogin} showResetPassword = {this.showResetPassword}/>
        )}
        {this.state.showPasswordModal && (
          <ChangePassword hideChangePassword={this.hideChangePassword} />
        )}
        {this.state.showResetPasswordModal && (
          <ResetPassword hideResetPassword={this.abc}></ResetPassword>
        )}

        <Navbar
          sticky="top"
          variant="dark"
          expand="sm"
          className="HeaderHomepage"
          style={{ backgroundColor: "#1B5F72" }}
        >
          <Navbar.Brand>
            <div className="nav-img">
              <img alt="img_header" src="/images/Logo-KHTN.jpg" />
            </div>
            <span className="header-title">Kí túc xá Trần Hưng Đạo</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link>
                {" "}
                <Link to="/">
                  <span className="list-item-menu"> Trang chủ </span>
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="/news">
                  <span className="list-item-menu"> Tin tức </span>
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="/about">
                  <span className="list-item-menu"> Giới thiệu </span>
                </Link>
              </Nav.Link>
            </Nav>
            <Form inline>
              <Form inline className="search-area">
                <FormControl
                  type="text"
                  placeholder="Tìm kiếm"
                  className="mr-sm-2 search-control form-rounded "
                />
                <Button variant="light" className="form-rounded btn-hover">
                  <i className="fas fa-search" />
                </Button>
              </Form>
              {/* <Nav className="mr-auto">
              <NavDropdown title="Chào bạn" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Đổi mật khẩu</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.2">Đăng xuất</NavDropdown.Item>
              </NavDropdown>
            </Nav> */}
              {isLogin}
              {/* <Button variant="light" className='form-rounded btn-hover'>Đăng nhập</Button> */}
            </Form>
          </Navbar.Collapse>
        </Navbar>
      </React.Fragment>
    );
  }
}
var mapStateToProps = state => {
  return {
    userProfile: state.userProfile
  };
};

export default connect(
  mapStateToProps,
  null
)(HeaderHomepage);
