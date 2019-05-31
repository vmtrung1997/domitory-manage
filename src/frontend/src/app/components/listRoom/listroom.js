import {Tab, Tabs} from "react-bootstrap";
import React from "react";
import Button from "../button/button";
import './styles.css';

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

  chooseRoom = (room) => {

    this.props.onClick(room);
  }
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
                if((room.loaiPhong.loai === 0) || (room.loaiPhong.loai === 1)){
                  let isFull = false;
                  let isActive = false;
                  if((room.soNguoiToiDa - room.soNguoi) === 0)
                    isFull = true
                  if(this.props.active && (room._id === this.props.active._id))
                    isActive = true
                  return(
                    <div className={'room-box'}>
                    <Button
                      shadow
                      variant={isActive ? 'default' : 'outline'}
                      color={room.loaiPhong.loai ? 'success' : 'primary'}
                      onClick={()=>this.chooseRoom(room)}
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
            </Tab>
          )
        })}
      </Tabs>
    )
  }
}