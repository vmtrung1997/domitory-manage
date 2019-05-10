import React from "react";
import { Table, Button } from "react-bootstrap";
import "./listActivity.css";
import "./../titleStudent/titleStudent.css";
import "./../tableStudentTextStyle/tableStudentTextStyle.css";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import MyPagination from "./../pagination/pagination";
import jwt_decode from "jwt-decode";
import * as StudentAction from "../../actions/studentAction";
import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore
} from "react-toasts";
import Loader from "./../loader/loader";
import refreshToken from "./../../../utils/refresh_token";

class ListActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activities: [],
      isLoad: true,
      pageActive: 1,
      totalPages: 1,
      limit: 5
    };
  }
  listOption = [false];
  listRegister = [];
  register = async () => {
    // check hoạt động bắt buộc
    var isValid = true;
    var isEmpty = true;
    // && this.listOption[index] === false
    this.state.activities.map((item, index) => {
      if (item.batBuoc && item.check === false) {
        isValid = false;
        ToastsStore.error("Vui lòng chọn tất cả các hoạt động Bắt buộc");
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

      data = this.state.activities.filter(obj => obj.check === true);

      await refreshToken();
      var secret = localStorage.getItem("secret");
      const decode = jwt_decode(secret);
      var id = decode.user.profile._id;

      var info = {
        activity: data,
        user: id
      };

      //Đăng ký tham gia hoạt động
      axios
        .post("/student/register-activities", { data: info })
        .then(res => {
          if (res.status === 201) {
            ToastsStore.success("Đăng ký thành công");
            //load lại danh sách hoạt động
            this.getActivity();
          } else {
            ToastsStore.warning("Đăng ký không thành công");
          }
        })
        .then(() => {});
    }
  };

  selectRegister = (item, index) => {
    var { activities } = this.state;
    var act = activities.map(obj => {
      if (obj._id === item._id) {
        obj.check = !obj.check;
        return obj;
      } else return obj;
    });

    this.setState({ activities: act });
  };

  getActivity = async () => {
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
    secret = JSON.parse(secret);
    if(decode.user.profile){
      var id = decode.user.profile._id;
      axios.defaults.headers["x-access-token"] = secret.access_token;
      //Lấy thông tin hoạt động
      var activity = [];
      axios
        .post(`/student/get-list-activities`, {
          id: id,
          options: options
        })
        .then(res => {
          if (this.state.totalPages === 1) {
            this.setState({
              totalPages: res.data.totalPages
            });
          }
          res.data.data.map(item => {
            if (item) {
              item.check = false;
              activity.push(item);
              this.props.getActivity(item);
            }
            return true;
          });
        })
        .then(() => {
          this.setState({
            activities: activity,
            isLoad: false
          });
        });
    }
  };

  clickPage = e => {
    this.setState({
      pageActive: e
    });
    this.getActivity();
  };
  refresh = () => {
    this.getActivity();
  };
  componentDidMount() {
    this.getActivity();
  }

  render() {
    return (
      <React.Fragment>
        <ToastsContainer
          position={ToastsContainerPosition.BOTTOM_CENTER}
          lightBackground
          store={ToastsStore}
        />
        <div className="title-header ">
          <span>HOẠT ĐỘNG SẮP DIỄN RA</span>
        </div>
        <div className="title-header-line" />

        {this.state.isLoad ? (
          <div className="loading-student">
            <Loader loading={this.state.isLoad}/>
          </div>
        ) : (
          <div>
            {this.state.activities.length === 0 ? (
              <div style={{ marginTop: "30px" }}>
                <span>Bạn chưa có hoạt động nào</span>
                {/* <Button style={{ marginLeft: '20px' }} onClick={this.refresh}>Làm mới <i className="fas fa-spinner"></i></Button> */}
              </div>
            ) : (
              <div>
                <div className="time-bill">
                  <div className="text-style">
                    <Table responsive bordered size="sm" hover>
                      <thead className="thread-student">
                        <tr>
                          <th>Thời gian bắt đầu</th>
                          <th>Thời gian kết thúc</th>
                          <th>Tên hoạt động</th>

                          <th>Điểm</th>
                          <th>Địa điểm</th>
                          <th>Trạng thái</th>
                          <th>Đăng ký</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.activities.map((item, index) => {
                          var d = new Date(item.ngayBD);
                          var month = d.getMonth() + 1;

                          this.listOption[index] = false; //default Option
                          var formatDayBD =
                            d.getDate() +
                            "/" +
                            month +
                            "/" +
                            d.getFullYear() +
                            " " +
                            d.getHours() +
                            ":" +
                            d.getMinutes();

                          var dkt = new Date(item.ngayKT);
                          var monthkt = d.getMonth() + 1;
                          var formatDayKT =
                            dkt.getDate() +
                            "/" +
                            monthkt +
                            "/" +
                            dkt.getFullYear() +
                            " " +
                            dkt.getHours() +
                            ":" +
                            dkt.getMinutes();
                          return (
                            <tr key={index}>
                              <td>{formatDayBD}</td>
                              <td>{formatDayKT}</td>
                              <td style={{ maxWidth: "500px" }}>{item.ten}</td>

                              <td>{item.diem}</td>
                              <td>{item.diaDiem}</td>
                              <td
                                className={
                                  item.batBuoc === true ? "is-dont-done" : ""
                                }
                              >
                                {item.batBuoc === true ? "Bắt buộc" : ""}
                              </td>
                              <td>
                                {" "}
                                <input
                                  checked={item.check}
                                  onChange={e =>
                                    this.selectRegister(item, index)
                                  }
                                  type="checkbox"
                                />
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
                {/* <div><span style={{ 'color': 'red' }}>* Các hoạt động Bắt buộc yêu cầu sinh viên phải đăng ký</span></div> */}
                <div className="register-activity">
                  {/* <Button style={{ marginRight: '20px' }} onClick={this.refresh}>Làm mới <i className="fas fa-spinner"></i></Button> */}
                  <Button variant="success" onClick={this.register}>
                    Đăng ký
                  </Button>
                </div>
              </div>
            )}
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
    getActivity: bindActionCreators(StudentAction.GET_LIST_ACTIVITY, dispatch),
    updateActivity: bindActionCreators(
      StudentAction.REGISTER_ACTIVITY,
      dispatch
    )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListActivity);