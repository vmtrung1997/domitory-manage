import React from 'react'
import { ListGroup, Tab, Row, Col, Collapse } from 'react-bootstrap'

import './menuStudentDashboard.css'
import Profile from './../profileStudent/profileStudent'
import Bill from './../billStudent/billStudent'
import ListActivity from './../listActivity/listActivity'
import StudentActivity from './../studentActivity/studentActivity'
import Practise from './../practiseStudent/practiseStudent';
import RequestStay from '../../containers/student/request/requestStay'

class MenuStudent extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            open: false,
        };
    }

    render() {
        const { open } = this.state;

        return (
            <React.Fragment >
                <div className='student-dashboard'>
                    <Tab.Container id="list-group-tabs-example" defaultActiveKey="profile">
                        <Row>
                            <Col sm={3} style={{zIndex: '200'}}>
                                <div className='menu-student'>

                                    <div className='menu-student-content'>
                                        <ListGroup>
                                            <ListGroup.Item className = 'menu-student-style' eventKey = 'profile' action href='#profile'><i className="far fa-address-card"></i> &nbsp;Trang cá nhân</ListGroup.Item>
                                            <ListGroup.Item className = 'menu-student-style' onClick={() => this.setState({ open: !open })} action><i className="fas fa-skating"></i> &nbsp;Hoạt động</ListGroup.Item>
                                            <Collapse in={this.state.open}>
                                                <div id="example-collapse-text">
                                                    <ListGroup.Item className = 'menu-student-style' eventKey = 'list' action href='#list'><i className="fas fa-globe-africa sub-list-activity"></i> &nbsp;Sắp diễn ra</ListGroup.Item>
                                                    <ListGroup.Item className = 'menu-student-style' eventKey = 'myactivity' action href='#myactivity'><i className="fas fa-hiking  sub-list-activity"></i> &nbsp;Hoạt động của bạn</ListGroup.Item>

                                                    <ListGroup.Item className = 'menu-student-style' eventKey = 'practise' action href='#practise'><i className="fas fa-star-half-alt sub-list-activity"></i> &nbsp;Điểm rèn luyện</ListGroup.Item>
                                                </div>
                                            </Collapse>
                                            <ListGroup.Item className = 'menu-student-style' eventKey = 'bill' action href='#bill'><i className="fas fa-file-invoice"></i> &nbsp;Tra cứu điện nước</ListGroup.Item>
                                            <ListGroup.Item className = 'menu-student-style' eventKey = 'request' action href='#request'><i className="fas fa-flag"></i> &nbsp;Đăng ký lưu trú</ListGroup.Item>
                                            <br></br>
                                        </ListGroup>
                                    </div>
                                </div>

                            </Col>
                            <Col className = 'tab-panel-content'>
                                <Tab.Content>
                                    <Tab.Pane eventKey="profile">
                                        <Profile />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="bill">
                                        <Bill />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="list">
                                        <ListActivity />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="practise">
                                        <Practise />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="myactivity">
                                        <StudentActivity />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="request">
                                        <RequestStay />
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>;
                </div>
            </React.Fragment>
        )
    }
}

export default MenuStudent