import React, { Component } from "react";
import Slide from "../../../components/slideHomepage/slideHomepage";
import News from "../../../components/news/newsHomepage";
import Info from "../../../components/introHomepage/info";

class Homepage extends Component {
  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
        <Slide />
        <News id="new" />
        <Info id="info" />
      </React.Fragment>
    );
  }
}

export default Homepage;
