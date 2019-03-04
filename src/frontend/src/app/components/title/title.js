import React from 'react';
import './title.css'

export default class Title extends React.Component {
  render() {
    const { children } = this.props;
    return(
      <div>
        <h3 className={'title'}>
          {children}
        </h3>
      </div>
    );
  }
}