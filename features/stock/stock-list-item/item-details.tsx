import { useVendorNames } from 'lib/api/vendor'
import { getItemQuantity } from 'lib/functions/sell'
import { useAppStore } from 'lib/store'

const ItemDetails = ({ item, quantities }) => {
  const { vendorNames = [] } = useVendorNames()
  const vendorName = vendorNames?.find((vendor) => vendor?.id === item?.vendorId)?.name || '...'
  const { cart } = useAppStore()
  const { items = [] } = cart || {}
  const isInCart: boolean = Boolean(items?.find((cartItem) => cartItem?.itemId === item?.id))
  const itemQuantity = getItemQuantity({ item, quantities }, cart?.items)
  return (
    <div className="flex text-sm">
      <div>{`${item?.section ? `${item.section} / ` : ''}${item?.format ? `${item.format} ` : ''}[${
        item?.isNew ? 'NEW' : item?.cond?.toUpperCase() || 'USED'
      }]`}</div>
      <div className="px-4">{vendorName ? `Selling for ${vendorName}` : ''}</div>
      <div className={`${itemQuantity < 1 && 'text-red-500'}`}>
        {quantities?.receiving
          ? `Receiving ${quantities?.receiving} item${quantities?.receiving === 1 ? '' : 's'}`
          : item?.id
          ? `${itemQuantity}${isInCart ? ' left' : ''} in stock${
              quantities?.hold > 0 ? `, ${quantities?.hold} on hold` : ''
            }${quantities?.layby > 0 ? `, ${quantities?.layby} on layby` : ''}`
          : 'New item'}
      </div>
    </div>
  )
}

export default ItemDetails
