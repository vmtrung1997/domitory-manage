import React from "react";
import { Form, Modal, Button } from "react-bootstrap";
import Axios from "axios";
import { connect } from "react-redux";
import refreshToken from "./../../../../utils/refresh_token";
import jwt_decode from "jwt-decode";
import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore
} from "react-toasts";

class RequestStay extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false,
      point: undefined,
      type: undefined,
      content: undefined,
      stateRequest: 0, //0: Hiện bàng gửi request, 1: Đã gửi request và chưa đưuọc chấp nhận, 2: Đã gửi request và được chấp nhận
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  getPoint = async () => {
    await refreshToken();
    var secret = localStorage.getItem("secret");
    var now = new Date();
    if (secret) {
      const decode = jwt_decode(secret);
      secret = JSON.parse(secret);
      if (decode.user.profile) {
        var id = decode.user.profile._id;
        Axios.post("/student/get-point", {
          id: id,
          ngayVaoO: decode.user.profile.ngayVaoO
        }).then(rs => {
          var point = [];
          if(rs){
          rs.data.data.forEach(item => {
            if (now.getFullYear() - 1 === item.year)
              point.push({ term: item.year, point: item.point });
          });
        }
          this.setState({ point: point });
        });

      }
    }
  };

  getValue = obj => {
    //console.log(obj.target.value)
    this.setState({ [obj.target.name]: obj.target.value });
  };

  checkRequest = async () =>{
    await refreshToken();
    var secret = localStorage.getItem("secret");
    var now = new Date();
    if (secret) {
      const decode = jwt_decode(secret);
      secret = JSON.parse(secret);
      if (decode.user.profile) {
        var id = decode.user.profile._id;
        Axios.post("/student/check-request",{id:id}).then(rs =>{
      if(rs.status === 200 ){
        console.log(decode.user.profile.isActive,rs.data.data[0].isAc);
        if(rs.data.data[0].isAc === true && rs.data.data[0].idProfile.isActive === true){
          console.log('ac = true');
          this.setState({
            stateRequest: 0
          })
        }
        else if(rs.data.data[0].isAc === false && rs.data.data[0].idProfile.isActive=== true){
          console.log('ac = false');
          this.setState({
            stateRequest: 1
          })
        }
        else if(rs.data.data[0].isAc === false && rs.data.data[0].idProfile.isActive === false){
          console.log('ac = false');
          this.setState({
            stateRequest: 1
          })
        }
        else if(rs.data.data[0].isAc === true && rs.data.data[0].idProfile.isActive === false){
          this.setState({
            stateRequest: 2
          })
        }
      }
      else if(rs.status === 500){
        window.alert('Server hiện đang lỗi. Thử lại sau ')
      }
      else if(rs.status === 204){
        this.setState({
          stateRequest: 0
        })
      }
    })
  }
}
  }

  componentDidMount = async  ()  => {
    //this.getPoint();
    this.checkRequest();
  }

  request = () => {
    var secret = localStorage.getItem("secret");
    var now = new Date();
    const decode = jwt_decode(secret);
    var id = decode.user.profile._id;
    var data = {
      idProfile: id,
      des: this.state.type,
      type: this.state.content,
      date: now
    }
    //TODO: gửi yêu cầu lên db
    this.setState({
      type: "",
      content: ""
  })
    Axios.post("/student/request-stay", {
      data: data
    }).then(rs => {
      if(rs.status===201){
        ToastsStore.success("Đăng ký thành công");
        
      }
      else{
        ToastsStore.error("Đăng ký không thành công");
      }
      this.checkRequest();
      //this.setState({ point: point });
    });
  };
  render() {
    console.log(this.state.stateRequest)
    var formRequest
    if(this.state.stateRequest === 0){
      formRequest = (
      <div>
      <Form.Label>Sinh viên thuộc diện</Form.Label>
      <Form.Control onChange={this.getValue} name="type" />

      <Form.Label>Trình bày hoàn cảnh gia đình hiện nay</Form.Label>
      <Form.Control
        onChange={this.getValue}
        as="textarea"
        rows="4"
        name="content"
      />
      <div>
            <span style={{ color: "#007bff" }}>
              Không bắt buộc, có thể bỏ qua
            </span>
          </div>
      <div>
        <Button variant="primary" onClick={this.request}>
          Đăng ký
        </Button>
      </div>
      </div>)
    }
      else if(this.state.stateRequest === 1){
        formRequest = (
        <div>
          <p>Bạn đã gửi yêu cầu đăng ký lưu trú.</p>
        <p> Kết quả sẽ được thông báo tới bạn sau khi KTX đã xét duyệt yêu cầu</p>
        </div>
        )
      }
      else if(this.state.stateRequest === 2){
        formRequest = (
        <div>Yêu cầu của bạn đã được xét duyệt, vui lòng liên hệ ban quản lý KTX để đóng tiền và hoàn tất việc gia hạn</div>
        )
      }

    return (
      <div className = 'padding-menu'>
      <>
        <ToastsContainer
          position={ToastsContainerPosition.BOTTOM_CENTER}
          lightBackground
          store={ToastsStore}
        />
       <div >
          <h1 className="title-header" >ĐĂNG KÝ LƯU TRÚ</h1>
        </div>
        <div className="title-header-line" />
        {formRequest}
        {/* TODO: Kiểm tra nếu đủ điểm sẽ hiện Đăng ký  */}
        <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Đăng ký lưu trú</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Sinh viên thuộc diện</Form.Label>
                <Form.Control value={this.state.type} onChange={this.getValue} name="type" />
              </Form.Group>
            </Form>
            <Form>
              <Form.Group>
                <Form.Label>Trình bày hoàn cảnh gia đình hiện nay</Form.Label>
                <Form.Control
                  onChange={this.getValue}
                  as="textarea"
                  rows="4"
                  name="content"
                  value={this.state.content} 
                />
              </Form.Group>
            </Form>
            <div>
              <span style={{ color: "#007bff" }}>
                Không bắt buộc, có thể bỏ qua
              </span>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Đóng
            </Button>
            <Button variant="primary" onClick={this.request}>
              Xác nhận
            </Button>
          </Modal.Footer>
        </Modal>
      </>
      </div>
    );
  }
}

var mapStateToProps = state => {
  return {
    
    userProfile: state.userProfile
  };
};

export default connect(mapStateToProps)(RequestStay);
