import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import './admin.css'
import SignInAdmin from './signinAdmin'
import Layout from './../layout/Layout'

class Admin extends Component{
	constructor(props) {
	    super(props);
	}
	render(){
		return(
			<Layout>
                <Route path={`${this.props.match.url}/signin`} component={SignInAdmin} />
	        </Layout>
  		)
	}
}

export default Admin