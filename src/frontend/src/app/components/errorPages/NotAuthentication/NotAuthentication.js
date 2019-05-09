import React from 'react';
 
class NotAuthen extends React.Component {
  render(){
    return (
      <p className={'internalServer'}>{"401 SERVER ERROR, NOT AUTHENTICATION"}</p>
  )
  }
}
    
export default NotAuthen;