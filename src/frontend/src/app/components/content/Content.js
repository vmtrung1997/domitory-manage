import React from 'react';
import './Content.css';

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