import React, { Component } from 'react'
import Header from './../../components/headerHomepage/headerHomepage'
import Homepage from './homepage/homepage'
import News from './news/news'
import { Route, Switch } from 'react-router-dom'
import ReallySmoothScroll from 'really-smooth-scroll';
import NewsContent from '../../components/newsContent/newsContent';
import DashBoardStudent from './dashBoard/dashBoard'


ReallySmoothScroll.shim();
class Student extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
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
                <Header getScroll={this.getScroll}></Header>
				<Route exact path={`/news`} component={News} />
				<Route exact path={`/news/detail/:id`} component={NewsContent} />
				<Route exact path={`/`} component={Homepage} />
                <Route exact path={`/dashboard`} component={DashBoardStudent} />
            </React.Fragment>
        )
    }
}

export default Student