import React from 'react';
import './header.css'

export default class Header extends React.Component{
  render() {
    return(
      <div className={"header"}>
        <div className={"header-right"}>
          <a href="#">
            <i className="fas fa-sign-out-alt" style={{color:'#999c9e'}}/>
            <span className={"logout"}> Đăng xuất </span>
          </a>
        </div>
      </div>
    )
  }
}