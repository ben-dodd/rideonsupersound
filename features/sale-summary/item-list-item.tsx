import { useStockItem } from 'lib/api/stock'
import { getImageSrc, getItemDisplayName, getItemSku } from 'lib/functions/displayInventory'
import { SaleItemObject } from 'lib/types/sale'
import { MouseEventHandler } from 'react'
import { writeCartItemPriceBreakdown } from '../../lib/functions/sell'

// Components

type SellListItemProps = {
  saleItem: SaleItemObject
  selected?: boolean
  onClick?: MouseEventHandler
}

export default function ItemListItem({ saleItem, selected, onClick }: SellListItemProps) {
  const { stockItem } = useStockItem(`${saleItem?.itemId}`)
  const { item = {} } = stockItem || {}

  // TODO make image + sku a reusable component

  return (
    <div
      className={`flex w-full relative pt border-b mb-2${saleItem?.isRefunded ? ' opacity-50' : ''}${
        onClick ? ' cursor-pointer' : ''
      }${selected ? ' bg-red-100' : ''}`}
      onClick={onClick || null}
    >
      <div className="w-20">
        <div className="w-20 h-20 aspect-ratio-square relative">
          <img
            className="object-cover w-full h-full absolute"
            src={getImageSrc(item)}
            alt={item?.title || 'Inventory image'}
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
          {saleItem?.isRefunded ? <div className={'text-red-500'}>REFUNDED</div> : <div />}
        </div>
        <div className={`text-red-500 self-end${saleItem?.isRefunded ? ' line-through' : ''}`}>
          <div>{writeCartItemPriceBreakdown(saleItem, stockItem)}</div>
        </div>
      </div>
    </div>
  )
}
