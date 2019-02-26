import React from 'react';

import Header from './../../components/header/Header';
import Navigation from './../../components/navigation/Navigation';
import Content from './../../components/content/Content';
import './Layout.css';
import Footer from "../../components/footer/Footer";

export default class Layout extends React.Component{
  render() {
    const { children } = this.props;
    return(
      <div className={"layout"}>
        <div className={'layout-sub'}>
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