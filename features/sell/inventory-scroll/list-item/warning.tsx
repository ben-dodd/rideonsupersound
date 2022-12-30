import React from 'react'

const Warning = ({ item, itemQuantity }) => {
  return (
    <div className={`${item?.needsRestock ? 'text-yellow-400' : 'text-red-400'} font-bold text-2xl`}>
      {item?.needsRestock
        ? 'PLEASE RESTOCK!'
        : itemQuantity !== undefined && itemQuantity !== null && itemQuantity < 1
        ? 'OUT OF STOCK'
        : ''}
    </div>
  )
}

export default Warning
