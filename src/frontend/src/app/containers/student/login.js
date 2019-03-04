import React from 'react'
import { Modal, Alert,Button, InputGroup, FormControl, Container } from 'react-bootstrap'
class Example extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: true,
    };
  }

  handleClose() {
    this.setState({ show: false });
    this.props.hideLogin(false);
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    return (
      <>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Đăng Nhập</Modal.Title>
          </Modal.Header>
          <Container>
            <Modal.Body style={{ textAlign: 'center' }}>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon1"><i class="far fa-user"></i></InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="Tên đăng nhập"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon2"><i class="fas fa-unlock-alt"></i></InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="Mật khẩu"
                  aria-label="Password"
                  aria-describedby="basic-addon2"
                />
              </InputGroup>
            <p style = {{color: 'red'}}>Đăng nhập không thành công!</p>
            <Button variant="primary">Đăng nhập</Button>
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
