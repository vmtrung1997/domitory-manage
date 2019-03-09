import NewsList from '../../../components/newsList/newsList'
import React from 'react'
import Header from './../../../components/headerHomepage/headerHomepage'

class News extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Header></Header>
                <NewsList></NewsList>
            </React.Fragment>
        )
    }
}

export default News

