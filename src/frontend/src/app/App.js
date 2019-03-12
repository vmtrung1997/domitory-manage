import React, { Component } from 'react';
import { createStore } from 'redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import jwt_decode from 'jwt-decode';

import './App.css'
import Admin from './containers/admin'
import NotFound from './containers/404error/notfound'
import SignInAdmin from './containers/admin/signIn/signinAdmin'
import Student from './containers/student'
import News from './containers/student/news/news'
import NewsDetail from './containers/student/newscontent/newsContent'
import Security from './containers/security'

var isAdmin = false
var isSecurity = false
var isStudent = false
const checkAuth = () => {
    const secret = JSON.parse(localStorage.getItem('secret'))
    if(secret){
        const decode = jwt_decode(secret.access_token)
        switch(decode.user.loai)
        {
            case 'SA':
                isAdmin = true
                break
            case 'SV':
                isStudent = true
                break
            case 'BV':
                isSecurity = true
                break
        }
    }
    console.log(isAdmin, isSecurity, isStudent)
}
const AdminRoute = ({ component: Component, ...rest }) => {
    checkAuth()
    return(
        <Route
            {...rest}
            render = {props => 
                isAdmin ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: "/signin-admin", state: { from: props.location }}} />
                )
            }
        />
    )
}
const SecurityRoute = ({ component: Component, ...rest }) => {
    checkAuth()
    return(
        <Route
            {...rest}
            render = {props =>
                isSecurity ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: "/signin-admin", state: { from: props.location }}} />
                )
            }
        />
    )
}

class App extends Component {
    constructor(props){
        super(props)
    }

	render() {
      	return (
      		<Router>
                <Switch>
                    <AdminRoute path="/admin" component={Admin} />
                    {/*<SecurityRoute path='/security' component={Security} />*/}
                    <Route path="/signin-admin" component={SignInAdmin} />
                    <Route path="/" component={Student} />
                    <Route component={NotFound} />
                </Switch>
            </Router>
        );
    }
}

export default App;

  