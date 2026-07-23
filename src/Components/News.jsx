import React, { Component } from 'react'
import NewsItem from './NewsItem'


export class News extends Component {
  constructor() {
    super();
    
    this.state = {
      articles: [],
      loading: true,
      error:null,
    }

  }
   
  async componentDidMount() {
     this.setState({ loading: true });
    try {
      
         //  NewsData.io API (Sahi hai!)
    const apiKey = 'pub_35ff6a3e13dc487796267162d395f1db';
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=cricket&language=en&size=10`;
    
      let response = await fetch(url);
      let parsedData = await response.json();
           if (parsedData.status === 'success' && parsedData.results && Array.isArray(parsedData.results)) {
         const filteredArticles = parsedData.results
          .filter((element) => !element.duplicate)
          .filter((element) => element.image_url);
        this.setState({
          articles:filteredArticles,
          loading: false,
          error:null,
        })
      }
      else {

        console.log("API Error:", parsedData);
        this.setState({
          articles: [],
          loading: false,
            error: parsedData.errors ? parsedData.errors[0] : "No articles found",
        });
      }
    }
 catch(error) {
    console.error("Error fetching news:", error);
    this.setState({
      articles: [],
      loading: false,
    });
  }
}


  render() {
    const { articles, loading, error } = this.state;
     // Loading
    if (loading) {
      return (
        <div className="container">
          <h2>Top Headlines</h2>
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      );
    }

    // Error
    if (error) {
      return (
        <div className="container">
          <h2>Top Headlines</h2>
          <p style={{ color: 'red' }}>⚠️ {error}</p>
        </div>
      );
    }

    // No articles
    if (!articles || articles.length === 0) {
      return (
        <div className="container">
          <h2>Top Headlines</h2>
          <p>No news articles found. Please try again later.</p>
        </div>
      );
    }

    return (

      <div className="container" >
        <h2>Top Headlines </h2>
        <div className="row">
          {this.state.articles.map((element) => {
            return <div className="col-md-4" key={element.article_id || element.link}>
              <NewsItem title={element.title ? element.title.slice(0, 45) : "None"} description={element.description ? element.description.slice(0, 88) : "None"} imageUrl={element.image_url} newsUrl={element.link} source={element.source_name}
                date={element.pubDate} />
            </div>
          })}
        </div>

      </div>

    )
  }
}

export default News
