import './rating.css'

const Ratings = props => {
  const {eachItem, getRatingId} = props
  const {imageUrl, ratingId} = eachItem

  const sendRatingId = () => {
    getRatingId(ratingId)
  }

  return (
    <div className="rating-element-container">
      <img
        src={imageUrl}
        alt={`rating ${ratingId}`}
        className="rating-logo"
        onClick={sendRatingId}
      />
      <p className="starts-up">& up</p>
    </div>
  )
}

export default Ratings
