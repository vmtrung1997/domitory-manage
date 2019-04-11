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
            owner= {{avt: 'https://akns-images.eonline.com/eol_images/Entire_Site/20181026/rs_600x600-181126230834-e-asia-iu-things-to-know-thumbnail.jpg?fit=around|700:700&crop=700:700;center,top&output-quality=90',
                    name: `${name}`,
                    role: `${rule}` }}
            menuList={[
              {key: 0, link: '/admin/student', label: 'Sinh viên',icon: 'fas fa-user-graduate'},
              {key: 1, link: '/admin/expense', label: 'Chi phí', icon: 'fas fa-dollar-sign'},
              {key: 2, link: '/admin/activity', label: 'Hoạt động', icon: 'fas fa-running'},
              {key: 3, link: '/admin/dormitory', label: 'Ký túc xá', icon: 'fas fa-tasks'},
              {key: 4, link: '/admin/account', label: 'Tài khoản', icon: 'fas fa-users'},
              {key: 5, link: '/admin/news', label: 'Bài viết', icon: 'far fa-newspaper'},
              {key: 6, link: '/admin/history', label: 'Lịch sử', icon: 'fas fa-history'},
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