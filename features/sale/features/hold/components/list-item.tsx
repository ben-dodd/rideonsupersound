import {
  getImageSrc,
  getItemDisplayName,
  getItemSku,
} from 'features/inventory/features/display-inventory/lib/functions'
import { useStockItem } from 'lib/api/stock'
import { SaleItemObject } from 'lib/types'
import { writeCartItemPriceBreakdown } from '../../sell/lib/functions'

type HoldListItemProps = {
  cartItem: SaleItemObject
}
export default function HoldListItem({ cartItem }: HoldListItemProps) {
  const { stockItem } = useStockItem(`${cartItem?.itemId}`)

  return (
    <div className="flex w-full bg-blue-100 text-black relative pt mb-2">
      <img
        className="w-20 h-20"
        src={getImageSrc(stockItem)}
        alt={stockItem?.title || 'Inventory image'}
      />
      <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center text-sm">
        {getItemSku(stockItem)}
      </div>
      <div className="flex flex-col w-full p-2 justify-between">
        <div className="text-sm pl-1">{getItemDisplayName(stockItem)}</div>
        <div className="text-red-500 self-end">
          {writeCartItemPriceBreakdown(cartItem, stockItem)}
        </div>
      </div>
    </div>
  )
}
