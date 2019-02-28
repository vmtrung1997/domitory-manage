import React from 'react';
import './title.css'

export default class Title extends React.Component {
  render() {
    const { children } = this.props;
    return(
      <div className={'title'}>
        <h3 >
          {children}
        </h3>
      </div>
    );
  }
}