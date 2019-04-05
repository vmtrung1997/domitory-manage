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
    query: '',
		handleClose: () => {},
	}
  constructor(props) {
    super(props)
    this.state = {
      checkDetail: true,
      idThe: '',
      data: []
    }
  }

  getData = async () => {
    await refreshToken()
    var secret = JSON.parse(localStorage.getItem('secret'))
    axios({
      method: 'post',
      url: '/manager/activity/search_activity',
      headers: { 'x-access-token': secret.access_token},
      data: {
        search: this.state.query,
      }
    })
    .then(res => {
      this.setState({
        data: res.data.rs,
        query: ''
      })
    })
    .catch( err => {
      this.setState({ loading: false })
    })
  }
  
  getValue = (name, val) =>{
    this.setState({ [name]: val})
  }

  check = () => {
    this.setState({ checkDetail: !this.state.checkDetail})
  }

	render(){
    console.log(this.state)
    var table = []
    // this.state.data.map( (item, index) => {
    //   table.push(
    //     <tr key={index}>
    //       <td>{index + 1}</td>
    //       <td>{item.MSSV}</td>
    //       <td>{item.hoTen}</td>
    //     </tr>
    //   )
    //   return true
    // })

		return(
			<Modal show={true} onHide={this.props.handleClose} >
        		<Modal.Header closeButton>
            		<Modal.Title>Xuất báo cáo hoạt động</Modal.Title>
          		</Modal.Header>
          		<Modal.Body>
                <div> 
                  <input type="radio" name="type" value="male" onClick={() => this.check()} defaultChecked/> Xuất báo cáo chi tiết<br/>
                  <input type="radio" name="type" value="female" onClick={() => this.check()}/> Xuất tổng hợp
                </div>
                {this.state.checkDetail ? (
                  <Input 
                    value={this.state.query}
                    placeholder={'Tìm kiếm hoạt động'}
                    onKeyPress={ (e) => {if(e.key === 'Enter') this.getData()}}
                    getValue={ (obj) => this.getValue('query', obj.value)}
                  />
                ):(
                  <Table bordered hover responsive size="sm" className="table-activity">
                    <thead style={{ textAlign: 'center'}}>
                      <tr>
                        <th >
                          <input type="checkbox"/>
                        </th>
                        <th>Năm học</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table}
                    </tbody>
                  </Table>
                )}
          		</Modal.Body>
          		<Modal.Footer>
	            	<Button variant='default' color='default' onClick={this.props.handleClose}>
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