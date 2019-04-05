import React from "react";
import "./newsList.css";
import { Button, ButtonGroup, Pagination } from "react-bootstrap";
import Axios from "axios";

class NewsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      pinnedPosts: []
    };
  }

  componentDidMount() {
    var _post = [];
    var _pinnedPosts = [];
    Axios.get("http://localhost:4000/news/get-news")
      .then(rs => {
        console.log(rs);
        if (rs.status === 200) {
          console.log(rs.data.data);
          rs.data.data.map(item => {
            _post.push(item);
            if (item.ghim === 1) {
              _pinnedPosts.push(item);
            }
          });
        }
      })
      .then(() => {
        this.setState({
          posts: _post,
          pinnedPosts: _pinnedPosts
        });
      });
  }
  onViewDetail = id => {
    var address = "http://localhost:3000/news/detail?id=" + id;
    window.open(address, "_blank");
  };
  render() {
    console.log(this.state.posts);
    return (
      <React.Fragment>
        {/* section */}
        <div className="section">
          {/* container */}
          <div className="container">
            {/* row */}
            <div className="row">
              {/* post */}
              {this.state.pinnedPosts.map(item => {
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
                  <div className="col-md-6">
                    <div className="post post-thumb">
                      <a className="post-img"   onClick={e => this.onViewDetail(item._id)}>
                        <img src="/img/post-1.jpg" alt />
                      </a>
                      <div className="post-body">
                        <div className="post-meta">
                        <span
                            className={
                              item.loai === "Hoat Dong"
                                ? "post-category cat-1"
                                : "post-category cat-2"
                            }
                          >
                            {item.loai === "Hoat Dong"
                              ? "Hoạt Động"
                              : "Thông tin"}
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
                );
              })}
              {/* /post */}
              {/* post */}

              {/* /post */}
            </div>
            {/* /row */}
            {/* row */}
            <div className="row">
              <div className="col-md-12">
                <div className="section-title">
                  <h2>Bài viết gần đây</h2>
                </div>
              </div>
              {/* post */}
              {this.state.posts.map(item => {
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
                  <div className="col-md-4">
                    <div className="post">
                      <div
                        className="post-img"
                        onClick={e => this.onViewDetail(item._id)}
                      >
                        <img src="/img/post-3.jpg" alt />
                      </div>
                      <div className="post-body">
                        <div className="post-meta">
                          <span
                            className={
                              item.loai === "Hoat Dong"
                                ? "post-category cat-1"
                                : "post-category cat-2"
                            }
                          >
                            {item.loai === "Hoat Dong"
                              ? "Hoạt Động"
                              : "Thông tin"}
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
                );
              })}
            
             
            </div>
            {/* /row */}
            <div className="col-md-12">
              <div className="section-row">
                <button className="primary-button center-block">
                  Load More
                </button>
              </div>
            </div>
            {/* row */}
            {/* /row */}
          </div>
          {/* /container */}
        </div>
      </React.Fragment>
    );
  }
}

export default NewsList;
