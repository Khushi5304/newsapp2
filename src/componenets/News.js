import React, { Component } from 'react';
import NewsItems from './NewsItems';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

export class News extends Component {
  static defaultProps = {
    name: 'stranger',
    pageSize: 20, // Increase the page size for initial loading
    category: 'general'
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  };

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  constructor(props) {
    super(props);
    console.log('hello i am constructor from news component');
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0
    };
    document.title = `${this.capitalizeFirstLetter(this.props.category)}-NewsMonkey`;
  }

  async componentDidMount() {
    this.updateNews();
  }

  async updateNews() {
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=610edad30a3a4570a0fe6f72067c0144&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    try {
      this.setState({ loading: true });
      let data = await fetch(url);
      if (data.ok) {
        let parsedData = await data.json();
        console.log(data);
        this.setState({ articles: this.state.articles.concat(parsedData.articles), totalResults: parsedData.totalResults, loading: false });
      } else {
        console.error('Failed to fetch data:', data.status, data.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  handleNextClick = async () => {
    this.setState({ page: this.state.page + 1 });
    this.updateNews();
  };

  fetchMoreData = async () => {
    let nextPage = this.state.page + 1;
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=610edad30a3a4570a0fe6f72067c0144&page=${nextPage}&pageSize=${this.props.pageSize}`;
    try {
      this.setState({ loading: true });
      let data = await fetch(url);
      if (data.ok) {
        let parsedData = await data.json();
        this.setState({ articles: this.state.articles.concat(parsedData.articles), totalResults: parsedData.totalResults, loading: false, page: nextPage });
      } else {
        console.error('Failed to fetch data:', data.status, data.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  render() {
    return (
      <>
        <h1 className="text-center" style={{ margin: '40px 0px' }}>
          NewsMonkey -Top {this.capitalizeFirstLetter(this.props.category)} Headlines
        </h1>
        {this.state.loading && <Spinner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length < this.state.totalResults}
          loader={<Spinner />}
          scrollThreshold={0.95}
        >
          <div className="container">
            <div className="row">
              {this.state.articles &&
                this.state.articles.map((element) => (
                  <div className="col-md-4" key={element.url}>
                    <NewsItems
                      title={element.title ? element.title.slice(0, 45) : ''}
                      description={element.description ? element.description.slice(0, 88) : ''}
                      imgUrl={element.urlToImage}
                      newsUrl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                      source={element.source.name}
                    />
                  </div>
                ))}
            </div>
          </div>
        </InfiniteScroll>
      </>
    );
  }
}

export default News;
