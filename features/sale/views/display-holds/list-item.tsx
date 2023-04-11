import { getImageSrc, getItemDisplayName, getItemSku } from 'lib/functions/displayInventory'
import { SaleItemObject, StockObject } from 'lib/types'
import { writeCartItemPriceBreakdown } from '../../sell/lib/functions'

type HoldListItemProps = {
  cartItem: SaleItemObject
}
export default function HoldListItem({ cartItem }: HoldListItemProps) {
  const { inventory } = useInventory()
  const item = inventory?.filter((i: StockObject) => i.id === cartItem?.item_id)?.[0]

  return (
    <div className="flex w-full bg-blue-100 text-black relative pt mb-2">
      <img className="w-20 h-20" src={getImageSrc(item)} alt={item?.title || 'Stock image'} />
      <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center text-sm">
        {getItemSku(item)}
      </div>
      <div className="flex flex-col w-full p-2 justify-between">
        <div className="text-sm pl-1">{getItemDisplayName(item)}</div>
        <div className="text-red-500 self-end">{writeCartItemPriceBreakdown(cartItem, item)}</div>
      </div>
    </div>
  )
}
