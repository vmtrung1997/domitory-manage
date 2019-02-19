import React, {Component} from 'react';
import './button.css';

class Button extends Component{
	render(){
		const value = this.props.content
		return(
			<button  style={{margin: "4px", height: `${this.props.height}px`, width: `${this.props.width}px`}}
				className={"bt " + this.props.type + " " + this.props.size}
			>
				<i className={this.props.firstIcon}></i>
				{value}
				<i className={this.props.lastIcon}></i>
			</button>
		);
	}
}

export default Button;