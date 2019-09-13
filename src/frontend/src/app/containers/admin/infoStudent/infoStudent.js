import React, { Component } from 'react';
import { Row, Col, Table, Modal } from 'react-bootstrap';
import axios from 'axios';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
import { withRouter } from 'react-router-dom';


import './infoStudent.css';
import SearchSelect from '../../../components/selectOption/select'
import Input from './../../../components/input/input';
import Button from './../../../components/button/button';
import Title from './../../../components/title/title';
import Checkbox from './../../../components/checkbox/checkbox';
import refreshToken from './../../../../utils/refresh_token';
import MyPagination from "../../../components/pagination/pagination";
import Loader from "../../../components/loader/loader";
import Print from './infoStudentPrint';
import { get_element, get_list_student_by_page } from './infoStudentActions'
import { AddStudentModal, ConvertStudentModal, ImportDataModal, ExportDataModal } from './infoStudentModal';
import {getMajor} from "../university/universityAction";

const PRESENT = 0, OLD = 1, PROCESSING = 2;

class InfoStudent extends Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      totalpages: 1,
      infoList: [],
      checkedAll: false,

      searchValues: {
        name: '',
        studentNumber: '',
        pageActive: 1,
        limit: 10,
        isOld: 0,
        isActive: true,
        roomSelected: {value: 0, label: "Tất cả"},
        schoolSelected: {value: 0, label: "Tất cả"},
        majorSelected: {value: 0, label: "Tất cả"},
        floorSelected: {value: 0, label: "Tất cả"},
        yearSelected: {value: 0, label: "Tất cả"}
      },

      schoolOptions: [],
      roomOptions: [],
      floorOptions: [],

      showRoomHistoryPopup: false,
      showAddPopup: false,
      showDelPopup: false,
      showPrint: false,

      infoAdded: {
        dateAdded : new Date(),
        expiredDateAdded: new Date(),
        regisExpiredDateAdded: new Date(),
      },

      phong: [],
      truong: [],

      listChecked: [],
      flag: false,

      roomHistory: [],

      valueExport: {
        hoTenEx: true,
        mssvEx: true,
        ngaySinhEx: false,
        gioiTinhEx: false,
        diaChiEx: false,
        emailEx: false,
        sdtEx: false,
        sdtNguoiThanEx: false,
        tonGiaoEx: false,
        danTocEx: false,
        ngayVaoOEx: false,
        ngayHetHanEx: false,
        diemHDEx: false,
        phongEx: false,
        truongEx: false,
        nganhHocEx: false,
        ghiChuEx: false
      }
    }
  }

  handlePopup = (type, state) => {
    switch(type){
      case 'add':
        this.setState({ showAddPopup: state });
        break;
      case 'del':
        this.setState({ showDelPopup: state });
        break;
      case 'history':
        this.setState({ showRoomHistoryPopup: state });
        break;
      case 'import':
        this.setState({ showImportPopup: state, listExpired: undefined, justFileServiceResponse: undefined });
        break;
      case 'export':
        this.setState({ showExportPopup: state });
        break;
      default:
        break
    }
  };

  onViewDetail = (mssv) => {
    this.props.history.push({
      pathname: '/admin/student/detail/'+ mssv,
      //state: { info: info }
    });
  };

  componentDidMount(){
    this.getData();
    this.getElement('room');
    this.getElement('school');
    this.getElement('floor');
    this.getMajorOptions();
    this.getYear()

    // this.modifyData();
  }

  getElement = (name) => {
    get_element(name).then(result => {
      switch (name) {
        case 'room':
          const roomOptions = result.map(room => ({value: room._id, label: room.tenPhong}));
          roomOptions.unshift({ value: -1, label: 'Chưa xác định' });
          roomOptions.unshift({ value: 0, label: 'Tất cả' });
          this.setState({
            roomOptions: roomOptions
          });
          break;

        case 'school':
          const schoolOptions = result.map(truong => ({ value: truong._id, label: truong.tenTruong }));
          schoolOptions.unshift({ value: -1, label: 'Chưa xác định' });
          schoolOptions.unshift({ value: 0, label: 'Tất cả' });
          this.setState({
            schoolOptions: schoolOptions
          });
          break;

        case 'floor':
          let i = 1;
          result.sort();
          const floorOptions = result.map(floor => {
            return {value: i++, label: floor}
          });
          floorOptions.unshift({ value: 0, label: 'Tất cả' });
          this.setState({
            floorOptions: floorOptions,
          });
          break;
        default:
          break
      }
    });
  };

  getData = () => {
    get_list_student_by_page(this.state.searchValues)
      .then(result => {
        this.setState({
          infoList: result.data.docs,
          totalPages: result.data.totalPages,
          loading: false
        })
      });
  };

  getMajorOptions = () => {
    getMajor().then(result =>{
      if (result.data.rs === 'success') {
        let majorList = result.data.data.map(major => ({ value: major._id, label: major.tenNganh }));
        majorList.unshift({ value: -1, label: 'Chưa xác định' });
        majorList.unshift({ value: 0, label: 'Tất cả' });
        this.setState({
          majorOptions: majorList,
        })
      }
    })
  };

  getYear = () => {
    let yearOptions = [{value: 0, label: 'Tất cả'}];
      var today = new Date().getFullYear();
      for(var i = today; i >= today - 5; i--){
        yearOptions.push({value: i, label: i})
      }
    this.setState({
      yearOptions: yearOptions
    })
  };

  onChange = (event) => {
    this.setState({
      searchValues: {...this.state.searchValues, [event.name]: event.value}
    })
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.setState({
      searchValues: {...this.state.searchValues, pageActive: 1},
      loading: true,
    });
    this.getData();
  };

  handleSelectRoom = selectedOption => {
    this.setState({
      searchValues: {...this.state.searchValues, roomSelected: selectedOption}
    })
  };

  handleSelected = (name, selectedOption) => {
    this.setState({
      searchValues: {...this.state.searchValues, [name]: selectedOption}
    })
  };

  clickPage = async (page) => {
    await this.setState({
      searchValues: {...this.state.searchValues, pageActive: page},
      loading: true
    });
    this.getData();
  };

  handleCheckBox = (props) => {
    if(props.chk){
      let arrDel = this.state.listChecked;
      arrDel.push(props.value);
      this.setState({
        listChecked: arrDel
      })
    } else {
      let arrDel = this.state.listChecked;
      let element = props.value;
      const i = arrDel.indexOf(element);
      if (i !== -1) {
        arrDel.splice(i,1);
      }

      this.setState({
        listChecked: arrDel
      })
    }
  };

  handleValueCheck = mssv => {
    const i = this.state.listChecked.indexOf(mssv);
    return i !== -1;
  };

  handleReload = async() => {
    await this.setState({
      searchValues: {
        ...this.state.searchValues,
        name: '',
        studentNumber: '',
        pageActive: 1,
        roomSelected: {value: 0, label: "Tất cả"},
        schoolSelected: {value: 0, label: "Tất cả"},
        majorSelected: {value: 0, label: "Tất cả"},
        floorSelected: {value: 0, label: "Tất cả"}
      },
      loading: true,
    });
    this.getData();
  };

  handleChooseOption = async (prop) => {
    switch (prop) {
      case PRESENT:
        await this.setState({
          searchValues: {
            ...this.state.searchValues,
            isOld: 0, isActive: true,
            pageActive: 1,

          },
          listChecked: [],
          checkedAll:false
        });
        break;
      case OLD:
        await this.setState({
          searchValues: {
            ...this.state.searchValues,
            isOld: 1,
            isActive: false,
            pageActive: 1,
          },
          listChecked: [],
          checkedAll:false
        });
        break;
      case PROCESSING:
        await this.setState({
          searchValues: {
            ...this.state.searchValues,
            isOld: 0,
            isActive: false,
            pageActive: 1,
          },
          listChecked: [],
          checkedAll:false
        });
        break;
    }
    this.getData();
  };

  handleRoomHistory = async(id) => {
    this.handlePopup('history', true);
    await refreshToken();
    var secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/getRoomHistory/` + id, { headers: {'x-access-token': secret.access_token} }
    ).then(result => {
      let i=1;
      const history = result.data && result.data.map(his => {
        return{key: i++, data: his}
      });
      this.setState({
        roomHistory: history
      })
    }).catch()
  };

  changeState = (key, value) => {
    this.setState({ [key]: value })
  };

  handleCheckAll = (prop) => {
    const arr = [];
    prop.chk && this.state.infoList.forEach(student => {
      arr.push(student.MSSV);
    });

    this.setState({
      checkedAll: prop.chk,
      listChecked: arr
    });
  };


  render(){
    const {
      searchValues: {
        limit,
        pageActive,
        isOld,
        isActive
      },
      infoList,
      floorOptions,
      roomHistory,
    } = this.state;
    let i = pageActive*limit - 10;
    return(
      <div>
        <Loader loading={this.state.loading}/>
        <Print data={this.state.dataPrint} show={this.state.showPrint} handleClose={() => this.changeState('showPrint', false)}/>
        <Title>
          Thông tin sinh viên
        </Title>
        <div className={'content-body'}>

          <div className={'is-header'}>
            <form onSubmit={e => this.handleSearch(e)}>
              <Row>
                <Col md={1}>
                  MSSV
                </Col>
                <Col md={3}>
                  <Input
                    getValue={this.onChange}
                    name={'studentNumber'}
                    value={this.state.searchValues ? this.state.searchValues.studentNumber : ''}
                  />
                </Col>

                <Col md={1}>
                  Trường
                </Col>
                <Col md={3}>
                  <SearchSelect
                    isSearchable={true}
                    value={this.state.searchValues.schoolSelected}
                    onChange={(selectedOption) => this.handleSelected('schoolSelected',selectedOption)}
                    options={this.state.schoolOptions}
                  />
                </Col>

                <Col md={1}>
                  Khoa
                </Col>
                <Col md={3}>
                  <SearchSelect
                    isSearchable={true}
                    value={this.state.searchValues.majorSelected}
                    onChange={(selectedOption) => this.handleSelected('majorSelected',selectedOption)}
                    options={this.state.majorOptions}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={1}>
                  Họ tên
                </Col>
                <Col md={3}>
                  <Input
                    getValue={this.onChange}
                    name={'name'}
                    value={this.state.searchValues.name}/>
                </Col>

                {/*<Col md={1}>*/}
                  {/*Năm*/}
                {/*</Col>*/}
                {/*<Col md={2}>*/}
                  {/*<SearchSelect*/}
                    {/*isSearchable={true}*/}
                    {/*value={this.state.searchValues.yearSelected}*/}
                    {/*onChange={(selectedOption) => this.handleSelected('yearSelected',selectedOption)}*/}
                    {/*options={this.state.yearOptions}*/}
                  {/*/>*/}
                {/*</Col>*/}

                <Col md={1}>
                  Phòng
                </Col>
                <Col md={3}>
                  <SearchSelect
                    isSearchable={true}
                    placeholder={''}
                    value={this.state.searchValues.roomSelected}
                    onChange={this.handleSelectRoom}
                    options={this.state.roomOptions}
                  />
                </Col>

                <Col md={1}>
                  Lầu
                </Col>
                <Col md={3}>
                  <SearchSelect
                    isSearchable={true}
                    value={this.state.searchValues.floorSelected}
                    onChange={(selectedOption) => this.handleSelected('floorSelected',selectedOption)}
                    options={floorOptions}
                  />
                </Col>
              </Row>

              {/*search*/}
              <Row style={{display: 'flex', justifyContent: 'center', margin: '15px 0'}}>
                <Col sm={3} className={'btn-search'}>
                  <Button
                    type={'submit'}
                    size={'md'}
                    fullWidth
                  >
                    <i className="fas fa-search"/>
                    Tìm kiếm
                  </Button>
                </Col>
                <Col sm={1} >
                  <Button
                    title={'Làm mới tìm kiếm'}
                    type={'submit'}
                    size={'md'}
                    color={'default'}
                    fullWidth
                    onClick={() => this.handleReload()}
                  >
                    <i className="fas fa-redo-alt"/>
                  </Button>
                </Col>
              </Row>
            </form>
            <Row className={'group-btn'}>
                <div className={'is-manipulation'}>
                  <ImportDataModal
                    show={this.state.showImportPopup}
                    onSave={()=>this.getData()}
                  />

                  <ExportDataModal
                    show={this.state.showExportPopup}
                    searchValues={this.state.searchValues}
                  />
                  {/*<Button*/}
                    {/*variant={'rounded'}*/}
                    {/*color={'success'}*/}
                  {/*>*/}
                    {/*<i className="fas fa-address-card"/>*/}
                  {/*</Button>*/}
                </div>

                <div className={'is-manipulation'} style={{float: 'right'}}>
                  <AddStudentModal
                    show={this.state.showAddPopup}
                    onSave={()=>this.getData()}
                  />

                  <ConvertStudentModal
                    function={()=>this.setState({listChecked:[], checkedAll: false})}
                    show={this.state.showDelPopup}
                    listStudent={this.state.listChecked}
                    onSave={()=>this.getData()}
                    option={this.state.searchValues.isOld}
                  />
                </div>
            </Row>
          </div>
          <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>
          {/*end modal*/}

          {/*modal popup room history student*/}
          <Modal show={this.state.showRoomHistoryPopup} onHide={() =>this.handlePopup('history', false)}>
            <Modal.Header closeButton>
              <Modal.Title>Lịch sử chuyển phòng</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                  <Table responsive bordered >
                    <thead>
                    <tr style={{textAlign: 'center'}}>
                      <th>STT</th>
                      <th>Thời gian</th>
                      <th>Phòng</th>
                    </tr>
                    </thead>
                    <tbody>
                    {roomHistory && roomHistory.map((his, index) => {
                      let { idPhong, ngayChuyen } = his.data;
                      let date = new Date(ngayChuyen);
                      return(
                        <tr key={index}>
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
              <Button onClick={() =>this.handlePopup('history', false)}>
                Thoát
              </Button>
            </Modal.Footer>
          </Modal>
          {/*end modal*/}

          <div className={'is-body'}>
            <Row className={'is-btn-option'}>
              <Col>
                <Button
                  classCustom={'info-student-tab-btn'}
                  actived={!!(!isOld && isActive)}
                  variant={'outline'}
                  color={'default'}
                  onClick={() => this.handleChooseOption(PRESENT)}
                >
                  Sinh viên hiện tại
                </Button>
                <Button
                  classCustom={'info-student-tab-btn'}
                  color={'default'}
                  actived={!!(isOld && !isActive)}
                  variant={'outline'}
                  onClick={() => this.handleChooseOption(OLD)}
                >
                  Sinh viên cũ
                </Button>
                <Button
                  classCustom={'info-student-tab-btn'}
                  actived={!!(!isOld && !isActive)}
                  color={'default'}
                  variant={'outline'}
                  onClick={() => this.handleChooseOption(PROCESSING)}
                >
                  Đang chờ xử lý
                </Button>
              </Col>
            </Row>

            <Table responsive hover bordered size="sm">
              <thead className="title-table">
              <tr style={{textAlign: 'center'}}>
                <th>STT</th>
                <th>MSSV</th>
                <th>Họ và Tên</th>
                <th>Trường</th>
                <th>Khoa</th>
                <th>Phòng</th>
                <th>
                  Thao tác
                  <span style={{display: 'inline-block', marginLeft: '20px'}}>
                    {(isActive || isOld) ?
                    <Checkbox
                      name={'checkedAll'}
                      isCheck={this.handleCheckAll}
                      checkmark={'check-mark-fix'}
                      check={this.state.checkedAll}
                    />
                      : ''
                    }
                  </span>
                </th>
              </tr>
              </thead>
              <tbody>

              {infoList && infoList.map(info => {

                return(
                  <tr
                    onDoubleClick ={() => this.onViewDetail(info.MSSV)} key={i++}
                  >
                    <td >{i}</td>
                    <td>{info.MSSV || 'Trống'}</td>
                    <td>{info.hoTen || 'Trống'}</td>
                    <td>{info.truong ? info.truong.tenTruong : 'Chưa xác định'}</td>
                    <td>{info.nganhHoc ? info.nganhHoc.tenNganh : 'Chưa xác định'}</td>
                    <td>
                      {info.idPhong ? info.idPhong.tenPhong : '-----'}
                      <div className='float-right'>
                        <Button
                          title={'Lịch sử phòng'}
                          color={'info'}
                          variant={'outline'}
                          style={{marginLeft: '15px'}}
                          onClick={() => this.handleRoomHistory(info.idTaiKhoan._id)}
                        >
                        <i className="fas fa-history"/>
                      </Button>
                      </div>
                      </td>
                    <td style={{display: 'flex', justifyContent: 'center'}}>
                       <Button
                          title={'In thẻ'}
                          color={'success'}
                          style={{marginRight: '10px'}}
                          onClick={ () => {this.changeState('showPrint', true); this.changeState('dataPrint', info) }}
                        >
                          <i className="fas fa-print"/>
                        </Button>
                      <Button
                        title={'Xem chi tiết'}
                        color={'warning'}
                        style={{marginRight: '10px'}}
                        onClick={() => this.onViewDetail(info.MSSV)}
                      >
                        <i className="fas fa-edit"/>
                      </Button>
                      {(isActive || isOld) ?
                        <Checkbox
                          name={info.MSSV}
                          isCheck={this.handleCheckBox}
                          checkmark={'check-mark-fix'}
                          check={this.handleValueCheck(info.MSSV)}
                        /> : ''
                      }
                    </td>
                  </tr>
                )
              })}
              </tbody>
            </Table>
            <Row>
              <Col md={3} className={'page-input'}>
                <label style={{marginRight:'3px'}}>Trang</label>
                <Input width='50px' textAlign='center' value={this.state.searchValues.pageActive}/>
                <label style={{marginLeft:'3px'}}>/{this.state.totalPages}</label>
              </Col>
              <Col md={9}>
                <div className={'is-pagination'}>
                  <MyPagination
                    page={this.state.searchValues.pageActive}
                    totalPages={this.state.totalPages}
                    clickPage={this.clickPage}/>
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