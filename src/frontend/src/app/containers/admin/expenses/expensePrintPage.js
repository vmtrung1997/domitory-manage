import React from 'react';
import ReactToPrint from 'react-to-print';
import Button from './../../../components/button/button'
import './expensePrint.css'
class ComponentToPrint extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div>table</div>
      </React.Fragment>
    );
  }
}

class Example extends React.Component {
  render() {
    return (
      <div>
        <ReactToPrint
          trigger={() => <Button onClick={this.props.onClick}>{this.props.button}</Button>}
          content={() => this.componentRef}
        />
        <div style={{ display: 'none' }}>
          <ComponentToPrint ref={el => (this.componentRef = el)}>
            {this.props.children}
          </ComponentToPrint>
        </div>
      </div>
    );
  }
};
export default Example;