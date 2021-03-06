import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './button.css';

class Button extends Component{
	static defaultProps = {
		size: 'sm',
		color: 'primary',
		variant: 'default',
		className: '',
		type: 'button',
		title: null,
    classCustom: '',
		onClick: () => {},
		disabled: false
	};

	static propTypes = {
		size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
		// color: PropTypes.oneOf(['default', 'primary', 'success', 'info', 'warning', 'danger']),
		variant: PropTypes.oneOf(['default', 'outline', 'rounded']),
		// content of button
		children: PropTypes.any.isRequired,
		// if true button is disable
		disabled: PropTypes.bool,
		// style if you want custom
    style: PropTypes.object,
		// is true button will fullwidth
		fullWidth: PropTypes.bool,
		//is true button will 3d
    diminsion: PropTypes.bool,
		actived: PropTypes.bool,
    shadow: PropTypes.bool,
    classCustom: PropTypes.string
  };
	render(){
		const { children, size, color, variant, disabled, style, fullWidth, diminsion, className, actived, shadow, classCustom } = this.props;
		let classDisabled = disabled ? ' disabled' : '';
		let classFullWidth = fullWidth ? ' fullWidth' : '';
		let classDiminsion = diminsion ? ' bt-3d' : '';
    let classActived = actived ? ' actived' : '';
    let classShadow = shadow ? ' shadow' : '';

		return(
			<button
				type={this.props.type}
				style={style}
				className={`bt bt-${size} bt-${color} bt-${variant} ${classDisabled} ${classFullWidth} ${className} ${classDiminsion} ${classActived} ${classShadow} ${classCustom}`}
				onClick={() => this.props.onClick({key: this.props.keyButton})}
				title={this.props.title}
				disabled={this.props.disabled}
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