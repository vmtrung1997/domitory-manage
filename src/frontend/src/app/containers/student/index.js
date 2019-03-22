import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import ReallySmoothScroll from 'really-smooth-scroll';
import jwt_decode from 'jwt-decode';

import Homepage from './homepage/homepage'
import News from './news/news'
import NewsContent from '../../components/newsContent/newsContent';
import DashBoardStudent from './dashBoard/dashBoard'


// ReallySmoothScroll.shim();
const checkAuth = () => {
    const secret = JSON.parse(localStorage.getItem('secret'))
    if(secret){
        const decode = jwt_decode(secret.access_token)
        if(decode.user.userEntity.loai === 'SV'){
            return true
        } 
        return false
    }
}
const StudentRoute = ({ component: Component, ...rest }) => {
    return(
        <Route
            {...rest}
            render = {props => 
                checkAuth() ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: "/", state: { from: props.location }}} />
                )
            }
        />
    )
}
class Student extends Component {

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
                {/* <Header getScroll={this.getScroll}></Header> */}
				<Route exact path={`/news`} component={News} />
				<Route exact path={`/news/detail/:id`} component={NewsContent} />
				<Route exact path={`/`} component={Homepage} />
                <StudentRoute exact path={`/dashboard`} component={DashBoardStudent} />
            </React.Fragment>
        )
    }
}

export default Student