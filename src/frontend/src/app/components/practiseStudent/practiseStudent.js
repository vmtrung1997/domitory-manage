import React from "react";
import { Table } from "react-bootstrap";
import "./../titleStudent/titleStudent.css";
import "./../tableStudentTextStyle/tableStudentTextStyle.css";
import Axios from "axios";
import { connect } from "react-redux";
import refreshToken from "./../../../utils/refresh_token";
import jwt_decode from "jwt-decode";

class PractiseStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      point: []
    };
  }

  getPoint = async () => {
    await refreshToken();
    var secret = localStorage.getItem("secret");

    if (secret) {
      const decode = jwt_decode(secret);
      secret = JSON.parse(secret);
      if (decode.user.profile) {
        var id = decode.user.profile._id;
        Axios.post("/student/get-point", {
          id: id,
          ngayVaoO: decode.user.profile.ngayVaoO
        }).then(rs => {
          var point = [];
          rs.data.data.forEach(item => {
            this.setState({ point: {hk1: item.hk1, hk2: item.hk2}});
          });

         
        });
      }
    }
  };

  componentDidMount() {
    this.getPoint();
  }

  render() {
    return (
      <React.Fragment>
        <div className = 'padding-menu'>
          <div>
          <h1 className="title-header">ĐIỂM HOẠT ĐỘNG</h1>
        </div>
        <div className="title-header-line" />

        <div className="time-bill">
          <div className="text-style">
            <Table responsive bordered size="sm" hover>
              <thead className="thread-student">
                <tr>
                  <th>Học kỳ</th>
                  <th>Điểm</th>
                  {/* <th>Chi tiết</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                <td>Học kỳ 1</td>
                  <td>
                    {this.state.point.hk1}
                  </td>
                
                  {/* <td><Detail></Detail></td> */}
                </tr>
                <tr>
                <td>Học kỳ 2</td>
                  <td>
                   {this.state.point.hk2}
                  </td>
                
                  {/* <td><Detail></Detail></td> */}
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
        </div>
      </React.Fragment>
    );
  }
}

var mapStateToProps = state => {
  return {
    userProfile: state.userProfile
  };
};

export default connect(mapStateToProps)(PractiseStudent);
