import React, { Component } from "react";
import { Table } from "react-bootstrap";
import MyButton from "../../../components/button/button";
import NewsEditor from "./newsEditor";
import Button from "./../../../components/button/button";
import "./news.css";
import Title from "../../../components/title/title";
import refreshToken from "../../../.././utils/refresh_token";
import Loader from "./../../../components/loader/loader";
import axios from "axios";

import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore
} from "react-toasts";

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditorModal: false,
      news: [],
      loading: false,
      typeEdit: undefined,
      selectedItem: undefined
    };
  }

  hideLogin = show => {
    this.setState({
      showEditorModal: show
    });
  };

  editorModal = (type, data) => {
    this.setState({
      showEditorModal: true
    });

    if (type === "add")
      this.setState({
        typeEdit: "add",
        selectedItem: undefined
      });
    else {
      this.setState({
        typeEdit: "edit",
        selectedItem: data
      });
    }
  };

  onViewDetail = id => {
    var address = "http://localhost:3000/news/detail?id=" + id;
    window.open(address, "_blank");
  };

  showPopupSuccess = val => {
    if (val === "update") {
      ToastsStore.success("Cập nhật thành công");
      this.getNews();
    } else if (val === "add") {
      ToastsStore.success("Thêm tin tức thành công");
      this.getNews();
    }
  };

  onDetete = async id => {
    await refreshToken();
    var secret = JSON.parse(localStorage.getItem("secret"));

    axios.defaults.headers["x-access-token"] = secret.access_token;
    axios.post("/manager/news/delete", { id: id }).then(res => {
      if (res.status === 201) {
        ToastsStore.success("Đã xóa");
        this.getNews();
      } else {
        ToastsStore.error("Xóa thất bại");
      }
    });
  };

  getNews = async () => {
    this.setState({
      loading: true
    });

    await refreshToken();
    var secret = JSON.parse(localStorage.getItem("secret"));
    axios.defaults.headers["x-access-token"] = secret.access_token;
    axios.get("/manager/news/get").then(res => {
      if (res.data.message === "succes") {
        console.log(res);
        this.setState({
          news: res.data.data,
          loading: false
        });
      }
    });
  };

  componentDidMount = async () => {
    this.getNews();
  };

  render() {
    return (
      <React.Fragment>
        <ToastsContainer
          position={ToastsContainerPosition.BOTTOM_CENTER}
          lightBackground
          store={ToastsStore}
        />
        <Loader loading={this.state.loading} />
        {this.state.showEditorModal && (
          <NewsEditor
            showPopup={this.showPopupSuccess}
            content={this.state.selectedItem}
            type={this.state.typeEdit}
            hideLogin={this.hideLogin}
          />
        )}
        <div>
          <Title>Quản lý bài viết</Title>
        </div>
        <div className={"content-body full"}>
          <div className="header-news-admin">
          <Button onClick = {e=>this.editorModal('add')} color="success">
            Thêm mới <i className="fas fa-plus" />
          </Button>
          </div>
          {this.state.news.length === 0 && !this.state.loading ? (
            <span>Bạn chưa có bài viết nào</span>
          ) : (
            <Table  bordered hover responsive size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tiêu đề</th>
                  <th>Loại</th>
                
                  <th>Lần chỉnh sửa cuối</th>
                  <th>Người tạo</th>
                  <th>Trạng thái</th>
                  <th>Ghim</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {this.state.news.map((item, index) => {
              
                  var dayEdit = new Date(item.ngayChinhSua);
                  var monthEdit = dayEdit.getMonth() + 1;
                  var formatDayEdit =
                    dayEdit.getDate() +
                    "/" +
                    monthEdit +
                    "/" +
                    dayEdit.getFullYear() +
                    " " +
                    dayEdit.getHours() +
                    ":" +
                    dayEdit.getMinutes() +
                    ":" +
                    dayEdit.getSeconds();
                  return (
                    <tr key={index}>
                      <td>{index}</td>
                      <td style = {{width:'250px'}}>{item.tieuDe}</td>
                      <td>{item.loai === "1"?"Hoạt động":"Thông tin"}</td>
                   
                      <td>{formatDayEdit}</td>
                      <td>{item.hoTen}</td>
                      <td
                        className={
                          item.trangThai === 1
                            ? "news-status-public"
                            : "news-status-private"
                        }
                      >
                        {item.trangThai === 1 ? "Công khai" : "Riêng tư"}
                      </td>
                      <td className ='news-status-public'>{item.ghim===1?"Có":""}</td>
                      <td>
                      <MyButton
                          color={"success"}
                          style={{ marginRight: "15px" }}
                          onClick={() => this.onViewDetail(item._id)}
                        >
                          <i className="far fa-eye" />
                        </MyButton>
                        <MyButton
                          color={"warning"}
                          style={{ marginRight: "15px" }}
                          onClick={() => this.editorModal("edit", item)}
                        >
                          <i className="fas fa-edit" />
                        </MyButton>
                      
                        <MyButton
                          color={"danger"}
                          style={{ marginRight: "15px" }}
                          onClick={() => this.onDetete(item._id)}
                        >
                          <i className=" fas fa-trash-alt" />
                        </MyButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default News;
