import {Tab, Table} from "react-bootstrap";
import {dateToString} from "../../../../function/dateFunction";
import React from "react";

export default class TabActivities extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      activities: this.props.activities
    }
  }
  render(){
    console.log('==tab', this.props.activities)
    const { activities } = this.props;
    return(

        <div className={'id-tab_frame'}>
          <Table responsive bordered size="sm" hover>
            <thead>
            <tr>
              <th>STT</th>
              <th>Thời gian</th>
              <th>Tên hoạt động</th>
              <th>Điểm</th>
              <th>Trạng thái</th>
            </tr>
            </thead>
            <tbody>
            {
              activities && activities.map(acti => {
                let present = new Date();
                let happening = new Date(acti.data.idHD.ngayKT) < present;
                console.log('==heppen', happening)
                let status = '';
                if(happening && !acti.data.isTG)
                  status = 'Không tham gia'
                else if(happening && acti.data.isTG)
                  status = 'Đã tham gia'
                else if(!happening && !acti.data.isTG)
                  status = 'Chưa diễn ra'
                return (
                  <tr key={acti.key}>
                    <td>{acti.key + 1}</td>
                    <td>{acti.data.idHD && dateToString(acti.data.idHD.ngayBD)} - {acti.data.idHD && dateToString(acti.data.idHD.ngayKT)}</td>
                    <td>{acti.data.idHD && acti.data.idHD.ten}</td>
                    <td>{acti.data.isTG ? acti.data.idHD.diem : '0'}/{acti.data.idHD && acti.data.idHD.diem}</td>
                    <td>{status}</td>
                  </tr>
                )
              })
            }
            </tbody>
          </Table>

          {/*<div className={'id-tab-activities_total-frame'}>*/}
          {/*<Row>*/}
          {/*<span>Số hoạt động đã tham gia: 3</span>*/}
          {/*</Row>*/}
          {/*<Row>*/}
          {/*<span>Số hoạt động không tham gia: 1</span>*/}
          {/*</Row>*/}
          {/*<Row>*/}
          {/*<span>Số hoạt động chưa tham gia: 1</span>*/}
          {/*</Row>*/}
          {/*<Row>*/}
          {/*<span>Tổng điểm: 30</span>*/}
          {/*</Row>*/}
          {/*</div>*/}
        </div>
    )
  }
}

