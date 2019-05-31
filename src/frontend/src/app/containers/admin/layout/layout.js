import React from 'react';

import Header from '../../../components/header/header';
import Navigation from '../../../components/navigation/navigation';
import Content from '../../../components/content/content';
import Footer from '../../../components/footer/footer';
import './layout.css';
import jwt_decode from 'jwt-decode';

export default class Layout extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      navStyle : ''
    }
  }

  onChangeStyleNavigation = (turnOn) => {
    console.log('==change style')
    if(turnOn)
      this.setState({
        navStyle: 'collapsed'
      });
    else
      this.setState({
        navStyle: ''
      });
  }
  render() {
    console.log('==state layout', this.state)
    const { children } = this.props;
    var rule = ''
    var name = ''
    const secret = JSON.parse(localStorage.getItem('secret'))
    if(secret)
    {
      const user = jwt_decode(secret.access_token).user
      name = user.profile.hoTen
      switch(user.userEntity.loai){
        case 'SA':
          rule = 'Super Admin'
          break
        case 'AM':
          rule = 'Admin'
          break
        case 'ADCP':
          rule = 'Quản lý chi phí'
          break
        case 'DD':
          rule = 'Điểm danh'
          break
        default:
          break
      }
    }

    return(
      <div className={'layout ' + this.state.navStyle}>
        <div className={'layout-sub'}>
          <Navigation
            owner= {{ name: `${name}`, role: `${rule}` }}
            menuList={[
              {key: 'SV01', link: '/admin/student', label: 'Sinh viên',icon: 'fas fa-user-graduate'},
              {key: 'CP01', link: '/admin/expense', label: 'Chi phí', icon: 'fas fa-dollar-sign'},
              {key: 'HD01', link: '/admin/activity', label: 'Hoạt động', icon: 'fas fa-running'},
              {key: 'KT01', link: '/admin/dormitory', label: 'Ký túc xá', icon: 'fas fa-tasks'},
              {key: 'TK01', link: '/admin/account', label: 'Tài khoản', icon: 'fas fa-users'},
              {key: 'BV01', link: '/admin/news', label: 'Bài viết', icon: 'far fa-newspaper'},
              {key: 'LS01', link: '/admin/history', label: 'Lịch sử', icon: 'fas fa-history'},
              {key: 'TN01', link: '/admin/university', label: 'Trường - ngành', icon: 'fas fa-university'},
              {key: 'DK01', link: '/admin/registered', label: 'Đăng ký lưu trú', icon: 'fas fa-clipboard-list'}
            ]}
        />
        </div>

        <div className={'layout-main'}>
          <Header
            onChangeStyleNav={this.onChangeStyleNavigation}
          />
          <Content>
            {children}
          </Content>
          <Footer/>
        </div>
      </div>
    )
  }
}