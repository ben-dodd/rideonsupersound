import { useClerks } from 'lib/api/clerk'
import { useStockMovements } from 'lib/api/stock'
import { StockMovementObject } from 'lib/types/stock'
import ListStockMovement from './list-stock-movement'

export function StockMovementView() {
  const { clerks } = useClerks()
  const { stockMovements, isStockMovementsLoading } = useStockMovements(200)
  console.log(stockMovements)
  return isStockMovementsLoading ? (
    <div className="w-full flex h-full">
      <div className="loading-icon" />
    </div>
  ) : (
    stockMovements?.map((sm: StockMovementObject) => <ListStockMovement sm={sm} clerks={clerks} key={sm?.id} />)
  )
}
