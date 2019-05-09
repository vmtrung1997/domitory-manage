import React from 'react';
import { withRouter } from 'react-router-dom';
class NotAuthen extends React.Component {
  render(){
    return (
      <p>{"401 SERVER ERROR, NOT AUTHENTICATION"}</p>
  )
  }
}
    
export default withRouter(NotAuthen);