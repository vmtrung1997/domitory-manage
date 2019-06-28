import React from "react";
import { ListGroup, Tab, Row, Col, Collapse } from "react-bootstrap";

import "./menuStudentDashboard.css";
import Profile from "./../profileStudent/profileStudent";
import Bill from "./../billStudent/billStudent";
import ListActivity from "./../listActivity/listActivity";
import StudentActivity from "./../studentActivity/studentActivity";
import Practise from "./../practiseStudent/practiseStudent";
import RequestStay from "../../containers/student/request/requestStay";

class MenuStudent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.child = React.createRef();
    this.childActivity = React.createRef();
    this.state = {
      open: false,
      dataFromListActivity: []
    };
  }

  onClick = () => {
    this.child.current.onClick();
  };
  listActivity = () => {
    this.clickChild();
  };

  dataFromListActivity = data => {
    this.setState({
      dataFromListActivity: data
    });
  };
  render() {
    const { open } = this.state;

    return (
      <React.Fragment>
        <div className="student-dashboard">
          <Tab.Container
            id="list-group-tabs-example"
            defaultActiveKey="profile"
          >
            <Row>
              <Col sm={3} style={{ zIndex: "200" }}>
                <div className="menu-student">
                  <div className="menu-student-content">
                    <ListGroup>
                      <ListGroup.Item
                        className="menu-student-style"
                        eventKey="profile"
                        action
                        href="#profile"
                      >
                        <i className="far fa-address-card" /> &nbsp;Trang cá
                        nhân
                      </ListGroup.Item>
                      <ListGroup.Item
                        className="menu-student-style"
                        onClick={() => this.setState({ open: !open })}
                        action
                      >
                        <i className="fas fa-skating" /> &nbsp;Hoạt động
                      </ListGroup.Item>
                      <Collapse in={this.state.open}>
                        <div id="example-collapse-text">
                          <ListGroup.Item
                            className="menu-student-style"
                            eventKey="list"
                            onClick={this.listActivity}
                            action
                            href="#list"
                          >
                            <i className="fas fa-globe-africa sub-list-activity" />{" "}
                            &nbsp;Sắp diễn ra
                          </ListGroup.Item>
                          <ListGroup.Item
                            className="menu-student-style"
                            eventKey="myactivity"
                            onClick={this.onClick}
                            action
                            href="#myactivity"
                          >
                            <i className="fas fa-hiking  sub-list-activity" />{" "}
                            &nbsp;Hoạt động của bạn
                          </ListGroup.Item>

                          <ListGroup.Item
                            className="menu-student-style"
                            eventKey="practise"
                            action
                            href="#practise"
                          >
                            <i className="fas fa-star-half-alt sub-list-activity" />{" "}
                            &nbsp;Điểm hoạt động
                          </ListGroup.Item>
                        </div>
                      </Collapse>
                      <ListGroup.Item
                        className="menu-student-style"
                        eventKey="bill"
                        action
                        href="#bill"
                      >
                        <i className="fas fa-file-invoice" /> &nbsp;Tra cứu điện
                        nước
                      </ListGroup.Item>
                      <ListGroup.Item
                        className="menu-student-style"
                        eventKey="request"
                        action
                        href="#request"
                      >
                        <i className="fas fa-flag" /> &nbsp;Đăng ký lưu trú
                      </ListGroup.Item>
                      <br />
                    </ListGroup>
                  </div>
                </div>
              </Col>
              <Col className="tab-panel-content">
                <Tab.Content>
                  <Tab.Pane eventKey="profile">
                    <Profile />
                  </Tab.Pane>
                  <Tab.Pane eventKey="bill">
                    <Bill />
                  </Tab.Pane>
                  <Tab.Pane eventKey="list">
                    <ListActivity
                      setClick={click => (this.clickChild = click)}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="practise">
                    <Practise />
                  </Tab.Pane>
                  <Tab.Pane eventKey="myactivity">
                    <StudentActivity ref={this.child} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="request">
                    <RequestStay />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
          ;
        </div>
      </React.Fragment>
    );
  }
}

export default MenuStudent;
