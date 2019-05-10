import React from "react";
import { Modal, Button, Container } from "react-bootstrap";
import md5 from "md5";
import { connect } from "react-redux";
import Input from "../../../components/input/input";
import jwt_decode from "jwt-decode";
import refreshToken from "./../../../../utils/refresh_token";

import axios from "axios";

import Loader from "react-loader-spinner";

class IdentityVerification extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: true,
      cmnd: undefined,
      mssv: undefined,
      message: "",
      wrongInfo: false,
      isLoad: false
    };
  }

  getValue = obj => {
    this.setState({ [obj.name]: obj.value });
  };
  handleClose() {
    this.setState({ show: false });
    this.props.hideResetPassword(false);
  }
  nextStep = async () => {
    //Check rightness of info
    if (this.state.cmnd === undefined || this.state.mssv === undefined) {
      this.setState({
        wrongInfo: true,
        message: "Vui lòng nhập đủ các thông tin!"
      });
    
    } else {
      await refreshToken();
      this.setState({
        isLoad: true,
        message: ""
      });

      axios
        .post(`/user/reset-password`, {
          cmnd: this.state.cmnd,
          mssv: this.state.mssv
        })
        .then(res => {
          if (res.data.res === "success") {
            this.props.hideResetPassword(false);
            this.props.nextStep(true);
          } else {
            this.setState({
              wrongInfo: true,
              message: "Tài khoản không chính xác!"
            });
          }
          this.setState({
            isLoad: false
          });
        })
        .catch(err => {});
    }
  };
  render() {
    return (
      <React.Fragment>
        <div
          onKeyPress={e => {
            if (e.key === "Enter") this.nextStep();
          }}
        >
          <Modal
            show={this.state.show}
            onHide={this.handleClose}
            dialogClassName="title-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title bsPrefix="title-center">Xác nhận</Modal.Title>
            </Modal.Header>
            <Container>
              <Modal.Body style={{ textAlign: "center" }}>
                <Input
                  name="mssv"
                  placeholder="Nhập MSSV của bạn..."
                  getValue={this.getValue}
                />
                <Input
                  name="cmnd"
                  placeholder="Nhập CMND của bạn..."
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
                {this.state.wrongInfo && (
                  <p style={{ color: "red" }}>{this.state.message}</p>
                )}
                <Button
                  onClick={this.nextStep}
                  variant="primary"
                  className="btn-hover"
                  style={{ marginTop: "20px" }}
                >
                  Tiếp theo
                </Button>
              </Modal.Body>
            </Container>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

class VerifyEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
  }
  handleClose = () =>{
    this.setState({ show: false });
 
  }
  render() {
    return (
      <React.Fragment>
        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          dialogClassName="title-modal"
        >
          <Modal.Header closeButton />
          <Container>
            <Modal.Body style={{ textAlign: "center" }}>
              <div style={{ paddingBottom: "10px" }}>
                <h2>Thành công</h2>
              </div>
              <div>
              <span>
                Mật khẩu mới đã được gửi vào email của bạn. Hãy kiểm tra!
              </span>
              </div>
              <Button
                onClick={this.handleClose}
                variant="primary"
                className="btn-color btn-hover"
                style = {{marginTop:'20px'}}
              >
                Đóng
              </Button>
            </Modal.Body>
          </Container>
        </Modal> 
        
      </React.Fragment>
    );
  }
}

class ForgotPassword extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      success: true,
      showNoti: false
    };
  }

  nextStep = value => {
      this.setState({ success: false, showNoti: true });
  };

  hideResetPassword = value => {
    //this.props.hideResetPassword(value);
  };

  render() {
    return (
      <React.Fragment>
        {this.state.success && 
          <IdentityVerification
            hideResetPassword={this.hideResetPassword}
            nextStep={this.nextStep}
          />
        }
        {!this.state.success && 
          <VerifyEmail />
        }
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
)(ForgotPassword);
