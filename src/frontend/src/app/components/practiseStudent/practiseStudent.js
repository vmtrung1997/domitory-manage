import React from "react";
import { Table, Col, Row } from "react-bootstrap";
import "./../titleStudent/titleStudent.css";
import "./../tableStudentTextStyle/tableStudentTextStyle.css";
import Axios from "axios";
import { connect } from "react-redux";
import refreshToken from "./../../../utils/refresh_token";
import jwt_decode from "jwt-decode";
import DatePicker from "../../components/datePicker/datePicker";
import Button from "./../../components/button/button";

class PractiseStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      point: 0,
      fromDate: new Date(),
      toDate: new Date(),
      listActivity: []
    };
  }

  getPoint = async () => {
    await refreshToken();
    var secret = localStorage.getItem("secret");

    if (secret) {
      const decode = jwt_decode(secret);
      secret = JSON.parse(secret);
      if (decode.user.profile) {
        var id = decode.user.profile._id;
        Axios.post("/student/get-point", {
          id: id,
          fromDate: this.state.fromDate,
          toDate: this.state.toDate
        }).then(rs => {
          if (rs.status === 200) {
            if (rs.data.data.activities.length > 0) {
              this.setState({
                listActivity: rs.data.data.activities,
                point: rs.data.data.point
              });
            }
          }
          //   if (rs.status === 204) {
          //     window.alert("Không có dữ liệu");
          //   }
          // }
        });
      }
    }
  };

  componentDidMount() {
    // this.getPoint();
  }

  render() {
    return (
      <React.Fragment>
        <div className="padding-menu">
          <div>
            <h1 className="title-header">ĐIỂM HOẠT ĐỘNG</h1>
          </div>
          <div className="title-header-line" />

          <div className="time-bill">
            <Row>
              <Col>
                Từ ngày
                <div>
                  <DatePicker
                    startDate={this.state.fromDate}
                    getValue={date => {
                      this.setState({ fromDate: date });
                    }}
                  />
                </div>
              </Col>
              <Col>
                Đến ngày
                <div>
                  <DatePicker
                    startDate={this.state.toDate}
                    getValue={date => {
                      this.setState({ toDate: date });
                    }}
                  />
                </div>
              </Col>
              <Col>
                &nbsp;
                <Col>
                  <Button onClick={this.getPoint}>
                    <i className="fas fa-search" />
                  </Button>
                </Col>
              </Col>
            </Row>
            {this.state.listActivity.length <= 0 ? (
              <div>Bạn chưa có hoạt động nào</div>
            ) : (
              <div style={{ marginTop: "20px" }}>
                <div>
                  <strong>Điểm hoạt động: {this.state.point}</strong>
                </div>
                <div className="text-style">
                  <Table responsive bordered size="sm" hover>
                    <thead className="thread-student">
                      <tr>
                        <th>Thời gian</th>
                        <th>Tên hoạt động</th>
                        <th>Địa điểm</th>
                        <th>Điểm</th>
                        <th>Bắt buộc</th>
                        <th>Tham gia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.listActivity.map((activity, index) => {
                        if (activity.idHD !== null) {
                          var item = activity.idHD;
                          var d = new Date(item.ngayBD);
                          var month = d.getMonth() + 1;

                          var formatDay =
                            d.getDate() +
                            "/" +
                            month +
                            "/" +
                            d.getFullYear() +
                            " " +
                            d.getHours() +
                            ":" +
                            d.getMinutes();

                          return (
                            <tr key={index}>
                              <td>{formatDay}</td>
                              <td>{item.ten}</td>
                              <td>{item.diaDiem}</td>
                              <td>{item.diem}</td>

                              <td
                                className={
                                  item.batBuoc === true ? "is-dont-done" : ""
                                }
                              >
                                {item.batBuoc === true ? "Bắt buộc" : ""}
                              </td>
                              <td
                                className={
                                  activity.isTG === false
                                    ? "is-dont-done"
                                    : "is-done"
                                }
                              >
                                {activity.isTG === false
                                  ? "Vắng"
                                  : "Đã tham gia"}
                              </td>
                            </tr>
                          );
                        }
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

var mapStateToProps = state => {
  return {
    userProfile: state.userProfile
  };
};

export default connect(mapStateToProps)(PractiseStudent);
