import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import TimeField from 'react-simple-timefield';
import axios from './../../../config'
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from "react-toasts";

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
    var time = today.getHours() + ':' + today.getMinutes()
    this.state = {
      name: '',
      location: '',
      date: today,
      time: time,
      dateEnd: today,
      timeEnd: time,
      isRequire: false,
      des: '',
      point: 0
    }
  }
  
  getValue = (name, val) => {
    this.setState({ [name]: val })
  }
  handleSave = async () => {
    var {name, location, des, point, date, dateEnd} = this.state
    if(!name || !location || !des || !point) {
      ToastsStore.error("Bạn phải nhập đầy đủ thông tin!");
    } else if(parseInt(point) <= 0) {
      ToastsStore.error("Điểm hoạt động phải lớn hơn 0!");
    } else if(date < new Date().setHours(0,0,0) || dateEnd < new Date().setHours(0,0,0)) {
      ToastsStore.error("Thời gian bắt đầu và kết thúc phải lớn hơn ngày hiện tại!");
    } else if(dateEnd.setHours(0,0,0) < date.setHours(0,0,0)){
      ToastsStore.error("Thời gian kết thúc không nhỏ hơn thời gian bắt đầu!");
    } else {
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
          date: this.state.date,
          dateEnd: this.state.dateEnd,
          timeEnd: this.state.timeEnd,
          isRequire: this.state.isRequire,
          des: this.state.des,
          point: this.state.point
        }
      }).then(res => {
        ToastsStore.success("Chỉnh sửa hoạt động thành công!");
      }).catch(err => {
        ToastsStore.error("Chỉnh sửa hoạt động không thành công!");
      })

      this.props.handleSave()
    }
  }

  componentWillMount(){
    const data = this.props.data
    this.setState({
      name: data.ten,
      location: data.diaDiem,
      date: new Date(data.ngayBD),
      time: new Date(data.ngayBD).getHours() + ':' + new Date(data.ngayBD).getMinutes(),
      dateEnd: new Date(data.ngayKT),
      timeEnd: new Date(data.ngayKT).getHours() + ':' + new Date(data.ngayKT).getMinutes(),
      isRequire: data.batBuoc,
      des: data.moTa,
      point: data.diem
    })
  }
	render(){
	  console.log('==type', typeof(this.state.dateEnd))
		return(
      <React.Fragment>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>
  			<Modal show={this.props.show} onHide={this.props.handleClose} style={{marginTop: '-20px'}}>
          		<Modal.Header closeButton>
              		<Modal.Title>Chỉnh sửa hoạt động</Modal.Title>
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
            			<div>
                    <span> Thời gian bắt đầu</span>
                    <div style={{display: 'flex', justifyContent: 'space-around'}}>
                      <TimeField
                        style={{marginRight: '10px'}}
                        value={this.state.time}
                        onChange={(value) => {this.getValue('time', value)}}
                        input={<input/>}
                      />
                      <DatePicker
                        dateFormat='dd/MM/yyyy'
                        selected={this.state.date}
                        onChange={(val) => this.getValue('date', val)}
                        className='input-datepicker'
                      />
                    </div>
                  </div>
                  <div>
                    <span> Thời gian kết thúc</span>
                    <div style={{display: 'flex', justifyContent: 'space-around'}}>
                      <TimeField
                        style={{marginRight: '10px'}}
                        value={this.state.timeEnd}
                        onChange={(value) => {this.getValue('timeEnd', value)}}
                        input={<input/>}
                      />
                      <DatePicker
                        dateFormat='dd/MM/yyyy'
                        selected={this.state.dateEnd}
                        onChange={(val) => this.getValue('dateEnd', val)}
                        className='input-datepicker'
                      />
                    </div>
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
            				<span style={{fontWeight: 'bold'}}> Hoạt động bắt buộc </span>
            				<CheckBox 
                      name='isRequire'
                      style={{display: 'grid'}}
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
      </React.Fragment>
		)
	}
}

export default ActivityEdit