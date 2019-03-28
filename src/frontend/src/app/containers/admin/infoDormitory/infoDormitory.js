import React from 'react';
import './infoDormitory.css';
import './../../../style.css'
import Title from "../../../components/title/title";
import Button from "../../../components/button/button";
import { Col, Row } from 'react-bootstrap';

class InfoDormitory extends React.Component{
  constructor(props){
    super(props);

  }

  render(){
    return(
      <div>
        <Title>
          Thông tin ký túc xá
        </Title>
        <div className={'content-body'}>
          <Row>
          <Col md={2}>
            <div className={'id-floor'}>
              <Button
                color={'success'}
                variant={'outline'}
                diminsion
                actived
              >
                Lầu 1
              </Button>
            </div>
            <div className={'id-floor'}>
              <Button
                color={'success'}
                variant={'outline'}
                diminsion
              >
                Lầu 1
              </Button>
            </div>
            <div className={'id-floor'}>
              <Button
                color={'success'}
                variant={'outline'}
                diminsion
              >
                Lầu 1
              </Button>
            </div>
            <div className={'id-floor'}>
              <Button
                color={'success'}
                variant={'outline'}
                diminsion
              >
                <i className="fas fa-plus"/>
              </Button>
            </div>

          </Col>
          <Col md={10}>
            <div className={'id-room'}>
              <div className={'id-room_item'}>
                <Button
                  color={'warning'}
                >
                  Phòng 101 (0)
                </Button>
              </div>
              <div className={'id-room_item'}>
                <Button
                  color={'warning'}
                >
                  Phòng 101 (0)
                </Button>
              </div>
              <div className={'id-room_item'}>
                <Button
                  variant={'outline'}
                  color={'warning'}
                >
                  Phòng 101 (2)
                </Button>
              </div>
              <div className={'id-room_item'}>
                <Button
                  variant={'outline'}
                  color={'warning'}
                >
                  Phòng 101 (2)
                </Button>
              </div>
              <div className={'id-room_item'}>
                <Button
                  variant={'outline'}
                  color={'warning'}
                >
                  Phòng 101 (2)
                </Button>
              </div>
              <div className={'id-room_item'}>
                <Button
                  variant={'outline'}
                  color={'warning'}
                >
                  Phòng 101 (2)
                </Button>
              </div>

              <div className={'id-room_item'}>
                <Button
                  color={'warning'}
                >
                  Phòng 101 (0)
                </Button>
              </div>
              <div className={'id-room_item'}>
                <Button
                  variant={'outline'}
                  color={'warning'}
                >
                  <i className="fas fa-plus"/>
                </Button>
              </div>
            </div>
          </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default InfoDormitory