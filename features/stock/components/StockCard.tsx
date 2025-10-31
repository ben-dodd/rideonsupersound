import React from 'react'
import { useRouter } from 'next/router'
import { priceCentsString } from 'lib/utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface StockCardProps {
  id: number
  title?: string
  artist?: string
  vendorName?: string
  totalSell?: number
  quantities?: {
    sold?: number
    received?: number
    inStock?: number
  }
  lastMovements?: {
    sold?: string
    received?: string
  }
  showSoldBadge?: boolean
  showReceivedBadge?: boolean
  showRank?: number
}

export const StockCard: React.FC<StockCardProps> = ({
  id,
  title,
  artist,
  vendorName,
  totalSell,
  quantities,
  lastMovements,
  showSoldBadge,
  showReceivedBadge,
  showRank,
}) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/stock/${id}`)
  }

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer p-4 border border-gray-200"
    >
      {/* Rank Badge for Best Sellers */}
      {showRank && (
        <div className="flex justify-between items-start mb-2">
          <div
            className={`
            text-2xl font-bold
            ${
              showRank === 1
                ? 'text-yellow-500'
                : showRank === 2
                ? 'text-gray-400'
                : showRank === 3
                ? 'text-amber-600'
                : 'text-gray-600'
            }
          `}
          >
            #{showRank}
          </div>
        </div>
      )}

      {/* Title & Artist */}
      <div className="mb-3">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{title || 'Untitled'}</h3>
        {artist && <p className="text-sm text-gray-600 line-clamp-1">{artist}</p>}
      </div>

      {/* Price */}
      <div className="mb-2">
        <span className="text-lg font-bold text-green-600">{priceCentsString(totalSell)}</span>
      </div>

      {/* Vendor */}
      {vendorName && (
        <div className="text-xs text-gray-500 mb-3">
          <span className="font-medium">Vendor:</span> {vendorName}
        </div>
      )}

      {/* Badges */}
      <div className="flex gap-2 flex-wrap">
        {showSoldBadge && quantities?.sold > 0 && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {quantities.sold} sold
            </span>
            {lastMovements?.sold && (
              <span className="text-xs text-gray-500">{dayjs(lastMovements.sold).fromNow()}</span>
            )}
          </div>
        )}

        {showReceivedBadge && quantities?.received > 0 && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {quantities.received} received
            </span>
            {lastMovements?.received && (
              <span className="text-xs text-gray-500">{dayjs(lastMovements.received).fromNow()}</span>
            )}
          </div>
        )}

        {quantities?.inStock > 0 && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {quantities.inStock} in stock
          </span>
        )}
      </div>
    </div>
  )
}
