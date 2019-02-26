import React from 'react';
import './MenuButton.css';

export default class MenuButton extends React.Component {
  render() {
    const { icon, label, link, key } = this.props;
    return(
      <li className={'menu-button'} key={key}>
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
    <li>
      <img alt="image" className="img-circle center" src="https://akns-images.eonline.com/eol_images/Entire_Site/20181026/rs_600x600-181126230834-e-asia-iu-things-to-know-thumbnail.jpg?fit=around|700:700&crop=700:700;center,top&output-quality=90"/>
    </li>
  );
};

//<img alt="image" className="img-circle" src="https://img.kpopmap.com/2018/09/iu-tour-cover.jpg"/>
