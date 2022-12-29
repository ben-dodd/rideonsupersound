import React from 'react'

const Title = ({ item }) => {
  return (
    <div>
      <div className="font-bold text-md">{`${
        item?.title || item?.displayAs || 'Untitled'
      }`}</div>
      <div className="text-md">{`${item?.artist || 'Untitled'}`}</div>
    </div>
  )
}

export default Title
