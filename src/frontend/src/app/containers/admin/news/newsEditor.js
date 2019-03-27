import React, { Component } from "react";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { Modal, Button, FormControl } from "react-bootstrap";
import draftToHtml from "draftjs-to-html";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Input from "./../../../components/input/input";
import jwt_decode from "jwt-decode";
import axios from "axios";
import refreshToken from "../../../.././utils/refresh_token";
import Checkbox from './../../../components/checkbox/checkbox'
import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore
} from "react-toasts";

class EditorConvertToHTML extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      title: '',
      body: undefined,
      editorState: undefined,
      idNews: undefined,
      check: true,
    };
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState: editorState
    });
  };

  handleClose = () => {
    this.setState({ show: false });
    this.props.hideLogin(false);
  };

  getTitle = e => {
    console.log(e.value);
    this.setState({
      title: e.value
    });
  };

  addNews = async () => {
    await refreshToken();
    var secret = JSON.parse(localStorage.getItem("secret"));
    const decode = jwt_decode(secret.access_token);

    var value = draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );

    var value1 = convertToRaw(this.state.editorState.getCurrentContent());

    console.log(value1.blocks[0].text);
    console.log(this.state.title);

    if (!this.state.title || value1.blocks[0].text === "") {
      ToastsStore.warning("Tiêu đề hoặc nội dung không được để trống!");
    } else {
      var data = {
        dateCreated: new Date(),
        dateModified: new Date(),
        title: this.state.title,
        content: value,
        author: decode.user.profile.idTaiKhoan,
        trangThai: this.state.check===true?'1':'0'
      };
      axios.defaults.headers["x-access-token"] = secret.access_token;
      axios.post("/manager/news/add", { data: data }).then(res => {
        if (res.status === 201) {
          this.props.showPopup("add");
          this.handleClose();
        } else {
          ToastsStore.error("Thêm tin tức thất bại");
        }
      });
    }
  };

  editNews = async () => {
    await refreshToken();
    var secret = JSON.parse(localStorage.getItem("secret"));
    const decode = jwt_decode(secret.access_token);

    var value = draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );

    var data = {
      tieuDe: this.state.title,
      noiDung: value,
      id: this.state.idNews,
      trangThai: this.state.check===true?'1':'0'
    };

    axios.defaults.headers["x-access-token"] = secret.access_token;
    axios.post("/manager/news/update", { data: data }).then(res => {
      console.log("1");
      if (res.status === 200) {
        this.props.showPopup("update");
        this.handleClose();
      } else {
        ToastsStore.error("Cập nhật thất bại");
      }
    });
  };
  componentDidMount() {
    var type = this.props.type;
    var content = this.props.content;

    if (type === "add") {
      this.setState({
        editorState: EditorState.createEmpty()
      });
    } else if (type === "edit") {
      if (content.noiDung) {
        this.setState({
          editorState: EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(content.noiDung))
          ),
          title: content.tieuDe,
          idNews: content._id,
          check: content.trangThai===1?true:false
        });
      } else {
        // this.setState({
        //   editorState: EditorState.createEmpty()
        // });
      }
    }
  }
  changeStatus = (e) =>{
    this.setState({
      check: e.chk
    })
    console.log(this.state.check)
  }
  render() {
    var type = this.props.type;
    var content = this.props.content;
    console.log(content)
    const { editorState } = this.state;
    const editorStyle = {
      padding: "5px",
      height: "400px",
      width: "100%",
      backgroundColor: "white"
    };

    return (
      <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
        <ToastsContainer
          position={ToastsContainerPosition.BOTTOM_CENTER}
          lightBackground
          store={ToastsStore}
        />
        <Modal.Header closeButton>
          <Modal.Title>
            {type === "add" ? "Thêm bài viết" : "Sửa bài viết"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Input
            getValue={this.getTitle}
            style={{ marginBottom: "20px" }}
            placeholder="Nhập tiêu đề bài viết ..."
            value={this.state.title}
          />
          <Editor
            editorState={this.state.editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            editorStyle={editorStyle}
            toolbar={{
              list: { inDropdown: true },
              link: { inDropdown: true }
            }}
            value={""}
            onEditorStateChange={this.onEditorStateChange}
          />
          <Checkbox isCheck={this.changeStatus} check={this.state.check} label ='Hiện thị lên bảng tin' name={'hienThi'} ></Checkbox>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={type === "add" ? this.addNews : this.editNews}
          >
            {type === "add" ? "Thêm bài viết" : "Cập nhật bài viết"}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EditorConvertToHTML;
