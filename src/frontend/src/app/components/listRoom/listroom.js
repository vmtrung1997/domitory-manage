import {Tab, Table, Tabs} from "react-bootstrap";
import React from "react";
import Button from "../button/button";
import './styles.css';
import {Link} from "react-router-dom";
import refreshToken from "../../../utils/refresh_token";
import axios from "axios";

export default class ListRoom extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      data: this.props.data,
      onClick: () => {}
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({ data: nextProps.data })
  }

  chooseRoom = async(room) => {
    await refreshToken();
    let secret = JSON.parse(localStorage.getItem('secret'));
    axios.get(`/manager/infoDormitory/getPersonInRoom/` + room._id
      ,{  headers: { 'x-access-token': secret.access_token } }
    ).then(result => {
      this.setState({
        listPerson: result.data.length === 0 ? undefined : result.data,
        roomActiveGender: room.gioiTinh ? 'Phòng: Nam' : 'Phòng: Nữ'
      });
      if(result.data.length === 0)
        this.setState({
          messRoomDetail: 'Phòng trống'
        })
    }).catch(err => {});
    this.props.onClick(room);
  };
  render(){
    console.log('==data listroom', this.state)
    const { data } = this.state;
    return(
      <Tabs id="controlled-tab-example" defaultActiveKey={data && 'Lầu ' + data[0].floor}>
        {data && data.map(floor => {
          return(
            <Tab
              eventKey={'Lầu ' + floor.floor}
              title={'Lầu ' + floor.floor}
            >
              <div className={'list-room_box'}>
              {floor && floor.rooms.map(room => {
                if((room.loaiPhong.loai === 0) || (room.loaiPhong.loai === 1)) {
                  console.log('==room sv, dv');
                  let isFull = false;
                  let isActive = false;
                  if ((room.soNguoiToiDa - room.soNguoi) === 0)
                    isFull = true;
                  if (this.props.active && (room._id === this.props.active._id))
                    isActive = true;
                  return (
                    <div className={'room-box'}>
                      <Button
                        shadow
                        variant={isActive ? 'default' : 'outline'}
                        color={room.loaiPhong.loai ? 'success' : 'primary'}
                        onClick={() => this.chooseRoom(room)}
                        disabled={isFull}
                      >
                        <i className="fas fa-home"/>
                        {room.tenPhong} ({room.soNguoi}/{room.soNguoiToiDa})
                      </Button>
                    </div>
                  )
                }
              })}

              </div>
              {/*detail of room*/}
              <div className={'room-detail'}>
                <p className={'room-gender'}><b>{this.state.roomActiveGender}</b></p>
                {this.state.listPerson ?
                  <Table responsive bordered size="sm">
                    <thead>
                    <tr style={{textAlign: 'center'}}>
                      <th>STT</th>
                      <th>MSSV</th>
                      <th>Họ tên</th>
                      <th>Trường</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.listPerson && this.state.listPerson.map((person, index) => {
                      return(
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{person.MSSV}</td>
                          <td><Link to={`/admin/student/detail/${person.MSSV}`}>{person.hoTen}</Link></td>
                          <td>{person.truong && person.truong.tenTruong}</td>
                        </tr>
                      )
                    })}

                    </tbody>
                  </Table>
                  :
                  <span className={'messDanger'}><b>{this.state.messRoomDetail}</b></span>
                }
              </div>
            </Tab>
          )
        })}
      </Tabs>
    )
  }
}