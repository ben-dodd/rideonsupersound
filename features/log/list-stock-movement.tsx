import dayjs from 'dayjs'
import { StockMovementObject } from 'lib/types/stock'

export default function ListStockMovement({ sm }: { sm: StockMovementObject }) {
  return (
    <div className="flex w-full border-b border-yellow-100 py-1 font-mono text-xs text-black">
      <div className="flex flex-col sm:flex-row w-full justify-between">
        <div className="flex flex-col sm:flex-row w-full">
          <div className="font-bold pr-4 text-pink-600 w-3/12">{dayjs(sm?.dateMoved).format('YYYY-MM-DD hh:mma')}</div>
          <div className="font-bold w-16 text-blue-800 w-1/12">{sm?.clerkName}</div>
          <div className="uppercase pr-4 w-1/12">{sm?.act}</div>
          <div className="font-bold pr-4 w-1/12">{sm?.quantity} x</div>
          <div className="w-1/2">{`${sm?.itemDisplayName}`}</div>
        </div>
      </div>
    </div>
  )
}
