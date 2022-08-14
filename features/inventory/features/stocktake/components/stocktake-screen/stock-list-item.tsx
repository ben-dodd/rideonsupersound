// DB
import { getItemDisplayName } from '@features/inventory/features/display-inventory/lib/functions'
import { useInventory } from '@lib/database/read'
import { StockObject } from '@lib/types'

export default function StockListItem({ id }) {
  // SWR
  const { inventory } = useInventory()
  const item: StockObject = inventory?.filter((i) => i?.id === id)?.[0]

  // Functions

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
