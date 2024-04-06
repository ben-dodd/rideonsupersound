// DB
import { getItemSkuDisplayName } from 'lib/functions/displayInventory'
import { BasicStockItemObject } from 'lib/types/stock'
import { completeRestockTask } from 'lib/functions/job'
import { useStockList } from 'lib/api/stock'

type ListItemProps = {
  item: BasicStockItemObject
}

export default function RestockJob({ item }: ListItemProps) {
  const { stockList, mutateStockList } = useStockList()

  return (
    <div className={`flex w-full border-b border-yellow-100 py-1 text-sm`}>
      <div className="flex flex-col sm:flex-row w-full justify-between">
        <div className="flex flex-col sm:flex-row w-3/5">
          <div className="mx-2">
            <input
              className="cursor-pointer"
              type="checkbox"
              onChange={() => {
                mutateStockList(
                  stockList?.map((i: BasicStockItemObject) =>
                    i?.id === item?.id ? { ...item, needsRestock: false } : i,
                  ),
                  false,
                )
                completeRestockTask(item?.id)
              }}
            />
          </div>
          <div>{getItemSkuDisplayName(item)}</div>
        </div>
      </div>
    </div>
  )
}
