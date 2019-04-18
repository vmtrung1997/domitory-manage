import React from "react";
import { Table } from "react-bootstrap";
import "./../titleStudent/titleStudent.css";
import "./../tableStudentTextStyle/tableStudentTextStyle.css";
import axios from "axios";
import jwt_decode from "jwt-decode";
import MyPagination from "./../pagination/pagination"
import Loader from "react-loader-spinner";
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
      limit: 1
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
    var oldActivities = [];
    axios
      .post(`http://localhost:4000/api/student/my-upcoming-activities`, {
        id: id,
        options: options
      })
      .then(res => {
        this.setState({
          totalPages: res.data.totalPages
        });
        res.data.data.map(item => {
            var d = new Date(item.idHD.ngayBD);
          var today = new Date();

          if (d < today) {
            oldActivities.push(item);
          } 
          return true;
        });
      })
      .then(() => {
        this.setState({
          oldActivities: oldActivities
        });
        this.setState({
          isLoad: false
        });
      });
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
              <div className="text-style">
                {this.state.oldActivities.length === 0 ? (
                  <div style={{ marginTop: "30px" }}>
                    <span>Bạn chưa có hoạt động nào</span>
                  </div>
                ) : (
                  <div>
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
                              var d = new Date(item.ngay);
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
                                      activity.status === "0"
                                        ? "is-dont-done"
                                        : "is-done"
                                    }
                                  >
                                    {activity.status === "0"
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

export default EndedStudentActivity;
