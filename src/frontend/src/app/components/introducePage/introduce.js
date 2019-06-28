import React, { Component } from "react";
import "./introduce.css";
class Introduce extends React.Component {
  render() {
    return (
      <div className="intro">
        <img src = '/images/388.jpg'></img>
        <h1>GIỚI THIỆU</h1>
        <div className="intro-content">
          <div className='margin-content'>
       
          <h4>I. Giới thiệu khái quát ký túc xá trường khoa học tự nhiên</h4>
          <div className="contact" />
          <div className="organizational-chart" />
          <h5 className="header-intro">
            <b>1. Nhân sự</b>
          </h5>
          <p className="small-header-intro">a. Phòng công tác sinh viên</p>
          <p>- Trưởng phòng: ThS. Văn Chí Nam</p>
          <p>- Phó trưởng phòng: ThS. Phạm Nguyễn Thùy Dương</p>

          <p className="small-header-intro">b. Bộ phận Quản lý Ký túc xá</p>
          <p>- Trưởng bộ phận: ThS. Trần Văn Huy</p>
          <p>- Phó bộ phận: Ông Phan Văn Thành</p>

          <p className="small-header-intro">c. Tổ Quản lý sinh viên</p>
          <p>- Ông Phan Văn Thành</p>
          <p>- Bà Trương Thị Ánh Nhung</p>

          <p>d. Tổ Bảo vệ</p>
          <p>- Ông Cao Văn Nhã</p>
          <p>- Ông Bùi Văn Lộc</p>
          <p>- Ông Đặng Văn Tuyên</p>
          <p>e. Tổ Vệ sinh</p>
          <p>- Bà Nguyễn Thị Út</p>
          <p>-Bà Lê Thị Hà</p>
          <p>f. Tổ sửa chữa điện nước</p>
          <p>- Ông Bùi Văn Lộc</p>
          <div className="info-contact">
            <h5 className="header-intro">
              <b>2. Thông tin liên hệ</b>
            </h5>
            <p className="small-header-intro">1. Phòng Công tác sinh viên:</p>
            <p>- Email: congtacsinhvien@hcmus.edu.vn</p>
            <p>2. Bộ phần Quản lý Ký túc xá:</p>
            <p>- Điện thoại: (08) 38 36 86 70</p>
            <p>- Email: hopthuktx135b@gmail.com</p>
            <p> Phó bộ phận: Ông Phan Văn Thành</p>
            <p>- Điện thoại: 0918 20 24 36</p>
            <p>- Email: phanvanthanhktx@gmail.com</p>
          </div>
          <h4>II. Lưu ý điều kiện xét lưu trú</h4>
          <p>
            1. Khi có thông báo tiếp nhận sinh viên vào lưu trú (đối với sinh
            viên mới chưa vào ở KTX) tại KTX trường ĐH. Khoa Học Tự Nhiên , sinh
            viên phải nộp đơn ở phòng Công tác Sinh viên. Sau khi xét duyệt,
            phòng Công tác sinh viên sẽ niêm yết danh sách trên website của
            trường. Từ đó, căn cứ vào danh sách được duyệt, bộ phận Quản lý KTX
            mới tiến hành tiếp nhận lưu trú.
            {/* Sinh viên đang ở KTX khi có thông báo tiếp nhận cho năm học mới, sinh viên xem danh */}
          </p>
          <br />
          <p>
            2. Căn cứ vào hợp đồng lưu trú đã ký giữa phòng CTSV và sinh viên,
            nếu sinh viên không có nhu cầu lưu trú thì sinh viên phải làm thủ
            tục thanh lý hợp đồng. Đối với sinh viên đã ở KTX trên 1 tháng (tính
            từ ngày vào làm thủ tục) thì sinh viên sẽ không được nhận lại tiền
            lệ phí lưu trú và chỉ nhận lại được tiền thế chân tài sản. Nếu sinh
            viên lưu trú chưa được 1 tháng thì sẽ khấu trừ 1 tháng tiền lưu trú
            và tiền hồ sơ.
          </p>
          <h4>III. Những dịch vụ cho sinh viên</h4>
          <p className="small-header-intro">1. Dịch vụ giữ xe</p>
          <p>
            Khi sinh viên muốn gửi xe vào nhà xe, sinh viên phải xuất trình thẻ
            lưu trú thì nhà xe mới nhận giữ.
          </p>
          <p>Giá gửi xe: Xe gắn máy: 60.000đ/tháng, Xe đạp: 40.000đ/tháng</p>
          <p>Thời gian đóng tiền: từ ngày 25 đến 30 của tháng</p>
          <p>
            Sinh viên có thắc mắc, phản ánh về nhà xe, thái độ của nhân viên
            phục vụ, vui lòng liên hệ ông Phan Văn Thành để giải quyết
          </p>
          <br />
          <p className="small-header-intro">
            2. Dịch vụ cung cấp mạng Internet
          </p>
          <p>
            Các phòng, cá nhân có nhu cầu sử dụng mạng Internet (do công ty VNPT
            cung cấp) liên hệ tại VP bộ phận Quản lý KTX để được lắp đặt.
          </p>

          <p>Giá gói cước: Gói FM 20M = 220.00đ/tháng</p>
          <p>Giá gói cước: Gói F2M 30M = 275.00đ/tháng</p>
          <p>Thời gian sử dụng từ ngày 1 đến 30 của tháng</p>
          <p>
            Thời gian đóng cước cho tháng kế tiếp từ ngày 25 đến ngày 30 của
            tháng
          </p>
          <p>
            Nếu cá nhân không đóng tiền cước cho tháng tiếp theo thì ngày đầu
            của tháng nhà mạng sẽ tạm ngưng cung cấp.
          </p>
          <br />
          <p className="small-header-intro">2. Dịch vụ ăn uống</p>
          <p>
            Ký túc xá có 1 nhà ăn để phục vụ ăn uống cho sinh viên Ký túc xá
          </p>
          <h4>IV. Một số hoạt động tại KTX</h4>
          <p>Tháng 10: Chào đón Tân sinh viên</p>
          <p>Tháng 11-12: Chuỗi hoạt động văn nghệ</p>
          <p>Tháng 03-04: Chuỗi hoạt động học thuật hoặc hội thao</p>
          <br></br>
          <p>Bên cạnh đó, KTX còn có một số hoạt động xã hội, bảo vệ môi trường như
              Chủ Nhật Xanh, Hiến máu nhân đạo, tuyên truyền...
          </p>
          
          <br></br>
        </div>
        </div>
      </div>
    );
  }
}

export default Introduce;
