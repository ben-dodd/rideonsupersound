import { getItemSkuDisplayName } from 'lib/functions/displayInventory'
import { StockItemObject } from 'lib/types/stock'

export default function VendorItems({ items }) {
  return (
    <div className="flex">
      <div>
        {items?.map((item: StockItemObject) => (
          <div key={item?.id}>{getItemSkuDisplayName(item)}</div>
          // <StockItem key={item?.id} item={item} />
        ))}
      </div>
      {/* <div className="w-1/2 pl-2">
        <div className="text-sm font-bold px-1 border-b mb-2">OUT OF STOCK</div>
        {items
          ?.filter((item: StockObject) => (item?.quantity || 0) <= 0)
          ?.map((item: StockObject) => (

          ))}
      </div> */}
    </div>
  )
}
