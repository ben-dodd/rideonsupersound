import { getImageSrc, getItemDisplayName, getItemSku } from 'lib/functions/displayInventory'
import { useStockItem } from 'lib/api/stock'
import { HoldObject } from 'lib/types/sale'
import { writeCartItemPriceBreakdown } from 'lib/functions/sell'

export default function HoldListItem({ cartItem }: { cartItem: HoldObject }) {
  const { stockItem } = useStockItem(`${cartItem?.itemId}`)
  const { item = {} } = stockItem || {}

  return (
    <div className="flex w-full bg-black text-white mb-2">
      <div className="w-20">
        <div className="w-20 h-20 aspect-ratio-square relative">
          <img
            className="object-cover w-full h-full absolute"
            src={getImageSrc(item)}
            alt={item?.title || 'Stock image'}
          />
          {!item?.isGiftCard && !item?.isMiscItem && (
            <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center text-sm">
              {getItemSku(item)}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col w-full pt-2 px-2 justify-between">
        <div className="text-sm pl-1">{getItemDisplayName(item)}</div>
        <div className="text-red-500 self-end">{writeCartItemPriceBreakdown(cartItem, stockItem)}</div>
      </div>
    </div>
  )
}
