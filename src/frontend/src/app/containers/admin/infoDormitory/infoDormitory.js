import React from 'react';
import './infoDormitory.css';
import Title from "../../../components/title/title";
import Button from "../../../components/button/button";
import {Col, Modal, Row, Tab, Table, Tabs} from 'react-bootstrap';
import refreshToken from './../../../../utils/refresh_token'
import axios from "axios";
import Input from "../../../components/input/input";
import Select from "../../../components/selectOption/select"
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from "react-toasts";
import RoomType from './roomType'
import {Link} from 'react-router-dom'
import {get_floor_room} from "../infoStudent/infoStudentActions";

const PHONG_SV = 0;
const PHONG_DVU = 1;
const PHONG_CNANG = 2;

class InfoDormitory extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      floorActive: 0,
      roomActive: {
        tenPhongMoi: '',
        loaiPhong: '',
        gioiTinh: 0
      },
      roomAdd: {
        roomTypeAdd: '',
        limitPersonAdd: 0,
        electicalNumAdd: 0,
        waterNumAdd: 0,
        genderAdd: 0,
      },
      genderOptions: [{value: 0, label: 'Nữ'}, {value: 1, label: 'Nam'}],
      roomTypeOptions: [],

      infoFloor: [],
      roomList: [],

      showRoomPopup: false,
      showAddFloorPopup: false,
      showAddRoomPopup: false,

      limitPersonDetail: null,
      roomNameDetail: '',
      statusDetail: 0,
      descriptionDetail: '',
      idActive: ''
    }
  }

  componentDidMount() {
    this.getData();

  }

  getData = async() => {
    this.getInfoFloor();
    this.getRoomOptions();
    this.getInfoManageDormitory();
  };

  getInfoFloor = () => {
    get_floor_room()
      .then(result => {
        this.setState({
          infoFloor: result.data,
          floorActive: result.data[0].floor.name,
          roomList: result.data[0].rooms
        })
      })
      .catch(err => {

      })
  };

  getRoomOptions = async() => {
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/infoDormitory/getRoomType`, { headers: { 'x-access-token': secret.access_token } }
    ).then(result => {
    
      const roomOptions = result.data.map(item => ({value: item._id, label: item.ten}));
      this.setState({
        roomTypeOptions: roomOptions,
        roomAdd: {
          ...this.state.roomAdd,
          roomTypeAdd: roomOptions[0].value,
        }
      })
    }).catch(err => {
     
    })
  };

  getInfoManageDormitory = async() => {
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/infoDormitory/getInfoManageDormitory`, { headers: { 'x-access-token': secret.access_token } }
    ).then(result => {
      this.setState({
        infoDormitory: result.data
      });
    }).catch(err => {

    })
  };

  handleSelectFloor = async(index) => {
    await this.setState({
      floorActive: this.state.infoFloor[index].floor.name,
      roomList: this.state.infoFloor[index].rooms
    });
  };

  handleShowPopup = (type) => {
    switch(type){
      case 'room':
        this.setState({ showRoomPopup: true });
        break;
      case 'addFloor':
        this.setState({ showAddFloorPopup: true });
        break;
      case 'addRoom':
        this.setState({ showAddRoomPopup: true });
        break;
      default:
        break
    }
  };

  handleClosePopup = (type) => {
    switch(type){
      case 'room':
        this.setState({ showRoomPopup: false, listPerson: undefined, messRoomDetail: undefined });
        break;
      case 'addFloor':
        this.setState({ showAddFloorPopup: false });
        break;
      case 'addRoom':
        this.setState({
          showAddRoomPopup: false,
          roomAdd: {
            ...this.state.roomAdd,
            floorNameAdd: undefined,
            roomNameAdd: undefined,
            roomTypeAdd: this.state.roomTypeOptions[0].value,
            genderAdd: this.state.genderOptions[0].value,
            limitPersonAdd: 0,
            electicalNumAdd: 0,
            waterNumAdd: 0,
          }
        });
        break;
      default:
        break
    }
  };

  onChange = (event) => {
    this.setState({
      roomAdd: {
        ...this.state.roomAdd,
        [event.name]: event.value
      }
    })
  };

  onChangeDetailRoom = (event) => {
    this.setState({
      roomActive: {
        ...this.state.roomActive,
        [event.name]: event.value
      }
    })
  };

  roomTypeUpdateSelected = value => {
    this.setState({ roomActive: {...this.state.roomActive, loaiPhong: { _id: value}} })
  };

  genderUpdateSelected = value => {
    this.setState({ roomActive: {...this.state.roomActive, gioiTinh: value} })
  };

  roomTypeAddSelected = value => {
    this.setState({
      roomAdd: {
        ...this.state.roomAdd,
        roomTypeAdd: value
      }
    });
  };

  genderAddSelected = value => {
    this.setState({
      roomAdd: {
        ...this.state.roomAdd,
        genderAdd: value
      }
    })
  };

  handleSubmitAddRoom = async() => {
    const {
      roomAdd: {
        roomNameAdd,
        limitPersonAdd,
        descriptionAdd,
        floorNameAdd,
        roomTypeAdd,
        electicalNumAdd,
        waterNumAdd,
        genderAdd
      }} = this.state;
    if(parseInt(floorNameAdd) < 0){
      this.setState({
        messErrAddRoom: 'Tên lầu vui lòng không có số âm'
      });
      return;
    }

    if(!roomNameAdd || !floorNameAdd){
      this.setState({
        messErrAddRoom: 'Vui lòng nhập đầy đủ thông tin'
      });
      return;
    }
    const params = {
      tenPhong: roomNameAdd,
      soNguoiToiDa: parseInt(limitPersonAdd),
      moTa: descriptionAdd,
      lau: parseInt(floorNameAdd),
      loaiPhong: roomTypeAdd,
      gioiTinh: genderAdd,
      soDien: parseInt(electicalNumAdd),
      soNuoc: parseInt(waterNumAdd),
    };
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.post(`/manager/infoDormitory/addRoom`, params,{ headers: { 'x-access-token': secret.access_token } }
    ).then(async() => {
      ToastsStore.success("Thêm phòng thành công!");
      this.handleClosePopup('addRoom');

      await this.getInfoFloor();
      this.setState({
        floorActive: parseInt(floorNameAdd)
      })
    }).catch(err => {
      ToastsStore.error( err.response.data.msg);
    })
  };

  handleShowDetail = async(room) => {
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/infoDormitory/getPersonInRoom/` + room._id
      ,{  headers: { 'x-access-token': secret.access_token } }
    ).then(result => {
      this.setState({
        listPerson: result.data.length === 0 ? undefined : result.data
      });
      if(result.data.length === 0)
        this.setState({
          messRoomDetail: 'Phòng trống'
        })
    }).catch(err => {});
    this.setState({
      roomActive: {
        ...room,
        tenPhongMoi: room.tenPhong
      },
    });
    this.handleShowPopup('room');
  };

  handleDeleteRoom = async(id) => {
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/infoDormitory/delRoom/` + id
        ,{ headers: { 'x-access-token': secret.access_token } }
    ).then(() => {
      ToastsStore.success("Xóa phòng thành công!");
      this.getData();
      this.handleClosePopup('room');
    }).catch(err => {
      ToastsStore.error(err.response.data.msg);
    })
  };

  handleSubmitUpdateStudent = async() => {
    const { roomActive: { _id, tenPhongMoi, soNguoiToiDa, moTa, loaiPhong, gioiTinh} } = this.state;
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.post(`/manager/infoDormitory/updateRoom/`
      ,{
        id: _id,
        tenPhong: tenPhongMoi ? tenPhongMoi : undefined,
        soNguoiToiDa: parseInt(soNguoiToiDa),
        moTa: moTa,
        loaiPhong: loaiPhong,
        gioiTinh: gioiTinh,
      },{ headers: { 'x-access-token': secret.access_token } }
    ).then(result => {
      ToastsStore.success(result.data.msg);
      this.setState({
        limitPersonUpdate: null,
        moTa: null
      });
      this.handleClosePopup('room');
      this.getData();
    }).catch(err => {
      ToastsStore.error(err.response.data.msg);
    })

  };

  renderRoom = (roomList, color) => {
    return roomList && roomList.map((room, index) => {
      if (room.loaiPhong) {
        if (room.loaiPhong.loai === 0 || room.loaiPhong.loai === 1) {
          return (
            <div className={'id-room_item'} key={index}>
              <Button
                shadow
                variant={(room.soNguoiToiDa - room.soNguoi) ? 'outline' : 'default'}
                color={color}
                onClick={() => this.handleShowDetail(room)}
                style={{fontSize: '20px'}}
              >
                {room.gioiTinh === 0 ? <i style={{fontSize: '25px'}} className="fas fa-female"/> :
                  <i style={{fontSize: '25px'}} className="fas fa-male"/>}
                {room.tenPhong} ({room.soNguoi}/{room.soNguoiToiDa})
              </Button>
            </div>
          )
        } else {
          return (
            <div className={'id-room_item'} key={index}>
              <Button
                shadow
                variant={(room.soNguoiToiDa - room.soNguoi) ? 'outline' : 'default'}
                color={color}
                onClick={() => this.handleShowDetail(room)}
                style={{fontSize: '20px'}}
              >
                <i className="fas fa-home"/>
                {room.tenPhong} ({room.soNguoi}/{room.soNguoiToiDa})
              </Button>
            </div>
          )
        }
      }
    })
  };

  MyTab = ( eventKey, title , roomList, color) =>{
    return(
      <Tab eventKey={eventKey} title={title}>
        <div className={'id-room'}>
          <div>
            {
              this.renderRoom(roomList, color)
            }
          </div>
        </div>
      </Tab>
    )
  };

  render(){
    const {
      floorActive,
      roomList,
      showRoomPopup,
      showAddRoomPopup,
      roomTypeOptions,
      roomActive,
      infoDormitory,
      infoFloor
    } = this.state;

    return(
      <div>
        <Title>
          Thông tin ký túc xá
        </Title>
        <div className={'content-body'}>

          {/*RoomDetail*/}
          <Modal show={showRoomPopup} onHide={() =>this.handleClosePopup('room')}>
            <Modal.Header closeButton>
              <Modal.Title>Phòng {this.state.roomActive.tenPhong}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={4}>
                  Tên phòng:
                </Col>
                <Col md={8}>
                  <Input
                    getValue={this.onChangeDetailRoom}
                    name={'tenPhongMoi'}
                    value={roomActive.tenPhongMoi}
                   />
                </Col>

                <Col md={4}>
                  Số người tối đa:
                </Col>
                <Col md={8}>
                  <Input
                    getValue={this.onChangeDetailRoom}
                    name={'soNguoiToiDa'}
                    value={roomActive.soNguoiToiDa}
                    type={'number'}/>
                </Col>

                <Col md={4}>
                  Loại Phòng:
                </Col>
                <Col md={8}>
                  <Select
                    value={this.state.roomActive.loaiPhong._id}
                    options={roomTypeOptions}
                    selected={this.roomTypeUpdateSelected}
                  />
                </Col>

                <Col md={4}>
                  Giới tính:
                </Col>
                <Col md={8}>
                  <Select
                    value={this.state.roomActive.gioiTinh}
                    options={this.state.genderOptions}
                    selected={this.genderUpdateSelected}
                  />
                </Col>

                <Col md={4}>
                  Mô tả:
                </Col>
                <Col md={8}>
                  <Input
                    getValue={this.onChangeDetailRoom}
                    name={'moTa'}
                    value={this.state.roomActive.moTa} />
                </Col>

              </Row>
              <div>
                {this.state.listPerson ?
                <Table responsive bordered size="sm">
                  <thead>
                  <tr style={{textAlign: 'center'}}>
                    <th>STT</th>
                    <th>MSSV</th>
                    <th>Họ tên</th>
                    <th>Trường</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.state.listPerson && this.state.listPerson.map((person, index) => {
                    return(
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{person.MSSV}</td>
                        <td><Link to={`/admin/student/detail/${person.MSSV}`}>{person.hoTen}</Link></td>
                        <td>{person.truong && person.truong.tenTruong}</td>
                      </tr>
                    )
                  })}

                  </tbody>
                </Table>
                  :
                  <span className={'messDanger'}><b>{this.state.messRoomDetail}</b></span>
                }
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                color={"danger"}
                onClick={() =>this.handleDeleteRoom(roomActive._id)}
              >
                Xóa
              </Button>
              <Button variant="outline" onClick={() =>this.handleClosePopup('room')}>
                Đóng
              </Button>
              <Button  onClick={() =>this.handleSubmitUpdateStudent()}>
                Lưu thay đổi
              </Button>
            </Modal.Footer>
          </Modal>

          {/*add floor popup*/}
          <Modal show={showAddRoomPopup} onHide={() =>this.handleClosePopup('addRoom')}>
            <Modal.Header closeButton>
              <Modal.Title>Thêm phòng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={4}>
                  Lầu<span style={{color:'red'}}>*</span>:
                </Col>
                <Col md={8}>
                  <Input getValue={this.onChange} name={'floorNameAdd'} type={'number'} min={0}/>
                </Col>
                <Col md={4}>
                  Tên phòng<span style={{color:'red'}}>*</span>:
                </Col>
                <Col md={8}>
                  <Input getValue={this.onChange} name={'roomNameAdd'} />
                </Col>

                <Col md={4}>
                  Số người tối đa<span style={{color:'red'}}>*</span>:
                </Col>
                <Col md={8}>
                  <Input getValue={this.onChange} name={'limitPersonAdd'} type={'number'} placeholder={'0'} />
                </Col>

                <Col md={4}>
                  Loại phòng<span style={{color:'red'}}>*</span>:
                </Col>
                <Col md={8}>
                  <Select
                    options={roomTypeOptions}
                    selected={this.roomTypeAddSelected}
                    value={this.state.roomAdd.roomTypeAdd}
                  />
                </Col>

                <Col md={4}>
                  Giới tính<span style={{color:'red'}}>*</span>:
                </Col>
                <Col md={8}>
                  <Select
                    options={this.state.genderOptions}
                    selected={this.genderAddSelected}
                    value={this.state.roomAdd.genderAdd}
                  />
                </Col>

                <Col md={4}>
                  Số điện hiện tại<span style={{color:'red'}}>*</span>:
                </Col>
                <Col md={8}>
                  <Input getValue={this.onChange} name={'electicalNumAdd'} type={'number'} placeholder={'0'}/>
                </Col>

                <Col md={4}>
                  Số nước hiện tại<span style={{color:'red'}}>*</span>:
                </Col>
                <Col md={8}>
                  <Input getValue={this.onChange} name={'waterNumAdd'} type={'number'} placeholder={'0'}/>
                </Col>

                <Col md={4}>
                  Mô tả:
                </Col>
                <Col md={8}>
                  <Input getValue={this.onChange} name={'descriptionAdd'} />
                </Col>
              </Row>
              <Row style={{margin: 0}}>
                <span className={'messDanger'} >{this.state.messErrAddRoom}</span>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" onClick={() =>this.handleClosePopup('room')}>
                Hủy bỏ
              </Button>
              <Button  onClick={async() =>{
                this.handleSubmitAddRoom()
              }}>
                Thêm
              </Button>
            </Modal.Footer>
          </Modal>
          {/*end add floor popup*/}
          <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>

          <div className={'id-content'}>
            <Row>
              <Col md={2}>
                <div className={'id-floor'}>

                  {infoFloor && infoFloor.map((item, i) => {
                    return(
                      <div className={'id-floor_item'} key={i}>
                        <Button
                          color={'success'}
                          variant={'outline'}
                          diminsion
                          actived={(floorActive === item.floor.name)}
                          onClick={()=>this.handleSelectFloor(i)}
                          style={{fontSize: '20px'}}
                        >
                          Lầu {item.floor.name}
                          <span className={'block warning-color'}>{item.floor.personStaying}/{item.floor.capacity}</span>
                        </Button>
                      </div>
                    )
                  })}
                </div>

              </Col>
              <Col md={10}>
                <Row style={{padding: '15px', display: 'flex', justifyContent: 'space-between'}}>
                  <div className={'flex'}>
                    <div className={'note-room-color-item flex-middle'}>
                      <span className={'note-room-color bg-success-color'}/>
                      <span>Phòng sinh viên</span>
                    </div>
                    <div className={'note-room-color-item flex-middle'}>
                      <span className={'note-room-color bg-primary-color'}/>
                      <span>Phòng dịch vụ</span>
                    </div>
                    <div className={'note-room-color-item flex-middle'}>
                      <span className={'note-room-color bg-warning-color'}/>
                      <span>Phòng chức năng</span>
                    </div>
                  </div>
                  <div className={'people-in-dormitory bold'}>
                    Số người:
                    <span className={'danger-color'}>{infoDormitory && infoDormitory.peopleStaying}</span>
                    /
                    <span className={'success-color'}>{infoDormitory && infoDormitory.capacity}</span>
                  </div>
                </Row>
                <Tabs defaultActiveKey="all" id="uncontrolled-tab-example">
                  <Tab eventKey="all" title="Tất cả">
                    <div className={'id-room'}>
                      <div>
                        {
                          this.renderRoom(roomList.filter(room => room.loaiPhong && room.loaiPhong.loai === PHONG_SV), 'success')
                        }
                      </div>
                      <div>
                        {
                          this.renderRoom(roomList.filter(room => room.loaiPhong && room.loaiPhong.loai === PHONG_DVU), 'primary')
                        }
                      </div>
                      <div>
                        {
                          this.renderRoom(roomList.filter(room => (room.loaiPhong && room.loaiPhong.loai === PHONG_CNANG)), 'warning')
                        }
                      </div>
                    </div>
                  </Tab>
                  {this.MyTab("studentRoom", "Phòng sinh viên",
                    roomList.filter(room => room.loaiPhong && room.loaiPhong.loai === PHONG_SV),
                    'success')
                  }
                  {this.MyTab("proRoom", "Phòng dịch vụ",
                    roomList.filter(room => room.loaiPhong && room.loaiPhong.loai === PHONG_DVU),
                    'primary')
                  }
                  {this.MyTab("functionRoom", "Phòng chức năng",
                    roomList.filter(room => (room.loaiPhong && room.loaiPhong.loai === PHONG_CNANG)),
                    'warning')
                  }
                </Tabs>

              </Col>
            </Row>

            <Row style={{justifyContent: 'center'}}>
              <div className={'id-add'}>
                <Button
                  shadow
                  color={'danger'}
                  onClick={() => this.handleShowPopup('addRoom')}
                >
                  <i className="fas fa-plus"/> Thêm phòng
                </Button>
              </div>
              <div className={'id-add'}>
                <RoomType
                  onSave={()=>{this.getRoomOptions()}}
                />
              </div>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}

export default InfoDormitory