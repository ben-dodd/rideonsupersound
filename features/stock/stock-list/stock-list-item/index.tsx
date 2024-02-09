import ItemImage from 'features/sell/inventory-scroll/list-item/item-image'
import { BasicStockItemObject, BasicStockObject, BasicStockQuantitiesObject, StockPriceObject } from 'lib/types/stock'
import { useRouter } from 'next/router'
import Title from './title'
import ItemDetails from './item-details'
import Prices from './prices'

export default function StockListItem({
  stockListItem,
  noClick = false,
}: {
  stockListItem: BasicStockObject
  noClick?: boolean
}) {
  const {
    item = {},
    quantities = { inStock: 0 },
    price = {},
  }: {
    item?: BasicStockItemObject
    quantities?: BasicStockQuantitiesObject
    price?: StockPriceObject
  } = stockListItem || {}
  const router = useRouter()
  return (
    <div
      className={item?.id && !noClick ? `list-item-click` : 'list-item-click pointer-default'}
      onClick={item?.id && !noClick ? () => router.push(`/stock/${item?.id}`) : null}
    >
      <ItemImage item={item} width={'w-imageXSmall'} faded={false} showSku={false} />
      <div className="flex justify-between w-full pl-2">
        <div>
          <Title item={item} />
          <ItemDetails item={item} quantities={quantities} />
        </div>
        {price && <Prices price={price} />}
      </div>
    </div>
  )
}
