import React, { Component } from "react";
import { Table, Row, Col } from "react-bootstrap";
import axios from "axios";
import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore
} from "react-toasts";

import Input from './../../../components/input/input'
import MyButton from "../../../components/button/button";
import NewsEditor from "./newsEditor";
import Button from "./../../../components/button/button";
import "./news.css";
import Title from "../../../components/title/title";
import refreshToken from "../../../.././utils/refresh_token";
import Loader from "./../../../components/loader/loader";
import MyPagination from "./../../../components/pagination/pagination";
import Select from './../../../components/selectOption/select'
import Confirm from './../../../components/confirm/confirm'


class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageActive: 1,
      totalPages: 1,
      limit: 10,
      showEditorModal: false,
      news: [],
      loading: false,
      typeEdit: undefined,
      selectedItem: undefined,
      type: -1,
      showDelete: false,
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
    // window.alert(id);
    var address = "/news/detail?id=" + id;
    //console.log(address);
    window.open(address,'_blank');
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

  onDetete = async (id) => {
    this.setState({showDelete: true,selectedItem: id});
  };

  getNews = async () => {
    this.setState({
      loading: true
    });

    await refreshToken();
    const options = {
      query: this.state.query,
      skip: (this.state.pageActive - 1) * this.state.limit,
      limit: this.state.limit,
      type: parseInt(this.state.type)
    };
    var secret = JSON.parse(localStorage.getItem("secret"));
    axios.defaults.headers["x-access-token"] = secret.access_token;
    axios.post("/manager/news/get", { options: options }).then(res => {
      if (res.data.message === "succes") {
        this.setState({
          news: res.data.data,
          loading: false,
          totalPages: res.data.totalPages
        });
      }
    });
  };

  handleClose = () =>{
    this.setState({showDelete:false})
  }

  clickPage = e => {
    this.setState({ pageActive: e });
    this.getNews();
  };

  componentDidMount = async () => {
    this.getNews();
  };

  getValue = (key, val) => {
    this.setState({ [key] : val})
  }

  handleSave = async () =>{
  await refreshToken();
    var secret = JSON.parse(localStorage.getItem("secret"));

    axios.defaults.headers["x-access-token"] = secret.access_token;
    axios.post("/manager/news/delete", { id: this.state.selectedItem }).then(res => {
      if (res.status === 202) {
        ToastsStore.success("Đã xóa");
        this.handleClose();
        this.getNews();

      } else {
        ToastsStore.error("Xóa thất bại");
      }
    });
  }


  render() {
    var type = [
      {value: -1, label: 'Tất cả'},
      {value: 0, label: 'Thông tin'},
      {value: 1, label: 'Hoạt động'},
    ]
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
        <Confirm 
					show={this.state.showDelete}
					title={'Xóa bài viết'}
					content={'Bạn có muốn xóa bài viết này !'}
					handleClose={() => this.handleClose()}
					handleSave={() => this.handleSave()}
				/>
        <div>
          <Title>Quản lý bài viết</Title>
        </div>
        <div className={"content-body full"}>
          <Row className={'m-b-10'}>
              <Col>
                <span> Tài khoản </span>
                <Input 
                  placeholder={'Tìm kiếm'} 
                  getValue={ (obj) => this.getValue('query', obj.value)}
                  onKeyPress={ (e) => {if(e.key === 'Enter') this.getNews()}}
                />
              </Col>
              <Col md={3} xs={12}>
                <span> Loại bài </span>
                <Select 
                  options={type} 
                  value={this.state.type} 
                  selected={val => this.getValue('type',val)} 
                />
              </Col>
              <Col md={2} xs={12}>
                <div>&nbsp;</div>
                <Button title={'Tìm kiếm'} style={{padding: '7px 15px'}} onClick={this.getNews}><i className="fas fa-search" /></Button>
              </Col>
            </Row>  
          <div className="header-news-admin">
          <Button 
            title={'Thêm mới'} color={'warning'} 
            onClick={ e =>this.editorModal('add')} 
            style={{padding: '5px 20px'}}
          > 
                <i className="fas fa-plus"/>
          </Button>
          </div>
          {this.state.news.length === 0 && !this.state.loading ? (
            <span>Bạn chưa có bài viết nào</span>
          ) : (
            <Table bordered hover responsive size="sm">
              <thead className="title-table">
                <tr>
                  <th>STT</th>
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
                  var formatDayEdit = dayEdit.getDate() + "/"
                      + monthEdit + "/" + dayEdit.getFullYear()
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td style = {{width:'250px'}}>{item.tieuDe}</td>
                      <td>{item.loai === 1 ? "Hoạt động":"Thông tin"}</td>
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
                      <td style={{textAlign: 'center'}}>
                        <MyButton
                            color={"primary"}
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
          <Row>
              <Col md={3} className={'page-input'}>
              <label style={{marginRight:'3px'}}>Trang</label>
                <Input width='50px' textAlign='center' value={this.state.pageActive}/>
                <label style={{marginLeft:'3px'}}>trong {Math.ceil(this.state.totalPages)}</label>
              </Col>
              <Col md={9}>
                <div className={'is-pagination'}>
                  <MyPagination
                    page={this.state.pageActive}
                    totalPages={this.state.totalPages}
                    clickPage={this.clickPage}/>
                </div>
              </Col>
            </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default News;
