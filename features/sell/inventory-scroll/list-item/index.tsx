import Warning from './warning'
import Quantities from './quantities'
import ItemDetails from './item-details'
import Actions from './actions'
import { getItemQuantity } from 'lib/functions/sell'
import { useAppStore } from 'lib/store'
import ItemImage from './item-image'
import Title from './title'
import { BasicStockItemObject } from 'lib/types/stock'
import { useEffect, useState } from 'react'

export default function ListItem({ item }: { item: BasicStockItemObject }) {
  const {
    cart,
    sellPage: { isSearching },
  } = useAppStore()
  const { items = [] } = cart || {}
  const isInCart: boolean = Boolean(items?.find((cartItem) => cartItem?.itemId === item?.id))
  const itemQuantity = getItemQuantity(item, cart?.items)
  const [, setIsWaiting] = useState(isSearching)
  useEffect(() => setIsWaiting(isSearching), [isSearching])

  return (
    <div
      className={`list-item bg-white border pr-2 ${
        item?.quantity < 1 && !(item?.quantityLayby > 0 || item?.quantityHold > 0) && 'opacity-50'
      }`}
    >
      <ItemImage item={item} />
      <div className="flex flex-col w-full px-2">
        <div className="flex justify-between border-b items-center border-gray-400">
          <Title item={item} />
          <Actions item={item} itemQuantity={itemQuantity} />
        </div>
        <div className="flex w-full h-full justify-between">
          <div className="flex flex-col justify-between w-full">
            <div className="flex justify-between items-end">
              <ItemDetails item={item} />
              <Warning item={item} isInCart={isInCart} itemQuantity={itemQuantity} />
            </div>
            <Quantities item={item} isInCart={isInCart} itemQuantity={itemQuantity} />
          </div>
        </div>
      </div>
    </div>
  )
}
