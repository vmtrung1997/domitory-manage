import React, { Component } from 'react'

import './notfound.css'
import Button from './../../components/button/button'

class NotFound extends Component{
	render(){
		return(
			<div style={{textAlign: 'center'}}>
				<div style={{fontSize: '40px', color: '#FF7963', fontWeigth: 'bold'}}> <h1> 404 </h1> </div>
				<h1> Page not found </h1>
				<Button 
					type="bt-warning"
					padding="10px 20px"
					width="200px"
					content="Quay về trang chủ">
				</Button>
			</div>
		)
	}
}

export default NotFound