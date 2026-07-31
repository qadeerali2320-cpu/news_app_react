import React, { Component } from 'react'
import NewsItem from './NewsItem'
import './NewsCSS.css';  // CSS-Import
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';
export class News extends Component {

  static defaultProps = {
    country: 'PK',
    pageSize: 8,
    category: 'general'

  }
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }

  capitalizeFirstCharacter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props) {
    super(props);

    this.state = {
      articles: [],
      loading: true,
      error: null,
      totalResults: 0,
      nextPageToken: null,  //  Token store karne ke liye
      hasMore: true,        //  Next page available hai ya nahi
    }
    document.title = `${this.capitalizeFirstCharacter(this.props.category)} -QdPiNews`
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.category !== this.props.category) {
      console.log(`Category changed: ${prevProps.category} → ${this.props.category}`);
      this.setState({
        articles: [],
        loading: true,
        page: 1,
        nextPageToken: null,
        hasMore: true,
        error: null,
      }, () => {
        this.fetchNews();
      });
    }
  }

  async componentDidMount() {
    await this.fetchNews();
  }

  fetchNews = async (pageToken = null) => {
    this.props.setProgress(10);
    this.setState({ loading: true });
    try {
      const apiKey = 'pub_7e492657a35144bb842eb66fae1b1cc0';

      //  Agar token hai toh use karo, warna pehla page
      let url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=PK&language=en&size=${this.props.pageSize}&q=${this.props.category}`;
      // if (!pageToken) {
      //   url += `&category=${this.props.category}`;
      // }
      if (pageToken) {
        url += `&page=${pageToken}`;
      }
      console.log("Fetching URL:", url);
      let response = await fetch(url);
      let parsedData = await response.json();
      console.log("API Response:", parsedData);
      if (parsedData.status === 'success' && parsedData.results && Array.isArray(parsedData.results)) {
        this.props.setProgress(30);
        const filteredArticles = parsedData.results
          .filter((element) => {
            const isDuplicate = element.duplicate;
            const hasImage = element.image_url && element.image_url.length > 0;
            const isValidLink = element.link &&
              element.link.startsWith('http') &&
              !element.link.includes('psuconnect') &&  // Block psuconnect
              !element.link.includes('latestly') &&    // Block latestly
              !element.link.includes('siasat');        // Block siasat
            console.log("Article:", element.title);
            console.log("  hasImage:", hasImage);
            console.log("  isValidLink:", isValidLink);
            console.log("  isDuplicate:", isDuplicate);
            return !isDuplicate && hasImage && isValidLink;
          });

        console.log("Filtered articles:", filteredArticles.length);
        this.props.setProgress(60);
           const result = {
        articles: filteredArticles,
        totalResults: parsedData.totalResults,
        nextPageToken: parsedData.nextPage || null,
        hasMore: !!parsedData.nextPage,
      };
        this.setState({
          articles: filteredArticles,
          loading: false,
          error: null,
          totalResults: parsedData.totalResults,
          nextPageToken: parsedData.nextPage || null,  //  Naya token store karo
          hasMore: !!parsedData.nextPage,              //  Agar nextPage hai toh true
          page: pageToken ? this.state.page + 1 : 1,   //  Page number update
        });
        this.props.setProgress(100);
        return result;
      } else {
        this.setState({
          articles: [],
          loading: false,
          error: parsedData.message || "No articles found",
          hasMore: false,
        });
        this.props.setProgress(100);
      }
    } catch (error) {
      console.error("Error:", error);
      this.setState({
        articles: [],
        loading: false,
        error: "Failed to fetch news",
        hasMore: false,
      });
    }
  }



  fetchMore = async () => {
     const { nextPageToken, articles } = this.state;
  if(nextPageToken){
 const result=await   this.fetchNews(nextPageToken)
   this.setState({
      articles: articles.concat(result.articles),
      totalResults: result.totalResults,
      nextPageToken: result.nextPageToken,
      hasMore: result.hasMore,
    });
  }

  }
  // //  Next Page - stored token use karo
  // handleNextPage = async () => {
  //   const { nextPageToken } = this.state;
  //   if (nextPageToken) {
  //     await this.fetchNews(nextPageToken);
  //   }
  // }

  // //  Previous Page - Page 1 par wapas jao (previous token nahi milta)
  // handlePreviousPage = () => {
  //   if (this.state.page > 1) {
  //     //  Sirf Page 1 par wapas ja sakte ho
  //     this.setState({ page: this.state.page - 1 }, () => {
  //       if (this.state.page === 1) {
  //         this.fetchNews(null); // Pehle page par jao
  //       }
  //     });
  //   }
  // }

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
        <h2>Top Headlines from {this.capitalizeFirstCharacter(this.props.category)} </h2>
        <div className="container">
          <InfiniteScroll
            dataLength={this.state.articles.length}
            next={this.fetchMore}
            hasMore={this.state.articles.length !== this.state.totalResults}
            loader={
                <div className="text-center my-4">
            <div className="loading-spinner spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p style={{ color: 'white', marginTop: '10px' }}>Loading more news...</p>
          </div>
            }
            endMessage={<p style={{ textAlign: 'center' }}>All items loaded.</p>}
          >


            <div className="row">
              {this.state.articles.map((element) => {
                return <div className="col-md-4" key={element.article_id || element.link}>
                  <NewsItem title={element.title ? element.title.slice(0, 45) : "None"} description={element.description ? element.description.slice(0, 88) : "None"} imageUrl={element.image_url} newsUrl={element.link} source={element.source_name}
                    date={element.pubDate} />
                </div>
              })}

            </div>
          </InfiniteScroll>
        </div>
        {/* <div className=" d-flex justify-content-between mt-4">

          <button disabled={this.state.page < 1} type="button" onClick={this.handlePreviousPage} className="btn-pagination">Previous ←</button>
          <button type="button" onClick={this.handleNextPage} className="btn-pagination">Nex→</button>
        </div> */}

      </div>

    )
  }
}

export default News




