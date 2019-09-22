import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import { saveAs } from 'file-saver'
import DatePicker from 'react-datepicker'
import axios from './../../../config'
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from "react-toasts";

import './activityExport.css'
import Loader from './../../../components/loader/loader'
import refreshToken from './../../../../utils/refresh_token'
import Button from './../../../components/button/button'

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
      dateBegin: new Date(),
      dateEnd: new Date()
    }
  }

  changeState = (key, value) => {
    this.setState({ [key]: value })
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
          dateBegin: this.state.dateBegin,
          dateEnd: this.state.dateEnd
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

		return(
      <React.Fragment>
        <Loader loading={this.state.loading}/>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>
  			<Modal show={this.props.show} onHide={this.handleClose} >
          		<Modal.Header closeButton>
              		<Modal.Title>Xuất báo cáo hoạt động</Modal.Title>
            		</Modal.Header>
            		<Modal.Body>
                  <>
                    <span> Chọn mốc thời gian </span>
                    <div style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
                      <div style={{margin: '0 10px'}}> Từ</div>
                      <DatePicker
                        dateFormat='dd/MM/yyyy'
                        selected={this.state.dateBegin}
                        onChange={(val) => this.changeState('dateBegin', val)}
                        className='input1'
                      />
                      <div style={{margin: '0 10px'}}> Đến</div>
                      <DatePicker
                        dateFormat='dd/MM/yyyy'
                        selected={this.state.dateEnd}
                        onChange={(val) => this.changeState('dateEnd', val)}
                        className='input1'
                      />
                    </div>
                  </>
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