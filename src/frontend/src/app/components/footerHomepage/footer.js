import React from "react";

export default class Footer extends React.Component {
  render() {
    return (
      <React.Fragment>
        <footer className="footer-area">
          {/* Main Footer Area */}
          <div className="main-footer-area section-padding-80-0">
            <div className="container">
              <div className="row justify-content-between">
                {/* Single Footer Widget */}
                <div className="col-12 col-sm-6 col-md-4 col-xl-3">
                  <div className="single-footer-widget mb-80">
                    {/* Footer Logo */}
                    <a href="#" className="footer-logo">
                      <img src="img/core-img/logo2.png" alt />
                    </a>
                    <p className="mb-30">
                      Lorem ipsum dolor sit amet, consectet adipisicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    {/* Footer Content */}
                    <div className="footer-content">
                      {/* Single Contact Info */}
                      <div className="single-contact-info d-flex">
                        <div className="icon">
                          <i className="icon_pin" />
                        </div>
                        <div className="text">
                          <p>
                            24 No. Amazing Valley, Aewsome St. New York, USA
                          </p>
                        </div>
                      </div>
                      {/* Single Contact Info */}
                      <div className="single-contact-info d-flex">
                        <div className="icon">
                          <i className="icon_phone" />
                        </div>
                        <div className="text">
                          <p>+11 123 4567890</p>
                        </div>
                      </div>
                      {/* Single Contact Info */}
                      <div className="single-contact-info d-flex">
                        <div className="icon">
                          <i className="icon_mail_alt" />
                        </div>
                        <div className="text">
                          <p>info.colorlib@gmail.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Single Footer Widget */}
                <div className="col-12 col-sm-6 col-md-4 col-xl-3">
                  <div className="single-footer-widget mb-80">
                    {/* Widget Title */}
                    <h4 className="widget-title">Twitter Feed</h4>
                    {/* Single Twitter Feed */}
                    <div className="single-twitter-feed d-flex">
                      <div className="tweet-icon">
                        <i className="fa fa-twitter" />
                      </div>
                      <div className="tweet">
                        <p>
                          <a href="#">Kerem Suer</a> @kerem American conducts it
                          first ever done strike Qaeda
                        </p>
                      </div>
                    </div>
                    {/* Single Twitter Feed */}
                    <div className="single-twitter-feed d-flex">
                      <div className="tweet-icon">
                        <i className="fa fa-twitter" />
                      </div>
                      <div className="tweet">
                        <p>
                          <a href="#">Axel Hervelle</a> @axel_hervelle Tens of
                          thousands attend rallies held in D.C.
                        </p>
                      </div>
                    </div>
                    {/* Single Twitter Feed */}
                    <div className="single-twitter-feed d-flex">
                      <div className="tweet-icon">
                        <i className="fa fa-twitter" />
                      </div>
                      <div className="tweet">
                        <p>
                          <a href="#">Chris Pratt</a> @chris_pratt Hundreds of
                          protesters shut down meeting.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Single Footer Widget */}
                <div className="col-12 col-md-4 col-xl-3">
                  <div className="single-footer-widget mb-80">
                    {/* Widget Title */}
                    <h4 className="widget-title">Instagram</h4>
                    {/* Instagram Area */}
                    <div className="razo-instagram-area d-flex flex-wrap">
                      {/* Single Instagram Feed */}
                      <div className="single-instagram-feed">
                        <a href="#">
                          <img src="img/bg-img/2.jpg" alt />
                        </a>
                      </div>
                      {/* Single Instagram Feed */}
                      <div className="single-instagram-feed">
                        <a href="#">
                          <img src="img/bg-img/3.jpg" alt />
                        </a>
                      </div>
                      {/* Single Instagram Feed */}
                      <div className="single-instagram-feed">
                        <a href="#">
                          <img src="img/bg-img/4.jpg" alt />
                        </a>
                      </div>
                      {/* Single Instagram Feed */}
                      <div className="single-instagram-feed">
                        <a href="#">
                          <img src="img/bg-img/5.jpg" alt />
                        </a>
                      </div>
                      {/* Single Instagram Feed */}
                      <div className="single-instagram-feed">
                        <a href="#">
                          <img src="img/bg-img/6.jpg" alt />
                        </a>
                      </div>
                      {/* Single Instagram Feed */}
                      <div className="single-instagram-feed">
                        <a href="#">
                          <img src="img/bg-img/7.jpg" alt />
                        </a>
                      </div>
                      {/* Single Instagram Feed */}
                      <div className="single-instagram-feed">
                        <a href="#">
                          <img src="img/bg-img/8.jpg" alt />
                        </a>
                      </div>
                      {/* Single Instagram Feed */}
                      <div className="single-instagram-feed">
                        <a href="#">
                          <img src="img/bg-img/9.jpg" alt />
                        </a>
                      </div>
                      {/* Single Instagram Feed */}
                      <div className="single-instagram-feed">
                        <a href="#">
                          <img src="img/bg-img/10.jpg" alt />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Main Footer Area End */}
          {/* Copywrite Text */}
          <div className="copywrite-area">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  {/* Copywrite Text */}
                  <div className="copywrite-text">
                    <p>
                      {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                      Copyright © All rights reserved | This template is made
                      with <i className="fa fa-heart-o" aria-hidden="true" /> by{" "}
                      <a href="https://colorlib.com" target="_blank">
                        Colorlib
                      </a>
                      {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}
