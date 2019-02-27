import React, { Component } from 'react'
import './headerHomepage.css'

class HeaderHomepage extends Component {
    render() {
        return (
            <React.Fragment>
                <div className='HeaderHomepage'>
                    <div className='menuHeader'>
                        <div className='menu'>
                            <span>Trang chủ</span>
                        </div>
                        <div className='menu'>
                            <span>Tin tức</span>
                        </div>
                        <div className='menu'>
                            <span>Giới thiệu</span>
                        </div>
                    </div>
                    <div className='logoHeader'>â</div>
                    <div className = 'search'></div>
                </div>



            </React.Fragment>
        )
    }
}

export default HeaderHomepage