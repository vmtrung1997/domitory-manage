import React from 'react';
import { withRouter } from 'react-router-dom';
import './NotAuthentication.css'
class NotAuthen extends React.Component {
  render() {
    return (
      <div className="not-authen-background">
        <div class="cover">
        <div>
        Unauthorized 
        &nbsp;<small>Error 401</small>
        </div>
        <p class="lead">The requested resource requires an authentication.</p></div>
      </div>
    )
  }
}

export default withRouter(NotAuthen);