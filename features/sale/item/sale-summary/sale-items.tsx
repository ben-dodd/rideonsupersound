import { SaleItemObject } from 'lib/types/sale'
import { useRouter } from 'next/router'
import EditSaleItem from './edit-sale-item'
import StaticSaleItem from './static-sale-item'
import DeletedSaleItem from './deleted-sale-item'
import RefundedSaleItem from './refunded-sale-item'

const SaleItems = ({ items, isEditable }) => {
  const router = useRouter()
  return items?.length > 0 ? (
    items?.map((saleItem: SaleItemObject) =>
      saleItem?.isDeleted ? (
        <DeletedSaleItem key={saleItem?.itemId} saleItem={saleItem} />
      ) : saleItem?.isRefunded ? (
        <RefundedSaleItem key={saleItem?.itemId} saleItem={saleItem} />
      ) : isEditable ? (
        <EditSaleItem key={saleItem?.itemId} cartItem={saleItem} />
      ) : (
        <StaticSaleItem
          key={saleItem?.itemId}
          saleItem={saleItem}
          onClick={() => router.push(`/stock/${saleItem?.itemId}`)}
        />
      ),
    )
  ) : (
    <div className="font-bold p-2 border-b bg-yellow-200">NO ITEMS IN CART...</div>
  )
}

export default SaleItems
