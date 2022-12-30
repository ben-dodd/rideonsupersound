import { SaleItemObject } from 'lib/types/sale'
import ItemListItem from './item-list-item'

const SaleItems = ({ items }) => {
  return (
    <div className={`h-2/5 overflow-y-scroll`}>
      {items?.length > 0 ? (
        items?.map((saleItem: SaleItemObject) => <ItemListItem key={saleItem?.itemId} saleItem={saleItem} />)
      ) : (
        <div>No items in cart...</div>
      )}
    </div>
  )
}

export default SaleItems
