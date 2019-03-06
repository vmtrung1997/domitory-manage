import React from 'react'
import './newsList.css'
import { Button, ButtonGroup, Pagination } from 'react-bootstrap'

const fadeImages = [
    '/images/01_ataulfohouse_apaloosa.jpg',
    '/images/26_ataulfohouse_apaloosa.jpg',
    '/images/26_ataulfohouse_apaloosa.jpg',
];

class NewsList extends React.Component {
    render() {
        let active = 2;
        let items = [];
        for (let number = 1; number <= 5; number++) {
            items.push(
                <Pagination.Item key={number} active={number === active}>
                    {number}
                </Pagination.Item>,
            );
        }
        return (
            <React.Fragment>
                <div className='news'>
                    <div className='news-header'>
                        <span>TIN TỨC</span>
                    </div>
                    <div className="">
                        <ButtonGroup className="btn-group ">
                            <Button className='btn-item'>TẤT CẢ</Button>
                            <Button className='btn-item'>THÔNG BÁO
                        </Button>
                            <Button className='btn-item'>TIN TỨC</Button>
                        </ButtonGroup>
                    </div>
                    <div className='news-list'>
                        <div className='news-content'>
                            <img style={{ width: '30%' }} src={fadeImages[0]}></img>
                            <div className='news-right-content'>
                                <div className='news-right-content-header'>
                                    <span>Sapiente aliquip hendrerit sed porttitor.</span>
                                </div>
                                <div className='news-right-content-content'>
                                    <span>Quas proin molestias pharetra debitis ut hymenaeos consequuntur. Consequuntur! Quaera
                                    t imperdiet ex, quae facilis imperdiet eaque voluptatum sollicitudin esse! Numquam.</span>
                                </div>
                                <div className='news-right-content-time'>
                                    <span><i className="far fa-clock"></i>&nbsp;18 : 10 | Thứ 7, 20-1-2018</span>
                                </div>
                            </div>
                        </div>
                        <div className='news-content'>
                            <img style={{ width: '30%' }} src={fadeImages[0]}></img>
                            <div className='news-right-content'>
                                <div className='news-right-content-header'>
                                    <span>Sapiente aliquip hendrerit sed porttitor.</span>
                                </div>
                                <div className='news-right-content-content'>
                                    <span>Quas proin molestias pharetra debitis ut hymenaeos consequuntur. Consequuntur! Quaera
                                    t imperdiet ex, quae facilis imperdiet eaque voluptatum sollicitudin esse! Numquam.</span>
                                </div>
                                <div className='news-right-content-time'>
                                    <span><i className="far fa-clock"></i>&nbsp;18 : 10 | Thứ 7, 20-1-2018</span>
                                </div>
                            </div>
                        </div>
                        <div className='news-content'>
                            <img style={{ width: '30%' }} src={fadeImages[0]}></img>
                            <div className='news-right-content'>
                                <div className='news-right-content-header'>
                                    <span>Sapiente aliquip hendrerit sed porttitor.</span>
                                </div>
                                <div className='news-right-content-content'>
                                    <span>Quas proin molestias pharetra debitis ut hymenaeos consequuntur. Consequuntur! Quaera
                                    t imperdiet ex, quae facilis imperdiet eaque voluptatum sollicitudin esse! Numquam.</span>
                                </div>
                                <div className='news-right-content-time'>
                                    <span><i className="far fa-clock"></i>&nbsp;18 : 10 | Thứ 7, 20-1-2018</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Pagination className='news-pagination'>
                        <Pagination.First />
                        <Pagination.Prev />
                        <Pagination >{items}</Pagination>
                        <Pagination.Next />
                        <Pagination.Last />
                    </Pagination>
                    <br />
                </div>
            </React.Fragment>
        )
    }
}

export default NewsList;