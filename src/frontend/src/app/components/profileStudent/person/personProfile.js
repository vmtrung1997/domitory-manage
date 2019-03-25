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
import "./../../../style.css";

class PersonProfile extends React.Component {
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
    this.setState({ readOnly: false });
    this.setState({ isDisable: false });
  };

  updateProfile = async () => {
    var data = {
      MSSV: this.state.MSSV,
      danToc: this.state.danToc,
      diaChi: this.state.diaChi,
      email: this.state.email,
      gioiTinh: this.state.gioiTinh,
      hoTen: this.state.hoTen,
      idPhong: this.state.tenPhong._id,
      idTaiKhoan: this.state.idTaiKhoan,
      nganhHoc: this.state.nganhHoc.value,
      ngayHetHan: this.state.ngayHetHan,
      ngaySinh: this.state.ngaySinh,
      ngayVaoO: this.state.ngayVaoO,
      sdt: this.state.sdt,
      sdtNguoiThan: this.state.sdtNguoiThan,
      truong: this.state.truong.value
    };

    this.setState({ isDisable: true });
    this.setState({ readOnly: true });
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
    console.log("aaaaaa");
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
            console.log(res.data.data);
            this.props.getUserAction(res.data.data);

            var nganhHoc = {
              label: res.data.data.nganhHoc.tenNganh,
              value: res.data.data.nganhHoc._id
            };

            var truong = {
              label: res.data.data.truong.tenTruong,
              value: res.data.data.truong._id
            };
            //Lưu trong state
            this.setState({
              MSSV: res.data.data.MSSV,
              danToc: res.data.data.danToc,
              diaChi: res.data.data.diaChi,
              email: res.data.data.email,
              gioiTinh: res.data.data.gioiTinh,
              hoTen: res.data.data.hoTen,
              tenPhong: res.data.data.idPhong,
              idTaiKhoan: res.data.data.idTaiKhoan,
              maThe: res.data.data.maThe,
              moTa: res.data.data.moTa,
              nganhHoc: nganhHoc,
              ngayHetHan: res.data.data.ngayHetHan,
              ngaySinh: res.data.data.ngaySinh,
              ngayVaoO: res.data.data.ngayVaoO,
              sdt: res.data.data.sdt,
              sdtNguoiThan: res.data.data.sdtNguoiThan,
              truong: truong
            });

            this.setState({
              isLoad: false
            });
          }
        })
        .catch(err => {
          console.log(err);
        });

      //Lấy danh sách các ngành học
      axios
        .get("http://localhost:4000/api/student/get-specialized")
        .then(res => {
          if (res) {
            // res.data.data.forEach(element => {
            //     this.props.getSpecialized(element);
            // });
            var options = res.data.data.map(obj => {
              return { value: obj._id, label: obj.tenNganh };
            });
            this.setState({ nganhOptions: options });
          }
        })
        .catch(err => {
          console.log(err);
        });

      //Lấy danh sách các trường
      axios
        .get("http://localhost:4000/api/student/get-school")
        .then(res => {
          if (res) {
            // res.data.data.forEach(element => {
            //     this.props.getSchool(element);
            // });
            var options = res.data.data.map(obj => {
              return { value: obj._id, label: obj.tenTruong };
            });
            this.setState({ truongOptions: options });
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      console.log("ko co data");
    }
  };

  nganhSelected = value => {
    console.log(value);
    var nganh = this.state.nganhOptions.find(obj => obj.value === value);
    this.setState({
      nganhHoc: nganh
    });
  };

  genderSelected = value => {
    this.setState({ gioiTinh: value });
  };

  truongSelected = value => {
    var truong = this.state.truongOptions.find(obj => obj.value === value);
    this.setState({
      truong: truong
    });
  };

  render() {
    console.log(this.props.state);
    if (!this.state.isLoad) {
      var { state } = this.props;

      var gender = [{ value: "0", label: "Nữ" }, { value: "1", label: "Nam" }];
      var majorInput;
      var schoolInput;
      var genderInput;

      //Định dạng ngày sinh
      var d = new Date(this.state.ngaySinh);
      var month = d.getMonth() + 1;
      var birthdayFormat = d.getDate() + "/" + month + "/" + d.getFullYear();

      if (!this.state.readOnly) {
        genderInput = (
          <MySelectOption
            name="gioiTinh"
            getValue={this.getValue}
            disabled={this.state.readOnly}
            value={this.state.gioiTinh}
            options={gender}
            selected={this.genderSelected}
          />
        );

        majorInput = (
          <MySelectOption
            name="nganhHoc"
            getValue={this.getValue}
            disabled={this.state.readOnly}
            value={this.state.nganhHoc.value}
            options={this.state.nganhOptions}
            selected={this.nganhSelected}
          />
        );

        schoolInput = (
          <MySelectOption
            name="truong"
            getValue={this.getValue}
            disabled={this.state.readOnly}
            value={this.state.truong.value}
            options={this.state.truongOptions}
            selected={this.truongSelected}
          />
        );
      } else {
        schoolInput = (
          <MyInput
            getValue={this.getValue}
            name="truong"
            disabled={this.state.readOnly}
            value={this.state.truong.label}
            borderRadius="3px"
          />
        );
        majorInput = (
          <MyInput
            getValue={this.getValue}
            name="nganhHoc"
            disabled={this.state.readOnly}
            value={this.state.nganhHoc.label}
            borderRadius="3px"
          />
        );
        genderInput = (
          <MyInput
            getValue={this.getValue}
            name="gioiTinh"
            disabled={this.state.readOnly}
            value={this.state.gioiTinh === 1 ? "Nam" : "Nữ"}
            borderRadius="3px"
          />
        );
      }
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
                <Col>
                  <div className="profile-panel-content">
                    <div>
                      <Row>
                        <Col>
                          <span className="label-font">Họ tên</span>

                          <MyInput
                            getValue={this.getValue}
                            name="hoTen"
                            disabled={this.state.readOnly}
                            value={this.state.hoTen}
                            borderRadius="3px"
                          />
                        </Col>

                        <Col>
                          <span className="label-font"> Ngày sinh</span>
                          <MyInput
                            name="ngaySinh"
                            getValue={this.getValue}
                            disabled={this.state.readOnly}
                            value={birthdayFormat}
                            className="input-picker"
                            borderRadius="3px"
                          />
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <Row>
                        <Col>
                          <span className="label-font">Giới tính</span>

                          {genderInput}
                        </Col>

                        <Col>
                          <span className="label-font"> Dân tộc</span>
                          <MyInput
                            getValue={this.getValue}
                            name="danToc"
                            disabled={this.state.readOnly}
                            value={this.state.danToc}
                            borderRadius="3px"
                          />
                        </Col>
                      </Row>
                    </div>

                    <div>
                      <Row>
                        <Col>
                          <span className="label-font">Địa chỉ</span>
                          <MyInput
                            getValue={this.getValue}
                            name="diaChi"
                            disabled={this.state.readOnly}
                            value={this.state.diaChi}
                          />
                        </Col>
                        <Col>
                          <span className="label-font">Email</span>
                          <MyInput
                            required
                            className={
                              this.state.readOnly ? "profile-not-allowed" : ""
                            }
                            getValue={this.getValue}
                            name="email"
                            disabled={this.state.readOnly}
                            value={this.state.email}
                            borderRadius="3px"
                          />
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <Row>
                        <Col>
                          <span className="label-font">Số điện thoại</span>
                          <MyInput
                            getValue={this.getValue}
                            name="sdt"
                            disabled={this.state.readOnly}
                            value={this.state.sdt}
                            borderRadius="3px"
                          />
                        </Col>
                        <Col>
                          <span className="label-font">
                            Số điện thoại người thân
                          </span>
                          <MyInput
                            getValue={this.getValue}
                            name="sdtNguoiThan"
                            disabled={this.state.readOnly}
                            value={this.state.sdtNguoiThan}
                            borderRadius="3px"
                          />
                        </Col>
                      </Row>
                    </div>
                    <div className="profile-panel-content-row">
                      <Row>
                        <Col>
                          <span className="label-font">Trường</span>
                          {schoolInput}
                        </Col>
                        <Col>
                          <span className="label-font">Ngành học</span>

                          {majorInput}
                        </Col>
                      </Row>
                    </div>
                    <div   style = {{display: 'flex',justifyContent: 'flex-end',marginTop: '5px'}} >
                      <Row >
                        <div className="profile-panel-button">
                          <Button
                            disabled={!this.state.isDisable}
                            onClick={this.editProfile}
                          >
                            Chỉnh sửa
                          </Button>
                        </div>
                        <div className="profile-panel-button">
                          <Button
                            disabled={this.state.isDisable}
                            variant="success"
                            onClick={this.updateProfile}
                          >
                            Lưu
                          </Button>
                        </div>
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
)(PersonProfile);