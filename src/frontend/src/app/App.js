import React, { Component } from 'react';
import Input from './components/input/Input'
import Checkbox from './components/checkbox/Checkbox'
class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      input: ''
    }
  }
  getVal = (val) => {
    this.setState({
      input: val
    })
  }
  render() {
    return (
      <div>
      <Input type={'text'} getValue={this.getVal} placeholder={'light'} />


      <Checkbox label={'Checkbox'}>
      </Checkbox>

      </div>
    );
  }
}

export default App;
