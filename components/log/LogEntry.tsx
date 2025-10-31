import React from 'react'
import { useRouter } from 'next/router'

export interface LogEntryProps {
  type: 'received' | 'sold' | 'returned' | 'hold' | 'unhold' | 'lost' | 'found' | 'discarded' | 'adjustment'
  time: string
  actor: string
  action: string
  quantity: number
  item: {
    id: number
    displayName: string
    artist?: string
    title?: string
  }
  metadata?: {
    saleId?: number
    batchId?: number
    vendorName?: string
    registerName?: string
    note?: string
  }
  onClick?: () => void
}

const actionConfig = {
  received: { icon: '🟢', color: 'bg-green-100 text-green-800 border-green-300' },
  sold: { icon: '🔴', color: 'bg-red-100 text-red-800 border-red-300' },
  returned: { icon: '🟡', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  hold: { icon: '🔵', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  unhold: { icon: '🔵', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  lost: { icon: '⚫', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  found: { icon: '⚫', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  discarded: { icon: '🟠', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  adjustment: { icon: '🟣', color: 'bg-purple-100 text-purple-800 border-purple-300' },
}

export const LogEntry: React.FC<LogEntryProps> = ({ type, time, actor, action, quantity, item, metadata, onClick }) => {
  const router = useRouter()
  const config = actionConfig[type] || actionConfig.adjustment

  const handleItemClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/stock/${item.id}`)
  }

  const handleSaleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (metadata?.saleId) {
      router.push(`/sales/${metadata.saleId}`)
    }
  }

  return (
    <div
      className={`border rounded-lg p-4 mb-3 cursor-pointer transition-all hover:shadow-md ${config.color}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.icon}</span>
          <span className="font-semibold uppercase text-sm">{action}</span>
        </div>
        <span className="text-sm font-medium">{time}</span>
      </div>

      {/* Main content */}
      <div className="mb-2">
        <div className="text-sm">
          <span className="font-medium">{actor}</span>
          <span className="mx-1">•</span>
          <span>
            {quantity}x {item.displayName}
          </span>
        </div>
        {(item.artist || item.title) && (
          <div className="text-sm text-gray-600 mt-1">
            &ldquo;{item.title || item.displayName}&rdquo;{item.artist && ` - ${item.artist}`}
          </div>
        )}
      </div>

      {/* Metadata */}
      {metadata && (
        <div className="flex flex-wrap gap-2 mb-2">
          {metadata.vendorName && (
            <span className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded">Vendor: {metadata.vendorName}</span>
          )}
          {metadata.registerName && (
            <span className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded">Register: {metadata.registerName}</span>
          )}
          {metadata.note && (
            <span className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded italic">
              &ldquo;{metadata.note}&rdquo;
            </span>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleItemClick}
          className="text-xs bg-white bg-opacity-50 hover:bg-opacity-75 px-2 py-1 rounded transition-colors"
        >
          View Item →
        </button>
        {metadata?.saleId && (
          <button
            onClick={handleSaleClick}
            className="text-xs bg-white bg-opacity-50 hover:bg-opacity-75 px-2 py-1 rounded transition-colors"
          >
            View Sale →
          </button>
        )}
        {metadata?.batchId && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Could navigate to batch details if implemented
            }}
            className="text-xs bg-white bg-opacity-50 hover:bg-opacity-75 px-2 py-1 rounded transition-colors"
          >
            View Batch →
          </button>
        )}
      </div>
    </div>
  )
}
