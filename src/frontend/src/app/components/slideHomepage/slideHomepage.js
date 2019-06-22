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
            style={{ backgroundImage: "url(images/sl2.png)" }}
          >
            {/* Welcome Content */}
            <div className="welcome-content h-100">
              <div className="container h-100">
                <div className="row h-100 align-items-center justify-content-center">
                  {/* Welcome Text */}
                  <div className="col-12 col-md-9 col-lg-6">
                    <div className="welcome-text text-center">
                      <h2 data-animation="fadeInUpBig" data-delay="100ms">
                        Học tập
                      </h2>
                      <h5 data-animation="fadeInUpBig" data-delay="400ms">
                        Môi trường yên tĩnh, tập trung
                      </h5>
                     
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
            style={{ backgroundImage: "url(images/sl1.jpg)" }}
          >
            {/* Welcome Content */}
            <div className="welcome-content h-100">
              <div className="container h-100">
                <div className="row h-100 align-items-center justify-content-center">
                  {/* Welcome Text */}
                  <div className="col-12 col-md-9 col-lg-6">
                    <div className="welcome-text text-center">
                      <h2 data-animation="fadeInUpBig" data-delay="100ms">
                       Tiện nghi
                      </h2>
                      <h5 data-animation="fadeInUpBig" data-delay="400ms">
                        Nằm ngay trung tâm thành phố, thuận tiện di chuyển
                      </h5>
                     
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
            style={{ backgroundImage: "url(images/sl3.jpg)" }}
          >
            {/* Welcome Content */}
            <div className="welcome-content h-100">
              <div className="container h-100">
                <div className="row h-100 align-items-center justify-content-center">
                  {/* Welcome Text */}
                  <div className="col-12 col-md-9 col-lg-6">
                    <div className="welcome-text text-center">
                      <h2 data-animation="fadeInUpBig" data-delay="100ms">
                        Rèn luyện
                      </h2>
                      <h5 data-animation="fadeInUpBig" data-delay="400ms">
                        Các hoạt động nâng cao đời sống tinh thân cho sinh viên
                      </h5>
                     
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
