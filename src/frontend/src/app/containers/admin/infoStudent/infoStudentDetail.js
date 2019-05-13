import React, { Component } from 'react';
import { Row, Col, Tabs, Tab, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from "react-toasts";
import axios from "axios";

import Input from './../../../components/input/input';
import Button from './../../../components/button/button';
import Title from './../../../components/title/title';
import './infoStudentDetail.css';
import refreshToken from "../../../../utils/refresh_token";
import Select from "../../../components/selectOption/select";
import SearchSelect from '../../../components/selectOption/select'
import { imageFile, defaultStudentImg } from '../../../function/imageFunction'
import DatePicker from "react-datepicker/es/index";
import './infoStudentFile.css';
import { getSchools, getMajor } from './../university/universityAction'
import Loader from '../../../components/loader/loader';
import { ChooseRoom } from './infoStudentModal'

class InfoStudentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      school: {},
      room: {},
      major: {},
      genderOptions: [{value: 0, label: 'nữ'}, {value: 1, label: 'nam'}],
      roomOptions: [],
      schoolOptions: [],
      majorOptions: [],
      loading: false,
      custom: false,
      showRoomPopup: false
    }
  }

  componentDidMount() {
    this.getElement('room');
    this.getElement('school');
    // this.getActivities('5cbad213fb6fc041ab948375');
    const { info } = this.props.location.state;
    if(info.truong){
      this.setState({
        school: {
          value: info.truong._id,
          label: info.truong.tenTruong
        }
      })
      this.getMajorOptions(info.truong._id);
    }

    if(info.idPhong)
      this.setState({
        room: {
          value: info.idPhong._id,
          label: info.idPhong.tenPhong
        }
      })

    if(info.nganhHoc)
      this.setState({
        major: {
          value: info.nganhHoc._id,
          label: info.nganhHoc.tenNganh
        }
      })

    var birthDate = info.ngaySinh ? new Date(info.ngaySinh) : new Date();
    var ngayHetHan = info.ngayHetHan ? new Date(info.ngayHetHan): new Date();
    //var stringDate = new DbirthDate.getDate() + '/' +birthDate.getMonth()+'/'+birthDate.getFullYear();
    this.setState({
      info: { ...info, ngaySinh: birthDate, ngayHetHan: ngayHetHan }
    })
  }

  getElement = async (name) => {
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/getElement/` + name, {
      headers: { 'x-access-token': secret.access_token }
    }).then(result => {

      switch (name) {
        case 'room':
          const roomOptions = result.data.map(room => ({ value: room._id, label: room.tenPhong }));
          this.setState({
            roomOptions: roomOptions
          })

          break;
        case 'school':
          const schoolOptions = result.data.map(truong => ({ value: truong._id, label: truong.tenTruong }));

          this.setState({
            schoolOptions: schoolOptions
          })
          break;

        default:
          break
      }
    }).catch(err => {
    })
  }

  getActivities = async(id) => {
    console.log('==acti 1111');

    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/infoStudent/getActivities/` + id, {
      headers: { 'x-access-token': secret.access_token }
    }).then(result => {
      console.log('==acti ', result);
      let i = 0;
      let activities = result.data.map(acti => ({key: i++, data: acti}));
      this.setState({
        activities: activities
      })
    }).catch(err => {
      console.log('==acti err', err)
    })
  }

  onChange = (event) => {
    this.setState({
      info: { ...this.state.info, [event.name]: event.value }
    })
  }

  onChangeNumber = (event) => {
    this.setState({
      info: { ...this.state.info, [event.name]: parseInt(event.value) }
    })
  }

  handleSaveChange = async () => {
    await refreshToken()
    let secret = JSON.parse(localStorage.getItem('secret'));
    this.setState({loading: true})
    axios.post(`/manager/infoStudent/update`,
      {
        info: {
          ...this.state.info,
          idTaiKhoan: this.state.info.idTaiKhoan._id,
          img: this.state.info.img,
          nganhHoc: this.state.info.nganhHoc && this.state.info.nganhHoc._id,
          truong: this.state.info.truong && this.state.info.truong._id,
          idPhong: this.state.info.idPhong && this.state.info.idPhong._id
        }
      }, { headers: { 'x-access-token': secret.access_token} }
    ).then(result => {
      ToastsStore.success("Cập nhật thành công!");
      this.setState({loading: false})
    }).catch(err => {
      ToastsStore.error("Cập nhật không thành công!");
      this.setState({loading: false})
    })
  }

  handleSelectGender = selectedOption => {
    this.setState({ info: { ...this.state.info, gioiTinh: parseInt(selectedOption) } })
  };

  getValue = (name, val) => {
    this.setState({
      info: {
        ...this.state.info,
        [name]: val
      }
    })
  }

  handleSelectSchool = (selectedOption) => {
    this.setState({
      info: {
        ...this.state.info,
        truong: {
          tenTruong: selectedOption.label,
          _id: selectedOption.value
        }
      },
      school: selectedOption
    })

    this.getMajorOptions(selectedOption.value);
  };

  getMajorOptions = (idSchool) => {
    getMajor({id: idSchool}).then(result =>{
      console.log('==get major', idSchool, result)
      if (result.data.rs === 'success') {
        let majorList = result.data.data.map(major => ({ value: major.idNganhHoc._id, label: major.idNganhHoc.tenNganh }))
        this.setState({
          majorOptions: majorList,
        })
      }
    })
  }

  chooseRoom = selectedOption => {
    this.setState({
      info: {
        ...this.state.info,
        idPhong: selectedOption
    }})
  }

  handleSelectMajor = selectedOption => {
    this.setState({
      info: {
        ...this.state.info,
        nganhHoc: {
          tenNganh: selectedOption.label,
          _id: selectedOption.value
        }
      },
      major: selectedOption
    })
  };

  onUpload = () => {
    var fileReader = new FileReader();
    if (!this.uploadFile.files.length)
      return;
    fileReader.readAsDataURL(this.uploadFile.files[0]);
    
    fileReader.onload = (e) => {
      var data = e.target.result;
      console.log(e);
      var testImg = new Image();
      testImg.src = data;
      testImg.crossOrigin = "Anonymous";
      testImg.onload = () => {
        this.setState({
          info: {
            ...this.state.info,
            img: e.target.result
            
          }
        })
      }
      testImg.onerror = () => {
        alert('Lỗi ảnh')
      }
    }
  }
  getDateType = (dateString) =>{
    let date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
  }
  render() {
    console.log('==state render', this.state);
    const { info, genderOptions, schoolOptions, roomOptions, majorOptions, school, room, major, activities } = this.state;
    const {
      hoTen,
      MSSV,
      diaChi,
      maThe,
      ngayVaoO,
      moTa,
      danToc,
      sdt,
      email,
      ngaySinh,
      sdtNguoiThan,
      gioiTinh,
      idPhong,
      idTaiKhoan,
      diemHD,
      img,
      ngayHetHan,

    } = info;
    var imgFile = img ? img : defaultStudentImg
    var ngayVaoOStr = this.getDateType(ngayVaoO)
    return (
      <div>
        <Loader loading={this.state.loading}/>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground />
        <Title>
          Thông tin sinh viên
        </Title>

        <div className={'content-body'}>
          <div className={'infoDetail'}>
            <div className={'id-back'}>
              <Link to={'/admin/student'}>
                <i className="fas fa-chevron-left" />
                <span>Trở về</span>
              </Link>
            </div>
            <Row>
              <Col md={2}>
                <div className={'id-avt'}>
                  <img alt='avater student' src={imgFile} />
                </div>
                <div className="box">
                  <input type="file"
                    name="file-1[]"
                    id="file-1"
                    className="inputfile inputfile-1"
                    ref={file => file ? this.uploadFile = file : { files: [''] }}
                    onChange={this.onUpload} />
                  <label htmlFor="file-1">
                    <span>Tải ảnh</span>
                  </label>
                </div>
              </Col>
              <Col md={10}>
                <Tabs defaultActiveKey="infoPersonal" id="uncontrolled-tab-example">
                  <Tab eventKey="infoPersonal" title="Thông tin cá nhân">
                    <div className={'id-tab_frame'}>
                      <Row>
                        <Col md={2}>
                          Họ và tên:
                        </Col>
                        <Col md={4}>
                          <Input value={hoTen} getValue={this.onChange} name={'hoTen'} />
                        </Col>
                        <Col md={2}>
                          MSSV:
                        </Col>
                        <Col md={4}>
                          <Input value={MSSV} disabled />
                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Ngày sinh:
                        </Col>
                        <Col md={4}>

                          <DatePicker
                            dateFormat='dd/MM/yyyy'
                            selected={ngaySinh}
                            onChange={(val) => this.getValue('ngaySinh', val)}
                            className='input-datepicker'
                          />
                        </Col>
                        <Col md={2}>
                          Giới tính:
                        </Col>
                        <Col md={4}>
                          <Select
                            placeholder={''}
                            value={gioiTinh}
                            selected={this.handleSelectGender}
                            options={genderOptions} />

                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Email:
                        </Col>
                        <Col md={4}>
                          <Input value={email} getValue={this.onChange} name={'email'} />
                        </Col>
                        <Col md={2}>
                          Số điện thoại:
                        </Col>
                        <Col md={4}>
                          <Input value={sdt} getValue={this.onChange} name={'sdt'} />
                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Dân tộc:
                        </Col>
                        <Col md={4}>
                          <Input value={danToc} getValue={this.onChange} name={'danToc'} />
                        </Col>
                        <Col md={2}>
                          Sđt người thân:
                        </Col>
                        <Col md={4}>
                          <Input value={sdtNguoiThan} getValue={this.onChange} name={'sdtNguoiThan'} />
                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Địa chỉ:
                        </Col>
                        <Col md={10}>
                          <Input value={diaChi} getValue={this.onChange} name={'diaChi'} />
                        </Col>
                      </Row>

                    </div>
                  </Tab>
                  <Tab eventKey="infoGeneral" title="Thông tin chung">
                    <div className={'id-tab_frame'}>
                      <Row>
                        <Col md={2}>
                          Username:
                        </Col>
                        <Col md={4}>
                          <Input value={idTaiKhoan && idTaiKhoan.username} disabled />
                        </Col>
                        <Col md={2}>
                          Mã thẻ:
                        </Col>
                        <Col md={4}>
                          <Input value={maThe} getValue={this.onChange} name={'maThe'} />
                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Ngày vào:
                        </Col>
                        <Col md={4}>
                          <Input value={ngayVaoOStr} getValue={this.onChange} name={'ngayVaoO'} disabled />
                        </Col>
                        <Col md={2}>
                          Ngày hết hạn:
                        </Col>
                        <Col md={4}>
                          <DatePicker
                            dateFormat='dd/MM/yyyy'
                            selected={ngayHetHan}
                            onChange={(val) => this.getValue('ngayHetHan', val)}
                            className='input-datepicker'
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Điểm h.động:
                        </Col>
                        <Col md={4}>
                          <Input value={diemHD ? diemHD : '0'} type={'number'} getValue={this.onChangeNumber} name={'diemHD'} />
                        </Col>
                        <Col md={2}>
                          Phòng:
                        </Col>
                        {/*<p>{this.state.info.idPhong && this.state.info.idPhong.tenPhong}</p>*/}
                        {/*<Col md={4}>*/}
                          {/*<SearchSelect*/}
                            {/*isSearchable*/}
                            {/*placeholder={''}*/}
                            {/*value={room}*/}
                            {/*onClick={()=>{this.setState({showRoomPopup: true})}}*/}
                            {/*onChange={this.handleSelectRoom}*/}
                            {/*options={roomOptions}*/}
                          {/*/>*/}
                        {/*</Col>*/}
                        <ChooseRoom
                          show={this.state.showRoomPopup}
                          label={this.state.info.idPhong ? this.state.info.idPhong.tenPhong : ''}
                          onChange={this.chooseRoom}
                          room={this.state.info.idPhong}
                        />
                      </Row>

                      <Row>
                        <Col md={2}>
                          Trường:
                        </Col>
                        <Col md={10}>
                          <SearchSelect
                            isSearchable={true}
                            placeholder={''}
                            value={school}
                            onChange={this.handleSelectSchool}
                            options={schoolOptions} />
                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Ngành học:
                        </Col>
                        <Col md={10}>
                          <SearchSelect
                            isSearchable={true}
                            placeholder={''}
                            value={major}
                            onChange={this.handleSelectMajor}
                            options={majorOptions} />
                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Mô tả:
                        </Col>
                        <Col md={10}>
                          <Input value={moTa} getValue={this.onChange} name={'moTa'} />
                        </Col>
                      </Row>
                    </div>
                  </Tab>
                  <Tab eventKey="infoActivities" title="Thông tin hoạt động">
                    <div className={'id-tab_frame'}>
                      <Table responsive bordered size="sm" hover>
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Thời gian</th>
                            <th>Tên hoạt động</th>
                            <th>Điểm</th>
                            <th>Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody>
                        {
                          activities && activities.map(acti => {
                            //let happening = acti.data.idHD.ngayBD
                            return (
                              <tr key={acti.key}>
                                <td>{acti.key + 1}</td>
                                <td>{acti.data.idHD && acti.data.idHD.ngayBD}</td>
                                <td>{acti.data.idHD && acti.data.idHD.ten}</td>
                                <td>{acti.data.isTG ? acti.data.idHD.diem : '0'}/{acti.data.idHD && acti.data.idHD.diem}</td>
                                <td>{acti.data.isTG ? "Đã tham gia" : "Chưa tham gia"}</td>
                              </tr>
                            )
                          })
                        }
                        </tbody>
                      </Table>

                      {/*<div className={'id-tab-activities_total-frame'}>*/}
                        {/*<Row>*/}
                          {/*<span>Số hoạt động đã tham gia: 3</span>*/}
                        {/*</Row>*/}
                        {/*<Row>*/}
                          {/*<span>Số hoạt động không tham gia: 1</span>*/}
                        {/*</Row>*/}
                        {/*<Row>*/}
                          {/*<span>Số hoạt động chưa tham gia: 1</span>*/}
                        {/*</Row>*/}
                        {/*<Row>*/}
                          {/*<span>Tổng điểm: 30</span>*/}
                        {/*</Row>*/}
                      {/*</div>*/}
                    </div>
                  </Tab>
                </Tabs>

              </Col>
            </Row>

          </div>
          <Row className={'isc-footer-btn'}>
            <Button onClick={() => this.handleSaveChange()}>
              Lưu thay đổi
            </Button>
          </Row>
        </div>

      </div>

    )
  }
}

export default InfoStudentDetail