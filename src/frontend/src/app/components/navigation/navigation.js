import React from 'react';
import PropTypes from 'prop-types';
import MenuButton, { MenuButtonHeader } from '../menuButton/menuButton.js'
import './navigation.css';

export default class Navigation extends React.Component{
  static propTypes = {
    menuList: PropTypes.array
  };

  constructor(props){
    super(props);
    this.state = {
      menuList: []
    }
  }

  componentWillMount() {
    const menuList = this.props.menuList;
    this.setState({
      menuList: menuList
    })
  }

  render() {
    const { menuList } = this.state;
    return(
      <div className={"nav-wrapper"}>
        <ul>
          <MenuButtonHeader 
            name= {this.props.owner.name}
            role= {this.props.owner.role}
          />
          { menuList.map((e) => {
            return(
              <MenuButton
                key={e.key}
                link={e.link}
                label={e.label}
                icon={e.icon}
                path={window.location.pathname}
                subMenu={e.subMenu}
              />
            )
          })}
        </ul>
      </div>
    )
  }
}

