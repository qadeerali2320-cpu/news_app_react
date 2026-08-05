import React, { Component } from 'react'
import './NewsCSS.css'
export class NewsItem extends Component {
  render() {
     console.log("News is rendering...");  // ✅ Ye line add karo 
    let { title, description, imageUrl, newsUrl, source, date } = this.props
      //  Fallback image (inline SVG )
    const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%231a1a2e'/%3E%3Ctext x='150' y='100' font-family='Arial' font-size='18' fill='%236c757d' text-anchor='middle'%3ENo Image%3C/text%3E%3Ctext x='150' y='125' font-family='Arial' font-size='12' fill='%23555' text-anchor='middle'%3EAvailable%3C/text%3E%3C/svg%3E";    const isValidUrl = newsUrl && newsUrl.startsWith('http');
    return (
      <div className='my-3'>
        <div className="card news-card" style={{ width: '18rem' }}>
          <img src={imageUrl || fallbackImage}
            className="card-img-top news-card-img"
            alt={title || 'News image'}
            style={{
              height: '220px',
              width: '100%',
              objectFit: 'cover',
              display: 'block',
              backgroundColor: '#1a1a2e',
              minHeight: '220px'

            }}
            onError={(e) => {
              console.log("❌ Image load FAILED for:", imageUrl);
              e.target.src = fallbackImage;
            }}
            onLoad={() => { console.log("✅ Image loaded successfully:", imageUrl); }}
          />
          <div className="card-body d-flex flex-column">
            <h5 className="news-card-title " style={{ minHeight: '60px' }}>{title ? title.slice(0, 55) : "No Title"}... </h5>
            <p className="news-card-description" style={{ minHeight: '60px' }}>{description ? description.slice(0, 100) : ""}...</p>
            <div className="news-meta">  
              {source && (
                <span className="source">📰 {source}</span>
              )}
              {date && (
                <span className="date">📅 {new Date(date).toLocaleDateString()}</span>
              )}
            </div>

            {isValidUrl ? (
              <a href={newsUrl} target="_blank" rel="noopener noreferrer" className="btn-read-more">
                Read More →
              </a>
            ) : (
              <button className="btn-read-more" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                Link Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default NewsItem
