import React from 'react'
import { Modal, Button, Container } from 'react-bootstrap'
import md5 from 'md5';
import axios from 'axios'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import Input from '../../../components/input/input'
import './login.css'

class StudentLogin extends React.Component {
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
    axios.post(`http://localhost:4000/api/user/login`, { username: this.state.username, password: this.state.password })
      .then(res => {
        if (res.data) {
          localStorage.setItem('secret', JSON.stringify(res.data));
          this.props.hideLogin(false);
        
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
                <Link to='/'>Quên mật khẩu?</Link>
              </div>
            </Modal.Body>
          </Container>

        </Modal>
      </>
    );
  }
};

var mapStateToProps = (state) => {
  return {
      state: state
  };
}


export default connect(mapStateToProps, null)(StudentLogin);

