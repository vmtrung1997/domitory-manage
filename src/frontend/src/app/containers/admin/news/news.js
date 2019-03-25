import React, { Component } from "react";
import { Table } from "react-bootstrap";
import MyButton from "../../../components/button/button";
import { Button } from "react-bootstrap";
import NewsEditor from "./newsEditor";
import "./news.css";
import Title from "../../../components/title/title";
class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditorModal: false
    };
  }

  hideLogin = show => {
    this.setState({
      showEditorModal: show
    });
  };

  editorModal = () =>{
    this.setState({
      showEditorModal: true
    })
  }

  render() {
    return (
      <React.Fragment>
        {this.state.showEditorModal && <NewsEditor hideLogin={this.hideLogin} />}
        <div>
          <Title>Quản lý bài viết</Title>
        </div>
        <div />
        <div className="header-news-admin">
          <Button onClick = {this.editorModal} variant="success">
            Thêm mới <i className="fas fa-plus" />
          </Button>
        </div>
        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Tiêu đề</th>
              <th>Ngaỳ tạo</th>
              <th>Nội dung</th>
              <th>Người tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>3</td>
              <td>Table cell</td>
              <td>Table cell</td>
              <td>Table cell</td>
              <td>Table cell</td>
              <td>
                <MyButton
                  color={"warning"}
                  style={{ marginRight: "15px" }}
                  //onClick={() => this.onViewDetail(info)}
                >
                  <i className="fas fa-edit" />
                </MyButton>
                <MyButton
                  color={"success"}
                  style={{ marginRight: "15px" }}
                  //onClick={() => this.onViewDetail(info)}
                >
                  <i className="far fa-eye" />
                </MyButton>
              </td>
            </tr>
          </tbody>
        </Table>
        ;
      </React.Fragment>
    );
  }
}

export default News;
