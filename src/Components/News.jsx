import React, { useState, useEffect, useCallback,useRef } from 'react'
import NewsItem from './NewsItem'
import './NewsCSS.css';  // CSS-Import
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';
const News = (props) => {

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalResults, setTotalResults] = useState(0)
  const [nextPageToken, setNextPageToken] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const capitalizeFirstCharacter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  useEffect(() => {
    document.title = `${capitalizeFirstCharacter(props.category)} -QdPiNews`
  }, [props.category])

  const fetchNews = useCallback(async (pageToken = null) => {
    if (props.setProgress) props.setProgress(10);
    setLoading(true);
    try {

      //  Agar token hai toh use karo, warna pehla page
      let url = `https://newsdata.io/api/1/news?apikey=${props.apiKey}&language=en&size=${props.pageSize}&q=${props.category}`;
      if (pageToken) {
        url += `&page=${pageToken}`;
      }
      const response = await fetch(url);
      const parsedData = await response.json();
      if (parsedData.status === 'success' && parsedData.results && Array.isArray(parsedData.results)) {
        props.setProgress(30);
        const filteredArticles = parsedData.results
          .filter((element) => {
            const isDuplicate = element.duplicate;
            const hasImage = element.image_url && element.image_url.length > 0;
            return !isDuplicate && hasImage;
          });
        if (props.setProgress) props.setProgress(60);
        const result = {
          articles: filteredArticles,
          totalResults: parsedData.totalResults || 0,
          nextPageToken: parsedData.nextPage || null,
          hasMore: !!parsedData.nextPage,
        }
        if (pageToken) {
          setArticles(prev => prev.concat(filteredArticles))
        }
        else {
          setArticles(filteredArticles)
        }

        setLoading(false)
        setError(null)
        setTotalResults(parsedData.totalResults || 0)
        setNextPageToken(parsedData.nextPage || null)
        setHasMore(!!parsedData.nextPage)
        setPage(prev => pageToken ? prev + 1 : 1)
        if (props.setProgress) props.setProgress(100)
        return result;
      } else {
        setArticles([])
        setLoading(false)
        setError(parsedData.message || "No articles found")
        setHasMore(false)
        if (props.setProgress) props.setProgress(100)
        return null
      }

    } catch (error) {
      console.error("Error:", error)
      setArticles([])
      setLoading(false)
      setError("Failed to fetch news")
      setHasMore(false)
      if (props.setProgress) props.setProgress(100)
      return null;
    }
  }, [props.apikey, props.country, props.pageSize, props.category, props.setProgress])


  useEffect(() => {
    fetchNews();
  }, [])
  const fetchMore = useCallback(async () => {
    //const { nextPageToken, articles } = state;
    if (nextPageToken) {
      const result = await fetchNews(nextPageToken)
      if (result) {
        setArticles(prev => prev.concat(result.articles))
        setTotalResults(result.totalResults)
        setNextPageToken(result.nextPageToken)
        setHasMore(result.hasMore)
      }
    }
  }, [nextPageToken, fetchNews])
  useEffect(() => {
    // Reset state when category changes
    setArticles([])
    setLoading(true)
    setPage(1)
    setNextPageToken(null)
    setHasMore(true)
    setError(null)
    fetchNews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.category])

const scrollRef=useRef(null)
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
      <h2>Top Headlines from {capitalizeFirstCharacter(props.category)} </h2>
      <div ref={scrollRef} 
       >
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMore}
          hasMore={hasMore}
          scrollableTarget={scrollRef.current}
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
            {articles.map((element) => {
              return <div className="col-md-4" key={element.article_id || element.link}>
                <NewsItem title={element.title ? element.title.slice(0, 65) : "None"} description={element.description ? element.description.slice(0, 100) : "None"} imageUrl={element.image_url} newsUrl={element.link} source={element.source_name}
                  date={element.pubDate} />
              </div>
            })}

          </div>
        </InfiniteScroll>
      </div>
    </div>

  )
}

News.defaultProps = {
  country: 'PK',
  pageSize: 8,
  category: 'general',


}
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,

}


export default News




