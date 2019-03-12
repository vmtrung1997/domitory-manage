import React from 'react'
import { Modal, Alert, Button, InputGroup, FormControl, Container } from 'react-bootstrap'
import md5 from 'md5';
import Input from '../../../components/input/input'
import './login.css'
import axios from 'axios'
import jwt_decode from 'jwt-decode';

class Example extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: true,
      username: '',
      password: '',
      wrongLogin: false
    };
  }

  handleClose() {
    this.setState({ show: false });
    this.props.hideLogin(false);
  }

  handleShow() {
    this.setState({ show: true });
  }


  getValue = (obj) => {
    if (obj.name === 'password') {
      this.setState({ [obj.name]: md5(obj.value) })
    } else {
      this.setState({ [obj.name]: obj.value })
    }
  }

  Login = () => {
    var self = this;
    axios.post(`http://localhost:4000/api/user/login`, { username: this.state.username, password: this.state.password })
      .then(res => {
        if (res.data) {
          localStorage.setItem('secret', JSON.stringify(res.data));

          const decode = jwt_decode(res.data.access_token);
          var id = decode.user._id;
          console.log(decode);
          axios.defaults.headers['x-access-token'] = res.data.access_token;
    
          axios.get(`http://localhost:4000/api/student/get-info`, {id: id}).then(res => {
            // console.log(res);
            // let { from } = self.props.location.state || { from: { pathname: "/dashboard" } }
            // self.props.history.push(from)
          })
        }
      })
      .catch(err => {
        this.setState({
          isNotify: true
        })
      })

  }

  render() {
    return (
      <>
        <Modal show={this.state.show} onHide={this.handleClose} dialogClassName='title-modal'>
          <Modal.Header closeButton>

          </Modal.Header>
          <Container>
            <Modal.Body style={{ textAlign: 'center' }}>
              <div style={{ paddingBottom: '10px' }}><h2>Đăng Nhập</h2></div>

              <Input
                name='username'
                placeholder="Tên đăng nhập"
                getValue={this.getValue}>
              </Input>
              <Input
                name='password'
                placeholder="Mật khẩu"
                type='password'
                getValue={this.getValue}>
              </Input>
              {this.state.wrongLogin && <p style={{ color: 'red' }}>*Tên tài khoản hoặc mật khẩu không đúng!</p>}
              <Button onClick={this.Login} variant="primary">Đăng nhập</Button>
              <div>
                <a href='#'>Quên mật khẩu?</a>
              </div>
            </Modal.Body>
          </Container>

        </Modal>
      </>
    );
  }
};
export default Example;
