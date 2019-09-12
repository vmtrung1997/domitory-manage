import React, { Component } from 'react';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from "react-toasts";
import axios from "axios";

import Input from '../../../../components/input/input';
import Button from '../../../../components/button/button';
import Title from '../../../../components/title/title';
import './infoStudentDetail.css';
import refreshToken from "../../../../../utils/refresh_token";
import Select from "../../../../components/selectOption/select";
import SearchSelect from '../../../../components/selectOption/select';
import { defaultStudentImg } from '../../../../function/imageFunction';
import { verifyNumberString } from '../../../../function/verifyValue';
import TabActivities from './tabActivities';
import DatePicker from "react-datepicker/es/index";
import './../infoStudentFile.css';
import { getMajor } from './../../university/universityAction'
import Loader from '../../../../components/loader/loader';
import { ChooseRoom } from './../infoStudentModal'
import { get_info_Student_detail, get_activites_by_MSSV, get_floor_room } from './../infoStudentActions'
import Checkbox from "../../../../components/checkbox/checkbox";
import jwt_decode from 'jwt-decode';
import Print from "../infoStudentPrint";

const nationOption = [
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
  { value: "Khác", label: "Khác" },
  { value: "", label: "" }
];

const tonGiaoOption = [
  { value: "Phật Giáo", label: "Phật Giáo" },
  { value: "Công Giáo", label: "Công Giáo" },
  { value: "Cao Đài", label: "Cao Đài" },
  { value: "Hồi Giáo", label: "Hồi Giáo" },
  { value: "Khác", label: "Khác" },
  { value: "Không", label: "Không" }
];

class InfoStudentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
        profile: {
          isActive: true,
          gioiTinh: 0,
          ngaySinh: new Date(),
          ngayVaoO : new Date(),
          ngayHetHan: new Date(),
          hoTen: '',
          MSSV: '',
          CMND: '',
          tonGiao: '',
          email: '',
          sdt: '',
          sdtNguoiThan: '',
          doanVien: false,
          dangVien: false,
          danToc: '',
          maThe: '',
          diaChi: '',
          moTa: ''
        },
        activity: {},
      showPrint: false,
      dataPrint: undefined,
      school: {},
      room: {},
      major: {},
      genderOptions: [{value: 0, label: 'nữ'}, {value: 1, label: 'nam'}],
      roomOptions: [],
      schoolOptions: [],
      majorOptions: [],
      loading: false,
      custom: false,
      showRoomPopup: false,
      roomData: {},
      isOld: true,
      loaiUser: 'SA',
      roles: []
    }
  }

  componentDidMount() {
    this.getData();
    this.getElement('room');
    this.getElement('school');
    this.getRoles()
  }

  getData = () => {
    this.setState({
      loading: true,
    });
    console.log(this.props.match.params)
    get_info_Student_detail(this.props.match.params.mssv)
      .then(result => {
        let profile = result.data;

        let school = {}, major = {};
        //let major = {};
        let isOld = true;
        if(profile.truong){
          school = {
            value: profile.truong._id,
            label: profile.truong.tenTruong
          };
          this.getMajorOptions(profile.truong._id)
        }
        if(profile.nganhHoc){
          major = {
              value: profile.nganhHoc._id,
              label: profile.nganhHoc.tenNganh
            };

        }
        if(profile.idTaiKhoan && !profile.idTaiKhoan.isDelete){
          isOld = false;
        }

        this.setState({
          profile: {
            ...result.data,
            ngaySinh: new Date(profile.ngaySinh),
            ngayVaoO: result.data.ngayVaoO ? new Date(result.data.ngayVaoO) : new Date(),
            ngayHetHan: new Date(result.data.ngayHetHan)
          },
          isOld: isOld,
          school: school,
          major: major,
          loading: false,
        });

      }).catch(() => {
      ToastsStore.error("Có lỗi! Vui lòng thử lại!");
        this.setState({
          loading: false
        })
      });
      get_floor_room().then(result => {
        this.setState({roomData: result.data})
      }).catch(err => {
    });
    get_activites_by_MSSV(this.props.match.params.mssv).then(result => {
      this.setState({
        dataActivities: result.data
      })
    }).catch(() => {
    })
  };
  getRoles = () => {
		let token = JSON.parse(localStorage.getItem('secret'));
		let decode = jwt_decode(token.access_token)
		if (decode && decode.user.userEntity.phanQuyen){
			this.setState({
        roles: decode.user.userEntity.phanQuyen.quyen,
				loaiUser: decode.user.userEntity.loai
			})

		}
	}
  getElement = async (name) => {
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/getElement/` + name, {
      headers: { 'x-access-token': secret.access_token }
    }).then(result => {

      switch (name) {
        case 'room':
          const roomOptions = result.data.map(room => ({ value: room._id, label: room.tenPhong }));
          this.setState({
            roomOptions: roomOptions
          });

          break;
        case 'school':
          const schoolOptions = result.data.map(truong => ({ value: truong._id, label: truong.tenTruong }));

          this.setState({
            schoolOptions: schoolOptions
          });
          break;

        default:
          break
      }
    }).catch(err => {
    })
  };

  onChange = (event) => {
    this.setState({
      profile: { ...this.state.profile, [event.name]: event.value }
    })
  };

  handleActiveAccount = async() => {
    await this.setState({
      profile: {
        ...this.state.profile,
        ngayVaoO: new Date(),
        isActive: true
      }
    });
    this.handleSaveChange()
  };

  handleSaveChange = async () => {
    const { profile } = this.state;
    // verify CMND, phone number
    if(verifyNumberString(profile.CMND) || verifyNumberString(profile.sdt) || verifyNumberString(profile.sdtNguoiThan)){
      ToastsStore.error("CMND, số điện thoại chỉ được phép chứa số!");
    } else {
      await refreshToken();
      let secret = JSON.parse(localStorage.getItem('secret'));
      this.setState({loading: true});
      axios.post(`/manager/infoStudent/update`,
        {
          info: {
            ...this.state.profile,
            // img: this.state.profile.img,
            nganhHoc: this.state.profile.nganhHoc && this.state.profile.nganhHoc._id ? this.state.profile.nganhHoc._id : null,
            truong: this.state.profile.truong && this.state.profile.truong._id,
            idPhong: this.state.profile.idPhong && this.state.profile.idPhong._id,
          }
        }, { headers: { 'x-access-token': secret.access_token} }
      ).then(() => {
        ToastsStore.success("Cập nhật thành công!");
        this.getData();
        this.setState({loading: false})

      }).catch(err => {
        ToastsStore.error(err.response.data.msg);
        this.setState({loading: false})
      })
    }
  };

  handleSelectGender = selectedOption => {
    this.setState({ profile: { ...this.state.profile, gioiTinh: parseInt(selectedOption) } })
  };

  getValue = (name, val) => {
    this.setState({
      profile: {
        ...this.state.profile,
        [name]: val
      }
    })
  };

  handleSelectSchool = (selectedOption) => {
    delete this.state.profile.nganhHoc;
    this.setState({
      profile: {
        ...this.state.profile,
        truong: {
          tenTruong: selectedOption.label,
          _id: selectedOption.value,
          nganhHoc: {}
        }
      },
      school: selectedOption,
      major: {}
    });

    this.getMajorOptions(selectedOption.value);
  };

  getMajorOptions = (idSchool) => {
    getMajor({id: idSchool}).then(result =>{
      if (result.data.rs === 'success') {
        let majorList = result.data.data.map(major => ({ value: major.idNganhHoc._id, label: major.idNganhHoc.tenNganh }));
        this.setState({
          majorOptions: majorList,
        })
      }
    })
  };

  chooseRoom = selectedOption => {
    this.setState({
      profile: {
        ...this.state.profile,
        idPhong: selectedOption
    }})
  };

  handleSelectMajor = selectedOption => {
    this.setState({
      profile: {
        ...this.state.profile,
        nganhHoc: {
          tenNganh: selectedOption.label,
          _id: selectedOption.value
        }
      },
      major: selectedOption
    })
  };

  onUpload = () => {
    var fileReader = new FileReader();
    if (!this.uploadFile.files.length)
      return;
    fileReader.readAsDataURL(this.uploadFile.files[0]);
    
    fileReader.onload = (e) => {
      var data = e.target.result;
      var testImg = new Image();
      testImg.src = data;
      testImg.crossOrigin = "Anonymous";
      testImg.onload = () => {
        this.setState({
          profile: {
            ...this.state.profile,
            img: e.target.result
            
          }
        })
      };
      testImg.onerror = () => {
        alert('Lỗi ảnh')
      }
    }
  };

  handleCheckBox = (props) => {
      this.setState({
        profile:{
          ...this.state.profile,
          [props.value]: props.chk,
        }
      });
  };

  changeState = (key, value) => {
    this.setState({ [key]: value })
  };

  render() {
    let {
      profile,
      genderOptions,
      schoolOptions,
      majorOptions,
      school,
      major,
      dataActivities,
      isOld,
      profile: {isActive},
      loaiUser,
      roles,
      dataPrint,
      showPrint,
    } = this.state;
    const { CMND, doanVien, dangVien, } = profile;
    let imgFile = profile&&profile.img ? profile.img : defaultStudentImg;
    let gender = this.state.profile && this.state.profile.gioiTinh ? this.state.profile.gioiTinh: 0;
    let danToc = profile.danToc ? profile.danToc : '';
    let tonGiao = profile.tonGiao ? profile.tonGiao : 'Không';
    let linkBack = loaiUser === 'BV'?'security':'admin'
    return (
      <div>
        <Loader loading={this.state.loading}/>
        <Print data={dataPrint} show={showPrint} handleClose={() => this.changeState('showPrint', false)}/>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground />
        <Title>
          Thông tin sinh viên
        </Title>

        <div className={'content-body'}>
          <div className={'infoDetail'}>
            <div className={'id-back'}>
              <Link to={`/${linkBack}/student`}>
                <i className="fas fa-chevron-left" />
                <span>Trở về</span>
              </Link>
            </div>
            <Row>
              <Col md={2}>
                <div className={'id-avt'}>
                  <img alt='avater student' src={imgFile} />
                </div>
                <div className="box">
                  <input
                    disabled={isOld}
                    type="file"
                    name="file-1[]"
                    id="file-1"
                    className="inputfile inputfile-1"
                    ref={file => file ? this.uploadFile = file : { files: [''] }}
                    onChange={this.onUpload} />
                  <label htmlFor="file-1">
                    <span>Tải ảnh</span>
                  </label>
                </div>

                <div className="f-center">
                  <Button
                    title={'In thẻ'}
                    color={'success'}
                    onClick={ () => {this.changeState('showPrint', true); this.changeState('dataPrint', profile) }}
                  >
                    In thẻ &#160;
                    <i className="fas fa-print"/>
                  </Button>
                </div>
              </Col>
              <Col md={10}>
                <Tabs defaultActiveKey="infoPersonal" id="uncontrolled-tab-example">
                  <Tab eventKey="infoPersonal" title="Thông tin cá nhân">
                    <div className={'id-tab_frame'}>
                      <Row>
                        <Col md={2}>
                          Họ và tên:
                        </Col>
                        <Col md={4}>
                          <Input
                            disabled={isOld}
                            value={ profile.hoTen ? profile.hoTen : ''}
                            getValue={this.onChange}
                            name={'hoTen'} />
                        </Col>
                        <Col md={2}>
                          MSSV:
                        </Col>
                        <Col md={4}>
                          <Input value={profile.MSSV} disabled />
                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Ngày sinh:
                        </Col>
                        <Col md={4}>
                          <DatePicker
                            disabled={isOld}
                            dateFormat='dd/MM/yyyy'
                            selected={this.state.profile.ngaySinh}
                            onChange={(val) => this.getValue('ngaySinh', val)}
                            className='input-datepicker'
                          />
                        </Col>
                        <Col md={2}>
                          Giới tính:
                        </Col>
                        <Col md={4}>
                          <Select
                            disabled={isOld}
                            placeholder={''}
                            value={gender}
                            selected={this.handleSelectGender}
                            options={genderOptions} />

                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          CMND:
                        </Col>
                        <Col md={4}>
                          <Input
                            disabled={isOld}
                            value={CMND ? CMND : ''}
                            getValue={this.onChange}
                            name={'CMND'} />
                        </Col>
                        <Col md={2}>
                          Tôn giáo:
                        </Col>
                        <Col md={4}>
                          <Select
                            disabled={isOld}
                            value={tonGiao}
                            selected={e => this.onChange({name: 'tonGiao', value: e})}
                            options={tonGiaoOption} />
                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Email:
                        </Col>
                        <Col md={4}>
                          <Input
                            disabled={isOld}
                            value={profile.email ? profile.email : ''}
                            getValue={this.onChange}
                            name={'email'} />
                        </Col>
                        <Col md={2}>
                          Đảng viên:
                        </Col>
                        <Col md={4}>
                          <Checkbox
                            name={'dangVien'}
                            isCheck={this.handleCheckBox}
                            checkmark={'check-mark-fix'}
                            check={dangVien ? dangVien : false}/>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Dân tộc:
                        </Col>
                        <Col md={4}>
                          <Select
                            disabled={isOld}
                            value={danToc}
                            selected={e => this.onChange({name: 'danToc', value: e})}
                            options={nationOption} />
                        </Col>
                        <Col md={2}>
                          Đoàn viên:
                        </Col>
                        <Col md={4}>
                          <Checkbox
                            name={'doanVien'}
                            isCheck={this.handleCheckBox}
                            checkmark={'check-mark-fix'}
                            check={doanVien ? doanVien : false}/>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Số điện thoại:
                        </Col>
                        <Col md={4}>
                          <Input
                            disabled={isOld}
                            value={profile.sdt ? profile.sdt : ''}
                            getValue={this.onChange}
                            name={'sdt'} />
                        </Col>
                        <Col md={2}>
                          Sđt người thân:
                        </Col>
                        <Col md={4}>
                          <Input
                            disabled={isOld}
                            value={profile.sdtNguoiThan ? profile.sdtNguoiThan : ''}
                            getValue={this.onChange}
                            name={'sdtNguoiThan'} />
                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Địa chỉ:
                        </Col>
                        <Col md={10}>
                          <Input
                            disabled={isOld}
                            value={profile.diaChi ? profile.diaChi : ''}
                            getValue={this.onChange}
                            name={'diaChi'} />
                        </Col>
                      </Row>

                    </div>
                  </Tab>
                  <Tab eventKey="infoGeneral" title="Thông tin chung">
                    <div className={'id-tab_frame'}>
                      <Row>
                        <Col md={2}>
                          Mã thẻ:
                        </Col>
                        <Col md={4}>
                          <Input
                            disabled={isOld}
                            value={profile.maThe ? profile.maThe : ''}
                            getValue={this.onChange}
                            name={'maThe'} />
                        </Col>
                        <Col md={2}>
                          Phòng:
                        </Col>
                        <Col md={4}>
                        <ChooseRoom
                          disabled={isOld}
                          show={this.state.showRoomPopup}
                          label={profile && profile.idPhong ? profile.idPhong.tenPhong : ''}
                          onChange={this.chooseRoom}
                          room={profile ? profile.idPhong : {}}
                          data={this.state.roomData}
                        />
                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Ngày vào:
                        </Col>
                        <Col md={4}>
                          <DatePicker
                            disabled
                            dateFormat='dd/MM/yyyy'
                            selected={profile.ngayVaoO}
                            onChange={(val) => this.getValue('ngayVaoO', val)}
                            className='input-datepicker'
                          />
                        </Col>
                        <Col md={2}>
                          Ngày hết hạn:
                        </Col>
                        <Col md={4}>
                          <DatePicker
                            disabled={isOld}
                            dateFormat='dd/MM/yyyy'
                            selected={profile.ngayHetHan}
                            onChange={(val) => this.getValue('ngayHetHan', val)}
                            className='input-datepicker'
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Trường:
                        </Col>
                        <Col md={10}>
                          <SearchSelect
                            disabled={isOld}
                            isSearchable={true}
                            placeholder={''}
                            value={school}
                            onChange={this.handleSelectSchool}
                            options={schoolOptions} />
                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Khoa:
                        </Col>
                        <Col md={10}>
                          <SearchSelect
                            disabled={isOld}
                            isSearchable={true}
                            placeholder={''}
                            value={major}
                            onChange={this.handleSelectMajor}
                            options={majorOptions} />
                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Ghi chú:
                        </Col>
                        <Col md={10}>
                          <Input
                            disabled={isOld}
                            value={ profile.moTa ? profile.moTa : ''}
                            getValue={this.onChange}
                            name={'moTa'} />
                        </Col>
                      </Row>
                    </div>
                  </Tab>
                  <Tab eventKey="infoActivities" title="Thông tin hoạt động">
                    <TabActivities
                      data={dataActivities}
                    />
                  </Tab>

                </Tabs>

              </Col>
            </Row>

          </div>
          {roles.includes('SV_CHANGE_DETAIL') && 
          <Row className={'isc-footer-btn'}>
            {!isOld &&
              <Button
                onClick={() => this.handleSaveChange()}
              >
                Lưu thay đổi
              </Button>
            }
            {!isActive && !isOld &&
            <Button
              onClick={() => this.handleActiveAccount()}
              color={'danger'}
            >
              Xác nhận lưu trú
            </Button>
            }
          </Row>
        }
        </div>

      </div>

    )
  }
}

export default InfoStudentDetail