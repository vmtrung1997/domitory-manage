import React, { Component } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom'
import './index.css'
import { getHistoryList, inputCard, logout } from './indexAction'
import RadioButton from '../../components/radioButton/radioButton';
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
			inputFocus: false,
			type: 'in-dormitory'
		}
	}
	hideLichSu = () => {
		this.setState({ isHide: !this.state.isHide })

	}
	componentDidMount() {
		document.addEventListener("keydown", this.onKeyDown);
		this.onInitHistoryList(this.state.type);
	}
	onInitHistoryList(type){
		getHistoryList(type).then(result => {
			if (result.data) {
				var historyList = result.data.data;
				this.setState({ history: historyList, mainHis: historyList.length > 0 ? historyList[0] : {} });
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
	alert = () => {
		this.player.src = "./ErrorBeep.mp3";
    this.player.play()
	 }
	onHandleInputCard = () => {
		//var startTime = new Date()
		var { cardId, type } = this.state;
		inputCard({ info: cardId, type: type}).then(result => {
			if (result.data.rs === 'success') {
				var { history } = this.state;
				var his = result.data.data;
				if (history.length >= 15)
					history.pop();
				history.unshift(his);
				this.setState({ notFound: false, history: history, mainHis: history[0], cardId: '' })
			} else if (result.data.rs === 'not found') {
				this.setState({ notFound: true, cardId: '' })
				this.alert();
			}
		}).catch(() => {
			this.setState({ notFound: true, cardId: '' });
			this.alert();
		})
	}
	getInput = (target) => {
		this.setState({ cardId: target.value })
	}
	radioCheck = (e) => {
		this.setState({type: e.value})
		this.onInitHistoryList(e.value)
	}
	render() {
		var { mainHis } = this.state
		var mainTime = mainHis ? new Date(mainHis.thoiGian) : ''
		return (
			<React.Fragment>
				<div className='p-t-10 header-security'>
				<audio ref={ref => this.player = ref} />
				<div className='type-div'>
						<RadioButton check={this.state.type === 'in-dormitory'} value={'in-dormitory'} isRadioChk={e => this.radioCheck(e)} className='type-radio-button' name='type' label='Vào ký túc xá'/>
						<RadioButton check={this.state.type === 'out-dormitory'} value={'out-dormitory'} isRadioChk={e => this.radioCheck(e)} className='type-radio-button' name='type' label='Ra ký túc xá'/>
				</div>
					<Link to="/signin-admin" onClick={() => {
						document.removeEventListener("keydown", this.onKeyDown)
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
											(mainHis.profile && mainHis.profile.img ? <img alt={mainHis.MSSV} src={mainHis.profile.img} /> : <div style={{ margin: '5em 0', textAlign: 'center' }}>Chưa cập nhật ảnh</div>) :
											<div></div>}
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
									{!this.state.notFound ? mainHis && mainHis.profile ? <div style={{ margin: '5em 0', textAlign: 'center' }}>
										<Col md={12} className={'info'}><span style={{ fontSize: '1.5em', color: 'red' }}>{mainHis.profile.hoTen.toUpperCase()}</span></Col>
										<Col md={12} className={'info'}>MSSV: <span>{mainHis.MSSV}</span></Col>
										<Col md={12} className={'info'}>Phòng: <span>{mainHis.profile.idPhong ? mainHis.profile.idPhong.tenPhong : 'Chưa cập nhật'}</span></Col>
										<Col md={12} className={'info'}>Giờ vào: <span>{mainTime.toLocaleTimeString() + ' ' + mainTime.toLocaleDateString()}</span></Col>
									</div> : <div>Chưa có dữ liệu</div> :
										<Col md={12} className={'info'}><span style={{ fontSize: '1.5em', color: 'red' }}>Không tìm thấy dữ liệu</span></Col>
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
											{value.profile && value.profile.img ? <img alt={value.profile.hoTen} src={value.profile.img} /> : <div>Chưa cập nhật ảnh</div>}
										</div>
										<div className={'item-text'}>
											<div>{value.profile.hoTen}</div>
											<div>{value.profile.idPhong ? "Phòng: " + value.profile.idPhong.tenPhong : "Phòng: Chưa cập nhật"}</div>
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
