import React, { Component } from 'react'
import { Col, Row } from 'react-bootstrap'
import Input from '../../components/input/input';
import './index.css'
import Button from '../../components/button/button';
import {getHistoryList} from './indexAction'
import axios from 'axios'
class Security extends Component {
	constructor(props){
		super(props)
		this.state = {
			history: [
				{MSSV: '1512618', hoTen:'Trần Thành Trung', phong: '107', ngayVao:'2:28:30 26/3/2019', img:'https://akns-images.eonline.com/eol_images/Entire_Site/20181026/rs_600x600-181126230834-e-asia-iu-things-to-know-thumbnail.jpg?fit=around|700:700&crop=700:700;center,top&output-quality=90'},
				{MSSV: '1512619', hoTen:'Nguyễn Trung Tài', phong: '108', ngayVao:'2:28:30 26/3/2019', img:'https://akns-images.eonline.com/eol_images/Entire_Site/20181026/rs_600x600-181126230834-e-asia-iu-things-to-know-thumbnail.jpg?fit=around|700:700&crop=700:700;center,top&output-quality=90'},
				{MSSV: '1512519', hoTen:'Tôn nữ Trần Lê Phương Thảo', phong: '109', ngayVao:'2:28:30 26/3/2019', img:'https://akns-images.eonline.com/eol_images/Entire_Site/20181026/rs_600x600-181126230834-e-asia-iu-things-to-know-thumbnail.jpg?fit=around|700:700&crop=700:700;center,top&output-quality=90'},
				{MSSV: '1512619', hoTen:'Võ Minh Trung', phong: '109', ngayVao:'2:28:30 26/3/2019', img:'https://akns-images.eonline.com/eol_images/Entire_Site/20181026/rs_600x600-181126230834-e-asia-iu-things-to-know-thumbnail.jpg?fit=around|700:700&crop=700:700;center,top&output-quality=90'}
			],
			isHide: true,
			file: '',
			mssv: ''
		}
	}
	hideLichSu = () => {
		this.setState({isHide:!this.state.isHide})
	}
	onImportFile = (e) => {
		this.setState({file: e.target.files[0]})
	}
	fixdata = (data) =>{
		var o = "", l = 0, w = 10240;
		for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
		o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
		return o;
	}
	componentDidMount() {
		
	}
	submitFile = () => {
		var fileReader = new FileReader();
		fileReader.readAsArrayBuffer(this.uploadInput.files[0]);
		var self = this;
		fileReader.onload = function (e){
			var data = e.target.result;
			var arr = self.fixdata(data);
			axios.post('/user/test_file_excel', {file: arr}).then(result => {
				if (result){
					console.log(result);
				}
			}).catch(err => console.log(err))
		}
	}
	onEnterInput = (e) => {
		if (e.key !== 'enter')
			return;
		var {mssv} = this.state;
		
	}
	getInput = (target) => {
		this.setState({mssv: target.value})
	}
	render() {
		return (
			<React.Fragment>
				
				<div className={'content-body'}>
					<Row>
						<Col md={this.state.isHide?12:9}>
							<Row>
								<Col md={6} className={'col-outer'}>
									<div className={'img-css'}>
										<img className={'resize'} src={'https://akns-images.eonline.com/eol_images/Entire_Site/20181026/rs_600x600-181126230834-e-asia-iu-things-to-know-thumbnail.jpg?fit=around|700:700&crop=700:700;center,top&output-quality=90'} />
									</div>
								</Col>
								<Col md={6}>
									<Row>
										<Col md={6}><Input placeholder={'MSSV'} value={this.state.mssv} getValue={this.getInput} onKeyPress={(e)=> this.onEnterInput(e)}/>
										<input type='file' ref={(ref) => { this.uploadInput = ref;}}/>
										<Button onClick={this.submitFile}>Submit</Button>
										</Col>
									<Col md={6} style={{textAlign: 'right'}}>
										<div className={'id-back'} onClick={this.hideLichSu}>
												<span>Lịch sử ra vào</span>
												<i className="fas fa-chevron-right" />
										</div>
									</Col>
									</Row>
									<div style={{ margin: '5em 0', textAlign: 'center' }}>
										<Col md={12} className={'info'}><span style={{ fontSize: '2em', color: 'red' }}>NGUYỄN VĂN A</span></Col>
										<Col md={12} className={'info'}>MSSV: <span>1512666</span></Col>
										<Col md={12} className={'info'}>Phòng: <span>307</span></Col>
										<Col md={12} className={'info'}>Giờ vào: <span>12:30:20 26/3/2019</span></Col>
									</div>
								</Col>
							</Row>
						</Col>
						{!this.state.isHide && <Col md={3}><div>
							{this.state.history && this.state.history.map((value, index) => {
								return (
									<Row key={index}>
										<div className={'item-history'}>
											<div className={'item-image'}>
												<img src={value.img}/>
											</div>
											<div className={'item-text'}>
												<div>{value.hoTen}</div>
												<div>{value.phong}</div>
												<div>{value.ngayVao}</div>
											</div>
										</div>
									</Row>
								)
							})}
						</div>
						</Col>}
					</Row>
				</div>
			</React.Fragment>
		)
	}
}

export default Security