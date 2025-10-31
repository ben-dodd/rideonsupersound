import React, { useMemo } from 'react'
import { useStockTableData } from './hooks/useStockTableData'
import { StockCard } from './components/StockCard'
import Loading from 'components/placeholders/loading'
import ErrorScreen from 'components/container/error-screen'
import { priceCentsString } from 'lib/utils'

const BestSellers: React.FC = () => {
  const { collatedStockList, isLoading, error } = useStockTableData('list')

  const bestSellers = useMemo(() => {
    if (!collatedStockList) return []

    return collatedStockList
      .filter((item) => item.quantities?.sold > 0) // Only items that have sold
      .sort((a, b) => (b.quantities?.sold || 0) - (a.quantities?.sold || 0)) // Sort by most sold
      .slice(0, 50) // Top 50
  }, [collatedStockList])

  // Calculate total revenue from best sellers
  const totalRevenue = useMemo(() => {
    return bestSellers.reduce((sum, item) => {
      return sum + (item.totalSell || 0) * (item.quantities?.sold || 0)
    }, 0)
  }, [bestSellers])

  const totalItemsSold = useMemo(() => {
    return bestSellers.reduce((sum, item) => sum + (item.quantities?.sold || 0), 0)
  }, [bestSellers])

  if (error) {
    return <ErrorScreen message="Failed to load best sellers" />
  }

  if (isLoading) {
    return <Loading />
  }

  if (bestSellers.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No sales data available</p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      {/* Summary Stats */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Best Selling Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Total Items Sold</p>
            <p className="text-2xl font-bold text-blue-900">{totalItemsSold}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-green-900">{priceCentsString(totalRevenue)}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium">Top Sellers</p>
            <p className="text-2xl font-bold text-purple-900">{bestSellers.length}</p>
          </div>
        </div>
      </div>

      {/* Best Sellers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {bestSellers.map((item, index) => (
          <StockCard
            key={item.id}
            id={item.id}
            title={item.title}
            artist={item.artist}
            vendorName={item.vendorName}
            totalSell={item.totalSell}
            quantities={item.quantities}
            lastMovements={item.lastMovements}
            showSoldBadge
            showRank={index + 1}
          />
        ))}
      </div>
    </div>
  )
}

export default BestSellers
