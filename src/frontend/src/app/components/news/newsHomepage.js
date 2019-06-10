import React from "react";
import {  Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./newsHomepage.css";
import Axios from "axios";
import { storage } from "../../firebase";

class NewsHomepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postsAll: [],
      postPin: []
    };
  }

  loadNews = async date => {
    var _post = [];

    await Axios.post("/news/get-news", { data: date,skip: 0,limit: 5})
      .then(rs => {
        if (rs.status === 200) {
          rs.data.data.forEach((item, index) => {
            if (index < 5) _post.push(item);
          });
        }
      })
      .then(() => {
        this.setState({
          postsAll: _post
        });
      
      });
  };

  loadPinNews = async () => {
    this.setState({
      isLoad: true
    });

    var _post = [];

    await Axios.get("/news/get-pin-news")
      .then(rs => {
        if (rs.status === 200) {
          rs.data.data.forEach(item => {
            _post.push(item);
          });
        }
      })
      .then(() => {
        this.setState({
          postPin: _post
        });
      });
  };

  loadImages = async () => {
    var temp = [];
    this.state.postsAll.forEach(async (item, index) => {
      if(item.stamp){
        var rs = item.stamp + ".jpg";
        await storage
          .ref("news")
          .child(rs)
          .getDownloadURL()
          .then(url => {
            var tmp = this.state.postsAll;
            tmp[index].url = url;
            this.setState({ postsAll: tmp });
          });
        }
        else{
          var tmp = this.state.postsAll;
          tmp[index].url = '/images/logo-hktn.jpg';
          this.setState({ postsAll: tmp });
        }
    });

    this.state.postPin.forEach(async (item, index) => {
      var rs = item.stamp + ".jpg";
      await storage
        .ref("news")
        .child(rs)
        .getDownloadURL()
        .then(url => {
          var tmp = this.state.postPin;
          tmp[index].url = url;
          this.setState({ postPin: tmp });
        });
    });

    return temp;
  };

  componentDidMount = async () => {
    var date = new Date("2015-01-01"); //Ngaỳ mặc định

    await this.loadNews(date);

    await this.loadPinNews();
    this.loadImages();
  };
  onViewDetail = id => {
    // window.alert(id);
    var address = "/news/detail?id=" + id;
    //console.log(address);
    window.open(address,'_blank');
  };

  formatDay = item => {
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

    return formatDay;
  };
  render() {
    return (
      <React.Fragment>
        <section className="razo-blog-area section-padding-80-0">
          <div className="container">
            <div ><h2 style = {{fontSize: '36px', marginBottom: '15px',textAlign:'center'}}>TIN TỨC</h2></div>
            {this.state.postsAll.length === 0?
                  <div style={{ marginTop: "30px", textAlign: "center" }}>
                        <img
                          style={{ marginTop: '14vh',
                            height: '50%',
                            width: '50%' }}
                          src="/images/notdatafound.png"
                          alt = "true"
                        ></img>
                      </div> :
            <div className="row">
              {/* Weekly News Area */}
              <div className="col-12 col-md-8">
                <div className="weekly-news-area mb-50">
                  {/* Section Heading */}
                  <div className="section-heading">
                    <h2>Phổ biến</h2>
                  </div>
                  {/* Featured Post Area */}

                  {/* Post Overlay */}

                  {this.state.postsAll.map((item, index) => {
                    if (index === 0) {
                      return (
                        <div key = {index}
                          className="featured-post-area bg-img bg-overlay mb-30"
                          style={{ backgroundImage: `url(${item.url})` }}
                        >
                          <div className="post-overlay">
                            <div className="post-meta">
                              <span
                                className={
                                  item.loai === 1
                                    ? "post-category cat-1"
                                    : "post-category cat-2"
                                }
                              >
                                {item.loai === 1 ? "Hoạt Động" : "Thông tin"}
                              </span>
                              <a href="#">
                                <i className="fa fa-clock" aria-hidden="true" />{" "}
                                &nbsp;
                                {item ? this.formatDay(item) : null}
                              </a>
                            </div>
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={() => this.onViewDetail(item._id)}
                              className="post-title"
                            >
                              {item.tieuDe}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    else{
                      return('');
                    }
                  })}

                  <div className="row">
                    {/* Single Post Area */}
                    {this.state.postsAll.map((item, index) => {

                      if (index !== 0) {
                        return (
                          <div key = {index} className="col-12 col-md-6">
                            <div className="razo-single-post d-flex mb-30">
                              {/* Post Thumbnail */}
                              <div className="post-thumbnail">
                                <img
                                  src={item.url}
                                  style={{ cursor: "pointer" }}
                                  alt = "true"
                                />
                              </div>
                              {/* Post Content */}
                              <div className="post-content">
                                <div className="post-meta">
                                  <span
                                    className={
                                      item.loai === 1
                                        ? "post-category cat-1"
                                        : "post-category cat-2"
                                    }
                                  >
                                    {item.loai === 1
                                      ? "Hoạt Động"
                                      : "Thông tin"}
                                  </span>
                                  <span className="post-date">
                                    <i className="far fa-clock" />
                                    &nbsp;{this.formatDay(item)}
                                  </span>
                                </div>
                                <span
                                  style={{ cursor: "pointer" }}
                                  onClick={() => this.onViewDetail(item._id)}
                                  className="post-title"
                                >
                                  {item.tieuDe}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      else{
                        return('');
                      }
                    })}
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Link to="/news">
                      <Button><span>Xem thêm</span></Button>
                    </Link>
                  </div>
                </div>
              </div>
              {/* Trending News Area */}
              <div className="col-12 col-md-4">
                <div className="trending-news-area mb-50">
                  {/* Section Heading */}
                  <div className="section-heading">
                    <h2>Nổi bật</h2>
                  </div>
                  {/* Featured Post Area */}

                  {/* Post Overlay */}
                  {this.state.postPin.map((item, index) => {
                    if (index === 0) {
                      return (
                        <div
                          className="featured-post-area small-featured-post bg-img bg-overlay mb-30"
                          style={{ backgroundImage: `url(${item.url})` }}
                        >
                          <div className="post-overlay">
                            <div className="post-meta">
                              <span
                                className={
                                  item.loai === 1
                                    ? "post-category cat-1"
                                    : "post-category cat-2"
                                }
                              >
                                {item.loai === 1 ? "Hoạt Động" : "Thông tin"}
                              </span>
                              <a href="#">
                                <i className="fa fa-clock" aria-hidden="true" />{" "}
                                &nbsp;
                                {item ? this.formatDay(item) : null}
                              </a>
                            </div>
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={() => this.onViewDetail(item._id)}
                              className="post-title"
                            >
                              {item.tieuDe}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    else{
                      return ('');
                    }
                  })}

                  {/* Single Post Area */}
                  {this.state.postPin.length === 0?
                  <div>Chưa có bài viết nào</div>:
                  this.state.postPin.map((item, index) => {
                    if (index !== 0) {
                      return (
                        <div className="razo-single-post d-flex mb-30">
                          {/* Post Thumbnail */}
                          <div className="post-thumbnail">
                            <a href="single-blog.html">
                              <img src="img/post-1.jpg" alt = "" />
                            </a>
                          </div>
                          {/* Post Content */}
                          <div className="post-content">
                            <div className="post-meta">
                              <span
                                className={
                                  item.loai === 1
                                    ? "post-category cat-1"
                                    : "post-category cat-2"
                                }
                              >
                                {item.loai === 1 ? "Hoạt Động" : "Thông tin"}
                              </span>
                              <span className="post-date">
                                <i className="far fa-clock" />
                                &nbsp;{this.formatDay(item)}
                              </span>
                            </div>
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={() => this.onViewDetail(item._id)}
                              className="post-title"
                            >
                              {item.tieuDe}
                            </span>
                          </div>
                        </div>
                      );
                              }
                              else{
                                return('');
                              }
                  })}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Link to="/news">
                      <Button>Xem thêm</Button>
                    </Link>
                  </div>
              
                  
                </div>
              </div>
            </div>
            }
          </div>
        </section>
                
        {/* Blog Area End */}
      </React.Fragment>
    );
  }
}

export default NewsHomepage;
