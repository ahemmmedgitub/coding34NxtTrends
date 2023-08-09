import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'
import Ratings from '../Ratings/rating'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatuesConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    category: '',
    titleSearch: '',
    rating: '',
    apiStatues: apiStatuesConstants.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  getClickedImages = categoryId => {
    this.setState({category: categoryId}, this.getProducts)
  }

  getChangedInput = event => {
    this.setState({titleSearch: event.target.value}, this.getProducts)
  }

  getRatingId = ratingId => {
    this.setState({rating: ratingId}, this.getProducts)
  }

  getProducts = async () => {
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')

    const {activeOptionId, category, titleSearch, rating} = this.state
    console.log(rating)

    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${category}&title_search=${titleSearch}&rating=${rating}`
    const options = {
      headers: {
        Authorization: `Bearer s${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: false,
        apiStatues: apiStatuesConstants.success,
      })
    } else if (response.status === 401) {
      this.setState({apiStatues: apiStatuesConstants.failure})
    } else {
      this.setState({apiStatues: apiStatuesConstants.inProgress})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    if (productsList.length > 0) {
      return (
        <div className="all-products-container">
          <ProductsHeader
            activeOptionId={activeOptionId}
            sortbyOptions={sortbyOptions}
            changeSortby={this.changeSortby}
          />
          <div className="products-list">
            {productsList.map(product => (
              <ProductCard productData={product} key={product.id} />
            ))}
          </div>
        </div>
      )
    }
    return (
      <div className="no-items-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          alt="no products"
          className="empty-page-logo"
        />
        <h1>No Products Found</h1>
        <p>We could not find any product. Try other filters.</p>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  clearFilters = () => {
    this.setState(
      {
        category: '',
        titleSearch: '',
        rating: '',
        activeOptionId: sortbyOptions[0].optionId,
      },
      this.getProducts,
    )
  }

  // TODO: Add failure view

  failureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="failure-logo"
      />
      <h1 className="failure-heading">Opps! Something Went Wrong</h1>
      <p className="failure-description">
        We have some trouble processing your request. Please try again.
      </p>
    </div>
  )

  finalResultFunction = () => {
    const {apiStatues} = this.state

    switch (apiStatues) {
      case apiStatuesConstants.success:
        return this.renderProductsList()
      case apiStatuesConstants.failure:
        return this.failureView()
      case apiStatuesConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {isLoading, titleSearch, rating} = this.state
    return (
      <div className="all-products-section">
        <div className="search-main-container">
          <div className="search-container">
            <input
              onChange={this.getChangedInput}
              placeholder="Search"
              type="search"
              className="input-css"
              value={titleSearch}
            />
            <BsSearch className="search-logo" />
          </div>
          <div className="filtered-elements">
            <h1 className="category">Category</h1>
            {categoryOptions.map(eachCat => (
              <FiltersGroup
                getClickedImages={this.getClickedImages}
                eachCat={eachCat}
                key={eachCat.categoryId}
              />
            ))}
          </div>
          <div className="rating-main-container">
            <h1 className="category rating">Rating</h1>
            {ratingsList.map(eachItem => (
              <Ratings
                getRatingId={this.getRatingId}
                eachItem={eachItem}
                key={eachItem.ratingId}
              />
            ))}
          </div>
          <button
            onClick={this.clearFilters}
            className="clear-btn"
            type="button"
          >
            Clear Filters
          </button>
        </div>
        {this.finalResultFunction()}
      </div>
    )
  }
}

export default AllProductsSection
