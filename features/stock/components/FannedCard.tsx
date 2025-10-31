import React from 'react'
import { useRouter } from 'next/router'
import { getImageSrc, getItemSku } from 'lib/functions/displayInventory'
import { priceCentsString } from 'lib/utils'

interface OverlappedCardProps {
  item: any
  showPrice?: boolean
}

export const OverlappedCard: React.FC<OverlappedCardProps> = ({ item, showPrice = false }) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/stock/${item.id}`)
  }

  return (
    <div
      className="flex-shrink-0 cursor-pointer transition-transform duration-200 hover:scale-105 hover:-translate-y-1"
      onClick={handleClick}
    >
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden w-32">
        {/* Image with SKU overlay */}
        <div className="relative w-32 h-32">
          <img src={getImageSrc(item)} alt={item.title || 'Stock item'} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 text-center">
            {getItemSku(item)}
          </div>
        </div>

        {/* Text content */}
        <div className="p-2">
          <div className="text-xs font-medium text-gray-900 truncate">{item.artist || 'Unknown Artist'}</div>
          <div className="text-xs text-gray-600 truncate">{item.title || 'Unknown Title'}</div>
          {showPrice && item.totalSell && (
            <div className="text-xs font-semibold text-green-600 mt-1">{priceCentsString(item.totalSell)}</div>
          )}
        </div>
      </div>
    </div>
  )
}
