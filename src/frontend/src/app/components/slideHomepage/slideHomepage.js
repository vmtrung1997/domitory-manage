import React from "react";
import { Carousel } from "react-bootstrap";
import './styleHomepage.css'

const Slideshow = () => {
  return (
    <React.Fragment>


      <Carousel>
        <Carousel.Item>
          {/* Single Welcome Slide */}
          <div
            className="single-welcome-slide bg-img bg-overlay"
            style={{ backgroundImage: "url(img/post-1.jpg)" }}
          >
            {/* Welcome Content */}
            <div className="welcome-content h-100">
              <div className="container h-100">
                <div className="row h-100 align-items-center justify-content-center">
                  {/* Welcome Text */}
                  <div className="col-12 col-md-9 col-lg-6">
                    <div className="welcome-text text-center">
                      <h2 data-animation="fadeInUpBig" data-delay="100ms">
                        Designed For Music, Engineered to Last
                      </h2>
                      <h5 data-animation="fadeInUpBig" data-delay="400ms">
                        31st Dec - Night out party....Don't miss it
                      </h5>
                      <a
                        href="#"
                        className="btn razo-btn btn-2"
                        data-animation="fadeInUpBig"
                        data-delay="700ms"
                      >
                        Book Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          {/* Single Welcome Slide */}
          <div
            className="single-welcome-slide bg-img bg-overlay"
            style={{ backgroundImage: "url(img/post-1.jpg)" }}
          >
            {/* Welcome Content */}
            <div className="welcome-content h-100">
              <div className="container h-100">
                <div className="row h-100 align-items-center justify-content-center">
                  {/* Welcome Text */}
                  <div className="col-12 col-md-9 col-lg-6">
                    <div className="welcome-text text-center">
                      <h2 data-animation="fadeInUpBig" data-delay="100ms">
                        Designed For Music, Engineered to Last
                      </h2>
                      <h5 data-animation="fadeInUpBig" data-delay="400ms">
                        31st Dec - Night out party....Don't miss it
                      </h5>
                      <a
                        href="#"
                        className="btn razo-btn btn-2"
                        data-animation="fadeInUpBig"
                        data-delay="700ms"
                      >
                        Book Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Carousel.Item>
        
        <Carousel.Item>
          {/* Single Welcome Slide */}
          <div
            className="single-welcome-slide bg-img bg-overlay"
            style={{ backgroundImage: "url(img/post-1.jpg)" }}
          >
            {/* Welcome Content */}
            <div className="welcome-content h-100">
              <div className="container h-100">
                <div className="row h-100 align-items-center justify-content-center">
                  {/* Welcome Text */}
                  <div className="col-12 col-md-9 col-lg-6">
                    <div className="welcome-text text-center">
                      <h2 data-animation="fadeInUpBig" data-delay="100ms">
                        Designed For Music, Engineered to Last
                      </h2>
                      <h5 data-animation="fadeInUpBig" data-delay="400ms">
                        31st Dec - Night out party....Don't miss it
                      </h5>
                      <a
                        href="#"
                        className="btn razo-btn btn-2"
                        data-animation="fadeInUpBig"
                        data-delay="700ms"
                      >
                        Book Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Carousel.Item>
        
      </Carousel>

    </React.Fragment>
  );
};

export default Slideshow;
