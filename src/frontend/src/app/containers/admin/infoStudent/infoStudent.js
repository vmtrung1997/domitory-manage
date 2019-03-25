import React, { Component } from 'react';
import { Row, Col, Table, Pagination, Modal } from 'react-bootstrap';
import Input from './../../../components/input/input';
import Button from './../../../components/button/button';
import Title from './../../../components/title/title';
import CheckBox from './../../../components/checkbox/checkbox';
//import Pagination from './../../../components/pagination/pagination';
import {Route, withRouter} from 'react-router-dom';
import './infoStudent.css';
import './../../../style.css'

import axios from 'axios';
import refreshToken from './../../../../utils/refresh_token'
import InfoStudentDetail from './infoStudentDetail';
import MyPagination from "../../../components/pagination/pagination";
import SearchSelect from 'react-select';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';


axios.defaults.baseURL = 'http://localhost:4000/api'

class InfoStudent extends Component{
  constructor(props) {
    super(props);
    this.state = {
      showAddPopup: false,
      showDelPopup: false,
      pageActive: 1,
      totalpages: 1,
      limit: 10,

      mssvAdded: '',
      nameAdded: '',
      roomAdded: '',
      schoolAdded: '',

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
      roomOptions: [],
      floorOptions: [{value: 0, label: 1}, {value: 1, label: 2}, {value: 2, label: 3}, {value: 3, label: 4}, {value: 4, label: 5}, {value: 5, label: 6}],
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
      default:
        break
    }
  };

  onViewDetail = (info) => {
    console.log('==fine', info)
    this.props.history.push({
      pathname: '/admin/student/detail',
      state: { info: info }
    });
    // return (
    //   <Route path={`${this.props.match.url}/id`} component={InfoStudentDetail} />
    // )
  }

  componentWillMount(){
    this.getData();
    this.getElement('phong');
    this.getElement('truong');
    // this.modifyData();
  }

  modifyData = () => {
    const roomOptions = this.state.phong.map(room => ({value: room._id, label: room.tenPhong}));
    const schoolOptions = this.state.truong.map(truong => ({ value: truong._id, label: truong.tenTruong }));
    this.setState({
      roomOptions: roomOptions,
      schoolOptions: schoolOptions
    })
    console.log('==roomOptions',roomOptions, this.state.phong)
  }

  getElement = name => {
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/getElement/` + name,  {
      headers: { 'x-access-token': secret.access_token }
    }).then(result => {
      console.log('==element success', result)
      switch (name) {
        case 'phong':
          const roomOptions = result.data.map(room => ({value: room._id, label: room.tenPhong}));
          roomOptions.unshift({ value: 0, label: 'Tất cả' });
          this.setState({
            roomOptions: roomOptions
          })
          break;
        case 'truong':
          const schoolOptions = result.data.map(truong => ({ value: truong._id, label: truong.tenTruong }));
          schoolOptions.unshift({ value: 0, label: 'Tất cả' });
          this.setState({
            schoolOptions: schoolOptions
          })
          break;
        default:
          break
      }
    }).catch(err => {})
  }

  getData = async () => {
    console.log('==pageActive', this.state.pageActive);
    //await refreshToken()
    console.log('==pageActive22222', this.state.pageActive);
    let secret = JSON.parse(localStorage.getItem('secret'));
    let headers = {
      'x-access-token': secret.access_token
    };

    const { mssv, hoTen, roomSelected, schoolSelected } = this.state;
    let idPhong = roomSelected.value;
    let idTruong = schoolSelected.value;
    console.log('==idTruong', idTruong);
    //console.log('==pageActive222',roomSelected);
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
    //console.log('==pageActive222',roomSelected);
      axios.post(`/manager/infoStudent/get`,
      { options: options,
        mssv: mssv,
        hoTen: hoTen,
        idPhong: idPhong,
        idTruong: idTruong
      }, { headers: headers }
    ).then(result => {
      console.log('==get info success', result);
      this.setState({
        infoList: result.data.docs,
        totalPages: result.data.totalPages
      })
    }).catch((err) => {
      console.log('get info Student err', err);
    })
    console.log('==end getdata');
  }
  onChange = (event) => {
    this.setState({
      [event.name]: event.value
    })
  }

  handleSearch = () => {
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
    this.setState({ roomAdded: selectedOption })
  }
  handleSelectAddSchool = selectedOption => {
    this.setState({ schoolAdded: selectedOption })
  }

  handleSubmitAddStudent = () => {
    const { mssvAdded, nameAdded, roomAdded, schoolAdded } = this.state;
    let secret = JSON.parse(localStorage.getItem('secret'));
    let headers = {
      'x-access-token': secret.access_token
    };
    axios.post(`/manager/infoStudent/add`,
      {
        mssv: mssvAdded,
        hoTen: nameAdded,
        idPhong: roomAdded,
        idTruong: schoolAdded
      }, { headers: headers }
    ).then(result => {
      this.handleClosePopup('add');
    }).catch(err => {
      this.handleClosePopup('add');
    })
  }

  clickPage = async (page) => {
    await this.setState({
      pageActive: page
    });
    this.getData();
  }

  handleCheckDelete = (props) => {
    console.log('==arrDel', props)
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
    console.log('==arrDel',this.state.listDelete)
  }

  handleValueCheck = mssv => {
    console.log('==mssv checkbox', mssv)
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
      console.log('==del success', result)
      this.setState({
        listDelete: []
      });
      ToastsStore.success("Xóa thành công!");
      this.handleClosePopup('del')
      this.getData();
    }).catch(err => {
      console.log('==del err', err)
      ToastsStore.error("Xóa  không thành công!");
      this.handleClosePopup('del')
    })
  };

  handleReload = () => {
    this.setState({
      pageActive: 1,
      hoTen: '',
      mssv: '',
      roomSelected: '',
      schoolSelected: '',
      floorSelected: '',

    })
    this.getData();
  }

  render(){
    console.log('==render state', this.state);

    const {
      infoList,
      limit,
      pageActive,
      roomSelected,
      schoolSelected,
      floorSelected,
      schoolAdded,
      roomOptions,
      schoolOptions,
      floorOptions,
      roomAdded
    } = this.state;
    let i = pageActive*limit - 10;
    return(
      <div>
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
                <Input getValue={this.onChange} name={'mssv'} />
              </Col>

              <Col md={1}>
                Họ tên
              </Col>
              <Col md={4}>
                <Input getValue={this.onChange} name={'hoTen'} />
              </Col>

              <Col md={1}>
                Phòng
              </Col>
              <Col md={2}>
                <SearchSelect
                  placeholder={''}
                  value={roomSelected}
                  // selected={this.handleSelectRoom}
                  onChange={this.handleSelectRoom}
                  options={roomOptions}
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
                  placeholder={''}
                  value={schoolSelected}
                  onChange={this.handleSelectSchool}
                  // selected={this.handleSelectSchool}
                  options={schoolOptions}
                />
              </Col>

              <Col md={1}>
                Lầu
              </Col>
              <Col md={2}>
                <SearchSelect
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
          </div>

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

          <input type="file" name="file" />

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
                  <Input getValue={this.onChange} name={'nameAdded'} />
                </Col>
                <Col md={3}>
                  MSSV:
                </Col>
                <Col md={9}>
                  <Input getValue={this.onChange} name={'mssvAdded'} />
                </Col>
                <Col md={3}>
                  Phòng:
                </Col>
                <Col md={9}>
                  <SearchSelect
                    placeholder={''}
                    value={roomAdded}
                    onChange={()=>this.handleSelectAddRoom()}
                    selected={this.handleSelectAddRoom}
                    options={roomOptions} />
                </Col>
                <Col md={3}>
                  Trường:
                </Col>
                <Col md={9}>
                  <SearchSelect
                    placeholder={''}
                    value={schoolAdded}
                    onChange={()=>this.handleSelectAddSchool()}
                    selected={this.handleSelectAddSchool}
                    options={schoolOptions} />
                </Col>
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

          {/*modal popup edit student*/}
          <Modal show={this.state.showDelPopup} onHide={() =>this.handleClosePopup('del')}>
            <Modal.Header closeButton>
              <Modal.Title>Bạn có chắc chắn muốn xóa những sinh viên này?</Modal.Title>
            </Modal.Header>
            {/*<Modal.Body>Bạn có chắc chắn muốn xóa những sinh viên này?</Modal.Body>*/}
            <Modal.Footer>
              <Button variant="outline" onClick={() =>this.handleClosePopup('del')}>
                Cancel
              </Button>
              <Button  onClick={() =>this.handleDelStudent()}>
                OK
              </Button>
            </Modal.Footer>
          </Modal>
          {/*end modal*/}

          <div className={'is-body'}>
            <Table responsive hover bordered size="sm">
              <thead>

              <tr>
                <th>#</th>
                <th>MSSV</th>
                <th>Họ và Tên</th>
                <th>Trường</th>
                <th>Phòng</th>
                <th>Thao tác</th>
              </tr>
              </thead>
              <tbody>

              {infoList && infoList.map(info => {
                console.log('==info', info)
                let checked = this.state.listDelete.includes(info.MSSV);
                console.log('==icheck, checked', checked, info.MSSV);
                return(
                  <tr onDoubleClick ={() => this.onViewDetail(info)} key={i++}>
                    <td >{i}</td>
                    <td>{info.MSSV}</td>
                    <td>{info.hoTen}</td>
                    <td>{info.truong.tenTruong}</td>
                    <td>{info.idPhong.tenPhong}</td>
                    <td style={{display: 'flex', justifyContent: 'center'}}>
                      <Button color={'warning'} style={{marginRight: '15px'}} onClick={() => this.onViewDetail(info)}>
                        <i className="fas fa-edit"/>
                      </Button>
                      <CheckBox name={info.MSSV} isCheck={this.handleCheckDelete} check={checked}/>
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
                {/*<Pagination>*/}
                  {/*<Pagination.First />*/}
                  {/*<Pagination.Prev />*/}
                  {/*{pageList && pageList.map((page, index) => {*/}
                    {/*if(pageActive === page)*/}
                      {/*return(*/}
                        {/*<Pagination.Item active key={index}>{page}</Pagination.Item>*/}
                      {/*);*/}
                    {/*else*/}
                      {/*return(*/}
                        {/*<Pagination.Item key={index}>{page}</Pagination.Item>*/}
                      {/*)*/}
                  {/*})}*/}
                  {/*<Pagination.Next />*/}
                  {/*<Pagination.Last />*/}
                {/*</Pagination>*/}
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