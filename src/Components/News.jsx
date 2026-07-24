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

      </div>

    )
  }
}

export default News







// import React, { Component } from 'react'
// import NewsItem from './NewsItem'
// import './NewsCSS.css'

// export class News extends Component {
//   constructor() {
//     super();
//     this.state = {
//       articles: [],
//       loading: true,
//       error: null,
//     }
//   }

//   async componentDidMount() {
//     this.setState({ loading: true });
//     try {
//       // ✅ GNews API (CORS-friendly)
//       // API key lo: https://gnews.io
//       const apiKey = '78930ca9e0466c3b9cb6ffea74cf449d'; // ← Yahan apni GNews key daalo
//       const url = `https://gnews.io/api/v4/top-headlines?token=${apiKey}&lang=en&country=us&max=10`;
      
//       console.log("Fetching URL:", url);
      
//       let response = await fetch(url);
//       let parsedData = await response.json();
      
//       console.log("GNews Response:", parsedData);

//       if (parsedData.articles && parsedData.articles.length > 0) {
//         const filteredArticles = parsedData.articles
//           .filter((element) => element.image)
//           .map((element) => ({
//             article_id: element.url,
//             title: element.title,
//             description: element.description || "No description available",
//             image_url: element.image || "",
//             link: element.url,
//             source_name: element.source?.name || "Unknown",
//             pubDate: element.publishedAt,
//             duplicate: false,
//           }));
        
//         this.setState({
//           articles: filteredArticles,
//           loading: false,
//           error: null,
//         });
//       } else {
//         this.setState({
//           articles: [],
//           loading: false,
//           error: parsedData.errors ? parsedData.errors[0] : "No articles found",
//         });
//       }
//     } catch(error) {
//       console.error("Error:", error);
//       this.setState({
//         articles: [],
//         loading: false,
//         error: "Failed to fetch news. Please check your connection.",
//       });
//     }
//   }

//   render() {
//     const { articles, loading, error } = this.state;

//     if (loading) {
//       return (
//         <div className="container news-container">
//           <h2>Top Headlines</h2>
//           <div className="loading-container">
//             <div className="loading-spinner"></div>
//           </div>
//         </div>
//       );
//     }

//     if (error) {
//       return (
//         <div className="container news-container">
//           <div className="error-message">
//             <h2>Top Headlines</h2>
//             <p>⚠️ {error}</p>
//           </div>
//         </div>
//       );
//     }

//     if (!articles || articles.length === 0) {
//       return (
//         <div className="container news-container">
//           <div className="no-articles">
//             <h2>Top Headlines</h2>
//             <p>📰 No news articles found. Please try again later.</p>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="container news-container">
//         <h2>Top Headlines</h2>
//         <div className="row">
//           {articles.map((element) => {
//             return (
//               <div className="col-md-4" key={element.article_id || element.link}>
//                 <NewsItem
//                   title={element.title}
//                   description={element.description}
//                   imageUrl={element.image_url}
//                   newsUrl={element.link}
//                   source={element.source_name}
//                   date={element.pubDate}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   }
// }

// export default News;

