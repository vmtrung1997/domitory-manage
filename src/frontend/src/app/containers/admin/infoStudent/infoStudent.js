import React, { Component } from 'react';
import { Row, Col, Table, Pagination, Modal } from 'react-bootstrap';
import Input from './../../../components/input/input';
import Button from './../../../components/button/button';
import Title from './../../../components/title/title';
import CheckBox from './../../../components/checkbox/checkbox';
//import Pagination from './../../../components/pagination/pagination';
import { withRouter } from 'react-router-dom';
import './infoStudent.css';
import './../../../style.css'
import Select from "../../../components/selectOption/select";
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000/api'

class InfoStudent extends Component{
  constructor(props) {
    super(props);
    this.state = {
      roomList: [{value: 0, label: 101}, {value: 1, label: 102}, {value: 2, label: 103}],
      showAddPopup: false,
      showEditPopup: false,
      pageActive: 1,
      mssvAdded: '',
      nameAdded: '',
      roomAdded: '',
      schoolAdded: '',
      limit: 10,
      pageList: [1,2,3,4,5],
      infoList: [],
      mssv: '',
      hoTen: '',
      roomSelected: '',
      phong: [],
      truong: []
    }
  }

  handleClosePopup = (type) => {
    switch(type){
      case 'add':
        this.setState({ showAddPopup: false });
        break;
      case 'edit':
        this.setState({ showEditPopup: false });
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
      case 'edit':
        this.setState({ showEditPopup: true });
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
  }

  getElement = name => {
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/getElement/` + name,  {
      headers: { 'x-access-token': secret.access_token }
    }).then(result => {
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

  getData = () => {
    let secret = JSON.parse(localStorage.getItem('secret'));
    let headers = {
      'x-access-token': secret.access_token
    };

    const { mssv, hoTen, roomSelected } = this.state;
    let idPhong = roomSelected;
    const options = {
      page: this.state.pageActive,
      limit: this.state.limit
    };

    if(roomSelected === '0'){
      idPhong = ''
    }
    axios.post(`/manager/infoStudent/get`,
      { options: options,
        mssv: mssv,
        hoTen: hoTen,
        idPhong: idPhong
      }, { headers: headers }
    ).then(result => {
      this.setState({
        infoList: result.data.docs
      })
    }).catch((err) => {
      let statusCode = err.response;

      if(statusCode === 401) {
        axios.get(`/user/me_access`,  {
          headers: { 'x-refresh-token': secret.refresh_token }
        }).then(res => {
          localStorage.setItem('secret', JSON.stringify(res.data));
          headers = {'x-access-token': res.data.access_token};
          axios({
            method: 'get',
            url: `/manager/infoStudent/get`,
            headers: headers,
            data: options
          }).then(result => {
            this.setState({
              infoList: result.data.docs
            })
          }).catch(err => {})
        }).catch(err => {})
      }
    })
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
    this.setState({ roomSelected: selectedOption, page: 1 })
  }
  handleSelectAddRoom = selectedOption => {
    this.setState({ roomAdded: selectedOption })
  }
  handleSelectAddSchool = selectedOption => {
    this.setState({ shoolAdded: selectedOption })
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

  render(){
    let i = 0;
    const { infoList, pageList, pageActive, roomSelected, schoolAdded, roomOptions, schoolOptions, roomAdded } = this.state;
    return(
      <div>
        <Title>
          Thông tin sinh viên
        </Title>
        <div className={'content-body'}>

          <div className={'is-header'}>
            <Row>
              <Col md={3}>
                MSSV
                <Input getValue={this.onChange} name={'mssv'} />
              </Col>
              <Col md={5}>
                Họ và tên
                <Input getValue={this.onChange} name={'hoTen'} />
              </Col>
              <Col md={3}>
                Phòng

                <Select
                  placeholder={''}
                  value={roomSelected}
                  selected={this.handleSelectRoom}
                  // onChange={()=>{this.handleSelectRoom()}}
                  options={roomOptions} />
              </Col>
              <Col md={1} className={'is-btnSearch'}>
                <Button
                  fullWidth
                  onClick={() => this.handleSearch()}
                >
                  <i className="fas fa-search"/>
                </Button>
              </Col>
            </Row>
          </div>

          <Row>
            <Col md={6} className={''}>
              <div className={'is-manipulation'}>
                <Button >
                  <i className="fas fa-file-import"/>
                </Button>
                <Button>
                  <i className="fas fa-file-export"/>
                </Button>
              </div>
            </Col>

            <Col md={6} >
              <div className={'is-manipulation'} style={{float: 'right'}}>
                <Button color={'warning'} onClick={() => this.handleShowPopup('add')}>
                  <i className="fas fa-plus"/>
                </Button>
                <Button color={'danger'}>
                  <i className="fas fa-trash-alt"/>
                </Button>
              </div>
            </Col>
          </Row>

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
                  <Select
                    placeholder={''}
                    value={roomAdded}
                    selected={this.handleSelectAddRoom}
                    options={roomOptions} />
                </Col>
                <Col md={3}>
                  Trường:
                </Col>
                <Col md={9}>
                  <Select
                    placeholder={''}
                    value={schoolAdded}
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
          {/*end modal*/}

          {/*modal popup edit student*/}
          <Modal show={this.state.showEditPopup} onHide={() =>this.handleClosePopup('edit')}>
            <Modal.Header closeButton>
              <Modal.Title>Thêm sinh viên</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
            <Modal.Footer>
              <Button variant="outline" onClick={() =>this.handleClosePopup('edit')}>
                Close
              </Button>
              <Button  onClick={() =>this.handleClosePopup('edit')}>
                Save Changes
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
                    <td>{info.idPhong.tenPhong}</td>
                    <td style={{display: 'flex', justifyContent: 'center'}}>
                      <Button color={'warning'} style={{marginRight: '15px'}} onClick={() => this.onViewDetail(info)}>
                        <i className="fas fa-edit"/>
                      </Button>
                      <CheckBox/>
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
                <Pagination>
                  <Pagination.First />
                  <Pagination.Prev />
                  {pageList && pageList.map((page, index) => {
                    if(pageActive === page)
                      return(
                        <Pagination.Item active key={index}>{page}</Pagination.Item>
                      );
                    else
                      return(
                        <Pagination.Item key={index}>{page}</Pagination.Item>
                      )
                  })}
                  <Pagination.Next />
                  <Pagination.Last />
                </Pagination>
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