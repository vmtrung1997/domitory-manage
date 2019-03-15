import React, { Component } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import Input from './../../../components/input/input';
import Button from './../../../components/button/button';
import Title from './../../../components/title/title';
import CheckBox from './../../../components/checkbox/checkbox';
import Pagination from './../../../components/pagination/pagination';
import './infoStudentDetail.css';
import './../../../style.css'

class InfoStudentDetail extends Component{
  render(){
    const { location: { state: { info }}} = this.props;
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
      idTaiKhoan: {username}
    } = info;

    return(
      <div>
        <Title>
          Thông tin sinh viên
        </Title>
        <div className={'content-body'}>
          <div className={'infoDetail'}>
            <div className={'id-back'}>
              <a href={'http://localhost:3000/admin/student'}>
              <i className="fas fa-chevron-left"/>
              <span>Trở về</span>
              </a>
            </div>
            <Row>
              <Col md={2}>
                <div className={'id-avt'}>
                  <img src={'https://www.ticketbuynow.com/wp-content/uploads/2018/10/IU3.jpg'}/>
                </div>
              </Col>
              <Col md={10}>
                <Row>
                  <Col md={2}>
                    Họ và tên:
                  </Col>
                  <Col md={4}>
                    <Input value={hoTen}/>
                  </Col>
                  <Col md={2}>
                    MSSV:
                  </Col>
                  <Col md={4}>
                    <Input value={MSSV} disabled/>
                  </Col>
                </Row>

                <Row>
                  <Col md={2}>
                    Username:
                  </Col>
                  <Col md={4}>
                    <Input value={username}/>
                  </Col>
                  <Col md={2}>
                    Mã thẻ:
                  </Col>
                  <Col md={4}>
                    <Input value={maThe}/>
                  </Col>
                </Row>

                <Row>
                  <Col md={2}>
                    Ngày sinh:
                  </Col>
                  <Col md={4}>
                    <Input value={ngaySinh}/>
                  </Col>
                  <Col md={2}>
                    Giới tính:
                  </Col>
                  <Col md={4}>
                    <Input value={gioiTinh ? 'Name' : 'Nữ'}/>
                  </Col>
                </Row>


                <Row>
                  <Col md={2}>
                    Email:
                  </Col>
                  <Col md={4}>
                    <Input value={email}/>
                  </Col>
                  <Col md={2}>
                    Số điện thoại:
                  </Col>
                  <Col md={4}>
                    <Input value={sdt}/>
                  </Col>
                </Row>

                <Row>
                  <Col md={2}>
                    Dân tộc:
                  </Col>
                  <Col md={4}>
                    <Input value={danToc}/>
                  </Col>
                  <Col md={2}>
                    Sđt người thân:
                  </Col>
                  <Col md={4}>
                    <Input value={sdtNguoiThan}/>
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
                    <Input value={tenPhong}/>
                  </Col>
                </Row>

                <Row>
                  <Col md={2}>
                    Địa chỉ:
                  </Col>
                  <Col md={10}>
                    <Input value={diaChi}/>
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
                    <Input/>
                  </Col>
                </Row>

                <Row>
                  <Col md={2}>
                    Mô tả:
                  </Col>
                  <Col md={10}>
                    <Input value={moTa}/>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </div>

    )
  }
}

export default InfoStudentDetail