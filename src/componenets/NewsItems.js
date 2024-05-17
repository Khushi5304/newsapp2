import React, { Component } from 'react'

export class NewsItems extends Component {

  
  render() {
    let {title,description,imgUrl,newsUrl,author,date,source}=this.props;
    return (
      <div className='my-3'>
        This is Newsitems
        <div className="card">
        <span class="position-absolute top-0  translate-middle badge rounded-pill bg-danger" style={{left:'90%',zIndex:'1'}}>{source}</span>
          <img src={imgUrl} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">{title ? title.slice(0, 45) : ""}</h5>
            <p className="card-text">{description ? description.slice(0, 88) : ""}...</p>
            <p className='card-text'><small className='text-muted'>By {!author?"unknown":author} on {new Date(date).toGMTString()}</small></p>
            <a href={newsUrl} target="_blank" className="btn btn-sm btn-dark">Read More</a>
          </div>
        </div>
      </div>
    )
  }
}

export default NewsItems
