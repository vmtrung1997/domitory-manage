import React from "react";
import { Carousel } from "react-bootstrap";

const fadeImages = [
  "/img/skt_1.jpg",
  "/img/skt_2.jpg",
  "/img/skt_1.jpg",
];

const Slideshow = () => {
  return (
    <React.Fragment>
      <Carousel>
        <Carousel.Item>
          <div className="homepage-carousel-img">
            <img
           
              className="d-block w-100"
              src={fadeImages[0]}
              alt="First slide"
            />
          </div>
          <Carousel.Caption>
            <div className = "homepage-carousel-caption">
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div className="homepage-carousel-img">

            <img
          
              className="d-block w-100"
              src={fadeImages[1]}
              alt="First slide"
            />
          </div>

          <Carousel.Caption>
          <div className = "homepage-carousel-caption">
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div className="homepage-carousel-img">
            <img
              className="d-block w-100"
              src={fadeImages[0]}
              alt="First slide"
            />
          </div>

          <Carousel.Caption>
          <div className = "homepage-carousel-caption">
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      ;
    </React.Fragment>
  );
};

export default Slideshow;
