import React from "react";
import { Row, Col } from "react-bootstrap";
import "./../profileStudent.css";
import Button from "./../../button/button";
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
import * as CONST from "../../../function/constant"

var gender = [{ value: 0, label: "Nữ" }, { value: 1, label: "Nam" }];
var nationOption = [
  { value: "Kinh", label: "Kinh" },
  { value: "Chăm", label: "Chăm" },
  { value: "Dao", label: "Dao" },
  { value: "Êđê", label: "Êđê" },
  { value: "Hoa", label: "Hoa" },
  { value: "Jrai", label: "Jrai" },
  { value: "Khmer", label: "Khmer" },

  { value: "K'Ho", label: "K'Ho" },
  { value: "Mường", label: "Mường" },
  { value: "Nùng", label: "Nùng" },
  { value: "Sán Dìu", label: "Sán Dìu" },

  { value: "Khác", label: "Khác" }
];

var tonGiaoOption = [
  { value: "Phật Giáo", label: "Phật Giáo" },
  { value: "Công Giáo", label: "Công Giáo" },
  { value: "Cao Đài", label: "Cao Đài" },
  { value: "Hồi Giáo", label: "Hồi Giáo" },
  { value: "Khác", label: "Khác" },
  { value: "Không", label: "Không" }
];
var dangVienOption = [
  { value: "0", label: "Không" },
  { value: "1", label: "Có" }
];

class PersonProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      readOnly: true,
      isDisable: true,
      isLoad: true,
      dangVien: undefined,
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
      flag: true,
      tonGiaoOptions: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  getValue = obj => {
    this.setState({ [obj.name]: obj.value });
  };

  editProfile = () => {
    this.setState({ readOnly: false });
    this.setState({ isDisable: false });
    // console.log(this.state);
    this.getNganhHoc(this.state.truong.value);

    // this.setState({
    //   nganhHoc:nganh
    // })
    //Chỉnh lại ngành của sinh viên
    // this.getDanToc();
    // this.getTonGiao();
  };

  getDanToc = () => {
    //Lấy danh sách các ngành học
    axios
      .get("/student/get-nation")
      .then(res => {
        if (res) {
          var options = [];
          res.data.data.forEach((obj, index) => {
            options.push({ value: obj._id, label: obj.tenDanToc });
          });
          this.setState({ danTocOptions: options });
        }
      })
      .catch(err => {});
  };

  getTonGiao = () => {
    //Lấy danh sách các ngành học
    axios
      .get("/student/get-religion")
      .then(res => {
        if (res) {
          var options = [];
          res.data.data.forEach((obj, index) => {
            options.push({ value: obj._id, label: obj.tenTonGiao });
          });
          this.setState({ tonGiaoOptions: options });
        }
      })
      .catch(err => {});
  };

  getNganhHoc = value => {
    //Lấy danh sách các ngành học
    axios
      .post("/student/get-specialized", { id: value })
      .then(res => {
        if (res) {
          var options = [];
          res.data.data.forEach((obj, index) => {
            options.push({
              value: obj.idNganhHoc._id,
              label: obj.idNganhHoc.tenNganh
            });
          });
          this.setState({ nganhOptions: options });
          // this.setState({ nganhHoc: options[0] });
        }
      })
      .catch(err => {});
  };
  updateProfile = async event => {
    var error = false;
    event.preventDefault();
    var data = {
      id: this.props.userProfile._id,
      CMND: this.state.CMND,
      danToc: this.state.danToc,
      tonGiao: this.state.tonGiao,
      diaChi: this.state.diaChi,
      email: this.state.email,
      dangVien: this.state.dangVien,
      gioiTinh: this.state.gioiTinh,
      //idPhong: this.state.tenPhong._id,
      nganhHoc: this.state.nganhHoc ? this.state.nganhHoc.value : undefined,
      //ngayHetHan: this.state.ngayHetHan,
      ngaySinh: this.state.ngaySinh,
      //ngayVaoO: this.state.ngayVaoO,
      sdt: this.state.sdt,
      sdtNguoiThan: this.state.sdtNguoiThan,
      truong: this.state.truong ? this.state.truong.value : undefined,
      flag: false
    };

    if (data.danToc === undefined) {
      data.danToc = nationOption[0].value;
      this.setState({ danToc: nationOption[0].value });
    }
    if (data.tonGiao === undefined) {
      data.tonGiao = tonGiaoOption[0].value;
      this.setState({ tonGiao: tonGiaoOption[0].value });
    }
    if (data.gioiTinh === undefined) {
      data.gioiTinh = gender[0].value;
      this.setState({ gioiTinh: gender[0].value });
    }
    if (data.truong === undefined) {
      if (this.state.truongOptions[0] === undefined) {
        window.alert(
          "Hiện tại vẫn chưa có trường nào trong danh sách, vui lòng đợi BQL thêm trường."
        );
        error = true;
      } else {
        data.truong = this.state.truongOptions[0].value;
        this.setState({ truong: this.state.truongOptions[0] });
      }
    }
    if (data.dangVien === undefined) {
      data.dangVien = dangVienOption[0].value;
      this.setState({ dangVien: dangVienOption[0].value });
    }
    if (data.nganhHoc === undefined) {
      if (this.state.nganhOptions[0] === undefined) {
        window.alert(
          "Hiện tại vẫn chưa có ngành nào của trường bạn chọn trong danh sách, vui lòng đợi BQL thêm ngành."
        );
        error = true;
      } else {
        data.nganhHoc = this.state.nganhOptions[0].value;
        this.setState({ nganhHoc: this.state.nganhOptions[0] });
      }
    }
    //   else if ()
    if (!error) {
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

            var tonGiao = res.data.data.tonGiao
              ? res.data.data.tonGiao
              : undefined;
            var danToc = res.data.data.danToc
              ? res.data.data.danToc
              : undefined;
            //Lưu trong state
            this.setState({
              MSSV: res.data.data.MSSV,
              CMND: res.data.data.CMND,
              danToc: danToc,
              dangVien: res.data.data.dangVien,
              tonGiao: tonGiao,
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
        .catch(err => {});

      //Lấy danh sách các trường
      var options = [];
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
        .catch(err => {});
    } else {
    }
  };

  nganhSelected = value => {
    var nganh = this.state.nganhOptions.find(obj => obj.value === value);
    this.setState({
      nganhHoc: nganh
    });
  };

  dangVienSelected = value => {
    this.setState({ dangVien: parseInt(value) });
  };

  genderSelected = value => {
    var intValue = parseInt(value);
    // console.log(intValue)
    if (intValue !== -1) {
      this.setState({ gioiTinh: intValue });
    }
  };

  nationSelected = (value, nationOption) => {
    if (value !== "-1") {
      var danToc = nationOption.find(obj => obj.value === value);
      this.setState({
        danToc: danToc.value
      });
    }
  };

  religionSelected = (value, religionOption) => {
    if (value !== "-1") {
      var tonGiao = religionOption.find(obj => obj.value === value);
      this.setState({
        tonGiao: tonGiao.value
      });
    }
  };

  truongSelected = value => {
    if (value !== "-1") {
      var truong = this.state.truongOptions.find(obj => obj.value === value);
      this.setState({
        truong: truong
      });
    }
    this.getNganhHoc(value);
  };
  //Lấy danh sách các ngành học
  // axios
  // .post("/student/get-specialized",{id:truong.value})
  // .then(res => {
  //   if (res) {
  //     var options = [{ value: -1, label: "Chọn ngành" }];
  //     res.data.data.forEach((obj, index) => {
  //       options.push({ value: obj.idNganhHoc._id, label: obj.idNganhHoc.tenNganh });
  //     });
  //     this.setState({ nganhOptions: options });
  //   }
  // })
  // .catch(err => {
  // });

  render() {
    if (!this.state.isLoad) {
      var gender = [
        { value: 0, label: "Nữ" },
        { value: 1, label: "Nam" }
      ];
      var nationOption = CONST.danTocArr;
      var tonGiaoOption = CONST.tonGiaoArr;
      var dangVienOption = CONST.dangVienArr;
      var majorInput;
      var schoolInput;
      var genderInput;
      var nationInput;
      var religionInput;
      var dangVienInput;
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

        dangVienInput = (
          <MySelectOption
            name="dangVien"
            getValue={this.getValue}
            disabled={this.state.readOnly}
            value={this.state.dangVien ? this.state.dangVien : ""}
            options={dangVienOption}
            selected={this.dangVienSelected}
          />
        );

        nationInput = (
          <MySelectOption
            name="danToc"
            getValue={this.getValue}
            disabled={this.state.readOnly}
            value={this.state.danToc ? this.state.danToc : ""}
            options={nationOption}
            selected={e => this.nationSelected(e, nationOption)}
          />
        );

        religionInput = (
          <MySelectOption
            name="tonGiao"
            getValue={this.getValue}
            disabled={this.state.readOnly}
            value={this.state.tonGiao ? this.state.tonGiao : ""}
            options={tonGiaoOption}
            selected={e => this.religionSelected(e, tonGiaoOption)}
          />
        );
        majorInput = (
          <MySelectOption
            name="nganhHoc"
            getValue={this.getValue}
            disabled={this.state.readOnly}
            value={this.state.nganhHoc ? this.state.nganhHoc.value : ""}
            options={this.state.nganhOptions}
            selected={this.nganhSelected}
          />
        );

        schoolInput = (
          <MySelectOption
            name="truong"
            getValue={this.getValue}
            disabled={this.state.readOnly}
            value={this.state.truong ? this.state.truong.value : ""}
            options={this.state.truongOptions}
            selected={this.truongSelected}
          />
        );
      } else {
        dangVienInput = (
          <MyInput
            getValue={this.getValue}
            name="dangVien"
            disabled={this.state.readOnly}
            value={this.state.dangVien === 1 ? "Có" : "Không"}
            borderRadius="3px"
          />
        );

        schoolInput = (
          <MyInput
            getValue={this.getValue}
            name="truong"
            disabled={this.state.readOnly}
            value={this.state.truong.label ? this.state.truong.label : ""}
            borderRadius="3px"
          />
        );

        nationInput = (
          <MyInput
            getValue={this.getValue}
            name="danToc"
            disabled={this.state.readOnly}
            value={this.state.danToc ? this.state.danToc : ""}
            borderRadius="3px"
          />
        );

        religionInput = (
          <MyInput
            getValue={this.getValue}
            name="tonGiao"
            disabled={this.state.readOnly}
            value={this.state.tonGiao ? this.state.tonGiao : ""}
            borderRadius="3px"
          />
        );

        majorInput = (
          <MyInput
            getValue={this.getValue}
            name="nganhHoc"
            disabled={this.state.readOnly}
            value={this.state.nganhHoc ? this.state.nganhHoc.label : ""}
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
                    <form onSubmit={e => this.updateProfile(e)}>
                      <div>
                        <Row>
                          <Col>
                            <span className="label-font">MSSV</span>
                            <MyInput
                              getValue={this.getValue}
                              name="MSSV"
                              disabled
                              type="text"
                              value={this.state.MSSV}
                              borderRadius="3px"
                            />
                          </Col>

                          <Col>
                            <span className="label-font">CMND</span>
                            <MyInput
                              pattern="\d*"
                              name="CMND"
                              type="text"
                              required
                              getValue={this.getValue}
                              disabled={this.state.readOnly}
                              value={this.state.CMND ? this.state.CMND : ""}
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
                              pattern="[a-z]$"
                              getValue={this.getValue}
                              name="hoTen"
                              type="text"
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
                              type="text"
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
                              pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                              required
                              className={
                                this.state.readOnly ? "profile-not-allowed" : ""
                              }
                              type="email"
                              getValue={this.getValue}
                              name="email"
                              disabled={this.state.readOnly}
                              value={this.state.email ? this.state.email : ""}
                              borderRadius="3px"
                            />
                          </Col>
                        </Row>
                      </div>
                      <div>
                        <Row>
                          <Col>
                            <span className="label-font"> Dân tộc</span>
                            {nationInput}
                          </Col>

                          <Col>
                            <span className="label-font">Tôn giáo</span>
                            {religionInput}
                          </Col>
                        </Row>
                      </div>
                      <div>
                        <Row>
                          <Col>
                            <span className="label-font">Số điện thoại</span>
                            <MyInput
                              required
                              type="text"
                              pattern="\d*"
                              getValue={this.getValue}
                              name="sdt"
                              disabled={this.state.readOnly}
                              value={this.state.sdt ? this.state.sdt : ""}
                              borderRadius="3px"
                            />
                          </Col>
                          <Col>
                            <span className="label-font">SDT người thân</span>
                            <MyInput
                              required
                              pattern="\d*"
                              getValue={this.getValue}
                              name="sdtNguoiThan"
                              disabled={this.state.readOnly}
                              value={
                                this.state.sdtNguoiThan
                                  ? this.state.sdtNguoiThan
                                  : ""
                              }
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
                            <span className="label-font">Ngành</span>

                            {majorInput}
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={6}>
                            <span className="label-font">
                              Địa chỉ thường trú
                            </span>
                            <MyInput
                              required
                              getValue={this.getValue}
                              type="text"
                              name="diaChi"
                              disabled={this.state.readOnly}
                              value={this.state.diaChi ? this.state.diaChi : ""}
                            />
                          </Col>
                          <Col sm={6}>
                            <span className="label-font">Đảng viên</span>

                            {dangVienInput}
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
                              type="submit"
                              disabled={this.state.isDisable}
                              //onClick={this.updateProfile}
                            >
                              Lưu
                            </Button>
                          </div>
                        </Row>
                      </div>
                    </form>
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
