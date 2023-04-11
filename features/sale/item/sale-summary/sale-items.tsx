import SellListItem from 'features/sell/shopping-cart/list-item'
import { SaleItemObject } from 'lib/types/sale'
import { useRouter } from 'next/router'
import ItemListItem from './item-list-item'

const SaleItems = ({ items, isEditable }) => {
  const router = useRouter()
  return (
    <>
      {items?.length > 0 ? (
        items?.map((saleItem: SaleItemObject) =>
          isEditable ? (
            <SellListItem key={saleItem?.itemId} cartItem={saleItem} />
          ) : (
            <ItemListItem
              key={saleItem?.itemId}
              saleItem={saleItem}
              onClick={() => router.push(`/stock/${saleItem?.itemId}`)}
            />
          ),
        )
      ) : (
        <div>No items in cart...</div>
      )}
    </>
  )
}

export default SaleItems
