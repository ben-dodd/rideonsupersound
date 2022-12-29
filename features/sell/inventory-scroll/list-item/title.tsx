import React from 'react'

const Title = ({ item }) => {
  return (
    <div>
      <div className="font-bold text-md">{`${
        item?.displayAs || item?.title || 'Untitled'
      }`}</div>
      <div className="text-md">{`${item?.artist || ''}`}</div>
    </div>
  )
}

export default Title
