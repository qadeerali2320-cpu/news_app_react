import React, { Component } from 'react'
import NewsItem from './NewsItem'

export class News extends Component {
  render() {
    return (

      <div className="container">
        <h2>Top Headings By News.QdPi</h2>
        <div className="row">
          <div className="col-md-4">
            <NewsItem title={"this is the news tile"} descripton={"QdPi News channel is sepreading the best news in the market"} />
          </div>
          <div className="col-md-4">
            <NewsItem title={"this is the news tile"} descripton={"QdPi News channel is sepreading the best news in the market"} />
          </div>
          <div className="col-md-4">
            <NewsItem title={"this is the news tile"} descripton={"QdPi News channel is sepreading the best news in the market"} />
          </div>
        </div>
        </div>

        )
  }
}

        export default News
