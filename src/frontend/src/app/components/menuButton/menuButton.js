import React from 'react';
import './menuButton.css';

export default class MenuButton extends React.Component {
  render() {
    const { icon, label, link, ikey } = this.props;
    return(
      <li className={'menu-button'} key={ ikey}>
        <a href={link} className={"mb_link"}>
          {icon &&
            <i className={icon + " mb_icon"}/>
          }
          {label &&
            <span className={"mb_nav-label"}>
              {label}
            </span>
          }
        </a>
      </li>
    )
  }
}

export const MenuButtonHeader = (props) => {
  const { avt, name, role } = props;
  return(
    <div style={{color: 'white', textAlign: 'center'}}>
      <img alt="avatar" className="img-circle center" src={avt}/>
      <div style={{fontWeight: 'bold'}}> {name} </div>
      <div style={{fontSize: '14px'}}> {role} </div>
    </div>
  );
};

//<img alt="avatar" className="img-circle" src="https://img.kpopmap.com/2018/09/iu-tour-cover.jpg"/>
