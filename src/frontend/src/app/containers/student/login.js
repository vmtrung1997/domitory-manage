import React from 'react'
import { Modal, Alert,Button, InputGroup, FormControl, Container } from 'react-bootstrap'
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


  handleChange = (event) =>{
    this.setState({ [event.target.name] : event.target.value });
}

  Login = () =>{
    //Đang set cứng dữ liêu
    if(this.state.username === 'a' && this.state.password === 'a'){
      this.handleClose();
      this.props.dataLogin(this.state);
    }
    else{
      this.setState({
        wrongLogin: true
      })
    }

  }

  render() {
    return (
      <>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
          
          </Modal.Header>
          <Container>
            <Modal.Body style={{ textAlign: 'center' }}>
            <div style = {{marginBottom: '20px'}}><h2>Đăng Nhập</h2></div>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon1"><i className="far fa-user"></i></InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl 
                  name = 'username'
                  value = {this.state.username}
                  placeholder="Tên đăng nhập"
                  aria-label="username"
                  aria-describedby="basic-addon1"
                  onChange = {this.handleChange}
                 
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon2"><i className="fas fa-unlock-alt"></i></InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  name = 'password'
                  value =  {this.state.password}
                  placeholder="Mật khẩu"
                  aria-label="Password"
                  aria-describedby="basic-addon2"
                  type = 'password'
                  onChange = {this.handleChange}
                />
              </InputGroup>
            {this.state.wrongLogin && <p style = {{color: 'red'}}>*Tên tài khoản hoặc mật khẩu không đúng!</p>}
            <Button onClick = {this.Login} variant="primary">Đăng nhập</Button>
            <div>
            <a href = '#'>Quên mật khẩu?</a>
            </div>
            </Modal.Body>
          </Container>

        </Modal>
      </>
    );
  }
};
export default Example;
