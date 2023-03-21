import { ClerkObject } from 'lib/types'
import { StockMovementObject } from 'lib/types/stock'

type ListItemProps = {
  sm: StockMovementObject
  clerks: ClerkObject[]
}

export default function ListStockMovement({ sm, clerks }: ListItemProps) {
  return (
    <div className="flex w-full border-b border-yellow-100 py-1 font-mono text-xs text-black">
      <div className="flex flex-col sm:flex-row w-full justify-between">
        <div className="flex flex-col sm:flex-row w-full">
          <div className="font-bold pr-4 text-pink-600 w-1/6">{sm?.dateMoved}</div>
          <div className="font-bold w-16 text-blue-800 w-1/12">{'Clerk name - add to knex'}</div>
          <div className="uppercase pr-4 w-1/12">{sm?.act}</div>
          <div className="font-bold pr-4 w-1/12">{sm?.quantity} x</div>
          <div className="w-7/12">{`${sm?.stockId} Item display name - add to knex`}</div>
        </div>
      </div>
    </div>
  )
}
