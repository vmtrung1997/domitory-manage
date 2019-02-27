import React from 'react';

import Header from './../../components/header/Header';
import Navigation from './../../components/navigation/Navigation';
import Content from './../../components/content/Content';
import Footer from './../../components/footer/Footer';
import { MenuButtonHeader } from './../../components/menuButton/MenuButton'
import './Layout.css';


export default class Layout extends React.Component{
  render() {
    const { children } = this.props;
    return(
      <div className={"layout"}>
        <div className={'layout-sub'}>
          <MenuButtonHeader 
            avt = "https://akns-images.eonline.com/eol_images/Entire_Site/20181026/rs_600x600-181126230834-e-asia-iu-things-to-know-thumbnail.jpg?fit=around|700:700&crop=700:700;center,top&output-quality=90"
            name="Phương Thảo"
            role="Super Admin"
          />
          <Navigation
            menuList={[
              {key:0, link: '#', label: 'Sinh viên',icon: 'fab fa-apple'},
              {key: 1, link: '#', label: 'Sinh viên', icon: 'fab fa-apple'},
              {key: 2, link: '#', label: 'Sinh viên', icon: 'fab fa-apple'}]}
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