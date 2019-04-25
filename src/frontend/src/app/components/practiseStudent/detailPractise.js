import React from "react";
import {
  Modal,
  Button,
  Table
} from "react-bootstrap";
import { Link } from "react-router-dom";

class DetailPractise extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false
    };
  }

  handleClose() {
    this.setState({ show: false });
    //this.props.hideLogin(false);
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    return (
      <React.Fragment>
        <span style={{ cursor: "pointer" }} onClick={this.handleShow}>
          {" "}
          <i className="far fa-eye" />
        </span>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết điểm hoạt động</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td colSpan="2">Larry the Bird</td>
                  <td>@twitter</td>
                </tr>
              </tbody>
            </Table>
            ;
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>

          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}
export default DetailPractise;
