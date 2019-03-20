import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import axios from './../../../config'

import refreshToken from './../../../../utils/refresh_token'
import Button from './../../../components/button/button'
import Input from './../../../components/input/input'
import CheckBox from './../../../components/checkbox/checkbox'

class ActivityEdit extends Component{
	static defaultProps = {
		show: false,
		handleClose: () => {},
		handleSave: () => {},
	}
  constructor(props){
    super(props)
    var today = new Date()
    this.state = {
      name: '',
      location: '',
      time: today,
      isRequire: false,
      des: '',
      point: 0
    }
  }
  
  getValue = (name, val) => {
    this.setState({ [name]: val })
    if(name === 'time')
      this.props.data.ngay = val
    if(name === 'des')
      this.props.data.moTa = val
  }
  handleSave = async () => {
    await refreshToken()
    var secret = JSON.parse(localStorage.getItem('secret'))
    axios({
      method: 'post',
      url: `/manager/activity/update?id=${this.props.data._id}`,
      headers: { 
        'Content-Type': 'application/json',
        'x-access-token': secret.access_token
      },
      data:{
        name: this.state.name,
        location: this.state.location,
        time: this.state.time,
        isRequire: this.state.isRequire,
        des: this.state.des,
        point: this.state.point
      }
    })

    this.props.handleSave()
  }

  componentWillMount(){
    this.setState({
      name: this.props.data.ten,
      location: this.props.data.diaDiem,
      time: new Date(this.props.data.ngay),
      isRequire: this.props.data.batBuoc,
      des: this.props.data.moTa,
      point: this.props.data.diem
    })
  }
	render(){
		return(
			<Modal show={this.props.show} onHide={this.props.handleClose} style={{marginTop: '-20px'}}>
        		<Modal.Header closeButton>
            		<Modal.Title>Thêm hoạt động</Modal.Title>
          		</Modal.Header>
          		<Modal.Body>
          			<div>
          				<span> Hoạt động </span>
          				<Input value={this.state.name} getValue={ (obj) => this.getValue(obj.name, obj.value)} name='name'/>
          			</div>
          			<div>
          				<span> Địa điểm </span>
          				<Input value={this.state.location} getValue={ (obj) => this.getValue(obj.name, obj.value)} name='location'/>
          			</div>
          			<div style={{width: '50%'}}>
          				<span> Thời gian </span>
          				<DatePicker
          					dateFormat='dd/MM/yyyy'
							      selected={this.state.time}
							      onChange={(val) => this.getValue('time', val)}
							      className='input-datepicker'
						      />
          			</div>
          			<div>
          				<span> Mô tả </span>
          				<textarea value={this.state.des} rows='4' onChange={ (obj) => this.getValue('des', obj.target.value)}/>
          			</div>
                <div>
                  <span> Điểm hoạt động </span>
                  <Input value={this.state.point} getValue={ (obj) => this.getValue(obj.name, obj.value)} name='point'/>
                </div>
          			<div style={{marginTop: '10px'}}>
          				<span style={{fontWeight: 'bold'}}> Bắt buộc </span>
          				<CheckBox 
                    name='isRequire'
                    style={{marginTop: '-10px', display: 'contents'}}
                    check={this.state.isRequire}
                    isCheck={ (obj) => this.getValue(obj.value, obj.chk)}
                  />
          			</div>
          		</Modal.Body>
          		<Modal.Footer>
	            	<Button variant='default' color='default' onClick={this.props.handleClose}>
	            		Đóng
	            	</Button>
	            	<Button variant='default' onClick={this.handleSave}>
	            		Lưu
	              	</Button>
        		</Modal.Footer>
      </Modal>
		)
	}
}

export default ActivityEdit