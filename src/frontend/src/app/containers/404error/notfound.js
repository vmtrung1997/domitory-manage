import React, { Component } from 'react'

import './notfound.css'
import Button from './../../components/button/button'

class NotFound extends Component{
	render(){
		return(
			<div className="pg-notfound">
				<span style={{fontSize: '100px', color: '#FF7963', fontWeigth: 'bold'}}> 404 </span>
				<h1> Page not found </h1>
				<Button 
					color = 'warning'
					style = {{padding: '10px 20px', width: '200px', fontSize: '16px'}}
				>
					Quay về trang chủ
				</Button>
			</div>
		)
	}
}

export default NotFound