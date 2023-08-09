import './index.css'

const FiltersGroup = props => {
  const {eachCat, getClickedImages} = props
  const {name, categoryId} = eachCat

  const sendClickedImageId = () => {
    getClickedImages(categoryId)
  }

  return (
    <div className="filters-group-container">
      <p onClick={sendClickedImageId} className="filtered-btn">
        {name}
      </p>
    </div>
  )
}

export default FiltersGroup
