import React from "react";
import "./info.css";
import { Container, Row, Col } from "react-bootstrap";

class InfoHomePage extends React.Component {
  render() {
    return (
      <React.Fragment>
        {
  /* App Download Area Start */
}
;<section
  className="razo-app-download-area section-padding-80-0 bg-img bg-overlay jarallax"
  style={{ backgroundImage: "url(images/intro.jpg)" }}
>
  <div className="container">
    <div className="row align-items-center">
      {/* App Thumbnail */}
      <div className="col-12 col-md-6">
        <div className="app-thumbnail mb-80">
          <img src="images/info-min.png" alt />
        </div>
      </div>
      {/* App Download Text */}
      <div className="col-12 col-md-6">
        <div className="app-download-text mb-80">
        
          <h2>GIỚI THIỆU</h2>
          <p>
          Ký túc xá 135B Trần Hưng Đạo từ lâu
                    đã trở nên quen thuộc và gắn bó với sinh viên HCMUS, đặc biệt
                    là những bạn sinh viên sống xa nhà.
                    <br />
                    <br />
                    Nằm ngay trung tâm thành phố, đây là một vị trí thuận lợi cho các bạn sinh viên di 
                    chuyển đến các cơ sở học tập trên địa bàn bằng nhiều loại phương tiện khác nhau, 
                    đặc biệt là xe buýt.
                    <br />
                    <br />
                    KTX là một khuôn viên khép kín bên trong khu nhà gồm 3 tầng,
                    có thể phục vụ hơn 800 chỗ ở cùng nhiều hạng mục tiện ích
                    cho sinh viên. Hiện tại KTX 135B Trần Hưng Đạo do Trung tâm
                    Hỗ trợ sinh viên quản lý.
                    <br />
                    <br />
                    Đặc biệt đời sống sinh viên ở KTX cũng rất đa dạng với các 
                    chương trình văn hóa sinh viên được nhà trường tổ chức nhiều đợt, 
                    hay những buổi lắng nghe radio phát thanh thứ 6, thứ 7 hoặc chủ nhật hằng tuần. 
                    Cùng với những không gian khác biệt này, KTX 135 Trần Hưng Đạo sẽ đưa đến cho các bạn những
                     trả nghiệm nhất định mà mình cá rằng, sống và sinh hoạt cùng 6 – 7 con người khác trong một 
                     căn phòng nhỏ là điều các bạn sẽ nhớ nhất thời sinh viên. 
          </p>
       
        </div>
      </div>
    </div>
  </div>
</section>
{
  /* App Download Area End */
}

        {/* <div className="background slide-fwd-center ">
          <div className="info-title">
            <span>GIỚI THIỆU</span>
          </div>
          <Container>
            <Row>
              <Col className="info-text">
                <div>
                  <span style = {{textAlign: 'center'}}>
                    KTX 135 Trần Hưng Đạo (Ký túc xá 135B Trần Hưng Đạo) từ lâu
                    đã trở nên quen thuộc và gắn bó với sinh viên HCMUS, đặc biệt
                    là những bạn sinh viên sống xa nhà.
                    <br />
                    <br />
                    Nằm tọa lạc ngay trung tâm thành phố, đây là một vị trí rất
                    thuận tiện cho việc đi lại và học tập của sinh viên đến các
                    cơ sở học tập của trường bằng nhiều phương tiện, đặc biệt là
                    xe buýt.
                    <br />
                    <br />
                    KTX là một khuôn viên khép kín bên trong khu nhà gồm 3 tầng,
                    có thể phục vụ hơn 800 chỗ ở cùng nhiều hạng mục tiện ích
                    cho sinh viên. Hiện tại KTX 135B Trần Hưng Đạo do Trung tâm
                    Hỗ trợ sinh viên quản lý.
                    <br />
                    <br />
                    Hãy cùng tìm hiểu một số thông tin về KTX nhé!
                  </span>
                </div>
              </Col>
            </Row>
          </Container>
        </div> */}
      </React.Fragment>
    );
  }
}

export default InfoHomePage;
