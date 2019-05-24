import React, { Component } from "react";
import {
  Button,
  FormControl,
  Dropdown,
  Nav,
  Form,
  Navbar,
  Row,
  Col
} from "react-bootstrap";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

import "./headerHomepage.css";
import Login from "./../../containers/student/modalLogin/login";
import ChangePassword from "./../../containers/student/modalResetPassword/modelPassword";
import ResetPassword from "./../../containers/student/modalForgotPassword/modalForgotPassword";

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

  abc = show => {
    this.setState({
      showResetPasswordModal: show
    });
  };

  showResetPassword = () => {
    this.setState({
      showResetPasswordModal: true
    });
  };
  dataLogin = data => {
    this.setUserName(data.access_token);
  };

  setUserName = secret => {
    const decode = jwt_decode(secret);
    if (decode.user.profile) {
      var name = decode.user.profile.hoTen.split(" ");
      if (name.length > 1) {
        this.setState({
          name: name[name.length - 2] + " " + name[name.length - 1]
        });
      } else {
        this.setState({ name: name[0] });
      }
    }
  };

  changePass = () => {
    this.setState({
      showPasswordModal: true
    });
  };

  logOut = () => {
    const secret = JSON.parse(localStorage.getItem("secret"));

    axios.get(`/logout`, {
      headers: {
        "x-refresh-token": secret.refresh_token
      }
    });

    localStorage.removeItem("secret");

    this.setState({ isLogin: false });

    this.props.history.push({
      pathname: "/"
    });
  };

  componentDidMount() {
    var secret = localStorage.getItem("secret");
    if (secret) {
      this.setUserName(secret);
    }
  }

  hideChangePassword = value => {
    this.setState({
      showPasswordModal: false
    });
  };
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
        <Button onClick={this.Login} className="bt-sign">
          Đăng nhập
        </Button>
      );
    } else {
      isLogin = (
        <Dropdown>
          <Dropdown.Toggle
            variant="light"
            id="dropdown-basic"
            className="form-rounded btn-sign"
          >
            <span> {this.state.name}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu alignRight>
            <Dropdown.Item eventKey="1" as={Link} to="/dashboard">
              <i className="fas fa-user-circle" />
              <span className="list-menu-sub">Dashboard</span>
            </Dropdown.Item>

            <Dropdown.Item
              onClick={this.changePass}
              eventKey="2"
              className="list-item-link"
            >
              <i className="fas fa-lock" />
              <span className="list-menu-sub">Đổi mật khẩu</span>
            </Dropdown.Item>

            <Dropdown.Divider />
            <Dropdown.Item onClick={this.logOut} eventKey="3">
              <i className="fas fa-sign-out-alt" />
              <span className="list-menu-sub">Thoát</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    }
    return (
      <React.Fragment>
        {this.state.showLoginModal && (
          <Login
            dataLogin={this.dataLogin}
            hideLogin={this.hideLogin}
            showResetPassword={this.showResetPassword}
          />
        )}
        {this.state.showPasswordModal && (
          <ChangePassword hideChangePassword={this.hideChangePassword} />
        )}
        {this.state.showResetPasswordModal && (
          <ResetPassword hideResetPassword={this.abc} />
        )}

        <Navbar
          sticky="top"
          expand="sm"
          className="HeaderHomepage"
          style={{ backgroundColor: "#fffffff7", height: "60px" }}
        >
          <Navbar.Brand>
            <Row>

              <Link className="nav-img" to="/">
                <div >
                  <img alt="img_header" src="/images/Logo-KHTN.jpg" />
                </div>
              </Link>

              <Link className="header-title" to="/">
                <h2 className="header-title"  >Kí túc xá Trần Hưng Đạo</h2>
              </Link>
            </Row>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Link to="/" className="list-item-menu">
                Trang chủ
              </Link>
              <Link to="/news" className="list-item-menu">
                Tin tức
              </Link>
              {/* <Link to="/about" className="list-item-menu">
                Giới thiệu
              </Link> */}
            </Nav>
            <Form inline>{isLogin}</Form>
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

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(HeaderHomepage)
);
