import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import jwt_decode from 'jwt-decode';
import './App.css'
import Admin from './containers/admin'
import NotFound from './containers/404error/notfound'
import NotAuthen from './components/errorPages/NotAuthentication/NotAuthentication'
import InternalServer from './components/errorPages/InternalServer/InternalServer'
import SignInAdmin from './containers/admin/signIn/signinAdmin'
import Student from './containers/student'
import Security from './containers/security/index'

const checkAuth = () => {
    const secret = JSON.parse(localStorage.getItem('secret'))
    if(secret){
        const decode = jwt_decode(secret.access_token)
        switch(decode.user.userEntity.loai)
        {
            case 'SA':
            case 'AM':
            case 'DD':
            case 'ADCP':
                return 'isAdmin'
            case 'BV':
                return 'isSecurity'
            default:
                break
        }
    }
}
const AdminRoute = ({ component: Component, ...rest }) => {
    
    return(
        <Route
            {...rest}
            render = {props => 
                checkAuth() === 'isAdmin' ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: "/signin-admin", state: { from: props.location }}} />
                )
            }
        />
    )
}
const SecurityRoute = ({ component: Component, ...rest }) => {
    return(
        <Route
            {...rest}
            render = {props =>
                checkAuth() === 'isSecurity' ? (
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
      		<Router basename="http://ktxtranhungdao.tk">
                <Switch>
                    <AdminRoute path={`/admin`} component={Admin} />
                    <SecurityRoute path={`/security`} component={Security} />
                    <Route path={`/signin-admin`} component={SignInAdmin} />
                    <Route path={`/500`} component={InternalServer} />
                    <Route path={`/401`} component={NotAuthen}/>
                    <Route path={`/`} component = {Student}/>
                    <Route component={NotFound} />
                </Switch>
            </Router>
        );
    }
}

export default App;

  