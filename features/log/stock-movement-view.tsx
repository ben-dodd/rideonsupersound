import LoadMoreButton from 'components/button/load-more-button'
import { useStockMovements } from 'lib/api/stock'
import { StockMovementObject } from 'lib/types/stock'
import { useState } from 'react'
import ListStockMovement from './list-stock-movement'

export function StockMovementView() {
  const [limit, setLimit] = useState(50)
  const { stockMovements, isStockMovementsLoading } = useStockMovements(limit)
  return isStockMovementsLoading ? (
    <div className="w-full flex h-full">
      <div className="loading-icon" />
    </div>
  ) : (
    <div className="px-2">
      {stockMovements?.map((sm: StockMovementObject) => (
        <ListStockMovement sm={sm} key={sm?.id} />
      ))}
      <LoadMoreButton onClick={() => setLimit((limit) => limit + 50)} />
    </div>
  )
}
