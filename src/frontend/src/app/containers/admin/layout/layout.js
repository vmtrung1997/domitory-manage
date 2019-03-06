import React from 'react';

import Header from '../../../components/header/header';
import Navigation from '../../../components/navigation/navigation';
import Content from '../../../components/content/content';
import Footer from '../../../components/footer/footer';
import './layout.css';


export default class Layout extends React.Component{
  render() {
    const { children } = this.props;
    return(
      <div className={"layout"}>
        <div className={'layout-sub'}>
          <Navigation
            owner= {{avt: "https://akns-images.eonline.com/eol_images/Entire_Site/20181026/rs_600x600-181126230834-e-asia-iu-things-to-know-thumbnail.jpg?fit=around|700:700&crop=700:700;center,top&output-quality=90",
                    name:"Phương Thảo",
                    role: "Super Admin" }}
            menuList={[
              {key:0, link: '/admin/student', label: 'Sinh viên',icon: 'fab fa-apple'},
              {key: 1, link: '/admin/expense', label: 'Chi phí', icon: 'fab fa-apple'},
              {key: 2, link: '/admin/activity', label: 'Hoạt động', icon: 'fab fa-apple'}]}
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