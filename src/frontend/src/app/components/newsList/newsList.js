import React from "react";
import "./newsList.css";
import { Button, ButtonGroup,  Row } from "react-bootstrap";
import Axios from "axios";
import Loader from "react-loader-spinner";
import { storage } from "../../firebase";
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
      isLoad: true,
      skip: 0,
      limit: 6,
      isFirst: true
    };
  }

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

    this.state.pinnedPosts.forEach(async (item, index) => {
      if(item.stamp){
      var rs = item.stamp + ".jpg";
      await storage
        .ref("news")
        .child(rs)
        .getDownloadURL()
        .then(url => {
          var tmp = this.state.pinnedPosts;
          tmp[index].url = url;
          this.setState({ pinnedPosts: tmp });
        });
      }
      else{
        var tmp = this.state.pinnedPosts;
        tmp[index].url = '/images/logo-hktn.jpg';
        this.setState({ pinnedPosts: tmp });
      }
    });

    return temp;
  };

  loadNews = async date => {
    var _post = [];
    var _postsActivity = [];
    var _postsNews = [];
    await Axios.post("/news/get-news", { data: date,skip: this.state.skip,limit: this.state.limit })
      .then(rs => {
        if (rs.status === 200) {
          rs.data.data.forEach(item => {
            _post.push(item);
            
            if (item.loai === 0) {
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
          isLoad: false,
          skip: this.state.skip + 6
        });
      });
  };

  componentDidMount  = async () =>{
    var date = new Date("2015-01-01"); //Ngaỳ mặc định
    await this.loadNews(date);
    await this.loadPinNews();
    this.loadImages();
  }
  onViewDetail = id => {
    // window.alert(id);
    var address = "/tin-tuc/chi-tiet?id=" + id;
    //console.log(address);
    window.open(address,'_blank');
  };

  newsFilter = type => {
    switch (type) {
      case 0: //Show tất cả tin tức
        this.setState({ filter: 0,isFirst: false  });
        break;
      case 1: //Show Thoong tin
        this.setState({ filter: 2,isFirst: false });
        break;
      case 2: //Show Hoat Dong
        this.setState({ filter: 1,isFirst: false });

        break;
      default:
        break;
    }
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
          pinnedPosts: _post,
          isLoad: false
        });
      });
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

    Axios.post("/news/get-news", { data: date,skip: this.state.skip,limit:this.state.limit })
      .then(rs => {
        if (rs.status === 200) {
          rs.data.data.forEach(item => {
            _post.push(item);
            if (item.loai === 0) {
              _postsNews.push(item);
            } else if (item.loai === 1) _postsActivity.push(item);
          });
        }
      })
      .then(() => {
        var posts = this.state.postsAll;
        var postsActivity = this.state.postsActivity;
        var postsNews = this.state.postsNews;
        _post.forEach(item => {
          posts.push(item);
        });
        _postsNews.forEach(item => {
          postsNews.push(item);
        });
        _postsActivity.forEach(item => {
          postsActivity.push(item);
        });
        this.setState({
          posts: posts,
          postsAll: posts,
          postsActivity: postsActivity,
          postsNews: postsNews,
          isLoad: false,
          skip: this.state.skip + 6
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
                        href="#"
                        className="post-img"
                        onClick={e => this.onViewDetail(item._id)}
                      >
                        <img alt = "true" style={{height: '400px',width: '100%'}} src={item.url} onError={(e)=>{e.target.onerror = null; e.target.src="/images/Logo-KHTN.jpg"}}/>
                      </a>
                      <div className="post-body" on>
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
                        className={this.state.isFirst?"section-all-hover active ":"section-all-hover"}
                      >
                        Tất cả
                      </Button>
                      <Button
                        onClick={e => this.newsFilter(2)}
                        variant="light"
                        className="section-news-hover"
                      >
                        Thông tin
                      </Button>
                      <Button
                        onClick={e => this.newsFilter(1)}
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
              {posts.map((item,index) => {
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
                  <div key ={index} className="col-md-4">
                    <div className="post">
                      <div
                        className="post-img"
                        onClick={e => this.onViewDetail(item._id)}
                      >

<img alt = "true" style={{height: '300px',width: '100%'}} src={item.url} onError={(e)=>{e.target.onerror = null; e.target.src="https://kenh14cdn.com/2019/3/21/photo-1-1553155372658221231913.jpg"}}/>
                      {/* <img style={{height: '300px',width: '100%'}} src={item.url} onerror='/images/Logo-KHTN.jpg' alt="Missing Image" /> */}
                      {/* <img style={{height: '300px',width: '100%'}} src={item.url?'/images/Logo-KHTN.jpg':item.url} alt /> */}
                      </div>
                      <div className="post-body">
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
