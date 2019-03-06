import NewsContent from '../../../components/newsContent/newsContent'
import React from 'react'
import Header from './../../../components/headerHomepage/headerHomepage'

class NewsDetail extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Header></Header>
                <NewsContent></NewsContent>
            </React.Fragment>
        )
    }
}

export default NewsDetail

