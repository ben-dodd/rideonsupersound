import { getImageSrc, getItemSku } from 'lib/functions/displayInventory'
import React from 'react'

const ItemImage = ({ item }) => {
  return (
    <div className="w-imageMed">
      <div className={`w-imageMed${item?.quantity < 1 ? ' opacity-50' : ''}`}>
        <img
          className="object-cover h-imageMed w-full aspect-ratio-square"
          src={getImageSrc(item)}
          alt={item?.title || 'Inventory image'}
        />
        <div className="h-8 text-lg font-bold text-center bg-black text-white w-imageMed">
          {getItemSku(item)}
        </div>
      </div>
    </div>
  )
}

export default ItemImage
