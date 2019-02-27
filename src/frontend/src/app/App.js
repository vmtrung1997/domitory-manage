import React, { Component } from 'react';
import './App.css'
import Layout from './containers/layout/Layout'
import DienNuocInfo from './containers/dienNuoc/DienNuocInfo'
class App extends Component {

	render() {
  	return (
      <Layout>
        <DienNuocInfo />
      </Layout>
  	);
	}
}

export default App;
