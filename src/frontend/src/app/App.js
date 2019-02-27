import React, { Component } from 'react';
import { createStore } from 'redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import './App.css'
import Admin from './containers/admin'
import NotFound from './containers/404error/notfound'
import SignInAdmin from './containers/admin/signIn/signinAdmin'

class App extends Component {
	render() {
      	return (
      		<Router>
                <Switch>
                    <Route path="/admin/" component={Admin} />
                    <Route path="/signin-admin/" component={SignInAdmin} />
                    <Route component={NotFound} />
                </Switch>
            </Router>
        );
    }
}

export default App;
