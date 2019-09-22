import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from './../button/button'

import './header.css'

export default class Header extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      collapsed: false
    }
  }
    logout = () => {
        const secret = JSON.parse(localStorage.getItem('secret'));

        axios.get(`/logout`, {
            headers: {
                'x-refresh-token': secret.refresh_token
            }
        }).then( res => localStorage.removeItem('secret') )
            
    };

  onChangeStyleNav = () => {
    if(this.state.collapsed){
      this.props.onChangeStyleNav(false);
      this.setState({
        collapsed: false
      })
    } else {
      this.props.onChangeStyleNav(true);
      this.setState({
        collapsed: true
      })
    }

  };
    render() {
        return(
            <div className={"header"}>
                <Button
                  onClick={this.onChangeStyleNav}
                  color='default'
                  style={{fontSize: '20px', padding: '0 12px'}}
                >
                    <i className='fas fa-bars'/>
                </Button>
                <div className={"header-right"}>
                <Link to="/signin-admin" onClick={this.logout}>
                    <i className="fas fa-sign-out-alt"/>
                    <span className={"logout"}> Đăng xuất </span>
                </Link>
                </div>
            </div>
        )
    }
}