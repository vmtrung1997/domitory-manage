import React from "react";
import { Modal, Button, Container } from "react-bootstrap";
import md5 from "md5";
import { connect } from "react-redux";
import jwt_decode from "jwt-decode";
import Loader from "react-loader-spinner";

import axios from "axios";
import Input from "../../../components/input/input";
import refreshToken from "./../../../../utils/refresh_token";
import './css.css'


class ResetPassword extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: true,
      oldPassword: undefined,
      newPassword: undefined,
      resPassword: undefined,
      isLoad: false,
      message: "",
      wrongChangePass: false
    };
  }

  handleClose() {
    this.setState({ show: false });
    this.props.hideChangePassword(false);
  }

  getValue = obj => {
    this.setState({ [obj.name]: md5(obj.value) });
  };

  changePassword = async () => {
    if(this.state.newPassword === undefined || this.state.oldPassword === undefined || this.state.resPassword === undefined){
      this.setState({ wrongChangePass: true,
        message:'Vui lòng nhập đủ các thông tin!'});
    }
    else if (this.state.newPassword !== this.state.resPassword) {
      this.setState({ wrongChangePass: true,
       message:'Xác nhận mật khẩu không trùng khớp!'});
    } else {
      await refreshToken();
      this.setState({
        isLoad: true,
        message: ''
      })
      var secret = JSON.parse(localStorage.getItem("secret"));
      const decode = jwt_decode(secret.access_token);
      var username = decode.user.userEntity.username;

      axios.defaults.headers["x-access-token"] = secret.access_token;
      axios
        .post(`/student/change-password`, {
          username: username,
          oldPassword: this.state.oldPassword,
          newPassword: this.state.newPassword
        })
        .then(res => {
          if (res.data.rs === 'success') {
            window.alert('Đổi mật khẩu thành công');
            this.props.hideChangePassword(false);
          
            this.setState({
              isLoad: false
            });
            
          } else {
            this.setState({ wrongChangePass: true,
              message:'Mật khẩu không chính xác!'});
          }
          this.setState({
            isLoad: false
          })
        })
        .catch(err => {
         
        })
      
    }
  };

  render() {
    return (
      <React.Fragment>
        <div
          onKeyPress={e => {
            if (e.key === "Enter") this.changePassword();
          }}
        >
          <Modal
            show={this.state.show}
            onHide={this.handleClose}
            dialogClassName="title-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title bsPrefix="title-center">Đổi mật khẩu</Modal.Title>
            </Modal.Header>
            <Container>
              <Modal.Body style={{ textAlign: "center" }}>
                <Input
                  name="oldPassword"
                  placeholder="Nhập mật khẩu  cũ ..."
                  type="password"
                  getValue={this.getValue}
                />
                <Input
                  name="newPassword"
                  placeholder="Nhập mật khẩu mới ..."
                  type="password"
                  getValue={this.getValue}
                />

                <Input
                  name="resPassword"
                  placeholder="Nhập mật khẩu mới ..."
                  type="password"
                  getValue={this.getValue}
                />
                {this.state.isLoad && (
                  <Loader
                    type="ThreeDots"
                    color=" #293846"
                    height={50}
                    width={50}
                  />
                )}
                {this.state.wrongChangePass && (
                  <p style={{ color: "red" }}>{this.state.message}</p>
                )}
              
                <Button
                  onClick={this.changePassword}
                  variant="primary"
                  className="btn-hover"
                >
                  Đổi mật khẩu
                </Button>
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
)(ResetPassword);
