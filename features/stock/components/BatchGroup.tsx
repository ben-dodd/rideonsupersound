import React from 'react'
import dayjs from 'dayjs'
import { HorizontalCardScroll } from './CardFan'

interface BatchGroupProps {
  clerkName: string
  dateReceived: string
  vendorName: string
  items: any[]
  showPrice?: boolean
}

export const BatchGroup: React.FC<BatchGroupProps> = ({
  clerkName,
  dateReceived,
  vendorName,
  items,
  showPrice = false,
}) => {
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('MMM D, YYYY h:mm A')
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📦</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">BATCH - {items.length} ITEMS</h3>
              <p className="text-sm text-gray-600">
                Received by {clerkName} • {formatDate(dateReceived)}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">{vendorName}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <HorizontalCardScroll items={items} showPrice={showPrice} />
    </div>
  )
}
