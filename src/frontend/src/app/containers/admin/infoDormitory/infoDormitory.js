import React from 'react';
import './infoDormitory.css';
import './../../../style.css'
import Title from "../../../components/title/title";

class InfoDormitory extends React.Component{
  constructor(props){
    super(props);

  }

  render(){
    return(
      <div>
        <Title>
          Thông tin ký túc xá
        </Title>
        <div className={'content-body'}>
        </div>
      </div>
    )
  }
}

export default InfoDormitory