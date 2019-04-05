import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import jwt_decode from 'jwt-decode';

import './App.css'
import Admin from './containers/admin'
import NotFound from './containers/404error/notfound'
import SignInAdmin from './containers/admin/signIn/signinAdmin'
import Student from './containers/student'
import Security from './containers/security/index'

var isAdmin = false
var isSecurity = false

const checkAuth = () => {
    const secret = JSON.parse(localStorage.getItem('secret'))
    if(secret){
        const decode = jwt_decode(secret.access_token)
        switch(decode.user.userEntity.loai)
        {
            case 'SA':
                isAdmin = true
                break
            case 'BV':
                isSecurity = true
                break
            default:
                break
        }
    }
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
	render() {
      	return (
      		<Router>
                <Switch>
                    <AdminRoute path="/admin" component={Admin} />
                    <SecurityRoute path='/security' component={Security} />
                    {/*<SecurityRoute path='/security' component={Security} />*/}
                    <Route path="/signin-admin" component={SignInAdmin} />
                    <Route path='/' component = {Student}/>
                    <Route component={NotFound} />
                </Switch>
            </Router>
        );
    }
}

export default App;

  