import Warning from './warning'
import Quantities from './quantities'
import ItemDetails from './item-details'
import Actions from './actions'
import { getItemQuantity } from 'lib/functions/sell'
import { useAppStore } from 'lib/store'
import ItemImage from './item-image'
import Title from './title'
import {
  BasicStockItemObject,
  BasicStockQuantitiesObject,
  StockItemSearchObject,
  StockPriceObject,
} from 'lib/types/stock'
import { useBasicStockItem } from 'lib/api/stock'

export default function ListItem({ searchItem }: { searchItem: StockItemSearchObject }) {
  const { cart, sellIsSearching } = useAppStore()
  const { stockItem, isStockItemLoading } = useBasicStockItem(searchItem?.id, sellIsSearching)
  const {
    item = searchItem,
    quantities = { inStock: searchItem?.quantity || 0 },
    price = {},
  }: { item: BasicStockItemObject; quantities: BasicStockQuantitiesObject; price: StockPriceObject } = stockItem || {}
  const { items = [] } = cart || {}
  const isInCart: boolean = Boolean(items?.find((cartItem) => cartItem?.itemId === item?.id))
  const itemQuantity = getItemQuantity(stockItem, cart?.items)

  return (
    <div className={`list-item bg-gray-200 pr-2 ${quantities?.inStock < 1 && 'opacity-50'}`}>
      <ItemImage item={item} />
      <div className="flex flex-col w-full px-2">
        <div className="flex justify-between border-b items-center border-gray-400">
          <Title item={item} />
          <Actions
            item={item}
            itemQuantity={itemQuantity}
            holdsQuantity={quantities?.hold}
            isItemLoading={isStockItemLoading}
          />
        </div>
        <div className="flex w-full h-full justify-between">
          <div className="flex flex-col justify-between w-full">
            <div className="flex justify-between items-end">
              <ItemDetails item={item} />
              <Warning item={item} itemQuantity={itemQuantity} isInCart={isInCart} />
            </div>
            <Quantities quantities={quantities} price={price} itemQuantity={itemQuantity} isInCart={isInCart} />
          </div>
        </div>
      </div>
    </div>
  )
}
