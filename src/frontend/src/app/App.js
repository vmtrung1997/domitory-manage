import React, { Component } from 'react';
//import { createStore } from 'redux'
//import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Navigation from './components/navigation/Navigation';
import Layout from './containers/layout/Layout';

import './App.css'

class App extends Component {
  render() {
    return (
    	<div>
        <Layout/>
     	</div>
    );
  }
}

export default App;
