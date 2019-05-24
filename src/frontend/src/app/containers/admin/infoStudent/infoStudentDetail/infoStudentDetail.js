import React, { Component } from 'react';
import { Row, Col, Tabs, Tab, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from "react-toasts";
import axios from "axios";

import Input from '../../../../components/input/input';
import Button from '../../../../components/button/button';
import Title from '../../../../components/title/title';
import './infoStudentDetail.css';
import refreshToken from "../../../../../utils/refresh_token";
import Select from "../../../../components/selectOption/select";
import SearchSelect from '../../../../components/selectOption/select'
import { defaultStudentImg } from '../../../../function/imageFunction'
import TabActivities from './tabActivities';
import DatePicker from "react-datepicker/es/index";
import './../infoStudentFile.css';
import { getSchools, getMajor } from './../../university/universityAction'
import Loader from '../../../../components/loader/loader';
import { ChooseRoom } from './../infoStudentModal'
import { get_info_Student_detail, get_activites_by_MSSV, get_floor_room } from './../infoStudentActions'


class InfoStudentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
        profile: {
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
          danToc: '',
          maThe: '',
          diaChi: '',
          moTa: ''
        },
        activity: {},
      info: {},
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
      isOld: false
    }
  }

  componentWillMount(){
    this.getData()
  }

  componentDidMount() {
    console.log('==did mount', this.state)
    this.getElement('room');
    this.getElement('school');

  }

  getData = () => {
    console.log('==hello', this.props.match.params.mssv)
    get_info_Student_detail(this.props.match.params.mssv)
      .then(result => {

        this.setState({
          profile: {
            ...result.data,
            ngaySinh: new Date(result.data.ngaySinh),
            ngayVaoO: new Date(result.data.ngayVaoO),
            ngayHetHan: new Date(result.data.ngayHetHan)
          },
        });
        const profile = result.data;

        if(profile.truong ){
          this.setState({
            school: {
              value: profile.truong._id,
              label: profile.truong.tenTruong
            }
          });
          this.getMajorOptions(profile.truong._id);
        }

        if(profile.nganhHoc !== undefined)
          this.setState({
            major: {
              value: profile.nganhHoc._id,
              label: profile.nganhHoc.tenNganh
            }
          })

        if(profile.idTaiKhoan && profile.idTaiKhoan.isDelete){
          this.setState({
            isOld: true
          })
        }


      }).catch(err => {
        console.log('==err info detail', err.response)
    })
    get_floor_room().then(result => {
      console.log('==floor', result)
      this.setState({roomData: result.data})
    }).catch(err => {
      console.log('==err floor', err)
    })
    get_activites_by_MSSV(this.props.match.params.mssv).then(result => {
      console.log('==acti ', result);
      let i = 0;
      let activities = result.data.map(acti => ({key: i++, data: acti}));
      this.setState({
        activities: activities
      })
    }).catch(err => {
      console.log('==acti err', err)
    })
  };

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
          })

          break;
        case 'school':
          const schoolOptions = result.data.map(truong => ({ value: truong._id, label: truong.tenTruong }));

          this.setState({
            schoolOptions: schoolOptions
          })
          break;

        default:
          break
      }
    }).catch(err => {
    })
  }

  // getActivities = async() => {
  //   console.log('==acti 1111');
  //
  //   await refreshToken();
  //   let secret = JSON.parse(localStorage.getItem('secret'));
  //   axios.get(`/manager/infoStudent/getActivities/` + this.props.match.params.mssv, {
  //     headers: { 'x-access-token': secret.access_token }
  //   })
  // }

  onChange = (event) => {
    this.setState({
      profile: { ...this.state.profile, [event.name]: event.value }
    })
  }

  onChangeNumber = (event) => {
    this.setState({
      profile: { ...this.state.profile, [event.name]: parseInt(event.value) }
    })
  }

  handleSaveChange = async () => {
    await refreshToken()
    let secret = JSON.parse(localStorage.getItem('secret'));
    this.setState({loading: true})
    axios.post(`/manager/infoStudent/update`,
      {
        info: {
          ...this.state.profile,
          // img: this.state.profile.img,
          nganhHoc: this.state.profile.nganhHoc && this.state.profile.nganhHoc._id,
          truong: this.state.profile.truong && this.state.profile.truong._id,
          idPhong: this.state.profile.idPhong && this.state.profile.idPhong._id
        }
      }, { headers: { 'x-access-token': secret.access_token} }
    ).then(result => {
      ToastsStore.success("Cập nhật thành công!");
      this.getData()
      this.setState({loading: false})

    }).catch(err => {
      console.log('==err update',err.response)
      ToastsStore.error(err.response.data.msg);
      this.setState({loading: false})
    })
  }

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
  }

  handleSelectSchool = (selectedOption) => {
    delete this.state.profile.nganhHoc
    this.setState({
      profile: {
        ...this.state.profile,
        truong: {
          tenTruong: selectedOption.label,
          _id: selectedOption.value,
        }
      },
      school: selectedOption,
      major: {}
    });

    this.getMajorOptions(selectedOption.value);
  };

  getMajorOptions = (idSchool) => {
    getMajor({id: idSchool}).then(result =>{
      console.log('==get major', idSchool, result)
      if (result.data.rs === 'success') {
        let majorList = result.data.data.map(major => ({ value: major.idNganhHoc._id, label: major.idNganhHoc.tenNganh }))
        this.setState({
          majorOptions: majorList,
        })
      }
    })
  }

  chooseRoom = selectedOption => {
    this.setState({
      profile: {
        ...this.state.profile,
        idPhong: selectedOption
    }})
  }

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
      console.log(e);
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
      }
      testImg.onerror = () => {
        alert('Lỗi ảnh')
      }
    }
  }
  render() {
    console.log('==state render', this.state);
    let {
      profile,
      activity,
      genderOptions,
      schoolOptions,
      roomOptions,
      majorOptions,
      school,
      room,
      major,
      activities,
      isOld
    } = this.state;
    const { CMND } = profile;
    var imgFile = profile&&profile.img ? profile.img : defaultStudentImg;
    //var ngayVaoOStr = this.getDateType(profile.ngayVaoO)
    let gender = this.state.profile && this.state.profile.gioiTinh ? this.state.profile.gioiTinh: 0;
    console.log("==type", typeof this.state.profile.ngaySinh)
    return (
      <div>
        <Loader loading={this.state.loading}/>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground />
        <Title>
          Thông tin sinh viên
        </Title>

        <div className={'content-body'}>
          <div className={'infoDetail'}>
            <div className={'id-back'}>
              <Link to={'/admin/student'}>
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
                          <Input
                            disabled={isOld}
                            value={profile.tonGiao ? profile.tonGiao : ''}
                            getValue={this.onChange}
                            name={'tonGiao'} />
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
                          Số điện thoại:
                        </Col>
                        <Col md={4}>
                          <Input
                            disabled={isOld}
                            value={profile.sdt ? profile.sdt : ''}
                            getValue={this.onChange}
                            name={'sdt'} />
                        </Col>
                      </Row>

                      <Row>
                        <Col md={2}>
                          Dân tộc:
                        </Col>
                        <Col md={4}>
                          <Input
                            disabled={isOld}
                            value={profile.danToc ? profile.danToc : ''}
                            getValue={this.onChange}
                            name={'danToc'} />
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
                        <ChooseRoom
                          disabled={isOld}
                          show={this.state.showRoomPopup}
                          label={profile && profile.idPhong ? profile.idPhong.tenPhong : ''}
                          onChange={this.chooseRoom}
                          room={profile ? profile.idPhong : {}}
                          data={this.state.roomData}
                        />
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
                          Ngành học:
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
                          Mô tả:
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
                      activities={activities}
                    />
                  </Tab>

                </Tabs>

              </Col>
            </Row>

          </div>
          <Row className={'isc-footer-btn'}>
            {!isOld &&
              <Button onClick={() => this.handleSaveChange()}>
                Lưu thay đổi
              </Button>
            }
          </Row>
        </div>

      </div>

    )
  }
}

export default InfoStudentDetail