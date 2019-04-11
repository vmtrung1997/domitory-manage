import React, { Component } from 'react'
import { Table, Modal } from 'react-bootstrap'
import axios from './../../../config'

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
    console.log(this.state.idThe)
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
            		<Modal.Title>Điểm danh hoạt động</Modal.Title>
          		</Modal.Header>
          		<Modal.Body>
          			<div>
                  <span style={{fontWeight: 'bold'}}> Hoạt động: </span>
                  {this.props.data.ten}
                </div>
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

export default ActivityRollCall