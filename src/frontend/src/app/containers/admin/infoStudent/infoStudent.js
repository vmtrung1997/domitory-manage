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
import DatePicker from "react-datepicker/es/index";


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

      infoAdded: {
        dateAdded : new Date(),
        expiredDateAdded: new Date()
      },

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
      floorOptions: [],

      roomHistory: []
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
      case 'import':
        this.setState({ showImportPopup: false });
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
      case 'import':
        this.setState({ showImportPopup: true });
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

  handleSubmitAddStudent = async() => {
    const { infoAdded: {  mssvAdded, nameAdded, dateAdded, expiredDateAdded } } = this.state;
    console.log('==submit add', this.state.infoAdded)
    if(!mssvAdded && nameAdded && !dateAdded && !expiredDateAdded)
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
        ngaySinh: dateAdded ? dateAdded : new Date(),
        expiredAt: expiredDateAdded ? expiredDateAdded : new Date(),
      }, { headers: headers }
    ).then(result => {
      this.handleClosePopup('add');
    }).catch(err => {
      ToastsStore.error("Thêm không thành công!" + err.response.data.msg);
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
  };

  handleChooseOption = (prop) => {
    this.setState({isOld: prop});
    this.getData();
  };

  getValueDate = (name, val) => {
    this.setState({
      infoAdded: {
        ...this.state.infoAdded,
        [name]: val
      }
    })
  }

  handleRoomHistory = async(id) => {
    this.handleShowPopup('history')
    await refreshToken();
    var secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/getRoomHistory/` + id, { headers: {'x-access-token': secret.access_token} }
    ).then(result => {
      console.log('==history', result);
      let i=1;
      const history = result.data && result.data.map(his => {
        return{key: i++, data: his}
      })
      this.setState({
        roomHistory: history
      })
    }).catch()
  }

  filesOnChange = (sender) =>{
    let file = sender.target.files[0];

    this.setState({
      fileImport: file
    });
  }

  uploadJustFile = async(props) => {

    if (!this.state.hasOwnProperty('fileImport')) {
      this.setState({
        justFileServiceResponse: 'Vui lòng chọn 1 file!!'
      });
      return;
    }
    console.log('==eeee', props.e, this.state.fileImport);
    props.e.preventDefault();
    this.setState({
      justFileServiceResponse: 'Vui lòng chờ!!'
    });


    let form = new FormData();
    form.append('file', this.state.fileImport);

    await refreshToken()
    let secret = JSON.parse(localStorage.getItem('secret'));

    axios.post('/manager/infoStudent/importFile', form, { headers: {
        'x-access-token': secret.access_token,
        'content-type': 'multipart/form-data'
      } })
      .then((result) => {
        // let message = "Success!"
        // if (!result.data.success) {
        //   message = result.data.message;
        // }
        console.log('==import file success', result);
        ToastsStore.error("Success!");
      })
      .catch((err) => {
        ToastsStore.error("Error!");
        console.log(err);
      });
  }
  render(){
    console.log('==render state', this.state);
    const {
      limit,
      pageActive,
      infoList,
      roomSelected,
      schoolSelected,
      floorSelected,
      roomOptionsSearch,
      schoolOptionsSearch,
      floorOptions,
      hoTen,
      mssv,
      isOld,
      roomHistory,
      infoAdded: { dateAdded, expiredDateAdded} } = this.state;
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
              </Row>

              <Row>
                <Col md={3}>
                  MSSV:
                </Col>
                <Col md={9}>
                  <Input getValue={this.onChangeAdd} name={'mssvAdded'} />
                </Col>
                <Col md={3}>
                  Ngày sinh:
                </Col>
                <Col md={9}>

                  <DatePicker
                    dateFormat='dd/MM/yyyy'
                    selected={dateAdded}
                    onChange={(val) => this.getValueDate('dateAdded', val)}
                    className='input-datepicker'
                  />
                </Col>
              </Row>

              <Row>
                <Col md={3}>
                  Ngày hết hạn đăng ký:
                </Col>
                <Col md={9}>

                  <DatePicker
                    dateFormat='dd/MM/yyyy'
                    selected={expiredDateAdded}
                    onChange={(val) => this.getValueDate('expiredDateAdded', val)}
                    className='input-datepicker'
                  />
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
                    {roomHistory && roomHistory.map(his => {
                      let { idPhong, ngayChuyen } = his.data;
                      let date = new Date(ngayChuyen);
                      return(
                        <tr>
                          <td>{his.key}</td>
                          <td>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</td>
                          <td>{idPhong.tenPhong}</td>
                        </tr>
                      )
                    })}

                    </tbody>
                  </Table>

            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() =>this.handleClosePopup('history')}>
                Thoát
              </Button>
            </Modal.Footer>
          </Modal>
          {/*end modal*/}

          {/*modal popup upload file*/}
          <Modal show={this.state.showImportPopup} onHide={() =>this.handleClosePopup('import')}>
            {/*<Modal.Header closeButton>*/}
              {/*<Modal.Title>Bạn có chắc chắn muốn xóa những sinh viên này?</Modal.Title>*/}
            {/*</Modal.Header>*/}
            <Modal.Body>
              <input type="file" name="file" onChange={this.filesOnChange}/>
              <p><b>{this.state.justFileServiceResponse}</b></p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" onClick={() =>this.handleClosePopup('import')}>
                Cancel
              </Button>
              <Button  onClick={this.uploadJustFile}>
                Upload
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
                    <td>{info.MSSV || 'Trống'}</td>
                    <td>{info.hoTen || 'Trống'}</td>
                    <td>{info.truong ? info.truong.tenTruong : 'Chưa xác định'}</td>
                    <td>
                      {info.idPhong ? info.idPhong.tenPhong : '-----'}
                      <Button color={'info'} variant={'outline'} style={{marginLeft: '15px'}} onClick={() => this.handleRoomHistory(info.idTaiKhoan._id)}>
                        <i className="fas fa-history"/>
                      </Button>
                      </td>
                    <td style={{display: 'flex', justifyContent: 'center'}}>
                      <Button color={'warning'} style={{marginRight: '15px'}} onClick={() => this.onViewDetail(info)}>
                        <i className="fas fa-edit"/>
                      </Button>
                      {!isOld &&
                        <CheckBox name={info.MSSV} isCheck={this.handleCheckDelete} check={this.handleValueCheck(info.MSSV)}/>
                      }
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