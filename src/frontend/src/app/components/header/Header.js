import React from 'react';
import './Header.css'

export default class Header extends React.Component{
  render() {
    return(
      <div className={"header"}>
        <div className={"header-right"}>
          <a className={'logout'}>
            Đăng xuất
          </a>
          <i className="fas fa-sign-out-alt" style={{color:'#999c9e'}}/>
        </div>
      </div>
    )
  }
}