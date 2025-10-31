import React, { useMemo } from 'react'
import { useStockTableData } from './hooks/useStockTableData'
import { useAllStockMovements } from 'lib/api/stock'
import { BatchGroup } from './components/BatchGroup'
import Loading from 'components/placeholders/loading'
import ErrorScreen from 'components/container/error-screen'
import dayjs from 'dayjs'

const StockArrivals: React.FC = () => {
  const { collatedStockList, isLoading, error } = useStockTableData('list')
  const { stockMovements = [] } = useAllStockMovements()

  const groupedBatches = useMemo(() => {
    if (!collatedStockList) return []

    // Get items with receive dates
    const itemsWithReceiveDate = collatedStockList.filter((item) => item.lastMovements?.received)

    // Group by clerk + rounded hour + vendor
    const groups = new Map()

    itemsWithReceiveDate.forEach((item) => {
      // Find the receive movement to get clerk info
      const receiveMovement = stockMovements.find((sm) => sm.stockId === item.id && sm.act === 'received')

      // Round to nearest hour for grouping
      const hour = dayjs(item.lastMovements.received).startOf('hour').format()

      // Create group key: clerk_hour_vendor
      const clerkName = receiveMovement?.clerkName || 'Unknown'
      const key = `${clerkName}_${hour}_${item.vendorId}`

      if (!groups.has(key)) {
        groups.set(key, {
          clerkName,
          dateReceived: item.lastMovements.received,
          vendorName: item.vendorName || 'Unknown Vendor',
          vendorId: item.vendorId,
          items: [],
        })
      }

      groups.get(key).items.push(item)
    })

    // Convert to array and sort by most recent first
    const batchArray = Array.from(groups.values())
      .sort((a, b) => new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime())
      .slice(0, 20) // Show top 20 most recent batches

    return batchArray
  }, [collatedStockList, stockMovements])

  if (error) {
    return <ErrorScreen message="Failed to load stock arrivals" />
  }

  if (isLoading) {
    return <Loading />
  }

  if (groupedBatches.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No stock arrivals found</p>
      </div>
    )
  }

  const totalItems = groupedBatches.reduce((sum, batch) => sum + batch.items.length, 0)

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">📦 Recent Stock Arrivals</h2>
        <p className="text-sm text-gray-600">
          {groupedBatches.length} batches • {totalItems} items received
        </p>
      </div>

      <div className="space-y-6">
        {groupedBatches.map((batch, index) => (
          <BatchGroup
            key={`${batch.clerkName}_${batch.dateReceived}_${batch.vendorId}_${index}`}
            clerkName={batch.clerkName}
            dateReceived={batch.dateReceived}
            vendorName={batch.vendorName}
            items={batch.items}
          />
        ))}
      </div>
    </div>
  )
}

export default StockArrivals
