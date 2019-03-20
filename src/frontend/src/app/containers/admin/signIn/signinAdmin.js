import React, { Component } from 'react';
import md5 from 'md5';
import axios from 'axios';
import { Link } from 'react-router-dom'

import Loader from './../../../components/loader/loader'
import Input from '../../../components/input/input'
import Button from './../../../components/button/button'
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
		}
	}
	getValue = (obj) => {
		if(obj.name === 'password'){
			this.setState({[obj.name]: md5(obj.value)})
		} else {
			this.setState({[obj.name]: obj.value})
		}
	}
	login = () => {
		this.setState({ loading: true})
		axios.post(`http://localhost:4000/api/user/login`, { username: this.state.username, password: this.state.password })
			.then(res => {
				localStorage.setItem('secret', JSON.stringify(res.data));
				let { from } = this.props.location.state || { from: { pathname: "/admin/student" } }
				this.props.history.push(from)
			})
			.catch( err => {
				this.setState({
					isNotify: true
				})
			}).then( () => {
				this.setState({ loading: false})
			})
	}
	render(){
		return(
			<React.Fragment>
				<div className='header-sgin-admin'>
					<Link to='/'><img alt="logo_hcmus" className='logo' src={logo_HCMUS} /></Link>
					<span> Chào mừng đến với ký túc xá Trần Hưng Đạo </span>
				</div>
				<div className='form-login'>
					<div className='lb-tille'> ĐĂNG NHẬP </div>
					{this.state.isNotify ? (
						<div className='notify'> ! Bạn nhập sai tài khoản hoặc mật khẩu </div>
					):(<React.Fragment/>)}
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<Input 
							width='250px' placeholder='Tài khoản' fontSize='20px' padding='8px 18px' borderRadius='6px' 
							getValue={this.getValue} name={'username'}
						/>
					</div>
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<Input 
							width='250px' placeholder='Mật khẩu'  fontSize='20px' padding='8px 18px'  borderRadius='6px' type='password'
							getValue={this.getValue} name={'password'}
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
					<Loader loading={this.state.loading}/>
					<Link to='/'> Bạn quên mật khẩu ?</Link>
				</div>
			</React.Fragment>
		)
	}
}

export default SignInAdmin
