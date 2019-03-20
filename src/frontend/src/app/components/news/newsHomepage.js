import React from 'react';
import { Container, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './newsHomepage.css'
const fadeImages = [
    '/images/01_ataulfohouse_apaloosa.jpg',
    '/images/26_ataulfohouse_apaloosa.jpg',
    '/images/26_ataulfohouse_apaloosa.jpg',
];


class NewsHomepage extends React.Component {
    render() {
        return (
            <Container>
                <div className='news-title'>
                    <span>TIN TỨC</span>
                </div>
                <Row>
                    <Col sm={4} className='news-item'>
                        <div className='news-img'>
                            <img alt='news' style={{ height: '200px', width: '100%' }} src={fadeImages[0]}/>
                        </div>
                        <div className='news-time'>
                            <i className="far fa-clock"></i>
                            <span style={{ color: '#33333382' }}>18 : 10 | Thứ 7, 20-1-2018</span>
                        </div>
                        <div className='news-item-p'>
                            <span>   Saepe dicta erat. Dictum corrupti labore habit
                                        se duis excepturi sapien, morbi ….</span>
                        </div>
                    </Col>
                    <Col sm={4} className='news-item'>
                        <div className='news-img'>
                            <img alt="home" style={{ height: '200px', width: '100%' }} src={fadeImages[0]}></img>
                        </div>
                        <div className='news-time'>
                            <i className="far fa-clock"></i>
                            <span style={{ color: '#33333382' }}>18 : 10 | Thứ 7, 20-1-2018</span>
                        </div>
                        <div className='news-item-p'>
                            <span>   Saepe dicta erat. Dictum corrupti labore habit
                                        se duis excepturi sapien, morbi ….</span>
                        </div>
                    </Col>
                    <Col sm={4} className='news-item'>
                        <div className='news-img'>
                            <img alt="home" style={{ height: '200px', width: '100%' }} src={fadeImages[0]}></img>
                        </div>
                        <div className='news-time'>
                            <i className="far fa-clock"></i>
                            <span style={{ color: '#33333382' }}>18 : 10 | Thứ 7, 20-1-2018</span>
                        </div>
                        <div className='news-item-p'>
                            <span>   Saepe dicta erat. Dictum corrupti labore habit
                                        se duis excepturi sapien, morbi ….</span>
                        </div>
                    </Col>
                </Row>
                <Link to='/news' style={{textDecoration: 'none'}}>
                    <div className='news-show-all'>
                        <span>Xem tất cả >></span>
                    </div>
                </Link>

            </Container>

   
        )

    }
}

export default NewsHomepage;