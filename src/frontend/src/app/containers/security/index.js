import React, { Component } from 'react'
import { Col, Row } from 'react-bootstrap'
import Input from '../../components/input/input';
import './index.css'
import {getHistoryList, inputCard} from './indexAction'
import {imageFile} from './../../function/imageFunction'
import axios from 'axios'
class Security extends Component {
	constructor(props){
		super(props)
		this.state = {
			history: [
				// {MSSV: '1512618',profile:{ hoTen:'Trần Thành Trung', idPhong: {tenPhong: '107'}}, ngayVao:'2:28:30 26/3/2019', img:'https://akns-images.eonline.com/eol_images/Entire_Site/20181026/rs_600x600-181126230834-e-asia-iu-things-to-know-thumbnail.jpg?fit=around|700:700&crop=700:700;center,top&output-quality=90'},
				// {MSSV: '1512619', hoTen:'Nguyễn Trung Tài', phong: '108', ngayVao:'2:28:30 26/3/2019', img:'https://akns-images.eonline.com/eol_images/Entire_Site/20181026/rs_600x600-181126230834-e-asia-iu-things-to-know-thumbnail.jpg?fit=around|700:700&crop=700:700;center,top&output-quality=90'},
				// {MSSV: '1512519', hoTen:'Tôn nữ Trần Lê Phương Thảo', phong: '109', ngayVao:'2:28:30 26/3/2019', img:'https://akns-images.eonline.com/eol_images/Entire_Site/20181026/rs_600x600-181126230834-e-asia-iu-things-to-know-thumbnail.jpg?fit=around|700:700&crop=700:700;center,top&output-quality=90'},
				// {MSSV: '1512619', hoTen:'Võ Minh Trung', phong: '109', ngayVao:'2:28:30 26/3/2019', img:'https://akns-images.eonline.com/eol_images/Entire_Site/20181026/rs_600x600-181126230834-e-asia-iu-things-to-know-thumbnail.jpg?fit=around|700:700&crop=700:700;center,top&output-quality=90'}
			],
			mainHis: {
				MSSV: '',
				thoiGian: new Date(),
				profile: {
					hoTen:'',
					idPhong: {tenPhong: ''}
				},
				imgFile: ''
			},
			isHide: true,
			file: '',
			cardId: '',
			notFound: false,
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
		getHistoryList().then(result=> {
			if (result.data){
				var historyList = result.data.data.map(value => {
					value.imgFile = imageFile(value.profile.img);
					return value
				})
				this.setState({history: historyList, mainHis: historyList[0]});
			}
		})
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
		if (e.key !== 'Enter')
			return;
		this.setState({cardId:''})
		var {cardId} = this.state;
		inputCard({info: cardId}).then(result => {
			if (result.data.rs === 'success'){
				var historyList = result.data.hisList.map(value => {
					value.imgFile = imageFile(value.profile.img);
					return value
				})
				this.setState({notFound: false, history:historyList,mainHis: historyList[0]})
			} else if (result.data.rs === 'not found'){
				this.setState({notFound: true})
			}
		})
	}
	getInput = (target) => {
		this.setState({cardId: target.value})
	}
	render() {
		var {mainHis} = this.state
		var mainTime =new Date(mainHis.thoiGian)
		return (
			<React.Fragment>
				<div className={'content-body'}>
					<Row>
						<Col md={this.state.isHide?12:9}>
							<Row>
								<Col md={6} className={'col-outer'}>
									<div className={'img-css'}>
										{!this.state.notFound?
										<img className={'resize'} src={mainHis.imgFile!==""?mainHis.imgFile:'https://akns-images.eonline.com/eol_images/Entire_Site/20181026/rs_600x600-181126230834-e-asia-iu-things-to-know-thumbnail.jpg?fit=around|700:700&crop=700:700;center,top&output-quality=90'} />:
										<img className={'resize'} src={''}/>}
									</div>
								</Col>
								<Col md={6}>
									<Row>
										<Col md={6}><Input placeholder={'Mã thẻ'} 
										value={this.state.cardId} 
										getValue={this.getInput} 
										autoFocus={true}
										onKeyPress={(e)=> this.onEnterInput(e)}/>
										{/* <input type='file' ref={(ref) => { this.uploadInput = ref;}}/>
										<Button onClick={this.submitFile}>Submit</Button> */}
										</Col>
									<Col md={6} style={{textAlign: 'right'}}>
										<div className={'id-back'} onClick={this.hideLichSu}>
												<span>Lịch sử ra vào</span>
												<i className="fas fa-chevron-right" />
										</div>
									</Col>
									</Row>
									{!this.state.notFound?<div style={{ margin: '5em 0', textAlign: 'center' }}>
										<Col md={12} className={'info'}><span style={{ fontSize: '1.5em', color: 'red' }}>{mainHis.profile.hoTen.toUpperCase()}</span></Col>
										<Col md={12} className={'info'}>MSSV: <span>{mainHis.MSSV}</span></Col>
										<Col md={12} className={'info'}>Phòng: <span>{mainHis.profile.idPhong.tenPhong}</span></Col>
										<Col md={12} className={'info'}>Giờ vào: <span>{mainTime.toLocaleTimeString() + ' '+mainTime.toLocaleDateString() }</span></Col>
									</div>:
										<Col md={12} className={'info'}><span style={{ fontSize: '1.5em', color: 'red' }}>NOT FOUND</span></Col>
								}
								</Col>
							</Row>
						</Col>
						{!this.state.isHide && <Col md={3}><div>
							{this.state.history.length>0 && this.state.history.map((value, index) => {
								let thoiGian = new Date(value.thoiGian)
								return (
									<Row key={index}>
										<div className={'item-history'}>
											<div className={'item-image'}>
												<img src={value.imgFile!==""?value.imgFile:'https://akns-images.eonline.com/eol_images/Entire_Site/20181026/rs_600x600-181126230834-e-asia-iu-things-to-know-thumbnail.jpg?fit=around|700:700&crop=700:700;center,top&output-quality=90'}/>
											</div>
											<div className={'item-text'}>
												<div>{value.profile.hoTen}</div>
												<div>{value.profile.idPhong.tenPhong}</div>
												<div>{thoiGian.toLocaleTimeString()+' '+thoiGian.toLocaleDateString()}</div>
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