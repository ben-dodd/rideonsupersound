import { getImageSrc, getItemSku } from 'lib/functions/displayInventory'
import React from 'react'

const ItemImage = ({ item, width = 'w-imageMed', faded = item?.quantity < 1 }) => {
  return (
    <div className={`${width}`}>
      <div className={`${width}${faded ? ' opacity-50' : ''}`}>
        <img
          className="object-cover w-full aspect-ratio-square"
          src={getImageSrc(item)}
          alt={item?.title || 'Inventory image'}
        />
        {item?.vendorId && (
          <div className="h-8 text-lg font-bold text-center bg-black text-white w-imageMed">{getItemSku(item)}</div>
        )}
      </div>
    </div>
  )
}

export default ItemImage
