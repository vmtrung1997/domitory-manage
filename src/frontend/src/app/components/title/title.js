import React from 'react';
import './title.css'

export default class Title extends React.Component {
  render() {
    const { value } = this.props;
    return(
      <div>
        <h1 className={'title'}>
          {value}
        </h1>
      </div>
    );
  }
}