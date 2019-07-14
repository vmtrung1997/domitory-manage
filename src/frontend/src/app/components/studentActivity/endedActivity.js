import React from "react";
import { Table } from "react-bootstrap";
import "./../titleStudent/titleStudent.css";
import "./../tableStudentTextStyle/tableStudentTextStyle.css";
import axios from "axios";
import jwt_decode from "jwt-decode";
import MyPagination from "./../pagination/pagination";
import Loader from "react-loader-spinner";
import { connect } from "react-redux";
import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore
} from "react-toasts";
import refreshToken from "./../../../utils/refresh_token";

class EndedStudentActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldActivities: [],
      isLoad: true,
      pageActive: 1,
      totalPages: 1,
      limit: 5
    };
  }

  getActivities = async () => {
    this.setState({
      isLoad: true
    });

    await refreshToken();
    const options = {
      skip: (this.state.pageActive - 1) * this.state.limit,
      limit: this.state.limit
    };
    var secret = localStorage.getItem("secret");
    const decode = jwt_decode(secret);
    if (decode.user.profile) {
      var id = decode.user.profile._id;
      //Lấy thông tin hoạt động
      var oldActivities = [];
      axios
        .post(`/student/my-upcoming-activities`, {
          id: id,
          options: options
        })
        .then(res => {
          if (res.data) {
            this.setState({
              totalPages: res.data.totalPages
            });
            res.data.data.map(item => {
              var d = new Date(item.idHD.ngayKT)  ;

              var today = new Date();

              if (d < today) {
                oldActivities.push(item);
              }
              return true;
            });
          }
        })
        .then(() => {
          this.setState({
            oldActivities: oldActivities
          });
          this.setState({
            isLoad: false
          });
        });
    }
  };

  clickPage = e => {
    if(e <= this.state.totalPages){
    this.setState({
      pageActive: e
    });
    this.getActivities();
  }
  };

  refresh = () => {
    this.getActivities();
  };
  componentDidMount() {
    this.getActivities();
  }

  render() {
    return (
      <React.Fragment>
        <ToastsContainer
          position={ToastsContainerPosition.BOTTOM_CENTER}
          lightBackground
          store={ToastsStore}
        />
        {this.state.isLoad ? (
          <div className="loading-student">
            <Loader loading={this.state.isLoad} />
          </div>
        ) : (
          <div>
            <div className="time-bill">
              <div className="text-style">
                {this.state.oldActivities.length === 0 ? (
                  <div style={{ marginTop: "30px",textAlign:'center' }}>
                  <img alt = "true"
                    style={{ height: "150px", width: "150px" }}
                    src="/images/notdatafound.png"
                  />
                  <p>Bạn chưa tham gia hoạt động nào</p>                
                  </div> 
                ) : (
                  <div className="profile-panel">
                    <div className="time-bill">
                      <div className="text-style">
                        <Table responsive bordered size="sm" hover>
                          <thead className="thread-student">
                            <tr>
                              <th>Thời gian</th>
                              <th>Tên hoạt động</th>
                              <th>Mô tả</th>
                              <th>Điểm</th>
                              <th>Địa điểm</th>
                              <th>Bắt buộc</th>
                              <th>Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.oldActivities.map((activity, index) => {
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
                                  <td>{item.moTa}</td>
                                  <td>{item.diem}</td>
                                  <td>{item.diaDiem}</td>
                                  <td
                                    className={
                                      item.batBuoc === true
                                        ? "is-dont-done"
                                        : ""
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
                            })}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                    <div className="pagination-position">
                      <MyPagination
                        page={this.state.pageActive}
                        totalPages={this.state.totalPages}
                        clickPage={this.clickPage}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

var mapStateToProps = state => {
  return {
    userProfile: state.userProfile
  };
};

export default connect(mapStateToProps)(EndedStudentActivity);
