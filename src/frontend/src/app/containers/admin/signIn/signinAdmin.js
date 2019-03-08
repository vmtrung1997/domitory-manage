import React, { Component } from 'react'
import md5 from 'md5'
import axios from 'axios';

import Input from '../../../components/input/input'
import Button from './../../../components/button/button'
import './signIn.css'
import logo_HCMUS from './../../../../utils/image/logo_HCMUS.jpg'

class SignInAdmin extends Component{
	constructor(props){
		super(props)
		this.state = {
			username: '',
			password: ''
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
		console.log(this.state)
		axios.post(`http://localhost:4000/api/user/login`, { username: this.state.username, password: this.state.password })
	      	.then(res => {
	    	    console.log(res);
	    	    console.log(res.data);
	    })
	}
	render(){
		return(
			<React.Fragment>
				<div className='header-sgin-admin'>
					<a href='#'><img className='logo' src={logo_HCMUS} /></a>
					<span> Chào mừng đến với ký túc xá Trần Hưng Đạo </span>
				</div>
				<div className='form-login'>
					<div className='lb-tille'> ĐĂNG NHẬP </div>
					<div>
						<Input 
							width='250px' placeholder='Tài khoản' fontSize='20px' padding='8px 18px' borderRadius='6px' 
							getValue={this.getValue} name={'username'}
						/>
					</div>
					<div>
						<Input 
							width='250px' placeholder='Mật khẩu'  fontSize='20px' padding='8px 18px'  borderRadius='6px' type='password'
							getValue={this.getValue} name={'password'}
						/>
					</div>
					<div style={{margin: '10px'}}> 
						<Button 
							color = 'success'
							style = {{width:'250px', fontSize: '18px', padding:'8px auto', borderRadius:'4px'}}
							onClick = {(e) => this.login()}
						> 
							Đăng nhập
						</Button>
					</div>
					<a href='#'> Bạn quên mật khẩu ?</a>
				</div>
			</React.Fragment>
		)
	}
}

export default SignInAdmin