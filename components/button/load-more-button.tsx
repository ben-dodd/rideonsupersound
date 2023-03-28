const LoadMoreButton = ({ onClick }) => {
  return (
    <button className="my-2 p-2 mx-auto w-full border hover:bg-gray-100" onClick={onClick}>
      LOAD MORE...
    </button>
  )
}

export default LoadMoreButton
