import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import SignInAdmin from './signIn/signinAdmin'
import Layout from './layout/layout'
import InfoStudent from './infoStudent/infoStudent'
import Expense from './expenses/expenses'
class Admin extends Component{
	constructor(props) {
	    super(props);
	}
	render(){
		return(
			<Layout>
                <Route path={`${this.props.match.url}/signin`} component={SignInAdmin} />
                <Route path={`${this.props.match.url}/student`} component={InfoStudent} />
				<Route path={`${this.props.match.url}/expense`} component={Expense} />
	        </Layout>
  		)
	}
}

export default Admin