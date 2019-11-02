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
import Registered from './registered/registered'
import DatabaseLog from './databaseLog/databaseLog'
import { Authorization } from './../../components/AuthenticationRoute/Authorization'
import jwt_decode from 'jwt-decode';
class Admin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			roles: []
		}
	}
	componentWillMount() {
		let token = JSON.parse(localStorage.getItem('secret'));
		let decode = jwt_decode(token.access_token)
		if (decode && decode.user.userEntity.phanQuyen) {
			this.setState({
				roles: decode.user.userEntity.phanQuyen.quyen
			})
		}
	}
	render() {
		let { roles } = this.state
		return (
			<Layout>
				<Route exact path={`${this.props.match.url}/student`} component={Authorization(roles)(InfoStudent, 'SV01')} />
				<Route exact path={`${this.props.match.url}/student/detail/:mssv`} component={Authorization(roles)(InfoStudentDetail, 'SV02')} />
				<Route exact path={`${this.props.match.url}/expense`} component={Authorization(roles)(Expense, 'CP01')} />
				<Route exact path={`${this.props.match.url}/activity`} component={Authorization(roles)(Activity, 'HD01')} />
				<Route exact path={`${this.props.match.url}/news`} component={Authorization(roles)(News, 'BV01')} />
				<Route exact path={`${this.props.match.url}/history`} component={Authorization(roles)(History, 'LS01')} />
				<Route exact path={`${this.props.match.url}/activity/detail/:id`} component={Authorization(roles)(ActivityDetail, 'HD01')} />
				<Route exact path={`${this.props.match.url}/account`} component={Authorization(roles)(Account, 'TK01')} />
				<Route exact path={`${this.props.match.url}/account/detail/:id`} component={Authorization(roles)(AccountDetail, 'TK02')} />
				<Route exact path={`${this.props.match.url}/dormitory`} component={Authorization(roles)(InfoDormitory, 'KT01')} />
				<Route exact path={`${this.props.match.url}/university`} component={Authorization(roles)(University, 'TN01')} />
				<Route exact path={`${this.props.match.url}/registered`} component={Authorization(roles)(Registered, 'DK01')} />
				<Route exact path={`${this.props.match.url}/logs`} component={Authorization(roles)(DatabaseLog, 'DL01')} />
			</Layout>
		)
	}
}

export default Admin