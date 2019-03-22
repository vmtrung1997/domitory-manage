import React, { Component } from 'react'
import Slide from '../../../components/slideHomepage/slideHomepage'
import News from '../../../components/news/newsHomepage'
import Info from '../../../components/introHomepage/info'

import Header from './../../../components/headerHomepage/headerHomepage'
//import autoscroll from 'autoscroll-react'
import ReallySmoothScroll from 'really-smooth-scroll';


// ReallySmoothScroll.shim();
class Homepage extends Component {

    componentDidMount() {
        console.log('a');
       // autoscroll(Info, { isScrolledDownThreshold: 150 /*default*/ })
    }

    getScroll = (evt) => {
        switch (evt) {
            case '1':               
                window.scrollTo(0,0);
                break;
            case '2':
               
                window.scrollTo(0,570);
                break;
            case '3':
          
            window.scrollTo(0,1080);
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <React.Fragment>
                  <Header ></Header>
                <Slide></Slide>
                <News id="new"></News>
                <Info id="info"></Info>          
            </React.Fragment>
        )
    }
}

export default Homepage