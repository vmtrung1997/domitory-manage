import React, {Component} from 'react';
import './button.css';

class Button extends Component{
	render(){
		const value = this.props.content
		return(
			<button  style={{margin: "4px", height: `${this.props.height}px`, width: `${this.props.width}px`, borderRadius: `${this.props.radius}px`}}
				className={"bt " + this.props.type + " " + this.props.size}
				onClick={this.props.onClick}
			>
				<i className={this.props.firstIcon}></i>
				{value}
				<i className={this.props.lastIcon}></i>
			</button>
		);
	}
}

export default Button;

// handle = () => {
// 		console.log(1);
// 	}
//   render() {
//     return (
//     	<div>
//      		<Button type={"bt-outline bt-primary"} content={"Đồng ý"} size="bt-lg" getValue={this.getClick}/>
//      		<Button type={"bt-outline bt-warning"} content={"123"} size="bt-sm"/>
//      		<Button type={"bt-outline bt-danger bt-circle"} content={"123"} size="bt-xs"/>
//      		<Button type={"bt-info bt-circle"} firstIcon={"fas fa-check"}/>
//      		<Button type={"bt-default bt-circle"} content={"123"} height={100} width={100}/>
//      		<Button type={"bt-success"} content={"123"} radius={10} onClick={this.handle}/>
//      	</div>
//     );
//   }