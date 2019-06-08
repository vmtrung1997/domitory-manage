import React from "react";
import { Modal, Tab, Tabs, Card, Table } from "react-bootstrap";
import Axios from "axios"
import "./chooseRoom.css";
import { connect } from "react-redux";
import refreshToken from "./../../../../utils/refresh_token";
import Button from "./../../../components/button/button";
import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore
} from "react-toasts";

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

  conFirm = async () => {
    //update Phòng
    await refreshToken();

    var secret = localStorage.getItem("secret");
    if (secret) {
      secret = JSON.parse(secret);
      Axios.defaults.headers["x-access-token"] = secret.access_token;
      Axios.post("/student/update-room", {
        id: this.props.id,
        idPhong: this.props.data._id
      }).then(rs => {
        if (rs.status === 202) {
          this.props.hideModal();
          this.handleClose();
          ToastsStore.success("Chọn phòng thành công");
        } else {
          ToastsStore.error("Có lỗi xảy ra");
          this.handleClose();
        }
      });
    }
  };

  render() {
    return (
      <>

        <Button variant="default" onClick={this.handleShow}>
          Chọn
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận phòng đã chọn</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              Bạn chắc chắn muốn chọn phòng {this.props.data.tenPhong} này?
            </div>
            <div style={{ marginTop: "10px" }}>
              Lưu ý: Không thể thay đổi phòng sau khi chọn, nếu muốn thay đổi
              vui lòng liên hệ BQL
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="default" onClick={this.handleClose}>
              Đóng
            </Button>
            <Button variant="default" onClick={this.conFirm}>
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
      if (rs.status === 200 ) {
    
        selectedRoom = {
          soNguoi: rs.data.data.length, 
          soNguoiToiDa: room.soNguoiToiDa,
          tenPhong: room.tenPhong,
          listProfile: rs.data.data === undefined ? [] : rs.data.data,
          ten: room.loaiPhong.ten
        };
      }
      else if(rs.status === 204){
        selectedRoom = {
          soNguoi: 0, 
          soNguoiToiDa: room.soNguoiToiDa,
          tenPhong: room.tenPhong,
          listProfile: [],
          ten: room.loaiPhong.ten
        };
      }
    });

    this.setState({
      selectedRoom: selectedRoom
    });
  };

  componentDidMount = async () => {
    var listRoom = [];
    await Axios.post("/student/get-room", {
      room: this.state.room
    }).then(rs => {
      if (rs.status === 200) {
        rs.data.data.forEach(element => {
           Axios.post("/student/get-profile-by-idPhong", {
            id: element._id
          }).then(rs=>{
            listRoom = this.state.listRoom;
            listRoom.push({...element,
            soNguoi: rs.data.data === undefined?0:rs.data.data.length})
            this.setState({
              listRoom: listRoom
            })
          })
        })          

      }
    })

  };
  render() {
    return (
      <React.Fragment>
        <div style={{ margin: "20px" }}>
          {this.state.listRoom.map((item,index) => {
            if (item.loaiPhong) {
        
              return (
                <Button
                key = {index}
                  onClick={e => this.selectedRoom(item)}
                  style={{ margin: "5px" }}
                  color={
                    item.loaiPhong.loai === 0 ? "info" : "primary"
                  }
                  shadow
                  variant={
                    item.soNguoiToiDa - item.soNguoi ===0? "default" : "outline"
                  }

                  disabled = {item.soNguoiToiDa -item.soNguoi ===0 ? true:false}
                  // disabled
                >
                  {item.tenPhong} ({item.soNguoi}/{item.soNguoiToiDa})
                </Button>
              );
            }
            else{
              return ("")
            }
          })}
        </div>
        {this.state.selectedRoom.ten === undefined ? (

            
              <div className="header-card-room">
                
                  <p>Chọn phòng để xem thông tin!</p>
                
                <img
                  style={{ height: "150px", width: "150px" }}
                  src="/images/notdatafound.png"
                  alt = "true"
                />
              </div>
           
        ) : (
          <div>
            <Card.Title>
              Thông tin phòng: {this.state.selectedRoom.tenPhong} (
              {this.state.selectedRoom.ten})
            </Card.Title>
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
                    <tr key = {index}>
                      <td>{index}</td>
                      <td>{item.MSSV}</td>
                      <td>{item.hoTen}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            </div>
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
      room: undefined,
      floor: []
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

  hindModal = () => {
    this.handleClose();
    this.props.isLoad();
  };

  componentDidMount() {
    Axios.get("/student/get-floor").then(rs => {
      if (rs.status === 200) {
        this.setState({ floor: rs.data.data });
      }
    });
  }

  render() {
    return (
      <>
      
        <span
          onClick={this.handleShow}
          style={{ color: "#29b6b4", cursor: "pointer" }}
        >
          (Thay đổi)
        </span>

        <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Chọn phòng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {" "}
            <Tabs id="controlled-tab-example" defaultActiveKey="floor1">
              {this.state.floor.map((item,index) => {
                var evt = "floor" + item;
                var tit = "Lầu " + item;
                return (
                  <Tab eventKey={evt} key = {index} title={tit}>
                    <ListRoom data={item} room={this.getRoom} />
                  </Tab>
                );
              })}
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button  onClick={this.handleClose}>
              Đóng
            </Button>
            <ToastsContainer
                  position={ToastsContainerPosition.BOTTOM_CENTER}
                  lightBackground
                  store={ToastsStore}></ToastsContainer>
            {this.state.room && (
              <ConfirmModal
                hideModal={this.hindModal}
                id={this.props.userProfile._id}
                data={this.state.room}
              />
            )}
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
export default connect(mapStateToProps)(ChooseRoom);
