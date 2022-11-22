import RestockTask from 'features/job/components/restock-job'
import { useInventory } from 'lib/database/read'
import { StockObject } from 'lib/types'

export default function RestockTaskView() {
  const { inventory, isInventoryLoading } = useInventory()
  return isInventoryLoading ? (
    <div className="w-full flex h-full">
      <div className="loading-icon" />
    </div>
  ) : (
    inventory
      ?.filter((item: StockObject) => item?.needs_restock)
      .map((item: StockObject) => <RestockTask item={item} key={item?.id} />)
  )
}
