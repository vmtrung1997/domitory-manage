import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from './../button/button'

import './header.css'

export default class Header extends React.Component{
    logout = () => {
        const secret = JSON.parse(localStorage.getItem('secret'))

        axios.get(`http://localhost:4000/api/logout`, {
            headers: {
                'x-refresh-token': secret.refresh_token
            }
        })
            
        localStorage.removeItem('secret');
    }
    render() {
        return(
            <div className={"header"}>
                <Button color='default' style={{fontSize: '20px', padding: '0 12px'}}>
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