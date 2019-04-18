import React, { Component } from 'react';
import { Row, Col, Table, Modal } from 'react-bootstrap';
import axios from 'axios';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
import { withRouter } from 'react-router-dom';

import SearchSelect from '../../../components/selectOption/select'
import Input from './../../../components/input/input';
import Button from './../../../components/button/button';
import Title from './../../../components/title/title';
import CheckBox from './../../../components/checkbox/checkbox';
import './infoStudent.css';
import refreshToken from './../../../../utils/refresh_token'
import MyPagination from "../../../components/pagination/pagination";
import Loader from "../../../components/loader/loader";


axios.defaults.baseURL = 'http://localhost:4000/api'

class InfoStudent extends Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: true,

      showRoomHistoryPopup: false,
      showAddPopup: false,
      showDelPopup: false,
      pageActive: 1,
      totalpages: 1,
      limit: 10,
      isOld: false,

      infoAdded: {},

      pageList: [1,2,3,4,5],
      infoList: [],

      mssv: '',
      hoTen: '',
      roomSelected: {},
      schoolSelected: {},
      floorSelected: {},

      phong: [],
      truong: [],

      listDelete: [],
      flag: false,

      schoolOptions: [],
      schoolOptionsSearch: [],
      roomOptionsSearch: [],
      floorOptions: []
    }
  }

  handleClosePopup = (type) => {
    switch(type){
      case 'add':
        this.setState({ showAddPopup: false });
        break;
      case 'del':
        this.setState({ showDelPopup: false });
        break;
      case 'history':
        this.setState({ showRoomHistoryPopup: false });
        break;
      default:
        break
    }
  };

  handleShowPopup = (type) => {
    switch(type){
      case 'add':
        this.setState({ showAddPopup: true });
        break;
      case 'del':
        this.setState({ showDelPopup: true });
        break;
      case 'history':
        this.setState({ showRoomHistoryPopup: true });
        break;
      default:
        break
    }
  };

  onViewDetail = (info) => {
    this.props.history.push({
      pathname: '/admin/student/detail',
      state: { info: info }
    });
    // return (
    //   <Route path={`${this.props.match.url}/id`} component={InfoStudentDetail} />
    // )
  }

  componentDidMount(){
    this.getData();
    this.getElement('room');
    this.getElement('school');
    this.getElement('floor');
    // this.modifyData();
  }

  getElement = async(name) => {
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/getElement/` + name,  {
      headers: { 'x-access-token': secret.access_token }
    }).then(result => {
      switch (name) {
        case 'room':
          const roomOptions = result.data.map(room => ({value: room._id, label: room.tenPhong}));
          roomOptions.unshift({ value: 0, label: 'Tất cả' });
          this.setState({
            roomOptionsSearch: roomOptions
          })

          break;
        case 'school':
          const schoolOptionsSearch = result.data.map(truong => ({ value: truong._id, label: truong.tenTruong }));
          const schoolOptions = [...schoolOptionsSearch];
          schoolOptionsSearch.unshift({ value: 0, label: 'Tất cả' });
          this.setState({
            schoolOptionsSearch: schoolOptionsSearch,
            schoolOptions: schoolOptions
          })
          break;
        case 'floor':
          let i = 0;
          const floorList = result.data.map(floor => {
            return {value: i++, label: floor}
          });
          floorList.unshift({ value: 0, label: 'Tất cả' });
          this.setState({
            floorOptions: floorList,
          });
          break;
        default:
          break
      }
    }).catch(err => {})
  }

  getData = async () => {
    await refreshToken()
    let secret = JSON.parse(localStorage.getItem('secret'));
    let headers = {
      'x-access-token': secret.access_token
    };

    const { mssv, hoTen, roomSelected, schoolSelected, isOld } = this.state;
    let idPhong = roomSelected.value;
    let idTruong = schoolSelected.value;
    const options = {
      page: this.state.pageActive,
      limit: this.state.limit
    };

    if(idPhong === '0'){
      idPhong = ''
    }
    if(idTruong === '0'){
      idTruong = ''
    }
      axios.post(`/manager/infoStudent/get`,
      { options: options,
        mssv: mssv,
        hoTen: hoTen,
        idPhong: idPhong,
        idTruong: idTruong,
        isOld: isOld,
      }, { headers: headers }
    ).then(result => {
      this.setState({
        infoList: result.data.docs,
        totalPages: result.data.totalPages,
        loading: false
      })
    }).catch((err) => {
    })
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

  // getRoomAvailable = async() => {
  //   await refreshToken();
  //   let secret = JSON.parse(localStorage.getItem('secret'));
  //   axios.get(`/manager/getElement/` + name,  {
  //     headers: { 'x-access-token': secret.access_token }
  //   }).then
  // }

  onChangeAdd = (event) => {
    this.setState({
      infoAdded: {...this.state.infoAdded, [event.name]: event.value}
    })
  };

  onChange = (event) => {
    this.setState({
      [event.name]: event.value
    })
  };

  handleSearch = () => {
    this.setState({
      loading: true,
    });
    this.getData();
  }

  handleSelectRoom = selectedOption => {
    this.setState({ roomSelected: selectedOption, pageActive: 1 })
  }
  handleSelectSchool = selectedOption => {
    this.setState({ schoolSelected: selectedOption, pageActive: 1 })
  }
  handleSelectFloor = selectedOption => {
    this.setState({ floorSelected: selectedOption, pageActive: 1 })
  }

  handleSelectAddRoom = selectedOption => {
    this.setState({ infoAdded: {...this.state.infoAdded, roomAdded: selectedOption} })
  }
  handleSelectAddSchool = selectedOption => {
    this.setState({ infoAdded: {...this.state.infoAdded, schoolAdded: selectedOption} })
  }

  handleSubmitAddStudent = async() => {
    const { infoAdded: { schoolAdded, mssvAdded, nameAdded } } = this.state;
    console.log('==submit add', this.state.infoAdded)
    if(!schoolAdded && !mssvAdded && nameAdded)
    {
      console.log('==please fill');
      this.setState({
        notiAdd: 'Vui lòng điền đầy đủ thông tin!!'
      });
      return;
    }

    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    let headers = {
      'x-access-token': secret.access_token
    };
    axios.post(`/manager/infoStudent/add`,
      {
        mssv: mssvAdded ? mssvAdded : '',
        hoTen: nameAdded ? nameAdded : '',
        idTruong: schoolAdded.value ? schoolAdded.value : ''
      }, { headers: headers }
    ).then(result => {
      this.handleClosePopup('add');
    }).catch(err => {
      ToastsStore.error(err.response.data.msg);
    })
  }

  clickPage = async (page) => {
    await this.setState({
      pageActive: page
    });
    this.getData();
  }

  handleCheckDelete = (props) => {
    if(props.chk){
      let arrDel = this.state.listDelete;
      arrDel.push(props.value);
      this.setState({
        listDelete: arrDel
      })
    } else {
      let arrDel = this.state.listDelete;
      let element = props.value;
      const i = arrDel.indexOf(element);
      if (i !== -1) {
        arrDel.splice(i,1);
      }

      this.setState({
        listDelete: arrDel
      })
    }
  }

  handleValueCheck = mssv => {
    const i = this.state.listDelete.indexOf(mssv);
    return i !== -1;
  };

  handleDelStudent = async()  => {
    await refreshToken();
    var secret = JSON.parse(localStorage.getItem('secret'));
    axios.post(`/manager/infoStudent/delete`,
      {
        arrDelete: this.state.listDelete
      }, { headers: {'x-access-token': secret.access_token} }
    ).then(result => {
      this.setState({
        listDelete: []
      });
      ToastsStore.success("Xóa thành công!");
      this.getData();
      this.handleClosePopup('del')
    }).catch(err => {
      ToastsStore.error("Xóa không thành công!");
      this.handleClosePopup('del')
    })
  };

  handleReload = () => {
    this.setState({
      loading: true,
      pageActive: 1,
      hoTen: '',
      mssv: '',
      roomSelected: '',
      schoolSelected: '',
      floorSelected: '',

    })
    this.getData();
  }

  handleChooseOption = (prop) => {
    this.setState({isOld: prop});
    this.getData();
  };

  render(){
    const {
      limit,
      pageActive,
      infoList,
      roomSelected,
      schoolSelected,
      floorSelected,
      roomOptionsSearch,
      schoolOptions,
      schoolOptionsSearch,
      floorOptions,
      hoTen,
      mssv,
      isOld,
      infoAdded: { roomAdded, schoolAdded} } = this.state;
    let i = pageActive*limit - 10;
    return(
      <div>
        <Loader loading={this.state.loading}/>
        <Title>
          Thông tin sinh viên
        </Title>
        <div className={'content-body'}>

          <div className={'is-header'}>
            <Row>
              <Col md={1}>
                MSSV
              </Col>
              <Col md={2}>
                <Input getValue={this.onChange} name={'mssv'} value={mssv}/>
              </Col>

              <Col md={1}>
                Họ tên
              </Col>
              <Col md={4}>
                <Input getValue={this.onChange} name={'hoTen'} value={hoTen}/>
              </Col>

              <Col md={1}>
                Phòng
              </Col>
              <Col md={2}>
                <SearchSelect
                  isSearchable={true}
                  placeholder={''}
                  value={roomSelected}
                  // selected={this.handleSelectRoom}
                  onChange={this.handleSelectRoom}
                  options={roomOptionsSearch}
                />
              </Col>
            </Row>
            <Row>
              <Col md={1}>
                Năm
              </Col>
              <Col md={2}>
                <Input getValue={this.onChange} name={'mssv'} />
              </Col>

              <Col md={1}>
                Trường
              </Col>
              <Col md={4}>
                <SearchSelect
                  isSearchable={true}
                  placeholder={''}
                  value={schoolSelected}
                  onChange={this.handleSelectSchool}
                  options={schoolOptionsSearch}
                />
              </Col>

              <Col md={1}>
                Lầu
              </Col>
              <Col md={2}>
                <SearchSelect
                  isSearchable={true}
                  placeholder={''}
                  value={floorSelected}
                  onChange={this.handleSelectFloor}
                  options={floorOptions}
                />
              </Col>


            </Row>

            {/*Button search*/}
            <Row style={{display: 'flex', justifyContent: 'center'}}>
            <Col md={3} >
              <Button
                size={'md'}
                fullWidth
                onClick={() => this.handleSearch()}
              >
                <i className="fas fa-search"/>
                Tìm kiếm
              </Button>
            </Col>
            <Col md={1} >
              <Button
                size={'md'}
                color={'default'}
                fullWidth
                onClick={() => this.handleReload()}
              >
                <i className="fas fa-sync-alt"/>
              </Button>
            </Col>
            </Row>

            <Row>
              <Col md={6} className={''}>
                <div className={'is-manipulation'}>
                  <Button
                    variant={'rounded'}
                  >
                    <i className="fas fa-file-import"/>
                  </Button>
                  <Button
                    variant={'rounded'}
                  >
                    <i className="fas fa-file-export"/>
                  </Button>
                  <Button
                    variant={'rounded'}
                    color={'success'}
                  >
                    <i className="fas fa-address-card"/>
                  </Button>
                  <Button
                    variant={'rounded'}
                    color={'success'}
                  >
                    <i className="fas fa-print"/>
                  </Button>
                </div>
              </Col>

              <Col md={6} >
                <div className={'is-manipulation'} style={{float: 'right'}}>
                  <Button color={'warning'} onClick={() => this.handleShowPopup('add')}>
                    <i className="fas fa-plus"/>
                  </Button>
                  <Button color={'danger'}>
                    <i className="fas fa-trash-alt" onClick={() => this.handleShowPopup('del')}/>
                  </Button>
                </div>
              </Col>
            </Row>
          </div>


          {/*modal popup add student*/}
          <Modal show={this.state.showAddPopup} onHide={() =>this.handleClosePopup('add')}>
            <Modal.Header closeButton>
              <Modal.Title>Thêm sinh viên</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={3}>
                  Họ và Tên:
                </Col>
                <Col md={9}>
                  <Input getValue={this.onChangeAdd} name={'nameAdded'} />
                </Col>

                <Col md={3}>
                  MSSV:
                </Col>
                <Col md={9}>
                  <Input getValue={this.onChangeAdd} name={'mssvAdded'} />
                </Col>
                <Col md={3}>
                  Trường:
                </Col>
                <Col md={9}>
                  <SearchSelect
                    isSearchable={true}
                    placeholder={''}
                    value={schoolAdded}
                    onChange={this.handleSelectAddSchool}
                    options={schoolOptions} />
                </Col>
              </Row>
              <Row style={{color: 'red'}}>
                {this.state.notiAdd}
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" onClick={() =>this.handleClosePopup('add')}>
                Close
              </Button>
              <Button  onClick={() =>this.handleSubmitAddStudent()}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>

          {/*end modal*/}

          {/*modal popup delete student*/}
          <Modal show={this.state.showDelPopup} onHide={() =>this.handleClosePopup('del')}>
            <Modal.Header closeButton>
              <Modal.Title>Sau khi xóa những sinh viên này sẽ là sinh viên cũ!</Modal.Title>
            </Modal.Header>
            {/*<Modal.Body>Bạn có chắc chắn muốn xóa những sinh viên này?</Modal.Body>*/}
            <Modal.Footer>
              <Button variant="outline" onClick={() =>this.handleClosePopup('del')}>
                Hủy
              </Button>
              <Button  onClick={() =>this.handleDelStudent()}>
                Đồng ý
              </Button>
            </Modal.Footer>
          </Modal>
          {/*end modal*/}

          {/*modal popup room history student*/}
          <Modal show={this.state.showRoomHistoryPopup} onHide={() =>this.handleClosePopup('history')}>
            <Modal.Header closeButton>
              <Modal.Title>Lịch sử chuyển phòng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table responsive bordered >
                <thead>
                <tr>
                  <th>#</th>
                  <th>Thời gian</th>
                  <th>Phòng</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>1</td>
                  <td>01/01/2018 - 01/01/2019</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>01/01/2019 - Hiện tại</td>
                  <td>102</td>
                </tr>
                </tbody>
              </Table>;
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() =>this.handleClosePopup('history')}>
                Thoát
              </Button>
            </Modal.Footer>
          </Modal>
          {/*end modal*/}

          <div className={'is-body'}>
            <Row className={'is-btn-option'}>
              <Col>
                <Button
                  variant={isOld ? 'outline' :  'default'}
                  color={'default'}
                  onClick={() => this.handleChooseOption(false)}
                >
                  Hiện tại
                </Button>
                <Button
                  color={isOld ? 'default' : 'outline'}
                  onClick={() => this.handleChooseOption(true)}
                >
                  Sinh viên cũ
                </Button>
              </Col>
            </Row>

            <Table responsive hover bordered size="sm">
              <thead className="title-table">
              <tr>
                <th>STT</th>
                <th>MSSV</th>
                <th>Họ và Tên</th>
                <th>Trường</th>
                <th>Phòng</th>
                <th>Thao tác</th>
              </tr>
              </thead>
              <tbody>

              {infoList && infoList.map(info => {

                return(
                  <tr onDoubleClick ={() => this.onViewDetail(info)} key={i++}>
                    <td >{i}</td>
                    <td>{info.MSSV}</td>
                    <td>{info.hoTen}</td>
                    <td>{info.truong.tenTruong}</td>
                    <td>
                      {info.idPhong.tenPhong}
                      <Button color={'info'} variant={'outline'} style={{marginLeft: '15px'}} onClick={() => this.handleShowPopup('history')}>
                        <i className="fas fa-history"/>
                      </Button>
                      </td>
                    <td style={{display: 'flex', justifyContent: 'center'}}>
                      <Button color={'warning'} style={{marginRight: '15px'}} onClick={() => this.onViewDetail(info)}>
                        <i className="fas fa-edit"/>
                      </Button>
                      <CheckBox name={info.MSSV} isCheck={this.handleCheckDelete} check={this.handleValueCheck(info.MSSV)}/>
                    </td>
                  </tr>
                )
              })}
              </tbody>
            </Table>
            <Row>
              <Col md={3} className={'page-input'}>
                <label style={{marginRight:'3px'}}>Page</label>
                <Input width={'50px'}/>
              </Col>
              <Col md={9}>
                <div className={'is-pagination'}>

                  <MyPagination page={this.state.pageActive} totalPages={this.state.totalPages} clickPage={this.clickPage}/>

                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>

    )
  }
}

export default withRouter(InfoStudent)