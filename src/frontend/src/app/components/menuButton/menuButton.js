import React from 'react';
import { Link } from "react-router-dom";

import './menuButton.css';

export default class MenuButton extends React.Component {
  render() {
    const { icon, label, link, ikey, path, subMenu } = this.props;
    var focus = ''
    if(path.split('/')[2] === link.split('/')[2]){
      focus = 'focus'
    }
    return(
      <li className={`menu-button ${focus}`} key={ ikey} onClick={this.click}>
        <Link to={link} className={"mb_link"}>
          {icon &&
            <i className={icon + " mb_icon"}/>
          }
          {label &&
            <span className={"mb_nav-label"}>
              {label}
            </span>
          }
        </Link>
        {subMenu &&
        <ul>
          {subMenu.map(menu => {
            return(

                <li  key={ ikey} onClick={this.click}>
                  <Link to={menu.link} className={"mb_link"}>

                    {menu.label &&
                    <span className={"mb_nav-label"}>
                      {menu.label}
                    </span>
                    }
                  </Link>
                </li>

            )
          })}
        </ul>

        }
      </li>
    )
  }
}

export const MenuButtonHeader = (props) => {
  const { avt, name, role } = props;
  return(
    <div style={{color: 'white', textAlign: 'center', marginTop: '-15px'}}>
      <img alt="avatar" className="img-circle center" src={avt}/>
      <div style={{fontWeight: 'bold'}}> {name} </div>
      <div style={{fontSize: '14px', marginBottom: '5px'}}> {role} </div>
    </div>
  );
};

//<img alt="avatar" className="img-circle" src="https://img.kpopmap.com/2018/09/iu-tour-cover.jpg"/>
