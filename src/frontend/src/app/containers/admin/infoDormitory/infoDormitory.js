import React from 'react';
import './infoDormitory.css';
import Title from "../../../components/title/title";
import Button from "../../../components/button/button";
import {Col, Modal, Row, Tabs, Tab} from 'react-bootstrap';
import refreshToken from './../../../../utils/refresh_token'
import axios from "axios";
import Input from "../../../components/input/input";
import Select from "../../../components/selectOption/select"
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from "react-toasts";

const PHONG_SV = 0;
const PHONG_DVU = 1;
const PHONG_CNANG = 2;

class InfoDormitory extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      floorActive: 1,
      roomActive: {
        soNguoiToiDa: 0,
        moTa: ''
      },
      roomTypeOptions: [{ value: 0, label: 'Sinh viên' }, { value: 1, label: 'Chức năng' }],
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

  componentWillMount(){
    this.getData();
  }

  getData = async() => {
    await this.getFloor();
    this.getRoom();
  }

  getFloor = async() => {
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));

    axios.get(`/manager/getElement/floor`,  {
      headers: { 'x-access-token': secret.access_token }
    }).then(result => {
      let i = 0;
      const floorList = result.data.map(floor => {
        return {key: i++, label: floor}
      });
      this.setState({
        floorList: floorList,
      })
    }).catch(err => {
    });
  };

  getRoom = async() => {
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/infoDormitory/getRoom/` + this.state.floorActive, { headers: { 'x-access-token': secret.access_token } }
    ).then(result => {
      let i = 0;
      // const normalRooms = result.data.normal.map(room => {
      //   return {key: i++, data: room}
      // });
      // const serviceRooms = result.data.service.map(room => {
      //   return {key: i++, data: room}
      // });
      const roomList = result.data.map(room => {
        return {key: i++, data: room}
      });
      this.setState({
        roomList: roomList
      })

    }).catch((err) => {
    })
  };

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
        this.setState({ showRoomPopup: false });
        break;
      case 'addFloor':
        this.setState({ showAddFloorPopup: false });
        break;
      case 'addRoom':
        this.setState({ showAddRoomPopup: false });
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
    this.setState({ statusUpdateRoom: value })
  };

  roomTypeAddSelected = value => {
    this.setState({ statusAddRoom: value })
  };

  handleSubmitAddRoom = async() => {
    const { roomNameAdd, limitPersonAdd, descriptionAdd, statusAddRoom, floorActive } = this.state;
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.post(`/manager/infoDormitory/addRoom`, {
      tenPhong: roomNameAdd,
      soNguoiToiDa: limitPersonAdd,
      moTa: descriptionAdd,
      trangThai: statusAddRoom,
      lau: floorActive,
      },{ headers: { 'x-access-token': secret.access_token } }
    ).then(result => {
      ToastsStore.success("Thêm phòng thành công!");
      this.handleClosePopup('addRoom');
      this.handleClosePopup('addFloor');
      this.getData();
    }).catch(err => {
      ToastsStore.error( err.response.data.msg);
    })
  };

  handleShowDetail = (room) => {
    this.setState({
      roomActive: room,
      limitPersonDetail: room.soNguoiToiDa,
      roomNameDetail: room.tenPhong,
      statusDetail: 0,
      descriptionDetail: room.moTa,
      idActive: room._id
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
      ToastsStore.error("Xóa phòng không thành công!");
      ToastsStore.error(err.response.data.msg);
    })
  };

  handleSubmitUpdateStudent = async() => {
    const { roomActive: { _id, soNguoiToiDa, moTa} } = this.state;
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.post(`/manager/infoDormitory/updateRoom/`
      ,{
        id: _id,
        soNguoiToiDa: parseInt(soNguoiToiDa),
        moTa: moTa
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

  showStudentRoom = (option, room) => {

    return(
      <span>abc</span>
    )
    return(
      <div className={'id-room_item'} key={room.key}>
        abc
        <Button
          shadow
          variant={(room.data.soNguoiToiDa-room.data.soNguoi) ? 'outline' : 'default'}
          color={'info'}
          onClick={()=>this.handleShowDetail(room.data)}
        >
          <i className="fas fa-home"/>
          {room.data.tenPhong} ({room.data.soNguoiToiDa-room.data.soNguoi})
        </Button>
      </div>
    )

    // if(option === PHONG_SV)
    //   return(
    //     <span>aaa</span>
    //   )
    // else if(option === PHONG_DVU)
    //   return(
    //     <span>bbbbb</span>
    //   )
    //
    // switch(option){
    //   case PHONG_SV:
    //     return(
    //       <span>aaa</span>
    //     )
    //     // return(
    //     //   <div className={'id-room_item'} key={room.key}>
    //     //     <Button
    //     //       shadow
    //     //       variant={(room.data.soNguoiToiDa-room.data.soNguoi) ? 'outline' : 'default'}
    //     //       color={'primary'}
    //     //       onClick={()=>this.handleShowDetail(room.data)}
    //     //     >
    //     //       <i className="fas fa-home"/>
    //     //       {room.data.tenPhong} ({room.data.soNguoiToiDa-room.data.soNguoi})
    //     //     </Button>
    //     //   </div>
    //     // )
    //
    //   case PHONG_DVU:
    //   {
    //     return(
    //       <div className={'id-room_item'} key={room.key}>
    //         abc
    //         <Button
    //           shadow
    //           variant={(room.data.soNguoiToiDa-room.data.soNguoi) ? 'outline' : 'default'}
    //           color={'info'}
    //           onClick={()=>this.handleShowDetail(room.data)}
    //         >
    //           <i className="fas fa-home"/>
    //           {room.data.tenPhong} ({room.data.soNguoiToiDa-room.data.soNguoi})
    //         </Button>
    //       </div>
    //     )
    //   }
    //
    //   case PHONG_CNANG:
    //   {
    //     return(
    //       <div className={'id-room_item'} key={room.key}>
    //         abc
    //         <Button
    //           shadow
    //           variant={(room.data.soNguoiToiDa-room.data.soNguoi) ? 'outline' : 'default'}
    //           color={'warning'}
    //           onClick={()=>this.handleShowDetail(room.data)}
    //         >
    //           <i className="fas fa-home"/>
    //           {room.data.tenPhong} ({room.data.soNguoiToiDa-room.data.soNguoi})
    //         </Button>
    //       </div>
    //     )
    //   }
    //   default:
    //     break;
    // }
  };


  render(){
    const {
      floorActive,
      roomList,
      floorList,
      showRoomPopup,
      showAddFloorPopup,
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
                  <Input getValue={this.onChangeDetailRoom} name={'soNguoiToiDa'} value={roomActive.soNguoiToiDa}/>
                </Col>

                <Col md={4}>
                  Loại Phòng:
                </Col>
                <Col md={8}>
                  <Select
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
            </Modal.Body>
            <Modal.Footer>
              <Button
                color={"danger"}
                onClick={() =>this.handleDeleteRoom(roomActive._id)}
              >
                Delete
              </Button>
              <Button variant="outline" onClick={() =>this.handleClosePopup('room')}>
                Close
              </Button>
              <Button  onClick={() =>this.handleSubmitUpdateStudent()}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>

          {/*add room popup*/}
          <Modal show={showAddRoomPopup} onHide={() =>this.handleClosePopup('addRoom')}>
            <Modal.Header closeButton>
              <Modal.Title>Thêm phòng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={4}>
                  Tên phòng:
                </Col>
                <Col md={8}>
                  <Input getValue={this.onChange} name={'roomNameAdd'} />
                </Col>

                <Col md={4}>
                  Số người tối đa:
                </Col>
                <Col md={8}>
                  <Input getValue={this.onChange} name={'limitPersonAdd'} />
                </Col>

                <Col md={4}>
                  Loại phòng:
                </Col>
                <Col md={8}>
                  <Select
                    options={roomTypeOptions}
                    selected={this.roomTypeAddSelected}
                  />
                </Col>

                <Col md={4}>
                  Mô tả:
                </Col>
                <Col md={8}>
                  <Input getValue={this.onChange} name={'descriptionAdd'} />
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" onClick={() =>this.handleClosePopup('room')}>
                Cancel
              </Button>
              <Button  onClick={() =>this.handleSubmitAddRoom()}>
                SAVE
              </Button>
            </Modal.Footer>
          </Modal>
          {/*end add room popup*/}

          {/*add floor popup*/}
          <Modal show={showAddFloorPopup} onHide={() =>this.handleClosePopup('addFloor')}>
            <Modal.Header closeButton>
              <Modal.Title>Thêm Lầu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={4}>
                  Lầu:
                </Col>
                <Col md={8}>
                  <Input getValue={this.onChange} name={'floorNameAdd'} />
                </Col>

                <span className={'id-addFloor_text'}>* Để thêm lầu bạn phải thêm tối thiểu một phòng</span>
                <Col md={4}>
                  Tên phòng:
                </Col>
                <Col md={8}>
                  <Input getValue={this.onChange} name={'roomNameAdd'} />
                </Col>

                <Col md={4}>
                  Số người tối đa:
                </Col>
                <Col md={8}>
                  <Input getValue={this.onChange} name={'limitPersonAdd'} />
                </Col>

                <Col md={4}>
                  Loại phòng:
                </Col>
                <Col md={8}>
                  <Select
                    options={roomTypeOptions}
                    selected={this.roomTypeAddSelected}
                  />
                </Col>

                <Col md={4}>
                  Mô tả:
                </Col>
                <Col md={8}>
                  <Input getValue={this.onChange} name={'descriptionAdd'} />
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" onClick={() =>this.handleClosePopup('room')}>
                Cancel
              </Button>
              <Button  onClick={async() =>{
                await this.setState({floorActive: this.state.floorNameAdd});
                this.handleSubmitAddRoom()
              }}>
                SAVE
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
                          roomList && roomList.map(room => {
                            if(room.data.loaiPhong.loai === PHONG_SV)
                              return(
                                <div className={'id-room_item'} key={room.key}>
                                  <Button
                                    shadow
                                    variant={(room.data.soNguoiToiDa-room.data.soNguoi) ? 'outline' : 'default'}
                                    color={'info'}
                                    onClick={()=>this.handleShowDetail(room.data)}
                                  >
                                    <i className="fas fa-home"/>
                                    {room.data.tenPhong} ({room.data.soNguoiToiDa-room.data.soNguoi})
                                  </Button>
                                </div>
                              )
                          })
                        }
                      </div>
                      <div>
                        {
                          roomList && roomList.map(room => {
                            if(room.data.loaiPhong.loai === PHONG_DVU)
                              return(
                                <div className={'id-room_item'} key={room.key}>
                                  <Button
                                    shadow
                                    variant={(room.data.soNguoiToiDa-room.data.soNguoi) ? 'outline' : 'default'}
                                    color={'primary'}
                                    onClick={()=>this.handleShowDetail(room.data)}
                                  >
                                    <i className="fas fa-home"/>
                                    {room.data.tenPhong} ({room.data.soNguoiToiDa-room.data.soNguoi})
                                  </Button>
                                </div>
                              )
                          })
                        }
                      </div>
                      <div>
                        {
                          roomList && roomList.map(room => {
                            if((room.data.loaiPhong.loai !== PHONG_DVU) && (room.data.loaiPhong.loai !== PHONG_SV))
                              return(
                                <div className={'id-room_item'} key={room.key}>
                                  <Button
                                    shadow
                                    variant={(room.data.soNguoiToiDa-room.data.soNguoi) ? 'outline' : 'default'}
                                    color={'warning'}
                                    onClick={()=>this.handleShowDetail(room.data)}
                                  >
                                    <i className="fas fa-home"/>
                                    {room.data.tenPhong} ({room.data.soNguoiToiDa-room.data.soNguoi})
                                  </Button>
                                </div>
                              )
                          })
                        }
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="studentRoom" title="Phòng sinh viên">
                    <div>
                      {
                        roomList && roomList.map(room => {
                          if(room.data.loaiPhong.loai === PHONG_SV)
                            return(
                              <div className={'id-room_item'} key={room.key}>
                                <Button
                                  shadow
                                  variant={(room.data.soNguoiToiDa-room.data.soNguoi) ? 'outline' : 'default'}
                                  color={'info'}
                                  onClick={()=>this.handleShowDetail(room.data)}
                                >
                                  <i className="fas fa-home"/>
                                  {room.data.tenPhong} ({room.data.soNguoiToiDa-room.data.soNguoi})
                                </Button>
                              </div>
                            )
                        })
                      }
                    </div>
                  </Tab>
                  <Tab eventKey="proRoom" title="Phòng dịch vụ">
                    <div className={'id-room'}>
                      <div>
                        {
                          roomList && roomList.map(room => {
                            if(room.data.loaiPhong.loai === PHONG_DVU)
                              return(
                                <div className={'id-room_item'} key={room.key}>
                                  <Button
                                    shadow
                                    variant={(room.data.soNguoiToiDa-room.data.soNguoi) ? 'outline' : 'default'}
                                    color={'primary'}
                                    onClick={()=>this.handleShowDetail(room.data)}
                                  >
                                    <i className="fas fa-home"/>
                                    {room.data.tenPhong} ({room.data.soNguoiToiDa-room.data.soNguoi})
                                  </Button>
                                </div>
                              )
                          })
                        }
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="functionRoom" title="Phòng chức năng">
                    <div className={'id-room'}>
                      <div>
                        {
                          roomList && roomList.map(room => {
                            if((room.data.loaiPhong.loai !== PHONG_DVU) && (room.data.loaiPhong.loai !== PHONG_SV))
                              return(
                                <div className={'id-room_item'} key={room.key}>
                                  <Button
                                    shadow
                                    variant={(room.data.soNguoiToiDa-room.data.soNguoi) ? 'outline' : 'default'}
                                    color={'warning'}
                                    onClick={()=>this.handleShowDetail(room.data)}
                                  >
                                    <i className="fas fa-home"/>
                                    {room.data.tenPhong} ({room.data.soNguoiToiDa-room.data.soNguoi})
                                  </Button>
                                </div>
                              )
                          })
                        }
                      </div>
                    </div>
                  </Tab>
                </Tabs>

              </Col>
            </Row>

            <Row style={{justifyContent: 'center'}}>
              <div className={'id-add'}>
                <Button
                  shadow
                  color={'danger'}
                  onClick={() => this.handleShowPopup('addFloor')}
                >
                  <i className="fas fa-plus"/> Thêm Lầu
                </Button>
              </div>
              <div className={'id-add'}>
                <Button
                  shadow
                  color={'danger'}
                  onClick={() => this.handleShowPopup('addRoom')}
                >
                  <i className="fas fa-plus"/> Thêm phòng
                </Button>
              </div>
            </Row>
          </div>

        </div>
      </div>
    )
  }
}

export default InfoDormitory