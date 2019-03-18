import React, { Component } from "react";
import { Pagination } from 'react-bootstrap'

class MyPagination extends Component{
	constructor(props) {
		super(props)
		this.state = {
			page: this.props.page,
		}	
	}
	static defaultProps = {
		page: 1,
	    totalPages: 1,
	    clickPage: (page) => {} 
	}
	clickPage = (page) => {
		this.setState({ page: parseInt(page)})
		this.props.clickPage(parseInt(page))
	}
	
	render(){
		var pagination = []
		for(var i = 0; i < this.props.totalPages; i++)
		{
			var val = i+1
			var display = ''
			if( Math.abs(this.state.page - 1 - i) > 2 ){
				if( (this.state.page >= 4 || i >= 5) && (this.props.totalPages - this.state.page >= 3 || this.props.totalPages - i >= 6))
					display = 'none'
			}
			pagination.push(
				<Pagination.Item
					style={{display: `${display}`}}
					key={val} 
					active={val === this.state.page}
					onClick={e => this.clickPage(e.currentTarget.textContent)}
				>
				{i+1}
				</Pagination.Item>
			)
		}
		return(
        	<Pagination>
          		<Pagination.First onClick={e => this.clickPage(1)}/>
                <Pagination.Prev 
                	onClick={e => this.clickPage(this.state.page > 1 ? this.state.page - 1 : 1)}
                />
                {pagination}
                <Pagination.Next 
                	onClick={e => this.clickPage( this.state.page < this.props.totalPages ? this.state.page + 1: this.props.totalPages)}
                />
                <Pagination.Last onClick={e => this.clickPage(this.props.totalPages)}/>
        	</Pagination>
	    )
	}
}
export default MyPagination;