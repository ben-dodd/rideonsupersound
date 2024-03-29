// DB
import { getItemSkuDisplayNameById } from '@/lib/data-functions'
import { useClerks, useStockDisplayMin } from '@/lib/swr-hooks'
import { ClerkObject, StockMovementObject } from '@/lib/types'
import dayjs from 'dayjs'

type ListItemProps = {
  sm: StockMovementObject
}

export default function ListStockMovement({ sm }: ListItemProps) {
  // SWR
  const { clerks } = useClerks()
  const { stockDisplay } = useStockDisplayMin()

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
            {getItemSkuDisplayNameById(sm?.stock_id, stockDisplay)}
          </div>
        </div>
      </div>
    </div>
  )
}
