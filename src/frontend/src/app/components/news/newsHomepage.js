import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./newsHomepage.css";
import Axios from "axios";  


class NewsHomepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postsAll: []
    };
  }

  loadNews = date => {
    var _post = [];

    Axios.post("http://localhost:4000/news/get-news", { data: date })
      .then(rs => {
        if (rs.status === 200) {
          rs.data.data.map((item, index) => {
            if (index < 3) _post.push(item);
          });
        }
      })
      .then(() => {
        this.setState({
          postsAll: _post
        });
      });
  };

  componentDidMount() {
    var date = new Date("2015-01-01"); //Ngaỳ mặc định
    this.loadNews(date);
  }
  onViewDetail = id => {
    var address = "http://localhost:3000/news/detail?id=" + id;
    window.open(address, "_blank");
  };


  render() {
    var posts = [];
    posts = this.state.postsAll;
    return (
      <React.Fragment>
        {/* section */}
        <div className="homepage-news">


          {/* container */}
          <div className="container">
            {/* row */}
            <div className="row">
              <div className="col-md-12">
                <div className="section-title">
                  <div style={{ fontSize: "50px", textAlign: "center" }}>
                    <span>TIN TỨC</span>
                  </div>
                </div>
              </div>
              {/* post */}

              {posts.map((item, index) => {
                var day = new Date(item.ngayTao);
                var month = day.getMonth() + 1;
                var formatDay =
                  day.getDate() +
                  "/" +
                  month +
                  "/" +
                  day.getFullYear() +
                  " " +
                  day.getHours() +
                  ":" +
                  day.getMinutes();
                return (
                  <div className="col-md-4" key={index}>
                    <div style={{ marginTop: "40px" }}>
                      <div className="post">
                        <div
                          className="post-img"
                          onClick={e => this.onViewDetail(item._id)}
                        >
                          <img src="/img/st.jpg" alt='content' />
                        </div>
                        <div className="post-body">
                          <div className="post-meta">
                            <span
                              className={
                                item.loai === "1"
                                  ? "post-category cat-1"
                                  : "post-category cat-2"
                              }
                            >
                              {item.loai === "1" ? "Hoạt Động" : "Thông tin"}
                            </span>

                            <span className="post-date">
                              <i className="far fa-clock" />
                              &nbsp;{formatDay}
                            </span>
                          </div>
                          <h3 className="post-title">
                            <a
                              onClick={e => this.onViewDetail(item._id)}
                              href="#"
                            >
                              {item.tieuDe}
                            </a>
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="col-md-12">
              <div className="section-row">
                  <Link to="/news">
                    <span className="list-item-menu"> Xem thêm bài viết </span>
                  </Link>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default NewsHomepage;
