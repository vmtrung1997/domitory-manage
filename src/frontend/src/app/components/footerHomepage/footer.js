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
          <div><i className="fas fa-phone"></i>&nbsp; (028) 38368670</div>
          <div style = {{marginTop: '20px'}}>
          <div><i className="fas fa-user-friends"></i>&nbsp; Được xây dựng vào phát triển bởi Storm Team</div>
          <div><i className="far fa-envelope"></i>&nbsp; stormteamk15hcmus@gmail.com</div>


               
                  </div>
          </div>
        
        </footer>
      </React.Fragment>
    );
  }
}
