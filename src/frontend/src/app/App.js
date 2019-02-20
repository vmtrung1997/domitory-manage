import React, { Component } from 'react';
import Input from './components/input/Input'
import Checkbox from './components/checkbox/Checkbox'
import RadioButton from './components/radioButton/RadioButton'
import Select from './components/selectOption/Select'
class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      input: '',
      isCheck: [],
    }
  }
  getVal = (val) => {
    this.setState({
      input: val
    })
  }
  getChk = (val) => {
    console.log(val);
  }
  
  getDefaultChecked = (val) => {
    this.setState({isCheck: val})
  }
  isRadioChk = (val) => {
    console.log(val);
  }
  getValue = (val) => {
    console.log(val);
  }
  render() {
    var select = [
      {value: 1, label: 'apple'},
      {value: 2, label: 'banana'}
    ]
    return (
      <div>
      <Input type={'text'} getValue={this.getVal} placeholder={'light'} />


      <Checkbox name={"c1"} label={'Checkbox 1'} check={true} isCheck={this.getChk}/>
      <Checkbox name={"c2"} label={'Checkbox 2'} check={false} isCheck={this.getChk}/>

      <RadioButton label={'rad 1'} name={'radioGroup'} check={true} value={'rad_1'} isRadioChk={this.isRadioChk}/>
      <RadioButton label={'rad 2'} name={'radioGroup'} check={false} value={'rad_2'} isRadioChk={this.isRadioChk}/>
      <RadioButton label={'rad 3'} name={'radioGroup'} check={false} value={'rad_3'} isRadioChk={this.isRadioChk}/>

      <Select value={2} options={select} selected={this.getValue}/>
      </div>
    );
  }
}

export default App;
