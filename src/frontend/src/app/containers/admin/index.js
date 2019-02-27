import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import SignInAdmin from './signIn/signinAdmin'
import Layout from './layout/layout'
import InforStudent from './inforStudent/inforStudent'

class Admin extends Component{
	constructor(props) {
	    super(props);
	}
	render(){
		return(
			<Layout>
                <Route path={`${this.props.match.url}/signin`} component={SignInAdmin} />
                <Route path={`${this.props.match.url}/student`} component={InforStudent} />
	        </Layout>
  		)
	}
}

export default Admin