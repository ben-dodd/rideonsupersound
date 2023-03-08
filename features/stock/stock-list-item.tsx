import { getItemSkuDisplayName } from '../../lib/functions/displayInventory'
import { StockItemSearchObject } from 'lib/types/stock'
import { useRouter } from 'next/router'

export default function StockListItem({ item }: { item: StockItemSearchObject }) {
  const router = useRouter()
  return (
    <div className={`list-item-compact`} onClick={() => router.push(`/stock/${item?.id}`)}>
      <div>{getItemSkuDisplayName(item)}</div>
    </div>
  )
}
