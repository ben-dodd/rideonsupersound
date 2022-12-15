import RestockTask from 'features/job/components/restock-job'
import { useStockList } from 'lib/api/stock'
import { StockObject } from 'lib/types'

export default function RestockTaskView() {
  const { inventory, isInventoryLoading } = useStockList()
  return isInventoryLoading ? (
    <div className="w-full flex h-full">
      <div className="loading-icon" />
    </div>
  ) : (
    inventory
      ?.filter((item: StockObject) => item?.needsRestock)
      .map((item: StockObject) => <RestockTask item={item} key={item?.id} />)
  )
}
