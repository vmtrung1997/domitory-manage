import React, { Component } from 'react'
import { Table, Modal } from 'react-bootstrap'
import { saveAs } from 'file-saver'
import axios from './../../../config'

import refreshToken from './../../../../utils/refresh_token'
import Button from './../../../components/button/button'
import Input from './../../../components/input/input'
import CheckBox from './../../../components/checkbox/checkbox'

class ActivityExport extends Component{
	static defaultProps = {
		show: false,
    last: new Date().getFullYear(),
		handleClose: () => {},
	}
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      check: []
    }
  }

  getValue = (e) => {
    if( !this.state.check.includes(e.target.value)) {
      this.setState({ check: this.state.check.concat(e.target.value)})
    } else {
      var arr = this.state.check.filter( item => item !== e.target.value)
      this.setState({ check: arr })
    }
  }

  handleSubmit = async () => {
    await refreshToken()
    var secret = JSON.parse(localStorage.getItem('secret'))
    axios({
      method: 'post',
      url: '/manager/activity/export_activity',
      headers: { 'x-access-token': secret.access_token},
      data: {
        year: this.state.check,
      }
    })
    .then( res => {
      var byteCharacters = window.atob(res.data.file);
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      
      saveAs(blob, res.data.filename)     
    })
    .catch( err => {
      this.setState({ loading: false })
    })

    this.handleClose()
  }

  handleClose = () =>{
    this.setState({ check: [] })
    this.props.handleClose()
  }

	render(){
    var tableSemester = []
    
    for(var i =  new Date().getFullYear() + 1; i >= this.props.last; i--){
      tableSemester.push(
        <tr key={i} style={{textAlign: 'center'}}>
          <td>
            <input type='checkbox' onClick={(e) => this.getValue(e)} value={i}/>
          </td>
          <td> {i - 1} - { i } </td>
        </tr>
      )
    }

		return(
			<Modal show={this.props.show} onHide={this.handleClose} >
        		<Modal.Header closeButton>
            		<Modal.Title>Xuất báo cáo hoạt động</Modal.Title>
          		</Modal.Header>
          		<Modal.Body>
                <div> 
                  <input type="radio" name="type" value="check" onClick={() => this.check()} defaultChecked/> Xuất tổng hợp
                </div>
                
                <div style={{maxHeight: '400px', overflow: 'auto'}}>
                <Table bordered hover responsive size="sm" >
                  <thead style={{ textAlign: 'center'}}>
                    <tr>
                      <th >
                        Chọn
                      </th>
                      <th>Năm học</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableSemester}
                  </tbody>
                </Table>
                </div>
          		</Modal.Body>
          		<Modal.Footer>
	            	<Button variant='default' color='default' onClick={this.handleClose}>
	            		Đóng
	            	</Button>
                <Button variant="default" onClick={this.handleSubmit}>
                  Xuất báo cáo
                </Button>
        		</Modal.Footer>
      </Modal>
		)
	}
}

export default ActivityExport