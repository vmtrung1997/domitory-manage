import React from "react";
import "./newsContent.css";
import axios from "axios";


class NewsContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tieuDe: undefined,
      noiDung: undefined,
      thoiGian: undefined
    };
  }
  componentDidMount() {
    if (this.props.location.search === "") {
      //--TODO-- Redirect sang trang tin tức
    } else {
      var req =
        "http://localhost:4000" +
        this.props.location.pathname +
        this.props.location.search;

      axios.get(req).then(rs => {
        if (rs.status === 204) {
          //--TODO-- Thiện thông báo không có bài viết
        } else {
          this.setState({
            thoiGian: rs.data.data.ngayTao,
            noiDung: rs.data.data.noiDung,
            tieuDe: rs.data.data.tieuDe
          });
        }
      });
    }
  }
  render() {
    var d = new Date(this.state.thoiGian);
    var month = d.getMonth() + 1;
    var thu = d.getDay() + 1;
    var formatDay =
      "Thứ " +
      thu +
      " " +
      d.getDate() +
      "/" +
      month +
      "/" +
      d.getFullYear() +
      " |  " +
      d.getHours() +
      ":" +
      d.getMinutes() +
      ":" +
      d.getSeconds();
    return (
      <React.Fragment>
       
        <div className="news-content-detail">
        <div className = 'img-background'>
        </div>
          <div className="news-detail">
            <div className="news-detail-sub">
              <div className="tilte">
                <span>{this.state.tieuDe}</span>
              </div>
              <div className="content-detail-time">
                <span>
                  <i className="far fa-clock" /> &nbsp;{formatDay}
                </span>
              </div>
              <div
                className="content-detail"
                dangerouslySetInnerHTML={{ __html: this.state.noiDung }}
              />
            </div>
          </div>
         
        </div>
      </React.Fragment>
    );
  }
}

export default NewsContent;
