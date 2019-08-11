import React from 'react';

import Header from '../../../components/header/header';
import Navigation from '../../../components/navigation/navigation';
import Content from '../../../components/content/content';
import Footer from '../../../components/footer/footer';
import './layout.css';
import jwt_decode from 'jwt-decode';

export default class Layout extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      navStyle : ''
    }
  }

  onChangeStyleNavigation = (turnOn) => {
    if(turnOn)
      this.setState({
        navStyle: 'collapsed'
      });
    else
      this.setState({
        navStyle: ''
      });
  };

  render() {
    const { children } = this.props;
    var rule = '';
    var name = '';
    var rulePath = '';
    const secret = JSON.parse(localStorage.getItem('secret'));
    const user = jwt_decode(secret.access_token).user;
    if(secret)
    {
      name = user.profile.hoTen;
      switch(user.userEntity.loai){
        case 'SA':
          rule = 'Super Admin';
          rulePath = 'admin';
          break;
        case 'AM':
          rulePath = 'admin';
          rule = 'Admin';
          break;
        case 'ADCP':
          rulePath = 'admin';
          rule = 'Quản lý chi phí';
          break;
        case 'DD':
          rulePath = 'admin';
          rule = 'Điểm danh';
          break;
        case 'BV':
          rulePath = 'security';
          rule = 'Bảo vệ';
          break;
        default:
          break
      }
    }

    return(
      <div className={'layout ' + this.state.navStyle}>
        <div className={rulePath=='admin'?'layout-sub':'layout-sub-security'}>
          <Navigation
            owner= {{ name: `${name}`, role: `${rule}` }}
            menuList={[
              {key: 'SV01', link: `/${rulePath}/student`, label: 'Sinh viên',icon: 'fas fa-user-graduate'},
              {key: 'CP01', link: `/${rulePath}/expense`, label: 'Chi phí', icon: 'fas fa-dollar-sign'},
              {key: 'HD01', link: `/${rulePath}/activity`, label: 'Hoạt động', icon: 'fas fa-running'},
              {key: 'KT01', link: `/${rulePath}/dormitory`, label: 'Ký túc xá', icon: 'fas fa-tasks'},
              {key: 'TK01', link: `/${rulePath}/account`, label: 'Tài khoản', icon: 'fas fa-users'},
              {key: 'BV01', link: `/${rulePath}/news`, label: 'Bài viết', icon: 'far fa-newspaper'},
              {key: 'LS01', link: `/${rulePath}/history`, label: 'Lịch sử', icon: 'fas fa-history'},
              {key: 'TN01', link: `/${rulePath}/university`, label: 'Trường - ngành', icon: 'fas fa-university'},
              {key: 'DK01', link: `/${rulePath}/registered`, label: 'Đăng ký lưu trú', icon: 'fas fa-clipboard-list'},
              {key: 'DL01', link: `/${rulePath}/logs`, label: 'Database log', icon: 'fas fa-clipboard-list'}
            ]}
        />
        </div>

        <div className={'layout-main'}>
        {user.userEntity.loai!=='BV'?
          <Header
            onChangeStyleNav={this.onChangeStyleNavigation} />:''}
          <Content>
            {children}
          </Content>
          <Footer/>
        </div>
      </div>
    )
  }
}