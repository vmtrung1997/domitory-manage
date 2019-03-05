import React, { Component } from 'react'
import Header from '../../components/headerHomepage/headerHomepage'
import Slide from '../../components/slideHomepage/slideHomepage'
import News from '../../components/news/newsHomepage'
import Info from '../../components/introHomepage/info'
class Homepage extends Component {
    constructor(props){
        super(props);
    }
    getScroll = (event) => {
        
    }
    render() {
        return (
            <React.Fragment>
                <Header getScroll={this.getScroll}></Header>
                <Slide></Slide>
                <News id="new"></News>
                <Info id="info"></Info>
            </React.Fragment>
        )
    }
}

export default Homepage