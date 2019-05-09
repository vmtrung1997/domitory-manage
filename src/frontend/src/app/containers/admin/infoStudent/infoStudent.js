import React, { Component } from 'react';
import { Row, Col, Table, Modal } from 'react-bootstrap';
import axios from 'axios';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
import { withRouter } from 'react-router-dom';
import XLSX from 'xlsx';
import DatePicker from "react-datepicker/es/index";


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
import { AddStudentModal, MarkOldStudentModal, ImportDataModal, ExportDataModal } from './infoStudentModal';

class InfoStudent extends Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      totalpages: 1,
      infoList: [],

      searchValues: {
        name: '',
        studentNumber: '',
        pageActive: 1,
        limit: 10,
        isOld: false,
        roomSelected: {},
        schoolSelected: {}
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
    console.log('==handle popup')
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

  onViewDetail = (info) => {
    this.props.history.push({
      pathname: '/admin/student/detail',
      state: { info: info }
    });
  }

  componentDidMount(){
    this.getData();
    this.getElement('room');
    this.getElement('school');
    this.getElement('floor');
    // this.modifyData();
  }

  getElement = (name) => {
    console.log('==ahihi')
    get_element(name).then(result => {
      switch (name) {
        case 'room':
          this.setState({
            roomOptions: result
          });
          break;

        case 'school':
          this.setState({
            schoolOptions: result
          });
          break;

        case 'floor':
          this.setState({
            floorOptions: result,
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

  onChange = (event) => {
    this.setState({
      searchValues: {...this.state.searchValues, [event.name]: event.value}
    })
  };

  handleSearch = () => {
    this.setState({
      pageActive: 1,
      loading: true,
    });
    this.getData();
  }

  handleSelectRoom = selectedOption => {
    this.setState({
      searchValues: {...this.state.searchValues, roomSelected: selectedOption, pageActive: 1}
    })
  }
  handleSelectSchool = selectedOption => {
    this.setState({
      searchValues: {...this.state.searchValues, schoolSelected: selectedOption, pageActive: 1}
    })
  }
  handleSelectFloor = selectedOption => {
    this.setState({ floorSelected: selectedOption, pageActive: 1 })
  }

  clickPage = async (page) => {
    await this.setState({
      pageActive: page,
      loading: true
    });
    this.getData();
  }

  handleCheckDelete = (props) => {
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
  }

  handleCheckValueExport = (obj) => {
    this.setState({valueExport: {...this.state.valueExport, [obj.value]: obj.chk}})
  }

  handleValueCheck = mssv => {
    const i = this.state.listChecked.indexOf(mssv);
    return i !== -1;
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
    this.handlePopup('history', true)
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

  filesOnChange = (e) =>{
    let file = e.target.files[0];

    this.setState({
      fileImport: file
    });
  };

  convertData = async (file) => {
    return new Promise ( (resolve, reject) => {
      let reader = new FileReader();
      let temp = [];
      reader.onload =  function (e) {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, {type: 'array'});

        let worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let listNewStudent = XLSX.utils.sheet_to_json(worksheet, {header:["stt","hoTen","mssv","ngaySinh"]});
        console.log('==file', listNewStudent);

        resolve(listNewStudent)
      };
      reader.readAsArrayBuffer(file);

    })
  };

  // checkFileImport = (data) => {
  //   if (data)
  //     data.map(i => {
  //
  //     })
  // }

  handleImportData = async(props) => {

    if (!this.state.hasOwnProperty('fileImport')) {
      this.setState({
        justFileServiceResponse: 'Vui lòng chọn 1 file!!'
      });
      return;
    }
    //props.e.preventDefault();
    this.setState({
      justFileServiceResponse: 'Vui lòng chờ!!'
    });

    // const dataImport = await this.convertData(this.state.fileImport);
    this.convertData(this.state.fileImport).then(async(resolve) => {
      console.log('==file 2222', resolve);
      resolve.shift();

      await refreshToken();
      var secret = JSON.parse(localStorage.getItem('secret'));
      axios.post(`/manager/infoStudent/importFile`,{
          data: resolve,
          expireDay: new Date()
        }, { headers: {'x-access-token': secret.access_token} }
      ).then(result => {
        console.log('==import success', result);
        this.setState({
          justFileServiceResponse: 'Thêm thành công!!'
        });
      }).catch(err => {
        console.log('==import err', err.response.data);
        this.setState({
          justFileServiceResponse: 'Những sinh viên sau thêm chưa thành công!!',
          listExpired: err.response.data.list
        });
      })
    })
  };

  changeState = (key, value) => {
    console.log(11)
    this.setState({ [key]: value })
  }



  render(){
    console.log('==render state', this.state);
    const {
      searchValues: {
        limit,
        pageActive,
      },
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
      infoAdded: { dateAdded, expiredDateAdded, regisExpiredDateAdded},
      valueExport :{
        hoTenEx,
        mssvEx,
        ngaySinhEx,
        gioiTinhEx,
        diaChiEx,
        emailEx,
        sdtEx,
        sdtNguoiThanEx,
        tonGiaoEx,
        danTocEx,
        ngayVaoOEx,
        ngayHetHanEx,
        diemHDEx,
        phongEx,
        truongEx,
        nganhHocEx,
        ghiChuEx,
      }
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
            <Row>
              <Col md={1}>
                MSSV
              </Col>
              <Col md={2}>
                <Input getValue={this.onChange} name={'studentNumber'} value={this.state.searchValues ? this.state.searchValues.studentNumber : ''}/>
              </Col>

              <Col md={1}>
                Họ tên
              </Col>
              <Col md={4}>
                <Input getValue={this.onChange} name={'name'} value={this.state.searchValues.name}/>
              </Col>

              <Col md={1}>
                Phòng
              </Col>
              <Col md={2}>
                <SearchSelect
                  isSearchable={true}
                  placeholder={''}
                  value={this.state.searchValues.roomSelected}
                  onChange={this.handleSelectRoom}
                  options={this.state.roomOptions}
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
                  value={this.state.searchValues.schoolSelected}
                  onChange={this.handleSelectSchool}
                  options={this.state.schoolOptions}
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

            {/*search*/}
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
                  <ImportDataModal
                    show={this.state.showImportPopup}
                  />

                  <ExportDataModal
                    show={this.state.showExportPopup}
                    searchValues={this.state.searchValues}
                  />

                  <Button
                    variant={'rounded'}
                    color={'success'}
                  >
                    <i className="fas fa-address-card"/>
                  </Button>
                </div>
              </Col>

              <Col md={6} >
                <div className={'is-manipulation'} style={{float: 'right'}}>
                  <AddStudentModal
                    show={this.state.showAddPopup}
                  />

                  <MarkOldStudentModal
                    function={()=>this.setState({listChecked:[]})}
                    show={this.state.showDelPopup}
                    listStudent={this.state.listChecked}
                  />
                </div>
              </Col>
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
                  variant={isOld ? 'outline' :  'default'}
                  color={'default'}
                  onClick={() => this.handleChooseOption(false)}
                >
                  Hiện tại
                </Button>
                <Button
                  color={'default'}
                  variant={isOld ? 'default' : 'outline'}
                  onClick={() => this.handleChooseOption(true)}
                >
                  Sinh viên cũ
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
                      <div className='float-right'> <Button color={'info'} variant={'outline'} style={{marginLeft: '15px'}} onClick={() => this.handleRoomHistory(info.idTaiKhoan._id)}>
                        <i className="fas fa-history"/>
                      </Button>
                      </div>
                      </td>
                    <td style={{display: 'flex', justifyContent: 'center'}}>
                       <Button
                          title={'In thẻ'}
                          color={'success'}
                          style={{marginRight: '10px'}}
                          onClick={ e => {this.changeState('showPrint', true); this.changeState('dataPrint', info) }}
                        >
                          <i className="fas fa-print"/>
                        </Button>
                      <Button color={'warning'} style={{marginRight: '10px'}} onClick={() => this.onViewDetail(info)}>
                        <i className="fas fa-edit"/>
                      </Button>
                      {!isOld &&
                        <Checkbox name={info.MSSV} isCheck={this.handleCheckDelete} check={this.handleValueCheck(info.MSSV)}/>
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
                <Input width='50px' textAlign='center' value={this.state.pageActive}/>
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