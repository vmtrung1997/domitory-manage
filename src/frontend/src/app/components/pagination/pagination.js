import React, { Component } from "react";

import "./panigation.css";
import Button from "./../button/button"

class Pagination extends Component{
	constructor(props){
		super(props)
		this.state = {
			focus: 1,
			input: 1,
		}
	}
	static defaultProps = {
	    pages: 1,
	    color: 'success',
	    margin: '2px',
	    clickPage: () => { return {page: 1}},
	    chkPre: () => { return {page: 1}},
	    chkNext: () => { return {page: 1}},
	}
	componentDidMount = () => {
		if(this.props.page !== undefined){
			this.setState({
				focus: this.props.page,
				input: this.props.page
			})
		}
	}
	chkPre = () => {
		this.props.chkPre({page: this.state.focus - 1})
		if( this.state.focus > 1)
		{
			this.setState({
				focus: this.state.focus - 1,
				input: this.state.focus - 1
			})
		}
	}
	chkNext = () => {
		this.props.chkNext({page: this.state.focus + 1})
		if( this.state.focus < this.props.pages)
		{
			this.setState({
				focus: this.state.focus + 1,
				input: this.state.focus + 1
			})
		}
	}
	clickPage = (e) => {
		this.setState({
			focus: e.key,
		})
		this.props.clickPage({page: e.key})
	}
	changePage = (e) => {
		e.preventDefault();
		this.setState({
			input: e.target.value
		})
	}
	submitPage = (e) => {
		if (e.key === 'Enter') {
			if( !isNaN(e.target.value) && parseInt(e.target.value) <= this.props.pages)
			{
				this.setState({
					focus: parseInt(e.target.value),
					input: parseInt(e.target.value)
				})
			}
			else{
				this.setState({
					input: this.state.focus 
				})
			}
			this.props.clickPage({page: this.state.focus})
		}
	}
	render(){
		var arrButton = []
		if(this.props.pages < 8){
			for(var i = 1; i <= this.props.pages; i++){
				var type
				if( i === this.state.focus)
					type = this.props.color
				else
					type = `${this.props.color} bt-outline`

				arrButton.push(
					<Button
						keyButton={i}
						color={this.props.color}
						style={{size: `${this.props.size}`, margin: `${this.props.margin}`}}
					>
						{i}
					</Button>
				)
			}
		} else {
			arrButton.push(
				<h> 
					<input onChange={this.changePage} value={this.state.input} className="input"  onKeyPress={this.submitPage}/>
					of {this.props.pages} 
				</h>)
		}

		return(
			<React.Fragment>
				<Button
					color={this.props.color}  onClick={this.chkPre}
					style={{size: `${this.props.size}`, margin: `${this.props.margin}`}}
				>
					<i className='fas fa-chevron-left'></i>
				</Button>
				{arrButton}
        <Button
          color={this.props.color}  onClick={this.chkNext}
          style={{size: `${this.props.size}`, margin: `${this.props.margin}`}}
        >
          <i className='fas fa-chevron-right'></i>
        </Button>
			</React.Fragment>
		);
	}
}
export default Pagination;