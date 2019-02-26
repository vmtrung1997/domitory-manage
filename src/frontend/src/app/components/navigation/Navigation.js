import React from 'react';
import PropTypes from 'prop-types';
import MenuButton, { MenuButtonHeader } from './../menuButton/MenuButton.js'
import './Navigation.css';

export default class Navigation extends React.Component{
  static propTypes = {
    menuList: PropTypes.array
  };

  constructor(){
    super();
    this.state = {
      menuList: []
    }
  }

  componentWillMount() {
    const { menuList } = this.props;
    this.setState({
      menuList: menuList
    })
  }

  render() {
    const { menuList } = this.state;
    console.log('==menu', menuList)
    return(
      <div className={"nav-wrapper"}>
        <ul>
          <MenuButtonHeader/>
          { menuList.map((e) => {
            return(
              <MenuButton
                key={e.key}
                link={e.link}
                label={e.label}
                icon={e.icon}
              />
            )
          })}
        </ul>
      </div>
    )
  }
}

