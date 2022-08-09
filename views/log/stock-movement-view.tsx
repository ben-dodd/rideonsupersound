import ListStockMovement from '@features/log/components/list-stock-movement'
import {
  useClerks,
  useStockDisplayMin,
  useStockMovements,
} from '@lib/database/read'
import { StockMovementObject } from '@lib/types'

export function StockMovementView() {
  const { clerks } = useClerks()
  const { stockMovements, isStockMovementsLoading } = useStockMovements(200)
  const { stockDisplay } = useStockDisplayMin()
  return isStockMovementsLoading ? (
    <div className="w-full flex h-full">
      <div className="loading-icon" />
    </div>
  ) : (
    stockMovements?.map((sm: StockMovementObject) => (
      <ListStockMovement
        sm={sm}
        clerks={clerks}
        stockDisplay={stockDisplay}
        key={sm?.id}
      />
    ))
  )
}
