// DB
import {
  getImageSrc,
  getItemDisplayName,
  getItemSku,
} from 'features/inventory/features/display-inventory/lib/functions'
import { useInventory } from 'lib/database/read'
import { SaleItemObject, StockObject } from 'lib/types'
import { MouseEventHandler } from 'react'
import { writeCartItemPriceBreakdown } from '../../sell/lib/functions'

// Components

type SellListItemProps = {
  saleItem: SaleItemObject
  selected?: boolean
  onClick?: MouseEventHandler
}

export default function ItemListItem({
  saleItem,
  selected,
  onClick,
}: SellListItemProps) {
  // SWR
  const { inventory } = useInventory()
  const item = inventory?.filter(
    (i: StockObject) => i.id === saleItem?.itemId
  )?.[0]

  // Functions

  return (
    <div
      className={`flex w-full relative pt mb-2${
        saleItem?.isRefunded ? ' opacity-50' : ''
      }${onClick ? ' cursor-pointer' : ''}${selected ? ' bg-red-100' : ''}`}
      onClick={onClick || null}
    >
      <div className="w-20">
        <div className="w-20 h-20 relative">
          <img
            className="object-cover absolute"
            src={getImageSrc(item)}
            alt={item?.title || 'Inventory image'}
          />
          {!item?.is_gift_card && !item?.is_misc_item && (
            <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white text-sm flex justify-center items-center">
              {getItemSku(item)}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col w-full py-2 pl-2 justify-between">
        <div className="text-sm pl-1">
          <div>{getItemDisplayName(item)}</div>
          {saleItem?.isRefunded ? (
            <div className={'text-red-500'}>REFUNDED</div>
          ) : (
            <div />
          )}
        </div>
        <div
          className={`text-red-500 self-end${
            saleItem?.isRefunded ? ' line-through' : ''
          }`}
        >
          <div>{writeCartItemPriceBreakdown(saleItem, item)}</div>
        </div>
      </div>
    </div>
  )
}
