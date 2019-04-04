import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import Layout from './layout/layout'
import InfoStudent from './infoStudent/infoStudent'
import InfoStudentDetail from './infoStudent/infoStudentDetail'
import Expense from './expenses/expenses'
import Activity from './activity/activity'
import ActivityDetail from './activity/activityDetail'
import InfoDormitory from './infoDormitory/infoDormitory';
import Account from './account/account'
import News from './news/news';

class Admin extends Component{
	render(){
		return(
			<Layout>
        		<Route exact path={`${this.props.match.url}/student`} component={InfoStudent} />
        		<Route exact path={`${this.props.match.url}/student/detail`} component={InfoStudentDetail} />
				<Route exact path={`${this.props.match.url}/expense`} component={Expense} />
        		<Route exact path={`${this.props.match.url}/activity`} component={Activity} />
				<Route exact path={`${this.props.match.url}/news`} component={News} />
        		<Route exact path={`${this.props.match.url}/activity/detail/:id`} component={ActivityDetail} />
       			<Route exact path={`${this.props.match.url}/account`} component={Account} />
       			<Route exact path={`${this.props.match.url}/dormitory`} component={InfoDormitory} />
	    	</Layout>
  		)
	}
}

export default Admin