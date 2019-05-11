import React from 'react';

import Header from '../../../components/header/header';
import Navigation from '../../../components/navigation/navigation';
import Content from '../../../components/content/content';
import Footer from '../../../components/footer/footer';
import './layout.css';
import jwt_decode from 'jwt-decode';

export default class Layout extends React.Component{
  render() {
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
        case 'BV':
          rule = 'Bảo Vệ'
          break
        default:
          break
      }
    }

    return(
      <div className={'layout'}>
        <div className={'layout-sub'}>
          <Navigation
            owner= {{ name: `${name}`, role: `${rule}` }}
            menuList={[
              {key: 0, link: '/admin/student', label: 'Sinh viên',icon: 'fas fa-user-graduate'},
              {key: 1, link: '/admin/expense', label: 'Chi phí', icon: 'fas fa-dollar-sign'},
              {key: 2, link: '/admin/activity', label: 'Hoạt động', icon: 'fas fa-running'},
              {key: 3, link: '/admin/dormitory', label: 'Phòng - Lầu', icon: 'fas fa-tasks'},
              {key: 4, link: '/admin/account', label: 'Tài khoản', icon: 'fas fa-users'},
              {key: 5, link: '/admin/news', label: 'Bài viết', icon: 'far fa-newspaper'},
              {key: 6, link: '/admin/history', label: 'Lịch sử', icon: 'fas fa-history'},
              {key: 7, link: '/admin/university', label: 'Trường - ngành', icon: 'fas fa-university'},
              {key: 8, link: '/admin/registered', label: 'Đăng ký lưu trú', icon: 'fas fa-clipboard-list'}
            ]}
        />
        </div>

        <div className={'layout-main'}>
          <Header/>
          <Content>
            {children}
          </Content>
          <Footer/>
        </div>
      </div>
    )
  }
}