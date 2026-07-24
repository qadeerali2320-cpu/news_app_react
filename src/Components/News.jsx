import React, { Component } from 'react'
import NewsItem from './NewsItem'
import './NewsCSS.css';  // CSS-Import

export class News extends Component {
  constructor() {
    super();
    
    this.state = {
      articles: [],
      loading: true,
      error:null,
       nextPageToken: null,  // ✅ Token store karne ke liye
      hasMore: true,        // ✅ Next page available hai ya nahi
    }

  }
   
  async componentDidMount() {
     this.setState({ loading: true });
    try {
      
         //  NewsData.io API (Sahi hai!)
        const apiKey = 'pub_ff3bbc19535440c9b43f8bdc075579a3';
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=in&language=en&size=10`;
      let response = await fetch(url);
      let parsedData = await response.json();
           if (parsedData.status === 'success' && parsedData.results && Array.isArray(parsedData.results)) {
        //  const filteredArticles = parsedData.results
        //   .filter((element) => !element.duplicate)//to remove same img from different resource and remove tht news
        //   .filter((element) => element.image_url);// if no image with news remove that news
         this.setState({
           //articles:filteredArticles,
          articles:parsedData.results,
          loading: false,
          error:null,
          page : 1,
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

 fetchNews = async (pageToken = null) => {
    this.setState({ loading: true });
    try {
      const apiKey = 'pub_ff3bbc19535440c9b43f8bdc075579a3';
      
      // ✅ Agar token hai toh use karo, warna pehla page
      let url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=in&language=en&size=10`;
      if (pageToken) {
        url += `&page=${pageToken}`;  // ✅ Token pass karo
      }
      
      console.log("Fetching URL:", url);
      
      let response = await fetch(url);
      let parsedData = await response.json();
      
      console.log("API Response:", parsedData);

      if (parsedData.status === 'success' && parsedData.results && Array.isArray(parsedData.results)) {
        this.setState({
          articles: parsedData.results,
          loading: false,
          error: null,
          nextPageToken: parsedData.nextPage || null,  // ✅ Naya token store karo
          hasMore: !!parsedData.nextPage,              // ✅ Agar nextPage hai toh true
          page: pageToken ? this.state.page + 1 : 1,   // ✅ Page number update
        });
      } else {
        this.setState({
          articles: [],
          loading: false,
          error: parsedData.message || "No articles found",
          hasMore: false,
        });
      }
    } catch(error) {
      console.error("Error:", error);
      this.setState({
        articles: [],
        loading: false,
        error: "Failed to fetch news",
        hasMore: false,
      });
    }
  }

  async componentDidMount() {
    await this.fetchNews();
  }

  // ✅ Next Page - stored token use karo
  handleNextPage = async () => {
    const { nextPageToken } = this.state;
    if (nextPageToken) {
      await this.fetchNews(nextPageToken);
    }
  }

  // ✅ Previous Page - Page 1 par wapas jao (previous token nahi milta)
  handlePreviousPage = () => {
    if (this.state.page > 1) {
      // ✅ Sirf Page 1 par wapas ja sakte ho
      this.setState({ page: this.state.page - 1 }, () => {
        if (this.state.page === 1) {
          this.fetchNews(null); // Pehle page par jao
        }
      });
    }
  }

  render() {
    const { articles, loading, error } = this.state;
     // Loading
    if (loading) {
      return (
        <div className="container news-container">
          <h2>Top Headlines</h2>
          <div className="loading-container">
            <div className="loading-spinner spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      );
    }

    // Error
    if (error) {
      return (
        <div className="container news-container">
          <h2>Top Headlines</h2>
          <div className="error-message">
          <p style={{ color: 'red' }}>⚠️ {error}</p>
        </div>
        </div>
      );
    }

    // No articles
    if (!articles || articles.length === 0) {
      return (
        <div className="container news-container">
          <h2>Top Headlines</h2>
          <p>No news articles found. Please try again later.</p>
        </div>
      );
    }

    return (

      <div className="container news-container" >
        <h2>Top Headlines </h2>
        <div className="row">
          {this.state.articles.map((element) => {
            return <div className="col-md-4" key={element.article_id || element.link}>
              <NewsItem title={element.title ? element.title.slice(0, 45) : "None"} description={element.description ? element.description.slice(0, 88) : "None"} imageUrl={element.image_url} newsUrl={element.link} source={element.source_name}
                date={element.pubDate} />
            </div>
          })}
        </div>
        <div className=" d-flex justify-content-between mt-4">

          <button disabled={this.state.page<1} type="button" onClick={this.handlePreviousPage} className="btn btn-warning">Previous ←</button>
          <button type="button" onClick={this.handleNextPage} className="btn btn-warning">Nex→</button>
        </div>

      </div>

    )
  }
}

export default News




