import ItemImage from 'features/sell/inventory-scroll/list-item/item-image'
import {
  BasicStockItemObject,
  BasicStockQuantitiesObject,
  StockItemSearchObject,
  StockPriceObject,
} from 'lib/types/stock'
import { useRouter } from 'next/router'
import Title from './title'
import ItemDetails from './item-details'
import { useBasicStockItem } from 'lib/api/stock'
import Prices from './prices'

export default function StockListItem({
  stockListItem,
  stockPrice,
}: {
  stockListItem: StockItemSearchObject
  stockPrice?: StockPriceObject
}) {
  const router = useRouter()
  const { stockItem, isStockItemLoading } = useBasicStockItem(stockListItem?.id)
  const {
    item = stockListItem,
    quantities = { inStock: stockListItem?.quantity || 0 },
    price = {},
  }: { item: BasicStockItemObject; quantities: BasicStockQuantitiesObject; price: StockPriceObject } = stockItem || {}
  return (
    <div
      className={item?.id ? `list-item-click` : 'list-item-click pointer-default'}
      onClick={item?.id ? () => router.push(`/stock/${item?.id}`) : null}
    >
      <ItemImage item={item} width={'w-imageXSmall'} faded={false} showSku={false} />
      <div className="flex justify-between w-full pl-2">
        <div>
          <Title item={item} />
          <ItemDetails item={item} quantities={quantities} />
        </div>
        {(!isStockItemLoading || stockPrice) && <Prices price={stockPrice || price} />}
      </div>
    </div>
  )
}
