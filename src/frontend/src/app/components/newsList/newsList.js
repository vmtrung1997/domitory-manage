import React from "react";
import "./newsList.css";
import { Button, ButtonGroup, Pagination, Row } from "react-bootstrap";
import Axios from "axios";

class NewsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      postsAll: [],
      pinnedPosts: [],
    };
  }

  componentDidMount() {
    var _post = [];
    var _pinnedPosts = [];
    var date = new Date("2015-01-01") //Ngaỳ mặc định
    Axios.post("http://localhost:4000/news/get-news",{data: date})
      .then(rs => {
        console.log(rs);
        if (rs.status === 200) {
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
          postsAll: _post,
          pinnedPosts: _pinnedPosts
        });
      });
  }
  onViewDetail = id => {
    var address = "http://localhost:3000/news/detail?id=" + id;
    window.open(address, "_blank");
  };

  newsFilter = type => {
    switch (type) {
      case 0: //Show tất cả tin tức
        var postsAll = [];
        this.state.postsAll.map(item => {
          postsAll.push(item);
        });
        this.setState({
          posts: postsAll
        });
        break;
      case 1: //Show Thoong tin
        var postsNews = [];
        this.state.postsAll.map(item => {
          if (item.loai === "1") {
            postsNews.push(item);
          }
        });
        this.setState({
          posts: postsNews
        });
        break;
        case 2: //Show Hoat Dong
        var postsActivity = [];
        this.state.postsAll.map(item => {
          if (item.loai === "0") {
            postsActivity.push(item);
          }
        });
        this.setState({
          posts: postsActivity
        });
        break;
      default:
        break;
    }
  };

  loadMore = () => {
    var _post = [];

    var lastPost = this.state.postsAll[this.state.postsAll.length - 1];
    var date = new Date(lastPost.ngayTao);

    Axios.post("http://localhost:4000/news/get-news",{data: date})
    .then(rs => {
      console.log(rs.data);
      if (rs.status === 200) {
        rs.data.data.map(item => {
          _post.push(item);
        });
      }
    })
    .then(() => {
      var posts = this.state.posts;
      _post.map(item =>{
        posts.push(item)
      })
      this.setState({
        posts: posts,
        postsAll: posts,
      });
    });
  }

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
                      <a
                        className="post-img"
                        onClick={e => this.onViewDetail(item._id)}
                      >
                        <img src="/img/post-1.jpg" alt />
                      </a>
                      <div className="post-body">
                        <div className="post-meta">
                          <span
                            className={
                              item.loai === "1"
                                ? "post-category cat-1"
                                : "post-category cat-2"
                            }
                          >
                            {item.loai === "1"
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
                  <Row>
                    <h2>Bài viết gần đây</h2>
                    <ButtonGroup className="section-option">
                      <Button
                        active // TODO: acvive không hoạt đông
                        onClick={e => this.newsFilter(0)}
                        variant="light"
                        className="section-all-hover"
                      >
                        Tất cả
                      </Button>
                      <Button
                        onClick={e => this.newsFilter(1)}
                        variant="light"
                        className="section-news-hover"
                      >
                        Thông tin{" "}
                      </Button>
                      <Button
                        onClick={e => this.newsFilter(2)}
                        variant="light"
                        className="section-activity-hover"
                      >
                        Hoạt động
                      </Button>
                    </ButtonGroup>
                  </Row>
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
                              item.loai === "1"
                                ? "post-category cat-1"
                                : "post-category cat-2"
                            }
                          >
                            {item.loai === "1"
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
                <button onClick = {this.loadMore} className="primary-button center-block">
                  Thêm bài viết
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
