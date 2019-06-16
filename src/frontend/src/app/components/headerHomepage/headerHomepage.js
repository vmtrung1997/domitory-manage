import React, { Component } from "react";
import {
  Button,
 
  Dropdown,
  Nav,

  Navbar,
  Row,

} from "react-bootstrap";

import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

import "./headerHomepage.css";
import Login from "./../../containers/student/modalLogin/login";
import ChangePassword from "./../../containers/student/modalResetPassword/modelPassword";
import ResetPassword from "./../../containers/student/modalForgotPassword/modalForgotPassword";
import "./menuHeader.css";
class HeaderHomepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoginModal: false,
      showResetPasswordModal: false,
      showPasswordModal: false,
      isLogin: false,
      name: "",
      isShowMenu: false
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

  showHamburgerMenu = () => {
    this.setState({
      isShowMenu: !this.state.isShowMenu
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
        <Dropdown className="dropdown-login">
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
          style={{ backgroundColor: "#fffffff7" }}
        >
          <Navbar.Brand>
            <Row>
              <Link className="nav-img" to="/">
                <div>
                  <img alt="img_header" src="/images/Logo-KHTN.jpg" />
                </div>
              </Link>

              <Link className="header-title" to="/">
                <h2 className="header-title">Kí túc xá Trần Hưng Đạo</h2>
              </Link>
            </Row>
          </Navbar.Brand>
          <Nav className="destop-screen">
            <Link to="/" className="list-item-menu">
              Trang chủ
            </Link>
            <Link to="/news" className="list-item-menu">
              Tin tức
            </Link>
            <Link to="/introduce" className="list-item-menu">
              Giới thiệu
            </Link>
          </Nav>

          <div className="destop-screen-name">{isLogin}</div>
          <nav className ="my-nav">
            <ul
              className={
                this.state.isShowMenu ? "nav-links nav-active" : "nav-links"
              }
            >
              <li
                onClick={this.showHamburgerMenu}
                className={this.state.isShowMenu ? "animation-menu" : "mobile"}
              >
                <Link to="/" className="list-item-menu">
                  Trang chủ
                </Link>
              </li>
              <li
                onClick={this.showHamburgerMenu}
                className={this.state.isShowMenu ? "animation-menu" : "mobile"}
              >
                <Link to="/news" className="list-item-menu">
                  Tin tức
                </Link>
              </li>

              <Button onClick={this.Login} className={this.state.isShowMenu&&!this.state.isLogin?"bt-sign animation-menu":"mobile"}>
                  Đăng nhập
              </Button>

              <li
                className={this.state.isShowMenu&&this.state.isLogin ? "animation-menu list-item-menu" : "mobile"}
              >
                <a href="#">Chào {this.state.name}</a>
              </li>
              <div   className={this.state.isShowMenu&&this.state.isLogin ? "div-line":""} />
              <li
                onClick={this.showHamburgerMenu}
                className={this.state.isShowMenu&&this.state.isLogin ? "animation-menu" : "mobile"}
              >
                <Link to="/dashboard" className="list-item-menu">
                  Dashboard
                </Link>
              </li>
              <li
                onClick={this.changePass}
                className={this.state.isShowMenu&&this.state.isLogin? "animation-menu list-item-menu" : "mobile"}
              >
                <a onClick={this.showHamburgerMenu} href="#">
                  Đổi mật khẩu
                </a>
              </li>
              <li onClick={this.logOut} 
                className={this.state.isShowMenu&&this.state.isLogin ? "animation-menu list-item-menu" : "mobile"}
              >
                <a onClick={this.showHamburgerMenu}  href="#">Thoát</a>
              </li>
            </ul>

            <div onClick={this.showHamburgerMenu} className={this.state.isShowMenu?"burger icon close":"burger icon"}>
              <div className="line1" />
              <div className="line2" />
              <div className="line3" />
            </div>
          </nav>
          {/* <Navbar.Toggle aria-controls="basic-navbar-nav " /> */}
          {/* <Navbar.Collapse
            id="basic-navbar-nav"
            className="navbar-toggle collapsed"
          >
            
            <Nav className="">
              <Link to="/" className="list-item-menu">
                Trang chủ
              </Link>
              <Link to="/news" className="list-item-menu">
                Tin tức
              </Link>

            </Nav>
            {isLogin}
          </Navbar.Collapse> */}
        </Navbar>
        {/* <div>
        <nav>
       
          <div class="logo-header">
          <Link className="nav-img" to="/">
          
                  <img alt="img_header" src="/images/Logo-KHTN.jpg" />
               
              </Link>
            <h5>KTX Trần Hưng Đạo</h5>
          </div>

          <ul className={this.state.isShowMenu?"nav-links nav-active": "nav-links"}>

            <li className = {this.state.isShowMenu?"animation-menu":''}>
    
              <a href="#">Tin tức</a>
            </li>
            <li className = {this.state.isShowMenu?"animation-menu":''}>
      
              <a href="#">Word</a>
            </li>
            <li className = {this.state.isShowMenu?"animation-menu":'mobile'}>
              <a href="#">Chào  {this.state.name}</a>
            </li>
            <div className ='div-line'></div>
            <li className = {this.state.isShowMenu?"animation-menu":'mobile'}>
              <a href="#">Dashboard</a>
            </li>
            <li className = {this.state.isShowMenu?"animation-menu":'mobile'}>
              <a href="#">Đổi mật khẩu</a>
            </li>
            <li className = {this.state.isShowMenu?"animation-menu":'mobile'}>
              <a href="#">Thoát</a>
            </li>
          </ul>
          <div onClick = {this.showHamburgerMenu} className="burger">
            <div class="line1" />
            <div class="line2" />
            <div class="line3" />
          </div>
        </nav>
        </div> */}
      </React.Fragment>
    );
  }
}

export default withRouter(
(HeaderHomepage)
);
