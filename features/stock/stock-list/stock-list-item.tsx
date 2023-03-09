import { getItemSkuDisplayName } from '../../../lib/functions/displayInventory'
import { StockItemSearchObject } from 'lib/types/stock'
import { useRouter } from 'next/router'
import { useVendors } from 'lib/api/vendor'

export default function StockListItem({ item }: { item: StockItemSearchObject }) {
  const router = useRouter()
  const { vendors } = useVendors()
  const vendorName = vendors?.find?.((vendor) => vendor?.id === item?.vendorId)?.name
  return (
    <div className={`list-item-compact`} onClick={() => router.push(`/stock/${item?.id}`)}>
      <div>{`${getItemSkuDisplayName(item)} // Selling for ${vendorName}`}</div>
      <div></div>
    </div>
  )
}
