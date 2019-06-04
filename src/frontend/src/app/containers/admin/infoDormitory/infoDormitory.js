import React from 'react';
import './infoDormitory.css';
import Title from "../../../components/title/title";
import Button from "../../../components/button/button";
import {Col, Modal, Row, Tabs, Tab, Table} from 'react-bootstrap';
import refreshToken from './../../../../utils/refresh_token'
import axios from "axios";
import Input from "../../../components/input/input";
import Select from "../../../components/selectOption/select"
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from "react-toasts";
import RoomType from './roomType'
import { Link } from 'react-router-dom'
const PHONG_SV = 0;
const PHONG_DVU = 1;

class InfoDormitory extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      floorActive: 0,
      roomActive: {
        soNguoiToiDa: 0,
        moTa: '',
        loaiPhong: ''
      },
      roomTypeAdd: '5ccbef2fe7179a596b1a4ba3',
      limitPersonAdd: 0,
      electicalNumAdd: 0,
      waterNumAdd: 0,
      roomTypeOptions: [],
      statusAddRoom: 0,

      floorList: [],
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
    this.getFloor()
      .then(() => {
      this.getRoom();
    }).catch(() =>{
    })

    this.getRoomOptions();
  }

  getFloor = () => {
    return new Promise(async(resolve) => {
      await refreshToken();
      let secret = JSON.parse(localStorage.getItem('secret'));

      axios.get(`/manager/getElement/floor`,  {
        headers: { 'x-access-token': secret.access_token }
      }).then(result => {
        let i = 0;
        let floorList = result.data.sort();
        floorList = floorList.map(floor => {
          return {key: i++, label: floor}
        });
        this.setState({
          floorList: floorList,
          floorActive: floorList[0].label
        })
        resolve()
      }).catch(err => {

      });
    })

  };

  getRoom = async() => {
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/infoDormitory/getRoom/` + this.state.floorActive, { headers: { 'x-access-token': secret.access_token } }
    ).then(result => {
      this.setState({
        roomList: result.data
      })
    }).catch((err) => {
    })
  };

  getRoomOptions = async() => {
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/infoDormitory/getRoomType`, { headers: { 'x-access-token': secret.access_token } }
    ).then(result => {
    
      const roomOptions = result.data.map(item => ({value: item._id, label: item.ten}))
      this.setState({
        roomTypeOptions: roomOptions,
        //roomTypeAdd: roomOptions[0].value,
      })
    }).catch(err => {
     
    })
  }

  handleSelectFloor = async(floor) => {
    await this.setState({
      floorActive: floor
    });
    this.getRoom();
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
          floorNameAdd: undefined,
          roomNameAdd: undefined,
          roomTypeAdd: '5ccbef2fe7179a596b1a4ba3',
          limitPersonAdd: 0,
          electicalNumAdd: 0,
          waterNumAdd: 0,
        });
        break;
      default:
        break
    }
  };

  onChange = (event) => {
    this.setState({
      [event.name]: event.value
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
    this.setState({ roomActive: {...this.state.roomActive, loaiPhong: value} })
  };

  roomTypeAddSelected = value => {
    this.setState({ roomTypeAdd: value })
  };

  handleSubmitAddRoom = async() => {
    const { roomNameAdd, limitPersonAdd, descriptionAdd, statusAddRoom, floorNameAdd, roomTypeAdd, electicalNumAdd, waterNumAdd } = this.state;
    if(!roomNameAdd && !floorNameAdd)
      this.setState({
        messErrAddRoom: 'Vui lòng nhập đầy đủ thông tin'
      });
    else{
      const params = {
        tenPhong: roomNameAdd,
        soNguoiToiDa: parseInt(limitPersonAdd),
        moTa: descriptionAdd,
        trangThai: statusAddRoom,
        lau: parseInt(floorNameAdd),
        loaiPhong: roomTypeAdd,
        soDien: parseInt(electicalNumAdd),
        soNuoc: parseInt(waterNumAdd),
      }
      await refreshToken();
      let secret = JSON.parse(localStorage.getItem('secret'));
      axios.post(`/manager/infoDormitory/addRoom`, params,{ headers: { 'x-access-token': secret.access_token } }
      ).then(async(result) => {
        ToastsStore.success("Thêm phòng thành công!");
        this.handleClosePopup('addRoom');
        this.handleClosePopup('addFloor');

        await this.getData();
        this.setState({
          floorActive: parseInt(floorNameAdd)
        })
      }).catch(err => {
        ToastsStore.error( err.response.data.msg);
      })
    }

  };

  handleShowDetail = async(room) => {
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/infoDormitory/getPersonInRoom/` + room._id
      ,{  headers: { 'x-access-token': secret.access_token } }
    ).then(result => {
      this.setState({
        listPerson: result.data.length === 0 ? undefined : result.data
      })
      if(result.data.length === 0)
        this.setState({
          messRoomDetail: 'Phòng trống'
        })
    }).catch(err => {})
    this.setState({
      roomActive: {...room, loaiPhong: room.loaiPhong._id},
      limitPersonDetail: room.soNguoiToiDa,
      roomNameDetail: room.tenPhong,
      statusDetail: 0,
      descriptionDetail: room.moTa,
      idActive: room._id,
    })
    this.handleShowPopup('room');
  }

  handleDeleteRoom = async(id) => {
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/infoDormitory/delRoom/` + id
        ,{ headers: { 'x-access-token': secret.access_token } }
    ).then(result => {
      ToastsStore.success("Xóa phòng thành công!");
      this.getData();
      this.handleClosePopup('room');
    }).catch(err => {
      ToastsStore.error(err.response.data.msg);
    })
  };

  handleSubmitUpdateStudent = async() => {
    const { roomActive: { _id, soNguoiToiDa, moTa, loaiPhong} } = this.state;
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.post(`/manager/infoDormitory/updateRoom/`
      ,{
        id: _id,
        soNguoiToiDa: parseInt(soNguoiToiDa),
        moTa: moTa,
        loaiPhong: loaiPhong
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
    const arr = roomList && roomList.map((room, index) => {
      return(
        <div className={'id-room_item'} key={index}>
          <Button
            shadow
            variant={(room.soNguoiToiDa-room.soNguoi) ? 'outline' : 'default'}
            color={color}
            onClick={()=>this.handleShowDetail(room)}
          >
            <i className="fas fa-home"/>
            {room.tenPhong} ({room.soNguoi}/{room.soNguoiToiDa})
          </Button>
        </div>
      )
    })
    return arr
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
  }

  render(){
    console.log('==render dormitory', this.state)
    const {
      floorActive,
      roomList,
      floorList,
      showRoomPopup,
      showAddRoomPopup,
      roomNameDetail,
      roomTypeOptions,
      roomActive
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
              <Modal.Title>Phòng {roomNameDetail}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={4}>
                  Số người tối đa:
                </Col>
                <Col md={8}>
                  <Input getValue={this.onChangeDetailRoom} name={'soNguoiToiDa'} value={roomActive.soNguoiToiDa} type={'number'}/>
                </Col>

                <Col md={4}>
                  Loại Phòng:
                </Col>
                <Col md={8}>
                  <Select
                    value={this.state.roomActive.loaiPhong}
                    options={roomTypeOptions}
                    selected={this.roomTypeUpdateSelected}
                  />
                </Col>

                <Col md={4}>
                  Mô tả:
                </Col>
                <Col md={8}>
                  <Input getValue={this.onChangeDetailRoom} name={'moTa'} value={roomActive.moTa} />
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
                  <Input getValue={this.onChange} name={'floorNameAdd'} />
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
                  <Input getValue={this.onChange} name={'limitPersonAdd'} type={'number'} placeholder={0} />
                </Col>

                <Col md={4}>
                  Loại phòng<span style={{color:'red'}}>*</span>:
                </Col>
                <Col md={8}>
                  <Select
                    options={roomTypeOptions}
                    selected={this.roomTypeAddSelected}
                  />
                </Col>

                <Col md={4}>
                  Số điện hiện tại<span style={{color:'red'}}>*</span>:
                </Col>
                <Col md={8}>
                  <Input getValue={this.onChange} name={'electicalNumAdd'} type={'number'} placeholder={0}/>
                </Col>

                <Col md={4}>
                  Số nước hiện tại<span style={{color:'red'}}>*</span>:
                </Col>
                <Col md={8}>
                  <Input getValue={this.onChange} name={'waterNumAdd'} type={'number'} placeholder={0}/>
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

                  {floorList.map(floor => {
                    return(
                      <div className={'id-floor_item'} key={floor.key}>
                        <Button
                          color={'success'}
                          variant={'outline'}
                          diminsion
                          actived={(floorActive === floor.label)}
                          onClick={()=>this.handleSelectFloor(floor.label)}
                        >
                          Lầu {floor.label}
                        </Button>
                      </div>
                    )
                  })}
                </div>

              </Col>
              <Col md={10}>
                <Tabs defaultActiveKey="all" id="uncontrolled-tab-example">
                  <Tab eventKey="all" title="Tất cả">
                    <div className={'id-room'}>
                      <div>
                        {
                          this.renderRoom(roomList.filter(room => room.loaiPhong.loai === PHONG_SV), 'info')
                        }
                      </div>
                      <div>
                        {
                          this.renderRoom(roomList.filter(room => room.loaiPhong.loai === PHONG_DVU), 'primary')
                        }
                      </div>
                      <div>
                        {
                          this.renderRoom(roomList.filter(room => ((room.loaiPhong.loai !== PHONG_DVU) && (room.loaiPhong.loai !== PHONG_SV))), 'warning')
                        }
                      </div>
                    </div>
                  </Tab>
                  {this.MyTab("studentRoom", "Phòng sinh viên",
                    roomList.filter(room => room.loaiPhong.loai === PHONG_SV),
                    'info')
                  }
                  {this.MyTab("proRoom", "Phòng dịch vụ",
                    roomList.filter(room => room.loaiPhong.loai === PHONG_DVU),
                    'primary')
                  }
                  {this.MyTab("functionRoom", "Phòng chức năng",
                    roomList.filter(room => ((room.loaiPhong.loai !== PHONG_DVU) && (room.loaiPhong.loai !== PHONG_SV))),
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
                <RoomType />
              </div>
            </Row>
          </div>

        </div>
      </div>
    )
  }
}

export default InfoDormitory