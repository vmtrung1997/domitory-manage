import React, { Component } from "react";
import Slide from "../../../components/slideHomepage/slideHomepage";
import News from "../../../components/news/newsHomepage";
import Info from "../../../components/introHomepage/info";

import Footer from "../../../components/footerHomepage/footer";

class Homepage extends Component {
  componentDidMount() {}

  render() {

    return (
      <React.Fragment>
         <Slide />
         <News id="new" />
         <Info id="info" />
         <Footer></Footer>
        {/* <SectionsContainer {...options}>
          <Section>
            {" "}
            <Slide />
          </Section>
          <Section>
            <News id="new" />
          </Section>
          <Section>
            <Info id="info" />
          </Section>
        </SectionsContainer> */}
      </React.Fragment>
    );
  }
}

export default Homepage;
