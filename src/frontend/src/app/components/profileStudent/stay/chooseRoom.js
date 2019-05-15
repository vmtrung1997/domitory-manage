import React from "react";
import { Modal, Button, Tab, Tabs, Card, Table } from "react-bootstrap";
import Axios from "axios";
import jwt_decode from 'jwt-decode'
import "./chooseRoom.css";
import { connect } from "react-redux";
import refreshToken from "./../../../../utils/refresh_token";

class ConfirmModal extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false,
      data: undefined
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  componentDidMount() {
    this.setState({
      data: this.props.data
    });
  }

  conFirm = async () =>{
    //update Phòng
    console.log(this.props.data)
    await refreshToken();

    var secret = localStorage.getItem("secret");
    if(secret){
    secret = JSON.parse(secret);
    Axios.defaults.headers["x-access-token"] = secret.access_token;
      Axios.post('/student/update-room',{id: this.props.id, idPhong: this.props.data._id}).then(rs=>{
        if(rs.status === 202){
          this.props.hideModal();
          this.handleClose();
          window.alert("Bạn đã chọn phòng thành công!")
        }
        else{
          window.alert("Có lỗi xảy ra. Vui lòng thử lại!")
          this.handleClose();
        }
      })
    }
  }

  render() {
  
    return (
      <>
        <Button variant="primary" onClick={this.handleShow}>
          Chọn
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận phòng đã chọn</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Bạn chắc chắn muốn chọn phòng {this.props.data.tenPhong} này?</div>
            <div style={{ marginTop: "10px" }}>
              Lưu ý: Không thể thay đổi phòng sau khi chọn, nếu muốn thay đổi
              vui lòng liên hệ BQL
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Đóng
            </Button>
            <Button variant="primary"  onClick={this.conFirm}>
              Chọn
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

class ListRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: this.props.data,
      listRoom: [],
      selectedRoom: {
        soNguoi: undefined,
        soNguoiToiDa: undefined,
        tenPhong: undefined,
        listProfile: [],
        ten: undefined
      }
    };
  }

  selectedRoom = async room => {
    var selectedRoom;
    this.props.room(room);
    await Axios.post("/student/get-profile-by-idPhong", {
      id: room._id
    }).then(rs => {
      if (rs.status === 200 || rs.status === 204) {
        
        selectedRoom = {
          soNguoi: room.soNguoi,
          soNguoiToiDa: room.soNguoiToiDa,
          tenPhong: room.tenPhong,
          listProfile: rs.data.data === undefined?[]:rs.data.data,
          ten: room.loaiPhong.ten
        };
        console.log(selectedRoom);
      }
    });

    this.setState({
      selectedRoom: selectedRoom
    });
  };

  componentDidMount = async () => {
    Axios.post("/student/get-room", {
      room: this.state.room
    }).then(rs => {
      if (rs.status === 200) {
        this.setState({ listRoom: rs.data.data });
      }
    });
  };
  render() {
    return (
      <React.Fragment>
        {this.state.listRoom.map(item => {
          if (item.loaiPhong !== null) {
            return (
              <Button
                onClick={e => this.selectedRoom(item)}
                className={
                  item.loaiPhong.loai === 0
                    ? "choose-room normal-room"
                    : "choose-room vip-room"
                }
              >
                {item.tenPhong}
              </Button>
            );
          }
        })}

        {this.state.selectedRoom.ten === undefined ? (
          <Card body>
            {" "}
            <Card.Text>Chọn phòng để xem thông tin!</Card.Text>
          </Card>
        ) : (
          <Card body>
            <Card.Title>
              Thông tin phòng: {this.state.selectedRoom.tenPhong} (
              {this.state.selectedRoom.ten})
            </Card.Title>
            <Card.Text>
              Số người: {this.state.selectedRoom.soNguoi}/
              {this.state.selectedRoom.soNguoiToiDa}
            </Card.Text>
            <Table size="sm" striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>MSSV</th>
                  <th>Họ Tên</th>
                </tr>
              </thead>
              <tbody>
                {this.state.selectedRoom.listProfile.map((item, index) => {
                  return (
                    <tr>
                      <td>{index}</td>
                      <td>{item.MSSV}</td>
                      <td>{item.hoTen}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        )}
      </React.Fragment>
    );
  }
}

class ChooseRoom extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false,
      room: undefined
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  getRoom = data => {
    this.setState({
      room: data
    });
  };

  hindModal = () =>{
    this.handleClose();
    this.props.isLoad();
  }

  render() {
    console.log(this.props.state)
    return (
      <>
        <span onClick={this.handleShow}style = {{color: '#29b6b4',cursor: 'pointer'}}>(Thay đổi)</span>


        <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Chọn phòng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {" "}
            <Tabs id="controlled-tab-example" defaultActiveKey="floor1">
              <Tab eventKey="floor1" title="Lầu 1">
                <ListRoom data="1" room={this.getRoom} />
              </Tab>
              <Tab eventKey="floor2" title="Lầu 2">
                <ListRoom data="2" room={this.getRoom} />
              </Tab>
              <Tab eventKey="floor3" title="Lầu 3">
                <ListRoom data="3" room={this.getRoom} />
              </Tab>
              <Tab eventKey="floor4" title="Lầu 4">
                <ListRoom data="4" room={this.getRoom} />
              </Tab>
              <Tab eventKey="floor5" title="Lầu 5">
                <ListRoom data="5" room={this.getRoom} />
              </Tab>
              <Tab eventKey="floor6" title="Lầu 6">
                <ListRoom data="6" room={this.getRoom} />
              </Tab>
              <Tab eventKey="floor7" title="Lầu 7">
                <ListRoom data="7" room={this.getRoom} />
              </Tab>
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Đóng
            </Button>
            {this.state.room && <ConfirmModal hideModal = {this.hindModal} id = {this.props.userProfile._id} data={this.state.room} />}
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
export default connect(
  mapStateToProps
)(ChooseRoom);
