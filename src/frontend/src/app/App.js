import React, { Component } from 'react';
import { createStore } from 'redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import './App.css'
import SignInAdmin from './containers/admin/signinAdmin'

class App extends Component {
	render() {
  	return (
  		<Router>
        <Switch>
          <Route exact path="/signin/admin" component={SignInAdmin} />
        </Switch>
      </Router>
  	);
	}
}

export default App;
