import React, { Component } from 'react';
import './avatar.css'

class Avatar extends Component{
	render(){
		console.log(this.props.height)
		return(
			<React.Fragment>
				<img src={this.props.link} alt={this.props.alt}
					className={this.props.style}
					style={{ height: `${this.props.height}px`, width: `${this.props.width}px`, 
						borderRadius: `${this.props.radius}px`,
						border: `${this.props.border}px solid ${this.props.color}`,
					}}
				/>
			</React.Fragment>
		);
	}
}

export default Avatar;

{/*<Avatar 
	style="img-circle"
	link={"https://a.wattpad.com/cover/158753309-256-k335088.jpg"} alt={"trung"} 
	height={100} width={100}
	border={1}
	color={"red"}
/>*/}