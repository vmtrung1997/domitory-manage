import React, { Component } from 'react';
import {Row, Col, Tabs, Tab, Table} from 'react-bootstrap';
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
import {imageFile, defaultStudentImg} from '../../../function/imageFunction'
import DatePicker from "react-datepicker/es/index";
import './infoStudentFile.css';
class InfoStudentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      truong: {},
      phong: {},
      genderOptions: [{value: 0, label: 'nữ'}, {value: 1, label: 'nam'}],
      roomOptions: [],
      schoolOptions: [],

      custom: false,
    }
  }

  componentWillMount() {
    this.getElement('room');
    this.getElement('school');
    const { info } = this.props.location.state;
    if(info.truong)
      this.setState({
        truong: {
          value: info.truong._id,
          label: info.truong.tenTruong
        }
      })
    if(info.idPhong)
      this.setState({
        phong: {
          value: info.idPhong._id,
          label: info.idPhong.tenPhong
        }
      })
    var birthDate = info.ngaySinh ? new Date(info.ngaySinh) : new Date();
    //var stringDate = new DbirthDate.getDate() + '/' +birthDate.getMonth()+'/'+birthDate.getFullYear();
    this.setState({
      info: { ...info, ngaySinh: birthDate }
    })
  }

  getElement = async(name) => {
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/getElement/` + name, {
      headers: { 'x-access-token': secret.access_token }
    }).then(result => {

      switch (name) {
        case 'room':
          const roomOptions = result.data.map(room => ({value: room._id, label: room.tenPhong}));
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

  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  };

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
    axios.post(`/manager/infoStudent/update`,
      {
        info: this.state.info
      }, { headers: { 'x-access-token': secret.access_token } }
    ).then(result => {
      ToastsStore.success("Cập nhật thành công!");
    }).catch(err => {
      ToastsStore.error("Cập nhật không thành công!");
    })
  }

  handleSelectGender = selectedOption => {
    this.setState({ info: {...this.state.info, gioiTinh: parseInt(selectedOption)} })
  };

  getValue = (name, val) => {
    this.setState({
      info: {
        ...this.state.info,
        [name]: val
      }
    })
  }

  handleSelectSchool = selectedOption => {
    this.setState({
      info: {
        ...this.state.info,
        truong: {
          tenTruong: selectedOption.label,
          _id: selectedOption.value
        }
      },
      truong: selectedOption
    })
  }

  handleSelectRoom = selectedOption => {
    this.setState({
      info: {
        ...this.state.info,
        idPhong: {
          tenPhong: selectedOption.label,
          _id: selectedOption.value
        }
      },
      phong: selectedOption
    })
  }
  fixdata = (data) => {
		var o = "", l = 0, w = 10240;
		for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
		o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
		return o;
	}
  onUpload = () => {
    var fileReader = new FileReader();
    var self = this;
    fileReader.readAsDataURL(this.uploadFile.files[0]);
    fileReader.onload = (e) => {
      var data = e.target.result;
      var testImg = new Image();
      testImg.src = data;
      testImg.onload = (event) => {
        console.log(e.target);
        this.setState({info: {...this.state.info, img: e.target.result}})
      }
      testImg.onerror = () => {
        alert('Lỗi ảnh')
      }
		}
  }
  render() {
    console.log('==state render', this.state);
    const { info, genderOptions, schoolOptions, roomOptions, truong, phong } = this.state;
    const {
      hoTen,
      MSSV,
      diaChi,
      maThe,
      ngayVaoO,
      ngayHetHan,
      moTa,
      danToc,
      sdt,
      email,
      ngaySinh,
      sdtNguoiThan,
      gioiTinh,
      idPhong,
      idTaiKhoan: {username},
      diemHD,
      img,

    } = info;
    var imgFile = typeof img === 'string'?img: (imageFile(img)?imageFile(img):defaultStudentImg)

    return (
      <div>
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
                    ref={file => file?this.uploadFile = file:{files:['']}}
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
                          <Input value={danToc}  getValue={this.onChange} name={'danToc'} />
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
                          <Input value={username} disabled />
                        </Col>
                        <Col md={2}>
                          Mã thẻ:
                        </Col>
                        <Col md={4}>
                          <Input value={maThe} getValue={this.onChange} name={'username'} />
                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Ngày vào:
                        </Col>
                        <Col md={4}>
                          <Input value={ngayVaoO} getValue={this.onChange} name={'ngayVaoO'} disabled/>
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
                          <Input value={diemHD ? diemHD : '0'} type={'number'} getValue={this.onChangeNumber} name={'diemHD'}/>
                        </Col>
                        <Col md={2}>
                          Phòng:
                        </Col>
                        <Col md={4}>
                          <SearchSelect
                            isSearchable
                            placeholder={''}
                            value={phong}
                            onChange={this.handleSelectRoom}
                            options={roomOptions}
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Trường:
                        </Col>
                        <Col md={10}>
                          {/*<SearchSelect*/}
                            {/*isSearchable={true}*/}
                            {/*placeholder={''}*/}
                            {/*value={schoolSelected}*/}
                            {/*onChange={this.handleSelectSchool}*/}
                            {/*options={schoolOptionsSearch}*/}
                          {/*/>*/}
                          <SearchSelect
                            isSearchable={true}
                            placeholder={''}
                            value={truong}
                            onChange={this.handleSelectSchool}
                            options={schoolOptions} />
                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Ngành học:
                        </Col>
                        <Col md={10}>
                          <Input/>
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
                            <tr>
                              <td>1</td>
                              <td>9:00 08/03/2019</td>
                              <td>Mừng ngày phụ nữ Việt Nam</td>
                              <td>10/10</td>
                              <td>Chưa diễn ra</td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>9:00 08/03/2019</td>
                              <td>Mừng ngày phụ nữ Việt Nam</td>
                              <td>10/10</td>
                              <td>Đã tham gia</td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>9:00 08/03/2019</td>
                              <td>Mừng ngày phụ nữ Việt Nam</td>
                              <td>10/10</td>
                              <td>Không tham gia</td>
                            </tr>
                        </tbody>
                      </Table>

                      <div className={'id-tab-activities_total-frame'}>
                        <Row>
                          <span>Số hoạt động đã tham gia: 3</span>
                        </Row>
                        <Row>
                          <span>Số hoạt động không tham gia: 1</span>
                        </Row>
                        <Row>
                          <span>Số hoạt động chưa tham gia: 1</span>
                        </Row>
                        <Row>
                          <span>Tổng điểm: 30</span>
                        </Row>
                      </div>
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