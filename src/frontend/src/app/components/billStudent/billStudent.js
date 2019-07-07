import React from "react";
import { Table } from "react-bootstrap";
import "./billStudent.css";
import "./../titleStudent/titleStudent.css";
import axios from "axios";
import { connect } from "react-redux";
import jwt_decode from "jwt-decode";
import * as StudentAction from "../../actions/studentAction";
import { bindActionCreators } from "redux";
import DetailBill from "./detailBill";
import OpitmizeNumber from "../../optimization/optimizationNumber/optimizationNumber";
import Loader from "./../loader/loader";
import refreshToken from "./../../../utils/refresh_token";
import MyPagination from "./../pagination/pagination";

class BillStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetail: false,
      data: [],
      isLoad: true,
      bills: [],
      lastBill: [],
      pageActive: 1,
      totalPages: 1,
      limit: 6
    };
  }

  getLastBill = async () => {
    await refreshToken();

    var secret = localStorage.getItem("secret");
    const decode = jwt_decode(secret);

    secret = JSON.parse(secret);
    var id = decode.user.userEntity._id;

    axios.defaults.headers["x-access-token"] = secret.access_token;
    var bill = [];
    //Lấy thông tin điện nước
    axios
      .post(`/student/get-info`, {
        id: id
      })
      .then(res => {
        if (res) {
          if (
            res.data.data.idPhong !== undefined &&
            res.data.data.idPhong != null
          ) {
            axios
              .post(`/student/get-last-bill`, {
                id: res.data.data.idPhong._id
              })
              .then(res => {
                if (res.status === 200) {
                  bill.push(res.data.data);
                }

                this.setState({
                  isLoad: false,
                  lastBill: bill
                });
              });
          }
        }
      });
  };

  getBill = async () => {
    await refreshToken();

    var secret = localStorage.getItem("secret");
    const decode = jwt_decode(secret);

    secret = JSON.parse(secret);
    var id = decode.user.userEntity._id;

    const options = {
      skip: (this.state.pageActive - 1) * this.state.limit,
      limit: this.state.limit
    };

    axios.defaults.headers["x-access-token"] = secret.access_token;
    var bill = [];
    //Lấy thông tin điện nước
    axios
      .post(`/student/get-info`, {
        id: id
      })
      .then(res => {
        if (res)
          if (
            res.data.data.idPhong !== undefined &&
            res.data.data.idPhong != null
          ) {
            // có dữ liệu phòng
            axios
              .post(`/student/get-bill`, {
                id: res.data.data.idPhong._id,
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
                    if(item.thayDien){
                      
                      var new_item = item;

                      var soMoi = item.soDien;
                      var soThayDienmoi = item.thayDien.dienMoi;
                    
                      var soDienCu = item.soDienCu;
                      var soThayDienCu = item.thayDien.dienCu;

                      new_item.soDien = soMoi + soThayDienmoi;
                      //console.log(a,'=',soMoi,'+',soThayDienmoi);
                      new_item.soDienCu = soDienCu + soThayDienCu;
                      //console.log(new_item.soDienCu,'=',soDienCu,'+',soThayDienCu);
                      bill.push(new_item);
                    }
                    else{
                      bill.push(item);
                    }
                  }
                  return true;
                });
                
            
                this.setState({
                  isLoad: false,
                  bills: bill
                });
              });
          }
          else{
            this.setState({
              isLoad:false
            })
          }
      });
  };

  componentDidMount = async () => {
    this.getBill();
    this.getLastBill();
  };

  clickPage = e => {
    this.setState({
      pageActive: e
    });
    this.getBill();
  };

  showDetail = data => {
    this.setState({
      showDetail: !this.state.showDetail
    });
    this.setState({
      data: data
    });
  };

  hideDetail = data => {
    this.setState({
      showDetail: data
    });
  };

  render() {
    return (
      
      <React.Fragment>
        <div className="padding-menu">
          <div>
            {this.state.showDetail && (
              <DetailBill hideDetail={this.hideDetail} data={this.state.data} />
            )}

            <div>
              <h1 className="title-header">THÔNG TIN ĐIỆN NƯỚC</h1>
            </div>
            <div className="title-header-line" />
            {this.state.isLoad ? (
              <div className="loading-student">
                <Loader
                  type="Triangle"
                  color="#007bff"
                  height={60}
                  width={60}
                />
              </div>
            ) : (
              <div>
                {this.state.lastBill.length <= 0 ? (
                      <div style={{ marginTop: "30px", textAlign: "center" }}>
                        <img alt = "true"
                          style={{ height: "150px", width: "150px" }}
                          src="/images/notdatafound.png"
                        />
                        <p>Bạn chưa có hóa đơn nào</p>
                      </div>
                    ) :
                <div className="time-bill">
                  <div className="time-bill-header">
                    <span className="label-font">Gần nhất</span>
                  </div>
                  <div className="text-style">
                     {this.state.lastBill.length > 0 ? (
                      <Table bordered hover responsive size="sm">
                        <thead className="thread-student">
                          <tr>
                            <th>Năm</th>
                            <th>Tháng</th>

                            <th>Phòng</th>
                            <th>Số điện</th>
                            <th>Số nước</th>

                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Xem chi tiết</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr key={1}>
                            <td>{this.state.lastBill[0].nam}</td>
                            <td>{this.state.lastBill[0].thang}</td>

                            <td>{this.props.profile.idPhong.tenPhong}</td>
                            <td>
                              {this.state.lastBill[0].soDien -
                                this.state.lastBill[0].soDienCu}
                            </td>
                            <td>
                              {this.state.lastBill[0].soNuoc -
                                this.state.lastBill[0].soNuocCu}
                            </td>

                            <td>
                              {OpitmizeNumber.OpitmizeNumber(
                                this.state.lastBill[0].tongTien
                              )}
                            </td>

                            {this.state.lastBill[0].trangThai === 0 ? (
                              <td className="is-dont-done">Chưa thanh toán</td>
                            ) : (
                              <td className="is-done">Đã thanh toán</td>
                            )}
                            <td
                              onClick={e =>
                                this.showDetail(this.state.lastBill[0])
                              }
                              className="detail"
                            >
                              <i className="far fa-eye" />
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    ) : (
                      <span>Chưa có ghi chép nào</span>
                    )}
                  </div>

                  <div className="time-bill">
                    <div className="time-bill-header">
                      <span className="label-font">Cũ hơn</span>
                    </div>
                    <div className="text-style">
                      {this.state.bills.length > 0 ? (
                        <Table responsive bordered size="sm" hover>
                          <thead className="thread-student">
                            <tr>
                              <th>Năm</th>
                              <th>Tháng</th>

                              <th>Phòng</th>
                              <th>Số điện</th>
                              <th>Số nước</th>
                              <th>Tổng tiền</th>
                              <th>Trạng thái</th>
                              <th>Xem chi tiết</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.bills.map((item, index) => {
                              return (
                                <tr
                                  key={index}
                                  onClick={e => this.showDetail(item)}
                                >
                                  <td>{item.nam}</td>
                                  <td>{item.thang}</td>
                                  <td>{this.props.profile.idPhong.tenPhong}</td>
                                  <td>{item.soDien - item.soDienCu}</td>
                                  <td>{item.soNuoc - item.soNuocCu}</td>
                                  <td>
                                    {OpitmizeNumber.OpitmizeNumber(
                                      item.tongTien
                                    )}
                                  </td>
                                  {item.trangThai === 0 ? (
                                    <td className="is-dont-done">
                                      Chưa thanh toán
                                    </td>
                                  ) : (
                                    <td className="is-done">Đã thanh toán</td>
                                  )}
                                  <td
                                    onClick={e =>
                                      this.showDetail(this.props.state[0])
                                    }
                                    className="detail"
                                  >
                                    <i className="far fa-eye" />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      ) : (
                        <span>Chưa có ghi chép nào</span>
                      )}
                      <div className="pagination-position">
                        <MyPagination
                          page={this.state.pageActive}
                          totalPages={this.state.totalPages}
                          clickPage={this.clickPage}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                }
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
    state: state.bill,
    profile: state.userProfile
  };
};

var mapDispatchToProps = dispatch => {
  return {
    getBill: bindActionCreators(StudentAction.GET_BILL_INFO, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BillStudent);
