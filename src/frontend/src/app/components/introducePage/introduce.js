import React, { Component } from "react";
import "./introduce.css";
import Footer from '../footerHomepage/footer'
class Introduce extends React.Component {
  render() {
    return (
      <div class="container-intro">
        <section class="personnel">
          <div class="introduce-filter" />
          <h1>Nhân sự</h1>
          <div class="personnel-box-content">
            <div class="personnel-box">
              <h3 class="personnel-box-title">Phòng Công tác sinh viên</h3>
              <div class="personnel-img-box">
                <img src="./images/dao-tao.png" alt="" />
              </div>
              <p>Anh Trần Vũ</p>
            </div>

            <div class="personnel-box">
              <h3 class="personnel-box-title">Trưởng Bộ phận Quản lý Ký túc xá</h3>
              <div class="personnel-img-box">
                <img src="../images/khao-thi.png" alt="" />
              </div>
              <p>TBP: ThS. Trần Văn Huy</p>
            </div>

            <div class="personnel-box">
              <h3 class="personnel-box-title">Quản lý sinh viên</h3>
              <div class="personnel-img-box">
                <img src="./images/dao-tao.png" alt="" />
              </div>
              <p>Bà Trương Thị Ánh Nhung</p>
            </div>

            <div class="personnel-box">
              <h3 class="personnel-box-title">Tổ Bảo vệ</h3>
              <div class="personnel-img-box">
                <img src="./images/khao-thi.png" alt="" />
              </div>
              <p>Ông Cao Văn Nhã</p>
              <p>Ông Bùi Văn Lộc</p>
              <p>Ông Đặng Văn Tuyên</p>
            </div>

            <div class="personnel-box">
              <h3 class="personnel-box-title">Tổ sửa chữa điện nước</h3>
              <div class="personnel-img-box">
                <img src="./images/khac.png" alt="" />
              </div>
              <p>Ông Bùi Văn Lộc</p>
            </div>

            <div class="personnel-box">
              <h3 class="personnel-box-title">Tổ Vệ sinh</h3>
              <div class="personnel-img-box">
                <img src="./images/ctsv.png" alt="" />
              </div>
              <p>Bà Nguyễn Thị Út</p>
              <p>Bà Lê Thị Hà</p>
            </div>
          </div>
        </section>

        <section class="contact">
          <h1>Thông tin liên hệ</h1>
          <div class="contact-box-content">
            <div class="contact-box">
              <h3 class="contact-box-title">Phòng Công tác sinh viên</h3>
              <div class="contact-img-box">
                <img src="./images/ctsv.png" alt="" />
              </div>
              <p>congtacsinhvien@hcmus.edu.vn</p>
            </div>

            <div class="contact-box">
              <h3 class="contact-box-title">Bộ phần Quản lý Ký túc xá</h3>
              <div class="contact-img-box">
                <img src="./images/ctsv.png" alt="" />
              </div>
              <p>(08) 38 36 86 70</p>
              <p>hopthuktx135b@gmail.com</p>
            </div>

            <div class="contact-box">
              <h3 class="contact-box-title">Phó bộ phận KTX</h3>
              <div class="contact-img-box">
                <img src="./images/ctsv.png" alt="" />
              </div>
              <p>0918 20 24 36</p>
              <p>phanvanthanhktx@gmail.com</p>
            </div>
          </div>
        </section>

        <section class="condition-stay">
          <div class="introduce-filter" />
          <h1>Lưu ý</h1>
          <div class="condition-box-content">
            <div class="condition-box-first">
              <div class="condition-first-img">
                <img src="./images/note_1.png" alt="" />
              </div>
              <div class="condition-first-content">
                Khi có thông báo tiếp nhận sinh viên vào lưu trú (đối với sinh
                viên mới chưa vào ở KTX) tại KTX trường ĐH. Khoa Học Tự Nhiên ,
                sinh viên phải nộp đơn ở phòng Công tác Sinh viên. Sau khi xét
                duyệt, phòng Công tác sinh viên sẽ niêm yết danh sách trên
                website của trường. Từ đó, căn cứ vào danh sách được duyệt, bộ
                phận Quản lý KTX mới tiến hành tiếp nhận lưu trú.
              </div>
            </div>
            <br />
            <div class="condition-box-first">
              <div class="condition-first-content">
                Căn cứ vào hợp đồng lưu trú đã ký giữa phòng CTSV và sinh viên,
                nếu sinh viên không có nhu cầu lưu trú thì sinh viên phải làm
                thủ tục thanh lý hợp đồng. Đối với sinh viên đã ở KTX trên 1
                tháng (tính từ ngày vào làm thủ tục) thì sinh viên sẽ không được
                nhận lại tiền lệ phí lưu trú và chỉ nhận lại được tiền thế chân
                tài sản. Nếu sinh viên lưu trú chưa được 1 tháng thì sẽ khấu trừ
                1 tháng tiền lưu trú và tiền hồ sơ.
              </div>
              <div class="condition-first-img">
                <img src="./images/note_2.png" alt="" />
              </div>
            </div>
          </div>
        </section>

        <section className="service">
          <h1>Những dịch vụ cho sinh viên</h1>
          <div class="service-box">
            <div class="service-box-one">
              <div class="img-box">
                <div class="service-img">
                  <img src="./images/motorcycle.png" alt="" />
                </div>
                <p className="name-serice">Dịch vụ giữ xe</p>
              </div>
              <p>
                Khi sinh viên muốn gửi xe vào nhà xe, sinh viên phải xuất trình
                thẻ lưu trú thì nhà xe mới nhận giữ.
                <br />
                Giá gửi xe:{" "}
                <strong>
                  Xe gắn máy: 65.000đ/tháng, Xe đạp: 45.000đ/tháng
                </strong>
                <br />
                Thời gian đóng tiền:{" "}
                <strong>từ ngày 27 đến 30 của tháng</strong>
                <br />
                Sinh viên có thắc mắc, phản ánh về nhà xe, thái độ của nhân viên
                phục vụ, vui lòng liên hệ ông Phan Văn Thành để giải quyết
              </p>
            </div>
            <div class="service-line right" />

            <div class="service-box-one">
              <p>
                Các phòng, cá nhân có nhu cầu sử dụng mạng Internet (do công ty
                VNPT cung cấp) liên hệ tại VP bộ phận Quản lý KTX để được lắp
                đặt.
                <br />
                Giá gói cước: <strong>Gói FM 20M = 220.00đ/tháng</strong>
                <br />
                Giá gói cước: <strong> Gói F2M 30M = 275.00đ/tháng</strong>
                <br />
                Thời gian sử dụng từ <strong> ngày 1 đến 30 của tháng </strong>
                <br />
                Thời gian đóng cước cho tháng kế tiếp từ{" "}
                <strong> ngày 25 đến ngày 30 của tháng </strong>
                <br />
                Nếu cá nhân không đóng tiền cước cho tháng tiếp theo thì ngày
                đầu của tháng nhà mạng sẽ tạm ngưng cung cấp.
              </p>

              <div class="img-box-small">
                <div class="service-img">
                  <img src="./images/smartphone.png" alt="" />
                </div>
                <p className="name-serice">Dịch vụ internet</p>
              </div>
            </div>
            <div class="service-line left" />

            <div  class="service-box-one column">
              <div class="img-box-small">
                <div class="service-img">
                  <img src="./images/doodle.png" alt="" />
                </div>
                <p className="name-serice">Dịch vụ ăn uống</p>
              </div>
              <p>
                Ký túc xá có 1 nhà ăn để phục vụ ăn uống cho sinh viên Ký túc xá
              </p>
            </div>
          </div>
        </section>

        <section class="activity-intro">
          <div class="introduce-filter" />
          <h1>Các hoạt động</h1>
          <div class="activity-box">
            <div class="activity-content">
              Tháng 10: Chào đón Tân sinh viên
              <br />
              Tháng 11-12: Chuỗi hoạt động văn nghệ
              <br />
              Tháng 03-04: Chuỗi hoạt động học thuật hoặc hội thao
              <br />
              <br />
              Bên cạnh đó, KTX còn có một số hoạt động xã hội, bảo vệ môi trường
              như Chủ Nhật Xanh, Hiến máu nhân đạo, tuyên truyền...
            </div>
            <div class="activity-img-box">
              <img src="./images/lovetree.png" alt="" />
            </div>
          </div>
        </section>
        <Footer></Footer>
      </div>
    );
  }
}

export default Introduce;
