import React, { Component } from 'react';
import { createStore } from 'redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import jwt_decode from 'jwt-decode';

import './App.css'
import Admin from './containers/admin'
import NotFound from './containers/404error/notfound'
import SignInAdmin from './containers/admin/signIn/signinAdmin'
import Homepage from './containers/student/homepage'
import News from './containers/student/news/news'
import NewsDetail from './containers/student/newscontent/newsContent'

const checkAdmin = () => {
    const secret = JSON.parse(localStorage.getItem('secret'))
    if(secret){
        const decode = jwt_decode(secret.access_token)
        if( decode.user.loai === 'SA' )
            return true
        else 
            return false
    } else {
        return false
    }
}
const AdminRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render = {props =>
            checkAdmin() ? (
                <Component {...props} />
            ) : (
                <Redirect to={{ pathname: "/signin-admin", state: { from: props.location }}} />
            )
        }
    />
)

class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            isAdmin: false,
        }
    }

	render() {
      	return (
      		<Router>
                <Switch>
                    <AdminRoute path="/admin" component={Admin} />
                    <Route path="/signin-admin" component={SignInAdmin} />
                    <Route path="/" component={Homepage} />
                    <Route component={NotFound} />
                </Switch>
            </Router>
        );
    }
}

export default App;

  