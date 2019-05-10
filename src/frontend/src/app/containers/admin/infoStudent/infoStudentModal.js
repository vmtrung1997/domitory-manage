import React, { Component } from 'react'
import {Col, Modal, Row, Tab, Table, Tabs} from 'react-bootstrap'
import Button from '../../../components/button/button';
import Input from "../../../components/input/input";
import DatePicker from "react-datepicker/es/index";
import {add_student, mark_old_student, get_list_student, get_element, get_floor_room} from './infoStudentActions';
import {ToastsStore} from "react-toasts";
import XLSX from "xlsx";
import refreshToken from "../../../../utils/refresh_token";
import axios from "axios";
import Checkbox from "../../../components/checkbox/checkbox";
import Loader from "../../../components/loader/loader";
import ListRoom from '../../../components/listRoom/listroom'

export class AddStudentModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,
      infoAdded: {
        name: '',
        studentNumber: '',
        birthDay: new Date(),
        regisExpiredDate: new Date(),
        expiredDate: new Date(),
			},
    }
  }

	componentWillReceiveProps(nextProps){
    if (nextProps.show !== this.state.show) {
      this.setState({ show: nextProps.show })
    }
	}

  handlePopup = (state) => {
		this.setState({
			show: state,
		})
	};

	onChangeInput = (event) => {
    this.setState({
      message: '',
      infoAdded: {...this.state.infoAdded, [event.name]: event.value}
    })
	};

  handleSubmitAddStudent = () => {
    const { infoAdded, infoAdded: {name, studentNumber, birthDay, regisExpiredDate, expiredDate} } = this.state;
    console.log('==submit add', this.state.infoAdded);
    if(!name || !studentNumber || !birthDay || !regisExpiredDate || !expiredDate )
    {
      console.log('==please fill');
      this.setState({
        message: 'Vui lòng điền đầy đủ thông tin!!'
      });
      return;
    }

    add_student(infoAdded).then(result => {
      ToastsStore.success("Thêm thành công!");
      this.handlePopup(false);
		}).catch(err => {
      ToastsStore.error("Thêm không thành công!" + err.response.data.msg);
    })

  };
	
	render(){
		return(
      <React.Fragment>
				<Button color={'warning'} onClick={() => this.handlePopup(true)}>
					<i className="fas fa-plus"/>
				</Button>
				<Modal show={this.state.show} onHide={() =>this.handlePopup(false)}>
					<Modal.Header closeButton>
						<Modal.Title>Thêm sinh viên</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Row>
							<Col md={4}>
								Họ và Tên:
							</Col>
							<Col md={8}>
								<Input getValue={this.onChangeInput} name={'name'} />
							</Col>
						</Row>

						<Row>
							<Col md={4}>
								MSSV:
							</Col>
							<Col md={8}>
								<Input getValue={this.onChangeInput} name={'studentNumber'} />
							</Col>
						</Row>

						<Row>
							<Col md={4}>
								Ngày sinh:
							</Col>
							<Col md={8}>
								<DatePicker
									dateFormat='dd/MM/yyyy'
									selected={this.state.infoAdded.birthDay}
									onChange={(val) => this.getValueDate('birthDay', val)}
									className='input-datepicker'
								/>
							</Col>
						</Row>

						<Row>
							<Col md={4}>
								Hạn đăng ký:
							</Col>
							<Col md={8}>

								<DatePicker
									dateFormat='dd/MM/yyyy'
									selected={this.state.infoAdded.regisExpiredDate}
									onChange={(val) => this.getValueDate('regisExpiredDate', val)}
									className='input-datepicker'
								/>
							</Col>
						</Row>

						<Row>
							<Col md={4}>
								Hạn ở ký túc xá:
							</Col>
							<Col md={8}>

								<DatePicker
									dateFormat='dd/MM/yyyy'
									selected={this.state.infoAdded.expiredDate}
									onChange={(val) => this.getValueDate('expiredDate', val)}
									className='input-datepicker'
								/>
							</Col>
						</Row>

						<Row style={{color: 'red'}}>
							{this.state.message}
						</Row>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="outline" onClick={() =>this.handlePopup(false)}>
							Đóng
						</Button>
						<Button  onClick={() =>this.handleSubmitAddStudent()}>
							Thêm tài khoản
						</Button>
					</Modal.Footer>
				</Modal>
			</React.Fragment>
		)
	}
}

export class MarkOldStudentModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,
			listStudent: this.props.listStudent,
      function: ()=>{}
    }
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.show !== this.state.show) {
      this.setState({ show: nextProps.show })
    }
  }

  handlePopup = (state) => {
    if(state && this.state.listStudent.length === 0)
    {
      ToastsStore.error("Vui lòng chọn ít nhất 1 người!");
      return;
    }
    this.setState({
      show: state,
    })
  };

  handleSubmitMarkOldStudent = () => {
    mark_old_student(this.state.listStudent).then(result => {
      ToastsStore.success("Thành công!", result.data);
      this.props.function();
      this.handlePopup(false);
    }).catch(err => {
      ToastsStore.error("Không thành công!");
    })

  };

  render(){
    return(
      <React.Fragment>
        <Button color={'danger'}>
          <i className="fas fa-trash-alt" onClick={() => this.handlePopup(true)}/>
        </Button>

        {/*modal popup delete student*/}
        <Modal show={this.state.show} onHide={() =>this.handlePopup(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Sau khi xóa những sinh viên này sẽ là sinh viên cũ!</Modal.Title>
          </Modal.Header>
          {/*<Modal.Body>Bạn có chắc chắn muốn xóa những sinh viên này?</Modal.Body>*/}
          <Modal.Footer>
            <Button variant="outline" onClick={() =>this.handlePopup(false)}>
              Hủy
            </Button>
            <Button  onClick={() =>this.handleSubmitMarkOldStudent()}>
              Đồng ý
            </Button>
          </Modal.Footer>
        </Modal>
        {/*end modal*/}
      </React.Fragment>
    )
  }
}

export class ImportDataModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,
    }
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.show !== this.state.show) {
      this.setState({ show: nextProps.show })
    }
  }

  handlePopup = (state) => {
    this.setState({
      show: state,
      regisExpiredDate: new Date(),
      expiredDate: new Date(),
      listExpired: undefined,
    })
  };

  getValueDate = (name, val) => {
    this.setState({
      infoAdded: {
        ...this.state.infoAdded,
        [name]: val
      }
    })
  };

  downloadTemplate = () => {
    const data = [
      {stt: "STT", hoTen: "Họ và tên", mssv: "MSSV", ngaySinh: "Ngày sinh"},
      {stt: "1", hoTen: "Nguyễn Văn A", mssv: "1512519", ngaySinh: "29/10/1997"}
    ];
    var ws = XLSX.utils.json_to_sheet(data, {skipHeader:true});

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

    XLSX.writeFile(wb, "template.xlsx");
  };

  filesOnChange = (e) =>{
    let file = e.target.files[0];

    this.setState({
      fileImport: file
    });
  };

  convertData = async (file) => {
    return new Promise ( (resolve, reject) => {
      let reader = new FileReader();
      reader.onload =  function (e) {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, {type: 'array'});

        let worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let listNewStudent = XLSX.utils.sheet_to_json(worksheet, {header:["stt","hoTen","mssv","ngaySinh"]});

        resolve(listNewStudent)
      };
      reader.readAsArrayBuffer(file);

    })
  };

  handleImportData = async() => {
    if (!this.state.hasOwnProperty('fileImport')) {
      this.setState({
        justFileServiceResponse: 'Vui lòng chọn 1 file!!'
      });
      return;
    }

    this.setState({
      justFileServiceResponse: 'Vui lòng chờ!!'
    });

    this.convertData(this.state.fileImport).then(async(resolve) => {
      resolve.shift();

      await refreshToken();
      var secret = JSON.parse(localStorage.getItem('secret'));
      axios.post(`/manager/infoStudent/importFile`,{
          data: resolve,
          expireDay: new Date()
        }, { headers: {'x-access-token': secret.access_token} }
      ).then(result => {
        console.log('==import success', result);
        this.setState({
          justFileServiceResponse: 'Thêm thành công!!'
        });
      }).catch(err => {
        console.log('==import err', err.response.data);
        this.setState({
          justFileServiceResponse: 'Những sinh viên sau thêm chưa thành công!!',
          listExpired: err.response.data.list
        });
      })
    })
  };

  render(){
    return(
      <React.Fragment>
        <Button
          variant={'rounded'}
          onClick={()=>this.handlePopup(true)}
        >
          <i className="fas fa-file-import"/>
        </Button>

        {/*modal popup import file*/}
        <Modal
          size={'lg'}
          show={this.state.show}
          onHide={() =>this.handlePopup(false)}
        >
          <Modal.Body>

            <Row>
              <Col md={3}>
                Hạn đăng ký:
              </Col>
              <Col md={4}>
                <DatePicker
                  dateFormat='dd/MM/yyyy'
                  selected={this.state.regisExpiredDate}
                  onChange={(val) => this.getValueDate('regisExpiredDate', val)}
                  className='input-datepicker'
                />
              </Col>
            </Row>

            <Row>
              <Col md={3}>
                Hạn ở ký túc xá:
              </Col>
              <Col md={4}>
                <DatePicker
                  dateFormat='dd/MM/yyyy'
                  selected={this.state.expiredDate}
                  onChange={(val) => this.getValueDate('expiredDate', val)}
                  className='input-datepicker'
                />
              </Col>
            </Row>

            <input type="file" name="file" onChange={this.filesOnChange}/>


            <p className={'noti-text-style'}><b>{this.state.justFileServiceResponse}</b></p>

            {this.state.listExpired ?
              <Table responsive bordered size="sm">
                <thead className="title-table">
                <tr style={{textAlign: 'center'}}>
                  <th>STT</th>
                  <th>MSSV</th>
                  <th>Họ và Tên</th>
                  <th>Lỗi</th>
                </tr>
                </thead>
                <tbody>
                {this.state.listExpired.map(info => {
                  return (
                    <tr key={info.key}>
                      <td>{info.key++}</td>
                      <td>{info.data.mssv || ''}</td>
                      <td>{info.data.hoTen || ''}</td>
                      <td className={'noti-text-style'}>{info.msg || ''}</td>

                    </tr>
                  )
                })}

                </tbody>
              </Table>
              :
              <div>
                <i className={'noti-text-style'}><u>Lưu ý:</u> file excel(.xlsx) cần có dạng như sau. Tải mẫu &nbsp;
                  <span
                    onClick={() => this.downloadTemplate()}
                    className={'template'}
                  >
                  <u>tại đây</u>
                </span></i>

                <Table responsive hover bordered size="sm">
                  <thead className="title-excel">
                  <tr>
                    <td></td>
                    <td>A</td>
                    <td>B</td>
                    <td>C</td>
                    <td>D</td>
                    <td>E</td>

                  </tr>
                  </thead>
                  <tbody>

                  <tr key={0}>
                    <td className="title-excel">1</td>
                    <td>STT</td>
                    <td>Họ Tên</td>
                    <td>MSSV</td>
                    <td>Ngày sinh</td>
                    <td></td>
                  </tr>

                  <tr key={1}>
                    <td className="title-excel">2</td>
                    <td>1</td>
                    <td>Nguyễn Văn A</td>
                    <td>1512519</td>
                    <td>29/10/1997</td>
                    <td></td>
                  </tr>

                  <tr key={2}>
                    <td className="title-excel">3</td>
                    <td>2</td>
                    <td>Nguyễn Văn B</td>
                    <td>1512510</td>
                    <td>01/11/1997</td>
                    <td></td>
                  </tr>

                  <tr key={3}>
                    <td className="title-excel">4</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                  </tbody>
                </Table>
              </div>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() =>this.handlePopup(false)}>
              Cancel
            </Button>
            <Button  onClick={() => this.handleImportData()}>
              Upload
            </Button>
          </Modal.Footer>
        </Modal>
        {/*end modal*/}
      </React.Fragment>
    )
  }
}

export class ExportDataModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,
      searchValues: this.props.searchValues,
      loading: false,

      valueExport: {
        name: true,
        studentNumber: true,
        birthday: false,
        dayIn: false,
        dayOut: false,
        folk: false,
        phone: false,
        relativesPhone: false,
        gender: false,
        address: false,
        email: false,
        room: false,
        school: false,
        major: false,
        activityPoint: false,
        religion: false,
        note: false,
      }
    }
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.show !== this.state.show) {
      this.setState({
        show: nextProps.show,
      })
    }
    this.setState({
      searchValues: nextProps.searchValues,
    })
  }

  handlePopup = (state) => {
    this.setState({
      show: state,
    })
  };

  handleCheckValueExport = (obj) => {
    this.setState({
      valueExport: {...this.state.valueExport, [obj.value]: obj.chk}
    })
  };

  handleExportData = async() => {
    await this.setState({loading: true});
    console.log('==load', this.state)

    const {
      valueExport: {
        name,
        studentNumber,
        birthday,
        dayIn,
        dayOut,
        folk,
        phone,
        relativesPhone,
        gender,
        address,
        email,
        room,
        school,
        major,
        //activityPoint: false,
        religion,
      },
      //note: false
      searchValues,
    } = this.state;

    let header = {}
    if(name)
      header.hoTen = "Họ tên"
    if(studentNumber)
      header.MSSV = "MSSV"
    if(birthday)
      header.ngaySinh = "Ngày sinh"
    if(gender)
      header.gioiTinh = "Giới tính"
    if(address)
      header.diaChi = "Địa chỉ"
    if(email)
      header.email = "Email"
    if(phone)
      header.sdt = "Số điện thoại"
    if(relativesPhone)
      header.sdtNguoiThan = "số điện thoại người thân"
    if(religion)
      header.tonGiao = "Tôn giáo"
    if(folk)
      header.danToc = "Dân tộc"
    if(dayIn)
      header.ngayVaoO = "Ngày vào ở"
    if(dayOut)
      header.ngayHetHan = "Ngày hết hạn"
    if(room)
      header.phong = "Phòng"
    if(school)
      header.truong = "Trường"
    if(major)
      header.nganhHoc = "Ngành học"
    // if(ghiChuEx)
    //   header.email = "Email"
    console.log('==params11',searchValues)

    get_list_student(searchValues).then(result => {

      let data = result.data && result.data.map(record => {
        let genderString = record.gioiTinh ? "nam" : "nữ"
        return({
          hoTen : name ? record.hoTen : undefined,
          MSSV : studentNumber ? record.MSSV : undefined,
          ngaySinh : birthday ? record.ngaySinh : undefined,
          gioiTinh : gender ? genderString : undefined,
          diaChi : address ? record.diaChi : undefined,
          email : email ? record.email : undefined,
          sdt : phone ? record.sdt : undefined,
          sdtNguoiThan : relativesPhone ? record.sdtNguoiThan : undefined,
          tonGiao : religion ? record.tonGiao : undefined,
          danToc : folk ? record.danToc : undefined,
          ngayVaoO : dayIn ? record.ngayVaoO : undefined,
          ngayHetHan : dayOut ? record.ngayHetHan : undefined,
          //data.diemHD : diemHDEx ? record.hoTen : undefined,
          phong : room && record.idPhong ? record.idPhong.tenPhong : undefined,
          truong : school && record.truong ? record.truong.tenTruong : undefined,
          nganhHoc : major && record.nganhHoc ? record.nganhHoc.tenNganh : undefined,
          //ghiChu : note ? record.hoTen : undefined
        })})

      data.unshift(header)

      var ws = XLSX.utils.json_to_sheet(data, {skipHeader:true});

      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

      XLSX.writeFile(wb, "report.xlsx");
      this.setState({loading: false});

      this.handlePopup(false)

    }).catch(err => {
      console.log('==getall', err)
      ToastsStore.error("Có lỗi!");
    })


  };

  render(){
    console.log('==state modal0', this.state)
  	const {
      valueExport: {
        name,
        studentNumber,
        birthday,
        dayIn,
        dayOut,
        folk,
        phone,
        relativesPhone,
        gender,
        address,
        email,
        room,
        school,
        activityPoint,
        religion,
        note
      }
		} = this.state;
    return(
      <React.Fragment>
        <Loader loading={this.state.loading}/>

        <Button
          variant={'rounded'}
          onClick={()=>this.handlePopup(true)}
        >
          <i className="fas fa-file-export"/>
        </Button>

        {/*modal popup export file*/}
        <Modal show={this.state.show} onHide={() =>this.handlePopup(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Xuất file</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Checkbox
                  check={name}
                  label={'Họ và tên'}
                  name={'name'}
                  isCheck={this.handleCheckValueExport}
                />
              </Col>
              <Col md={6}>
                <Checkbox
                  check={folk}
                  label={'Dân tộc'}
                  name={'folk'}
                  isCheck={this.handleCheckValueExport}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Checkbox
                  check={studentNumber}
                  label={'MSSV'}
                  name={'studentNumber'}
                  isCheck={this.handleCheckValueExport}
                />
              </Col>
              <Col md={6}>
                <Checkbox
                  check={dayIn}
                  label={'Ngày vào'}
                  name={'dayIn'}
                  isCheck={this.handleCheckValueExport}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Checkbox
                  check={birthday}
                  label={'Ngày sinh'}
                  name={'birthday'}
                  isCheck={this.handleCheckValueExport}
                />
              </Col>
              <Col md={6}>
                <Checkbox
                  check={dayOut}
                  label={'Ngày hết hạn'}
                  name={'dayOut'}
                  isCheck={this.handleCheckValueExport}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Checkbox
                  check={gender}
                  label={'Giới tính'}
                  name={'gender'}
                  isCheck={this.handleCheckValueExport}
                />
              </Col>
              <Col md={6}>
                <Checkbox
                  check={activityPoint}
                  label={'Điểm hoạt động'}
                  name={'activityPoint'}
                  isCheck={this.handleCheckValueExport}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Checkbox
                  check={address}
                  label={'Địa chỉ'}
                  name={'address'}
                  isCheck={this.handleCheckValueExport}
                />
              </Col>
              <Col md={6}>
                <Checkbox
                  check={room}
                  label={'Phòng'}
                  name={'room'}
                  isCheck={this.handleCheckValueExport}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Checkbox
                  check={email}
                  label={'Email'}
                  name={'email'}
                  isCheck={this.handleCheckValueExport}
                />
              </Col>
              <Col md={6}>
                <Checkbox
                  check={school}
                  label={'Trường'}
                  name={'school'}
                  isCheck={this.handleCheckValueExport}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Checkbox
                  check={phone}
                  label={'Số điện thoại'}
                  name={'phone'}
                  isCheck={this.handleCheckValueExport}
                />
              </Col>
              <Col md={6}>
                <Checkbox
                  check={phone}
                  label={'Ngành học'}
                  name={'major'}
                  isCheck={this.handleCheckValueExport}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Checkbox
                  check={relativesPhone}
                  label={'Số điện thoại người thân'}
                  name={'relativesPhone'}
                  isCheck={this.handleCheckValueExport}
                />
              </Col>
              <Col md={6}>
                <Checkbox
                  check={note}
                  label={'Ghi chú'}
                  name={'note'}
                  isCheck={this.handleCheckValueExport}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Checkbox
                  check={religion}
                  label={'Tôn giáo'}
                  name={'religion'}
                  isCheck={this.handleCheckValueExport}
                />
              </Col>
            </Row>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() =>this.handlePopup(false)}>
              Cancel
            </Button>
            <Button onClick={() => this.handleExportData()}>
              Save file
            </Button>
          </Modal.Footer>
        </Modal>
        {/*end modal*/}
      </React.Fragment>
    )
  }
}

export class ChooseRoom extends Component{
  constructor(props){
    super(props);
    this.state = {
      show: this.props.show,
      label: this.props.label,
      data: [],
      onChange: () => {},
      oldRoom: this.props.room,
      newRoom: this.props.room

    }
  }

  componentWillMount(){
    get_floor_room().then(result => {
      console.log('==floor', result)
      this.setState({data: result.data})
    }).catch(err => {
      console.log('==err floor', err)
    })
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.show !== this.state.show) {
      this.setState({
        show: nextProps.show,
      })
    }
    if (nextProps.label !== this.state.label) {
      this.setState({
        label: nextProps.label,
      })
    }
    if (nextProps.room !== this.state.oldRoom) {
      this.setState({
        oldRoom: nextProps.room,
        newRoom: nextProps.room,

      })
    }
  }

  handlePopup = (state) => {
    this.setState({
      show: state,
    })
  };

  chooseRoom = (room) => {
    console.log('==click2', room)
    this.setState({
      newRoom: room
    })
  };

  handleSaveRoom = () => {
    this.props.onChange(this.state.newRoom)
  }

  handleCancel = () => {
    this.setState({
      newRoom: this.state.oldRoom
    })
    this.handlePopup(false)
  };

  render(){
    console.log('==modal', this.state)
    return(
      <React.Fragment>
        <div>{this.state.label}
        <Button
          style={{marginLeft: '2px'}}
          onClick={() => this.handlePopup(true)}
        >Thay đổi</Button>
        </div>
        <Modal show={this.state.show} onHide={() =>this.handlePopup(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Chọn phòng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ListRoom
              data={this.state.data}
              onClick={this.chooseRoom}
              active={this.state.newRoom}
            />

          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() =>this.handleCancel(false)}>
              Hủy
            </Button>
            <Button onClick={() => this.handleSaveRoom(false)}>
              Lưu
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
      )

  }
}

