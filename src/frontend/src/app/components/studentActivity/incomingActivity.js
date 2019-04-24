import React from "react";
import { Table, Button } from "react-bootstrap";
import "./../titleStudent/titleStudent.css";
import "./../tableStudentTextStyle/tableStudentTextStyle.css";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UserAction from "./../../actions/studentAction";
import Loader from "react-loader-spinner";
import MyPagination from "./../pagination/pagination";
import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore
} from "react-toasts";
import refreshToken from "./../../../utils/refresh_token";

class IncomingStudentActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      incomingActivities: [],
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
    var id = decode.user.profile._id;
    //Lấy thông tin hoạt động
    var incomingActivities = [];
    axios
      .post(`/student/my-upcoming-activities`, {
        id: id,
        options: options
      })
      .then(res => {
        this.setState({
          totalPages: res.data.totalPages
        });
        res.data.data.map(item => {
          console.log(item);
          var d = new Date(item.idHD.ngayBD);
          var today = new Date();

          if (d >= today) {
            item.check = false;
            incomingActivities.push(item);
          }
          return true;
        });
      })
      .then(() => {
        this.setState({
          incomingActivities: incomingActivities,
          isLoad: false
        });
      });
  };

  cancelRegister = async () => {
    // check hoạt động bắt buộc
    var isValid = true;
    var isEmpty = true;
    // && this.listOption[index] === false
    this.state.incomingActivities.map((item, index) => {
      if (item.idHD.batBuoc && item.check === true) {
        isValid = false;
        ToastsStore.error("Bạn không được phép hủy các hoạt động Bắt buộc");
      }
      if (item.check === true) {
        isEmpty = false;
      }
      return true;
    });

    if (isEmpty) {
      ToastsStore.warning("Vui lòng chọn ít nhất một hoạt động");
    }
    if (isValid && !isEmpty) {
      var data = [];

      data = this.state.incomingActivities.filter(obj => obj.check === true);

      await refreshToken();
      var secret = localStorage.getItem("secret");
      const decode = jwt_decode(secret);
      var id = this.props.profile._id;

      var info = {
        activity: data,
        user: id
      };

      //Hủy Đăng ký tham gia hoạt động
      axios
        .post("/student/cancel-register-activities", {
          data: info
        })
        .then(res => {
          if (res.status === 201) {
            ToastsStore.success("Hủy thành công");
            //load lại danh sách hoạt động
            this.getActivities();
          } else {
            ToastsStore.warning("Hủy đăng ký không thành công");
          }
        });
    } else {
    }
  };

  selectCancelRegister = (item, index) => {
    var { incomingActivities } = this.state;
    var act = incomingActivities.map(obj => {
      if (obj._id === item._id) {
        obj.check = !obj.check;
        return obj;
      } else return obj;
    });

    this.setState({ incomingActivities: act });
  };

  clickPage = e => {
    this.setState({
      pageActive: e
    });
    this.getActivities();
  };
  refresh = () => {
    this.getActivities();
  };
  componentDidMount() {
    this.getActivities();
  }

  render() {
    console.log(this.props.activity);
    return (
      <React.Fragment>
        <ToastsContainer
          position={ToastsContainerPosition.BOTTOM_CENTER}
          lightBackground
          store={ToastsStore}
        />
        {this.state.isLoad ? (
          <div className="loading-student">
            <Loader type="Triangle" color="#007bff" height={60} width={60} />
          </div>
        ) : (
          <div>
            <div className="time-bill">
              {this.state.incomingActivities.length === 0 ? (
                <div style={{ marginTop: "20px" }}>
                  <span>Bạn chưa có hoạt động nào</span>
                </div>
              ) : (
                <div>
                  <div className="profile-panel">
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
                            <th>Hủy đăng ký</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.incomingActivities.map(
                            (activity, index) => {
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
                                  <td>
                                    {" "}
                                    <input
                                      checked={activity.check}
                                      onChange={e =>
                                        this.selectCancelRegister(
                                          activity,
                                          index
                                        )
                                      }
                                      type="checkbox"
                                    />
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                  <div className="register-activity">
                    <div className="pagination-position">
                      <MyPagination
                        page={this.state.pageActive}
                        totalPages={this.state.totalPages}
                        clickPage={this.clickPage}
                      />
                    </div>
                    {/* <Button
                      style={{ marginRight: "20px" }}
                      onClick={this.refresh}
                    >
                      Làm mới <i className="fas fa-spinner" />
                    </Button> */}
                    <Button variant="success" onClick={this.cancelRegister}>
                      Huỷ đăng ký
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

var mapStateToProps = state => {
  return {
    activity: state.activity,
    profile: state.userProfile
  };
};

var mapDispatchToProps = dispatch => {
  return {
    getUserAction: bindActionCreators(UserAction.GET_USER_INFO, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IncomingStudentActivity);
