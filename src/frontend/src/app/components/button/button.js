import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './button.css';

class Button extends Component{
	static defaultProps = {
		size: 'sm',
		color: 'primary',
		variant: 'default',
		onClick: () => {}
	};

	static propTypes = {
		size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
		color: PropTypes.oneOf(['default', 'primary', 'success', 'info', 'warning', 'danger']),
		variant: PropTypes.oneOf(['default', 'outline', 'rounded']),
		// content of button
		children: PropTypes.any.isRequired,
		// if true button is disable
		disable: PropTypes.bool,
		// style if you want custom
    style: PropTypes.object,
		// is true button will fullwidth
		fullWidth: PropTypes.bool,
	};
	render(){
		const { children, size, color, variant, disable, style, fullWidth } = this.props;
		let classDisabled = '';
    	let classFullWidth = '';
		if(disable){
      		classDisabled = 'disable'
		}
    	if(fullWidth){
      		classFullWidth = 'fullWidth'
    	}
		return(
			<button  
				style={style}
				className={'btn btn-' + size + ' btn-' + color + ' btn-' + variant + ' ' + classDisabled + ' ' + classFullWidth}
				onClick={e => this.props.onClick({key: this.props.keyButton})}
			>
				{children}
			</button>
		);
	}
}

export default Button;

// Button.propTypes = {
//   type: PropTypes.oneOf(['bt-outline', 'bt-primary', 'bt-warning', 'bt-danger', 'bt-circle', 'bt-info', 'bt-default', 'bt-success']),
// };
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