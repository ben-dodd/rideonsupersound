import React, { useMemo } from 'react'
import { useStockTableData } from './hooks/useStockTableData'
import { useAllStockMovements } from 'lib/api/stock'
import { BatchGroup } from './components/BatchGroup'
import Loading from 'components/placeholders/loading'
import ErrorScreen from 'components/container/error-screen'

const RecentlySold: React.FC = () => {
  const { collatedStockList, isLoading, error } = useStockTableData('list')
  const { stockMovements = [] } = useAllStockMovements()

  const groupedSales = useMemo(() => {
    if (!collatedStockList) return []

    // Get items with sold dates
    const itemsWithSoldDate = collatedStockList.filter((item) => item.lastMovements?.sold)

    // Group by sale (using saleId from stock movements)
    const groups = new Map()

    itemsWithSoldDate.forEach((item) => {
      // Find the sale movement to get sale info
      const saleMovement = stockMovements.find((sm) => sm.stockId === item.id && sm.act === 'sold')

      const saleId = saleMovement?.saleId || 'unknown'
      const clerkName = saleMovement?.clerkName || 'Unknown'
      const saleDate = item.lastMovements.sold

      // Create group key: saleId_date
      const key = `${saleId}_${saleDate}`

      if (!groups.has(key)) {
        groups.set(key, {
          saleId,
          clerkName,
          dateSold: saleDate,
          items: [],
        })
      }

      groups.get(key).items.push(item)
    })

    // Convert to array and sort by most recent first
    const saleArray = Array.from(groups.values())
      .sort((a, b) => new Date(b.dateSold).getTime() - new Date(a.dateSold).getTime())
      .slice(0, 20) // Show top 20 most recent sales

    return saleArray
  }, [collatedStockList, stockMovements])

  if (error) {
    return <ErrorScreen message="Failed to load recently sold items" />
  }

  if (isLoading) {
    return <Loading />
  }

  if (groupedSales.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No recently sold items found</p>
      </div>
    )
  }

  const totalItems = groupedSales.reduce((sum, sale) => sum + sale.items.length, 0)

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">💰 Recent Sales</h2>
        <p className="text-sm text-gray-600">
          {groupedSales.length} sales • {totalItems} items sold
        </p>
      </div>

      <div className="space-y-6">
        {groupedSales.map((sale, index) => (
          <BatchGroup
            key={`${sale.saleId}_${sale.dateSold}_${index}`}
            clerkName={sale.clerkName}
            dateReceived={sale.dateSold}
            vendorName={`Sale #${sale.saleId}`}
            items={sale.items}
            showPrice={true}
          />
        ))}
      </div>
    </div>
  )
}

export default RecentlySold
