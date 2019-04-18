import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from "react-toasts";
import axios from "axios";

import Input from './../../../components/input/input';
import Button from './../../../components/button/button';
import Title from './../../../components/title/title';
import './infoStudentDetail.css';
import refreshToken from "../../../../utils/refresh_token";
import Select from "../../../components/selectOption/select";
import SearchSelect from 'react-select';
import { imageFile } from '../../../function/imageFunction'
import DatePicker from "react-datepicker/es/index";
import './infoStudentFile.css';
class InfoStudentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      genderOptions: [{ value: 0, label: 'nữ' }, { value: 1, label: 'nam' }],
      roomOptions: [],
      schoolOptions: []
    }
  }

  componentWillMount() {
    this.getElement('room');
    this.getElement('school');
    const { info } = this.props.location.state;
    var birthDate = info.ngaySinh ? new Date(info.ngaySinh) : new Date();
    //var stringDate = new DbirthDate.getDate() + '/' +birthDate.getMonth()+'/'+birthDate.getFullYear();
    this.setState({
      info: { ...info, ngaySinh: birthDate }
    })
  }

  getElement = async (name) => {
    console.log('==get el')
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/getElement/` + name, {
      headers: { 'x-access-token': secret.access_token }
    }).then(result => {
      console.log('==result', result)

      switch (name) {
        case 'room':
          const roomOptions = result.data.map(room => ({ value: room._id, label: room.tenPhong }));
          roomOptions.unshift({ value: 0, label: 'Tất cả' });
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
      console.log(err)
    })
  }

  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  };

  onChange = (event) => {
    console.log('==event', event.value, typeof (event.value));
    this.setState({
      info: { ...this.state.info, [event.name]: event.value }
    })
    console.log('==state', this.state)
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
      console.log('==up success', result)
      ToastsStore.success("Cập nhật thành công!");
    }).catch(err => {
      console.log('==up err', err)
      ToastsStore.error("Cập nhật không thành công!");
    })
  }

  handleSelectGender = selectedOption => {
    console.log('==gender', selectedOption)
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

  handleSelectSchool = selectedOption => {
    this.setState({ info: { ...this.state.info, tenTruong: selectedOption } })
  }

  handleSelectRoom = selectedOption => {
    this.setState({ info: { ...this.state.info, tenPhong: selectedOption } })
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
      testImg.onload = (e) => {
        alert('Ảnh đúng')
      }
      testImg.onerror = () => {
        alert('Lỗi ảnh')
      }
			console.log(data);
		}
  }
  render() {
    console.log('==state render', this.state);
    const { info, genderOptions, schoolOptions, roomOptions } = this.state;
    const {
      hoTen,
      MSSV,
      diaChi,
      maThe,
      moTa,
      danToc,
      sdt,
      email,
      ngaySinh,
      sdtNguoiThan,
      gioiTinh,
      idPhong: { tenPhong },
      idTaiKhoan: { username },
      truong: { tenTruong },
      diemHD,
      img,

    } = info;
    console.log('img = ', img)
    var imgFile = imageFile(img)

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
                    ref={file => this.uploadFile = file}
                    onChange={this.onUpload} />
                  <label htmlFor="file-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z" /></svg>
                    {/* <span>Choose a file&hellip;</span> */}
                  </label>
                </div>
              </Col>
              <Col md={10}>
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
                    Ngày vào:
                  </Col>
                  <Col md={4}>
                    <Input />
                  </Col>
                  <Col md={2}>
                    Ngày hết hạn:
                  </Col>
                  <Col md={4}>
                    <Input />
                  </Col>
                </Row>

                <Row>
                  <Col md={2}>
                    Điểm hoạt động:
                  </Col>
                  <Col md={4}>
                    <Input value={diemHD ? diemHD : '0'} type={'number'} getValue={this.onChangeNumber} name={'diemHD'} />
                  </Col>
                  <Col md={2}>
                    Phòng:
                  </Col>
                  <Col md={4}>
                    <SearchSelect
                      placeholder={''}
                      value={tenPhong}
                      onChange={this.handleSelectRoom}
                      options={roomOptions}
                    />
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
                <Row>
                  <Col md={2}>
                    Ngành học:
                  </Col>
                  <Col md={10}>
                    <Input />
                  </Col>
                </Row>
                <Row>
                  <Col md={2}>
                    Trường:
                  </Col>
                  <Col md={10}>
                    <SearchSelect
                      placeholder={''}
                      value={tenTruong}
                      onChange={this.handleSelectSchool}
                      options={schoolOptions} />
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