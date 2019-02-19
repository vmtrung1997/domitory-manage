import React, { Component } from 'react';
import { createStore } from 'redux'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import './App.css'
import Button from './components/button/button'

class App extends Component {
  render() {
    return (
    	<div>
     		<Button type={"bt-outline bt-primary"} content={"Đồng ý"} size="bt-lg" getValue={this.getClick}/>
     		<Button type={"bt-outline bt-warning"} content={"123"} size="bt-sm"/>
     		<Button type={"bt-outline bt-danger bt-circle"} content={"123"} size="bt-xs"/>
     		<Button type={"bt-info bt-circle"} firstIcon={"fas fa-check"}/>
     		<Button type={"bt-default bt-circle"} content={"123"} height={100} width={100}/>
     		<Button type={"bt-success"} content={"123"}/>
     	</div>
    );
  }
}

export default App;
