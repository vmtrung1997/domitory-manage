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
    const { data } = this.state;
    if(Object.entries(data).length === 0 && data.constructor === Object)
      return(
        <p className={'messDanger'}>Có lỗi</p>
      );
    else
      return(
        <Tabs id="controlled-tab-example" defaultActiveKey={data && 'Lầu ' + data[0].floor}>
          {data && data.map(floor => {
            return(
              <Tab
                eventKey={'Lầu ' + floor.floor}
                title={'Lầu ' + floor.floor}
              >
                <div className={'list-room_box'}>
                {floor && floor.rooms.map((room, index) => {
                    let color;
                    let isFull = false;
                    let isActive = false;
                    if ((room.soNguoiToiDa - room.soNguoi) === 0)
                      isFull = true;
                    if (this.props.active && (room._id === this.props.active._id))
                      isActive = true;
                    switch(room.loaiPhong.loai){
                      case 0:
                        color = 'success';
                        break;
                      case 1:
                        color = 'primary';
                        break;
                      case 2:
                        color = 'warning'
                    }
                    return (
                      <div className={'room-box'} key={index}>
                        <Button
                          shadow
                          variant={isActive ? 'default' : 'outline'}
                          color={color}
                          onClick={() => this.chooseRoom(room)}
                          disabled={isFull}
                          style={{fontSize: '20px', margin: '5px 0', minWidth: '138px'}}
                        >
                          { room.gioiTinh === 0 ? 
                            <i style={{fontSize: '25px', margin: '0 5px'}} className="fas fa-female"/>
                          :
                            <i style={{fontSize: '25px', margin: '0 5px'}} className="fas fa-male"/>}
                          {room.tenPhong} ({room.soNguoi}/{room.soNguoiToiDa})
                        </Button>
                      </div>
                    )
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