import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import './admin.css'
import SignInAdmin from './signinAdmin'
import Layout from './../layout/Layout'
import InfoStudent from './infoStudent/infoStudent'

class Admin extends Component{
	constructor(props) {
	    super(props);
	}
	render(){
		return(
			<Layout>
                <Route path={`${this.props.match.url}/signin`} component={SignInAdmin} />
                <Route path={`${this.props.match.url}/student`} component={InfoStudent} />
	        </Layout>
  		)
	}
}

export default Admin