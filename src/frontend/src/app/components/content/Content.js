import React from 'react';
import './content.css';

export default class Content extends React.Component{
  render(){
    const { children } = this.props;
    return(
      <div className={'content'}>
        {children}
      </div>
    )
  }
}