// DB
import { getItemSkuDisplayName } from 'features/inventory/features/display-inventory/lib/functions'
import { logRestockItem } from 'features/log/lib/functions'
import { StockObject } from 'lib/types'
import { useAtom } from 'jotai'
import { completeRestockTask } from '../lib/functions'
import { useStockList } from 'lib/api/stock'
import { useClerk } from 'lib/api/clerk'

type ListItemProps = {
  item: StockObject
}

export default function RestockJob({ item }: ListItemProps) {
  const { inventory, mutateInventory } = useStockList()
  const { clerk } = useClerk()

  return (
    <div className={`flex w-full border-b border-yellow-100 py-1 text-sm`}>
      <div className="flex flex-col sm:flex-row w-full justify-between">
        <div className="flex flex-col sm:flex-row w-3/5">
          <div className="mx-2">
            <input
              className="cursor-pointer"
              type="checkbox"
              onChange={() => {
                mutateInventory(
                  inventory?.map((i) =>
                    i?.id === item?.id ? { ...item, needsRestock: false } : i
                  ),
                  false
                )
                completeRestockTask(item?.id)
                logRestockItem(item, clerk)
              }}
            />
          </div>
          <div>{getItemSkuDisplayName(item)}</div>
        </div>
      </div>
    </div>
  )
}
