import React, { Component } from 'react'
import { Table, Modal } from 'react-bootstrap'
import { saveAs } from 'file-saver'
import axios from './../../../config'

import refreshToken from './../../../../utils/refresh_token'
import Button from './../../../components/button/button'

class ActivityExport extends Component{
	static defaultProps = {
		show: false,
		handleClose: () => {},
	}
  constructor(props) {
    super(props)
    this.state = {
      idThe: '',
      data: []
    }
  }
  onChange = (val) => {
    this.setState({ idThe: val })
  }

  handleRollCall = async () => {
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
        idThe: this.state.idThe,
        point: this.props.data.diem
      }
    })
    axios({
      method: 'post',
      url: '/student/get-info-by-idCard',
      headers: { 
        'Content-Type': 'application/json',
        'x-access-token': secret.access_token
      },
      data:{
        idCard: this.state.idThe
      }
    }).then(res => {
      if(res.data.student){
        if(!this.state.data.some(el => el.MSSV === res.data.student.MSSV)){
          this.setState({ 
            data: this.state.data.concat(res.data.student)
          })
        }
      }
    })
    this.setState({
      idThe: ''
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
			<Modal show={this.props.show} onHide={this.props.handleClose} >
        		<Modal.Header closeButton>
            		<Modal.Title>Xuất báo cáo hoạt động</Modal.Title>
          		</Modal.Header>
          		<Modal.Body>
          			
          		</Modal.Body>
          		<Modal.Footer>
	            	<Button variant='default' color='default' onClick={this.props.handleClose}>
	            		Đóng
	            	</Button>
        		</Modal.Footer>
      </Modal>
		)
	}
}

export default ActivityExport