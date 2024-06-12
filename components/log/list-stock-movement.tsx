// DB
import { loadedItemIdAtom, pageAtom } from '@/lib/atoms'
import { getItemSkuDisplayNameById } from '@/lib/data-functions'
import { useClerks, useStockDisplayMin } from '@/lib/swr-hooks'
import { ClerkObject, StockMovementObject } from '@/lib/types'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import InventoryItemScreen from '../inventory/inventory-item-screen'

type ListItemProps = {
  sm: StockMovementObject
}

export default function ListStockMovement({ sm }: ListItemProps) {
  // SWR
  const { clerks } = useClerks()
  const { stockDisplay } = useStockDisplayMin()
  const [loadedItemId, setLoadedItemId] = useAtom(loadedItemIdAtom)
  const [page, setPage] = useAtom(pageAtom)

  return (
    <div className="flex w-full border-b border-yellow-100 py-1 font-mono text-xs text-black">
      <div className="flex flex-col sm:flex-row w-full justify-between">
        <div className="flex flex-col sm:flex-row w-full">
          <div className="font-bold pr-4 text-pink-600 w-1/6">
            {dayjs(sm?.date_moved)?.format('D MMMM YYYY, h:mma')}
          </div>
          <div className="font-bold w-16 text-blue-800 w-1/12">
            {
              clerks?.filter((c: ClerkObject) => c?.id === sm?.clerk_id)[0]
                ?.name
            }
          </div>
          <div className="uppercase pr-4 w-1/12">{sm?.act}</div>
          <div className="font-bold pr-4 w-1/12">{sm?.quantity} x</div>
          <div className="w-7/12">
            <span
              className="cursor-pointer underline"
              onClick={() => {
                setLoadedItemId({
                  ...loadedItemId,
                  inventory: sm?.stock_id,
                })
                setPage('inventory')
              }}
            >
              {getItemSkuDisplayNameById(sm?.stock_id, stockDisplay)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
