import React, { Component } from 'react';
import { Row, Col, Table, Pagination } from 'react-bootstrap';
import Input from './../../../components/input/input';
import Button from './../../../components/button/button';
import Title from './../../../components/title/title';
import CheckBox from './../../../components/checkbox/checkbox';
//import Pagination from './../../../components/pagination/pagination';
import { withRouter } from 'react-router-dom';
import './infoStudent.css';
import './../../../style.css'

class InfoStudent extends Component{

  onViewDetail(){
    console.log('==fine')
    this.props.history.push('/admin/id');
  }
  render(){
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
              <Col md={1} className={'is-btnSearch'}>
                <Button
                  fullWidth
                >
                  <i className="fas fa-search"/>
                </Button>
              </Col>
            </Row>
          </div>
          <div className={'is-manipulation'}>
              <Button color={'warning'}>
                <i className="fas fa-plus"/>
              </Button>
              <Button color={'danger'}>
                <i className="fas fa-trash-alt"/>
              </Button>
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

              <tr onDoubleClick ={() => this.onViewDetail()}>
                <td >1</td>
                <td>1512519</td>
                <td>Trần Lê Phương Thảo</td>
                <td>A102</td>
                <td style={{display: 'flex', justifyContent: 'center'}}>
                  <Button color={'warning'} style={{marginRight: '15px'}}>
                    <i className="fas fa-edit"/>
                  </Button>
                  <CheckBox/>
                </td>
              </tr>

              <tr>
                <td>1</td>
                <td>1512519</td>
                <td>Trần Lê Phương Thảo</td>
                <td>A102</td>
                <td style={{display: 'flex', justifyContent: 'center'}}>
                  <Button color={'warning'} style={{marginRight: '15px'}}>
                    <i className="fas fa-edit"/>
                  </Button>
                  <CheckBox/>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>1512519</td>
                <td>Trần Lê Phương Thảo</td>
                <td>A102</td>
                <td style={{display: 'flex', justifyContent: 'center'}}>
                  <Button color={'warning'} style={{marginRight: '15px'}}>
                    <i className="fas fa-edit"/>
                  </Button>
                  <CheckBox/>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>1512519</td>
                <td>Trần Lê Phương Thảo</td>
                <td>A102</td>
                <td style={{display: 'flex', justifyContent: 'center'}}>
                  <Button color={'warning'} style={{marginRight: '15px'}}>
                    <i className="fas fa-edit"/>
                  </Button>
                  <CheckBox/>
                </td>
              </tr>
              </tbody>
            </Table>
            <Row>
              <Col md={3}>
                <label style={{marginRight:'3px'}}>Page</label>
                <Input width={'50px'}/>
              </Col>
              <Col md={9}>
                <div className={'is-pagination'}>
                <Pagination>
                  <Pagination.First />
                  <Pagination.Prev />
                  <Pagination.Item>{1}</Pagination.Item>
                  <Pagination.Item>{2}</Pagination.Item>
                  <Pagination.Item active>{3}</Pagination.Item>
                  <Pagination.Item >{4}</Pagination.Item>
                  <Pagination.Item>{5}</Pagination.Item>
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