import React, { Component } from 'react'
export class NewsItem extends Component {
  render() {
    let {title,description,imageUrl,newsUrl,source ,date}=this.props
    
    //  Fallback image (inline SVG )
    const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23e9ecef'/%3E%3Ctext x='150' y='100' font-family='Arial' font-size='16' fill='%236c757d' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
    return (
      <div className='my-3'>
       <div className="card" style={{width :'18rem'}}>
  <img src={imageUrl||fallbackImage} className="card-img-top"
            alt={title || 'News image'}
            style={{ height: '300px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src =fallbackImage;
            }}/>
  <div className="card-body d-flex flex-column">
    <h5 className="card-title" style={{minHeight:'60px'}}>{title?title.slice(0,45):"No Title"}... </h5>
    <p className="card-text" style={{minHeight:'60px'}}>{description?description.slice(0,88):""}...</p>
    {source&&(
      <p className="text-muted">
        <small>Source:{source}</small>
        </p>

    )}
    { date &&(

      <p className='text-muted'>
      <small>Published:{new Date(date).toLocaleDateString()} </small>
      </p>
    )

    }
    <a href={newsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-2">Read More</a>
  </div>
</div>
      </div>
    )
  }
}

export default NewsItem
