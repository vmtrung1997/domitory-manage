import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import Layout from './layout/layout'
import InforStudent from './inforStudent/inforStudent'
import Expense from './expenses/expenses'
import Activity from './activity/activity'

class Admin extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
			title: '',
		}
	}
	render(){
		return(
			<Layout>
                <Route path={`${this.props.match.url}/student`} component={InforStudent} />
				<Route path={`${this.props.match.url}/expense`} component={Expense} />
                <Route path={`${this.props.match.url}/activity`} component={Activity} />
	        </Layout>
  		)
	}
}

export default Admin