import React, { Component } from 'react';
import { createStore } from 'redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import './App.css'
import SignInAdmin from './containers/admin/signinAdmin'
import Homepage from './containers/student/homepage'

class App extends Component {
	render() {
  	return (
  		<Router>
        <Switch>
          <Route exact path="/signin/admin" component={SignInAdmin} />
					<Route exact path="/homepage" component={Homepage} />
        </Switch>
      </Router>
  	);
	}
}

export default App;
