import SellListItem from 'features/sell/shopping-cart/list-item'
import { SaleItemObject } from 'lib/types/sale'
import { useRouter } from 'next/router'
import ItemListItem from './item-list-item'

const SaleItems = ({ items }) => {
  const router = useRouter()
  const isSell = router.pathname.includes('/sell')
  return (
    <>
      {items?.length > 0 ? (
        items?.map((saleItem: SaleItemObject) =>
          isSell ? (
            <SellListItem key={saleItem?.itemId} cartItem={saleItem} />
          ) : (
            <ItemListItem key={saleItem?.itemId} saleItem={saleItem} />
          ),
        )
      ) : (
        <div>No items in cart...</div>
      )}
    </>
  )
}

export default SaleItems
