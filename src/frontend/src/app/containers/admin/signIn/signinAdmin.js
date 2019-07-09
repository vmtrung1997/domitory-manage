import React, { Component } from 'react';
import md5 from 'md5';
import axios from 'axios';
import { Link } from 'react-router-dom'
import jwt_decode from 'jwt-decode';

import Loader from './../../../components/loader/loader'
import Input from '../../../components/input/input'
import Button from './../../../components/button/button'
import ForgotPassword from './modalForgotPassword'
import './signIn.css'
import logo_HCMUS from './../../../../utils/image/logo_HCMUS.jpg'



class SignInAdmin extends Component{
	constructor(props){
		super(props)
		this.state = {
			username: '',
			password: '',
			isNotify: false,
			loading: false,
			show: false
		}
	}

	componentDidMount = () => {
		const secret = JSON.parse(localStorage.getItem('secret'))
		if(secret){
	        axios.get(`/logout`, {
	            headers: {
	                'x-refresh-token': secret.refresh_token
	            }
	        }).then( res => localStorage.removeItem('secret') )
    	}
	}
	getValue = (key, val) => {
		if(key === 'password'){
			this.setState({ [key]: md5(val) })
		} else {
			this.setState({ [key]: val })
		}
	}

	login = () => {
		this.setState({ loading: true })
		axios.post(`/user/login`, { username: this.state.username, password: this.state.password })
		.then(res => {
			let from
			if(res.data.access_token){
				const decode = jwt_decode(res.data.access_token)
				switch(decode.user.userEntity.loai){
					case 'SA':
					case 'AM':
					case 'ADCP':
						localStorage.setItem('secret', JSON.stringify(res.data));
						from = { pathname: "/admin/student" }
						break
					case 'DD':
						localStorage.setItem('secret', JSON.stringify(res.data));
						from = { pathname: "/admin/activity" }
						break
					case 'GDN':
						localStorage.setItem('secret', JSON.stringify(res.data));
						from = { pathname: "/admin/expense" }
						break
					case 'BV':
						localStorage.setItem('secret', JSON.stringify(res.data));
						from = { pathname: "/security" }
						break
					default:
						throw 'err: not found'
						break
				}
			}
			this.props.history.push(from)
		})
		.catch( err => {
			this.setState({
				isNotify: true,
        loading: false
			})
		})
	};
	
	render(){
		return(
			<React.Fragment>
				<ForgotPassword show={this.state.show} handleClose={ e => this.getValue('show', false)}/>
				<Loader loading={this.state.loading}/>
				<div className='header-sgin-admin'>
					<Link to='/'><img alt="logo_hcmus" className='logo' src={logo_HCMUS} /></Link>
					<span> Chào mừng đến với ký túc xá Trần Hưng Đạo </span>
				</div>
				<div className='form-login'>
					<div className='lb-tille'> ĐĂNG NHẬP </div>
					{this.state.isNotify ? (
						<div className='notify'> Bạn nhập sai tài khoản hoặc mật khẩu ! </div>
					):(<React.Fragment/>)}
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<Input 
							width='250px' placeholder='Tài khoản' fontSize='20px' padding='8px 18px' borderRadius='6px' 
							getValue={ e => this.getValue(e.name, e.value)} name={'username'}
						/>
					</div>
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<Input 
							width='250px' placeholder='Mật khẩu'  fontSize='20px' padding='8px 18px'  borderRadius='6px' type='password'
							getValue={ e => this.getValue(e.name, e.value) } name={'password'}
							onKeyPress={ (e) => {if(e.key === 'Enter') this.login()}}
						/>
					</div>
					<div style={{margin: '10px'}}> 
						<Button 
							style = {{width:'250px', fontSize: '18px', padding:'8px auto', borderRadius:'4px'}}
							onClick = {(e) => this.login()}
						> 
							Đăng nhập
						</Button>
					</div>
					<h5 className="lb-forgot" onClick={ e => this.setState({show: true})}> Bạn quên mật khẩu ?</h5>
				</div>
			</React.Fragment>
		)
	}
}

export default SignInAdmin
