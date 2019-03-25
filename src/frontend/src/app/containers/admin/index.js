import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import Layout from './layout/layout'
import InfoStudent from './infoStudent/infoStudent'
import InfoStudentDetail from './infoStudent/infoStudentDetail'
import Expense from './expenses/expenses'
import Activity from './activity/activity'
import ActivityDetail from './activity/activityDetail'
import News from './news/news';

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
        		<Route exact path={`${this.props.match.url}/student`} component={InfoStudent} />
        		<Route exact path={`${this.props.match.url}/student/detail`} component={InfoStudentDetail} />
				<Route path={`${this.props.match.url}/expense`} component={Expense} />
        		<Route exact path={`${this.props.match.url}/activity`} component={Activity} />
						<Route exact path={`${this.props.match.url}/news`} component={News} />
        		<Route exact path={`${this.props.match.url}/activity/detail/:id`} component={ActivityDetail} />
	    	</Layout>
  		)
	}
}

export default Admin