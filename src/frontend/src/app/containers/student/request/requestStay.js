import React from "react";
import { Form, Modal, Button } from "react-bootstrap";
import Axios from "axios";
import { connect } from "react-redux";
import refreshToken from "./../../../../utils/refresh_token";
import jwt_decode from "jwt-decode"

class RequestStay extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false,
      point: undefined,
      type: undefined,
      content: undefined
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  getPoint = async () =>{
    await refreshToken();
    var secret = localStorage.getItem("secret");
    var now = new Date();
    if (secret) {
      const decode = jwt_decode(secret);
      secret = JSON.parse(secret);
      if(decode.user.profile){
        var id = decode.user.profile._id;
        Axios.post('/student/get-point',{id: id, ngayVaoO: decode.user.profile.ngayVaoO}).then(rs =>{
          var point = [];
          rs.data.data.forEach(item=>{
              if(now.getFullYear() - 1 === item.year)
              point.push({term: item.year, point: item.point});
          })

          this.setState({point: point})
        });
      }
    }
}


getValue = (obj) => {
    
    //console.log(obj.target.value)
      this.setState({ [obj.target.name]: obj.target.value });
  };

componentDidMount(){
    this.getPoint();
}

request = () => {
    //TODO: gửi yêu cầu lên db
    console.log(this.state);
}
  render() {
     
    return (
      <>
      
      <div className="title-header ">
          <span>ĐĂNG KÝ LƯU TRÚ</span>
        </div>
        <div className="title-header-line" />
        {/* TODO: Kiểm tra nếu đủ điểm sẽ hiện Đăng ký  */}
        <Button variant="primary" onClick={this.handleShow}>
          Đăng ký
        </Button>

        <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Đăng ký lưu trú</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Sinh viên thuộc diện</Form.Label>
                <Form.Control onChange = {this.getValue} name = 'type' />
              </Form.Group>
            </Form>
            <Form>
              <Form.Group>
                <Form.Label>Trình bày hoàn cảnh gia đình hiện nay</Form.Label>
                <Form.Control onChange = {this.getValue} as="textarea" rows="4" name = 'content'/>
              </Form.Group>
            </Form>
            <div>
                <span style={{color: '#007bff'}}>Không bắt buộc, có thể bỏ qua</span>
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
    );
  }
}

var mapStateToProps = state => {
  return {
    userProfile: state.userProfile
  };
};

export default connect(mapStateToProps)(RequestStay);
