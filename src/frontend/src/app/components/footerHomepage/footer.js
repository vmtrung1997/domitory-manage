import React from "react";
import './footer.css'
export default class Footer extends React.Component {
  render() {
    return (
      <React.Fragment>
        <footer className="footer-area">
        <div className = 'footer-homepage'>
          <div><i className="fas fa-home"></i><span>&nbsp; KTX Trần Hưng Đạo - Đại học Khoa học Tự Nhiên</span></div>
          <div><i className="fas fa-map-marker-alt"></i><span>&nbsp; 135B Trần Hưng Đạo, Quận 1, Hồ Chí Minh</span></div>
          <div><i class="fas fa-phone"></i>&nbsp; 0372881819</div>
          <div><i class="far fa-envelope"></i>&nbsp; tainguyen198@gmail.com</div>
          <div style = {{marginTop: '20px'}}>
                    <p>
                      {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                    This template is made
                      with <i className="fa fa-heart-o" aria-hidden="true" /> by{" "}
                      <a href="https://colorlib.com" target="_blank">
                        Colorlib
                      </a>
                      {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                    </p>
                  </div>
          </div>
        
        </footer>
      </React.Fragment>
    );
  }
}
