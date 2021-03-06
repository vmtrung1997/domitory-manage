import React from "react";
import { Modal, Container } from "react-bootstrap";
import md5 from "md5";
import axios from "axios";
import Button from '../../../components/button/button'
import { connect } from "react-redux";
import Input from "../../../components/input/input";
import "./login.css";
import Loader from "react-loader-spinner";

class StudentLogin extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: true,
      username: "",
      password: "",
      wrongLogin: false,
      isLoad: false
    };
  }

  showResetPassword = () =>{
    this.setState({ show: false });
    this.props.hideLogin(false);
    this.props.showResetPassword(true);
  }

  handleClose() {
    this.setState({ show: false });
    this.props.hideLogin(false);
  }

  getValue = obj => {
    if (obj.name === "password") {
      this.setState({ [obj.name]: md5(obj.value) });
    } else {
      this.setState({ [obj.name]: obj.value });
    }
  };

  Login = () => {
    this.setState({
      isLoad: true,
      wrongLogin: false
    });
    axios
      .post(`/user/login`, {
        username: this.state.username,
        password: this.state.password
      })
      .then(res => {
        if (res.data) {
          localStorage.setItem("secret", JSON.stringify(res.data));
          
          this.props.hideLogin(false);
          this.props.dataLogin(res.data);
        } else if(res.status === 400)
          this.setState({
            wrongLogin: true
          });
        }
      )
      .catch(err => {
        this.setState({
          wrongLogin: true
        });
      })
      .then(() => {
        this.setState({
          isLoad: false
        });
      });
  };

  render() {
    return (
      <React.Fragment>
        <div
          onKeyPress={e => {
            if (e.key === "Enter") this.Login();
          }}
        >
          <Modal
            show={this.state.show}
            onHide={this.handleClose}
            dialogClassName="title-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title bsPrefix="title-center">Đăng nhập</Modal.Title>
            </Modal.Header>
            <Container>
              <Modal.Body style={{ textAlign: "center" }}>
                <Input
                  name="username"
                  placeholder="Tên đăng nhập"
                  getValue={this.getValue}
                />
                <Input
                  name="password"
                  placeholder="Mật khẩu"
                  type="password"
                  getValue={this.getValue}
                />
                {this.state.isLoad &&
                <Loader
                  type="ThreeDots"
                  color=" #293846"
                  height={50}
                  width={50}
                />
                }
                {this.state.wrongLogin && (
                  <p style={{ color: "red" }}>
                    *Tên tài khoản hoặc mật khẩu không đúng!
                  </p>
                )}
                <Button onClick={this.Login} variant="primary" className = 'btn-hover'>
                  Đăng nhập
                </Button>
                <div onClick = {this.showResetPassword} style = {{marginTop: '10px', cursor: 'pointer'}}>
                  <span>Quên mật khẩu?</span>
                </div>
              </Modal.Body>
            </Container>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

var mapStateToProps = state => {
  return {
    state: state
  };
};

export default connect(
  mapStateToProps,
  null
)(StudentLogin);
