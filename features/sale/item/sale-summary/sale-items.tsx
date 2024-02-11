import { SaleItemObject } from 'lib/types/sale'
import { useRouter } from 'next/router'
import EditSaleItem from './edit-sale-item'
import StaticSaleItem from './static-sale-item'
import DeletedSaleItem from './deleted-sale-item'
import RefundedSaleItem from './refunded-sale-item'
import { useStockItemList } from 'lib/api/stock'
import Loading from 'components/placeholders/loading'

const SaleItems = ({ items, isEditable }) => {
  const router = useRouter()
  const { stockItemList = [], isStockItemListLoading = true } = useStockItemList(items?.map((item) => item?.itemId))
  return isStockItemListLoading ? (
    <Loading />
  ) : items?.length > 0 ? (
    items?.map((saleItem: SaleItemObject, i) => {
      const stockItem = stockItemList?.find((stockItem) => stockItem?.item?.id === saleItem?.itemId)
      return saleItem?.isDeleted ? (
        <DeletedSaleItem key={saleItem?.itemId} saleItem={saleItem} stockItem={stockItem} />
      ) : saleItem?.isRefunded ? (
        <RefundedSaleItem key={saleItem?.itemId} saleItem={saleItem} stockItem={stockItem} />
      ) : isEditable ? (
        <EditSaleItem key={saleItem?.itemId} cartItem={saleItem} stockItem={stockItem} />
      ) : (
        <StaticSaleItem
          key={saleItem?.itemId}
          saleItem={saleItem}
          stockItem={stockItem}
          onClick={() => router.push(`/stock/${saleItem?.itemId}`)}
        />
      )
    })
  ) : (
    <div className="font-bold p-2 border-b bg-yellow-200">NO ITEMS IN CART...</div>
  )
}

export default SaleItems
