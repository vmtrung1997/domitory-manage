import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
                <div className={"header-right"}>
                <Link to="#" onClick={this.logout}>
                    <i className="fas fa-sign-out-alt"/>
                    <span className={"logout"}> Đăng xuất </span>
                </Link>
                </div>
            </div>
        )
    }
}