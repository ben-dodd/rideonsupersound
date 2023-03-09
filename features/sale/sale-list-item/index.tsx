import { SaleObject } from 'lib/types/sale'
import { useRouter } from 'next/router'

export default function SaleListItem({ sale }: { sale: SaleObject }) {
  const router = useRouter()
  return (
    <div className={`list-item-compact`} onClick={() => router.push(`/sales/${sale?.id}`)}>
      <div>{`[#${sale?.id}] ${sale?.itemList}`}</div>
      <div></div>
    </div>
  )
}
