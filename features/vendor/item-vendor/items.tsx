import StockItem from 'features/web-vendor/stock-item'

export default function VendorItems({ items }) {
  return (
    <div>
      <div>
        <div className="text-sm font-bold px-1 border-b  mt-8 mb-2">IN STOCK</div>
        <div>
          {items
            ?.filter((stockItem) => stockItem?.quantities?.inStock > 0)
            ?.map((stockItem) => (
              <StockItem key={stockItem?.item?.id} stockItem={stockItem} size={'sm'} />
            ))}
        </div>
      </div>
      <div>
        <div>
          <div className="text-sm font-bold px-1 border-b mt-8 mb-2">OUT OF STOCK</div>
          {items
            ?.filter((stockItem) => (stockItem?.quantities?.inStock || 0) <= 0)
            ?.map((stockItem) => (
              <StockItem key={stockItem?.item?.id} stockItem={stockItem} size={'sm'} />
            ))}
        </div>
      </div>
    </div>
  )
}
