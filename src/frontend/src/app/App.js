import React, { Component } from 'react';
import { createStore } from 'redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import './App.css'
import Pagination from './components/pagination/pagination'

class App extends Component {
	con1 = (e) => {
		console.log(e)
	}
	con2 = (e) => {
		console.log(e)
	}
	con3 = (e) => {
		console.log(e)
	}
  	render() {
    	return (
    		<div>
    			hello
    			<Pagination margin={4}  pages={30} color="bt-info" background="" focus={1} height={10} width={10}
    			chkPre={this.con1} chkNext={this.con2}
    			clickPage={this.con3}
    			/>
     		</div>
    	);
  	}
}

export default App;
