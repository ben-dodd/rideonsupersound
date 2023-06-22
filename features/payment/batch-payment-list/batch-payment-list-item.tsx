import { AccountBalance } from '@mui/icons-material'
import dayjs from 'dayjs'
import { dateTime } from 'lib/types/date'
import { priceCentsString } from 'lib/utils'
import { useRouter } from 'next/router'

const BatchPaymentListItem = ({ payment }) => {
  const router = useRouter()
  let categoryIcon = <AccountBalance className="text-blue-300" />
  return (
    <div className={`list-item-click text-sm`} onClick={() => router.push(`/payments/batch/${payment?.id}`)}>
      <div className="flex w-full">
        <div className="w-1/12">{categoryIcon}</div>
        <div className="w-2/12">{`000000${payment?.id}`.slice(-6)}</div>
        <div className="w-2/12">{payment?.startedByClerkName ? `Started by ${payment?.startedByClerkName}` : ''}</div>
        <div className="w-6/12">
          {payment?.dateCompleted ? dayjs(payment?.dateCompleted).format(dateTime) : 'In Progress'}
        </div>
        <div className="w-1/12 text-right">{priceCentsString(payment?.totalAmount)}</div>
      </div>
      <div />
    </div>
  )
}

export default BatchPaymentListItem
