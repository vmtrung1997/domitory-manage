import React from 'react';
import { Link } from "react-router-dom";
import { Collapse, Dropdown } from 'react-bootstrap';

import Logo from './../../../utils/image/logo_HCMUS.jpg'
import ChangePas from './../changePas/changePas'
import './menuButton.css';

export default class MenuButton extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      open: false,
    }
  }
  render() {
    const { open } = this.state;
    const { icon, label, link, ikey, path, subMenu } = this.props;
    var focus = ''
    if(path.split('/')[2] === link.split('/')[2]){
      focus = 'focus_lb'
    }
    return(
      <li className={`menu-button ${focus}`} key={ ikey} onClick={() => this.setState({ open: !open })} aria-controls="example-collapse-text">
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
          subMenu.map(menu => {
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
          })

        }
      </li>
    )
  }
}

export class MenuButtonHeader extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      show: false,
    }
  }

  getValue = (key, value) => {
    this.setState({ [key]: value})
  };

  render(){
    const { name, role } = this.props;
    return(
      <div style={{color: 'white', textAlign: 'center', marginTop: '-30px'}}>
        <ChangePas show={this.state.show} handleClose={ e => this.getValue('show', false)}/>
        <img alt="avatar" className="img-circle center avt" src={Logo} />

        <div className={'user-name '}>

        <Dropdown>
          <Dropdown.Toggle childBsPrefix="dropdown" variant="success" id="dropdown-basic" >
            {name}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={ e => this.getValue('show', true)}>Đổi mật khẩu</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <div style={{fontSize: '14px', marginBottom: '5px'}}> {role} </div>
        </div>
      </div>
    );
  }
};

