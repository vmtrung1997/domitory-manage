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
        <section className="razo-blog-area section-padding-80-0">
          <div className="container">
            <div className="row">
              {/* Weekly News Area */}
              <div className="col-12 col-md-8">
                <div className="weekly-news-area mb-50">
                  {/* Section Heading */}
                  <div className="section-heading">
                    <h2>Blog New</h2>
                  </div>
                  {/* Featured Post Area */}
                  <div
                    className="featured-post-area bg-img bg-overlay mb-30"
                    style={{ backgroundImage: "url(img/post-1.jpg)" }}
                  >
                    {/* Post Overlay */}
                    <div className="post-overlay">
                      <div className="post-meta">
                        <a href="#">
                          <i className="fa fa-comments-o" aria-hidden="true" />{" "}
                          2.1k
                        </a>
                        <a href="#">
                          <i className="fa fa-eye" aria-hidden="true" /> 3.6k
                        </a>
                      </div>
                      <a href="single-blog.html" className="post-title">
                        The light and music exposition hits los angeles in the
                        fashion week
                      </a>
                    </div>
                  </div>
                  <div className="row">
                    {/* Single Post Area */}
                    <div className="col-12 col-md-6">
                      <div className="razo-single-post d-flex mb-30">
                        {/* Post Thumbnail */}
                        <div className="post-thumbnail">
                          <a href="single-blog.html">
                            <img src="img/post-1.jpg" alt />
                          </a>
                        </div>
                        {/* Post Content */}
                        <div className="post-content">
                          <div className="post-meta">
                            <a href="#">
                              <i
                                className="fa fa-comments-o"
                                aria-hidden="true"
                              />{" "}
                              2.1k
                            </a>
                            <a href="#">
                              <i className="fa fa-eye" aria-hidden="true" />{" "}
                              3.6k
                            </a>
                          </div>
                          <a href="single-blog.html" className="post-title">
                            Drug bust leads police to underground tunnel
                          </a>
                        </div>
                      </div>
                    </div>
                    {/* Single Post Area */}
                    <div className="col-12 col-md-6">
                      <div className="razo-single-post d-flex mb-30">
                        {/* Post Thumbnail */}
                        <div className="post-thumbnail">
                          <a href="single-blog.html">
                            <img src="img/post-1.jpg" alt />
                          </a>
                        </div>
                        {/* Post Content */}
                        <div className="post-content">
                          <div className="post-meta">
                            <a href="#">
                              <i
                                className="fa fa-comments-o"
                                aria-hidden="true"
                              />{" "}
                              2.1k
                            </a>
                            <a href="#">
                              <i className="fa fa-eye" aria-hidden="true" />{" "}
                              3.6k
                            </a>
                          </div>
                          <a href="single-blog.html" className="post-title">
                            Hear abuse victims' messages for the Pope
                          </a>
                        </div>
                      </div>
                    </div>
                    {/* Single Post Area */}
                    <div className="col-12 col-md-6">
                      <div className="razo-single-post d-flex mb-30">
                        {/* Post Thumbnail */}
                        <div className="post-thumbnail">
                          <a href="single-blog.html">
                            <img src="img/post-1.jpg" alt />
                          </a>
                        </div>
                        {/* Post Content */}
                        <div className="post-content">
                          <div className="post-meta">
                            <a href="#">
                              <i
                                className="fa fa-comments-o"
                                aria-hidden="true"
                              />{" "}
                              2.1k
                            </a>
                            <a href="#">
                              <i className="fa fa-eye" aria-hidden="true" />{" "}
                              3.6k
                            </a>
                          </div>
                          <a href="single-blog.html" className="post-title">
                            New Mexico uspects' attorneys file to have all
                          </a>
                        </div>
                      </div>
                    </div>
                    {/* Single Post Area */}
                    <div className="col-12 col-md-6">
                      <div className="razo-single-post d-flex mb-30">
                        {/* Post Thumbnail */}
                        <div className="post-thumbnail">
                          <a href="single-blog.html">
                            <img src="img/post-1.jpg" alt />
                          </a>
                        </div>
                        {/* Post Content */}
                        <div className="post-content">
                          <div className="post-meta">
                            <a href="#">
                              <i
                                className="fa fa-comments-o"
                                aria-hidden="true"
                              />{" "}
                              2.1k
                            </a>
                            <a href="#">
                              <i className="fa fa-eye" aria-hidden="true" />{" "}
                              3.6k
                            </a>
                          </div>
                          <a href="single-blog.html" className="post-title">
                            Trump tweets false white supremacist talking
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Trending News Area */}
              <div className="col-12 col-md-4">
                <div className="trending-news-area mb-50">
                  {/* Section Heading */}
                  <div className="section-heading">
                    <h2>Trending</h2>
                  </div>
                  {/* Featured Post Area */}
                  <div
                    className="featured-post-area small-featured-post bg-img bg-overlay mb-30"
                    style={{ backgroundImage: "url(img/post-1.jpg)" }}
                  >
                    {/* Post Overlay */}
                    <div className="post-overlay">
                      <div className="post-meta">
                        <a href="#">
                          <i className="fa fa-comments-o" aria-hidden="true" />{" "}
                          2.1k
                        </a>
                        <a href="#">
                          <i className="fa fa-eye" aria-hidden="true" /> 3.6k
                        </a>
                      </div>
                      <a href="single-blog.html" className="post-title">
                        Hawaii braces for Hurricane Lane
                      </a>
                    </div>
                  </div>
                  {/* Single Post Area */}
                  <div className="razo-single-post d-flex mb-30">
                    {/* Post Thumbnail */}
                    <div className="post-thumbnail">
                      <a href="single-blog.html">
                        <img src="img/post-1.jpg" alt />
                      </a>
                    </div>
                    {/* Post Content */}
                    <div className="post-content">
                      <div className="post-meta">
                        <a href="#">
                          <i className="fa fa-comments-o" aria-hidden="true" />{" "}
                          2.1k
                        </a>
                        <a href="#">
                          <i className="fa fa-eye" aria-hidden="true" /> 3.6k
                        </a>
                      </div>
                      <a href="single-blog.html" className="post-title">
                        Hurricane Lane brings 19 inches of rain
                      </a>
                    </div>
                  </div>
                  {/* Single Post Area */}
                  <div className="razo-single-post d-flex mb-30">
                    {/* Post Thumbnail */}
                    <div className="post-thumbnail">
                      <a href="single-blog.html">
                        <img src="img/post-1.jpg" alt />
                      </a>
                    </div>
                    {/* Post Content */}
                    <div className="post-content">
                      <div className="post-meta">
                        <a href="#">
                          <i className="fa fa-comments-o" aria-hidden="true" />{" "}
                          2.1k
                        </a>
                        <a href="#">
                          <i className="fa fa-eye" aria-hidden="true" /> 3.6k
                        </a>
                      </div>
                      <a href="single-blog.html" className="post-title">
                        What these victims want the Pope to know
                      </a>
                    </div>
                  </div>
                  {/* Single Post Area */}
                  <div className="razo-single-post d-flex mb-30">
                    {/* Post Thumbnail */}
                    <div className="post-thumbnail">
                      <a href="single-blog.html">
                        <img src="img/post-1.jpg" alt />
                      </a>
                    </div>
                    {/* Post Content */}
                    <div className="post-content">
                      <div className="post-meta">
                        <a href="#">
                          <i className="fa fa-comments-o" aria-hidden="true" />{" "}
                          2.1k
                        </a>
                        <a href="#">
                          <i className="fa fa-eye" aria-hidden="true" /> 3.6k
                        </a>
                      </div>
                      <a href="single-blog.html" className="post-title">
                        What happens if you don't have a will?
                      </a>
                    </div>
                  </div>
                  {/* Single Post Area */}
                  <div className="razo-single-post d-flex mb-30">
                    {/* Post Thumbnail */}
                    <div className="post-thumbnail">
                      <a href="single-blog.html">
                        <img src="img/post-1.jpg" alt />
                      </a>
                    </div>
                    {/* Post Content */}
                    <div className="post-content">
                      <div className="post-meta">
                        <a href="#">
                          <i className="fa fa-comments-o" aria-hidden="true" />{" "}
                          2.1k
                        </a>
                        <a href="#">
                          <i className="fa fa-eye" aria-hidden="true" /> 3.6k
                        </a>
                      </div>
                      <a href="single-blog.html" className="post-title">
                        Giuliani: No reason for Trump impeachment
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Blog Area End */}
      </React.Fragment>
    );
  }
}

export default NewsHomepage;
