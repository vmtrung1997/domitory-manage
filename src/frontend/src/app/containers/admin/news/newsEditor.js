import React, { Component } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { Modal, Button, FormControl } from "react-bootstrap";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Input from "./../../../components/input/input";
import jwt_decode from "jwt-decode";
import axios from "axios";
import refreshToken from '../../../.././utils/refresh_token'
class EditorConvertToHTML extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      title: undefined,
      body: undefined,
      editorState: EditorState.createEmpty()
    };
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
  };

  handleClose = () => {
    this.setState({ show: false });
    this.props.hideLogin(false);
  };

  getTitle = e => {
    this.setState({
      title: e.value
    });
  };

  addNew = async () => {
    await refreshToken();
    var secret = JSON.parse(localStorage.getItem("secret"));
    const decode = jwt_decode(secret.access_token);

    console.log(decode.user.profile.idTaiKhoan);
    var value = draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
    var data = {
      dateCreated: new Date(),
      title: this.state.title,
      content: value,
      author: decode.user.profile.idTaiKhoan
    };

    axios.defaults.headers["x-access-token"] = secret.access_token;
    axios.post("/manager/news/add", { data: data }).then(res => {
      if (res.status === 201) {
        window.alert("ok");
      } else {
        window.alert("fail");
      }
    });

    console.log(data);
  };

  render() {
    const { editorState } = this.state;
    const editorStyle = {
      padding: "5px",
      height: "300px",
      width: "100%",
      backgroundColor: "white"
    };

    return (
      <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Input
            getValue={this.getTitle}
            style={{ marginBottom: "20px" }}
            placeholder="Nhập tiêu đề bài viết ..."
          />
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            editorStyle={editorStyle}
            toolbar={{
              list: { inDropdown: true },
              link: { inDropdown: true }
            }}
            onEditorStateChange={this.onEditorStateChange}
          />
          <textarea
            disabled
            value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={this.addNew}>
            Thêm bài viết
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EditorConvertToHTML;
