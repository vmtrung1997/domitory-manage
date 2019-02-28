import React, { Component } from 'react'

import Input from '../../../components/input/input'
import Button from './../../../components/button/button'
import './signIn.css'
import logo_HCMUS from './../../../../utils/image/logo_HCMUS.jpg'

class SignInAdmin extends Component{
	render(){
		return(
			<React.Fragment>
				<div className="header-sgin-admin">
					<a href="#"><img className="logo" src={logo_HCMUS} /></a>
					<span> Chào mừng đến với ký túc xá Trần Hưng Đạo </span>
				</div>
				<div style={{textAlign: "center", marginTop: "50px"}}>
					<div className="lb-tille"> ĐĂNG NHẬP </div>
					<div>
						<Input width="250px" placeholder="Tài khoản" fontSize="20px" padding="8px 18px" borderRadius="6px"/>
					</div>
					<div>
						<Input width="250px" placeholder="Mật khẩu"  fontSize="20px" padding="8px 18px"  borderRadius="6px" type="password"/>
					</div>
					<div style={{margin: "10px"}}> 
						<Button width="282px" content="Đăng nhập" type="bt-primary" fontSize="18px" padding="8px auto" radius="4px"/> 
					</div>
					<a href="#"> Bạn quên mật khẩu ?</a>
				</div>
			</React.Fragment>
		)
	}
}

export default SignInAdmin
