import React, { Component } from 'react'
import { Table, Modal } from 'react-bootstrap'
import { saveAs } from 'file-saver'
import axios from './../../../config'
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from "react-toasts";

import Loader from './../../../components/loader/loader'
import refreshToken from './../../../../utils/refresh_token'
import Button from './../../../components/button/button'
import Input from './../../../components/input/input'
import CheckBox from './../../../components/checkbox/checkbox'

class ActivityExport extends Component{
	static defaultProps = {
    loading: false,
		show: false,
    last: 0,
		handleClose: () => {},
	}
  constructor(props) {
    super(props)
    this.state = {
      check: 0
    }
  }

  changeState = (val) => {
    this.setState({ check: parseInt(val) })
  }

  handleSubmit = async () => {
    this.setState({ loading: true })
    if(this.state.check !== 0){
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

        this.setState({ loading: false }) 
        ToastsStore.success("Xuất file báo cáo hoạt động thành công!");
      })
      .catch( err => {
        this.setState({ loading: false })
        ToastsStore.error("Xuất file báo hoạt động thất bại!");   
      })
    }
    this.handleClose()
  }

  handleClose = () =>{
    this.setState({ check: 0 })
    this.props.handleClose()
  }

	render(){
    var tableSemester = []
    for(var i =  new Date().getFullYear() + 1; i >= this.props.last; i--){
      tableSemester.push(
        <tr key={i} style={{textAlign: 'center'}}>
          <td>
            <input type='radio' name='year' value={i} onClick={(e) => this.changeState(e.target.value)}/>
          </td>
          <td> {i - 1} - { i } </td>
        </tr>
      )
    }

		return(
      <React.Fragment>
        <Loader loading={this.state.loading}/>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>
  			<Modal show={this.props.show} onHide={this.handleClose} >
          		<Modal.Header closeButton>
              		<Modal.Title>Xuất báo cáo hoạt động</Modal.Title>
            		</Modal.Header>
            		<Modal.Body>
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
      </React.Fragment>
		)
	}
}

export default ActivityExport