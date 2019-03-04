import React, { Component } from 'react'
import Header from '../../components/headerHomepage/headerHomepage'
import Slide from '../../components/slideHomepage/slideHomepage'
import News from '../../components/news/newsHomepage'
import Info from '../../components/introHomepage/info'
class Homepage extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <React.Fragment>
                <Header></Header>
                <Slide></Slide>
                <News></News>
                <Info></Info>
            </React.Fragment>
        )
    }
}

export default Homepage