import React, { Component } from 'react';
import { Row, Col, Table, Pagination, Modal } from 'react-bootstrap';
import Input from './../../../components/input/input';
import Button from './../../../components/button/button';
import Title from './../../../components/title/title';
import CheckBox from './../../../components/checkbox/checkbox';
//import Pagination from './../../../components/pagination/pagination';
import { withRouter } from 'react-router-dom';
import './infoStudent.css';
import './../../../style.css'
import Select from "../../../components/selectOption/select";

class InfoStudent extends Component{
  constructor(props) {
    super(props);
    this.state = {
      listPhong: [{value: 0, label: 101}, {value: 1, label: 102}, {value: 2, label: 103}],
      showAddPopup: false,
    }
  }

  handleCloseAddPopup = () => {
    this.setState({ showAddPopup: false });
  }

  handleShowAddPopup = () => {
    this.setState({ showAddPopup: true });
  }

  onViewDetail(){
    console.log('==fine')
    this.props.history.push('/admin/id');
  }

  render(){
    const { listPhong } = this.state;
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
                <Select options={listPhong} value={listPhong[0]} selected={this.selected} />
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

          <Row>
            <Col md={6} className={''}>
              <div className={'is-manipulation'}>
                <Button >
                  <i className="fas fa-file-import"/>
                </Button>
                <Button>
                  <i className="fas fa-file-export"/>
                </Button>
              </div>
            </Col>

            <Col md={6} >
              <div className={'is-manipulation'} style={{float: 'right'}}>
                <Button color={'warning'} onClick={this.handleShowAddPopup}>
                  <i className="fas fa-plus"/>
                </Button>
                <Button color={'danger'}>
                  <i className="fas fa-trash-alt"/>
                </Button>
              </div>
            </Col>
          </Row>

          {/*modal popup add student*/}
          <Modal show={this.state.showAddPopup} onHide={this.handleCloseAddPopup}>
            <Modal.Header closeButton>
              <Modal.Title>Thêm sinh viên</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
            <Modal.Footer>
              <Button variant="outline" onClick={this.handleCloseAddPopup}>
                Close
              </Button>
              <Button variant="primary" onClick={this.handleCloseAddPopup}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          {/*end modal*/}

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
              <Col md={3} className={'page-input'}>
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