import React from 'react'

const ItemDetails = ({ item }) => {
  return (
    <div>
      <div className="text-sm text-green-800">{`${
        item?.section ? `${item.section} / ` : ''
      }${item?.format} [${
        item?.isNew ? 'NEW' : item?.cond?.toUpperCase() || 'USED'
      }]`}</div>
      <div className="text-sm">{`Selling for ${item?.vendorName}`}</div>
    </div>
  )
}

export default ItemDetails
