import React, { Component } from 'react';
import { createStore } from 'redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import './App.css'
import Admin from './containers/admin'
import NotFound from './containers/404error/notfound'
import SignInAdmin from './containers/admin/signIn/signinAdmin'
import Homepage from './containers/student/homepage'
import News from './containers/student/news/news'
import NewsDetail from './containers/student/newscontent/newsContent'

const checkAuth = () => {

}
const AuthRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        checkAuth() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/signin-admin",
          state: { from: props.location }
        }}
        />
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
                    <AuthRoute path="/admin/" component={Admin} />
                    <Route path="/signin-admin" component={SignInAdmin} />
                    <Route path="/" component={Homepage} />
                    <Route component={NotFound} />
                </Switch>
            </Router>
        );
    }
}

export default App;
