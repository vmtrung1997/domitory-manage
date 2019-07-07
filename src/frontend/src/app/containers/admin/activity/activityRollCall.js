import React, { Component } from 'react'
import { Table, Modal } from 'react-bootstrap'
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from 'react-toasts'
import XLSX from 'xlsx'

import axios from './../../../config'
import './activityRollCall.css'
import Loader from './../../../components/loader/loader'
import refreshToken from './../../../../utils/refresh_token'
import Button from './../../../components/button/button'

class ActivityRollCall extends Component{
	static defaultProps = {
		show: false,
		handleClose: () => {},
	}
  constructor(props) {
    super(props)
    this.state = {
      idThe: '',
      data: [],
      fileImport: null,
      loading: false,
      type: true
    }
  }
  onChange = (val) => {
    this.setState({ idThe: val })
  }

  handleRollCall = async () => {
    var dateStart = new Date(this.props.data.ngayBD)
    dateStart.setHours(0,0,0)
    var dateEnd = new Date(this.props.data.ngayKT)
    var dateCur = new Date()

    await refreshToken()
    var secret = JSON.parse(localStorage.getItem('secret'))
    axios({
      method: 'post',
      url: '/manager/activity/rollcall',
      headers: { 
        'Content-Type': 'application/json',
        'x-access-token': secret.access_token
      },
      data:{
        idHD: this.props.data._id,
        idThe: this.state.idThe
      }
    })
    .then( rs => { 
      if(rs.data.rs === "ok"){
        if(!this.state.data.some(el => el.MSSV === rs.data.data.MSSV)){
          this.setState({ 
            data: this.state.data.concat(rs.data.data)
          })
        }
        ToastsStore.success("Điểm danh thành công!")
      }
      else if (rs.data.rs === "delete")
        ToastsStore.error("Sinh viên đã bị xoá!");
      else
        ToastsStore.error("Mã thẻ không tồn tại!");
    }).catch(err => {
      ToastsStore.error("Điểm danh không thành công!");
    })
    
    this.setState({ idThe: '' })
  }

  handleClose = () => {
    this.setState({ idThe: '' })
    this.props.handleClose()
  }

  changeState = (key, val) => {
    this.setState({ 
      [key]: val,
      fileImport: null,
    })
  }
  
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
        resolve(XLSX.utils.sheet_to_json(worksheet, {header:["mssv"]}))
      };
      reader.readAsArrayBuffer(file);
    })
  };

  checkImport = async () => {
    if(this.state.fileImport){
      if(this.state.fileImport.name.split('.')[1] === 'xlsx' || this.state.fileImport.name.split('.')[1] === 'xls'){
        var file = await this.convertData(this.state.fileImport).catch(() => ToastsStore.error('Dữ liệu không đúng yêu cầu!'))
        if(file[0].mssv.toLowerCase() === 'mssv'){
          this.handleImport(file)
        } else {
          ToastsStore.error('Dữ liệu không đúng yêu cầu!')
        }
      } else { 
        ToastsStore.error("Vui lòng chọn loại file là excel!");
      }
    } else {
      ToastsStore.error("Vui lòng chọn một file!");
    }
  }

  handleImport = async (file) => {
    this.setState({ loading: true })
    await refreshToken()
    var secret = JSON.parse(localStorage.getItem('secret'))
    axios({
      method: 'post',
      url: '/manager/activity/import_rollcall',
      headers: { 
        'Content-Type': 'application/json',
        'x-access-token': secret.access_token
      },
      data:{
        idHD: this.props.data._id,
        data: file
      }
    })
    .then( rs => { 
      if(rs.data.rs === "ok"){
        ToastsStore.success("Điểm danh thành công!")
        this.setState({ 
          loading: false,
          fileImport: null,
          loading: false,
          type: true
        })
        this.props.handleClose()
      }
    }).catch(err => {
      ToastsStore.error("Điểm danh bằng file không thành công!");
      this.setState({ 
        loading: false,
        fileImport: null
      })
    })
  }

	render(){
    var table = []
    this.state.data.map( (item, index) => {
      table.push(
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.MSSV}</td>
          <td>{item.hoTen}</td>
        </tr>
      )
      return true
    })

		return(
      <React.Fragment>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>
        <Loader loading={this.state.loading}/>
  			<Modal show={this.props.show} onHide={this.handleClose} >
          		<Modal.Header closeButton>
              		<Modal.Title>Điểm danh hoạt động</Modal.Title>
            		</Modal.Header>
            		<Modal.Body>
            			<div>
                    <span style={{fontWeight: 'bold'}}> Hoạt động: </span>
                    {this.props.data.ten}
                  </div>
                  <div className="group-option">
                    <input type="radio" name="type" value="normal" checked={this.state.type} onChange={e => this.changeState('type', true)}/>
                    <label> Bình thường </label>
                    <input type="radio" name="type" value="import" checked={!this.state.type} onChange={e => this.changeState('type', false)}/>
                    <label> File excel </label>
                  </div>
                  { this.state.type ?
                    <>
                    <div style={{textAlign: 'center', margin: '10px 0 0 0'}}>
                      <input 
                        value={this.state.idThe} 
                        onChange={e => {this.onChange(e.target.value)}} 
                        onKeyPress={ (e) => {if(e.key === 'Enter') this.handleRollCall()}}
                      />
                      <Button 
                        style={{margin: '0 10px'}} 
                        onClick={e => {this.handleRollCall()}}
                      > 
                        Điểm danh
                      </Button>
                    </div>
                    <Table bordered hover responsive size="sm" className="table-activity">
                      <thead style={{background: '#cfcfcf', textAlign: 'center'}}>
                        <tr>
                          <th>STT</th>
                          <th>MSSV</th>
                          <th>Họ tên</th>
                        </tr>
                      </thead>
                      <tbody>
                        {table}
                      </tbody>
                    </Table>
                    </>
                    :
                    <div style={{textAlign: 'center'}}>
                      <input type="file" name="file" onChange={this.filesOnChange} accept=".xlsx, .xls" />
                      <Button style={{margin: '0 10px'}} onClick={e => {this.checkImport()}}> 
                        Tải lên
                      </Button>
                      <div className={'noti-text-style'}><u>Lưu ý:</u> file excel(.xlsx, .xls) cần có dạng như sau.</div>

                      <Table responsive hover bordered size="sm">
                        <thead className="title-excel">
                        <tr>
                          <td></td>
                          <td>A</td>
                          <td>B</td>
                          <td>C</td>
                        </tr>
                        </thead>
                        <tbody>
                          <tr key={0}>
                            <td className="title-excel">1</td>
                            <td>MSSV</td>
                            <td></td>
                            <td></td>
                          </tr>

                          <tr key={1}>
                            <td className="title-excel">2</td>
                            <td>1512618</td>
                            <td></td>
                            <td></td>
                          </tr>

                          <tr key={2}>
                            <td className="title-excel">3</td>
                            <td>1512112</td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  }
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

export default ActivityRollCall