import React, { Component } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom'
import './index.css'
import { getHistoryList, inputCard, logout } from './indexAction'
import { defaultStudentImg } from '../../function/imageFunction'
class Security extends Component {
	constructor(props) {
		super(props)
		this.state = {
			history: [],
			mainHis: {
				MSSV: '',
				thoiGian: new Date(),
				profile: {
					hoTen: '',
					idPhong: { tenPhong: '' }
				},
				imgFile: ''
			},
			isHide: true,
			file: '',
			cardId: '',
			notFound: false,
			inputFocus: false
		}
	}
	hideLichSu = () => {
		this.setState({ isHide: !this.state.isHide })

	}
	onImportFile = (e) => {
		this.setState({ file: e.target.files[0] })
	}
	fixdata = (data) => {
		var o = "", l = 0, w = 10240;
		for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
		o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
		return o;
	}
	componentDidMount() {
		document.addEventListener("keydown", this.onKeyDown);

		getHistoryList().then(result => {
			if (result.data) {
				var historyList = result.data.data;
				console.log(historyList);
				this.setState({ history: historyList, mainHis: historyList.length>0? historyList[0]:{} });
			}
		})
	}
	onKeyDown = (event) => {
		if (document.activeElement === ReactDOM.findDOMNode(this.refs.maThe)) {
			return;
		}
		if (event.keyCode === 13) {
			this.onHandleInputCard();
		}
		if (event.keyCode >= 48 && event.keyCode <= 57) { //from 0 - 9
			let input = this.state.cardId + String.fromCharCode(event.keyCode);
			this.setState({ cardId: input })
		}

	}
	
	onEnterInput = (e) => {
		if (e.key !== 'Enter')
			return;
		else this.onHandleInputCard()
	}
	onHandleInputCard = () => {
		//var startTime = new Date()
		var { cardId } = this.state;
		inputCard({ info: cardId }).then(result => {
			if (result.data.rs === 'success') {
				var { history } = this.state;
				var his = result.data.data;
				history.pop();
				history.unshift(his);
				this.setState({ notFound: false, history: history, mainHis: history[0] })
			} else if (result.data.rs === 'not found') {
				this.setState({ notFound: true })
			}
		}).then(() => {
			this.setState({ cardId: '' })
		})
	}
	getInput = (target) => {
		this.setState({ cardId: target.value })
	}
	
	render() {
		var { mainHis } = this.state
		var mainTime = mainHis?new Date(mainHis.thoiGian):''
		return (
			<React.Fragment>
				<div className='header-security'>
					<Link to="/signin-admin" onClick={() => {
						document.removeEventListener("keydown",this.onKeyDown)
						logout(); 
						}}>
						<i className="fas fa-sign-out-alt" />
						<span className={"logout"}>Đăng xuất </span>
					</Link>
				</div>
				<div className={'content-body-security'}>
					<Row>
						<Col md={this.state.isHide ? 12 : 9}>
							<Row>
								<Col md={6} className={'col-outer'}>
									<div className={'img-css'}>
										{!this.state.notFound ?
											<img src={mainHis && mainHis.profile.img !== "" ? mainHis.profile.img : defaultStudentImg} /> :
											<img src={''} />}
									</div>
								</Col>
								<Col md={6}>
									<Row>
										<Col md={6}>
											<input ref='maThe' value={this.state.cardId} onChange={e => this.getInput(e.target)} autoFocus={true} onKeyPress={e => this.onEnterInput(e)} />
										</Col>
										<Col md={5}>
											<div className={'id-back'} onClick={this.hideLichSu}>
												<span>Lịch sử gần nhất</span>&nbsp;
												<i className="fas fa-chevron-right" />
											</div>
										</Col>
									</Row>
									{!this.state.notFound ?mainHis? <div style={{ margin: '5em 0', textAlign: 'center' }}>
										<Col md={12} className={'info'}><span style={{ fontSize: '1.5em', color: 'red' }}>{mainHis.profile.hoTen.toUpperCase()}</span></Col>
										<Col md={12} className={'info'}>MSSV: <span>{mainHis.MSSV}</span></Col>
										<Col md={12} className={'info'}>Phòng: <span>{mainHis.profile.idPhong.tenPhong}</span></Col>
										<Col md={12} className={'info'}>Giờ vào: <span>{mainTime.toLocaleTimeString() + ' ' + mainTime.toLocaleDateString()}</span></Col>
									</div>:<div> Nothing</div> :
										<Col md={12} className={'info'}><span style={{ fontSize: '1.5em', color: 'red' }}>NOT FOUND</span></Col>
									}
								</Col>
							</Row>
						</Col>
						{!this.state.isHide && <Col md={3}><div style={{ maxHeight: '90vh', overflow: 'auto' }}>
							{this.state.history.length > 0 && this.state.history.map((value, index) => {
								let thoiGian = new Date(value.thoiGian)
								return (
									<div className={'item-history'} key={index}>
										<div className={'item-image'}>
											<img src={value.profile && value.profile.img !== "" ? value.profile.img : defaultStudentImg} />
										</div>
										<div className={'item-text'}>
											<div>{value.profile.hoTen}</div>
											<div>{value.profile.idPhong.tenPhong}</div>
											<div>{thoiGian.toLocaleTimeString() + ' ' + thoiGian.toLocaleDateString()}</div>
										</div>
									</div>
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
