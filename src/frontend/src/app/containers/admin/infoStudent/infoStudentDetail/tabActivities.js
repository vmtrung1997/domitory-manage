import {Row, Tab, Table} from "react-bootstrap";
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
          {activities ?
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
                activities && activities.map((acti, index) => {
                  let present = new Date();
                  let happening = new Date(acti.idHD.ngayKT) < present;
                  console.log('==heppen', happening)
                  let status = '';
                  if (happening && !acti.isTG)
                    status = 'Không tham gia'
                  else if (happening && acti.isTG)
                    status = 'Đã tham gia'
                  else if (!happening && !acti.isTG)
                    status = 'Chưa diễn ra'
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{acti.idHD && dateToString(acti.idHD.ngayBD)} - {acti.idHD && dateToString(acti.idHD.ngayKT)}</td>
                      <td>{acti.idHD && acti.idHD.ten}</td>
                      <td>{acti.isTG ? acti.idHD.diem : '0'}/{acti.idHD && acti.idHD.diem}</td>
                      <td>{status}</td>
                    </tr>
                  )
                })
              }
              </tbody>
            </Table>
            :
            <span className={'messDanger'}>Không có hoạt động nào</span>
          }

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

