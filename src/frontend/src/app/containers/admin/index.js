import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import Layout from './layout/layout'
import InfoStudent from './infoStudent/infoStudent'
import InfoStudentDetail from './infoStudent/infoStudentDetail/infoStudentDetail'
import Expense from './expenses/expenses'
import Activity from './activity/activity'
import ActivityDetail from './activity/activityDetail'
import Account from './account/account'
import AccountDetail from './account/accountDetail'
import InfoDormitory from "./infoDormitory/infoDormitory";
import History from './securityHistory/history'
import News from './news/news';
import University from './university/university'
class Admin extends Component{
	render(){
		return(
			<Layout>
        		<Route exact path={`${this.props.match.url}/student`} component={InfoStudent} />
        		<Route exact path={`${this.props.match.url}/student/detail/:id`} component={InfoStudentDetail} />
				<Route exact path={`${this.props.match.url}/expense`} component={Expense} />
        		<Route exact path={`${this.props.match.url}/activity`} component={Activity} />
				<Route exact path={`${this.props.match.url}/news`} component={News} />
				<Route exact path={`${this.props.match.url}/history`} component={History} />
        		<Route exact path={`${this.props.match.url}/activity/detail/:id`} component={ActivityDetail} />
       			<Route exact path={`${this.props.match.url}/account`} component={Account} />
        		<Route exact path={`${this.props.match.url}/account/detail/:id`} component={AccountDetail} />
       			<Route exact path={`${this.props.match.url}/dormitory`} component={InfoDormitory} />
       			<Route exact path={`${this.props.match.url}/university`} component={University} />
						 
	    	</Layout>
  		)
	}
}

export default Admin