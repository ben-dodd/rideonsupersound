import dayjs from 'dayjs'
import { useClerks } from 'lib/api/clerk'
import { SaleObject } from 'lib/types/sale'
import { useRouter } from 'next/router'

export default function SaleListItem({ sale }: { sale: SaleObject }) {
  const router = useRouter()
  const { clerks } = useClerks()
  const clerkName = clerks?.find((clerk) => clerk?.id === sale?.saleOpenedBy)?.name
  return (
    <div className={`list-item-compact text-sm`} onClick={() => router.push(`/sales/${sale?.id}`)}>
      <div className="w-1/12">{`[#${sale?.id}]`}</div>
      <div className="w-1/12">{`${sale?.state?.toUpperCase?.()}`}</div>
      <div className="w-1/6">{`${dayjs(sale?.dateSaleOpened).format('D MMM YYYY, H:mmA')}`}</div>
      <div className="w-1/2">{`${sale?.itemList}`}</div>
      <div className="w-1/12">{`${clerkName}`}</div>
    </div>
  )
}