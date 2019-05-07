import React, { Component } from 'react'
import { Modal, Row, Col, Table } from 'react-bootstrap'
import Button from '../../../components/button/button'
import Optimize from '../../../optimization/optimizationNumber/optimizationNumber'
import ReactToPrint from 'react-to-print';
import DatePicker from '../../../components/datePicker/datePicker'
import { get_data_print } from './expensesAction'
import Input from '../../../components/input/input';
import RadioButton from '../../../components/radioButton/radioButton'
class ComponentToPrint extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.children}
      </React.Fragment>
    );
  }
}
class Confirm extends Component {
  static defaultProps = {
    show: false,

  }
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,
      printComponent: (<div></div>),
      tableData: {},
      selectedData: [],
      fromDay: new Date(),
      toDay: new Date(),
      lastDay: new Date(),
      admin: 'Phan Văn Thành'
    }
  }
  componentDidMount() {
    this.setState({
      tableData: this.props.printTable,
      selectedData: this.props.printSelected
    })
  }
  componentWillReceiveProps(props) {
    if (props.show !== this.state.show) {
      this.setState({ show: props.show })
    }
    if (props.printTable !== this.state.tableData) {
      console.log(props.printTable);
      this.setState({ tableData: {
        month: parseInt(props.printTable.month),
        year: parseInt(props.printTable.year),
        room: props.printTable.room,
        status: parseInt(props.printTable.status)
      } })
    }
    if (props.printSelected !== this.state.selectedData) {
      this.setState({ selectedData: props.printSelected })
    }
  }

  handleClose = () => {
    this.setState({ show: false })
  }
  handleShow = () => {
    this.setState({
      show: true,
      fromDay: new Date(),
      toDay: new Date(),
      lastDay: new Date(),
      admin: 'Phan Văn Thành'
    })
  }
  getDataPrint = (type) => {
    this.setState({printComponent: (<div>Đang tải dữ liệu</div>)})
    var data = type === 'table' ? this.state.tableData : this.state.selectedData;
    get_data_print({ type: type, data: data }).then(result => {
      if (result.data.rs === 'success') {
        var printCpn=this.componentPrint(this.printData(result.data.data));
        this.setState({ printComponent: printCpn })
      } else {
        this.setState({printComponent: (<div>{result.data.msg}</div>)})
      }
    })
  }
  printData = (data) => {
    return (
      <div>
        {data.map((value, index) => {
          return (
            <React.Fragment>
              <h1 className={'page-break'}/>
              <div key={index} >
                <div>
                  {this.printDetailStructure(value)}
                </div>
                <div>
                  {this.printTableStructure(value)}
                </div>
              </div>
            </React.Fragment>
          )
        })}
      </div>
    )
  }
  printTableStructure = (data) => {
    var { detail, thongSo } = data
    return (<div className='layout-print'>
      <div>
        {detail.idPhong.loaiPhong.dien && <Row>
          <Col style={{ marginBottom: '10px' }} md={12}><span>* Giá định mức Điện sinh hoạt (bao gồm thuế GTGT)</span></Col>
          <Col md={12}>
            {this.tableRender(
              thongSo
                .filter(value => value.loaiChiPhi === 0)
                .sort((a, b) => { return a.id > b.id ? 1 : -1 }),
              (<tr>
                <th>STT</th>
                <th>MỨC SỬ DỤNG CỦA MỘT PHÒNG TRONG THÁNG</th>
                <th>THÀNH TIỀN</th>
              </tr>)
            )}
          </Col>
        </Row>}

      </div>
      {detail.idPhong.loaiPhong.nuoc && <Row>
        <Col style={{ marginBottom: '10px' }} md={12}><span>* Giá định mức Nước sinh hoạt (bao gồm thuế GTGT và phí bảo vệ môi trường)</span></Col>
        <Col md={12}>
          {this.tableRender(
            thongSo
              .filter(v => v.loaiChiPhi === 1)
              .sort((a, b) => { return a.id > b.id ? 1 : -1 }),
            (<tr style={{ verticalAlign: 'middle' }}>
              <th>STT</th>
              <th>ĐỐI TƯỢNG SỬ DỤNG NƯỚC</th>
              <th>Tổng cộng <br />(đồng/m<sup>3</sup>)</th>
            </tr>)
          )}
        </Col>
      </Row>}
      <Row>
        <Col>
          Tiền rác: {detail.idPhong.loaiPhong.tienRac}
        </Col>
      </Row>
    </div>)
  }
  tableRender = (table, header) => {
    return (
      <Table bordered className='table-print'>
        <thead className='text-center'>
          {header}
        </thead>
        <tbody>
          {table && table.map((para, index) => {
            return (
              <tr key={index}>
                <td className='text-center'>{index + 1}</td>
                <td>{para.moTa}</td>
                <td className='text-right'>{Optimize.OpitmizeNumber(para.giaTriThuc)}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    )
  }
  dateToString = (date) => {
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
  }
  printDetailStructure = (data) => {
    let exp = data.detail
    let { fromDay, toDay, admin, lastDay } = this.state
    return (<div className={'layout-print'}>
      <Row className='m-b-10'>
        <Col xs={6}>
          <p className='m-b-10 text-center'>TRƯỜNG ĐẠI HỌC KHOA HỌC TỰ NHIÊN</p>
          <p className='m-b-10 text-center bold-style'>PHÒNG CÔNG TÁC SINH VIÊN</p>
        </Col>
      </Row>
      <Row className={'m-b-10 text-center title-print'}>
        <Col xs={12}> GIẤY BÁO ĐIỆN NƯỚC THÁNG {exp.thang}/{exp.nam}
        </Col>
      </Row>
      <Row className={'m-b-10'}>
        <Col xs={12}>
          Phòng: {exp.idPhong.tenPhong} &nbsp;&nbsp; Số người: {exp.idPhong.soNguoi}
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Table bordered className='table-print'>
            <thead className="text-center">
              <tr>
                <th>Loại</th>
                <th>Chỉ số đầu</th>
                <th>Chỉ số cuối</th>
                <th>Tiêu thụ</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Điện</td>
                <td className='text-right'>{Optimize.OpitmizeNumber(exp.soDienCu)}</td>
                <td className='text-right m-b-0'>{Optimize.OpitmizeNumber(exp.soDien)}</td>
                <td rowSpan={exp.thayDien ? '2' : '1'} className='text-right vertical-middle'>{
                  Optimize.OpitmizeNumber(exp.thayDien ? exp.soDien - exp.soDienCu + exp.thayDien.dienMoi - exp.thayDien.dienCu :
                    exp.soDien - exp.soDienCu)
                }</td>
                <td rowSpan={exp.thayDien ? '2' : '1'} className='text-right vertical-middle'>{Optimize.OpitmizeNumber(exp.tienDien)}</td>
              </tr>
              {exp.thayDien && <tr>
                <td>Điện (thay mới)</td>
                <td className='text-right'>{Optimize.OpitmizeNumber(exp.thayDien.dienCu)
                }</td>
                <td className='text-right'>{Optimize.OpitmizeNumber(exp.thayDien.dienMoi)
                }</td>
              </tr>}
              <tr>
                <td>Nước</td>
                <td className='text-right'>{Optimize.OpitmizeNumber(exp.soNuocCu)}</td>
                <td className='text-right'>{Optimize.OpitmizeNumber(exp.soNuoc)
                }</td>
                <td rowSpan={exp.thayNuoc ? '2' : '1'} className='text-right vertical-middle'>{
                  Optimize.OpitmizeNumber(exp.thayNuoc ? exp.soNuoc - exp.soNuocCu + exp.thayNuoc.nuocMoi - exp.thayNuoc.nuocCu :
                    exp.soNuoc - exp.soNuocCu)

                }</td>
                <td rowSpan={exp.thayNuoc ? '2' : '1'} className='text-right vertical-middle'>{Optimize.OpitmizeNumber(exp.tienNuoc)}</td>
              </tr>
              {exp.thayNuoc && <tr>
                <td>Nước (thay mới)</td>
                <td className='text-right'>{Optimize.OpitmizeNumber(exp.thayNuoc.nuocCu)}</td>
                <td className='text-right'>{Optimize.OpitmizeNumber(exp.thayNuoc.nuocMoi)}</td>
              </tr>}
              <tr>
                <td className='text-center' colSpan={4}>Tiền rác</td>
                <td className='text-right'>{Optimize.OpitmizeNumber(exp.tienRac)}</td>
              </tr>
              <tr>
                <td className='text-center' colSpan={4}>Tổng tiền</td>
                <td className='text-right'>{Optimize.OpitmizeNumber(exp.tongTien)}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row className={'m-b-10'}>
        <Col xs={12}>
          Thành tiền: {exp.tongTienChu} đồng.
        </Col>
      </Row>
      <Row className={'m-b-10'}>
        <Col xs={6} className={'suggest'}>
          <div style={{ textDecoration: 'underline' }}>Đề nghị:</div>
          <ul className={'suggest-text'}>
            <li>Nếu có vấn đề liên quan đến việc cung cấp điện nước tại các phòng, yêu cầu sinh viên liên hệ tại VP.BPQLKTX để giải quyết.</li>
            <li>Đại diện phòng mang theo giấy báo đến VP đóng tiền</li>
            <li>Thời gian đóng tiền trước ngày <div className='bold-style' style={{ display: 'inline' }}>{this.dateToString(lastDay)}</div></li>
            <li>Các phòng ghi sai số điện, nước tiêu thụ từ ngày <div className='bold-style' style={{ display: 'inline' }}>{this.dateToString(fromDay)}</div> đến ngày <div className='bold-style' style={{ display: 'inline' }}>{this.dateToString(toDay)}</div> yêu cầu đến liên hệ tại VP.BP QLKTX <div className='bold-style' style={{ display: 'inline' }}>{`(ông ${admin})`}</div> để chỉnh sửa, quá thời gian trên, VP.BP BPQLKTX sẽ không chỉnh sửa chỉ số điện nước</li>
            <li>Sau ngày <div className='bold-style' style={{ display: 'inline' }}>{this.dateToString(lastDay)}</div> những phòng chưa đóng tiền điện, nước bộ phận Quản lý KTX sẽ tạm ngưng cung cấp điện</li>
          </ul>
        </Col>
        <Col xs={1}></Col>
        <Col xs={5} className={'text-center bold-style'}>
          <div>TP.HCM ngày {fromDay.getDate()} tháng {fromDay.getMonth()+1} năm {fromDay.getFullYear()}</div>
          <div>PHÓ BỘ PHẬN QUẢN LÝ KÝ TÚC XÁ</div>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <div style={{ textTransform: 'uppercase' }}>{admin}</div>
        </Col>
      </Row>
    </div>)
  }
  afterPrint = () => {
    this.setState({ show: false, printComponent: (<div></div>) })
  }
  componentPrint = (component) => {
    return (
      <>
        <ReactToPrint
          trigger={() => <Button>In dữ liệu</Button>}
          content={() => this.componentRef}
          onBeforePrint={() => this.afterPrint()}
        />
        <div style={{ display: 'none' }}>
          <ComponentToPrint ref={el => (this.componentRef = el)}>
            {component}
          </ComponentToPrint>
        </div>
      </>
    )
  }
  render() {
    return (
      <React.Fragment>
        <Button onClick={this.handleShow}><i className="fas fa-print"></i></Button>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>In chi phí</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Row className='m-b-10'>
						<Col>
						Ngày bắt đầu
						<div>
							<DatePicker 
								startDate={this.state.fromDay}
								getValue={(date) => {this.setState({fromDay: date})}}
							/>
						</div>
						</Col>
						<Col>
						Ngày kết thúc
						<div>
							<DatePicker
								startDate={this.state.toDay}
								getValue={(date) => {this.setState({toDay: date})}}
							/>
						</div>
						</Col>
					</Row>
          <Row>
          <Col>
          Hạn cuối
						<div>
							<DatePicker
								startDate={this.state.lastDay}
								getValue={(date) => {this.setState({lastDay: date})}}
							/>
						</div>
            </Col>
            <Col>
            Người quản lý
            <Input value={this.state.admin} getValue={t => this.setState({admin: t.value})}/>
            </Col>
          </Row>
            <Row className='m-b-10'>
              <Col>
              <RadioButton name='print-button' label={'In toàn bảng'} isRadioChk={() => this.getDataPrint('table')} />
                {/* <label className={'print-button'} htmlFor={'ktx-print'} onClick={() => this.getDataPrint('table')}>In toàn bảng</label> */}
              </Col>
              <Col>
              <RadioButton name='print-button' label={'In đã chọn'} isRadioChk={() => this.getDataPrint('select')} />
                {/* <label className={'print-button'} htmlFor={'ktx-print'} onClick={() => this.getDataPrint('select')}>In đã chọn</label> */}
              </Col>
            </Row>
            <Row className='m-b-10'>
              <Col>{this.state.printComponent}</Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='default' color='default' onClick={this.handleClose}>
              Đóng
	          </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    )
  }
}

export default Confirm