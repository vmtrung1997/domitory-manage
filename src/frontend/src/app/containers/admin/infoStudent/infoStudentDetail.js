import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from "react-toasts";
import axios from "axios";

import Input from './../../../components/input/input';
import Button from './../../../components/button/button';
import Title from './../../../components/title/title';
import './infoStudentDetail.css';
import './../../../style.css'
import refreshToken from "../../../../utils/refresh_token";
import Select from "../../../components/selectOption/select";
import {imageFile} from '../../../function/imageFunction'
class InfoStudentDetail extends Component{
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      genderOptions: [{value: 0, label: 'nữ'}, {value: 1, label: 'nam'}]
    }
  }

  componentWillMount() {
    this.setState({
      info: this.props.location.state.info
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
      info: {...this.state.info, [event.name]: event.value}
    })
    console.log('==state', this.state)
  }

  handleSaveChange = async() => {
    await refreshToken()
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.post(`/manager/infoStudent/update`,
      { info: this.state.info
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
    this.setState({ info: {...this.state.info, gioiTinh: selectedOption} })
  }

  render(){
    console.log('==state render', this.state);
    const { info, genderOptions } = this.state;
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
      idPhong: {tenPhong},
      idTaiKhoan: {username},
      truong: {tenTruong},
      img
    } = info;
    console.log('img = ', img)
    var imgFile = imageFile(img)
    var birthDate = new Date(ngaySinh);
    var stringDate = birthDate.getDate() + '/' +birthDate.getMonth()+'/'+birthDate.getFullYear();
    return(
      <div>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>
        <Title>
          Thông tin sinh viên
        </Title>
        <div className={'content-body'}>
          <div className={'infoDetail'}>
            <div className={'id-back'}>
              <Link to={'http://localhost:3000/admin/student'}>
              <i className="fas fa-chevron-left"/>
              <span>Trở về</span>
              </Link>
            </div>
            <Row>
              <Col md={2}>
                <div className={'id-avt'}>
                  <img alt='avater student' src={imgFile}/>
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
                    <Input value={stringDate} getValue={this.onChange} name={'username'} />
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
                    <Input/>
                  </Col>
                  <Col md={2}>
                    Ngày hết hạn:
                  </Col>
                  <Col md={4}>
                    <Input/>
                  </Col>
                </Row>

                <Row>
                  <Col md={2}>
                    Điểm hoạt động:
                  </Col>
                  <Col md={4}>
                    <Input/>
                  </Col>
                  <Col md={2}>
                    Phòng:
                  </Col>
                  <Col md={4}>
                    <Input value={tenPhong} />
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
                    <Input/>
                  </Col>
                </Row>
                <Row>
                  <Col md={2}>
                    Trường:
                  </Col>
                  <Col md={10}>
                    <Input val={tenTruong} />
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
        </div>
        <Row className={'isc-footer-btn'}>
          <Button onClick={() =>this.handleSaveChange()}>
            Lưu thay đổi
          </Button>
        </Row>
      </div>

    )
  }
}

export default InfoStudentDetail