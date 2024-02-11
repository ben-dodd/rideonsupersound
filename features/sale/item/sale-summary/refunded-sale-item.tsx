import { getImageSrc, getItemDisplayName, getItemSku } from 'lib/functions/displayInventory'
import { SaleItemObject } from 'lib/types/sale'
import { writeCartItemPriceBreakdown } from '../../../../lib/functions/sell'
import { BasicStockObject } from 'lib/types/stock'

// Components

type SellListItemProps = {
  saleItem: SaleItemObject
  stockItem: BasicStockObject
}

export default function RefundedSaleItem({ saleItem, stockItem }: SellListItemProps) {
  const { item = {} } = stockItem || {}

  return (
    <div className={`flex w-full relative pt border-b mb-2 opacity-50`}>
      <div className="w-20">
        <div className="w-20 h-20 aspect-ratio-square relative">
          <img
            className="object-cover w-full h-full absolute"
            src={getImageSrc(item)}
            alt={item?.title || 'Stock image'}
          />
          {!item?.isGiftCard && !item?.isMiscItem && (
            <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white text-sm flex justify-center items-center">
              {getItemSku(item)}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col w-full py-2 pl-2 justify-between">
        <div className="text-sm pl-1">
          <div>{getItemDisplayName(item)}</div>
          <div className={'text-red-500'}>REFUNDED</div>
        </div>
        <div className={`text-red-500 self-end line-through`}>
          <div>{writeCartItemPriceBreakdown(saleItem, stockItem)}</div>
        </div>
      </div>
    </div>
  )
}
