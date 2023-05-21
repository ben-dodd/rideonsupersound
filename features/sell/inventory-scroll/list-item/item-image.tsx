import { getImageSrc, getItemSku } from 'lib/functions/displayInventory'

const ItemImage = ({ item, width = 'w-imageMed', faded = item?.quantity < 1, showSku = true }) => {
  return (
    <div className={`${width}`}>
      <div className={`${width}${faded ? ' opacity-50' : ''}`}>
        <img
          className="object-cover w-full aspect-ratio-square"
          src={getImageSrc(item)}
          alt={item?.title || 'Stock image'}
        />
        {item?.vendorId && showSku && (
          <div className="h-8 text-lg font-bold text-center bg-black text-white w-imageMed">{getItemSku(item)}</div>
        )}
      </div>
    </div>
  )
}

export default ItemImage
