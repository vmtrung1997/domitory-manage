import React from 'react';
import './infoDormitory.css';
import './../../../style.css'
import Title from "../../../components/title/title";
import Button from "../../../components/button/button";
import {Col, Modal, Row} from 'react-bootstrap';
import refreshToken from './../../../../utils/refresh_token'
import axios from "axios";
import Input from "../../../components/input/input";
import Select from "../../../components/selectOption/select"
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from "react-toasts";

class InfoDormitory extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      floorActive: 1,
      roomActive: null,
      statusOptions: [{ value: 0, label: 'Chưa sử dụng' }, { value: 1, label: 'Sử dụng' }],
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
      console.log('==get lau', result);
      let i = 0;
      const floorList = result.data.map(floor => {
        return {key: i++, label: floor}
      });
      this.setState({
        floorList: floorList,
      })
    }).catch(err => {
      console.log('==get lau err', err);
    });
  };

  getRoom = async() => {
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/infoDormitory/getRoom/` + this.state.floorActive, { headers: { 'x-access-token': secret.access_token } }
    ).then(result => {
      console.log('==get infoDormitory success', result);
      let i = 0;
      const roomList = result.data.map(room => {
        return {key: i++, data: room}
      });
      this.setState({
        roomList: roomList
      })

    }).catch((err) => {
      console.log('get infoDormitory Student err', err);
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

  statusUpdateSelected = value => {
    this.setState({ statusUpdateRoom: value })
  };

  statusAddSelected = value => {
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
      console.log('==add room suc', result);
      ToastsStore.success("Thêm phòng thành công!");
      this.handleClosePopup('addRoom');
      this.handleClosePopup('addFloor');
      this.getData();
    }).catch(err => {
      console.log('==add room err', err.response);
      ToastsStore.error( err.response.data.msg);
    })
  };

  handleShowDetail = (room) => {
    this.setState({
      limitPersonDetail: room.soNguoiToiDa,
      roomNameDetail: room.tenPhong,
      statusDetail: 0,
      descriptionDetail: room.moTa,
      idActive: room._id
    })
    this.handleShowPopup('room');
  }

  handleDeleteRoom = async(id) => {
    const { roomNameAdd, limitPersonAdd, descriptionAdd, statusAddRoom, floorActive } = this.state;
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/infoDormitory/delRoom/` + id
        ,{ headers: { 'x-access-token': secret.access_token } }
    ).then(result => {
      console.log('==del success:', result);
      ToastsStore.success("Xóa phòng thành công!");
      this.getData();
      this.handleClosePopup('room');
    }).catch(err => {
      console.log('==del err:', err);
      ToastsStore.error("Xóa phòng không thành công!");
      ToastsStore.error(err.response.data.msg);
    })
  }

  render(){
    const {
      floorActive,
      roomActive,
      roomList,
      floorList,
      showRoomPopup,
      showAddFloorPopup,
      showAddRoomPopup,
      statusOptions,
      limitPersonDetail,
      descriptionDetail,
      roomNameDetail,
      idActive
    } = this.state;

    console.log('==render state', this.state)
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
                  <Input getValue={this.onChange} name={'soNguoiToiDa'} value={limitPersonDetail}/>
                </Col>

                <Col md={4}>
                  Trạng Thái:
                </Col>
                <Col md={8}>
                  <Select
                    options={statusOptions}
                    selected={this.statusUpdateSelected}
                  />
                </Col>

                <Col md={4}>
                  Mô tả:
                </Col>
                <Col md={8}>
                  <Input getValue={this.onChange} name={'moTa'} value={descriptionDetail} />
                </Col>


              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button
                color={"danger"}
                onClick={() =>this.handleDeleteRoom(idActive)}
              >
                Delete
              </Button>
              <Button variant="outline" onClick={() =>this.handleClosePopup('room')}>
                Close
              </Button>
              <Button  onClick={() =>this.handleSubmitAddStudent()}>
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
                  Trạng Thái:
                </Col>
                <Col md={8}>
                  <Select
                    options={statusOptions}
                    selected={this.statusAddSelected}
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
                  Trạng Thái:
                </Col>
                <Col md={8}>
                  <Select
                    options={statusOptions}
                    selected={this.statusAddSelected}
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



            <div className={'id-floor_item'}>
              <Button
                color={'success'}
                variant={'outline'}
                diminsion
                onClick={() => this.handleShowPopup('addFloor')}
              >
                <i className="fas fa-plus"/>
              </Button>
            </div>
            </div>

          </Col>
          <Col md={10}>
            <div className={'id-room'}>
              {roomList.map(room => {
                return(
                  <div className={'id-room_item'} key={room.key}>
                    <Button
                      variant={(room.data.soNguoiToiDa-room.data.soNguoi) ? 'outline' : 'default'}
                      color={'warning'}
                      onClick={()=>this.handleShowDetail(room.data)}
                    >
                      Phòng {room.data.tenPhong} ({room.data.soNguoiToiDa-room.data.soNguoi})
                    </Button>
                  </div>
                )
              })}

              <div className={'id-room_item'}>
                <Button
                  variant={'outline'}
                  color={'warning'}
                  onClick={() => this.handleShowPopup('addRoom')}
                >
                  <i className="fas fa-plus"/>
                </Button>
              </div>
            </div>
          </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default InfoDormitory