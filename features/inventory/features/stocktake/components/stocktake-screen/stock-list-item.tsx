import { getItemDisplayName } from 'features/inventory/features/display-inventory/lib/functions'
import { useStockList } from 'lib/api/stock'
import { StockObject } from 'lib/types'

export default function StockListItem({ id }) {
  const { inventory } = useStockList()
  const item: StockObject = inventory?.filter((i) => i?.id === id)?.[0]

  return (
    <div className={`flex w-full relative pt mb-2`}>
      <div className="flex w-full py-2 pl-2 justify-between">
        <div className="text-sm pl-1">
          <div>{getItemDisplayName(item)}</div>
        </div>
      </div>
      <div className={`text-red-500`}>
        <div>{item?.quantity}</div>
      </div>
    </div>
  )
}
