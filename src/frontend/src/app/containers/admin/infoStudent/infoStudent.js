import React, { Component } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import Input from './../../../components/input/input';
import Button from './../../../components/button/button';
import './infoStudent.css';

class InfoStudent extends Component{
  render(){
    return(
      <div className={'infoStudent-box'}>
        <div className={'is-header'}>
          <Row>
            <Col md={3}>
              MSSV
              <Input/>
            </Col>
            <Col md={5}>
              Họ và tên
              <Input/>
            </Col>
            <Col md={3}>
              Phòng
              <Input/>
            </Col>
            <Col md={1}>
              <Button
              >
                <i className="fas fa-search"/>
              </Button>
            </Col>
          </Row>
        </div>
        <div>
          <Row>
            <Button color={'warning'}>
            <i className="fas fa-plus"/>
          </Button>
            <Button color={'danger'}>
              <i className="fas fa-trash-alt"/>
            </Button>
          </Row>
        </div>
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
            <tr>
              <td>1</td>
              <td>1512519</td>
              <td>Trần Lê Phương Thảo</td>
              <td>A102</td>
              <td></td>
            </tr>
            </tbody>
          </Table>
        </div>
      </div>
    )
  }
}

export default InfoStudent