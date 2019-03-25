import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import "./profileStudent.css";
import "react-datepicker/dist/react-datepicker.css";
import MyInput from "../input/input";
import MySelectOption from "../selectOption/select";
import "./../titleStudent/titleStudent.css";
import PersonProfile from "./person/personProfile";
import StayProfile from "./stay/stayProfile";

class ProfileStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 0
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="title-header">
          <span>HỒ SƠ CÁ NHÂN</span>
        </div>
        <div className="title-header-line" />

        <div>
          <div className="profile-panel">
            <Tabs id="controlled-tab-example" defaultActiveKey="profile">
              <Tab eventKey="profile" title="Cá nhân">
                <PersonProfile />
              </Tab>
              <Tab eventKey="stay" title="Lưu trú">
                <StayProfile />
              </Tab>
            </Tabs>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ProfileStudent;