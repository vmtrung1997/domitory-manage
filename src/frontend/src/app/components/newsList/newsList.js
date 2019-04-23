import React from "react";
import "./newsList.css";
import { Button, ButtonGroup, Pagination, Row } from "react-bootstrap";
import Axios from "axios";
import Loader from "react-loader-spinner";

class NewsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      postsAll: [],
      postsNews: [],
      postsActivity: [],
      pinnedPosts: [],
      filter: 0, //0: all 1:news 2: hoat dong
      isLoad: true
    };
  }

  loadNews = date => {
    var _post = [];
    var _pinnedPosts = [];
    var _postsActivity = [];
    var _postsNews = [];
    Axios.post("http://localhost:4000/news/get-news", { data: date })
      .then(rs => {
        if (rs.status === 200) {
          rs.data.data.map(item => {
            _post.push(item);
            if (item.ghim === 1) {
              _pinnedPosts.push(item);
            }
            if (item.loai === "0") {
              _postsNews.push(item);
            } else _postsActivity.push(item);
          });
        }
      })
      .then(() => {
        this.setState({
          postsActivity: _postsActivity,
          postsNews: _postsNews,
          postsAll: _post,
          pinnedPosts: _pinnedPosts,
          isLoad: false
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

  newsFilter = type => {
    switch (type) {
      case 0: //Show tất cả tin tức
        this.setState({ filter: 0 });
        break;
      case 1: //Show Thoong tin
        this.setState({ filter: 1 });

        break;
      case 2: //Show Hoat Dong
        this.setState({ filter: 2 });

        break;
      default:
        break;
    }
  };

  loadMore = () => {
    this.setState({
      isLoad: true
    });

    var _post = [];
    var _postsActivity = [];
    var _postsNews = [];
    var lastPost = this.state.postsAll[this.state.postsAll.length - 1];
    var date = new Date(lastPost.ngayTao);

    Axios.post("http://localhost:4000/news/get-news", { data: date })
      .then(rs => {
        if (rs.status === 200) {
          rs.data.data.map(item => {
            _post.push(item);

            if (item.loai === "0") {
              _postsNews.push(item);
            } else _postsActivity.push(item);
          });
        }
      })
      .then(() => {
        var posts = this.state.postsAll;
        var postsActivity = this.state.postsActivity;
        var postsNews = this.state.postsNews;
        _post.map(item => {
          posts.push(item);
        });
        _postsNews.map(item => {
          postsNews.push(item);
        });
        _postsActivity.map(item => {
          postsActivity.push(item);
        });
        this.setState({
          posts: posts,
          postsAll: posts,
          postsActivity: postsActivity,
          postsNews: postsNews,
          isLoad: false
        });
      });
  };
  render() {
    var posts = [];
    switch (this.state.filter) {
      case 0:
        posts = this.state.postsAll;
        break;
      case 1:
        posts = this.state.postsNews;
        break;
      case 2:
        posts = this.state.postsActivity;
        break;
      default:
        break;
    }
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
                        <img src="/img/st.jpg" alt />
                      </a>
                      <div className="post-body">
                        <div className="post-meta">
                          <span
                            className={
                              item.loai === "0"
                                ? "post-category cat-1"
                                : "post-category cat-2"
                            }
                          >
                            {item.loai === "0" ? "Hoạt Động" : "Thông tin"}
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
                        // TODO: acvive không hoạt đông
                        onClick={e => this.newsFilter(0)}
                        variant="light"
                        className="section-all-hover"
                        active
                      >
                        Tất cả
                      </Button>
                      <Button
                        onClick={e => this.newsFilter(1)}
                        variant="light"
                        className="section-news-hover"
                      >
                        Thông tin
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
              {posts.map(item => {
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
                        <img src="/img/maxresdefault.jpg" alt />
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
                );
              })}
            </div>
            {/* /row */}
            <div className="col-md-12">
              <div className="section-row">
                {this.state.isLoad && (
                  <Loader
                    type="ThreeDots"
                    color="#007bff"
                    height={60}
                    width={60}
                  />
                )}
                <button
                  onClick={this.loadMore}
                  className="primary-button center-block"
                >
                  Xem thêm bài viết
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
