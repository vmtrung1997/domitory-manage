import React, { Component } from "react";
import Slide from "../../../components/slideHomepage/slideHomepage";
import News from "../../../components/news/newsHomepage";
import Info from "../../../components/introHomepage/info";
import { SectionsContainer, Section } from "react-fullpage";

class Homepage extends Component {
  componentDidMount() {}

  render() {
    let options = {
      sectionClassName: "section",
      anchors: ["introduce", "news", "about"],
      scrollBar: false,
      navigation: true,
      verticalAlign: false,
      arrowNavigation: true
    };

    return (
      <React.Fragment>
        <SectionsContainer {...options}>
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
        </SectionsContainer>
      </React.Fragment>
    );
  }
}

export default Homepage;
