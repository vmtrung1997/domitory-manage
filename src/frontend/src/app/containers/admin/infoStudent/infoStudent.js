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
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000/api'

class InfoStudent extends Component{
  constructor(props) {
    super(props);
    this.state = {
      roomList: [{value: 0, label: 101}, {value: 1, label: 102}, {value: 2, label: 103}],
      showAddPopup: false,
      pageActive: 1,
      limit: 10,
      pageList: [1,2,3,4,5],
      infoList: [],
      mssv: '',
      hoTen: '',
      phong: ''
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

  componentWillMount(){
    this.callServer();
  }

  callServer = () => {
    let secret = JSON.parse(localStorage.getItem('secret'));
    let headers = {
      'x-access-token': secret.access_token
    };
    const { mssv, hoTen } = this.state;
    const options = {
      page: this.state.page,
      limit: this.state.limit
    };
    axios.post(`/manager/infoStudent/get`,
      { options: options,
        MSSV: mssv,
        hoTen: hoTen
      }, { headers: headers }
    ).then(result => {
      console.log('==success: ', result);
      this.setState({
        infoList: result.data.docs
      })
    }).catch(err => {
      console.log('==get info err: ', err)
      axios.get(`/user/me_access`,  {
        headers: { 'x-refresh-token': secret.refresh_token }
      }).then(res => {
        console.log('==get token sucess: ', res)
        localStorage.setItem('secret', JSON.stringify(res.data));
        headers = {'x-access-token': res.data.access_token};
        console.log('==headers', headers);
        axios({
          method: 'get',
          url: `/manager/infoStudent/get`,
          headers: headers,
          data: options
        }).then(result => {
          console.log('==success: ', result);
          this.setState({
            infoList: result.data.docs
          })
        }).catch(err => {
          console.log('==get 2', err)
        })
      }).catch(err => {
        console.log('==get token err', err)
      })

    })
  }
  onChange = (event) => {
    this.setState({
      [event.name]: event.value
    })
  }

  handleSearch = () => {
    this.callServer();
  }

  render(){
    console.log('==state', this.state);
    let i = 1;
    const { roomList, infoList, pageList, pageActive, mssv, hoTen, Phong } = this.state;
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
                <Input getValue={this.onChange} name={'mssv'} />
              </Col>
              <Col md={5}>
                Họ và tên
                <Input getValue={this.onChange} name={'hoTen'} />
              </Col>
              <Col md={3}>
                Phòng
                <Select options={roomList} value={roomList[0]} selected={this.selected} />
              </Col>
              <Col md={1} className={'is-btnSearch'}>
                <Button
                  fullWidth
                  onClick={() => this.handleSearch()}
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

              {infoList && infoList.map(info => {

                return(
                  <tr onDoubleClick ={() => this.onViewDetail()}>
                    <td >{i++}</td>
                    <td>{info.MSSV}</td>
                    <td>{info.hoTen}</td>
                    <td>{info.idPhong.tenPhong}</td>
                    <td style={{display: 'flex', justifyContent: 'center'}}>
                      <Button color={'warning'} style={{marginRight: '15px'}}>
                        <i className="fas fa-edit"/>
                      </Button>
                      <CheckBox/>
                    </td>
                  </tr>
                )
              })}
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
                  {pageList && pageList.map(page => {
                    if(pageActive === page)
                      return(
                        <Pagination.Item active>{page}</Pagination.Item>
                      );
                    else
                      return(
                        <Pagination.Item>{page}</Pagination.Item>
                      )
                  })}
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