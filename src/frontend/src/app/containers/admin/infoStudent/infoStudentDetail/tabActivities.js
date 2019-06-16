import {Row, Tab, Table} from "react-bootstrap";
import {dateToString} from "../../../../function/dateFunction";
import React from "react";

export default class TabActivities extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      data: this.props.data
    }
  }

  render(){
    const { data } = this.props;
    return(
        <div className={'id-tab_frame'}>
          {data && data.activities.length !== 0 ?
            <Table responsive bordered size="sm" hover>
              <thead>
              <tr>
                <th>STT</th>
                <th>Học kỳ</th>
                <th>Thời gian</th>
                <th>Tên hoạt động</th>
                <th>Điểm</th>
                <th>Trạng thái</th>
              </tr>
              </thead>
              <tbody>
              {
                data.activities && data.activities.map((acti, index) => {

                  if(acti){
                    let status = 'Chưa diễn ra';
                    if(acti.isEnd)
                      if(acti.isTG)
                        status = 'Đã tham gia';
                      else
                        status = 'Không tham gia';
                    return (
                      <tr key={index + 1}>
                        <td>{index + 1}</td>
                        <td>{acti.term}</td>
                        <td>{dateToString(acti.idHD.ngayBD)} - {acti.idHD && dateToString(acti.idHD.ngayKT)}</td>
                        <td>{acti.idHD.ten}</td>
                        <td>{acti.isTG ? acti.idHD.diem : '0'}/{acti.idHD && acti.idHD.diem}</td>
                        <td className={'messDanger'}>{status}</td>
                      </tr>
                    )
                  }
                })
              }
              </tbody>
            </Table>
            :
            <span className={'messDanger'}>Không có hoạt động nào</span>
          }

          <div className={'id-tab-activities_total-frame'}>
          <Row>
            <span>Điểm học kỳ 1: <span className={'messDanger'}>{data && data.point.term1}</span></span>
          </Row>
          <Row>
            <span>Điểm học kỳ 2: <span className={'messDanger'}>{data && data.point.term2}</span></span>
          </Row>
          <Row>
            <span>Tổng điểm: <span className={'messDanger'}>{data && data.point.term1 + data.point.term2}</span></span>
          </Row>
          </div>
        </div>
    )
  }
}

