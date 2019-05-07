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

class InfoStudent extends Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: true,

      showRoomHistoryPopup: false,
      showAddPopup: false,
      showDelPopup: false,
      showPrint: false,
      pageActive: 1,
      totalpages: 1,
      limit: 10,
      isOld: false,

      infoAdded: {
        dateAdded : new Date(),
        expiredDateAdded: new Date()
      },

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
        this.setState({ showImportPopup: state });
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

  getElement = async(name) => {
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/getElement/` + name,  {
      headers: { 'x-access-token': secret.access_token }
    }).then(result => {
      switch (name) {
        case 'room':
          const roomOptions = result.data.map(room => ({value: room._id, label: room.tenPhong}));
          roomOptions.unshift({ value: -1, label: 'Chưa xác định' });
          roomOptions.unshift({ value: 0, label: 'Tất cả' });

          this.setState({
            roomOptionsSearch: roomOptions
          })

          break;
        case 'school':
          const schoolOptionsSearch = result.data.map(truong => ({ value: truong._id, label: truong.tenTruong }));
          const schoolOptions = [...schoolOptionsSearch];
          schoolOptionsSearch.unshift({ value: -1, label: 'Chưa xác định' });
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
      pageActive: 1,
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
      ToastsStore.success("Thêm thành công!");
      this.handlePopup('add', false);
    }).catch(err => {
      ToastsStore.error("Thêm không thành công!" + err.response.data.msg);
    })
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

  handleCheckValueExport = (obj) => {
    //this.setState({[obj.value]: obj.chk})

    this.setState({valueExport: {...this.state.valueExport, [obj.value]: obj.chk}})
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
      this.handlePopup('del', false)
    }).catch(err => {
      ToastsStore.error("Xóa không thành công!");
      this.handlePopup('del', false)
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

  handleExportData = () => {
    const { valueExport: {
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
      ghiChuEx
    }, infoList } = this.state;

    let header = {}
    if(hoTenEx)
      header.hoTen = "Họ tên"
    if(mssvEx)
      header.MSSV = "MSSV"
    if(ngaySinhEx)
      header.ngaySinh = "Ngày sinh"
    if(gioiTinhEx)
      header.gioiTinh = "Giới tính"
    if(diaChiEx)
      header.diaChi = "Địa chỉ"
    if(emailEx)
      header.email = "Email"
    if(sdtEx)
      header.sdt = "Số điện thoại"
    if(sdtNguoiThanEx)
      header.sdtNguoiThan = "số điện thoại người thân"
    if(tonGiaoEx)
      header.tonGiao = "Tôn giáo"
    if(danTocEx)
      header.danToc = "Dân tộc"
    if(ngayVaoOEx)
      header.ngayVaoO = "Ngày vào ở"
    if(ngayHetHanEx)
      header.ngayHetHan = "Ngày hết hạn"
    if(phongEx)
      header.phong = "Phòng"
    if(truongEx)
      header.truong = "Trường"
    if(nganhHocEx)
      header.nganhHoc = "Ngành học"
    // if(ghiChuEx)
    //   header.email = "Email"

    let data = infoList && infoList.map(record => {
      let gender = record.gioiTinh ? "nam" : "nữ"
      return({
        hoTen : hoTenEx ? record.hoTen : undefined,
        MSSV : mssvEx ? record.MSSV : undefined,
        ngaySinh : ngaySinhEx ? record.ngaySinh : undefined,
        gioiTinh : gioiTinhEx ? gender : undefined,
        diaChi : diaChiEx ? record.diaChi : undefined,
        email : emailEx ? record.email : undefined,
        sdt : sdtEx ? record.sdt : undefined,
        sdtNguoiThan : sdtNguoiThanEx ? record.sdtNguoiThan : undefined,
        tonGiao : tonGiaoEx ? record.tonGiao : undefined,
        danToc : danTocEx ? record.danToc : undefined,
        ngayVaoO : ngayVaoOEx ? record.ngayVaoO : undefined,
        ngayHetHan : ngayHetHanEx ? record.ngayHetHan : undefined,
        //data.diemHD : diemHDEx ? record.hoTen : undefined,
        phong : phongEx && record.idPhong ? record.idPhong.tenPhong : undefined,
        truong : truongEx && record.truong ? record.truong.tenTruong : undefined,
        nganhHoc : nganhHocEx && record.nganhHoc ? record.nganhHoc.tenNganh : undefined,
        ghiChu : ghiChuEx ? record.hoTen : undefined
    })})

    data.unshift(header)

    console.log('==report', data)

    var ws = XLSX.utils.json_to_sheet(data, {skipHeader:true});

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

    XLSX.writeFile(wb, "report.xlsx");
    this.handlePopup('export', false)
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
      infoAdded: { dateAdded, expiredDateAdded},
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
                    onClick={()=>this.handlePopup('import', true)}
                  >
                    <i className="fas fa-file-import"/>
                  </Button>
                  <Button
                    variant={'rounded'}
                    onClick={()=>this.handlePopup('export', true)}
                  >
                    <i className="fas fa-file-export"/>
                  </Button>
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
                  <Button color={'warning'} onClick={() => this.handlePopup('add',true)}>
                    <i className="fas fa-plus"/>
                  </Button>
                  <Button color={'danger'}>
                    <i className="fas fa-trash-alt" onClick={() => this.handlePopup('del', true)}/>
                  </Button>
                </div>
              </Col>
            </Row>
          </div>

          {/*modal popup add student*/}
          <Modal show={this.state.showAddPopup} onHide={() =>this.handlePopup('add', false)}>
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
              <Button variant="outline" onClick={() =>this.handlePopup('add', false)}>
                Đóng
              </Button>
              <Button  onClick={() =>this.handleSubmitAddStudent()}>
                Thêm tài khoản
              </Button>
            </Modal.Footer>
          </Modal>
          <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>

          {/*end modal*/}

          {/*modal popup delete student*/}
          <Modal show={this.state.showDelPopup} onHide={() =>this.handlePopup('del', false)}>
            <Modal.Header closeButton>
              <Modal.Title>Sau khi xóa những sinh viên này sẽ là sinh viên cũ!</Modal.Title>
            </Modal.Header>
            {/*<Modal.Body>Bạn có chắc chắn muốn xóa những sinh viên này?</Modal.Body>*/}
            <Modal.Footer>
              <Button variant="outline" onClick={() =>this.handlePopup('del', false)}>
                Hủy
              </Button>
              <Button  onClick={() =>this.handleDelStudent()}>
                Đồng ý
              </Button>
            </Modal.Footer>
          </Modal>
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

          {/*modal popup upload file*/}
          <Modal
            size={'lg'}
            show={this.state.showImportPopup}
            onHide={() =>this.handlePopup('import', false)}
          >
            <Modal.Body>
              <input type="file" name="file" onChange={this.filesOnChange}/>
              <p className={'noti-text-style'}><b>{this.state.justFileServiceResponse}</b></p>

              {this.state.listExpired ?
                <Table responsive bordered size="sm">
                  <thead className="title-table">
                  <tr style={{textAlign: 'center'}}>
                    <th>STT</th>
                    <th>MSSV</th>
                    <th>Họ và Tên</th>
                    <th>Lỗi</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.state.listExpired.map(info => {
                    return (
                      <tr key={info.key}>
                        <td>{i++}</td>
                        <td>{info.data.mssv || ''}</td>
                        <td>{info.data.hoTen || ''}</td>
                        <td className={'noti-text-style'}>{info.msg || ''}</td>

                      </tr>
                    )
                  })}

                  </tbody>
                </Table>
                :
                <div>
                  <i className={'noti-text-style'}><u>Lưu ý:</u> file excel(.xlsx) cần có dạng như sau</i>
                <Table responsive hover bordered size="sm">
                  <thead className="title-excel">
                  <tr>
                    <td></td>
                    <td>A</td>
                    <td>B</td>
                    <td>C</td>
                    <td>D</td>
                    <td>E</td>

                  </tr>
                  </thead>
                  <tbody>

                  <tr key={0}>
                    <td className="title-excel">1</td>
                    <td>STT</td>
                    <td>Họ Tên</td>
                    <td>MSSV</td>
                    <td>Ngày sinh</td>
                    <td></td>
                  </tr>

                  <tr key={1}>
                    <td className="title-excel">2</td>
                    <td>1</td>
                    <td>Nguyễn Văn A</td>
                    <td>1512519</td>
                    <td>29/10/1997</td>
                    <td></td>
                  </tr>

                  <tr key={2}>
                    <td className="title-excel">3</td>
                    <td>2</td>
                    <td>Nguyễn Văn B</td>
                    <td>1512510</td>
                    <td>01/11/1997</td>
                    <td></td>
                  </tr>

                  <tr key={3}>
                    <td className="title-excel">4</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                  </tbody>
                </Table>
                </div>
              }
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" onClick={() =>this.handlePopup('import', false)}>
                Cancel
              </Button>
              <Button  onClick={() => this.handleImportData()}>
                Upload
              </Button>
            </Modal.Footer>
          </Modal>
          {/*end modal*/}

          {/*modal popup export file*/}
          <Modal show={this.state.showExportPopup} onHide={() =>this.handlePopup('export', false)}>
            <Modal.Header closeButton>
            <Modal.Title>Xuất file</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Checkbox
                    check={true}
                    label={'Họ và tên'}
                    name={'hoTenEx'}
                    isCheck={this.handleCheckValueExport}
                  />
                </Col>
                <Col md={6}>
                  <Checkbox
                    check={danTocEx}
                    label={'Dân tộc'}
                    name={'danTocEx'}
                    isCheck={this.handleCheckValueExport}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Checkbox
                    check={mssvEx}
                    label={'MSSV'}
                    name={'mssvEx'}
                    isCheck={this.handleCheckValueExport}
                  />
                </Col>
                <Col md={6}>
                  <Checkbox
                    check={ngayVaoOEx}
                    label={'Ngày vào'}
                    name={'ngayVaoOEx'}
                    isCheck={this.handleCheckValueExport}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Checkbox
                    check={ngaySinhEx}
                    label={'Ngày sinh'}
                    name={'ngaySinhEx'}
                    isCheck={this.handleCheckValueExport}
                  />
                </Col>
                <Col md={6}>
                  <Checkbox
                    check={ngayHetHanEx}
                    label={'Ngày hết hạn'}
                    name={'ngayHetHanEx'}
                    isCheck={this.handleCheckValueExport}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Checkbox
                    check={gioiTinhEx}
                    label={'Giới tính'}
                    name={'gioiTinhEx'}
                    isCheck={this.handleCheckValueExport}
                  />
                </Col>
                <Col md={6}>
                  <Checkbox
                    check={diemHDEx}
                    label={'Điểm hoạt động'}
                    name={'diemHDEx'}
                    isCheck={this.handleCheckValueExport}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Checkbox
                    check={diaChiEx}
                    label={'Địa chỉ'}
                    name={'diaChiEx'}
                    isCheck={this.handleCheckValueExport}
                  />
                </Col>
                <Col md={6}>
                  <Checkbox
                    check={phongEx}
                    label={'Phòng'}
                    name={'phongEx'}
                    isCheck={this.handleCheckValueExport}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Checkbox
                    check={emailEx}
                    label={'Email'}
                    name={'emailEx'}
                    isCheck={this.handleCheckValueExport}
                  />
                </Col>
                <Col md={6}>
                  <Checkbox
                    check={truongEx}
                    label={'Trường'}
                    name={'truongEx'}
                    isCheck={this.handleCheckValueExport}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Checkbox
                    check={sdtEx}
                    label={'Số điện thoại'}
                    name={'sdtEx'}
                    isCheck={this.handleCheckValueExport}
                  />
                </Col>
                <Col md={6}>
                  <Checkbox
                    check={nganhHocEx}
                    label={'Ngành học'}
                    name={'nganhHocEx'}
                    isCheck={this.handleCheckValueExport}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Checkbox
                    check={sdtNguoiThanEx}
                    label={'Số điện thoại người thân'}
                    name={'sdtNguoiThanEx'}
                    isCheck={this.handleCheckValueExport}
                  />
                </Col>
                <Col md={6}>
                  <Checkbox
                    check={ghiChuEx}
                    label={'Ghi chú'}
                    name={'ghiChuEx'}
                    isCheck={this.handleCheckValueExport}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Checkbox
                    check={tonGiaoEx}
                    label={'Tôn giáo'}
                    name={'tonGiaoEx'}
                    isCheck={this.handleCheckValueExport}
                  />
                </Col>
              </Row>

            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" onClick={() =>this.handlePopup('export', false)}>
                Cancel
              </Button>
              <Button id={'saveFile'} onClick={() => this.handleExportData()}>
                Save file
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