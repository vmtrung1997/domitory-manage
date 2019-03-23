import React from "react";
import { InputGroup, Row, Col, Button } from "react-bootstrap";
import "./../profileStudent.css";
import "react-datepicker/dist/react-datepicker.css";
import MyInput from "../../input/input";
import MySelectOption from "../../selectOption/select";
import "./../../titleStudent/titleStudent.css";
import { connect } from "react-redux";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { bindActionCreators } from "redux";
import * as UserAction from "../../../actions/studentAction";
import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore
} from "react-toasts";
import Loader from "react-loader-spinner";
import refreshToken from "./../../../../utils/refresh_token";

class StayProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      readOnly: true,
      isDisable: true,
      isLoad: true,

      MSSV: "",
      danToc: undefined,
      diaChi: undefined,
      email: undefined,
      gioiTinh: undefined,
      hoTen: "",
      tenPhong: "",
      idTaiKhoan: undefined,
      maThe: undefined,
      moTa: undefined,
      nganhHoc: undefined,
      ngayHetHan: undefined,
      ngaySinh: undefined,
      ngayVaoO: undefined,
      sdt: undefined,
      sdtNguoiThan: undefined,
      truong: undefined,
      nganhOptions: [],
      truongOptions: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  getValue = obj => {
    console.log(obj.name);
    this.setState({ [obj.name]: obj.value });
  };

  editProfile = () => {
    this.setState({ readOnly: !this.state.readOnly });
    this.setState({ isDisable: !this.state.isDisable });
  };

  updateProfile = async () => {
    var data = {
      idPhong: this.state.tenPhong._id,
      ngayHetHan: this.state.ngayHetHan,
      ngayVaoO: this.state.ngayVaoO,

    };

    this.setState({ isDisable: !this.state.isDisable });

    await refreshToken();

    var secret = localStorage.getItem("secret");
    secret = JSON.parse(secret);
    axios.defaults.headers["x-access-token"] = secret.access_token;
    axios
      .post(`http://localhost:4000/api/student/update-info`, { data: data })
      .then(res => {
        if (res.data.res === "success") {
          ToastsStore.success("Cập nhật thành công");
        } else {
          ToastsStore.error("Cập nhật thất bại");
        }
      });
  };

  handleChange(date) {
    this.setState({
      startDate: date
    });
    console.log(date);
  }

  componentDidMount = async () => {
    await refreshToken();

    var secret = localStorage.getItem("secret");

    if (secret) {
      const decode = jwt_decode(secret);
      secret = JSON.parse(secret);
      var id = decode.user.userEntity._id;
      //Lấy thông tin sinh viên
      axios.defaults.headers["x-access-token"] = secret.access_token;
      axios
        .post(`http://localhost:4000/api/student/get-info`, { id: id })
        .then(res => {
          if (res) {
            //Lưu trong redux
            this.props.getUserAction(res.data.data);

            //Lưu trong state
            this.setState({
           
              tenPhong: res.data.data.idPhong,
             
              ngayHetHan: res.data.data.ngayHetHan,
             
              ngayVaoO: res.data.data.ngayVaoO,

            });

            this.setState({
              isLoad: false
            });
          }
        })
        .catch(err => {
          console.log(err);
        });

   

    
    } else {
      console.log("ko co data");
    }
  };

  render() {
    if (!this.state.isLoad) {
      //Định dạng ngày vào
      var d = new Date(this.state.ngayVaoO);
      var month = d.getMonth() + 1;
      var dayInFormat = d.getDate() + "/" + month + "/" + d.getFullYear();

      //Định dạng ngày ra
      var d = new Date(this.state.ngayHetHan);
      var month = d.getMonth() + 1;
      var dayOutFormat = d.getDate() + "/" + month + "/" + d.getFullYear();

      
    }

    return (
      <React.Fragment>
        {this.state.isLoad ? (
          <div className="loading-student">
            <Loader type="Triangle" color="#007bff" height={60} width={60} />
          </div>
        ) : (
          <div>
            <div className="profile-panel">
              <Row>
                <ToastsContainer
                  position={ToastsContainerPosition.BOTTOM_CENTER}
                  lightBackground
                  store={ToastsStore}
                />
                <Col sm={10}>
                  <div className="profile-panel-content">
                    <div className="profile-panel-content-row">
                      <Row>
                        <Col>
                          <span className="label-font"> Ngày vào</span>
                          <MyInput
                            getValue={this.getValue}
                            name="ngayVaoO"
                            disabled={this.state.readOnly}
                            value={dayInFormat}
                            borderRadius="3px"
                          />
                        </Col>
                        <Col>
                          <span className="label-font">Ngày hết hạn </span>
                          <MyInput
                            getValue={this.getValue}
                            name="ngayHetHan"
                            disabled={this.state.readOnly}
                            value={dayOutFormat}
                            borderRadius="3px"
                          />
                        </Col>
                      </Row>
                    </div>
                    <div className="profile-panel-content-row">
                      <Row>
                        <Col>
                          <span className="label-font">Phòng</span>
                          <MyInput
                            getValue={this.getValue}
                            name="tenPhong"
                            readOnly={this.state.readOnly}
                            disabled={this.state.readOnly}
                            value={this.state.tenPhong.tenPhong}
                            borderRadius="3px"
                          />
                        </Col>
                        <Col>
                          <span className="label-font">Trạng thái</span>
                          <MyInput
                            getValue={this.getValue}
                            disabled={this.state.readOnly}
                            borderRadius="3px"
                          />
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

var mapStateToProps = state => {
  return {
    state: state
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
)(StayProfile);
