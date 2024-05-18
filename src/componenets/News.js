import React, { Component } from 'react';
import NewsItems from './NewsItems';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

export class News extends Component {
  static defaultProps = {
    country: 'in',
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
    console.log('Hello, I am the constructor from the News component');
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0
    };
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;
  }

  async componentDidMount() {
    this.updateNews();
  }

  async updateNews() {
    const { country, category, pageSize } = this.props;
    const { page } = this.state;
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=610edad30a3a4570a0fe6f72067c0144&page=${page}&pageSize=${pageSize}`;

    try {
      this.setState({ loading: true });
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        this.setState({
          articles: data.articles,
          totalResults: data.totalResults,
          loading: false
        });
      } else {
        console.error('Failed to fetch data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  fetchMoreData = async () => {
    const { country, category, pageSize } = this.props;
    const { page, articles } = this.state;
    const nextPage = page + 1;
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=610edad30a3a4570a0fe6f72067c0144&page=${nextPage}&pageSize=${pageSize}`;

    try {
      this.setState({ loading: true });
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        this.setState({
          articles: articles.concat(data.articles),
          totalResults: data.totalResults,
          loading: false,
          page: nextPage
        });
      } else {
        console.error('Failed to fetch data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  render() {
    const { category } = this.props;
    const { articles, loading, totalResults } = this.state;

    return (
      <>
        <h1 className="text-center" style={{ margin: '40px 0px' }}>
          NewsMonkey - Top {this.capitalizeFirstLetter(category)} Headlines
        </h1>
        {loading && <Spinner />}
        <InfiniteScroll
          dataLength={articles.length}
          next={this.fetchMoreData}
          hasMore={articles.length < totalResults}
          loader={<Spinner />}
          scrollThreshold={0.95}
        >
          <div className="container">
            <div className="row">
              {articles.map((element) => (
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
