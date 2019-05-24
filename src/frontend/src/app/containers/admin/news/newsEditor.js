import React, { Component } from "react";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { Modal, Button, FormControl, Col, Row } from "react-bootstrap";
import draftToHtml from "draftjs-to-html";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Input from "./../../../components/input/input";
import axios from "axios";
import jwt_decode from "jwt-decode";
import refreshToken from "../../../.././utils/refresh_token";
import Checkbox from "./../../../components/checkbox/checkbox";
import MySelectOption from "./../../../components/selectOption/select";
import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore
} from "react-toasts";
import ImageUploader from "react-images-upload";
import { storage } from "../../../firebase";

var loai = 0; //Mac dinh
class EditorConvertToHTML extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      title: "",
      body: undefined,
      editorState: undefined,
      idNews: undefined,
      check: true,
      isFirst: true,
      pin: false,
      sendEmail: false,
      loai: 0,
      typeOptions: [
        { value: 0, label: "Thông Tin" },
        { value: 1, label: "Hoạt Động" }
      ],
      pictures: []
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

    if (!this.state.title || value1.blocks[0].text === "") {
      ToastsStore.warning("Tiêu đề hoặc nội dung không được để trống!");
    } else {
      var stamp = new Date();
      var data = {
        dateCreated: new Date(),
        dateModified: new Date(),
        title: this.state.title,
        content: value,
        author: decode.user.profile.idTaiKhoan,
        trangThai: this.state.check === true ? 1 : 0,
        ghim: this.state.pin === true ? 1 : 0,
        loai: this.state.loai
      };

      if (this.state.pictures.length > 0) {
        data.stamp = stamp.getTime();
      }

      axios.defaults.headers["x-access-token"] = secret.access_token;
      axios.post("/manager/news/add", { data: data }).then(res => {
        if (res.status === 202) {
          const { pictures } = this.state;
          if (pictures.length > 0) {
            var name = data.stamp + ".jpg";
            const uploadTask = storage.ref(`news/${name}`).put(pictures[0]);
            uploadTask.on(
              "state_changed",
              snapshot => {
                //progress function
              },
              error => {
                //error function
              },
              () => {
                //complete function
                storage
                  .ref("news")
                  .child(name)
                  .getDownloadURL()
                  .then(url => {              
                  });
              }
            );
          }  
          this.props.showPopup("add");
          this.handleClose();
        } else {
          ToastsStore.error("Thêm tin tức thất bại");
        }
      });
    }
  };

  kindSelected = value => {
    this.setState({ loai: value }, () => {});
  };

  editNews = async () => {
    await refreshToken();
    var secret = JSON.parse(localStorage.getItem("secret"));

    var value = draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );

    var data = {
      tieuDe: this.state.title,
      noiDung: value,
      id: this.state.idNews,
      trangThai: this.state.check === true ? 1 : 0,
      ghim: this.state.pin === true ? 1 : 0,
      loai: parseInt(this.state.loai) === 1 ? 1 : 0
    };

    //window.alert(data.loai);
    axios.defaults.headers["x-access-token"] = secret.access_token;
    axios.post("/manager/news/update", { data: data }).then(res => {
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
        this.setState(
          {
            editorState: EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(content.noiDung)
              )
            ),
            title: content.tieuDe,
            idNews: content._id,
            check: content.trangThai === 1 ? true : false,
            pin: content.ghim === 1 ? true : false,
            //TODO: checkbox chưa thay đổi theo state
            loai: parseInt(content.loai)
          },
          () => {}
        );
      }
    }
  }
  changeStatus = e => {
    this.setState({
      check: e.chk
    });
  };

  changePin = e => {
    this.setState({
      pin: e.chk
    });
  };

  changeSendEmail = e => {
    this.setState({
      sendEmail: e.chk
    });
  };

  onDrop = picture => {
    this.setState({
      pictures: this.state.pictures.concat(picture)
    });
  };

  render() {
    var type = this.props.type;

    if (type === "edit" && this.state.isFirst) {
      loai = this.props.content.loai;
    }
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
          <Row style={{ marginTop: "10px" }}>
            <Col sm={1}>
              <span>Loại:</span>
            </Col>
            <Col sm={3}>
              <MySelectOption
                value={loai}
                options={this.state.typeOptions}
                selected={this.kindSelected}
              />
            </Col>
          </Row>
          <Checkbox
            isCheck={this.changeStatus}
            check={this.state.check}
            label="Hiện thị lên bảng tin"
            name={"hienThi"}
          />
          <Checkbox
            defaultChecked={this.state.pin}
            isCheck={this.changePin}
            check={this.state.pin}
            label="Ghim bài viết (Hiển thị tối đa 2)"
            name={"ghim"}
          />
          <ImageUploader
            withIcon={true}
            buttonText="Choose images"
            onChange={this.onDrop}
            singleImage={true}
            withPreview={true}
            imgExtension={[".jpg", ".gif", ".png", ".gif"]}
            maxFileSize={5242880}
          />
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
