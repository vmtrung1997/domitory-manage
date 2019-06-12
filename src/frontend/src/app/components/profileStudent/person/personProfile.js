import React from "react";
import {  Row, Col } from "react-bootstrap";
import "./../profileStudent.css";
import Button from './../../button/button'
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
import Loader from "./../../loader/loader";
import refreshToken from "./../../../../utils/refresh_token";


class PersonProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      readOnly: true,
      isDisable: true,
      isLoad: true,

      MSSV: undefined,
      CMND: undefined,
      danToc: undefined,
      tonGiao: undefined,
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
      truongOptions: [],
      flag: true
    };
    this.handleChange = this.handleChange.bind(this);
  }

  getValue = obj => {
    this.setState({ [obj.name]: obj.value });
  };

  editProfile = () => {
    this.setState({ readOnly: false });
    this.setState({ isDisable: false });
    this.getNganhHoc();
  };

  getNganhHoc = () =>{
    //Lấy danh sách các ngành học
    axios
    .post("/student/get-specialized",{id: this.state.truong.value})
    .then(res => {
      if (res) {
        var options = [{ value: -1, label: "Chọn ngành" }];
        res.data.data.forEach((obj, index) => {
          options.push({ value: obj.idNganhHoc._id, label: obj.idNganhHoc.tenNganh });
        });
        this.setState({ nganhOptions: options });
      }
    })
    .catch(err => {
    });
  }
  updateProfile = async () => {
    var data = {
      id: this.props.userProfile._id,
      CMND: this.state.CMND,
      danToc: this.state.danToc,
      tonGiao: this.state.tonGiao,
      diaChi: this.state.diaChi,
      email: this.state.email,
      gioiTinh: this.state.gioiTinh,
      //idPhong: this.state.tenPhong._id,
      nganhHoc: this.state.nganhHoc.value,
      //ngayHetHan: this.state.ngayHetHan,
      ngaySinh: this.state.ngaySinh,
      //ngayVaoO: this.state.ngayVaoO,
      sdt: this.state.sdt,
      sdtNguoiThan: this.state.sdtNguoiThan,
      truong: this.state.truong.value,
      flag: false
    };

    //Kiểm tra các giá trị đã nhập
    if (
      data.CMND === undefined ||
      data.danToc === undefined ||
      data.tonGiao === undefined ||
      data.diaChi === undefined ||
      data.email === undefined ||
      data.gioiTinh === undefined ||
      data.ngaySinh === undefined ||
      data.sdt === undefined ||
      data.sdtNguoiThan === undefined ||
      data.truong === undefined||
      data.nganhHoc === undefined
    ) {
      window.alert("Vui lòng nhập đầy đủ thông tin");
    } else {
      this.setState({ isDisable: true });
      this.setState({ readOnly: true });
      await refreshToken();

      var secret = localStorage.getItem("secret");
      secret = JSON.parse(secret);
      axios.defaults.headers["x-access-token"] = secret.access_token;
      axios.post(`/student/update-first-info`, { data: data }).then(res => {
        if (res.data.res === "success") {
          ToastsStore.success("Cập nhật thành công");
        } else {
          ToastsStore.error("Cập nhật thất bại");
        }
      });
    }
  };

  handleChange(date) {
    this.setState({
      startDate: date
    });
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
        .post(`/student/get-info`, { id: id })
        .then(res => {
          if (res) {
            //Lưu trong redux
            this.props.getUserAction(res.data.data);

            //Nếu res chưa có data
            var nganhHoc = {
              label: res.data.data.nganhHoc
                ? res.data.data.nganhHoc.tenNganh
                : undefined,
              value: res.data.data.nganhHoc
                ? res.data.data.nganhHoc._id
                : undefined
            };

            var truong = {
              label: res.data.data.truong
                ? res.data.data.truong.tenTruong
                : undefined,
              value: res.data.data.truong ? res.data.data.truong._id : undefined
            };

            //Lưu trong state
            this.setState({
              MSSV: res.data.data.MSSV,
              CMND: res.data.data.CMND,
              danToc: res.data.data.danToc,
              tonGiao: res.data.data.tonGiao,
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
              truong: truong,
              flag: res.data.data.flag
            });

            this.setState({
              isLoad: false
            });
          }
        })
        .catch(err => {
        });

      

      //Lấy danh sách các trường
      var options = [{ value: -1, label: "Chọn trường" }];
      axios
        .get("/student/get-school")
        .then(res => {
          if (res) {
             res.data.data.forEach((obj, index) => {
              options.push({ value: obj._id, label: obj.tenTruong });
            });
            this.setState({ truongOptions: options });
          }
        })
        .catch(err => {
        });
    } else {
    }
  };

  nganhSelected = value => {
    var nganh = this.state.nganhOptions.find(obj => obj.value === value);
    this.setState({
      nganhHoc: nganh
    });

  };

  genderSelected = value => {
    this.setState({ gioiTinh: value });
  };

  truongSelected = value => {
    if(value !== '-1')
    {
    var truong = this.state.truongOptions.find(obj => obj.value === value);
    this.setState({
      truong: truong
    });
    //Lấy danh sách các ngành học
    axios
    .post("/student/get-specialized",{id:truong.value})
    .then(res => {
      if (res) {
        var options = [{ value: -1, label: "Chọn ngành" }];
        res.data.data.forEach((obj, index) => {
          options.push({ value: obj.idNganhHoc._id, label: obj.idNganhHoc.tenNganh });
        });
        this.setState({ nganhOptions: options });
      }
    })
    .catch(err => {
    });
  }
  };

  render() {

    if (!this.state.isLoad) {
      var gender = [
        { value: "-1", label: "Chọn giới tính" },
        { value: "0", label: "Nữ" },
        { value: "1", label: "Nam" }
      ];
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
            disabled={this.state.flag? this.state.readOnly: true}
            value={this.state.gioiTinh?this.state.gioiTinh:""}
            options={gender}
            selected={this.genderSelected}
          />
        );

        majorInput = (
          <MySelectOption
            name="nganhHoc"
            getValue={this.getValue}
            disabled={this.state.flag? this.state.readOnly:true}
            value={this.state.nganhHoc.value?this.state.nganhHoc.value:""}
            options={this.state.nganhOptions}
            selected={this.nganhSelected}
          />
        );

        schoolInput = (
          <MySelectOption
            name="truong"
            getValue={this.getValue}
            disabled={this.state.flag?this.state.readOnly:true}
            value={this.state.truong.value?this.state.truong.value:""}
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
            value={this.state.truong.label?this.state.truong.label:""}
            borderRadius="3px"
          />
        );
        majorInput = (
          <MyInput
            getValue={this.getValue}
            name="nganhHoc"
            disabled={this.state.readOnly}
            value={this.state.nganhHoc.label?this.state.nganhHoc.label:""}
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
            <Loader loading={this.state.isLoad} />
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
                          <span className="label-font">MSSV</span>

                          <MyInput
                            getValue={this.getValue}
                            name="MSSV"
                            disabled
                            value={this.state.MSSV}
                            borderRadius="3px"
                          />
                        </Col>

                        <Col>
                          <span className="label-font">
                            CMND
                          </span>
                          <MyInput
                            name="CMND"
                            getValue={this.getValue}
                            disabled={this.state.flag? this.state.readOnly:true}
                            value={this.state.CMND?this.state.CMND:""}
                            className="input-picker"
                            borderRadius="3px"
                          />
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <Row>
                        <Col>
                          <span className="label-font">Họ tên</span>

                          <MyInput
                            getValue={this.getValue}
                            name="hoTen"
                            disabled
                            value={this.state.hoTen}
                            borderRadius="3px"
                          />
                        </Col>

                        <Col>
                          <span className="label-font"> Ngày sinh</span>
                          <MyInput
                            name="ngaySinh"
                            getValue={this.getValue}
                            disabled
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
                          <span className="label-font">Email</span>
                          <MyInput
                            required
                            className={
                              this.state.readOnly ? "profile-not-allowed" : ""
                            }
                            getValue={this.getValue}
                            name="email"
                            disabled={this.state.readOnly}
                            value={this.state.email?this.state.email:""}
                            borderRadius="3px"
                          />
                        </Col>
                      </Row>
                    </div>

                    <div>
                      <Row>
                        <Col>
                          <span className="label-font"> Dân tộc</span>
                          <MyInput
                            getValue={this.getValue}
                            name="danToc"
                            disabled={this.state.flag? this.state.readOnly:true}
                            value={this.state.danToc?this.state.danToc:""}
                            borderRadius="3px"
                          />
                        </Col>

                        <Col>
                          <span className="label-font">Tôn giáo</span>
                          <MyInput
                            getValue={this.getValue}
                            name="tonGiao"
                            disabled={this.state.readOnly}
                            value={this.state.tonGiao?this.state.tonGiao:""}
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
                            value={this.state.sdt?this.state.sdt:""}
                            borderRadius="3px"
                          />
                        </Col>
                        <Col>
                          <span className="label-font">
                            SDT người thân
                          </span>
                          <MyInput
                            getValue={this.getValue}
                            name="sdtNguoiThan"
                            disabled={this.state.readOnly}
                            value={this.state.sdtNguoiThan?this.state.sdtNguoiThan:""}
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
                      <Row sm={6}>
                        <Col sm={6}>
                          <span className="label-font">Địa chỉ thường trú</span>
                          <MyInput
                            getValue={this.getValue}
                            name="diaChi"
                            disabled={this.state.flag? this.state.readOnly: true}
                            value={this.state.diaChi?this.state.diaChi:""}
                          />
                        </Col>
                        <Col />
                      </Row>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "5px",
                        marginBottom: "10px"
                      }}
                    >
                      <Row>
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
    userProfile: state.userProfile
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
