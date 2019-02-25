import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './button.css';

class Button extends Component{
	render(){
		const value = this.props.content
		return(
			<button  
				style={{
					fontSize: `${this.props.fontSize}`,
					margin: `${this.props.margin}`,
					height: `${this.props.height}`,
					width: `${this.props.width}`,
					borderRadius: `${this.props.radius}`,
					color: `${this.props.color}`,
					background: `${this.props.background}`,
					padding: `${this.props.padding}`}}
				className={"bt " + this.props.type + " " + this.props.size}
				onClick={e => this.props.onClick({key: this.props.keyButton})}
			>
				<i className={this.props.firstIcon}></i>
				{value}
				<i className={this.props.lastIcon}></i>
			</button>
		);
	}
}

export default Button;

Button.propTypes = {
  type: PropTypes.oneOf(['bt-outline', 'bt-primary', 'bt-warning', 'bt-danger', 'bt-circle', 'bt-info', 'bt-default', 'bt-success']),
};

// handle = () => {
// 		console.log(1);
// 	}
//   render() {
//     return (
//     	<div>
//      		<Button type={"bt-outline bt-primary"} content={"Đồng ý"} size="bt-lg"/>
//      		<Button type={"bt-outline bt-warning"} content={"123"} size="bt-sm"/>
//      		<Button type={"bt-outline bt-danger bt-circle"} content={"123"} size="bt-xs"/>
//      		<Button type={"bt-info bt-circle"} firstIcon={"fas fa-check"}/>
//      		<Button type={"bt-default bt-circle"} content={"123"} height={100} width={100}/>
//      		<Button type={"bt-success"} content={"123"} radius={10} onClick={this.handle}/>
//      	</div>
//     );
//   }