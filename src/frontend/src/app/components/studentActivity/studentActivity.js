import React from "react";
import IncomingStudentActivity from './incomingActivity'
import EndedStudentActivity from './endedActivity'
import "./../titleStudent/titleStudent.css";
import "./../tableStudentTextStyle/tableStudentTextStyle.css";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Tab, Tabs } from "react-bootstrap";
import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore
} from "react-toasts";
import refreshToken from "./../../../utils/refresh_token";

class StudentActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      incomingActivities: [],
      oldActivities: [],
      isLoad: true
    };
  }

  getActivities = async () => {
    this.setState({
      isLoad: true
    });

    await refreshToken();
    var secret = localStorage.getItem("secret");
    const decode = jwt_decode(secret);
    if(decode.user.profile){
      var id = decode.user.profile._id;
      //Lấy thông tin hoạt động
      var incomingActivities = [];
      var oldActivities = [];
      axios
        .post(`/student/my-upcoming-activities`, {
          id: id
        })
        .then(res => {
          if(res.data){
          console.log('-- res activity', res);
          if(res.status === 200){
            res.data.data.map(item => {
              var d = new Date(item.idHD.ngayBD);
              var today = new Date();
  
              if (d > today) {
                item.check = false;
                incomingActivities.push(item);
              } else {
                oldActivities.push(item);
              }
              return true;
            });
          }
      }
        
        })
        .then(() => {
          this.setState({
            incomingActivities: incomingActivities,
            oldActivities: oldActivities
          });
          this.setState({
            isLoad: false
          });
        }).catch(err => console.log(err));
    }
  };

  cancelRegister = async () => {
    // check hoạt động bắt buộc
    var isValid = true;
    var isEmpty = true;
    // && this.listOption[index] === false
    this.state.incomingActivities.map((item, index) => {
      if (item.idHD.batBuoc && item.check === true) {
        isValid = false;
        ToastsStore.error("Bạn không được phép hủy các hoạt động Bắt buộc");
      }
      if (item.check === true) {
        isEmpty = false;
      }
      return true;
    });

    if (isEmpty) {
      ToastsStore.warning("Vui lòng chọn ít nhất một hoạt động");
    }
    if (isValid && !isEmpty) {
      var data = [];

      data = this.state.incomingActivities.filter(obj => obj.check === true);

      await refreshToken();
      var secret = localStorage.getItem("secret");
      const decode = jwt_decode(secret);
      var id = decode.user.profile._id;

      var info = {
        activity: data,
        user: id
      };

      //Hủy Đăng ký tham gia hoạt động
      axios
        .post("/student/cancel-register-activities", {
          data: info
        })
        .then(res => {
          if (res.status === 201) {
            ToastsStore.success("Hủy thành công");
            //load lại danh sách hoạt động
            this.getActivities();
          } else {
            ToastsStore.warning("Hủy đăng ký không thành công");
          }
        });
    } else {
    }
  };

  selectCancelRegister = (item, index) => {
    var { incomingActivities } = this.state;
    var act = incomingActivities.map(obj => {
      if (obj._id === item._id) {
        obj.check = !obj.check;
        return obj;
      } else return obj;
    });

    this.setState({ incomingActivities: act });
  };

  refresh = () => {
    this.getActivities();
  };
  componentDidMount() {
    this.getActivities();
  }
  componentWillUpdate = (nextProps, nextState) => {};

  render() {
    return (
      <React.Fragment>
        <ToastsContainer
          position={ToastsContainerPosition.BOTTOM_CENTER}
          lightBackground
          store={ToastsStore}
        />
        <div >
          <h1 className="title-header" >HOẠT ĐỘNG CỦA BẠN</h1>
        </div>
        <div className='title-header-line'></div>
        <Tabs id="controlled-tab-example" defaultActiveKey="incoming">
          <Tab eventKey="incoming" title="Đang diễn ra">
            <IncomingStudentActivity />
          </Tab>
          <Tab eventKey="ended" title="Đã kết thúc">
            <EndedStudentActivity />
          </Tab>
        </Tabs>
      </React.Fragment>
    );
  }
}

export default StudentActivity;
